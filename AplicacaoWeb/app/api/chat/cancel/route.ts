import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { idPublic } = await request.json();

        await fetch(process.env.N8N_WEBHOOK_URL!, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'cancel_execution',
                userId: idPublic,
            }),
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao cancelar' }, { status: 500 });
    }
}
