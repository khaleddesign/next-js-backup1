'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface DevisDetail {
  id: string;
  numero: string;
  type: 'DEVIS' | 'FACTURE';
  statut: 'BROUILLON' | 'ENVOYE' | 'ACCEPTE' | 'REFUSE' | 'PAYE' | 'ANNULE';
  objet: string;
  dateCreation: string;
  dateValidite?: string;
  dateEnvoi?: string;
  dateAcceptation?: string;
  datePaiement?: string;
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  notes?: string;
  conditionsVente?: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    address?: string;
  };
  chantier?: {
    id: string;
    nom: string;
    adresse: string;
  };
  lignes: Array<{
    id: string;
    designation: string;
    quantite: number;
    prixUnitaire: number;
    tva: number;
    total: number;
    ordre: number;
  }>;
  facture?: {
    id: string;
    numero: string;
    statut: string;
  };
  devisOrigine?: {
    id: string;
    numero: string;
  };
}

export default function DevisDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [devis, setDevis] = useState<DevisDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchDevis();
    }
  }, [params.id]);

  const fetchDevis = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/devis/${params.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setDevis(data);
      } else {
        alert(data.error || 'Erreur lors du chargement');
        router.push('/dashboard/devis');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string, additionalData?: any) => {
    if (!devis) return;
    
    try {
      setActionLoading(action);
      let response;
      
      switch (action) {
        case 'convert':
          response = await fetch(`/api/devis/${devis.id}/convert`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          break;
          
        case 'send':
          response = await fetch(`/api/devis/${devis.id}/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(additionalData || {})
          });
          break;
          
        case 'accept':
          response = await fetch(`/api/devis/${devis.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ statut: 'ACCEPTE' })
          });
          break;
          
        case 'refuse':
          response = await fetch(`/api/devis/${devis.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ statut: 'REFUSE' })
          });
          break;
          
        case 'pay':
          response = await fetch(`/api/devis/${devis.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ statut: 'PAYE', datePaiement: new Date().toISOString() })
          });
          break;
          
        case 'delete':
          if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
            response = await fetch(`/api/devis/${devis.id}`, {
              method: 'DELETE'
            });
          } else {
            return;
          }
          break;
          
        default:
          return;
      }

      if (response && response.ok) {
        const result = await response.json();
        
        if (action === 'convert') {
          router.push(`/dashboard/devis/${result.id}`);
        } else if (action === 'delete') {
          router.push('/dashboard/devis');
        } else {
          await fetchDevis();
        }
        
        if (result.message) {
          alert(result.message);
        }
      } else if (response) {
        const error = await response.json();
        alert(error.error || 'Erreur lors de l\'action');
      }
    } catch (error) {
      console.error('Erreur action:', error);
      alert('Erreur lors de l\'action');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (statut: string) => {
    const colors = {
      BROUILLON: '#64748b',
      ENVOYE: '#3b82f6',
      ACCEPTE: '#10b981',
      REFUSE: '#ef4444',
      PAYE: '#059669',
      ANNULE: '#6b7280'
    };
    return colors[statut as keyof typeof colors] || '#64748b';
  };

  const getStatusText = (statut: string) => {
    const texts = {
      BROUILLON: 'Brouillon',
      ENVOYE: 'Envoyé',
      ACCEPTE: 'Accepté',
      REFUSE: 'Refusé',
      PAYE: 'Payé',
      ANNULE: 'Annulé'
    };
    return texts[statut as keyof typeof texts] || statut;
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

  if (loading) {
    return (
      <div style={{ 
        padding: '2rem',
        textAlign: 'center',
        color: '#64748b'
      }}>
        Chargement...
      </div>
    );
  }

  if (!devis) {
    return (
      <div style={{ 
        padding: '2rem',
        textAlign: 'center',
        color: '#64748b'
      }}>
        Document non trouvé
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2rem'
      }}>
        <div>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '0.5rem'
          }}>
            <Link 
              href="/dashboard/devis"
              style={{ 
                color: '#64748b',
                textDecoration: 'none',
                fontSize: '0.875rem'
              }}
            >
              ← Retour aux devis
            </Link>
          </div>
          <h1 style={{ 
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1e293b',
            margin: '0 0 0.5rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>{devis.type === 'DEVIS' ? '📄' : '🧾'}</span>
            {devis.numero}
          </h1>
          <p style={{ color: '#64748b', margin: 0 }}>
            {devis.objet}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{
            background: getStatusColor(devis.statut),
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '1rem',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            {getStatusText(devis.statut)}
          </span>
          
          {devis.statut === 'BROUILLON' && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link
                href={`/dashboard/devis/${devis.id}/edit`}
                className="btn-primary"
                style={{ textDecoration: 'none', fontSize: '0.875rem' }}
              >
                ✏️ Modifier
              </Link>
              <button
                onClick={() => handleAction('send')}
                disabled={actionLoading === 'send'}
                className="btn-primary"
                style={{ fontSize: '0.875rem' }}
              >
                {actionLoading === 'send' ? 'Envoi...' : '📤 Envoyer'}
              </button>
            </div>
          )}
          
          {devis.type === 'DEVIS' && devis.statut === 'ENVOYE' && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => handleAction('accept')}
                disabled={actionLoading === 'accept'}
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
                {actionLoading === 'accept' ? 'Validation...' : '✅ Accepter'}
              </button>
              <button
                onClick={() => handleAction('refuse')}
                disabled={actionLoading === 'refuse'}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  background: '#ef4444',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                {actionLoading === 'refuse' ? 'Refus...' : '❌ Refuser'}
              </button>
            </div>
          )}
          
          {devis.type === 'DEVIS' && devis.statut === 'ACCEPTE' && !devis.facture && (
            <button
              onClick={() => handleAction('convert')}
              disabled={actionLoading === 'convert'}
              className="btn-primary"
              style={{ fontSize: '0.875rem' }}
            >
              {actionLoading === 'convert' ? 'Conversion...' : '🧾 Convertir en Facture'}
            </button>
          )}
          
          {devis.type === 'FACTURE' && devis.statut === 'ENVOYE' && (
            <button
              onClick={() => handleAction('pay')}
              disabled={actionLoading === 'pay'}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.5rem',
                background: '#059669',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              {actionLoading === 'pay' ? 'Paiement...' : '💰 Marquer comme Payé'}
            </button>
          )}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>
            Informations client
          </h3>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '1.125rem' }}>
              {devis.client.name}
            </div>
            {devis.client.company && (
              <div style={{ marginBottom: '0.25rem', color: '#64748b' }}>
                {devis.client.company}
              </div>
            )}
            <div style={{ marginBottom: '0.25rem', color: '#64748b' }}>
              📧 {devis.client.email}
            </div>
            {devis.client.phone && (
              <div style={{ marginBottom: '0.25rem', color: '#64748b' }}>
                📞 {devis.client.phone}
              </div>
            )}
            {devis.client.address && (
              <div style={{ color: '#64748b' }}>
                📍 {devis.client.address}
              </div>
            )}
          </div>
          
          {devis.chantier && (
            <div>
              <h4 style={{ marginBottom: '0.5rem', color: '#374151' }}>
                Chantier associé
              </h4>
              <Link
                href={`/dashboard/chantiers/${devis.chantier.id}`}
                style={{
                  display: 'block',
                  padding: '0.75rem',
                  background: '#f0f9ff',
                  border: '1px solid #0ea5e9',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  color: '#0369a1'
                }}
              >
                🏗️ {devis.chantier.nom}
                <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {devis.chantier.adresse}
                </div>
              </Link>
            </div>
          )}
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>
            Informations document
          </h3>
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '500' }}>Créé le:</span> {formatDate(devis.dateCreation)}
            </div>
            {devis.dateValidite && (
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '500' }}>Valide jusqu'au:</span> {formatDate(devis.dateValidite)}
              </div>
            )}
            {devis.dateEnvoi && (
              <div style={{ marginBottom: '0.5rem' }}>
               <span style={{ fontWeight: '500' }}>Envoyé le:</span> {formatDate(devis.dateEnvoi)}
             </div>
           )}
           {devis.dateAcceptation && (
             <div style={{ marginBottom: '0.5rem' }}>
               <span style={{ fontWeight: '500' }}>Accepté le:</span> {formatDate(devis.dateAcceptation)}
             </div>
           )}
           {devis.datePaiement && (
             <div style={{ marginBottom: '0.5rem' }}>
               <span style={{ fontWeight: '500' }}>Payé le:</span> {formatDate(devis.datePaiement)}
             </div>
           )}
         </div>
         
         {devis.devisOrigine && (
           <div style={{ marginTop: '1rem' }}>
             <h4 style={{ marginBottom: '0.5rem', color: '#374151' }}>
               Devis d'origine
             </h4>
             <Link
               href={`/dashboard/devis/${devis.devisOrigine.id}`}
               style={{
                 display: 'block',
                 padding: '0.5rem',
                 background: '#fef3c7',
                 border: '1px solid #f59e0b',
                 borderRadius: '0.5rem',
                 textDecoration: 'none',
                 color: '#92400e',
                 fontSize: '0.875rem'
               }}
             >
               📄 {devis.devisOrigine.numero}
             </Link>
           </div>
         )}
         
         {devis.facture && (
           <div style={{ marginTop: '1rem' }}>
             <h4 style={{ marginBottom: '0.5rem', color: '#374151' }}>
               Facture générée
             </h4>
             <Link
               href={`/dashboard/devis/${devis.facture.id}`}
               style={{
                 display: 'block',
                 padding: '0.5rem',
                 background: '#ecfdf5',
                 border: '1px solid #10b981',
                 borderRadius: '0.5rem',
                 textDecoration: 'none',
                 color: '#065f46',
                 fontSize: '0.875rem'
               }}
             >
               🧾 {devis.facture.numero}
             </Link>
           </div>
         )}
       </div>
     </div>

     <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
       <h3 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>
         Détail des lignes
       </h3>
       
       <div style={{ 
         background: '#f8fafc',
         padding: '1rem',
         borderRadius: '0.5rem',
         marginBottom: '1rem'
       }}>
         <div style={{
           display: 'grid',
           gridTemplateColumns: 'auto 2fr 80px 100px 80px 100px',
           gap: '1rem',
           fontWeight: '600',
           fontSize: '0.875rem',
           color: '#374151'
         }}>
           <div>#</div>
           <div>Désignation</div>
           <div>Qté</div>
           <div>Prix Unit.</div>
           <div>TVA %</div>
           <div>Total HT</div>
         </div>
       </div>

       <div style={{ marginBottom: '1.5rem' }}>
         {devis.lignes.map((ligne, index) => (
           <div key={ligne.id} style={{
             display: 'grid',
             gridTemplateColumns: 'auto 2fr 80px 100px 80px 100px',
             gap: '1rem',
             alignItems: 'center',
             padding: '1rem 0',
             borderBottom: index < devis.lignes.length - 1 ? '1px solid #e5e7eb' : 'none'
           }}>
             <div style={{ 
               fontWeight: '500',
               color: '#64748b',
               fontSize: '0.875rem'
             }}>
               {ligne.ordre}
             </div>
             <div style={{ fontSize: '0.875rem' }}>
               {ligne.designation}
             </div>
             <div style={{ 
               textAlign: 'center',
               fontSize: '0.875rem',
               color: '#64748b'
             }}>
               {ligne.quantite}
             </div>
             <div style={{ 
               textAlign: 'right',
               fontSize: '0.875rem',
               color: '#64748b'
             }}>
               {formatCurrency(Number(ligne.prixUnitaire))}
             </div>
             <div style={{ 
               textAlign: 'center',
               fontSize: '0.875rem',
               color: '#64748b'
             }}>
               {ligne.tva}%
             </div>
             <div style={{ 
               textAlign: 'right',
               fontWeight: '500',
               fontSize: '0.875rem'
             }}>
               {formatCurrency(Number(ligne.total))}
             </div>
           </div>
         ))}
       </div>

       <div style={{
         background: '#f0f9ff',
         border: '1px solid #0ea5e9',
         borderRadius: '0.5rem',
         padding: '1.5rem'
       }}>
         <div style={{
           display: 'grid',
           gridTemplateColumns: '1fr auto',
           gap: '2rem',
           alignItems: 'center'
         }}>
           <div>
             <h4 style={{ margin: '0 0 0.5rem 0', color: '#0369a1' }}>
               Récapitulatif
             </h4>
             <p style={{ margin: 0, fontSize: '0.875rem', color: '#0369a1' }}>
               {devis.lignes.length} ligne{devis.lignes.length > 1 ? 's' : ''}
             </p>
           </div>
           <div style={{ textAlign: 'right' }}>
             <div style={{ 
               marginBottom: '0.5rem',
               fontSize: '1rem',
               color: '#0369a1'
             }}>
               Total HT: {formatCurrency(Number(devis.totalHT))}
             </div>
             <div style={{ 
               marginBottom: '0.5rem',
               fontSize: '1rem',
               color: '#0369a1'
             }}>
               TVA: {formatCurrency(Number(devis.totalTVA))}
             </div>
             <div style={{ 
               fontSize: '1.5rem',
               fontWeight: 'bold',
               color: '#0369a1'
             }}>
               Total TTC: {formatCurrency(Number(devis.totalTTC))}
             </div>
           </div>
         </div>
       </div>
     </div>

     {(devis.notes || devis.conditionsVente) && (
       <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
         <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>
           Informations complémentaires
         </h3>
         
         {devis.notes && (
           <div style={{ marginBottom: '1rem' }}>
             <h4 style={{ marginBottom: '0.5rem', color: '#374151', fontSize: '1rem' }}>
               Notes
             </h4>
             <div style={{
               padding: '1rem',
               background: '#f8fafc',
               borderRadius: '0.5rem',
               fontSize: '0.875rem',
               color: '#64748b',
               whiteSpace: 'pre-wrap'
             }}>
               {devis.notes}
             </div>
           </div>
         )}
         
         {devis.conditionsVente && (
           <div>
             <h4 style={{ marginBottom: '0.5rem', color: '#374151', fontSize: '1rem' }}>
               Conditions de vente
             </h4>
             <div style={{
               padding: '1rem',
               background: '#f8fafc',
               borderRadius: '0.5rem',
               fontSize: '0.875rem',
               color: '#64748b',
               whiteSpace: 'pre-wrap'
             }}>
               {devis.conditionsVente}
             </div>
           </div>
         )}
       </div>
     )}

     <div style={{
       display: 'flex',
       justifyContent: 'space-between',
       alignItems: 'center',
       padding: '1rem',
       background: '#f8fafc',
       borderRadius: '0.5rem',
       border: '1px solid #e2e8f0'
     }}>
       <div style={{ display: 'flex', gap: '1rem' }}>
         <button
           onClick={() => alert('Fonction d\'impression simulée')}
           style={{
             padding: '0.5rem 1rem',
             border: '1px solid #d1d5db',
             borderRadius: '0.5rem',
             background: 'white',
             color: '#374151',
             cursor: 'pointer',
             fontSize: '0.875rem'
           }}
         >
           🖨️ Imprimer
         </button>
         <button
           onClick={() => alert('Téléchargement PDF simulé')}
           style={{
             padding: '0.5rem 1rem',
             border: '1px solid #d1d5db',
             borderRadius: '0.5rem',
             background: 'white',
             color: '#374151',
             cursor: 'pointer',
             fontSize: '0.875rem'
           }}
         >
           📄 PDF
         </button>
         <button
           onClick={() => {
             const url = `${window.location.origin}/dashboard/devis/${devis.id}`;
             navigator.clipboard.writeText(url);
             alert('Lien copié dans le presse-papier');
           }}
           style={{
             padding: '0.5rem 1rem',
             border: '1px solid #d1d5db',
             borderRadius: '0.5rem',
             background: 'white',
             color: '#374151',
             cursor: 'pointer',
             fontSize: '0.875rem'
           }}
         >
           🔗 Partager
         </button>
       </div>

       {devis.statut === 'BROUILLON' && (
         <button
           onClick={() => handleAction('delete')}
           disabled={actionLoading === 'delete'}
           style={{
             padding: '0.5rem 1rem',
             border: 'none',
             borderRadius: '0.5rem',
             background: '#ef4444',
             color: 'white',
             cursor: 'pointer',
             fontSize: '0.875rem'
           }}
         >
           {actionLoading === 'delete' ? 'Suppression...' : '🗑️ Supprimer'}
         </button>
       )}
     </div>
   </div>
 );
}
