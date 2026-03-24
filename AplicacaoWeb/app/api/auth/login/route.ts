import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/src/database/prisma';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

        return NextResponse.json(
            {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                },
            },
            { status: 200 },
        );
    } catch (error) {
        console.error('Erro no login:', error);
        return NextResponse.json({ message: 'Erro no servidor' }, { status: 500 });
    }
}
