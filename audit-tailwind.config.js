#!/usr/bin/env node

/**
 * Script d'extraction complète pour l'agent d'uniformisation design ChantierPro
 * Extrait TOUT le code nécessaire pour créer un design moderne unifié
 */

const fs = require('fs');
const path = require('path');

class ChantierProDesignExtractor {
  constructor(projectPath = './') {
    this.projectPath = projectPath;
    this.extraction = {
      timestamp: new Date().toISOString(),
      project: 'ChantierPro - Design Moderne Unifié',
      
      // Configuration système
      tailwindConfig: null,
      globalCSS: null,
      tsConfig: null,
      
      // Composants UI de base
      baseComponents: {
        card: null,
        button: null,
        input: null,
        badge: null,
        progress: null,
        toast: null
      },
      
      // Layout system
      layouts: {
        main: null,
        dashboard: null,
        sidebar: null,
        header: null
      },
      
      // Pages avec code complet
      pages: {
        dashboard: null,
        chantiers: [],
        messages: [],
        devis: [],
        documents: [],
        planning: []
      },
      
      // Design patterns détectés
      currentPatterns: {
        colorUsage: {},
        buttonVariants: [],
        cardVariants: [],
        spacingPatterns: [],
        typographyPatterns: []
      },
      
      // Recommandations design moderne
      modernDesignRecommendations: {
        colorPalette: null,
        componentSystem: null,
        layoutImprovements: null
      }
    };
  }

