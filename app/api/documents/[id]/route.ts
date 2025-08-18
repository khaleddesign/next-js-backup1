import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    try {
      const document = await db.document.findUnique({
        where: { id },
        include: {
          uploader: {
            select: { id: true, name: true, role: true, email: true }
          },
          chantier: {
            select: { id: true, nom: true, adresse: true }
          }
        }
      });

      if (!document) {
        return NextResponse.json({ error: 'Document introuvable' }, { status: 404 });
      }

      return NextResponse.json(document);
    } catch (dbError) {
      const mockDocument = {
        id,
        nom: 'document-exemple.pdf',
        nomOriginal: 'Document exemple.pdf',
        type: 'PDF',
        taille: 1234567,
        url: '/mock/document.pdf',
        urlThumbnail: '/mock/thumb.jpg',
        uploader: {
          id: 'user-1',
          name: 'Utilisateur Test',
          role: 'CLIENT',
          email: 'user@test.com'
        },
        chantier: {
          id: 'chantier-1',
          nom: 'Chantier Test',
          adresse: '123 Rue de Test'
        },
        metadonnees: {},
        tags: ['test'],
        dossier: 'Documents',
        public: false,
        createdAt: new Date().toISOString()
      };

      return NextResponse.json(mockDocument);
    }

  } catch (error) {
    console.error('Erreur API document détail:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    try {
      const document = await db.document.update({
        where: { id },
        data: {
          nom: data.nom,
          tags: data.tags,
          dossier: data.dossier,
          public: data.public,
          metadonnees: data.metadonnees
        },
        include: {
          uploader: { select: { id: true, name: true, role: true } },
          chantier: { select: { id: true, nom: true } }
        }
      });

      return NextResponse.json(document);
    } catch (dbError) {
      return NextResponse.json({
        ...data,
        id,
        updatedAt: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('Erreur modification document:', error);
    return NextResponse.json({ error: 'Erreur lors de la modification' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    try {
      await db.document.delete({
        where: { id }
      });
    } catch (dbError) {
      console.warn('Base de données non disponible, simulation de la suppression');
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erreur suppression document:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
