'use client';

import { useState } from 'react';

interface DevisBulkActionsProps {
  selectedIds: string[];
  onClearSelection: () => void;
  onRefresh: () => void;
}

export default function DevisBulkActions({ selectedIds, onClearSelection, onRefresh }: DevisBulkActionsProps) {
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<string | null>(null);

  if (selectedIds.length === 0) return null;

  const handleAction = async (actionType: string) => {
    if (selectedIds.length === 0) return;

    // Demander confirmation pour certaines actions destructives
    if (actionType === 'delete' || actionType === 'archive') {
      if (!confirm(`Êtes-vous sûr de vouloir ${actionType === 'delete' ? 'supprimer' : 'archiver'} ${selectedIds.length} document(s) ?`)) {
        return;
      }
    }

    try {
      setLoading(true);
      setAction(actionType);

      // Simuler un appel API
      console.log(`Action ${actionType} sur:`, selectedIds);
      
      // Dans un vrai scénario, on appellerait l'API
      // await fetch('/api/devis/bulk', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ action: actionType, ids: selectedIds })
      // });
      
      // Simulation de délai
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Notification de succès
      alert(`Action "${actionType}" effectuée sur ${selectedIds.length} document(s)`);
      
      onClearSelection();
      onRefresh();
    } catch (error) {
      console.error('Erreur:', error);
      alert(`Erreur lors de l'action ${actionType}`);
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  return (
    <div className="fixed bottom-0 inset-x-0 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-600 rounded-lg shadow-lg p-4 sm:p-5">
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex items-center">
              <span className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-indigo-800 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </span>
              <p className="ml-3 font-medium text-white truncate">
                <span>{selectedIds.length} document{selectedIds.length > 1 ? 's' : ''} sélectionné{selectedIds.length > 1 ? 's' : ''}</span>
              </p>
            </div>
            <div className="flex-shrink-0 mt-4 sm:mt-0 sm:ml-6">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => handleAction('export')}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                >
                  {loading && action === 'export' ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="-ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  )}
                  Exporter
                </button>
                
                <button
                  type="button"
                  onClick={() => handleAction('send')}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                >
                  {loading && action === 'send' ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="-ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                  Envoyer
                </button>
                
                <button
                  type="button"
                  onClick={() => handleAction('delete')}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                >
                  {loading && action === 'delete' ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="-ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                  Supprimer
                </button>
                
                <button
                  type="button"
                  onClick={onClearSelection}
                  className="inline-flex items-center p-2 border border-transparent rounded-md text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
