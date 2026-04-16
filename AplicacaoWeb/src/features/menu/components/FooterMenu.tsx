'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/src/hooks/useAuth';

interface FooterMenuProps {
    user: any;
    loading: boolean;
    isOpen: boolean;
}

export function FooterMenu({ user, loading, isOpen }: FooterMenuProps) {
    const { logout } = useAuth();

    const containerClasses = `relative flex items-center h-16 shrink-0 w-full transition-all duration-300 ${
        isOpen ? 'px-2' : 'px-0 justify-center min-[900px]:justify-start min-[900px]:px-2'
    }`;

    const textContainerClasses = `flex flex-col justify-center overflow-hidden transition-all duration-300 ${
        isOpen
            ? 'opacity-100 ml-3 w-auto block'
            : 'opacity-0 w-0 hidden ml-0 min-[900px]:opacity-100 min-[900px]:w-auto min-[900px]:ml-3 min-[900px]:block'
    }`;

    const logoutBtnClasses = `absolute right-2 p-2 rounded-lg text-sub-text hover:text-red-500 hover:bg-zinc-800 shrink-0 z-20 cursor-pointer transition-all duration-300 ${
        isOpen
            ? 'opacity-100 pointer-events-auto block'
            : 'opacity-0 hidden pointer-events-none min-[900px]:opacity-100 min-[900px]:pointer-events-auto min-[900px]:block'
    }`;

    if (loading)
        return (
            <div className={containerClasses}>
                <div className="size-10 bg-card-border animate-pulse rounded-full shrink-0"></div>
                <div className={textContainerClasses}>
                    <div className="h-3 bg-card-border animate-pulse rounded w-24 mb-2"></div>
                    <div className="h-2 bg-card-border animate-pulse rounded w-16"></div>
                </div>
            </div>
        );

    if (!user) return null;

    return (
        <div className={containerClasses}>
            <Link
                href={`/perfil/${user.idPublico}`}
                className={`flex items-center group z-10 w-full overflow-hidden transition-all duration-300 ${
                    isOpen ? 'justify-start' : 'justify-center min-[900px]:justify-start'
                }`}
            >
                <div className="relative size-10 rounded-full overflow-hidden bg-card shrink-0 border border-card-border transition-colors group-hover:border-accent">
                    <Image
                        src={user.img}
                        alt={`Perfil de ${user.name}`}
                        fill
                        sizes="40px"
                        className="object-cover"
                    />
                </div>

                <div className={textContainerClasses}>
                    <p className="text-base font-semibold text-text whitespace-nowrap overflow-hidden text-ellipsis">
                        {user.name}
                    </p>
                    <p className="text-sm text-sub-text whitespace-nowrap mt-[-2px]">Ver perfil</p>
                </div>
            </Link>

            <button onClick={logout} className={logoutBtnClasses} aria-label="Sair da conta">
                <LogOut className="size-5" strokeWidth={1.5} />
            </button>
        </div>
    );
}
