import { Github, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Möbel Build AI</h3>
            <p className="text-sm">
              Intelligent furniture design platform that generates technical drawings,
              cut lists, and assembly instructions for custom furniture pieces.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <Link href="/project/new" className="hover:text-white transition-colors">
                  Create Project
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-lg mb-3">Contact</h3>
            <div className="space-y-2 text-sm">
              <a
                href="mailto:support@mobel-build.ai"
                className="flex items-center space-x-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>support@mobel-build.ai</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-2 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
          <p>&copy; {currentYear} Möbel Build AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
