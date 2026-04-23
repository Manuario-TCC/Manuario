import { useState, useEffect, useCallback } from 'react';
import { commentService } from '../services/commentService';

export const useComments = (postId: string, postType: string) => {
    const [comentarios, setComentarios] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = useCallback(async () => {
        if (!postId) return;

        try {
            setLoading(true);
            const data = await commentService.getComments(postId, postType);
            setComentarios(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [postId, postType]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const addComment = async (texto: string, parentId: string | null = null) => {
        try {
            await commentService.createComment({ texto, postId, postType, parentId });
            await fetchComments();
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    return {
        comentarios,
        loading,
        addComment,
        fetchComments,
    };
};
