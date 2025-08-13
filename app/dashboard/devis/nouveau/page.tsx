'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
}

interface Chantier {
  id: string;
  nom: string;
  adresse: string;
  client: Client;
}

interface LigneDevis {
  designation: string;
  quantite: string;
  prixUnitaire: string;
  tva: string;
  total: number;
}

interface DevisData {
  type: 'DEVIS' | 'FACTURE';
  clientId: string;
  chantierId?: string;
  objet: string;
  dateValidite?: string;
  notes?: string;
  conditionsVente?: string;
  lignes: LigneDevis[];
}

export default function NouveauDevisPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [chantiers, setChantiers] = useState<Chantier[]>([]);
  
  const [devisData, setDevisData] = useState<DevisData>({
    type: (searchParams.get('type') as 'DEVIS' | 'FACTURE') || 'DEVIS',
    clientId: '',
    chantierId: '',
    objet: '',
    dateValidite: '',
    notes: '',
    conditionsVente: '',
    lignes: [
      { designation: '', quantite: '1', prixUnitaire: '0', tva: '20', total: 0 }
    ]
  });

  const [totaux, setTotaux] = useState({
    totalHT: 0,
    totalTVA: 0,
    totalTTC: 0
  });

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (devisData.clientId) {
      fetchChantiers(devisData.clientId);
    }
  }, [devisData.clientId]);

  useEffect(() => {
    calculateTotals();
  }, [devisData.lignes]);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/equipes?role=CLIENT');
      const data = await response.json();
      if (response.ok) {
        setClients(data.membres || []);
      }
    } catch (error) {
      console.error('Erreur chargement clients:', error);
    }
  };

  const fetchChantiers = async (clientId: string) => {
    try {
      const response = await fetch(`/api/chantiers?clientId=${clientId}`);
      const data = await response.json();
      if (response.ok) {
        setChantiers(data.chantiers || []);
      }
    } catch (error) {
      console.error('Erreur chargement chantiers:', error);
      setChantiers([]);
    }
  };

  const calculateTotals = () => {
    const totalHT = devisData.lignes.reduce((sum, ligne) => {
      const quantite = parseFloat(ligne.quantite) || 0;
      const prix = parseFloat(ligne.prixUnitaire) || 0;
      return sum + (quantite * prix);
    }, 0);

    const totalTVA = devisData.lignes.reduce((sum, ligne) => {
      const quantite = parseFloat(ligne.quantite) || 0;
      const prix = parseFloat(ligne.prixUnitaire) || 0;
      const tva = parseFloat(ligne.tva) || 0;
      const sousTotal = quantite * prix;
      return sum + (sousTotal * tva / 100);
    }, 0);

    const totalTTC = totalHT + totalTVA;

    setTotaux({ totalHT, totalTVA, totalTTC });
  };

  const updateLigne = (index: number, field: keyof LigneDevis, value: string) => {
    const newLignes = [...devisData.lignes];
    newLignes[index] = { ...newLignes[index], [field]: value };
    
    if (field === 'quantite' || field === 'prixUnitaire') {
      const quantite = parseFloat(newLignes[index].quantite) || 0;
      const prix = parseFloat(newLignes[index].prixUnitaire) || 0;
      newLignes[index].total = quantite * prix;
    }

    setDevisData({ ...devisData, lignes: newLignes });
  };

  const addLigne = () => {
    setDevisData({
      ...devisData,
      lignes: [
        ...devisData.lignes,
        { designation: '', quantite: '1', prixUnitaire: '0', tva: '20', total: 0 }
      ]
    });
  };

  const removeLigne = (index: number) => {
    if (devisData.lignes.length > 1) {
      const newLignes = devisData.lignes.filter((_, i) => i !== index);
      setDevisData({ ...devisData, lignes: newLignes });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(devisData)
      });

      const result = await response.json();

      if (response.ok) {
        router.push(`/dashboard/devis/${result.id}`);
      } else {
        alert(result.error || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création');
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

  const selectedClient = clients.find(c => c.id === devisData.clientId);

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: '#1e293b',
          margin: '0 0 0.5rem 0' 
        }}>
          {devisData.type === 'DEVIS' ? '📄 Nouveau Devis' : '🧾 Nouvelle Facture'}
        </h1>
        <p style={{ color: '#64748b', margin: 0 }}>
          Créez un nouveau {devisData.type.toLowerCase()} en quelques étapes
        </p>
      </div>

      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2rem',
        gap: '1rem'
      }}>
        {[1, 2, 3].map((step) => (
          <div key={step} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              background: currentStep >= step ? '#3b82f6' : '#e2e8f0',
              color: currentStep >= step ? 'white' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '0.875rem'
            }}>
              {step}
            </div>
            <span style={{
              color: currentStep >= step ? '#1e293b' : '#64748b',
              fontSize: '0.875rem',
              fontWeight: currentStep === step ? '600' : '400'
            }}>
              {step === 1 ? 'Informations' : step === 2 ? 'Lignes' : 'Finalisation'}
            </span>
            {step < 3 && (
              <div style={{
                width: '2rem',
                height: '2px',
                background: currentStep > step ? '#3b82f6' : '#e2e8f0',
                marginLeft: '0.5rem'
              }} />
            )}
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        {currentStep === 1 && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>
              Informations générales
            </h3>
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Type de document *
                </label>
                <select
                  value={devisData.type}
                  onChange={(e) => setDevisData({
                    ...devisData,
                    type: e.target.value as 'DEVIS' | 'FACTURE'
                  })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    background: 'white'
                  }}
                >
                  <option value="DEVIS">📄 Devis</option>
                  <option value="FACTURE">🧾 Facture</option>
                </select>
              </div>

              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Client *
                </label>
                <select
                  value={devisData.clientId}
                  onChange={(e) => setDevisData({
                    ...devisData,
                    clientId: e.target.value,
                    chantierId: ''
                  })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    background: 'white'
                  }}
                >
                  <option value="">Sélectionner un client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} {client.company && `(${client.company})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ 
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Chantier (optionnel)
                </label>
                <select
                  value={devisData.chantierId}
                  onChange={(e) => setDevisData({
                    ...devisData,
                    chantierId: e.target.value
                  })}
                  disabled={!devisData.clientId}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    background: devisData.clientId ? 'white' : '#f9fafb',
                    opacity: devisData.clientId ? 1 : 0.5
                  }}
                >
                  <option value="">Pas de chantier associé</option>
                  {chantiers.map((chantier) => (
                    <option key={chantier.id} value={chantier.id}>
                      {chantier.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ 
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Date de validité
                </label>
                <input
                  type="date"
                  value={devisData.dateValidite}
                  onChange={(e) => setDevisData({
                    ...devisData,
                    dateValidite: e.target.value
                  })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    background: 'white'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ 
                display: 'block',           marginBottom: '0.5rem',
               fontWeight: '500',
               color: '#374151'
             }}>
               Objet *
             </label>
             <input
               type="text"
               value={devisData.objet}
               onChange={(e) => setDevisData({
                 ...devisData,
                 objet: e.target.value
               })}
               placeholder="Ex: Rénovation salle de bain"
               style={{
                 width: '100%',
                 padding: '0.75rem',
                 border: '1px solid #d1d5db',
                 borderRadius: '0.5rem',
                 background: 'white'
               }}
             />
           </div>

           <div style={{ 
             display: 'flex',
             justifyContent: 'flex-end',
             gap: '1rem'
           }}>
             <button
               onClick={() => router.back()}
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
               onClick={() => setCurrentStep(2)}
               disabled={!devisData.clientId || !devisData.objet}
               className="btn-primary"
               style={{
                 opacity: (!devisData.clientId || !devisData.objet) ? 0.5 : 1,
                 cursor: (!devisData.clientId || !devisData.objet) ? 'not-allowed' : 'pointer'
               }}
             >
               Suivant
             </button>
           </div>
         </div>
       )}

       {currentStep === 2 && (
         <div>
           <div style={{ 
             display: 'flex',
             justifyContent: 'space-between',
             alignItems: 'center',
             marginBottom: '1.5rem'
           }}>
             <h3 style={{ margin: 0, color: '#1e293b' }}>
               Lignes du {devisData.type.toLowerCase()}
             </h3>
             <button
               onClick={addLigne}
               style={{
                 padding: '0.5rem 1rem',
                 border: 'none',
                 borderRadius: '0.5rem',
                 background: '#10b981',
                 color: 'white',
                 cursor: 'pointer',
                 fontSize: '0.875rem'
               }}
             >
               ➕ Ajouter une ligne
             </button>
           </div>

           <div style={{ 
             background: '#f8fafc',
             padding: '1rem',
             borderRadius: '0.5rem',
             marginBottom: '1rem'
           }}>
             <div style={{
               display: 'grid',
               gridTemplateColumns: '2fr 80px 100px 80px 100px 40px',
               gap: '0.5rem',
               fontWeight: '600',
               fontSize: '0.875rem',
               color: '#374151'
             }}>
               <div>Désignation</div>
               <div>Qté</div>
               <div>Prix Unit.</div>
               <div>TVA %</div>
               <div>Total HT</div>
               <div></div>
             </div>
           </div>

           <div style={{ marginBottom: '1.5rem' }}>
             {devisData.lignes.map((ligne, index) => (
               <div key={index} style={{
                 display: 'grid',
                 gridTemplateColumns: '2fr 80px 100px 80px 100px 40px',
                 gap: '0.5rem',
                 alignItems: 'center',
                 padding: '0.75rem 0',
                 borderBottom: '1px solid #e5e7eb'
               }}>
                 <input
                   type="text"
                   value={ligne.designation}
                   onChange={(e) => updateLigne(index, 'designation', e.target.value)}
                   placeholder="Description du service/produit"
                   style={{
                     padding: '0.5rem',
                     border: '1px solid #d1d5db',
                     borderRadius: '0.25rem',
                     fontSize: '0.875rem'
                   }}
                 />
                 <input
                   type="number"
                   value={ligne.quantite}
                   onChange={(e) => updateLigne(index, 'quantite', e.target.value)}
                   min="0"
                   step="0.01"
                   style={{
                     padding: '0.5rem',
                     border: '1px solid #d1d5db',
                     borderRadius: '0.25rem',
                     fontSize: '0.875rem',
                     textAlign: 'center'
                   }}
                 />
                 <input
                   type="number"
                   value={ligne.prixUnitaire}
                   onChange={(e) => updateLigne(index, 'prixUnitaire', e.target.value)}
                   min="0"
                   step="0.01"
                   style={{
                     padding: '0.5rem',
                     border: '1px solid #d1d5db',
                     borderRadius: '0.25rem',
                     fontSize: '0.875rem',
                     textAlign: 'right'
                   }}
                 />
                 <input
                   type="number"
                   value={ligne.tva}
                   onChange={(e) => updateLigne(index, 'tva', e.target.value)}
                   min="0"
                   max="100"
                   step="0.1"
                   style={{
                     padding: '0.5rem',
                     border: '1px solid #d1d5db',
                     borderRadius: '0.25rem',
                     fontSize: '0.875rem',
                     textAlign: 'center'
                   }}
                 />
                 <div style={{
                   padding: '0.5rem',
                   textAlign: 'right',
                   fontWeight: '500',
                   fontSize: '0.875rem'
                 }}>
                   {formatCurrency(ligne.total)}
                 </div>
                 <button
                   onClick={() => removeLigne(index)}
                   disabled={devisData.lignes.length === 1}
                   style={{
                     padding: '0.25rem',
                     border: 'none',
                     background: devisData.lignes.length === 1 ? '#f3f4f6' : '#fee2e2',
                     color: devisData.lignes.length === 1 ? '#9ca3af' : '#dc2626',
                     borderRadius: '0.25rem',
                     cursor: devisData.lignes.length === 1 ? 'not-allowed' : 'pointer',
                     fontSize: '0.75rem'
                   }}
                 >
                   🗑️
                 </button>
               </div>
             ))}
           </div>

           <div style={{
             background: '#f0f9ff',
             border: '1px solid #0ea5e9',
             borderRadius: '0.5rem',
             padding: '1rem',
             marginBottom: '1.5rem'
           }}>
             <div style={{
               display: 'grid',
               gridTemplateColumns: '1fr auto',
               gap: '1rem',
               alignItems: 'center'
             }}>
               <div>
                 <h4 style={{ margin: '0 0 0.5rem 0', color: '#0369a1' }}>
                   Récapitulatif
                 </h4>
                 <p style={{ margin: 0, fontSize: '0.875rem', color: '#0369a1' }}>
                   {devisData.lignes.length} ligne{devisData.lignes.length > 1 ? 's' : ''} • TVA 20%
                 </p>
               </div>
               <div style={{ textAlign: 'right' }}>
                 <div style={{ marginBottom: '0.25rem', fontSize: '0.875rem', color: '#0369a1' }}>
                   Total HT: {formatCurrency(totaux.totalHT)}
                 </div>
                 <div style={{ marginBottom: '0.25rem', fontSize: '0.875rem', color: '#0369a1' }}>
                   TVA: {formatCurrency(totaux.totalTVA)}
                 </div>
                 <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0369a1' }}>
                   Total TTC: {formatCurrency(totaux.totalTTC)}
                 </div>
               </div>
             </div>
           </div>

           <div style={{ 
             display: 'flex',
             justifyContent: 'space-between'
           }}>
             <button
               onClick={() => setCurrentStep(1)}
               style={{
                 padding: '0.75rem 1.5rem',
                 border: '1px solid #d1d5db',
                 borderRadius: '0.5rem',
                 background: 'white',
                 color: '#374151',
                 cursor: 'pointer'
               }}
             >
               Précédent
             </button>
             <button
               onClick={() => setCurrentStep(3)}
               disabled={devisData.lignes.some(l => !l.designation || !l.quantite || !l.prixUnitaire)}
               className="btn-primary"
               style={{
                 opacity: devisData.lignes.some(l => !l.designation || !l.quantite || !l.prixUnitaire) ? 0.5 : 1,
                 cursor: devisData.lignes.some(l => !l.designation || !l.quantite || !l.prixUnitaire) ? 'not-allowed' : 'pointer'
               }}
             >
               Suivant
             </button>
           </div>
         </div>
       )}

       {currentStep === 3 && (
         <div>
           <h3 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>
             Finalisation
           </h3>

           <div style={{ 
             display: 'grid',
             gridTemplateColumns: '1fr 1fr',
             gap: '2rem',
             marginBottom: '2rem'
           }}>
             <div>
               <h4 style={{ marginBottom: '1rem', color: '#374151' }}>
                 Informations client
               </h4>
               {selectedClient && (
                 <div style={{
                   background: '#f8fafc',
                   padding: '1rem',
                   borderRadius: '0.5rem',
                   border: '1px solid #e2e8f0'
                 }}>
                   <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>
                     {selectedClient.name}
                   </div>
                   {selectedClient.company && (
                     <div style={{ marginBottom: '0.25rem', fontSize: '0.875rem', color: '#64748b' }}>
                       {selectedClient.company}
                     </div>
                   )}
                   <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                     {selectedClient.email}
                   </div>
                 </div>
               )}
             </div>

             <div>
               <h4 style={{ marginBottom: '1rem', color: '#374151' }}>
                 Résumé du {devisData.type.toLowerCase()}
               </h4>
               <div style={{
                 background: '#f0f9ff',
                 padding: '1rem',
                 borderRadius: '0.5rem',
                 border: '1px solid #0ea5e9'
               }}>
                 <div style={{ marginBottom: '0.5rem' }}>
                   <span style={{ fontWeight: '600' }}>Objet:</span> {devisData.objet}
                 </div>
                 <div style={{ marginBottom: '0.5rem' }}>
                   <span style={{ fontWeight: '600' }}>Lignes:</span> {devisData.lignes.length}
                 </div>
                 <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#0369a1' }}>
                   Total: {formatCurrency(totaux.totalTTC)}
                 </div>
               </div>
             </div>
           </div>

           <div style={{ marginBottom: '1.5rem' }}>
             <label style={{ 
               display: 'block',
               marginBottom: '0.5rem',
               fontWeight: '500',
               color: '#374151'
             }}>
               Notes (optionnel)
             </label>
             <textarea
               value={devisData.notes}
               onChange={(e) => setDevisData({
                 ...devisData,
                 notes: e.target.value
               })}
               placeholder="Notes internes ou informations complémentaires..."
               rows={3}
               style={{
                 width: '100%',
                 padding: '0.75rem',
                 border: '1px solid #d1d5db',
                 borderRadius: '0.5rem',
                 background: 'white',
                 resize: 'vertical'
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
               Conditions de vente (optionnel)
             </label>
             <textarea
               value={devisData.conditionsVente}
               onChange={(e) => setDevisData({
                 ...devisData,
                 conditionsVente: e.target.value
               })}
               placeholder="Conditions de vente, modalités de paiement..."
               rows={3}
               style={{
                 width: '100%',
                 padding: '0.75rem',
                 border: '1px solid #d1d5db',
                 borderRadius: '0.5rem',
                 background: 'white',
                 resize: 'vertical'
               }}
             />
           </div>

           <div style={{ 
             display: 'flex',
             justifyContent: 'space-between'
           }}>
             <button
               onClick={() => setCurrentStep(2)}
               style={{
                 padding: '0.75rem 1.5rem',
                 border: '1px solid #d1d5db',
                 borderRadius: '0.5rem',
                 background: 'white',
                 color: '#374151',
                 cursor: 'pointer'
               }}
             >
               Précédent
             </button>
             <button
               onClick={handleSubmit}
               disabled={loading}
               className="btn-primary"
               style={{
                 opacity: loading ? 0.5 : 1,
                 cursor: loading ? 'not-allowed' : 'pointer'
               }}
             >
               {loading ? 'Création...' : `Créer le ${devisData.type.toLowerCase()}`}
             </button>
           </div>
         </div>
       )}
     </div>
   </div>
 );
}
