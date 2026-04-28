import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ tipo: string; idPublico: string }> },
) {
    const { tipo, idPublico } = await params;

    try {
        let post = null;

        const whereCondition = { idPublic: idPublico };

        if (tipo === 'duvida') {
            post = await prisma.duvida.findUnique({
                where: whereCondition,
                include: { user: true },
            });
        } else if (tipo === 'regra') {
            post = await prisma.regra.findUnique({
                where: whereCondition,
                include: {
                    user: true,
                    manuais: true,
                },
            });
        } else if (tipo === 'ia') {
            post = await prisma.postIA.findUnique({
                where: whereCondition,
                include: { user: true },
            });
        }

        if (!post) {
            return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (error) {
        console.error('Erro ao buscar post:', error);
        return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
    }
}
