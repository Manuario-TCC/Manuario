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

        const isRule = type === 'rules';
        const model = isRule ? prisma.rule : prisma.question;

        const post = await (model as any).findUnique({
            where: { idPublic },
            select: { id: true, likedByIds: true },
        });

        if (!post) {
            return NextResponse.json({ error: 'Postagem não encontrada' }, { status: 404 });
        }

        const hasLiked = post.likedByIds.includes(userId);

        if (hasLiked) {
            await (model as any).update({
                where: { idPublic },
                data: {
                    likedByIds: { set: post.likedByIds.filter((id: string) => id !== userId) },
                    likeCount: { decrement: 1 },
                },
            });

            await prisma.user.update({
                where: { id: userId },
                data: {
                    [isRule ? 'likedRuleIds' : 'likedQuestionIds']: {
                        set: (
                            (await prisma.user.findUnique({
                                where: { id: userId },
                                select: { [isRule ? 'likedRuleIds' : 'likedQuestionIds']: true },
                            })) as any
                        )?.[isRule ? 'likedRuleIds' : 'likedQuestionIds'].filter(
                            (id: string) => id !== post.id,
                        ),
                    },
                },
            });
        } else {
            await (model as any).update({
                where: { idPublic },
                data: {
                    likedByIds: { push: userId },
                    likeCount: { increment: 1 },
                },
            });

            await prisma.user.update({
                where: { id: userId },
                data: {
                    [isRule ? 'likedRuleIds' : 'likedQuestionIds']: {
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
