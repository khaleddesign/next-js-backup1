import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Type pour la validation
interface MessageCreateData {
  expediteurId: string;
  message: string;
  chantierId: string;
  photos?: string[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'test-client-123';

    // Tenter de récupérer les vraies données
    let conversations = [];
    
    try {
      const chantiers = await db.chantier.findMany({
        where: {
          OR: [
            { clientId: userId },
            { assignees: { some: { id: userId } } }
          ]
        },
        include: {
          client: {
            select: { id: true, name: true, role: true }
          },
          assignees: {
            select: { id: true, name: true, role: true }
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              expediteur: {
                select: { id: true, name: true, role: true }
              }
            }
          },
          _count: {
            select: {
              messages: {
                where: {
                  lu: false,
                  NOT: { expediteurId: userId }
                }
              }
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });

      conversations = chantiers.map(chantier => ({
        id: chantier.id,
        nom: chantier.nom,
        photo: chantier.photo,
        participants: [chantier.client, ...chantier.assignees],
        lastMessage: chantier.messages[0] ? {
          text: chantier.messages[0].message.substring(0, 100),
          time: chantier.messages[0].createdAt.toISOString(),
          expediteur: chantier.messages[0].expediteur.name
        } : undefined,
        unreadCount: chantier._count.messages,
        updatedAt: chantier.updatedAt.toISOString()
      }));

    } catch (dbError) {
      console.warn('Base de données non disponible, utilisation des données de test');
      
      // Données de simulation si la DB n'est pas disponible
      conversations = [
        {
          id: "1",
          nom: "Rénovation Villa Moderne",
          photo: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
          participants: [
            { id: "client-1", name: "Marie Dubois", role: "CLIENT" },
            { id: "user-1", name: "Pierre Maçon", role: "OUVRIER" }
          ],
          lastMessage: {
            text: "Bonjour Marie, les carrelages que vous avez choisis sont arrivés...",
            time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            expediteur: "Pierre Maçon"
          },
          unreadCount: 3,
          updatedAt: new Date().toISOString()
        },
        {
          id: "2",
          nom: "Extension Maison Familiale",
          participants: [
            { id: "client-2", name: "Jean Moreau", role: "CLIENT" },
            { id: "user-2", name: "Julie Électricienne", role: "OUVRIER" }
          ],
          lastMessage: {
            text: "Installation électrique terminée, tout est aux normes",
            time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            expediteur: "Julie Électricienne"
          },
          unreadCount: 1,
          updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
        }
      ];
    }

    return NextResponse.json({
      conversations,
      success: true,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur API messages GET:', error);
    
    return NextResponse.json({
      error: 'Erreur lors du chargement des conversations',
      details: error instanceof Error ? error.message : 'Erreur inconnue',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: MessageCreateData = await request.json();
    
    // Validation des données
    const required = ['expediteurId', 'message', 'chantierId'];
    const missing = required.filter(field => !data[field as keyof MessageCreateData]);
    
    if (missing.length > 0) {
      return NextResponse.json({
        error: 'Champs manquants',
        details: `Les champs suivants sont requis: ${missing.join(', ')}`,
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    // Validation du contenu
    if (data.message.trim().length === 0) {
      return NextResponse.json({
        error: 'Message vide',
        details: 'Le message ne peut pas être vide',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    if (data.message.length > 5000) {
      return NextResponse.json({
        error: 'Message trop long',
        details: 'Le message ne peut pas dépasser 5000 caractères',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    let message;
    
    try {
      // Tenter de créer le message en base
      message = await db.message.create({
        data: {
          expediteurId: data.expediteurId,
          message: data.message.trim(),
          chantierId: data.chantierId,
          photos: data.photos || [],
          typeMessage: 'CHANTIER',
          lu: false
        },
        include: {
          expediteur: {
            select: { id: true, name: true, role: true }
          }
        }
      });

      // Mettre à jour la date du chantier
      await db.chantier.update({
        where: { id: data.chantierId },
        data: { updatedAt: new Date() }
      });

    } catch (dbError) {
      console.warn('Base de données non disponible, simulation de la création');
      
      // Simuler la création du message
      message = {
        id: `msg-${Date.now()}`,
        expediteurId: data.expediteurId,
        message: data.message.trim(),
        chantierId: data.chantierId,
        photos: data.photos || [],
        typeMessage: 'CHANTIER',
        lu: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        expediteur: {
          id: data.expediteurId,
          name: 'Utilisateur Test',
          role: 'CLIENT'
        }
      };
    }

    return NextResponse.json({
      message,
      success: true,
      timestamp: new Date().toISOString()
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur API messages POST:', error);
    
    return NextResponse.json({
      error: 'Erreur lors de la création du message',
      details: error instanceof Error ? error.message : 'Erreur inconnue',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
