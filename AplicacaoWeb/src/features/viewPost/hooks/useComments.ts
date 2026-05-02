import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '../services/commentService';

export const useComments = (postId: string, postType: string) => {
    const queryClient = useQueryClient();
    const queryKey = ['comments', postType, postId];

    const { data: comments = [], isLoading } = useQuery({
        queryKey,
        queryFn: () => commentService.getComments(postId, postType),
        enabled: !!postId && !!postType,
    });

    const addCommentMutation = useMutation({
        mutationFn: (data: { text: string; parentId: string | null }) =>
            commentService.createComment({
                text: data.text,
                postId,
                postType,
                parentId: data.parentId,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
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
            queryClient.invalidateQueries({ queryKey: ['post_comments'] });
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
    };
};
