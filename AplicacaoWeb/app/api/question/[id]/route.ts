import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { readdir, unlink } from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const duvida = await prisma.question.findUnique({
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

        const duvidaAtualizada = await prisma.question.update({
            where: { idPublic: id },
            data: {
                name: body.title,
                game: body.game,
                description: body.description,
            },
        });

        const uploadDir = path.join(process.cwd(), 'public', 'upload', 'questions', id);
        try {
            const files = await readdir(uploadDir);
            for (const file of files) {
                if (!body.description.includes(file)) {
                    await unlink(path.join(uploadDir, file));
                }
            }
        } catch (e) {}

        return NextResponse.json(duvidaAtualizada);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao atualizar dúvida' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.question.update({
            where: { idPublic: id },
            data: { isDisabled: true },
        });
        return NextResponse.json({ message: 'Dúvida excluída com sucesso.' });
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao excluir dúvida' }, { status: 500 });
    }
}
