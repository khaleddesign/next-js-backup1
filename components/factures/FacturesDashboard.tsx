'use client';

export default function FacturesDashboard() {
  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>
          📊 Tableau de Bord Factures
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#92400e' }}>5</div>
            <div style={{ fontSize: '0.875rem', color: '#92400e' }}>En attente</div>
          </div>
          
          <div style={{ background: '#ecfdf5', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#065f46' }}>12</div>
            <div style={{ fontSize: '0.875rem', color: '#065f46' }}>Payées</div>
          </div>
          
          <div style={{ background: '#fee2e2', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>3</div>
            <div style={{ fontSize: '0.875rem', color: '#dc2626' }}>En retard</div>
          </div>
          
          <div style={{ background: '#dbeafe', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e40af' }}>45.2k€</div>
            <div style={{ fontSize: '0.875rem', color: '#1e40af' }}>Total mensuel</div>
          </div>
        </div>
      </div>
      
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#1e293b' }}>
          🔍 Factures Récentes
        </h3>
        <p style={{ color: '#64748b', margin: 0 }}>
          Dashboard des factures opérationnel ✅
        </p>
      </div>
    </div>
  );
}
