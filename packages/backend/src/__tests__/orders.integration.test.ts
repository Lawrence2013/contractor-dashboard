/** @jest-environment node */
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../index';
import { ServiceModel } from '../models/service';
import { OrderModel } from '../models/order';
import { sign } from '../utils/jwt';

let mongo: MongoMemoryServer;
let token: string;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  token = sign({ sub: '1', role: 'contractor' }, 'access-secret');
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

afterEach(async () => {
  await OrderModel.deleteMany({});
  await ServiceModel.deleteMany({});
});

describe('orders routes', () => {
  test('list and get order', async () => {
    const svc = await ServiceModel.create({
      name: 'Table',
      availableFrom: new Date('2024-01-01'),
      availableTo: new Date('2024-01-02'),
      rates: { hourly: 10, daily: 100 },
      quantity: 1,
    });
    const order = await OrderModel.create({
      lineItems: [{ service: svc._id, quantity: 1 }],
    });

    const app = createApp();
    const listRes = await request(app)
      .get('/orders?status=pending')
      .set('Authorization', `Bearer ${token}`);
    expect(listRes.status).toBe(200);
    expect(listRes.body).toHaveLength(1);

    const getRes = await request(app)
      .get(`/orders/${order._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body._id).toBe(order._id.toString());
  });

  test('accept order', async () => {
    const svc = await ServiceModel.create({
      name: 'Chair',
      availableFrom: new Date('2024-01-01'),
      availableTo: new Date('2024-01-02'),
      rates: { hourly: 5, daily: 50 },
      quantity: 2,
    });
    const order = await OrderModel.create({
      lineItems: [{ service: svc._id, quantity: 2 }],
    });
    const app = createApp();
    const res = await request(app)
      .patch(`/orders/${order._id}/accept`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('accepted');
    expect(res.body.lineItems[0].status).toBe('accepted');
  });

  test('reject partial order', async () => {
    const svc1 = await ServiceModel.create({
      name: 'A',
      availableFrom: new Date('2024-01-01'),
      availableTo: new Date('2024-01-02'),
      rates: { hourly: 1, daily: 10 },
      quantity: 1,
    });
    const svc2 = await ServiceModel.create({
      name: 'B',
      availableFrom: new Date('2024-01-01'),
      availableTo: new Date('2024-01-02'),
      rates: { hourly: 2, daily: 20 },
      quantity: 1,
    });
    const order = await OrderModel.create({
      lineItems: [
        { service: svc1._id, quantity: 1 },
        { service: svc2._id, quantity: 2 },
      ],
    });
    const app = createApp();
    const res = await request(app)
      .patch(`/orders/${order._id}/reject`)
      .send({ lineItemIds: [order.lineItems[0]._id] })
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('accepted');
    const li0 = res.body.lineItems.find((li: any) => li._id === order.lineItems[0]._id.toString());
    const li1 = res.body.lineItems.find((li: any) => li._id === order.lineItems[1]._id.toString());
    expect(li0.status).toBe('rejected');
    expect(li1.status).toBe('accepted');
  });
});
