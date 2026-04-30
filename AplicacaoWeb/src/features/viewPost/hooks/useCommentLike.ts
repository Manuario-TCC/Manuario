// aplicacao_web/src/features/viewPost/hooks/useCommentLike.ts
import { useState, useEffect } from 'react';
import { likeService } from '@/src/services/likeService';

export function useCommentLike(
    initialIsLiked: boolean,
    initialLikeCount: number,
    commentId: string,
) {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [isLoadingLike, setIsLoadingLike] = useState(false);

    useEffect(() => {
        setIsLiked(initialIsLiked);
    }, [initialIsLiked]);

    useEffect(() => {
        setLikeCount(initialLikeCount);
    }, [initialLikeCount]);

    const handleToggleLike = async () => {
        if (isLoadingLike) return;
        setIsLoadingLike(true);

        const previousIsLiked = isLiked;
        const previousLikeCount = likeCount;

        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

        try {
            await likeService.toggleCommentLike(commentId);
        } catch (error) {
            setIsLiked(previousIsLiked);
            setLikeCount(previousLikeCount);
            console.error('Erro ao curtir comentário:', error);
        } finally {
            setIsLoadingLike(false);
        }
    };

    return {
        isLiked,
        likeCount,
        isLoadingLike,
        handleToggleLike,
    };
}
