'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProjectCard from '@/components/ProjectCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Plus } from 'lucide-react';
import { ProjectOutput } from '@/lib/types';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<ProjectOutput[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch projects');
        }

        setProjects(data.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchProjects();
    }
  }, [session]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
              <p className="text-gray-600 mt-1">
                Manage your furniture design projects
              </p>
            </div>
            <Link
              href="/project/new"
              className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Project</span>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 px-6 py-4 rounded-lg">
              {error}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-white rounded-lg shadow-md p-12 max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-2">No Projects Yet</h3>
                <p className="text-gray-600 mb-6">
                  Start by creating your first furniture design project
                </p>
                <Link
                  href="/project/new"
                  className="inline-block bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors"
                >
                  Create Your First Project
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
