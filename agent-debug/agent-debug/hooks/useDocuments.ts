'use client';

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
}