import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const type = searchParams.get('type') || 'manual';

    if (!q) return NextResponse.json([]);

    try {
        let results = [];

        if (type === 'manual') {
            results = await prisma.manual.findMany({
                where: {
                    name: {
                        contains: q,
                        mode: 'insensitive',
                    },
                },
                take: 5,
                select: {
                    idPublic: true,
                    name: true,
                    imgLogo: true,
                    game: true,
                },
            });
        } else if (type === 'regras') {
            results = await prisma.rule.findMany({
                where: {
                    name: {
                        contains: q,
                        mode: 'insensitive',
                    },
                },
                take: 5,
                include: {
                    manuals: true,
                    user: true,
                },
            });
        } else if (type === 'pessoas') {
            results = await prisma.user.findMany({
                where: {
                    name: {
                        contains: q,
                        mode: 'insensitive',
                    },
                },
                take: 5,
                select: {
                    idPublic: true,
                    name: true,
                    img: true,
                },
            });
        }

        return NextResponse.json(results);
    } catch (error) {
        console.error('Erro na busca:', error);
        return NextResponse.json({ error: 'Erro ao buscar' }, { status: 500 });
    }
}
