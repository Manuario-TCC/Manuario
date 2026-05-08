import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { getAuthUserId } from '@/src/utils/auth';

export async function GET(req: Request) {
    try {
        const userId = await getAuthUserId();
        if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const gameName = searchParams.get('gameName');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = parseInt(searchParams.get('offset') || '0');

        if (!gameName) {
            const groups = await prisma.savedSnippet.groupBy({
                by: ['gameName'],
                where: { userId },
                _count: { id: true },
            });

            return NextResponse.json(
                groups.map((g) => ({
                    name: g.gameName || 'Geral',
                    count: g._count.id,
                })),
            );
        }

        const snippets = await prisma.savedSnippet.findMany({
            where: {
                userId,
                gameName: gameName === 'Geral' ? null : gameName,
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });

        return NextResponse.json(snippets);
    } catch (error) {
        console.error('Erro ao buscar salvos:', error);
        return NextResponse.json({ error: 'Erro ao buscar salvos' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const userId = await getAuthUserId();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id || !userId) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });

        await prisma.savedSnippet.delete({
            where: { id, userId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao deletar' }, { status: 500 });
    }
}
