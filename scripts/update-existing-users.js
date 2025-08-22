const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

async function updateExistingUsers() {
  try {
    const users = [
      { email: 'marie.martin@chantierpro.fr', password: 'commercial123' },
      { email: 'jean.dupont@chantierpro.fr', password: 'admin123' }
    ];

    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      await db.user.upsert({
        where: { email: userData.email },
        update: { password: hashedPassword },
        create: {
          name: userData.email === 'marie.martin@chantierpro.fr' ? 'Marie Martin' : 'Jean Dupont',
          email: userData.email,
          password: hashedPassword,
          role: userData.email === 'marie.martin@chantierpro.fr' ? 'COMMERCIAL' : 'ADMIN',
          company: 'ChantierPro'
        }
      });
    }

    console.log('✅ Utilisateurs mis à jour avec succès');
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await db.$disconnect();
  }
}

updateExistingUsers();
