import Menu from '@/src/features/menu/page';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full bg-background text-text overflow-hidden">
            <Menu />
            <main id="main-content" className="flex-1 h-full overflow-y-auto relative">
                <div className="w-full min-h-full pt-14 pb-20 sm:pt-0 sm:pb-0">{children}</div>
            </main>
        </div>
    );
}
