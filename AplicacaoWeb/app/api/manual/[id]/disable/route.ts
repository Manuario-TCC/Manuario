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
        const manualIdPublic = resolvedParams.id;

        const manualToDisable = await prisma.manual.findUnique({
            where: { idPublic: manualIdPublic },
            select: { id: true, name: true, userId: true, user: { select: { idPublic: true } } },
        });

        if (!manualToDisable) {
            return NextResponse.json({ error: 'Manual não encontrado.' }, { status: 404 });
        }

        let notificationRecord = null;

        await prisma.$transaction(async (tx) => {
            await tx.manual.update({
                where: { id: manualToDisable.id },
                data: { isDisabled: true },
            });

            await tx.rule.updateMany({
                where: { manualIds: { has: manualToDisable.id } },
                data: { isDisabled: true },
            });

            // Salva o Log
            await tx.adminLog.create({
                data: {
                    action: 'DISABLE_MANUAL',
                    reason: reason,
                    targetId: manualToDisable.id,
                    adminId: currentUserId,
                },
            });

            // Notificacao
            notificationRecord = await tx.notification.create({
                data: {
                    userId: manualToDisable.userId,
                    type: 'DELETE',
                    reason: reason,
                    targetName: manualToDisable.name,
                    senderName: 'Manual',
                    link: null,
                    isRead: false,
                },
            });
        });

        return NextResponse.json({
            success: true,
            notification: {
                ...notificationRecord,
                receiverIdPublic: manualToDisable.user?.idPublic,
            },
        });
    } catch (error) {
        console.error('Erro na rota disable de manual:', error);
        return NextResponse.json({ error: 'Erro ao desabilitar manual' }, { status: 500 });
    }
}
