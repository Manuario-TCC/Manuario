'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/src/hooks/useAuth';

interface HeaderMenuProps {
    user: any;
    loading: boolean;
    isOpen: boolean;
}

export function HeaderMenu({ user, loading, isOpen }: HeaderMenuProps) {
    const { logout } = useAuth();

    const containerClasses = `flex items-center h-16 shrink-0 w-full my-2 transition-all duration-300 ${
        isOpen ? 'px-4 justify-start' : 'justify-center px-0 lg:px-4 lg:justify-start'
    }`;

    const textContainerClasses = `whitespace-nowrap transition-all duration-300 ease-in-out flex flex-col justify-center overflow-hidden ${
        isOpen ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0 lg:max-w-[200px] lg:opacity-100'
    }`;

    const logoutBtnClasses = `absolute right-4 p-2 rounded-lg text-text-muted hover:text-white hover:bg-zinc-800 shrink-0 transition-all duration-300 ease-in-out z-20 cursor-pointer ${
        isOpen
            ? 'opacity-100 delay-150 pointer-events-auto'
            : 'opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto lg:delay-0'
    }`;

    if (loading)
        return (
            <div className={containerClasses}>
                <div className="size-10 bg-surface-border animate-pulse rounded-full shrink-0"></div>
                <div className={`space-y-2 ${textContainerClasses}`}>
                    <div className="h-3 bg-surface-border animate-pulse rounded w-2/3"></div>
                    <div className="h-2 bg-surface-border animate-pulse rounded w-1/2"></div>
                </div>
            </div>
        );

    if (!user) return null;

    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className={`relative ${containerClasses}`}>
            <Link
                href={`/perfil/${user.idPublico}`}
                className={`flex items-center transition-all duration-300 group z-10 ${
                    isOpen ? 'gap-3' : 'gap-0 lg:gap-3'
                }`}
            >
                <div className="relative size-10 rounded-full overflow-hidden bg-surface shrink-0 border border-surface-border transition-colors group-hover:border-accent">
                    <Image
                        src={user.img}
                        alt={`Perfil de ${user.name}`}
                        fill
                        sizes="40px"
                        className="object-cover"
                    />
                </div>

                <div className={textContainerClasses}>
                    <p className="text-base font-semibold text-text truncate">{user.name}</p>
                    <p className="text-sm text-text-muted truncate mt-[-2px]">Ver perfil</p>
                </div>
            </Link>

            <button onClick={handleLogout} className={logoutBtnClasses} aria-label="Sair da conta">
                <LogOut className="size-5" strokeWidth={1.5} />
            </button>
        </div>
    );
}
