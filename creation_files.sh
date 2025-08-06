#!/bin/bash

# Script de création des fichiers manquants pour ChantierPro
# À exécuter depuis la racine du projet

echo "🚀 CRÉATION DES FICHIERS MANQUANTS - CHANTIERPRO"
echo "================================================="

# Créer les dossiers nécessaires
echo "📁 Création des dossiers..."
mkdir -p hooks
mkdir -p components/ui
mkdir -p components/layout

echo "✅ Dossiers créés"

# 1. Créer le hook useMessages
echo "📝 Création de hooks/useMessages.ts..."
cat > hooks/useMessages.ts << 'EOF'
import { useState, useEffect, useCallback, useRef } from 'react';

// Types pour le hook
export interface Message {
  id: string;
  expediteur: {
    id: string;
    name: string;
    role: string;
  };
  message: string;
  photos: string[];
  createdAt: string;
  lu: boolean;
  chantierId?: string;
}

export interface Conversation {
  id: string;
  nom: string;
  photo?: string;
  participants: Array<{
    id: string;
    name: string;
    role: string;
  }>;
  lastMessage?: {
    text: string;
    time: string;
    expediteur: string;
  };
  unreadCount: number;
  updatedAt: string;
}

interface UseMessagesProps {
  userId?: string;
  pollingInterval?: number;
  enableNotifications?: boolean;
}

