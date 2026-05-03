import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const limit = searchParams.get('limit') || '3';

    if (!q) {
        return NextResponse.json(
            { error: 'Parâmetro de busca "q" é obrigatório' },
            { status: 400 },
        );
    }

    try {
        // Trocamos o Axios pelo fetch nativo do Next.js
        // Sem headers customizados para não acionar o firewall anti-bot
        const response = await fetch(
            `https://api.mercadolibre.com/sites/MLB/search?q=${encodeURIComponent(q)}&limit=${limit}`,
            {
                method: 'GET',
                // Força o Next.js a não fazer cache pesado dessa requisição na build
                cache: 'no-store',
            },
        );

        if (!response.ok) {
            throw new Error(`O Mercado Livre retornou status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Erro na API do Mercado Livre (Fetch):', error.message);
        return NextResponse.json(
            { error: 'Falha ao buscar produtos no Mercado Livre' },
            { status: 500 },
        );
    }
}
