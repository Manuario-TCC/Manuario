export interface AIResponse {
    content: string;
    metadata?: {
        title: string;
        gameName: string;
    };
    options?: string[];
    aiToken?: string;
}

export const assistantService = {
    async askIA({ message, idPublic }: { message: string; idPublic: string }): Promise<AIResponse> {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, idPublic }),
        });

        if (!res.ok) {
            throw new Error('Erro ao se comunicar com a IA.');
        }

        const data = await res.json();

        return data;
    },

    async retryIA(idPublic: string, lastMessage: string): Promise<AIResponse> {
        const res = await fetch('/api/chat/retry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idPublic, lastMessage }),
        });

        if (!res.ok) {
            throw new Error('Erro ao tentar gerar nova resposta da IA.');
        }

        const data = await res.json();
        return data;
    },

    async cancelIA(idPublic: string): Promise<void> {
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

// export const assistantService = {
//     async askIA({ message, idPublic }: { message: string; idPublic: string }) {
//         console.log(`[MOCK API] Enviando...`);

//         return new Promise<{
//             content: string;
//             options?: string[];
//             metadata?: { title: string; gameName: string };
//             aiToken?: string;
//         }>((resolve) => {
//             setTimeout(() => {
//                 if (message.toLowerCase().includes('jogo')) {
//                     resolve({
//                         content:
//                             'Notei que você não especificou o jogo. Sobre qual destes jogos de tabuleiro ou cartas você quer saber a regra?',
//                         options: ['Magic: The Gathering', 'Catan', 'Dixit', 'Zombicide'],
//                         metadata: { title: 'Seleção de Jogo', gameName: '' },
//                     });
//                 } else {
//                     const mockMarkdown = `### Entendendo: ${message}\n\nNo **Magic: The Gathering**, essa mecânica é fundamental para dominar o jogo! Aqui está o passo a passo de como ela funciona:\n\n* **Fase de Declaração:** Você deve anunciar essa ação durante a sua fase principal.\n* **Pagamento de Custos:** Vire os terrenos necessários para pagar o custo de mana.\n* **A Pilha:** A mágica ou habilidade vai para a *Pilha*. Nesse momento, os oponentes recebem a prioridade para responder com mágicas instantâneas.\n\n> 💡 **Dica de Estratégia:** Sempre observe se o seu oponente possui terrenos desvirados azuis antes de tentar resolver essa ação, pois ele pode ter uma anulação engatilhada!\n\nSe tiver mais dúvidas sobre como a pilha funciona, pode me perguntar!`;

//                     resolve({
//                         content: mockMarkdown,
//                         metadata: {
//                             title: `Dúvida: ${message}`,
//                             gameName: 'Magic: The Gathering',
//                         },
//                     });
//                 }
//             }, 2500);
//         });
//     },

//     async retryIA(idPublic: string, lastMessage: string) {
//         return new Promise<{
//             content: string;
//             options?: string[];
//             metadata?: { title: string; gameName: string };
//         }>((resolve) => {
//             setTimeout(() => {
//                 resolve({
//                     content: `### 🔄 Nova versão da explicação\n\nAqui está uma versão resumida sobre **"${lastMessage}"**:\n\n1. Você paga o custo.\n2. O efeito acontece.\n3. O turno passa.\n\nFicou mais fácil de entender agora?`,
//                     metadata: {
//                         title: `Resumo: ${lastMessage}`,
//                         gameName: 'Magic: The Gathering',
//                     },
//                 });
//             }, 2000);
//         });
//     },

//     async cancelIA(idPublic: string): Promise<void> {
//         console.log(`[MOCK API] 🛑 Operação de IA cancelada pelo usuário: ${idPublic}`);

//         return new Promise((resolve) => {
//             setTimeout(() => {
//                 resolve();
//             }, 300);
//         });
//     },
// };
