'use client';

import { useState, useCallback } from 'react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: Toast['type'], title: string, message: string, duration = 5000) => {
    const id = Date.now().toString();
    const toast: Toast = { id, type, title, message, duration };
    
    setToasts(prev => [...prev, toast]);
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((title: string, message: string) => {
    console.log('✅ ' + title + ': ' + message);
    return addToast('success', title, message);
  }, [addToast]);

  const error = useCallback((title: string, message: string) => {
    console.error('❌ ' + title + ': ' + message);
    return addToast('error', title, message);
  }, [addToast]);

  const warning = useCallback((title: string, message: string) => {
    console.warn('⚠️ ' + title + ': ' + message);
    return addToast('warning', title, message);
  }, [addToast]);

  const info = useCallback((title: string, message: string) => {
    console.info('ℹ️ ' + title + ': ' + message);
    return addToast('info', title, message);
  }, [addToast]);

  return {
    toasts,
    success,
    error,
    warning,
    info,
    removeToast
  };
}