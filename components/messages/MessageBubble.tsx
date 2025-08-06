"use client";

import UserAvatar from "./UserAvatar";

interface MessageBubbleProps {
  message: {
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
  };
  isOwn: boolean;
  showAvatar?: boolean;
  currentUserId: string;
}

export default function MessageBubble({ 
  message, 
  isOwn, 
  showAvatar = true,
  currentUserId 
}: MessageBubbleProps) {
  const formatTime = (dateString: string) => {
    const today = new Date();
    const messageDate = new Date(dateString);
    const isToday = today.toDateString() === messageDate.toDateString();
    
    if (isToday) {
      return messageDate.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    return messageDate.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '1rem',
        flexDirection: isOwn ? 'row-reverse' : 'row',
        alignItems: 'flex-end'
      }}
    >
      {showAvatar && !isOwn && (
        <UserAvatar 
          user={message.expediteur} 
          size="sm"
          showStatus={true}
          status="online"
        />
      )}

      <div
        style={{
          maxWidth: '70%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: isOwn ? 'flex-end' : 'flex-start'
        }}
      >
        {!isOwn && (
          <div style={{
            fontSize: '0.75rem',
            color: '#64748b',
            marginBottom: '0.25rem',
            fontWeight: '500'
          }}>
            {message.expediteur.name}
          </div>
        )}

        <div
          style={{
            background: isOwn 
              ? 'linear-gradient(135deg, #3b82f6, #f97316)'
              : 'white',
            color: isOwn ? 'white' : '#1e293b',
            padding: '0.75rem 1rem',
            borderRadius: isOwn 
              ? '1rem 1rem 0.25rem 1rem'
              : '1rem 1rem 1rem 0.25rem',
            boxShadow: isOwn 
              ? '0 4px 12px rgba(59, 130, 246, 0.3)'
              : '0 2px 8px rgba(0,0,0,0.1)',
            border: isOwn ? 'none' : '1px solid #e2e8f0',
            wordBreak: 'break-word',
            lineHeight: 1.5
          }}
        >
          {message.message}

          {message.photos.length > 0 && (
            <div style={{ 
              marginTop: '0.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gap: '0.5rem'
            }}>
              {message.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  style={{
                    width: '100%',
                    maxWidth: '200px',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div style={{
          fontSize: '0.75rem',
          color: '#94a3b8',
          marginTop: '0.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {formatTime(message.createdAt)}
          {isOwn && (
            <span style={{ 
              color: message.lu ? '#10b981' : '#94a3b8',
              fontSize: '0.75rem'
            }}>
              {message.lu ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>

      {showAvatar && isOwn && (
        <UserAvatar 
          user={message.expediteur} 
          size="sm"
          showStatus={true}
          status="online"
        />
      )}
    </div>
  );
}
