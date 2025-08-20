'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, ArrowLeft, AlertTriangle, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import EventForm from '@/components/planning/EventForm';
import ConflictAlert from '@/components/planning/ConflictAlert';
import { usePlanning } from '@/hooks/usePlanning';
import { useToasts } from '@/hooks/useToasts';

export default function NouveauPlanningPage() {
  const router = useRouter();
  const { actions } = usePlanning();
  const { success, error: showError } = useToasts();
  
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type: 'RDV_CLIENT',
    dateDebut: '',
    dateFin: '',
    chantierId: '',
    participantIds: [],
    lieu: '',
    notes: '',
    recurrence: null
  });
  
  const [conflicts, setConflicts] = useState([]);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (data: any) => {
    if (conflicts.length > 0) {
      const confirmed = confirm('Des conflits ont été détectés. Voulez-vous continuer ?');
      if (!confirmed) return;
    }

    try {
      setSaving(true);
      await actions.createPlanning({
        ...data,
        organisateurId: 'test-user-123' // À remplacer par l'utilisateur connecté
      });
      
      success('Succès', 'Planning créé avec succès');
      router.push('/dashboard/planning');
    } catch (error) {
      showError('Erreur', 'Erreur lors de la création du planning');
    } finally {
      setSaving(false);
    }
  };

  const checkConflicts = async (data: any) => {
    if (!data.dateDebut || !data.dateFin || !data.participantIds?.length) {
      setConflicts([]);
      return;
    }

    try {
      setChecking(true);
      const response = await fetch('/api/planning/conflicts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateDebut: data.dateDebut,
          dateFin: data.dateFin,
          participantIds: [...data.participantIds, 'test-user-123']
        })
      });
      
      const result = await response.json();
      setConflicts(result.conflicts || []);
    } catch (error) {
      console.error('Erreur vérification conflits:', error);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #ea580c 100%)' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard/planning"
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Calendar className="w-10 h-10" />
              Nouveau Planning
            </h1>
            <p className="text-blue-100">Créer un nouveau rendez-vous ou planning chantier</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire principal */}
          <div className="lg:col-span-2">
            <div className="glass p-6">
              <EventForm
                onSubmit={handleSubmit}
                onDataChange={checkConflicts}
                saving={saving}
              />
            </div>
          </div>

          {/* Sidebar d'aide */}
          <div className="lg:col-span-1 space-y-6">
            {/* Types d'événements */}
            <div className="glass p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Types d'événements
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <div className="text-white font-medium">RDV Client</div>
                    <div className="text-blue-100">Rendez-vous commerciaux et présentations</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <div className="text-white font-medium">Planning Chantier</div>
                    <div className="text-blue-100">Organisation des équipes sur site</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-orange-400 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <div className="text-white font-medium">Livraison</div>
                    <div className="text-blue-100">Réception de matériaux et équipements</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-purple-400 rounded-full mt-1 flex-shrink-0"></div>
                  <div>
                    <div className="text-white font-medium">Inspection</div>
                    <div className="text-blue-100">Contrôles qualité et conformité</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Détection de conflits */}
            {checking && (
              <div className="glass p-6">
                <div className="flex items-center gap-3 text-blue-100">
                  <div className="animate-spin w-5 h-5 border-2 border-blue-200 border-t-transparent rounded-full"></div>
                  Vérification des conflits...
                </div>
              </div>
            )}

            {conflicts.length > 0 && (
              <ConflictAlert conflicts={conflicts} />
            )}

            {!checking && conflicts.length === 0 && formData.dateDebut && formData.dateFin && (
              <div className="glass p-6">
                <div className="flex items-center gap-3 text-green-200">
                  <Check className="w-5 h-5" />
                  Aucun conflit détecté
                </div>
              </div>
            )}

            {/* Conseils */}
            <div className="glass p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Conseils
              </h3>
              
              <div className="space-y-3 text-sm text-blue-100">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Planifiez vos RDV clients en dehors des heures de chantier</p>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Prévoyez 30 minutes de battement entre les interventions</p>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Ajoutez tous les participants concernés pour éviter les conflits</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
