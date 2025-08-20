'use client';

import { useState, useEffect, useCallback } from 'react';

interface Planning {
  id: string;
  titre: string;
  description?: string;
  type: string;
  dateDebut: string;
  dateFin: string;
  statut: string;
  lieu?: string;
  notes?: string;
  organisateur: {
    id: string;
    name: string;
    role: string;
  };
  participants?: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  chantier?: {
    id: string;
    nom: string;
  };
}

interface UsePlanningOptions {
  dateDebut?: Date;
  dateFin?: Date;
  chantierId?: string;
  userId?: string;
  type?: string;
  autoRefresh?: boolean;
}

export function usePlanning(options: UsePlanningOptions = {}) {
  const [plannings, setPlannings] = useState<Planning[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlannings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      
      if (options.dateDebut) {
        params.append('dateDebut', options.dateDebut.toISOString());
      }
      if (options.dateFin) {
        params.append('dateFin', options.dateFin.toISOString());
      }
      if (options.chantierId) {
        params.append('chantierId', options.chantierId);
      }
      if (options.userId) {
        params.append('userId', options.userId);
      }
      if (options.type && options.type !== 'TOUS') {
        params.append('type', options.type);
      }

      const response = await fetch(`/api/planning?${params}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des plannings');
      }

      const data = await response.json();
      setPlannings(data.plannings || []);

    } catch (err) {
      console.error('Erreur fetchPlannings:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [options.dateDebut, options.dateFin, options.chantierId, options.userId, options.type]);

  const createPlanning = useCallback(async (data: any) => {
    try {
      const response = await fetch('/api/planning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (response.ok) {
        await fetchPlannings();
        return result;
      } else {
        throw new Error(result.error || 'Erreur lors de la création');
      }
    } catch (err) {
      throw err;
    }
  }, [fetchPlannings]);

  const updatePlanning = useCallback(async (id: string, data: any) => {
    try {
      const response = await fetch(`/api/planning/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (response.ok) {
        await fetchPlannings();
        return result;
      } else {
        throw new Error(result.error || 'Erreur lors de la modification');
      }
    } catch (err) {
      throw err;
    }
  }, [fetchPlannings]);

  const deletePlanning = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/planning/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchPlannings();
        return true;
      } else {
        const result = await response.json();
        throw new Error(result.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      throw err;
    }
  }, [fetchPlannings]);

  const checkConflicts = useCallback(async (data: {
    dateDebut: string;
    dateFin: string;
    participantIds: string[];
    excludeId?: string;
  }) => {
    try {
      const response = await fetch('/api/planning/conflicts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      return result.conflicts || [];
    } catch (err) {
      console.error('Erreur vérification conflits:', err);
      return [];
    }
  }, []);

  useEffect(() => {
    fetchPlannings();
  }, [fetchPlannings]);

  useEffect(() => {
    if (options.autoRefresh) {
      const interval = setInterval(() => {
        fetchPlannings();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [options.autoRefresh, fetchPlannings]);

  return {
    plannings,
    loading,
    error,
    actions: {
      fetchPlannings,
      createPlanning,
      updatePlanning,
      deletePlanning,
      checkConflicts,
      refresh: fetchPlannings
    }
  };
}

export function usePlanningStats() {
  const [stats, setStats] = useState({
    totalPlannings: 0,
    planifie: 0,
    enCours: 0,
    termine: 0,
    thisWeek: 0,
    nextWeek: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/planning/stats');
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Erreur stats planning:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, refresh: fetchStats };
}
