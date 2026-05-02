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

        if (followedIds.length === 0) {
            return NextResponse.json([]);
        }

        const takeCount = limit + offset;

        const [rules, questions] = await Promise.all([
            prisma.rule.findMany({
                where: {
                    userId: { in: followedIds },
                    status: { not: 'CLONADO' },
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
                        select: { comments: true },
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
                        select: { comments: true },
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

        const combined = [...regrasFormatadas, ...duvidasFormatadas].sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        const paginatedFeed = combined.slice(offset, offset + limit);

        return NextResponse.json(paginatedFeed);
    } catch (error) {
        console.error('Erro ao buscar feed:', error);
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}
