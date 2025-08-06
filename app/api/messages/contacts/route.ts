import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get('userId') || 'test-client-123';
    const role = searchParams.get('role'); // Filter by role
    const chantierId = searchParams.get('chantierId'); // Filter by chantier
    const status = searchParams.get('status'); // online, offline, all
    const search = searchParams.get('search') || '';

    let users = [];
    let chantiers = [];

    try {
      // Récupérer tous les utilisateurs (sauf l'utilisateur courant)
      const whereUsers: any = {
        id: { not: currentUserId }
      };

      if (role) {
        whereUsers.role = role;
      }

      if (search) {
        whereUsers.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { company: { contains: search, mode: 'insensitive' } }
        ];
      }

      users = await db.user.findMany({
        where: whereUsers,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          company: true,
          phone: true,
          createdAt: true,
          // Compter les chantiers associés
          chantiers: {
            select: { id: true, nom: true }
          },
          assignedChantiers: {
            select: { id: true, nom: true }
          }
        },
        orderBy: [
          { role: 'asc' }, // Admins en premier
          { name: 'asc' }
        ]
      });

      // Enrichir les données utilisateurs
      users = users.map(user => {
        const allChantiers = [...(user.chantiers || []), ...(user.assignedChantiers || [])];
        const uniqueChantiers = allChantiers.filter((chantier, index, self) => 
          index === self.findIndex(c => c.id === chantier.id)
        );

        // Simuler le statut en ligne (à remplacer par vraie logique)
        const isOnline = Math.random() > 0.5;
        const lastActiveOptions = ['il y a 5 min', 'il y a 1h', 'il y a 3h', 'hier'];
        const lastActive = isOnline ? 'En ligne' : lastActiveOptions[Math.floor(Math.random() * lastActiveOptions.length)];

        return {
          ...user,
          chantiers: undefined, // Nettoyer
          assignedChantiers: undefined,
          chantiersAssocies: uniqueChantiers,
          isOnline,
          lastActive,
          isFavorite: false // À implémenter avec une table favorites
        };
      });

      // Récupérer les chantiers avec leurs équipes
      const whereChantiers: any = {};

      if (chantierId) {
        whereChantiers.id = chantierId;
      }

      if (search) {
        whereChantiers.OR = [
          { nom: { contains: search, mode: 'insensitive' } },
          { client: { name: { contains: search, mode: 'insensitive' } } }
        ];
      }

      chantiers = await db.chantier.findMany({
        where: whereChantiers,
        select: {
          id: true,
          nom: true,
          photo: true,
          statut: true,
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              company: true
            }
          },
          assignees: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              company: true
            }
          },
          _count: {
            select: {
              messages: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });

      // Filtrer par statut si demandé
      if (status && status !== 'all') {
        if (status === 'online') {
          users = users.filter(user => user.isOnline);
        } else if (status === 'offline') {
          users = users.filter(user => !user.isOnline);
        }
      }

    } catch (dbError) {
      console.warn('Base de données non disponible, utilisation des données de simulation');
      
      // Données de simulation
      users = [
        {
          id: 'user-1',
          name: 'Pierre Maçon',
          email: 'pierre.macon@chantierpro.fr',
          role: 'OUVRIER',
          company: undefined,
          phone: '+33 6 87 65 43 21',
          isOnline: true,
          lastActive: 'En ligne',
          chantiersAssocies: [{ id: '1', nom: 'Rénovation Villa Moderne' }],
          isFavorite: false
        },
        {
          id: 'user-2',
          name: 'Julie Électricienne',
          email: 'julie.elec@chantierpro.fr',
          role: 'OUVRIER',
          company: undefined,
          phone: '+33 6 11 22 33 44',
          isOnline: false,
          lastActive: 'il y a 2h',
          chantiersAssocies: [{ id: '1', nom: 'Rénovation Villa Moderne' }, { id: '2', nom: 'Extension Maison' }],
          isFavorite: true
        },
        {
          id: 'user-3',
          name: 'Marie Dupont',
          email: 'marie.dupont@chantierpro.fr',
          role: 'COMMERCIAL',
          company: 'ChantierPro',
          phone: '+33 6 55 44 33 22',
          isOnline: true,
          lastActive: 'En ligne',
          chantiersAssocies: [
            { id: '1', nom: 'Rénovation Villa Moderne' },
            { id: '2', nom: 'Extension Maison' },
            { id: '3', nom: 'Loft Industriel' }
          ],
          isFavorite: false
        },
        {
          id: 'user-4',
          name: 'Jean Superviseur',
          email: 'jean.super@chantierpro.fr',
          role: 'ADMIN',
          company: 'ChantierPro',
          phone: '+33 6 99 88 77 66',
          isOnline: false,
          lastActive: 'il y a 30 min',
          chantiersAssocies: [],
          isFavorite: true
        }
      ].filter(user => {
        let match = true;
        if (role) match = match && user.role === role;
        if (status === 'online') match = match && user.isOnline;
        if (status === 'offline') match = match && !user.isOnline;
        if (search) {
          const searchLower = search.toLowerCase();
          match = match && (
            user.name.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            (user.company && user.company.toLowerCase().includes(searchLower))
          );
        }
        return match;
      });

      chantiers = [
        {
          id: '1',
          nom: 'Rénovation Villa Moderne',
          photo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
          statut: 'EN_COURS',
          client: {
            id: 'client-1',
            name: 'Marie Dubois',
            email: 'marie.dubois@email.com',
            role: 'CLIENT',
            company: 'Dubois Immobilier'
          },
          assignees: [
            {
              id: 'user-1',
              name: 'Pierre Maçon',
              email: 'pierre.macon@chantierpro.fr',
              role: 'OUVRIER',
              company: undefined
            },
            {
              id: 'user-2',
              name: 'Julie Électricienne',
              email: 'julie.elec@chantierpro.fr',
              role: 'OUVRIER',
              company: undefined
            }
          ],
          _count: { messages: 23 }
        },
        {
          id: '2',
          nom: 'Extension Maison Familiale',
          photo: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400&h=300&fit=crop',
          statut: 'TERMINE',
          client: {
            id: 'client-2',
            name: 'Jean Moreau',
            email: 'jean.moreau@email.com',
            role: 'CLIENT',
            company: undefined
          },
          assignees: [
            {
              id: 'user-2',
              name: 'Julie Électricienne',
              email: 'julie.elec@chantierpro.fr',
              role: 'OUVRIER',
              company: undefined
            }
          ],
          _count: { messages: 45 }
        },
        {
          id: '3',
          nom: 'Loft Industriel',
          photo: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=300&fit=crop',
          statut: 'EN_COURS',
          client: {
            id: 'client-3',
            name: 'Sophie Leroux',
            email: 'sophie.leroux@email.com',
            role: 'CLIENT',
            company: 'Design Studio'
          },
          assignees: [
            {
              id: 'user-1',
              name: 'Pierre Maçon',
              email: 'pierre.macon@chantierpro.fr',
              role: 'OUVRIER',
              company: undefined
            }
          ],
          _count: { messages: 18 }
        }
      ].filter(chantier => {
        if (search) {
          const searchLower = search.toLowerCase();
          return chantier.nom.toLowerCase().includes(searchLower) ||
                 chantier.client.name.toLowerCase().includes(searchLower);
        }
        return true;
      });
    }

    // Statistiques
    const stats = {
      totalUsers: users.length,
      onlineUsers: users.filter(u => u.isOnline).length,
      totalChantiers: chantiers.length,
      favoritesCount: users.filter(u => u.isFavorite).length
    };

    return NextResponse.json({
      users,
      chantiers,
      stats,
      success: true,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur API contacts:', error);
    
    return NextResponse.json({
      error: 'Erreur lors du chargement des contacts',
      details: error instanceof Error ? error.message : 'Erreur inconnue',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// POST pour marquer un contact comme favori
export async function POST(request: NextRequest) {
  try {
    const { userId, contactId, isFavorite } = await request.json();
    
    if (!userId || !contactId) {
      return NextResponse.json({
        error: 'userId et contactId requis',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    // Pour l'instant, simulation (à remplacer par vraie logique DB)
    // En production, créer une table UserFavorite ou ajouter un champ favorites array sur User
    
    return NextResponse.json({
      success: true,
      message: `Contact ${isFavorite ? 'ajouté aux' : 'retiré des'} favoris`,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur mise à jour favori:', error);
    
    return NextResponse.json({
      error: 'Erreur lors de la mise à jour du favori',
      details: error instanceof Error ? error.message : 'Erreur inconnue',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}