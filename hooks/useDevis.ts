'use client';

import { useState, useEffect } from 'react';

interface UseDevisOptions {
  search?: string;
  statut?: string;
  type?: string;
  autoRefresh?: boolean;
}

export function useDevis(options: UseDevisOptions = {}) {
  const [devis, setDevis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  const fetchDevis = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString()
      });
      
      if (options.search) params.append('search', options.search);
      if (options.statut) params.append('statut', options.statut);
      if (options.type) params.append('type', options.type);

      const response = await fetch(`/api/devis?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setDevis(data.devis || []);
        setPagination(data.pagination || pagination);
      } else {
        setError(data.error || 'Erreur lors du chargement');
      }
    } catch (err) {
      setError('Erreur réseau');
      console.error('Erreur useDevis:', err);
    } finally {
      setLoading(false);
    }
  };

  const createDevis = async (data: any) => {
    try {
      const response = await fetch('/api/devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      
      if (response.ok) {
        await fetchDevis();
        return result;
      } else {
        throw new Error(result.error || 'Erreur lors de la création');
      }
    } catch (err) {
      throw err;
    }
  };

  const deleteDevis = async (id: string) => {
    try {
      const response = await fetch(`/api/devis/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchDevis();
        return true;
      } else {
        const result = await response.json();
        throw new Error(result.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      throw err;
    }
  };

  const convertToFacture = async (id: string) => {
    try {
      const response = await fetch(`/api/devis/${id}/convert`, {
        method: 'POST'
      });

      const result = await response.json();
      
      if (response.ok) {
        await fetchDevis();
        return result;
      } else {
        throw new Error(result.error || 'Erreur lors de la conversion');
      }
    } catch (err) {
      throw err;
    }
  };

  const sendDevis = async (id: string, emailData?: any) => {
    try {
      const response = await fetch(`/api/devis/${id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData || {})
      });

      const result = await response.json();
      
      if (response.ok) {
        await fetchDevis();
        return result;
      } else {
        throw new Error(result.error || 'Erreur lors de l\'envoi');
      }
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchDevis();
  }, [options.search, options.statut, options.type]);

  useEffect(() => {
    if (options.autoRefresh) {
      const interval = setInterval(() => {
        fetchDevis(pagination.page);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [options.autoRefresh, pagination.page]);

  return {
    devis,
    loading,
    error,
    pagination,
    actions: {
      fetchDevis,
      createDevis,
      deleteDevis,
      convertToFacture,
      sendDevis,
      refresh: () => fetchDevis(pagination.page),
      loadPage: fetchDevis
    }
  };
}

export function useDevisStats() {
  const [stats, setStats] = useState({
    totalDevis: 0,
    totalFactures: 0,
    montantTotal: 0,
    enAttente: 0,
    payes: 0,
    enRetard: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/devis/stats');
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Erreur stats devis:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, refresh: fetchStats };
}
