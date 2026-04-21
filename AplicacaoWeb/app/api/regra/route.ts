import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { publicationId, name, description, manualId, isHouseRule, userId, status } = body;

        const novaRegra = await prisma.regra.create({
            data: {
                idPublic: publicationId,
                name: name,
                description: description,
                isHouseRule: isHouseRule,
                status: status,
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
        return NextResponse.json({ error: 'Erro ao salvar no banco' }, { status: 500 });
    }
}
