import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
 request: NextRequest,
 { params }: { params: { id: string } }
) {
 try {
   const devis = await db.devis.findUnique({
     where: { id: params.id },
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
       lignes: {
         orderBy: { ordre: 'asc' }
       },
       facture: {
         select: { id: true, numero: true, statut: true }
       },
       devisOrigine: {
         select: { id: true, numero: true }
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
 { params }: { params: { id: string } }
) {
 try {
   const data = await request.json();
   
   const existingDevis = await db.devis.findUnique({
     where: { id: params.id },
     include: { lignes: true }
   });

   if (!existingDevis) {
     return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 });
   }

   if (existingDevis.statut !== 'BROUILLON') {
     return NextResponse.json({ error: 'Seuls les devis brouillon peuvent être modifiés' }, { status: 400 });
   }

   const totalHT = data.lignes?.reduce((sum: number, ligne: any) => 
     sum + (parseFloat(ligne.quantite) * parseFloat(ligne.prixUnitaire)), 0) || 0;
   const totalTVA = totalHT * 0.20;
   const totalTTC = totalHT + totalTVA;

   await db.ligneDevis.deleteMany({
     where: { devisId: params.id }
   });

   const updatedDevis = await db.devis.update({
     where: { id: params.id },
     data: {
       objet: data.objet,
       chantierId: data.chantierId || null,
       dateValidite: data.dateValidite ? new Date(data.dateValidite) : null,
       totalHT: totalHT,
       totalTVA: totalTVA,
       totalTTC: totalTTC,
       notes: data.notes || null,
       conditionsVente: data.conditionsVente || null,
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
       client: true,
       chantier: true,
       lignes: { orderBy: { ordre: 'asc' } }
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
 { params }: { params: { id: string } }
) {
 try {
   const devis = await db.devis.findUnique({
     where: { id: params.id }
   });

   if (!devis) {
     return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 });
   }

   if (devis.statut !== 'BROUILLON') {
     return NextResponse.json({ error: 'Seuls les devis brouillon peuvent être supprimés' }, { status: 400 });
   }

   await db.devis.delete({
     where: { id: params.id }
   });

   return NextResponse.json({ message: 'Devis supprimé avec succès' });

 } catch (error) {
   console.error('Erreur suppression devis:', error);
   return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 });
 }
}
