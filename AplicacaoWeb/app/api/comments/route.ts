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

        if (postType === 'regra' || postType === 'rule' || postType === 'rules') {
            where.ruleId = postId;
        } else if (postType === 'duvida' || postType === 'question') {
            where.questionId = postId;
        }

        const comments = await prisma.comment.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: {
                        id: true,
                        idPublic: true,
                        name: true,
                        img: true,
                    },
                },
                replies: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                idPublic: true,
                                name: true,
                                img: true,
                            },
                        },
                        replies: {
                            include: {
                                author: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'asc' },
                },
            },
        });

        return NextResponse.json(comments);
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

        const { texto, text, postId, postType, parentId } = await req.json();

        const data: any = {
            text: text || texto,
            authorId: session.user.id,
            parentId: parentId || null,
        };

        if (postType === 'regra' || postType === 'rule' || postType === 'rules') {
            data.ruleId = postId;
        } else {
            data.questionId = postId;
        }

        const novoComentario = await prisma.comment.create({ data });
        return NextResponse.json(novoComentario, { status: 201 });
    } catch (error) {
        console.error('Erro ao postar comentário:', error);
        return NextResponse.json({ error: 'Erro ao postar' }, { status: 500 });
    }
}
