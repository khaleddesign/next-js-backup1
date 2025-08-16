const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const rules = require('../config/rules.json');

class CriticalErrorFixer {
  constructor(projectPath = '../') {
    this.projectPath = path.resolve(__dirname, projectPath);
    this.fixes = [];
  }

  async fixErrors(reportPath) {
    console.log(chalk.blue('🔧 Démarrage des corrections automatiques...'));
    
    try {
      const report = await fs.readJson(reportPath);
      
      for (const error of report.errors) {
        if (error.severity === 'critical' && this.canAutoFix(error.type)) {
          await this.fixError(error);
        }
      }
      
      await this.generateFixReport();
      
    } catch (error) {
      console.error(chalk.red('❌ Erreur lors des corrections:'), error.message);
    }
  }

  canAutoFix(errorType) {
    return rules.autoFix[errorType] === true;
  }

  async fixError(error) {
    const filePath = path.join(this.projectPath, error.file);
    
    try {
      switch (error.type) {
        case 'imports':
          await this.fixImportError(filePath, error);
          break;
        case 'types':
          await this.fixTypeError(filePath, error);
          break;
        case 'react':
          await this.fixReactError(filePath, error);
          break;
        default:
          console.log(chalk.yellow(`⚠️  Correction manuelle requise: ${error.message}`));
      }
    } catch (fixError) {
      console.error(chalk.red(`❌ Erreur correction ${error.file}:`), fixError.message);
    }
  }

  async fixImportError(filePath, error) {
    if (error.message.includes('Import introuvable')) {
      const content = await fs.readFile(filePath, 'utf8');
      const importPath = error.message.split(': ')[1];
      
      // Essayer de trouver le bon chemin
      const possiblePaths = this.findPossibleImports(filePath, importPath);
      
      if (possiblePaths.length === 1) {
        const newContent = content.replace(
          new RegExp(`from\\s+['"](${importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})['"]+`),
          `from '${possiblePaths[0]}'`
        );
        
        await fs.writeFile(filePath, newContent);
        this.addFix('imports', filePath, `Import corrigé: ${importPath} → ${possiblePaths[0]}`);
      }
    }
  }

  async fixTypeError(filePath, error) {
    if (error.message.includes('sans types de props')) {
      const content = await fs.readFile(filePath, 'utf8');
      const componentName = error.message.match(/Composant (\w+)/)[1];
      
      // Ajouter interface de props basique
      const propsInterface = `\ninterface ${componentName}Props {\n  // TODO: Définir les props\n}\n\n`;
      
      const newContent = content.replace(
        new RegExp(`function\\s+${componentName}\\s*\\(`),
        `${propsInterface}function ${componentName}(props: ${componentName}Props) {`
      );
      
      await fs.writeFile(filePath, newContent);
      this.addFix('types', filePath, `Interface de props ajoutée pour ${componentName}`);
    }
  }

  async fixReactError(filePath, error) {
    const content = await fs.readFile(filePath, 'utf8');
    let newContent = content;
    
    if (error.message.includes('Liste sans propriété "key"')) {
      // Ajouter des clés basiques aux éléments de liste
      newContent = newContent.replace(
        /(\w+)\.map\(\((\w+),?\s*(\w+)?\)\s*=>\s*</g,
        '$1.map(($2, $3) => <'
      ).replace(
        /\.map\(\((\w+),?\s*(\w+)?\)\s*=>\s*<(\w+)/g,
        '.map(($1, $2) => <$3 key={$2}'
      );
    }
    
    if (newContent !== content) {
      await fs.writeFile(filePath, newContent);
      this.addFix('react', filePath, 'Propriétés "key" ajoutées aux listes');
    }
  }

  findPossibleImports(currentFile, importPath) {
    // Logique simplifiée pour trouver les imports possibles
    const basePath = path.dirname(currentFile);
    const possiblePaths = [];
    
    // Vérifier avec différentes extensions
    const extensions = ['.ts', '.tsx', '.js', '.jsx'];
    
    for (const ext of extensions) {
      const testPath = path.join(basePath, importPath + ext);
      if (fs.existsSync(testPath)) {
        possiblePaths.push('./' + path.relative(basePath, testPath));
      }
    }
    
    return possiblePaths;
  }

  addFix(type, file, description) {
    this.fixes.push({
      type,
      file: path.relative(this.projectPath, file),
      description,
      timestamp: new Date().toISOString()
    });
    
    console.log(chalk.green(`✅ [${type.toUpperCase()}] ${description}`));
  }

  async generateFixReport() {
    const reportPath = path.join(__dirname, '../reports/fixes-applied.json');
    const report = {
      timestamp: new Date().toISOString(),
      totalFixes: this.fixes.length,
      fixes: this.fixes
    };

    await fs.writeJson(reportPath, report, { spaces: 2 });
    
    console.log(chalk.blue('\n🔧 CORRECTIONS APPLIQUÉES:'));
    console.log(chalk.green(`✅ Total: ${report.totalFixes} corrections`));
    console.log(chalk.gray(`📄 Rapport: ${reportPath}`));
  }
}

module.exports = CriticalErrorFixer;
