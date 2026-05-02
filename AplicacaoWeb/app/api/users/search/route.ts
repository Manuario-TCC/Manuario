import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma'; //

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email || email.trim() === '') {
        return NextResponse.json([], { status: 200 });
    }

    try {
        const users = await prisma.user.findMany({
            where: {
                email: {
                    contains: email.trim(),
                    mode: 'insensitive',
                },
            },
            select: {
                id: true,
                idPublic: true,
                name: true,
                email: true,
                img: true,
                isAdmin: true,
                isSuperAdmin: true,
            },
            take: 5,
        });

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error('Erro ao buscar usuários por email:', error);
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
}
