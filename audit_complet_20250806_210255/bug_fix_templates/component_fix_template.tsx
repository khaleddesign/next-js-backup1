// Template correction composant React
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // ✅ Toujours importer

interface ComponentProps {
  // ✅ Props typées strictement
  data?: DataType;
  onAction?: (id: string) => void;
  loading?: boolean;
}

export const ComponentName: React.FC<ComponentProps> = ({
  data,
  onAction,
  loading = false
}) => {
  // ✅ State avec types stricts
  const [localState, setLocalState] = useState<StateType | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ Hooks nécessaires
  const router = useRouter();

  // ✅ Cleanup effects
  useEffect(() => {
    // Logic...
    
    return () => {
      // Cleanup: intervals, listeners, etc.
    };
  }, []);

  // ✅ Handlers avec useCallback si passés en props
  const handleAction = useCallback(() => {
    try {
      // Vérification avant action
      if (!data?.id) {
        setError('Données manquantes');
        return;
      }

      // Action sécurisée
      onAction?.(data.id);
      router.push('/success');
      
    } catch (err) {
      console.error('Erreur action:', err);
      setError('Action échouée');
    }
  }, [data?.id, onAction, router]);

  // ✅ Gestion états loading/error
  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => setError(null)}>Réessayer</button>
      </div>
    );
  }

  // ✅ Gestion données vides
  if (!data) {
    return <div className="empty-state">Aucune donnée disponible</div>;
  }

  return (
    <div className="component-container">
      {/* ✅ JSX avec gestion edge cases */}
      <h2>{data.title || 'Sans titre'}</h2>
      
      <button 
        onClick={handleAction}
        disabled={loading}
        className="btn-primary"
      >
        Action
      </button>
    </div>
  );
};
