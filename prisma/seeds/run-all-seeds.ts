import { PrismaClient } from '@prisma/client';
import seedDevis from './devis-seed';

const db = new PrismaClient();

async function runAllSeeds() {
  console.log('🚀 LANCEMENT DE TOUS LES SEEDS...\n');

  try {
    console.log('🔄 Régénération du client Prisma...');
    
    console.log('🌱 Lancement du seed Devis/Facturation...');
    await seedDevis();
    
    console.log('\n🎉 TOUS LES SEEDS TERMINÉS AVEC SUCCÈS !');
    
    const finalStats = await Promise.all([
      db.user.count(),
      db.chantier.count(),
      db.message.count(),
      db.devis.count(),
      db.ligneDevis.count()
    ]);

    console.log('\n📈 STATISTIQUES FINALES :');
    console.log('==========================================');
    console.log(`✅ Utilisateurs: ${finalStats[0]}`);
    console.log(`✅ Chantiers: ${finalStats[1]}`);
    console.log(`✅ Messages: ${finalStats[2]}`);
    console.log(`✅ Devis/Factures: ${finalStats[3]}`);
    console.log(`✅ Lignes de devis: ${finalStats[4]}`);
    console.log('\n🚀 CHANTIERPRO READY TO GO ! 💪');

  } catch (error) {
    console.error('❌ ERREUR LORS DES SEEDS:', error);
    throw error;
  } finally {
    await db.$disconnect();
  }
}

runAllSeeds()
  .catch((error) => {
    console.error('❌ ÉCHEC DES SEEDS:', error);
    process.exit(1);
  });
