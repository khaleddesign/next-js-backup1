"use client";

import React, { useState, useEffect, createContext, useContext } from 'react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toast
    };
    
    setToasts(prev => [...prev, newToast]);

    // Auto-remove après la durée spécifiée
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '400px'
    }}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Entrée avec animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const getToastStyles = () => {
    const baseStyles = {
      padding: '1rem',
      borderRadius: '0.75rem',
      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      transition: 'all 0.3s ease',
      transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
      opacity: isVisible && !isLeaving ? 1 : 0,
      position: 'relative' as const,
      background: 'white',
      border: '1px solid #e5e7eb',
      minWidth: '350px'
    };

    const typeStyles = {
      success: { borderLeftColor: '#10b981', borderLeftWidth: '4px' },
      error: { borderLeftColor: '#ef4444', borderLeftWidth: '4px' },
      warning: { borderLeftColor: '#f59e0b', borderLeftWidth: '4px' },
      info: { borderLeftColor: '#3b82f6', borderLeftWidth: '4px' }
    };

    return { ...baseStyles, ...typeStyles[toast.type] };
  };

  const getIcon = () => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[toast.type];
  };

  const getIconColor = () => {
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };
    return colors[toast.type];
  };

  return (
    <div style={getToastStyles()}>
      <div style={{
        fontSize: '1.25rem',
        color: getIconColor(),
        flexShrink: 0
      }}>
        {getIcon()}
      </div>
      
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{
          margin: 0,
          fontSize: '0.875rem',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: toast.message ? '0.25rem' : 0
        }}>
          {toast.title}
        </h4>
        
        {toast.message && (
          <p style={{
            margin: 0,
            fontSize: '0.8125rem',
            color: '#6b7280',
            lineHeight: 1.4
          }}>
            {toast.message}
          </p>
        )}

        {toast.action && (
          <button
            onClick={toast.action.onClick}
            style={{
              marginTop: '0.5rem',
              padding: '0.25rem 0.5rem',
              background: 'transparent',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              color: '#374151',
              fontSize: '0.75rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f9fafb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        onClick={handleClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#9ca3af',
          cursor: 'pointer',
          fontSize: '1rem',
          padding: '0.25rem',
          lineHeight: 1,
          flexShrink: 0
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#6b7280';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#9ca3af';
        }}
      >
        ×
      </button>
    </div>
  );
}

// Fonctions utilitaires pour créer des toasts rapidement
export const showSuccessToast = (addToast: ToastContextType['addToast']) => 
  (title: string, message?: string, action?: Toast['action']) => {
    addToast({ type: 'success', title, message, action });
  };

export const showErrorToast = (addToast: ToastContextType['addToast']) => 
  (title: string, message?: string, action?: Toast['action']) => {
    addToast({ type: 'error', title, message, action, duration: 8000 });
  };

export const showWarningToast = (addToast: ToastContextType['addToast']) => 
  (title: string, message?: string, action?: Toast['action']) => {
    addToast({ type: 'warning', title, message, action, duration: 6000 });
  };

export const showInfoToast = (addToast: ToastContextType['addToast']) => 
  (title: string, message?: string, action?: Toast['action']) => {
    addToast({ type: 'info', title, message, action });
  };
