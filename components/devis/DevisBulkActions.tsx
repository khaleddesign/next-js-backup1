'use client';

import { useState } from 'react';
import DevisExportDialog from './DevisExportDialog';

interface DevisBulkActionsProps {
  selectedIds: string[];
  onClearSelection: () => void;
  onRefresh: () => void;
}

export default function DevisBulkActions({ 
  selectedIds, 
  onClearSelection, 
  onRefresh 
}: DevisBulkActionsProps) {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleBulkAction = async (action: string) => {
    try {
      setActionLoading(action);
      
      switch (action) {
        case 'send':
          const promises = selectedIds.map(id => 
            fetch(`/api/devis/${id}/send`, { 
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({})
            })
          );
          await Promise.all(promises);
          alert(`${selectedIds.length} document(s) envoyé(s)`);
          onClearSelection();
          onRefresh();
          break;
          
        case 'export':
          setShowExportDialog(true);
          break;
      }
    } catch (error) {
      console.error('Erreur action groupée:', error);
      alert('Erreur lors de l\'action groupée');
    } finally {
      setActionLoading(null);
    }
  };

  if (selectedIds.length === 0) return null;

  return (
    <>
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '1rem',
        padding: '1rem 1.5rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem',
          color: '#374151'
        }}>
          <div style={{
            background: '#3b82f6',
            color: 'white',
            borderRadius: '50%',
            width: '1.5rem',
            height: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}>
            {selectedIds.length}
          </div>
          <span>
            {selectedIds.length} document{selectedIds.length > 1 ? 's' : ''} sélectionné{selectedIds.length > 1 ? 's' : ''}
          </span>
        </div>

        <div style={{ height: '1.5rem', width: '1px', background: '#e2e8f0' }} />

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => handleBulkAction('send')}
            disabled={actionLoading === 'send'}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '0.5rem',
              background: '#10b981',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            {actionLoading === 'send' ? '📤 Envoi...' : '📤 Envoyer'}
          </button>

          <button
            onClick={() => handleBulkAction('export')}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              background: 'white',
              color: '#374151',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            📊 Exporter
          </button>
        </div>

        <div style={{ height: '1.5rem', width: '1px', background: '#e2e8f0' }} />

        <button
          onClick={onClearSelection}
          style={{
            padding: '0.5rem',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: '#64748b'
          }}
        >
          ✕
        </button>
      </div>

      <DevisExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        devisIds={selectedIds}
      />
    </>
  );
}
