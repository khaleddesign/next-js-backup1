'use client';

import { useRequireAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useRequireAuth(['CLIENT', 'ADMIN']);

  if (isLoading || !user) {
    return <div>Chargement...</div>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
