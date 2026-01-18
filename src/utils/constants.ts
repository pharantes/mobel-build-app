export const FURNITURE_TYPES = [
  { value: 'corner_shelf', label: 'Corner Shelf' },
  { value: 'wall_shelf', label: 'Wall Shelf' },
  { value: 'cabinet', label: 'Cabinet' },
  { value: 'desk', label: 'Desk' },
] as const;

export const MATERIAL_OPTIONS = [
  { value: 'pine_plywood', label: 'Pine Plywood' },
  { value: 'birch_plywood', label: 'Birch Plywood' },
  { value: 'oak_plywood', label: 'Oak Plywood' },
  { value: 'mdf', label: 'MDF' },
] as const;

export const PROJECT_STATUS = {
  DRAFT: 'draft',
  GENERATED: 'generated',
  COMPLETED: 'completed',
} as const;

export const API_ROUTES = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/signin',
  },
  PROJECTS: {
    LIST: '/api/projects',
    CREATE: '/api/projects',
    GET: (id: string) => `/api/projects/${id}`,
    UPDATE: (id: string) => `/api/projects/${id}`,
    DELETE: (id: string) => `/api/projects/${id}`,
    GENERATE: '/api/projects/generate',
  },
  CAD: {
    DOWNLOAD: (id: string, format: string = 'dxf') =>
      `/api/cad/download/${id}?format=${format}`,
  },
  PRICING: {
    GET: (projectId: string) => `/api/pricing/${projectId}`,
  },
  MATERIALS: {
    LIST: '/api/materials',
  },
} as const;
