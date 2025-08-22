#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 🔍 SCRIPT D'ANALYSE CHANTIERPRO - VERSION RÉSUMÉ
 * Génère un résumé digestible + fichiers critiques séparés
 */

class ChantierProAuditor {
  constructor() {
    this.projectRoot = process.cwd();
    this.essentialReport = {
      timestamp: new Date().toISOString(),
      summary: {},
      criticalFiles: {},
      styleAnalysis: {},
      recommendations: [],
      nextSteps: []
    };
  }

  // 🎯 Analyse ESSENTIELLE uniquement
  async analyzeEssentials() {
    console.log('🎯 Analyse des éléments essentiels...\n');
    
    // 1. Configurations critiques
    await this.analyzeCriticalConfigs();
    
    // 2. Pages prioritaires 
    await this.analyzePriorityPages();
    
    // 3. Composants UI principaux
    await this.analyzeMainComponents();
    
    // 4. Style inconsistencies
    await this.analyzeStyleInconsistencies();
    
    // 5. Structure projet
    await this.analyzeProjectType();
  }

  // ⚙️ Configurations critiques SEULEMENT
  async analyzeCriticalConfigs() {
    console.log('⚙️ Vérification des configurations critiques...');
    
    const criticalConfigs = [
      { file: 'tailwind.config.js', priority: 'CRITICAL' },
      { file: 'tailwind.config.ts', priority: 'CRITICAL' },
      { file: 'package.json', priority: 'HIGH' },
      { file: 'app/globals.css', priority: 'HIGH' },
      { file: 'styles/globals.css', priority: 'HIGH' }
    ];

    this.essentialReport.criticalFiles = {};
    
    for (const config of criticalConfigs) {
      const filePath = path.join(this.projectRoot, config.file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Sauvegarder dans fichier séparé si > 500 lignes
        if (content.split('\n').length > 500) {
          const outputPath = `audit-${config.file.replace(/[\/\\]/g, '-')}`;
          fs.writeFileSync(outputPath, content);
          console.log(`  ✅ ${config.file} → Sauvé dans ${outputPath}`);
          
          this.essentialReport.criticalFiles[config.file] = {
            status: 'found',
            size: content.length,
            lines: content.split('\n').length,
            savedTo: outputPath,
            preview: content.slice(0, 500) + '...'
          };
        } else {
          console.log(`  ✅ ${config.file} → Inclus dans le rapport`);
          this.essentialReport.criticalFiles[config.file] = {
            status: 'found',
            size: content.length,
            lines: content.split('\n').length,
            content: content
          };
        }
      } else {
        console.log(`  ❌ ${config.file} → MANQUANT`);
        this.essentialReport.criticalFiles[config.file] = {
          status: 'missing',
          priority: config.priority
        };
      }
    }
  }

  // 📄 Pages prioritaires SEULEMENT
  async analyzePriorityPages() {
    console.log('\n📄 Recherche des pages prioritaires...');
    
    const priorityPages = [
      'app/dashboard/page.tsx',
      'app/dashboard/page.js', 
      'pages/dashboard.tsx',
      'pages/dashboard.js',
      'app/layout.tsx',
      'app/layout.js'
    ];

    for (const pagePath of priorityPages) {
      const fullPath = path.join(this.projectRoot, pagePath);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        console.log(`  ✅ ${pagePath} → Trouvée (${content.split('\n').length} lignes)`);
        
        // Analyse rapide du contenu
        const analysis = {
          path: pagePath,
          lines: content.split('\n').length,
          hasLayout: content.includes('Layout'),
          hasTailwind: /className=["'][^"']*/.test(content),
          components: this.extractComponentNames(content),
          mainClasses: this.extractMainClasses(content),
          imports: this.extractImports(content).slice(0, 10) // Limite à 10
        };
        
        // Sauvegarder contenu dans fichier séparé
        const outputPath = `audit-${pagePath.replace(/[\/\\]/g, '-')}`;
        fs.writeFileSync(outputPath, content);
        analysis.savedTo = outputPath;
        
        this.essentialReport.criticalFiles[pagePath] = analysis;
        break; // Prendre seulement la première page dashboard trouvée
      }
    }
  }

