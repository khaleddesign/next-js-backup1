'use client';

import { useState } from 'react';

interface DevisExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  devisIds: string[];
}

export default function DevisExportDialog({ isOpen, onClose, devisIds }: DevisExportDialogProps) {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv'>('csv');
  const [includeDetails, setIncludeDetails] = useState(true);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      
      const response = await fetch('/api/devis/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format: exportFormat,
          devisIds,
          includeDetails
        })
      });

      if (response.ok) {
        if (exportFormat === 'csv') {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `devis-export-${new Date().toISOString().split('T')[0]}.csv`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } else {
          const data = await response.json();
          alert(`Export ${exportFormat} simulé - ${data.data.length} documents`);
        }
        onClose();
      } else {
        alert('Erreur lors de l\'export');
      }
    } catch (error) {
      console.error('Erreur export:', error);
      alert('Erreur lors de l\'export');
    } finally {
      setExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        width: '100%',
        maxWidth: '500px',
        margin: '1rem'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, color: '#1e293b' }}>📤 Exporter les devis</h3>
          <button onClick={onClose} style={{
            padding: '0.5rem',
            border: 'none',
            background: '#f1f5f9',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}>
            ✕
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              Format d'export
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['csv', 'excel', 'pdf'] as const).map((format) => (
                <button
                  key={format}
                  onClick={() => setExportFormat(format)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    background: exportFormat === format ? '#3b82f6' : 'white',
                    color: exportFormat === format ? 'white' : '#374151',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={includeDetails}
                onChange={(e) => setIncludeDetails(e.target.checked)}
              />
              <span style={{ fontSize: '0.875rem' }}>Inclure les détails des lignes</span>
            </label>
          </div>

          <div style={{
            background: '#f0f9ff',
            padding: '1rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#0369a1' }}>
              📊 {devisIds.length} document{devisIds.length > 1 ? 's' : ''} sélectionné{devisIds.length > 1 ? 's' : ''}
            </p>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem'
          }}>
            <button onClick={onClose} style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              background: 'white',
              color: '#374151',
              cursor: 'pointer'
            }}>
              Annuler
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="btn-primary"
              style={{
                opacity: exporting ? 0.5 : 1,
                cursor: exporting ? 'not-allowed' : 'pointer'
              }}
            >
              {exporting ? 'Export...' : 'Exporter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
