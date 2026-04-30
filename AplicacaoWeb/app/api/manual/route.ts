import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { getAuthUserId } from '@/src/utils/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const userId = await getAuthUserId();
        if (!userId) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const formData = await req.formData();

        const title = formData.get('title') as string;
        const game = formData.get('game') as string;
        const genre = formData.get('genre') as string | null;
        const system = formData.get('system') as string | null;

        const type = formData.get('type') as string;
        const edition = formData.get('edition') as string;
        const ageRating = formData.get('ageRating') as string;
        const description = formData.get('description') as string;

        const playtime = parseInt(formData.get('playtime') as string, 10);
        const minPlayers = parseInt(formData.get('minPlayers') as string, 10);
        const maxPlayers = parseInt(formData.get('maxPlayers') as string, 10);

        // Array de Contribuidores
        const contributorsStr = formData.get('contributors') as string;
        let contributorIds: string[] = [];
        if (contributorsStr) {
            try {
                contributorIds = JSON.parse(contributorsStr);
            } catch (e) {
                console.error('Erro ao ler contribuidores', e);
            }
        }

        const bannerFile = formData.get('banner') as File | null;
        const logoFile = formData.get('logo') as File | null;

        if (!title || !game || !type || !edition || !ageRating || !description) {
            return NextResponse.json(
                { error: 'Preencha todos os campos obrigatórios.' },
                { status: 400 },
            );
        }

        const manualIdPublic = crypto.randomUUID();

        const uploadDir = path.join(
            process.cwd(),
            'public',
            'upload',
            'manual',
            manualIdPublic,
            'img',
        );

        await mkdir(uploadDir, { recursive: true });

        // Salvar a img do Banner
        let bannerName = null;
        if (bannerFile && bannerFile.size > 0) {
            const bytes = await bannerFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const fileExtension = path.extname(bannerFile.name);
            bannerName = `banner-${Date.now()}${fileExtension}`;
            const filePath = path.join(uploadDir, bannerName);
            await writeFile(filePath, buffer);
        }

        // Salvar a img do Logo
        let logoName = null;
        if (logoFile && logoFile.size > 0) {
            const bytes = await logoFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const fileExtension = path.extname(logoFile.name);
            logoName = `logo-${Date.now()}${fileExtension}`;
            const filePath = path.join(uploadDir, logoName);
            await writeFile(filePath, buffer);
        }

        const novoManual = await prisma.manual.create({
            data: {
                idPublic: manualIdPublic,
                name: title,
                game: game,
                genre: genre || 'Geral',
                system: system,
                type: type,
                edition: edition,
                ageRange: ageRating,
                description: description,
                playTime: isNaN(playtime) ? 1 : playtime,
                minPlayers: isNaN(minPlayers) ? 1 : minPlayers,
                maxPlayers: isNaN(maxPlayers) ? 1 : maxPlayers,
                contributorIds: contributorIds,
                imgBanner: bannerName,
                imgLogo: logoName,
                userId: userId,
            },
        });

        return NextResponse.json(
            {
                message: 'Manual criado com sucesso',
                manual: novoManual,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error('Erro ao criar manual:', error);
        return NextResponse.json({ error: 'Erro interno ao criar manual' }, { status: 500 });
    }
}
