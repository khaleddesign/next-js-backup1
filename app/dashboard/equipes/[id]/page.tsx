"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

interface Membre {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'COMMERCIAL' | 'OUVRIER' | 'CLIENT';
  company?: string;
  phone?: string;
  address?: string;
  specialites?: string[];
  disponible: boolean;
  chantiersActifs: number;
  avatar?: string;
  createdAt: string;
}

export default function MembreDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [membre, setMembre] = useState<Membre | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    // Simulation du chargement des données
    setTimeout(() => {
      // Ici vous feriez l'appel API réel
      // const response = await fetch(`/api/equipes/${params.id}`);
      // const data = await response.json();
      
      setMembre({
        id: params.id as string,
        name: 'Pierre Maçon',
        email: 'pierre.mason@chantierpro.com',
        role: 'OUVRIER',
        company: 'BTP Expert',
        phone: '06 12 34 56 78',
        address: '123 Rue des Artisans, 75001 Paris',
        specialites: ['Maçonnerie', 'Carrelage', 'Terrassement'],
        disponible: true,
        chantiersActifs: 2,
        avatar: 'PM',
        createdAt: '2024-01-15'
      });
      setLoading(false);
    }, 800);
  }, [params.id]);

  const handleDelete = async () => {
    try {
      // Ici vous feriez l'appel API réel
      // await fetch(`/api/equipes/${params.id}`, { method: 'DELETE' });
      
      console.log('Membre supprimé:', params.id);
      router.push('/dashboard/equipes');
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

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
          <p style={{ color: '#64748b' }}>Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (!membre) {
    return (
      <div style={{ 
        minHeight: 'calc(100vh - 64px)', 
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
          <p style={{ color: '#64748b' }}>Membre non trouvé</p>
          <Link
            href="/dashboard/equipes"
            style={{
              display: 'inline-block',
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem'
            }}
          >
            Retour aux équipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <Link
              href="/dashboard/equipes"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                background: 'white',
                border: '1px solid #e2e8f0',
                textDecoration: 'none',
                color: '#64748b',
                transition: 'all 0.2s ease'
              }}
            >
              ←
            </Link>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                👤 {membre.name}
              </h1>
              <p style={{ color: '#64748b', margin: '0.25rem 0 0 0' }}>
                Détails et gestion du membre
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setEditing(!editing)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #3b82f6',
                  background: editing ? '#3b82f6' : 'white',
                  color: editing ? 'white' : '#3b82f6',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {editing ? '✅ Sauvegarder' : '✏️ Modifier'}
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #ef4444',
                  background: 'white',
                  color: '#ef4444',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Informations principales */}
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            height: 'fit-content'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '1.5rem' }}>
              👤 Informations personnelles
            </h3>

            {/* Avatar et statut */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #f97316)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.25rem'
              }}>
                {membre.avatar}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#1e293b' }}>
                  {membre.name}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <span style={{
                    background: getRoleColor(membre.role),
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {getRoleLabel(membre.role)}
                  </span>
                  <span style={{
                    background: membre.disponible ? '#dcfce7' : '#fee2e2',
                    color: membre.disponible ? '#166534' : '#dc2626',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {membre.disponible ? 'Disponible' : 'Occupé'}
                  </span>
                </div>
              </div>
            </div>

            {/* Détails */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                  Email
                </label>
                <p style={{ margin: '0.25rem 0 0 0', color: '#1e293b' }}>
                  📧 {membre.email}
                </p>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                  Téléphone
                </label>
                <p style={{ margin: '0.25rem 0 0 0', color: '#1e293b' }}>
                  📱 {membre.phone}
                </p>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                  Entreprise
                </label>
                <p style={{ margin: '0.25rem 0 0 0', color: '#1e293b' }}>
                  🏢 {membre.company}
                </p>
              </div>

              {membre.address && (
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                    Adresse
                  </label>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#1e293b' }}>
                    📍 {membre.address}
                  </p>
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>
                  Membre depuis
                </label>
                <p style={{ margin: '0.25rem 0 0 0', color: '#1e293b' }}>
                  📅 {new Date(membre.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>

          {/* Informations professionnelles */}
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            height: 'fit-content'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '1.5rem' }}>
              🔧 Informations professionnelles
            </h3>

            {/* Statistiques */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{
                background: '#f0f9ff',
                padding: '1rem',
                borderRadius: '0.5rem',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {membre.chantiersActifs}
                </p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                  Chantiers actifs
                </p>
              </div>
              <div style={{
                background: '#f0fdf4',
                padding: '1rem',
                borderRadius: '0.5rem',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                  {membre.specialites?.length || 0}
                </p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                  Spécialités
                </p>
              </div>
            </div>

            {/* Spécialités */}
            {membre.specialites && membre.specialites.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>
                  Spécialités
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {membre.specialites.map((spec, index) => (
                    <span
                      key={index}
                      style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions rapides */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>
                Actions rapides
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button style={{
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0',
                  background: 'white',
                  color: '#374151',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  📊 Voir les chantiers assignés
                </button>
                <button style={{
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0',
                  background: 'white',
                  color: '#374151',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  💬 Envoyer un message
                </button>
                <button style={{
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0',
                  background: 'white',
                  color: '#374151',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  📅 Planifier une intervention
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Historique des chantiers */}
        <div style={{
          background: 'white',
          borderRadius: '0.75rem',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          marginTop: '2rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '1.5rem' }}>
            🏗️ Historique des chantiers
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Exemple de chantiers */}
            <div style={{
              padding: '1rem',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              background: '#f8fafc'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>
                  Rénovation Villa Moderne
                </h4>
                <span style={{
                  background: '#dcfce7',
                  color: '#166534',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  En cours
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
                📍 15 Avenue des Pins, Cannes • 📅 Mars 2024 - Août 2024
              </p>
            </div>

            <div style={{
              padding: '1rem',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>
                  Extension Maison Familiale
                </h4>
                <span style={{
                  background: '#fef3c7',
                  color: '#92400e',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  Planifié
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
                📍 Lot 12 Les Jardins, Montpellier • 📅 Septembre 2024 - Décembre 2024
              </p>
            </div>
          </div>
        </div>

        {/* Modal de suppression */}
        {showDeleteModal && (
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
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 10px 25px rgba(0,0,0,0.25)'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>
                🗑️ Supprimer le membre
              </h3>
              <p style={{ margin: '0 0 1.5rem 0', color: '#64748b' }}>
                Êtes-vous sûr de vouloir supprimer <strong>{membre.name}</strong> ? 
                Cette action est irréversible.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0',
                    background: 'white',
                    color: '#64748b',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    background: '#ef4444',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}