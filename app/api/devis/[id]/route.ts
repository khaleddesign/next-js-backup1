import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
 request: NextRequest,
 { params }: { params: Promise<{ id: string }> }
) {
 try {
   const { id } = await params;
   
   try {
     const devis = await db.devis.findUnique({
       where: { id },
       include: {
         client: {
           select: { 
             id: true, name: true, email: true, phone: true,
             company: true, address: true 
           }
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

   } catch (dbError) {
     console.warn("Simulation détail devis");
     
     const mockDevis = {
       id,
       numero: "DEV0001", 
       type: "DEVIS",
       statut: "ENVOYE",
       objet: "Rénovation salle de bain",
       dateCreation: new Date().toISOString(),
       totalHT: 4500,
       totalTVA: 900,
       totalTTC: 5400,
       client: {
         id: "client-1",
         name: "Sophie Durand",
         email: "sophie.durand@email.com"
       },
       ligneDevis: [
         {
           id: "ligne-1",
           description: "Carrelage sol",
           quantite: 20,
           prixUnit: 45,
           total: 900,
           ordre: 1
         }
       ]
     };
     return NextResponse.json(mockDevis);
   }

 } catch (error) {
   return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
 }
}
