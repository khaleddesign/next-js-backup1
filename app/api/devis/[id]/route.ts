import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface LigneDevisInput {
  designation: string;
  quantite: string | number;
  prixUnitaire: string | number;
}

export async function GET(
 request: NextRequest,
 { params }: { params: Promise<{ id: string }> }
) {
 try {
   const { id } = await params;
   const devis = await db.devis.findUnique({
     where: { id },
     include: {
       client: {
         select: { 
           id: true, name: true, email: true, phone: true,
           company: true, address: true 
         }
       },
       chantier: {
         select: { id: true, nom: true, adresse: true }
       },
       ligneDevis: {
         orderBy: { ordre: 'asc' }
       }
     }
   });

   if (!devis) {
     return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 });
   }

   return NextResponse.json(devis);

 } catch (error) {
   console.error('Erreur API devis détail:', error);
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
   
   const existingDevis = await db.devis.findUnique({
     where: { id },
     include: { ligneDevis: true }
   });

   if (!existingDevis) {
     return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 });
   }

   if (existingDevis.statut !== 'BROUILLON') {
     return NextResponse.json({ error: 'Seuls les devis brouillon peuvent être modifiés' }, { status: 400 });
   }

   const totalHT = data.lignes?.reduce((sum: number, ligne: LigneDevisInput) => 
     sum + (parseFloat(ligne.quantite.toString()) * parseFloat(ligne.prixUnitaire.toString())), 0) || 0;
   const totalTVA = totalHT * 0.20;
   const totalTTC = totalHT + totalTVA;

   await db.ligneDevis.deleteMany({
     where: { devisId: id }
   });

   const updatedDevis = await db.devis.update({
     where: { id },
     data: {
       objet: data.objet,
       chantierId: data.chantierId || null,
       montant: totalTTC,
       dateEcheance: data.dateValidite ? new Date(data.dateValidite) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
       totalHT: totalHT,
       totalTVA: totalTVA,
       totalTTC: totalTTC,
       notes: data.notes || null,
       conditionsVente: data.conditionsVente || null,
       ligneDevis: {
         create: data.lignes?.map((ligne: LigneDevisInput, index: number) => ({
           description: ligne.designation,
           quantite: parseFloat(ligne.quantite.toString()),
           prixUnit: parseFloat(ligne.prixUnitaire.toString()),
           total: parseFloat(ligne.quantite.toString()) * parseFloat(ligne.prixUnitaire.toString()),
           ordre: index + 1
         })) || []
       }
     },
     include: {
       client: true,
       chantier: true,
       ligneDevis: { orderBy: { ordre: 'asc' } }
     }
   });

   return NextResponse.json(updatedDevis);

 } catch (error) {
   console.error('Erreur mise à jour devis:', error);
   return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 });
 }
}

export async function DELETE(
 request: NextRequest,
 { params }: { params: Promise<{ id: string }> }
) {
 try {
   const { id } = await params;
   const devis = await db.devis.findUnique({
     where: { id }
   });

   if (!devis) {
     return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 });
   }

   if (devis.statut !== 'BROUILLON') {
     return NextResponse.json({ error: 'Seuls les devis brouillon peuvent être supprimés' }, { status: 400 });
   }

   await db.devis.delete({
     where: { id }
   });

   return NextResponse.json({ message: 'Devis supprimé avec succès' });

 } catch (error) {
   console.error('Erreur suppression devis:', error);
   return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
 }
}
