import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { users } from '../models/user.model';
import { COOKIE_NAME } from '../config';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.sendStatus(401);
  try {
    const { userId } = verifyToken(token);
    const user = users.find(u => u.id === userId);
    if (!user || user.currentToken !== token) return res.sendStatus(401);
    req.user = { id: userId };
    next();
  } catch {
    return res.sendStatus(401);
  }
};
