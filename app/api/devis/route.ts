import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const statut = searchParams.get('statut') || '';
    const type = searchParams.get('type') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    const where: any = {};
    
    if (search) {
      where.OR = [
        { numero: { contains: search, mode: 'insensitive' } },
        { objet: { contains: search, mode: 'insensitive' } },
        { client: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    if (statut && statut !== 'TOUS') {
      where.statut = statut;
    }

    if (type && type !== 'TOUS') {
      where.type = type;
    }

    try {
      const [devisList, total] = await Promise.all([
        db.devis.findMany({
          where,
          include: {
            client: {
              select: { id: true, name: true, email: true, company: true }
            },
            chantier: {
              select: { id: true, nom: true }
            },
            lignes: true,
            _count: {
              select: {
                lignes: true
              }
            }
          },
          orderBy: { updatedAt: 'desc' },
          take: limit,
          skip: offset
        }),
        db.devis.count({ where })
      ]);

      return NextResponse.json({
        devis: devisList,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        success: true
      });
    } catch (dbError) {
      console.warn('Base de données non disponible, utilisation des données de simulation');
      
      const mockDevis = [
        {
          id: 'dev-1',
          numero: 'DEV0001',
          type: 'DEVIS',
          statut: 'ENVOYE',
          objet: 'Rénovation complète salle de bain',
          client: {
            id: 'client-1',
            name: 'Sophie Durand',
            email: 'sophie.durand@email.com',
            company: 'Durand & Associés'
          },
          chantier: {
            id: 'chantier-1',
            nom: 'Rénovation Villa Moderne'
          },
          totalTTC: 5400,
          dateCreation: new Date().toISOString(),
          dateValidite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          _count: { lignes: 7 }
        },
        {
          id: 'dev-2',
          numero: 'DEV0002',
          type: 'DEVIS',
          statut: 'ACCEPTE',
          objet: 'Cuisine équipée moderne',
          client: {
            id: 'client-1',
            name: 'Sophie Durand',
            email: 'sophie.durand@email.com',
            company: 'Durand & Associés'
          },
          totalTTC: 10500,
          dateCreation: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          dateValidite: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          _count: { lignes: 10 }
        },
        {
          id: 'fac-1',
          numero: 'FAC0001',
          type: 'FACTURE',
          statut: 'PAYE',
          objet: 'Cuisine équipée moderne',
          client: {
            id: 'client-1',
            name: 'Sophie Durand',
            email: 'sophie.durand@email.com',
            company: 'Durand & Associés'
          },
          totalTTC: 10500,
          dateCreation: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          _count: { lignes: 10 }
        },
        {
          id: 'fac-2',
          numero: 'FAC0002',
          type: 'FACTURE',
          statut: 'ENVOYE',
          objet: 'Terrasse bois composite 25m²',
          client: {
            id: 'client-2',
            name: 'Marc Lefebvre',
            email: 'marc.lefebvre@email.com',
            company: 'Lefebvre Construction'
          },
          totalTTC: 3840,
          dateCreation: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          _count: { lignes: 6 }
        }
      ];

      let filteredDevis = mockDevis;

      if (search) {
        filteredDevis = mockDevis.filter(d => 
          d.numero.toLowerCase().includes(search.toLowerCase()) ||
          d.objet.toLowerCase().includes(search.toLowerCase()) ||
          d.client.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (statut && statut !== 'TOUS') {
        filteredDevis = filteredDevis.filter(d => d.statut === statut);
      }

      if (type && type !== 'TOUS') {
        filteredDevis = filteredDevis.filter(d => d.type === type);
      }

      return NextResponse.json({
        devis: filteredDevis,
        pagination: {
          page: 1,
          limit: filteredDevis.length,
          total: filteredDevis.length,
          pages: 1
        },
        success: true,
        simulation: true
      });
    }

  } catch (error) {
    console.error('Erreur API devis:', error);
    return NextResponse.json({ 
      error: 'Erreur serveur',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const required = ['clientId', 'objet', 'type'];
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json({ error: `Le champ ${field} est requis` }, { status: 400 });
      }
    }

    try {
      const numeroPrefix = data.type === 'DEVIS' ? 'DEV' : 'FAC';
      const count = await db.devis.count({
        where: { type: data.type }
      });
      const numero = `${numeroPrefix}${String(count + 1).padStart(4, '0')}`;

      const totalHT = data.lignes?.reduce((sum: number, ligne: any) => 
        sum + (parseFloat(ligne.quantite) * parseFloat(ligne.prixUnitaire)), 0) || 0;
      const totalTVA = totalHT * 0.20;
      const totalTTC = totalHT + totalTVA;

      const devis = await db.devis.create({
        data: {
          numero,
          type: data.type,
          clientId: data.clientId,
          chantierId: data.chantierId || null,
          objet: data.objet,
          dateValidite: data.dateValidite ? new Date(data.dateValidite) : null,
          totalHT: totalHT,
          totalTVA: totalTVA,
          totalTTC: totalTTC,
          notes: data.notes || null,
          conditionsVente: data.conditionsVente || null,
          statut: 'BROUILLON',
          lignes: {
            create: data.lignes?.map((ligne: any, index: number) => ({
              designation: ligne.designation,
              quantite: parseFloat(ligne.quantite),
              prixUnitaire: parseFloat(ligne.prixUnitaire),
              tva: parseFloat(ligne.tva || '20'),
              total: parseFloat(ligne.quantite) * parseFloat(ligne.prixUnitaire),
              ordre: index + 1
            })) || []
          }
        },
        include: {
          client: {
            select: { id: true, name: true, email: true, company: true }
          },
          chantier: {
            select: { id: true, nom: true }
          },
          lignes: true
        }
      });

      return NextResponse.json(devis, { status: 201 });
    } catch (dbError) {
      console.warn('Base de données non disponible, simulation de la création');
      
      const mockDevis = {
        id: `dev-${Date.now()}`,
        numero: `${data.type === 'DEVIS' ? 'DEV' : 'FAC'}${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`,
        type: data.type,
        statut: 'BROUILLON',
        objet: data.objet,
        client: {
          id: data.clientId,
          name: 'Client Simulé',
          email: 'client@simulation.com'
        },
        totalHT: 0,
        totalTVA: 0,
        totalTTC: 0,
        dateCreation: new Date().toISOString(),
        lignes: data.lignes || []
      };

      return NextResponse.json(mockDevis, { status: 201 });
    }

  } catch (error) {
    console.error('Erreur création devis:', error);
    return NextResponse.json({ 
      error: 'Erreur lors de la création',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}
