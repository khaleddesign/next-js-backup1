"use client";

import { useState, useEffect } from 'react';
import NotificationBadge from './NotificationBadge';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
 title: string;
 message: string;
 duration?: number;
 action?: {
   label: string;
   onClick: () => void;
 };
}

interface ToastNotificationProps {
 toasts: Toast[];
 onDismiss: (id: string) => void;
}

export default function ToastNotification({ toasts, onDismiss }: ToastNotificationProps) {
 const getToastStyles = (type: Toast['type']) => {
   const baseStyles = {
     background: 'white',
     border: '1px solid',
     borderRadius: '0.75rem',
     boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
     padding: '1rem',
     minWidth: '300px',
     maxWidth: '400px',
     marginBottom: '0.75rem',
     position: 'relative' as const,
     overflow: 'hidden' as const
   };

   const typeStyles = {
     success: {
       borderColor: '#10b981',
       borderLeftWidth: '4px',
       borderLeftColor: '#10b981'
     },
     error: {
       borderColor: '#ef4444',
       borderLeftWidth: '4px',
       borderLeftColor: '#ef4444'
     },
     warning: {
       borderColor: '#f59e0b',
       borderLeftWidth: '4px',
       borderLeftColor: '#f59e0b'
     },
     info: {
       borderColor: '#3b82f6',
       borderLeftWidth: '4px',
       borderLeftColor: '#3b82f6'
     }
   };

   return { ...baseStyles, ...typeStyles[type] };
 };

 const getIcon = (type: Toast['type']) => {
   const icons = {
     success: '✅',
     error: '❌',
     warning: '⚠️',
     info: '💬'
   };
   return icons[type];
 };

 const getColor = (type: Toast['type']) => {
   const colors = {
     success: '#10b981',
     error: '#ef4444',
     warning: '#f59e0b',
     info: '#3b82f6'
   };
   return colors[type];
 };

 useEffect(() => {
   toasts.forEach(toast => {
     if (toast.duration !== 0) {
       const timer = setTimeout(() => {
         onDismiss(toast.id);
       }, toast.duration || 5000);

       return () => clearTimeout(timer);
     }
   });
 }, [toasts, onDismiss]);

 if (toasts.length === 0) return null;

 return (
   <div style={{
     position: 'fixed',
     top: '2rem',
     right: '2rem',
     zIndex: 9999,
     pointerEvents: 'auto'
   }}>
     {toasts.map((toast, index) => (
       <div
         key={toast.id}
         style={{
           ...getToastStyles(toast.type),
           animation: `slideInRight 0.3s ease ${index * 0.1}s both`
         }}
       >
         {/* Barre de progression */}
         {toast.duration !== 0 && (
           <div
             style={{
               position: 'absolute',
               bottom: 0,
               left: 0,
               height: '3px',
               background: getColor(toast.type),
               animation: `progress ${toast.duration || 5000}ms linear`
             }}
           />
         )}

         <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
           <div style={{
             fontSize: '1.25rem',
             flexShrink: 0,
             marginTop: '0.125rem'
           }}>
             {getIcon(toast.type)}
           </div>

           <div style={{ flex: 1, minWidth: 0 }}>
             <h4 style={{
               margin: '0 0 0.25rem 0',
               fontSize: '0.875rem',
               fontWeight: '600',
               color: '#1e293b'
             }}>
               {toast.title}
             </h4>
             
             <p style={{
               margin: 0,
               fontSize: '0.875rem',
               color: '#64748b',
               lineHeight: 1.4
             }}>
               {toast.message}
             </p>

             {toast.action && (
               <button
                 onClick={() => {
                   toast.action!.onClick();
                   onDismiss(toast.id);
                 }}
                 style={{
                   marginTop: '0.75rem',
                   padding: '0.5rem 1rem',
                   border: `1px solid ${getColor(toast.type)}`,
                   borderRadius: '0.5rem',
                   background: 'transparent',
                   color: getColor(toast.type),
                   fontSize: '0.875rem',
                   cursor: 'pointer',
                   transition: 'all 0.2s ease'
                 }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.background = getColor(toast.type);
                   e.currentTarget.style.color = 'white';
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.background = 'transparent';
                   e.currentTarget.style.color = getColor(toast.type);
                 }}
               >
                 {toast.action.label}
               </button>
             )}
           </div>

           <button
             onClick={() => onDismiss(toast.id)}
             style={{
               width: '1.5rem',
               height: '1.5rem',
               borderRadius: '50%',
               border: 'none',
               background: 'transparent',
               color: '#94a3b8',
               cursor: 'pointer',
               fontSize: '1rem',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               flexShrink: 0
             }}
             onMouseEnter={(e) => {
               e.currentTarget.style.background = '#f1f5f9';
               e.currentTarget.style.color = '#64748b';
             }}
             onMouseLeave={(e) => {
               e.currentTarget.style.background = 'transparent';
               e.currentTarget.style.color = '#94a3b8';
             }}
           >
             ×
           </button>
         </div>
       </div>
     ))}

     <style jsx>{`
       @keyframes slideInRight {
         from {
           transform: translateX(100%);
           opacity: 0;
         }
         to {
           transform: translateX(0);
           opacity: 1;
         }
       }

       @keyframes progress {
         from {
           width: 100%;
         }
         to {
           width: 0%;
         }
       }
     `}</style>
   </div>
 );
}
