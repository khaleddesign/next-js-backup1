'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Plus, Filter, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Link from 'next/link';
import { usePlanning } from '@/hooks/usePlanning';
import { useToasts } from '@/hooks/useToasts';

export default function PlanningPage() {
  const [viewMode, setViewMode] = useState<'jour' | 'semaine' | 'mois'>('semaine');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filters, setFilters] = useState({
    chantier: '',
    type: 'TOUS',
    utilisateur: ''
  });

  const { plannings, loading, error, actions } = usePlanning({
    dateDebut: getDateRange(currentDate, viewMode).debut,
    dateFin: getDateRange(currentDate, viewMode).fin,
    ...filters
  });

  const { success, error: showError } = useToasts();

  useEffect(() => {
    if (error) {
      showError('Erreur', error);
    }
  }, [error, showError]);

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (viewMode) {
      case 'jour':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'semaine':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'mois':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setCurrentDate(newDate);
  };

  const getDateRangeLabel = () => {
    const { debut, fin } = getDateRange(currentDate, viewMode);
    
    switch (viewMode) {
      case 'jour':
        return debut.toLocaleDateString('fr-FR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      case 'semaine':
        return `${debut.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${fin.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
      case 'mois':
        return debut.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    }
  };

  const todayEvents = plannings.filter(p => {
    const today = new Date();
    const eventDate = new Date(p.dateDebut);
    return eventDate.toDateString() === today.toDateString();
  });

  const thisWeekEvents = plannings.filter(p => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const eventDate = new Date(p.dateDebut);
    return eventDate >= weekStart && eventDate <= weekEnd;
  });

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>
                Mon Planning
              </h1>
              <p style={{ color: '#64748b', fontSize: '1rem' }}>
                Gérez et suivez tous vos rendez-vous et plannings chantier
              </p>
            </div>
            <Link
              href="/dashboard/planning/nouveau"
              className="btn btn-primary"
              style={{ textDecoration: 'none' }}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              Nouveau planning
            </Link>
          </div>

          {/* Barre de recherche */}
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <Search 
              style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                width: '20px', 
                height: '20px', 
                color: '#94a3b8' 
              }} 
            />
            <input
              type="text"
              placeholder="Rechercher un événement..."
              style={{
                width: '100%',
                padding: '12px 12px 12px 44px',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                color: '#1e293b'
              }}
            />
          </div>

          {/* Filtres */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <span style={{ color: '#64748b', fontSize: '14px', alignSelf: 'center' }}>Filtrer par statut :</span>
            {[
              { key: 'TOUS', label: 'Tous les statuts', color: '#64748b' },
              { key: 'PLANIFIE', label: 'Planifié', color: '#3b82f6' },
              { key: 'EN_COURS', label: 'En cours', color: '#f59e0b' },
              { key: 'TERMINE', label: 'Terminé', color: '#10b981' },
              { key: 'ANNULE', label: 'Annulé', color: '#ef4444' }
            ].map((status) => (
              <button
                key={status.key}
                onClick={() => setFilters(prev => ({ ...prev, type: status.key }))}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  backgroundColor: filters.type === status.key ? status.color : '#f1f5f9',
                  color: filters.type === status.key ? 'white' : status.color,
                  transition: 'all 0.2s ease'
                }}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#3b82f6', marginBottom: '0.5rem' }}>
              {todayEvents.length}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Aujourd'hui</div>
          </div>
          
          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#f59e0b', marginBottom: '0.5rem' }}>
              {thisWeekEvents.length}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Cette semaine</div>
          </div>
          
          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#10b981', marginBottom: '0.5rem' }}>
              {plannings.filter(p => p.statut === 'PLANIFIE').length}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>À venir</div>
          </div>
          
          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>
              {plannings.length}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px' }}>Total événements</div>
          </div>
        </div>

        {/* Calendrier */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={() => navigateDate('prev')}
                style={{
                  padding: '8px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#64748b'
                }}
              >
                <ChevronLeft style={{ width: '16px', height: '16px' }} />
              </button>
              
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                {getDateRangeLabel()}
              </h2>
              
              <button
                onClick={() => navigateDate('next')}
                style={{
                  padding: '8px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#64748b'
                }}
              >
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '4px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '6px' }}>
              {(['jour', 'semaine', 'mois'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{
                    padding: '6px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    backgroundColor: viewMode === mode ? 'white' : 'transparent',
                    color: viewMode === mode ? '#1e293b' : '#64748b',
                    boxShadow: viewMode === mode ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                border: '3px solid #f1f5f9', 
                borderTop: '3px solid #3b82f6', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite' 
              }}></div>
              <span style={{ marginLeft: '12px', color: '#64748b' }}>Chargement du planning...</span>
            </div>
          ) : (
            <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', padding: '2rem', minHeight: '400px' }}>
              <div style={{ textAlign: 'center' }}>
                <Calendar style={{ width: '64px', height: '64px', color: '#cbd5e1', margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                  Vue {viewMode}
                </h3>
                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                  {getDateRangeLabel()}
                </p>
                
                {plannings.length === 0 ? (
                  <div>
                    <p style={{ color: '#64748b', marginBottom: '1rem' }}>Aucun événement planifié</p>
                    <Link
                      href="/dashboard/planning/nouveau"
                      className="btn btn-primary"
                      style={{ textDecoration: 'none' }}
                    >
                      <Plus style={{ width: '16px', height: '16px' }} />
                      Créer un événement
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '12px', maxWidth: '600px', margin: '0 auto' }}>
                    {plannings.slice(0, 5).map((planning) => (
                      <div
                        key={planning.id}
                        style={{
                          backgroundColor: 'white',
                          padding: '16px',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        onClick={() => window.location.href = `/dashboard/planning/${planning.id}`}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                            {planning.titre}
                          </h4>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: planning.statut === 'PLANIFIE' ? '#dbeafe' : planning.statut === 'EN_COURS' ? '#fef3c7' : '#d1fae5',
                            color: planning.statut === 'PLANIFIE' ? '#1d4ed8' : planning.statut === 'EN_COURS' ? '#d97706' : '#059669'
                          }}>
                            {planning.statut}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#64748b' }}>
                          <span>{new Date(planning.dateDebut).toLocaleDateString('fr-FR')}</span>
                          <span>{planning.type.replace('_', ' ')}</span>
                          {planning.lieu && <span>📍 {planning.lieu}</span>}
                        </div>
                      </div>
                    ))}
                    
                    {plannings.length > 5 && (
                      <p style={{ color: '#64748b', fontSize: '14px' }}>
                        Et {plannings.length - 5} autres événements...
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function getDateRange(date: Date, viewMode: 'jour' | 'semaine' | 'mois') {
  const debut = new Date(date);
  const fin = new Date(date);
  
  switch (viewMode) {
    case 'jour':
      debut.setHours(0, 0, 0, 0);
      fin.setHours(23, 59, 59, 999);
      break;
    case 'semaine':
      debut.setDate(date.getDate() - date.getDay());
      debut.setHours(0, 0, 0, 0);
      fin.setDate(debut.getDate() + 6);
      fin.setHours(23, 59, 59, 999);
      break;
    case 'mois':
      debut.setDate(1);
      debut.setHours(0, 0, 0, 0);
      fin.setMonth(debut.getMonth() + 1);
      fin.setDate(0);
      fin.setHours(23, 59, 59, 999);
      break;
  }
  
  return { debut, fin };
}
