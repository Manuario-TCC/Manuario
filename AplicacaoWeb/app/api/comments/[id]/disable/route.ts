import { NextResponse } from 'next/server';
import { getServerSession } from '@/src/utils/auth';
import { prisma } from '@/src/database/prisma';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const body = await request.json();
        const { reason } = body;

        if (!reason || reason.trim().length < 5) {
            return NextResponse.json(
                { error: 'Motivo detalhado é obrigatório (mínimo de 5 caracteres)' },
                { status: 400 },
            );
        }

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
                authorId: true,
                author: { select: { idPublic: true } },
                text: true,
                rule: { select: { idPublic: true } },
                question: { select: { idPublic: true } },
                aiPost: { select: { idPublic: true } },
            },
        });

        if (!comment) {
            return NextResponse.json({ error: 'Comentário não encontrado.' }, { status: 404 });
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
            postType = 'ia';
            postIdPublic = comment.aiPost.idPublic;
        }

        const snippet =
            comment.text.length > 60 ? comment.text.substring(0, 60) + '...' : comment.text;

        const postLink = postIdPublic ? `/post/${postType}/${postIdPublic}` : null;

        const [updatedComment, log, notification] = await prisma.$transaction([
            prisma.comment.update({
                where: { id: targetCommentId },
                data: { isDisabled: true },
            }),
            prisma.adminLog.create({
                data: {
                    action: 'DISABLE_COMMENT',
                    reason: reason,
                    targetId: targetCommentId,
                    adminId: currentUserId,
                },
            }),
            prisma.notification.create({
                data: {
                    userId: comment.authorId,
                    type: 'DELETE',
                    reason: reason,
                    targetName: snippet,
                    link: postLink,
                    isRead: false,
                },
            }),
        ]);

        return NextResponse.json({
            success: true,
            notification: {
                ...notification,
                receiverIdPublic: comment.author?.idPublic,
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao desabilitar comentário' }, { status: 500 });
    }
}
