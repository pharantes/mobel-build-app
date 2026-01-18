import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SessionProvider from '@/components/SessionProvider';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Möbel Build AI - Intelligent Furniture Design',
  description: 'Generate technical drawings, cut lists, and assembly instructions for custom furniture',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <SessionProvider session={session}>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
