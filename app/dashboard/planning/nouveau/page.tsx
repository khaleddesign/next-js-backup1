'use client';

import { useState } from 'react';
import { Calendar, Clock, Users, MapPin, ArrowLeft, Check, User, Building } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/hooks/useAuth';

export default function NouveauPlanningPage() {
  useRequireAuth(['ADMIN', 'COMMERCIAL']);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type: 'REUNION',
    dateDebut: '',
    dateFin: '',
    lieu: '',
    notes: '',
    chantierId: '',
    participantIds: [],
    recurrence: ''
  });
  
  const [saving, setSaving] = useState(false);

  const chantiers = [
    { id: '1', nom: 'Villa Dupont - Rénovation' },
    { id: '2', nom: 'Immeuble Centre-ville' },
    { id: '3', nom: 'Maison Rue de la Paix' }
  ];

  const utilisateurs = [
    { id: '1', name: 'Marie Martin', role: 'COMMERCIAL' },
    { id: '2', name: 'Jean Dubois', role: 'OUVRIER' },
    { id: '3', name: 'Pierre Leclerc', role: 'CLIENT' },
    { id: '4', name: 'Sophie Bernard', role: 'OUVRIER' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    setTimeout(() => {
      setSaving(false);
      alert('Planning créé avec succès !');
      router.push('/dashboard/planning');
    }, 1000);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleParticipantToggle = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      participantIds: prev.participantIds.includes(userId)
        ? prev.participantIds.filter(id => id !== userId)
        : [...prev.participantIds, userId]
    }));
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #ea580c 100%)' }}>
      <div className="container mx-auto px-4 py-8">
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
          <div className="lg:col-span-2">
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              backdropFilter: 'blur(10px)', 
              borderRadius: '16px', 
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '24px'
            }}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Titre de l'événement *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                    value={formData.titre}
                    onChange={(e) => handleChange('titre', e.target.value)}
                    placeholder="Ex: Réunion équipe chantier"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Type d'événement *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                  >
                    <option value="REUNION" style={{ color: '#000' }}>📋 Réunion</option>
                    <option value="LIVRAISON" style={{ color: '#000' }}>🚚 Livraison</option>
                    <option value="INSPECTION" style={{ color: '#000' }}>🔍 Inspection</option>
                    <option value="AUTRE" style={{ color: '#000' }}>📌 Autre</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Date et heure de début *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                      value={formData.dateDebut}
                      onChange={(e) => handleChange('dateDebut', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Date et heure de fin *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                      value={formData.dateFin}
                      onChange={(e) => handleChange('dateFin', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Lieu
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                    value={formData.lieu}
                    onChange={(e) => handleChange('lieu', e.target.value)}
                    placeholder="Ex: Bureau, Chantier, Visioconférence"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Chantier (optionnel)
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                    value={formData.chantierId}
                    onChange={(e) => handleChange('chantierId', e.target.value)}
                  >
                    <option value="" style={{ color: '#000' }}>Aucun chantier</option>
                    {chantiers.map(chantier => (
                      <option key={chantier.id} value={chantier.id} style={{ color: '#000' }}>
                        🏗️ {chantier.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-3">
                    Participants
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {utilisateurs.map(user => (
                      <label
                        key={user.id}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.participantIds.includes(user.id)}
                          onChange={() => handleParticipantToggle(user.id)}
                          className="w-4 h-4 text-blue-600 bg-white/20 border-white/30 rounded focus:ring-blue-500"
                        />
                        <User className="w-4 h-4 text-white/70" />
                        <div className="flex-1">
                          <div className="text-white text-sm">{user.name}</div>
                          <div className="text-white/60 text-xs">{user.role}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {formData.participantIds.length > 0 && (
                    <div className="mt-2 text-sm text-blue-200">
                      {formData.participantIds.length} participant(s) sélectionné(s)
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Détails de l'événement..."
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Récurrence (optionnel)
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                    value={formData.recurrence}
                    onChange={(e) => handleChange('recurrence', e.target.value)}
                  >
                    <option value="" style={{ color: '#000' }}>Pas de récurrence</option>
                    <option value="DAILY" style={{ color: '#000' }}>Tous les jours</option>
                    <option value="WEEKLY" style={{ color: '#000' }}>Toutes les semaines</option>
                    <option value="MONTHLY" style={{ color: '#000' }}>Tous les mois</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Notes additionnelles
                  </label>
                  <textarea
                    rows={2}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Notes internes..."
                  />
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6">
                  <Link
                    href="/dashboard/planning"
                    className="px-6 py-3 text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Annuler
                  </Link>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-white/90 disabled:opacity-50 transition-colors flex items-center space-x-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                        <span>Enregistrement...</span>
                      </>
                    ) : (
                      <span>Enregistrer</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              backdropFilter: 'blur(10px)', 
              borderRadius: '16px', 
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '24px'
            }}>
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

            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              backdropFilter: 'blur(10px)', 
              borderRadius: '16px', 
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '24px'
            }}>
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
