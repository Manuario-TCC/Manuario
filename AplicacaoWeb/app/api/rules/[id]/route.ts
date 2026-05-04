import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { readdir, unlink } from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const regra = await prisma.rule.findUnique({
            where: { idPublic: id },
            include: {
                user: { select: { idPublic: true } },
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

        const regraAtualizada = await prisma.rule.update({
            where: { idPublic: id },
            data: {
                name: body.name || body.title,
                description: body.description,
                manualIds: body.manualId ? [body.manualId] : undefined,
                isHouseRule: body.isHouseRule,
                status: body.status,
            },
        });

        const uploadDir = path.join(process.cwd(), 'public', 'upload', 'rules', id);
        try {
            const files = await readdir(uploadDir);
            for (const file of files) {
                if (!body.description.includes(file)) {
                    await unlink(path.join(uploadDir, file));
                }
            }
        } catch (e) {}

        return NextResponse.json(regraAtualizada);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao atualizar regra' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        await prisma.rule.update({
            where: { idPublic: id },
            data: { isDisabled: true },
        });
        return NextResponse.json({ message: 'Regra excluída com sucesso.' });
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao excluir regra' }, { status: 500 });
    }
}
