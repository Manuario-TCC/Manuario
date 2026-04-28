export const manualsService = {
    getUserManuals: async (idPublic: string, limit: number, offset: number) => {
        const response = await fetch(
            `/api/manual/user/${idPublic}?limit=${limit}&offset=${offset}`,
        );

        if (!response.ok) {
            throw new Error('Falha ao carregar os manuais');
        }

        return response.json();
    },
};
