import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
    title: 'Manuario - Login',
    description: 'Acesse sua conta',
};

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div
            className="
                relative w-full min-h-screen text-text antialiased
                before:absolute before:inset-0
                before:bg-[url('/img/background.jpg')]
                before:bg-cover before:bg-center before:bg-no-repeat
                before:content-['']
            "
        >
            <div className="absolute inset-0 bg-black/70" />
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-transparent to-black/80" />

            <div className="relative z-10">{children}</div>
        </div>
    );
}
