import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/src/components/Providers';

export const metadata: Metadata = {
    title: 'Manuario',
    description: 'Sua jornada nos jogos de tabuleiro',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <body className="min-h-full flex flex-col" suppressHydrationWarning>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
