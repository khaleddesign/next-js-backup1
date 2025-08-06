"use client";

export default function ActivityFeed() {
  const activities = [
    {
      id: 1,
      type: "chantier",
      title: "Nouveau chantier créé",
      description: "Rénovation Villa Moderne - Marie Dubois",
      time: "Il y a 2h",
      icon: "🏗️",
      color: "#3b82f6"
    },
    {
      id: 2,
      type: "message",
      title: "Nouveau message",
      description: "Pierre Maçon a envoyé une photo",
      time: "Il y a 4h",
      icon: "💬",
      color: "#f97316"
    },
    {
      id: 3,
      type: "planning",
      title: "Réunion planifiée",
      description: "Point chantier Villa Moderne - 14h00",
      time: "Il y a 6h",
      icon: "📅",
      color: "#10b981"
    },
    {
      id: 4,
      type: "chantier",
      title: "Étape terminée",
      description: "Démolition terminée - Loft Industriel",
      time: "Hier",
      icon: "✅",
      color: "#059669"
    },
    {
      id: 5,
      type: "devis",
      title: "Devis accepté",
      description: "Extension Maison Familiale - 65 000€",
      time: "Hier",
      icon: "💰",
      color: "#7c3aed"
    }
  ];

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
          Activité Récente
        </h3>
        <button style={{
          background: 'transparent',
          border: 'none',
          color: '#3b82f6',
          fontSize: '0.875rem',
          cursor: 'pointer',
          textDecoration: 'underline'
        }}>
          Voir tout
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {activities.map((activity) => (
          <div key={activity.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              background: activity.color + '20',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.875rem',
              flexShrink: 0
            }}>
              {activity.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: '500', color: '#1e293b', fontSize: '0.875rem' }}>
                {activity.title}
              </p>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.75rem', lineHeight: 1.4 }}>
                {activity.description}
              </p>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}