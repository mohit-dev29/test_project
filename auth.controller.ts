import { Request, Response } from 'express';
import { findUser, updateUserToken } from '../models/user.model';
import { signToken } from '../utils/jwt';
import { COOKIE_NAME } from '../config';

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = findUser(username);
  if (!user || user.password !== password) return res.sendStatus(401);

  const token = signToken(user.id);
  updateUserToken(user.id, token);

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'strict'
  });

  return res.json({ message: 'Login successful' });
};

export const logout = (req: Request, res: Response) => {
  if (req.user) updateUserToken(req.user.id, null);
  res.clearCookie(COOKIE_NAME);
  return res.json({ message: 'Logged out' });
};
