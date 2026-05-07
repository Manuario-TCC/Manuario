import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { idPublic, lastMessage } = body;

        if (!idPublic) {
            return NextResponse.json({ error: 'O idPublico é obrigatório.' }, { status: 400 });
        }

        const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

        const n8nResponse = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'retry',
                userId: idPublic,
                message: lastMessage,
            }),
        });

        if (!n8nResponse.ok) {
            throw new Error('Falha ao comunicar com o n8n no Retry');
        }

        const data = await n8nResponse.json();

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Erro na rota de recriar:', error);
        return NextResponse.json({ error: 'Erro interno ao recriar a mensagem' }, { status: 500 });
    }
}
