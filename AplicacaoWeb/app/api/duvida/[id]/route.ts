import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const duvida = await prisma.duvida.findUnique({
            where: { idPublic: id },
            include: { user: true },
        });

        if (!duvida) {
            return NextResponse.json({ error: 'Dúvida não encontrada' }, { status: 404 });
        }

        return NextResponse.json(duvida);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar dúvida' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();

        const duvidaAtualizada = await prisma.duvida.update({
            where: { idPublic: id },
            data: {
                name: body.title,
                game: body.game,
                description: body.description,
            },
        });

        return NextResponse.json(duvidaAtualizada);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao atualizar dúvida' }, { status: 500 });
    }
}
