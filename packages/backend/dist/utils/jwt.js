"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sign = sign;
exports.verify = verify;
const crypto_1 = __importDefault(require("crypto"));
const base64url = (input) => Buffer.from(input).toString('base64url');
function sign(payload, secret, expiresInSec = 900) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const exp = Math.floor(Date.now() / 1000) + expiresInSec;
    const fullPayload = { ...payload, exp };
    const data = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(fullPayload))}`;
    const signature = crypto_1.default
        .createHmac('sha256', secret)
        .update(data)
        .digest('base64url');
    return `${data}.${signature}`;
}
function verify(token, secret) {
    const parts = token.split('.');
    if (parts.length !== 3)
        return null;
    const [headerB64, payloadB64, sig] = parts;
    const data = `${headerB64}.${payloadB64}`;
    const expectedSig = crypto_1.default
        .createHmac('sha256', secret)
        .update(data)
        .digest('base64url');
    if (!crypto_1.default.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig)))
        return null;
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000))
        return null;
    return payload;
}
