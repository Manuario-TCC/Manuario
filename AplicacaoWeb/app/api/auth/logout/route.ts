import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const response = NextResponse.json(
            { message: 'Logout realizado com sucesso' },
            { status: 200 },
        );

        response.cookies.delete('manuario_token');

        return response;
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao processar o logout' }, { status: 500 });
    }
}
