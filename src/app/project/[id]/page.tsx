'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProjectResults from '@/components/ProjectResults';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ArrowLeft, Sparkles, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { formatDate, formatDimensions } from '@/utils/formatters';

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch project');
        }

        setProject(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/projects/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate design');
      }

      setProject(data.data.project);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </ProtectedRoute>
    );
  }

  if (error && !project) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-red-50 text-red-600 px-6 py-4 rounded-lg">
            {error}
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const furnitureTypeLabels: Record<string, string> = {
    corner_shelf: 'Corner Shelf',
    wall_shelf: 'Wall Shelf',
    cabinet: 'Cabinet',
    desk: 'Desk',
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>

          {/* Project Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>
                    <strong>Type:</strong> {furnitureTypeLabels[project.furnitureType]}
                  </span>
                  <span>
                    <strong>Dimensions:</strong>{' '}
                    {formatDimensions(
                      project.dimensions.width,
                      project.dimensions.depth,
                      project.dimensions.height
                    )}
                  </span>
                  <span>
                    <strong>Material:</strong> {project.materialPreference.replace(/_/g, ' ')}
                  </span>
                  <span>
                    <strong>Created:</strong> {formatDate(project.createdAt)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-700 p-2 transition-colors disabled:opacity-50"
                title="Delete project"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {project.status === 'draft' && (
              <div className="mt-6">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {isGenerating ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Generating Design...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Generate Furniture Design</span>
                    </>
                  )}
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  Click to generate technical drawings, cut list, and assembly instructions
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-6 py-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Project Results */}
          {project.status !== 'draft' && <ProjectResults project={project} />}
        </div>
      </div>
    </ProtectedRoute>
  );
}
