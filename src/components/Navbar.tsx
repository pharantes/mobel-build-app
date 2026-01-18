'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Hammer, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-primary-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold hover:text-primary-200">
            <Hammer className="w-6 h-6" />
            <span>Möbel Build AI</span>
          </Link>

          <div className="flex items-center space-x-6">
            {status === 'loading' ? (
              <div className="h-8 w-20 bg-primary-600 animate-pulse rounded"></div>
            ) : session ? (
              <>
                <Link
                  href="/dashboard"
                  className="hover:text-primary-200 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/project/new"
                  className="bg-white text-primary-700 px-4 py-2 rounded-md font-semibold hover:bg-primary-50 transition-colors"
                >
                  New Project
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span className="text-sm">{session.user?.name}</span>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center space-x-1 hover:text-primary-200 transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hover:text-primary-200 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-white text-primary-700 px-4 py-2 rounded-md font-semibold hover:bg-primary-50 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
