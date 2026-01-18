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
  STANDARD_DIMENSIONS,
  adjustForThickness,
  determineScrewSize,
} from './carpentryStandards';

export function generateDesk(
  dimensions: IDimensions,
  features: IFeatures,
  material: string
): ITechnicalSpecs {
  const { width, depth } = dimensions;
  const height = STANDARD_DIMENSIONS.DESK_HEIGHT; // Standard desk height
  const { numDrawers = 0, hasFootplates } = features;

  const thickness = MATERIAL_THICKNESS.PLYWOOD_STANDARD;
  const legWidth = 60;
  const legDepth = 60;

  const cutList: ICutListItem[] = [];
  const hardware: IHardwareItem[] = [];
  const assemblyInstructions: string[] = [];
  const cadCoordinates: ICADCoordinate[] = [];

  // DESKTOP (Top)
  cutList.push({
    part: 'desktop',
    dimensions: `${width}x${depth}x${thickness}mm`,
    quantity: 1,
    material: `${material}`,
  });

  cadCoordinates.push({
    element: 'desktop',
    start: [0, 0, height - thickness],
    end: [width, depth, height],
  });

  // LEGS (4)
  const legHeight = height - thickness - (hasFootplates ? 50 : 0);

  cutList.push({
    part: 'leg',
    dimensions: `${legWidth}x${legDepth}x${legHeight}mm`,
    quantity: 4,
    material: 'solid_pine',
  });

  // Leg positions (inset 50mm from edges)
  const legInset = 50;
  cadCoordinates.push(
    {
      element: 'leg_front_left',
      start: [legInset, legInset, hasFootplates ? 50 : 0],
      end: [legInset + legWidth, legInset + legDepth, height - thickness],
    },
    {
      element: 'leg_front_right',
      start: [width - legInset - legWidth, legInset, hasFootplates ? 50 : 0],
      end: [width - legInset, legInset + legDepth, height - thickness],
    },
    {
      element: 'leg_back_left',
      start: [legInset, depth - legInset - legDepth, hasFootplates ? 50 : 0],
      end: [legInset + legWidth, depth - legInset, height - thickness],
    },
    {
      element: 'leg_back_right',
      start: [width - legInset - legWidth, depth - legInset - legDepth, hasFootplates ? 50 : 0],
      end: [width - legInset, depth - legInset, height - thickness],
    }
  );

  // APRONS (Support beams between legs)
  const apronWidth = 100;
  const frontBackApronLength = adjustForThickness(width, legWidth, 2);
  const sideApronLength = adjustForThickness(depth, legWidth, 2);

  cutList.push({
    part: 'apron_front_back',
    dimensions: `${frontBackApronLength}x${apronWidth}x${thickness}mm`,
    quantity: 2,
    material: `${material}`,
  });

  cutList.push({
    part: 'apron_sides',
    dimensions: `${sideApronLength}x${apronWidth}x${thickness}mm`,
    quantity: 2,
    material: `${material}`,
  });

  cadCoordinates.push(
    {
      element: 'apron_front',
      start: [legInset + legWidth, legInset, height - thickness - apronWidth],
      end: [width - legInset - legWidth, legInset + thickness, height - thickness],
    },
    {
      element: 'apron_back',
      start: [legInset + legWidth, depth - legInset - thickness, height - thickness - apronWidth],
      end: [width - legInset - legWidth, depth - legInset, height - thickness],
    }
  );

  // FOOTPLATES
  if (hasFootplates) {
    cutList.push({
      part: 'footplate',
      dimensions: `${legWidth}x${legDepth}x50mm`,
      quantity: 4,
      material: 'solid_pine',
    });
  }

  // DRAWER UNIT (if requested)
  if (numDrawers && numDrawers > 0) {
    const drawerUnitWidth = 400;
    const drawerUnitDepth = depth - 100;
    const drawerUnitHeight = height - thickness - 150;

    cutList.push({
      part: 'drawer_unit_side',
      dimensions: `${drawerUnitDepth}x${drawerUnitHeight}x${thickness}mm`,
      quantity: 2,
      material: `${material}`,
    });

    cutList.push({
      part: 'drawer_unit_top_bottom',
      dimensions: `${drawerUnitWidth - 2 * thickness}x${drawerUnitDepth}x${thickness}mm`,
      quantity: 2,
      material: `${material}`,
    });

    // Drawer boxes
    const drawerWidth = drawerUnitWidth - 2 * thickness - 2;
    const drawerDepth = drawerUnitDepth - 20;
    const drawerHeight = (drawerUnitHeight - (numDrawers + 1) * thickness) / numDrawers;

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
      dimensions: `${drawerWidth}x${drawerDepth}x6mm`,
      quantity: numDrawers,
      material: 'hardboard',
    });
  }

  // HARDWARE
  const screwSize = determineScrewSize(thickness, 'heavy');

  hardware.push({
    item: 'wood_screws',
    size: screwSize,
    quantity: 40,
  });

  hardware.push({
    item: 'corner_brackets',
    size: '75mm',
    quantity: 8, // 2 per leg
  });

  if (numDrawers && numDrawers > 0) {
    hardware.push({
      item: 'drawer_slides',
      size: `${depth - 150}mm`,
      quantity: numDrawers * 2,
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

  hardware.push({
    item: 'furniture_levelers',
    size: 'adjustable',
    quantity: 4,
  });

  // ASSEMBLY INSTRUCTIONS
  assemblyInstructions.push(
    '1. Cut all pieces according to the cut list.',
    '2. Sand the desktop thoroughly, especially the top surface and edges.'
  );

  if (hasFootplates) {
    assemblyInstructions.push(
      '3. Attach footplates to the bottom of each leg.'
    );
  }

  assemblyInstructions.push(
    `${assemblyInstructions.length + 1}. Attach the front and back aprons between the front and back leg pairs using pocket holes or dowels and wood glue.`,
    `${assemblyInstructions.length + 1}. Connect the front and back leg assemblies with the side aprons.`,
    `${assemblyInstructions.length + 1}. Reinforce each leg-to-apron joint with corner brackets for maximum strength.`,
    `${assemblyInstructions.length + 1}. Flip the leg assembly upside down and attach the desktop using screws from underneath through the aprons.`
  );

  if (numDrawers && numDrawers > 0) {
    assemblyInstructions.push(
      `${assemblyInstructions.length + 1}. Build the drawer unit box and attach it under the desk on one side.`,
      `${assemblyInstructions.length + 1}. Assemble drawer boxes and install drawer slides.`,
      `${assemblyInstructions.length + 1}. Install drawers and attach handles.`
    );
  }

  assemblyInstructions.push(
    `${assemblyInstructions.length + 1}. Flip the desk right-side up and adjust furniture levelers to ensure the desk is level.`,
    `${assemblyInstructions.length + 1}. Apply finish (stain, paint, or varnish) as desired, allowing proper drying time between coats.`
  );

  return {
    cutList,
    hardware,
    assemblyInstructions,
    cadCoordinates,
  };
}
