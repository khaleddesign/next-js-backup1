// Template correction API - Exemple type
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { z } from 'zod'; // 🔥 CRITIQUE: Toujours valider avec Zod

// 🔐 Schema validation Zod
const CreateMessageSchema = z.object({
  message: z.string().min(1).max(1000),
  destinataireId: z.string().optional(),
  chantierId: z.string().optional(),
  typeMessage: z.enum(['DIRECT', 'CHANTIER', 'GROUPE']),
});

export async function POST(request: NextRequest) {
  try {
    // ✅ 1. Vérification authentification
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' }, 
        { status: 401 }
      );
    }

    // ✅ 2. Validation données avec Zod
    const body = await request.json();
    const validatedData = CreateMessageSchema.parse(body);

    // ✅ 3. Logique métier
    const newMessage = await prisma.message.create({
      data: {
        ...validatedData,
        expediteurId: session.user.id,
        createdAt: new Date(),
      },
      include: {
        expediteur: {
          select: { id: true, nom: true, email: true, avatar: true }
        }
      }
    });

    // ✅ 4. Réponse succès
    return NextResponse.json(newMessage, { status: 201 });

  } catch (error) {
    console.error('❌ Erreur API /api/messages:', error);
    
    // ✅ 5. Gestion erreurs spécifiques
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    // ✅ 6. Erreur générique
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}

// ✅ 7. Autres méthodes HTTP
export async function GET(request: NextRequest) {
  // Implementation GET...
}
