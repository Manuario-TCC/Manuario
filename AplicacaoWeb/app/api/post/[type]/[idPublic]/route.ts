import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ type: string; idPublic: string }> },
) {
    const { type, idPublic } = await params;

    try {
        let post = null;

        if (type === 'question' || type === 'duvida') {
            post = await prisma.question.findFirst({
                where: {
                    idPublic: idPublic,
                    isDisabled: false,
                },
                include: { user: true },
            });
        } else if (type === 'rule' || type === 'regra' || type === 'rules') {
            post = await prisma.rule.findFirst({
                where: {
                    idPublic: idPublic,
                    isDisabled: false,
                },
                include: {
                    user: true,
                    manuals: true,
                },
            });
        } else if (type === 'ia') {
            post = await prisma.aIPost.findUnique({
                where: {
                    idPublic: idPublic,
                },
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
