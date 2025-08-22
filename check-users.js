const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function checkUsers() {
  const users = await db.user.findMany({
    select: { email: true, password: true, role: true }
  });
  
  console.log('👥 Utilisateurs en base:');
  users.forEach(user => {
    console.log(`- ${user.email} (${user.role}) - Password: ${user.password ? 'Existe' : 'MANQUANT'}`);
  });
  
  await db.$disconnect();
}

checkUsers();
