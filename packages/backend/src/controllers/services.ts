import { Request, Response } from 'express';
import * as serviceService from '../services/service';

export async function create(req: Request, res: Response) {
  try {
    const created = await serviceService.createService(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function list(req: Request, res: Response) {
  const services = await serviceService.getServices();
  res.json(services);
}

export async function update(req: Request, res: Response) {
  try {
    const updated = await serviceService.updateService(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function remove(req: Request, res: Response) {
  const removed = await serviceService.deleteService(req.params.id);
  if (!removed) return res.status(404).json({ message: 'not found' });
  res.json(removed);
}
