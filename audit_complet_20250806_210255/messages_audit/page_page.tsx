--- app/dashboard/messages/page.tsx ---
"use client";

import { useState } from "react";
import { useMessages } from "@/hooks/useMessages";

export default function MessagesPage() {
 const [searchTerm, setSearchTerm] = useState("");
 const [filter, setFilter] = useState("all");
 const [newMessage, setNewMessage] = useState("");
 
 const { 
   conversations, 
   messages, 
   activeConversationId,
   totalUnreadCount,
   loading, 
   loadingMessages,
   sending,
   error,
   sendMessage,
   setActiveConversation
 } = useMessages({
   userId: 'test-client-123',
   pollingInterval: 30000,
   enableNotifications: true
 });

 const handleSendMessage = async () => {
   if (!newMessage.trim() || !activeConversationId) return;
   
   const success = await sendMessage(newMessage.trim(), [], activeConversationId);
   if (success) {
     setNewMessage("");
   }
 };

 const filteredConversations = conversations.filter(conv => {
   const matchesSearch = conv.nom.toLowerCase().includes(searchTerm.toLowerCase());
   const matchesFilter = filter === 'all' || (filter === 'unread' && conv.unreadCount > 0);
   return matchesSearch && matchesFilter;
 });

 if (loading) {
   return (
     <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
       <div style={{ textAlign: 'center' }}>
         <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
         <p style={{ color: '#64748b' }}>Chargement des conversations...</p>
       </div>
     </div>
   );
 }

 return (
   <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
     <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
       <div style={{ marginBottom: '2rem' }}>
         <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: '0 0 0.5rem 0' }}>
           💬 Messages
         </h1>
         <p style={{ color: '#64748b', margin: 0 }}>
           {totalUnreadCount > 0 ? `${totalUnreadCount} message${totalUnreadCount > 1 ? 's' : ''} non lu${totalUnreadCount > 1 ? 's' : ''}` : 'Toutes vos conversations'}
         </p>
       </div>

       <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem', height: '70vh' }}>
         <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
           <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
             <input
               type="text"
               placeholder="Rechercher une conversation..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               style={{
                 width: '100%',
                 padding: '0.75rem',
                 border: '1px solid #e2e8f0',
                 borderRadius: '0.5rem',
                 fontSize: '0.875rem',
                 marginBottom: '1rem'
               }}
             />
             
             <div style={{ display: 'flex', gap: '0.5rem' }}>
               <button
                 onClick={() => setFilter('all')}
                 className={filter === 'all' ? 'btn-primary' : 'btn-ghost'}
                 style={{ fontSize: '0.75rem', padding: '0.5rem' }}
               >
                 Toutes
               </button>
               <button
                 onClick={() => setFilter('unread')}
                 className={filter === 'unread' ? 'btn-primary' : 'btn-ghost'}
                 style={{ fontSize: '0.75rem', padding: '0.5rem' }}
               >
                 Non lues
               </button>
             </div>
           </div>

           <div style={{ flex: 1, overflowY: 'auto' }}>
             {filteredConversations.length === 0 ? (
               <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                 <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
                 <p>Aucune conversation</p>
               </div>
             ) : (
               filteredConversations.map((conv) => (
                 <div
                   key={conv.id}
                   onClick={() => setActiveConversation(conv.id)}
                   style={{
                     padding: '1rem',
                     borderBottom: '1px solid #f1f5f9',
                     cursor: 'pointer',
                     background: activeConversationId === conv.id ? '#f0f9ff' : 'transparent',
                     transition: 'all 0.2s ease'
                   }}
                   onMouseEnter={(e) => {
                     if (activeConversationId !== conv.id) {
                       e.currentTarget.style.backgroundColor = '#f8fafc';
                     }
                   }}
                   onMouseLeave={(e) => {
                     if (activeConversationId !== conv.id) {
                       e.currentTarget.style.backgroundColor = 'transparent';
                     }
                   }}
                 >
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                     <div style={{
                       width: '2.5rem',
                       height: '2.5rem',
                       borderRadius: '50%',
                       background: 'linear-gradient(135deg, #3b82f6, #f97316)',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       color: 'white',
                       fontSize: '1rem',
                       fontWeight: 'bold',
                       flexShrink: 0
                     }}>
                       🏗️
                     </div>
                     
                     <div style={{ flex: 1, minWidth: 0 }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <h3 style={{ 
                           margin: 0, 
                           fontSize: '0.875rem', 
                           fontWeight: '600', 
                           color: '#1e293b',
                           overflow: 'hidden',
                           textOverflow: 'ellipsis',
                           whiteSpace: 'nowrap'
                         }}>
                           {conv.nom}
                         </h3>
                         {conv.unreadCount > 0 && (
                           <span style={{
                             background: '#ef4444',
                             color: 'white',
                             fontSize: '0.625rem',
                             fontWeight: 'bold',
                             padding: '0.125rem 0.375rem',
                             borderRadius: '0.75rem',
                             minWidth: '1rem',
                             height: '1rem',
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center'
                           }}>
                             {conv.unreadCount}
                           </span>
                         )}
                       </div>
                       
                       {conv.lastMessage && (
                         <p style={{ 
                           margin: '0.25rem 0 0 0', 
                           fontSize: '0.75rem', 
                           color: '#64748b',
                           overflow: 'hidden',
                           textOverflow: 'ellipsis',
                           whiteSpace: 'nowrap'
                         }}>
                           {conv.lastMessage.text}
                         </p>
                       )}
                     </div>
                   </div>
                 </div>
               ))
             )}
           </div>
         </div>

         <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
           {!activeConversationId ? (
             <div style={{ 
               flex: 1, 
               display: 'flex', 
               alignItems: 'center', 
               justifyContent: 'center',
               textAlign: 'center',
               color: '#64748b'
             }}>
               <div>
                 <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
                 <h3 style={{ margin: '0 0 0.5rem 0' }}>Sélectionnez une conversation</h3>
                 <p style={{ margin: 0 }}>Choisissez une conversation pour commencer à discuter</p>
               </div>
             </div>
           ) : (
             <>
               <div style={{ 
                 padding: '1rem', 
                 borderBottom: '1px solid #e2e8f0',
                 background: '#f8fafc'
               }}>
                 <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#1e293b' }}>
                   {conversations.find(c => c.id === activeConversationId)?.nom || 'Conversation'}
                 </h3>
               </div>

               <div style={{ 
                 flex: 1, 
                 overflowY: 'auto', 
                 padding: '1rem',
                 display: 'flex',
                 flexDirection: 'column',
                 gap: '1rem'
               }}>
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
                       Aucun message dans cette conversation
                     </p>
                   </div>
                 ) : (
                   messages.map((message) => (
                     <div key={message.id} style={{ 
                       display: 'flex', 
                       alignItems: 'flex-start', 
                       gap: '0.75rem',
                       alignSelf: message.expediteur.id === 'test-client-123' ? 'flex-end' : 'flex-start',
                       maxWidth: '80%'
                     }}>
                       {message.expediteur.id !== 'test-client-123' && (
                         <div style={{
                           width: '2rem',
                           height: '2rem',
                           borderRadius: '50%',
                           background: 'linear-gradient(135deg, #3b82f6, #f97316)',
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           color: 'white',
                           fontSize: '0.75rem',
                           fontWeight: 'bold',
                           flexShrink: 0
                         }}>
                           {message.expediteur.name.charAt(0)}
                         </div>
                       )}
                       
                       <div style={{
                         background: message.expediteur.id === 'test-client-123' 
                           ? 'linear-gradient(135deg, #3b82f6, #f97316)' 
                           : 'white',
                         color: message.expediteur.id === 'test-client-123' ? 'white' : '#1e293b',
                         padding: '0.75rem',
                         borderRadius: '1rem',
                         border: message.expediteur.id === 'test-client-123' ? 'none' : '1px solid #e5e7eb',
                         wordWrap: 'break-word'
                       }}>
                         <p style={{ margin: 0, fontSize: '0.875rem' }}>
                           {message.message}
                         </p>
                         <p style={{ 
                           margin: '0.25rem 0 0 0', 
                           fontSize: '0.75rem', 
                           opacity: 0.7 
                         }}>
                           {new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                             hour: '2-digit',
                             minute: '2-digit'
                           })}
                         </p>
                       </div>
                     </div>
                   ))
                 )}
               </div>

               <div style={{ 
                 padding: '1rem', 
                 borderTop: '1px solid #e2e8f0',
                 background: '#f8fafc'
               }}>
                 {error && (
                   <div style={{
                     background: '#fee2e2',
                     color: '#dc2626',
                     padding: '0.5rem',
                     borderRadius: '0.5rem',
                     fontSize: '0.875rem',
                     marginBottom: '0.5rem'
                   }}>
                     ⚠️ {error}
                   </div>
                 )}
                 
                 <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                   <textarea
                     value={newMessage}
                     onChange={(e) => setNewMessage(e.target.value)}
                     placeholder="Écrivez votre message..."
                     style={{
                       flex: 1,
                       minHeight: '60px',
                       maxHeight: '120px',
                       padding: '0.75rem',
                       border: '1px solid #e2e8f0',
                       borderRadius: '0.5rem',
                       resize: 'vertical',
                       fontFamily: 'inherit',
                       fontSize: '0.875rem'
                     }}
                     onKeyDown={(e) => {
                       if (e.key === 'Enter' && e.ctrlKey) {
                         handleSendMessage();
                       }
                     }}
                   />
                   <button
                     onClick={handleSendMessage}
                     disabled={!newMessage.trim() || sending}
                     className="btn-primary"
                     style={{
                       opacity: !newMessage.trim() || sending ? 0.5 : 1,
                       cursor: !newMessage.trim() || sending ? 'not-allowed' : 'pointer',
                       minWidth: '80px'
                     }}
                   >
                     {sending ? '⏳' : '📤 Envoyer'}
                   </button>
                 </div>
                 
                 <p style={{ 
                   margin: '0.5rem 0 0 0', 
                   fontSize: '0.75rem', 
                   color: '#64748b' 
                 }}>
                   Appuyez sur Ctrl+Entrée pour envoyer rapidement
                 </p>
               </div>
             </>
           )}
         </div>
       </div>
     </div>
   </div>
 );
}
