import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/layout/navbar';
import { AuthProvider } from '@/lib/auth/context';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Project Bolt',
  description: 'Plateforme de formation en ligne',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <div className="pt-14 h-full">
            {children}
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}