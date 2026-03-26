'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, Search, PlusCircle } from 'lucide-react';

interface NavLinksProps {
    isOpen: boolean;
    closeMenu: () => void;
}

type NavItem = {
    name: string;
    icon: React.ElementType;
    href?: string;
    isButton?: boolean;
};

const navItems: NavItem[] = [
    {
        name: 'Chat',
        icon: MessageSquare,
        href: '/chat',
    },
    {
        name: 'Feed',
        icon: Search,
        href: '/feed',
    },
    {
        name: 'Procurar',
        icon: Search,
        href: '/procurar',
    },
    {
        name: 'Criar Regra',
        icon: PlusCircle,
        isButton: true,
    },
];

export function NavLinks({ isOpen, closeMenu }: NavLinksProps) {
    const pathname = usePathname();

    const handleMobileClick = () => {
        if (window.innerWidth < 1024) {
            closeMenu();
        }
    };

    const handleOpenModal = () => {
        console.log('Abrir modal de Criar Regra');
        handleMobileClick();
    };

    return (
        <nav className="flex-1 flex flex-col gap-2 p-3 mt-2 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-surface-border">
            {navItems.map((item) => {
                const isActive = item.href ? pathname.startsWith(item.href) : false;

                const baseClasses = `flex items-center gap-3 py-2.5 rounded-lg transition-colors overflow-hidden group w-full text-left cursor-pointer z-10 ${
                    isOpen ? 'px-4 justify-start' : 'justify-center px-0 lg:px-4 lg:justify-start'
                } ${
                    isActive
                        ? 'bg-primary text-white font-medium'
                        : 'text-text-muted hover:bg-zinc-800 hover:text-text'
                }`;

                const textClasses = `whitespace-nowrap text-base transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 block' : 'opacity-0 hidden lg:opacity-100 lg:block'
                }`;

                if (item.isButton) {
                    return (
                        <button key={item.name} onClick={handleOpenModal} className={baseClasses}>
                            <item.icon className="size-5 shrink-0" strokeWidth={1.5} />
                            <span className={textClasses}>{item.name}</span>
                        </button>
                    );
                }

                return (
                    <Link
                        key={item.name}
                        href={item.href!}
                        onClick={handleMobileClick}
                        className={baseClasses}
                    >
                        <item.icon className="size-5 shrink-0" strokeWidth={1.5} />
                        <span className={textClasses}>{item.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
