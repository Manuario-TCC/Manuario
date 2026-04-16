import Menu from '@/src/features/menu/page';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full bg-background text-text overflow-hidden">
            <Menu />

            <main className="flex-1 h-full overflow-y-auto relative">
                <div className="w-full h-full">{children}</div>
            </main>
        </div>
    );
}
