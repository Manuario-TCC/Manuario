import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('manuario_token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: string };

        const dbUser = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: {
                idPublico: true,
                name: true,
                email: true,
                img: true,
                banner: true,
            },
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        const user = {
            ...dbUser,
            img: dbUser.img
                ? `/upload/${dbUser.idPublico}/user/${dbUser.img}`
                : '/img/iconePadrao.jpg',
            banner: dbUser.banner
                ? `/upload/${dbUser.idPublico}/user/${dbUser.banner}`
                : '/img/bannerPadrao.png',
        };

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
}
