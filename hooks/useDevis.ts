import { useState, useEffect } from 'react';

interface UseDevisOptions {
  search?: string;
  statut?: string;
  type?: string;
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
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(options.search && { search: options.search }),
        ...(options.statut && { statut: options.statut }),
        ...(options.type && { type: options.type })
      });

      const response = await fetch(`/api/devis?${params}`);
      const data = await response.json();

      if (response.ok) {
        setDevis(data.devis || []);
        setPagination(data.pagination || pagination);
        setError(null);
      } else {
        setError(data.error || 'Erreur lors du chargement');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevis();
  }, [options.search, options.statut, options.type]);

  const actions = {
    refresh: () => fetchDevis(pagination.page),
    loadPage: (page: number) => fetchDevis(page)
  };

  return { devis, loading, error, pagination, actions };
}
