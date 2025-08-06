"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ConversationList from "@/components/messages/ConversationList";
import MessageBubble from "@/components/messages/MessageBubble";
import MessageInput from "@/components/messages/MessageInput";
import UserAvatar from "@/components/messages/UserAvatar";
import TypingIndicator from "@/components/messages/TypingIndicator";
import ToastNotification from "@/components/layout/ToastNotification";
import { useMessages } from "@/hooks/useMessages";
import { useToasts } from "@/hooks/useToasts";
import { useNotificationPermission } from "@/hooks/useMessages";

interface Message {
  id: string;
  message: string;
  photos: string[];
  createdAt: string;
  lu: boolean;
  expediteur: {
    id: string;
    name: string;
    role: string;
  };
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Array<{ id: string; name: string }>>([]);
  
  const [currentUser] = useState({
    id: 'test-client-123',
    name: 'Marie Dubois',
    role: 'CLIENT'
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Hooks
  const { 
    conversations, 
    loading: loadingConversations, 
    error, 
    unreadCount, 
    markAsRead,
    sendMessage: sendMessageHook
  } = useMessages(currentUser.id);
  
  const { toasts, dismissToast, success, error: errorToast, info } = useToasts();
  const { permission, requestPermission, showNotification } = useNotificationPermission();

  // Messages mock par conversation
  const mockMessages: Record<string, Message[]> = {
    "1": [
      {
        id: "1",
        message: "Bonjour ! Le chantier peut-il commencer comme prévu lundi ?",
        photos: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        lu: true,
        expediteur: { id: "client-1", name: "Marie Dubois", role: "CLIENT" }
      },
      {
        id: "2", 
        message: "Oui parfaitement ! Nous serons là à 8h. Voici une photo des matériaux qui sont arrivés.",
        photos: ["https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=300&h=200&fit=crop"],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        lu: true,
        expediteur: { id: "ouvrier-1", name: "Pierre Maçon", role: "OUVRIER" }
      },
      {
        id: "3",
        message: "Parfait ! Merci pour la photo. Vous avez pensé à la protection du parquet ?",
        photos: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
        lu: true,
        expediteur: { id: "client-1", name: "Marie Dubois", role: "CLIENT" }
      },
      {
        id: "4",
        message: "Bien sûr ! Tout sera protégé. Les carrelages sont arrivés !",
        photos: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        lu: false,
        expediteur: { id: "ouvrier-1", name: "Pierre Maçon", role: "OUVRIER" }
      }
    ],
    "2": [
      {
        id: "5",
        message: "Bonjour Sophie, pouvez-vous passer vendredi ?",
        photos: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        lu: true,
        expediteur: { id: "client-2", name: "Pierre Martin", role: "CLIENT" }
      },
      {
        id: "6",
        message: "Rendez-vous confirmé pour vendredi à 14h.",
        photos: [],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        lu: true,
        expediteur: { id: "ouvrier-2", name: "Sophie Électricienne", role: "OUVRIER" }
      }
    ]
  };

  // Charger les messages d'une conversation
  const fetchMessages = async (conversationId: string) => {
    try {
      setLoadingMessages(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setMessages(mockMessages[conversationId] || []);
      await markAsRead(conversationId);
      
    } catch (error) {
      console.error('Erreur chargement messages:', error);
      errorToast('Erreur', 'Impossible de charger les messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  // Envoyer un message
  const sendMessage = async (messageText: string, photos: string[]) => {
    if (!activeConversationId) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      message: messageText,
      photos,
      createdAt: new Date().toISOString(),
      lu: false,
      expediteur: currentUser
    };

    // Optimistic update
    setMessages(prev => [...prev, newMessage]);

    try {
      const success = await sendMessageHook(activeConversationId, messageText, photos);
      
      if (success) {
        success('Message envoyé', 'Votre message a été livré');
        
        // Notification navigateur
        if (permission === 'granted') {
          showNotification('Message envoyé', {
            body: `Dans ${activeConversation?.nom}`,
            tag: 'message-sent'
          });
        }
      } else {
        throw new Error('Échec envoi');
      }
    } catch (error) {
      console.error('Erreur envoi:', error);
      errorToast('Erreur envoi', 'Le message n\'a pas pu être envoyé');
      
      // Retirer le message optimiste
      setMessages(prev => prev.filter(m => m.id !== newMessage.id));
    }
  };

  // Gérer l'indicateur "en train d'écrire"
  const handleTyping = (isTyping: boolean) => {
    if (isTyping) {
      // Simuler que d'autres utilisateurs voient qu'on écrit
      console.log('User is typing...');
    } else {
      console.log('User stopped typing');
    }
  };

  // Simuler des utilisateurs en train d'écrire
  useEffect(() => {
    if (activeConversationId === "1") {
      const interval = setInterval(() => {
        if (Math.random() > 0.8) { // 20% de chance
          setTypingUsers([{ id: "ouvrier-1", name: "Pierre Maçon" }]);
          setTimeout(() => setTypingUsers([]), 3000);
        }
      }, 10000);
      
      return () => clearInterval(interval);
    } else {
      setTypingUsers([]);
    }
  }, [activeConversationId]);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
    }
  }, [activeConversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Demander permission notifications
  useEffect(() => {
    if (permission === 'default') {
      info('Notifications', 'Autorisez les notifications pour être alerté des nouveaux messages', {
        action: {
          label: 'Autoriser',
          onClick: () => requestPermission()
        },
        duration: 8000
      });
    }
  }, [permission, info, requestPermission]);

  // Gérer les erreurs de connexion
  useEffect(() => {
    if (error) {
      errorToast('Erreur de connexion', error, {
        action: {
          label: 'Réessayer',
          onClick: () => window.location.reload()
        }
      });
    }
  }, [error, errorToast]);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ height: '100vh', maxWidth: '1400px', margin: '0 auto', padding: '2rem', paddingBottom: 0 }}>
        {/* Breadcrumb avec indicateur de connexion */}
        <nav style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
            <Link href="/dashboard" style={{ color: '#3b82f6', textDecoration: 'none' }}>
              Dashboard
            </Link>
            <span>›</span>
            <span style={{ color: '#1e293b', fontWeight: '500' }}>Messages</span>
            
            {/* Indicateur de statut */}
            <div style={{ 
              marginLeft: 'auto', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem' 
            }}>
              {error ? (
                <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>
                  🔴 Hors ligne
                </div>
              ) : (
                <div style={{ color: '#10b981', fontSize: '0.75rem' }}>
                  🟢 En ligne
                </div>
              )}
              
              {unreadCount.total > 0 && (
                <div style={{ 
                  background: '#ef4444',
                  color: 'white',
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '1rem'
                }}>
                  {unreadCount.total} nouveaux
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Layout principal */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '350px 1fr',
          gap: '1.5rem',
          height: 'calc(100vh - 140px)',
          maxHeight: '800px'
        }}>
          {/* Liste conversations */}
          <ConversationList
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
            loading={loadingConversations}
          />

          {/* Zone chat */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            {activeConversation ? (
              <>
                {/* Header chat */}
                <div style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid #e2e8f0',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(249, 115, 22, 0.05))'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '0.75rem',
                      background: 'linear-gradient(135deg, #3b82f6, #f97316)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.5rem'
                    }}>
                      🏗️
                    </div>

                    <div style={{ flex: 1 }}>
                      <h2 style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: '600', 
                        color: '#1e293b', 
                        margin: '0 0 0.25rem 0'
                      }}>
                        {activeConversation.nom}
                      </h2>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {activeConversation.participants.slice(0, 3).map((participant) => (
                          <UserAvatar
                            key={participant.id}
                            user={participant}
                            size="sm"
                            showStatus={true}
                            status="online"
                          />
                        ))}
                        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                          {activeConversation.participants.length} participants
                        </span>
                        
                        {typingUsers.length > 0 && (
                          <span style={{ 
                            color: '#3b82f6', 
                            fontSize: '0.75rem',
                            fontStyle: 'italic' 
                          }}>
                            • {typingUsers[0].name} écrit...
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link
                        href={`/dashboard/chantiers/${activeConversation.id}`}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '0.5rem',
                          background: 'rgba(59, 130, 246, 0.1)',
                          color: '#3b82f6',
                          textDecoration: 'none'
                        }}
                        title="Voir le chantier"
                      >
                        🏗️
                      </Link>
                      <button
                        style={{
                          padding: '0.5rem',
                          borderRadius: '0.5rem',
                          background: 'rgba(249, 115, 22, 0.1)',
                          color: '#f97316',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                        title="Appel vidéo"
                        onClick={() => info('Appel vidéo', 'Fonctionnalité à venir...')}
                      >
                        📹
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '1.5rem',
                  background: '#f8fafc'
                }}>
                  {loadingMessages ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                      <div style={{ 
                        width: '2rem', 
                        height: '2rem', 
                        border: '2px solid #e2e8f0',
                        borderTop: '2px solid #3b82f6',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                      }} />
                      <p style={{ color: '#64748b' }}>Chargement...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
                      <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>
                        Commencez la conversation
                      </h3>
                      <p style={{ color: '#64748b', margin: 0 }}>
                        Premier message pour ce chantier
                      </p>
                    </div>
                  ) : (
                    <>
                      {messages.map((message, index) => {
                        const isOwn = message.expediteur.id === currentUser.id;
                        const showAvatar = !isOwn && (
                          index === 0 || 
                          messages[index - 1]?.expediteur.id !== message.expediteur.id
                        );
                        
                        return (
                          <MessageBubble
                            key={message.id}
                            message={message}
                            isOwn={isOwn}
                            showAvatar={showAvatar}
                            currentUserId={currentUser.id}
                          />
                        );
                      })}
                      
                      {/* Indicateur "en train d'écrire" */}
                      <TypingIndicator
                        users={typingUsers}
                        visible={typingUsers.length > 0}
                      />
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input amélioré */}
                <div style={{ padding: '1.5rem', background: 'white' }}>
                  <MessageInput
                    onSendMessage={sendMessage}
                    placeholder={`Message pour ${activeConversation.nom}...`}
                    conversationId={activeConversationId}
                    onTyping={handleTyping}
                    showUpload={true}
                  />
                </div>
              </>
            ) : (
              /* État vide amélioré */
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '6rem',
                  height: '6rem',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #f97316)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  marginBottom: '2rem'
                }}>
                  💬
                </div>
                
                <h2 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '600', 
                  color: '#1e293b', 
                  marginBottom: '1rem' 
                }}>
                  Sélectionnez une conversation
                </h2>
                
                <p style={{ 
                  color: '#64748b', 
                  marginBottom: '2rem',
                  maxWidth: '400px'
                }}>
                  Choisissez un chantier pour commencer à échanger avec votre équipe
                </p>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Link href="/dashboard/chantiers" className="btn-primary">
                    🏗️ Voir les chantiers
                  </Link>
                  <button 
                    onClick={() => requestPermission()}
                    className="btn-ghost"
                    style={{ 
                      background: 'transparent',
                      border: '1px solid #e2e8f0',
                      color: '#64748b'
                    }}
                  >
                    🔔 Activer notifications
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications Toast */}
      <ToastNotification
        toasts={toasts}
        onDismiss={dismissToast}
      />

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
