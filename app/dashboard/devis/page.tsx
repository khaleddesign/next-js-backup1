'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Devis {
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
}

export default function DevisPage() {
 const [devisList, setDevisList] = useState<Devis[]>([]);
 const [loading, setLoading] = useState(true);
 const [activeTab, setActiveTab] = useState<'TOUS' | 'DEVIS' | 'FACTURE'>('TOUS');
 const [statusFilter, setStatusFilter] = useState('TOUS');
 const [searchTerm, setSearchTerm] = useState('');
 const [stats, setStats] = useState({
   totalDevis: 0,
   totalFactures: 0,
   montantTotal: 0,
   enAttente: 0,
   payes: 0
 });

 useEffect(() => {
   fetchDevis();
 }, [activeTab, statusFilter, searchTerm]);

 const fetchDevis = async () => {
   try {
     setLoading(true);
     const params = new URLSearchParams();
     if (activeTab !== 'TOUS') params.append('type', activeTab);
     if (statusFilter !== 'TOUS') params.append('statut', statusFilter);
     if (searchTerm) params.append('search', searchTerm);

     const response = await fetch(`/api/devis?${params}`);
     const data = await response.json();
     
     if (response.ok) {
       setDevisList(data.devis || []);
       calculateStats(data.devis || []);
     }
   } catch (error) {
     console.error('Erreur:', error);
     setDevisList([]);
   } finally {
     setLoading(false);
   }
 };

 const calculateStats = (devis: Devis[]) => {
   const stats = {
     totalDevis: devis.filter(d => d.type === 'DEVIS').length,
     totalFactures: devis.filter(d => d.type === 'FACTURE').length,
     montantTotal: devis.reduce((sum, d) => sum + Number(d.totalTTC), 0),
     enAttente: devis.filter(d => ['ENVOYE', 'ACCEPTE'].includes(d.statut)).length,
     payes: devis.filter(d => d.statut === 'PAYE').length
   };
   setStats(stats);
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

 return (
   <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
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
           Devis & Factures
         </h1>
         <p style={{ color: '#64748b', margin: 0 }}>
           Gestion complète de vos devis et factures
         </p>
       </div>
       <div style={{ display: 'flex', gap: '1rem' }}>
         <Link 
           href="/dashboard/devis/nouveau?type=DEVIS"
           className="btn-primary"
           style={{ textDecoration: 'none' }}
         >
           💰 Nouveau Devis
         </Link>
         <Link 
           href="/dashboard/devis/nouveau?type=FACTURE"
           className="btn-primary"
           style={{ textDecoration: 'none' }}
         >
           🧾 Nouvelle Facture
         </Link>
       </div>
     </div>

     <div style={{
       display: 'grid',
       gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
       gap: '1rem',
       marginBottom: '2rem'
     }}>
       <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
         <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
         <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
           {stats.totalDevis}
         </div>
         <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Devis</div>
       </div>

       <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
         <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧾</div>
         <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f97316' }}>
           {stats.totalFactures}
         </div>
         <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Factures</div>
       </div>

       <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
         <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
         <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>
           {formatCurrency(stats.montantTotal)}
         </div>
         <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Montant Total</div>
       </div>

       <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
         <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
         <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#eab308' }}>
           {stats.enAttente}
         </div>
         <div style={{ color: '#64748b', fontSize: '0.875rem' }}>En Attente</div>
       </div>
     </div>

     <div className="card" style={{ padding: '1.5rem' }}>
       <div style={{ 
         display: 'flex', 
         flexWrap: 'wrap',
         gap: '1rem',
         marginBottom: '1.5rem',
         alignItems: 'center'
       }}>
         <div style={{ display: 'flex', gap: '0.5rem' }}>
           {(['TOUS', 'DEVIS', 'FACTURE'] as const).map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               style={{
                 padding: '0.5rem 1rem',
                 border: 'none',
                 borderRadius: '0.5rem',
                 background: activeTab === tab ? '#3b82f6' : '#f1f5f9',
                 color: activeTab === tab ? 'white' : '#64748b',
                 cursor: 'pointer',
                 fontSize: '0.875rem',
                 fontWeight: '500'
               }}
             >
               {tab === 'TOUS' ? 'Tous' : tab === 'DEVIS' ? 'Devis' : 'Factures'}
             </button>
           ))}
         </div>

         <select
           value={statusFilter}
           onChange={(e) => setStatusFilter(e.target.value)}
           style={{
             padding: '0.5rem',
             border: '1px solid #d1d5db',
             borderRadius: '0.5rem',
             background: 'white'
           }}
         >
           <option value="TOUS">Tous les statuts</option>
           <option value="BROUILLON">Brouillon</option>
           <option value="ENVOYE">Envoyé</option>
           <option value="ACCEPTE">Accepté</option>
           <option value="REFUSE">Refusé</option>
           <option value="PAYE">Payé</option>
           <option value="ANNULE">Annulé</option>
         </select>

         <input
           type="text"
           placeholder="Rechercher..."
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           style={{
             padding: '0.5rem 1rem',
             border: '1px solid #d1d5db',
             borderRadius: '0.5rem',
             background: 'white',
             minWidth: '200px'
           }}
         />
       </div>

       {loading ? (
         <div style={{ 
           textAlign: 'center', 
           padding: '3rem',
           color: '#64748b' 
         }}>
           Chargement...
         </div>
       ) : devisList.length === 0 ? (
         <div style={{ 
           textAlign: 'center', 
           padding: '3rem',
           color: '#64748b' 
         }}>
           <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
           <p>Aucun {activeTab === 'DEVIS' ? 'devis' : activeTab === 'FACTURE' ? 'facture' : 'document'} trouvé</p>
           <Link 
             href="/dashboard/devis/nouveau"
             className="btn-primary"
             style={{ textDecoration: 'none', marginTop: '1rem' }}
           >
             Créer le premier
           </Link>
         </div>
       ) : (
         <div style={{
           display: 'grid',
           gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
           gap: '1rem'
         }}>
           {devisList.map((devis) => (
             <Link
               key={devis.id}
               href={`/dashboard/devis/${devis.id}`}
               style={{ textDecoration: 'none' }}
             >
               <div style={{
                 background: 'white',
                 border: '1px solid #e2e8f0',
                 borderRadius: '0.75rem',
                 padding: '1.5rem',
                 transition: 'all 0.2s ease',
                 cursor: 'pointer'
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
                         color: '#1e293b'
                       }}>
                         {devis.numero}
                       </span>
                     </div>
                     <p style={{ 
                       color: '#64748b',
                       fontSize: '0.875rem',
                       margin: 0
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
                     fontWeight: '500'
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
                     <span style={{ color: '#64748b' }}>👤</span>
                     <span style={{ fontSize: '0.875rem', color: '#1e293b' }}>
                       {devis.client.name}
                     </span>
                     {devis.client.company && (
                       <span style={{ 
                         fontSize: '0.75rem', 
                         color: '#64748b'
                       }}>
                         • {devis.client.company}
                       </span>
                     )}
                   </div>
                   {devis.chantier && (
                     <div style={{ 
                       display: 'flex',
                       alignItems: 'center',
                       gap: '0.5rem'
                     }}>
                       <span style={{ color: '#64748b' }}>🏗️</span>
                       <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                         {devis.chantier.nom}
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
                       color: '#059669'
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
                       color: '#64748b'
                     }}>
                       Créé le {formatDate(devis.dateCreation)}
                     </div>
                     {devis.dateValidite && (
                       <div style={{ 
                         fontSize: '0.75rem',
                         color: new Date(devis.dateValidite) < new Date() ? '#ef4444' : '#64748b'
                       }}>
                         Valide jusqu'au {formatDate(devis.dateValidite)}
                       </div>
                     )}
                   </div>
                 </div>
               </div>
             </Link>
           ))}
         </div>
       )}
     </div>
   </div>
 );
}
