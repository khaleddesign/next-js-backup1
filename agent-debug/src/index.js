#!/usr/bin/env node

const chalk = require('chalk');
const path = require('path');
const CriticalErrorScanner = require('./scanner');
const CriticalErrorFixer = require('./fixer');

class ChantierProDebugAgent {
  constructor() {
    this.projectPath = process.argv[2] || '../';
  }

  async run() {
    console.log(chalk.blue.bold('🤖 AGENT DEBUG CHANTIERPRO - ERREURS CRITIQUES'));
    console.log(chalk.gray('='.repeat(60)));
    
    try {
      // Phase 1: Scanner
      console.log(chalk.yellow('\n📍 PHASE 1: SCAN DES ERREURS CRITIQUES'));
      const scanner = new CriticalErrorScanner(this.projectPath);
      const report = await scanner.scan();
      
      if (report.criticalErrors === 0) {
        console.log(chalk.green('\n🎉 Aucune erreur critique détectée !'));
        return;
      }
      
      // Phase 2: Auto-fix
      console.log(chalk.yellow('\n📍 PHASE 2: CORRECTIONS AUTOMATIQUES'));
      const fixer = new CriticalErrorFixer(this.projectPath);
      await fixer.fixErrors(path.join(__dirname, '../reports/critical-errors.json'));
      
      // Phase 3: Re-scan
      console.log(chalk.yellow('\n📍 PHASE 3: VÉRIFICATION POST-CORRECTION'));
      const postScanner = new CriticalErrorScanner(this.projectPath);
      const postReport = await postScanner.scan();
      
      this.printFinalSummary(report, postReport);
      
    } catch (error) {
      console.error(chalk.red('\n💥 ERREUR FATALE:'), error.message);
      process.exit(1);
    }
  }

  printFinalSummary(beforeReport, afterReport) {
    console.log(chalk.blue.bold('\n📊 RÉSUMÉ FINAL'));
    console.log(chalk.gray('='.repeat(40)));
    
    console.log(chalk.red('❌ Erreurs avant: ' + beforeReport.criticalErrors));
    console.log(chalk.green('✅ Erreurs après: ' + afterReport.criticalErrors));
    
    const fixed = beforeReport.criticalErrors - afterReport.criticalErrors;
    if (fixed > 0) {
      console.log(chalk.green('🔧 Erreurs corrigées: ' + fixed));
    }
    
    if (afterReport.criticalErrors > 0) {
      console.log(chalk.yellow('\n⚠️  ACTIONS REQUISES:'));
      console.log(chalk.gray('Les erreurs restantes nécessitent une correction manuelle.'));
      console.log(chalk.gray('Consultez le rapport: reports/critical-errors.json'));
    } else {
      console.log(chalk.green('\n🎉 Toutes les erreurs critiques ont été corrigées !'));
    }
  }
}

// Exécution
if (require.main === module) {
  const agent = new ChantierProDebugAgent();
  agent.run();
}

module.exports = ChantierProDebugAgent;
