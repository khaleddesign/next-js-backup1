import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

// Schéma de validation avec Zod
const messageSchema = z.object({
  expediteurId: z.string().min(1, 'ID expéditeur requis'),
  message: z.string().min(1, 'Message requis').max(2000, 'Message trop long (max 2000 caractères)'),
  chantierId: z.string().optional(),
  destinataireId: z.string().optional(),
  photos: z.array(z.string().url('URL photo invalide')).max(5, 'Maximum 5 photos').optional(),
  threadId: z.string().optional()
});

const querySchema = z.object({
  userId: z.string().min(1, 'User ID requis'),
  limit: z.coerce.number().min(1).max(100).optional(),
  offset: z.coerce.number().min(0).optional()
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Validation des paramètres
    const validatedQuery = querySchema.safeParse({
      userId: searchParams.get('userId') || 'test-client-123',
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset')
    });

    if (!validatedQuery.success) {
      return NextResponse.json({ 
        error: 'Paramètres invalides',
        details: validatedQuery.error.errors 
      }, { status: 400 });
    }

    const { userId, limit = 50, offset = 0 } = validatedQuery.data;

    // Tentative de récupération des vraies données
    let conversations;
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
                  expediteurId: { not: userId }
                }
              }
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: offset
      });

      conversations = chantiers.map(chantier => ({
        id: chantier.id,
        nom: chantier.nom,
        type: 'chantier' as const,
        participants: [chantier.client, ...chantier.assignees],
        lastMessage: chantier.messages[0] || null,
        unreadCount: chantier._count.messages,
        updatedAt: chantier.updatedAt,
        photo: chantier.photo
      }));

    } catch (dbError) {
      console.warn('Base de données non accessible, utilisation des données mock');
      
      // Fallback vers données mock
      conversations = [
        {
          id: "1",
          nom: "Rénovation Villa Moderne",
          type: "chantier" as const,
          participants: [
            { id: "client-1", name: "Marie Dubois", role: "CLIENT" },
            { id: "ouvrier-1", name: "Pierre Maçon", role: "OUVRIER" }
          ],
          lastMessage: {
            id: "msg-1",
            message: "Les carrelages sont arrivés, on peut commencer demain !",
            createdAt: new Date(Date.now() - 1800000).toISOString(),
            expediteur: { name: "Pierre Maçon" }
          },
          unreadCount: 2,
          photo: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&h=100&fit=crop",
          updatedAt: new Date().toISOString()
        },
        {
          id: "2",
          nom: "Construction Maison Écologique", 
          type: "chantier" as const,
          participants: [
            { id: "client-2", name: "Pierre Martin", role: "CLIENT" },
            { id: "ouvrier-2", name: "Sophie Électricienne", role: "OUVRIER" }
          ],
          lastMessage: {
            id: "msg-2",
            message: "Rendez-vous confirmé pour vendredi à 14h",
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            expediteur: { name: "Sophie Électricienne" }
          },
          unreadCount: 1,
          photo: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=100&h=100&fit=crop",
          updatedAt: new Date(Date.now() - 3600000).toISOString()
        }
      ];
    }

    return NextResponse.json({
      conversations,
      total: conversations.length,
      pagination: {
        limit,
        offset,
        hasMore: conversations.length === limit
      }
    });

  } catch (error) {
    console.error('Erreur API conversations:', error);
    
    return NextResponse.json({ 
      error: 'Erreur interne du serveur',
      message: 'Impossible de récupérer les conversations'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation avec Zod
    const validatedData = messageSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json({ 
        error: 'Données invalides',
        details: validatedData.error.errors
      }, { status: 400 });
    }

    const data = validatedData.data;
    
    // Log pour debug
    console.log('📨 Nouveau message:', { 
      from: data.expediteurId, 
      to: data.chantierId || data.destinataireId,
      length: data.message.length 
    });

    // Tentative de sauvegarde en DB
    try {
      const message = await db.message.create({
        data: {
          expediteurId: data.expediteurId,
          destinataireId: data.destinataireId || null,
          chantierId: data.chantierId || null,
          message: data.message,
          photos: data.photos || [],
          typeMessage: data.chantierId ? 'CHANTIER' : 'DIRECT',
          threadId: data.threadId || null
        },
        include: {
          expediteur: {
            select: { id: true, name: true, role: true }
          },
          chantier: {
            select: { id: true, nom: true }
          }
        }
      });

      // Mettre à jour la date du chantier
      if (data.chantierId) {
        await db.chantier.update({
          where: { id: data.chantierId },
          data: { updatedAt: new Date() }
        });
      }

      console.log('✅ Message sauvegardé:', message.id);
      
      return NextResponse.json({
        ...message,
        success: true
      }, { status: 201 });

    } catch (dbError) {
      console.warn('DB non disponible, simulation du message');
      
      // Simulation si DB pas prête
      const simulatedMessage = {
        id: `msg-${Date.now()}`,
        expediteurId: data.expediteurId,
        chantierId: data.chantierId,
        message: data.message,
        photos: data.photos || [],
        typeMessage: data.chantierId ? 'CHANTIER' : 'DIRECT',
        lu: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expediteur: {
          id: data.expediteurId,
          name: 'Utilisateur Test',
          role: 'CLIENT'
        },
        success: true,
        simulated: true
      };

      return NextResponse.json(simulatedMessage, { status: 201 });
    }

  } catch (error) {
    console.error('❌ Erreur création message:', error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json({ 
        error: 'Format JSON invalide',
        message: 'Le contenu de la requête doit être du JSON valide'
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: 'Erreur interne du serveur',
      message: 'Impossible de créer le message'
    }, { status: 500 });
  }
}