  async extract() {
    console.log('🎨 Extraction complète pour design moderne ChantierPro...\n');
    
    try {
      // 1. Extraire la configuration système
      await this.extractSystemConfig();
      
      // 2. Extraire les composants UI de base COMPLETS
      await this.extractBaseComponents();
      
      // 3. Extraire le système de layout COMPLET
      await this.extractLayoutSystem();
      
      // 4. Extraire les pages principales avec code complet
      await this.extractPagesWithCode();
      
      // 5. Analyser les patterns actuels
      await this.analyzeCurrentPatterns();
      
      // 6. Générer les recommandations design moderne
      await this.generateModernDesignRecommendations();
      
      // 7. Créer l'archive complète
      await this.createCompleteArchive();
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'extraction:', error.message);
    }
  }

  async extractSystemConfig() {
    console.log('⚙️ Extraction configuration système...');
    
    // Tailwind config COMPLET
    const tailwindPaths = ['tailwind.config.js', 'tailwind.config.ts', 'tailwind.config.mjs'];
    for (const configPath of tailwindPaths) {
      const fullPath = path.join(this.projectPath, configPath);
      if (fs.existsSync(fullPath)) {
        this.extraction.tailwindConfig = {
          filename: configPath,
          fullContent: fs.readFileSync(fullPath, 'utf8')
        };
        break;
      }
    }

    // CSS global COMPLET
    const cssPaths = [
      'src/app/globals.css',
      'app/globals.css', 
      'styles/globals.css',
      'src/styles/globals.css'
    ];
    for (const cssPath of cssPaths) {
      const fullPath = path.join(this.projectPath, cssPath);
      if (fs.existsSync(fullPath)) {
        this.extraction.globalCSS = {
          filename: cssPath,
          fullContent: fs.readFileSync(fullPath, 'utf8')
        };
        break;
      }
    }

    // TypeScript config
    const tsConfigPath = path.join(this.projectPath, 'tsconfig.json');
    if (fs.existsSync(tsConfigPath)) {
      this.extraction.tsConfig = {
        filename: 'tsconfig.json',
        fullContent: fs.readFileSync(tsConfigPath, 'utf8')
      };
    }

    console.log('  ✅ Configuration système extraite');
  }

  async extractBaseComponents() {
    console.log('🧩 Extraction composants UI de base...');
    
    const baseComponentsMap = {
      card: ['components/ui/card.tsx', 'src/components/ui/card.tsx'],
      button: ['components/ui/button.tsx', 'src/components/ui/button.tsx'],
      input: ['components/ui/input.tsx', 'src/components/ui/input.tsx'],
      badge: ['components/ui/badge.tsx', 'src/components/ui/badge.tsx'],
      progress: ['components/ui/progress.tsx', 'src/components/ui/progress.tsx'],
      toast: ['components/ui/Toast.tsx', 'components/ui/toast.tsx', 'src/components/ui/Toast.tsx']
    };

    for (const [componentName, possiblePaths] of Object.entries(baseComponentsMap)) {
      for (const componentPath of possiblePaths) {
        const fullPath = path.join(this.projectPath, componentPath);
        if (fs.existsSync(fullPath)) {
          this.extraction.baseComponents[componentName] = {
            filename: componentPath,
            fullContent: fs.readFileSync(fullPath, 'utf8')
          };
          break;
        }
      }
    }

    console.log('  ✅ Composants UI de base extraits');
  }

  async extractLayoutSystem() {
    console.log('🏗️ Extraction système de layout...');
    
    const layoutFiles = {
      main: ['app/layout.tsx', 'src/app/layout.tsx'],
      dashboard: ['components/layout/DashboardLayout.tsx', 'src/components/layout/DashboardLayout.tsx'],
      sidebar: ['components/layout/ModernSidebar.tsx', 'components/layout/Sidebar.tsx', 'src/components/layout/ModernSidebar.tsx'],
      header: ['components/layout/ModernHeader.tsx', 'components/layout/Header.tsx', 'src/components/layout/ModernHeader.tsx']
    };

    for (const [layoutName, possiblePaths] of Object.entries(layoutFiles)) {
      for (const layoutPath of possiblePaths) {
        const fullPath = path.join(this.projectPath, layoutPath);
        if (fs.existsSync(fullPath)) {
          this.extraction.layouts[layoutName] = {
            filename: layoutPath,
            fullContent: fs.readFileSync(fullPath, 'utf8')
          };
          break;
        }
      }
    }

    console.log('  ✅ Système de layout extrait');
  }

  async extractPagesWithCode() {
    console.log('📄 Extraction pages avec code complet...');
    
    const pageCategories = {
      dashboard: [
        'app/dashboard/page.tsx',
        'src/app/dashboard/page.tsx'
      ],
      chantiers: [
        'app/dashboard/chantiers/page.tsx',
        'app/dashboard/chantiers/[id]/page.tsx',
        'app/dashboard/chantiers/nouveau/page.tsx'
      ],
      messages: [
        'app/dashboard/messages/page.tsx',
        'app/dashboard/messages/nouveau/page.tsx'
      ],
      devis: [
        'app/dashboard/devis/page.tsx',
        'app/dashboard/devis/[id]/page.tsx',
        'app/dashboard/devis/nouveau/page.tsx'
      ],
      documents: [
        'app/dashboard/documents/page.tsx',
        'app/dashboard/documents/[id]/page.tsx'
      ],
      planning: [
        'app/dashboard/planning/page.tsx',
        'app/dashboard/planning/[id]/page.tsx'
      ]
    };

    for (const [category, paths] of Object.entries(pageCategories)) {
      if (category === 'dashboard') {
        // Page dashboard principale
        for (const pagePath of paths) {
          const fullPath = path.join(this.projectPath, pagePath);
          if (fs.existsSync(fullPath)) {
            this.extraction.pages.dashboard = {
              filename: pagePath,
              fullContent: fs.readFileSync(fullPath, 'utf8')
            };
            break;
          }
        }
      } else {
        // Pages de catégorie
        this.extraction.pages[category] = [];
        for (const pagePath of paths) {
          const fullPath = path.join(this.projectPath, pagePath);
          if (fs.existsSync(fullPath)) {
            this.extraction.pages[category].push({
              filename: pagePath,
              fullContent: fs.readFileSync(fullPath, 'utf8')
            });
          }
        }
      }
    }

    console.log('  ✅ Pages avec code complet extraites');
  }

  async analyzeCurrentPatterns() {
    console.log('🔍 Analyse des patterns actuels...');
    
    const allContent = [];
    
    // Collecter tout le contenu
    Object.values(this.extraction.baseComponents).forEach(comp => {
      if (comp) allContent.push(comp.fullContent);
    });
    
    Object.values(this.extraction.layouts).forEach(layout => {
      if (layout) allContent.push(layout.fullContent);
    });
    
    if (this.extraction.pages.dashboard) {
      allContent.push(this.extraction.pages.dashboard.fullContent);
    }
    
    Object.values(this.extraction.pages).forEach(category => {
      if (Array.isArray(category)) {
        category.forEach(page => allContent.push(page.fullContent));
      }
    });

    const allCode = allContent.join('\n');

    // Analyser les patterns
    this.extraction.currentPatterns = {
      colorUsage: this.extractColorPatterns(allCode),
      buttonVariants: this.extractButtonPatterns(allCode),
      cardVariants: this.extractCardPatterns(allCode),
      spacingPatterns: this.extractSpacingPatterns(allCode),
      typographyPatterns: this.extractTypographyPatterns(allCode)
    };

    console.log('  ✅ Patterns actuels analysés');
  }

  extractColorPatterns(content) {
    const patterns = {};
    
    // Extraire toutes les classes de couleur
    const colorMatches = content.match(/(bg-|text-|border-)[a-zA-Z]+-\d+/g);
    if (colorMatches) {
      colorMatches.forEach(match => {
        const [type, color, shade] = match.split('-');
        const key = `${type}-${color}`;
        if (!patterns[key]) patterns[key] = [];
        if (!patterns[key].includes(shade)) {
          patterns[key].push(shade);
        }
      });
    }
    
    return patterns;
  }

  extractButtonPatterns(content) {
    const buttonClasses = content.match(/className=["`']([^"`']*(?:btn|button)[^"`']*)["`']/gi);
    return buttonClasses ? [...new Set(buttonClasses.map(match => 
      match.replace(/className=["`']([^"`']*)["`']/, '$1')
    ))] : [];
  }

  extractCardPatterns(content) {
    const cardClasses = content.match(/className=["`']([^"`']*(?:card|container)[^"`']*)["`']/gi);
    return cardClasses ? [...new Set(cardClasses.map(match => 
      match.replace(/className=["`']([^"`']*)["`']/, '$1')
    ))] : [];
  }

  extractSpacingPatterns(content) {
    const spacingMatches = content.match(/(p-|px-|py-|m-|mx-|my-|gap-|space-)[a-zA-Z0-9.\[\]]+/g);
    return spacingMatches ? [...new Set(spacingMatches)] : [];
  }

  extractTypographyPatterns(content) {
    const typographyMatches = content.match(/(text-|font-|leading-|tracking-)[a-zA-Z0-9.\[\]\/]+/g);
    return typographyMatches ? [...new Set(typographyMatches)] : [];
  }

  async generateModernDesignRecommendations() {
    console.log('🎨 Génération recommandations design moderne...');
    
    this.extraction.modernDesignRecommendations = {
      colorPalette: this.generateModernColorPalette(),
      componentSystem: this.generateModernComponentSystem(),
      layoutImprovements: this.generateLayoutImprovements()
    };

    console.log('  ✅ Recommandations design moderne générées');
  }

  generateModernColorPalette() {
    return {
      // Palette moderne pour app BTP/Construction
      primary: {
        50: '#f0f9ff',   // Bleu très clair (existant)
        100: '#e0f2fe',  // Bleu clair (existant)
        500: '#0ea5e9',  // Bleu principal (existant)
        600: '#0284c7',  // Bleu foncé (existant)
        700: '#0369a1',  // Bleu très foncé (existant)
        900: '#0c4a6e'   // Bleu profond (existant)
      },
      
      // Nouvelle palette construction/chantier
      construction: {
        50: '#fefce8',   // Jaune sécurité très clair
        100: '#fef3c7',  // Jaune sécurité clair
        400: '#fbbf24',  // Jaune sécurité
        500: '#f59e0b',  // Orange chantier
        600: '#d97706',  // Orange foncé
        700: '#b45309'   // Orange très foncé
      },
      
      // Gris modernes pour UI
      neutral: {
        50: '#fafafa',   // Blanc cassé
        100: '#f5f5f5',  // Gris très clair
        200: '#e5e5e5',  // Gris clair
        300: '#d4d4d4',  // Gris moyen clair
        400: '#a3a3a3',  // Gris moyen
        500: '#737373',  // Gris
        600: '#525252',  // Gris foncé
        700: '#404040',  // Gris très foncé
        800: '#262626',  // Gris sombre
        900: '#171717'   // Noir
      },
      
      // États sémantiques
      semantic: {
        success: '#10b981',   // Vert succès
        warning: '#f59e0b',   // Orange warning
        error: '#ef4444',     // Rouge erreur
        info: '#3b82f6'       // Bleu info
      }
    };
  }

  generateModernComponentSystem() {
    return {
      buttons: {
        primary: "bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm",
        secondary: "bg-white hover:bg-neutral-50 text-primary-600 font-medium px-4 py-2 rounded-lg border border-neutral-300 transition-colors duration-200",
        ghost: "hover:bg-neutral-100 text-neutral-700 font-medium px-4 py-2 rounded-lg transition-colors duration-200",
        construction: "bg-construction-500 hover:bg-construction-600 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm"
      },
      
      cards: {
        default: "bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow duration-200",
        elevated: "bg-white rounded-xl shadow-lg border border-neutral-100",
        interactive: "bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md hover:border-primary-300 transition-all duration-200 cursor-pointer"
      },
      
      inputs: {
        default: "w-full px-3 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200",
        error: "w-full px-3 py-2 rounded-lg border border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
      },
      
      badges: {
        primary: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800",
        construction: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-construction-100 text-construction-800",
        success: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800",
        warning: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800",
        error: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
      }
    };
  }

  generateLayoutImprovements() {
    return {
      spacing: {
        sections: "space-y-8",
        cards: "space-y-6", 
        elements: "space-y-4",
        inline: "space-x-4"
      },
      
      containers: {
        page: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",
        section: "max-w-4xl mx-auto",
        card: "p-6"
      },
      
      typography: {
        pageTitle: "text-3xl font-bold text-neutral-900",
        sectionTitle: "text-xl font-semibold text-neutral-900",
        cardTitle: "text-lg font-medium text-neutral-900",
        body: "text-neutral-700",
        caption: "text-sm text-neutral-500"
      }
    };
  }

  async createCompleteArchive() {
    console.log('📦 Création archive complète...');
    
    // Créer le rapport complet
    const completeReport = {
      meta: {
        extractedAt: this.extraction.timestamp,
        project: this.extraction.project,
        purpose: "Uniformisation design moderne - Page par page",
        approach: "Modification de l'existant avec charte couleur moderne"
      },
      
      systemConfig: {
        tailwind: this.extraction.tailwindConfig,
        globalCSS: this.extraction.globalCSS,
        typescript: this.extraction.tsConfig
      },
      
      currentCodebase: {
        baseComponents: this.extraction.baseComponents,
        layouts: this.extraction.layouts,
        pages: this.extraction.pages
      },
      
      currentPatterns: this.extraction.currentPatterns,
      
      modernDesignSystem: this.extraction.modernDesignRecommendations,
      
      migrationPlan: {
        phase1: "Modifier composants UI de base (Button, Card, Input, Badge)",
        phase2: "Appliquer nouvelle palette couleurs dans Tailwind config",
        phase3: "Migrer pages une par une en commençant par Dashboard",
        phase4: "Mettre à jour layout system avec design moderne",
        phase5: "Nettoyer et optimiser"
      }
    };

    // Sauvegarder l'archive complète
    const archivePath = path.join(this.projectPath, 'design-modern-extraction.json');
    fs.writeFileSync(archivePath, JSON.stringify(completeReport, null, 2));
    
    // Créer le guide de migration
    const migrationGuide = this.generateMigrationGuide(completeReport);
    const guidePath = path.join(this.projectPath, 'design-modern-migration-guide.md');
    fs.writeFileSync(guidePath, migrationGuide);

    console.log('\n✅ Extraction complète terminée !');
    console.log(`📦 Archive complète: ${archivePath}`);
    console.log(`📋 Guide migration: ${guidePath}`);
    console.log(`\n🎨 Prêt pour uniformisation design moderne page par page !`);
    
    return completeReport;
  }

  generateMigrationGuide(report) {
    return `# Guide Migration Design Moderne - ChantierPro

## 🎯 Objectif
Transformer ChantierPro en application moderne avec design unifié, page par page.

## 🎨 Nouvelle Charte Couleur Moderne

### Palette Construction/BTP
- **Primary (Bleu professionnel)**: Conservé et optimisé
- **Construction (Orange chantier)**: Nouvelle palette thématique
- **Neutral (Gris modernes)**: Remplacement des gris incohérents
- **Semantic (États)**: Couleurs d'état standardisées

## 📋 Plan de Migration

### Phase 1: Composants de Base
- [ ] Button: ${Object.keys(report.currentCodebase.baseComponents).filter(k => k === 'button').length > 0 ? '✅ Code extrait' : '❌ À extraire'}
- [ ] Card: ${Object.keys(report.currentCodebase.baseComponents).filter(k => k === 'card').length > 0 ? '✅ Code extrait' : '❌ À extraire'}
- [ ] Input: ${Object.keys(report.currentCodebase.baseComponents).filter(k => k === 'input').length > 0 ? '✅ Code extrait' : '❌ À extraire'}
- [ ] Badge: ${Object.keys(report.currentCodebase.baseComponents).filter(k => k === 'badge').length > 0 ? '✅ Code extrait' : '❌ À extraire'}

### Phase 2: Configuration
- [ ] Tailwind Config: ${report.systemConfig.tailwind ? '✅ Extrait' : '❌ À extraire'}
- [ ] CSS Global: ${report.systemConfig.globalCSS ? '✅ Extrait' : '❌ À extraire'}

### Phase 3: Pages (Une par une)
- [ ] Dashboard: ${report.currentCodebase.pages.dashboard ? '✅ Code extrait' : '❌ À extraire'}
- [ ] Chantiers: ${report.currentCodebase.pages.chantiers.length} pages extraites
- [ ] Messages: ${report.currentCodebase.pages.messages.length} pages extraites
- [ ] Devis: ${report.currentCodebase.pages.devis.length} pages extraites
- [ ] Documents: ${report.currentCodebase.pages.documents.length} pages extraites
- [ ] Planning: ${report.currentCodebase.pages.planning.length} pages extraites

## 🚀 Prêt pour le Code !

Toutes les informations nécessaires sont extraites.
L'agent peut maintenant commencer l'uniformisation design moderne.

**Commande:** "Commence l'uniformisation design moderne"
`;
  }
}

// Script principal
async function main() {
  const extractor = new ChantierProDesignExtractor();
  
  console.log('🎨 ChantierPro Design Moderne - Extraction Complète\n');
  console.log('Ce script va extraire TOUT le code nécessaire pour:');
  console.log('✅ Créer un design moderne unifié');
  console.log('✅ Modifier l\'existant page par page');
  console.log('✅ Appliquer une nouvelle charte couleur moderne');
  console.log('✅ Fournir un plan de migration complet\n');
  
  await extractor.extract();
}

// Exécution si appelé directement
if (require.main === module) {
  main().catch(console.error);
}

module.exports = ChantierProDesignExtractor;