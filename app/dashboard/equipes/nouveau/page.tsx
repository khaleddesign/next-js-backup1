"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FormData {
  name: string;
  email: string;
  role: 'ADMIN' | 'COMMERCIAL' | 'OUVRIER' | 'CLIENT';
  company: string;
  phone: string;
  address: string;
  specialites: string[];
  disponible: boolean;
}

export default function NouveauMembrePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: 'OUVRIER',
    company: '',
    phone: '',
    address: '',
    specialites: [],
    disponible: true
  });

  const specialitesDisponibles = [
    'Maçonnerie', 'Électricité', 'Plomberie', 'Carrelage', 
    'Peinture', 'Menuiserie', 'Chauffage', 'Climatisation',
    'Couverture', 'Isolation', 'Domotique', 'Terrassement'
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Supprimer l'erreur quand l'utilisateur commence à corriger
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'L\'entreprise est requise';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Simulation de l'API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Ici vous feriez l'appel API réel
      // const response = await fetch('/api/equipes', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      console.log('Nouveau membre créé:', formData);
      router.push('/dashboard/equipes');
      
    } catch (error) {
      console.error('Erreur création membre:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSpecialite = (specialite: string) => {
    setFormData(prev => ({
      ...prev,
      specialites: prev.specialites.includes(specialite)
        ? prev.specialites.filter(s => s !== specialite)
        : [...prev.specialites, specialite]
    }));
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: '#f8fafc' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
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
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.color = '#1e293b';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              ←
            </Link>
            <div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                ➕ Nouveau Membre
              </h1>
              <p style={{ color: '#64748b', margin: '0.25rem 0 0 0' }}>
                Ajoutez un nouveau membre à votre équipe
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            {/* Informations personnelles */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
                👤 Informations personnelles
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `1px solid ${errors.name ? '#ef4444' : '#e2e8f0'}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      transition: 'border-color 0.2s ease'
                    }}
                    placeholder="Ex: Pierre Martin"
                  />
                  {errors.name && (
                    <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `1px solid ${errors.email ? '#ef4444' : '#e2e8f0'}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                    placeholder="pierre.martin@exemple.com"
                  />
                  {errors.email && (
                    <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: `1px solid ${errors.phone ? '#ef4444' : '#e2e8f0'}`,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                    placeholder="06 12 34 56 78"
                  />
                  {errors.phone && (
                    <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Rôle *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      background: 'white'
                    }}
                  >
                    <option value="OUVRIER">Ouvrier</option>
                    <option value="COMMERCIAL">Commercial</option>
                    <option value="ADMIN">Administrateur</option>
                    <option value="CLIENT">Client</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Informations professionnelles */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
                🏢 Informations professionnelles
              </h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Entreprise *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors.company ? '#ef4444' : '#e2e8f0'}`,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                  placeholder="Ex: BTP Expert"
                />
                {errors.company && (
                  <p style={{ color: '#ef4444', fontSize: '0.75rem', margin: '0.25rem 0 0 0' }}>
                    {errors.company}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Adresse
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    resize: 'vertical'
                  }}
                  placeholder="Adresse complète..."
                />
              </div>
            </div>

            {/* Spécialités */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
                🔧 Spécialités
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
                {specialitesDisponibles.map((specialite) => (
                  <label
                    key={specialite}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      background: formData.specialites.includes(specialite) ? '#f0f9ff' : '#f8fafc',
                      border: `1px solid ${formData.specialites.includes(specialite) ? '#0ea5e9' : '#e2e8f0'}`,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.specialites.includes(specialite)}
                      onChange={() => toggleSpecialite(specialite)}
                      style={{ margin: 0 }}
                    />
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                      {specialite}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Disponibilité */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
                📅 Disponibilité
              </h3>
              
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={formData.disponible}
                  onChange={(e) => handleInputChange('disponible', e.target.checked)}
                />
                <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                  Membre disponible pour de nouveaux chantiers
                </span>
              </label>
            </div>

            {/* Boutons */}
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              justifyContent: 'flex-end',
              paddingTop: '1.5rem',
              borderTop: '1px solid #f1f5f9'
            }}>
              <Link
                href="/dashboard/equipes"
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0',
                  background: 'white',
                  color: '#64748b',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                Annuler
              </Link>
              
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: loading ? '#94a3b8' : 'linear-gradient(135deg, #3b82f6, #f97316)',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? '⏳ Création...' : '✅ Créer le membre'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}