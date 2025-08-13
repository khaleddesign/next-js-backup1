import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const devis = await db.devis.findUnique({
      where: { id: params.id },
      include: {
        lignes: { orderBy: { ordre: 'asc' } },
        client: true,
        chantier: true
      }
    });

    if (!devis) {
      return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 });
    }

    if (devis.type !== 'DEVIS') {
      return NextResponse.json({ error: 'Seul un devis peut être converti en facture' }, { status: 400 });
    }

    if (devis.statut !== 'ACCEPTE') {
      return NextResponse.json({ error: 'Seul un devis accepté peut être converti en facture' }, { status: 400 });
    }

    const factureCount = await db.devis.count({
      where: { type: 'FACTURE' }
    });
    const numeroFacture = `FAC${String(factureCount + 1).padStart(4, '0')}`;

    const facture = await db.devis.create({
      data: {
        numero: numeroFacture,
        type: 'FACTURE',
        clientId: devis.clientId,
        chantierId: devis.chantierId,
        objet: devis.objet,
        totalHT: devis.totalHT,
        totalTVA: devis.totalTVA,
        totalTTC: devis.totalTTC,
        notes: devis.notes,
        conditionsVente: devis.conditionsVente,
        statut: 'ENVOYE',
        factureId: devis.id,
        lignes: {
          create: devis.lignes.map(ligne => ({
            designation: ligne.designation,
            quantite: ligne.quantite,
            prixUnitaire: ligne.prixUnitaire,
            tva: ligne.tva,
            total: ligne.total,
            ordre: ligne.ordre
          }))
        }
      },
      include: {
        client: true,
        chantier: true,
        lignes: { orderBy: { ordre: 'asc' } },
        devisOrigine: true
      }
    });

    return NextResponse.json(facture, { status: 201 });

  } catch (error) {
    console.error('Erreur conversion devis:', error);
    return NextResponse.json({ error: 'Erreur lors de la conversion' }, { status: 500 });
  }
}
