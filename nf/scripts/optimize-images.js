#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🖼️  Script d\'optimisation des images ChantierPro\n');

// Fonction pour analyser et recommander des optimisations
function analyzeImages() {
  const publicDir = path.join(__dirname, '../public');
  const uploadsDir = path.join(publicDir, 'uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    console.log('❌ Dossier uploads non trouvé');
    return;
  }
  
  console.log('🔍 Analyse des images dans /public/uploads...\n');
  
  let totalSize = 0;
  let largeImages = [];
  let imageCount = 0;
  
  function scanDirectory(dir, relativePath = '') {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        scanDirectory(itemPath, path.join(relativePath, item));
      } else if (/\.(jpg|jpeg|png|gif|webp|avif)$/i.test(item)) {
        imageCount++;
        totalSize += stats.size;
        
        const sizeKB = stats.size / 1024;
        const sizeMB = sizeKB / 1024;
        const relativeFilePath = path.join(relativePath, item);
        
        if (stats.size > 1000000) { // Plus de 1MB
          largeImages.push({
            path: relativeFilePath,
            size: stats.size,
            sizeKB: sizeKB,
            sizeMB: sizeMB,
            severity: 'critical'
          });
        } else if (stats.size > 500000) { // Plus de 500KB
          largeImages.push({
            path: relativeFilePath,
            size: stats.size,
            sizeKB: sizeKB,
            sizeMB: sizeMB,
            severity: 'warning'
          });
        }
      }
    });
  }
  
  scanDirectory(uploadsDir);
  
  console.log(`📊 Résumé de l'analyse:`);
  console.log(`   • ${imageCount} images trouvées`);
  console.log(`   • Taille totale: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   • Taille moyenne: ${(totalSize / imageCount / 1024).toFixed(2)} KB par image\n`);
  
  if (largeImages.length > 0) {
    console.log(`⚠️  ${largeImages.length} images nécessitent une optimisation:\n`);
    
    largeImages
      .sort((a, b) => b.size - a.size)
      .forEach(img => {
        const icon = img.severity === 'critical' ? '🔴' : '🟡';
        console.log(`   ${icon} ${img.path}`);
        console.log(`      Taille: ${img.sizeMB.toFixed(2)} MB (${img.sizeKB.toFixed(0)} KB)`);
        console.log(`      Recommandation: ${getOptimizationRecommendation(img)}\n`);
      });
  } else {
    console.log('✅ Toutes les images sont optimisées!\n');
  }
  
  generateOptimizationScript(largeImages);
}

function getOptimizationRecommendation(img) {
  const ext = path.extname(img.path).toLowerCase();
  
  if (img.sizeMB > 5) {
    return 'Réduire drastiquement la qualité ou redimensionner';
  } else if (img.sizeMB > 2) {
    return 'Compresser avec une qualité de 70-80%';
  } else if (img.sizeMB > 1) {
    return 'Compresser avec une qualité de 80-85%';
  } else {
    return 'Compresser légèrement (qualité 85-90%)';
  }
}

function generateOptimizationScript(largeImages) {
  if (largeImages.length === 0) return;
  
  console.log('🛠️  Script d\'optimisation généré:\n');
  console.log('# Commandes pour optimiser les images avec ImageMagick:');
  console.log('# (Installez ImageMagick: apt-get install imagemagick)\n');
  
  largeImages.forEach(img => {
    const inputPath = `public/uploads/${img.path}`;
    const outputPath = `public/uploads/optimized_${img.path}`;
    const quality = img.sizeMB > 2 ? 75 : img.sizeMB > 1 ? 80 : 85;
    
    console.log(`# Optimiser ${img.path} (${img.sizeMB.toFixed(2)} MB)`);
    console.log(`convert "${inputPath}" -quality ${quality} -strip "${outputPath}"`);
    console.log('');
  });
  
  console.log('# Alternative avec des outils modernes:');
  console.log('# npm install -g @squoosh/cli');
  console.log('# squoosh-cli --webp \'{"quality":80}\' public/uploads/*.jpg');
  console.log('# squoosh-cli --avif \'{"quality":80}\' public/uploads/*.png\n');
  
  console.log('💡 Recommandations supplémentaires:');
  console.log('   • Utilisez Next.js Image component pour le lazy loading');
  console.log('   • Configurez des formats modernes (WebP, AVIF) dans next.config.js');
  console.log('   • Implémentez un système de redimensionnement automatique à l\'upload');
  console.log('   • Considérez un CDN pour servir les images optimisées');
}

// Fonction pour nettoyer les images de test/développement
function cleanupTestImages() {
  console.log('\n🧹 Nettoyage des images de test...\n');
  
  const uploadsDir = path.join(__dirname, '../public/uploads');
  if (!fs.existsSync(uploadsDir)) return;
  
  let deletedCount = 0;
  let freedSpace = 0;
  
  function scanAndClean(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        scanAndClean(itemPath);
      } else if (/\.(jpg|jpeg|png|gif)$/i.test(item)) {
        // Supprimer les images de test (très volumineuses et avec des noms génériques)
        if (stats.size > 3000000 && /^(test|sample|example|demo|placeholder)/i.test(item)) {
          console.log(`🗑️  Suppression de l'image de test: ${item} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
          fs.unlinkSync(itemPath);
          deletedCount++;
          freedSpace += stats.size;
        }
      }
    });
  }
  
  scanAndClean(uploadsDir);
  
  if (deletedCount > 0) {
    console.log(`✅ ${deletedCount} images de test supprimées`);
    console.log(`💾 Espace libéré: ${(freedSpace / 1024 / 1024).toFixed(2)} MB\n`);
  } else {
    console.log('ℹ️  Aucune image de test trouvée à supprimer\n');
  }
}

// Exécution du script
function main() {
  analyzeImages();
  cleanupTestImages();
  
  console.log('📋 Actions recommandées:');
  console.log('   1. Optimisez les images volumineuses avec les commandes générées');
  console.log('   2. Configurez Next.js Image dans vos composants');
  console.log('   3. Implémentez une validation de taille à l\'upload');
  console.log('   4. Considérez un service de compression automatique');
}

main();

