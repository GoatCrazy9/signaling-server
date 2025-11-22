// server.js
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: '*', // en producción puedes restringir a tu dominio de Vercel
  },
});

io.on('connection', socket => {
  console.log('Cliente conectado:', socket.id);

  socket.on('join', roomId => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} se unió a sala ${roomId}`);
    socket.to(roomId).emit('peer-joined');
  });

  socket.on('signal', (roomId, signal) => {
    console.log(`Señal en sala ${roomId} desde ${socket.id}`);
    socket.to(roomId).emit('signal', signal);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Signaling server escuchando en http://localhost:${PORT}`);
});
