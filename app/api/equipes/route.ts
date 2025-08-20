import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma, Role } from '@prisma/client';

// GET /api/equipes - Liste tous les membres
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (role && role !== 'TOUS') {
      where.role = role as Role;
    }

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
          address: true,
          createdAt: true,
          assignedChantiers: {
            where: {
              statut: {
                in: ['PLANIFIE', 'EN_COURS']
              }
            },
            select: { id: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      db.user.count({ where })
    ]);

    // Formater les données pour le frontend
    const formattedMembres = membres.map(membre => ({
      id: membre.id,
      name: membre.name,
      email: membre.email,
      role: membre.role,
      company: membre.company,
      phone: membre.phone,
      address: membre.address,
      createdAt: membre.createdAt.toISOString(),
      chantiersActifs: membre.assignedChantiers.length,
      disponible: membre.assignedChantiers.length < 3, // Logique simple de disponibilité
      avatar: membre.name ? membre.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U',
      specialites: [] // À implémenter selon votre modèle
    }));

    return NextResponse.json({
      membres: formattedMembres,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      success: true
    });

  } catch (error) {
    console.error('Erreur API équipes GET:', error);
    return NextResponse.json({
      error: 'Erreur lors du chargement des équipes',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

// POST /api/equipes - Créer un nouveau membre
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validation des données
    const required = ['name', 'email', 'role'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      return NextResponse.json({
        error: 'Champs manquants',
        details: `Les champs suivants sont requis: ${missing.join(', ')}`
      }, { status: 400 });
    }

    // Validation de l'email
    if (!/\S+@\S+\.\S+/.test(data.email)) {
      return NextResponse.json({
        error: 'Email invalide',
        details: 'Format d\'email incorrect'
      }, { status: 400 });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await db.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      return NextResponse.json({
        error: 'Email déjà utilisé',
        details: 'Un membre avec cet email existe déjà'
      }, { status: 400 });
    }

    // Créer le nouveau membre
    const nouveauMembre = await db.user.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        role: data.role,
        company: data.company?.trim(),
        phone: data.phone?.trim(),
        address: data.address?.trim()
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        company: true,
        phone: true,
        address: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      membre: {
        ...nouveauMembre,
        createdAt: nouveauMembre.createdAt.toISOString(),
        chantiersActifs: 0,
        disponible: true,
        avatar: nouveauMembre.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '',
        specialites: data.specialites || []
      },
      success: true,
      message: 'Membre créé avec succès'
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur API équipes POST:', error);
    return NextResponse.json({
      error: 'Erreur lors de la création du membre',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}