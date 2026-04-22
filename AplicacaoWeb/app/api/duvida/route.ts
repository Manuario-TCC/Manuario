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

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = parseInt(searchParams.get('offset') || '0');

        const duvidas = await prisma.duvida.findMany({
            take: limit,
            skip: offset,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        idPublico: true,
                        name: true,
                        img: true,
                    },
                },
            },
        });

        return NextResponse.json(duvidas);
    } catch (error) {
        console.error('Erro ao buscar dúvidas pro feed:', error);
        return NextResponse.json({ error: 'Erro ao carregar o feed.' }, { status: 500 });
    }
}
