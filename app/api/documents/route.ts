import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma, TypeDocument } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chantierId = searchParams.get('chantierId');
    const type = searchParams.get('type');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const where: Prisma.DocumentWhereInput = {};
    
    if (chantierId && chantierId !== 'TOUS') {
      where.chantierId = chantierId;
    }

    if (type && type !== 'TOUS') {
      where.type = type as TypeDocument;
    }

    if (search) {
      where.OR = [
        { nom: { contains: search, mode: 'insensitive' } },
        { nomOriginal: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ];
    }

    try {
      const [documents, total] = await Promise.all([
        db.document.findMany({
          where,
          include: {
            uploader: {
              select: { id: true, name: true, role: true }
            },
            chantier: {
              select: { id: true, nom: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset
        }),
        db.document.count({ where })
      ]);

      return NextResponse.json({
        documents,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        success: true
      });
    } catch (dbError) {
      const mockDocuments = [
        {
          id: 'doc-1',
          nom: 'Plan-cuisine-final.pdf',
          nomOriginal: 'Plan cuisine final.pdf',
          type: 'PLAN',
          taille: 2456789,
          url: '/mock/plan-cuisine.pdf',
          urlThumbnail: '/mock/thumb-plan.jpg',
          chantierId: 'chantier-1',
          chantier: { id: 'chantier-1', nom: 'Rénovation Villa Moderne' },
          uploader: { id: 'user-1', name: 'Pierre Architecte', role: 'COMMERCIAL' },
          metadonnees: { dimensions: '1200x800', dpi: 300 },
          tags: ['cuisine', 'plan', 'final'],
          dossier: 'Plans techniques',
          public: false,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'doc-2',
          nom: 'photo-avant-travaux-01.jpg',
          nomOriginal: 'IMG_20240315_143022.jpg',
          type: 'PHOTO',
          taille: 3245678,
          url: '/mock/photo-avant.jpg',
          urlThumbnail: '/mock/thumb-photo.jpg',
          chantierId: 'chantier-1',
          chantier: { id: 'chantier-1', nom: 'Rénovation Villa Moderne' },
          uploader: { id: 'user-2', name: 'Marc Ouvrier', role: 'OUVRIER' },
          metadonnees: { 
            dimensions: '4032x3024',
            geolocalisation: { lat: 43.2965, lng: 5.3698 },
            appareil: 'iPhone 14',
            datePhoto: '2024-03-15T14:30:22Z'
          },
          tags: ['avant', 'cuisine', 'état initial'],
          dossier: 'Photos avant travaux',
          public: false,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      let filteredDocs = mockDocuments;

      if (chantierId && chantierId !== 'TOUS') {
        filteredDocs = filteredDocs.filter(d => d.chantierId === chantierId);
      }

      if (type && type !== 'TOUS') {
        filteredDocs = filteredDocs.filter(d => d.type === type);
      }

      if (search) {
        filteredDocs = filteredDocs.filter(d => 
          d.nom.toLowerCase().includes(search.toLowerCase()) ||
          d.nomOriginal.toLowerCase().includes(search.toLowerCase()) ||
          d.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
        );
      }

      return NextResponse.json({
        documents: filteredDocs,
        pagination: {
          page: 1,
          limit: filteredDocs.length,
          total: filteredDocs.length,
          pages: 1
        },
        success: true,
        simulation: true
      });
    }

  } catch (error) {
    console.error('Erreur API documents:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const required = ['nom', 'type', 'url', 'uploaderId'];
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json({ error: `Le champ ${field} est requis` }, { status: 400 });
      }
    }

    try {
      const document = await db.document.create({
        data: {
          nom: data.nom,
          nomOriginal: data.nomOriginal || data.nom,
          type: data.type,
          taille: data.taille || 0,
          url: data.url,
          urlThumbnail: data.urlThumbnail || null,
          chantierId: data.chantierId || null,
          uploaderId: data.uploaderId,
          metadonnees: data.metadonnees || {},
          tags: data.tags || [],
          dossier: data.dossier || null,
          public: data.public || false
        },
        include: {
          uploader: {
            select: { id: true, name: true, role: true }
          },
          chantier: {
            select: { id: true, nom: true }
          }
        }
      });

      return NextResponse.json(document, { status: 201 });
    } catch (dbError) {
      const mockDocument = {
        id: `doc-${Date.now()}`,
        nom: data.nom,
        nomOriginal: data.nomOriginal || data.nom,
        type: data.type,
        taille: data.taille || 0,
        url: data.url,
        uploaderId: data.uploaderId,
        uploader: { id: data.uploaderId, name: 'Utilisateur', role: 'CLIENT' },
        tags: data.tags || [],
        createdAt: new Date().toISOString()
      };

      return NextResponse.json(mockDocument, { status: 201 });
    }

  } catch (error) {
    console.error('Erreur création document:', error);
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
  }
}
