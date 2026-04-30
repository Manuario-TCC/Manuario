import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { getAuthUserId } from '@/src/utils/auth';

export async function GET() {
    try {
        const userId = await getAuthUserId();

        if (!userId) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                idPublic: true,
                name: true,
                email: true,
                img: true,
                banner: true,
                bio: true,
                links: true,
                isSuperAdmin: true,
                isAdmin: true,
            },
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        const user = {
            ...dbUser,
            img: dbUser.img
                ? `/upload/${dbUser.idPublic}/user/${dbUser.img}`
                : '/img/iconePadrao.jpg',
            banner: dbUser.banner
                ? `/upload/${dbUser.idPublic}/user/${dbUser.banner}`
                : '/img/bannerPadrao.png',
        };

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
}
