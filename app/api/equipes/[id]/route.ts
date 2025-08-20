import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/equipes/[id] - Détails d'un membre
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const membre = await db.user.findUnique({
      where: { id },
      include: {
        assignedChantiers: {
          select: {
            id: true,
            nom: true,
            statut: true,
            dateDebut: true,
            dateFin: true,
            adresse: true
          },
          orderBy: { updatedAt: 'desc' }
        },
        messages: {
          select: { id: true },
          take: 1
        }
      }
    });

    if (!membre) {
      return NextResponse.json({
        error: 'Membre non trouvé'
      }, { status: 404 });
    }

    // Formater les données
    const formattedMembre = {
      id: membre.id,
      name: membre.name,
      email: membre.email,
      role: membre.role,
      company: membre.company,
      phone: membre.phone,
      address: membre.address,
      createdAt: membre.createdAt.toISOString(),
      chantiersActifs: membre.assignedChantiers.filter(c => 
        c.statut === 'EN_COURS' || c.statut === 'PLANIFIE'
      ).length,
      disponible: membre.assignedChantiers.length < 3,
      avatar: membre.name ? membre.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U',
      specialites: [], // À implémenter selon votre modèle
      chantiers: membre.assignedChantiers.map(chantier => ({
        ...chantier,
        dateDebut: chantier.dateDebut.toISOString(),
        dateFin: chantier.dateFin.toISOString()
      }))
    };

    return NextResponse.json({
      membre: formattedMembre,
      success: true
    });

  } catch (error) {
    console.error('Erreur API équipe GET:', error);
    return NextResponse.json({
      error: 'Erreur lors du chargement du membre',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

// PUT /api/equipes/[id] - Modifier un membre
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    // Vérifier que le membre existe
    const existingMembre = await db.user.findUnique({
      where: { id }
    });

    if (!existingMembre) {
      return NextResponse.json({
        error: 'Membre non trouvé'
      }, { status: 404 });
    }

    // Validation des données
    if (data.email && data.email !== existingMembre.email) {
      const emailExists = await db.user.findUnique({
        where: { email: data.email }
      });

      if (emailExists) {
        return NextResponse.json({
          error: 'Email déjà utilisé',
          details: 'Un autre membre utilise déjà cet email'
        }, { status: 400 });
      }
    }

    // Mettre à jour le membre
    const updatedMembre = await db.user.update({
      where: { id },
      data: {
        name: data.name?.trim(),
        email: data.email?.trim().toLowerCase(),
        role: data.role,
        company: data.company?.trim(),
        phone: data.phone?.trim(),
        address: data.address?.trim(),
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        company: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      membre: {
        ...updatedMembre,
        createdAt: updatedMembre.createdAt.toISOString(),
        updatedAt: updatedMembre.updatedAt.toISOString(),
        avatar: updatedMembre.name?.split(' ').map(n => n[0]).join('').toUpperCase() || ''
      },
      success: true,
      message: 'Membre mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur API équipe PUT:', error);
    return NextResponse.json({
      error: 'Erreur lors de la mise à jour du membre',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

// DELETE /api/equipes/[id] - Supprimer un membre
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    // Vérifier que le membre existe
    const existingMembre = await db.user.findUnique({
      where: { id },
      include: {
        assignedChantiers: {
          where: {
            statut: {
              in: ['PLANIFIE', 'EN_COURS']
            }
          }
        }
      }
    });

    if (!existingMembre) {
      return NextResponse.json({
        error: 'Membre non trouvé'
      }, { status: 404 });
    }

    // Vérifier si le membre a des chantiers actifs
    if (existingMembre.assignedChantiers.length > 0) {
      return NextResponse.json({
        error: 'Impossible de supprimer ce membre',
        details: 'Le membre est assigné à des chantiers actifs. Veuillez d\'abord le retirer de ces chantiers.'
      }, { status: 400 });
    }

    // Supprimer le membre (ou le désactiver selon votre logique métier)
    await db.user.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Membre supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur API équipe DELETE:', error);
    
    // Si erreur de contrainte (relations), message plus clair
    if (error instanceof Error && error.message.includes('Foreign key constraint')) {
      return NextResponse.json({
        error: 'Impossible de supprimer ce membre',
        details: 'Le membre est lié à des données existantes (messages, chantiers, etc.)'
      }, { status: 400 });
    }

    return NextResponse.json({
      error: 'Erreur lors de la suppression du membre',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}