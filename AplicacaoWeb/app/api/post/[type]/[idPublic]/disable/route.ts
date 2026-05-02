import { NextResponse } from 'next/server';
import { getServerSession } from '@/src/utils/auth';
import { prisma } from '@/src/database/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ type: string; idPublic: string }> }, // <-- P maiúsculo aqui
) {
    try {
        const body = await request.json();
        const { reason } = body;

        if (!reason || reason.trim().length < 5) {
            return NextResponse.json(
                { error: 'Motivo detalhado é obrigatório (mínimo de 5 caracteres)' },
                { status: 400 },
            );
        }

        const session = await getServerSession();
        const currentUserId = session?.user?.id;

        if (!currentUserId) {
            return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
        }

        // Verifica privilegios
        const currentUserDb = await prisma.user.findUnique({
            where: { id: currentUserId },
            select: { isSuperAdmin: true, isAdmin: true },
        });

        if (!currentUserDb || (!currentUserDb.isAdmin && !currentUserDb.isSuperAdmin)) {
            return NextResponse.json({ error: 'Acesso Negado.' }, { status: 403 });
        }

        const resolvedParams = await params;
        const { type, idPublic } = resolvedParams;

        await prisma.$transaction(async (tx) => {
            let targetPostId = idPublic;

            if (type === 'regra') {
                const post = await tx.rule.update({
                    where: { idPublic: idPublic },
                    data: { isDisabled: true },
                    select: { id: true },
                });

                targetPostId = post.id;
            } else if (type === 'duvida') {
                const post = await tx.question.update({
                    where: { idPublic: idPublic },
                    data: { isDisabled: true },
                    select: { id: true },
                });
                targetPostId = post.id;
            }

            // Salva o Log
            await tx.adminLog.create({
                data: {
                    action: `DISABLE_POST_${type.toUpperCase()}`,
                    reason: reason,
                    targetId: targetPostId,
                    adminId: currentUserId,
                },
            });
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro na rota central de disable:', error);
        return NextResponse.json({ error: 'Erro ao desabilitar publicação' }, { status: 500 });
    }
}
