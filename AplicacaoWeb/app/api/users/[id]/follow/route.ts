import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { cookies } from 'next/headers';
import * as jwt from 'jsonwebtoken';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const idPublicParams = resolvedParams.id;
        const cookieStore = await cookies();
        const token = cookieStore.get('manuario_token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        let followerId = '';

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
                userId: string;
            };
            followerId = decoded.userId;
        } catch (error) {
            return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
        }

        // Quem vai seguir
        const userToFollow = await prisma.user.findUnique({
            where: { idPublic: idPublicParams },
            select: { id: true },
        });

        if (!userToFollow) {
            return NextResponse.json({ error: 'Perfil não encontrado' }, { status: 404 });
        }

        const followedId = userToFollow.id;

        if (followerId === followedId) {
            return NextResponse.json(
                { error: 'Você não pode seguir a si mesmo.' },
                { status: 400 },
            );
        }

        // Cria ou remove
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followedId: {
                    followerId: followerId,
                    followedId: followedId,
                },
            },
        });

        if (existingFollow) {
            await prisma.follow.delete({ where: { id: existingFollow.id } });

            return NextResponse.json(
                { message: 'Deixou de seguir', isFollowing: false },
                { status: 200 },
            );
        } else {
            await prisma.follow.create({
                data: { followerId: followerId, followedId: followedId },
            });

            return NextResponse.json({ message: 'following', isFollowing: true }, { status: 200 });
        }
    } catch (error) {
        console.error('Erro na API de follow:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
