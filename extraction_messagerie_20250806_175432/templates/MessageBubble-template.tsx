// components/messages/MessageBubble.tsx - Template
import React from 'react';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  showAvatar = true
}) => {
  return (
    <div className={`message-bubble ${isOwn ? 'own' : 'other'}`}>
      {/* TODO: Implémenter bubble avec styles glass */}
      <div className="message-content">
        {message.message}
      </div>
      <div className="message-meta">
        {new Date(message.createdAt).toLocaleTimeString()}
        {isOwn && (
          <span className={`status ${message.lu ? 'read' : 'sent'}`}>
            {message.lu ? '✓✓' : '✓'}
          </span>
        )}
      </div>
    </div>
  );
};
