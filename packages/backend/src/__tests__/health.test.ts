/** @jest-environment node */
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../index';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

test('health and readiness endpoints', async () => {
  const app = createApp();
  const health = await request(app).get('/healthz');
  expect(health.status).toBe(200);
  expect(health.body).toEqual({ status: 'ok' });

  const ready = await request(app).get('/readyz');
  expect(ready.status).toBe(200);
  expect(ready.body).toEqual({ ready: true });
});
