export const publishAIService = {
    async publish(data: {
        title: string;
        gameName: string;
        aiToken: string;
        idPublicUser?: string;
    }) {
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Erro ao publicar post');
        return response.json();
    },
};
