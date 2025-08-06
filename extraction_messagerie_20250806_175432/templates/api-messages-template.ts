// app/api/messages/route.ts - Template API
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    // TODO: Récupérer conversations utilisateur
    const conversations = await prisma.message.findMany({
      // TODO: Implémenter query
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Erreur API messages:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const body = await request.json();
    
    // TODO: Validation avec Zod
    // TODO: Créer message en DB
    
    const newMessage = await prisma.message.create({
      data: {
        // TODO: Mapper les données
      },
      include: {
        expediteur: true,
      }
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Erreur création message:', error);
    return NextResponse.json(
      { error: 'Erreur création message' },
      { status: 500 }
    );
  }
}
