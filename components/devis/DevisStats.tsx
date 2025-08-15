'use client';

import { useDevisStats } from '@/hooks/useDevis';

export default function DevisStats() {
  const { stats, loading } = useDevisStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card" style={{ 
            textAlign: 'center', 
            padding: '1.5rem',
            background: '#f8fafc'
          }}>
            <div style={{ 
              height: '2rem',
              background: '#e2e8f0',
              borderRadius: '0.5rem',
              marginBottom: '0.5rem'
            }} />
            <div style={{ 
              height: '1.5rem',
              background: '#e2e8f0',
              borderRadius: '0.25rem',
              marginBottom: '0.5rem'
            }} />
            <div style={{ 
              height: '1rem',
              background: '#e2e8f0',
              borderRadius: '0.25rem'
            }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    }}>
      <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
          {stats.totalDevis}
        </div>
        <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Devis</div>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧾</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f97316' }}>
          {stats.totalFactures}
        </div>
        <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Factures</div>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>
          {formatCurrency(stats.montantTotal)}
        </div>
        <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Montant Total</div>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#eab308' }}>
          {stats.enAttente}
        </div>
        <div style={{ color: '#64748b', fontSize: '0.875rem' }}>En Attente</div>
      </div>
    </div>
  );
}
