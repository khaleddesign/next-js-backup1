'use client';

import { useState } from 'react';

interface LigneDevisProps {
  ligne: {
    designation: string;
    quantite: string;
    prixUnitaire: string;
    tva: string;
    total: number;
  };
  index: number;
  canDelete: boolean;
  onUpdate: (index: number, field: string, value: string) => void;
  onDelete: (index: number) => void;
  readOnly?: boolean;
}

export default function LigneDevis({ 
  ligne, 
  index, 
  canDelete, 
  onUpdate, 
  onDelete,
  readOnly = false 
}: LigneDevisProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'designation':
        if (!value.trim()) {
          newErrors[field] = 'Désignation requise';
        } else {
          delete newErrors[field];
        }
        break;
      case 'quantite':
        if (!value || parseFloat(value) <= 0) {
          newErrors[field] = 'Quantité invalide';
        } else {
          delete newErrors[field];
        }
        break;
      case 'prixUnitaire':
        if (!value || parseFloat(value) < 0) {
          newErrors[field] = 'Prix invalide';
        } else {
          delete newErrors[field];
        }
        break;
      case 'tva':
        const tvaValue = parseFloat(value);
        if (isNaN(tvaValue) || tvaValue < 0 || tvaValue > 100) {
          newErrors[field] = 'TVA invalide (0-100%)';
        } else {
          delete newErrors[field];
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleChange = (field: string, value: string) => {
    validateField(field, value);
    onUpdate(index, field, value);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (readOnly) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 2fr 80px 100px 80px 100px',
        gap: '1rem',
        alignItems: 'center',
        padding: '1rem 0',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          fontWeight: '500',
          color: '#64748b',
          fontSize: '0.875rem'
        }}>
          {index + 1}
        </div>
        <div style={{ fontSize: '0.875rem' }}>
          {ligne.designation}
        </div>
        <div style={{ 
          textAlign: 'center',
          fontSize: '0.875rem',
          color: '#64748b'
        }}>
          {ligne.quantite}
        </div>
        <div style={{ 
          textAlign: 'right',
          fontSize: '0.875rem',
          color: '#64748b'
        }}>
          {formatCurrency(parseFloat(ligne.prixUnitaire))}
        </div>
        <div style={{ 
          textAlign: 'center',
          fontSize: '0.875rem',
          color: '#64748b'
        }}>
          {ligne.tva}%
        </div>
        <div style={{ 
          textAlign: 'right',
          fontWeight: '500',
          fontSize: '0.875rem'
        }}>
          {formatCurrency(ligne.total)}
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 2fr 80px 100px 80px 100px 40px',
        gap: '0.5rem',
        alignItems: 'center',
        padding: '0.75rem 0'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1.5rem',
          height: '1.5rem',
          background: '#f1f5f9',
          borderRadius: '50%',
          fontSize: '0.75rem',
          fontWeight: '500',
          color: '#64748b'
        }}>
          {index + 1}
        </div>

        <div>
          <input
            type="text"
            value={ligne.designation}
            onChange={(e) => handleChange('designation', e.target.value)}
            placeholder="Description du service/produit"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: `1px solid ${errors.designation ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              background: 'white'
            }}
          />
          {errors.designation && (
            <div style={{
              fontSize: '0.75rem',
              color: '#ef4444',
              marginTop: '0.25rem'
            }}>
              {errors.designation}
            </div>
          )}
        </div>

        <div>
          <input
            type="number"
            value={ligne.quantite}
            onChange={(e) => handleChange('quantite', e.target.value)}
            min="0"
            step="0.01"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: `1px solid ${errors.quantite ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              textAlign: 'center',
              background: 'white'
            }}
          />
          {errors.quantite && (
            <div style={{
              fontSize: '0.75rem',
              color: '#ef4444',
              marginTop: '0.25rem'
            }}>
              {errors.quantite}
            </div>
          )}
        </div>

        <div>
          <input
            type="number"
            value={ligne.prixUnitaire}
            onChange={(e) => handleChange('prixUnitaire', e.target.value)}
            min="0"
            step="0.01"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: `1px solid ${errors.prixUnitaire ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              textAlign: 'right',
              background: 'white'
            }}
          />
          {errors.prixUnitaire && (
            <div style={{
              fontSize: '0.75rem',
              color: '#ef4444',
              marginTop: '0.25rem'
            }}>
              {errors.prixUnitaire}
            </div>
          )}
        </div>

        <div>
          <select
            value={ligne.tva}
            onChange={(e) => handleChange('tva', e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: `1px solid ${errors.tva ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              textAlign: 'center',
              background: 'white'
            }}
          >
            <option value="0">0%</option>
            <option value="5.5">5.5%</option>
            <option value="10">10%</option>
            <option value="20">20%</option>
          </select>
          {errors.tva && (
            <div style={{
              fontSize: '0.75rem',
              color: '#ef4444',
              marginTop: '0.25rem'
            }}>
              {errors.tva}
            </div>
          )}
        </div>

        <div style={{
          padding: '0.5rem',
          textAlign: 'right',
          fontWeight: '500',
          fontSize: '0.875rem',
          color: ligne.total > 0 ? '#059669' : '#64748b'
        }}>
          {formatCurrency(ligne.total)}
        </div>

        <button
          onClick={() => onDelete(index)}
          disabled={!canDelete}
          title={canDelete ? 'Supprimer cette ligne' : 'Au moins une ligne requise'}
          style={{
            padding: '0.25rem',
            border: 'none',
            background: !canDelete ? '#f3f4f6' : '#fee2e2',
            color: !canDelete ? '#9ca3af' : '#dc2626',
            borderRadius: '0.25rem',
            cursor: !canDelete ? 'not-allowed' : 'pointer',
            fontSize: '0.75rem',
            width: '1.5rem',
            height: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (canDelete) {
              e.currentTarget.style.background = '#fecaca';
            }
          }}
          onMouseLeave={(e) => {
            if (canDelete) {
              e.currentTarget.style.background = '#fee2e2';
            }
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
