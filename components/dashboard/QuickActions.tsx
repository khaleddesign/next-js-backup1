"use client";

import Link from "next/link";

export default function QuickActions() {
  const actions = [
    {
      title: "Nouveau Chantier",
      description: "Créer un nouveau projet",
      icon: "🏗️",
      href: "/dashboard/chantiers/nouveau",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Messages",
      description: "Voir les messages",
      icon: "💬",
      href: "/dashboard/messages",
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Plannings",
      description: "Gérer les plannings",
      icon: "📅",
      href: "/dashboard/plannings",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Équipes",
      description: "Gérer les équipes",
      icon: "👥",
      href: "/dashboard/equipes",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="card">
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>
        Actions Rapides
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {actions.map((action, index) => (
          <Link key={index} href={action.href} style={{ textDecoration: 'none' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.5rem',
                background: `linear-gradient(135deg, #3b82f6, #f97316)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem'
              }}>
                {action.icon}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: '500', color: '#1e293b', fontSize: '0.875rem' }}>
                  {action.title}
                </p>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.75rem' }}>
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}