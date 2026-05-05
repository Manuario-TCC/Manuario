import { useState, useEffect, useCallback } from 'react';
import { socket } from '@/src/services/socket';
import { notificationService } from '@/src/services/notificationService';

export interface NotificationData {
    id: string;
    type: 'REPLY' | 'DELETE' | 'BADGE';
    isRead: boolean;
    senderName?: string | null;
    targetName?: string | null;
    reason?: string | null;
    link?: string | null;
    createdAt: Date;
}

export function useNotifications(user: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationData[]>([]);

    const fetchNotifications = useCallback(async () => {
        try {
            const data = await notificationService.getHistory(10, 0);
            if (data?.notifications) {
                setNotifications(data.notifications);
            }
        } catch (error) {
            console.error('Erro ao buscar notificações', error);
        }
    }, []);

    useEffect(() => {
        if (!user) return;

        fetchNotifications();

        const identifier = user.idPublic;

        if (identifier) {
            socket.connect();

            const joinUserRoom = () => {
                socket.emit('join_user_room', identifier);
            };

            if (socket.connected) {
                joinUserRoom();
            } else {
                socket.on('connect', joinUserRoom);
            }

            const handleReceiveNotification = (newNotif: NotificationData) => {
                console.log('Chegou notificação nova pelo Socket!', newNotif);
                setNotifications((prev) => [newNotif, ...prev]);
            };

            socket.on('receive_notification', handleReceiveNotification);

            return () => {
                socket.off('connect', joinUserRoom);
                socket.off('receive_notification', handleReceiveNotification);
            };
        }
    }, [user, fetchNotifications]);

    const openModal = () => {
        fetchNotifications();
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleDelete = async (id: string) => {
        try {
            await notificationService.deleteNotification(id);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        } catch (error) {
            console.error('Erro ao deletar', error);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
        } catch (error) {
            console.error('Erro ao ler', error);
        }
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return {
        isModalOpen,
        openModal,
        closeModal,
        notifications,
        unreadCount,
        handleDelete,
        handleMarkAsRead,
    };
}
