'use client';

import { useRouter } from 'next/navigation';
import { CustomInput } from '@/src/components/CustomInput';
import { useAuth } from '@/src/hooks/useAuth';

export function AuthForm() {
    const router = useRouter();

    const {
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
    } = useAuth();

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md p-10 bg-card backdrop-blur-sm border border-card-border rounded-[32px] shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-text tracking-tight mb-2">
                        {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
                    </h1>
                    <p className="text-sub-text text-sm">
                        Comece sua jornada nos jogos de tabuleiro
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <CustomInput
                            id="name"
                            label="Nome"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required={!isLogin}
                            disabled={isLoading}
                        />
                    )}

                    <CustomInput
                        id="email"
                        label="E-mail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        error={emailError}
                    />

                    <CustomInput
                        id="password"
                        label="Senha"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        error={passwordError}
                    />

                    <button
                        type="submit"
                        disabled={isLoading || !canSubmit}
                        className="w-full bg-primary hover:bg-primary-hover text-text font-semibold rounded-xl px-4 py-3 mt-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isLoading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Criar conta'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-sub-text">
                    {isLogin ? 'Ainda não tem uma conta? ' : 'Já tem uma conta? '}
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={() => router.push(isLogin ? '/signup' : '/login')}
                        className="text-primary hover:text-primary-light underline-offset-4 hover:underline transition-colors disabled:opacity-50 cursor-pointer bg-transparent border-none p-0 inline"
                    >
                        {isLogin ? 'Crie uma agora' : 'Faça login'}
                    </button>
                </div>
            </div>
        </div>
    );
}
