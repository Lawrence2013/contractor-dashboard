"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireContractor = requireContractor;
const jwt_1 = require("../utils/jwt");
const ACCESS_SECRET = process.env.ACCESS_SECRET || 'access-secret';
function requireContractor(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'missing token' });
    }
    const token = header.slice(7);
    const payload = (0, jwt_1.verify)(token, ACCESS_SECRET);
    if (!payload)
        return res.status(401).json({ message: 'invalid token' });
    if (payload.role !== 'contractor')
        return res.status(403).json({ message: 'forbidden' });
    req.user = payload;
    next();
}
