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
exports.list = list;
exports.getById = getById;
exports.accept = accept;
exports.reject = reject;
const orderService = __importStar(require("../services/order"));
async function list(req, res) {
    const filter = {};
    if (req.query.status)
        filter.status = req.query.status;
    const orders = await orderService.getOrders(filter);
    res.json(orders);
}
async function getById(req, res) {
    const order = await orderService.getOrder(req.params.id);
    if (!order)
        return res.status(404).json({ message: 'not found' });
    res.json(order);
}
async function accept(req, res) {
    const order = await orderService.acceptOrder(req.params.id);
    if (!order)
        return res.status(404).json({ message: 'not found' });
    res.json(order);
}
async function reject(req, res) {
    const { lineItemIds } = req.body;
    const order = await orderService.rejectOrder(req.params.id, lineItemIds);
    if (!order)
        return res.status(404).json({ message: 'not found' });
    res.json(order);
}
