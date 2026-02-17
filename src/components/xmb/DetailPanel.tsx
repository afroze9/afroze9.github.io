import type { ReactNode } from 'react';

interface DetailPanelProps {
  isOpen: boolean;
  title: string;
  children?: ReactNode;
  onClose: () => void;
}

export function DetailPanel({ isOpen, title, children, onClose }: DetailPanelProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '50%',
        height: '100%',
        background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 10%, rgba(0,0,0,0.9) 100%)',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease-out',
        padding: '80px 60px',
        boxSizing: 'border-box',
        overflowY: 'auto',
        zIndex: 100,
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255,255,255,0.1)',
          border: 'none',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        ESC to close
      </button>

      <h2
        style={{
          color: 'white',
          fontSize: '28px',
          fontWeight: 600,
          marginBottom: '24px',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
        }}
      >
        {title}
      </h2>

      <div
        style={{
          color: 'rgba(255,255,255,0.9)',
          fontSize: '16px',
          lineHeight: 1.6,
        }}
      >
        {children || (
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>
            Content coming soon...
          </p>
        )}
      </div>
    </div>
  );
}
