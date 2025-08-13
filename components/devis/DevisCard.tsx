'use client';

import Link from 'next/link';

interface DevisCardProps {
 devis: {
   id: string;
   numero: string;
   type: 'DEVIS' | 'FACTURE';
   statut: 'BROUILLON' | 'ENVOYE' | 'ACCEPTE' | 'REFUSE' | 'PAYE' | 'ANNULE';
   objet: string;
   client: {
     id: string;
     name: string;
     company?: string;
   };
   chantier?: {
     id: string;
     nom: string;
   };
   totalTTC: number;
   dateCreation: string;
   dateValidite?: string;
   _count?: {
     lignes: number;
   };
 };
}

export default function DevisCard({ devis }: DevisCardProps) {
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

 const isExpired = devis.dateValidite && new Date(devis.dateValidite) < new Date();

 return (
   <Link
     href={`/dashboard/devis/${devis.id}`}
     style={{ textDecoration: 'none' }}
   >
     <div style={{
       background: 'white',
       border: '1px solid #e2e8f0',
       borderRadius: '0.75rem',
       padding: '1.5rem',
       transition: 'all 0.2s ease',
       cursor: 'pointer',
       position: 'relative'
     }}
     onMouseEnter={(e) => {
       e.currentTarget.style.transform = 'translateY(-2px)';
       e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
     }}
     onMouseLeave={(e) => {
       e.currentTarget.style.transform = 'translateY(0)';
       e.currentTarget.style.boxShadow = 'none';
     }}
     >
       {isExpired && (
         <div style={{
           position: 'absolute',
           top: '0.5rem',
           right: '0.5rem',
           background: '#fee2e2',
           color: '#dc2626',
           padding: '0.25rem 0.5rem',
           borderRadius: '0.5rem',
           fontSize: '0.75rem',
           fontWeight: '500'
         }}>
           ⚠️ Expiré
         </div>
       )}

       <div style={{ 
         display: 'flex', 
         justifyContent: 'space-between',
         alignItems: 'flex-start',
         marginBottom: '1rem'
       }}>
         <div>
           <div style={{ 
             display: 'flex',
             alignItems: 'center',
             gap: '0.5rem',
             marginBottom: '0.5rem'
           }}>
             <span style={{ fontSize: '1.25rem' }}>
               {devis.type === 'DEVIS' ? '📄' : '🧾'}
             </span>
             <span style={{ 
               fontWeight: 'bold',
               color: '#1e293b',
               fontSize: '1.125rem'
             }}>
               {devis.numero}
             </span>
           </div>
           <p style={{ 
             color: '#64748b',
             fontSize: '0.875rem',
             margin: 0,
             lineHeight: '1.4'
           }}>
             {devis.objet.length > 50 ? 
               `${devis.objet.substring(0, 50)}...` : 
               devis.objet
             }
           </p>
         </div>
         <span style={{
           background: getStatusColor(devis.statut),
           color: 'white',
           padding: '0.25rem 0.75rem',
           borderRadius: '1rem',
           fontSize: '0.75rem',
           fontWeight: '500',
           whiteSpace: 'nowrap'
         }}>
           {getStatusText(devis.statut)}
         </span>
       </div>

       <div style={{ marginBottom: '1rem' }}>
         <div style={{ 
           display: 'flex',
           alignItems: 'center',
           gap: '0.5rem',
           marginBottom: '0.5rem'
         }}>
           <span style={{ color: '#64748b', fontSize: '0.875rem' }}>👤</span>
           <span style={{ fontSize: '0.875rem', color: '#1e293b', fontWeight: '500' }}>
             {devis.client.name}
           </span>
           {devis.client.company && (
             <span style={{ 
               fontSize: '0.75rem', 
               color: '#64748b',
               background: '#f1f5f9',
               padding: '0.125rem 0.5rem',
               borderRadius: '0.25rem'
             }}>
               {devis.client.company}
             </span>
           )}
         </div>
         {devis.chantier && (
           <div style={{ 
             display: 'flex',
             alignItems: 'center',
             gap: '0.5rem'
           }}>
             <span style={{ color: '#64748b', fontSize: '0.875rem' }}>🏗️</span>
             <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
               {devis.chantier.nom.length > 30 ? 
                 `${devis.chantier.nom.substring(0, 30)}...` : 
                 devis.chantier.nom
               }
             </span>
           </div>
         )}
       </div>

       <div style={{ 
         display: 'flex',
         justifyContent: 'space-between',
         alignItems: 'flex-end'
       }}>
         <div>
           <div style={{ 
             fontSize: '1.25rem',
             fontWeight: 'bold',
             color: '#059669',
             marginBottom: '0.25rem'
           }}>
             {formatCurrency(Number(devis.totalTTC))}
           </div>
           <div style={{ 
             fontSize: '0.75rem',
             color: '#64748b'
           }}>
             {devis._count?.lignes || 0} ligne{(devis._count?.lignes || 0) > 1 ? 's' : ''}
           </div>
         </div>
         <div style={{ textAlign: 'right' }}>
           <div style={{ 
             fontSize: '0.75rem',
             color: '#64748b',
             marginBottom: '0.25rem'
           }}>
             Créé le {formatDate(devis.dateCreation)}
           </div>
           {devis.dateValidite && (
             <div style={{ 
               fontSize: '0.75rem',
               color: isExpired ? '#ef4444' : '#64748b',
               fontWeight: isExpired ? '500' : '400'
             }}>
               {isExpired ? 'Expiré le' : 'Valide jusqu\'au'} {formatDate(devis.dateValidite)}
             </div>
           )}
         </div>
       </div>
     </div>
   </Link>
 );
}
