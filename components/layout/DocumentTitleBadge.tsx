"use client";

import { useEffect } from 'react';
import { useMessages } from '@/hooks/useMessages';

interface DocumentTitleBadgeProps {
  baseTitle?: string;
  userId?: string;
}

export default function DocumentTitleBadge({ 
  baseTitle = 'ChantierPro',
  userId = 'test-client-123'
}: DocumentTitleBadgeProps) {
  const { totalUnreadCount } = useMessages({ userId, pollingInterval: 60000 }); // 1 minute pour le titre

  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    if (totalUnreadCount > 0) {
      document.title = `(${totalUnreadCount}) ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }
    
    return () => {
      document.title = baseTitle;
    };
  }, [totalUnreadCount, baseTitle]);

  return null;
}
