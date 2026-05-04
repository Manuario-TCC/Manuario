import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const manualIdPublic = resolvedParams.id;

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const manual = await prisma.manual.findUnique({
            where: {
                idPublic: manualIdPublic,
                isDisabled: false,
            },
            select: { id: true },
        });

        if (!manual) {
            return NextResponse.json({ error: 'Manual não encontrado' }, { status: 404 });
        }

        const whereClause = {
            manualIds: { has: manual.id },
            isDisabled: false,
            name: {
                contains: search,
                mode: 'insensitive' as const,
            },
        };

        const rules = await prisma.rule.findMany({
            where: whereClause,
            select: {
                id: true,
                idPublic: true,
                name: true,
                description: true,
                userId: true,
                status: true,
                user: {
                    select: { idPublic: true },
                },
                originManualId: true,
                createdAt: true,
                updatedAt: true,
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        const total = await prisma.rule.count({ where: whereClause });

        return NextResponse.json(
            { rules, total, hasMore: skip + rules.length < total },
            { status: 200 },
        );
    } catch (error) {
        console.error('Erro ao buscar regras:', error);
        return NextResponse.json({ error: 'Erro ao buscar as regras do manual' }, { status: 500 });
    }
}
