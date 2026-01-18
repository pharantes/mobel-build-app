import mongoose, { Document, Schema } from 'mongoose';

export interface IDimensions {
  width: number;
  depth: number;
  height: number;
  cornerAngle?: number;
}

export interface IFeatures {
  hasFootplates: boolean;
  numShelves?: number;
  numDrawers?: number;
  hasDoors: boolean;
  hasBackPanel: boolean;
  adjustableShelves: boolean;
  loadCapacityKg?: number;
}

export interface ICutListItem {
  part: string;
  dimensions: string;
  quantity: number;
  material: string;
}

export interface IHardwareItem {
  item: string;
  size: string;
  quantity: number;
}

export interface ICADCoordinate {
  element: string;
  start: number[];
  end: number[];
}

export interface ITechnicalSpecs {
  cutList: ICutListItem[];
  hardware: IHardwareItem[];
  assemblyInstructions: string[];
  cadCoordinates: ICADCoordinate[];
}

export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  furnitureType: 'corner_shelf' | 'wall_shelf' | 'cabinet' | 'desk';
  dimensions: IDimensions;
  features: IFeatures;
  materialPreference: string;
  status: 'draft' | 'generated' | 'completed';
  technicalSpecs?: ITechnicalSpecs;
  cadFileUrl?: string;
  estimatedCost?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a project name'],
      maxlength: [100, 'Project name cannot be more than 100 characters'],
    },
    furnitureType: {
      type: String,
      enum: ['corner_shelf', 'wall_shelf', 'cabinet', 'desk'],
      required: true,
    },
    dimensions: {
      width: { type: Number, required: true },
      depth: { type: Number, required: true },
      height: { type: Number, required: true },
      cornerAngle: { type: Number, default: 90 },
    },
    features: {
      hasFootplates: { type: Boolean, default: false },
      numShelves: { type: Number, default: 3 },
      numDrawers: { type: Number, default: 0 },
      hasDoors: { type: Boolean, default: false },
      hasBackPanel: { type: Boolean, default: true },
      adjustableShelves: { type: Boolean, default: true },
      loadCapacityKg: { type: Number, default: 50 },
    },
    materialPreference: {
      type: String,
      default: 'pine_plywood',
    },
    status: {
      type: String,
      enum: ['draft', 'generated', 'completed'],
      default: 'draft',
    },
    technicalSpecs: {
      cutList: [
        {
          part: String,
          dimensions: String,
          quantity: Number,
          material: String,
        },
      ],
      hardware: [
        {
          item: String,
          size: String,
          quantity: Number,
        },
      ],
      assemblyInstructions: [String],
      cadCoordinates: [
        {
          element: String,
          start: [Number],
          end: [Number],
        },
      ],
    },
    cadFileUrl: String,
    estimatedCost: Number,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
