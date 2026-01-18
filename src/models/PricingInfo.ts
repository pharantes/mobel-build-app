import mongoose, { Document, Schema } from 'mongoose';

export interface IMaterialCost {
  materialId: mongoose.Types.ObjectId;
  materialName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
}

export interface IPricingInfo extends Document {
  projectId: mongoose.Types.ObjectId;
  materials: IMaterialCost[];
  materialsCost: number;
  hardwareCost: number;
  finishingCost: number;
  laborEstimate?: number;
  totalCost: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

const PricingInfoSchema = new Schema<IPricingInfo>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      unique: true,
    },
    materials: [
      {
        materialId: {
          type: Schema.Types.ObjectId,
          ref: 'Material',
        },
        materialName: String,
        quantity: Number,
        unit: String,
        pricePerUnit: Number,
        totalPrice: Number,
      },
    ],
    materialsCost: {
      type: Number,
      default: 0,
    },
    hardwareCost: {
      type: Number,
      default: 0,
    },
    finishingCost: {
      type: Number,
      default: 0,
    },
    laborEstimate: {
      type: Number,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'EUR',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.PricingInfo || mongoose.model<IPricingInfo>('PricingInfo', PricingInfoSchema);
