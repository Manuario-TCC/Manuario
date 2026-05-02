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
            user: {
                idPublic: idPublic,
            },
            isDisabled: false,
        };

        if (type === 'duvida') {
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
        } else if (type === 'regra') {
            const regraWhereCondition = {
                ...baseWhereCondition,
                status: {
                    not: 'CLONADO',
                },
                isDisabled: false,
            };

            rawItems = await prisma.rule.findMany({
                where: regraWhereCondition,
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

            totalItems = await prisma.rule.count({ where: regraWhereCondition });
        } else if (type === 'ia') {
            rawItems = [];
            totalItems = 0;
        } else {
            return NextResponse.json({ error: 'Tipo de postagem inválido' }, { status: 400 });
        }

        const items = rawItems.map((item: any) => ({
            ...item,
            type: type === 'regra' ? 'regra' : 'duvida',
            hasLiked:
                currentUserId && item.likedByIds ? item.likedByIds.includes(currentUserId) : false,
        }));

        const nextOffset = offset + items.length < totalItems ? offset + limit : null;

        return NextResponse.json({
            items,
            nextOffset,
        });
    } catch (error) {
        console.error('Erro ao buscar posts do usuário:', error);
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}
