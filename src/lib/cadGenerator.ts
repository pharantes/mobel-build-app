import { ICADCoordinate } from '@/models/Project';

interface DXFLine {
  start: { x: number; y: number; z: number };
  end: { x: number; y: number; z: number };
}

/**
 * Generate DXF (Drawing Exchange Format) file content from CAD coordinates
 * DXF is a CAD data file format used for exchanging drawings between AutoCAD and other programs
 */
export function generateDXF(
  coordinates: ICADCoordinate[]
): string {
  const lines = coordinatesToLines(coordinates);

  let dxf = '';

  // HEADER SECTION
  dxf += '0\nSECTION\n';
  dxf += '2\nHEADER\n';
  dxf += '9\n$ACADVER\n1\nAC1015\n'; // AutoCAD 2000 format
  dxf += '9\n$INSUNITS\n70\n4\n'; // Units: millimeters
  dxf += '0\nENDSEC\n';

  // TABLES SECTION
  dxf += '0\nSECTION\n';
  dxf += '2\nTABLES\n';

  // LTYPE (Line Type) Table
  dxf += '0\nTABLE\n';
  dxf += '2\nLTYPE\n';
  dxf += '70\n1\n';
  dxf += '0\nLTYPE\n';
  dxf += '2\nCONTINUOUS\n';
  dxf += '70\n0\n';
  dxf += '3\nSolid line\n';
  dxf += '72\n65\n';
  dxf += '73\n0\n';
  dxf += '40\n0.0\n';
  dxf += '0\nENDTAB\n';

  // LAYER Table
  dxf += '0\nTABLE\n';
  dxf += '2\nLAYER\n';
  dxf += '70\n1\n';
  dxf += '0\nLAYER\n';
  dxf += '2\n0\n';
  dxf += '70\n0\n';
  dxf += '62\n7\n';
  dxf += '6\nCONTINUOUS\n';
  dxf += '0\nENDTAB\n';

  dxf += '0\nENDSEC\n';

  // ENTITIES SECTION
  dxf += '0\nSECTION\n';
  dxf += '2\nENTITIES\n';

  // Add lines for each furniture part
  lines.forEach((line) => {
    dxf += '0\n3DFACE\n'; // Using 3DFACE for 3D representation
    dxf += '8\n0\n'; // Layer
    dxf += `10\n${line.start.x}\n`; // First corner
    dxf += `20\n${line.start.y}\n`;
    dxf += `30\n${line.start.z}\n`;
    dxf += `11\n${line.end.x}\n`; // Second corner
    dxf += `21\n${line.start.y}\n`;
    dxf += `31\n${line.start.z}\n`;
    dxf += `12\n${line.end.x}\n`; // Third corner
    dxf += `22\n${line.end.y}\n`;
    dxf += `32\n${line.start.z}\n`;
    dxf += `13\n${line.start.x}\n`; // Fourth corner
    dxf += `23\n${line.end.y}\n`;
    dxf += `33\n${line.start.z}\n`;
  });

  dxf += '0\nENDSEC\n';

  // EOF
  dxf += '0\nEOF\n';

  return dxf;
}

/**
 * Generate SVG file content from CAD coordinates
 * SVG is easier to preview in browsers
 */
export function generateSVG(
  coordinates: ICADCoordinate[],
  projectName: string
): string {
  // Find bounding box
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  coordinates.forEach((coord) => {
    minX = Math.min(minX, coord.start[0], coord.end[0]);
    minY = Math.min(minY, coord.start[1], coord.end[1]);
    maxX = Math.max(maxX, coord.start[0], coord.end[0]);
    maxY = Math.max(maxY, coord.start[1], coord.end[1]);
  });

  const width = maxX - minX;
  const height = maxY - minY;
  const padding = 50;
  const scale = 0.5; // Scale down for viewing

  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" 
     width="${(width + padding * 2) * scale}" 
     height="${(height + padding * 2) * scale}" 
     viewBox="0 0 ${width + padding * 2} ${height + padding * 2}">
  <title>${projectName}</title>
  <desc>Furniture technical drawing - ${projectName}</desc>
  
  <!-- Background -->
  <rect width="100%" height="100%" fill="#ffffff"/>
  
  <!-- Grid -->
  <defs>
    <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
      <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#e0e0e0" stroke-width="0.5"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid)" />
  
  <!-- Furniture parts -->
  <g id="furniture" transform="translate(${padding}, ${padding})">
`;

  // Draw rectangles for each part (top view)
  coordinates.forEach((coord) => {
    const x = coord.start[0] - minX;
    const y = coord.start[1] - minY;
    const w = coord.end[0] - coord.start[0];
    const h = coord.end[1] - coord.start[1];

    svg += `    <rect x="${x}" y="${y}" width="${w}" height="${h}" 
         fill="none" stroke="#333333" stroke-width="2" 
         data-part="${coord.element}"/>
    <text x="${x + w / 2}" y="${y + h / 2}" 
         text-anchor="middle" dominant-baseline="middle" 
         font-size="12" font-family="Arial" fill="#666">
      ${coord.element}
    </text>
`;
  });

  svg += `  </g>
  
  <!-- Dimensions annotation -->
  <text x="${padding}" y="${padding - 20}" font-family="Arial" font-size="14" fill="#000">
    All dimensions in millimeters (mm)
  </text>
</svg>`;

  return svg;
}

/**
 * Convert CAD coordinates to line segments
 */
function coordinatesToLines(coordinates: ICADCoordinate[]): DXFLine[] {
  const lines: DXFLine[] = [];

  coordinates.forEach((coord) => {
    // Create box from start and end points
    const [x1, y1, z1] = coord.start;
    const [x2, y2, z2] = coord.end;

    lines.push({
      start: { x: x1, y: y1, z: z1 },
      end: { x: x2, y: y2, z: z2 },
    });
  });

  return lines;
}

/**
 * Create downloadable CAD file blob
 */
export function createCADFile(
  coordinates: ICADCoordinate[],
  projectName: string,
  format: 'dxf' | 'svg' = 'dxf'
): Blob {
  const content = format === 'dxf'
    ? generateDXF(coordinates)
    : generateSVG(coordinates, projectName);

  const mimeType = format === 'dxf'
    ? 'application/dxf'
    : 'image/svg+xml';

  return new Blob([content], { type: mimeType });
}
