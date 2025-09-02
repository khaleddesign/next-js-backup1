#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Audit de Performance ChantierPro\n');

// Analyse de la taille des bundles
function analyzeBundleSize() {
  console.log('📦 Analyse de la taille des bundles:');
  
  const buildDir = path.join(__dirname, '../.next');
  if (!fs.existsSync(buildDir)) {
    console.log('❌ Dossier .next non trouvé. Exécutez "npm run build" d\'abord.');
    return;
  }
  
  // Analyse des pages
  const pagesDir = path.join(buildDir, 'static/chunks/pages');
  if (fs.existsSync(pagesDir)) {
    const pages = fs.readdirSync(pagesDir);
    console.log(`   📄 ${pages.length} pages générées`);
    
    let totalSize = 0;
    pages.forEach(page => {
      const filePath = path.join(pagesDir, page);
      const stats = fs.statSync(filePath);
      totalSize += stats.size;
      if (stats.size > 100000) { // Plus de 100KB
        console.log(`   ⚠️  ${page}: ${(stats.size / 1024).toFixed(2)} KB (volumineux)`);
      }
    });
    
    console.log(`   📊 Taille totale des pages: ${(totalSize / 1024).toFixed(2)} KB`);
  }
  
  console.log('');
}

// Analyse des dépendances
function analyzeDependencies() {
  console.log('📚 Analyse des dépendances:');
  
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
  const dependencies = Object.keys(packageJson.dependencies || {});
  const devDependencies = Object.keys(packageJson.devDependencies || {});
  
  console.log(`   📦 ${dependencies.length} dépendances de production`);
  console.log(`   🛠️  ${devDependencies.length} dépendances de développement`);
  
  // Vérification des dépendances lourdes
  const heavyDeps = dependencies.filter(dep => 
    ['lodash', 'moment', 'axios', 'jquery'].includes(dep)
  );
  
  if (heavyDeps.length > 0) {
    console.log(`   ⚠️  Dépendances potentiellement lourdes: ${heavyDeps.join(', ')}`);
  }
  
  console.log('');
}

// Analyse des images
function analyzeImages() {
  console.log('🖼️  Analyse des images:');
  
  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    console.log('   ❌ Dossier public non trouvé');
    return;
  }
  
  function scanDirectory(dir, prefix = '') {
    const items = fs.readdirSync(dir);
    let imageCount = 0;
    let totalSize = 0;
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      
      if (stats.isDirectory()) {
        const subResult = scanDirectory(itemPath, prefix + item + '/');
        imageCount += subResult.count;
        totalSize += subResult.size;
      } else if (/\.(jpg|jpeg|png|gif|svg|webp|avif)$/i.test(item)) {
        imageCount++;
        totalSize += stats.size;
        
        if (stats.size > 500000) { // Plus de 500KB
          console.log(`   ⚠️  ${prefix}${item}: ${(stats.size / 1024).toFixed(2)} KB (très volumineux)`);
        } else if (stats.size > 200000) { // Plus de 200KB
          console.log(`   📸 ${prefix}${item}: ${(stats.size / 1024).toFixed(2)} KB (volumineux)`);
        }
      }
    });
    
    return { count: imageCount, size: totalSize };
  }
  
  const result = scanDirectory(publicDir);
  console.log(`   📊 ${result.count} images trouvées`);
  console.log(`   📊 Taille totale: ${(result.size / 1024 / 1024).toFixed(2)} MB`);
  
  console.log('');
}

// Analyse du code
function analyzeCode() {
  console.log('💻 Analyse du code:');
  
  const srcDirs = ['app', 'components', 'lib', 'hooks'];
  let totalFiles = 0;
  let totalLines = 0;
  let issues = [];
  
  function scanCodeDirectory(dir) {
    const fullPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullPath)) return;
    
    function scanFiles(dirPath) {
      const items = fs.readdirSync(dirPath);
      
      items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          scanFiles(itemPath);
        } else if (/\.(ts|tsx|js|jsx)$/.test(item)) {
          totalFiles++;
          const content = fs.readFileSync(itemPath, 'utf8');
          const lines = content.split('\n').length;
          totalLines += lines;
          
          // Vérifications de qualité
          if (lines > 500) {
            issues.push(`📄 ${itemPath.replace(__dirname + '/../', '')}: ${lines} lignes (très long)`);
          }
          
          if (content.includes('console.log') && !itemPath.includes('.test.')) {
            issues.push(`🐛 ${itemPath.replace(__dirname + '/../', '')}: contient console.log`);
          }
          
          if (content.includes('any') && itemPath.endsWith('.ts')) {
            const anyCount = (content.match(/:\s*any/g) || []).length;
            if (anyCount > 3) {
              issues.push(`⚠️  ${itemPath.replace(__dirname + '/../', '')}: ${anyCount} types 'any'`);
            }
          }
        }
      });
    }
    
    scanFiles(fullPath);
  }
  
  srcDirs.forEach(scanCodeDirectory);
  
  console.log(`   📊 ${totalFiles} fichiers analysés`);
  console.log(`   📊 ${totalLines} lignes de code au total`);
  console.log(`   📊 Moyenne: ${Math.round(totalLines / totalFiles)} lignes par fichier`);
  
  if (issues.length > 0) {
    console.log('\n   🔍 Problèmes détectés:');
    issues.slice(0, 10).forEach(issue => console.log(`      ${issue}`));
    if (issues.length > 10) {
      console.log(`      ... et ${issues.length - 10} autres problèmes`);
    }
  }
  
  console.log('');
}

// Recommandations
function generateRecommendations() {
  console.log('💡 Recommandations d\'optimisation:');
  
  const recommendations = [
    '🚀 Utilisez Next.js Image pour optimiser automatiquement les images',
    '📦 Considérez le lazy loading pour les composants lourds',
    '🗜️  Activez la compression gzip/brotli sur le serveur',
    '📱 Testez les performances sur mobile avec Lighthouse',
    '🔄 Implémentez un service worker pour la mise en cache',
    '📊 Surveillez les Core Web Vitals en production',
    '🎯 Utilisez React.memo() pour les composants qui re-rendent souvent',
    '📈 Configurez un monitoring de performance (ex: Sentry)',
  ];
  
  recommendations.forEach(rec => console.log(`   ${rec}`));
  
  console.log('');
}

// Exécution de l'audit
function runAudit() {
  const startTime = Date.now();
  
  analyzeBundleSize();
  analyzeDependencies();
  analyzeImages();
  analyzeCode();
  generateRecommendations();
  
  const endTime = Date.now();
  console.log(`✅ Audit terminé en ${endTime - startTime}ms`);
  console.log('\n📋 Pour un audit complet, exécutez également:');
  console.log('   • npm run build (pour analyser les bundles)');
  console.log('   • npm run lighthouse (si configuré)');
  console.log('   • npm run test (pour les tests)');
}

runAudit();

