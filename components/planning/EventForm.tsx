'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, FileText, AlertCircle } from 'lucide-react';

interface EventFormData {
  titre: string;
  description: string;
  type: string;
  dateDebut: string;
  dateFin: string;
  chantierId: string;
  participantIds: string[];
  lieu: string;
  notes: string;
  recurrence: string | null;
}

interface EventFormProps {
  onSubmit: (data: EventFormData) => void;
  onDataChange: (data: EventFormData) => void;
  saving: boolean;
  initialData?: Partial<EventFormData>;
}

export default function EventForm({ onSubmit, onDataChange, saving, initialData }: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    titre: '',
    description: '',
    type: 'RDV_CLIENT',
    dateDebut: '',
    dateFin: '',
    chantierId: '',
    participantIds: [],
    lieu: '',
    notes: '',
    recurrence: null,
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Notifier les changements pour la détection de conflits
    onDataChange(formData);
  }, [formData, onDataChange]);

  const handleChange = (field: keyof EventFormData, value: string | string[] | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.titre.trim()) {
      newErrors.titre = 'Le titre est requis';
    }

    if (!formData.dateDebut) {
      newErrors.dateDebut = 'La date de début est requise';
    }

    if (!formData.dateFin) {
      newErrors.dateFin = 'La date de fin est requise';
    }

    if (formData.dateDebut && formData.dateFin) {
      const debut = new Date(formData.dateDebut);
      const fin = new Date(formData.dateFin);
      
      if (debut >= fin) {
        newErrors.dateFin = 'La date de fin doit être après la date de début';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const mockChantiers = [
    { id: 'chantier-1', nom: 'Rénovation Villa Moderne' },
    { id: 'chantier-2', nom: 'Extension Maison Familiale' },
    { id: 'chantier-3', nom: 'Construction Pavillon Neuf' }
  ];

  const mockUsers = [
    { id: 'user-1', name: 'Pierre Maçon', role: 'OUVRIER' },
    { id: 'user-2', name: 'Marie Électricienne', role: 'OUVRIER' },
    { id: 'user-3', name: 'Jean Commercial', role: 'COMMERCIAL' },
    { id: 'client-1', name: 'Sophie Durand', role: 'CLIENT' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations de base */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Informations de base
        </h2>

        <div>
          <label className="block text-blue-100 text-sm mb-2">
            Titre de l'événement *
          </label>
          <input
            type="text"
            value={formData.titre}
            onChange={(e) => handleChange('titre', e.target.value)}
            placeholder="Ex: RDV validation cuisine, Planning électricité..."
            className={`w-full p-3 rounded-lg bg-white/10 text-white placeholder-blue-200 border ${
              errors.titre ? 'border-red-400' : 'border-white/20'
            } focus:border-blue-400 focus:outline-none`}
          />
          {errors.titre && (
            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.titre}
            </p>
          )}
        </div>

        <div>
          <label className="block text-blue-100 text-sm mb-2">
            Type d'événement *
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:outline-none"
          >
            <option value="RDV_CLIENT">RDV Client</option>
            <option value="PLANNING_CHANTIER">Planning Chantier</option>
            <option value="LIVRAISON">Livraison</option>
            <option value="INSPECTION">Inspection</option>
            <option value="CONGES">Congés</option>
            <option value="FORMATION">Formation</option>
          </select>
        </div>

        <div>
          <label className="block text-blue-100 text-sm mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Description détaillée de l'événement..."
            rows={3}
            className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-blue-200 border border-white/20 focus:border-blue-400 focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Date et heure */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-6 h-6" />
          Date et heure
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-blue-100 text-sm mb-2">
              Date et heure de début *
            </label>
            <input
              type="datetime-local"
              value={formData.dateDebut}
              onChange={(e) => handleChange('dateDebut', e.target.value)}
              className={`w-full p-3 rounded-lg bg-white/10 text-white border ${
                errors.dateDebut ? 'border-red-400' : 'border-white/20'
              } focus:border-blue-400 focus:outline-none`}
            />
            {errors.dateDebut && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.dateDebut}
              </p>
            )}
          </div>

          <div>
            <label className="block text-blue-100 text-sm mb-2">
              Date et heure de fin *
            </label>
            <input
              type="datetime-local"
              value={formData.dateFin}
              onChange={(e) => handleChange('dateFin', e.target.value)}
              className={`w-full p-3 rounded-lg bg-white/10 text-white border ${
                errors.dateFin ? 'border-red-400' : 'border-white/20'
              } focus:border-blue-400 focus:outline-none`}
            />
            {errors.dateFin && (
              <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.dateFin}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Lieu et chantier */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <MapPin className="w-6 h-6" />
          Lieu et chantier
        </h2>

        <div>
          <label className="block text-blue-100 text-sm mb-2">
            Chantier associé
          </label>
          <select
            value={formData.chantierId}
            onChange={(e) => handleChange('chantierId', e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:outline-none"
          >
            <option value="">Aucun chantier</option>
            {mockChantiers.map((chantier) => (
              <option key={chantier.id} value={chantier.id}>
                {chantier.nom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-blue-100 text-sm mb-2">
            Lieu
          </label>
          <input
            type="text"
            value={formData.lieu}
            onChange={(e) => handleChange('lieu', e.target.value)}
            placeholder="Adresse ou lieu de l'événement"
            className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-blue-200 border border-white/20 focus:border-blue-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Participants */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="w-6 h-6" />
          Participants
        </h2>

        <div>
          <label className="block text-blue-100 text-sm mb-2">
            Inviter des participants
          </label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {mockUsers.map((user) => (
              <label
                key={user.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.participantIds.includes(user.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleChange('participantIds', [...formData.participantIds, user.id]);
                    } else {
                      handleChange('participantIds', formData.participantIds.filter(id => id !== user.id));
                    }
                  }}
                  className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-400"
                />
                <div className="flex-1">
                  <div className="text-white text-sm">{user.name}</div>
                  <div className="text-blue-200 text-xs">{user.role}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Notes additionnelles
        </h2>

        <div>
          <label className="block text-blue-100 text-sm mb-2">
            Notes internes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Notes, instructions spéciales, points à retenir..."
            rows={4}
            className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-blue-200 border border-white/20 focus:border-blue-400 focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/20">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-3 text-blue-200 hover:text-white transition-colors"
        >
          Annuler
        </button>
        
        <button
          type="submit"
          disabled={saving}
          className="btn btn-primary flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
              Création...
            </>
          ) : (
            <>
              <Calendar className="w-4 h-4" />
              Créer l'événement
            </>
          )}
        </button>
      </div>
    </form>
  );
}
