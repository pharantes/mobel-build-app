'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProjectForm from '@/components/ProjectForm';
import { API_ROUTES } from '@/utils/constants';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ProjectInput } from '@/lib/types';

export default function NewProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ProjectInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ROUTES.PROJECTS.CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create project');
      }

      // Redirect to project page
      router.push(`/project/${result.data._id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
            <p className="text-gray-600 mb-8">
              Fill in the details below to generate your custom furniture design
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 px-6 py-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            <ProjectForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Tips for Best Results</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Ensure dimensions are in millimeters (mm)</li>
              <li>• Consider the space where the furniture will be placed</li>
              <li>• Check material availability before finalizing</li>
              <li>• Adjustable shelves provide more flexibility</li>
            </ul>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
