import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { getServerSession } from '@/src/utils/auth';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const postId = searchParams.get('postId');
        const postType = searchParams.get('postType');

        if (!postId) return NextResponse.json({ error: 'PostId não fornecido' }, { status: 400 });

        const where: any = { parentId: null };

        if (postType === 'regra') {
            where.regraId = postId;
        } else if (postType === 'duvida') {
            where.duvidaId = postId;
        }

        const comentarios = await prisma.comentario.findMany({
            where,
            orderBy: { criadoEm: 'desc' },
            include: {
                autor: {
                    select: {
                        id: true,
                        idPublico: true,
                        name: true,
                        img: true,
                    },
                },
                respostas: {
                    include: {
                        autor: {
                            select: {
                                id: true,
                                idPublico: true,
                                name: true,
                                img: true,
                            },
                        },
                        respostas: {
                            include: {
                                autor: true,
                            },
                        },
                    },
                    orderBy: { criadoEm: 'asc' },
                },
            },
        });

        return NextResponse.json(comentarios);
    } catch (error) {
        console.error('Erro ao buscar comentários:', error);
        return NextResponse.json({ error: 'Erro ao buscar comentários' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession();

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const { texto, postId, postType, parentId } = await req.json();

        const data: any = {
            texto,
            autorId: session.user.id,
            parentId: parentId || null,
        };

        if (postType === 'regra') {
            data.regraId = postId;
        } else {
            data.duvidaId = postId;
        }

        const novoComentario = await prisma.comentario.create({ data });
        return NextResponse.json(novoComentario, { status: 201 });
    } catch (error) {
        console.error('Erro ao postar comentário:', error);
        return NextResponse.json({ error: 'Erro ao postar' }, { status: 500 });
    }
}
