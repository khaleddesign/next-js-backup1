import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function seedMessages() {
  console.log('Création des données test Messages...');

  try {
    const chantiers = await db.chantier.findMany({
      include: { client: true, assignees: true }
    });

    if (chantiers.length === 0) {
      console.log('Aucun chantier trouvé. Veuillez d abord créer des chantiers.');
      return;
    }

    for (const chantier of chantiers) {
      console.log(`Création des messages pour "${chantier.nom}"`);

      const messagesData = [
        {
          expediteurId: chantier.client.id,
          message: `Bonjour ! J'espère que tout se passe bien pour le chantier "${chantier.nom}". Pouvez-vous me donner des nouvelles ?`,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48)
        },
        {
          expediteurId: chantier.assignees[0]?.id || chantier.client.id,
          message: "Bonjour ! Tout avance bien. Nous avons terminé la première phase comme prévu. Voici une photo de l'avancement.",
          photos: [
            "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=400&h=300&fit=crop"
          ],
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36)
        },
        {
          expediteurId: chantier.client.id,
          message: "Excellent ! Le résultat me plaît beaucoup. Quand pensez-vous commencer la phase suivante ?",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
        },
        {
          expediteurId: chantier.assignees[0]?.id || chantier.client.id,
          message: "Nous devrions pouvoir commencer lundi prochain. Les matériaux sont commandés et arriveront vendredi.",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18)
        },
        {
          expediteurId: chantier.client.id,
          message: "Parfait ! Merci pour ces informations. Y a-t-il quelque chose de spécial à prévoir de mon côté ?",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12)
        },
        {
          expediteurId: chantier.assignees[1]?.id || chantier.assignees[0]?.id || chantier.client.id,
          message: "Bonjour ! Pour ma part, je passerai mardi pour l'installation électrique. Pensez à libérer l'accès au tableau.",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8)
        },
        {
          expediteurId: chantier.client.id,
          message: "Noté ! Je serai présent mardi matin pour vous ouvrir. Vers quelle heure ?",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4)
        },
        {
          expediteurId: chantier.assignees[1]?.id || chantier.assignees[0]?.id || chantier.client.id,
          message: "Vers 9h ce serait parfait. Merci !",
          lu: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
        }
      ];

      for (const messageData of messagesData) {
        await db.message.create({
          data: {
            expediteurId: messageData.expediteurId,
            chantierId: chantier.id,
            message: messageData.message,
            photos: messageData.photos || [],
            typeMessage: 'CHANTIER',
            lu: messageData.lu !== false,
            createdAt: messageData.createdAt
          }
        });
      }

      await db.chantier.update({
        where: { id: chantier.id },
        data: { updatedAt: new Date() }
      });
    }

    const users = await db.user.findMany();
    
    if (users.length >= 2) {
      console.log('Création de messages directs...');
      
      await db.message.create({
        data: {
          expediteurId: users[0].id,
          destinataireId: users[1].id,
          message: "Salut ! Tu as vu les dernières photos du chantier Villa Moderne ? Le client a l'air très satisfait !",
          typeMessage: 'DIRECT',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6)
        }
      });

      await db.message.create({
        data: {
          expediteurId: users[1].id,
          destinataireId: users[0].id,
          message: "Oui ! Excellent travail. On devrait terminer dans les temps. 👍",
          typeMessage: 'DIRECT',
          lu: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3)
        }
      });
    }

    console.log('Messages créés avec succès !');

    const totalMessages = await db.message.count();
    const messagesByType = await db.message.groupBy({
      by: ['typeMessage'],
      _count: { id: true }
    });

    console.log(`Total messages: ${totalMessages}`);
    messagesByType.forEach(stat => {
      console.log(`   - ${stat.typeMessage}: ${stat._count.id} messages`);
    });

  } catch (error) {
    console.error('Erreur lors de la création des messages:', error);
  } finally {
    await db.$disconnect();
  }
}

seedMessages();
