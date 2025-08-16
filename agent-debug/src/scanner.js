const fs = require('fs-extra');
const path = require('path');
const { glob } = require('glob');
const chalk = require('chalk');

class CriticalErrorScanner {
  constructor(projectPath = '../') {
    this.projectPath = path.resolve(__dirname, projectPath);
    this.errors = [];
  }

  async scan() {
    console.log(chalk.blue('🔍 Démarrage du scan des erreurs critiques...'));
    console.log(chalk.gray('📁 Répertoire: ' + this.projectPath));
    
    try {
      await this.scanCodeFiles();
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
      
      console.log(chalk.green('✅ ' + files.length + ' fichiers analysés'));
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
      
    } catch (error) {
      this.addError('file', filePath, 'Erreur lecture fichier: ' + error.message, 'critical');
    }
  }

  checkSyntaxErrors(filePath, content) {
    const openBraces = (content.match(/\{/g) || []).length;
    const closeBraces = (content.match(/\}/g) || []).length;
    
    if (openBraces !== closeBraces) {
      this.addError('syntax', filePath, 'Accolades non équilibrées', 'critical');
    }

    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;
    
    if (openParens !== closeParens) {
      this.addError('syntax', filePath, 'Parenthèses non équilibrées', 'critical');
    }
  }

  async checkImportErrors(filePath, content) {
    const importRegex = /import.*from\s+['"](.*?)['"]/g;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      
      if (importPath.startsWith('./') || importPath.startsWith('../')) {
        const currentDir = path.dirname(path.join(this.projectPath, filePath));
        const resolvedPath = path.resolve(currentDir, importPath);
        
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
            // Ignorer les erreurs
          }
        }
        
        if (!exists) {
          this.addError('imports', filePath, 'Import introuvable: ' + importPath, 'critical');
        }
      }
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
    console.log(color('❌ [' + type.toUpperCase() + '] ' + file + ': ' + message));
  }

  async generateReport() {
    const reportPath = path.join(__dirname, '../reports/critical-errors.json');
    const report = {
      timestamp: new Date().toISOString(),
      totalErrors: this.errors.length,
      criticalErrors: this.errors.filter(e => e.severity === 'critical').length,
      warnings: this.errors.filter(e => e.severity === 'warning').length,
      errors: this.errors
    };

    await fs.ensureDir(path.dirname(reportPath));
    await fs.writeJson(reportPath, report, { spaces: 2 });
    
    console.log(chalk.blue('\n📊 RAPPORT FINAL:'));
    console.log(chalk.red('❌ Erreurs critiques: ' + report.criticalErrors));
    console.log(chalk.yellow('⚠️  Avertissements: ' + report.warnings));
    console.log(chalk.gray('📄 Rapport sauvé: ' + reportPath));
    
    return report;
  }
}

module.exports = CriticalErrorScanner;
