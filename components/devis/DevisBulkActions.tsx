interface DevisBulkActionsProps {
  selectedIds: string[];
  onClearSelection: () => void;
  onRefresh: () => void;
}

export default function DevisBulkActions({
  selectedIds,
  onClearSelection,
  onRefresh
}: DevisBulkActionsProps) {
  if (selectedIds.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#1f2937',
      color: 'white',
      padding: '1rem 2rem',
      borderRadius: '0.75rem',
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
    }}>
      <span>{selectedIds.length} sélectionné(s)</span>
      <button
        onClick={onClearSelection}
        style={{
          background: 'transparent',
          border: '1px solid #6b7280',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          cursor: 'pointer'
        }}
      >
        Annuler
      </button>
    </div>
  );
}
