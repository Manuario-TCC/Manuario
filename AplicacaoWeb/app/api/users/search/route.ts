import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email || email.length < 3) {
        return NextResponse.json([]);
    }

    try {
        const users = await prisma.user.findMany({
            where: {
                email: {
                    contains: email,
                    mode: 'insensitive',
                },
            },
            select: {
                id: true,
                idPublico: true,
                name: true,
                email: true,
                img: true,
            },
            take: 5,
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 });
    }
}
