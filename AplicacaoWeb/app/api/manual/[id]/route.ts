import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;

        const manual = await prisma.manual.findUnique({
            where: { idPublic: id },
            include: {
                user: {
                    select: { idPublic: true, name: true, img: true },
                },
                contributors: {
                    select: {
                        id: true,
                        idPublic: true,
                        name: true,
                        email: true,
                        img: true,
                    },
                },
                rules: true,
            },
        });

        if (!manual) {
            return NextResponse.json({ error: 'Manual não encontrado' }, { status: 404 });
        }

        let manualFinal: any = { ...manual };

        if (manual.clonedFromId) {
            const manualOriginal = await prisma.manual.findUnique({
                where: { id: manual.clonedFromId },
                select: {
                    user: {
                        select: { name: true, idPublic: true },
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

        // Tratando os contribuidores
        const contributorsStr = formData.get('contributors') as string;
        let contributorIds: string[] = [];
        if (contributorsStr) {
            try {
                contributorIds = JSON.parse(contributorsStr);
            } catch (e) {
                console.error('Erro ao ler contribuidores', e);
            }
        }

        let updateData: any = {
            name: title,
            game: game,
            genre: genre || 'Geral',
            system: system,
            type: type,
            edition: edition,
            ageRange: ageRating,
            description: description,
            contributorIds: contributorIds,
        };

        if (!isNaN(playtime)) {
            updateData.playTime = playtime;
        }

        if (!isNaN(minPlayers)) {
            updateData.minPlayers = minPlayers;
        }

        if (!isNaN(maxPlayers)) {
            updateData.maxPlayers = maxPlayers;
        }

        const manualExistente = await prisma.manual.findUnique({
            where: { idPublic: id },
            select: {
                user: {
                    select: { idPublic: true },
                },
            },
        });

        if (!manualExistente || !manualExistente.user) {
            return NextResponse.json({ error: 'Manual não encontrado.' }, { status: 404 });
        }

        const userIdPublic = manualExistente.user.idPublic;

        const bannerFile = formData.get('banner') as File | null;
        const logoFile = formData.get('logo') as File | null;

        const uploadDir = path.join(
            process.cwd(),
            'public',
            'upload',
            'manual',
            userIdPublic,
            'img',
        );

        if ((bannerFile && bannerFile.size > 0) || (logoFile && logoFile.size > 0)) {
            await mkdir(uploadDir, { recursive: true });
        }

        if (bannerFile && bannerFile.size > 0) {
            const bytes = await bannerFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const fileExtension = path.extname(bannerFile.name);
            const bannerName = `banner-${Date.now()}${fileExtension}`;
            await writeFile(path.join(uploadDir, bannerName), buffer);
            updateData.imgBanner = bannerName;
        }

        if (logoFile && logoFile.size > 0) {
            const bytes = await logoFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const fileExtension = path.extname(logoFile.name);
            const logoName = `logo-${Date.now()}${fileExtension}`;
            await writeFile(path.join(uploadDir, logoName), buffer);
            updateData.imgLogo = logoName;
        }

        const manualAtualizado = await prisma.manual.update({
            where: { idPublic: id },
            data: updateData,
        });

        return NextResponse.json(manualAtualizado);
    } catch (error) {
        console.error('Erro ao atualizar manual:', error);
        return NextResponse.json({ error: 'Erro ao atualizar manual' }, { status: 500 });
    }
}
