import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/src/database/prisma';
import { randomUUID } from 'crypto';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Preencha todos os campos.' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'E-mail já está em uso.' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Id pulbico
        const shortIdPublic = nanoid(10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                idPublic: shortIdPublic,
            },
        });

        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(userWithoutPassword, { status: 201 });
    } catch (error) {
        console.error('Erro no signup:', error);
        return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
    }
}
