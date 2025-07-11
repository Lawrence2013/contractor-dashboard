"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createService = createService;
exports.getServices = getServices;
exports.updateService = updateService;
exports.deleteService = deleteService;
const service_1 = require("../models/service");
async function createService(data) {
    await ensureNoOverlap(data.name, data.availableFrom, data.availableTo);
    return service_1.ServiceModel.create(data);
}
async function getServices(filter = {}) {
    return service_1.ServiceModel.find(filter).exec();
}
async function updateService(id, data) {
    if (data.availableFrom && data.availableTo) {
        await ensureNoOverlapForUpdate(id, data.name, data.availableFrom, data.availableTo);
    }
    return service_1.ServiceModel.findByIdAndUpdate(id, data, { new: true }).exec();
}
async function deleteService(id) {
    return service_1.ServiceModel.findByIdAndDelete(id).exec();
}
async function ensureNoOverlap(name, from, to, excludeId) {
    const query = {
        name,
        availableFrom: { $lte: to },
        availableTo: { $gte: from },
    };
    if (excludeId)
        query._id = { $ne: excludeId };
    const existing = await service_1.ServiceModel.findOne(query).exec();
    if (existing)
        throw new Error('service availability overlaps');
}
async function ensureNoOverlapForUpdate(id, name, from, to) {
    await ensureNoOverlap(name, from, to, id);
}
