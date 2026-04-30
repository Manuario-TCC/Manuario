import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { getServerSession } from '@/src/utils/auth';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: commentId } = await params;

        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const userId = session.user.id;

        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
            select: { likedByIds: true },
        });

        if (!comment) {
            return NextResponse.json({ error: 'Comentário não encontrado' }, { status: 404 });
        }

        const hasLiked = comment.likedByIds.includes(userId);

        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: {
                likedBy: hasLiked ? { disconnect: { id: userId } } : { connect: { id: userId } },
                likeCount: hasLiked ? { decrement: 1 } : { increment: 1 },
            },
        });

        return NextResponse.json(updatedComment);
    } catch (error) {
        console.error('Erro na rota de like:', error);
        return NextResponse.json({ error: 'Erro ao processar curtida' }, { status: 500 });
    }
}
