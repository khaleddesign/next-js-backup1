"use client";

import { ClipboardList, Construction, Clock, CheckCircle, X } from "lucide-react";

interface StatusBadgeProps {
  statut: string;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  PLANIFIE: {
    label: 'Planifié',
    color: '#64748b',
    bgColor: 'rgba(100, 116, 139, 0.1)',
    icon: ClipboardList
  },
  EN_COURS: {
    label: 'En cours',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    icon: Construction
  },
  EN_ATTENTE: {
    label: 'En attente',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    icon: Clock
  },
  TERMINE: {
    label: 'Terminé',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    icon: CheckCircle
  },
  ANNULE: {
    label: 'Annulé',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    icon: X
  }
};

export default function StatusBadge({ statut, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[statut as keyof typeof statusConfig] || statusConfig.PLANIFIE;
  const IconComponent = config.icon;
  
  const sizeStyles = {
    sm: {
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
      borderRadius: '0.375rem'
    },
    md: {
      padding: '0.5rem 0.75rem',
      fontSize: '0.875rem',
      borderRadius: '0.5rem'
    },
    lg: {
      padding: '0.75rem 1rem',
      fontSize: '1rem',
      borderRadius: '0.5rem'
    }
  };

  const iconSize = size === 'sm' ? 12 : size === 'md' ? 14 : 16;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: config.color,
        backgroundColor: config.bgColor,
        border: `1px solid ${config.color}20`,
        fontWeight: '500',
        whiteSpace: 'nowrap',
        backdropFilter: 'blur(4px)',
        ...sizeStyles[size]
      }}
    >
      <IconComponent size={iconSize} />
      {config.label}
    </span>
  );
}
