export const likeService = {
    toggleLike: async (type: string, idPublic: string): Promise<void> => {
        const res = await fetch(`/api/post/${type}/${idPublic}/like`, {
            method: 'POST',
        });

        if (!res.ok) {
            throw new Error('Falha ao registrar o like');
        }
    },

    toggleCommentLike: async (commentId: string) => {
        const res = await fetch(`/api/comments/${commentId}/like`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error('Falha ao registrar o like no comentário');
        }
        return res.json();
    },
};
