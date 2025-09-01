interface DevisFiltersProps {
  activeTab: 'TOUS' | 'DEVIS' | 'FACTURE';
  onTabChange: (tab: 'TOUS' | 'DEVIS' | 'FACTURE') => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
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
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ 
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        marginBottom: '1rem'
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
                background: activeTab === tab ? '#3b82f6' : '#f8fafc',
                color: activeTab === tab ? 'white' : '#64748b',
                cursor: 'pointer'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          style={{
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem'
          }}
        >
          <option value="TOUS">Tous les statuts</option>
          <option value="BROUILLON">Brouillon</option>
          <option value="ENVOYE">Envoyé</option>
          <option value="ACCEPTE">Accepté</option>
          <option value="REFUSE">Refusé</option>
          <option value="PAYE">Payé</option>
        </select>

        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            width: '200px'
          }}
        />
      </div>
    </div>
  );
}
