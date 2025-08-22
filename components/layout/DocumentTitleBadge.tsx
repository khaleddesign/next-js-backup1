"use client";

import React, { useEffect } from 'react';

interface DocumentTitleBadgeProps {
  count?: number;
  baseTitle?: string;
}

export default function DocumentTitleBadge({ 
  count = 0, 
  baseTitle = 'ChantierPro' 
}: DocumentTitleBadgeProps) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    
    if (count > 0) {
      document.title = `(${count}) ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }
    
    return () => {
      document.title = baseTitle;
    };
  }, [count, baseTitle]);

  return null;
}
