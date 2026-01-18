import mongoose, { Document, Schema } from 'mongoose';

export interface IMaterial extends Document {
  name: string;
  type: 'wood' | 'plywood' | 'mdf' | 'hardware' | 'finish' | 'fastener';
  category: string;
  pricePerUnit: number;
  unit: 'sheet' | 'linear_meter' | 'piece' | 'kg';
  dimensions?: string;
  thickness?: number;
  supplier?: string;
  availability: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MaterialSchema = new Schema<IMaterial>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a material name'],
      maxlength: [100, 'Material name cannot be more than 100 characters'],
    },
    type: {
      type: String,
      enum: ['wood', 'plywood', 'mdf', 'hardware', 'finish', 'fastener'],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative'],
    },
    unit: {
      type: String,
      enum: ['sheet', 'linear_meter', 'piece', 'kg'],
      required: true,
    },
    dimensions: {
      type: String,
    },
    thickness: {
      type: Number,
    },
    supplier: {
      type: String,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Material || mongoose.model<IMaterial>('Material', MaterialSchema);
