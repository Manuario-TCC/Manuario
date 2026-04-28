import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { getAuthUserId } from '@/src/utils/auth';
import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = await getAuthUserId();
        if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

        const resolvedParams = await params;
        const manualOriginalId = resolvedParams.id;

        // Busca o manual e todas as regras
        const manualOriginal = await prisma.manual.findUnique({
            where: { id: manualOriginalId },
            include: { regras: true },
        });

        if (!manualOriginal)
            return NextResponse.json({ error: 'Manual não encontrado' }, { status: 404 });

        // Cria o Manual Clone
        const novoManual = await prisma.manual.create({
            data: {
                name: `${manualOriginal.name} (Meu Clone)`,
                game: manualOriginal.game || '',
                genero: manualOriginal.genero || '',
                tempoJogo: manualOriginal.tempoJogo || 0,
                minPlayers: manualOriginal.minPlayers || 0,
                maxPlayers: manualOriginal.maxPlayers || 0,
                descricao: manualOriginal.descricao || '',
                idade: manualOriginal.idade || '',
                edicao: manualOriginal.edicao || '',
                tipo: manualOriginal.tipo || '',
                sistema: manualOriginal.sistema,
                imgBanner: manualOriginal.imgBanner,
                imgLogo: manualOriginal.imgLogo,
                isOficial: false,
                userId: userId,
                clonadoDeId: manualOriginal.id,
                historicoClones: manualOriginal.historicoClones
                    ? [...manualOriginal.historicoClones, manualOriginal.id]
                    : [manualOriginal.id],
            },
        });

        // Copiar imagens
        try {
            const originalFolder = path.join(
                process.cwd(),
                'public',
                'upload',
                'manual',
                manualOriginal.idPublic,
                'img',
            );
            const newFolder = path.join(
                process.cwd(),
                'public',
                'upload',
                'manual',
                novoManual.idPublic,
                'img',
            );

            // Cria a nova pasta do clone
            await fs.mkdir(newFolder, { recursive: true });

            if (manualOriginal.imgBanner) {
                const bannerSrc = path.join(originalFolder, manualOriginal.imgBanner);
                const bannerDest = path.join(newFolder, manualOriginal.imgBanner);

                if (existsSync(bannerSrc)) {
                    await fs.copyFile(bannerSrc, bannerDest);
                }
            }

            // Copia o arquivo de logo
            if (manualOriginal.imgLogo) {
                const logoSrc = path.join(originalFolder, manualOriginal.imgLogo);
                const logoDest = path.join(newFolder, manualOriginal.imgLogo);

                if (existsSync(logoSrc)) {
                    await fs.copyFile(logoSrc, logoDest);
                }
            }
        } catch (fsError) {}

        // AClona as Regras
        if (manualOriginal.regras && manualOriginal.regras.length > 0) {
            const regrasParaClonar = manualOriginal.regras.map((regra) => ({
                idPublic: crypto.randomUUID(),
                name: regra.name,
                description: regra.description,
                status: 'CLONADO',
                isHouseRule: regra.isHouseRule,
                userId: userId,
                manualOrigemId: regra.id,
                manualIds: [novoManual.id],
            }));

            // Salva todas as regras no banco
            await prisma.regra.createMany({
                data: regrasParaClonar,
            });
        }

        return NextResponse.json({ success: true, manualId: novoManual.idPublic }, { status: 201 });
    } catch (error) {
        console.error('Erro ao clonar manual:', error);
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
    }
}
