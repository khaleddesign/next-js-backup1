"use client";

import React from 'react';

interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline';
  variant?: 'red' | 'orange' | 'blue' | 'green' | 'gray';
  animate?: boolean;
  showZero?: boolean;
  backgroundColor?: string;
  children?: React.ReactNode;
}

export default function NotificationBadge({
  count,
  maxCount = 99,
  size = 'md',
  position = 'top-right',
  variant = 'red',
  animate = true,
  showZero = false,
  backgroundColor,
  children
}: NotificationBadgeProps) {
  // Ne pas afficher si count === 0 et showZero === false
  if (count === 0 && !showZero) {
    return children ? <div style={{ position: 'relative' }}>{children}</div> : null;
  }

  // Formater le nombre affiché
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  // Tailles compatibles avec le design existant
  const sizeStyles = {
    sm: {
      width: '1rem',
      height: '1rem',
      fontSize: '0.625rem',
      minWidth: '1rem'
    },
    md: {
      width: '1.25rem',
      height: '1.25rem',
      fontSize: '0.75rem',
      minWidth: '1.25rem'
    },
    lg: {
      width: '1.5rem',
      height: '1.5rem',
      fontSize: '0.875rem',
      minWidth: '1.5rem'
    }
  };

  // Couleurs cohérentes avec le design system
  const variantStyles = {
    red: backgroundColor || '#ef4444',
    orange: backgroundColor || '#f97316',
    blue: backgroundColor || '#3b82f6',
    green: backgroundColor || '#10b981',
    gray: backgroundColor || '#64748b'
  };

  // Positions absolues
  const positionStyles = {
    'top-right': {
      position: 'absolute' as const,
      top: '-0.25rem',
      right: '-0.25rem'
    },
    'top-left': {
      position: 'absolute' as const,
      top: '-0.25rem',
      left: '-0.25rem'
    },
    'bottom-right': {
      position: 'absolute' as const,
      bottom: '-0.25rem',
      right: '-0.25rem'
    },
    'bottom-left': {
      position: 'absolute' as const,
      bottom: '-0.25rem',
      left: '-0.25rem'
    },
    'inline': {
      position: 'relative' as const,
      display: 'inline-flex'
    }
  };

  const badgeStyle = {
    ...sizeStyles[size],
    ...positionStyles[position],
    backgroundColor: variantStyles[variant],
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    zIndex: 10,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.2s ease-in-out',
    animation: animate ? 'pulse 2s infinite' : 'none'
  };

  const badge = (
    <div 
      style={badgeStyle}
      title={`${count} message${count > 1 ? 's' : ''} non lu${count > 1 ? 's' : ''}`}
    >
      {displayCount}
    </div>
  );

  // Si pas d'enfants, retourner juste le badge
  if (!children) {
    return (
      <>
        {badge}
        <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `}</style>
      </>
    );
  }

  // Sinon, wrapper les enfants avec le badge positionné
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {children}
      {badge}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

// Composant spécialisé pour les boutons avec badge
export function ButtonWithBadge({
  count,
  variant = 'red',
  animate = true,
  children,
  onClick,
  className = '',
  disabled = false,
  ...props
}: NotificationBadgeProps & {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${className}`}
      style={{ position: 'relative' }}
      {...props}
    >
      <NotificationBadge
        count={count}
        variant={variant}
        animate={animate}
        position="top-right"
      >
        {children}
      </NotificationBadge>
    </button>
  );
}

// Variantes prédéfinies pour différents contextes
export const MessagesBadge = ({ count, ...props }: Omit<NotificationBadgeProps, 'variant'>) => (
  <NotificationBadge count={count} variant="red" animate={count > 0} {...props} />
);

export const TasksBadge = ({ count, ...props }: Omit<NotificationBadgeProps, 'variant'>) => (
  <NotificationBadge count={count} variant="orange" animate={count > 0} {...props} />
);

export const AlertsBadge = ({ count, ...props }: Omit<NotificationBadgeProps, 'variant'>) => (
  <NotificationBadge count={count} variant="blue" animate={count > 0} {...props} />
);

// Composant pour afficher le badge dans le titre de la page (document.title)
export function DocumentTitleBadge({ count, baseTitle = 'ChantierPro' }: { count: number; baseTitle?: string; }) {
  React.useEffect(() => {
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
