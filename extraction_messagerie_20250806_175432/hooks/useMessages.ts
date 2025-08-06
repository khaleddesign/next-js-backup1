import { useState, useEffect, useCallback, useRef } from 'react';

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
  pollingInterval = 30000,
  enableNotifications = true
}: UseMessagesProps = {}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const pollingRef = useRef<NodeJS.Timeout>();
  const lastNotificationRef = useRef<number>(0);
  
  const fetchConversations = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`/api/messages?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des conversations');
      }
      
      const data = await response.json();
      setConversations(data.conversations || []);
      
      // Correction: ajouter valeur initiale au reduce
      const unreadTotal = data.conversations?.reduce(
        (total: number, conv: Conversation) => total + conv.unreadCount, 
        0  // ✅ Valeur initiale ajoutée
      ) || 0;
      
      setTotalUnreadCount(unreadTotal);
      
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
      
      await markAsRead(conversationId);
      
    } catch (err) {
      console.error('Erreur fetchMessages:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoadingMessages(false);
    }
  }, []);

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
      
      if (targetConversationId === activeConversationId) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === optimisticMessage.id ? data.message : msg
          )
        );
      }
      
      fetchConversations();
      return true;
      
    } catch (err) {
      console.error('Erreur sendMessage:', err);
      setError(err instanceof Error ? err.message : 'Erreur envoi message');
      
      if (targetConversationId === activeConversationId) {
        setMessages(prev => 
          prev.filter(msg => msg.id === optimisticMessage.id)  // ✅ Correction variable définie
        );
      }
      
      return false;
    } finally {
      setSending(false);
    }
  }, [activeConversationId, userId, fetchConversations]);

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
      
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
      
      setTotalUnreadCount(prev => {
        const currentConv = conversations.find(c => c.id === conversationId);
        return Math.max(0, prev - (currentConv?.unreadCount || 0));
      });
      
    } catch (err) {
      console.error('Erreur markAsRead:', err);
    }
  }, [userId, conversations]);

  const handleNewMessageNotifications = useCallback((convs: Conversation[]) => {
    if (!enableNotifications || !('Notification' in window)) return;
    
    const now = Date.now();
    if (now - lastNotificationRef.current < 5000) return;
    
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

  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) return false;
    
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }, []);

  const setActiveConversation = useCallback((conversationId: string | null) => {
    setActiveConversationId(conversationId);
    if (conversationId) {
      fetchMessages(conversationId);
    } else {
      setMessages([]);
    }
  }, [fetchMessages]);

  const refresh = useCallback(() => {
    fetchConversations();
    if (activeConversationId) {
      fetchMessages(activeConversationId);
    }
  }, [fetchConversations, fetchMessages, activeConversationId]);

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

  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
    }
  }, [activeConversationId, fetchMessages]);

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

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  return {
    conversations,
    messages,
    activeConversationId,
    totalUnreadCount,
    loading,
    loadingMessages,
    sending,
    error,
    sendMessage,
    setActiveConversation,
    markAsRead,
    refresh,
    requestNotificationPermission,
    fetchConversations,
    fetchMessages
  };
}

export function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return false;
    
    if (permission === 'granted') return true;
    if (permission === 'denied') return false;
    
    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  }, [permission]);

  return {
    permission,
    requestPermission,
    isSupported: 'Notification' in window
  };
}
