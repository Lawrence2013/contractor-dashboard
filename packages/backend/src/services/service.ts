import { FilterQuery } from 'mongoose';
import { ServiceModel, ServiceDocument } from '../models/service';

export async function createService(data: Partial<ServiceDocument>): Promise<ServiceDocument> {
  await ensureNoOverlap(data.name!, data.availableFrom!, data.availableTo!);
  return ServiceModel.create(data);
}

export async function getServices(filter: FilterQuery<ServiceDocument> = {}): Promise<ServiceDocument[]> {
  return ServiceModel.find(filter).exec();
}

export async function updateService(id: string, data: Partial<ServiceDocument>): Promise<ServiceDocument | null> {
  if (data.availableFrom && data.availableTo) {
    await ensureNoOverlapForUpdate(id, data.name!, data.availableFrom, data.availableTo);
  }
  return ServiceModel.findByIdAndUpdate(id, data, { new: true }).exec();
}

export async function deleteService(id: string): Promise<ServiceDocument | null> {
  return ServiceModel.findByIdAndDelete(id).exec();
}

async function ensureNoOverlap(name: string, from: Date, to: Date, excludeId?: string) {
  const query: FilterQuery<ServiceDocument> = {
    name,
    availableFrom: { $lte: to },
    availableTo: { $gte: from },
  };
  if (excludeId) query._id = { $ne: excludeId };
  const existing = await ServiceModel.findOne(query).exec();
  if (existing) throw new Error('service availability overlaps');
}

async function ensureNoOverlapForUpdate(id: string, name: string, from: Date, to: Date) {
  await ensureNoOverlap(name, from, to, id);
}
