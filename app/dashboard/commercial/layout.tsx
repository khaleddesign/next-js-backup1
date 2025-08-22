'use client';

import { useRequireAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function CommercialLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useRequireAuth(['COMMERCIAL', 'ADMIN']);

  if (isLoading || !user) {
    return <div>Chargement...</div>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
