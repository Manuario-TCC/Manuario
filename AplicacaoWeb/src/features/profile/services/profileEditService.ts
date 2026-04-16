export const profileEditService = {
    updateProfile: async (data: { name?: string; email?: string; password?: string }) => {
        const res = await fetch('/api/profile/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            throw new Error('Falha ao atualizar perfil');
        }

        return res.json();
    },

    logout: async () => {
        const res = await fetch('/api/auth/logout', { method: 'POST' });

        if (!res.ok) {
            throw new Error('Falha ao sair da conta');
        }
    },

    deleteAccount: async () => {
        const res = await fetch('/api/users/delete', { method: 'DELETE' });

        if (!res.ok) {
            throw new Error('Falha ao excluir conta');
        }
    },
};
