import Link from 'next/link';

interface DevisCardProps {
  devis: any;
}

export default function DevisCard({ devis }: DevisCardProps) {
  const getStatusColor = (statut: string) => {
    const colors = {
      BROUILLON: '#64748b',
      ENVOYE: '#3b82f6',
      ACCEPTE: '#10b981',
      REFUSE: '#ef4444',
      PAYE: '#059669'
    };
    return colors[statut as keyof typeof colors] || '#64748b';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <Link href={`/dashboard/devis/${devis.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ 
        padding: '1.5rem', 
        cursor: 'pointer',
        transition: 'transform 0.2s'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>{devis.numero}</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>{devis.objet}</p>
          </div>
          <span style={{
            background: getStatusColor(devis.statut),
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '1rem',
            fontSize: '0.75rem'
          }}>
            {devis.statut}
          </span>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
            Client: {devis.client?.name}
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
            {formatCurrency(devis.totalTTC || 0)}
          </div>
        </div>
      </div>
    </Link>
  );
}
