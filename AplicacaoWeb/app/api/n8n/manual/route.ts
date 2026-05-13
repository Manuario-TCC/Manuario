import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.N8N_WEBHOOK_SECRET}`) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const body = await req.json();
        const {
            idPublic,
            name,
            game,
            genre,
            playTime,
            minPlayers,
            maxPlayers,
            description,
            ageRange,
            edition,
            type,
            system,
            rules,
        } = body;

        const aiUser = await prisma.user.findFirst({
            where: { isBot: true },
        });

        if (!aiUser) {
            return NextResponse.json(
                { error: 'Usuário IA não encontrado no sistema.' },
                { status: 404 },
            );
        }

        const manualIdPublic = idPublic;

        const novoManual = await prisma.manual.create({
            data: {
                idPublic: manualIdPublic,
                name,
                game,
                genre: genre || 'Geral',
                playTime: playTime || 0,
                minPlayers: minPlayers || 1,
                maxPlayers: maxPlayers || 1,
                description: description || '',
                ageRange: ageRange || '',
                edition: edition || '',
                type: type || '',
                system,
                isOfficial: true,
                userId: aiUser.id,
            },
        });

        if (rules && Array.isArray(rules)) {
            for (const rule of rules) {
                await prisma.rule.create({
                    data: {
                        idPublic: rule.idPublic,
                        name: rule.name,
                        description: rule.description,
                        status: 'PRIVADO',
                        isHouseRule: false,
                        userId: aiUser.id,
                        manuals: {
                            connect: { id: novoManual.id },
                        },
                    },
                });
            }
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Manual e regras salvos com sucesso!',
                manualId: novoManual.idPublic,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error('Erro na integração com n8n:', error);
        return NextResponse.json(
            { error: 'Erro interno ao processar o payload do n8n' },
            { status: 500 },
        );
    }
}
