import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { idPublic } = body;

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
                action: 'cancel',
                userId: idPublic,
            }),
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Erro na rota de cancelamento:', error);
        return NextResponse.json({ error: 'Erro interno ao cancelar' }, { status: 500 });
    }
}
