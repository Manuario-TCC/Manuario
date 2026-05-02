import { NextResponse } from 'next/server';
import { getServerSession } from '@/src/utils/auth';
import { prisma } from '@/src/database/prisma';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession();
        const currentUserId = session?.user?.id;

        if (!currentUserId) {
            return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
        }

        const currentUserDb = await prisma.user.findUnique({
            where: { id: currentUserId },
            select: { isSuperAdmin: true, isAdmin: true },
        });

        if (!currentUserDb || (!currentUserDb.isAdmin && !currentUserDb.isSuperAdmin)) {
            return NextResponse.json({ error: 'Acesso Negado.' }, { status: 403 });
        }

        const resolvedParams = await params;
        const targetCommentId = resolvedParams.id;

        const comment = await prisma.comment.findUnique({
            where: { id: targetCommentId },
            select: { isValidated: true },
        });

        if (!comment) {
            return NextResponse.json({ error: 'Comentário não encontrado' }, { status: 404 });
        }

        const updatedComment = await prisma.comment.update({
            where: { id: targetCommentId },
            data: { isValidated: !comment.isValidated },
        });

        return NextResponse.json(updatedComment, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao validar comentário' }, { status: 500 });
    }
}
