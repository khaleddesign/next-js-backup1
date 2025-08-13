'use client';

interface TotauxCalculatorProps {
  lignes: Array<{
    quantite: string;
    prixUnitaire: string;
    tva: string;
  }>;
  showDetails?: boolean;
  className?: string;
}

export default function TotauxCalculator({ lignes, showDetails = true, className }: TotauxCalculatorProps) {
  const calculateTotals = () => {
    const totalHT = lignes.reduce((sum, ligne) => {
      const quantite = parseFloat(ligne.quantite) || 0;
      const prix = parseFloat(ligne.prixUnitaire) || 0;
      return sum + (quantite * prix);
    }, 0);

    const totalTVA = lignes.reduce((sum, ligne) => {
      const quantite = parseFloat(ligne.quantite) || 0;
      const prix = parseFloat(ligne.prixUnitaire) || 0;
      const tva = parseFloat(ligne.tva) || 0;
      const sousTotal = quantite * prix;
      return sum + (sousTotal * tva / 100);
    }, 0);

    const totalTTC = totalHT + totalTVA;

    return { totalHT, totalTVA, totalTTC };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const { totalHT, totalTVA, totalTTC } = calculateTotals();

  return (
    <div style={{
      background: '#f0f9ff',
      border: '1px solid #0ea5e9',
      borderRadius: '0.75rem',
      padding: '1.5rem'
    }} className={className}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: showDetails ? '1fr auto' : '1fr',
        gap: '1.5rem',
        alignItems: 'center'
      }}>
        <div>
          <h4 style={{ 
            margin: '0 0 0.5rem 0', 
            color: '#0369a1',
            fontSize: '1.125rem',
            fontWeight: '600'
          }}>
            Récapitulatif
          </h4>
          <p style={{ 
            margin: 0, 
            fontSize: '0.875rem', 
            color: '#0369a1',
            opacity: 0.8
          }}>
            {lignes.length} ligne{lignes.length > 1 ? 's' : ''} • TVA calculée automatiquement
          </p>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          {showDetails && (
            <>
              <div style={{ 
                marginBottom: '0.5rem',
                fontSize: '1rem',
                color: '#0369a1',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '2rem'
              }}>
                <span>Total HT:</span>
                <span style={{ fontWeight: '500' }}>{formatCurrency(totalHT)}</span>
              </div>
              <div style={{ 
                marginBottom: '0.75rem',
                fontSize: '1rem',
                color: '#0369a1',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '2rem'
              }}>
                <span>TVA:</span>
                <span style={{ fontWeight: '500' }}>{formatCurrency(totalTVA)}</span>
              </div>
              <div style={{
                borderTop: '1px solid #0ea5e9',
                paddingTop: '0.75rem'
              }}>
            </>
          )}
            <div style={{ 
              fontSize: showDetails ? '1.5rem' : '1.25rem',
              fontWeight: 'bold',
              color: '#0369a1',
              display: 'flex',
              justifyContent: 'space-between',
              gap: '2rem'
            }}>
              <span>Total TTC:</span>
              <span>{formatCurrency(totalTTC)}</span>
            </div>
          {showDetails && (
            </div>
          )}
        </div>
      </div>
      
      {totalHT === 0 && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          color: '#92400e',
          textAlign: 'center'
        }}>
          ⚠️ Ajoutez des lignes avec des montants pour voir le calcul
        </div>
      )}
    </div>
  );
}
