#!/bin/bash

# Script final d'intégration ChantierPro
# À exécuter APRÈS le script de création des fichiers

echo "🔧 INTÉGRATION FINALE - CHANTIERPRO"
echo "===================================="

# 1. Créer la page de test des notifications
echo "📝 Création de la page de test..."
mkdir -p app/test
cat > app/test/page.tsx << 'EOF'
import NotificationTest from "@/components/test/NotificationTest";

export default function TestPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: '#1e293b', 
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          🧪 Tests des Fonctionnalités ChantierPro
        </h1>
        <p style={{ 
          color: '#64748b', 
          textAlign: 'center', 
          marginBottom: '2rem' 
        }}>
          Testez toutes les nouvelles fonctionnalités de notifications et messages
        </p>
        
        <NotificationTest />
      </div>
    </div>
  );
}
EOF

echo "✅ Page de test créée : /test"

# 2. Ajouter le ChatWidget dans la page détail chantier
echo "📝 Intégration ChatWidget dans la page détail chantier..."
# Sauvegarder l'original
cp app/dashboard/chantiers/[id]/page.tsx app/dashboard/chantiers/[id]/page.tsx.backup

# Ajouter l'import du ChatWidget au début du fichier
sed -i.tmp '1i\
import ChatWidget from "@/components/messages/ChatWidget";
' app/dashboard/chantiers/[id]/page.tsx

# Ajouter le ChatWidget avant la fermeture de la div principale
sed -i.tmp 's|</div>$|      <ChatWidget chantierId={chantier.id} userId="test-client-123" />\
&|' app/dashboard/chantiers/[id]/page.tsx

# Nettoyer les fichiers temporaires
rm -f app/dashboard/chantiers/[id]/page.tsx.tmp

echo "✅ ChatWidget intégré dans les pages chantier"

# 3. Créer un composant de statistiques amélioré avec notifications
echo "📝 Création de components/dashboard/StatsCardEnhanced.tsx..."
cat > components/dashboard/StatsCardEnhanced.tsx << 'EOF'
"use client";

import { useEffect, useState } from 'react';
import NotificationBadge from '@/components/ui/NotificationBadge';
import { useMessages } from '@/hooks/useMessages';

interface StatsCardEnhancedProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  change?: string;
  type?: 'messages' | 'tasks' | 'alerts' | 'default';
  href?: string;
  onClick?: () => void;
}

export default function StatsCardEnhanced({ 
  title, 
  value, 
  icon, 
  color, 
  change, 
  type = 'default',
  href,
  onClick
}: StatsCardEnhancedProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const { totalUnreadCount } = useMessages();

  // Animation du compteur
  useEffect(() => {
    const numValue = typeof value === 'string' ? parseInt(value) || 0 : value;
    const increment = numValue / 20;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= numValue) {
        setAnimatedValue(numValue);
        clearInterval(timer);
      } else {
        setAnimatedValue(Math.floor(current));
      }
    }, 50);

    return () => clearInterval(timer);
  }, [value]);

  // Déterminer le nombre de notifications selon le type
  const getNotificationCount = () => {
    switch (type) {
      case 'messages':
        return totalUnreadCount;
      case 'tasks':
        return 2; // Exemple : 2 tâches urgentes
      case 'alerts':
        return 1; // Exemple : 1 alerte
      default:
        return 0;
    }
  };

  const notificationCount = getNotificationCount();
  const displayValue = typeof value === 'string' && value.includes('k€') 
    ? `${animatedValue}k€` 
    : animatedValue;

  const CardContent = () => (
    <div 
      className="card" 
      style={{ 
        padding: '1.5rem', 
        position: 'relative', 
        overflow: 'hidden',
        cursor: href || onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        border: notificationCount > 0 ? '2px solid rgba(239, 68, 68, 0.3)' : 'none'
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (href || onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (href || onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
        }
      }}
    >
      {/* Badge de notification */}
      {notificationCount > 0 && (
        <NotificationBadge 
          count={notificationCount}
          size="sm"
          position="top-right"
          animate={true}
        />
      )}

      {/* Background gradient */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '4rem',
          height: '4rem',
          background: `linear-gradient(135deg, ${color === 'blue' ? '#3b82f6, #1e40af' : 
                                                 color === 'orange' ? '#f97316, #ea580c' :
                                                 color === 'green' ? '#10b981, #059669' :
                                                 '#7c3aed, #5b21b6'})`,
          borderRadius: '50%',
          transform: 'translate(1rem, -1rem)',
          opacity: 0.1
        }}
      />
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0 0 0.5rem 0' }}>
            {title}
          </p>
          <p style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#1e293b',
            margin: '0 0 0.5rem 0'
          }}>
            {displayValue}
          </p>
          {change && (
            <p style={{ 
              color: change.startsWith('+') ? '#10b981' : '#ef4444', 
              fontSize: '0.75rem', 
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              {change.startsWith('+') ? '📈' : '📉'} {change}
            </p>
          )}
          {notificationCount > 0 && (
            <p style={{ 
              color: '#ef4444', 
              fontSize: '0.75rem', 
              margin: '0.25rem 0 0 0',
              fontWeight: '600'
            }}>
              🔔 {notificationCount} nouveau{notificationCount > 1 ? 'x' : ''}
            </p>
          )}
        </div>
        <div style={{ fontSize: '2rem', opacity: 0.7 }}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} style={{ textDecoration: 'none' }}>
        <CardContent />
      </a>
    );
  }

  return <CardContent />;
}
EOF

