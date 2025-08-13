import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function seedDevis() {
 console.log('🌱 Création des données de test Devis/Facturation...');

 try {
   const users = await db.user.findMany({
     where: {
       role: { in: ['CLIENT', 'ADMIN', 'COMMERCIAL'] }
     }
   });

   const chantiers = await db.chantier.findMany({
     include: { client: true }
   });

   if (users.length === 0) {
     console.log('⚠️ Aucun utilisateur trouvé. Veuillez d\'abord exécuter le seed principal.');
     return;
   }

   const clients = users.filter(u => u.role === 'CLIENT');
   if (clients.length === 0) {
     console.log('⚠️ Aucun client trouvé. Créons quelques clients...');
     
     const client1 = await db.user.create({
       data: {
         name: 'Sophie Durand',
         email: 'sophie.durand@email.com',
         role: 'CLIENT',
         company: 'Durand & Associés',
         phone: '+33 6 12 34 56 78',
         address: '25 Avenue Montaigne, 75008 Paris'
       }
     });

     const client2 = await db.user.create({
       data: {
         name: 'Marc Lefebvre',
         email: 'marc.lefebvre@email.com',
         role: 'CLIENT',
         company: 'Lefebvre Construction',
         phone: '+33 6 87 65 43 21',
         address: '18 Rue de la République, 69002 Lyon'
       }
     });

     clients.push(client1, client2);
   }

   console.log('📄 Création des devis...');

   const devis1 = await db.devis.create({
     data: {
       numero: 'DEV0001',
       type: 'DEVIS',
       statut: 'ENVOYE',
       clientId: clients[0].id,
       chantierId: chantiers[0]?.id || null,
       objet: 'Rénovation complète salle de bain',
       dateValidite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
       dateEnvoi: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
       totalHT: 4500.00,
       totalTVA: 900.00,
       totalTTC: 5400.00,
       notes: 'Devis valable 30 jours. Acompte de 30% à la commande.',
       conditionsVente: 'Paiement en 3 fois : 30% à la commande, 40% à mi-parcours, 30% à la livraison. Garantie décennale incluse.',
       lignes: {
         create: [
           {
             designation: 'Démolition existant (carrelage, sanitaires)',
             quantite: 1,
             prixUnitaire: 800.00,
             tva: 20,
             total: 800.00,
             ordre: 1
           },
           {
             designation: 'Plomberie - Évacuation et alimentation',
             quantite: 1,
             prixUnitaire: 1200.00,
             tva: 20,
             total: 1200.00,
             ordre: 2
           },
           {
             designation: 'Électricité - Prises et éclairage',
             quantite: 1,
             prixUnitaire: 600.00,
             tva: 20,
             total: 600.00,
             ordre: 3
           },
           {
             designation: 'Carrelage sol et mur (fourniture et pose)',
             quantite: 15,
             prixUnitaire: 45.00,
             tva: 20,
             total: 675.00,
             ordre: 4
           },
           {
             designation: 'Pose receveur de douche 90x90',
             quantite: 1,
             prixUnitaire: 350.00,
             tva: 20,
             total: 350.00,
             ordre: 5
           },
           {
             designation: 'Installation WC suspendu',
             quantite: 1,
             prixUnitaire: 400.00,
             tva: 20,
             total: 400.00,
             ordre: 6
           },
           {
             designation: 'Meuble vasque avec miroir',
             quantite: 1,
             prixUnitaire: 475.00,
             tva: 20,
             total: 475.00,
             ordre: 7
           }
         ]
       }
     }
   });

   const devis2 = await db.devis.create({
     data: {
       numero: 'DEV0002',
       type: 'DEVIS',
       statut: 'ACCEPTE',
       clientId: clients[0].id,
       chantierId: chantiers[1]?.id || null,
       objet: 'Cuisine équipée moderne',
       dateValidite: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
       dateEnvoi: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
       dateAcceptation: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
       totalHT: 8750.00,
       totalTVA: 1750.00,
       totalTTC: 10500.00,
       notes: 'Cuisine haut de gamme avec électroménager intégré.',
       conditionsVente: 'Délai de livraison : 6 semaines. Installation comprise.',
       lignes: {
         create: [
           {
             designation: 'Démontage cuisine existante',
             quantite: 1,
             prixUnitaire: 400.00,
             tva: 20,
             total: 400.00,
             ordre: 1
           },
           {
             designation: 'Plomberie - Raccordement évier et lave-vaisselle',
             quantite: 1,
             prixUnitaire: 500.00,
             tva: 20,
             total: 500.00,
             ordre: 2
           },
           {
             designation: 'Électricité - Prises et éclairage plan de travail',
             quantite: 1,
             prixUnitaire: 800.00,
             tva: 20,
             total: 800.00,
             ordre: 3
           },
           {
             designation: 'Meubles bas - 3m linéaires',
             quantite: 3,
             prixUnitaire: 450.00,
             tva: 20,
             total: 1350.00,
             ordre: 4
           },
           {
             designation: 'Meubles hauts - 2m linéaires',
             quantite: 2,
             prixUnitaire: 320.00,
             tva: 20,
             total: 640.00,
             ordre: 5
           },
           {
             designation: 'Plan de travail quartz 3m',
             quantite: 1,
             prixUnitaire: 800.00,
             tva: 20,
             total: 800.00,
             ordre: 6
           },
           {
             designation: 'Crédence carrelage métro',
             quantite: 6,
             prixUnitaire: 35.00,
             tva: 20,
             total: 210.00,
             ordre: 7
           },
           {
             designation: 'Électroménager (four, plaque, hotte)',
             quantite: 1,
             prixUnitaire: 1500.00,
             tva: 20,
             total: 1500.00,
             ordre: 8
           },
           {
             designation: 'Évier inox avec robinetterie',
             quantite: 1,
             prixUnitaire: 350.00,
             tva: 20,
             total: 350.00,
             ordre: 9
           },
           {
             designation: 'Installation et finitions',
             quantite: 1,
             prixUnitaire: 2000.00,
             tva: 20,
             total: 2000.00,
             ordre: 10
           }
         ]
       }
     }
   });

   const devis3 = await db.devis.create({
     data: {
       numero: 'DEV0003',
       type: 'DEVIS',
       statut: 'BROUILLON',
       clientId: clients[1]?.id || clients[0].id,
       objet: 'Isolation combles perdus',
       dateValidite: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
       totalHT: 1530.00,
       totalTVA: 84.15,
       totalTTC: 1614.15,
       notes: 'Isolation avec laine de verre haute performance. Éligible aux aides CEE.',
       conditionsVente: 'Crédit d\'impôt possible selon conditions. TVA réduite à 5,5%.',
       lignes: {
         create: [
           {
             designation: 'Préparation et nettoyage combles',
             quantite: 1,
             prixUnitaire: 150.00,
             tva: 5.5,
             total: 150.00,
             ordre: 1
           },
           {
             designation: 'Pose pare-vapeur',
             quantite: 50,
             prixUnitaire: 3.00,
             tva: 5.5,
             total: 150.00,
             ordre: 2
           },
           {
             designation: 'Isolation laine de verre 300mm',
             quantite: 50,
             prixUnitaire: 18.00,
             tva: 5.5,
             total: 900.00,
             ordre: 3
           },
           {
             designation: 'Pose plancher OSB pour circulation',
             quantite: 20,
             prixUnitaire: 25.00,
             tva: 5.5,
             total: 500.00,
             ordre: 4
           },
           {
             designation: 'Trappe d\'accès isolée',
             quantite: 1,
             prixUnitaire: 180.00,
             tva: 5.5,
             total: 180.00,
             ordre: 5
           }
         ]
       }
     }
   });

   const devis4 = await db.devis.create({
     data: {
       numero: 'DEV0004',
       type: 'DEVIS',
       statut: 'REFUSE',
       clientId: clients[1]?.id || clients[0].id,
       objet: 'Peinture intérieure maison',
       dateValidite: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
       dateEnvoi: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
       totalHT: 2800.00,
       totalTVA: 280.00,
       totalTTC: 3080.00,
       notes: 'Peinture haut de gamme avec garantie 5 ans.',
       conditionsVente: 'Travaux sur 2 semaines. TVA réduite à 10% (logement > 2 ans).',
       lignes: {
         create: [
           {
             designation: 'Préparation surfaces (rebouchage, ponçage)',
             quantite: 1,
             prixUnitaire: 600.00,
             tva: 10,
             total: 600.00,
             ordre: 1
           },
           {
             designation: 'Sous-couche murs et plafonds',
             quantite: 1,
             prixUnitaire: 400.00,
             tva: 10,
             total: 400.00,
             ordre: 2
           },
           {
             designation: 'Peinture plafonds - 2 couches',
             quantite: 80,
             prixUnitaire: 8.00,
             tva: 10,
             total: 640.00,
             ordre: 3
           },
           {
             designation: 'Peinture murs - 2 couches',
             quantite: 120,
             prixUnitaire: 12.00,
             tva: 10,
             total: 1440.00,
             ordre: 4
           },
           {
             designation: 'Peinture boiseries (portes, plinthes)',
             quantite: 1,
             prixUnitaire: 720.00,
             tva: 10,
             total: 720.00,
             ordre: 5
           }
         ]
       }
     }
   });

   console.log('🧾 Création des factures...');

   const facture1 = await db.devis.create({
     data: {
       numero: 'FAC0001',
       type: 'FACTURE',
       statut: 'PAYE',
       clientId: clients[0].id,
       chantierId: chantiers[0]?.id || null,
       factureId: devis2.id,
       objet: 'Cuisine équipée moderne',
       dateEnvoi: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
       datePaiement: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
       totalHT: 8750.00,
       totalTVA: 1750.00,
       totalTTC: 10500.00,
       notes: 'Facture générée automatiquement depuis le devis DEV0002.',
       conditionsVente: 'Paiement effectué par virement bancaire. Merci pour votre confiance.',
       lignes: {
         create: [
           {
             designation: 'Démontage cuisine existante',
             quantite: 1,
             prixUnitaire: 400.00,
             tva: 20,
             total: 400.00,
             ordre: 1
           },
           {
             designation: 'Plomberie - Raccordement évier et lave-vaisselle',
             quantite: 1,
             prixUnitaire: 500.00,
             tva: 20,
             total: 500.00,
             ordre: 2
           },
           {
             designation: 'Électricité - Prises et éclairage plan de travail',
             quantite: 1,
             prixUnitaire: 800.00,
             tva: 20,
             total: 800.00,
             ordre: 3
           },
           {
             designation: 'Meubles bas - 3m linéaires',
             quantite: 3,
             prixUnitaire: 450.00,
             tva: 20,
             total: 1350.00,
             ordre: 4
           },
           {
             designation: 'Meubles hauts - 2m linéaires',
             quantite: 2,
             prixUnitaire: 320.00,
             tva: 20,
             total: 640.00,
             ordre: 5
           },
           {
             designation: 'Plan de travail quartz 3m',
             quantite: 1,
             prixUnitaire: 800.00,
             tva: 20,
             total: 800.00,
             ordre: 6
           },
           {
             designation: 'Crédence carrelage métro',
             quantite: 6,
             prixUnitaire: 35.00,
             tva: 20,
             total: 210.00,
             ordre: 7
           },
           {
             designation: 'Électroménager (four, plaque, hotte)',
             quantite: 1,
             prixUnitaire: 1500.00,
             tva: 20,
             total: 1500.00,
             ordre: 8
           },
           {
             designation: 'Évier inox avec robinetterie',
             quantite: 1,
             prixUnitaire: 350.00,
             tva: 20,
             total: 350.00,
             ordre: 9
           },
           {
             designation: 'Installation et finitions',
             quantite: 1,
             prixUnitaire: 2000.00,
             tva: 20,
             total: 2000.00,
             ordre: 10
           }
         ]
       }
     }
   });

   const facture2 = await db.devis.create({
     data: {
       numero: 'FAC0002',
       type: 'FACTURE',
       statut: 'ENVOYE',
       clientId: clients[1]?.id || clients[0].id,
       objet: 'Terrasse bois composite 25m²',
       dateEnvoi: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
       totalHT: 3200.00,
       totalTVA: 640.00,
       totalTTC: 3840.00,
       notes: 'Terrasse livrée et installée selon devis. Garantie 10 ans.',
       conditionsVente: 'Paiement sous 30 jours. Aucun escompte pour paiement anticipé.',
       lignes: {
         create: [
           {
             designation: 'Terrassement et nivellement',
             quantite: 25,
             prixUnitaire: 15.00,
             tva: 20,
             total: 375.00,
             ordre: 1
           },
           {
             designation: 'Dalle béton armé 15cm',
             quantite: 25,
             prixUnitaire: 45.00,
             tva: 20,
             total: 1125.00,
             ordre: 2
           },
           {
             designation: 'Structure lambourdes bois traité',
             quantite: 1,
             prixUnitaire: 500.00,
             tva: 20,
             total: 500.00,
             ordre: 3
           },
           {
             designation: 'Lames composite - fourniture et pose',
             quantite: 25,
             prixUnitaire: 65.00,
             tva: 20,
             total: 1625.00,
             ordre: 4
           },
           {
             designation: 'Garde-corps et escalier',
             quantite: 1,
             prixUnitaire: 800.00,
             tva: 20,
             total: 800.00,
             ordre: 5
           },
           {
             designation: 'Finitions (plinthes, angles)',
             quantite: 1,
             prixUnitaire: 275.00,
             tva: 20,
             total: 275.00,
             ordre: 6
           }
         ]
       }
     }
   });

   const facture3 = await db.devis.create({
     data: {
       numero: 'FAC0003',
       type: 'FACTURE',
       statut: 'BROUILLON',
       clientId: clients[0].id,
       objet: 'Dépannage plomberie urgence',
       totalHT: 285.00,
       totalTVA: 57.00,
       totalTTC: 342.00,
       notes: 'Intervention d\'urgence week-end. Majoration appliquée.',
       conditionsVente: 'Paiement à réception de facture. Garantie pièces et main d\'œuvre 1 an.',
       lignes: {
         create: [
           {
             designation: 'Déplacement urgence week-end',
             quantite: 1,
             prixUnitaire: 85.00,
             tva: 20,
             total: 85.00,
             ordre: 1
           },
           {
             designation: 'Réparation fuite canalisation',
             quantite: 2,
             prixUnitaire: 75.00,
             tva: 20,
             total: 150.00,
             ordre: 2
           },
           {
             designation: 'Fournitures (raccords, joints)',
             quantite: 1,
             prixUnitaire: 50.00,
             tva: 20,
             total: 50.00,
             ordre: 3
           }
         ]
       }
     }
   });

   console.log('🔗 Mise à jour des relations...');
   
   await db.devis.update({
     where: { id: devis2.id },
     data: { factureId: facture1.id }
   });

   console.log('✅ Seed Devis/Facturation terminé avec succès !');
   
   const stats = await Promise.all([
     db.devis.count({ where: { type: 'DEVIS' } }),
     db.devis.count({ where: { type: 'FACTURE' } }),
     db.ligneDevis.count()
   ]);

   console.log('📊 Statistiques créées :');
   console.log(`   - Devis: ${stats[0]}`);
   console.log(`   - Factures: ${stats[1]}`);
   console.log(`   - Lignes: ${stats[2]}`);

 } catch (error) {
   console.error('❌ Erreur lors du seed Devis:', error);
   throw error;
 } finally {
   await db.$disconnect();
 }
}

if (require.main === module) {
 seedDevis()
   .catch((error) => {
     console.error('❌ ÉCHEC DU SEED DEVIS:', error);
     process.exit(1);
   });
}

export default seedDevis;
