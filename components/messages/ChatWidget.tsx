"use client";

import { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import UserAvatar from './UserAvatar';
import NotificationBadge from '../layout/NotificationBadge';

interface ChatWidgetProps {
  chantierId: string;
  chantierNom: string;
  currentUserId: string;
  participants: Array<{
    id: string;
    name: string;
    role: string;
  }>;
}

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

export default function ChatWidget({ 
  chantierId, 
  chantierNom, 
  currentUserId,
  participants 
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Messages mock pour demo
  const mockMessages: Message[] = [
    {
      id: "1",
      message: "Salut ! Comment avance le chantier aujourd'hui ?",
      photos: [],
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      lu: true,
      expediteur: { id: "client-1", name: "Marie Dubois", role: "CLIENT" }
    },
    {
      id: "2",
      message: "Tout se passe bien ! Nous avons terminé la démolition. Voici une photo des travaux.",
      photos: ["https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=300&h=200&fit=crop"],
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      lu: true,
      expediteur: { id: "ouvrier-1", name: "Pierre Maçon", role: "OUVRIER" }
    },
    {
      id: "3",
      message: "Super ! Quand pensez-vous commencer l'électricité ?",
      photos: [],
      createdAt: new Date(Date.now() - 900000).toISOString(),
      lu: false,
      expediteur: { id: "client-1", name: "Marie Dubois", role: "CLIENT" }
    }
  ];

  // Charger les messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      // Simulation API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setMessages(mockMessages);
      
      // Calculer les non lus (messages pas de nous et non lus)
      const unread = mockMessages.filter(
        msg => msg.expediteur.id !== currentUserId && !msg.lu
      ).length;
      setUnreadCount(unread);
      
    } catch (error) {
      console.error('Erreur chargement messages widget:', error);
    } finally {
      setLoading(false);
    }
  };

  // Envoyer message
  const sendMessage = async (messageText: string, photos: string[]) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      message: messageText,
      photos,
      createdAt: new Date().toISOString(),
      lu: false,
      expeditexpediteur: {
       id: currentUserId,
       name: 'Marie Dubois', // À adapter selon l'user connecté
       role: 'CLIENT'
     }
   };

   // Ajout optimiste
   setMessages(prev => [...prev, newMessage]);

   try {
     const response = await fetch('/api/messages', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         expediteurId: currentUserId,
         chantierId,
         message: messageText,
         photos
       })
     });

     if (!response.ok) {
       throw new Error('Erreur envoi message');
     }

     console.log('Message envoyé depuis widget');
   } catch (error) {
     console.error('Erreur envoi message widget:', error);
   }
 };

 // Ouvrir/fermer widget
 const toggleWidget = () => {
   setIsOpen(!isOpen);
   if (!isOpen) {
     setNewMessageCount(0);
     setUnreadCount(0);
     fetchMessages();
   }
 };

 // Minimiser/restaurer
 const toggleMinimize = () => {
   setIsMinimized(!isMinimized);
 };

 // Auto-scroll vers le bas
 const scrollToBottom = () => {
   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
 };

 useEffect(() => {
   if (isOpen && messages.length > 0) {
     scrollToBottom();
   }
 }, [messages, isOpen]);

 // Polling pour nouveaux messages (si widget ouvert)
 useEffect(() => {
   if (isOpen) {
     pollingRef.current = setInterval(() => {
       fetchMessages();
     }, 10000); // 10 secondes
   } else {
     if (pollingRef.current) {
       clearInterval(pollingRef.current);
     }
   }

   return () => {
     if (pollingRef.current) {
       clearInterval(pollingRef.current);
     }
   };
 }, [isOpen]);

 // Simuler arrivée de nouveaux messages
 useEffect(() => {
   const simulateNewMessage = () => {
     if (!isOpen && Math.random() > 0.7) { // 30% de chance
       setNewMessageCount(prev => prev + 1);
       setUnreadCount(prev => prev + 1);
     }
   };

   const interval = setInterval(simulateNewMessage, 20000); // Toutes les 20s
   return () => clearInterval(interval);
 }, [isOpen]);

 return (
   <div style={{ 
     position: 'fixed', 
     bottom: '2rem', 
     right: '2rem', 
     zIndex: 1000,
     fontFamily: 'system-ui, -apple-system, sans-serif'
   }}>
     {/* Widget fermé - Bouton flottant */}
     {!isOpen && (
       <button
         onClick={toggleWidget}
         style={{
           width: '4rem',
           height: '4rem',
           borderRadius: '50%',
           background: 'linear-gradient(135deg, #3b82f6, #f97316)',
           border: 'none',
           color: 'white',
           fontSize: '1.5rem',
           cursor: 'pointer',
           boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
           transition: 'all 0.3s ease',
           position: 'relative'
         }}
         onMouseEnter={(e) => {
           e.currentTarget.style.transform = 'scale(1.1)';
           e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.4)';
         }}
         onMouseLeave={(e) => {
           e.currentTarget.style.transform = 'scale(1)';
           e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
         }}
       >
         💬
         
         {(unreadCount > 0 || newMessageCount > 0) && (
           <NotificationBadge
             count={Math.max(unreadCount, newMessageCount)}
             size="sm"
             animate={true}
             position="top-right"
           />
         )}
       </button>
     )}

     {/* Widget ouvert */}
     {isOpen && (
       <div style={{
         width: '350px',
         height: isMinimized ? '60px' : '500px',
         background: 'white',
         borderRadius: '1rem',
         boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
         border: '1px solid #e2e8f0',
         overflow: 'hidden',
         transition: 'height 0.3s ease',
         display: 'flex',
         flexDirection: 'column'
       }}>
         {/* Header */}
         <div style={{
           padding: '1rem',
           background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(249, 115, 22, 0.1))',
           borderBottom: '1px solid #e2e8f0',
           display: 'flex',
           justifyContent: 'space-between',
           alignItems: 'center'
         }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
             <div style={{
               width: '2rem',
               height: '2rem',
               borderRadius: '50%',
               background: 'linear-gradient(135deg, #3b82f6, #f97316)',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               color: 'white',
               fontSize: '1rem'
             }}>
               🏗️
             </div>
             <div>
               <h4 style={{ 
                 margin: 0, 
                 fontSize: '0.875rem', 
                 fontWeight: '600', 
                 color: '#1e293b' 
               }}>
                 {chantierNom}
               </h4>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                 {participants.slice(0, 3).map((participant, index) => (
                   <UserAvatar
                     key={participant.id}
                     user={participant}
                     size="sm"
                     showStatus={true}
                     status={Math.random() > 0.5 ? "online" : "away"}
                   />
                 ))}
                 {participants.length > 3 && (
                   <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                     +{participants.length - 3}
                   </span>
                 )}
               </div>
             </div>
           </div>

           <div style={{ display: 'flex', gap: '0.5rem' }}>
             <button
               onClick={toggleMinimize}
               style={{
                 width: '1.5rem',
                 height: '1.5rem',
                 borderRadius: '50%',
                 border: 'none',
                 background: '#f1f5f9',
                 color: '#64748b',
                 cursor: 'pointer',
                 fontSize: '0.75rem'
               }}
               title={isMinimized ? "Agrandir" : "Minimiser"}
             >
               {isMinimized ? '🔼' : '🔽'}
             </button>
             <button
               onClick={toggleWidget}
               style={{
                 width: '1.5rem',
                 height: '1.5rem',
                 borderRadius: '50%',
                 border: 'none',
                 background: '#fee2e2',
                 color: '#dc2626',
                 cursor: 'pointer',
                 fontSize: '0.75rem'
               }}
               title="Fermer"
             >
               ✕
             </button>
           </div>
         </div>

         {!isMinimized && (
           <>
             {/* Messages */}
             <div style={{
               flex: 1,
               overflowY: 'auto',
               padding: '1rem',
               background: '#f8fafc'
             }}>
               {loading ? (
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
                   <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
                     Chargement...
                   </p>
                 </div>
               ) : messages.length === 0 ? (
                 <div style={{ textAlign: 'center', padding: '2rem' }}>
                   <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💬</div>
                   <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
                     Aucun message
                   </p>
                 </div>
               ) : (
                 messages.map((message, index) => {
                   const isOwn = message.expediteur.id === currentUserId;
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
                       currentUserId={currentUserId}
                     />
                   );
                 })
               )}
               <div ref={messagesEndRef} />
             </div>

             {/* Input */}
             <div style={{ padding: '1rem', background: 'white' }}>
               <MessageInput
                 onSendMessage={sendMessage}
                 placeholder="Message rapide..."
                 showUpload={false}
               />
             </div>
           </>
         )}
       </div>
     )}

     <style jsx>{`
       @keyframes spin {
         0% { transform: rotate(0deg); }
         100% { transform: rotate(360deg); }
       }
     `}</style>
   </div>
 );
}
