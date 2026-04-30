import { NextResponse } from 'next/server';
import { getServerSession } from '@/src/utils/auth';
import { prisma } from '@/src/database/prisma';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const targetUserId = resolvedParams.id;

        const session = await getServerSession();
        const currentUserId = session?.user?.id;

        if (!currentUserId) {
            return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
        }

        const currentUserDb = await prisma.user.findUnique({
            where: { id: currentUserId },
            select: { isSuperAdmin: true },
        });

        if (!currentUserDb?.isSuperAdmin) {
            return NextResponse.json(
                { error: 'Acesso Negado! Apenas SuperADMs.' },
                { status: 403 },
            );
        }

        const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });

        if (!targetUser) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: targetUserId },
            data: { isAdmin: !targetUser.isAdmin },
        });

        return NextResponse.json({ success: true, isAdmin: updatedUser.isAdmin });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
}
