'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProjetsPage() {
  const [projets, setProjets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation projets
    setProjets([
      {
        id: '1',
        nom: 'Rénovation Appartement Duplex',
        description: 'Rénovation complète 120m²',
        statut: 'EN_COURS',
        dateDebut: new Date(),
        dateFin: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        avancement: 35
      },
      {
        id: '2',
        nom: 'Extension Maison Individuelle',
        description: 'Extension 30m² + suite parentale',
        statut: 'PLANIFICATION',
        dateDebut: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        dateFin: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
        avancement: 0
      }
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ color: '#64748b' }}>Chargement des projets...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>
          🏗️ Projets
        </h1>
        <button
          style={{
            padding: '0.75rem 1.5rem',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          ➕ Nouveau Projet
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '1.5rem'
      }}>
        {projets.map((projet) => (
          <Link
            key={projet.id}
            href={`/dashboard/projets/${projet.id}`}
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}>
              <h3 style={{
                margin: '0 0 0.5rem 0',
                color: '#1e293b',
                fontSize: '1.25rem'
              }}>
                {projet.nom}
              </h3>
              
              <p style={{
                color: '#64748b',
                fontSize: '0.875rem',
                margin: '0 0 1rem 0'
              }}>
                {projet.description}
              </p>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.875rem'
              }}>
                <div style={{
                  background: projet.statut === 'EN_COURS' ? '#10b981' : '#f59e0b',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem'
                }}>
                  {projet.statut.replace('_', ' ')}
                </div>
                <div style={{ color: '#64748b' }}>
                  {projet.avancement}% complété
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
