--- components/messages/UserAvatar.tsx ---
"use client";

interface UserAvatarProps {
  user: {
    id: string;
    name: string;
    role?: string;
  };
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  status?: 'online' | 'offline' | 'away';
}

export default function UserAvatar({ 
  user, 
  size = 'md', 
  showStatus = false, 
  status = 'offline' 
}: UserAvatarProps) {
  const sizeConfig = {
    sm: { width: '1.5rem', height: '1.5rem', fontSize: '0.75rem' },
    md: { width: '2rem', height: '2rem', fontSize: '0.875rem' },
    lg: { width: '3rem', height: '3rem', fontSize: '1.125rem' }
  };

  const statusColors = {
    online: '#10b981',
    away: '#f59e0b',
    offline: '#6b7280'
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'ADMIN': return 'linear-gradient(135deg, #7c3aed, #a855f7)';
      case 'COMMERCIAL': return 'linear-gradient(135deg, #3b82f6, #06b6d4)';
      case 'OUVRIER': return 'linear-gradient(135deg, #f59e0b, #f97316)';
      case 'CLIENT': return 'linear-gradient(135deg, #10b981, #059669)';
      default: return 'linear-gradient(135deg, #3b82f6, #f97316)';
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div
        style={{
          ...sizeConfig[size],
          borderRadius: '50%',
          background: getRoleColor(user.role),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          flexShrink: 0,
          cursor: 'pointer',
          transition: 'transform 0.2s ease'
        }}
        title={`${user.name}${user.role ? ` (${user.role})` : ''}`}
      >
        {user.name.charAt(0).toUpperCase()}
      </div>

      {showStatus && (
        <div
          style={{
            position: 'absolute',
            bottom: '-2px',
            right: '-2px',
            width: size === 'sm' ? '0.5rem' : '0.75rem',
            height: size === 'sm' ? '0.5rem' : '0.75rem',
            borderRadius: '50%',
            background: statusColors[status],
            border: '2px solid white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }}
        />
      )}
    </div>
  );
}
