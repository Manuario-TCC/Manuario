import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socket } from '../../../services/socket';

export function useRealTimeComments(postId: string) {
    const queryClient = useQueryClient();

    useEffect(() => {
        socket.connect();
        socket.emit('join_post', postId);

        // Escuta novos comentarios
        socket.on('new_comment', (newComment) => {
            queryClient.setQueryData(['comments', postId], (oldData: any) => {
                if (!oldData) return [newComment];
                return [newComment, ...oldData];
            });
        });

        // Escuta novas respostas
        socket.on('new_reply', ({ commentId, newReply }) => {
            queryClient.setQueryData(['comments', postId], (oldData: any) => {
                if (!oldData) return oldData;

                return oldData.map((comment: any) => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            replies: [...(comment.replies || []), newReply],
                        };
                    }
                    return comment;
                });
            });
        });

        // Cleanup
        return () => {
            socket.emit('leave_post', postId);
            socket.off('new_comment');
            socket.off('new_reply');
            socket.disconnect();
        };
    }, [postId, queryClient]);
}
