import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { getServerSession } from '@/src/utils/auth';

export async function GET() {
    try {
        const session = await getServerSession();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 });
        }

        const manuals = await prisma.manual.findMany({
            where: {
                userId: session.user.id,
                isDisabled: false,
            },
            select: { id: true, name: true },
        });

        return NextResponse.json(manuals);
    } catch (error) {
        console.error('Erro ao buscar manuais:', error);
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
}
