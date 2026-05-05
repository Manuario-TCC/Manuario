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
                    <Bell className="w-[1.5rem] h-[1.5rem] text-text" />
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
                            const isLink = !!notif.link;

                            const contentText = (() => {
                                const isMasculine =
                                    notif.senderName === 'Manual' || !notif.senderName;
                                const subject = notif.senderName || 'comentário';

                                return (
                                    <div className="text-sm leading-snug w-full">
                                        {notif.type === 'REPLY' && (
                                            <span className="text-sub-text">
                                                O usuário{' '}
                                                <strong className="text-text">
                                                    {notif.senderName}
                                                </strong>{' '}
                                                respondeu seu comentário.
                                            </span>
                                        )}

                                        {notif.type === 'DELETE' && (
                                            <div className="flex flex-col gap-2 w-full mt-1">
                                                <span className="text-sub-text">
                                                    {isMasculine ? 'Seu' : 'Sua'}{' '}
                                                    <strong className="text-red-400">
                                                        {subject}
                                                    </strong>{' '}
                                                    foi {isMasculine ? 'removido' : 'removida'}.
                                                </span>

                                                {notif.targetName && (
                                                    <div className="bg-card-border/20 p-2.5 rounded-lg border-l-2 border-red-500/50">
                                                        <p className="text-xs text-sub-text italic line-clamp-2">
                                                            "{notif.targetName}"
                                                        </p>
                                                    </div>
                                                )}

                                                {notif.reason && (
                                                    <span className="text-xs text-text mt-0.5">
                                                        <strong className="text-red-400/80">
                                                            Motivo:{' '}
                                                        </strong>
                                                        {notif.reason}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {notif.type === 'BADGE' && (
                                            <div className="flex flex-col gap-2 w-full mt-1">
                                                <span className="text-sub-text">
                                                    Seu comentário ganhou um{' '}
                                                    <strong className="text-green-500">
                                                        Selo de Qualidade
                                                    </strong>{' '}
                                                    da moderação!
                                                </span>

                                                {notif.targetName && (
                                                    <div className="bg-card-border/20 p-2.5 rounded-lg border-l-2 border-green-500/50">
                                                        <p className="text-xs text-sub-text italic line-clamp-2">
                                                            "{notif.targetName}"
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })();

                            return (
                                <div
                                    key={notif.id}
                                    className={`flex items-center justify-between p-3 rounded-xl bg-background border transition-all duration-200 ease-in-out 
                                        ${isUnread ? 'border-primary' : 'border-card-border'}
                                        ${
                                            isLink
                                                ? 'cursor-pointer hover:bg-gray active:scale-[0.98]'
                                                : 'cursor-default hover:bg-transparent' // Remove o ponteiro e a mudança de fundo
                                        }
                                    `}
                                    onClick={() => {
                                        if (isLink && notif.link) {
                                            onMarkAsRead(notif.id);
                                            onClose();
                                            window.location.href = notif.link;
                                        } else if (isUnread) {
                                            onMarkAsRead(notif.id);
                                        }
                                    }}
                                >
                                    <div className="flex-1 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-card">
                                            {getIcon(notif.type)}
                                        </div>

                                        <div className="flex flex-col flex-1">
                                            {isLink ? (
                                                <div className="group-hover:underline">
                                                    {contentText}
                                                </div>
                                            ) : (
                                                <div>{contentText}</div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(notif.id);
                                        }}
                                        className="ml-2 p-2 text-sub-text hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer shrink-0 z-20"
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
