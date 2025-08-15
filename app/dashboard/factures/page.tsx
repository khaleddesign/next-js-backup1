'use client';

import { useState } from 'react';
import FacturesDashboard from '@/components/factures/FacturesDashboard';
import Link from 'next/link';

export default function FacturesPage() {
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
            🧾 Gestion des Factures
          </h1>
          <p style={{ color: '#64748b', margin: 0 }}>
            Suivi des paiements, relances automatiques et recouvrement
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link 
            href="/dashboard/devis?type=FACTURE"
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              background: 'white',
              color: '#374151',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}
          >
            📋 Toutes les Factures
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

      <FacturesDashboard />
    </div>
  );
}
