const fs = require('fs-extra');
const path = require('path');
const { glob } = require('glob');
const chalk = require('chalk');
const rules = require('../config/rules.json');

class CriticalErrorScanner {
  constructor(projectPath = '../') {
    this.projectPath = path.resolve(__dirname, projectPath);
    this.errors = [];
    this.patterns = rules.criticalErrors;
  }

  async scan() {
    console.log(chalk.blue('🔍 Démarrage du scan des erreurs critiques...'));
    console.log(chalk.gray(`📁 Répertoire: ${this.projectPath}`));
    
    try {
      await this.scanCodeFiles();
      await this.scanLogs();
      await this.scanDependencies();
      return await this.generateReport();
      
    } catch (error) {
      console.error(chalk.red('❌ Erreur lors du scan:'), error.message);
      throw error;
    }
  }

  async scanCodeFiles() {
    console.log(chalk.yellow('📝 Analyse des fichiers de code...'));
    
    const patterns = [
      '**/*.{ts,tsx,js,jsx}',
      '!node_modules/**',
      '!.next/**',
      '!dist/**',
      '!agent-debug/**'
    ];

    try {
      const files = await glob(patterns, { cwd: this.projectPath });
      
      for (const file of files) {
        await this.analyzeFile(file);
      }
      
      console.log(chalk.green(`✅ ${files.length} fichiers analysés`));
    } catch (error) {
      console.error(chalk.red('❌ Erreur scan fichiers:'), error.message);
    }
  }

  async analyzeFile(filePath) {
    try {
      const fullPath = path.join(this.projectPath, filePath);
      const content = await fs.readFile(fullPath, 'utf8');
      
      this.checkSyntaxErrors(filePath, content);
      await this.checkImportErrors(filePath, content);
      this.checkTypeErrors(filePath, content);
      this.checkReactErrors(filePath, content);
      
    } catch (error) {
      this.addError('file', filePath, `Erreur lecture fichier: ${error.message}`, 'critical');
    }
  }

  checkSyntaxErrors(filePath, content) {
    // Vérifier les accolades non fermées
    const openBraces = (content.match(/\{/g) || []).length;
    const closeBraces = (content.match(/\}/g) || []).length;
    
    if (openBraces !== closeBraces) {
      this.addError('syntax', filePath, 'Accolades non équilibrées', 'critical');
    }

    // Vérifier les parenthèses non fermées
    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;
    
    if (openParens !== closeParens) {
      this.addError('syntax', filePath, 'Parenthèses non équilibrées', 'critical');
    }

    // Vérifier les points-virgules manquants dans les imports
    const importLines = content.split('\n').filter(line => line.trim().startsWith('import'));
    importLines.forEach((line, index) => {
      if (!line.trim().endsWith(';') && line.includes('from')) {
        this.addError('syntax', filePath, `Import sans point-virgule ligne ${index + 1}`, 'warning');
      }
    });
  }

  async checkImportErrors(filePath, content) {
    const importRegex = /import.*from\s+['"](.*?)['"]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      
      // Vérifier les imports relatifs
      if (importPath.startsWith('./') || importPath.startsWith('../')) {
        const currentDir = path.dirname(path.join(this.projectPath, filePath));
        const resolvedPath = path.resolve(currentDir, importPath);
        
        // Vérifier si le fichier existe (avec extensions possibles)
        const extensions = ['.ts', '.tsx', '.js', '.jsx', '.json', ''];
        let exists = false;
        
        for (const ext of extensions) {
          try {
            const testPath = resolvedPath + ext;
            const indexPath = path.join(resolvedPath, 'index' + ext);
            
            if (await fs.pathExists(testPath) || await fs.pathExists(indexPath)) {
              exists = true;
              break;
            }
          } catch (error) {
            // Ignorer les erreurs de vérification
          }
        }
        
        if (!exists) {
          this.addError('imports', filePath, `Import introuvable: ${importPath}`, 'critical');
        }
      }
    }
  }

