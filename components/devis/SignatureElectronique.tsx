'use client';

import { useState } from 'react';

interface SignatureElectroniqueProps {
  devisId: string;
  devisNumero: string;
  clientEmail: string;
  clientName: string;
  readOnly?: boolean;
}

export default function SignatureElectronique({
  devisId,
  devisNumero,
  clientEmail,
  clientName,
  readOnly = false
}: SignatureElectroniqueProps) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    emailClient: clientEmail,
    messagePersonnalise: `Bonjour ${clientName},

Veuillez trouver ci-joint votre devis ${devisNumero}.

Pour valider ce devis, cliquez simplement sur le lien de signature électronique qui sera généré.

Cordialement`
  });

  const [lienGenere, setLienGenere] = useState<string | null>(null);

  const handleGenererLien = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/devis/${devisId}/signature`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setLienGenere(data.lienSignature);
        alert(`Lien de signature généré et envoyé à ${formData.emailClient}`);
      } else {
        alert(data.error || 'Erreur lors de la génération');
      }
    } catch (error) {
      console.error('Erreur génération signature:', error);
      alert('Erreur lors de la génération');
    } finally {
      setLoading(false);
    }
  };

  const copierLien = () => {
    if (lienGenere) {
      navigator.clipboard.writeText(lienGenere);
      alert('Lien copié dans le presse-papier');
    }
  };

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ margin: 0, color: '#1e293b' }}>
          ✍️ Signature Électronique
        </h3>
        
        {!readOnly && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
            style={{ fontSize: '0.875rem' }}
          >
            📧 Générer Lien
          </button>
        )}
      </div>

      {/* Informations sur la signature électronique */}
      <div style={{
        background: '#ecfdf5',
        border: '1px solid #10b981',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>🔒</span>
          <span style={{ fontWeight: '600', color: '#065f46' }}>
            Signature Sécurisée
          </span>
        </div>
        
        <div style={{ fontSize: '0.875rem', color: '#065f46', lineHeight: '1.5' }}>
          • <strong>Valeur juridique :</strong> Équivalente à une signature manuscrite<br/>
          • <strong>Sécurité :</strong> Lien unique à usage unique avec token crypté<br/>
          • <strong>Traçabilité :</strong> Date, heure et adresse IP enregistrées<br/>
          • <strong>Simplicité :</strong> Signature en un clic pour le client
        </div>
      </div>

      {/* Statut de la signature */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #3b82f6',
          borderRadius: '0.5rem',
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '1.5rem',
            color: '#1d4ed8',
            marginBottom: '0.5rem'
          }}>
            📧
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1d4ed8' }}>
            Client
          </div>
          <div style={{ fontSize: '0.75rem', color: '#1d4ed8' }}>
            {clientName}
          </div>
        </div>
        
        <div style={{
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '0.5rem',
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '1.5rem',
            color: '#d97706',
            marginBottom: '0.5rem'
          }}>
            ⏳
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#d97706' }}>
            Statut
          </div>
          <div style={{ fontSize: '0.75rem', color: '#d97706' }}>
            En attente signature
          </div>
        </div>
        
        <div style={{
          background: '#f3f4f6',
          border: '1px solid #9ca3af',
          borderRadius: '0.5rem',
          padding: '1rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '1.5rem',
            color: '#6b7280',
            marginBottom: '0.5rem'
          }}>
            📅
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>
            Signé le
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            Non signé
          </div>
        </div>
      </div>

      {/* Lien généré */}
      {lienGenere && (
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #0ea5e9',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#0369a1' }}>
            🔗 Lien de Signature Généré
          </h4>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'white',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid #0ea5e9'
          }}>
            <input
              type="text"
              value={lienGenere}
              readOnly
              style={{
                flex: 1,
                padding: '0.5rem',
                border: 'none',
                background: 'transparent',
                fontSize: '0.875rem',
                color: '#0369a1'
              }}
            />
            <button
              onClick={copierLien}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #0ea5e9',
                borderRadius: '0.5rem',
                background: 'white',
                color: '#0369a1',
                cursor: 'pointer',
                fontSize: '0.75rem'
              }}
            >
              📋 Copier
            </button>
          </div>
          
          <div style={{
            fontSize: '0.75rem',
            color: '#0369a1',
            marginTop: '0.5rem',
            fontStyle: 'italic'
          }}>
            ⚠️ Ce lien est à usage unique et expire après signature du devis.
          </div>
        </div>
      )}

      {/* Formulaire de génération */}
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
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, color: '#1e293b' }}>
                📧 Envoyer Lien de Signature
              </h3>
              <button
                onClick={() => setShowForm(false)}
                style={{
                  padding: '0.5rem',
                  border: 'none',
                  background: '#f1f5f9',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Email du client
                </label>
                <input
                  type="email"
                  value={formData.emailClient}
                  onChange={(e) => setFormData({
                    ...formData,
                    emailClient: e.target.value
                  })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Message personnalisé
                </label>
                <textarea
                  value={formData.messagePersonnalise}
                  onChange={(e) => setFormData({
                    ...formData,
                    messagePersonnalise: e.target.value
                  })}
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem'
              }}>
                <button
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
                  onClick={handleGenererLien}
                  disabled={loading || !formData.emailClient}
                  className="btn-primary"
                  style={{
                    opacity: (loading || !formData.emailClient) ? 0.5 : 1,
                    cursor: (loading || !formData.emailClient) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? '📧 Génération...' : '📧 Générer & Envoyer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
