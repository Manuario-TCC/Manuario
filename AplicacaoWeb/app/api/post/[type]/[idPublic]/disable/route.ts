import { NextResponse } from 'next/server';
import { getServerSession } from '@/src/utils/auth';
import { prisma } from '@/src/database/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ type: string; idPublic: string }> },
) {
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
        const { type, idPublic } = resolvedParams;

        let postToDisable: any = null;

        if (type === 'rules') {
            postToDisable = await prisma.rule.findUnique({
                where: { idPublic },
                select: {
                    id: true,
                    name: true,
                    userId: true,
                    user: {
                        select: {
                            idPublic: true,
                        },
                    },
                },
            });
        } else if (type === 'questions') {
            postToDisable = await prisma.question.findUnique({
                where: { idPublic },
                select: {
                    id: true,
                    name: true,
                    userId: true,
                    user: {
                        select: {
                            idPublic: true,
                        },
                    },
                },
            });
        }

        if (!postToDisable) {
            return NextResponse.json({ error: 'Publicação não encontrada.' }, { status: 404 });
        }

        const postTitle = postToDisable.name;

        let notificationRecord = null;

        await prisma.$transaction(async (tx) => {
            if (type === 'rules') {
                await tx.rule.update({
                    where: { id: postToDisable.id },
                    data: { isDisabled: true },
                });
            } else if (type === 'questions') {
                await tx.question.update({
                    where: { id: postToDisable.id },
                    data: { isDisabled: true },
                });
            }

            await tx.adminLog.create({
                data: {
                    action: `DISABLE_POST_${type.toUpperCase()}`,
                    reason: reason,
                    targetId: postToDisable.id,
                    adminId: currentUserId,
                },
            });

            notificationRecord = await tx.notification.create({
                data: {
                    userId: postToDisable.userId,
                    type: 'DELETE',
                    reason: reason,
                    targetName: postTitle,
                    senderName: type === 'rules' ? 'Regra' : 'Dúvida',
                    link: null,
                    isRead: false,
                },
            });
        });

        return NextResponse.json({
            success: true,
            notification: {
                ...notificationRecord,
                receiverIdPublic: postToDisable.user?.idPublic,
            },
        });
    } catch (error) {
        console.error('Erro na rota central de disable:', error);
        return NextResponse.json({ error: 'Erro ao desabilitar publicação' }, { status: 500 });
    }
}
