import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function seedDevis() {
 console.log('🌱 Création des données de test Devis/Facturation...');

 try {
   const users = await db.user.findMany({
     where: {
       role: { in: ['CLIENT', 'ADMIN', 'MANAGER'] }
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
       dateEcheance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
       // dateEnvoi: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
       totalHT: 4500.00,
       totalTVA: 900.00,
       totalTTC: 5400.00,
       montant: 5400.00,
       notes: 'Devis valable 30 jours. Acompte de 30% à la commande.',
       conditionsVente: 'Paiement en 3 fois : 30% à la commande, 40% à mi-parcours, 30% à la livraison. Garantie décennale incluse.',
       ligneDevis: {
         create: [
           {
             description: 'Démolition existant (carrelage, sanitaires)',
             quantite: 1,
             prixUnit: 800.00,
             total: 800.00,
             ordre: 1
           },
           {
             description: 'Plomberie - Évacuation et alimentation',
             quantite: 1,
             prixUnit: 1200.00,
             total: 1200.00,
             ordre: 2
           },
           {
             description: 'Électricité - Prises et éclairage',
             quantite: 1,
             prixUnit: 600.00,
             total: 600.00,
             ordre: 3
           },
           {
             description: 'Carrelage sol et mur (fourniture et pose)',
             quantite: 15,
             prixUnit: 45.00,
             total: 675.00,
             ordre: 4
           },
           {
             description: 'Pose receveur de douche 90x90',
             quantite: 1,
             prixUnit: 350.00,
             total: 350.00,
             ordre: 5
           },
           {
             description: 'Installation WC suspendu',
             quantite: 1,
             prixUnit: 400.00,
             total: 400.00,
             ordre: 6
           },
           {
             description: 'Meuble vasque avec miroir',
             quantite: 1,
             prixUnit: 475.00,
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
       dateEcheance: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
       // dateEnvoi: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
       // dateAcceptation: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
       totalHT: 8750.00,
       totalTVA: 1750.00,
       totalTTC: 10500.00,
       montant: 10500.00,
       notes: 'Cuisine haut de gamme avec électroménager intégré.',
       conditionsVente: 'Délai de livraison : 6 semaines. Installation comprise.',
       ligneDevis: {
         create: [
           {
             description: 'Démontage cuisine existante',
             quantite: 1,
             prixUnit: 400.00,
             total: 400.00,
             ordre: 1
           },
           {
             description: 'Plomberie - Raccordement évier et lave-vaisselle',
             quantite: 1,
             prixUnit: 500.00,
             total: 500.00,
             ordre: 2
           },
           {
             description: 'Électricité - Prises et éclairage plan de travail',
             quantite: 1,
             prixUnit: 800.00,
             total: 800.00,
             ordre: 3
           },
           {
             description: 'Meubles bas - 3m linéaires',
             quantite: 3,
             prixUnit: 450.00,
             total: 1350.00,
             ordre: 4
           },
           {
             description: 'Meubles hauts - 2m linéaires',
             quantite: 2,
             prixUnit: 320.00,
             total: 640.00,
             ordre: 5
           },
           {
             description: 'Plan de travail quartz 3m',
             quantite: 1,
             prixUnit: 800.00,
             total: 800.00,
             ordre: 6
           },
           {
             description: 'Crédence carrelage métro',
             quantite: 6,
             prixUnit: 35.00,
             total: 210.00,
             ordre: 7
           },
           {
             description: 'Électroménager (four, plaque, hotte)',
             quantite: 1,
             prixUnit: 1500.00,
             total: 1500.00,
             ordre: 8
           },
           {
             description: 'Évier inox avec robinetterie',
             quantite: 1,
             prixUnit: 350.00,
             total: 350.00,
             ordre: 9
           },
           {
             description: 'Installation et finitions',
             quantite: 1,
             prixUnit: 2000.00,
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
       dateEcheance: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
       totalHT: 1530.00,
       totalTVA: 84.15,
       totalTTC: 1614.15,
       montant: 1614.15,
       notes: 'Isolation avec laine de verre haute performance. Éligible aux aides CEE.',
       conditionsVente: 'Crédit d\'impôt possible selon conditions. TVA réduite à 5,5%.',
       ligneDevis: {
         create: [
           {
             description: 'Préparation et nettoyage combles',
             quantite: 1,
             prixUnit: 150.00,
             total: 150.00,
             ordre: 1
           },
           {
             description: 'Pose pare-vapeur',
             quantite: 50,
             prixUnit: 3.00,
             total: 150.00,
             ordre: 2
           },
           {
             description: 'Isolation laine de verre 300mm',
             quantite: 50,
             prixUnit: 18.00,
             total: 900.00,
             ordre: 3
           },
           {
             description: 'Pose plancher OSB pour circulation',
             quantite: 20,
             prixUnit: 25.00,
             total: 500.00,
             ordre: 4
           },
           {
             description: 'Trappe d\'accès isolée',
             quantite: 1,
             prixUnit: 180.00,
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
       dateEcheance: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
       // dateEnvoi: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
       totalHT: 2800.00,
       totalTVA: 280.00,
       totalTTC: 3080.00,
       montant: 3080.00,
       notes: 'Peinture haut de gamme avec garantie 5 ans.',
       conditionsVente: 'Travaux sur 2 semaines. TVA réduite à 10% (logement > 2 ans).',
       ligneDevis: {
         create: [
           {
             description: 'Préparation surfaces (rebouchage, ponçage)',
             quantite: 1,
             prixUnit: 600.00,
             total: 600.00,
             ordre: 1
           },
           {
             description: 'Sous-couche murs et plafonds',
             quantite: 1,
             prixUnit: 400.00,
             total: 400.00,
             ordre: 2
           },
           {
             description: 'Peinture plafonds - 2 couches',
             quantite: 80,
             prixUnit: 8.00,
             total: 640.00,
             ordre: 3
           },
           {
             description: 'Peinture murs - 2 couches',
             quantite: 120,
             prixUnit: 12.00,
             total: 1440.00,
             ordre: 4
           },
           {
             description: 'Peinture boiseries (portes, plinthes)',
             quantite: 1,
             prixUnit: 720.00,
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
       dateEcheance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
       // dateEnvoi: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
       // datePaiement: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
       totalHT: 8750.00,
       totalTVA: 1750.00,
       totalTTC: 10500.00,
       montant: 10500.00,
       notes: 'Facture générée automatiquement depuis le devis DEV0002.',
       conditionsVente: 'Paiement effectué par virement bancaire. Merci pour votre confiance.',
       ligneDevis: {
         create: [
           {
             description: 'Démontage cuisine existante',
             quantite: 1,
             prixUnit: 400.00,
             total: 400.00,
             ordre: 1
           },
           {
             description: 'Plomberie - Raccordement évier et lave-vaisselle',
             quantite: 1,
             prixUnit: 500.00,
             total: 500.00,
             ordre: 2
           },
           {
             description: 'Électricité - Prises et éclairage plan de travail',
             quantite: 1,
             prixUnit: 800.00,
             total: 800.00,
             ordre: 3
           },
           {
             description: 'Meubles bas - 3m linéaires',
             quantite: 3,
             prixUnit: 450.00,
             total: 1350.00,
             ordre: 4
           },
           {
             description: 'Meubles hauts - 2m linéaires',
             quantite: 2,
             prixUnit: 320.00,
             total: 640.00,
             ordre: 5
           },
           {
             description: 'Plan de travail quartz 3m',
             quantite: 1,
             prixUnit: 800.00,
             total: 800.00,
             ordre: 6
           },
           {
             description: 'Crédence carrelage métro',
             quantite: 6,
             prixUnit: 35.00,
             total: 210.00,
             ordre: 7
           },
           {
             description: 'Électroménager (four, plaque, hotte)',
             quantite: 1,
             prixUnit: 1500.00,
             total: 1500.00,
             ordre: 8
           },
           {
             description: 'Évier inox avec robinetterie',
             quantite: 1,
             prixUnit: 350.00,
             total: 350.00,
             ordre: 9
           },
           {
             description: 'Installation et finitions',
             quantite: 1,
             prixUnit: 2000.00,
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
       dateEcheance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
       // dateEnvoi: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
       totalHT: 3200.00,
       totalTVA: 640.00,
       totalTTC: 3840.00,
       montant: 3840.00,
       notes: 'Terrasse livrée et installée selon devis. Garantie 10 ans.',
       conditionsVente: 'Paiement sous 30 jours. Aucun escompte pour paiement anticipé.',
       ligneDevis: {
         create: [
           {
             description: 'Terrassement et nivellement',
             quantite: 25,
             prixUnit: 15.00,
             total: 375.00,
             ordre: 1
           },
           {
             description: 'Dalle béton armé 15cm',
             quantite: 25,
             prixUnit: 45.00,
             total: 1125.00,
             ordre: 2
           },
           {
             description: 'Structure lambourdes bois traité',
             quantite: 1,
             prixUnit: 500.00,
             total: 500.00,
             ordre: 3
           },
           {
             description: 'Lames composite - fourniture et pose',
             quantite: 25,
             prixUnit: 65.00,
             total: 1625.00,
             ordre: 4
           },
           {
             description: 'Garde-corps et escalier',
             quantite: 1,
             prixUnit: 800.00,
             total: 800.00,
             ordre: 5
           },
           {
             description: 'Finitions (plinthes, angles)',
             quantite: 1,
             prixUnit: 275.00,
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
       dateEcheance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
       totalHT: 285.00,
       totalTVA: 57.00,
       totalTTC: 342.00,
       montant: 342.00,
       notes: 'Intervention d\'urgence week-end. Majoration appliquée.',
       conditionsVente: 'Paiement à réception de facture. Garantie pièces et main d\'œuvre 1 an.',
       ligneDevis: {
         create: [
           {
             description: 'Déplacement urgence week-end',
             quantite: 1,
             prixUnit: 85.00,
             total: 85.00,
             ordre: 1
           },
           {
             description: 'Réparation fuite canalisation',
             quantite: 2,
             prixUnit: 75.00,
             total: 150.00,
             ordre: 2
           },
           {
             description: 'Fournitures (raccords, joints)',
             quantite: 1,
             prixUnit: 50.00,
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
