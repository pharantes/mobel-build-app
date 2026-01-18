import Link from 'next/link';
import { Hammer, Ruler, FileText, Download } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Design Custom Furniture with AI
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Generate technical drawings, cut lists, and assembly instructions for your
              custom furniture projects in minutes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-primary-700 px-8 py-3 rounded-md font-semibold text-lg hover:bg-primary-50 transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                href="/login"
                className="bg-primary-700 text-white px-8 py-3 rounded-md font-semibold text-lg hover:bg-primary-600 transition-colors border-2 border-white"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Build Furniture
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ruler className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Dimensions</h3>
              <p className="text-gray-600">
                Input your exact specifications for perfectly fitted furniture
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cut Lists</h3>
              <p className="text-gray-600">
                Detailed cutting guides with exact dimensions and quantities
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Hammer className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Assembly Guide</h3>
              <p className="text-gray-600">
                Step-by-step instructions to build your furniture
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">CAD Files</h3>
              <p className="text-gray-600">
                Export DXF files for CNC machines and professional tools
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Furniture Types Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Supported Furniture Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Corner Shelves', desc: 'Perfect for utilizing corner spaces' },
              { name: 'Wall Shelves', desc: 'Floating and mounted storage' },
              { name: 'Cabinets', desc: 'Custom storage solutions' },
              { name: 'Desks', desc: 'Work surfaces tailored to your space' },
            ].map((type, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-2">{type.name}</h3>
                <p className="text-gray-600 text-sm">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Build Your Custom Furniture?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of makers and woodworkers creating custom designs
          </p>
          <Link
            href="/register"
            className="bg-white text-primary-700 px-8 py-3 rounded-md font-semibold text-lg hover:bg-primary-50 transition-colors inline-block"
          >
            Start Building Now
          </Link>
        </div>
      </section>
    </div>
  );
}
