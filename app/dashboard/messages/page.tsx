"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMessages } from "@/hooks/useMessages";
import { Search, Plus, Phone, Video, MoreVertical, Paperclip, Smile, Send, Check, CheckCheck, Users, Settings, X } from 'lucide-react';

export default function ModernMessagesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [messageText, setMessageText] = useState("");
  const [showNewConversation, setShowNewConversation] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    conversations,
    messages,
    contacts,
    activeConversationId,
    totalUnreadCount,
    loading,
    loadingMessages,
    sending,
    error,
    sendMessage,
    setActiveConversation,
    createNewConversation
  } = useMessages();

  const sendMessageHandler = async () => {
    if (!messageText.trim() || !activeConversationId) return;
    
    console.log('Envoi message:', messageText, 'vers conversation:', activeConversationId);
    
    const success = await sendMessage(messageText, activeConversationId);
    if (success) {
      setMessageText("");
      console.log('Message envoyé avec succès');
    } else {
      console.error('Échec envoi message');
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.nom && conv.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const createNewConversationHandler = (userId: string) => {
    createNewConversation(userId);
    setShowNewConversation(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              💬 Messages
            </h1>
            <p className="text-sm text-gray-600">
              Connecté en tant que <span className="font-medium">{user.name}</span> 
              <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {user.role}
              </span>
            </p>
            {loading && <p className="text-xs text-gray-500">Chargement des conversations...</p>}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewConversation(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Nouvelle conversation
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher une conversation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p>Chargement...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-2">💬</div>
                <p>Aucune conversation</p>
                <p className="text-xs mt-1">Conversations trouvées: {conversations.length}</p>
              </div>
            ) : (
              <>
                <div className="p-2 text-xs text-gray-500 border-b">
                  {filteredConversations.length} conversation(s)
                </div>
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => {
                      console.log('Sélection conversation:', conv.id, conv.nom);
                      setActiveConversation(conv.id);
                    }}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      activeConversationId === conv.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                          {conv.nom ? conv.nom.charAt(0) : '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div>
                            <h3 className="font-medium text-gray-900 truncate">{conv.nom || 'Sans nom'}</h3>
                            {conv.metadata && (
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  conv.metadata.statut === 'EN_COURS' ? 'bg-green-100 text-green-800' :
                                  conv.metadata.statut === 'PLANIFIE' ? 'bg-blue-100 text-blue-800' :
                                  conv.metadata.statut === 'TERMINE' ? 'bg-gray-100 text-gray-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {conv.metadata.statut}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {conv.metadata.progression}%
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">ID: {conv.id}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-gray-500">
                          {conv.lastMessage?.time ? new Date(conv.lastMessage.time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage?.text || 'Aucun message'}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {!activeConversationId ? (
            <div className="flex-1 flex items-center justify-center text-center text-gray-500">
              <div>
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-medium mb-2">Sélectionnez une conversation</h3>
                <p>Choisissez une conversation pour commencer à discuter</p>
                <p className="text-xs mt-2">Total conversations: {conversations.length}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      {conversations.find(c => c.id === activeConversationId)?.nom?.charAt(0) || '💬'}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {conversations.find(c => c.id === activeConversationId)?.nom || `Conversation ${activeConversationId}`}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {loadingMessages ? 'Chargement...' : `${messages.length} message(s)`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loadingMessages ? (
                  <div className="text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p>Chargement des messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-2">💬</div>
                    <p>Aucun message dans cette conversation</p>
                    <p className="text-xs mt-1">Conversation ID: {activeConversationId}</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === user.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        {message.senderId !== user.id && (
                          <p className="text-xs font-medium mb-1 opacity-70">
                            {message.senderName} ({message.senderId})
                          </p>
                        )}
                        <p>{message.content}</p>
                        <div className={`flex items-center justify-between mt-1 text-xs ${
                          message.senderId === user.id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          <span>{message.timestamp}</span>
                          <span className="ml-2 text-xs opacity-60">ID: {message.id.slice(-4)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="bg-white border-t border-gray-200 px-6 py-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4">
                    ⚠️ {error}
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessageHandler()}
                      placeholder={`Tapez votre message pour: ${conversations.find(c => c.id === activeConversationId)?.nom || activeConversationId}`}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={sendMessageHandler}
                    disabled={!messageText.trim() || sending}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {sending ? 'Envoi...' : 'Envoyer'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showNewConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Nouvelle conversation</h3>
              <button
                onClick={() => setShowNewConversation(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-2">
              {contacts && contacts.length > 0 ? (
                contacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => createNewConversationHandler(contact.id)}
                    className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        <p className="text-sm text-gray-500">{contact.role}</p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Aucun contact disponible</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
