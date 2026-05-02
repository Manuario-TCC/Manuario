import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { getServerSession } from '@/src/utils/auth';
import { cookies } from 'next/headers';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const idPublicParams = resolvedParams.id;

        const dbUser = await prisma.user.findUnique({
            where: {
                idPublic: idPublicParams,
                isDisabled: false,
            },
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
            return NextResponse.json(
                { error: 'Usuário não encontrado ou desativado' },
                { status: 404 },
            );
        }

        let isOwnProfile = false;
        let isFollowing = false;

        const session = await getServerSession();
        const currentUserId = session?.user?.id;

        if (currentUserId) {
            if (dbUser.id === currentUserId) {
                isOwnProfile = true;
            } else {
                const segue = await prisma.follow.findUnique({
                    where: {
                        followerId_followedId: {
                            followerId: currentUserId,
                            followedId: dbUser.id,
                        },
                    },
                });
                isFollowing = !!segue;
            }
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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const idPublicParams = resolvedParams.id;

        const session = await getServerSession();
        const currentUserId = session?.user?.id;

        if (!currentUserId) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        // Busca o usuário alvo
        const userToDeactivate = await prisma.user.findUnique({
            where: { idPublic: idPublicParams },
            select: { id: true },
        });

        if (!userToDeactivate) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        // Verificar permissões
        const currentUserDb = await prisma.user.findUnique({
            where: { id: currentUserId },
            select: { isSuperAdmin: true },
        });

        const isOwner = currentUserId === userToDeactivate.id;
        const isSuperAdmin = currentUserDb?.isSuperAdmin || false;

        if (!isOwner && !isSuperAdmin) {
            return NextResponse.json(
                { error: 'Sem permissão para desativar esta conta' },
                { status: 403 },
            );
        }

        await prisma.$transaction([
            prisma.user.update({
                where: { id: userToDeactivate.id },
                data: { isDisabled: true },
            }),

            prisma.manual.updateMany({
                where: { userId: userToDeactivate.id },
                data: { isDisabled: true },
            }),

            prisma.rule.updateMany({
                where: { userId: userToDeactivate.id },
                data: { isDisabled: true },
            }),

            prisma.question.updateMany({
                where: { userId: userToDeactivate.id },
                data: { isDisabled: true },
            }),

            prisma.comment.updateMany({
                where: { authorId: userToDeactivate.id },
                data: { isDisabled: true },
            }),
        ]);

        if (isOwner) {
            const cookieStore = await cookies();
            cookieStore.delete('manuario_token');
        }

        return NextResponse.json(
            {
                message: 'Conta e dados relacionados desativados com sucesso',
            },
            { status: 200 },
        );
    } catch (error) {
        console.error('Erro ao desativar conta:', error);
        return NextResponse.json(
            { error: 'Erro interno no servidor ao desativar conta' },
            { status: 500 },
        );
    }
}