  checkTypeErrors(filePath, content) {
    // Vérifier les utilisations de 'any' explicites
    if (content.includes(': any') || content.includes('<any>')) {
      this.addError('types', filePath, 'Utilisation du type "any" détectée', 'warning');
    }

    // Vérifier les composants sans types de props
    if (filePath.endsWith('.tsx')) {
      const componentRegex = /function\s+(\w+)\s*\(/g;
      let match;
      
      while ((match = componentRegex.exec(content)) !== null) {
        const componentName = match[1];
        if (componentName[0] === componentName[0].toUpperCase()) {
          // C'est probablement un composant React
          if (!content.includes(`${componentName}Props`) && !content.includes('props:')) {
            this.addError('types', filePath, `Composant ${componentName} sans types de props`, 'warning');
          }
        }
      }
    }
  }

  checkReactErrors(filePath, content) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.jsx')) return;

    // Vérifier les clés manquantes dans les listes
    if (content.includes('.map(') && !content.includes('key=')) {
      this.addError('react', filePath, 'Liste sans propriété "key"', 'critical');
    }

    // Vérifier les hooks dans les conditions
    const lines = content.split('\n');
    let inConditional = false;
    
    lines.forEach((line, index) => {
      if (line.includes('if (') || line.includes('} else')) {
        inConditional = true;
      }
      if (line.includes('}') && inConditional) {
        inConditional = false;
      }
      
      if (inConditional && (line.includes('useState') || line.includes('useEffect'))) {
        this.addError('react', filePath, `Hook dans une condition ligne ${index + 1}`, 'critical');
      }
    });
  }

  async scanLogs() {
    console.log(chalk.yellow('📋 Analyse des logs...'));
    // Implementation simplifiée pour l'exemple
  }

  async scanDependencies() {
    console.log(chalk.yellow('📦 Analyse des dépendances...'));
    
    try {
      const packagePath = path.join(this.projectPath, 'package.json');
      
      if (!(await fs.pathExists(packagePath))) {
        this.addError('dependencies', 'package.json', 'Fichier package.json introuvable', 'critical');
        return;
      }

      const packageJson = await fs.readJson(packagePath);
      
      const allFiles = await glob('**/*.{ts,tsx,js,jsx}', { 
        cwd: this.projectPath,
        ignore: ['node_modules/**', '.next/**', 'agent-debug/**']
      });

      const usedPackages = new Set();
      
      for (const file of allFiles) {
        try {
          const content = await fs.readFile(path.join(this.projectPath, file), 'utf8');
          const importRegex = /import.*from\s+['"]([@\w][^'"]*)['"]/g;
          let match;
          
          while ((match = importRegex.exec(content)) !== null) {
            const packageName = match[1].split('/')[0];
            if (!packageName.startsWith('.') && !packageName.startsWith('@/')) {
              usedPackages.add(packageName.startsWith('@') ? packageName : packageName.split('/')[0]);
            }
          }
        } catch (error) {
          // Ignorer les erreurs de lecture
        }
      }

      const allDeps = {
        ...packageJson.dependencies || {},
        ...packageJson.devDependencies || {}
      };

      // Vérifier les packages utilisés mais non déclarés
      for (const pkg of usedPackages) {
        if (!allDeps[pkg] && !['react', 'next', 'node'].includes(pkg)) {
          this.addError('dependencies', 'package.json', `Dépendance manquante: ${pkg}`, 'warning');
        }
      }
      
    } catch (error) {
      this.addError('dependencies', 'package.json', `Erreur analyse dépendances: ${error.message}`, 'critical');
    }
  }

  addError(type, file, message, severity) {
    this.errors.push({
      type,
      file,
      message,
      severity,
      timestamp: new Date().toISOString()
    });
    
    const color = severity === 'critical' ? chalk.red : chalk.yellow;
    console.log(color(`❌ [${type.toUpperCase()}] ${file}: ${message}`));
  }

  async generateReport() {
    const reportPath = path.join(__dirname, '../reports/critical-errors.json');
    const report = {
      timestamp: new Date().toISOString(),
      totalErrors: this.errors.length,
      criticalErrors: this.errors.filter(e => e.severity === 'critical').length,
      warnings: this.errors.filter(e => e.severity === 'warning').length,
      errors: this.errors,
      summary: this.generateSummary()
    };

    await fs.ensureDir(path.dirname(reportPath));
    await fs.writeJson(reportPath, report, { spaces: 2 });
    
    console.log(chalk.blue('\n📊 RAPPORT FINAL:'));
    console.log(chalk.red(`❌ Erreurs critiques: ${report.criticalErrors}`));
    console.log(chalk.yellow(`⚠️  Avertissements: ${report.warnings}`));
    console.log(chalk.gray(`📄 Rapport sauvé: ${reportPath}`));
    
    return report;
  }

  generateSummary() {
    const summary = {};
    
    this.errors.forEach(error => {
      if (!summary[error.type]) {
        summary[error.type] = { critical: 0, warning: 0 };
      }
      summary[error.type][error.severity]++;
    });
    
    return summary;
  }
}

if (require.main === module) {
  const scanner = new CriticalErrorScanner();
  scanner.scan().then(() => {
    process.exit(0);
  }).catch(error => {
    console.error(chalk.red('💥 Erreur fatale:'), error);
    process.exit(1);
  });
}

module.exports = CriticalErrorScanner;
