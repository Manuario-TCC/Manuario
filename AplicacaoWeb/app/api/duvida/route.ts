import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { publicationId, title, game, description, userId } = body;

        const novaDuvida = await prisma.duvida.create({
            data: {
                idPublic: publicationId,
                name: title,
                game: game,
                description: description,
                user: {
                    connect: { idPublico: userId },
                },
            },
        });

        return NextResponse.json(novaDuvida, { status: 201 });
    } catch (error: any) {
        console.error('Erro Prisma:', error);
        return NextResponse.json({ error: 'Erro ao salvar no banco' }, { status: 500 });
    }
}
