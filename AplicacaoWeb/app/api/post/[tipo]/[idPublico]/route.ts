import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ tipo: string; idPublico: string }> },
) {
    const { tipo, idPublico } = await params;

    try {
        let post = null;

        if (tipo === 'duvida') {
            post = await prisma.duvida.findUnique({
                where: { idPublic: idPublico },
                include: { user: true },
            });
        } else if (tipo === 'regra') {
            post = await prisma.regra.findUnique({
                where: { idPublic: idPublico },
                include: { user: true, manual: true },
            });
        }

        if (!post) {
            return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error('Erro ao buscar post:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
