'use client';

import { useParams } from 'next/navigation';
import { useRequireAuth } from '@/hooks/useAuth';
import EtapesList from '@/components/etapes/EtapesList';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EtapesPage() {
  const params = useParams();
  const chantierId = params.id as string;
  const { user, isLoading } = useRequireAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/chantiers/${chantierId}`}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          Retour au chantier
        </Link>
      </div>

      <EtapesList chantierId={chantierId} />
    </div>
  );
}