export function useMessages({
  userId = 'test-client-123',
  pollingInterval = 30000, // 30 secondes
  enableNotifications = true
}: UseMessagesProps = {}) {
  // États principaux
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  
  // États de chargement
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  
  // États d'erreur
  const [error, setError] = useState<string | null>(null);
  
  // Refs pour le polling et les notifications
  const pollingRef = useRef<NodeJS.Timeout>();
  const lastNotificationRef = useRef<number>(0);
  
  // Fonction pour récupérer les conversations
  const fetchConversations = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`/api/messages?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des conversations');
      }
      
      const data = await response.json();
      setConversations(data.conversations || []);
      
      // Calculer le nombre total de messages non lus
      const unreadTotal = data.conversations?.reduce(
        (total: number, conv: Conversation) => total + conv.unreadCount, 
        0
      ) || 0;
      
      setTotalUnreadCount(unreadTotal);
      
      // Notifications pour nouveaux messages
      if (enableNotifications && unreadTotal > 0) {
        handleNewMessageNotifications(data.conversations);
      }
      
    } catch (err) {
      console.error('Erreur fetchConversations:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [userId, enableNotifications]);

  // Fonction pour récupérer les messages d'une conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!conversationId) return;
    
    try {
      setLoadingMessages(true);
      setError(null);
      
      const response = await fetch(`/api/messages/chantier/${conversationId}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des messages');
      }
      
      const data = await response.json();
      setMessages(data.messages || []);
      
      // Marquer les messages comme lus
      await markAsRead(conversationId);
      
    } catch (err) {
      console.error('Erreur fetchMessages:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // Fonction pour envoyer un message
  const sendMessage = useCallback(async (
    text: string, 
    photos: string[] = [], 
    conversationId?: string
  ) => {
    if (!text.trim() && photos.length === 0) return false;
    
    const targetConversationId = conversationId || activeConversationId;
    if (!targetConversationId) return false;
    
    try {
      setSending(true);
      setError(null);
      
      // Optimistic update - ajouter le message immédiatement à l'UI
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        expediteur: {
          id: userId,
          name: 'Moi',
          role: 'CLIENT'
        },
        message: text.trim(),
        photos,
        createdAt: new Date().toISOString(),
        lu: true,
        chantierId: targetConversationId
      };
      
      if (targetConversationId === activeConversationId) {
        setMessages(prev => [...prev, optimisticMessage]);
      }
      
      // Envoyer à l'API
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expediteurId: userId,
          message: text.trim(),
          chantierId: targetConversationId,
          photos
        })
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message');
      }
      
      const data = await response.json();
      
      // Remplacer le message optimistic par le vrai message
      if (targetConversationId === activeConversationId) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === optimisticMessage.id ? data.message : msg
          )
        );
      }
      
      // Rafraîchir les conversations pour mettre à jour le dernier message
      fetchConversations();
      
      return true;
      
    } catch (err) {
      console.error('Erreur sendMessage:', err);
      setError(err instanceof Error ? err.message : 'Erreur envoi message');
      
      // Supprimer le message optimistic en cas d'erreur
      if (targetConversationId === activeConversationId) {
        setMessages(prev => 
          prev.filter(msg => msg.id !== optimisticMessage.id)
        );
      }
      
      return false;
    } finally {
      setSending(false);
    }
  }, [activeConversationId, userId, fetchConversations]);

  // Fonction pour marquer des messages comme lus
  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      await fetch('/api/messages/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chantierId: conversationId,
          userId
        })
      });
      
      // Mettre à jour localement le compteur
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
      
      // Recalculer le total
      setTotalUnreadCount(prev => {
        const currentConv = conversations.find(c => c.id === conversationId);
        return Math.max(0, prev - (currentConv?.unreadCount || 0));
      });
      
    } catch (err) {
      console.error('Erreur markAsRead:', err);
    }
  }, [userId, conversations]);

  // Gestion des notifications
  const handleNewMessageNotifications = useCallback((convs: Conversation[]) => {
    if (!enableNotifications || !('Notification' in window)) return;
    
    const now = Date.now();
    if (now - lastNotificationRef.current < 5000) return; // Throttle 5s
    
    const newUnreadCount = convs.reduce((total, conv) => total + conv.unreadCount, 0);
    if (newUnreadCount > totalUnreadCount && totalUnreadCount > 0) {
      lastNotificationRef.current = now;
      
      if (Notification.permission === 'granted') {
        new Notification('ChantierPro - Nouveaux messages', {
          body: `Vous avez ${newUnreadCount} message(s) non lu(s)`,
          icon: '/favicon.ico',
          tag: 'chantierpro-messages'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  }, [enableNotifications, totalUnreadCount]);

  // Fonction pour demander les permissions de notification
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) return false;
    
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }, []);

  // Fonction pour changer de conversation active
  const setActiveConversation = useCallback((conversationId: string | null) => {
    setActiveConversationId(conversationId);
    if (conversationId) {
      fetchMessages(conversationId);
    } else {
      setMessages([]);
    }
  }, [fetchMessages]);

  // Fonction pour rafraîchir manuellement
  const refresh = useCallback(() => {
    fetchConversations();
    if (activeConversationId) {
      fetchMessages(activeConversationId);
    }
  }, [fetchConversations, fetchMessages, activeConversationId]);

  // Effect principal - chargement initial et polling
  useEffect(() => {
    fetchConversations();
    
    if (pollingInterval > 0) {
      pollingRef.current = setInterval(fetchConversations, pollingInterval);
    }
    
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [fetchConversations, pollingInterval]);

  // Effect pour mettre à jour les messages quand on change de conversation
  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
    }
  }, [activeConversationId, fetchMessages]);

  // Effect pour les notifications au focus de la fenêtre
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchConversations();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchConversations]);

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  return {
    // États
    conversations,
    messages,
    activeConversationId,
    totalUnreadCount,
    loading,
    loadingMessages,
    sending,
    error,
    
    // Actions
    sendMessage,
    setActiveConversation,
    markAsRead,
    refresh,
    requestNotificationPermission,
    
    // Utilitaires
    fetchConversations,
    fetchMessages
  };
}
EOF

echo "✅ Hook useMessages créé"

# 2. Créer le composant NotificationBadge
echo "📝 Création de components/ui/NotificationBadge.tsx..."
cat > components/ui/NotificationBadge.tsx << 'EOF'
"use client";

import React from 'react';

interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline';
  variant?: 'red' | 'orange' | 'blue' | 'green' | 'gray';
  animate?: boolean;
  showZero?: boolean;
  backgroundColor?: string;
  children?: React.ReactNode;
}

