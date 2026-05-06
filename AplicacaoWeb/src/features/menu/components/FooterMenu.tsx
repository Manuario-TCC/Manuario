'use client';

import Link from 'next/link';
import Image from 'next/image';

interface FooterMenuProps {
    user: any;
    loading: boolean;
    isOpen: boolean;
}

export function FooterMenu({ user, loading, isOpen }: FooterMenuProps) {
    const containerClasses = `relative flex items-center h-16 shrink-0 w-full transition-all duration-300 ${
        isOpen ? 'px-2' : 'px-0 justify-center xl:justify-start xl:px-2'
    }`;
    const textContainerClasses = `flex flex-col justify-center overflow-hidden transition-all duration-300 ${
        isOpen
            ? 'opacity-100 ml-3 w-auto block'
            : 'opacity-0 w-0 hidden ml-0 xl:opacity-100 xl:w-auto xl:ml-3 xl:block'
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
                href={`/perfil/${user.idPublic}`}
                className={`flex items-center group z-10 w-full overflow-hidden transition-all duration-300 ${
                    isOpen ? 'justify-start' : 'justify-center xl:justify-start'
                }`}
            >
                <div className="relative size-10 rounded-full overflow-hidden bg-card shrink-0 border border-card-border transition-colors group-hover:border-accent">
                    <Image
                        src={user.img}
                        alt={`Perfil de ${user.name}`}
                        fill
                        sizes="2.5rem"
                        className="object-cover"
                    />
                </div>
                <div className={textContainerClasses}>
                    <p className="text-base font-semibold text-text whitespace-nowrap overflow-hidden text-ellipsis">
                        {user.name}
                    </p>
                    <p className="text-sm text-sub-text whitespace-nowrap mt-[-0.125rem]">
                        Ver perfil
                    </p>
                </div>
            </Link>
        </div>
    );
}
