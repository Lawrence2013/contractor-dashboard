import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload } from '../utils/jwt';

const ACCESS_SECRET = process.env.ACCESS_SECRET || 'access-secret';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function requireContractor(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'missing token' });
  }
  const token = header.slice(7);
  const payload = verify(token, ACCESS_SECRET);
  if (!payload) return res.status(401).json({ message: 'invalid token' });
  if (payload.role !== 'contractor') return res.status(403).json({ message: 'forbidden' });
  req.user = payload;
  next();
}
