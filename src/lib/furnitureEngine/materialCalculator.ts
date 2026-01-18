import { ICutListItem, IHardwareItem } from '@/models/Project';

interface MaterialRequirement {
  material: string;
  totalArea?: number; // for sheet materials (mm²)
  totalLength?: number; // for linear materials (mm)
  pieces?: number; // for hardware
}

interface MaterialCalculation {
  sheetsNeeded: { [key: string]: number };
  hardwareList: { item: string; quantity: number }[];
  wasteFactor: number;
}

const STANDARD_SHEET_SIZE = {
  width: 1220, // mm
  height: 2440, // mm
  area: 1220 * 2440, // mm²
};

/**
 * Calculate total material needs from cut list
 */
export function calculateMaterialNeeds(
  cutList: ICutListItem[]
): MaterialCalculation {
  const materials: { [key: string]: MaterialRequirement } = {};

  // Group by material type and calculate totals
  cutList.forEach((item) => {
    const key = item.material;

    if (!materials[key]) {
      materials[key] = {
        material: key,
        totalArea: 0,
        totalLength: 0,
      };
    }

    // Parse dimensions (e.g., "800x400x18mm")
    const dims = parseDimensions(item.dimensions);

    if (dims) {
      const pieceArea = dims.width * dims.height;
      const pieceQuantity = item.quantity;

      materials[key].totalArea! += pieceArea * pieceQuantity;
    }
  });

  // Calculate sheets needed (with 10% waste factor)
  const sheetsNeeded: { [key: string]: number } = {};
  const wasteFactor = 1.1;

  Object.entries(materials).forEach(([material, req]) => {
    if (req.totalArea) {
      const sheetsRequired = Math.ceil(
        (req.totalArea * wasteFactor) / STANDARD_SHEET_SIZE.area
      );
      sheetsNeeded[material] = sheetsRequired;
    }
  });

  return {
    sheetsNeeded,
    hardwareList: [],
    wasteFactor,
  };
}

/**
 * Calculate hardware quantities from hardware list
 */
export function calculateHardwareQuantities(
  hardwareList: IHardwareItem[]
): { item: string; quantity: number; size: string }[] {
  const grouped: { [key: string]: { quantity: number; size: string } } = {};

  hardwareList.forEach((hw) => {
    const key = `${hw.item}_${hw.size}`;
    if (!grouped[key]) {
      grouped[key] = { quantity: 0, size: hw.size };
    }
    grouped[key].quantity += hw.quantity;
  });

  return Object.entries(grouped).map(([key, value]) => ({
    item: key.split('_')[0],
    quantity: value.quantity,
    size: value.size,
  }));
}

/**
 * Estimate material cost based on cut list
 */
export function estimateMaterialCost(
  cutList: ICutListItem[],
  materialPrices: { [key: string]: number } = {}
): number {
  const defaultPrices: { [key: string]: number } = {
    pine_plywood: 45, // EUR per sheet
    birch_plywood: 65,
    oak_plywood: 85,
    mdf: 35,
    hardboard: 15,
    solid_pine: 8, // EUR per linear meter
    solid_oak: 15,
  };

  const prices = { ...defaultPrices, ...materialPrices };
  const { sheetsNeeded } = calculateMaterialNeeds(cutList);

  let totalCost = 0;

  Object.entries(sheetsNeeded).forEach(([material, sheets]) => {
    const pricePerSheet = prices[material] || 40;
    totalCost += sheets * pricePerSheet;
  });

  return totalCost;
}

/**
 * Estimate hardware cost
 */
export function estimateHardwareCost(hardwareList: IHardwareItem[]): number {
  const hardwarePrices: { [key: string]: number } = {
    wood_screws: 0.05, // EUR per piece
    shelf_pins: 0.15,
    corner_brackets: 0.80,
    drawer_slides: 12.00,
    hinges: 3.50,
    handles: 2.50,
    dowels: 0.10,
    wood_glue: 8.00, // per bottle
  };

  let totalCost = 0;

  hardwareList.forEach((hw) => {
    const price = hardwarePrices[hw.item] || 1.0;
    totalCost += price * hw.quantity;
  });

  return totalCost;
}

/**
 * Parse dimension string to object
 */
function parseDimensions(dimString: string): {
  width: number;
  height: number;
  thickness: number;
} | null {
  // Format: "800x400x18mm"
  const match = dimString.match(/(\d+)x(\d+)x(\d+)/);

  if (match) {
    return {
      width: parseInt(match[1], 10),
      height: parseInt(match[2], 10),
      thickness: parseInt(match[3], 10),
    };
  }

  return null;
}

/**
 * Optimize sheet cutting (simple bin packing)
 */
export function optimizeCutting(
  cutList: ICutListItem[]
): { layout: string; efficiency: number } {
  // Simplified cutting optimization
  // In production, use a proper bin packing algorithm

  const pieces = cutList.flatMap((item) => {
    const dims = parseDimensions(item.dimensions);
    if (!dims) return [];

    return Array(item.quantity)
      .fill(null)
      .map(() => ({
        width: dims.width,
        height: dims.height,
        part: item.part,
      }));
  });

  // Sort by area (largest first)
  pieces.sort((a, b) => b.width * b.height - a.width * a.height);

  const efficiency = 0.75; // Assume 75% material efficiency

  return {
    layout: 'Optimized layout with largest pieces first',
    efficiency,
  };
}
