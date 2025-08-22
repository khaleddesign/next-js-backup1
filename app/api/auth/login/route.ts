import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        phone: true,
        company: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 401 });
    }

    if (!user.password) {
      return NextResponse.json({ error: 'Compte non configuré' }, { status: 401 });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
    }

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ 
      user: {
        ...userWithoutPassword,
        avatar: user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
        permissions: user.role === 'ADMIN' ? ['all'] : 
                    user.role === 'COMMERCIAL' ? ['chantiers', 'devis', 'clients', 'messages'] :
                    ['view_chantiers', 'messages', 'documents']
      }
    });

  } catch (error) {
    console.error('Erreur login:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
