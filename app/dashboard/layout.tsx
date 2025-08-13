'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Chantiers', href: '/dashboard/chantiers', icon: '🏗️' },
  { name: 'Messages', href: '/dashboard/messages', icon: '💬' },
  { name: 'Équipes', href: '/dashboard/equipes', icon: '👥' },
  { name: 'Devis', href: '/dashboard/devis', icon: '💰' },
  { name: 'Planning', href: '/dashboard/planning', icon: '📅' },
  { name: 'Documents', href: '/dashboard/documents', icon: '📁' }
];

export default function DashboardLayout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header fixe */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem'
      }}>
        {/* Logo + Menu Mobile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              display: 'block',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#64748b'
            }}
            className="lg:hidden"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6, #f97316)',
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              🏗️
            </div>
            <div>
              <h1 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #3b82f6, #f97316)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0
              }}>
                ChantierPro
              </h1>
            </div>
          </div>
        </div>

        {/* Navigation Desktop */}
        <nav style={{ display: 'none' }} className="lg:flex">
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {menuItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    background: isActive ? '#f0f9ff' : 'transparent',
                    color: isActive ? '#0369a1' : '#64748b',
                    border: isActive ? '1px solid #0ea5e9' : '1px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.color = '#1e293b';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#64748b';
                    }
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#1e293b', fontWeight: '500' }}>
              Jean Dupont
            </p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
              Administrateur
            </p>
          </div>
          <div style={{
            background: '#f1f5f9',
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: '#1e293b'
          }}>
            JD
          </div>
        </div>
      </header>

      {/* Sidebar Mobile */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '280px',
        background: 'white',
        borderRight: '1px solid #e2e8f0',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        zIndex: 1100,
        display: 'flex',
        flexDirection: 'column'
      }} className="lg:hidden">
        {/* Header Sidebar */}
        <div style={{
          height: '64px',
          padding: '0 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6, #f97316)',
              width: '2rem',
              height: '2rem',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.875rem'
            }}>
              🏗️
            </div>
            <span style={{ fontWeight: '600', color: '#1e293b' }}>ChantierPro</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              padding: '0.5rem',
              borderRadius: '0.25rem',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            ✕
          </button>
        </div>

        {/* Navigation Mobile */}
        <nav style={{ flex: 1, padding: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {menuItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    background: isActive ? '#f0f9ff' : 'transparent',
                    color: isActive ? '#0369a1' : '#64748b',
                    borderLeft: isActive ? '3px solid #0ea5e9' : '3px solid transparent'
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Overlay Mobile */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1050
          }}
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden"
        />
      )}

      {/* Contenu Principal */}
      <main style={{ 
        paddingTop: '64px',
        minHeight: 'calc(100vh - 64px)'
      }}>
        {children}
      </main>
    </div>
  );
}