  // 🧩 Composants principaux SEULEMENT
  async analyzeMainComponents() {
    console.log('\n🧩 Recherche des composants UI principaux...');
    
    const componentPatterns = [
      '**/Button*',
      '**/Card*', 
      '**/Layout*',
      '**/Sidebar*',
      '**/Header*'
    ];

    const foundComponents = [];
    
    // Chercher dans les dossiers probables
    const searchDirs = ['components', 'app/components', 'src/components'];
    
    for (const searchDir of searchDirs) {
      const fullDir = path.join(this.projectRoot, searchDir);
      if (fs.existsSync(fullDir)) {
        console.log(`  📂 Recherche dans ${searchDir}...`);
        const components = this.findComponentsInDir(fullDir, searchDir);
        foundComponents.push(...components);
      }
    }

    // Garder seulement les 5 plus importants
    this.essentialReport.summary.mainComponents = foundComponents.slice(0, 5);
    
    foundComponents.slice(0, 3).forEach(comp => {
      console.log(`  ✅ ${comp.name} → ${comp.type}`);
    });
  }

  // 🎨 Analyse des inconsistances de style
  async analyzeStyleInconsistencies() {
    console.log('\n🎨 Détection des inconsistances de style...');
    
    const stylePatterns = {
      colors: new Set(),
      buttons: new Set(),
      spacing: new Set()
    };

    // Scanner quelques fichiers clés
    const filesToScan = this.findFilesRecursive(this.projectRoot, /\.(tsx|jsx)$/, 3)
      .slice(0, 20); // Limiter à 20 fichiers max

    filesToScan.forEach(filePath => {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Couleurs
        const colorMatches = content.match(/(?:text-|bg-|border-)(gray|blue|green|red|orange)-\d+/g) || [];
        colorMatches.forEach(color => stylePatterns.colors.add(color));
        
        // Boutons  
        const buttonMatches = content.match(/btn[\w-]*/g) || [];
        buttonMatches.forEach(btn => stylePatterns.buttons.add(btn));
        
        // Classes communes
        const commonClasses = content.match(/(?:p|m)[xy]?-\d+|rounded-\w+|shadow-\w+/g) || [];
        commonClasses.slice(0, 10).forEach(cls => stylePatterns.spacing.add(cls));
        
      } catch (error) {
        // Ignorer les erreurs
      }
    });

    this.essentialReport.styleAnalysis = {
      totalColorsFound: stylePatterns.colors.size,
      colorVariations: Array.from(stylePatterns.colors).slice(0, 20),
      buttonStyles: Array.from(stylePatterns.buttons),
      commonSpacing: Array.from(stylePatterns.spacing).slice(0, 15),
      filesScanned: filesToScan.length
    };

