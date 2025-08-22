import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, email, phone, company, address } = data;

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    const user = await db.user.update({
      where: { email },
      data: {
        name: name || null,
        phone: phone || null,
        company: company || null,
        address: address || null
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        address: true,
        role: true
      }
    });

    return NextResponse.json(user);

  } catch (error) {
    console.error('Erreur mise à jour profil:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
