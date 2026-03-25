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

        const response = NextResponse.json(
            {
                user: {
                    id: user.id,
                    name: user.name,
                },
            },
            { status: 200 },
        );

        // Salva o token
        response.cookies.set('manuario_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 dias
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Erro no login:', error);
        return NextResponse.json({ message: 'Erro no servidor' }, { status: 500 });
    }
}
