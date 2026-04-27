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

        const regras = await prisma.regra.findMany({
            where: {
                manuais: {
                    some: {
                        idPublic: manualIdPublic,
                    },
                },
                name: {
                    contains: search,
                    mode: 'insensitive',
                },
            },
            select: {
                idPublic: true,
                name: true,
                description: true,
                userId: true,
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
        });

        const total = await prisma.regra.count({
            where: {
                manuais: {
                    some: {
                        idPublic: manualIdPublic,
                    },
                },
                name: { contains: search, mode: 'insensitive' },
            },
        });

        return NextResponse.json(
            { regras, total, hasMore: skip + regras.length < total },
            { status: 200 },
        );
    } catch (error) {
        console.error('Erro ao buscar regras:', error);
        return NextResponse.json({ error: 'Erro ao buscar as regras do manual' }, { status: 500 });
    }
}
