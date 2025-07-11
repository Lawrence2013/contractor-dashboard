import { Request, Response } from 'express';
import * as orderService from '../services/order';

export async function list(req: Request, res: Response) {
  const filter: any = {};
  if (req.query.status) filter.status = req.query.status;
  const orders = await orderService.getOrders(filter);
  res.json(orders);
}

export async function getById(req: Request, res: Response) {
  const order = await orderService.getOrder(req.params.id);
  if (!order) return res.status(404).json({ message: 'not found' });
  res.json(order);
}

export async function accept(req: Request, res: Response) {
  const order = await orderService.acceptOrder(req.params.id);
  if (!order) return res.status(404).json({ message: 'not found' });
  res.json(order);
}

export async function reject(req: Request, res: Response) {
  const { lineItemIds } = req.body as { lineItemIds?: string[] };
  const order = await orderService.rejectOrder(req.params.id, lineItemIds);
  if (!order) return res.status(404).json({ message: 'not found' });
  res.json(order);
}
