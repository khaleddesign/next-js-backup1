const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestClient() {
  try {
    const client = await prisma.user.create({
      data: {
        id: 'test-client-123',
        name: 'Marie Dubois',
        email: 'marie.test@example.com',
        role: 'CLIENT',
        company: 'Dubois Immobilier'
      }
    });
    console.log('✅ Client de test créé avec ID:', client.id);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('✅ Client de test existe déjà avec ID: test-client-123');
    } else {
      console.error('❌ Erreur:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createTestClient();
