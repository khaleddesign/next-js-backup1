'use client';

import { useState, useEffect } from 'react';

interface RetenueGarantieProps {
  devisId: string;
  readOnly?: boolean;
  onUpdate?: (data: any) => void;
}

export default function RetenueGarantie({
  devisId,
  readOnly = false,
  onUpdate
}: RetenueGarantieProps) {
  const [garantieData, setGarantieData] = useState({
    retenueGarantie: 0,
    cautionBancaire: false,
    dateLiberation: '',
    montantRetenue: 0,
    montantNet: 0,
    totalTTC: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGarantieData();
  }, [devisId]);

  const fetchGarantieData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/devis/${devisId}/garantie`);
      const data = await response.json();
      
      if (response.ok) {
        setGarantieData({
          ...data.garantie,
          dateLiberation: data.garantie.dateLiberation ? 
            data.garantie.dateLiberation.split('T')[0] : ''
        });
      }
    } catch (error) {
      console.error('Erreur chargement garantie:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/devis/${devisId}/garantie`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          retenueGarantie: garantieData.retenueGarantie || null,
          cautionBancaire: garantieData.cautionBancaire,
          dateLiberation: garantieData.dateLiberation || null
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert('Paramètres de garantie mis à jour');
        if (onUpdate) onUpdate(result.devis);
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur mise à jour garantie:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const updateField = (field: string, value: any) => {
    const newData = { ...garantieData, [field]: value };
    
    // Recalcul automatique des montants
    if (field === 'retenueGarantie') {
      const montantRetenue = newData.totalTTC * (value / 100);
      newData.montantRetenue = montantRetenue;
      newData.montantNet = newData.totalTTC - montantRetenue;
    }
    
    setGarantieData(newData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ color: '#64748b' }}>Chargement paramètres de garantie...</div>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ margin: 0, color: '#1e293b' }}>
          🛡️ Retenue de Garantie
        </h3>
        
        {!readOnly && (
          <button
            onClick={handleUpdate}
            className="btn-primary"
            style={{ fontSize: '0.875rem' }}
          >
            💾 Sauvegarder
          </button>
        )}
      </div>

      {/* Configuration de la retenue */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        <h4 style={{ margin: '0 0 1rem 0', color: '#374151' }}>
          Configuration
        </h4>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              Pourcentage de retenue (0-5%)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={garantieData.retenueGarantie}
                onChange={(e) => updateField('retenueGarantie', parseFloat(e.target.value))}
                disabled={readOnly}
                style={{ flex: 1 }}
              />
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={garantieData.retenueGarantie}
                onChange={(e) => updateField('retenueGarantie', parseFloat(e.target.value) || 0)}
                disabled={readOnly}
                style={{
                  width: '80px',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  textAlign: 'center'
                }}
              />
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>%</span>
            </div>
          </div>
          
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              Date de libération
            </label>
            <input
              type="date"
              value={garantieData.dateLiberation}
              onChange={(e) => updateField('dateLiberation', e.target.value)}
              disabled={readOnly}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem'
              }}
            />
          </div>
        </div>
        
        {/* Option caution bancaire */}
        <div style={{ marginTop: '1rem' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={garantieData.cautionBancaire}
              onChange={(e) => updateField('cautionBancaire', e.target.checked)}
              disabled={readOnly}
            />
            <span style={{ fontWeight: '500', color: '#374151' }}>
              Remplacer par une caution bancaire
            </span>
          </label>
          {garantieData.cautionBancaire && (
            <div style={{
              marginTop: '0.5rem',
              padding: '0.75rem',
              background: '#ecfdf5',
              border: '1px solid #10b981',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              color: '#065f46'
            }}>
              ✅ La retenue de garantie sera remplacée par une caution bancaire équivalente.
            </div>
          )}
        </div>
      </div>

      {/* Calculs automatiques */}
      <div style={{
        background: '#f0f9ff',
        border: '1px solid #0ea5e9',
        borderRadius: '0.75rem',
        padding: '1.5rem'
      }}>
        <h4 style={{ margin: '0 0 1rem 0', color: '#0369a1' }}>
          💰 Impact Financier
        </h4>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#0369a1',
              marginBottom: '0.25rem'
            }}>
              {formatCurrency(garantieData.totalTTC)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#0369a1' }}>
              Montant Total TTC
            </div>
          </div>
          
          <div style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            textAlign: 'center',
            border: garantieData.retenueGarantie > 0 ? '2px solid #f59e0b' : 'none'
          }}>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: garantieData.retenueGarantie > 0 ? '#d97706' : '#9ca3af',
              marginBottom: '0.25rem'
            }}>
              {formatCurrency(garantieData.montantRetenue)}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: garantieData.retenueGarantie > 0 ? '#d97706' : '#9ca3af'
            }}>
              Montant Retenu ({garantieData.retenueGarantie}%)
            </div>
          </div>
          
          <div style={{
            background: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            textAlign: 'center',
            border: '2px solid #10b981'
          }}>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#059669',
              marginBottom: '0.25rem'
            }}>
              {formatCurrency(garantieData.montantNet)}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#059669' }}>
              Montant Net à Payer
            </div>
          </div>
        </div>

        {/* Informations réglementaires */}
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '0.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',

           gap: '0.5rem',
           marginBottom: '0.5rem'
         }}>
           <span style={{ fontSize: '1.25rem' }}>ℹ️</span>
           <span style={{ fontWeight: '600', color: '#92400e' }}>
             Réglementation BTP
           </span>
         </div>
         <div style={{ fontSize: '0.875rem', color: '#92400e', lineHeight: '1.4' }}>
           • La retenue de garantie est limitée à 5% maximum du montant TTC<br/>
           • Elle doit être libérée dans un délai maximum de 12 mois après réception<br/>
           • Elle peut être remplacée par une caution bancaire équivalente<br/>
           {garantieData.dateLiberation && (
             <>• Date prévue de libération : <strong>{new Date(garantieData.dateLiberation).toLocaleDateString('fr-FR')}</strong></>
           )}
         </div>
       </div>
     </div>
   </div>
 );
}
