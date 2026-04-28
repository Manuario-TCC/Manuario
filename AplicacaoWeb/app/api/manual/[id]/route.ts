import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;

        const manual = await prisma.manual.findUnique({
            where: { idPublic: id },
            include: {
                user: {
                    select: { idPublico: true, name: true, img: true },
                },
                contribuidores: {
                    select: {
                        id: true,
                        idPublico: true,
                        name: true,
                        email: true,
                        img: true,
                    },
                },
                regras: true,
            },
        });

        if (!manual) {
            return NextResponse.json({ error: 'Manual não encontrado' }, { status: 404 });
        }

        let manualFinal: any = { ...manual };

        if (manual.clonadoDeId) {
            const manualOriginal = await prisma.manual.findUnique({
                where: { id: manual.clonadoDeId },
                select: {
                    user: {
                        select: { name: true, idPublico: true },
                    },
                },
            });

            if (manualOriginal) {
                manualFinal.clonadoDe = {
                    user: manualOriginal.user,
                };
            }
        }

        return NextResponse.json(manualFinal);
    } catch (error) {
        console.error('ERRO NA API DE MANUAL:', error);

        return NextResponse.json(
            { error: 'Erro ao buscar manual. Verifique o terminal para mais detalhes.' },
            { status: 500 },
        );
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        const body = await req.json();

        const manualAtualizado = await prisma.manual.update({
            where: { idPublic: id },
            data: {
                name: body.title || body.name,
                game: body.game,
                genero: body.genre || body.genero,
                sistema: body.system || body.sistema,
                imgBanner: body.imgBanner,
                imgLogo: body.imgLogo,
            },
        });

        return NextResponse.json(manualAtualizado);
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao atualizar manual' }, { status: 500 });
    }
}
