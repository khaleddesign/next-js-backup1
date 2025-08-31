export default function LoadingSpinner({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const sizeMap = {
    small: '1rem',
    medium: '2rem',
    large: '3rem'
  };

  return (
    <div style={{
      width: sizeMap[size],
      height: sizeMap[size],
      border: '2px solid #f3f4f6',
      borderTop: '2px solid #3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
