import { NextResponse } from 'next/server';
import { getServerSession } from '@/src/utils/auth';
import { prisma } from '@/src/database/prisma';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession();
        const currentUserId = session?.user?.id;

        if (!currentUserId) {
            return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
        }

        const currentUserDb = await prisma.user.findUnique({
            where: { id: currentUserId },
            select: { isSuperAdmin: true, isAdmin: true },
        });

        if (!currentUserDb || (!currentUserDb.isAdmin && !currentUserDb.isSuperAdmin)) {
            return NextResponse.json({ error: 'Acesso Negado.' }, { status: 403 });
        }

        const resolvedParams = await params;
        const targetCommentId = resolvedParams.id;

        const comment = await prisma.comment.findUnique({
            where: { id: targetCommentId },
            select: {
                isValidated: true,
                authorId: true,
                text: true,
                author: { select: { idPublic: true } },
                rule: { select: { idPublic: true } },
                question: { select: { idPublic: true } },
                aiPost: { select: { idPublic: true } },
            },
        });

        if (!comment) {
            return NextResponse.json({ error: 'Comentário não encontrado' }, { status: 404 });
        }

        let postType = '';
        let postIdPublic = '';

        if (comment.rule?.idPublic) {
            postType = 'rules';
            postIdPublic = comment.rule.idPublic;
        } else if (comment.question?.idPublic) {
            postType = 'questions';
            postIdPublic = comment.question.idPublic;
        } else if (comment.aiPost?.idPublic) {
            postType = 'ai';
            postIdPublic = comment.aiPost.idPublic;
        }

        const snippet =
            comment.text.length > 60 ? comment.text.substring(0, 60) + '...' : comment.text;

        const postLink = postIdPublic ? `/post/${postType}/${postIdPublic}` : null;

        const isApplyingBadge = !comment.isValidated;

        const transactionOperations: any[] = [
            prisma.comment.update({
                where: { id: targetCommentId },
                data: { isValidated: isApplyingBadge },
            }),
            prisma.adminLog.create({
                data: {
                    action: isApplyingBadge ? 'VALIDATE_COMMENT' : 'UNVALIDATE_COMMENT',
                    reason: isApplyingBadge
                        ? 'Selo de qualidade aplicado'
                        : 'Selo de qualidade removido',
                    targetId: targetCommentId,
                    adminId: currentUserId,
                },
            }),
        ];

        if (isApplyingBadge) {
            transactionOperations.push(
                prisma.notification.create({
                    data: {
                        userId: comment.authorId,
                        type: 'BADGE',
                        targetName: snippet,
                        link: postLink,
                        isRead: false,
                    },
                }),
            );
        }

        const results = await prisma.$transaction(transactionOperations);
        const updatedComment = results[0];
        const notification = isApplyingBadge ? results[2] : null;

        return NextResponse.json(
            {
                success: true,
                comment: updatedComment,
                notification: notification
                    ? {
                          ...notification,
                          receiverIdPublic: comment.author?.idPublic,
                      }
                    : null,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao validar comentário' }, { status: 500 });
    }
}
