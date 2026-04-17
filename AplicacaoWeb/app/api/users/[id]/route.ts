import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const idPublicoParams = resolvedParams.id;

        const dbUser = await prisma.user.findUnique({
            where: { idPublico: idPublicoParams },
            select: {
                id: true,
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

        let isOwnProfile = false;

        const cookieStore = await cookies();
        const token = cookieStore.get('manuario_token')?.value;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
                    userId: string;
                };
                if (dbUser.id === decoded.userId) {
                    isOwnProfile = true;
                }
            } catch (error) {}
        }

        const profileData = {
            publicId: dbUser.idPublico,
            name: dbUser.name,
            ...(isOwnProfile && { email: dbUser.email }),
            avatarUrl: dbUser.img
                ? `/upload/${dbUser.idPublico}/user/${dbUser.img}`
                : '/img/iconePadrao.jpg',
            bannerUrl: dbUser.banner
                ? `/upload/${dbUser.idPublico}/user/${dbUser.banner}`
                : '/img/bannerPadrao.png',

            followers: 142,
            following: 89,
            rules: 12,
            isOwnProfile,
        };

        return NextResponse.json(profileData, { status: 200 });
    } catch (error) {
        console.error('Erro interno na API do perfil:', error);
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
}
