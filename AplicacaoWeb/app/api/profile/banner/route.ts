import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { promises as fs } from 'fs';
import path from 'path';
import { getAuthUserId } from '@/src/utils/auth';

export async function PATCH(request: Request) {
    try {
        const userId = await getAuthUserId();

        if (!userId) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({ where: { id: userId } });

        if (!dbUser) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        const formData = await request.formData();
        const banner = formData.get('banner') as File | null;

        if (!banner) {
            return NextResponse.json({ error: 'Imagem não fornecida' }, { status: 400 });
        }

        const uploadDir = path.join(process.cwd(), 'public', 'upload', dbUser.idPublico, 'user');
        await fs.mkdir(uploadDir, { recursive: true });

        // Deletar o banner antigo
        if (dbUser.banner) {
            const oldBannerPath = path.join(uploadDir, dbUser.banner);
            try {
                await fs.access(oldBannerPath);
                await fs.unlink(oldBannerPath);
            } catch (err) {
                console.log('Banner antigo não encontrado ou erro ao deletar:', err);
            }
        }

        const bytes = await banner.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const ext = banner.name.split('.').pop() || 'png';
        const fileName = `banner-${Date.now()}.${ext}`;
        const filePath = path.join(uploadDir, fileName);

        await fs.writeFile(filePath, buffer);

        await prisma.user.update({
            where: { id: userId },
            data: { banner: fileName },
        });

        return NextResponse.json({ success: true, banner: fileName });
    } catch (error) {
        console.error('Erro ao atualizar banner:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
