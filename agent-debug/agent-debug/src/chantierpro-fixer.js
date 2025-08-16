const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class ChantierProFixer {
  constructor(projectPath = '../') {
    this.projectPath = path.resolve(__dirname, projectPath);
    this.fixes = [];
  }

  async fixCriticalErrors() {
    console.log(chalk.blue('🔧 Correction des erreurs critiques ChantierPro...'));
    
    try {
      await this.fixMissingImports();
      await this.fixSyntaxErrors();
      await this.createMissingComponents();
      await this.generateReport();
      
    } catch (error) {
      console.error(chalk.red('❌ Erreur lors des corrections:'), error.message);
    }
  }

  async fixMissingImports() {
    console.log(chalk.yellow('📦 Correction des imports manquants...'));
    
    const missingHooks = [
      'useDocuments',
      'useToasts'
    ];
    
    for (const hook of missingHooks) {
      await this.createHook(hook);
    }
  }

  async createHook(hookName) {
    const hookPath = path.join(this.projectPath, 'hooks/' + hookName + '.ts');
    
    if (await fs.pathExists(hookPath)) {
      console.log(chalk.gray('✓ Hook ' + hookName + ' existe déjà'));
      return;
    }

    let hookContent = '';
    
    switch (hookName) {
      case 'useDocuments':
        hookContent = this.generateUseDocumentsHook();
        break;
      case 'useToasts':
        hookContent = this.generateUseToastsHook();
        break;
    }
    
    if (hookContent) {
      await fs.ensureDir(path.dirname(hookPath));
      await fs.writeFile(hookPath, hookContent);
      console.log(chalk.green('✅ Hook ' + hookName + ' créé'));
      this.fixes.push('Hook ' + hookName + ' créé');
    }
  }

  generateUseDocumentsHook() {
    return `'use client';

import { useState, useEffect, useCallback } from 'react';

interface Document {
  id: string;
  nom: string;
  nomOriginal: string;
  type: string;
  taille: number;
  url: string;
  urlThumbnail?: string;
  uploader: {
    name: string;
    role: string;
  };
  chantier?: {
    nom: string;
  };
  metadonnees?: any;
  tags: string[];
  createdAt: string;
}

interface UseDocumentsOptions {
  chantierId?: string;
  type?: string;
  search?: string;
  dossier?: string | null;
}

export function useDocuments(options: UseDocumentsOptions = {}) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    photos: 0,
    pdfs: 0,
    plans: 0
  });

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulation de données pour le développement
      const mockDocuments: Document[] = [
        {
          id: '1',
          nom: 'Photo avant travaux - Salon',
          nomOriginal: 'salon_avant.jpg',
          type: 'PHOTO',
          taille: 2048000,
          url: '/mock/photo1.jpg',
          urlThumbnail: '/mock/thumb1.jpg',
          uploader: { name: 'Jean Dupont', role: 'Chef de chantier' },
          chantier: { nom: 'Rénovation Villa Moderne' },
          tags: ['avant', 'salon'],
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          nom: 'Plan technique - Électricité',
          nomOriginal: 'plan_elec.pdf',
          type: 'PLAN',
          taille: 1024000,
          url: '/mock/plan1.pdf',
          uploader: { name: 'Marie Martin', role: 'Architecte' },
          chantier: { nom: 'Rénovation Villa Moderne' },
          tags: ['électricité', 'plans'],
          createdAt: new Date().toISOString()
        }
      ];

      setDocuments(mockDocuments);
      setStats({
        total: mockDocuments.length,
        photos: mockDocuments.filter(d => d.type === 'PHOTO').length,
        pdfs: mockDocuments.filter(d => d.type === 'PDF').length,
        plans: mockDocuments.filter(d => d.type === 'PLAN').length
      });

    } catch (err) {
      console.error('Erreur fetchDocuments:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [options]);

  const uploadDocument = useCallback(async (file: File, metadata: any) => {
    try {
      console.log('Upload document:', file.name);
      await fetchDocuments();
      return { success: true, id: Date.now().toString() };
    } catch (err) {
      throw err;
    }
  }, [fetchDocuments]);

  const deleteDocument = useCallback(async (id: string) => {
    try {
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      return true;
    } catch (err) {
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    loading,
    error,
    stats,
    actions: {
      fetchDocuments,
      uploadDocument,
      deleteDocument,
      refresh: fetchDocuments
    }
  };
}`;
  }

  generateUseToastsHook() {
    return `'use client';

import { useState, useCallback } from 'react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: Toast['type'], title: string, message: string, duration = 5000) => {
    const id = Date.now().toString();
    const toast: Toast = { id, type, title, message, duration };
    
    setToasts(prev => [...prev, toast]);
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((title: string, message: string) => {
    console.log('✅ ' + title + ': ' + message);
    return addToast('success', title, message);
  }, [addToast]);

  const error = useCallback((title: string, message: string) => {
    console.error('❌ ' + title + ': ' + message);
    return addToast('error', title, message);
  }, [addToast]);

  const warning = useCallback((title: string, message: string) => {
    console.warn('⚠️ ' + title + ': ' + message);
    return addToast('warning', title, message);
  }, [addToast]);

  const info = useCallback((title: string, message: string) => {
    console.info('ℹ️ ' + title + ': ' + message);
    return addToast('info', title, message);
  }, [addToast]);

  return {
    toasts,
    success,
    error,
    warning,
    info,
    removeToast
  };
}`;
  }

  async fixSyntaxErrors() {
    console.log(chalk.yellow('🔧 Correction des erreurs de syntaxe...'));
    
    try {
      const files = await this.getAllTSFiles();
      
      for (const file of files) {
        try {
          const filePath = path.join(this.projectPath, file);
          const content = await fs.readFile(filePath, 'utf8');
          
          let fixedContent = content;
          
          // Ajouter points-virgules manquants aux imports
          fixedContent = fixedContent.replace(
            /^(import .+ from ['"][^'"]+['"])$/gm,
            '$1;'
          );
          
          if (fixedContent !== content) {
            await fs.writeFile(filePath, fixedContent);
            console.log(chalk.green('✅ Syntaxe corrigée: ' + file));
            this.fixes.push('Syntaxe corrigée: ' + file);
          }
          
        } catch (error) {
          // Ignorer les erreurs de fichiers
        }
      }
    } catch (error) {
      console.log(chalk.yellow('⚠️ Erreur correction syntaxe: ' + error.message));
    }
  }

  async getAllTSFiles() {
    const files = [];
    const projectPath = this.projectPath;
    
    async function scanDir(dir) {
      try {
        const items = await fs.readdir(dir);
        
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = await fs.stat(fullPath);
          
          if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
            await scanDir(fullPath);
          } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
            files.push(path.relative(projectPath, fullPath));
          }
        }
      } catch (error) {
        // Ignorer les erreurs
      }
    }
    
    await scanDir(this.projectPath);
    return files;
  }

  async createMissingComponents() {
    console.log(chalk.yellow('🧩 Création des composants manquants...'));
    
    await this.createComponent('documents/FileCard');
    await this.createComponent('documents/FolderTree');
  }

  async createComponent(componentPath) {
    const fullPath = path.join(this.projectPath, 'components/' + componentPath + '.tsx');
    
    if (await fs.pathExists(fullPath)) {
      console.log(chalk.gray('✓ Composant ' + componentPath + ' existe déjà'));
      return;
    }

    const componentName = path.basename(componentPath);
    const componentContent = `'use client';

export interface ${componentName}Props {
  // TODO: Définir les props
}

export default function ${componentName}(props: ${componentName}Props) {
  return (
    <div>
      <h3>${componentName}</h3>
      <p>Composant en cours de développement</p>
    </div>
  );
}
`;

    await fs.ensureDir(path.dirname(fullPath));
    await fs.writeFile(fullPath, componentContent);
    console.log(chalk.green('✅ Composant ' + componentPath + ' créé'));
    this.fixes.push('Composant ' + componentPath + ' créé');
  }

  async generateReport() {
    const reportPath = path.join(__dirname, '../reports/chantierpro-fixes.json');
    const report = {
      timestamp: new Date().toISOString(),
      totalFixes: this.fixes.length,
      fixes: this.fixes
    };

    await fs.writeJson(reportPath, report, { spaces: 2 });
    
    console.log(chalk.blue.bold('\n🎉 CORRECTIONS CHANTIERPRO TERMINÉES'));
    console.log(chalk.green('✅ Total: ' + report.totalFixes + ' corrections appliquées'));
    console.log(chalk.gray('📄 Rapport: ' + reportPath));
  }
}

if (require.main === module) {
  const fixer = new ChantierProFixer();
  fixer.fixCriticalErrors();
}

module.exports = ChantierProFixer;
