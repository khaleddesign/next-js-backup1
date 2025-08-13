"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import UserAvatar from '@/components/messages/UserAvatar';
import MessageInput from '@/components/messages/MessageInput';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'COMMERCIAL' | 'OUVRIER' | 'CLIENT';
  company?: string;
}

interface NewMessageData {
  recipients: User[];
  subject: string;
  message: string;
  photos: string[];
  isImportant: boolean;
  chantierId?: string;
}

export default function NouveauMessagePage() {
  const router = useRouter();
  const [step, setStep] = useState<'recipients' | 'compose' | 'preview'>('recipients');
  const [messageData, setMessageData] = useState<NewMessageData>({
    recipients: [],
    subject: '',
    message: '',
    photos: [],
    isImportant: false
  });
  
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSubject, setShowSubject] = useState(false);

  // Charger les utilisateurs disponibles
  useEffect(() => {
    fetchAvailableUsers();
  }, []);

  const fetchAvailableUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/messages/contacts');
      if (response.ok) {
        const data = await response.json();
        setAvailableUsers(data.users || []);
      }
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = availableUsers.filter(user =>
    !messageData.recipients.some(r => r.id === user.id) &&
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddRecipient = (user: User) => {
    setMessageData(prev => ({
      ...prev,
      recipients: [...prev.recipients, user]
    }));
    setSearchTerm('');
  };

  const handleRemoveRecipient = (userId: string) => {
    setMessageData(prev => ({
      ...prev,
      recipients: prev.recipients.filter(r => r.id !== userId)
    }));
  };

  const handleSendMessage = useCallback(async (text: string, photos: string[]) => {
    setMessageData(prev => ({
      ...prev,
      message: text,
      photos: photos
    }));
    
    if (step === 'compose') {
      setStep('preview');
      return true;
    }
    
    return true;
  }, [step]);

  const handleFinalSend = async () => {
    if (!messageData.message.trim() || messageData.recipients.length === 0) {
      return;
    }

    setSending(true);
    try {
      // Créer une conversation pour chaque destinataire ou utiliser conversation de groupe
      const conversationData = {
        recipients: messageData.recipients.map(r => r.id),
        message: messageData.message,
        photos: messageData.photos,
        subject: messageData.subject,
        isImportant: messageData.isImportant,
        chantierId: messageData.chantierId
      };

      const response = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(conversationData)
      });

      if (response.ok) {
        const result = await response.json();
        // Rediriger vers la conversation créée
        router.push(`/dashboard/messages?conversation=${result.conversationId}`);
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Erreur envoi message:', error);
      alert('Erreur lors de l\'envoi du message');
    } finally {
      setSending(false);
    }
  };

  const handleBack = () => {
    if (step === 'preview') {
      setStep('compose');
    } else if (step === 'compose') {
      setStep('recipients');
    } else {
      router.push('/dashboard/messages');
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'recipients':
        return messageData.recipients.length > 0;
      case 'compose':
        return messageData.message.trim().length > 0;
      case 'preview':
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canProceed()) return;
    
    if (step === 'recipients') {
      setStep('compose');
    } else if (step === 'compose' && messageData.message.trim()) {
      setStep('preview');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        
        {/* Navigation */}
        <nav style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
            <Link href="/dashboard" style={{ color: '#3b82f6', textDecoration: 'none' }}>
              Dashboard
            </Link>
            <span>›</span>
            <Link href="/dashboard/messages" style={{ color: '#3b82f6', textDecoration: 'none' }}>
              Messages
            </Link>
            <span>›</span>
            <span style={{ color: '#1e293b', fontWeight: '500' }}>Nouveau message</span>
          </div>
        </nav>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: '0 0 0.5rem 0' }}>
                ✏️ Nouveau Message
              </h1>
              <p style={{ color: '#64748b', margin: 0 }}>
                {step === 'recipients' && 'Sélectionnez les destinataires'}
                {step === 'compose' && 'Rédigez votre message'}
                {step === 'preview' && 'Vérifiez avant envoi'}
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard/messages')}
              style={{
                color: '#64748b',
                border: '1px solid #e2e8f0',
                background: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              ✕ Annuler
            </button>
          </div>

          {/* Progress Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {[
              { key: 'recipients', label: 'Destinataires', icon: '👥' },
              { key: 'compose', label: 'Rédiger', icon: '✏️' },
              { key: 'preview', label: 'Aperçu', icon: '👁️' }
            ].map((s, index) => (
              <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  background: step === s.key 
                    ? 'linear-gradient(135deg, #3b82f6, #f97316)'
                    : (index < ['recipients', 'compose', 'preview'].indexOf(step) ? '#10b981' : '#e2e8f0'),
                  color: step === s.key || index < ['recipients', 'compose', 'preview'].indexOf(step) ? 'white' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem'
                }}>
                  {index < ['recipients', 'compose', 'preview'].indexOf(step) ? '✓' : s.icon}
                </div>
                <span style={{
                  fontSize: '0.875rem',
                  color: step === s.key ? '#1e293b' : '#64748b',
                  fontWeight: step === s.key ? '600' : '400'
                }}>
                  {s.label}
                </span>
                {index < 2 && (
                  <div style={{
                    width: '2rem',
                    height: '2px',
                    background: index < ['recipients', 'compose', 'preview'].indexOf(step) ? '#10b981' : '#e2e8f0',
                    margin: '0 0.5rem'
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="card" style={{ marginBottom: '2rem' }}>

          {/* Step 1: Destinataires */}
          {step === 'recipients' && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
                👥 Sélection des destinataires
              </h3>

              {/* Destinataires sélectionnés */}
              {messageData.recipients.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.75rem', fontWeight: '500' }}>
                    Destinataires sélectionnés ({messageData.recipients.length}):
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {messageData.recipients.map((recipient) => (
                      <div
                        key={recipient.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: '#f0f9ff',
                          border: '1px solid #3b82f6',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '2rem',
                          fontSize: '0.875rem'
                        }}
                      >
                        <UserAvatar user={recipient} size="sm" />
                        <span>{recipient.name}</span>
                        <button
                          onClick={() => handleRemoveRecipient(recipient.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#3b82f6',
                            fontSize: '1rem',
                            padding: '0',
                            marginLeft: '0.25rem'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recherche utilisateurs */}
              <div style={{ marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="🔍 Rechercher un utilisateur par nom ou email..."
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    background: '#f8fafc'
                  }}
                />
              </div>

              {/* Liste utilisateurs */}
              {searchTerm && (
                <div style={{ 
                  maxHeight: '300px', 
                  overflowY: 'auto',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  background: '#f8fafc'
                }}>
                  {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                      ⏳ Recherche en cours...
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                      Aucun utilisateur trouvé
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => handleAddRecipient(user)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem 1rem',
                          cursor: 'pointer',
                          borderBottom: '1px solid #f1f5f9',
                          transition: 'background 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <UserAvatar user={user} size="md" />
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontWeight: '500', color: '#1e293b' }}>
                            {user.name}
                          </p>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                            {user.role} {user.company && `• ${user.company}`}
                          </p>
                        </div>
                        <span style={{ color: '#3b82f6', fontSize: '1.25rem' }}>+</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Composer */}
          {step === 'compose' && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
                ✏️ Rédiger le message
              </h3>

              {/* Récap destinataires */}
              <div style={{ 
                background: '#f8fafc', 
                padding: '1rem', 
                borderRadius: '0.5rem', 
                marginBottom: '1.5rem',
                border: '1px solid #e2e8f0'
              }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>
                  Pour: {messageData.recipients.map(r => r.name).join(', ')}
                </p>
                <button
                  onClick={() => setStep('recipients')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#3b82f6',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    textDecoration: 'underline',
                    padding: 0
                  }}
                >
                  Modifier les destinataires
                </button>
              </div>

              {/* Options message */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={showSubject}
                    onChange={(e) => setShowSubject(e.target.checked)}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    📄 Ajouter un sujet
                  </span>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={messageData.isImportant}
                    onChange={(e) => setMessageData(prev => ({ ...prev, isImportant: e.target.checked }))}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    🔴 Message important
                  </span>
                </label>
              </div>

              {/* Sujet (optionnel) */}
              {showSubject && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Sujet:
                  </label>
                  <input
                    type="text"
                    value={messageData.subject}
                    onChange={(e) => setMessageData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Objet du message..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              )}

              {/* Zone de saisie */}
              <div>
                <MessageInput
                  onSendMessage={handleSendMessage}
                  placeholder="Écrivez votre message..."
                  disabled={sending}
                  showUpload={true}
                />
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                  💡 Le message sera envoyé à tous les destinataires sélectionnés
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {step === 'preview' && (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
                👁️ Aperçu avant envoi
              </h3>

              <div style={{ 
                border: '2px dashed #e2e8f0', 
                borderRadius: '0.75rem', 
                padding: '1.5rem',
                background: '#fafbfc'
              }}>
                {/* En-tête du message */}
                <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      De: Vous
                    </span>
                    {messageData.isImportant && (
                      <span style={{
                        background: '#fef2f2',
                        color: '#dc2626',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        🔴 Important
                      </span>
                    )}
                  </div>
                  
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
                    Pour: {messageData.recipients.map(r => r.name).join(', ')}
                  </p>
                  
                  {messageData.subject && (
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>
                      {messageData.subject}
                    </p>
                  )}
                </div>

                {/* Contenu */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.6
                  }}>
                    {messageData.message}
                  </div>
                </div>

                {/* Photos */}
                {messageData.photos.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {messageData.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                          borderRadius: '0.5rem',
                          border: '1px solid #e2e8f0'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ 
                marginTop: '1.5rem', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <button
                  onClick={() => setStep('compose')}
                  style={{
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    background: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  ← Modifier
                </button>

                <button
                  onClick={handleFinalSend}
                  disabled={sending}
                  className="btn-primary"
                  style={{
                    padding: '0.75rem 2rem',
                    fontSize: '0.875rem',
                    opacity: sending ? 0.7 : 1,
                    cursor: sending ? 'not-allowed' : 'pointer'
                  }}
                >
                  {sending ? '⏳ Envoi en cours...' : '📤 Envoyer le message'}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation */}
        {step !== 'preview' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={handleBack}
              style={{
                color: '#64748b',
                border: '1px solid #e2e8f0',
                background: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              ← {step === 'compose' ? 'Destinataires' : 'Messages'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Étape {['recipients', 'compose', 'preview'].indexOf(step) + 1} sur 3
              </span>
              
              {step !== 'preview' && (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="btn-primary"
                  style={{
                    padding: '0.5rem 1.5rem',
                    fontSize: '0.875rem',
                    opacity: !canProceed() ? 0.5 : 1,
                    cursor: !canProceed() ? 'not-allowed' : 'pointer'
                  }}
                >
                  {step === 'recipients' ? 'Rédiger →' : 'Aperçu →'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Aide contextuelle */}
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: '#fef3c7', 
          border: '1px solid #fbbf24',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          color: '#92400e'
        }}>
          <strong>💡 Conseil :</strong> {
            step === 'recipients' ? 'Vous pouvez sélectionner plusieurs destinataires. Le message sera envoyé individuellement à chacun.' :
            step === 'compose' ? 'Utilisez le drag & drop pour ajouter des photos. Les raccourcis clavier sont disponibles (Ctrl+Entrée pour continuer).' :
            'Vérifiez bien le contenu avant l\'envoi. Une fois envoyé, le message ne pourra plus être modifié.'
          }
        </div>
      </div>
    </div>
  );
}