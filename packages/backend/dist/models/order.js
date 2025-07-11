"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = require("mongoose");
const lineItemSchema = new mongoose_1.Schema({
    service: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Service', required: true },
    quantity: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
        required: true,
    },
}, { _id: true });
const orderSchema = new mongoose_1.Schema({
    lineItems: { type: [lineItemSchema], required: true },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
        required: true,
    },
    rejectionNotes: String,
}, { timestamps: true });
exports.OrderModel = (0, mongoose_1.model)('Order', orderSchema);
