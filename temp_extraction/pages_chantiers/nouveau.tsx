--- app/dashboard/chantiers/nouveau/page.tsx ---
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface FormData {
  nom: string;
  description: string;
  adresse: string;
  superficie: string;
  clientId: string;
  clientType: 'existing' | 'new';
  newClient: {
    name: string;
    email: string;
    phone: string;
    company: string;
    address: string;
  };
  dateDebut: string;
  dateFin: string;
  budget: string;
  photo: string;
}

const initialFormData: FormData = {
  nom: '',
  description: '',
  adresse: '',
  superficie: '',
  clientId: '',
  clientType: 'existing',
  newClient: {
    name: '',
    email: '',
    phone: '',
    company: '',
    address: ''
  },
  dateDebut: '',
  dateFin: '',
  budget: '',
  photo: ''
};

const mockClients = [
  { id: '1', name: 'Marie Dubois', email: 'marie.dubois@email.com', company: 'Dubois Immobilier' },
  { id: '2', name: 'Pierre Martin', email: 'pierre.martin@email.com', company: undefined },
  { id: '3', name: 'Sophie Leroux', email: 'sophie.leroux@email.com', company: 'Design Studio' },
  { id: '4', name: 'Jean Moreau', email: 'jean.moreau@email.com', company: undefined }
];

