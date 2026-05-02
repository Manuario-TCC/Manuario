export const postService = {
    disablePost: async (type: string, idPublic: string, reason: string) => {
        const response = await fetch(`/api/post/${type}/${idPublic}/disable`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || 'Falha ao desativar a publicação');
        }

        return response.json();
    },

    deletePost: async (type: string, idPublic: string) => {
        const response = await fetch(`/api/post/${type}/${idPublic}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || 'Falha ao excluir a publicação');
        }

        return response.json();
    },
};
