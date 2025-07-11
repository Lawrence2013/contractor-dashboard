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
const service_1 = require("../models/service");
const order_1 = require("../models/order");
const jwt_1 = require("../utils/jwt");
let mongo;
let token;
beforeAll(async () => {
    mongo = await mongodb_memory_server_1.MongoMemoryServer.create();
    await mongoose_1.default.connect(mongo.getUri());
    token = (0, jwt_1.sign)({ sub: '1', role: 'contractor' }, 'access-secret');
});
afterAll(async () => {
    await mongoose_1.default.disconnect();
    await mongo.stop();
});
afterEach(async () => {
    await order_1.OrderModel.deleteMany({});
    await service_1.ServiceModel.deleteMany({});
});
describe('orders routes', () => {
    test('list and get order', async () => {
        const svc = await service_1.ServiceModel.create({
            name: 'Table',
            availableFrom: new Date('2024-01-01'),
            availableTo: new Date('2024-01-02'),
            rates: { hourly: 10, daily: 100 },
            quantity: 1,
        });
        const order = await order_1.OrderModel.create({
            lineItems: [{ service: svc._id, quantity: 1 }],
        });
        const app = (0, index_1.createApp)();
        const listRes = await (0, supertest_1.default)(app)
            .get('/orders?status=pending')
            .set('Authorization', `Bearer ${token}`);
        expect(listRes.status).toBe(200);
        expect(listRes.body).toHaveLength(1);
        const getRes = await (0, supertest_1.default)(app)
            .get(`/orders/${order._id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(getRes.status).toBe(200);
        expect(getRes.body._id).toBe(order._id.toString());
    });
    test('accept order', async () => {
        const svc = await service_1.ServiceModel.create({
            name: 'Chair',
            availableFrom: new Date('2024-01-01'),
            availableTo: new Date('2024-01-02'),
            rates: { hourly: 5, daily: 50 },
            quantity: 2,
        });
        const order = await order_1.OrderModel.create({
            lineItems: [{ service: svc._id, quantity: 2 }],
        });
        const app = (0, index_1.createApp)();
        const res = await (0, supertest_1.default)(app)
            .patch(`/orders/${order._id}/accept`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('accepted');
        expect(res.body.lineItems[0].status).toBe('accepted');
    });
    test('reject partial order', async () => {
        const svc1 = await service_1.ServiceModel.create({
            name: 'A',
            availableFrom: new Date('2024-01-01'),
            availableTo: new Date('2024-01-02'),
            rates: { hourly: 1, daily: 10 },
            quantity: 1,
        });
        const svc2 = await service_1.ServiceModel.create({
            name: 'B',
            availableFrom: new Date('2024-01-01'),
            availableTo: new Date('2024-01-02'),
            rates: { hourly: 2, daily: 20 },
            quantity: 1,
        });
        const order = await order_1.OrderModel.create({
            lineItems: [
                { service: svc1._id, quantity: 1 },
                { service: svc2._id, quantity: 2 },
            ],
        });
        const app = (0, index_1.createApp)();
        const res = await (0, supertest_1.default)(app)
            .patch(`/orders/${order._id}/reject`)
            .send({ lineItemIds: [order.lineItems[0]._id] })
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('accepted');
        const li0 = res.body.lineItems.find((li) => li._id === order.lineItems[0]._id.toString());
        const li1 = res.body.lineItems.find((li) => li._id === order.lineItems[1]._id.toString());
        expect(li0.status).toBe('rejected');
        expect(li1.status).toBe('accepted');
    });
});
