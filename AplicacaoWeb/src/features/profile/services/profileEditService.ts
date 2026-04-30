export const profileEditService = {
    updateProfile: async (data: {
        name?: string;
        email?: string;
        password?: string;
        bio?: string;
        links?: { name: string; url: string }[];
    }) => {
        const res = await fetch('/api/profile/update', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || 'Falha ao atualizar perfil');
        }

        return res.json();
    },

    updateAvatar: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/profile/avatar', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            throw new Error('Falha ao atualizar o avatar');
        }

        return res.json();
    },

    updateBanner: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/profile/banner', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            throw new Error('Falha ao atualizar o banner');
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
