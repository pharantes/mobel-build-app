// Carpentry standards and constants

export const MATERIAL_THICKNESS = {
  PLYWOOD_STANDARD: 18,
  PLYWOOD_THIN: 12,
  MDF: 18,
  SOLID_WOOD: 20,
  BACK_PANEL: 6,
} as const;

export const JOINT_TYPES = {
  BUTT: 'butt',
  DADO: 'dado',
  RABBET: 'rabbet',
  DOWEL: 'dowel',
} as const;

export const STANDARD_SCREW_SIZES = {
  LIGHT_DUTY: '3x30mm',
  MEDIUM_DUTY: '4x40mm',
  HEAVY_DUTY: '5x50mm',
} as const;

export const LOAD_CAPACITY_FACTORS = {
  PLYWOOD_18MM: 25, // kg per linear meter
  PLYWOOD_12MM: 15,
  SOLID_WOOD: 35,
  MDF_18MM: 20,
} as const;

export const EDGE_CLEARANCE = 20; // mm from edge for screws/holes
export const MIN_SHELF_SPACING = 250; // mm minimum between shelves
export const STANDARD_SHELF_PIN_SPACING = 32; // mm between pin holes

// Material waste factor (add 10% for cuts and mistakes)
export const WASTE_FACTOR = 1.1;

// Standard furniture dimensions
export const STANDARD_DIMENSIONS = {
  DESK_HEIGHT: 750,
  COUNTER_HEIGHT: 900,
  SHELF_DEPTH_BOOKS: 250,
  SHELF_DEPTH_DISPLAY: 200,
  FOOTPLATE_HEIGHT: 50,
  FOOTPLATE_WIDTH: 50,
} as const;

/**
 * Calculate load capacity for a shelf
 */
export function calculateLoadCapacity(
  width: number,
  depth: number,
  thickness: number,
  materialType: keyof typeof LOAD_CAPACITY_FACTORS
): number {
  const capacityPerMeter = LOAD_CAPACITY_FACTORS[materialType];
  const spanMeters = width / 1000;

  // Load capacity decreases with span
  const baseCapacity = capacityPerMeter * (depth / 300);
  const spanFactor = Math.max(0.3, 1 - (spanMeters - 0.5) * 0.3);

  return Math.round(baseCapacity * spanFactor);
}

/**
 * Calculate number of screws needed based on dimensions
 */
export function calculateScrewCount(
  length: number,
  screwSpacing: number = 150
): number {
  return Math.max(2, Math.ceil(length / screwSpacing));
}

/**
 * Determine screw size based on load and material
 */
export function determineScrewSize(
  materialThickness: number,
  expectedLoad: 'light' | 'medium' | 'heavy'
): string {
  if (expectedLoad === 'heavy' || materialThickness >= 20) {
    return STANDARD_SCREW_SIZES.HEAVY_DUTY;
  } else if (expectedLoad === 'medium' || materialThickness >= 15) {
    return STANDARD_SCREW_SIZES.MEDIUM_DUTY;
  }
  return STANDARD_SCREW_SIZES.LIGHT_DUTY;
}

/**
 * Calculate shelf pin hole positions
 */
export function calculateShelfPinPositions(
  height: number
): number[] {
  const positions: number[] = [];
  const usableHeight = height - 100; // Leave space at top and bottom

  // Create holes every STANDARD_SHELF_PIN_SPACING from bottom to top
  for (let h = 50; h < usableHeight; h += STANDARD_SHELF_PIN_SPACING) {
    positions.push(h);
  }

  return positions;
}

/**
 * Adjust dimensions for material thickness
 */
export function adjustForThickness(
  dimension: number,
  thickness: number,
  sides: number = 2
): number {
  return dimension - (thickness * sides);
}
