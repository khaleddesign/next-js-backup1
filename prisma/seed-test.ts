import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function seedTestData() {
  console.log('🌱 Création des données de test...');
  
  try {
    // 1. Créer des utilisateurs de test
    console.log('👥 Création des utilisateurs...');
    
    const client1 = await db.user.upsert({
      where: { email: 'marie.dubois@test.com' },
      update: {},
      create: {
        id: 'client-1',
        name: 'Marie Dubois',
        email: 'marie.dubois@test.com',
        role: 'CLIENT',
        company: 'Dubois Immobilier',
        phone: '06 12 34 56 78'
      }
    });

    const ouvrier1 = await db.user.upsert({
      where: { email: 'pierre.mason@test.com' },
      update: {},
      create: {
        id: 'ouvrier-1',
        name: 'Pierre Maçon',
        email: 'pierre.mason@test.com',
        role: 'ARTISAN',
        company: 'BTP Expert',
        phone: '06 87 65 43 21'
      }
    });

    const ouvrier2 = await db.user.upsert({
      where: { email: 'julie.electricienne@test.com' },
      update: {},
      create: {
        id: 'ouvrier-2',
        name: 'Julie Électricienne',
        email: 'julie.electricienne@test.com',
        role: 'ARTISAN',
        company: 'Électro Pro',
        phone: '06 98 76 54 32'
      }
    });

    console.log(`✅ ${3} utilisateurs créés`);

    // 2. Créer des chantiers
    console.log('🏗️ Création des chantiers...');
    
    const chantier1 = await db.chantier.upsert({
      where: { id: 'chantier-1' },
      update: {},
      create: {
        id: 'chantier-1',
        nom: 'Rénovation Villa Moderne',
        description: 'Rénovation complète d\'une villa de 200m² avec extension moderne et piscine',
        adresse: '15 Avenue des Pins, 06400 Cannes',
        clientId: client1.id,
        dateDebut: new Date('2024-03-15'),
        dateFin: new Date('2024-08-30'),
        budget: 120000,
        superficie: '200m²',
        statut: 'EN_COURS',
        progression: 65,
        photo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop'
      }
    });

    const chantier2 = await db.chantier.upsert({
      where: { id: 'chantier-2' },
      update: {},
      create: {
        id: 'chantier-2',
        nom: 'Extension Maison Familiale',
        description: 'Construction d\'une maison BBC avec matériaux biosourcés et panneaux solaires',
        adresse: 'Lot 12 Les Jardins Verts, 34000 Montpellier',
        clientId: client1.id,
        dateDebut: new Date('2024-01-05'),
        dateFin: new Date('2024-12-15'),
        budget: 280000,
        superficie: '120m²',
        statut: 'PLANIFIE',
        progression: 0,
        photo: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop'
      }
    });

    // Assigner les ouvriers aux chantiers
    await db.chantier.update({
      where: { id: chantier1.id },
      data: {
        assignees: {
          connect: [
            { id: ouvrier1.id },
            { id: ouvrier2.id }
          ]
        }
      }
    });

    await db.chantier.update({
      where: { id: chantier2.id },
      data: {
        assignees: {
          connect: [
            { id: ouvrier2.id }
          ]
        }
      }
    });

    console.log(`✅ ${2} chantiers créés avec assignations`);

    // 3. Créer des messages
    console.log('💬 Création des messages...');
    
    const messages = [
      {
        expediteurId: client1.id,
        chantierId: chantier1.id,
        message: 'Bonjour ! J\'espère que tout se passe bien pour le chantier. Pouvez-vous me donner des nouvelles ?',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48) // Il y a 48h
      },
      {
        expediteurId: ouvrier1.id,
        chantierId: chantier1.id,
        message: 'Bonjour Marie ! Tout avance bien. Nous avons terminé la première phase comme prévu. Voici une photo de l\'avancement.',
        photos: ['https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400&h=300&fit=crop'],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36) // Il y a 36h
      },
      {
        expediteurId: client1.id,
        chantierId: chantier1.id,
        message: 'Excellent ! Le résultat me plaît beaucoup. Quand pensez-vous commencer la phase suivante ?',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // Il y a 24h
      },
      {
        expediteurId: ouvrier1.id,
        chantierId: chantier1.id,
        message: 'Nous devrions pouvoir commencer lundi prochain. Les matériaux sont commandés et arriveront vendredi.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18) // Il y a 18h
      },
      {
        expediteurId: ouvrier2.id,
        chantierId: chantier1.id,
        message: 'Bonjour ! Pour ma part, je passerai mardi pour l\'installation électrique. Pensez à libérer l\'accès au tableau.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8) // Il y a 8h
      },
      {
        expediteurId: client1.id,
        chantierId: chantier1.id,
        message: 'Parfait ! Je serai présente mardi matin pour vous ouvrir. Vers quelle heure ?',
        lu: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4) // Il y a 4h
      },
      {
        expediteurId: ouvrier2.id,
        chantierId: chantier1.id,
        message: 'Vers 9h ce serait parfait. Merci !',
        lu: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // Il y a 2h
      },
      // Messages pour le chantier 2
      {
        expediteurId: client1.id,
        chantierId: chantier2.id,
        message: 'Bonjour Julie ! Quand pouvons-nous prévoir le début des travaux électriques ?',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12) // Il y a 12h
      },
      {
        expediteurId: ouvrier2.id,
        chantierId: chantier2.id,
        message: 'Bonjour ! Dès que le gros œuvre sera terminé, nous pourrons commencer. Je pense dans 2-3 semaines.',
        lu: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6) // Il y a 6h
      }
    ];

    for (const msgData of messages) {
      await db.message.create({
        data: {
          expediteurId: msgData.expediteurId,
          chantierId: msgData.chantierId,
          message: msgData.message,
          photos: msgData.photos || [],
          typeMessage: 'CHANTIER',
          lu: msgData.lu !== false,
          createdAt: msgData.createdAt
        }
      });
    }

    console.log(`✅ ${messages.length} messages créés`);

    // 4. Mettre à jour les dates des chantiers
    await db.chantier.updateMany({
      data: { updatedAt: new Date() }
    });

    console.log('📊 Statistiques finales :');
    
    const stats = await Promise.all([
      db.user.count(),
      db.chantier.count(),
      db.message.count()
    ]);

    console.log(`   - Utilisateurs: ${stats[0]}`);
    console.log(`   - Chantiers: ${stats[1]}`);
    console.log(`   - Messages: ${stats[2]}`);
    
    console.log('🎉 Données de test créées avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des données:', error);
  } finally {
    await db.$disconnect();
  }
}

seedTestData();