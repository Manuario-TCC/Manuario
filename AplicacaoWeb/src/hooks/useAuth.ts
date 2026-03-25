import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { authService } from '../services/authService';

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

            Swal.fire({
                icon: 'success',
                title: isLogin ? 'Login realizado!' : 'Conta criada!',
                text: 'Redirecionando...',
                background: '#1a1625',
                color: '#ffffff',
                confirmButtonColor: '#8b5cf6',
                timer: 1500,
                showConfirmButton: false,
            }).then(() => {
                router.push('/chat');
            });
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Acesso negado',
                text: error.message,
                background: '#1a1625',
                color: '#ffffff',
                confirmButtonColor: '#8b5cf6',
            });
        } finally {
            setIsLoading(false);
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
    };
}
