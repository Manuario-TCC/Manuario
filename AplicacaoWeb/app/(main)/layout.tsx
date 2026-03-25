import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Manuario - Principal',
    description: 'Sistema',
};

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="w-full min-h-screen bg-background text-text antialiased">
            <main className="relative z-10 flex flex-col min-h-screen">{children}</main>
        </div>
    );
}
