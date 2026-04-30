import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { getServerSession } from '@/src/utils/auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const body = await req.json();
        const content = body.text || body.texto;

        const comentario = await prisma.comment.findUnique({ where: { id } });

        if (!comentario || comentario.authorId !== session.user.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
        }

        const atualizado = await prisma.comment.update({
            where: { id },
            data: {
                text: content,
                isEdited: true,
            },
        });

        return NextResponse.json(atualizado);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const session = await getServerSession();

        if (!session?.user?.id)
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

        const comentario = await prisma.comment.findUnique({ where: { id } });

        if (!comentario || comentario.authorId !== session.user.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
        }

        await prisma.comment.delete({ where: { id } });

        return NextResponse.json({ message: 'Excluído com sucesso' });
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao excluir' }, { status: 500 });
    }
}
