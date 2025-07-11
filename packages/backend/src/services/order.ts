import { FilterQuery, Types } from 'mongoose';
import { OrderModel, OrderDocument } from '../models/order';

export async function getOrders(
  filter: FilterQuery<OrderDocument> = {}
): Promise<OrderDocument[]> {
  return OrderModel.find(filter).populate('lineItems.service').exec();
}

export async function getOrder(id: string): Promise<OrderDocument | null> {
  return OrderModel.findById(id).populate('lineItems.service').exec();
}

export async function acceptOrder(id: string): Promise<OrderDocument | null> {
  const order = await OrderModel.findById(id).exec();
  if (!order) return null;
  order.status = 'accepted';
  order.lineItems.forEach((li) => (li.status = 'accepted'));
  await order.save();
  return order.populate('lineItems.service');
}

export async function rejectOrder(
  id: string,
  lineItemIds?: string[]
): Promise<OrderDocument | null> {
  const order = await OrderModel.findById(id).exec();
  if (!order) return null;

  if (lineItemIds && lineItemIds.length > 0) {
    const ids = lineItemIds.map((i) => new Types.ObjectId(i));
    order.lineItems.forEach((li) => {
      if (ids.find((id) => id.equals(li._id))) {
        li.status = 'rejected';
      } else {
        li.status = 'accepted';
      }
    });
    order.status = order.lineItems.some((li) => li.status === 'accepted')
      ? 'accepted'
      : 'rejected';
  } else {
    order.lineItems.forEach((li) => (li.status = 'rejected'));
    order.status = 'rejected';
  }

  await order.save();
  return order.populate('lineItems.service');
}
