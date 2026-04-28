export const publicationsService = {
    getUserPosts: async (idPublic: string, type: string, limit: number, offset: number) => {
        const response = await fetch(
            `/api/post/${type}/user/${idPublic}?limit=${limit}&offset=${offset}`,
        );

        if (!response.ok) {
            throw new Error('Falha ao carregar as publicações');
        }

        return response.json();
    },
};