export default function NouveauChantierPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 3;

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const updateNewClientData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      newClient: {
        ...prev.newClient,
        [field]: value
      }
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.nom.trim()) newErrors.nom = 'Le nom du chantier est requis';
        if (!formData.description.trim()) newErrors.description = 'La description est requise';
        if (!formData.adresse.trim()) newErrors.adresse = 'L\'adresse est requise';
        break;

      case 2:
        if (formData.clientType === 'existing') {
          if (!formData.clientId) newErrors.clientId = 'Veuillez sélectionner un client';
        } else {
          if (!formData.newClient.name.trim()) newErrors['newClient.name'] = 'Le nom est requis';
          if (!formData.newClient.email.trim()) newErrors['newClient.email'] = 'L\'email est requis';
          else if (!/\S+@\S+\.\S+/.test(formData.newClient.email)) {
            newErrors['newClient.email'] = 'Format d\'email invalide';
          }
        }
        break;

      case 3:
        if (!formData.dateDebut) newErrors.dateDebut = 'La date de début est requise';
        if (!formData.dateFin) newErrors.dateFin = 'La date de fin est requise';
        if (!formData.budget.trim()) newErrors.budget = 'Le budget est requis';
        else if (isNaN(Number(formData.budget)) || Number(formData.budget) <= 0) {
          newErrors.budget = 'Le budget doit être un nombre positif';
        }
        
        if (formData.dateDebut && formData.dateFin) {
          if (new Date(formData.dateFin) <= new Date(formData.dateDebut)) {
            newErrors.dateFin = 'La date de fin doit être après la date de début';
          }
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(totalSteps, prev + 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);

    try {
      const submitData = {
        nom: formData.nom,
        description: formData.description,
        adresse: formData.adresse,
        superficie: formData.superficie,
        dateDebut: formData.dateDebut,
        dateFin: formData.dateFin,
        budget: formData.budget,
        photo: formData.photo,
        clientId: formData.clientType === 'existing' ? formData.clientId : mockClients[0].id,
        newClient: formData.clientType === 'new' ? formData.newClient : null
      };

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Chantier créé:', submitData);
      router.push('/dashboard/chantiers');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Erreur lors de la création du chantier');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem' }}>
      {[1, 2, 3].map((step, index) => (
        <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <div
            style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              background: step <= currentStep 
                ? 'linear-gradient(135deg, #3b82f6, #f97316)'
                : '#e2e8f0',
              color: step <= currentStep ? 'white' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}
          >
            {step < currentStep ? '✓' : step}
          </div>
          <div style={{ marginLeft: '0.75rem', flex: 1 }}>
            <p style={{ 
              margin: 0, 
              fontWeight: '600', 
              color: step <= currentStep ? '#1e293b' : '#64748b',
              fontSize: '0.875rem'
            }}>
              {step === 1 && 'Informations de base'}
              {step === 2 && 'Client'}
              {step === 3 && 'Finalisation'}
            </p>
          </div>
          {index < 2 && (
            <div
              style={{
                height: '2px',
                flex: 1,
                background: step < currentStep 
                  ? 'linear-gradient(90deg, #3b82f6, #f97316)'
                  : '#e2e8f0',
                margin: '0 1rem'
              }}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '1.5rem' }}>
        Informations de base
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.5rem' }}>
            Nom du chantier *
          </label>
          <input
            type="text"
            value={formData.nom}
            onChange={(e) => updateFormData('nom', e.target.value)}
            placeholder="Ex: Rénovation villa moderne"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${errors.nom ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '0.5rem',
              fontSize: '1rem',
              color: '#1e293b'
            }}
          />
          {errors.nom && (
            <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem', margin: 0 }}>
              {errors.nom}
            </p>
          )}
        </div>

        <div>
          <label style={{ display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.5rem' }}>
            Description du projet *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => updateFormData('description', e.target.value)}
            placeholder="Décrivez les travaux à réaliser..."
            rows={4}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${errors.description ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '0.5rem',
              fontSize: '1rem',
              color: '#1e293b',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
          {errors.description && (
            <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem', margin: 0 }}>
              {errors.description}
            </p>
          )}
        </div>

        <div>
          <label style={{ display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.5rem' }}>
            Adresse du chantier *
          </label>
          <input
            type="text"
            value={formData.adresse}
            onChange={(e) => updateFormData('adresse', e.target.value)}
            placeholder="Adresse complète du chantier"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${errors.adresse ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '0.5rem',
              fontSize: '1rem',
              color: '#1e293b'
            }}
          />
          {errors.adresse && (
            <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem', margin: 0 }}>
              {errors.adresse}
            </p>
          )}
        </div>

        <div>
          <label style={{ display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.5rem' }}>
            Superficie
          </label>
          <input
            type="text"
            value={formData.superficie}
            onChange={(e) => updateFormData('superficie', e.target.value)}
            placeholder="Ex: 120m², 2 étages"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              color: '#1e293b'
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '1.5rem' }}>
        Informations client
      </h2>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => updateFormData('clientType', 'existing')}
            style={{
              flex: 1,
              padding: '1rem',
              border: `2px solid ${formData.clientType === 'existing' ? '#3b82f6' : '#e2e8f0'}`,
              borderRadius: '0.75rem',
              background: formData.clientType === 'existing' ? '#f0f9ff' : 'white',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
              Client existant
            </div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Sélectionner un client déjà enregistré
            </div>
          </button>

          <button
            onClick={() => updateFormData('clientType', 'new')}
            style={{
              flex: 1,
              padding: '1rem',
              border: `2px solid ${formData.clientType === 'new' ? '#3b82f6' : '#e2e8f0'}`,
              borderRadius: '0.75rem',
              background: formData.clientType === 'new' ? '#f0f9ff' : 'white',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
              Nouveau client
            </div>
            <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Créer un nouveau client
            </div>
          </button>
        </div>
      </div>

      {formData.clientType === 'existing' ? (
        <div>
          <label style={{ display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.5rem' }}>
            Sélectionner un client *
          </label>
          <select
            value={formData.clientId}
            onChange={(e) => updateFormData('clientId', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${errors.clientId ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '0.5rem',
              fontSize: '1rem',
              color: '#1e293b',
              background: 'white'
            }}
          >
            <option value="">-- Choisir un client --</option>
            {mockClients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} {client.company ? `(${client.company})` : ''}
              </option>
            ))}
          </select>
          {errors.clientId && (
            <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem', margin: 0 }}>
              {errors.clientId}
            </p>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.5rem' }}>
              Nom complet *
            </label>
            <input
              type="text"
              value={formData.newClient.name}
              onChange={(e) => updateNewClientData('name', e.target.value)}
              placeholder="Nom et prénom du client"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors['newClient.name'] ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '0.5rem',
                fontSize: '1rem',
                color: '#1e293b'
              }}
            />
            {errors['newClient.name'] && (
              <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem', margin: 0 }}>
                {errors['newClient.name']}
              </p>
            )}
          </div>

          <div>
            <label style={{ display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.5rem' }}>
              Email *
            </label>
            <input
              type="email"
              value={formData.newClient.email}
              onChange={(e) => updateNewClientData('email', e.target.value)}
              placeholder="email@exemple.com"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors['newClient.email'] ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '0.5rem',
                fontSize: '1rem',
                color: '#1e293b'
              }}
            />
            {errors['newClient.email'] && (
              <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem', margin: 0 }}>
                {errors['newClient.email']}
              </p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.5rem' }}>
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.newClient.phone}
                onChange={(e) => updateNewClientData('phone', e.target.value)}
                placeholder="+33 6 12 34 56 78"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  color: '#1e293b'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.5rem' }}>
                Entreprise
              </label>
              <input
                type="text"
                value={formData.newClient.company}
                onChange={(e) => updateNewClientData('company', e.target.value)}
                placeholder="Nom de l'entreprise"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  color: '#1e293b'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.5rem' }}>
              Adresse
            </label>
            <input
              type="text"
              value={formData.newClient.address}
              onChange={(e) => updateNewClientData('address', e.target.value)}
              placeholder="Adresse du client"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                color: '#1e293b'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '1.5rem' }}>
        Finalisation du projet
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.5rem' }}>
              Date de début *
            </label>
            <input
              type="date"
              value={formData.dateDebut}
              onChange={(e) => updateFormData('dateDebut', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.dateDebut ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '0.5rem',
                fontSize: '1rem',
                color: '#1e293b'
              }}
            />
            {errors.dateDebut && (
              <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem', margin: 0 }}>
                {errors.dateDebut}
              </p>
            )}
          </div>

          <div>
            <label style={{ display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.5rem' }}>
              Date de fin prévue *
            </label>
            <input
              type="date"
              value={formData.dateFin}
              onChange={(e) => updateFormData('dateFin', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `1px solid ${errors.dateFin ? '#ef4444' : '#d1d5db'}`,
                borderRadius: '0.5rem',
                fontSize: '1rem',
                color: '#1e293b'
              }}
            />
            {errors.dateFin && (
              <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem', margin: 0 }}>
                {errors.dateFin}
              </p>
            )}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.5rem' }}>
            Budget total (€) *
          </label>
          <input
            type="number"
            value={formData.budget}
            onChange={(e) => updateFormData('budget', e.target.value)}
            placeholder="Ex: 120000"
            min="0"
            step="1000"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: `1px solid ${errors.budget ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '0.5rem',
              fontSize: '1rem',
              color: '#1e293b'
            }}
          />
          {errors.budget && (
            <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem', margin: 0 }}>
              {errors.budget}
            </p>
          )}
        </div>

        <div>
          <label style={{ display: 'block', color: '#374151', fontWeight: '500', marginBottom: '0.5rem' }}>
            Photo de couverture (URL)
          </label>
          <input
            type="url"
            value={formData.photo}
            onChange={(e) => updateFormData('photo', e.target.value)}
            placeholder="https://exemple.com/photo.jpg (optionnel)"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              color: '#1e293b'
            }}
          />
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem', margin: 0 }}>
            Une photo par défaut sera utilisée si aucune URL n'est fournie
          </p>
        </div>

        <div className="card" style={{ marginTop: '2rem', background: '#f8fafc' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
            📋 Récapitulatif du projet
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
            <div>
              <strong style={{ color: '#374151' }}>Nom :</strong> {formData.nom || '-'}
            </div>
            <div>
              <strong style={{ color: '#374151' }}>Adresse :</strong> {formData.adresse || '-'}
            </div>
            <div>
              <strong style={{ color: '#374151' }}>Client :</strong> {
                formData.clientType === 'existing' 
                  ? mockClients.find(c => c.id === formData.clientId)?.name || '-'
                  : formData.newClient.name || '-'
              }
            </div>
            <div>
              <strong style={{ color: '#374151' }}>Superficie :</strong> {formData.superficie || '-'}
            </div>
            <div>
              <strong style={{ color: '#374151' }}>Période :</strong> {
                formData.dateDebut && formData.dateFin 
                  ? `${new Date(formData.dateDebut).toLocaleDateString('fr-FR')} → ${new Date(formData.dateFin).toLocaleDateString('fr-FR')}`
                  : '-'
              }
            </div>
            <div>
              <strong style={{ color: '#374151' }}>Budget :</strong> {
                formData.budget ? `${Number(formData.budget).toLocaleString('fr-FR')} €` : '-'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <nav style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
              <Link href="/dashboard" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                Dashboard
              </Link>
              <span>›</span>
              <Link href="/dashboard/chantiers" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                Chantiers
              </Link>
              <span>›</span>
              <span style={{ color: '#1e293b', fontWeight: '500' }}>
                Nouveau chantier
              </span>
            </div>
          </nav>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: '0 0 0.5rem 0' }}>
                🏗️ Créer un nouveau chantier
              </h1>
              <p style={{ color: '#64748b', margin: 0 }}>
                Étape {currentStep} sur {totalSteps} - Renseignez les informations de votre projet
              </p>
            </div>
            
            <Link href="/dashboard/chantiers" className="btn-ghost" style={{ color: '#64748b' }}>
              Annuler
            </Link>
          </div>
        </div>

        {renderStepIndicator()}

        <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
          {renderCurrentStep()}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="btn-ghost"
            style={{
              opacity: currentStep === 1 ? 0.5 : 1,
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            ← Précédent
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[...Array(totalSteps)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '50%',
                  background: i + 1 <= currentStep 
                    ? 'linear-gradient(135deg, #3b82f6, #f97316)'
                    : '#e2e8f0'
                }}
              />
            ))}
          </div>

          {currentStep < totalSteps ? (
            <button onClick={handleNext} className="btn-primary">
              Suivant →
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              className="btn-primary"
              disabled={isSubmitting}
              style={{
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? '⏳ Création...' : '✅ Créer le chantier'}
            </button>
          )}
        </div>

        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: '#fef3c7', 
          border: '1px solid #fbbf24',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          color: '#92400e'
        }}>
          <strong>💡 Conseil :</strong> {
            currentStep === 1 ? 'Soyez précis dans la description pour faciliter la planification des travaux.' :           currentStep === 2 ? 'Un client existant sera automatiquement lié au projet. Un nouveau client sera créé dans votre base.' :
           'Vérifiez bien les dates et le budget avant de valider. Ces informations pourront être modifiées plus tard.'
         }
       </div>
     </div>
   </div>
 );
}
