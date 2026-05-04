import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { getAuthUserId, getServerSession } from '@/src/utils/auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ type: string; idPublic: string }> },
) {
    try {
        const { type, idPublic } = await params;
        const userId = await getAuthUserId();

        const isRule = type === 'rules' || type === 'regra' || type === 'rule';
        const model = isRule ? prisma.rule : prisma.question;

        const post = await (model as any).findUnique({
            where: {
                idPublic,
                isDisabled: false,
                ...(isRule ? { status: 'PUBLICADO' } : {}),
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
            return NextResponse.json(
                { error: 'Postagem não encontrada ou privada' },
                { status: 404 },
            );
        }

        const formattedPost = {
            ...post,
            type,
            hasLiked: userId && post.likedByIds ? post.likedByIds.includes(userId) : false,
        };

        return NextResponse.json(formattedPost);
    } catch (error) {
        console.error('Erro ao buscar postagem:', error);
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ type: string; idPublic: string }> },
) {
    try {
        const { type, idPublic } = await params;
        const session = await getServerSession();

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const isRule = type === 'rules' || type === 'regra' || type === 'rule';
        const model = isRule ? prisma.rule : prisma.question;

        await (model as any).update({
            where: { idPublic },
            data: { isDisabled: true },
        });

        return NextResponse.json({ message: 'Postagem excluída com sucesso.' });
    } catch (error) {
        console.error('Erro ao excluir postagem:', error);
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
}
