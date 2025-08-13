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
     }
   });

 } catch (error) {
   console.error('Erreur API devis:', error);
   return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
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

 } catch (error) {
   console.error('Erreur création devis:', error);
   return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 });
 }
}
