export const snippetService = {
    async save(data: { promptUser: string; aiResponse: string; gameName?: string }) {
        const response = await fetch('/api/snippets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Erro ao salvar trecho');
        return response.json();
    },
};
