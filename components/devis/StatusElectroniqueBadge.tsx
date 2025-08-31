interface StatusElectroniqueBadgeProps {
  statut: string;
  showIcon?: boolean;
}

export default function StatusElectroniqueBadge({ 
  statut, 
  showIcon = true 
}: StatusElectroniqueBadgeProps) {
  const getStatusConfig = (statut: string) => {
    const configs = {
      BROUILLON: {
        color: '#64748b',
        backgroundColor: '#f1f5f9',
        text: 'Brouillon',
        icon: '📝'
      },
      VALIDE_LOCAL: {
        color: '#3b82f6',
        backgroundColor: '#dbeafe',
        text: 'Validé Local',
        icon: '✅'
      },
      TRANSMIS_PDP: {
        color: '#f59e0b',
        backgroundColor: '#fef3c7',
        text: 'Transmis PDP',
        icon: '📤'
      },
      VALIDE_PDP: {
        color: '#10b981',
        backgroundColor: '#d1fae5',
        text: 'Validé PDP',
        icon: '✅'
      },
      RECU_CLIENT: {
        color: '#059669',
        backgroundColor: '#ecfdf5',
        text: 'Reçu Client',
        icon: '📩'
      },
      PAYE: {
        color: '#059669',
        backgroundColor: '#ecfdf5',
        text: 'Payé',
        icon: '💰'
      },
      REJETE_PDP: {
        color: '#ef4444',
        backgroundColor: '#fee2e2',
        text: 'Rejeté PDP',
        icon: '❌'
      },
      ERREUR_FORMAT: {
        color: '#dc2626',
        backgroundColor: '#fef2f2',
        text: 'Erreur Format',
        icon: '⚠️'
      }
    };
    return configs[statut as keyof typeof configs] || configs.BROUILLON;
  };

  const statusConfig = getStatusConfig(statut);

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: showIcon ? '0.25rem' : '0',
      color: statusConfig.color,
      backgroundColor: statusConfig.backgroundColor,
      fontWeight: '500',
      fontSize: '0.75rem',
      padding: '0.25rem 0.75rem',
      borderRadius: '0.5rem',
      border: `1px solid ${statusConfig.color}20`
    }}>
      {showIcon && <span>{statusConfig.icon}</span>}
      {statusConfig.text}
    </span>
  );
}
