import {
  IDimensions,
  IFeatures,
  ITechnicalSpecs,
  ICutListItem,
  IHardwareItem,
  ICADCoordinate,
} from '@/models/Project';
import {
  MATERIAL_THICKNESS,
  STANDARD_SHELF_PIN_SPACING,
  EDGE_CLEARANCE,
  adjustForThickness,
  calculateScrewCount,
  determineScrewSize,
  calculateShelfPinPositions,
} from './carpentryStandards';

export function generateCornerShelf(
  dimensions: IDimensions,
  features: IFeatures,
  material: string
): ITechnicalSpecs {
  const { width, depth, height, cornerAngle = 90 } = dimensions;
  const {
    hasFootplates,
    numShelves = 3,
    hasBackPanel,
    adjustableShelves,
  } = features;

  const thickness = MATERIAL_THICKNESS.PLYWOOD_STANDARD;
  const backPanelThickness = MATERIAL_THICKNESS.BACK_PANEL;

  // Calculate adjusted dimensions
  const shelfWidth = adjustForThickness(width, thickness, 1);
  const shelfDepth = adjustForThickness(depth, thickness, 1);
  const verticalHeight = height - (hasFootplates ? 50 : 0);

  const cutList: ICutListItem[] = [];
  const hardware: IHardwareItem[] = [];
  const assemblyInstructions: string[] = [];
  const cadCoordinates: ICADCoordinate[] = [];

  // VERTICAL SIDES (2 pieces)
  cutList.push({
    part: 'vertical_side_1',
    dimensions: `${width}x${verticalHeight}x${thickness}mm`,
    quantity: 1,
    material: `${material}`,
  });

  cutList.push({
    part: 'vertical_side_2',
    dimensions: `${depth}x${verticalHeight}x${thickness}mm`,
    quantity: 1,
    material: `${material}`,
  });

  // CAD coordinates for vertical sides
  cadCoordinates.push({
    element: 'vertical_side_1',
    start: [0, 0, hasFootplates ? 50 : 0],
    end: [thickness, width, height],
  });

  cadCoordinates.push({
    element: 'vertical_side_2',
    start: [0, 0, hasFootplates ? 50 : 0],
    end: [depth, thickness, height],
  });

  // SHELVES
  cutList.push({
    part: 'shelf',
    dimensions: `${shelfWidth}x${shelfDepth}x${thickness}mm`,
    quantity: numShelves || 3,
    material: `${material}`,
  });

  // Shelf positions
  const shelfSpacing = verticalHeight / ((numShelves || 3) + 1);
  for (let i = 1; i <= (numShelves || 3); i++) {
    const zPos = (hasFootplates ? 50 : 0) + shelfSpacing * i;
    cadCoordinates.push({
      element: `shelf_${i}`,
      start: [thickness, thickness, zPos],
      end: [thickness + shelfWidth, thickness + shelfDepth, zPos + thickness],
    });
  }

  // FOOTPLATES (if needed)
  if (hasFootplates) {
    cutList.push({
      part: 'footplate',
      dimensions: `${shelfWidth}x50x50mm`,
      quantity: 2,
      material: 'solid_pine',
    });

    cadCoordinates.push({
      element: 'footplate_1',
      start: [0, 0, 0],
      end: [50, shelfWidth, 50],
    });

    cadCoordinates.push({
      element: 'footplate_2',
      start: [0, 0, 0],
      end: [shelfDepth, 50, 50],
    });
  }

  // BACK PANEL (if needed)
  if (hasBackPanel) {
    const backWidth = shelfWidth + thickness;
    const backHeight = verticalHeight - thickness;

    cutList.push({
      part: 'back_panel',
      dimensions: `${backWidth}x${backHeight}x${backPanelThickness}mm`,
      quantity: 1,
      material: 'hardboard',
    });

    cadCoordinates.push({
      element: 'back_panel',
      start: [0, thickness, hasFootplates ? 50 : 0],
      end: [backPanelThickness, thickness + backWidth, height - thickness],
    });
  }

  // HARDWARE
  const screwSize = determineScrewSize(thickness, 'medium');
  const screwsPerShelf = calculateScrewCount(shelfWidth);
  const totalScrews = (numShelves || 3) * screwsPerShelf * 2 + (hasBackPanel ? 20 : 0);

  hardware.push({
    item: 'wood_screws',
    size: screwSize,
    quantity: totalScrews,
  });

  if (adjustableShelves) {
    const pinPositions = calculateShelfPinPositions(verticalHeight, numShelves || 3);
    hardware.push({
      item: 'shelf_pins',
      size: '5mm',
      quantity: pinPositions.length * 4, // 4 pins per shelf level
    });
  }

  hardware.push({
    item: 'corner_brackets',
    size: '50mm',
    quantity: 4,
  });

  hardware.push({
    item: 'wood_glue',
    size: '500ml',
    quantity: 1,
  });

  // ASSEMBLY INSTRUCTIONS
  assemblyInstructions.push(
    '1. Cut all pieces according to the cut list with clean 90° edges.'
  );

  if (hasFootplates) {
    assemblyInstructions.push(
      '2. Attach footplates to the bottom of both vertical sides using wood glue and screws.'
    );
  }

  if (adjustableShelves) {
    assemblyInstructions.push(
      `${hasFootplates ? '3' : '2'}. Drill shelf pin holes every ${STANDARD_SHELF_PIN_SPACING}mm along the inner faces of both vertical sides, starting ${EDGE_CLEARANCE}mm from the front edge.`
    );
  }

  assemblyInstructions.push(
    `${adjustableShelves ? (hasFootplates ? '4' : '3') : (hasFootplates ? '3' : '2')}. Position the two vertical sides at a ${cornerAngle}° angle in the desired corner location.`
  );

  if (hasBackPanel) {
    assemblyInstructions.push(
      `${assemblyInstructions.length + 1}. Attach the back panel to secure the corner joint using small nails or screws every 150mm.`
    );
  }

  assemblyInstructions.push(
    `${assemblyInstructions.length + 1}. Install corner brackets at the top and bottom where the two sides meet for additional strength.`
  );

  if (adjustableShelves) {
    assemblyInstructions.push(
      `${assemblyInstructions.length + 1}. Insert shelf pins at desired heights and place shelves on top.`
    );
  } else {
    assemblyInstructions.push(
      `${assemblyInstructions.length + 1}. Install fixed shelves by screwing through the vertical sides into the shelf edges. Pre-drill holes to prevent splitting.`
    );
  }

  assemblyInstructions.push(
    `${assemblyInstructions.length + 1}. Level the unit and secure to wall studs using appropriate wall anchors for safety.`
  );

  return {
    cutList,
    hardware,
    assemblyInstructions,
    cadCoordinates,
  };
}
