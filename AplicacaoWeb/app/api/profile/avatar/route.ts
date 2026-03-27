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
        const avatar = formData.get('avatar') as File | null;

        if (!avatar) {
            return NextResponse.json({ error: 'Imagem não fornecida' }, { status: 400 });
        }

        const uploadDir = path.join(process.cwd(), 'public', 'upload', dbUser.idPublico, 'user');
        await fs.mkdir(uploadDir, { recursive: true });

        // Deletar a imagem antiga
        if (dbUser.img) {
            const oldImagePath = path.join(uploadDir, dbUser.img);
            try {
                await fs.access(oldImagePath);
                await fs.unlink(oldImagePath);
            } catch (err) {
                console.log('Imagem antiga não encontrada ou erro ao deletar:', err);
            }
        }

        const bytes = await avatar.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const ext = avatar.name.split('.').pop() || 'jpg';
        const fileName = `avatar-${Date.now()}.${ext}`;
        const filePath = path.join(uploadDir, fileName);

        await fs.writeFile(filePath, buffer);

        await prisma.user.update({
            where: { id: userId },
            data: { img: fileName },
        });

        return NextResponse.json({ success: true, img: fileName });
    } catch (error) {
        console.error('Erro ao atualizar avatar:', error);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}
