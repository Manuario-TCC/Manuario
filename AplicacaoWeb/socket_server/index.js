const { Server } = require('socket.io');

const io = new Server(3001, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('Novo usuário conectado:', socket.id);

    socket.on('join_post', (postId) => {
        socket.join(postId);
        console.log(`Usuário entrou na sala do post: ${postId}`);
    });

    socket.on('send_comment', (data) => {
        const { postId, comment } = data;
        socket.to(postId).emit('receive_comment', comment);
    });

    socket.on('action_comment', (data) => {
        socket.to(data.postId).emit('action_comment', data);
    });

    socket.on('disconnect', () => {
        console.log('Usuário desconectado:', socket.id);
    });

    socket.on('leave_post', (postId) => {
        socket.leave(postId);
        console.log(`Usuário saiu da sala do post: ${postId}`);
    });
});
