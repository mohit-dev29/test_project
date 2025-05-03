import { Server, Socket } from 'socket.io';
import { verifyToken } from '../utils/jwt';
import { users, updateUserToken } from '../models/user.model';

export const socketHandler = (io: Server) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const payload = verifyToken(token);
      const user = users.find(u => u.id === payload.userId);
      if (!user || user.currentToken !== token) {
        return next(new Error('Unauthorized'));
      }
      (socket as any).userId = payload.userId;
      return next();
    } catch {
      return next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId;
    socket.join(userId); // join personal room

    socket.on('message', (data) => {
      // broadcast to everyone except sender
      socket.broadcast.emit('message', { userId, text: data });
    });

    socket.on('join-room', (roomId) => {
      socket.join(roomId);
    });

    socket.on('send-room-message', ({ roomId, message }) => {
      socket.to(roomId).emit('room-message', { userId, message });
    });

    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
    });
  });
};
