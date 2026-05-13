import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { getAuthUserId } from '@/src/utils/auth';

export async function GET(request: NextRequest) {
    try {
        const userId = await getAuthUserId();

        if (!userId) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const searchParams = request.nextUrl.searchParams;
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = parseInt(searchParams.get('offset') || '0');

        const following = await prisma.follow.findMany({
            where: { followerId: userId },
            select: { followedId: true },
        });

        const followedIds = following.map((f) => f.followedId);
        followedIds.push(userId);

        const takeCount = limit + offset;

        const [rules, questions, aiPosts] = await Promise.all([
            prisma.rule.findMany({
                where: {
                    userId: { in: followedIds },
                    status: 'PUBLICADO',
                    isDisabled: false,
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            img: true,
                            idPublic: true,
                            isAdmin: true,
                            isSuperAdmin: true,
                        },
                    },
                    manuals: true,
                    _count: {
                        select: {
                            comments: {
                                where: {
                                    isDisabled: false,
                                },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: takeCount,
            }),

            prisma.question.findMany({
                where: {
                    userId: { in: followedIds },
                    isDisabled: false,
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            img: true,
                            idPublic: true,
                            isAdmin: true,
                            isSuperAdmin: true,
                        },
                    },
                    _count: {
                        select: {
                            comments: {
                                where: {
                                    isDisabled: false,
                                },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: takeCount,
            }),

            prisma.aIPost.findMany({
                where: {
                    userId: { in: followedIds },
                    isDisabled: false,
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            img: true,
                            idPublic: true,
                            isAdmin: true,
                            isSuperAdmin: true,
                        },
                    },
                    _count: {
                        select: {
                            comments: {
                                where: { isDisabled: false },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: takeCount,
            }),
        ]);

        const regrasFormatadas = rules.map((r) => ({
            ...r,
            type: 'regra',
            hasLiked: r.likedByIds ? r.likedByIds.includes(userId) : false,
            commentCount: r._count?.comments || 0,
        }));

        const duvidasFormatadas = questions.map((d) => ({
            ...d,
            type: 'duvida',
            hasLiked: d.likedByIds ? d.likedByIds.includes(userId) : false,
            commentCount: d._count?.comments || 0,
        }));

        const aiFormatadas = aiPosts.map((ai) => ({
            ...ai,
            type: 'ai',
            hasLiked: ai.likedByIds ? ai.likedByIds.includes(userId) : false,
            commentCount: ai._count?.comments || 0,
        }));

        const combined = [...regrasFormatadas, ...duvidasFormatadas, ...aiFormatadas].sort(
            (a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            },
        );

        let isRecommendation = false;
        let paginatedFeed = combined.slice(offset, offset + limit);

        // Se nao houver nenhum post traz 10 com recomendacao
        if (combined.length === 0 && offset === 0) {
            isRecommendation = true;

            const [globalRules, globalQuestions, globalAiPosts] = await Promise.all([
                prisma.rule.findMany({
                    where: { status: 'PUBLICADO', isDisabled: false },
                    include: {
                        user: {
                            select: {
                                name: true,
                                img: true,
                                idPublic: true,
                                isAdmin: true,
                                isSuperAdmin: true,
                            },
                        },
                        manuals: true,
                        _count: { select: { comments: { where: { isDisabled: false } } } },
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                }),

                prisma.question.findMany({
                    where: { isDisabled: false },
                    include: {
                        user: {
                            select: {
                                name: true,
                                img: true,
                                idPublic: true,
                                isAdmin: true,
                                isSuperAdmin: true,
                            },
                        },
                        _count: { select: { comments: { where: { isDisabled: false } } } },
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                }),

                prisma.aIPost.findMany({
                    where: { isDisabled: false },
                    include: {
                        user: {
                            select: {
                                name: true,
                                img: true,
                                idPublic: true,
                                isAdmin: true,
                                isSuperAdmin: true,
                            },
                        },
                        _count: { select: { comments: { where: { isDisabled: false } } } },
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                }),
            ]);

            const gRegras = globalRules.map((r) => ({
                ...r,
                type: 'regra',
                hasLiked: r.likedByIds ? r.likedByIds.includes(userId) : false,
                commentCount: r._count?.comments || 0,
            }));

            const gDuvidas = globalQuestions.map((d) => ({
                ...d,
                type: 'duvida',
                hasLiked: d.likedByIds ? d.likedByIds.includes(userId) : false,
                commentCount: d._count?.comments || 0,
            }));

            const gAi = globalAiPosts.map((ai) => ({
                ...ai,
                type: 'ai',
                hasLiked: ai.likedByIds ? ai.likedByIds.includes(userId) : false,
                commentCount: ai._count?.comments || 0,
            }));

            const globalCombined = [...gRegras, ...gDuvidas, ...gAi].sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            );

            paginatedFeed = globalCombined.slice(0, 10);
        } else if (combined.length === 0) {
            paginatedFeed = [];
        }

        return NextResponse.json({ posts: paginatedFeed, isRecommendation });
    } catch (error) {
        console.error('Erro ao buscar feed:', error);
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}
