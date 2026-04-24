export const feedService = {
    getFeed: async (limit: number, offset: number) => {
        const response = await fetch(`/api/feed/following?limit=${limit}&offset=${offset}`);

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Usuário não autenticado');
            }
            throw new Error('Falha ao carregar as postagens do feed');
        }

        const data = await response.json();

        return data;
    },
};
