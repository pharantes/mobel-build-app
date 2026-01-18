'use client';

import { Download } from 'lucide-react';

interface DownloadButtonProps {
  projectId: string;
  format: 'dxf' | 'svg';
  projectName: string;
}

export default function DownloadButton({
  projectId,
  format,
  projectName,
}: DownloadButtonProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/cad/download/${projectId}?format=${format}`);

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName.replace(/\s+/g, '_')}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
    >
      <Download className="w-4 h-4" />
      <span>Download {format.toUpperCase()}</span>
    </button>
  );
}
