'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ClientDetail from '@/components/crm/ClientDetail';

export default function CRMClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    typeClient: 'TOUS',
    commercial: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      // Simulation - En production utiliser API users avec role CLIENT
      const mockClients = [
        {
          id: '1',
          name: 'Sophie Durand',
          email: 'sophie.durand@email.com',
          company: 'Durand & Associés',
          typeClient: 'PROFESSIONNEL',
          phone: '+33 6 12 34 56 78',
          ville: 'Paris',
          chiffreAffaires: 850000,
          dernierContact: new Date().toISOString(),
          nbOpportunites: 3,
          valeurPipeline: 70000
        },
        {
          id: '2',
          name: 'Pierre Martin',
          email: 'pierre.martin@gmail.com',
          company: null,
          typeClient: 'PARTICULIER',
          phone: '+33 6 87 65 43 21',
          ville: 'Lyon',
          chiffreAffaires: 0,
          dernierContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          nbOpportunites: 1,
          valeurPipeline: 25000
        },
        {
          id: '3',
          name: 'Syndic Résidence Voltaire',
          email: 'contact@syndic-voltaire.fr',
          company: 'Syndic Voltaire',
          typeClient: 'SYNDIC',
          phone: '+33 1 23 45 67 89',
          ville: 'Marseille',
          chiffreAffaires: 1200000,
          dernierContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          nbOpportunites: 5,
          valeurPipeline: 150000
        }
      ];
      setClients(mockClients);
    } catch (error) {
      console.error('Erreur chargement clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeClientColor = (type: string) => {
    const colors = {
      PARTICULIER: '#3b82f6',
      PROFESSIONNEL: '#10b981',
      SYNDIC: '#f59e0b',
      PROMOTEUR: '#8b5cf6'
    };
    return colors[type as keyof typeof colors] || '#64748b';
  };

  const getTypeClientLabel = (type: string) => {
    const labels = {
      PARTICULIER: 'Particulier',
      PROFESSIONNEL: 'Professionnel',
      SYNDIC: 'Syndic',
      PROMOTEUR: 'Promoteur'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  const filteredClients = clients.filter(client => {
    const matchSearch = client.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                       client.email.toLowerCase().includes(filters.search.toLowerCase()) ||
                       (client.company && client.company.toLowerCase().includes(filters.search.toLowerCase()));
    
    const matchType = filters.typeClient === 'TOUS' || client.typeClient === filters.typeClient;
    
    return matchSearch && matchType;
  });

  if (selectedClient) {
    return (
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => setSelectedClient(null)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              background: 'white',
              color: '#374151',
              cursor: 'pointer',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            ← Retour à la liste
          </button>
        </div>
        <ClientDetail clientId={selectedClient} />
      </div>
    );
  }

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
            👥 Gestion Clients CRM
          </h1>
          <p style={{ color: '#64748b', margin: 0 }}>
            {filteredClients.length} client{filteredClients.length > 1 ? 's' : ''} • Pipeline total: {formatCurrency(clients.reduce((sum, c) => sum + c.valeurPipeline, 0))}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link
            href="/dashboard/crm/opportunites"
            style={{
              padding: '0.75rem 1.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              background: 'white',
              color: '#374151',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}
          >
            🎯 Pipeline Global
          </Link>
          <Link
            href="/dashboard/users"
            className="btn-primary"
            style={{ textDecoration: 'none' }}
          >
            ➕ Nouveau Client
          </Link>
        </div>
      </div>

      {/* Filtres */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <input
              type="text"
              placeholder="Rechercher par nom, email ou entreprise..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
            />
          </div>
          
          <select
            value={filters.typeClient}
            onChange={(e) => setFilters({ ...filters, typeClient: e.target.value })}
            style={{
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              background: 'white',
              fontSize: '0.875rem'
            }}
          >
            <option value="TOUS">Tous les types</option>
            <option value="PARTICULIER">Particuliers</option>
            <option value="PROFESSIONNEL">Professionnels</option>
            <option value="SYNDIC">Syndics</option>
            <option value="PROMOTEUR">Promoteurs</option>
          </select>
        </div>
      </div>

      {/* Liste des clients */}
      {loading ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ color: '#64748b' }}>Chargement des clients...</div>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
          <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>
            Aucun client trouvé
          </h3>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            {filters.search || filters.typeClient !== 'TOUS' ? 
              'Aucun client ne correspond à vos critères de recherche.' :
              'Commencez par ajouter vos premiers clients.'
            }
          </p>
          <Link
            href="/dashboard/users"
            className="btn-primary"
            style={{ textDecoration: 'none' }}
          >
            Ajouter un client
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1rem'
        }}>
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="card"
              style={{
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => setSelectedClient(client.id)}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '50%',
                  background: getTypeClientColor(client.typeClient),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}>
                  {client.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '600',
                    color: '#1e293b',
                    marginBottom: '0.25rem'
                  }}>
                    {client.name}
                  </div>
                  {client.company && (
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#64748b',
                      marginBottom: '0.25rem'
                    }}>
                      {client.company}
                    </div>
                  )}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{
                      background: getTypeClientColor(client.typeClient),
                      color: 'white',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {getTypeClientLabel(client.typeClient)}
                    </span>
                    {client.ville && (
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#64748b'
                      }}>
                        📍 {client.ville}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  background: '#f0f9ff',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '1.125rem',
                    fontWeight: 'bold',
                    color: '#0369a1'
                  }}>
                    {client.nbOpportunites}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#0369a1' }}>
                    Opportunités
                  </div>
                </div>
                
                <div style={{
                  background: '#ecfdf5',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    color: '#059669'
                  }}>
                    {formatCurrency(client.valeurPipeline)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#059669' }}>
                    Pipeline
                  </div>
                </div>
              </div>

              <div style={{
                paddingTop: '1rem',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.75rem',
                color: '#64748b'
              }}>
                <div>
                  📧 {client.email}
                </div>
                <div>
                  Dernier contact: {formatDate(client.dernierContact)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
