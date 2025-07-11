"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = getOrders;
exports.getOrder = getOrder;
exports.acceptOrder = acceptOrder;
exports.rejectOrder = rejectOrder;
const mongoose_1 = require("mongoose");
const order_1 = require("../models/order");
async function getOrders(filter = {}) {
    return order_1.OrderModel.find(filter).populate('lineItems.service').exec();
}
async function getOrder(id) {
    return order_1.OrderModel.findById(id).populate('lineItems.service').exec();
}
async function acceptOrder(id) {
    const order = await order_1.OrderModel.findById(id).exec();
    if (!order)
        return null;
    order.status = 'accepted';
    order.lineItems.forEach((li) => (li.status = 'accepted'));
    await order.save();
    return order.populate('lineItems.service');
}
async function rejectOrder(id, lineItemIds) {
    const order = await order_1.OrderModel.findById(id).exec();
    if (!order)
        return null;
    if (lineItemIds && lineItemIds.length > 0) {
        const ids = lineItemIds.map((i) => new mongoose_1.Types.ObjectId(i));
        order.lineItems.forEach((li) => {
            if (ids.find((id) => id.equals(li._id))) {
                li.status = 'rejected';
            }
            else {
                li.status = 'accepted';
            }
        });
        order.status = order.lineItems.some((li) => li.status === 'accepted')
            ? 'accepted'
            : 'rejected';
    }
    else {
        order.lineItems.forEach((li) => (li.status = 'rejected'));
        order.status = 'rejected';
    }
    await order.save();
    return order.populate('lineItems.service');
}
