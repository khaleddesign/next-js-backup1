'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

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
  statutElectronique?: string;
  formatElectronique?: string;
  pdpProvider?: string;
  pdpReference?: string;
  dateTransmission?: string;
  sirenClient?: string;
  autoliquidation?: boolean;
  mentionAutoliq?: string;
  situationNumero?: number;
  situationParent?: string;
  tva55?: number;
  tva10?: number;
  tva20?: number;
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
  ligneDevis: Array<{
    id: string;
    description: string;
    quantite: number;
    prixUnit: number;
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
  const { user } = useAuth();
  const [devis, setDevis] = useState<DevisDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const [tvaMontants, setTvaMontants] = useState<{tva55: number, tva10: number, tva20: number} | null>(null);
  const [situations, setSituations] = useState<DevisDetail[]>([]);

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
        
        // Charger les données TVA multi-taux si disponibles
        if (data.type === 'DEVIS' || data.type === 'FACTURE') {
          fetchTvaRepartition(data.id);
        }
        
        // Charger les situations de travaux si c'est un devis
        if (data.type === 'DEVIS' && data.statut === 'ACCEPTE') {
          fetchSituations(data.id);
        }
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
  
  const fetchTvaRepartition = async (devisId: string) => {
    try {
      const response = await fetch(`/api/devis/${devisId}/tva-multitaux`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTvaMontants({
            tva55: data.repartitionTVA.tva55 || 0,
            tva10: data.repartitionTVA.tva10 || 0,
            tva20: data.repartitionTVA.tva20 || 0
          });
        }
      }
    } catch (error) {
      console.error('Erreur TVA multitaux:', error);
    }
  };
  
  const fetchSituations = async (devisId: string) => {
    try {
      const response = await fetch(`/api/devis/${devisId}/situations`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.situations) {
          setSituations(data.situations);
        }
      }
    } catch (error) {
      console.error('Erreur chargement situations:', error);
    }
  };

  const handleAction = async (action: string, additionalData?: any) => {
    if (!devis) return;
    
    try {
      setActionLoading(action);
      let response;
      
      switch (action) {
        case 'convert':
          setShowConvertModal(true);
          setActionLoading(null);
          return;
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
          
        case 'autoliquidation':
          response = await fetch(`/api/devis/${devis.id}/autoliquidation`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              autoliquidation: !devis.autoliquidation,
              mentionAutoliq: !devis.autoliquidation ? "TVA non applicable, art. 293 B du CGI - Autoliquidation" : null
            })
          });
          break;
          
        case 'situation':
          const avancement = additionalData?.avancement || 30;
          response = await fetch(`/api/devis/${devis.id}/situations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              avancement, 
              notes: `Situation de travaux - Avancement ${avancement}%` 
            })
          });
          break;
          
        case 'delete':
          if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
            response = await fetch(`/api/devis/${devis.id}`, {
              method: 'DELETE'
            });
          } else {
            setActionLoading(null);
            return;
          }
          break;
          
        default:
          setActionLoading(null);
          return;
      }

      if (response && response.ok) {
        const result = await response.json();
        
        if (action === 'convert') {
          router.push(`/dashboard/devis/${result.id}`);
        } else if (action === 'delete') {
          router.push('/dashboard/devis');
        } else if (action === 'situation') {
          router.push(`/dashboard/devis/${result.situation.id}`);
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

  // Logique des permissions selon les rôles
  const isClient = user?.role === 'CLIENT';
  const isAdmin = user?.role === 'ADMIN';
  const isCommercial = user?.role === 'COMMERCIAL';
  const canEdit = (isAdmin || isCommercial) && devis?.statut === 'BROUILLON';
  const canSend = (isAdmin || isCommercial) && devis?.statut === 'BROUILLON';
  const canAcceptRefuse = isClient && devis?.type === 'DEVIS' && devis?.statut === 'ENVOYE';
  const canConvert = (isAdmin || isCommercial) && devis?.type === 'DEVIS' && devis?.statut === 'ACCEPTE' && !devis?.facture;
  const canMarkPaid = (isAdmin || isCommercial) && devis?.type === 'FACTURE' && devis?.statut === 'ENVOYE';
  const canDelete = (isAdmin || isCommercial) && devis?.statut === 'BROUILLON';
  const canCreateSituation = (isAdmin || isCommercial) && devis?.type === 'DEVIS' && devis?.statut === 'ACCEPTE';
  const canToggleAutoliquidation = (isAdmin || isCommercial) && devis?.statut === 'BROUILLON';

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!devis) {
    return (
      <div className="p-8 text-center">
        <div className="text-2xl font-semibold text-gray-700 mb-4">Document non trouvé</div>
        <Link 
          href="/dashboard/devis"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête et actions */}
      <div className="mb-8 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/dashboard/devis"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Retour aux devis
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-xl">{devis.type === 'DEVIS' ? '📄' : '🧾'}</span>
              {devis.numero}
            </h1>
            
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${getStatusColor(devis.statut)}20`,
                color: getStatusColor(devis.statut)
              }}
            >
              {getStatusText(devis.statut)}
            </span>
            
            {devis.situationNumero && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Situation {devis.situationNumero}
              </span>
            )}
          </div>
          
          <p className="text-gray-500 mt-1">{devis.objet}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {canEdit && (
            <Link
              href={`/dashboard/devis/${devis.id}/edit`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modifier
            </Link>
          )}
          
          {canSend && (
            <button
              onClick={() => handleAction('send')}
              disabled={actionLoading === 'send'}
              className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {actionLoading === 'send' ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              )}
              Envoyer
            </button>
          )}
          
          {canConvert && (
            <button
              onClick={() => handleAction('convert')}
              disabled={actionLoading === 'convert'}
              className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
            >
              {actionLoading === 'convert' ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              )}
              Convertir en facture
            </button>
          )}
          
          {canMarkPaid && (
            <button
              onClick={() => handleAction('pay')}
              disabled={actionLoading === 'pay'}
              className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              {actionLoading === 'pay' ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              Marquer payé
            </button>
          )}
          
          {canAcceptRefuse && (
            <>
              <button
                onClick={() => handleAction('accept')}
                disabled={actionLoading === 'accept'}
                className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                {actionLoading === 'accept' ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                Accepter
              </button>
              
              <button
                onClick={() => handleAction('refuse')}
                disabled={actionLoading === 'refuse'}
                className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                {actionLoading === 'refuse' ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                Refuser
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Onglets */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('general')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'general'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Général
          </button>
          
          <button
            onClick={() => setActiveTab('btp')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'btp'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Spécifique BTP
          </button>
          
          <button
            onClick={() => setActiveTab('finances')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'finances'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Finances
          </button>
          
          <button
            onClick={() => setActiveTab('situations')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'situations'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Situations de travaux
          </button>
        </nav>
      </div>
      
      {/* Contenu de l'onglet Général */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informations client */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Informations client</h3>
                <Link
                  href={`/dashboard/clients/${devis.client.id}`}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Voir fiche client
                </Link>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="text-lg font-medium text-gray-900 mb-2">{devis.client.name}</div>
                {devis.client.company && (
                  <div className="text-sm text-gray-500 mb-1">{devis.client.company}</div>
                )}
                <div className="text-sm text-gray-500 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {devis.client.email}
                </div>
                {devis.client.phone && (
                  <div className="text-sm text-gray-500 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {devis.client.phone}
                  </div>
                )}
                {devis.client.address && (
                  <div className="text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {devis.client.address}
                  </div>
                )}
              </div>
              
              {devis.chantier && (
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <h4 className="text-base font-medium text-gray-900 mb-2">Chantier associé</h4>
                  <Link
                    href={`/dashboard/chantiers/${devis.chantier.id}`}
                    className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors"
                  >
                    <div className="font-medium text-blue-800">{devis.chantier.nom}</div>
                    <div className="text-sm text-blue-600 mt-1">{devis.chantier.adresse}</div>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Informations document et récapitulatif financier */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Informations document</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Type de document</dt>
                      <dd className="mt-1 text-sm text-gray-900">{devis.type === 'DEVIS' ? 'Devis' : 'Facture'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Numéro</dt>
                      <dd className="mt-1 text-sm text-gray-900">{devis.numero}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Date de création</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDate(devis.dateCreation)}</dd>
                    </div>
                    {devis.dateValidite && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Date de validité</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(devis.dateValidite)}</dd>
                      </div>
                    )}
                    {devis.dateEnvoi && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Date d'envoi</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(devis.dateEnvoi)}</dd>
                      </div>
                    )}
                    {devis.dateAcceptation && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Date d'acceptation</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(devis.dateAcceptation)}</dd>
                      </div>
                    )}
                    {devis.datePaiement && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Date de paiement</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(devis.datePaiement)}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Statut</dt>
                      <dd className="mt-1">
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${getStatusColor(devis.statut)}20`,
                            color: getStatusColor(devis.statut)
                          }}
                        >
                          {getStatusText(devis.statut)}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Récapitulatif financier</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="overflow-hidden border-b border-gray-200">
                          <table className="min-w-full divide-y divide-gray-200">
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total HT</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{formatCurrency(devis.totalHT)}</td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total TVA</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{formatCurrency(devis.totalTVA)}</td>
                              </tr>
                              <tr className="bg-blue-50">
                                <td className="px-6 py-4 whitespace-nowrap text-base font-bold text-blue-900">Total TTC</td>
                                <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-blue-900 text-right">{formatCurrency(devis.totalTTC)}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Détail des lignes */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Détail des lignes</h3>
              <span className="text-sm text-gray-500">{devis.ligneDevis.length} ligne(s)</span>
            </div>
            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Désignation</th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qté</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Prix Unit. HT</th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">TVA</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total HT</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {devis.ligneDevis.map((ligne) => (
                      <tr key={ligne.id}>
                        <td className="px-6 py-4 text-sm text-gray-900">{ligne.description}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 text-center">{ligne.quantite}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 text-right">{formatCurrency(ligne.prixUnit)}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 text-center">20%</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">{formatCurrency(ligne.total)}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">Total HT</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">{formatCurrency(devis.totalHT)}</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">Total TVA</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">{formatCurrency(devis.totalTVA)}</td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td colSpan={4} className="px-6 py-4 text-base font-bold text-blue-900 text-right">Total TTC</td>
                      <td className="px-6 py-4 text-base font-bold text-blue-900 text-right">{formatCurrency(devis.totalTTC)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Notes et conditions */}
          {(devis.notes || devis.conditionsVente) && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Informations complémentaires</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6 space-y-4">
                {devis.notes && (
                  <div>
                    <h4 className="text-base font-medium text-gray-900 mb-2">Notes</h4>
                    <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700 whitespace-pre-wrap">{devis.notes}</div>
                  </div>
                )}
                
                {devis.conditionsVente && (
                  <div>
                    <h4 className="text-base font-medium text-gray-900 mb-2">Conditions de vente</h4>
                    <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700 whitespace-pre-wrap">{devis.conditionsVente}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Contenu de l'onglet BTP */}
      {activeTab === 'btp' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* TVA Multi-taux */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <span className="mr-2 text-xl">🧮</span>
                  TVA Multi-taux
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <p className="text-sm text-gray-500 mb-4">
                  Répartition des montants TVA selon les taux applicables au BTP.
                </p>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div className="text-sm text-gray-500">TVA 5,5% (rénovation énergétique)</div>
                    <div className="text-sm font-medium">{formatCurrency(tvaMontants?.tva55 || 0)}</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div className="text-sm text-gray-500">TVA 10% (amélioration habitation)</div>
                    <div className="text-sm font-medium">{formatCurrency(tvaMontants?.tva10 || 0)}</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div className="text-sm text-gray-500">TVA 20% (construction neuve)</div>
                    <div className="text-sm font-medium">{formatCurrency(tvaMontants?.tva20 || 0)}</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md border-t border-blue-100">
                    <div className="text-sm font-medium text-blue-800">Total TVA</div>
                    <div className="text-sm font-medium text-blue-800">
                      {formatCurrency(
                        (tvaMontants?.tva55 || 0) + 
                        (tvaMontants?.tva10 || 0) + 
                        (tvaMontants?.tva20 || 0)
                      )}
                    </div>
                  </div>
                </div>
                
                {canEdit && devis.statut === 'BROUILLON' && (
                  <div className="mt-4">
                    <Link
                      href={`/dashboard/devis/${devis.id}/tva-multitaux`}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Modifier la répartition TVA
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            {/* Autoliquidation */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <span className="mr-2 text-xl">📑</span>
                  Autoliquidation TVA
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <p className="text-sm text-gray-500 mb-4">
                  Règles fiscales spécifiques pour les sous-traitants BTP.
                </p>
                
                <div className="p-4 bg-gray-50 rounded-md mb-4">
                  <div className="flex items-center mb-2">
                    <div className={`h-4 w-4 rounded-full ${devis.autoliquidation ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
                    <div className={`text-sm font-medium ${devis.autoliquidation ? 'text-green-800' : 'text-gray-500'}`}>
                      {devis.autoliquidation ? 'Autoliquidation activée' : 'Autoliquidation désactivée'}
                    </div>
                  </div>
                  
                  {devis.autoliquidation && devis.mentionAutoliq && (
                    <div className="mt-2 p-3 bg-green-50 text-sm text-green-700 rounded-md border border-green-100">
                      {devis.mentionAutoliq}
                    </div>
                  )}
                </div>
                
                {devis.autoliquidation && (
                  <div className="p-4 bg-green-50 rounded-md mb-4 text-sm text-green-700">
                    <div className="font-medium mb-1">Effets de l'autoliquidation :</div>
                    <ul className="list-disc list-inside ml-2 space-y-1">
                      <li>TVA à 0%</li>
                      <li>Total TTC = Total HT</li>
                      <li>Mention légale obligatoire</li>
                    </ul>
                  </div>
                )}
                
                {canToggleAutoliquidation && (
                  <button
                    onClick={() => handleAction('autoliquidation')}
                    disabled={actionLoading === 'autoliquidation'}
                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white ${
                      devis.autoliquidation
                        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  >
                    {actionLoading === 'autoliquidation' ? (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>
                        {devis.autoliquidation ? 'Désactiver l\'autoliquidation' : 'Activer l\'autoliquidation'}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Autres fonctionnalités BTP */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <span className="mr-2 text-xl">🛠️</span>
                Autres fonctionnalités BTP
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                  <h4 className="text-base font-medium text-gray-900 mb-2">Retenue de garantie</h4>
                  <p className="text-sm text-gray-500">
                    {devis.retenueGarantie 
                      ? `${devis.retenueGarantie}% de retenue appliquée` 
                      : 'Non applicable pour ce document'}
                  </p>
                  {devis.retenueGarantie && devis.dateLiberation && (
                    <p className="text-sm text-gray-500 mt-2">
                      Date de libération: {formatDate(devis.dateLiberation)}
                    </p>
                  )}
                </div>
                
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                  <h4 className="text-base font-medium text-gray-900 mb-2">Caution bancaire</h4>
                  <p className="text-sm text-gray-500">
                    {devis.cautionBancaire 
                      ? 'Caution bancaire fournie' 
                      : 'Pas de caution bancaire'}
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                  <h4 className="text-base font-medium text-gray-900 mb-2">Corps d'état</h4>
                  <p className="text-sm text-gray-500">
                    {/* Simuler cette information qui n'est pas dans le modèle actuel */}
                    {devis.type === 'DEVIS' && devis.objet?.includes('salle de bain')
                      ? 'Plomberie, Carrelage'
                      : devis.type === 'DEVIS' && devis.objet?.includes('cuisine')
                      ? 'Électricité, Plomberie, Menuiserie'
                      : 'Non spécifié'}
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                  <h4 className="text-base font-medium text-gray-900 mb-2">Normes appliquées</h4>
                  <p className="text-sm text-gray-500">
                    {/* Simuler cette information qui n'est pas dans le modèle actuel */}
                    {devis.type === 'DEVIS' && devis.objet?.includes('salle de bain')
                      ? 'NF C15-100, DTU 60.1, DTU 52.2'
                      : devis.type === 'DEVIS' && devis.objet?.includes('cuisine')
                      ? 'NF C15-100, DTU 60.1, DTU 36.5'
                      : 'Standards professionnels'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Contenu de l'onglet Finances */}
      {activeTab === 'finances' && (
        <div className="space-y-6">
          {/* Synthèse financière */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <span className="mr-2 text-xl">💼</span>
                Synthèse Financière
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                  <div className="text-sm text-gray-500 mb-1">Total HT</div>
                  <div className="text-xl font-semibold">{formatCurrency(devis.totalHT)}</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                  <div className="text-sm text-gray-500 mb-1">Total TVA</div>
                  <div className="text-xl font-semibold">{formatCurrency(devis.totalTVA)}</div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                  <div className="text-sm text-blue-700 mb-1">Total TTC</div>
                  <div className="text-xl font-semibold text-blue-900">{formatCurrency(devis.totalTTC)}</div>
                </div>
                
                {devis.type === 'FACTURE' && (
                  <div className={`p-4 rounded-md border ${
                    devis.statut === 'PAYE'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-amber-50 border-amber-200'
                  }`}>
                    <div className={`text-sm ${
                      devis.statut === 'PAYE'
                        ? 'text-green-700'
                        : 'text-amber-700'
                    } mb-1`}>
                      Statut paiement
                    </div>
                    <div className={`text-xl font-semibold ${
                      devis.statut === 'PAYE'
                        ? 'text-green-900'
                        : 'text-amber-900'
                    }`}>
                      {devis.statut === 'PAYE' ? 'Payé' : 'En attente'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Modalités de paiement */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <span className="mr-2 text-xl">💸</span>
                Modalités de paiement
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="p-4 bg-gray-50 rounded-md border border-gray-200 mb-4">
                <p className="text-sm text-gray-700">
                  {devis.modalitesPaiement || 'Paiement à réception de facture, par virement bancaire ou chèque.'}
                </p>
              </div>
              
              {devis.type === 'FACTURE' && devis.statut === 'ENVOYE' && (
                <div className="p-4 bg-amber-50 rounded-md border border-amber-200 mb-4">
                  <h4 className="text-base font-medium text-amber-800 mb-1">Échéance de paiement</h4>
                  <p className="text-sm text-amber-700">
                    À régler avant le : <span className="font-semibold">{formatDate(devis.dateEcheance)}</span>
                  </p>
                </div>
              )}
              
              {devis.type === 'FACTURE' && devis.statut === 'PAYE' && devis.datePaiement && (
                <div className="p-4 bg-green-50 rounded-md border border-green-200">
                  <h4 className="text-base font-medium text-green-800 mb-1">Paiement reçu</h4>
                  <p className="text-sm text-green-700">
                    Date de paiement : <span className="font-semibold">{formatDate(devis.datePaiement)}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Actions financières */}
          {devis.type === 'FACTURE' && devis.statut === 'ENVOYE' && canMarkPaid && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <span className="mr-2 text-xl">💰</span>
                  Actions financières
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleAction('pay')}
                    disabled={actionLoading === 'pay'}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    {actionLoading === 'pay' ? (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>✅ Marquer comme payé</>
                    )}
                  </button>
                  
                  <Link
                    href={`/dashboard/factures/relances/nouveau?factureId=${devis.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
                  >
                    📩 Envoyer une relance
                  </Link>
                  
                  <Link
                    href={`/dashboard/factures/paiements/nouveau?factureId=${devis.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    💸 Enregistrer un paiement
                  </Link>
                </div>
              </div>
            </div>
          )}
          
          {/* Facturation Électronique */}
          {devis.type === 'FACTURE' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <span className="mr-2 text-xl">🔄</span>
                  Facturation Électronique
                </h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <p className="text-sm text-gray-500 mb-4">
                  Transmission vers Chorus Pro et autres plateformes de facturation électronique.
                </p>
                
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200 mb-4">
                  <h4 className="text-base font-medium text-gray-900 mb-2">Statut Facturation Électronique</h4>
                  <p className="text-sm text-gray-500">
                    {devis.statutElectronique || 'Non transmise'}
                  </p>
                </div>
                
                {isAdmin && (
                  <Link
                    href={`/dashboard/factures/${devis.id}/facture-electronique`}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Configurer la facturation électronique
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Contenu de l'onglet Situations de travaux */}
      {activeTab === 'situations' && (
        <div className="space-y-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <span className="mr-2 text-xl">📊</span>
                Situations de travaux
              </h3>
              
              {canCreateSituation && (
                <button
                  onClick={() => handleAction('situation', { avancement: 30 })}
                  disabled={actionLoading === 'situation'}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {actionLoading === 'situation' ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>+ Créer une situation</>
                  )}
                </button>
              )}
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              {situations.length > 0 ? (
                <div>
                  <div className="p-4 bg-blue-50 rounded-md border border-blue-200 mb-6">
                    <h4 className="text-base font-medium text-blue-800 mb-1">Suivi des situations de travaux</h4>
                    <p className="text-sm text-blue-600">
                      Ce devis comporte {situations.length} situation{situations.length > 1 ? 's' : ''} de travaux.
                      Les situations permettent de facturer l'avancement des travaux à intervalles réguliers.
                    </p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Situation</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Objet</th>
                          <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Avancement</th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Montant HT</th>
                          <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {situations.map((situation) => (
                          <tr 
                            key={situation.id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => router.push(`/dashboard/devis/${situation.id}`)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                              {situation.numero}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                              {situation.objet}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                              <div className="inline-flex items-center">
                                <span className="font-medium">{situation.avancement}%</span>
                                <div className="ml-2 w-16 bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{ width: `${situation.avancement}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                              {formatCurrency(situation.totalHT)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                              {formatDate(situation.dateCreation)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <span
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: `${getStatusColor(situation.statut)}20`,
                                  color: getStatusColor(situation.statut)
                                }}
                              >
                                {getStatusText(situation.statut)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : devis.type === 'DEVIS' && devis.statut === 'ACCEPTE' ? (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune situation de travaux</h3>
                  <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                    Les situations de travaux permettent de facturer l'avancement des travaux à intervalles réguliers.
                  </p>
                  
                  {canCreateSituation && (
                    <div className="mt-6">
                      <button
                        onClick={() => handleAction('situation', { avancement: 30 })}
                        disabled={actionLoading === 'situation'}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                      >
                        {actionLoading === 'situation' ? (
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <>+ Créer une situation de travaux</>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Fonctionnalité non disponible</h3>
                  <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
                    Les situations de travaux sont disponibles uniquement pour les devis acceptés.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Actions en bas de page */}
      <div className="mt-6 bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => alert('Fonction d\'impression simulée')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Imprimer
            </button>
            
            <button
              onClick={() => alert('Téléchargement PDF simulé')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              PDF
            </button>
            
            <button
              onClick={() => {
                const url = `${window.location.origin}/dashboard/devis/${devis.id}`;
                navigator.clipboard.writeText(url);
                alert('Lien copié dans le presse-papier');
              }}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Partager
            </button>
            
            <button
              onClick={() => alert('Email envoyé')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Envoyer par email
            </button>
          </div>
          
          {canDelete && (
            <button
              onClick={() => handleAction('delete')}
              disabled={actionLoading === 'delete'}
              className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              {actionLoading === 'delete' ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Supprimer
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
