import { DevisData, DevisDetail } from "@/types/devis";'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DevisCard from '@/components/devis/DevisCard';
import DevisStats from '@/components/devis/DevisStats';
import DevisFilters from '@/components/devis/DevisFilters';
import DevisBulkActions from '@/components/devis/DevisBulkActions';
import { useDevis } from '@/hooks/useDevis';

export default function DevisPage() {
  const [activeTab, setActiveTab] = useState<'TOUS' | 'DEVIS' | 'FACTURE'>('TOUS');
  const [statusFilter, setStatusFilter] = useState('TOUS');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { devis, loading, error, pagination, actions } = useDevis({
    search: searchTerm,
    statut: statusFilter !== 'TOUS' ? statusFilter : undefined,
    type: activeTab !== 'TOUS' ? activeTab : undefined
  });

  const handleSelectDevis = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(devis.map((d: any) => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem' 
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#1e293b',
            margin: '0 0 0.5rem 0' 
          }}>
            Devis & Factures
          </h1>
          <p style={{ color: '#64748b', margin: 0 }}>
            Gestion complète de vos devis et factures
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link 
            href="/dashboard/devis/nouveau?type=DEVIS"
            className="btn-primary"
            style={{ textDecoration: 'none' }}
          >
            💰 Nouveau Devis
          </Link>
          <Link 
            href="/dashboard/devis/nouveau?type=FACTURE"
            className="btn-primary"
            style={{ textDecoration: 'none' }}
          >
            🧾 Nouvelle Facture
          </Link>
        </div>
      </div>

      <DevisStats />

      <div className="card" style={{ padding: '1.5rem' }}>
        <DevisFilters
          activeTab={activeTab}
          onTabChange={setActiveTab}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {devis.length > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem',
            padding: '0.75rem',
            background: '#f8fafc',
            borderRadius: '0.5rem'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: '#374151'
            }}>
              <input
                type="checkbox"
                checked={selectedIds.length === devis.length && devis.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
              Sélectionner tout ({devis.length})
            </label>
            
            {selectedIds.length > 0 && (
              <span style={{
                fontSize: '0.875rem',
                color: '#3b82f6',
                fontWeight: '500'
              }}>
                {selectedIds.length} sélectionné{selectedIds.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            color: '#64748b' 
          }}>
            Chargement...
          </div>
        ) : error ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#ef4444'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <p>{error}</p>
            <button
              onClick={actions.refresh}
              className="btn-primary"
              style={{ marginTop: '1rem' }}
            >
              Réessayer
            </button>
          </div>
        ) : devis.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            color: '#64748b' 
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
            <p>Aucun {activeTab === 'DEVIS' ? 'devis' : activeTab === 'FACTURE' ? 'facture' : 'document'} trouvé</p>
            <Link 
              href="/dashboard/devis/nouveau"
              className="btn-primary"
              style={{ textDecoration: 'none', marginTop: '1rem' }}
            >
              Créer le premier
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            {devis.map((devisItem: any) => (
              <div key={devisItem.id} style={{ position: 'relative' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(devisItem.id)}
                  onChange={(e) => handleSelectDevis(devisItem.id, e.target.checked)}
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    left: '0.75rem',
                    zIndex: 10,
                    transform: 'scale(1.2)'
                  }}
                />
                <DevisCard devis={devisItem} />
              </div>
            ))}
          </div>
        )}

        {pagination.pages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '2rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e2e8f0'
          }}>
            <button
              onClick={() => actions.loadPage(pagination.page - 1)}
              disabled={pagination.page === 1}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                background: pagination.page === 1 ? '#f9fafb' : 'white',
                color: pagination.page === 1 ? '#9ca3af' : '#374151',
                cursor: pagination.page === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              ← Précédent
            </button>
            
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Page {pagination.page} sur {pagination.pages}
            </span>
            
            <button
              onClick={() => actions.loadPage(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                background: pagination.page === pagination.pages ? '#f9fafb' : 'white',
                color: pagination.page === pagination.pages ? '#9ca3af' : '#374151',
                cursor: pagination.page === pagination.pages ? 'not-allowed' : 'pointer'
              }}
            >
              Suivant →
            </button>
          </div>
        )}
      </div>

      <DevisBulkActions
        selectedIds={selectedIds}
        onClearSelection={clearSelection}
        onRefresh={actions.refresh}
      />
    </div>
  );
}
