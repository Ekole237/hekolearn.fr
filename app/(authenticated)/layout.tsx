'use client';

import { useRequireAuth } from "@/lib/auth/hooks";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRequireAuth();

  return (
    <main className="flex-1 container mx-auto py-6 px-4">
      {children}
    </main>
  );
}
