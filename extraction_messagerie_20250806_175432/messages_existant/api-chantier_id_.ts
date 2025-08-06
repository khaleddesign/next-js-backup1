--- ../app/api/messages/chantier/[id]/route.ts ---
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      db.message.findMany({
        where: { chantierId: params.id },
        include: {
          expediteur: {
            select: { id: true, name: true, role: true }
          }
        },
        orderBy: { createdAt: 'asc' },
        take: limit,
        skip: offset
      }),
      db.message.count({
        where: { chantierId: params.id }
      })
    ]);

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur API messages chantier:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
