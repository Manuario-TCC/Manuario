export const adminService = {
    toggleAdmin: async (userId: string) => {
        const response = await fetch(`/api/users/${userId}/toggle-admin`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao alterar cargo');
        }

        return response.json();
    },

    disableUser: async (userId: string, reason: string) => {
        const response = await fetch(`/api/users/${userId}/disable`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao desabilitar usuário');
        }

        return response.json();
    },
};
