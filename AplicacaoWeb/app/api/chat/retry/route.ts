import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const AI_POST_SECRET = process.env.AI_POST_SECRET || 'chave_segura';

export async function POST(request: Request) {
    try {
        const { lastMessage, idPublic } = await request.json();

        const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL!, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'retry_message',
                message: lastMessage,
                userId: idPublic,
            }),
        });

        const data = await n8nResponse.json();

        const aiToken = jwt.sign({ prompt: lastMessage, response: data.content }, AI_POST_SECRET, {
            expiresIn: '7h',
        });

        return NextResponse.json({ ...data, aiToken }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao recriar resposta' }, { status: 500 });
    }
}
