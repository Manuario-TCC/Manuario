export const manualService = {
    getManualById: async (id: string) => {
        const response = await fetch(`/api/manual/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao carregar o manual');
        }
        return response.json();
    },

    getRegrasByManualId: async (id: string, page: number, search: string) => {
        const response = await fetch(
            `/api/manual/${id}/regras?page=${page}&limit=10&search=${search}`,
        );
        if (!response.ok) {
            throw new Error('Erro ao buscar as regras');
        }
        return response.json();
    },
};
