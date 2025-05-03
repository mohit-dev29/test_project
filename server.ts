import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { socketHandler } from './sockets/socket.handler';
import { PORT } from './config';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // replace with frontend origin
    credentials: true
  }
});

app.set('io', io);

socketHandler(io);

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
