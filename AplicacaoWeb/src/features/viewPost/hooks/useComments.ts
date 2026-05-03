import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '../services/commentService';
import { socket } from '../../../services/socket';
import { useSession } from '@/src/hooks/useSession';

export const useComments = (postId: string, postType: string) => {
    const queryClient = useQueryClient();
    const { user } = useSession();
    const queryKey = ['comments', postType, postId];

    const { data: comments = [], isLoading } = useQuery({
        queryKey,
        queryFn: () => commentService.getComments(postId, postType),
        enabled: !!postId && !!postType,
    });

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
            queryClient.setQueryData(queryKey, (oldData: any[]) => {
                if (!oldData) return [newComment];
                if (newComment.parentId) {
                    return updateCommentTree(oldData, 'add', {
                        parentId: newComment.parentId,
                        newComment,
                    });
                }
                return [newComment, ...oldData];
            });
        };

        // Escuta acoes nos comentários
        const handleActionComment = (actionData: any) => {
            queryClient.setQueryData(queryKey, (oldData: any[]) => {
                if (!oldData) return oldData;

                return updateCommentTree(oldData, actionData.type, actionData);
            });
        };

        socket.on('receive_comment', handleReceiveComment);
        socket.on('action_comment', handleActionComment);

        // Cleanup
        return () => {
            socket.emit('leave_post', postId);
            socket.off('connect', joinRoom);
            socket.off('receive_comment', handleReceiveComment);
            socket.off('action_comment', handleActionComment);
        };
    }, [postId, postType, queryClient]);

    const addCommentMutation = useMutation({
        mutationFn: (data: { text: string; parentId: string | null }) =>
            commentService.createComment({
                text: data.text,
                postId,
                postType,
                parentId: data.parentId,
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

            queryClient.setQueryData(queryKey, (oldData: any[]) => {
                if (!oldData) return [newComment];
                if (newComment.parentId) {
                    return updateCommentTree(oldData, 'add', {
                        parentId: newComment.parentId,
                        newComment,
                    });
                }
                return [newComment, ...oldData];
            });

            socket.emit('send_comment', {
                postId,
                comment: newComment,
            });
        },
        onError: (error) => {
            console.error('Erro ao adicionar comentário:', error);
        },
    });

    const addComment = async (text: string, parentId: string | null = null) => {
        try {
            await addCommentMutation.mutateAsync({ text, parentId });
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
        comments,
        loading: isLoading,
        addComment,
        fetchComments,
        handleValidate,
    };
};

const updateCommentTree = (comments: any[], action: string, payload: any): any[] => {
    if (action === 'add') {
        if (comments.some((c) => c.id === payload.parentId)) {
            return comments.map((c) =>
                c.id === payload.parentId
                    ? { ...c, replies: [...(c.replies || []), payload.newComment] }
                    : c,
            );
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
            if (c.id === payload.commentId) return { ...c, text: payload.newText, isEdited: true };
            return {
                ...c,
                replies: c.replies ? updateCommentTree(c.replies, 'edit', payload) : [],
            };
        });
    }

    if (action === 'validate') {
        return comments.map((c) => {
            if (c.id === payload.commentId) return { ...c, isValidated: payload.isValidated };
            return {
                ...c,
                replies: c.replies ? updateCommentTree(c.replies, 'validate', payload) : [],
            };
        });
    }

    return comments;
};
