import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma, EtapeStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chantierId = searchParams.get('chantierId');
    
    if (!chantierId) {
      return NextResponse.json({ error: 'chantierId requis' }, { status: 400 });
    }

    const etapes = await db.etapeChantier.findMany({
      where: { chantierId },
      include: {
        createdBy: {
          select: { id: true, name: true, role: true }
        }
      },
      orderBy: [
        { dateDebut: 'asc' },
        { ordre: 'asc' }
      ]
    });

    return NextResponse.json({ etapes });

  } catch (error) {
    console.error('Erreur API etapes GET:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const required = ['titre', 'dateDebut', 'dateFin', 'chantierId', 'createdById'];
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json({ error: `Le champ ${field} est requis` }, { status: 400 });
      }
    }

    const dateDebut = new Date(data.dateDebut);
    const dateFin = new Date(data.dateFin);
    
    if (isNaN(dateDebut.getTime()) || isNaN(dateFin.getTime())) {
      return NextResponse.json({ error: 'Dates invalides' }, { status: 400 });
    }

    if (dateFin <= dateDebut) {
      return NextResponse.json({ error: 'La date de fin doit être après la date de début' }, { status: 400 });
    }

    const chantier = await db.chantier.findUnique({
      where: { id: data.chantierId },
      select: { id: true }
    });

    if (!chantier) {
      return NextResponse.json({ error: 'Chantier introuvable' }, { status: 404 });
    }

    const user = await db.user.findUnique({
      where: { id: data.createdById },
      select: { id: true, role: true }
    });

    if (!user || !['ADMIN', 'COMMERCIAL'].includes(user.role)) {
      return NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 });
    }

    const etape = await db.etapeChantier.create({
      data: {
        titre: data.titre,
        description: data.description || null,
        dateDebut: dateDebut,
        dateFin: dateFin,
        statut: data.statut || 'A_FAIRE',
        ordre: data.ordre || 0,
        chantierId: data.chantierId,
        createdById: data.createdById
      },
      include: {
        createdBy: {
          select: { id: true, name: true, role: true }
        }
      }
    });

    return NextResponse.json(etape, { status: 201 });

  } catch (error) {
    console.error('Erreur création etape:', error);
    return NextResponse.json({ error: 'Erreur lors de la création de l\'étape' }, { status: 500 });
  }
}
