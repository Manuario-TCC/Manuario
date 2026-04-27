export const manualService = {
    getManualById: async (id: string) => {
        const response = await fetch(`/api/manual/${id}`);
        if (!response.ok) {
            throw new Error('Erro ao carregar o manual');
        }
        return response.json();
    },
};
