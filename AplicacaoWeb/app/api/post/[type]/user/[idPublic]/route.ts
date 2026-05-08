import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { getAuthUserId } from '@/src/utils/auth';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ type: string; idPublic: string }> },
) {
    const { type, idPublic } = await params;
    const { searchParams } = new URL(req.url);

    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    try {
        const currentUserId = await getAuthUserId();
        let rawItems = [];
        let totalItems = 0;

        const baseWhereCondition = {
            user: { idPublic },
            isDisabled: false,
        };

        if (type === 'questions') {
            rawItems = await prisma.question.findMany({
                where: baseWhereCondition,
                orderBy: { createdAt: 'desc' },
                skip: offset,
                take: limit,
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
                },
            });
            totalItems = await prisma.question.count({ where: baseWhereCondition });
        } else if (type === 'rules') {
            const ruleWhere = { ...baseWhereCondition, status: 'PUBLICADO' };
            rawItems = await prisma.rule.findMany({
                where: ruleWhere,
                orderBy: { createdAt: 'desc' },
                skip: offset,
                take: limit,
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
                },
            });
            totalItems = await prisma.rule.count({ where: ruleWhere });
        } else if (type === 'ai') {
            rawItems = await prisma.aIPost.findMany({
                where: baseWhereCondition,
                orderBy: { createdAt: 'desc' },
                skip: offset,
                take: limit,
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
            });
            totalItems = await prisma.aIPost.count({ where: baseWhereCondition });
        }

        const items = rawItems.map((item: any) => ({
            ...item,
            type,
            hasLiked:
                currentUserId && item.likedByIds ? item.likedByIds.includes(currentUserId) : false,
            commentCount: item._count?.comments || 0,
        }));

        return NextResponse.json({
            items,
            nextOffset: offset + items.length < totalItems ? offset + limit : null,
        });
    } catch (error) {
        console.error('Erro ao buscar posts do usuário:', error);
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}
