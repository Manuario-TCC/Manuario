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

        await prisma.$transaction([
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
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao desabilitar comentário' }, { status: 500 });
    }
}
