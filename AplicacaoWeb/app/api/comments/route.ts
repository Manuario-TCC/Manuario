import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { getServerSession } from '@/src/utils/auth';

export async function GET(req: Request) {
    try {
        const session = await getServerSession();
        const currentUserId = session?.user?.id;

        const { searchParams } = new URL(req.url);
        const postId = searchParams.get('postId');
        const postType = searchParams.get('postType');

        if (!postId) {
            return NextResponse.json({ error: 'PostId não fornecido' }, { status: 400 });
        }

        if (postType !== 'rules' && postType !== 'questions') {
            return NextResponse.json({ error: 'Tipo de post inválido' }, { status: 400 });
        }

        const where: any = { parentId: null };

        if (postType === 'rules') {
            where.ruleId = postId;
        } else if (postType === 'questions') {
            where.questionId = postId;
        }

        const comments = await prisma.comment.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: {
                        id: true,
                        idPublic: true,
                        name: true,
                        img: true,
                        isAdmin: true,
                        isSuperAdmin: true,
                    },
                },
                replies: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                idPublic: true,
                                name: true,
                                img: true,
                                isAdmin: true,
                                isSuperAdmin: true,
                            },
                        },
                        replies: {
                            include: {
                                author: {
                                    select: {
                                        id: true,
                                        idPublic: true,
                                        name: true,
                                        img: true,
                                        isAdmin: true,
                                        isSuperAdmin: true,
                                    },
                                },
                            },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        const formatCommentsWithLikes = (commentList: any[]) => {
            return commentList.map((comment) => ({
                ...comment,
                isLiked:
                    currentUserId && Array.isArray(comment.likedByIds)
                        ? comment.likedByIds.includes(currentUserId)
                        : false,
                replies: comment.replies ? formatCommentsWithLikes(comment.replies) : [],
            }));
        };

        const formattedComments = formatCommentsWithLikes(comments);

        return NextResponse.json(formattedComments);
    } catch (error) {
        console.error('Erro ao buscar comentários:', error);
        return NextResponse.json({ error: 'Erro ao buscar comentários' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession();

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const { texto, text, postId, postType, parentId } = await req.json();

        const data: any = {
            text: text || texto,
            authorId: session.user.id,
            parentId: parentId || null,
        };

        if (postType === 'rules') data.ruleId = postId;
        else if (postType === 'questions') data.questionId = postId;

        const novoComentario = await prisma.comment.create({ data });

        let newNotification = null;

        if (parentId) {
            const parentComment = await prisma.comment.findUnique({
                where: { id: parentId },
                select: {
                    authorId: true,
                    author: {
                        select: { idPublic: true },
                    },
                },
            });

            if (parentComment && parentComment.authorId !== session.user.id) {
                const currentUser = await prisma.user.findUnique({
                    where: { id: session.user.id },
                    select: { name: true },
                });

                let postLink = '';
                if (postType === 'rules') {
                    const postInfo = await prisma.rule.findUnique({
                        where: {
                            id: postId,
                        },
                        select: { idPublic: true },
                    });
                    if (postInfo) {
                        postLink = `/post/rules/${postInfo.idPublic}`;
                    }
                } else if (postType === 'questions') {
                    const postInfo = await prisma.question.findUnique({
                        where: { id: postId },
                        select: { idPublic: true },
                    });

                    if (postInfo) {
                        postLink = `/post/questions/${postInfo.idPublic}`;
                    }
                }

                newNotification = await prisma.notification.create({
                    data: {
                        userId: parentComment.authorId,
                        type: 'REPLY',
                        senderId: session.user.id,
                        senderName: currentUser?.name || 'Anônimo',
                        link: postLink,
                    },
                });

                (newNotification as any).receiverIdPublic = parentComment.author.idPublic;
            }
        }

        return NextResponse.json(
            { ...novoComentario, isLiked: false, notification: newNotification },
            { status: 201 },
        );
    } catch (error) {
        console.error('Erro ao postar:', error);
        return NextResponse.json({ error: 'Erro ao postar' }, { status: 500 });
    }
}
