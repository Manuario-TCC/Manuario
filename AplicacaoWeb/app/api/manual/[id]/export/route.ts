import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const idPublic = resolvedParams.id;

        const manual = await prisma.manual.findUnique({
            where: { idPublic },
            include: {
                user: {
                    select: { name: true },
                },
                rules: {
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        if (!manual) {
            return NextResponse.json({ error: 'Manual não encontrado' }, { status: 404 });
        }

        return NextResponse.json(manual);
    } catch (error) {
        console.error('Erro ao exportar manual:', error);
        return NextResponse.json({ error: 'Erro ao gerar dados de exportação' }, { status: 500 });
    }
}
