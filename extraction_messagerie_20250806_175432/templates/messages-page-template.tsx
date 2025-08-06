// app/dashboard/messages/page.tsx - Template
'use client';

import React from 'react';
import { useMessages } from '@/hooks/useMessages';

export default function MessagesPage() {
  const {
    conversations,
    messages,
    activeConversation,
    setActiveConversation,
    sendMessage,
    loading
  } = useMessages();

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="messages-container">
      <div className="messages-layout">
        {/* Sidebar conversations */}
        <aside className="conversations-sidebar glass">
          <div className="sidebar-header">
            <h2>Messages</h2>
            <button className="btn-primary">
              Nouveau
            </button>
          </div>
          {/* TODO: ConversationList */}
        </aside>

        {/* Zone chat principal */}
        <main className="chat-main">
          {activeConversation ? (
            <>
              {/* Header conversation */}
              <header className="chat-header glass">
                {/* TODO: Info conversation */}
              </header>

              {/* Messages */}
              <div className="messages-area">
                {/* TODO: Liste messages */}
              </div>

              {/* Input message */}
              <footer className="message-input-area">
                {/* TODO: MessageInput */}
              </footer>
            </>
          ) : (
            <div className="no-conversation">
              <p>Sélectionnez une conversation</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
