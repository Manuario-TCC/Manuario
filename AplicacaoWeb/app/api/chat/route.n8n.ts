import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const AI_POST_SECRET = process.env.AI_POST_SECRET;

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

        const WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

        if (!WEBHOOK_URL) {
            throw new Error('URL do webhook n8n não configurada no ambiente.');
        }

        const n8nResponse = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'new_message',
                message: message,
                userId: idPublic,
            }),
        });

        if (!n8nResponse.ok) {
            throw new Error('Falha ao comunicar com o n8n');
        }

        const data = await n8nResponse.json();

        let aiToken = undefined;

        if (data.content && !data.options) {
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
        console.error('Erro na rota de chat:', error);
        return NextResponse.json(
            { error: 'Erro interno ao processar a mensagem' },
            { status: 500 },
        );
    }
}
