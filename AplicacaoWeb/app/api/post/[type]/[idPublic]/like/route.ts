import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { getAuthUserId } from '@/src/utils/auth';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ type: string; idPublic: string }> },
) {
    try {
        const { type, idPublic } = await params;
        const userId = await getAuthUserId();

        if (!userId) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        let model: any;
        let userLikedField = '';

        if (type === 'rules' || type === 'regra') {
            model = prisma.rule;
            userLikedField = 'likedRuleIds';
        } else if (type === 'ai' || type === 'ia') {
            model = prisma.aIPost;
            userLikedField = 'likedAIPostIds';
        } else {
            model = prisma.question;
            userLikedField = 'likedQuestionIds';
        }

        const post = await model.findUnique({
            where: { idPublic },
            select: { id: true, likedByIds: true },
        });

        if (!post) {
            return NextResponse.json({ error: 'Postagem não encontrada' }, { status: 404 });
        }

        const hasLiked = post.likedByIds.includes(userId);

        if (hasLiked) {
            await model.update({
                where: { idPublic },
                data: {
                    likedByIds: { set: post.likedByIds.filter((id: string) => id !== userId) },
                    likeCount: { decrement: 1 },
                },
            });

            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { [userLikedField]: true },
            });

            await prisma.user.update({
                where: { id: userId },
                data: {
                    [userLikedField]: {
                        set: ((user as any)?.[userLikedField] || []).filter(
                            (id: string) => id !== post.id,
                        ),
                    },
                },
            });
        } else {
            await model.update({
                where: { idPublic },
                data: {
                    likedByIds: { push: userId },
                    likeCount: { increment: 1 },
                },
            });

            await prisma.user.update({
                where: { id: userId },
                data: {
                    [userLikedField]: {
                        push: post.id,
                    },
                },
            });
        }

        return NextResponse.json({ success: true, isLiked: !hasLiked });
    } catch (error) {
        console.error('Erro ao processar like:', error);
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
}
