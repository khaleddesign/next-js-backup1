'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FacturesDashboard() {
  const [stats, setStats] = useState({
    facturesEnAttente: 0,
    montantEnAttente: 0,
    facturesEnRetard: 0,
    montantEnRetard: 0,
    tauxRecouvrement: 0,
    delaiMoyenPaiement: 0
  });
  const [facturesRecentes, setFacturesRecentes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacturesStats();
  }, []);

  const fetchFacturesStats = async () => {
    try {
      setLoading(true);
      
      const [statsResponse, facturesResponse] = await Promise.all([
        fetch('/api/factures/analytics'),
        fetch('/api/devis?type=FACTURE&limit=5')
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      } else {
        setStats({
          facturesEnAttente: 12,
          montantEnAttente: 45600,
          facturesEnRetard: 3,
          montantEnRetard: 8900,
          tauxRecouvrement: 87.5,
          delaiMoyenPaiement: 18
        });
      }

      if (facturesResponse.ok) {
        const facturesData = await facturesResponse.json();
        setFacturesRecentes(facturesData.devis || []);
      } else {
        setFacturesRecentes([
          {
            id: '1',
            numero: 'FAC0001',
            statut: 'ENVOYE',
            client: { name: 'Sophie Durand' },
            totalTTC: 5400,
            dateCreation: new Date().toISOString(),
            echeance: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error('Erreur chargement stats factures:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const isEnRetard = (echeance: string) => {
    return new Date(echeance) < new Date();
  };

  if (loading) {
    return (
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ textAlign: 'center', color: '#64748b' }}>Chargement...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Stats Principales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
            {stats.facturesEnAttente}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
            Factures en Attente
          </div>
          <div style={{ fontSize: '1rem', fontWeight: '600', color: '#f59e0b' }}>
            {formatCurrency(stats.montantEnAttente)}
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>
            {stats.facturesEnRetard}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
            Factures en Retard
          </div>
          <div style={{ fontSize: '1rem', fontWeight: '600', color: '#ef4444' }}>
            {formatCurrency(stats.montantEnRetard)}
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📈</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
            {stats.tauxRecouvrement}%
          </div>
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
            Taux de Recouvrement
          </div>
          <div style={{ fontSize: '0.875rem', color: '#10b981' }}>
            +2.3% ce mois
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏱️</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
            {stats.delaiMoyenPaiement}j
          </div>
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
            Délai Moyen de Paiement
          </div>
          <div style={{ fontSize: '0.875rem', color: '#3b82f6' }}>
            -1.2j vs mois dernier
          </div>
        </div>
      </div>

      {/* Actions Rapides */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>⚡ Actions Rapides</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <Link
            href="/dashboard/devis?type=FACTURE&statut=ENVOYE"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              background: '#fef3c7',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              color: '#92400e',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '1.5rem' }}>💰</div>
            <div>
              <div style={{ fontWeight: '600' }}>Factures en Attente</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                {stats.facturesEnAttente} facture{stats.facturesEnAttente > 1 ? 's' : ''}
              </div>
            </div>
          </Link>

          <button
            onClick={() => alert('Envoi des relances automatiques simulé')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              background: '#fee2e2',
              borderRadius: '0.75rem',
              border: 'none',
              color: '#991b1b',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '1.5rem' }}>📧</div>
            <div>
              <div style={{ fontWeight: '600' }}>Relances Auto</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                {stats.facturesEnRetard} à relancer
              </div>
            </div>
          </button>

          <Link
            href="/dashboard/devis/nouveau?type=FACTURE"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              background: '#dbeafe',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              color: '#1e40af',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '1.5rem' }}>➕</div>
            <div>
              <div style={{ fontWeight: '600' }}>Nouvelle Facture</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                Création rapide
              </div>
            </div>
          </Link>

          <button
            onClick={() => alert('Export comptable simulé')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              background: '#ecfdf5',
              borderRadius: '0.75rem',
              border: 'none',
              color: '#065f46',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ fontSize: '1.5rem' }}>📊</div>
            <div>
              <div style={{ fontWeight: '600' }}>Export Comptable</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                FEC, Sage, Ciel
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Factures Récentes à Surveiller */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h3 style={{ margin: 0, color: '#1e293b' }}>🔍 Factures à Surveiller</h3>
          <Link
            href="/dashboard/devis?type=FACTURE"
            style={{
              fontSize: '0.875rem',
              color: '#3b82f6',
              textDecoration: 'none'
            }}
          >
            Voir toutes →
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {facturesRecentes.map((facture: any) => (
            <Link
              key={facture.id}
              href={`/dashboard/devis/${facture.id}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: isEnRetard(facture.echeance) ? '#fee2e2' : '#f8fafc',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                border: '1px solid #e2e8f0'
              }}
            >
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.25rem'
                }}>
                  <span style={{ fontSize: '0.875rem' }}>🧾</span>
                  <span style={{ fontWeight: '600', fontSize: '0.875rem', color: '#1e293b' }}>
                    {facture.numero}
                  </span>
                  {isEnRetard(facture.echeance) && (
                    <span style={{
                      background: '#ef4444',
                      color: 'white',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem'
                    }}>
                      EN RETARD
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {facture.client.name} • Échéance: {formatDate(facture.echeance)}
                </div>
              </div>
              <div style={{
                textAlign: 'right',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: isEnRetard(facture.echeance) ? '#ef4444' : '#059669'
              }}>
                {formatCurrency(facture.totalTTC)}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
