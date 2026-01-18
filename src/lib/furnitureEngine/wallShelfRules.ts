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
  adjustForThickness,
  calculateScrewCount,
  determineScrewSize,
  calculateShelfPinPositions,
} from './carpentryStandards';

export function generateWallShelf(
  dimensions: IDimensions,
  features: IFeatures,
  material: string
): ITechnicalSpecs {
  const { width, depth, height } = dimensions;
  const { numShelves = 3, hasBackPanel, adjustableShelves } = features;

  const thickness = MATERIAL_THICKNESS.PLYWOOD_STANDARD;
  const backPanelThickness = MATERIAL_THICKNESS.BACK_PANEL;

  const shelfWidth = adjustForThickness(width, thickness, 2);
  const shelfDepth = depth;

  const cutList: ICutListItem[] = [];
  const hardware: IHardwareItem[] = [];
  const assemblyInstructions: string[] = [];
  const cadCoordinates: ICADCoordinate[] = [];

  // VERTICAL SIDES (2 pieces)
  cutList.push({
    part: 'vertical_side',
    dimensions: `${depth}x${height}x${thickness}mm`,
    quantity: 2,
    material: `${material}`,
  });

  cadCoordinates.push(
    {
      element: 'vertical_side_left',
      start: [0, 0, 0],
      end: [thickness, depth, height],
    },
    {
      element: 'vertical_side_right',
      start: [width - thickness, 0, 0],
      end: [width, depth, height],
    }
  );

  // TOP AND BOTTOM
  cutList.push({
    part: 'top_bottom',
    dimensions: `${shelfWidth}x${shelfDepth}x${thickness}mm`,
    quantity: 2,
    material: `${material}`,
  });

  cadCoordinates.push(
    {
      element: 'bottom',
      start: [thickness, 0, 0],
      end: [width - thickness, depth, thickness],
    },
    {
      element: 'top',
      start: [thickness, 0, height - thickness],
      end: [width - thickness, depth, height],
    }
  );

  // SHELVES (excluding top and bottom)
  if (numShelves && numShelves > 2) {
    cutList.push({
      part: 'shelf',
      dimensions: `${shelfWidth}x${shelfDepth}x${thickness}mm`,
      quantity: numShelves - 2,
      material: `${material}`,
    });

    const shelfSpacing = (height - 2 * thickness) / (numShelves - 1);
    for (let i = 1; i < numShelves - 1; i++) {
      cadCoordinates.push({
        element: `shelf_${i}`,
        start: [thickness, 0, thickness + shelfSpacing * i],
        end: [width - thickness, depth, thickness + shelfSpacing * i + thickness],
      });
    }
  }

  // BACK PANEL
  if (hasBackPanel) {
    cutList.push({
      part: 'back_panel',
      dimensions: `${width}x${height}x${backPanelThickness}mm`,
      quantity: 1,
      material: 'hardboard',
    });

    cadCoordinates.push({
      element: 'back_panel',
      start: [0, 0, 0],
      end: [width, backPanelThickness, height],
    });
  }

  // HARDWARE
  const screwSize = determineScrewSize(thickness, 'medium');
  const screwsPerJoint = 4;
  const totalJoints = (numShelves || 3) * 2; // Each shelf connects to 2 sides

  hardware.push({
    item: 'wood_screws',
    size: screwSize,
    quantity: totalJoints * screwsPerJoint + (hasBackPanel ? 30 : 0),
  });

  if (adjustableShelves && numShelves && numShelves > 2) {
    hardware.push({
      item: 'shelf_pins',
      size: '5mm',
      quantity: (numShelves - 2) * 4,
    });
  }

  hardware.push({
    item: 'wall_brackets',
    size: 'heavy_duty',
    quantity: 2,
  });

  hardware.push({
    item: 'wood_glue',
    size: '500ml',
    quantity: 1,
  });

  // ASSEMBLY INSTRUCTIONS
  assemblyInstructions.push(
    '1. Cut all pieces according to the cut list with clean, square edges.',
    '2. Sand all pieces smooth, especially the visible edges.',
    '3. Lay one vertical side flat and attach the bottom piece using wood glue and screws. Pre-drill to avoid splitting.',
    '4. Attach the top piece to the same vertical side.',
    '5. If using fixed shelves, attach them now at the marked positions.'
  );

  if (adjustableShelves && numShelves && numShelves > 2) {
    assemblyInstructions.push(
      '6. Drill shelf pin holes on both vertical sides at regular intervals for adjustable shelves.'
    );
  }

  assemblyInstructions.push(
    `${assemblyInstructions.length + 1}. Attach the second vertical side, ensuring the unit is square.`
  );

  if (hasBackPanel) {
    assemblyInstructions.push(
      `${assemblyInstructions.length + 1}. Attach the back panel using small nails or screws to keep everything square and add rigidity.`
    );
  }

  assemblyInstructions.push(
    `${assemblyInstructions.length + 1}. Mount to wall using heavy-duty wall brackets. Ensure brackets are attached to wall studs for maximum strength.`,
    `${assemblyInstructions.length + 2}. Insert adjustable shelves at desired heights or verify fixed shelves are level.`
  );

  return {
    cutList,
    hardware,
    assemblyInstructions,
    cadCoordinates,
  };
}
