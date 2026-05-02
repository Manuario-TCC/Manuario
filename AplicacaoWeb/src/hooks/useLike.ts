import { useMutation } from '@tanstack/react-query';
import { likeService } from '../services/likeService';
import { useState } from 'react';

export function useLike(
    initialIsLiked: boolean,
    initialLikeCount: number,
    postType: string,
    postIdPublic: string,
) {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);

    const toggleLikeMutation = useMutation({
        mutationFn: () => likeService.toggleLike(postType, postIdPublic),

        onMutate: async () => {
            const previousIsLiked = isLiked;
            const previousLikeCount = likeCount;

            setIsLiked(!isLiked);
            setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

            return { previousIsLiked, previousLikeCount };
        },

        onError: (error, _, context) => {
            if (context) {
                setIsLiked(context.previousIsLiked);
                setLikeCount(context.previousLikeCount);
            }

            console.error('Erro ao curtir postagem:', error);
        },
    });

    const handleToggleLike = () => {
        if (toggleLikeMutation.isPending) return;
        toggleLikeMutation.mutate();
    };

    return {
        isLiked,
        likeCount,
        isLoadingLike: toggleLikeMutation.isPending,
        handleToggleLike,
    };
}
