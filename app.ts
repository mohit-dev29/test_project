import express from 'express';
import cookieParser from 'cookie-parser';
import { login, logout } from './controllers/auth.controller';
import { authMiddleware } from './middlewares/auth.middleware';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post('/api/login', login);
app.post('/api/logout', authMiddleware, logout);

// Example of real-time trigger from REST API
app.post('/api/notify', authMiddleware, (req: { body: { message: any; }; app: { get: (arg0: string) => any; }; }, res: { json: (arg0: { status: string; }) => void; }) => {
  const { message } = req.body;
  const io = req.app.get('io');
  io.emit('notification', { message });
  res.json({ status: 'sent' });
});

export default app;
