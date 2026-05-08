import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
    try {
        const AI_POST_SECRET = process.env.AI_POST_SECRET;

        const { title, gameName, aiToken, idPublicUser } = await req.json();

        if (!aiToken) {
            return NextResponse.json({ error: 'Token não fornecido.' }, { status: 400 });
        }

        let decoded: any;

        try {
            decoded = jwt.verify(aiToken, AI_POST_SECRET) as { prompt: string; response: string };
        } catch (jwtError) {
            console.error('[ERRO JWT na /api/ai]:', jwtError);
            return NextResponse.json(
                { error: 'Token de segurança inválido ou expirado.' },
                { status: 403 },
            );
        }

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
        console.error('[ERRO GERAL /api/ai]:', error);
        return NextResponse.json(
            { error: 'Erro interno ao processar a publicação.' },
            { status: 500 },
        );
    }
}
