import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { getAuthUserId } from '@/src/utils/auth';

export async function PATCH(request: Request) {
    try {
        const userId = await getAuthUserId();

        if (!userId) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const body = await request.json();

        if (!body.name || body.name.trim() === '') {
            return NextResponse.json({ error: 'Nome inválido' }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: userId },
            data: { name: body.name },
        });

        return NextResponse.json({ success: true, name: body.name });
    } catch (error) {
        console.error('Erro ao atualizar nome:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
