import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import jwt from 'jsonwebtoken';

const AI_POST_SECRET = process.env.AI_POST_SECRET;

export async function POST(req: Request) {
    try {
        const { title, gameName, aiToken, idPublicUser } = await req.json();

        const decoded = jwt.verify(aiToken, AI_POST_SECRET) as { prompt: string; response: string };

        const user = await prisma.user.findUnique({ where: { idPublic: idPublicUser } });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const post = await prisma.aIPost.create({
            data: {
                title,
                gameName,
                promptUser: decoded.prompt,
                aiResponse: decoded.response,
                userId: user.id,
            },
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Token de segurança inválido ou expirado.' },
            { status: 403 },
        );
    }
}
