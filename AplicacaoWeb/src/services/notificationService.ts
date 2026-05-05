export const notificationService = {
    getHistory: async (limit: number = 10, offset: number = 0) => {
        const res = await fetch(`/api/notifications?limit=${limit}&offset=${offset}`);

        if (!res.ok) {
            throw new Error('Erro ao buscar notificações');
        }

        return res.json();
    },

    deleteNotification: async (id: string) => {
        const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });

        if (!res.ok) {
            throw new Error('Erro ao excluir notificação');
        }

        return res.json();
    },

    markAsRead: async (id: string) => {
        const res = await fetch(`/api/notifications/${id}`, { method: 'PATCH' });

        if (!res.ok) {
            throw new Error('Erro ao atualizar notificação');
        }

        return res.json();
    },
};