echo "✅ StatsCardEnhanced créé"

# 4. Mettre à jour la page dashboard pour utiliser les nouvelles stats
echo "📝 Mise à jour du dashboard principal..."
cp app/dashboard/page.tsx app/dashboard/page.tsx.backup
cat > app/dashboard/page.tsx << 'EOF'
"use client";

import { useState, useEffect } from "react";
import StatsCardEnhanced from "../../components/dashboard/StatsCardEnhanced";
import QuickActions from "../../components/dashboard/QuickActions";
import ActivityFeed from "../../components/dashboard/ActivityFeed";
import { useToast, showInfoToast } from "@/components/ui/Toast";

// Mock data réalistes
const mockStats = {
  chantiersActifs: 12,
  messagesNonLus: 7,
  equipesDisponibles: 4,
  chiffreAffaireMois: 245000,
  evolutionCA: 15.3,
  tauxRealisation: 87,
};

const mockChartData = [
  { mois: "Jan", chantiers: 8, ca: 180000 },
  { mois: "Fév", chantiers: 12, ca: 220000 },
  { mois: "Mar", chantiers: 15, ca: 195000 },
  { mois: "Avr", chantiers: 18, ca: 245000 },
  { mois: "Mai", chantiers: 16, ca: 270000 },
  { mois: "Jun", chantiers: 14, ca: 245000 },
];

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState({
    name: "Jean Dupont",
    role: "Admin",
    avatar: "JD"
  });

  const [timeOfDay, setTimeOfDay] = useState("");
  const { addToast } = useToast();
  const infoToast = showInfoToast(addToast);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("Bonjour");
    else if (hour < 18) setTimeOfDay("Bon après-midi");
    else setTimeOfDay("Bonsoir");

    // Message de bienvenue avec les nouvelles fonctionnalités
    setTimeout(() => {
      infoToast(
        "Nouvelles fonctionnalités disponibles !",
        "Notifications temps réel, chat intégré et bien plus...",
        {
          label: "Découvrir",
          onClick: () => window.open("/test", "_blank")
        }
      );
    }, 2000);
  }, [infoToast]);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      {/* Header */}
      <header style={{
        background: "white",
        borderBottom: "1px solid #e2e8f0",
        padding: "1rem 2rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{
              background: "linear-gradient(135deg, #3b82f6, #f97316)",
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "0.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold"
            }}>
              🏗️
            </div>
            <div>
              <h1 style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                background: "linear-gradient(135deg, #3b82f6, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                margin: 0
              }}>
                ChantierPro
              </h1>
              <p style={{
                margin: 0,
                fontSize: "0.75rem",
                color: "#64748b"
              }}>
                v2.0 - Notifications temps réel
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, color: "#64748b", fontSize: "0.875rem" }}>
                {timeOfDay}, {currentUser.name}
              </p>
              <p style={{ margin: 0, color: "#3b82f6", fontSize: "0.75rem", fontWeight: "500" }}>
                {currentUser.role}
              </p>
            </div>
            <div style={{
              background: "#f1f5f9",
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              color: "#1e293b"
            }}>
              {currentUser.avatar}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "bold", color: "#1e293b", margin: "0 0 0.5rem 0" }}>
            Dashboard
          </h2>
          <p style={{ color: "#64748b", margin: 0 }}>
            Vue d'ensemble de vos chantiers et activités du {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        {/* Stats Grid - Utilisation des nouvelles StatsCardEnhanced */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem"
        }}>
          <StatsCardEnhanced
            title="Chantiers Actifs"
            value={mockStats.chantiersActifs}
            icon="🏗️"
            color="blue"
            change="+3 ce mois"
            href="/dashboard/chantiers"
          />
          <StatsCardEnhanced
            title="Messages"
            value={mockStats.messagesNonLus}
            icon="💬"
            color="orange"
            change="2 urgents"
            type="messages"
            href="/dashboard/messages"
          />
          <StatsCardEnhanced
            title="Équipes Actives"
            value={mockStats.equipesDisponibles}
            icon="👥"
            color="green"
            change="100% disponible"
            type="tasks"
            href="/dashboard/equipes"
          />
          <StatsCardEnhanced
            title="CA du Mois"
            value={`${(mockStats.chiffreAffaireMois / 1000).toFixed(0)}k€`}
            icon="💰"
            color="purple"
            change={`+${mockStats.evolutionCA}%`}
            type="alerts"
          />
        </div>

        {/* Content Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "2rem",
          marginBottom: "2rem"
        }}>
          {/* Chart Section */}
          <div style={{
            background: "white",
            borderRadius: "1rem",
            padding: "1.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '1rem' 
            }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "#1e293b", margin: 0 }}>
                Évolution des Chantiers
              </h3>
              <button
                className="btn-ghost"
                onClick={() => infoToast("Graphique", "Données simulées pour la démonstration")}
                style={{ fontSize: '0.875rem', padding: '0.5rem' }}
              >
                ℹ️ Info
              </button>
            </div>
            <div style={{ height: "200px", display: "flex", alignItems: "end", gap: "1rem", padding: "1rem 0" }}>
              {mockChartData.map((data, index) => (
                <div key={data.mois} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{
                    height: `${(data.chantiers / 20) * 160}px`,
                    background: "linear-gradient(135deg, #3b82f6, #f97316)",
                    borderRadius: "0.25rem",
                    marginBottom: "0.5rem",
                    transition: "all 0.3s ease"
                  }} />
                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{data.mois}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <QuickActions />
        </div>

        {/* Activity Feed */}
        <ActivityFeed />

        {/* Debug Section */}
        <div className="card" style={{ marginTop: "2rem", background: "#fef3c7", border: "1px solid #fbbf24" }}>
          <h3 style={{ color: "#92400e", marginBottom: "1rem" }}>
            🧪 Zone de Test
          </h3>
          <p style={{ color: "#92400e", fontSize: "0.875rem", marginBottom: "1rem" }}>
            Testez les nouvelles fonctionnalités de notifications et de messagerie.
          </p>
          <a
            href="/test"
            target="_blank"
            className="btn-primary"
            style={{ fontSize: "0.875rem" }}
          >
            🧪 Accéder aux tests
          </a>
        </div>
      </main>
    </div>
  );
}
EOF

