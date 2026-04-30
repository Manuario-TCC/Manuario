import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const idPublicParams = resolvedParams.id;

        const dbUser = await prisma.user.findUnique({
            where: { idPublic: idPublicParams },
            select: {
                id: true,
                idPublic: true,
                name: true,
                email: true,
                img: true,
                banner: true,
                bio: true,
                links: true,
                isAdmin: true,
                isSuperAdmin: true,
                _count: {
                    select: {
                        followers: true,
                        following: true,
                        rules: true,
                    },
                },
            },
        });

        if (!dbUser) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        let isOwnProfile = false;
        let isFollowing = false;

        const cookieStore = await cookies();
        const token = cookieStore.get('manuario_token')?.value;

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
                    userId: string;
                };

                if (dbUser.id === decoded.userId) {
                    isOwnProfile = true;
                } else {
                    const segue = await prisma.follow.findUnique({
                        where: {
                            followerId_followedId: {
                                followerId: decoded.userId,
                                followedId: dbUser.id,
                            },
                        },
                    });
                    isFollowing = !!segue;
                }
            } catch (error) {}
        }

        const profileData = {
            id: dbUser.id,
            publicId: dbUser.idPublic,
            name: dbUser.name,
            ...(isOwnProfile && { email: dbUser.email }),
            avatarUrl: dbUser.img
                ? `/upload/${dbUser.idPublic}/user/${dbUser.img}`
                : '/img/iconePadrao.jpg',
            bannerUrl: dbUser.banner
                ? `/upload/${dbUser.idPublic}/user/${dbUser.banner}`
                : '/img/bannerPadrao.png',

            bio: dbUser.bio,
            links: dbUser.links,
            isAdmin: dbUser.isAdmin,
            isSuperAdmin: dbUser.isSuperAdmin,

            followers: dbUser._count.followers,
            following: dbUser._count.following,
            rules: dbUser._count.rules,
            isOwnProfile,
            isFollowing,
        };

        return NextResponse.json(profileData, { status: 200 });
    } catch (error) {
        console.error('Erro interno na API do perfil:', error);
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
}
