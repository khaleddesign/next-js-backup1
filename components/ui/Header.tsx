'use client';

import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header style={{
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>
        🏗️ BTP Management
      </div>
      
      {session && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#64748b' }}>
            Bonjour, {session.user?.name || session.user?.email}
          </span>
          <button
            onClick={() => signOut()}
            style={{
              padding: '0.5rem 1rem',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Déconnexion
          </button>
        </div>
      )}
    </header>
  );
}
