import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { publicationId, title, manualId, description, userId, isHouseRule } = body;

        const novaRegra = await prisma.regra.create({
            data: {
                idPublic: publicationId,
                name: title,
                description: description,
                isHouseRule: isHouseRule || false,
                user: {
                    connect: { idPublico: userId },
                },
                manual: {
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
