import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';

export const revalidate = 0;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const type = searchParams.get('type') || 'manual';

    const playTime = searchParams.get('playTime');
    const players = searchParams.get('players');
    const manualType = searchParams.get('manualType');
    const edition = searchParams.get('edition');
    const genre = searchParams.get('genre');
    const ageRange = searchParams.get('ageRange');
    const system = searchParams.get('system');

    try {
        let results = [];

        if (type === 'manual') {
            const whereClause: any = {
                isDisabled: false,
            };

            if (q) {
                whereClause.name = {
                    contains: q,
                    mode: 'insensitive',
                };
            }

            if (playTime) {
                whereClause.playTime = { lte: parseInt(playTime) };
            }
            if (players) {
                const p = parseInt(players);
                whereClause.minPlayers = { lte: p };
                whereClause.maxPlayers = { gte: p };
            }
            if (manualType) {
                whereClause.type = { contains: manualType, mode: 'insensitive' };
            }

            if (edition) {
                whereClause.edition = { contains: edition, mode: 'insensitive' };
            }

            if (genre) {
                whereClause.genre = { contains: genre, mode: 'insensitive' };
            }

            if (ageRange) {
                whereClause.ageRange = ageRange;
            }

            if (system) {
                whereClause.system = { contains: system, mode: 'insensitive' };
            }

            results = await prisma.manual.findMany({
                where: whereClause,
                take: 10,
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
                    status: {
                        not: 'CLONADO',
                    },
                    isDisabled: false,
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
                    isDisabled: false,
                },
                take: 5,
                select: {
                    idPublic: true,
                    name: true,
                    img: true,
                    isAdmin: true,
                    isSuperAdmin: true,
                    isBot: true,
                },
            });
        }

        return NextResponse.json(results);
    } catch (error) {
        console.error('Erro na busca:', error);
        return NextResponse.json({ error: 'Erro ao buscar' }, { status: 500 });
    }
}
