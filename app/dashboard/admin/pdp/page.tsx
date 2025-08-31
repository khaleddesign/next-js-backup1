'use client';

import { useState, useEffect } from 'react';

export default function ConfigurationPDPPage() {
  const [configurations, setConfigurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    apiUrl: '',
    apiKey: '',
    formatsSupporte: ['FACTUR_X']
  });

  const fetchConfigurations = async () => {
    try {
      const response = await fetch('/api/admin/pdp');
      const result = await response.json();
      
      if (result.success) {
        setConfigurations(result.configurations);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/pdp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        alert('PDP configurée avec succès');
        setShowForm(false);
        setFormData({
          nom: '',
          apiUrl: '',
          apiKey: '',
          formatsSupporte: ['FACTUR_X']
        });
        fetchConfigurations();
      } else {
        alert(`Erreur: ${result.error}`);
      }
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        Chargement...
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
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
            🔧 Configuration PDP
          </h1>
          <p style={{ color: '#64748b', margin: 0 }}>
            Plateformes de Dématérialisation Partenaires
          </p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          ➕ Nouvelle PDP
        </button>
      </div>

      <div style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '0.75rem',
        padding: '1.5rem'
      }}>
        {configurations.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#64748b'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔧</div>
            <p>Aucune PDP configurée</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {configurations.map((config: any) => (
              <div
                key={config.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  background: config.actif ? '#f0f9ff' : '#f8fafc'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <h3 style={{
                    margin: 0,
                    color: '#1e293b',
                    fontSize: '1.125rem'
                  }}>
                    {config.nom}
                  </h3>
                  {config.actif && (
                    <span style={{
                      background: '#10b981',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      Actif
                    </span>
                  )}
                </div>
                
                <div style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  marginBottom: '0.5rem'
                }}>
                  URL: {config.apiUrl}
                </div>
                
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  Formats: {config.formatsSupporte.join(', ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
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
            borderRadius: '0.75rem',
            padding: '2rem',
            width: '100%',
            maxWidth: '500px',
            margin: '1rem'
          }}>
            <h3 style={{
              margin: '0 0 1.5rem 0',
              color: '#1e293b',
              fontSize: '1.25rem'
            }}>
              Nouvelle PDP
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Nom de la PDP
                </label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({
                    ...formData,
                    nom: e.target.value
                  })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem'
                  }}
                  placeholder="Ex: Sage PDP"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  URL API
                </label>
                <input
                  type="url"
                  required
                  value={formData.apiUrl}
                  onChange={(e) => setFormData({
                    ...formData,
                    apiUrl: e.target.value
                  })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem'
                  }}
                  placeholder="https://api.pdp.example.com"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Clé API
                </label>
                <input
                  type="password"
                  required
                  value={formData.apiKey}
                  onChange={(e) => setFormData({
                    ...formData,
                    apiKey: e.target.value
                  })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem'
              }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    background: 'white',
                    color: '#374151',
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
                
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  Configurer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