echo "✅ Dashboard principal mis à jour"

# 5. Créer un guide d'utilisation
echo "📝 Création du guide d'utilisation..."
cat > GUIDE_NOUVELLES_FONCTIONNALITES.md << 'EOF'
# 🚀 Guide des Nouvelles Fonctionnalités ChantierPro

## 📋 Vue d'Ensemble

ChantierPro a été enrichi avec un système complet de notifications et de messagerie temps réel. Voici toutes les nouvelles fonctionnalités disponibles :

## 🔔 Système de Notifications

### NotificationBadge
Badges de notification réutilisables avec compteurs :
```tsx
import NotificationBadge from '@/components/ui/NotificationBadge';

<NotificationBadge count={5} variant="red">
  <button>Messages</button>
</NotificationBadge>
```

### Variantes Disponibles
- `MessagesBadge` - Pour les messages (rouge)
- `TasksBadge` - Pour les tâches (orange) 
- `AlertsBadge` - Pour les alertes (bleu)

## 💬 Hook useMessages

Hook centralisé pour gérer tous les messages :

```tsx
import { useMessages } from '@/hooks/useMessages';

const {
  conversations,      // Liste des conversations
  messages,          // Messages de la conversation active
  totalUnreadCount,  // Nombre total de messages non lus
  sendMessage,       // Fonction pour envoyer un message
  loading,          // État de chargement
  error            // Gestion d'erreurs
} = useMessages();
```

