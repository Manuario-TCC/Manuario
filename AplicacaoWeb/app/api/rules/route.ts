import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { publicationId, title, name, manualId, description, userId, isHouseRule } = body;

        const nomeDaRegra = title || name;
        if (!nomeDaRegra) {
            return NextResponse.json(
                { error: 'O título/nome da regra é obrigatório.' },
                { status: 400 },
            );
        }

        const novaRegra = await prisma.rule.create({
            data: {
                idPublic: publicationId,
                name: nomeDaRegra,
                description: description,
                isHouseRule: isHouseRule || false,
                user: {
                    connect: { idPublic: userId },
                },
                manuals: {
                    connect: { id: manualId },
                },
            },
        });

        return NextResponse.json(novaRegra, { status: 201 });
    } catch (error: any) {
        console.error('Erro Prisma:', error);
        return NextResponse.json({ error: 'Erro ao salvar regra no banco' }, { status: 500 });
    }
}
