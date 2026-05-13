import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { getServerSession } from '@/src/utils/auth';

function stripMarkdownForAI(markdown: string): string {
    if (!markdown) return '';
    return markdown
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/[*_~`#>-]/g, '')
        .trim();
}

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
            include: {
                question: true,
                parent: true,
                replyToComment: {
                    include: { author: true },
                },
                replyToUser: true,
            },
        });

        if (
            !hasLiked &&
            updatedComment.likeCount >= 10 &&
            updatedComment.likeCount % 10 === 0 &&
            updatedComment.question
        ) {
            (async () => {
                try {
                    const question = updatedComment.question;
                    const plainTextDescription = stripMarkdownForAI(question.description || '');

                    const validationPayload = {
                        name: question.name,
                        description: plainTextDescription,
                        text: updatedComment.text,
                        parentText: updatedComment.parent ? updatedComment.parent.text : null,
                        tipo: 'DUVIDA',
                    };

                    const validationResponse = await fetch(
                        process.env.N8N_WEBHOOK_URL_VALIDATION || '',
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(validationPayload),
                        },
                    );

                    if (!validationResponse.ok) return;

                    const validationResult = await validationResponse.json();

                    if (validationResult.valid === true || validationResult === true) {
                        const savePayload = {
                            comentarios: {
                                text: updatedComment.text,
                                authorId: updatedComment.authorId,
                                likeCount: updatedComment.likeCount,

                                parentText: updatedComment.parent
                                    ? updatedComment.parent.text
                                    : null,

                                replyToText: updatedComment.replyToComment
                                    ? updatedComment.replyToComment.text
                                    : null,
                                replyToUserName: updatedComment.replyToUser
                                    ? updatedComment.replyToUser.name
                                    : null,
                            },
                            post: {
                                idPublic: question.idPublic,
                                name: question.name,
                                game: question.game || '',
                                description: plainTextDescription,
                            },
                            tipo: 'DUVIDA',
                        };

                        await fetch(process.env.N8N_WEBHOOK_URL_REGRAS || '', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(savePayload),
                        });
                    }
                } catch (err) {
                    console.error('Erro na integração N8N:', err);
                }
            })();
        }

        return NextResponse.json(updatedComment);
    } catch (error) {
        console.error('Erro na rota de like:', error);
        return NextResponse.json({ error: 'Erro ao processar curtida' }, { status: 500 });
    }
}
