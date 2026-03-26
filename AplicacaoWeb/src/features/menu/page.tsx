'use client';

import { HeaderMenu } from './components/HeaderMenu';
import { NavLinks } from './components/NavLinks';
import { FooterMenu } from './components/FooterMenu';
import { useMenuUser } from './hooks/useMenuUser';
import { useMenuUI } from './hooks/useMenuUI';

export default function Menu() {
    const { user, loading } = useMenuUser();
    const { isOpen, toggleMenu, closeMenu } = useMenuUI();

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={closeMenu}
                />
            )}

            {!isOpen && (
                <button
                    onClick={toggleMenu}
                    className="fixed top-2 left-2 z-40 p-2 bg-surface border border-surface-border rounded-lg text-text-muted hover:text-text sm:hidden shadow-lg transition-colors"
                    aria-label="Abrir Menu"
                >
                    <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            )}

            <aside
                className={`
                    fixed top-0 left-0 h-screen bg-surface border-r border-surface-border z-50
                    transition-all duration-300 ease-in-out flex flex-col

                    ${isOpen ? 'translate-x-0 w-[80%] shadow-2xl' : '-translate-x-full w-[80%]'}

                    sm:translate-x-0 ${!isOpen ? 'sm:w-24' : 'sm:w-[20rem]'}

                    lg:w-[20%] lg:min-w-[14rem] lg:max-w-[18rem] lg:relative lg:translate-x-0 lg:shadow-none
                `}
            >
                <div
                    className={`lg:hidden p-2 flex items-center shrink-0 h-14 transition-all duration-300 ${isOpen ? 'justify-end pr-4' : 'justify-center'}`}
                >
                    <button
                        onClick={toggleMenu}
                        className="text-text-muted hover:text-text p-1 focus:outline-none transition-colors cursor-pointer"
                        aria-label={isOpen ? 'Fechar Menu' : 'Abrir Menu'}
                    >
                        <svg
                            className="size-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                <HeaderMenu user={user} loading={loading} isOpen={isOpen} />
                <div className="border-t border-surface-border mx-4"></div>
                <NavLinks isOpen={isOpen} closeMenu={closeMenu} />
                <FooterMenu isOpen={isOpen} />
            </aside>
        </>
    );
}
