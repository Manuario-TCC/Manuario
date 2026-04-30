import { NextResponse } from 'next/server';
import { getServerSession } from '@/src/utils/auth';
import { prisma } from '@/src/database/prisma';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const body = await request.json();
        const { reason } = body;

        const session = await getServerSession();
        const currentUserId = session?.user?.id;

        if (!currentUserId) {
            return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
        }

        // Busca os privilegios
        const currentUserDb = await prisma.user.findUnique({
            where: { id: currentUserId },
            select: { isSuperAdmin: true, isAdmin: true },
        });

        if (!currentUserDb?.isSuperAdmin) {
            return NextResponse.json({ error: 'Acesso Negado.' }, { status: 403 });
        }

        const resolvedParams = await params;
        const targetUserId = resolvedParams.id;

        // Atualiza o usuario
        await prisma.user.update({
            where: { id: targetUserId },
            data: { isDisabled: true },
        });

        // Salva o Log
        await prisma.adminLog.create({
            data: {
                action: 'DISABLE_USER',
                reason: reason,
                targetId: targetUserId,
                adminId: currentUserId,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao desabilitar usuário' }, { status: 500 });
    }
}
