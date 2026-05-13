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

        const cursor = searchParams.get('cursor');
        const limit = parseInt(searchParams.get('limit') || '10');

        if (!postId) {
            return NextResponse.json({ error: 'PostId não fornecido' }, { status: 400 });
        }

        const where: any = {
            parentId: null,
            isDisabled: false,
        };

        if (postType === 'rules') {
            where.ruleId = postId;
        } else if (postType === 'questions') {
            where.questionId = postId;
        } else if (postType === 'ai') {
            where.aiPostId = postId;
        }

        const comments = await prisma.comment.findMany({
            where,
            take: limit + 1,
            cursor: cursor ? { id: cursor } : undefined,
            skip: cursor ? 1 : 0,
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
                replyToUser: {
                    select: { id: true, idPublic: true, name: true },
                },
                replies: {
                    where: { isDisabled: false },
                    take: 3,
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
                        replyToUser: {
                            select: { id: true, idPublic: true, name: true },
                        },
                        replies: {
                            where: { isDisabled: false },
                            take: 3,
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
                                replyToUser: {
                                    select: { id: true, idPublic: true, name: true },
                                },
                            },
                            orderBy: { createdAt: 'asc' },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        let nextCursor: string | null = null;

        if (comments.length > limit) {
            const nextItem = comments.pop();
            nextCursor = nextItem!.id;
        }

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

        return NextResponse.json({
            comments: formattedComments,
            nextCursor,
        });
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

        const { text, postId, postType, parentId, replyToCommentId, replyToUserId } =
            await req.json();

        const data: any = {
            text: text,
            authorId: session.user.id,
            parentId: parentId || null,
            replyToCommentId: replyToCommentId || null,
            replyToUserId: replyToUserId || null,
        };

        if (postType === 'rules') {
            data.ruleId = postId;
        } else if (postType === 'questions') {
            data.questionId = postId;
        } else if (postType === 'ai') {
            data.aiPostId = postId;
        }

        const novoComentario = await prisma.comment.create({
            data,
            include: {
                replyToUser: {
                    select: { idPublic: true, name: true },
                },
            },
        });

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
                        where: { id: postId },
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
                } else if (postType === 'ai' || postType === 'ia') {
                    const postInfo = await prisma.aIPost.findUnique({
                        where: { id: postId },
                        select: { idPublic: true },
                    });

                    if (postInfo) {
                        postLink = `/post/ai/${postInfo.idPublic}`;
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
