"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

interface UnreadCount {
  total: number;
  byConversation: Record<string, number>;
}

interface Conversation {
  id: string;
  nom: string;
  unreadCount: number;
  lastMessage?: {
    message: string;
    createdAt: string;
    expediteur: { name: string };
  };
}

interface UseMessagesReturn {
  unreadCount: UnreadCount;
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  markAsRead: (conversationId: string) => void;
  incrementUnread: (conversationId: string) => void;
  refetch: () => Promise<void>;
  sendMessage: (conversationId: string, message: string, photos?: string[]) => Promise<boolean>;
}

export function useMessages(userId: string = 'test-client-123'): UseMessagesReturn {
  const [unreadCount, setUnreadCount] = useState<UnreadCount>({
    total: 0,
    byConversation: {}
  });
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch conversations avec gestion d'erreurs robuste
  const fetchConversations = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`/api/messages?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const { conversations: fetchedConversations } = data;
      setConversations(fetchedConversations || []);

      // Calculer les non lus
      const totalUnread = fetchedConversations.reduce((acc: number, conv: any) => acc + (conv.unreadCount || 0), 0);
      const byConversation: Record<string, number> = {};
      fetchedConversations.forEach((conv: any) => {
        byConversation[conv.id] = conv.unreadCount || 0;
      });

      setUnreadCount({
        total: totalUnread,
        byConversation
      });

    } catch (err) {
      console.error('Erreur chargement conversations:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      
      // Fallback vers données mock en cas d'erreur
      const mockConversations = [
        {
          id: "1",
          nom: "Rénovation Villa Moderne",
          unreadCount: 2,
          lastMessage: {
            message: "Les carrelages sont arrivés !",
            createdAt: new Date().toISOString(),
            expediteur: { name: "Pierre Maçon" }
          }
        },
        {
          id: "2", 
          nom: "Construction Écologique",
          unreadCount: 1,
          lastMessage: {
            message: "RDV confirmé vendredi",
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            expediteur: { name: "Sophie Élec" }
          }
        }
      ];
      
      setConversations(mockConversations);
      setUnreadCount({
        total: 3,
        byConversation: { "1": 2, "2": 1 }
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Marquer comme lu
  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      // Optimistic update
      const currentUnread = unreadCount.byConversation[conversationId] || 0;
      setUnreadCount(prev => ({
        total: Math.max(0, prev.total - currentUnread),
        byConversation: {
          ...prev.byConversation,
          [conversationId]: 0
        }
      }));

      // API call
      await fetch('/api/messages/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chantierId: conversationId, userId })
      });

    } catch (err) {
      console.error('Erreur marquer lu:', err);
      // Revert optimistic update en cas d'erreur
      fetchConversations();
    }
  }, [unreadCount.byConversation, userId, fetchConversations]);

  // Incrémenter non lus (pour nouveau message reçu)
  const incrementUnread = useCallback((conversationId: string) => {
    setUnreadCount(prev => ({
      total: prev.total + 1,
      byConversation: {
        ...prev.byConversation,
        [conversationId]: (prev.byConversation[conversationId] || 0) + 1
      }
    }));
  }, []);

  // Envoyer message
  const sendMessage = useCallback(async (
    conversationId: string, 
    message: string, 
    photos: string[] = []
  ): Promise<boolean> => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expediteurId: userId,
          chantierId: conversationId,
          message,
          photos
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur envoi message');
      }

      // Refresh conversations pour mettre à jour lastMessage
      await fetchConversations();
      return true;

    } catch (err) {
      console.error('Erreur envoi message:', err);
      setError(err instanceof Error ? err.message : 'Erreur envoi message');
      return false;
    }
  }, [userId, fetchConversations]);

  // Polling pour nouveaux messages (toutes les 15 secondes)
  useEffect(() => {
    fetchConversations();

    // Setup polling
    pollingRef.current = setInterval(() => {
      fetchConversations();
    }, 15000); // 15 secondes

    // Cleanup
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [fetchConversations]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  return {
    unreadCount,
    conversations,
    loading,
    error,
    markAsRead,
    incrementUnread,
    refetch: fetchConversations,
    sendMessage
  };
}

// Hook pour notifications navigateur
export function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }
    return 'denied';
  }, []);

  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (permission === 'granted' && 'Notification' in window) {
      return new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });
    }
    return null;
  }, [permission]);

  return { permission, requestPermission, showNotification };
}
