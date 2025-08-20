'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Image, 
  Upload, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Download,
  Folder,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import FileCard from '@/components/documents/FileCard';
import FolderTree from '@/components/documents/FolderTree';
import { useDocuments } from '@/hooks/useDocuments';
import { useToasts } from '@/hooks/useToasts';

export default function DocumentsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    chantier: 'TOUS',
    type: 'TOUS',
    search: ''
  });
  const [selectedDossier, setSelectedDossier] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const { documents, loading, error, stats, actions } = useDocuments({
    chantierId: filters.chantier !== 'TOUS' ? filters.chantier : undefined,
    type: filters.type !== 'TOUS' ? filters.type : undefined,
    search: filters.search,
    dossier: selectedDossier
  });

  const { success, error: showError } = useToasts();

  useEffect(() => {
    if (error) {
      showError('Erreur', error);
    }
  }, [error, showError]);

  const handleBulkDownload = async () => {
    if (selectedFiles.length === 0) return;
    
    try {
      success('Succès', `Téléchargement de ${selectedFiles.length} fichier(s) démarré`);
      setSelectedFiles([]);
    } catch (error) {
      showError('Erreur', 'Erreur lors du téléchargement');
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const mockChantiers = [
    { id: 'chantier-1', nom: 'Rénovation Villa Moderne' },
    { id: 'chantier-2', nom: 'Extension Maison Familiale' },
    { id: 'chantier-3', nom: 'Construction Pavillon Neuf' }
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>
                Mes Documents
              </h1>
              <p style={{ color: '#64748b', fontSize: '1rem' }}>
                Gérez et suivez tous vos documents et photos de chantier
              </p>
            </div>
            <Link
              href="/dashboard/documents/upload"
              className="btn btn-primary"
              style={{ textDecoration: 'none' }}
            >
              <Upload style={{ width: '16px', height: '16px' }} />
              Uploader des fichiers
            </Link>
          </div>

          {/* Barre de recherche */}
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <Search 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                width: '20px', 
                height: '20px', 
                color: '#94a3b8' 
              }} 
            />
            <input
              type="text"
              placeholder="Rechercher un document..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px 12px 12px 44px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                color: '#1e293b'
              }}
            />
          </div>

          {/* Filtres */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <span style={{ color: '#64748b', fontSize: '14px', alignSelf: 'center' }}>Filtrer par type :</span>
            {[
              { key: 'TOUS', label: 'Tous les types', color: '#64748b' },
              { key: 'PHOTO', label: 'Photos', color: '#10b981' },
              { key: 'PDF', label: 'PDF', color: '#ef4444' },
              { key: 'PLAN', label: 'Plans', color: '#3b82f6' },
              { key: 'FACTURE', label: 'Factures', color: '#f59e0b' }
            ].map((type) => (
              <button
                key={type.key}
                onClick={() => setFilters(prev => ({ ...prev, type: type.key }))}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  backgroundColor: filters.type === type.key ? type.color : '#f1f5f9',
                  color: filters.type === type.key ? 'white' : type.color,
                  transition: 'all 0.2s ease'
                }}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#3b82f6', marginBottom: '0.5rem' }}>
              {documents.length}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Documents total</div>
          </div>
          
          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#10b981', marginBottom: '0.5rem' }}>
              {documents.filter(d => d.type === 'PHOTO').length}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Photos</div>
          </div>
          
          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ef4444', marginBottom: '0.5rem' }}>
              {documents.filter(d => d.type === 'PDF').length}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>PDF</div>
          </div>
          
          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#f59e0b', marginBottom: '0.5rem' }}>
              {Math.round(documents.reduce((sum, d) => sum + d.taille, 0) / (1024 * 1024))}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>MB utilisés</div>
          </div>
        </div>

        {/* Contenu principal */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
          {/* Sidebar */}
          <div>
            <FolderTree
              documents={documents}
              selectedDossier={selectedDossier}
              onDossierSelect={setSelectedDossier}
            />
          </div>

          {/* Zone principale */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                  {selectedDossier ? `${selectedDossier}` : 'Tous les documents'}
                </h2>
                <span style={{ color: '#64748b', fontSize: '14px' }}>
                  {documents.length} fichier{documents.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {selectedFiles.length > 0 && (
                  <button
                    onClick={handleBulkDownload}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Download style={{ width: '16px', height: '16px' }} />
                    Télécharger ({selectedFiles.length})
                  </button>
                )}

                <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '6px' }}>
                  <button
                    onClick={() => setViewMode('grid')}
                    style={{
                      padding: '6px',
                      border: 'none',
                      borderRadius: '4px',
                      backgroundColor: viewMode === 'grid' ? 'white' : 'transparent',
                      color: viewMode === 'grid' ? '#1e293b' : '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: viewMode === 'grid' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    <Grid style={{ width: '16px', height: '16px' }} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    style={{
                      padding: '6px',
                      border: 'none',
                      borderRadius: '4px',
                      backgroundColor: viewMode === 'list' ? 'white' : 'transparent',
                      color: viewMode === 'list' ? '#1e293b' : '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: viewMode === 'list' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    <List style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem' }}>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  border: '3px solid #f1f5f9', 
                  borderTop: '3px solid #3b82f6', 
                  borderRadius: '50%', 
                  animation: 'spin 1s linear infinite' 
                }}></div>
                <span style={{ marginLeft: '12px', color: '#64748b' }}>Chargement des documents...</span>
              </div>
            ) : documents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <FileText style={{ width: '64px', height: '64px', color: '#cbd5e1', margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                  Aucun document
                </h3>
                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                  Commencez par uploader vos premiers fichiers
                </p>
                <Link
                  href="/dashboard/documents/upload"
                  className="btn btn-primary"
                  style={{ textDecoration: 'none' }}
                >
                  <Upload style={{ width: '16px', height: '16px' }} />
                  Uploader des fichiers
                </Link>
              </div>
            ) : (
              <div style={viewMode === 'grid' 
                ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }
                : { display: 'flex', flexDirection: 'column', gap: '8px' }
              }>
                {documents.map((document) => (
                  <FileCard
                    key={document.id}
                    document={document}
                    viewMode={viewMode}
                    selected={selectedFiles.includes(document.id)}
                    onSelect={() => toggleFileSelection(document.id)}
                    onClick={() => window.location.href = `/dashboard/documents/${document.id}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
