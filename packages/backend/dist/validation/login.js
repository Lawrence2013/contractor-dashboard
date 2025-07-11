"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
exports.loginSchema = {
    validate(data) {
        if (typeof data.username !== 'string' || data.username.length === 0) {
            return { error: new Error('username is required') };
        }
        if (typeof data.password !== 'string' || data.password.length === 0) {
            return { error: new Error('password is required') };
        }
        return { value: data };
    },
};
