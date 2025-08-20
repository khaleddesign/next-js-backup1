import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  src?: string;
  alt?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm', 
  lg: 'w-10 h-10 text-base',
  xl: 'w-12 h-12 text-lg'
};

// Générer une couleur basée sur le nom
function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-red-500', 'bg-purple-500', 'bg-orange-500',
    'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

// Générer les initiales
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({ 
  name, 
  size = 'md', 
  className = '',
  src,
  alt
}: AvatarProps) {
  const colorClass = getAvatarColor(name);
  const initials = getInitials(name);

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={cn('avatar', sizeClasses[size], className)}
        style={{ objectFit: 'cover' }}
      />
    );
  }

  return (
    <div 
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold text-white',
        sizeClasses[size],
        colorClass,
        className
      )}
      title={name}
    >
      {initials}
    </div>
  );
}

// Composant pour un groupe d'avatars
interface AvatarGroupProps {
  users: Array<{ name: string; src?: string }>;
  max?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function AvatarGroup({ 
  users, 
  max = 3, 
  size = 'md',
  className = ''
}: AvatarGroupProps) {
  const displayUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {displayUsers.map((user, index) => (
        <Avatar
          key={index}
          name={user.name}
          src={user.src}
          size={size}
          className="border-2 border-white"
        />
      ))}
      {remainingCount > 0 && (
        <div 
          className={cn(
            'inline-flex items-center justify-center rounded-full font-semibold text-white bg-gray-500',
            sizeClasses[size],
            'border-2 border-white'
          )}
          title={`+${remainingCount} autres`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}