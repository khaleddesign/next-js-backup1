'use client';

import { useState, useEffect } from 'react';

interface ConsultationTrackerProps {
  devisId: string;
  devisNumero: string;
}

interface ConsultationEvent {
  date: string;
  type: 'OUVERTURE' | 'CONSULTATION' | 'SIGNATURE' | 'TELECHARGEMENT';
  details: string;
  ip?: string;
  userAgent?: string;
}

export default function ConsultationTracker({
  devisId,
  devisNumero
}: ConsultationTrackerProps) {
  const [consultations, setConsultations] = useState<ConsultationEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler les données de consultation
    // En production, ces données viendraient de l'API
    setConsultations([
      {
        date: new Date().toISOString(),
        type: 'OUVERTURE',
        details: 'Devis ouvert pour la première fois',
        ip: '192.168.1.100'
      },
      {
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        type: 'CONSULTATION',
        details: 'Consultation du devis',
        ip: '192.168.1.100'
      }
    ]);
    setLoading(false);
  }, [devisId]);

  const getEventIcon = (type: string) => {
    const icons = {
      OUVERTURE: '👀',
      CONSULTATION: '📖',
      SIGNATURE: '✍️',
      TELECHARGEMENT: '📥'
    };
    return icons[type as keyof typeof icons] || '📋';
  };

  const getEventColor = (type: string) => {
    const colors = {
      OUVERTURE: '#3b82f6',
      CONSULTATION: '#10b981',
      SIGNATURE: '#059669',
      TELECHARGEMENT: '#f59e0b'
    };
    return colors[type as keyof typeof colors] || '#64748b';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('fr-FR'),
      time: date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  if (loading) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ color: '#64748b' }}>Chargement historique...</div>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <h3 style={{
        margin: '0 0 1.5rem 0',
        color: '#1e293b',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        📊 Suivi des Consultations
        <span style={{
          fontSize: '0.75rem',
          background: '#f1f5f9',
          color: '#64748b',
          padding: '0.25rem 0.5rem',
          borderRadius: '0.5rem'
        }}>
          {devisNumero}
        </span>
      </h3>

      {consultations.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#64748b'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👁️</div>
          <p>Aucune consultation enregistrée</p>
          <p style={{ fontSize: '0.875rem' }}>
            Les consultations apparaîtront ici une fois le devis envoyé au client.
          </p>
        </div>
      ) : (
        <div>
          {/* Statistiques rapides */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              background: '#f0f9ff',
              padding: '1rem',
              borderRadius: '0.5rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#0369a1'
              }}>
                {consultations.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#0369a1' }}>
                Consultations
              </div>
            </div>
            
            <div style={{
              background: '#ecfdf5',
              padding: '1rem',
              borderRadius: '0.5rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#059669'
              }}>
                {consultations.filter(c => c.type === 'CONSULTATION').length}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#059669' }}>
                Ouvertures
              </div>
            </div>
            
            <div style={{
              background: '#fef3c7',
              padding: '1rem',
              borderRadius: '0.5rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#d97706'
              }}>
                {consultations.filter(c => c.type === 'SIGNATURE').length}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#d97706' }}>
                Signatures
              </div>
            </div>
          </div>

          {/* Timeline des événements */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '0.5rem',
            padding: '1rem'
          }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#374151' }}>
              Chronologie
            </h4>
            
            <div style={{ position: 'relative' }}>
              {/* Ligne de timeline */}
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '0.5rem',
                bottom: '0.5rem',
                width: '2px',
                background: '#e2e8f0'
              }} />
              
              {consultations.map((consultation, index) => {
                const { date, time } = formatDate(consultation.date);
                return (
                  <div key={index} style={{
                    position: 'relative',
                    paddingLeft: '3rem',
                    paddingBottom: index < consultations.length - 1 ? '1.5rem' : '0'
                  }}>
                    {/* Icône de l'événement */}
                    <div style={{
                      position: 'absolute',
                      left: '0.5rem',
                      top: '0',
                      width: '2rem',
                      height: '2rem',
                      background: getEventColor(consultation.type),
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.875rem',
                      zIndex: 1
                    }}>
                      {getEventIcon(consultation.type)}
                    </div>
                    
                    {/* Contenu de l'événement */}
                    <div style={{
                      background: 'white',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '0.25rem'
                      }}>
                        <span style={{
                          fontWeight: '500',
                          color: '#1e293b'
                        }}>
                          {consultation.details}
                        </span>
                        <span style={{
                          fontSize: '0.75rem',
                          color: '#64748b'
                        }}>
                          {date} à {time}
                        </span>
                      </div>
                      
                      {consultation.ip && (
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#9ca3af'
                        }}>
                          IP: {consultation.ip}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
