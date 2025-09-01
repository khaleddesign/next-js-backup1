import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('clientId');

  const mockChantiers = [
    {
      id: 'chantier-1',
      nom: 'Rénovation Villa Moderne',
      adresse: '123 Rue des Jardins, Paris',
      clientId: 'client-1'
    },
    {
      id: 'chantier-2',
      nom: 'Extension Maison',
      adresse: '456 Avenue des Roses, Lyon', 
      clientId: 'client-1'
    },
    {
      id: 'chantier-3',
      nom: 'Construction Garage',
      adresse: '789 Boulevard du Parc, Marseille',
      clientId: 'client-2'
    }
  ];

  const filtered = clientId 
    ? mockChantiers.filter(c => c.clientId === clientId)
    : mockChantiers;

  return NextResponse.json({ 
    chantiers: filtered,
    success: true,
    simulation: true 
  });
}
