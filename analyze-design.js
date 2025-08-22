#!/usr/bin/env node

/**
 * Script d'analyse du design system ChantierPro
 * Extrait toutes les informations nécessaires pour l'uniformisation
 */

const fs = require('fs');
const path = require('path');

class ChantierProDesignAnalyzer {
  constructor(projectPath = './') {
    this.projectPath = projectPath;
    this.analysis = {
      timestamp: new Date().toISOString(),
      project: 'ChantierPro',
      tailwindConfig: null,
      components: [],
      pages: [],
      styles: {
        colors: new Set(),
        classes: new Set(),
        fonts: new Set(),
        shadows: new Set(),
        spacing: new Set(),
        borderRadius: new Set()
      },
      layouts: [],
      inconsistencies: [],
      recommendations: []
    };
  }

  async analyze() {
    console.log('🔍 Analyse du design system ChantierPro...\n');
    
    try {
      // 1. Analyser la configuration Tailwind
      await this.analyzeTailwindConfig();
      
      // 2. Analyser les composants UI
      await this.analyzeComponents();
      
      // 3. Analyser les pages
      await this.analyzePages();
      
      // 4. Analyser les layouts
      await this.analyzeLayouts();
      
      // 5. Extraire les patterns CSS
      await this.extractCSSPatterns();
      
      // 6. Détecter les inconsistances
      await this.detectInconsistencies();
      
      // 7. Générer le rapport
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'analyse:', error.message);
    }
  }

  async analyzeTailwindConfig() {
    console.log('📐 Analyse configuration Tailwind...');
    
    const configPaths = [
      'tailwind.config.js',
      'tailwind.config.ts',
      'tailwind.config.mjs'
    ];

    for (const configPath of configPaths) {
      const fullPath = path.join(this.projectPath, configPath);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        this.analysis.tailwindConfig = {
          file: configPath,
          content: content,
          customColors: this.extractCustomColors(content),
          customSpacing: this.extractCustomSpacing(content),
          customFonts: this.extractCustomFonts(content)
        };
        console.log('  ✅ Configuration Tailwind trouvée');
        break;
      }
    }
  }

  async analyzeComponents() {
    console.log('🧩 Analyse des composants...');
    
    const componentsDirs = [
      'src/components',
      'components',
      'app/components',
      'src/app/components'
    ];

    for (const dir of componentsDirs) {
      const fullPath = path.join(this.projectPath, dir);
      if (fs.existsSync(fullPath)) {
        await this.scanDirectory(fullPath, 'component');
      }
    }
    
    console.log(`  ✅ ${this.analysis.components.length} composants analysés`);
  }

  async analyzePages() {
    console.log('📄 Analyse des pages...');
    
    const pagesDirs = [
      'src/pages',
      'pages',
      'app',
      'src/app'
    ];

    for (const dir of pagesDirs) {
      const fullPath = path.join(this.projectPath, dir);
      if (fs.existsSync(fullPath)) {
        await this.scanDirectory(fullPath, 'page');
      }
    }
    
    console.log(`  ✅ ${this.analysis.pages.length} pages analysées`);
  }

  async analyzeLayouts() {
    console.log('🏗️ Analyse des layouts...');
    
    const layoutFiles = [
      'src/app/layout.tsx',
      'src/components/layout',
      'components/layout',
      'src/layouts'
    ];

    for (const layoutPath of layoutFiles) {
      const fullPath = path.join(this.projectPath, layoutPath);
      if (fs.existsSync(fullPath)) {
        if (fs.statSync(fullPath).isDirectory()) {
          await this.scanDirectory(fullPath, 'layout');
        } else {
          const content = fs.readFileSync(fullPath, 'utf8');
          this.analysis.layouts.push({
            file: layoutPath,
            content: content,
            patterns: this.extractUIPatterns(content)
          });
        }
      }
    }
    
    console.log(`  ✅ ${this.analysis.layouts.length} layouts analysés`);
  }

  async scanDirectory(dirPath, type) {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const file of files) {
      const fullPath = path.join(dirPath, file.name);
      
      if (file.isDirectory()) {
        await this.scanDirectory(fullPath, type);
      } else if (this.isReactFile(file.name)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const relativePath = path.relative(this.projectPath, fullPath);
        
        const analysis = {
          file: relativePath,
          name: this.extractComponentName(file.name),
          content: content,
          patterns: this.extractUIPatterns(content),
          imports: this.extractImports(content),
          exports: this.extractExports(content)
        };
        
        if (type === 'component') {
          this.analysis.components.push(analysis);
        } else if (type === 'page') {
          this.analysis.pages.push(analysis);
        } else if (type === 'layout') {
          this.analysis.layouts.push(analysis);
        }
      }
    }
  }

  extractUIPatterns(content) {
    const patterns = {
      buttons: [],
      inputs: [],
      cards: [],
      headers: [],
      navigation: [],
      colors: [],
      spacing: [],
      typography: [],
      shadows: [],
      borders: []
    };

    // Extraire les patterns de boutons
    const buttonMatches = content.match(/className=["`']([^"`']*(?:btn|button)[^"`']*)["`']/gi);
    if (buttonMatches) {
      patterns.buttons = buttonMatches.map(match => 
        match.replace(/className=["`']([^"`']*)["`']/, '$1')
      );
    }

    // Extraire les patterns d'inputs
    const inputMatches = content.match(/className=["`']([^"`']*(?:input|field)[^"`']*)["`']/gi);
    if (inputMatches) {
      patterns.inputs = inputMatches.map(match => 
        match.replace(/className=["`']([^"`']*)["`']/, '$1')
      );
    }

    // Extraire les patterns de cards
    const cardMatches = content.match(/className=["`']([^"`']*(?:card|panel|container)[^"`']*)["`']/gi);
    if (cardMatches) {
      patterns.cards = cardMatches.map(match => 
        match.replace(/className=["`']([^"`']*)["`']/, '$1')
      );
    }

    // Extraire toutes les classes Tailwind
    const allClasses = content.match(/className=["`']([^"`']*)["`']/gi);
    if (allClasses) {
      allClasses.forEach(match => {
        const classes = match.replace(/className=["`']([^"`']*)["`']/, '$1').split(/\s+/);
        classes.forEach(cls => {
          this.analysis.styles.classes.add(cls);
          this.categorizeClass(cls);
        });
      });
    }

    return patterns;
  }

  categorizeClass(className) {
    // Couleurs
    if (/^(bg-|text-|border-)/.test(className)) {
      this.analysis.styles.colors.add(className);
    }
    
    // Espacement
    if (/^(p-|px-|py-|pt-|pb-|pl-|pr-|m-|mx-|my-|mt-|mb-|ml-|mr-|space-|gap-)/.test(className)) {
      this.analysis.styles.spacing.add(className);
    }
    
    // Typography
    if (/^(text-|font-|leading-|tracking-)/.test(className)) {
      this.analysis.styles.fonts.add(className);
    }
    
    // Ombres
    if (/^shadow/.test(className)) {
      this.analysis.styles.shadows.add(className);
    }
    
    // Border radius
    if (/^rounded/.test(className)) {
      this.analysis.styles.borderRadius.add(className);
    }
  }

  extractCustomColors(content) {
    const colorMatches = content.match(/colors:\s*{[\s\S]*?}/);
    return colorMatches ? colorMatches[0] : null;
  }

  extractCustomSpacing(content) {
    const spacingMatches = content.match(/spacing:\s*{[\s\S]*?}/);
    return spacingMatches ? spacingMatches[0] : null;
  }

  extractCustomFonts(content) {
    const fontMatches = content.match(/fontFamily:\s*{[\s\S]*?}/);
    return fontMatches ? fontMatches[0] : null;
  }

  extractImports(content) {
    const importMatches = content.match(/^import\s+.*$/gm);
    return importMatches || [];
  }

  extractExports(content) {
    const exportMatches = content.match(/^export\s+.*$/gm);
    return exportMatches || [];
  }

  extractComponentName(filename) {
    return filename.replace(/\.(tsx?|jsx?)$/, '');
  }

  isReactFile(filename) {
    return /\.(tsx?|jsx?)$/.test(filename);
  }

  async extractCSSPatterns() {
    console.log('🎨 Extraction des patterns CSS...');
    
    // Analyser les fichiers CSS globaux
    const cssFiles = [
      'src/styles/globals.css',
      'styles/globals.css',
      'app/globals.css',
      'src/app/globals.css'
    ];

    for (const cssFile of cssFiles) {
      const fullPath = path.join(this.projectPath, cssFile);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        this.analysis.globalCSS = {
          file: cssFile,
          content: content,
          customProperties: this.extractCSSCustomProperties(content),
          tailwindDirectives: this.extractTailwindDirectives(content)
        };
      }
    }
  }

  extractCSSCustomProperties(content) {
    const customProps = content.match(/--[\w-]+:\s*[^;]+;/g);
    return customProps || [];
  }

  extractTailwindDirectives(content) {
    const directives = content.match(/@tailwind\s+\w+;/g);
    return directives || [];
  }

  async detectInconsistencies() {
    console.log('🔍 Détection des inconsistances...');
    
    // Analyser les variations de couleurs
    const colorVariations = this.analyzeColorVariations();
    if (colorVariations.length > 0) {
      this.analysis.inconsistencies.push({
        type: 'colors',
        description: 'Variations incohérentes dans les couleurs',
        items: colorVariations
      });
    }

    // Analyser les variations d'espacement
    const spacingVariations = this.analyzeSpacingVariations();
    if (spacingVariations.length > 0) {
      this.analysis.inconsistencies.push({
        type: 'spacing',
        description: 'Variations incohérentes dans l\'espacement',
        items: spacingVariations
      });
    }

    // Analyser les patterns de boutons
    const buttonInconsistencies = this.analyzeButtonPatterns();
    if (buttonInconsistencies.length > 0) {
      this.analysis.inconsistencies.push({
        type: 'buttons',
        description: 'Styles de boutons incohérents',
        items: buttonInconsistencies
      });
    }

    // Analyser les patterns de cards
    const cardInconsistencies = this.analyzeCardPatterns();
    if (cardInconsistencies.length > 0) {
      this.analysis.inconsistencies.push({
        type: 'cards',
        description: 'Styles de cards incohérents',
        items: cardInconsistencies
      });
    }
  }

  analyzeColorVariations() {
    const colors = Array.from(this.analysis.styles.colors);
    const variations = {};
    
    colors.forEach(color => {
      const base = color.replace(/-\d+$/, '');
      if (!variations[base]) variations[base] = [];
      variations[base].push(color);
    });

    return Object.entries(variations)
      .filter(([base, variants]) => variants.length > 3)
      .map(([base, variants]) => ({ base, variants, count: variants.length }));
  }

  analyzeSpacingVariations() {
    const spacing = Array.from(this.analysis.styles.spacing);
    const unusualSpacing = spacing.filter(s => 
      /-(0\.5|1\.5|2\.5|3\.5|7|9|11|13|14|15)$/.test(s)
    );
    return unusualSpacing;
  }

  analyzeButtonPatterns() {
    const allButtons = [];
    [...this.analysis.components, ...this.analysis.pages].forEach(item => {
      if (item.patterns.buttons) {
        allButtons.push(...item.patterns.buttons);
      }
    });

    const uniquePatterns = [...new Set(allButtons)];
    return uniquePatterns.length > 5 ? uniquePatterns : [];
  }

  analyzeCardPatterns() {
    const allCards = [];
    [...this.analysis.components, ...this.analysis.pages].forEach(item => {
      if (item.patterns.cards) {
        allCards.push(...item.patterns.cards);
      }
    });

    const uniquePatterns = [...new Set(allCards)];
    return uniquePatterns.length > 3 ? uniquePatterns : [];
  }

  async generateReport() {
    console.log('📊 Génération du rapport...');
    
    const report = {
      meta: {
        timestamp: this.analysis.timestamp,
        project: this.analysis.project,
        summary: {
          components: this.analysis.components.length,
          pages: this.analysis.pages.length,
          layouts: this.analysis.layouts.length,
          inconsistencies: this.analysis.inconsistencies.length
        }
      },
      tailwindConfig: this.analysis.tailwindConfig,
      designSystem: {
        colors: Array.from(this.analysis.styles.colors).sort(),
        spacing: Array.from(this.analysis.styles.spacing).sort(),
        typography: Array.from(this.analysis.styles.fonts).sort(),
        shadows: Array.from(this.analysis.styles.shadows).sort(),
        borderRadius: Array.from(this.analysis.styles.borderRadius).sort()
      },
      components: this.analysis.components.map(comp => ({
        name: comp.name,
        file: comp.file,
        patterns: comp.patterns,
        imports: comp.imports.slice(0, 5) // Limite pour la lisibilité
      })),
      pages: this.analysis.pages.map(page => ({
        name: page.name,
        file: page.file,
        patterns: page.patterns
      })),
      layouts: this.analysis.layouts,
      inconsistencies: this.analysis.inconsistencies,
      recommendations: this.generateRecommendations()
    };

    // Sauvegarder le rapport
    const reportPath = path.join(this.projectPath, 'design-analysis-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Générer un résumé lisible
    const summaryPath = path.join(this.projectPath, 'design-analysis-summary.md');
    const summary = this.generateMarkdownSummary(report);
    fs.writeFileSync(summaryPath, summary);

    console.log('\n✅ Analyse terminée !');
    console.log(`📄 Rapport détaillé: ${reportPath}`);
    console.log(`📋 Résumé: ${summaryPath}`);
    
    return report;
  }

  generateRecommendations() {
    const recommendations = [];

    // Recommandations basées sur les inconsistances
    if (this.analysis.inconsistencies.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        type: 'standardization',
        title: 'Standardiser les composants incohérents',
        description: `${this.analysis.inconsistencies.length} types d'inconsistances détectées`,
        actions: this.analysis.inconsistencies.map(inc => 
          `Uniformiser ${inc.type}: ${inc.description}`
        )
      });
    }

    // Recommandations sur les couleurs
    const colorCount = this.analysis.styles.colors.size;
    if (colorCount > 50) {
      recommendations.push({
        priority: 'MEDIUM',
        type: 'colors',
        title: 'Réduire la palette de couleurs',
        description: `${colorCount} variations de couleurs détectées`,
        actions: ['Définir une palette limitée', 'Utiliser les couleurs système']
      });
    }

    return recommendations;
  }

  generateMarkdownSummary(report) {
    return `# Analyse Design System - ChantierPro

**Date d'analyse:** ${report.meta.timestamp}

## 📊 Résumé

- **Composants analysés:** ${report.meta.summary.components}
- **Pages analysées:** ${report.meta.summary.pages}  
- **Layouts analysés:** ${report.meta.summary.layouts}
- **Inconsistances détectées:** ${report.meta.summary.inconsistencies}

## 🎨 Design System Actuel

### Couleurs (${report.designSystem.colors.length})
\`\`\`
${report.designSystem.colors.slice(0, 20).join(', ')}
${report.designSystem.colors.length > 20 ? '...' : ''}
\`\`\`

### Espacement (${report.designSystem.spacing.length})
\`\`\`
${report.designSystem.spacing.slice(0, 15).join(', ')}
${report.designSystem.spacing.length > 15 ? '...' : ''}
\`\`\`

### Typography (${report.designSystem.typography.length})
\`\`\`
${report.designSystem.typography.slice(0, 10).join(', ')}
${report.designSystem.typography.length > 10 ? '...' : ''}
\`\`\`

## ⚠️ Inconsistances Détectées

${report.inconsistencies.map(inc => `
### ${inc.type.toUpperCase()}
${inc.description}
- Items: ${inc.items.length}
`).join('')}

## 🎯 Recommandations

${report.recommendations.map(rec => `
### ${rec.priority} - ${rec.title}
${rec.description}

Actions recommandées:
${rec.actions.map(action => `- ${action}`).join('\n')}
`).join('')}

## 📁 Fichiers Analysés

### Composants
${report.components.slice(0, 10).map(comp => `- ${comp.name} (${comp.file})`).join('\n')}
${report.components.length > 10 ? `\n... et ${report.components.length - 10} autres` : ''}

### Pages  
${report.pages.slice(0, 10).map(page => `- ${page.name} (${page.file})`).join('\n')}
${report.pages.length > 10 ? `\n... et ${report.pages.length - 10} autres` : ''}
`;
  }
}

// Script principal
async function main() {
  const analyzer = new ChantierProDesignAnalyzer();
  
  console.log('🚀 ChantierPro Design System Analyzer\n');
  console.log('Ce script va analyser votre projet pour extraire:');
  console.log('- Configuration Tailwind existante');
  console.log('- Composants et leurs patterns');
  console.log('- Pages et layouts');
  console.log('- Inconsistances de design');
  console.log('- Recommandations d\'uniformisation\n');
  
  await analyzer.analyze();
}

// Exécution si appelé directement
if (require.main === module) {
  main().catch(console.error);
}

module.exports = ChantierProDesignAnalyzer;