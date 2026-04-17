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
};
