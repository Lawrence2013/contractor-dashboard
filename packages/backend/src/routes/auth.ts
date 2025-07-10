import { Router } from 'express';
import cookieParser from 'cookie-parser';
import { sign, verify } from '../utils/jwt';
import { loginSchema, LoginInput } from '../validation/login';

const router = Router();
const ACCESS_SECRET = process.env.ACCESS_SECRET || 'access-secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-secret';

router.use(cookieParser());

const USER = { username: 'contractor', password: 'password', role: 'contractor', id: '1' };

router.post('/login', (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });
  const { username, password } = value as LoginInput;
  if (username !== USER.username || password !== USER.password) {
    return res.status(401).json({ message: 'invalid credentials' });
  }
  const accessToken = sign({ sub: USER.id, role: USER.role }, ACCESS_SECRET, 900);
  const refreshToken = sign({ sub: USER.id, role: USER.role }, REFRESH_SECRET, 604800);
  res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' });
  res.json({ accessToken });
});

router.post('/refresh', (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'missing refresh token' });
  const payload = verify(token, REFRESH_SECRET);
  if (!payload) return res.status(401).json({ message: 'invalid refresh token' });
  const accessToken = sign({ sub: payload.sub, role: payload.role }, ACCESS_SECRET, 900);
  res.json({ accessToken });
});

export default router;
