const { Server } = require('socket.io');
const http = require('http');

const server = http.createServer();

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    socket.on('profile_updated', (data) => {
        io.emit('reload_profile_data', data);
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Servidor Socket.IO rodando na porta ${PORT}`);
});
