import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  console.log('🚀 INITIALISATION COMPLÈTE CHANTIERPRO...\n');

  try {
    // ========================================
    // NETTOYAGE COMPLET
    // ========================================
    console.log('🧹 Nettoyage de la base de données...');
    
    await db.notification.deleteMany({});
    await db.message.deleteMany({});
    await db.comment.deleteMany({});
    await db.timelineEvent.deleteMany({});
    await db.devis.deleteMany({});
    await db.planning.deleteMany({});
    await db.chantier.deleteMany({});
    await db.session.deleteMany({});
    await db.account.deleteMany({});
    await db.user.deleteMany({});

    console.log('✅ Base nettoyée\n');

    // ========================================
    // UTILISATEURS AVEC IDS HARDCODÉS DU CODE
    // ========================================
    console.log('👥 Création des utilisateurs...');

    const testClient = await db.user.create({
      data: {
        id: 'test-client-123', // ✅ ID EXACT du code
        name: 'Marie Dubois',
        email: 'marie.dubois@client.com',
        role: 'CLIENT',
        phone: '+33 6 12 34 56 78',
        company: 'Dubois Immobilier',
        address: '15 Rue de la Paix, 75001 Paris'
      }
    });

    const testCommercial = await db.user.create({
      data: {
        id: 'test-commercial-456', // ✅ ID EXACT du code
        name: 'Julie Martin',
        email: 'julie.martin@chantierpro.fr',
        role: 'COMMERCIAL',
        phone: '+33 6 98 76 54 32',
        company: 'ChantierPro',
        address: '42 Avenue des Champs, 75008 Paris'
      }
    });

    const testAdmin = await db.user.create({
      data: {
        id: 'test-admin-789', // ✅ ID EXACT du code
        name: 'Pierre Supervisor',
        email: 'pierre.admin@chantierpro.fr',
        role: 'ADMIN',
        phone: '+33 6 11 22 33 44',
        company: 'ChantierPro',
        address: '10 Boulevard Central, 75009 Paris'
      }
    });

    // UTILISATEURS SUPPLÉMENTAIRES POUR RICHESSE
    const ouvrier1 = await db.user.create({
      data: {
        id: 'ouvrier-001',
        name: 'Marc Maçon',
        email: 'marc.macon@chantierpro.fr',
        role: 'OUVRIER',
        phone: '+33 6 44 55 66 77',
        company: 'ChantierPro'
      }
    });

    const ouvrier2 = await db.user.create({
      data: {
        id: 'ouvrier-002',
        name: 'Sophie Électricienne',
        email: 'sophie.elec@chantierpro.fr',
        role: 'OUVRIER',
        phone: '+33 6 77 88 99 00',
        company: 'ChantierPro'
      }
    });

    const client2 = await db.user.create({
      data: {
        id: 'client-extra-001',
        name: 'Jean Moreau',
        email: 'jean.moreau@email.com',
        role: 'CLIENT',
        phone: '+33 6 55 66 77 88',
        company: 'Moreau Construction'
      }
    });

    console.log('✅ 6 utilisateurs créés');

    // ========================================
    // CHANTIERS RÉALISTES
    // ========================================
    console.log('🏗️ Création des chantiers...');

    const chantier1 = await db.chantier.create({
      data: {
        id: 'chantier-villa-001',
        nom: 'Rénovation Villa Moderne',
        description: 'Rénovation complète d\'une villa de 180m² avec extension et modernisation. Travaux incluant : démolition partielle, gros œuvre, électricité, plomberie, carrelage, peinture.',
        adresse: '25 Avenue des Roses, 92160 Antony',
        clientId: testClient.id,
        statut: 'EN_COURS',
        progression: 65,
        dateDebut: new Date('2024-01-15'),
        dateFin: new Date('2024-06-30'),
        budget: 125000,
        superficie: '180m²',
        photo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
        photos: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop'
        ],
        lat: 48.7516,
        lng: 2.2969
      }
    });

    const chantier2 = await db.chantier.create({
      data: {
        id: 'chantier-extension-002',
        nom: 'Extension Maison Familiale',
        description: 'Extension de 40m² pour création d\'une suite parentale avec salle de bain. Création d\'une terrasse couverte.',
        adresse: '8 Rue des Tilleuls, 78100 Saint-Germain-en-Laye',
        clientId: client2.id,
        statut: 'PLANIFIE',
        progression: 0,
        dateDebut: new Date('2024-03-01'),
        dateFin: new Date('2024-08-15'),
        budget: 85000,
        superficie: '40m²',
        photo: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
        photos: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop']
      }
    });

    const chantier3 = await db.user.create({
      data: {
        id: 'chantier-loft-003',
        nom: 'Loft Industriel',
        description: 'Aménagement d\'un loft de 120m² dans un ancien entrepôt. Style industriel avec mezzanine.',
        adresse: '15 Rue de l\'Industrie, 93400 Saint-Ouen',
        clientId: testClient.id,
        statut: 'TERMINE',
        progression: 100,
        dateDebut: new Date('2023-09-01'),
        dateFin: new Date('2024-01-30'),
        budget: 95000,
        superficie: '120m²',
        photo: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop'
      }
    });

    // ASSIGNATION DES ÉQUIPES
    await db.chantier.update({
      where: { id: chantier1.id },
      data: {
        assignees: {
          connect: [
            { id: ouvrier1.id },
            { id: ouvrier2.id },
            { id: testCommercial.id }
          ]
        }
      }
    });

    await db.chantier.update({
      where: { id: chantier2.id },
      data: {
        assignees: {
          connect: [
            { id: ouvrier1.id },
            { id: testCommercial.id }
          ]
        }
      }
    });

    console.log('✅ 3 chantiers créés avec équipes assignées');

    // ========================================
    // MESSAGES RÉALISTES POUR CONVERSATIONS
    // ========================================
    console.log('💬 Création des messages...');

    // Messages pour Chantier 1 (Villa Moderne)
    const messagesVilla = [
      {
        expediteurId: testClient.id,
        message: 'Bonjour ! J\'espère que tout se passe bien pour le chantier. Pouvez-vous me donner des nouvelles de l\'avancement ?',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48) // Il y a 48h
      },
      {
        expediteurId: ouvrier1.id,
        message: 'Bonjour Madame Dubois ! Tout avance très bien. Nous avons terminé la démolition et commencé le gros œuvre. Voici une photo de l\'état actuel.',
        photos: ['https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop'],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36) // Il y a 36h
      },
      {
        expediteurId: testClient.id,
        message: 'Excellent ! Le résultat me plaît beaucoup. Quand pensez-vous commencer la phase électricité ?',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // Il y a 24h
      },
      {
        expediteurId: ouvrier2.id,
        message: 'Bonjour ! Pour ma part, je peux commencer l\'installation électrique dès lundi prochain. Les plans sont validés et les matériaux commandés.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18) // Il y a 18h
      },
      {
        expediteurId: testCommercial.id,
        message: 'Bonjour à tous ! Je confirme que nous respectons bien le planning. Les prochaines étapes : électricité la semaine prochaine, puis plomberie.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12) // Il y a 12h
      },
      {
        expediteurId: testClient.id,
        message: 'Parfait ! Y a-t-il quelque chose de spécial à prévoir de mon côté pour faciliter les travaux ?',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8) // Il y a 8h
      },
      {
        expediteurId: ouvrier2.id,
        message: 'Si possible, libérer l\'accès au tableau électrique et prévoir un point d\'eau à proximité. Je passerai vers 9h lundi.',
        lu: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4) // Il y a 4h
      },
      {
        expediteurId: testClient.id,
        message: 'Noté ! Je serai présente lundi matin pour vous ouvrir. Merci pour ces informations détaillées.',
        lu: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // Il y a 2h
      }
    ];

    for (const msgData of messagesVilla) {
      await db.message.create({
        data: {
          expediteurId: msgData.expediteurId,
          chantierId: chantier1.id,
          message: msgData.message,
          photos: msgData.photos || [],
          typeMessage: 'CHANTIER',
          lu: msgData.lu !== false,
          createdAt: msgData.createdAt
        }
      });
    }

    // Messages pour Chantier 2 (Extension)
    const messagesExtension = [
      {
        expediteurId: client2.id,
        message: 'Bonjour ! J\'ai hâte que les travaux commencent. Tout est prêt de notre côté.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72) // Il y a 72h
      },
      {
        expediteurId: testCommercial.id,
        message: 'Bonjour Monsieur Moreau ! Nous commençons la semaine prochaine comme prévu. L\'équipe passera lundi pour la préparation du terrain.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48) // Il y a 48h
      },
      {
        expediteurId: ouvrier1.id,
        message: 'Bonjour ! Je passerai lundi matin avec l\'équipe pour commencer les fondations. Pouvez-vous nous confirmer l\'accès au jardin ?',
        lu: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6) // Il y a 6h
      }
    ];

    for (const msgData of messagesExtension) {
      await db.message.create({
        data: {
          expediteurId: msgData.expediteurId,
          chantierId: chantier2.id,
          message: msgData.message,
          photos: msgData.photos || [],
          typeMessage: 'CHANTIER',
          lu: msgData.lu !== false,
          createdAt: msgData.createdAt
        }
      });
    }

    // Messages directs entre équipes
    await db.message.create({
      data: {
        expediteurId: testCommercial.id,
        destinataireId: ouvrier1.id,
        message: 'Salut Marc ! N\'oublie pas de prendre des photos de l\'avancement pour la villa moderne. Le client apprécie beaucoup.',
        typeMessage: 'DIRECT',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10) // Il y a 10h
      }
    });

    await db.message.create({
      data: {
        expediteurId: ouvrier1.id,
        destinataireId: testCommercial.id,
        message: 'Compris ! Je prends des photos à chaque étape importante. D\'ailleurs, on devrait terminer en avance sur ce chantier 👍',
        typeMessage: 'DIRECT',
        lu: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5) // Il y a 5h
      }
    });

    console.log('✅ Messages créés pour toutes les conversations');

    // ========================================
    // TIMELINE DES ÉVÉNEMENTS
    // ========================================
    console.log('📅 Création de la timeline...');

    await db.timelineEvent.create({
      data: {
        chantierId: chantier1.id,
        titre: 'Début des travaux',
        description: 'Démarrage officiel du chantier avec l\'équipe complète',
        date: new Date('2024-01-15'),
        type: 'DEBUT',
        createdById: testCommercial.id
      }
    });

    await db.timelineEvent.create({
      data: {
        chantierId: chantier1.id,
        titre: 'Démolition terminée',
        description: 'Fin de la phase de démolition, début du gros œuvre',
        date: new Date('2024-02-28'),
        type: 'ETAPE',
        createdById: ouvrier1.id
      }
    });

    await db.timelineEvent.create({
      data: {
        chantierId: chantier1.id,
        titre: 'Gros œuvre en cours',
        description: 'Avancement à 65% - Dans les temps',
        date: new Date(),
        type: 'ETAPE',
        createdById: ouvrier1.id
      }
    });

    console.log('✅ Timeline créée');

    // ========================================
    // COMMENTAIRES
    // ========================================
    console.log('📝 Création des commentaires...');

    await db.comment.create({
      data: {
        chantierId: chantier1.id,
        auteurId: testClient.id,
        message: 'Très satisfaite de l\'avancement ! L\'équipe est professionnelle et respecte les délais.',
        photos: []
      }
    });

    await db.comment.create({
      data: {
        chantierId: chantier1.id,
        auteurId: ouvrier1.id,
        message: 'Merci ! On fait de notre mieux pour respecter la qualité et les délais. Prochaine étape : l\'électricité avec Sophie.',
        photos: []
      }
    });

    console.log('✅ Commentaires créés');

    // ========================================
    // NOTIFICATIONS
    // ========================================
    console.log('🔔 Création des notifications...');

    await db.notification.create({
      data: {
        userId: testClient.id,
        titre: 'Nouveau message',
        message: 'Vous avez reçu un nouveau message de Sophie Électricienne',
        type: 'INFO',
        lu: false,
        lien: '/dashboard/messages'
      }
    });

    await db.notification.create({
      data: {
        userId: testClient.id,
        titre: 'Avancement du chantier',
        message: 'Votre chantier "Rénovation Villa Moderne" a progressé à 65%',
        type: 'SUCCESS',
        lu: false,
        lien: '/dashboard/chantiers/chantier-villa-001'
      }
    });

    console.log('✅ Notifications créées');

    // ========================================
    // RÉSUMÉ FINAL
    // ========================================
    console.log('\n🎉 INITIALISATION TERMINÉE AVEC SUCCÈS !');
    console.log('==========================================');
    console.log(`✅ ${await db.user.count()} utilisateurs créés`);
    console.log(`✅ ${await db.chantier.count()} chantiers créés`);
    console.log(`✅ ${await db.message.count()} messages créés`);
    console.log(`✅ ${await db.timelineEvent.count()} événements timeline`);
    console.log(`✅ ${await db.comment.count()} commentaires`);
    console.log(`✅ ${await db.notification.count()} notifications`);
    
    console.log('\n🔥 DONNÉES COHÉRENTES AVEC LE CODE :');
    console.log('- test-client-123 ✅');
    console.log('- test-commercial-456 ✅');
    console.log('- test-admin-789 ✅');
    console.log('- Chantiers avec vraies relations ✅');
    console.log('- Messages non lus pour tests ✅');
    console.log('- Timeline complète ✅');
    
    console.log('\n🚀 L\'APPLICATION EST MAINTENANT PRÊTE !');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('❌ ÉCHEC DE L\'INITIALISATION:', e);
    process.exit(1);
  });
