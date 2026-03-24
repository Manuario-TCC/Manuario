import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/src/database/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Nome, e-mail e senha são obrigatórios.' },
                { status: 400 },
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ message: 'Este e-mail já está em uso.' }, { status: 409 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            {
                message: 'Conta criada com sucesso!',
                user: { id: newUser.id, name: newUser.name, email: newUser.email },
            },
            { status: 201 },
        );
    } catch (error: any) {
        console.error('Erro no cadastro:', error);

        return NextResponse.json(
            { message: 'Erro interno do servidor ao criar a conta.' },
            { status: 500 },
        );
    }
}
