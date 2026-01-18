'use client';

import { formatCurrency } from '@/utils/formatters';
import { Package, Wrench, FileText, Download as DownloadIcon } from 'lucide-react';
import DownloadButton from './DownloadButton';

interface ProjectResultsProps {
  project: {
    _id: string;
    name: string;
    technicalSpecs?: {
      cutList: Array<{
        part: string;
        dimensions: string;
        quantity: number;
        material: string;
      }>;
      hardware: Array<{
        item: string;
        size: string;
        quantity: number;
      }>;
      assemblyInstructions: string[];
    };
    estimatedCost?: number;
  };
}

export default function ProjectResults({ project }: ProjectResultsProps) {
  const { technicalSpecs, estimatedCost } = project;

  if (!technicalSpecs) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-800">
          Design not yet generated. Please generate the design first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Download Buttons */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <DownloadIcon className="w-5 h-5 mr-2" />
          CAD Files
        </h2>
        <div className="flex space-x-4">
          <DownloadButton projectId={project._id} format="dxf" projectName={project.name} />
          <DownloadButton projectId={project._id} format="svg" projectName={project.name} />
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Download DXF for CAD software or SVG for preview
        </p>
      </div>

      {/* Cut List */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Package className="w-5 h-5 mr-2" />
          Cut List
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Part</th>
                <th className="px-4 py-2 text-left">Dimensions</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Material</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {technicalSpecs.cutList.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{item.part.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-2 font-mono">{item.dimensions}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">{item.material.replace(/_/g, ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hardware List */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Wrench className="w-5 h-5 mr-2" />
          Hardware & Fasteners
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {technicalSpecs.hardware.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div>
                <p className="font-medium">{item.item.replace(/_/g, ' ')}</p>
                <p className="text-sm text-gray-600">{item.size}</p>
              </div>
              <span className="text-lg font-semibold text-primary-600">×{item.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Assembly Instructions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Assembly Instructions
        </h2>
        <ol className="space-y-3">
          {technicalSpecs.assemblyInstructions.map((instruction, index) => (
            <li key={index} className="flex">
              <span className="font-semibold text-primary-600 mr-3">{index + 1}.</span>
              <span className="text-gray-700">{instruction}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Cost Estimate */}
      {estimatedCost !== undefined && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Estimated Cost</h2>
          <p className="text-3xl font-bold text-primary-700">
            {formatCurrency(estimatedCost)}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            *Estimate includes materials and hardware. Labor not included.
          </p>
        </div>
      )}
    </div>
  );
}
