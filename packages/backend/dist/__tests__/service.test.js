"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/** @jest-environment node */
const service_1 = require("../models/service");
const service = __importStar(require("../services/service"));
jest.mock('../models/service');
const ServiceModelMock = jest.mocked(service_1.ServiceModel, { shallow: true });
beforeEach(() => {
    jest.clearAllMocks();
});
describe('service layer', () => {
    test('createService checks overlap and creates', async () => {
        ServiceModelMock.findOne = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) });
        ServiceModelMock.create = jest.fn().mockResolvedValue({ id: '1' });
        const data = {
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
        ServiceModelMock.findOne = jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue({}) });
        const data = {
            name: 'Table',
            availableFrom: new Date('2024-01-01'),
            availableTo: new Date('2024-01-02'),
            rates: { hourly: 10, daily: 100 },
            quantity: 1,
        };
        await expect(service.createService(data)).rejects.toThrow('service availability overlaps');
    });
});
