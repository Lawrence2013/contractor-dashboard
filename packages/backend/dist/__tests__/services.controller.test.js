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
const controller = __importStar(require("../controllers/services"));
const serviceLayer = __importStar(require("../services/service"));
jest.mock('../services/service');
const serviceMock = jest.mocked(serviceLayer, { shallow: true });
describe('services controller', () => {
    test('create success', async () => {
        const req = { body: {} };
        const json = jest.fn();
        const res = { status: jest.fn().mockReturnThis(), json };
        serviceMock.createService.mockResolvedValue({ id: '1' });
        await controller.create(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(json).toHaveBeenCalledWith({ id: '1' });
    });
    test('create failure', async () => {
        const req = { body: {} };
        const json = jest.fn();
        const res = { status: jest.fn().mockReturnThis(), json };
        serviceMock.createService.mockRejectedValue(new Error('bad'));
        await controller.create(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(json).toHaveBeenCalledWith({ message: 'bad' });
    });
    test('update not found', async () => {
        const req = { params: { id: '1' }, body: {} };
        const json = jest.fn();
        const res = { status: jest.fn().mockReturnThis(), json };
        serviceMock.updateService.mockResolvedValue(null);
        await controller.update(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(json).toHaveBeenCalledWith({ message: 'not found' });
    });
    test('remove success', async () => {
        const req = { params: { id: '1' } };
        const json = jest.fn();
        const res = { status: jest.fn().mockReturnThis(), json };
        serviceMock.deleteService.mockResolvedValue({ id: '1' });
        await controller.remove(req, res);
        expect(json).toHaveBeenCalledWith({ id: '1' });
    });
});
