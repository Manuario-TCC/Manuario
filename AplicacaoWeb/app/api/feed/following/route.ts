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

        // Busca regras e duvidas
        const takeCount = limit + offset;

        const [rules, questions] = await Promise.all([
            prisma.rule.findMany({
                where: {
                    userId: { in: followedIds },
                    status: { not: 'CLONADO' },
                },
                include: {
                    user: { select: { name: true, img: true, idPublic: true } },
                    manuals: true,
                },
                orderBy: { createdAt: 'desc' },
                take: takeCount,
            }),

            prisma.question.findMany({
                where: { userId: { in: followedIds } },
                include: { user: { select: { name: true, img: true, idPublic: true } } },
                orderBy: { createdAt: 'desc' },
                take: takeCount,
            }),
        ]);

        // Formata
        const regrasFormatadas = rules.map((r) => ({ ...r, type: 'regra' }));
        const duvidasFormatadas = questions.map((d) => ({ ...d, type: 'duvida' }));

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
