import { Schema, model, Document } from 'mongoose';

export interface Rate {
  hourly: number;
  daily: number;
}

export interface ServiceDocument extends Document {
  name: string;
  description?: string;
  availableFrom: Date;
  availableTo: Date;
  rates: Rate;
  quantity: number;
}

const rateSchema = new Schema<Rate>(
  {
    hourly: { type: Number, required: true },
    daily: { type: Number, required: true },
  },
  { _id: false }
);

const serviceSchema = new Schema<ServiceDocument>(
  {
    name: { type: String, required: true },
    description: { type: String },
    availableFrom: { type: Date, required: true },
    availableTo: { type: Date, required: true },
    rates: { type: rateSchema, required: true },
    quantity: { type: Number, required: true },
  },
  { timestamps: true }
);

export const ServiceModel = model<ServiceDocument>('Service', serviceSchema);
