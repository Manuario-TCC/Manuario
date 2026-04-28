'use client';

import { NavLinks } from './components/NavLinks';
import { FooterMenu } from './components/FooterMenu';
import { useSession } from '@/src/hooks/useSession';
import { useMenuUI } from './hooks/useMenuUI';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, Library, MessageSquare, PlusSquare } from 'lucide-react';

export default function Menu() {
    const { user, loading } = useSession();
    const { isOpen, toggleMenu, closeMenu } = useMenuUI();
    const pathname = usePathname();

    const getMobileLinkClass = (path: string) => {
        const isActive = pathname?.startsWith(path);
        return `p-2 flex flex-col items-center justify-center gap-1 min-w-[4rem] rounded-xl transition-all duration-200 ${
            isActive
                ? 'bg-gray text-text font-medium'
                : 'text-sub-text hover:text-text hover:bg-background'
        }`;
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 block lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={closeMenu}
                />
            )}

            <div className="hidden sm:block lg:hidden w-20 shrink-0 transition-none" />

            <aside
                className={`
                    top-0 left-0 h-screen bg-card border-r border-card-border z-50
                    transition-all duration-300 ease-in-out flex flex-col
                    hidden sm:flex
                    fixed lg:relative lg:shrink-0
                    ${isOpen ? 'translate-x-0 w-[15rem] shadow-2xl' : '-translate-x-0 w-20'}
                    lg:w-[15%] lg:min-w-[14rem] lg:max-w-[16rem] lg:translate-x-0 lg:shadow-none
                `}
            >
                <div
                    className={`transition-all duration-300 flex items-center justify-between p-6 ${!isOpen ? 'justify-center p-4' : ''}`}
                >
                    <div
                        className={`text-xl font-bold whitespace-nowrap transition-all ${!isOpen ? 'opacity-0 hidden lg:block lg:opacity-100' : 'opacity-100 block'}`}
                    >
                        Manuario
                    </div>

                    <button
                        onClick={toggleMenu}
                        className={`text-sub-text hover:text-text p-2 focus:outline-none transition-colors cursor-pointer lg:hidden ${!isOpen ? 'mx-auto' : ''}`}
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

            <nav className="sm:hidden fixed bottom-0 left-0 w-full bg-card border-t border-card-border flex items-center justify-around z-[100] pb-safe px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                <Link href="/procurar" className={getMobileLinkClass('/procurar')}>
                    <Search size={22} />
                    <span className="text-[0.625rem]">Buscar</span>
                </Link>

                <Link href="/feed" className={getMobileLinkClass('/feed')}>
                    <Library size={22} />
                    <span className="text-[0.625rem]">Feed</span>
                </Link>

                <Link href="/chat" className={getMobileLinkClass('/chat')}>
                    <MessageSquare size={22} />
                    <span className="text-[0.625rem]">Chat</span>
                </Link>

                <Link href="/criar" className={getMobileLinkClass('/criar')}>
                    <PlusSquare size={22} />
                    <span className="text-[0.625rem]">Criar</span>
                </Link>

                <Link href={`/perfil/${user?.idPublic}`} className={getMobileLinkClass('/perfil')}>
                    {user?.img ? (
                        <div
                            className={`relative size-7 rounded-full overflow-hidden bg-card border ${pathname?.startsWith('/perfil') ? 'border-text' : 'border-card-border'}`}
                        >
                            <Image
                                src={user.img}
                                alt="Perfil"
                                fill
                                sizes="28px"
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="size-7 rounded-full bg-card-border"></div>
                    )}
                    <span className="text-[0.625rem]">Perfil</span>
                </Link>
            </nav>
        </>
    );
}
