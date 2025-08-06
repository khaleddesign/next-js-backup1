// hooks/useMessages.ts - Template de démarrage
import { useState, useEffect, useCallback } from 'react';

export interface Message {
  id: string;
  expediteurId: string;
  destinataireId?: string;
  chantierId?: string;
  message: string;
  photos: string[];
  files: string[];
  typeMessage: 'DIRECT' | 'CHANTIER' | 'GROUPE';
  parentId?: string;
  lu: boolean;
  createdAt: string;
  updatedAt: string;
  expediteur: {
    id: string;
    nom: string;
    email: string;
    avatar?: string;
  };
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  type: 'DIRECT' | 'CHANTIER' | 'GROUPE';
  chantierId?: string;
  updatedAt: string;
}

export const useMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Polling toutes les 30s
  useEffect(() => {
    const fetchConversations = async () => {
      // TODO: Implémenter fetch API
    };

    fetchConversations();
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = useCallback(async (data: any) => {
    setSending(true);
    try {
      // TODO: Implémenter envoi
    } finally {
      setSending(false);
    }
  }, []);

  return {
    conversations,
    messages,
    activeConversation,
    setActiveConversation,
    sendMessage,
    loading,
    sending
  };
};