    console.log(`  📊 ${stylePatterns.colors.size} variations de couleurs détectées`);
    console.log(`  📊 ${stylePatterns.buttons.size} styles de boutons détectés`);
  }

  // 📂 Type de projet (Next.js, structure)
  async analyzeProjectType() {
    console.log('\n📂 Détection du type de projet...');
    
    const hasAppDir = fs.existsSync(path.join(this.projectRoot, 'app'));
    const hasPagesDir = fs.existsSync(path.join(this.projectRoot, 'pages'));
    const hasNextConfig = fs.existsSync(path.join(this.projectRoot, 'next.config.js')) || 
                         fs.existsSync(path.join(this.projectRoot, 'next.config.ts'));
    
    let projectType = 'Unknown';
    if (hasAppDir && hasNextConfig) projectType = 'Next.js 13+ (App Router)';
    else if (hasPagesDir && hasNextConfig) projectType = 'Next.js (Pages Router)';
    else if (hasAppDir) projectType = 'React App (App Structure)';
    
    this.essentialReport.summary = {
      projectType,
      hasAppDir,
      hasPagesDir,
      hasNextConfig,
      hasTailwind: this.essentialReport.criticalFiles['tailwind.config.js']?.status === 'found' ||
                   this.essentialReport.criticalFiles['tailwind.config.ts']?.status === 'found'
    };
    
    console.log(`  ✅ Type détecté: ${projectType}`);
  }

  // 🎯 Générer recommandations ciblées
  generateRecommendations() {
    console.log('\n💡 Génération des recommandations...');
    
    const recs = [];
    
    // Check Tailwind
    if (!this.essentialReport.summary.hasTailwind) {
      recs.push({
        priority: 'CRITICAL',
        action: 'Installer et configurer Tailwind CSS',
        reason: 'Aucun fichier tailwind.config.js trouvé'
      });
    } else {
      recs.push({
        priority: 'HIGH', 
        action: 'Mettre à jour tailwind.config.js avec la nouvelle palette',
        reason: 'Uniformisation des couleurs nécessaire'
      });
    }

    // Check pages
    const dashboardFound = Object.keys(this.essentialReport.criticalFiles)
      .some(file => file.includes('dashboard'));
    
    if (dashboardFound) {
      recs.push({
        priority: 'HIGH',
        action: 'Commencer par la migration de la page Dashboard',
        reason: 'Page principale identifiée et prête pour migration'
      });
    } else {
      recs.push({
        priority: 'MEDIUM',
        action: 'Localiser la page Dashboard principale',
        reason: 'Page dashboard non trouvée dans les emplacements standards'
      });
    }

    // Check style inconsistencies
    if (this.essentialReport.styleAnalysis.totalColorsFound > 10) {
      recs.push({
        priority: 'MEDIUM',
        action: `Standardiser les ${this.essentialReport.styleAnalysis.totalColorsFound} variations de couleurs`,
        reason: 'Trop de variations détectées'
      });
    }

    this.essentialReport.recommendations = recs;
    
    // Next steps
    this.essentialReport.nextSteps = [
      'Partager ce rapport avec l\'agent d\'uniformisation',
      'Commencer par la mise à jour de tailwind.config.js',
      'Migrer la page Dashboard en premier',
      'Standardiser les composants UI de base',
      'Tester chaque étape avant de continuer'
    ];

    recs.forEach((rec, i) => {
      console.log(`  ${i + 1}. [${rec.priority}] ${rec.action}`);
    });
  }

  // 📊 Utilitaires d'extraction
  extractComponentNames(content) {
    const matches = content.match(/<[A-Z][a-zA-Z0-9]*(?:\s|\/|>)/g) || [];
    return [...new Set(matches.map(m => m.replace(/[<\s\/>]/g, '')))].slice(0, 10);
  }

  extractMainClasses(content) {
    const classMatches = content.match(/className=["'][^"']*["']/g) || [];
    const allClasses = [];
    classMatches.forEach(match => {
      const classes = match.match(/["']([^"']*)["']/)[1].split(/\s+/);
      allClasses.push(...classes.filter(cls => cls.length > 2));
    });
    return [...new Set(allClasses)].slice(0, 20);
  }

  extractImports(content) {
    const importMatches = content.match(/import.*from.*['"][^'"]*['"]/g) || [];
    return importMatches.map(imp => imp.trim());
  }

  findComponentsInDir(dirPath, relativePath) {
    const components = [];
    try {
      const files = fs.readdirSync(dirPath, { withFileTypes: true });
      
      files.forEach(file => {
        if (file.isFile() && file.name.match(/\.(tsx|jsx)$/)) {
          const componentName = file.name.replace(/\.(tsx|jsx)$/, '');
          let type = 'component';
          
          if (componentName.toLowerCase().includes('button')) type = 'button';
          else if (componentName.toLowerCase().includes('card')) type = 'card';
          else if (componentName.toLowerCase().includes('layout')) type = 'layout';
          
          components.push({
            name: componentName,
            path: path.join(relativePath, file.name),
            type
          });
        }
      });
    } catch (error) {
      // Ignorer les erreurs
    }
    
    return components;
  }

  findFilesRecursive(dirPath, pattern, maxDepth = 3, currentDepth = 0) {
    if (currentDepth >= maxDepth) return [];
    
    let files = [];
    try {
      const items = fs.readdirSync(dirPath, { withFileTypes: true });
      
      items.forEach(item => {
        if (item.name.startsWith('.') || item.name === 'node_modules') return;
        
        const itemPath = path.join(dirPath, item.name);
        
        if (item.isDirectory()) {
          files.push(...this.findFilesRecursive(itemPath, pattern, maxDepth, currentDepth + 1));
        } else if (pattern.test(item.name)) {
          files.push(itemPath);
        }
      });
    } catch (error) {
      // Ignorer les erreurs
    }
    
    return files;
  }

  // 💾 Générer rapport CONCIS
  generateConciseReport() {
    console.log('\n📋 Génération du rapport concis...');
    
    this.generateRecommendations();
    
    // Sauvegarder le rapport concis
    const reportPath = path.join(this.projectRoot, 'chantierpro-resume.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.essentialReport, null, 2));
    
    console.log(`✅ Rapport concis sauvegardé: chantierpro-resume.json`);
    
    // Afficher le résumé
    this.displayConciseSummary();
    
    return this.essentialReport;
  }

  displayConciseSummary() {
    console.log('\n🎯 === RÉSUMÉ CONCIS CHANTIERPRO ===');
    console.log(`📂 Projet: ${this.essentialReport.summary.projectType}`);
    console.log(`⚙️  Tailwind: ${this.essentialReport.summary.hasTailwind ? '✅ Configuré' : '❌ Manquant'}`);
    
    const pagesFound = Object.keys(this.essentialReport.criticalFiles)
      .filter(f => f.includes('page.') || f.includes('layout.')).length;
    console.log(`📄 Pages critiques: ${pagesFound} trouvées`);
    
    console.log(`🎨 Variations couleurs: ${this.essentialReport.styleAnalysis.totalColorsFound}`);
    console.log(`🧩 Composants principaux: ${this.essentialReport.summary.mainComponents?.length || 0}`);
    
    console.log('\n💡 ACTIONS PRIORITAIRES:');
    this.essentialReport.recommendations.slice(0, 3).forEach((rec, i) => {
      console.log(`  ${i + 1}. [${rec.priority}] ${rec.action}`);
    });

    console.log('\n📁 FICHIERS GÉNÉRÉS:');
    Object.entries(this.essentialReport.criticalFiles).forEach(([file, info]) => {
      if (info.savedTo) {
        console.log(`  📄 ${info.savedTo} (${file})`);
      }
    });
    
    console.log('\n🚀 FICHIER À PARTAGER: chantierpro-resume.json');
    console.log('📧 Ce fichier fait < 500 lignes et contient tout ce qu\'il faut !\n');
  }

  // 🚀 Exécution principale
  async run() {
    console.log('🎯 === AUDIT CHANTIERPRO CONCIS - DÉBUT ===\n');
    
    try {
      await this.analyzeEssentials();
      return this.generateConciseReport();
    } catch (error) {
      console.error('❌ Erreur durant l\'audit:', error);
      throw error;
    }
  }
}

