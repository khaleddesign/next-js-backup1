// Template correction hook personnalisé
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseDataReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  create: (item: T) => Promise<void>;
}

export function useData<T>(endpoint: string): UseDataReturn<T> {
  // ✅ State avec types stricts
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // ✅ Ref pour éviter state updates après unmount
  const isMountedRef = useRef(true);

  // ✅ Cleanup sur unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ✅ Fetch avec gestion erreurs
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      // ✅ Vérification mounted avant setState
      if (isMountedRef.current) {
        setData(result);
      }
      
    } catch (err) {
      console.error('Fetch error:', err);
      
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [endpoint]);

  // ✅ Effect avec cleanup
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ✅ Create avec optimistic updates
  const create = useCallback(async (item: T) => {
    try {
      setError(null);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error('Création échouée');
      }

      const newItem = await response.json();
      
      if (isMountedRef.current) {
        setData(prev => [...prev, newItem]);
      }
      
    } catch (err) {
      console.error('Create error:', err);
      
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Erreur création');
      }
    }
  }, [endpoint]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    create,
  };
}