export default function NotificationBadge({
  count,
  maxCount = 99,
  size = 'md',
  position = 'top-right',
  variant = 'red',
  animate = true,
  showZero = false,
  backgroundColor,
  children
}: NotificationBadgeProps) {
  // Ne pas afficher si count === 0 et showZero === false
  if (count === 0 && !showZero) {
    return children ? <div style={{ position: 'relative' }}>{children}</div> : null;
  }

  // Formater le nombre affiché
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  // Tailles compatibles avec le design existant
  const sizeStyles = {
    sm: {
      width: '1rem',
      height: '1rem',
      fontSize: '0.625rem',
      minWidth: '1rem'
    },
    md: {
      width: '1.25rem',
      height: '1.25rem',
      fontSize: '0.75rem',
      minWidth: '1.25rem'
    },
    lg: {
      width: '1.5rem',
      height: '1.5rem',
      fontSize: '0.875rem',
      minWidth: '1.5rem'
    }
  };

  // Couleurs cohérentes avec le design system
  const variantStyles = {
    red: backgroundColor || '#ef4444',
    orange: backgroundColor || '#f97316',
    blue: backgroundColor || '#3b82f6',
    green: backgroundColor || '#10b981',
    gray: backgroundColor || '#64748b'
  };

  // Positions absolues
  const positionStyles = {
    'top-right': {
      position: 'absolute' as const,
      top: '-0.25rem',
      right: '-0.25rem'
    },
    'top-left': {
      position: 'absolute' as const,
      top: '-0.25rem',
      left: '-0.25rem'
    },
    'bottom-right': {
      position: 'absolute' as const,
      bottom: '-0.25rem',
      right: '-0.25rem'
    },
    'bottom-left': {
      position: 'absolute' as const,
      bottom: '-0.25rem',
      left: '-0.25rem'
    },
    'inline': {
      position: 'relative' as const,
      display: 'inline-flex'
    }
  };

  const badgeStyle = {
    ...sizeStyles[size],
    ...positionStyles[position],
    backgroundColor: variantStyles[variant],
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    zIndex: 10,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.2s ease-in-out',
    animation: animate ? 'pulse 2s infinite' : 'none'
  };

  const badge = (
    <div 
      style={badgeStyle}
      title={`${count} message${count > 1 ? 's' : ''} non lu${count > 1 ? 's' : ''}`}
    >
      {displayCount}
    </div>
  );

  // Si pas d'enfants, retourner juste le badge
  if (!children) {
    return (
      <>
        {badge}
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}</style>
      </>
    );
  }

  // Sinon, wrapper les enfants avec le badge positionné
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {children}
      {badge}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

// Composant spécialisé pour les boutons avec badge
export function ButtonWithBadge({
  count,
  variant = 'red',
  animate = true,
  children,
  onClick,
  className = '',
  disabled = false,
  ...props
}: NotificationBadgeProps & {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${className}`}
      style={{ position: 'relative' }}
      {...props}
    >
      <NotificationBadge
        count={count}
        variant={variant}
        animate={animate}
        position="top-right"
      >
        {children}
      </NotificationBadge>
    </button>
  );
}

// Variantes prédéfinies pour différents contextes
export const MessagesBadge = ({ count, ...props }: Omit<NotificationBadgeProps, 'variant'>) => (
  <NotificationBadge count={count} variant="red" animate={count > 0} {...props} />
);

export const TasksBadge = ({ count, ...props }: Omit<NotificationBadgeProps, 'variant'>) => (
  <NotificationBadge count={count} variant="orange" animate={count > 0} {...props} />
);

export const AlertsBadge = ({ count, ...props }: Omit<NotificationBadgeProps, 'variant'>) => (
  <NotificationBadge count={count} variant="blue" animate={count > 0} {...props} />
);

// Composant pour afficher le badge dans le titre de la page (document.title)
export function DocumentTitleBadge({ count, baseTitle = 'ChantierPro' }: { count: number; baseTitle?: string; }) {
  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    
    if (count > 0) {
      document.title = `(${count}) ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }
    
    return () => {
      document.title = baseTitle;
    };
  }, [count, baseTitle]);

  return null;
}
EOF

