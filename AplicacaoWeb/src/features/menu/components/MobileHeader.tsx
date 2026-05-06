'use client';

import { Bell } from 'lucide-react';
import { useSession } from '@/src/hooks/useSession';
import { useNotifications } from '@/src/hooks/useNotifications';
import { useScrollVisibility } from '@/src/hooks/useScrollVisibility';
import { NotificationModal } from '@/src/components/NotificationModal';

export function MobileHeader() {
    const { isVisible } = useScrollVisibility();

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

    return (
        <>
            <header
                className={`sm:hidden fixed top-0 left-0 w-full bg-card border-b border-card-border z-[100] transition-transform duration-300 flex items-center justify-between px-4 h-14 ${
                    isVisible ? 'translate-y-0' : '-translate-y-full'
                }`}
            >
                <div className="flex items-center gap-2">
                    <span className="font-bold text-xl text-text">Manuario</span>
                </div>

                <button
                    onClick={openModal}
                    className="relative p-2 text-sub-text hover:text-text rounded-full transition-colors"
                >
                    <Bell className="size-6" strokeWidth={1.5} />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
            </header>

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
