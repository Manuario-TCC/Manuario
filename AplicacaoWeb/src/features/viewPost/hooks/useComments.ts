import { useEffect, useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '../services/commentService';
import { socket } from '../../../services/socket';
import { useSession } from '@/src/hooks/useSession';

export const useComments = (postId: string, postType: string) => {
    const queryClient = useQueryClient();
    const { user } = useSession();

    const queryKey = useMemo(() => ['comments', postType, postId], [postType, postId]);

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam = null }) =>
            commentService.getComments(postId, postType, pageParam as string | null),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: null,
        enabled: !!postId && !!postType,
    });

    const allComments = data?.pages.flatMap((page) => page.comments || []) || [];

    useEffect(() => {
        if (!postId) return;
        socket.connect();

        const joinRoom = () => {
            socket.emit('join_post', postId);
        };

        if (socket.connected) {
            joinRoom();
        } else {
            socket.on('connect', joinRoom);
        }

        const handleReceiveComment = (newComment: any) => {
            queryClient.setQueryData(queryKey, (oldData: any) => {
                if (!oldData || !oldData.pages) return oldData;

                const newPages = oldData.pages.map((page: any, index: number) => {
                    if (newComment.parentId) {
                        return {
                            ...page,
                            comments: updateCommentTree(page.comments || [], 'add', {
                                parentId: newComment.parentId,
                                newComment,
                            }),
                        };
                    } else {
                        if (index === 0) {
                            const exists = page.comments?.some((c: any) => c.id === newComment.id);
                            if (exists) return page;

                            return {
                                ...page,
                                comments: [newComment, ...(page.comments || [])],
                            };
                        }
                        return page;
                    }
                });

                return { ...oldData, pages: newPages };
            });
        };

        const handleActionComment = (actionData: any) => {
            queryClient.setQueryData(queryKey, (oldData: any) => {
                if (!oldData || !oldData.pages) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => ({
                        ...page,
                        comments: updateCommentTree(
                            page.comments || [],
                            actionData.type,
                            actionData,
                        ),
                    })),
                };
            });
        };

        socket.on('receive_comment', handleReceiveComment);
        socket.on('action_comment', handleActionComment);

        return () => {
            socket.emit('leave_post', postId);
            socket.off('connect', joinRoom);
            socket.off('receive_comment', handleReceiveComment);
            socket.off('action_comment', handleActionComment);
        };
    }, [postId, postType, queryClient]);

    const addCommentMutation = useMutation({
        mutationFn: (data: {
            text: string;
            parentId: string | null;
            replyToCommentId?: string;
            replyToUserId?: string;
        }) =>
            commentService.createComment({
                text: data.text,
                postId,
                postType,
                parentId: data.parentId,
                replyToCommentId: data.replyToCommentId,
                replyToUserId: data.replyToUserId,
            }),
        onSuccess: (apiResponse) => {
            const imgFilename = user?.img ? user.img.split('/').pop() : null;
            const newComment = {
                ...apiResponse,
                author: apiResponse.author || {
                    idPublic: user?.idPublic,
                    name: user?.name,
                    img: imgFilename,
                    isAdmin: user?.isAdmin,
                    isSuperAdmin: user?.isSuperAdmin,
                },
                replies: apiResponse.replies || [],
            };

            queryClient.setQueryData(queryKey, (oldData: any) => {
                if (!oldData || !oldData.pages) return oldData;

                const newPages = oldData.pages.map((page: any, index: number) => {
                    if (newComment.parentId) {
                        return {
                            ...page,
                            comments: updateCommentTree(page.comments || [], 'add', {
                                parentId: newComment.parentId,
                                newComment,
                            }),
                        };
                    } else {
                        if (index === 0) {
                            const exists = page.comments?.some((c: any) => c.id === newComment.id);
                            if (exists) return page;

                            return {
                                ...page,
                                comments: [newComment, ...(page.comments || [])],
                            };
                        }
                        return page;
                    }
                });

                return { ...oldData, pages: newPages };
            });

            socket.emit('send_comment', {
                postId,
                comment: newComment,
            });

            if (apiResponse.notification) {
                socket.emit('send_notification', apiResponse.notification);
            }
        },
        onError: (error) => {
            console.error('Erro ao adicionar comentário:', error);
        },
    });

    const addComment = async (
        text: string,
        parentId: string | null = null,
        replyToCommentId?: string,
        replyToUserId?: string,
    ) => {
        try {
            await addCommentMutation.mutateAsync({
                text,
                parentId,
                replyToCommentId,
                replyToUserId,
            });
            return true;
        } catch (error) {
            return false;
        }
    };

    const fetchComments = () => {
        queryClient.invalidateQueries({ queryKey });
    };

    const validateMutation = useMutation({
        mutationFn: (id: string) => commentService.toggleCommentValidation(id, ''),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        },
    });

    const handleValidate = (commentId: string) => {
        validateMutation.mutate(commentId);
    };

    return {
        comments: allComments,
        loading: isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        addComment,
        fetchComments,
        handleValidate,
    };
};

const updateCommentTree = (comments: any[], action: string, payload: any): any[] => {
    if (!comments) return [];

    if (action === 'add') {
        if (comments.some((c) => c.id === payload.parentId)) {
            return comments.map((c) => {
                if (c.id === payload.parentId) {
                    const exists = c.replies?.some((r: any) => r.id === payload.newComment.id);
                    if (exists) return c;

                    return { ...c, replies: [...(c.replies || []), payload.newComment] };
                }
                return c;
            });
        }

        return comments.map((c) => ({
            ...c,
            replies: c.replies ? updateCommentTree(c.replies, 'add', payload) : [],
        }));
    }

    if (action === 'delete') {
        return comments
            .filter((c) => c.id !== payload.commentId)
            .map((c) => ({
                ...c,
                replies: c.replies ? updateCommentTree(c.replies, 'delete', payload) : [],
            }));
    }

    if (action === 'edit') {
        return comments.map((c) => {
            if (c.id === payload.commentId) {
                return { ...c, text: payload.newText, isEdited: true };
            }

            return {
                ...c,
                replies: c.replies ? updateCommentTree(c.replies, 'edit', payload) : [],
            };
        });
    }

    if (action === 'validate') {
        return comments.map((c) => {
            if (c.id === payload.commentId) {
                return { ...c, isValidated: payload.isValidated };
            }
            return {
                ...c,
                replies: c.replies ? updateCommentTree(c.replies, 'validate', payload) : [],
            };
        });
    }

    return comments;
};
