import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma, ChantierStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const statut = searchParams.get('statut') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    const where: Prisma.ChantierWhereInput = {};
    
    if (search) {
      where.OR = [
        { nom: { contains: search, mode: 'insensitive' } },
        { client: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    if (statut && statut !== 'TOUS') {
      where.statut = statut as ChantierStatus;
    }

    const [chantiers, total] = await Promise.all([
      db.chantier.findMany({
        where,
        include: {
          client: {
            select: { id: true, name: true, email: true, company: true }
          },
          assignees: {
            select: { id: true, name: true, role: true }
          },
          _count: {
            select: {
              messages: true,
              comments: true,
              timeline: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: offset
      }),
      db.chantier.count({ where })
    ]);

    return NextResponse.json({
      chantiers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur API chantiers:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const required = ['nom', 'description', 'adresse', 'clientId', 'dateDebut', 'dateFin', 'budget'];
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json({ error: `Le champ ${field} est requis` }, { status: 400 });
      }
    }

    // Validation des dates
    const dateDebut = new Date(data.dateDebut);
    const dateFin = new Date(data.dateFin);
    
    if (isNaN(dateDebut.getTime()) || isNaN(dateFin.getTime())) {
      return NextResponse.json({ error: 'Dates invalides' }, { status: 400 });
    }

    if (dateFin <= dateDebut) {
      return NextResponse.json({ error: 'La date de fin doit être après la date de début' }, { status: 400 });
    }

    // Validation du budget
    const budget = parseFloat(data.budget);
    if (isNaN(budget) || budget <= 0) {
      return NextResponse.json({ error: 'Le budget doit être un nombre positif' }, { status: 400 });
    }

    // Vérifier que le client existe
    const client = await db.user.findUnique({
      where: { id: data.clientId },
      select: { id: true, role: true }
    });

    if (!client) {
      return NextResponse.json({ error: 'Client introuvable' }, { status: 404 });
    }

    if (client.role !== 'CLIENT') {
      return NextResponse.json({ error: 'L\'utilisateur sélectionné n\'est pas un client' }, { status: 400 });
    }

    const chantier = await db.chantier.create({
      data: {
        nom: data.nom,
        description: data.description,
        adresse: data.adresse,
        clientId: data.clientId,
        dateDebut: new Date(data.dateDebut),
        dateFin: new Date(data.dateFin),
        budget: parseFloat(data.budget),
        superficie: data.superficie || '',
        photo: data.photo || null,
        photos: data.photos || [],
        statut: 'PLANIFIE',
        progression: 0
      },
      include: {
        client: {
          select: { id: true, name: true, email: true, company: true }
        }
      }
    });

    return NextResponse.json(chantier, { status: 201 });

  } catch (error) {
    console.error('Erreur création chantier:', error);
    return NextResponse.json({ error: 'Erreur lors de la création du chantier' }, { status: 500 });
  }
}
