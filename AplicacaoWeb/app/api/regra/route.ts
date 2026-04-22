import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { publicationId, name, description, manualId, isHouseRule, userId, status } = body;

        const novaRegra = await prisma.regra.create({
            data: {
                idPublic: publicationId,
                name: name,
                description: description,
                isHouseRule: isHouseRule,
                status: status,
                user: {
                    connect: { idPublico: userId },
                },
                manual: {
                    connect: { id: manualId },
                },
            },
        });

        return NextResponse.json(novaRegra, { status: 201 });
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

        const regras = await prisma.regra.findMany({
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
                manual: {
                    select: {
                        idPublic: true,
                        imgLogo: true,
                        game: true,
                        user: {
                            select: {
                                idPublico: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json(regras);
    } catch (error) {
        console.error('Erro ao buscar regras pro feed:', error);
        return NextResponse.json({ error: 'Erro ao carregar o feed.' }, { status: 500 });
    }
}
