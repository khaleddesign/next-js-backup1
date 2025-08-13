"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Membre {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'COMMERCIAL' | 'OUVRIER' | 'CLIENT';
  company?: string;
  phone?: string;
  specialites?: string[];
  disponible: boolean;
  chantiersActifs: number;
  avatar?: string;
  createdAt: string;
}

export default function EquipesPage() {
  const [membres, setMembres] = useState<Membre[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("TOUS");

  useEffect(() => {
    // Simulation du chargement des données
    setTimeout(() => {
      setMembres([
        {
          id: '1',
          name: 'Pierre Maçon',
          email: 'pierre.mason@chantierpro.com',
          role: 'OUVRIER',
          company: 'BTP Expert',
          phone: '06 12 34 56 78',
          specialites: ['Maçonnerie', 'Carrelage'],
          disponible: true,
          chantiersActifs: 2,
          avatar: 'PM',
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'Julie Électricienne',
          email: 'julie.electric@chantierpro.com',
          role: 'OUVRIER',
          company: 'Électro Pro',
          phone: '06 87 65 43 21',
          specialites: ['Électricité', 'Domotique'],
          disponible: false,
          chantiersActifs: 3,
          avatar: 'JE',
          createdAt: '2024-02-20'
        },
        {
          id: '3',
          name: 'Marc Commercial',
          email: 'marc.commercial@chantierpro.com',
          role: 'COMMERCIAL',
          company: 'ChantierPro',
          phone: '06 98 76 54 32',
          specialites: ['Vente', 'Négociation'],
          disponible: true,
          chantiersActifs: 5,
          avatar: 'MC',
          createdAt: '2024-01-10'
        },
        {
          id: '4',
          name: 'Sophie Plombière',
          email: 'sophie.plomberie@chantierpro.com',
          role: 'OUVRIER',
          company: 'Aqua Services',
          phone: '06 11 22 33 44',
          specialites: ['Plomberie', 'Chauffage'],
          disponible: true,
          chantiersActifs: 1,
          avatar: 'SP',
          createdAt: '2024-03-05'
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const filteredMembres = membres.filter(membre => {
    const matchesSearch = membre.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         membre.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         membre.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'TOUS' || membre.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return '#ef4444';
      case 'COMMERCIAL': return '#f97316';
      case 'OUVRIER': return '#3b82f6';
      case 'CLIENT': return '#10b981';
      default: return '#64748b';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrateur';
      case 'COMMERCIAL': return 'Commercial';
      case 'OUVRIER': return 'Ouvrier';
      case 'CLIENT': return 'Client';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: 'calc(100vh - 64px)', 
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#64748b' }}>Chargement des équipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: '0 0 0.5rem 0' }}>
                👥 Gestion des Équipes
              </h1>
              <p style={{ color: '#64748b', margin: 0 }}>
                Gérez votre personnel et assignez les équipes aux chantiers
              </p>
            </div>
            <Link
              href="/dashboard/equipes/nouveau"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #f97316)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'transform 0.2s ease',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              ➕ Ajouter un membre
            </Link>
          </div>

          {/* Stats */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ fontSize: '2rem' }}>👥</div>
                <div>
                  <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>
                    {membres.length}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
                    Membres total
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ fontSize: '2rem' }}>✅</div>
                <div>
                  <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                    {membres.filter(m => m.disponible).length}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
                    Disponibles
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ fontSize: '2rem' }}>🔧</div>
                <div>
                  <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                    {membres.filter(m => m.role === 'OUVRIER').length}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
                    Ouvriers
                  </p>
                </div>
              </div>
            </div>

            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ fontSize: '2rem' }}>🏗️</div>
                <div>
                  <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#f97316' }}>
                    {membres.reduce((total, m) => total + m.chantiersActifs, 0)}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
                    Chantiers actifs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <input
                type="text"
                placeholder="Rechercher un membre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['TOUS', 'ADMIN', 'COMMERCIAL', 'OUVRIER', 'CLIENT'].map(role => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0',
                    background: filterRole === role ? '#f0f9ff' : 'white',
                    color: filterRole === role ? '#0369a1' : '#64748b',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {role === 'TOUS' ? 'Tous' : getRoleLabel(role)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Liste des membres */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredMembres.map((membre) => (
            <div
              key={membre.id}
              style={{
                background: 'white',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
            >
              {/* Header carte */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #f97316)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}>
                  {membre.avatar}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#1e293b' }}>
                    {membre.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <span style={{
                      background: getRoleColor(membre.role),
                      color: 'white',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {getRoleLabel(membre.role)}
                    </span>
                    <span style={{
                      background: membre.disponible ? '#dcfce7' : '#fee2e2',
                      color: membre.disponible ? '#166534' : '#dc2626',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {membre.disponible ? 'Disponible' : 'Occupé'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Infos */}
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748b' }}>
                  📧 {membre.email}
                </p>
                {membre.phone && (
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748b' }}>
                    📱 {membre.phone}
                  </p>
                )}
                {membre.company && (
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748b' }}>
                    🏢 {membre.company}
                  </p>
                )}
              </div>

              {/* Spécialités */}
              {membre.specialites && membre.specialites.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', fontWeight: '600', color: '#374151' }}>
                    Spécialités:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {membre.specialites.map((spec, index) => (
                      <span
                        key={index}
                        style={{
                          background: '#f1f5f9',
                          color: '#475569',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem'
                        }}
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: '1px solid #f1f5f9'
              }}>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  {membre.chantiersActifs} chantier{membre.chantiersActifs > 1 ? 's' : ''} actif{membre.chantiersActifs > 1 ? 's' : ''}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link
                    href={`/dashboard/equipes/${membre.id}`}
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #e2e8f0',
                      background: 'white',
                      color: '#64748b',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.color = '#1e293b';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.color = '#64748b';
                    }}
                  >
                    ✏️ Modifier
                  </Link>
                  <Link
                    href={`/dashboard/equipes/${membre.id}`}
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #3b82f6',
                      background: '#3b82f6',
                      color: 'white',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#2563eb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#3b82f6';
                    }}
                  >
                    👁️ Détails
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucun résultat */}
        {filteredMembres.length === 0 && (
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>Aucun membre trouvé</h3>
            <p style={{ margin: 0, color: '#64748b' }}>
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </div>
    </div>
  );
}