import { NextResponse } from 'next/server';
import { prisma } from '@/src/database/prisma';
import { getAuthUserId } from '@/src/utils/auth';
import bcrypt from 'bcryptjs';

export async function PATCH(req: Request) {
    try {
        const userId = await getAuthUserId();
        if (!userId) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const { name, email, password, bio, links } = await req.json();

        const updateData: {
            name?: string;
            email?: string;
            password?: string;
            bio?: string;
            links?: { name: string; url: string }[];
        } = {};

        // Validação do Nome
        if (name !== undefined) {
            if (name.trim().length < 2) {
                return NextResponse.json({ error: 'Nome inválido' }, { status: 400 });
            }
            updateData.name = name.trim();
        }

        // Validação do E-mail
        if (email !== undefined) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 });
            }

            const existingEmail = await prisma.user.findUnique({
                where: { email: email.trim() },
            });

            if (existingEmail && existingEmail.id !== userId) {
                return NextResponse.json(
                    { error: 'Este e-mail já está em uso por outra conta' },
                    { status: 400 },
                );
            }

            updateData.email = email.trim();
        }

        // Validação da Senha
        if (password) {
            if (password.length < 8) {
                return NextResponse.json(
                    { error: 'A senha deve ter no mínimo 8 caracteres' },
                    { status: 400 },
                );
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        // Validacao da Bio
        if (bio !== undefined) {
            if (bio.length > 150) {
                return NextResponse.json(
                    { error: 'A bio deve ter no máximo 150 caracteres.' },
                    { status: 400 },
                );
            }
            updateData.bio = bio;
        }

        // Atribuição dos Links
        if (links !== undefined) {
            updateData.links = links;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'Nenhum dado para atualizar' }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: userId },
            data: updateData,
        });

        return NextResponse.json({ message: 'Perfil atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        return NextResponse.json({ error: 'Erro ao atualizar perfil' }, { status: 500 });
    }
}
