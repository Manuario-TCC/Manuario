'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authService } from '../services/authService';
import { customAlert } from '@/src/components/customAlert';

export function useAuth() {
    const pathname = usePathname();
    const router = useRouter();

    const isLogin = pathname === '/login';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isPasswordValid = isLogin
        ? password.length > 0
        : password.length >= 8 && /[A-Z]/.test(password);

    const isNameValid = isLogin ? true : name.trim().length > 0;

    const emailError = email.length > 0 && !isEmailValid;
    const passwordError = !isLogin && password.length > 0 && !isPasswordValid;

    const canSubmit = isEmailValid && isPasswordValid && isNameValid;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        setIsLoading(true);

        try {
            await authService.authenticate({
                action: isLogin ? 'login' : 'register',
                name: isLogin ? undefined : name,
                email,
                password,
            });

            customAlert.toastSuccess(isLogin ? 'Login realizado!' : 'Conta criada!');

            router.push('/chat');
        } catch (error: any) {
            customAlert.error('Acesso negado', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();

            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Erro durante o processo de logout:', error);
            customAlert.toastError('Erro ao deslogar da conta');
        }
    };

    return {
        isLogin,
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        handleSubmit,
        emailError,
        passwordError,
        canSubmit,
        logout,
    };
}
