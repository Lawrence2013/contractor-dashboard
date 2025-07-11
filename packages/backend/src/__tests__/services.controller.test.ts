/** @jest-environment node */
import { Request, Response } from 'express';
import * as controller from '../controllers/services';
import * as serviceLayer from '../services/service';

jest.mock('../services/service');

const serviceMock = jest.mocked(serviceLayer, { shallow: true });

describe('services controller', () => {
  test('create success', async () => {
    const req = { body: {} } as Request;
    const json = jest.fn();
    const res = { status: jest.fn().mockReturnThis(), json } as unknown as Response;
    serviceMock.createService.mockResolvedValue({ id: '1' } as any);
    await controller.create(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({ id: '1' });
  });

  test('create failure', async () => {
    const req = { body: {} } as Request;
    const json = jest.fn();
    const res = { status: jest.fn().mockReturnThis(), json } as unknown as Response;
    serviceMock.createService.mockRejectedValue(new Error('bad'));
    await controller.create(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: 'bad' });
  });

  test('update not found', async () => {
    const req = { params: { id: '1' }, body: {} } as unknown as Request;
    const json = jest.fn();
    const res = { status: jest.fn().mockReturnThis(), json } as unknown as Response;
    serviceMock.updateService.mockResolvedValue(null as any);
    await controller.update(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ message: 'not found' });
  });

  test('remove success', async () => {
    const req = { params: { id: '1' } } as unknown as Request;
    const json = jest.fn();
    const res = { status: jest.fn().mockReturnThis(), json } as unknown as Response;
    serviceMock.deleteService.mockResolvedValue({ id: '1' } as any);
    await controller.remove(req, res);
    expect(json).toHaveBeenCalledWith({ id: '1' });
  });
});
