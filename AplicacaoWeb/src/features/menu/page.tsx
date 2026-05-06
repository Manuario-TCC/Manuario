'use client';

import { NavLinks } from './components/NavLinks';
import { FooterMenu } from './components/FooterMenu';
import { useSession } from '@/src/hooks/useSession';
import { useMenuUI } from './hooks/useMenuUI';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, Library, MessageSquare, PlusSquare } from 'lucide-react';
import { MobileHeader } from './components/MobileHeader';

import { useScrollVisibility } from '../../hooks/useScrollVisibility';

export default function Menu() {
    const { user, loading } = useSession();
    const { isOpen, toggleMenu, closeMenu } = useMenuUI();
    const pathname = usePathname();

    const { isVisible } = useScrollVisibility();

    const getMobileLinkClass = (path: string) => {
        const isActive = pathname?.startsWith(path);
        return `flex items-center justify-center size-12 rounded-full transition-all duration-200 ${
            isActive ? 'bg-gray text-text' : 'text-sub-text hover:text-text hover:bg-background'
        }`;
    };

    return (
        <>
            <MobileHeader />

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 block xl:hidden backdrop-blur-sm transition-opacity"
                    onClick={closeMenu}
                />
            )}

            <div className="hidden sm:block xl:hidden w-20 shrink-0 transition-none" />

            <aside
                className={`
                    top-0 left-0 h-screen bg-card border-r border-card-border z-50
                    transition-all duration-300 ease-in-out flex flex-col
                    hidden sm:flex overflow-x-hidden
                    fixed xl:relative xl:shrink-0
                    ${isOpen ? 'translate-x-0 w-[15rem] shadow-2xl' : '-translate-x-0 w-20'}
                    xl:w-[15%] xl:min-w-[14rem] xl:max-w-[16rem] xl:translate-x-0 xl:shadow-none
                `}
            >
                <div
                    className={`transition-all duration-300 flex items-center justify-between p-6 ${!isOpen ? 'justify-center p-4' : ''}`}
                >
                    <div
                        className={`text-xl font-bold whitespace-nowrap transition-all ${!isOpen ? 'opacity-0 hidden xl:block xl:opacity-100' : 'opacity-100 block'}`}
                    >
                        Manuario
                    </div>

                    <button
                        onClick={toggleMenu}
                        className={`text-sub-text hover:text-text p-2 focus:outline-none transition-colors cursor-pointer xl:hidden ${!isOpen ? 'mx-auto' : ''}`}
                        aria-label="Alternar Menu"
                    >
                        <svg
                            className="size-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>

                <NavLinks isOpen={isOpen} closeMenu={closeMenu} />

                <div className="mt-auto border-t border-card-border mx-4 pt-4 pb-4">
                    <FooterMenu user={user} loading={loading} isOpen={isOpen} />
                </div>
            </aside>

            <nav
                className={`sm:hidden fixed bottom-0 left-0 w-full bg-card border-t border-card-border flex items-center justify-around z-[100] pb-safe pt-2 pb-2 px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-transform duration-300 ${
                    isVisible ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
                <Link href="/search" className={getMobileLinkClass('/search')}>
                    <Search size={24} />
                </Link>

                <Link href="/feed" className={getMobileLinkClass('/feed')}>
                    <Library size={24} />
                </Link>

                <Link href="/chat" className={getMobileLinkClass('/chat')}>
                    <MessageSquare size={24} />
                </Link>

                <Link href="/create" className={getMobileLinkClass('/create')}>
                    <PlusSquare size={24} />
                </Link>

                <Link href={`/perfil/${user?.idPublic}`} className={getMobileLinkClass('/perfil')}>
                    {user?.img ? (
                        <div
                            className={`relative size-8 rounded-full overflow-hidden bg-card border ${pathname?.startsWith('/perfil') ? 'border-text' : 'border-card-border'}`}
                        >
                            <Image
                                src={user.img}
                                alt="Perfil"
                                fill
                                sizes="32px"
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="size-8 rounded-full bg-card-border"></div>
                    )}
                </Link>
            </nav>
        </>
    );
}
