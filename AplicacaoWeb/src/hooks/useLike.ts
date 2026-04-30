import { useState } from 'react';
import { likeService } from '../services/likeService';

export function useLike(
    initialIsLiked: boolean,
    initialLikeCount: number,
    postType: string,
    postIdPublic: string,
) {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [isLoadingLike, setIsLoadingLike] = useState(false);

    const handleToggleLike = async () => {
        if (isLoadingLike) return;
        setIsLoadingLike(true);

        const previousIsLiked = isLiked;
        const previousLikeCount = likeCount;

        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

        try {
            await likeService.toggleLike(postType, postIdPublic);
        } catch (error) {
            setIsLiked(previousIsLiked);
            setLikeCount(previousLikeCount);

            console.error('Erro ao curtir postagem:', error);
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
