import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { getAuthUserId } from '@/src/utils/auth';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';

export async function PATCH(req: Request) {
    try {
        const userId = await getAuthUserId();
        if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { idPublic: true, banner: true },
        });

        if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

        const uploadDir = path.join(process.cwd(), 'public', 'upload', user.idPublic, 'user');

        // Deleta antigo
        if (user.banner) {
            const oldBannerPath = path.join(uploadDir, user.banner);
            try {
                await unlink(oldBannerPath);
                console.log('Banner antigo deletado:', user.banner);
            } catch (err) {
                console.warn('Aviso: Banner antigo não encontrado no disco para deletar.');
            }
        }

        // Salva novo banner
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileExtension = path.extname(file.name);
        const fileName = `banner-${Date.now()}${fileExtension}`;

        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);

        await prisma.user.update({
            where: { id: userId },
            data: { banner: fileName },
        });

        return NextResponse.json({
            message: 'Banner atualizado',
            url: `/upload/${user.idPublic}/user/${fileName}`,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro interno ao salvar banner' }, { status: 500 });
    }
}
