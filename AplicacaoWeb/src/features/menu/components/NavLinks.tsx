'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, Search, PlusCircle, Library, Bell } from 'lucide-react';
import { useSession } from '@/src/hooks/useSession';
import { useNotifications } from '@/src/hooks/useNotifications';
import { NotificationModal } from '@/src/components/NotificationModal';

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
    { name: 'Assistente', icon: MessageSquare, href: '/chat' },
    { name: 'Feed', icon: Library, href: '/feed' },
    { name: 'Buscar', icon: Search, href: '/search' },
    { name: 'Publicar', icon: PlusCircle, href: '/create' },
];

export function NavLinks({ isOpen, closeMenu }: NavLinksProps) {
    const pathname = usePathname();
    const { user } = useSession();

    const {
        isModalOpen,
        openModal,
        closeModal,
        notifications,
        unreadCount,
        handleDelete,
        handleMarkAsRead,
    } = useNotifications(user);

    const handleMobileClick = () => {
        if (window.innerWidth < 1280) closeMenu();
    };

    return (
        <>
            <nav className="flex-1 flex flex-col gap-2 p-3 mt-2 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-card-border">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);

                    const baseClasses = `flex items-center gap-3 py-2.5 rounded-lg transition-colors overflow-hidden group w-full text-left cursor-pointer z-10 ${
                        isOpen
                            ? 'px-4 justify-start'
                            : 'justify-center px-0 xl:px-4 xl:justify-start'
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

                <button
                    onClick={openModal}
                    className={`flex items-center gap-3 py-2.5 rounded-lg transition-colors overflow-hidden group w-full text-left cursor-pointer z-10 text-sub-text hover:bg-background hover:text-text ${
                        isOpen
                            ? 'px-4 justify-start'
                            : 'justify-center px-0 xl:px-4 xl:justify-start'
                    }`}
                >
                    <div className="relative shrink-0 flex items-center justify-center">
                        <Bell className="size-5" strokeWidth={1.5} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </div>
                    <span
                        className={`whitespace-nowrap text-base transition-all duration-300 ${
                            isOpen
                                ? 'opacity-100 block'
                                : 'opacity-0 hidden w-0 xl:opacity-100 xl:block xl:w-auto'
                        }`}
                    >
                        Notificações
                    </span>
                </button>
            </nav>

            <NotificationModal
                isOpen={isModalOpen}
                onClose={closeModal}
                notifications={notifications}
                onDelete={handleDelete}
                onMarkAsRead={handleMarkAsRead}
            />
        </>
    );
}
