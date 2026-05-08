import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { getAuthUserId, getServerSession } from '@/src/utils/auth';

const modelMap: Record<string, any> = {
    rules: prisma.rule,
    ai: prisma.aIPost,
    questions: prisma.question,
};

export async function GET(
    request: Request,
    { params }: { params: Promise<{ type: string; idPublic: string }> },
) {
    try {
        const { type, idPublic } = await params;
        const userId = await getAuthUserId();

        const model = modelMap[type];
        if (!model) {
            return NextResponse.json({ error: 'Tipo de postagem inválido' }, { status: 400 });
        }

        const isRule = type === 'rules';

        const post = await model.findUnique({
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
                _count: {
                    select: {
                        comments: {
                            where: { isDisabled: false },
                        },
                    },
                },
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
            commentCount: post._count?.comments || 0,
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

        const model = modelMap[type];
        if (!model) return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 });

        await model.update({
            where: { idPublic },
            data: { isDisabled: true },
        });

        return NextResponse.json({ message: 'Postagem excluída com sucesso.' });
    } catch (error) {
        console.error('Erro ao excluir postagem:', error);
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
}
