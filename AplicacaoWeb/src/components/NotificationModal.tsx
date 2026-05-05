'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Bell, MessageCircle, ShieldAlert, Award, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { NotificationData } from '@/src/hooks/useNotifications';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: NotificationData[];
    onDelete: (id: string) => void;
    onMarkAsRead: (id: string) => void;
}

export function NotificationModal({
    isOpen,
    onClose,
    notifications,
    onDelete,
    onMarkAsRead,
}: NotificationModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!mounted || !isOpen) return null;

    const getIcon = (type: string) => {
        switch (type) {
            case 'REPLY':
                return <MessageCircle className="w-5 h-5 text-text" />;
            case 'DELETE':
                return <ShieldAlert className="w-5 h-5 text-red-500" />;
            case 'BADGE':
                return <Award className="w-5 h-5 text-text" />;
            default:
                return <Bell className="w-5 h-5 text-text" />;
        }
    };

    const modalContent = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="bg-card border border-card-border rounded-2xl w-full max-w-lg p-6 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-sub-text hover:text-text p-1.5 rounded-lg cursor-pointer transition-colors hover:bg-white/5"
                >
                    <X className="w-[1.25rem] h-[1.25rem]" />
                </button>

                <h2 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
                    <Bell className="w-[1.5rem] h-[1.5rem] text-primary" />
                    Notificações
                </h2>

                <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {notifications.length === 0 ? (
                        <p className="text-sub-text text-sm text-center py-6">
                            Você não tem novas notificações.
                        </p>
                    ) : (
                        notifications.map((notif) => {
                            const isUnread = !notif.isRead;
                            const isLink = notif.type === 'REPLY' || notif.type === 'BADGE';

                            const contentText = (
                                <span className="text-sub-text text-sm leading-snug">
                                    {notif.type === 'REPLY' && (
                                        <span>
                                            O usuário{' '}
                                            <strong className="text-text">
                                                {notif.senderName}
                                            </strong>{' '}
                                            respondeu seu comentário.
                                        </span>
                                    )}
                                    {notif.type === 'DELETE' && (
                                        <span>
                                            Sua <strong>{notif.targetName}</strong> foi deletada:{' '}
                                            <span className="italic text-sub-text">
                                                "{notif.reason}"
                                            </span>
                                            .
                                        </span>
                                    )}
                                    {notif.type === 'BADGE' && (
                                        <span>Seu comentário ganhou selo de validade!</span>
                                    )}
                                </span>
                            );

                            return (
                                <div
                                    key={notif.id}
                                    className={`flex items-center justify-between p-3 rounded-xl bg-background border 
                                    hover:bg-gray transition-colors duration-200 delay-100 ease-in-out group ${
                                        isUnread ? 'border-primary' : 'border-card-border'
                                    }`}
                                >
                                    <div className="flex-1 flex items-center gap-4">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-card`}
                                        >
                                            {getIcon(notif.type)}
                                        </div>

                                        <div
                                            className="flex flex-col flex-1 cursor-pointer"
                                            onClick={() => {
                                                if (isUnread) onMarkAsRead(notif.id);
                                            }}
                                        >
                                            {isLink && notif.link ? (
                                                <Link
                                                    href={notif.link}
                                                    onClick={onClose}
                                                    className="hover:underline"
                                                >
                                                    {contentText}
                                                </Link>
                                            ) : (
                                                <div>{contentText}</div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => onDelete(notif.id)}
                                        className="ml-2 p-2 text-sub-text hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer shrink-0"
                                        title="Apagar notificação"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