// 🚀 Exécution si appelé directement
if (require.main === module) {
  const auditor = new ChantierProAuditor();
  auditor.run().then(() => {
    console.log('✅ Audit concis terminé avec succès !');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Échec de l\'audit:', error);
    process.exit(1);
  });
}

module.exports = ChantierProAuditor;

/*
🎯 VERSION OPTIMISÉE - RÉSUMÉ INTELLIGENT

📊 CE QUE GÉNÈRE LE SCRIPT:
✅ chantierpro-resume.json (< 500 lignes, facile à lire)
✅ audit-tailwind.config.js (si trouvé)  
✅ audit-app-dashboard-page.tsx (si trouvé)
✅ audit-package.json (si trouvé)

🎯 CONTENU DU RÉSUMÉ:
- Type de projet détecté
- Configurations critiques (trouvées/manquantes)
- 1-2 pages principales analysées
- Top 5 composants UI identifiés
- Inconsistances de style principales
- 3-5 recommandations prioritaires
- Plan d'action en 5 étapes

📧 PARTAGE FACILE:
Le fichier chantierpro-resume.json fait < 500 lignes
+ quelques fichiers séparés si nécessaire

🚀 UTILISATION:
1. node audit-chantierpro.js
2. Partage chantierpro-resume.json
3. C'est tout ! 🎯
*/