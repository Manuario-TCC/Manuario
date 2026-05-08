import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { getAuthUserId } from '@/src/utils/auth';

export async function POST(req: Request) {
    try {
        const userId = await getAuthUserId();

        if (!userId) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const { promptUser, aiResponse, gameName } = await req.json();

        if (!promptUser || !aiResponse) {
            return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
        }

        const snippet = await prisma.savedSnippet.create({
            data: {
                promptUser,
                aiResponse,
                gameName,
                userId,
            },
        });

        return NextResponse.json(snippet, { status: 201 });
    } catch (error) {
        console.error('Erro ao salvar snippet:', error);
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
}
