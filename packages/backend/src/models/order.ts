import { Schema, model, Document, Types } from 'mongoose';
import { ServiceDocument } from './service';

export type LineItemStatus = 'pending' | 'accepted' | 'rejected';

export interface LineItem {
  service: Types.ObjectId | ServiceDocument;
  quantity: number;
  status: LineItemStatus;
}

export interface OrderDocument extends Document {
  lineItems: Types.DocumentArray<LineItem & { _id: Types.ObjectId }>;
  status: 'pending' | 'accepted' | 'rejected';
  rejectionNotes?: string;
}

const lineItemSchema = new Schema<LineItem>(
  {
    service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
    quantity: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
      required: true,
    },
  },
  { _id: true }
);

const orderSchema = new Schema<OrderDocument>(
  {
    lineItems: { type: [lineItemSchema], required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
      required: true,
    },
    rejectionNotes: String,
  },
  { timestamps: true }
);

export const OrderModel = model<OrderDocument>('Order', orderSchema);
