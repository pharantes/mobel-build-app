// Type definitions for the application

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ProjectInput {
  name: string;
  furnitureType: 'corner_shelf' | 'wall_shelf' | 'cabinet' | 'desk';
  dimensions: {
    width: number;
    depth: number;
    height: number;
    cornerAngle?: number;
  };
  features: {
    hasFootplates: boolean;
    numShelves?: number;
    numDrawers?: number;
    hasDoors: boolean;
    hasBackPanel: boolean;
    adjustableShelves: boolean;
    loadCapacityKg?: number;
  };
  materialPreference: string;
}

export interface ProjectOutput {
  id: string;
  userId: string;
  name: string;
  furnitureType: string;
  dimensions: any;
  features: any;
  materialPreference: string;
  status: 'draft' | 'generated' | 'completed';
  technicalSpecs?: any;
  cadFileUrl?: string;
  estimatedCost?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  type: 'wood' | 'plywood' | 'mdf' | 'hardware' | 'finish' | 'fastener';
  category: string;
  pricePerUnit: number;
  unit: string;
  dimensions?: string;
  thickness?: number;
  supplier?: string;
  availability: boolean;
  description?: string;
}

export interface PricingBreakdown {
  projectId: string;
  materials: Array<{
    materialId: string;
    materialName: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    totalPrice: number;
  }>;
  materialsCost: number;
  hardwareCost: number;
  finishingCost: number;
  laborEstimate?: number;
  totalCost: number;
  currency: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}
