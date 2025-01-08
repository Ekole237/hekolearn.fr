'use client';

import { useRequireAuth } from '@/lib/auth';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRequireAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Ajouter la navigation ici plus tard */}
      <main className="container mx-auto py-6">
        {children}
      </main>
    </div>
  );
}