echo "✅ NotificationBadge créé"

# 3. Modifier QuickActions pour intégrer les notifications
echo "📝 Mise à jour de components/dashboard/QuickActions.tsx..."
cp components/dashboard/QuickActions.tsx components/dashboard/QuickActions.tsx.backup
cat > components/dashboard/QuickActions.tsx << 'EOF'
"use client";

import Link from "next/link";
import NotificationBadge from "@/components/ui/NotificationBadge";
import { useMessages } from "@/hooks/useMessages";

export default function QuickActions() {
  const { totalUnreadCount, loading } = useMessages({
    userId: 'test-client-123',
    pollingInterval: 30000, // 30 secondes
    enableNotifications: true
  });

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
      description: "Chat temps réel",
      icon: "💬",
      href: "/dashboard/messages",
      color: "from-orange-500 to-orange-600",
      notificationCount: totalUnreadCount
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
          Actions Rapides
        </h3>
        {loading && (
          <div style={{ 
            width: '1rem', 
            height: '1rem', 
            border: '2px solid #e2e8f0',
            borderTop: '2px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        )}
      </div>
      
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
                cursor: 'pointer',
                position: 'relative',
                border: action.notificationCount && action.notificationCount > 0 ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Icône avec badge de notification */}
              <NotificationBadge 
                count={action.notificationCount || 0}
                size="sm"
                animate={true}
                variant="red"
              >
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '0.5rem',
                  background: 'linear-gradient(135deg, #3b82f6, #f97316)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  boxShadow: action.notificationCount && action.notificationCount > 0 ? '0 0 0 2px rgba(59, 130, 246, 0.3)' : 'none'
                }}>
                  {action.icon}
                </div>
              </NotificationBadge>
              
              <div style={{ flex: 1 }}>
                <p style={{ 
                  margin: 0, 
                  fontWeight: '500', 
                  color: '#1e293b', 
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  {action.title}
                  {action.notificationCount && action.notificationCount > 0 && (
                    <span style={{
                      color: '#ef4444',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      ({action.notificationCount} nouveaux)
                    </span>
                  )}
                </p>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.75rem' }}>
                  {action.description}
                </p>
              </div>

              {/* Indicateur visuel pour les notifications */}
              {action.notificationCount && action.notificationCount > 0 && (
                <div style={{
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '50%',
                  background: '#ef4444',
                  animation: 'pulse 2s infinite'
                }} />
              )}
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
EOF

echo "✅ QuickActions mis à jour avec notifications"

# 4. Créer le composant DocumentTitleBadge pour le titre de l'onglet
echo "📝 Création de components/layout/DocumentTitleBadge.tsx..."
cat > components/layout/DocumentTitleBadge.tsx << 'EOF'
"use client";

import { useEffect } from 'react';
import { useMessages } from '@/hooks/useMessages';

interface DocumentTitleBadgeProps {
  baseTitle?: string;
  userId?: string;
}

export default function DocumentTitleBadge({ 
  baseTitle = 'ChantierPro',
  userId = 'test-client-123'
}: DocumentTitleBadgeProps) {
  const { totalUnreadCount } = useMessages({ userId, pollingInterval: 60000 }); // 1 minute pour le titre

  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    if (totalUnreadCount > 0) {
      document.title = `(${totalUnreadCount}) ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }
    
    return () => {
      document.title = baseTitle;
    };
  }, [totalUnreadCount, baseTitle]);

  return null;
}
EOF

echo "✅ DocumentTitleBadge créé"

# 5. Créer un composant d'amélioration pour les erreurs d'API
echo "📝 Création de components/ui/ErrorBoundary.tsx..."
cat > components/ui/ErrorBoundary.tsx << 'EOF'
"use client";

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent 
          error={this.state.error} 
          reset={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }

    return this.props.children;
  }
}

// Composant d'erreur par défaut
function DefaultErrorFallback({ error, reset }: { error?: Error; reset: () => void }) {
  return (
    <div className="card" style={{ 
      textAlign: 'center', 
      padding: '3rem', 
      border: '1px solid #fee2e2',
      backgroundColor: '#fef2f2' 
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
      <h2 style={{ color: '#dc2626', marginBottom: '0.5rem' }}>
        Une erreur s'est produite
      </h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
        {error?.message || 'Erreur inconnue'}
      </p>
      <button 
        onClick={reset} 
        className="btn-primary"
        style={{ marginRight: '0.5rem' }}
      >
        🔄 Réessayer
      </button>
      <button 
        onClick={() => window.location.reload()} 
        className="btn-ghost"
        style={{ color: '#64748b', border: '1px solid #e5e7eb' }}
      >
        🔃 Recharger la page
      </button>
    </div>
  );
}

// Hook pour utiliser ErrorBoundary facilement
export function useErrorHandler() {
  return (error: Error, errorInfo?: any) => {
    console.error('Handled error:', error, errorInfo);
    // Vous pouvez ici envoyer l'erreur à un service de monitoring
  };
}
EOF

echo "✅ ErrorBoundary créé"

# 6. Créer un composant Toast pour les notifications
echo "📝 Création de components/ui/Toast.tsx..."
cat > components/ui/Toast.tsx << 'EOF'
"use client";

import React, { useState, useEffect, createContext, useContext } from 'react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toast
    };
    
    setToasts(prev => [...prev, newToast]);

    // Auto-remove après la durée spécifiée
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '400px'
    }}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Entrée avec animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const getToastStyles = () => {
    const baseStyles = {
      padding: '1rem',
      borderRadius: '0.75rem',
      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      transition: 'all 0.3s ease',
      transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
      opacity: isVisible && !isLeaving ? 1 : 0,
      position: 'relative' as const,
      background: 'white',
      border: '1px solid #e5e7eb',
      minWidth: '350px'
    };

    const typeStyles = {
      success: { borderLeftColor: '#10b981', borderLeftWidth: '4px' },
      error: { borderLeftColor: '#ef4444', borderLeftWidth: '4px' },
      warning: { borderLeftColor: '#f59e0b', borderLeftWidth: '4px' },
      info: { borderLeftColor: '#3b82f6', borderLeftWidth: '4px' }
    };

    return { ...baseStyles, ...typeStyles[toast.type] };
  };

  const getIcon = () => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[toast.type];
  };

  const getIconColor = () => {
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };
    return colors[toast.type];
  };

  return (
    <div style={getToastStyles()}>
      <div style={{
        fontSize: '1.25rem',
        color: getIconColor(),
        flexShrink: 0
      }}>
        {getIcon()}
      </div>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{
          margin: 0,
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: toast.message ? '0.25rem' : 0
        }}>
          {toast.title}
        </h4>
        
        {toast.message && (
          <p style={{
            margin: 0,
            fontSize: '0.8125rem',
            color: '#6b7280',
            lineHeight: 1.4
          }}>
            {toast.message}
          </p>
        )}

        {toast.action && (
          <button
            onClick={toast.action.onClick}
            style={{
              marginTop: '0.5rem',
              padding: '0.25rem 0.5rem',
              background: 'transparent',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              color: '#374151',
              fontSize: '0.75rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f9fafb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        onClick={handleClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#9ca3af',
          cursor: 'pointer',
          fontSize: '1rem',
          padding: '0.25rem',
          lineHeight: 1,
          flexShrink: 0
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#6b7280';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#9ca3af';
        }}
      >
        ×
      </button>
    </div>
  );
}

// Fonctions utilitaires pour créer des toasts rapidement
export const showSuccessToast = (addToast: ToastContextType['addToast']) => 
  (title: string, message?: string, action?: Toast['action']) => {
    addToast({ type: 'success', title, message, action });
  };

export const showErrorToast = (addToast: ToastContextType['addToast']) => 
  (title: string, message?: string, action?: Toast['action']) => {
    addToast({ type: 'error', title, message, action, duration: 8000 });
  };

export const showWarningToast = (addToast: ToastContextType['addToast']) => 
  (title: string, message?: string, action?: Toast['action']) => {
    addToast({ type: 'warning', title, message, action, duration: 6000 });
  };

export const showInfoToast = (addToast: ToastContextType['addToast']) => 
  (title: string, message?: string, action?: Toast['action']) => {
    addToast({ type: 'info', title, message, action });
  };
EOF

echo "✅ Toast créé"

# 7. Améliorer les API routes avec gestion d'erreurs
echo "📝 Amélioration de app/api/messages/route.ts..."
cp app/api/messages/route.ts app/api/messages/route.ts.backup
cat > app/api/messages/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Type pour la validation
interface MessageCreateData {
  expediteurId: string;
  message: string;
  chantierId: string;
  photos?: string[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'test-client-123';

    // Tenter de récupérer les vraies données
    let conversations = [];
    
    try {
      const chantiers = await db.chantier.findMany({
        where: {
          OR: [
            { clientId: userId },
            { assignees: { some: { id: userId } } }
          ]
        },
        include: {
          client: {
            select: { id: true, name: true, role: true }
          },
          assignees: {
            select: { id: true, name: true, role: true }
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: {
              expediteur: {
                select: { id: true, name: true, role: true }
              }
            }
          },
          _count: {
            select: {
              messages: {
                where: {
                  lu: false,
                  NOT: { expediteurId: userId }
                }
              }
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });

      conversations = chantiers.map(chantier => ({
        id: chantier.id,
        nom: chantier.nom,
        photo: chantier.photo,
        participants: [chantier.client, ...chantier.assignees],
        lastMessage: chantier.messages[0] ? {
          text: chantier.messages[0].message.substring(0, 100),
          time: chantier.messages[0].createdAt.toISOString(),
          expediteur: chantier.messages[0].expediteur.name
        } : undefined,
        unreadCount: chantier._count.messages,
        updatedAt: chantier.updatedAt.toISOString()
      }));

    } catch (dbError) {
      console.warn('Base de données non disponible, utilisation des données de test');
      
      // Données de simulation si la DB n'est pas disponible
      conversations = [
        {
          id: "1",
          nom: "Rénovation Villa Moderne",
          photo: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
          participants: [
            { id: "client-1", name: "Marie Dubois", role: "CLIENT" },
            { id: "user-1", name: "Pierre Maçon", role: "OUVRIER" }
          ],
          lastMessage: {
            text: "Bonjour Marie, les carrelages que vous avez choisis sont arrivés...",
            time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            expediteur: "Pierre Maçon"
          },
          unreadCount: 3,
          updatedAt: new Date().toISOString()
        },
        {
          id: "2",
          nom: "Extension Maison Familiale",
          participants: [
            { id: "client-2", name: "Jean Moreau", role: "CLIENT" },
            { id: "user-2", name: "Julie Électricienne", role: "OUVRIER" }
          ],
          lastMessage: {
            text: "Installation électrique terminée, tout est aux normes",
            time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            expediteur: "Julie Électricienne"
          },
          unreadCount: 1,
          updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
        }
      ];
    }

    return NextResponse.json({
      conversations,
      success: true,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur API messages GET:', error);
    
    return NextResponse.json({
      error: 'Erreur lors du chargement des conversations',
      details: error instanceof Error ? error.message : 'Erreur inconnue',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: MessageCreateData = await request.json();
    
    // Validation des données
    const required = ['expediteurId', 'message', 'chantierId'];
    const missing = required.filter(field => !data[field as keyof MessageCreateData]);
    
    if (missing.length > 0) {
      return NextResponse.json({
        error: 'Champs manquants',
        details: `Les champs suivants sont requis: ${missing.join(', ')}`,
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    // Validation du contenu
    if (data.message.trim().length === 0) {
      return NextResponse.json({
        error: 'Message vide',
        details: 'Le message ne peut pas être vide',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    if (data.message.length > 5000) {
      return NextResponse.json({
        error: 'Message trop long',
        details: 'Le message ne peut pas dépasser 5000 caractères',
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    let message;
    
    try {
      // Tenter de créer le message en base
      message = await db.message.create({
        data: {
          expediteurId: data.expediteurId,
          message: data.message.trim(),
          chantierId: data.chantierId,
          photos: data.photos || [],
          typeMessage: 'CHANTIER',
          lu: false
        },
        include: {
          expediteur: {
            select: { id: true, name: true, role: true }
          }
        }
      });

      // Mettre à jour la date du chantier
      await db.chantier.update({
        where: { id: data.chantierId },
        data: { updatedAt: new Date() }
      });

    } catch (dbError) {
      console.warn('Base de données non disponible, simulation de la création');
      
      // Simuler la création du message
      message = {
        id: `msg-${Date.now()}`,
        expediteurId: data.expediteurId,
        message: data.message.trim(),
        chantierId: data.chantierId,
        photos: data.photos || [],
        typeMessage: 'CHANTIER',
        lu: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        expediteur: {
          id: data.expediteurId,
          name: 'Utilisateur Test',
          role: 'CLIENT'
        }
      };
    }

    return NextResponse.json({
      message,
      success: true,
      timestamp: new Date().toISOString()
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur API messages POST:', error);
    
    return NextResponse.json({
      error: 'Erreur lors de la création du message',
      details: error instanceof Error ? error.message : 'Erreur inconnue',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
EOF

echo "✅ API messages améliorée"

# 8. Créer le composant widget chat pour les pages chantier
echo "📝 Création de components/messages/ChatWidget.tsx..."
cat > components/messages/ChatWidget.tsx << 'EOF'
"use client";

import { useState, useRef, useEffect } from 'react';
import { useMessages } from '@/hooks/useMessages';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

interface ChatWidgetProps {
  chantierId: string;
  userId?: string;
  minimized?: boolean;
}

export default function ChatWidget({ 
  chantierId, 
  userId = 'test-client-123',
  minimized: initialMinimized = true 
}: ChatWidgetProps) {
  const [isMinimized, setIsMinimized] = useState(initialMinimized);
  const [isVisible, setIsVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    sendMessage,
    setActiveConversation,
    loadingMessages,
    sending,
    error
  } = useMessages({ userId });

  // Charger la conversation du chantier
  useEffect(() => {
    if (chantierId) {
      setActiveConversation(chantierId);
    }
  }, [chantierId, setActiveConversation]);

  // Auto-scroll vers le bas
  useEffect(() => {
    if (!isMinimized && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimized]);

  // Animation d'apparition
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const toggleWidget = () => {
    setIsMinimized(!isMinimized);
  };

  const handleSendMessage = async (text: string, photos: string[]) => {
    const success = await sendMessage(text, photos, chantierId);
    return success;
  };

  if (isMinimized) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 1000,
          cursor: 'pointer'
        }}
        onClick={toggleWidget}
      >
        <div
          style={{
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #f97316)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.5rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s ease',
            animation: 'bounce 2s infinite'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          💬
        </div>
        
        <style jsx>{`
          @keyframes bounce {
            0%, 20%, 53%, 80%, 100% {
              transform: translateY(0);
            }
            40%, 43% {
              transform: translateY(-10px);
            }
            70% {
              transform: translateY(-5px);
            }
            90% {
              transform: translateY(-2px);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '400px',
        height: '500px',
        background: 'white',
        borderRadius: '1rem',
        boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        overflow: 'hidden',
        animation: 'slideUp 0.3s ease-out'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '1rem',
          background: 'linear-gradient(135deg, #3b82f6, #f97316)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
            💬 Chat du chantier
          </h3>
          <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.9 }}>
            Discussion temps réel
          </p>
        </div>
        
        <button
          onClick={toggleWidget}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: 'white',
            borderRadius: '0.375rem',
            width: '2rem',
            height: '2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem'
          }}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        {error && (
          <div
            style={{
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              color: '#dc2626',
              fontSize: '0.875rem',
              textAlign: 'center'
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {loadingMessages ? (
          <div style={{ textAlign: 'center', color: '#64748b' }}>
            <div>⏳</div>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
              Chargement des messages...
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              Aucun message encore.<br />
              Démarrez la conversation !
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              currentUserId={userId}
            />
          ))
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ borderTop: '1px solid #e5e7eb' }}>
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={sending}
          placeholder="Écrivez votre message..."
          compact={true}
        />
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
EOF

echo "✅ ChatWidget créé"

# 9. Mettre à jour le layout principal avec les notifications
echo "📝 Mise à jour de app/layout.tsx..."
cp app/layout.tsx app/layout.tsx.backup
cat > app/layout.tsx << 'EOF'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DocumentTitleBadge from "@/components/layout/DocumentTitleBadge";
import { ToastProvider } from "@/components/ui/Toast";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChantierPro - Gestion de chantiers",
  description: "Application de gestion de chantiers de construction professionnelle",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ErrorBoundary>
          <ToastProvider>
            <DocumentTitleBadge />
            {children}
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
EOF

echo "✅ Layout mis à jour"

# 10. Créer un script de test des notifications
echo "📝 Création du script de test components/test/NotificationTest.tsx..."
mkdir -p components/test
cat > components/test/NotificationTest.tsx << 'EOF'
"use client";

import { useState } from 'react';
import NotificationBadge, { MessagesBadge, TasksBadge, AlertsBadge } from '@/components/ui/NotificationBadge';
import { useToast, showSuccessToast, showErrorToast, showWarningToast, showInfoToast } from '@/components/ui/Toast';
import { useMessages } from '@/hooks/useMessages';

export default function NotificationTest() {
  const [testCount, setTestCount] = useState(5);
  const { addToast } = useToast();
  const { totalUnreadCount, refresh } = useMessages();

  const successToast = showSuccessToast(addToast);
  const errorToast = showErrorToast(addToast);
  const warningToast = showWarningToast(addToast);
  const infoToast = showInfoToast(addToast);

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <h2 style={{ marginBottom: '2rem', color: '#1e293b' }}>
        🧪 Tests des Notifications
      </h2>

      {/* Test des badges */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#374151' }}>Badges de notification</h3>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <NotificationBadge count={testCount} variant="red">
            <div className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
              Messages ({testCount})
            </div>
          </NotificationBadge>

          <MessagesBadge count={totalUnreadCount}>
            <div className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
              Messages réels ({totalUnreadCount})
            </div>
          </MessagesBadge>

          <TasksBadge count={3}>
            <div className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
              Tâches (3)
            </div>
          </TasksBadge>

          <AlertsBadge count={1}>
            <div className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
              Alertes (1)
            </div>
          </AlertsBadge>

          <NotificationBadge count={99} maxCount={50} variant="green" size="lg">
            <div className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
              Large (99+)
            </div>
          </NotificationBadge>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button
            className="btn-primary"
            onClick={() => setTestCount(prev => prev + 1)}
            style={{ marginRight: '0.5rem' }}
          >
            Incrémenter (+1)
          </button>
          <button
            className="btn-ghost"
            onClick={() => setTestCount(Math.max(0, testCount - 1))}
            style={{ marginRight: '0.5rem' }}
          >
            Décrémenter (-1)
          </button>
          <button
            className="btn-ghost"
            onClick={() => setTestCount(0)}
          >
            Reset (0)
          </button>
        </div>
      </section>

      {/* Test des toasts */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#374151' }}>Notifications Toast</h3>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button
            className="btn-primary"
            onClick={() => successToast('Succès', 'Opération réussie !')}
            style={{ marginRight: '0.5rem' }}
          >
            ✅ Succès
          </button>
          <button
            className="btn-error"
            onClick={() => errorToast('Erreur', 'Une erreur s\'est produite.')}
            style={{ marginRight: '0.5rem' }}
          >                                                                                                 
