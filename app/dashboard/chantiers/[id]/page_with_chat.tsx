"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ChantierHero from "@/components/chantiers/ChantierHero";
import ChantierTabs from "@/components/chantiers/ChantierTabs";
import ChatWidget from "@/components/messages/ChatWidget";

// ... (garder toutes les interfaces et données mock existantes)

export default function ChantierDetailPage() {
  // ... (garder toute la logique existante)

  // Nouveau: État pour le widget chat
  const [currentUser] = useState({
    id: 'test-client-123',
    name: 'Marie Dubois',
    role: 'CLIENT'
  });

  // ... (garder tout le code existant jusqu'au return)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Breadcrumb existant */}
        <nav style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
            <Link href="/dashboard" style={{ color: '#3b82f6', textDecoration: 'none' }}>
              Dashboard
            </Link>
            <span>›</span>
            <Link href="/dashboard/chantiers" style={{ color: '#3b82f6', textDecoration: 'none' }}>
              Chantiers
            </Link>
            <span>›</span>
            <span style={{ color: '#1e293b', fontWeight: '500' }}>
              {chantier?.nom}
            </span>
          </div>
        </nav>

        {/* Hero section existant */}
        {chantier && (
          <ChantierHero 
            chantier={chantier}
            onEdit={() => router.push(`/dashboard/chantiers/${chantier.id}/modifier`)}
            onShare={() => console.log('Partager')}
            onArchive={() => console.log('Archiver')}
          />
        )}

        {/* Tabs navigation et contenu existant */}
        {chantier && (
          <ChantierTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          >
            {renderTabContent()}
          </ChantierTabs>
        )}
      </div>

      {/* NOUVEAU: Widget Chat flottant */}
      {chantier && (
        <ChatWidget
          chantierId={chantier.id}
          chantierNom={chantier.nom}
          currentUserId={currentUser.id}
          participants={[
            {
              id: chantier.client.id,
              name: chantier.client.name,
              role: 'CLIENT'
            },
            ...chantier.assignees.map(assignee => ({
              id: assignee.id,
              name: assignee.name,
              role: assignee.role
            }))
          ]}
        />
      )}
    </div>
  );
}