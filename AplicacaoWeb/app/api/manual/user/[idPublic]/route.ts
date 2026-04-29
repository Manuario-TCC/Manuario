import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ idPublic: string }> }) {
    const { idPublic } = await params;
    const { searchParams } = new URL(req.url);

    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    try {
        const whereCondition = {
            user: {
                idPublic: idPublic,
            },
            isDisabled: false,
        };

        const items = await prisma.manual.findMany({
            where: whereCondition,
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limit,
        });

        const totalItems = await prisma.manual.count({ where: whereCondition });
        const nextOffset = offset + items.length < totalItems ? offset + limit : null;

        return NextResponse.json({ items, nextOffset });
    } catch (error) {
        console.error('Erro ao buscar manuais do usuário:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
