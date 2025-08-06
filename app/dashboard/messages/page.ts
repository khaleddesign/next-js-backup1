"use client";

// ... (garder toutes les imports et interfaces existantes)

export default function MessagesPage() {
  // ... (garder tous les états existants)
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ... (garder toute la logique existante)

  // Détection mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setShowSidebar(false); // Fermer sidebar sur mobile par défaut
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Fermer sidebar quand on sélectionne une conversation sur mobile
  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ 
        height: '100vh', 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: isMobile ? '1rem' : '2rem',
        paddingBottom: 0 
      }}>
        {/* Breadcrumb modifié pour mobile */}
        <nav style={{ marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            color: '#64748b', 
            fontSize: '0.875rem',
            flexWrap: 'wrap'
          }}>
            {isMobile && activeConversation && (
              <button
                onClick={() => setActiveConversationId(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  marginRight: '0.5rem'
                }}
              >
                ←
              </button>
            )}
            
            <Link href="/dashboard" style={{ color: '#3b82f6', textDecoration: 'none' }}>
              Dashboard
            </Link>
            <span>›</span>
            <span style={{ color: '#1e293b', fontWeight: '500' }}>Messages</span>
            
            {activeConversation && (
              <>
                <span>›</span>
                <span style={{ color: '#1e293b', fontWeight: '500' }}>
                  {isMobile ? activeConversation.nom.substring(0, 20) + '...' : activeConversation.nom}
                </span>
              </>
            )}
          </div>
        </nav>

        {/* Layout adaptatif */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '350px 1fr',
          gap: '1.5rem',
          height: 'calc(100vh - 140px)',
          maxHeight: '800px',
          position: 'relative'
        }}>
          {/* Sidebar mobile */}
          {isMobile && (
            <>
              {/* Overlay */}
              {showSidebar && (
                <div
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 999,
                    backdropFilter: 'blur(2px)'
                  }}
                  onClick={() => setShowSidebar(false)}
                />
              )}

              {/* Sidebar */}
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: showSidebar ? '0' : '-350px',
                  width: '350px',
                  height: '100vh',
                  background: 'white',
                  zIndex: 1000,
                  transition: 'left 0.3s ease',
                  boxShadow: '4px 0 12px rgba(0,0,0,0.15)',
                  padding: '1rem'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
                    Conversations
                  </h2>
                  <button
                    onClick={() => setShowSidebar(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      color: '#64748b'
                    }}
                  >
                    ×
                  </button>
                </div>
                
                <ConversationList
                  conversations={conversations}
                  activeConversationId={activeConversationId}
                  onSelectConversation={handleSelectConversation}
                  loading={loadingConversations}
                />
              </div>

              {/* Bouton hamburger */}
              {!showSidebar && !activeConversation && (
                <button
                  onClick={() => setShowSidebar(true)}
                  style={{
                    position: 'fixed',
                    top: '5rem',
                    left: '1rem',
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #3b82f6, #f97316)',
                    border: 'none',
                    color: 'white',
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                    zIndex: 998,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  }}
                >
                  ☰
                </button>
              )}
            </>
          )}

          {/* Desktop sidebar */}
          {!isMobile && (
            <ConversationList
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={setActiveConversationId}
              loading={loadingConversations}
            />
          )}

          {/* Zone chat - pleine largeur sur mobile */}
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            gridColumn: isMobile ? '1' : 'auto'
          }}>
            {/* Mobile: Liste conversations si pas de conversation active */}
            {isMobile && !activeConversation ? (
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
                    Vos conversations
                  </h2>
                </div>
                <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
                  <ConversationList
                    conversations={conversations}
                    activeConversationId={activeConversationId}
                    onSelectConversation={handleSelectConversation}
                    loading={loadingConversations}
                  />
                </div>
              </div>
            ) : activeConversation ? (
              /* Chat interface normale */
              <>
                {/* Header chat avec bouton retour mobile */}
                <div style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid #e2e8f0',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(249, 115, 22, 0.05))'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {isMobile && (
                      <button
                        onClick={() => setActiveConversationId(null)}
                        style={{
                          width: '2.5rem',
                          height: '2.5rem',
                          borderRadius: '50%',
                          border: 'none',
                          background: '#f1f5f9',
                          color: '#3b82f6',
                          cursor: 'pointer',
                          fontSize: '1.25rem'
                        }}
                      >
                        ←
                      </button>
                    )}

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

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h2 style={{ 
                        fontSize: isMobile ? '1rem' : '1.25rem',
                        fontWeight: '600', 
                        color: '#1e293b', 
                        margin: '0 0 0.25rem 0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {activeConversation.nom}
                      </h2>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {activeConversation.participants.slice(0, isMobile ? 2 : 3).map((participant) => (
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
                      </div>
                    </div>

                    <Link
                      href={`/dashboard/chantiers/${activeConversation.id}`}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: '#3b82f6',
                        textDecoration: 'none',
                        fontSize: isMobile ? '1rem' : '1.25rem'
                      }}
                    >
                      🏗️
                    </Link>
                  </div>
                </div>

                {/* Messages avec gestion du clavier mobile */}
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: isMobile ? '1rem' : '1.5rem',
                  background: '#f8fafc',
                  WebkitOverflowScrolling: 'touch'
                }}>
                  {/* ... (garder la logique d'affichage des messages) */}
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
                      
                      <TypingIndicator
                        users={typingUsers}
                        visible={typingUsers.length > 0}
                      />
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input avec adaptations mobile */}
                <div style={{ 
                  padding: isMobile ? '1rem' : '1.5rem', 
                  background: 'white',
                  paddingBottom: isMobile ? 'calc(1rem + env(safe-area-inset-bottom))' : '1.5rem'
                }}>
                  <MessageInput
                    onSendMessage={sendMessage}
                    placeholder={`Message...`}
                    conversationId={activeConversationId}
                    onTyping={handleTyping}
                    showUpload={!isMobile} // Masquer upload sur mobile pour simplifier
                  />
                </div>
              </>
            ) : (
              /* État vide desktop */
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
                  Choisissez un chantier pour commencer à échanger
                </p>

                <Link href="/dashboard/chantiers" className="btn-primary">
                  🏗️ Voir les chantiers
                </Link>
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
        
        /* Support iOS safe area */
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          .mobile-input {
            padding-bottom: calc(1rem + env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </div>
  );
}
