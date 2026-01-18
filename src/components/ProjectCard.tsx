'use client';

import Link from 'next/link';
import { formatDate, formatDimensions } from '@/utils/formatters';
import { Calendar, Ruler, Package } from 'lucide-react';

interface ProjectCardProps {
  project: {
    _id: string;
    name: string;
    furnitureType: string;
    dimensions: {
      width: number;
      depth: number;
      height: number;
    };
    status: string;
    createdAt: string;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-700',
    generated: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
  };

  const furnitureTypeLabels: Record<string, string> = {
    corner_shelf: 'Corner Shelf',
    wall_shelf: 'Wall Shelf',
    cabinet: 'Cabinet',
    desk: 'Desk',
  };

  return (
    <Link href={`/project/${project._id}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[project.status as keyof typeof statusColors]
              }`}
          >
            {project.status}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span>{furnitureTypeLabels[project.furnitureType] || project.furnitureType}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Ruler className="w-4 h-4" />
            <span>
              {formatDimensions(
                project.dimensions.width,
                project.dimensions.depth,
                project.dimensions.height
              )}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(project.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