### Fonctionnalités du Hook
- ✅ Polling automatique (30 secondes par défaut)
- ✅ Optimistic updates (messages apparaissent immédiatement)
- ✅ Gestion d'erreurs robuste
- ✅ Mode dégradé si DB indisponible
- ✅ Notifications navigateur automatiques

## 🍞 Système de Toast

Notifications toast pour le feedback utilisateur :

```tsx
import { useToast, showSuccessToast } from '@/components/ui/Toast';

const { addToast } = useToast();
const successToast = showSuccessToast(addToast);

// Utilisation
successToast("Succès", "Message envoyé avec succès");
```

### Types de Toast
- `showSuccessToast` - Succès (vert)
- `showErrorToast` - Erreurs (rouge, 8 secondes)
- `showWarningToast` - Avertissements (orange, 6 secondes)
- `showInfoToast` - Informations (bleu, 5 secondes)

## 💬 Widget Chat

Chat intégrable dans n'importe quelle page :

```tsx
import ChatWidget from '@/components/messages/ChatWidget';

<ChatWidget 
  chantierId="chantier-id" 
  userId="user-id" 
  minimized={true} 
/>
```

### Fonctionnalités du Widget
- ✅ Position fixe en bas à droite
- ✅ Minimizable/expandable
- ✅ Animation d'apparition
- ✅ Intégration complète avec useMessages
- ✅ Gestion d'erreurs

## 🏷️ Badge Titre Navigateur

Badge automatique dans le titre de l'onglet :

```tsx
import DocumentTitleBadge from '@/components/layout/DocumentTitleBadge';

<DocumentTitleBadge baseTitle="ChantierPro" userId="user-id" />
```

## 🛡️ Gestion d'Erreurs

ErrorBoundary pour capturer les erreurs React :

```tsx
import ErrorBoundary from '@/components/ui/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## 📊 Stats Cards Améliorées

Cartes de statistiques avec notifications :

```tsx
import StatsCardEnhanced from '@/components/dashboard/StatsCardEnhanced';

<StatsCardEnhanced
  title="Messages"
  value={7}
  icon="💬"
  color="orange"
  type="messages"  // Active les notifications
  href="/dashboard/messages"
/>
```

## 🎯 URLs Disponibles

- `/dashboard` - Dashboard principal avec notifications
- `/dashboard/messages` - Interface complète de messagerie
- `/dashboard/chantiers/[id]` - Détail chantier avec ChatWidget intégré
- `/test` - Page de test de toutes les fonctionnalités

## ⚙️ Configuration

### Polling Interval
```tsx
const { ... } = useMessages({
  userId: 'user-id',
  pollingInterval: 30000, // 30 secondes
  enableNotifications: true
});
```

### Permissions Navigateur
```tsx
const { requestNotificationPermission } = useMessages();

// Demander les permissions
await requestNotificationPermission();
```

## 🔧 API Améliorées

### GET /api/messages
```json
{
  "conversations": [...],
  "success": true,
  "timestamp": "2024-..."
}
```

### POST /api/messages
```json
{
  "expediteurId": "user-id",
  "message": "Contenu du message",
  "chantierId": "chantier-id",
  "photos": ["url1", "url2"]
}
```

### Gestion d'Erreurs API
- Validation des données d'entrée
- Messages d'erreur explicites
- Mode dégradé avec données simulées
- Timestamps pour le debugging

## 🎨
