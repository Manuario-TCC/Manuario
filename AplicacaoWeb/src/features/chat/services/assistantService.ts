export interface AIReference {
    type: string;
    idPublic: string;
    title: string;
}

export interface AIResponse {
    content: string;
    metadata?: {
        title: string;
        gameName: string;
    };
    options?: string[];
    references?: AIReference[];
    aiToken?: string;
}

let abortController: AbortController | null = null;

export const assistantService = {
    async askIA({ message, idPublic }: { message: string; idPublic: string }): Promise<AIResponse> {
        abortController = new AbortController();

        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, idPublic }),
            signal: abortController.signal,
        });

        if (!res.ok) {
            throw new Error('Erro ao se comunicar com a IA.');
        }

        return await res.json();
    },

    async retryIA(idPublic: string, lastMessage: string): Promise<AIResponse> {
        abortController = new AbortController();

        const res = await fetch('/api/chat/retry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idPublic, lastMessage }),
            signal: abortController.signal,
        });

        if (!res.ok) {
            throw new Error('Erro ao tentar gerar nova resposta da IA.');
        }

        return await res.json();
    },

    async cancelIA(idPublic: string): Promise<void> {
        if (abortController) {
            abortController.abort();
            abortController = null;
        }

        const res = await fetch('/api/chat/cancel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idPublic }),
        });

        if (!res.ok) {
            throw new Error('Erro ao cancelar a requisição.');
        }
    },
};
