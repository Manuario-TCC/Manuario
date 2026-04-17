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
            select: { idPublico: true, img: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
        }

        const uploadDir = path.join(process.cwd(), 'public', 'upload', user.idPublico, 'user');

        // Deleta img antiga
        if (user.img) {
            const oldImagePath = path.join(uploadDir, user.img);

            try {
                await unlink(oldImagePath);
                console.log('Imagem antiga deletada:', user.img);
            } catch (err) {
                console.warn('Aviso: Imagem antiga não encontrada no disco para deletar.');
            }
        }

        // Salva img nova
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileExtension = path.extname(file.name);
        const fileName = `avatar-${Date.now()}${fileExtension}`;

        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);

        await prisma.user.update({
            where: { id: userId },
            data: { img: fileName },
        });

        return NextResponse.json({
            message: 'Avatar atualizado',
            url: `/upload/${user.idPublico}/user/${fileName}`,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro interno ao salvar imagem' }, { status: 500 });
    }
}
