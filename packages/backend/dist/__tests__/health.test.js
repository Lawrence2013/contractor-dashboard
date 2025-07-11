"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/** @jest-environment node */
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const index_1 = require("../index");
let mongo;
beforeAll(async () => {
    mongo = await mongodb_memory_server_1.MongoMemoryServer.create();
    await mongoose_1.default.connect(mongo.getUri());
});
afterAll(async () => {
    await mongoose_1.default.disconnect();
    await mongo.stop();
});
test('health and readiness endpoints', async () => {
    const app = (0, index_1.createApp)();
    const health = await (0, supertest_1.default)(app).get('/healthz');
    expect(health.status).toBe(200);
    expect(health.body).toEqual({ status: 'ok' });
    const ready = await (0, supertest_1.default)(app).get('/readyz');
    expect(ready.status).toBe(200);
    expect(ready.body).toEqual({ ready: true });
});
