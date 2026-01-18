import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const projectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  furnitureType: z.enum(['corner_shelf', 'wall_shelf', 'cabinet', 'desk']),
  dimensions: z.object({
    width: z.number().min(100, 'Width must be at least 100mm').max(3000),
    depth: z.number().min(100, 'Depth must be at least 100mm').max(1000),
    height: z.number().min(100, 'Height must be at least 100mm').max(3000),
    cornerAngle: z.number().optional(),
  }),
  features: z.object({
    hasFootplates: z.boolean(),
    numShelves: z.number().optional(),
    numDrawers: z.number().optional(),
    hasDoors: z.boolean(),
    hasBackPanel: z.boolean(),
    adjustableShelves: z.boolean(),
    loadCapacityKg: z.number().optional(),
  }),
  materialPreference: z.string(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
