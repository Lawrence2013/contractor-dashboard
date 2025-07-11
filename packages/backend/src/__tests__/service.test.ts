/** @jest-environment node */
import { ServiceModel } from '../models/service';
import * as service from '../services/service';

jest.mock('../models/service');

const ServiceModelMock = jest.mocked(ServiceModel, { shallow: true });

beforeEach(() => {
  jest.clearAllMocks();
});

describe('service layer', () => {
  test('createService checks overlap and creates', async () => {
    ServiceModelMock.findOne = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }) as any;
    ServiceModelMock.create = jest.fn().mockResolvedValue({ id: '1' }) as any;
    const data: any = {
      name: 'Table',
      availableFrom: new Date('2024-01-01'),
      availableTo: new Date('2024-01-02'),
      rates: { hourly: 10, daily: 100 },
      quantity: 1,
    };
    const result = await service.createService(data);
    expect(ServiceModelMock.findOne).toHaveBeenCalled();
    expect(ServiceModelMock.create).toHaveBeenCalledWith(data);
    expect(result).toEqual({ id: '1' });
  });

  test('createService throws on overlap', async () => {
    ServiceModelMock.findOne = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue({}) }) as any;
    const data: any = {
      name: 'Table',
      availableFrom: new Date('2024-01-01'),
      availableTo: new Date('2024-01-02'),
      rates: { hourly: 10, daily: 100 },
      quantity: 1,
    };
    await expect(service.createService(data)).rejects.toThrow('service availability overlaps');
  });
});
