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
