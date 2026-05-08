import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { message, idPublic } = body;

        if (!message || !idPublic) {
            return NextResponse.json(
                { error: 'A mensagem e o idPublico são obrigatórios.' },
                { status: 400 },
            );
        }

        console.log(`[MOCK API] Processando mensagem: "${message}"`);

        const AI_POST_SECRET = process.env.AI_POST_SECRET || 'secret_de_teste_local';

        await new Promise((resolve) => setTimeout(resolve, 2500));

        let data: any = {};
        let aiToken = undefined;

        if (message.toLowerCase().includes('jogo')) {
            data = {
                content:
                    'Notei que você não especificou o jogo. Sobre qual destes jogos de tabuleiro ou cartas você quer saber a regra?',
                options: ['Magic: The Gathering', 'Catan', 'Dixit', 'Zombicide'],
                metadata: { title: 'Seleção de Jogo', gameName: '' },
            };
        } else {
            const mockMarkdown = `### Entendendo: ${message}\n\nNo **Magic: The Gathering**, essa mecânica é fundamental para dominar o jogo! Aqui está o passo a passo de como ela funciona:\n\n* **Fase de Declaração:** Você deve anunciar essa ação durante a sua fase principal.\n* **Pagamento de Custos:** Vire os terrenos necessários para pagar o custo de mana.\n* **A Pilha:** A mágica ou habilidade vai para a *Pilha*.\n\nSe tiver mais dúvidas sobre como a pilha funciona, pode me perguntar!`;

            data = {
                content: mockMarkdown,
                metadata: {
                    title: `Dúvida: ${message}`,
                    gameName: 'Magic: The Gathering',
                },
                references: [
                    {
                        type: 'duvida',
                        idPublic: 'post-1',
                        title: 'Dúvida parecida da comunidade sobre a pilha.',
                    },
                    {
                        type: 'regra',
                        idPublic: 'post-2',
                        title: 'Regras avançadas sobre anulação de feitiços.',
                    },
                ],
            };

            aiToken = jwt.sign({ prompt: message, response: data.content }, AI_POST_SECRET, {
                expiresIn: '7h',
            });
        }

        return NextResponse.json(
            {
                ...data,
                aiToken: aiToken,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error('Erro na rota de chat MOCK:', error);
        return NextResponse.json(
            { error: 'Erro interno ao processar a mensagem no Mock' },
            { status: 500 },
        );
    }
}
