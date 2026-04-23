import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { getServerSession } from '@/src/utils/auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const session = await getServerSession();
        if (!session?.user?.id)
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

        const { texto } = await req.json();

        const comentario = await prisma.comentario.findUnique({ where: { id } });

        if (!comentario || comentario.autorId !== session.user.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
        }

        const atualizado = await prisma.comentario.update({
            where: { id },
            data: { texto },
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

        const comentario = await prisma.comentario.findUnique({ where: { id } });

        if (!comentario || comentario.autorId !== session.user.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 403 });
        }

        await prisma.comentario.delete({ where: { id } });

        return NextResponse.json({ message: 'Excluído com sucesso' });
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao excluir' }, { status: 500 });
    }
}
