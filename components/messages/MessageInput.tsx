"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import TypingIndicator from "./TypingIndicator";

interface MessageInputProps {
  onSendMessage: (message: string, photos: string[]) => Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  showUpload?: boolean;
  conversationId?: string;
  onTyping?: (isTyping: boolean) => void;
}

export default function MessageInput({ 
  onSendMessage, 
  placeholder = "Écrivez votre message...",
  disabled = false,
  showUpload = true,
  conversationId,
  onTyping
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showShortcutHelp, setShowShortcutHelp] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save brouillon
  const draftKey = `draft_${conversationId || 'default'}`;
  
  useEffect(() => {
    // Charger le brouillon sauvegardé
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft && !message) {
      setMessage(savedDraft);
    }
  }, [conversationId, draftKey]);

  useEffect(() => {
    // Sauvegarder le brouillon
    if (message) {
      localStorage.setItem(draftKey, message);
    } else {
      localStorage.removeItem(draftKey);
    }
  }, [message, draftKey]);

  // Gestion de l'indicateur "en train d'écrire"
  const handleTyping = useCallback((value: string) => {
    if (!onTyping) return;

    const isCurrentlyTyping = value.trim().length > 0;
    
    if (isCurrentlyTyping !== isTyping) {
      setIsTyping(isCurrentlyTyping);
      onTyping(isCurrentlyTyping);
    }

    // Reset timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Arrêter l'indicateur après 3 secondes d'inactivité
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTyping(false);
    }, 3000);
  }, [isTyping, onTyping]);

  const handleSubmit = async () => {
    if (!message.trim() && photos.length === 0) return;
    if (sending) return;

    setSending(true);
    setIsTyping(false);
    if (onTyping) onTyping(false);
    
    try {
      await onSendMessage(message.trim(), photos);
      setMessage("");
      setPhotos([]);
      localStorage.removeItem(draftKey);
      
      // Focus retour sur textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    } catch (error) {
      console.error('Erreur envoi message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd + Enter = Envoyer
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
      return;
    }

    // Enter seul = Envoyer (sauf si Shift+Enter = nouvelle ligne)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
      return;
    }

    // Escape = Effacer
    if (e.key === 'Escape') {
      setMessage("");
      setPhotos([]);
      return;
    }

    // Afficher l'aide sur Ctrl+?
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      setShowShortcutHelp(true);
      setTimeout(() => setShowShortcutHelp(false), 3000);
      return;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    handleTyping(value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  const handlePhotoUpload = () => {
    // Simulation upload avec photos réalistes
    const constructionPhotos = [
      "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=300&h=200&fit=crop"
    ];
    
    const randomPhoto = constructionPhotos[Math.floor(Math.random() * constructionPhotos.length)];
    setPhotos(prev => [...prev, randomPhoto]);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div style={{
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '1rem',
      padding: '1rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      position: 'relative'
    }}>
      {/* Aide raccourcis */}
      {showShortcutHelp && (
        <div style={{
          position: 'absolute',
          top: '-80px',
          left: '1rem',
          right: '1rem',
          background: '#1e293b',
          color: 'white',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          fontSize: '0.75rem',
          zIndex: 10,
          animation: 'fadeIn 0.2s ease'
        }}>
          <div><strong>Raccourcis :</strong></div>
          <div>• Ctrl/⌘ + Entrée : Envoyer</div>
          <div>• Maj + Entrée : Nouvelle ligne</div>
          <div>• Échap : Effacer</div>
        </div>
      )}

      {/* Photos sélectionnées */}
      {photos.length > 0 && (
        <div style={{ 
          marginBottom: '1rem',
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          {photos.map((photo, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                width: '60px',
                height: '60px',
                borderRadius: '0.5rem',
                overflow: 'hidden',
                border: '2px solid #e2e8f0'
              }}
            >
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <button
                onClick={() => removePhoto(index)}
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.8)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Zone de saisie */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || sending}
            style={{
              width: '100%',
              minHeight: '44px',
              maxHeight: '120px',
              padding: '0.75rem',
              border: '1px solid #e2e8f0',
              borderRadius: '0.75rem',
              resize: 'none',
              fontFamily: 'inherit',
              fontSize: '0.875rem',
              color: '#1e293b',
              background: disabled ? '#f8fafc' : 'white',
              transition: 'border-color 0.2s ease',
              overflow: 'hidden'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Boutons actions */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {showUpload && (
            <button
              onClick={handlePhotoUpload}
              disabled={disabled || sending || photos.length >= 5}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '0.75rem',
                border: '1px solid #e2e8f0',
                background: 'white',
                color: photos.length >= 5 ? '#94a3b8' : '#64748b',
                cursor: photos.length >= 5 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (photos.length < 5) {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#3b82f6';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
              title={photos.length >= 5 ? "Maximum 5 photos" : "Ajouter une photo"}
            >
              📸
            </button>
          )}

          <button
            onClick={handleSubmit}
            disabled={(!message.trim() && photos.length === 0) || disabled || sending}
            className="btn-primary"
            style={{
              minWidth: '44px',
              height: '44px',
              borderRadius: '0.75rem',
              opacity: (!message.trim() && photos.length === 0) || disabled || sending ? 0.5 : 1,
              cursor: (!message.trim() && photos.length === 0) || disabled || sending ? 'not-allowed' : 'pointer',
              fontSize: '1.25rem'
            }}
          >
            {sending ? '⏳' : '📤'}
          </button>
        </div>
      </div>

      {/* Indicateurs */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '0.5rem',
        fontSize: '0.75rem',
        color: '#94a3b8'
      }}>
        <div>
          {message.length > 0 && `${message.length}/2000 caractères`}
          {isTyping && " • En train d'écrire..."}
        </div>
        <div>
          Ctrl+Entrée pour envoyer • Ctrl+/ pour aide
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
