export const manualsService = {
    getUserManuals: async (idPublico: string, limit: number, offset: number) => {
        const response = await fetch(
            `/api/manual/user/${idPublico}?limit=${limit}&offset=${offset}`,
        );

        if (!response.ok) {
            throw new Error('Falha ao carregar os manuais');
        }

        return response.json();
    },
};
