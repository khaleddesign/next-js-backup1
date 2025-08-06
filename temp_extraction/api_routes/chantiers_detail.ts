--- app/api/chantiers/[id]/route.ts ---
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const chantier = await db.chantier.findUnique({
      where: { id: params.id },
      include: {
        client: {
          select: { 
            id: true, name: true, email: true, phone: true,
            company: true, address: true 
          }
        },
        assignees: {
          select: { 
            id: true, name: true, email: true, role: true, phone: true 
          }
        },
        timeline: {
          include: {
            createdBy: {
              select: { id: true, name: true, role: true }
            }
          },
          orderBy: { date: 'desc' }
        },
        comments: {
          include: {
            auteur: {
              select: { id: true, name: true, role: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        messages: {
          include: {
            expediteur: {
              select: { id: true, name: true, role: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 50
        },
        _count: {
          select: {
            timeline: true,
            comments: true,
            messages: true,
            devis: true
          }
        }
      }
    });

    if (!chantier) {
      return NextResponse.json({ error: 'Chantier introuvable' }, { status: 404 });
    }

    return NextResponse.json(chantier);

  } catch (error) {
    console.error('Erreur API chantier détail:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
