'use client';

interface DevisFiltersProps {
  activeTab: 'TOUS' | 'DEVIS' | 'FACTURE';
  onTabChange: (tab: 'TOUS' | 'DEVIS' | 'FACTURE') => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  searchTerm: string;
  onSearchChange: (search: string) => void;
}

export default function DevisFilters({
  activeTab,
  onTabChange,
  statusFilter,
  onStatusChange,
  searchTerm,
  onSearchChange
}: DevisFiltersProps) {
  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap',
      gap: '1rem',
      marginBottom: '1.5rem',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {(['TOUS', 'DEVIS', 'FACTURE'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '0.5rem',
              background: activeTab === tab ? '#3b82f6' : '#f1f5f9',
              color: activeTab === tab ? 'white' : '#64748b',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            {tab === 'TOUS' ? 'Tous' : tab === 'DEVIS' ? 'Devis' : 'Factures'}
          </button>
        ))}
      </div>

      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        style={{
          padding: '0.5rem',
          border: '1px solid #d1d5db',
          borderRadius: '0.5rem',
          background: 'white',
          fontSize: '0.875rem'
        }}
      >
        <option value="TOUS">Tous les statuts</option>
        <option value="BROUILLON">Brouillon</option>
        <option value="ENVOYE">Envoyé</option>
        <option value="ACCEPTE">Accepté</option>
        <option value="REFUSE">Refusé</option>
        <option value="PAYE">Payé</option>
        <option value="ANNULE">Annulé</option>
      </select>

      <input
        type="text"
        placeholder="Rechercher par numéro, objet ou client..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          padding: '0.5rem 1rem',
          border: '1px solid #d1d5db',
          borderRadius: '0.5rem',
          background: 'white',
          minWidth: '250px',
          fontSize: '0.875rem'
        }}
      />
    </div>
  );
}
