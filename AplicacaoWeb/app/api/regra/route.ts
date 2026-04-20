import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, manualId, isHouseRule, userId, publicationId, status } = body;

        if (!manualId) {
            return NextResponse.json(
                { error: 'É obrigatório vincular a regra a um manual.' },
                { status: 400 },
            );
        }

        if (!name || !description || !userId) {
            return NextResponse.json(
                { error: 'Nome, descrição (MD) e usuário são obrigatórios.' },
                { status: 400 },
            );
        }

        // Salvar no banco
        const novaRegra = await prisma.regra.create({
            data: {
                idPublic: publicationId,
                name,
                description,
                status: status || 'PUBLICADO',
                isHouseRule: isHouseRule || false,
                manual: {
                    connect: { id: manualId },
                },
                user: {
                    connect: { idPublico: userId },
                },
            },
        });

        return NextResponse.json(novaRegra, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar regra:', error);
        return NextResponse.json(
            { error: 'Erro interno no servidor ao tentar criar a regra.' },
            { status: 500 },
        );
    }
}
