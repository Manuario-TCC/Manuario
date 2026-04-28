import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const regra = await prisma.regra.findUnique({
            where: { idPublic: id },
            include: {
                user: { select: { idPublico: true } },
            },
        });

        if (!regra) {
            return NextResponse.json({ error: 'Regra não encontrada' }, { status: 404 });
        }

        return NextResponse.json(regra);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar regra' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();

        const regraAtualizada = await prisma.regra.update({
            where: { idPublic: id },
            data: {
                name: body.name || body.title,
                description: body.description,
                manualIds: body.manualId ? [body.manualId] : undefined,
                isHouseRule: body.isHouseRule,
                status: body.status,
            },
        });

        return NextResponse.json(regraAtualizada);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao atualizar regra' }, { status: 500 });
    }
}
