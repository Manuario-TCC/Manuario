import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { getAuthUserId } from '@/src/utils/auth';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const gameName = searchParams.get('gameName');
    const currentId = searchParams.get('currentId');

    if (!type || !gameName) {
        return NextResponse.json({ error: 'Parâmetros ausentes' }, { status: 400 });
    }

    try {
        const loggedUserId = await getAuthUserId();

        const baseSelect = {
            id: true,
            idPublic: true,
            name: true,
            createdAt: true,
            likeCount: true,
            user: {
                select: {
                    name: true,
                    img: true,
                    idPublic: true,
                },
            },
            _count: {
                select: { comments: true },
            },
        };

        let recommendations = [];

        if (type === 'rules') {
            recommendations = await prisma.rule.findMany({
                where: {
                    manuals: {
                        some: {
                            game: gameName,
                        },
                    },
                    idPublic: {
                        not: currentId || undefined,
                    },
                    userId: loggedUserId ? { not: loggedUserId } : undefined,
                    isDisabled: false,
                },
                select: {
                    ...baseSelect,
                    manuals: {
                        select: { idPublic: true, imgLogo: true },
                        take: 1,
                    },
                },
                take: 30,
                orderBy: { createdAt: 'desc' },
            });
        } else if (type === 'questions') {
            recommendations = await prisma.question.findMany({
                where: {
                    game: gameName,
                    idPublic: { not: currentId || undefined },
                    userId: loggedUserId ? { not: loggedUserId } : undefined,
                    isDisabled: false,
                },
                select: baseSelect,
                take: 30,
                orderBy: { createdAt: 'desc' },
            });
        }

        const now = new Date().getTime();

        const scoredRecommendations = recommendations.map((item) => {
            const itemDate = new Date(item.createdAt).getTime();
            const daysOld = (now - itemDate) / (1000 * 60 * 60 * 24);
            const score = (item.likeCount || 0) - daysOld * 0.1;

            return {
                ...item,
                _score: score,
                commentCount: item._count?.comments || 0,
            };
        });

        scoredRecommendations.sort((a, b) => b._score - a._score);

        const topCandidates = scoredRecommendations.slice(0, 15);

        const finalRecommendations = topCandidates
            .sort(() => 0.5 - Math.random())
            .slice(0, 8)
            .map(({ _score, _count, ...rest }) => rest);

        return NextResponse.json(finalRecommendations);
    } catch (error) {
        console.error('Erro ao buscar recomendações:', error);
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}
