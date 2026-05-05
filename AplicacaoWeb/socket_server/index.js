const { Server } = require('socket.io');

const io = new Server(3001, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    },
});

io.on('connection', (socket) => {
    console.log('Novo usuário conectado:', socket.id);

    // Sala post
    socket.on('join_post', (postId) => {
        socket.join(postId);
        console.log(`Usuário entrou na sala do post: ${postId}`);
    });

    socket.on('leave_post', (postId) => {
        socket.leave(postId);
        console.log(`Usuário saiu da sala do post: ${postId}`);
    });

    socket.on('send_comment', (data) => {
        const { postId, comment } = data;
        socket.to(postId).emit('receive_comment', comment);
    });

    socket.on('action_comment', (data) => {
        socket.to(data.postId).emit('action_comment', data);
    });

    // Salas de usuarios
    socket.on('join_user_room', (userId) => {
        const roomName = `user_${userId}`;
        socket.join(roomName);
        console.log(`Usuário entrou na sala pessoal: ${roomName}`);
    });

    socket.on('send_notification', (notification) => {
        const targetId = notification.receiverIdPublic || notification.userId;
        const roomName = `user_${targetId}`;
        console.log(`Ping! Enviando notificação em TEMPO REAL para a sala: ${roomName}`);
        socket.to(roomName).emit('receive_notification', notification);
    });

    //ADMs
    socket.on('admin_delete_comment', (data) => {
        const roomName = `user_${data.targetUserId}`;
        io.to(roomName).emit('receive_notification', data.notification);
    });

    socket.on('admin_delete_post', (data) => {
        const roomName = `user_${data.targetUserId}`;
        io.to(roomName).emit('receive_notification', data.notification);
    });

    socket.on('admin_delete_manual', (data) => {
        const roomName = `user_${data.targetUserId}`;
        io.to(roomName).emit('receive_notification', data.notification);
    });

    socket.on('admin_validate_item', (data) => {
        const roomName = `user_${data.targetUserId}`;
        io.to(roomName).emit('receive_notification', data.notification);
    });

    socket.on('disconnect', () => {
        console.log('Usuário desconectado:', socket.id);
    });
});
