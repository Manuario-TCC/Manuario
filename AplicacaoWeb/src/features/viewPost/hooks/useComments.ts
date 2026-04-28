import { useState, useEffect, useCallback } from 'react';
import { commentService } from '../services/commentService';

export const useComments = (postId: string, postType: string) => {
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = useCallback(async () => {
        if (!postId) return;

        try {
            setLoading(true);
            const data = await commentService.getComments(postId, postType);
            setComments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [postId, postType]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const addComment = async (text: string, parentId: string | null = null) => {
        try {
            await commentService.createComment({ text, postId, postType, parentId });
            await fetchComments();
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    return {
        comments,
        loading,
        addComment,
        fetchComments,
    };
};
