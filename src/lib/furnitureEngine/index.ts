import { IDimensions, IFeatures, ITechnicalSpecs } from '@/models/Project';
import { generateCornerShelf } from './cornerShelfRules';
import { generateWallShelf } from './wallShelfRules';
import { generateCabinet } from './cabinetRules';
import { generateDesk } from './deskRules';

export type FurnitureType = 'corner_shelf' | 'wall_shelf' | 'cabinet' | 'desk';

export interface FurnitureSpecification {
  furnitureType: FurnitureType;
  dimensions: IDimensions;
  features: IFeatures;
  materialPreference: string;
}

/**
 * Main furniture engine coordinator
 * Routes to appropriate rule-based generator
 */
export function generateFurniture(spec: FurnitureSpecification): ITechnicalSpecs {
  const { furnitureType, dimensions, features, materialPreference } = spec;

  switch (furnitureType) {
    case 'corner_shelf':
      return generateCornerShelf(dimensions, features, materialPreference);

    case 'wall_shelf':
      return generateWallShelf(dimensions, features, materialPreference);

    case 'cabinet':
      return generateCabinet(dimensions, features, materialPreference);

    case 'desk':
      return generateDesk(dimensions, features, materialPreference);

    default:
      throw new Error(`Unsupported furniture type: ${furnitureType}`);
  }
}

/**
 * Validate input dimensions
 */
export function validateDimensions(
  furnitureType: FurnitureType,
  dimensions: IDimensions
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const { width, depth, height } = dimensions;

  // General validations
  if (width <= 0 || width > 3000) {
    errors.push('Width must be between 1mm and 3000mm');
  }

  if (depth <= 0 || depth > 1000) {
    errors.push('Depth must be between 1mm and 1000mm');
  }

  if (height <= 0 || height > 3000) {
    errors.push('Height must be between 1mm and 3000mm');
  }

  // Type-specific validations
  switch (furnitureType) {
    case 'corner_shelf':
      if (width < 300 || depth < 300) {
        errors.push('Corner shelves must be at least 300mm in width and depth');
      }
      if (height < 500) {
        errors.push('Corner shelves must be at least 500mm tall');
      }
      break;

    case 'wall_shelf':
      if (width < 400) {
        errors.push('Wall shelves must be at least 400mm wide');
      }
      if (depth < 150 || depth > 600) {
        errors.push('Wall shelf depth must be between 150mm and 600mm');
      }
      break;

    case 'cabinet':
      if (width < 400 || height < 600) {
        errors.push('Cabinets must be at least 400mm wide and 600mm tall');
      }
      break;

    case 'desk':
      if (width < 800 || width > 2400) {
        errors.push('Desk width must be between 800mm and 2400mm');
      }
      if (depth < 500 || depth > 900) {
        errors.push('Desk depth must be between 500mm and 900mm');
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get recommended dimensions for furniture type
 */
export function getRecommendedDimensions(
  furnitureType: FurnitureType
): IDimensions {
  const recommendations: Record<FurnitureType, IDimensions> = {
    corner_shelf: {
      width: 800,
      depth: 800,
      height: 1800,
      cornerAngle: 90,
    },
    wall_shelf: {
      width: 1200,
      depth: 300,
      height: 1000,
    },
    cabinet: {
      width: 800,
      depth: 400,
      height: 1800,
    },
    desk: {
      width: 1400,
      depth: 700,
      height: 750,
    },
  };

  return recommendations[furnitureType];
}
