import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const devis = await db.devis.findUnique({
      where: { id },
      include: {
        ligneDevis: { orderBy: { ordre: 'asc' } },
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
        montant: devis.totalTTC || 0,
        totalHT: devis.totalHT,
        totalTVA: devis.totalTVA,
        totalTTC: devis.totalTTC,
        dateEcheance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        notes: devis.notes,
        conditionsVente: devis.conditionsVente,
        statut: 'ENVOYE',
        factureId: devis.id,
        ligneDevis: {
          create: devis.ligneDevis.map(ligne => ({
            description: ligne.description,
            quantite: ligne.quantite,
            prixUnit: ligne.prixUnit,
            total: ligne.total,
            ordre: ligne.ordre
          }))
        }
      },
      include: {
        client: true,
        chantier: true,
        ligneDevis: { orderBy: { ordre: 'asc' } }
      }
    });

    return NextResponse.json(facture, { status: 201 });

  } catch (error) {
    console.error('Erreur conversion devis:', error);
    return NextResponse.json({ error: 'Erreur lors de la conversion' }, { status: 500 });
  }
}

// AJOUT: Fonction pour gérer la conversion avec situations
async function convertirAvecSituations(devis: any) {
  // Si c'est une situation, convertir en facture de situation
  if (devis.situationNumero && devis.situationParent) {
    const factureCount = await db.devis.count({
      where: { 
        type: 'FACTURE',
        situationParent: devis.situationParent 
      }
    });
    
    return `FAC${devis.numero.split('-')[0].replace('DEV', '')}-S${String(factureCount + 1).padStart(2, '0')}`;
  }
  
  // Conversion standard
  const factureCount = await db.devis.count({
    where: { type: 'FACTURE' }
  });
  
  return `FAC${String(factureCount + 1).padStart(4, '0')}`;
}
