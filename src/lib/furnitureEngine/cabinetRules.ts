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
  determineScrewSize,
} from './carpentryStandards';

export function generateCabinet(
  dimensions: IDimensions,
  features: IFeatures,
  material: string
): ITechnicalSpecs {
  const { width, depth, height } = dimensions;
  const {
    numShelves = 2,
    numDrawers = 0,
    hasDoors,
    hasBackPanel,
    hasFootplates,
  } = features;

  const thickness = MATERIAL_THICKNESS.PLYWOOD_STANDARD;
  const backPanelThickness = MATERIAL_THICKNESS.BACK_PANEL;

  const interiorWidth = adjustForThickness(width, thickness, 2);
  const interiorDepth = depth - thickness;
  const interiorHeight = height - 2 * thickness - (hasFootplates ? 50 : 0);

  const cutList: ICutListItem[] = [];
  const hardware: IHardwareItem[] = [];
  const assemblyInstructions: string[] = [];
  const cadCoordinates: ICADCoordinate[] = [];

  // VERTICAL SIDES (2)
  cutList.push({
    part: 'side_panel',
    dimensions: `${depth}x${height}x${thickness}mm`,
    quantity: 2,
    material: `${material}`,
  });

  cadCoordinates.push(
    {
      element: 'side_left',
      start: [0, 0, 0],
      end: [thickness, depth, height],
    },
    {
      element: 'side_right',
      start: [width - thickness, 0, 0],
      end: [width, depth, height],
    }
  );

  // TOP AND BOTTOM
  cutList.push({
    part: 'top_bottom',
    dimensions: `${interiorWidth}x${depth}x${thickness}mm`,
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

  // SHELVES
  if (numShelves && numShelves > 0) {
    cutList.push({
      part: 'shelf',
      dimensions: `${interiorWidth}x${interiorDepth}x${thickness}mm`,
      quantity: numShelves,
      material: `${material}`,
    });

    const shelfSpacing = interiorHeight / (numShelves + 1);
    for (let i = 1; i <= numShelves; i++) {
      cadCoordinates.push({
        element: `shelf_${i}`,
        start: [thickness, 0, thickness + shelfSpacing * i],
        end: [width - thickness, interiorDepth, thickness + shelfSpacing * i + thickness],
      });
    }
  }

  // FOOTPLATES
  if (hasFootplates) {
    cutList.push({
      part: 'footplate',
      dimensions: `${interiorWidth}x50x50mm`,
      quantity: 2,
      material: 'solid_pine',
    });
  }

  // BACK PANEL
  if (hasBackPanel) {
    cutList.push({
      part: 'back_panel',
      dimensions: `${interiorWidth}x${height - 2 * thickness}x${backPanelThickness}mm`,
      quantity: 1,
      material: 'hardboard',
    });

    cadCoordinates.push({
      element: 'back_panel',
      start: [thickness, depth - backPanelThickness, thickness],
      end: [width - thickness, depth, height - thickness],
    });
  }

  // DOORS
  if (hasDoors) {
    const doorWidth = interiorWidth / 2 - 2; // 2mm gap between doors
    const doorHeight = height - 2 * thickness - 4; // 2mm gap top and bottom

    cutList.push({
      part: 'door',
      dimensions: `${doorWidth}x${doorHeight}x${thickness}mm`,
      quantity: 2,
      material: `${material}`,
    });

    cadCoordinates.push(
      {
        element: 'door_left',
        start: [thickness, 0, thickness + 2],
        end: [thickness + doorWidth, thickness, height - thickness - 2],
      },
      {
        element: 'door_right',
        start: [width - thickness - doorWidth, 0, thickness + 2],
        end: [width - thickness, thickness, height - thickness - 2],
      }
    );
  }

  // DRAWERS
  if (numDrawers && numDrawers > 0) {
    const drawerWidth = interiorWidth - 2;
    const drawerDepth = interiorDepth - 20;
    const drawerHeight = 120;

    // Each drawer needs 4 sides
    cutList.push({
      part: 'drawer_front_back',
      dimensions: `${drawerWidth}x${drawerHeight}x${MATERIAL_THICKNESS.PLYWOOD_THIN}mm`,
      quantity: numDrawers * 2,
      material: `${material}`,
    });

    cutList.push({
      part: 'drawer_sides',
      dimensions: `${drawerDepth}x${drawerHeight}x${MATERIAL_THICKNESS.PLYWOOD_THIN}mm`,
      quantity: numDrawers * 2,
      material: `${material}`,
    });

    cutList.push({
      part: 'drawer_bottom',
      dimensions: `${drawerWidth}x${drawerDepth}x${backPanelThickness}mm`,
      quantity: numDrawers,
      material: 'hardboard',
    });
  }

  // HARDWARE
  const screwSize = determineScrewSize(thickness, 'medium');

  hardware.push({
    item: 'wood_screws',
    size: screwSize,
    quantity: 60 + (numShelves || 0) * 8,
  });

  if (hasDoors) {
    hardware.push({
      item: 'hinges',
      size: '35mm_euro',
      quantity: 4, // 2 per door
    });

    hardware.push({
      item: 'door_handles',
      size: '128mm',
      quantity: 2,
    });
  }

  if (numDrawers && numDrawers > 0) {
    hardware.push({
      item: 'drawer_slides',
      size: `${depth - 50}mm`,
      quantity: numDrawers * 2, // Pair per drawer
    });

    hardware.push({
      item: 'drawer_handles',
      size: '96mm',
      quantity: numDrawers,
    });
  }

  hardware.push({
    item: 'wood_glue',
    size: '500ml',
    quantity: 1,
  });

  // ASSEMBLY INSTRUCTIONS
  assemblyInstructions.push(
    '1. Cut all pieces according to the cut list.',
    '2. Sand all pieces, paying special attention to visible edges.'
  );

  if (hasFootplates) {
    assemblyInstructions.push(
      '3. Attach footplates to the bottom of both side panels.'
    );
  }

  assemblyInstructions.push(
    `${assemblyInstructions.length + 1}. Attach the bottom panel between the two side panels using glue and screws.`,
    `${assemblyInstructions.length + 1}. Install fixed shelves at marked positions.`,
    `${assemblyInstructions.length + 1}. Attach the top panel.`
  );

  if (hasBackPanel) {
    assemblyInstructions.push(
      `${assemblyInstructions.length + 1}. Secure the back panel to keep the cabinet square.`
    );
  }

  if (numDrawers && numDrawers > 0) {
    assemblyInstructions.push(
      `${assemblyInstructions.length + 1}. Assemble drawer boxes: attach front, back, and sides with glue and nails. Add bottom panel.`,
      `${assemblyInstructions.length + 1}. Install drawer slides on cabinet sides and drawer boxes according to manufacturer instructions.`
    );
  }

  if (hasDoors) {
    assemblyInstructions.push(
      `${assemblyInstructions.length + 1}. Install hinges on doors and mount to cabinet sides.`,
      `${assemblyInstructions.length + 1}. Attach door handles and adjust door alignment.`
    );
  }

  assemblyInstructions.push(
    `${assemblyInstructions.length + 1}. Level the cabinet and optionally anchor to wall for stability.`
  );

  return {
    cutList,
    hardware,
    assemblyInstructions,
    cadCoordinates,
  };
}
