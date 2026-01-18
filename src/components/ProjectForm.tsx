'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '@/utils/validation';
import { FURNITURE_TYPES, MATERIAL_OPTIONS } from '@/utils/constants';
import LoadingSpinner from './LoadingSpinner';
import { ProjectInput } from '@/lib/types';

interface ProjectFormProps {
  onSubmit: (data: ProjectInput) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<ProjectInput>;
}

export default function ProjectForm({
  onSubmit,
  isLoading = false,
  defaultValues,
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: defaultValues || {
      furnitureType: 'corner_shelf',
      materialPreference: 'pine_plywood',
      features: {
        hasFootplates: false,
        hasDoors: false,
        hasBackPanel: true,
        adjustableShelves: true,
      },
    },
  });

  const furnitureType = watch('furnitureType');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Project Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Name *
        </label>
        <input
          type="text"
          {...register('name')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="My Corner Shelf"
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name.message as string}</p>
        )}
      </div>

      {/* Furniture Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Furniture Type *
        </label>
        <select
          {...register('furnitureType')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {FURNITURE_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.furnitureType && (
          <p className="text-red-600 text-sm mt-1">
            {errors.furnitureType.message as string}
          </p>
        )}
      </div>

      {/* Dimensions */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Dimensions (mm)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Width *
            </label>
            <input
              type="number"
              {...register('dimensions.width', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="800"
            />
            {errors.dimensions?.width && (
              <p className="text-red-600 text-sm mt-1">
                {errors.dimensions.width.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Depth *
            </label>
            <input
              type="number"
              {...register('dimensions.depth', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="400"
            />
            {errors.dimensions?.depth && (
              <p className="text-red-600 text-sm mt-1">
                {errors.dimensions.depth.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height *
            </label>
            <input
              type="number"
              {...register('dimensions.height', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="1800"
            />
            {errors.dimensions?.height && (
              <p className="text-red-600 text-sm mt-1">
                {errors.dimensions.height.message as string}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Features</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register('features.hasFootplates')}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Add footplates</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register('features.hasBackPanel')}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Include back panel</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register('features.adjustableShelves')}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Adjustable shelves</span>
          </label>

          {(furnitureType === 'cabinet' || furnitureType === 'desk') && (
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('features.hasDoors')}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">Add doors</span>
            </label>
          )}

          {(furnitureType !== 'desk') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Shelves
              </label>
              <input
                type="number"
                {...register('features.numShelves', { valueAsNumber: true })}
                min="1"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="3"
              />
            </div>
          )}

          {(furnitureType === 'cabinet' || furnitureType === 'desk') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Drawers
              </label>
              <input
                type="number"
                {...register('features.numDrawers', { valueAsNumber: true })}
                min="0"
                max="6"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="0"
              />
            </div>
          )}
        </div>
      </div>

      {/* Material */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Material Preference
        </label>
        <select
          {...register('materialPreference')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {MATERIAL_OPTIONS.map((material) => (
            <option key={material.value} value={material.value}>
              {material.label}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? <LoadingSpinner size="sm" /> : 'Create Project'}
      </button>
    </form>
  );
}
