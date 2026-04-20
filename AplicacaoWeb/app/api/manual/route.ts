import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { getAuthUserId } from '@/src/utils/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
    try {
        const userId = await getAuthUserId();
        if (!userId) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { idPublico: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        const formData = await req.formData();

        const title = formData.get('title') as string;
        const game = formData.get('game') as string;
        const genre = formData.get('genre') as string | null;
        const system = formData.get('system') as string | null;

        const bannerFile = formData.get('banner') as File | null;
        const logoFile = formData.get('logo') as File | null;

        if (!title || !game) {
            return NextResponse.json({ error: 'Título e Jogo são obrigatórios' }, { status: 400 });
        }

        const uploadDir = path.join(
            process.cwd(),
            'public',
            'upload',
            'manual',
            user.idPublico,
            'img',
        );

        await mkdir(uploadDir, { recursive: true });

        //salvar a imagem do Banner
        let bannerName = null;

        if (bannerFile && bannerFile.name) {
            const bytes = await bannerFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const fileExtension = path.extname(bannerFile.name);
            bannerName = `banner-${Date.now()}${fileExtension}`;

            const filePath = path.join(uploadDir, bannerName);

            await writeFile(filePath, buffer);
        }

        let logoName = null;

        if (logoFile && logoFile.name) {
            const bytes = await logoFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const fileExtension = path.extname(logoFile.name);
            logoName = `logo-${Date.now()}${fileExtension}`;

            const filePath = path.join(uploadDir, logoName);
            await writeFile(filePath, buffer);
        }

        const novoManual = await prisma.manual.create({
            data: {
                name: title,
                game: game,
                genero: genre,
                sistema: system,
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
