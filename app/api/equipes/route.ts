import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || '';

    try {
      const where = role ? { role } : {};
      const [membres, total] = await Promise.all([
        db.user.findMany({
          where,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            company: true,
            phone: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        }),
        db.user.count({ where })
      ]);

      return NextResponse.json({ membres, total, success: true });

    } catch (dbError) {
      console.warn('Base de données non disponible, utilisation simulation');
      
      const mockUsers = [
        {
          id: 'client-1',
          name: 'Sophie Durand',
          email: 'sophie.durand@email.com',
          role: 'CLIENT',
          company: 'Durand & Associés',
          phone: '06 12 34 56 78',
          createdAt: new Date().toISOString()
        },
        {
          id: 'client-2',
          name: 'Marc Lefebvre',
          email: 'marc.lefebvre@email.com',
          role: 'CLIENT',
          company: 'Lefebvre Construction',
          phone: '06 98 76 54 32',
          createdAt: new Date().toISOString()
        }
      ];

      const filtered = role ? mockUsers.filter(u => u.role === role) : mockUsers;
      return NextResponse.json({ membres: filtered, total: filtered.length, simulation: true });
    }

  } catch (error) {
    console.error('Erreur API équipes GET:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
