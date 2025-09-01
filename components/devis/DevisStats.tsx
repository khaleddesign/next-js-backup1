import { useState, useEffect } from 'react';

export default function DevisStats() {
  const [stats, setStats] = useState({
    totalDevis: 0,
    totalFactures: 0,
    montantTotal: 0,
    enAttente: 0
  });

  useEffect(() => {
    fetch('/api/devis/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Erreur stats:', err));
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="stats-grid" style={{ marginBottom: '2rem' }}>
      <div className="stat-card">
        <h3>Total Devis</h3>
        <div className="stat-value">{stats.totalDevis}</div>
      </div>
      <div className="stat-card">
        <h3>Total Factures</h3>
        <div className="stat-value">{stats.totalFactures}</div>
      </div>
      <div className="stat-card">
        <h3>Montant Total</h3>
        <div className="stat-value">{formatCurrency(stats.montantTotal)}</div>
      </div>
      <div className="stat-card">
        <h3>En Attente</h3>
        <div className="stat-value">{stats.enAttente}</div>
      </div>
    </div>
  );
}
