"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const jwt_1 = require("../utils/jwt");
const login_1 = require("../validation/login");
const router = (0, express_1.Router)();
const ACCESS_SECRET = process.env.ACCESS_SECRET || 'access-secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-secret';
router.use((0, cookie_parser_1.default)());
const USER = { username: 'contractor', password: 'password', role: 'contractor', id: '1' };
router.post('/login', (req, res) => {
    const { error, value } = login_1.loginSchema.validate(req.body);
    if (error)
        return res.status(400).json({ message: error.message });
    const { username, password } = value;
    if (username !== USER.username || password !== USER.password) {
        return res.status(401).json({ message: 'invalid credentials' });
    }
    const accessToken = (0, jwt_1.sign)({ sub: USER.id, role: USER.role }, ACCESS_SECRET, 900);
    const refreshToken = (0, jwt_1.sign)({ sub: USER.id, role: USER.role }, REFRESH_SECRET, 604800);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' });
    res.json({ accessToken });
});
router.post('/refresh', (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token)
        return res.status(401).json({ message: 'missing refresh token' });
    const payload = (0, jwt_1.verify)(token, REFRESH_SECRET);
    if (!payload)
        return res.status(401).json({ message: 'invalid refresh token' });
    const accessToken = (0, jwt_1.sign)({ sub: payload.sub, role: payload.role }, ACCESS_SECRET, 900);
    res.json({ accessToken });
});
exports.default = router;
