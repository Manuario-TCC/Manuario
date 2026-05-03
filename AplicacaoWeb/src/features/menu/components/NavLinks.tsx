'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, Search, PlusCircle, Library } from 'lucide-react';

interface NavLinksProps {
    isOpen: boolean;
    closeMenu: () => void;
}

type NavItem = {
    name: string;
    icon: React.ElementType;
    href: string;
};

const navItems: NavItem[] = [
    {
        name: 'Assistente',
        icon: MessageSquare,
        href: '/chat',
    },
    {
        name: 'Feed',
        icon: Library,
        href: '/feed',
    },
    {
        name: 'Buscar',
        icon: Search,
        href: '/search',
    },
    {
        name: 'Publicar',
        icon: PlusCircle,
        href: '/create',
    },
];

export function NavLinks({ isOpen, closeMenu }: NavLinksProps) {
    const pathname = usePathname();

    const handleMobileClick = () => {
        if (window.innerWidth < 1280) {
            // Atualizei aqui também para garantir o fechamento no mobile/tablet correto
            closeMenu();
        }
    };

    return (
        <nav className="flex-1 flex flex-col gap-2 p-3 mt-2 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-card-border">
            {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);

                const baseClasses = `flex items-center gap-3 py-2.5 rounded-lg transition-colors overflow-hidden group w-full text-left cursor-pointer z-10 ${
                    isOpen ? 'px-4 justify-start' : 'justify-center px-0 xl:px-4 xl:justify-start'
                } ${
                    isActive
                        ? 'bg-gray text-text font-medium'
                        : 'text-sub-text hover:bg-background hover:text-text'
                }`;

                const textClasses = `whitespace-nowrap text-base transition-all duration-300 ${
                    isOpen
                        ? 'opacity-100 block'
                        : 'opacity-0 hidden w-0 xl:opacity-100 xl:block xl:w-auto'
                }`;

                return (
                    <Link
                        key={item.name}
                        href={item.href}
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
