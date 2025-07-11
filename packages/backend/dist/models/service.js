"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceModel = void 0;
const mongoose_1 = require("mongoose");
const rateSchema = new mongoose_1.Schema({
    hourly: { type: Number, required: true },
    daily: { type: Number, required: true },
}, { _id: false });
const serviceSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String },
    availableFrom: { type: Date, required: true },
    availableTo: { type: Date, required: true },
    rates: { type: rateSchema, required: true },
    quantity: { type: Number, required: true },
}, { timestamps: true });
exports.ServiceModel = (0, mongoose_1.model)('Service', serviceSchema);
