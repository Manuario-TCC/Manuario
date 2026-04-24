export const profileService = {
    updateName: async (name: string) => {
        const response = await fetch('/api/profile/name', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        });

        if (!response.ok) throw new Error('Erro ao atualizar o nome');
        return response.json();
    },

    updateBanner: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/profile/banner', {
            method: 'PATCH',
            body: formData,
        });

        if (!response.ok) throw new Error('Erro ao atualizar o banner');
        return response.json();
    },

    updateAvatar: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/profile/avatar', {
            method: 'PATCH',
            body: formData,
        });

        if (!response.ok) throw new Error('Erro ao atualizar o avatar');
        return response.json();
    },

    getProfile: async (idPublico: string) => {
        const response = await fetch(`/api/users/${idPublico}`);

        if (!response.ok) {
            throw new Error('Falha ao buscar dados do perfil');
        }

        return response.json();
    },

    toggleFollow: async (idPublico: string) => {
        const response = await fetch(`/api/users/${idPublico}/follow`, {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error('Erro ao processar a ação de seguir');
        }

        return response.json();
    },
};
