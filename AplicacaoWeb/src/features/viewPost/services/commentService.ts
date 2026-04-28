export const commentService = {
    getComments: async (postId: string, postType: string) => {
        const res = await fetch(`/api/comments?postId=${postId}&postType=${postType}`);
        if (!res.ok) {
            throw new Error('Erro ao buscar comentários');
        }

        return res.json();
    },

    createComment: async (data: {
        text: string;
        postId: string;
        postType: string;
        parentId?: string | null;
    }) => {
        const res = await fetch('/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            throw new Error('Erro ao postar comentário');
        }

        return res.json();
    },

    updateComment: async (id: string, text: string) => {
        const res = await fetch(`/api/comments/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });

        if (!res.ok) {
            throw new Error('Erro ao atualizar comentário');
        }

        return res.json();
    },

    deleteComment: async (id: string) => {
        const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            throw new Error('Erro ao excluir comentário');
        }

        return res.json();
    },
};
