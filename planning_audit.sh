#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 🔍 SCRIPT D'ANALYSE CHANTIERPRO
 * Collecte toutes les données nécessaires pour l'uniformisation du design
 */

class ChantierProAuditor {
  constructor() {
    this.projectRoot = process.cwd();
    this.report = {
      timestamp: new Date().toISOString(),
      projectStructure: {},
      configurations: {},
      components: {},
      pages: {},
      styles: {},
      issues: [],
      recommendations: []
    };
  }

  // 📁 Analyser la structure du projet
  analyzeProjectStructure() {
    console.log('🔍 Analyse de la structure du projet...');
    
    const structure = this.getDirectoryStructure(this.projectRoot, 3);
    this.report.projectStructure = structure;
    
    // Vérifier les dossiers critiques
    const criticalFolders = ['app', 'pages', 'components', 'styles', 'public'];
    criticalFolders.forEach(folder => {
      const exists = fs.existsSync(path.join(this.projectRoot, folder));
      if (!exists) {
        this.report.issues.push(`❌ Dossier manquant: ${folder}`);
      } else {
        console.log(`✅ Dossier trouvé: ${folder}`);
      }
    });
  }

  // ⚙️ Analyser les fichiers de configuration
  analyzeConfigurations() {
    console.log('⚙️ Analyse des configurations...');
    
    const configFiles = [
      'tailwind.config.js',
      'tailwind.config.ts', 
      'next.config.js',
      'next.config.ts',
      'package.json',
      'postcss.config.js',
      'globals.css',
      'app/globals.css',
      'styles/globals.css'
    ];

    configFiles.forEach(configFile => {
      const filePath = path.join(this.projectRoot, configFile);
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          this.report.configurations[configFile] = {
            exists: true,
            content: content,
            size: content.length,
            lines: content.split('\n').length
          };
          console.log(`✅ Configuration trouvée: ${configFile}`);
        } catch (error) {
          this.report.configurations[configFile] = {
            exists: true,
            error: error.message
          };
          console.log(`⚠️  Erreur lecture: ${configFile}`);
        }
      } else {
        this.report.configurations[configFile] = { exists: false };
      }
    });
  }

  // 🧩 Analyser les composants UI
  analyzeComponents() {
    console.log('🧩 Analyse des composants...');
    
    const componentsPaths = [
      'components',
      'app/components', 
      'src/components'
    ];

    componentsPaths.forEach(componentsPath => {
      const fullPath = path.join(this.projectRoot, componentsPath);
      if (fs.existsSync(fullPath)) {
        console.log(`📂 Analyse: ${componentsPath}`);
        this.analyzeComponentsInDirectory(fullPath, componentsPath);
      }
    });
  }

  analyzeComponentsInDirectory(dirPath, relativePath) {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    
    files.forEach(file => {
      const filePath = path.join(dirPath, file.name);
      const relativeFilePath = path.join(relativePath, file.name);
      
      if (file.isDirectory()) {
        this.analyzeComponentsInDirectory(filePath, relativeFilePath);
      } else if (file.name.match(/\.(tsx|jsx|ts|js)$/)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const analysis = this.analyzeComponentFile(content, file.name);
          
          this.report.components[relativeFilePath] = {
            ...analysis,
            path: relativeFilePath,
            size: content.length
          };
          
          console.log(`  📄 ${file.name}: ${analysis.type}`);
        } catch (error) {
          console.log(`  ❌ Erreur: ${file.name}`);
        }
      }
    });
  }

  // 📄 Analyser les pages critiques
  analyzePages() {
    console.log('📄 Analyse des pages critiques...');
    
    const criticalPages = [
      'app/dashboard/page.tsx',
      'app/dashboard/page.js',
      'pages/dashboard.tsx',
      'pages/dashboard.js',
      'app/dashboard/chantiers/page.tsx',
      'app/dashboard/messages/page.tsx',
      'app/dashboard/devis/page.tsx',
      'app/layout.tsx',
      'app/layout.js',
      'pages/_app.tsx',
      'pages/_app.js'
    ];

    criticalPages.forEach(pagePath => {
      const fullPath = path.join(this.projectRoot, pagePath);
      if (fs.existsSync(fullPath)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          const analysis = this.analyzePageFile(content, pagePath);
          
          this.report.pages[pagePath] = {
            ...analysis,
            path: pagePath,
            content: content,
            size: content.length
          };
          
          console.log(`✅ Page critique trouvée: ${pagePath}`);
        } catch (error) {
          console.log(`❌ Erreur page: ${pagePath}`);
        }
      }
    });
  }

  // 🎨 Analyser l'utilisation des styles
  analyzeStyles() {
    console.log('🎨 Analyse des styles et classes CSS...');
    
    // Patterns à rechercher
    const patterns = {
      tailwindClasses: /class(?:Name)?=["'][^"']*["']/g,
      colors: /(?:text-|bg-|border-)(gray|blue|green|red|orange|yellow)-(?:\d+)/g,
      buttons: /btn(?:-[a-z]+)?/g,
      spacing: /(?:p|m)[tblrxy]?-[\w.-]+/g
    };

    let allClasses = new Set();
    let colorUsage = {};
    let buttonStyles = new Set();

    // Parcourir tous les fichiers .tsx/.jsx
    this.findFilesRecursive(this.projectRoot, /\.(tsx|jsx)$/).forEach(filePath => {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Extraire les classes Tailwind
        const classMatches = content.match(patterns.tailwindClasses) || [];
        classMatches.forEach(match => {
          const classes = match.match(/["']([^"']*)["']/)[1].split(/\s+/);
          classes.forEach(cls => allClasses.add(cls));
        });

        // Analyser l'utilisation des couleurs
        const colorMatches = content.match(patterns.colors) || [];
        colorMatches.forEach(match => {
          if (!colorUsage[match]) colorUsage[match] = 0;
          colorUsage[match]++;
        });

        // Analyser les styles de boutons
        const buttonMatches = content.match(patterns.buttons) || [];
        buttonMatches.forEach(match => buttonStyles.add(match));

      } catch (error) {
        console.log(`❌ Erreur analyse: ${filePath}`);
      }
    });

    this.report.styles = {
      totalClasses: allClasses.size,
      allClasses: Array.from(allClasses).sort(),
      colorUsage: colorUsage,
      buttonStyles: Array.from(buttonStyles),
      inconsistencies: this.detectStyleInconsistencies(colorUsage, buttonStyles)
    };
  }

  // 🔍 Utilitaires d'analyse
  analyzeComponentFile(content, filename) {
    const hasUseState = content.includes('useState');
    const hasUseEffect = content.includes('useEffect');
    const isPage = filename.includes('page.');
    const hasProps = content.includes('props') || content.includes('interface') && content.includes('Props');
    
    let type = 'component';
    if (isPage) type = 'page';
    else if (hasUseState || hasUseEffect) type = 'interactive-component';
    else if (filename.toLowerCase().includes('layout')) type = 'layout';
    else if (filename.toLowerCase().includes('button')) type = 'ui-component';

    return {
      type,
      hasState: hasUseState,
      hasEffects: hasUseEffect,
      hasProps,
      imports: this.extractImports(content),
      exports: this.extractExports(content)
    };
  }

  analyzePageFile(content, filename) {
    return {
      type: 'page',
      hasLayout: content.includes('Layout'),
      hasMetadata: content.includes('metadata') || content.includes('title'),
      components: this.extractComponentUsage(content),
      imports: this.extractImports(content),
      stylingClasses: this.extractTailwindClasses(content)
    };
  }

  extractImports(content) {
    const importMatches = content.match(/import.*from.*['"][^'"]*['"]/g) || [];
    return importMatches.map(imp => imp.trim());
  }

  extractExports(content) {
    const exportMatches = content.match(/export\s+(?:default\s+)?(?:function|const|class)\s+\w+/g) || [];
    return exportMatches.map(exp => exp.trim());
  }

  extractComponentUsage(content) {
    const componentMatches = content.match(/<[A-Z][a-zA-Z0-9]*(?:\s|>|\/)/g) || [];
    return [...new Set(componentMatches.map(match => match.replace(/[<\s>\/]/g, '')))];
  }

  extractTailwindClasses(content) {
    const classMatches = content.match(/class(?:Name)?=["'][^"']*["']/g) || [];
    const allClasses = [];
    classMatches.forEach(match => {
      const classes = match.match(/["']([^"']*)["']/)[1].split(/\s+/);
      allClasses.push(...classes);
    });
    return [...new Set(allClasses)];
  }

  detectStyleInconsistencies(colorUsage, buttonStyles) {
    const issues = [];
    
    // Détection des variations de couleurs excessives
    const colorVariations = {};
    Object.keys(colorUsage).forEach(color => {
      const baseColor = color.match(/(text-|bg-|border-)(gray|blue|green|red|orange)/);
      if (baseColor) {
        const key = baseColor[0];
        if (!colorVariations[key]) colorVariations[key] = [];
        colorVariations[key].push(color);
      }
    });

    Object.entries(colorVariations).forEach(([baseColor, variations]) => {
      if (variations.length > 3) {
        issues.push({
          type: 'color-inconsistency',
          message: `Trop de variations pour ${baseColor}: ${variations.length} variantes`,
          details: variations
        });
      }
    });

    // Détection des styles de boutons multiples
    if (buttonStyles.length > 3) {
      issues.push({
        type: 'button-inconsistency', 
        message: `Trop de styles de boutons: ${buttonStyles.length}`,
        details: Array.from(buttonStyles)
      });
    }

    return issues;
  }

  // 📁 Utilitaires système de fichiers
  getDirectoryStructure(dirPath, maxDepth, currentDepth = 0) {
    if (currentDepth >= maxDepth) return {};
    
    const structure = {};
    
    try {
      const items = fs.readdirSync(dirPath, { withFileTypes: true });
      
      items.forEach(item => {
        if (item.name.startsWith('.')) return; // Ignorer les fichiers cachés
        
        const itemPath = path.join(dirPath, item.name);
        
        if (item.isDirectory()) {
          structure[item.name] = {
            type: 'directory',
            children: this.getDirectoryStructure(itemPath, maxDepth, currentDepth + 1)
          };
        } else {
          structure[item.name] = {
            type: 'file',
            size: fs.statSync(itemPath).size
          };
        }
      });
    } catch (error) {
      structure._error = error.message;
    }
    
    return structure;
  }

  findFilesRecursive(dirPath, pattern, maxDepth = 5, currentDepth = 0) {
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
      // Ignorer les erreurs de permission
    }
    
    return files;
  }

  // 💾 Générer le rapport
  generateReport() {
    console.log('\n📊 Génération du rapport d\'audit...');
    
    // Ajouter des recommandations
    this.report.recommendations = this.generateRecommendations();
    
    // Sauvegarder le rapport
    const reportPath = path.join(this.projectRoot, 'chantierpro-audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2));
    
    console.log(`✅ Rapport sauvegardé: ${reportPath}`);
    
    // Afficher le résumé
    this.displaySummary();
    
    return this.report;
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Vérifier Tailwind config
    if (!this.report.configurations['tailwind.config.js']?.exists) {
      recommendations.push({
        priority: 'HIGH',
        action: 'Créer tailwind.config.js avec la nouvelle palette de couleurs'
      });
    }

    // Vérifier les pages critiques
    const hasDashboard = Object.keys(this.report.pages).some(page => page.includes('dashboard'));
    if (!hasDashboard) {
      recommendations.push({
        priority: 'HIGH',
        action: 'Localiser la page Dashboard principale'
      });
    }

    // Analyser les inconsistances
    if (this.report.styles.inconsistencies?.length > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        action: `Résoudre ${this.report.styles.inconsistencies.length} inconsistances de style détectées`
      });
    }

    return recommendations;
  }

  displaySummary() {
    console.log('\n🎯 === RÉSUMÉ DE L\'AUDIT CHANTIERPRO ===');
    console.log(`📁 Structure: ${Object.keys(this.report.projectStructure).length} dossiers racine`);
    console.log(`⚙️  Configurations: ${Object.keys(this.report.configurations).filter(c => this.report.configurations[c].exists).length} fichiers trouvés`);
    console.log(`🧩 Composants: ${Object.keys(this.report.components).length} analysés`);
    console.log(`📄 Pages: ${Object.keys(this.report.pages).length} pages critiques trouvées`);
    console.log(`🎨 Classes CSS: ${this.report.styles.totalClasses} classes Tailwind détectées`);
    console.log(`⚠️  Problèmes: ${this.report.issues.length} issues détectées`);
    console.log(`💡 Recommandations: ${this.report.recommendations.length} actions suggérées\n`);

    // Afficher les fichiers critiques trouvés
    console.log('📋 FICHIERS CRITIQUES DÉTECTÉS:');
    Object.keys(this.report.configurations).forEach(config => {
      if (this.report.configurations[config].exists) {
        console.log(`  ✅ ${config}`);
      }
    });

    Object.keys(this.report.pages).forEach(page => {
      console.log(`  ✅ ${page}`);
    });

    if (this.report.issues.length > 0) {
      console.log('\n⚠️  PROBLÈMES DÉTECTÉS:');
      this.report.issues.forEach(issue => console.log(`  ${issue}`));
    }

    console.log('\n🚀 PRÊT POUR L\'UNIFORMISATION !');
    console.log('📧 Envoie le fichier "chantierpro-audit-report.json" pour commencer la migration.\n');
  }

  // 🚀 Exécution principale
  async run() {
    console.log('🎯 === AUDIT CHANTIERPRO - DÉBUT ===\n');
    
    try {
      this.analyzeProjectStructure();
      this.analyzeConfigurations(); 
      this.analyzeComponents();
      this.analyzePages();
      this.analyzeStyles();
      
      return this.generateReport();
    } catch (error) {
      console.error('❌ Erreur during audit:', error);
      throw error;
    }
  }
}

// 🚀 Exécution si appelé directement
if (require.main === module) {
  const auditor = new ChantierProAuditor();
  auditor.run().then(() => {
    console.log('✅ Audit terminé avec succès !');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Échec de l\'audit:', error);
    process.exit(1);
  });
}

module.exports = ChantierProAuditor;

/*
🚀 UTILISATION DU SCRIPT:

1. Sauvegarde ce script dans ton projet ChantierPro
2. Exécute: node audit-chantierpro.js
3. Le script génère: chantierpro-audit-report.json
4. Partage ce fichier pour commencer l'uniformisation !

📊 LE SCRIPT VA ANALYSER:
✅ Structure complète du projet
✅ Configurations Tailwind, Next.js, package.json
✅ Tous les composants et leur type
✅ Pages critiques (Dashboard, Chantiers, etc.)
✅ Utilisation des classes CSS et inconsistances
✅ Recommandations pour l'uniformisation

🎯 RÉSULTAT: Rapport complet pour migration sécurisée !
*/