export const savedService = {
    getSavedGamesSummary: async () => {
        const res = await fetch('/api/profile/saved');

        if (!res.ok) {
            throw new Error('Erro ao buscar resumo de jogos');
        }

        return res.json();
    },

    getSavedSnippets: async (gameName: string, limit: number, offset: number) => {
        const res = await fetch(
            `/api/profile/saved?gameName=${encodeURIComponent(gameName)}&limit=${limit}&offset=${offset}`,
        );

        if (!res.ok) {
            throw new Error('Erro ao buscar trechos salvos');
        }
        return res.json();
    },

    deleteSnippet: async (id: string) => {
        const res = await fetch(`/api/profile/saved?id=${id}`, { method: 'DELETE' });

        if (!res.ok) {
            throw new Error('Erro ao deletar trecho');
        }

        return res.json();
    },
};
