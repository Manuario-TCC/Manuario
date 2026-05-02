import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { getAuthUserId } from '@/src/utils/auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ type: string; idPublic: string }> },
) {
    try {
        const { type, idPublic } = await params;

        const userId = await getAuthUserId();

        const isRule = ['regra', 'rule', 'rules'].includes(type.toLowerCase());
        const isQuestion = ['duvida', 'question', 'questions'].includes(type.toLowerCase());

        const model = isRule ? prisma.rule : isQuestion ? prisma.question : null;

        if (!model) {
            return NextResponse.json({ error: 'Tipo de postagem inválido' }, { status: 400 });
        }

        const post = await (model as any).findUnique({
            where: {
                idPublic,
                isDisabled: false,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        img: true,
                        idPublic: true,
                        isAdmin: true,
                        isSuperAdmin: true,
                    },
                },
                ...(isRule ? { manuals: true } : {}),
            },
        });

        if (!post) {
            return NextResponse.json({ error: 'Postagem não encontrada' }, { status: 404 });
        }

        const formattedPost = {
            ...post,
            type: isRule ? 'regra' : 'duvida',
            hasLiked: userId && post.likedByIds ? post.likedByIds.includes(userId) : false,
        };

        return NextResponse.json(formattedPost);
    } catch (error) {
        console.error('Erro ao buscar postagem:', error);
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
}
