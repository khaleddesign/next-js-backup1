"use client";

import { useState } from 'react';

interface TotauxCalculatorProps {
  lignes: Array<{
    quantite: number;
    prixUnitaire: number;
    tva?: number;
  }>;
  showDetails?: boolean;
}

export default function TotauxCalculator({ lignes, showDetails = false }: TotauxCalculatorProps) {
  const [expanded, setExpanded] = useState(showDetails);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const totalHT = lignes.reduce((sum, ligne) => 
    sum + (ligne.quantite * ligne.prixUnitaire), 0
  );
  
  const totalTVA = lignes.reduce((sum, ligne) => {
    const taux = (ligne.tva || 20) / 100;
    return sum + (ligne.quantite * ligne.prixUnitaire * taux);
  }, 0);
  
  const totalTTC = totalHT + totalTVA;

  return (
    <div style={{
      background: '#f0f9ff',
      border: '1px solid #0ea5e9',
      borderRadius: '0.75rem',
      padding: '1rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: expanded ? '1rem' : 0
      }}>
        <h3 style={{
          margin: 0,
          color: '#0369a1',
          fontSize: '1.125rem'
        }}>
          Total
        </h3>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'none',
            border: 'none',
            color: '#0ea5e9',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          {expanded ? 'Masquer' : 'Détails'}
        </button>
      </div>

      {expanded && (
        <div style={{
          borderTop: '1px solid #0ea5e9',
          paddingTop: '0.75rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem'
          }}>
            <span>Total HT:</span>
            <span>{formatCurrency(totalHT)}</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem'
          }}>
            <span>TVA:</span>
            <span>{formatCurrency(totalTVA)}</span>
          </div>
        </div>
      )}

      <div style={{
        fontSize: expanded ? '1.5rem' : '1.25rem',
        fontWeight: 'bold',
        color: '#0369a1',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>Total TTC:</span>
        <span>{formatCurrency(totalTTC)}</span>
      </div>

      {totalHT === 0 && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.5rem',
          background: '#fef3c7',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          color: '#92400e'
        }}>
          ⚠️ Ajoutez des lignes pour calculer le total
        </div>
      )}
    </div>
  );
}
