import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { prisma } from '@/src/database/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'E-mail e senha são obrigatórios.' },
                { status: 400 },
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: 'Credenciais inválidas.' }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Credenciais inválidas.' }, { status: 401 });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', {
            expiresIn: '1d',
        });

        const cookieStore = await cookies();
        cookieStore.set('manuario_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 dias
            path: '/',
        });

        return NextResponse.json({ message: 'Login realizado com sucesso' }, { status: 200 });
    } catch (error) {
        console.error('Erro no login:', error);
        return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
    }
}
