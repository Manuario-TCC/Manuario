export const publicationsService = {
    getUserPosts: async (idPublico: string, type: string, limit: number, offset: number) => {
        const response = await fetch(
            `/api/post/${type}/user/${idPublico}?limit=${limit}&offset=${offset}`,
        );

        if (!response.ok) {
            throw new Error('Falha ao carregar as publicações');
        }

        return response.json();
    },
};
