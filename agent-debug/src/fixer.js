const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class CriticalErrorFixer {
  constructor(projectPath = '../') {
    this.projectPath = path.resolve(__dirname, projectPath);
    this.fixes = [];
  }

  async fixErrors(reportPath) {
    console.log(chalk.blue('🔧 Corrections automatiques...'));
    
    try {
      const report = await fs.readJson(reportPath);
      console.log(chalk.green('✅ Rapport lu: ' + report.errors.length + ' erreurs détectées'));
      
      await this.generateFixReport();
      
    } catch (error) {
      console.error(chalk.red('❌ Erreur corrections:'), error.message);
    }
  }

  async generateFixReport() {
    const reportPath = path.join(__dirname, '../reports/fixes-applied.json');
    const report = {
      timestamp: new Date().toISOString(),
      totalFixes: this.fixes.length,
      fixes: this.fixes
    };

    await fs.writeJson(reportPath, report, { spaces: 2 });
    console.log(chalk.blue('🔧 Fixes terminés: ' + report.totalFixes));
  }
}

module.exports = CriticalErrorFixer;
