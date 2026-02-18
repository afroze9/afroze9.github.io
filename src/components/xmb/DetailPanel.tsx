import { useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLayout } from '../../context/LayoutContext';

interface DetailPanelProps {
  isOpen: boolean;
  title: string;
  children?: ReactNode;
  onClose: () => void;
}

const SCROLL_AMOUNT = 100; // pixels per arrow key press
const PAGE_SCROLL_AMOUNT = 400; // pixels per page up/down

export function DetailPanel({ isOpen, title, children, onClose }: DetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const layout = useLayout();

  // Handle keyboard scrolling when panel is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const panel = panelRef.current;
      if (!panel) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          e.stopPropagation();
          panel.scrollBy({ top: -SCROLL_AMOUNT, behavior: 'smooth' });
          break;
        case 'ArrowDown':
          e.preventDefault();
          e.stopPropagation();
          panel.scrollBy({ top: SCROLL_AMOUNT, behavior: 'smooth' });
          break;
        case 'PageUp':
          e.preventDefault();
          e.stopPropagation();
          panel.scrollBy({ top: -PAGE_SCROLL_AMOUNT, behavior: 'smooth' });
          break;
        case 'PageDown':
          e.preventDefault();
          e.stopPropagation();
          panel.scrollBy({ top: PAGE_SCROLL_AMOUNT, behavior: 'smooth' });
          break;
        case 'Home':
          e.preventDefault();
          e.stopPropagation();
          panel.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        case 'End':
          e.preventDefault();
          e.stopPropagation();
          panel.scrollTo({ top: panel.scrollHeight, behavior: 'smooth' });
          break;
      }
    };

    // Use capture to intercept before other handlers
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen]);

  // Reset scroll position when panel opens
  useEffect(() => {
    if (isOpen && panelRef.current) {
      panelRef.current.scrollTop = 0;
    }
  }, [isOpen, title]);

  const panelWidth = layout.detailPanelWidth;
  const isMobile = layout.isMobile;

  return (
    <>
      {/* Backdrop overlay - covers left side, closes panel on click (desktop only) */}
      {!isMobile && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '50%',
            height: '100%',
            background: 'transparent',
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? 'auto' : 'none',
            transition: 'opacity 0.3s ease-out',
            zIndex: 99,
            cursor: 'pointer',
          }}
        />
      )}
      {/* Detail panel */}
      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: panelWidth,
          height: '100%',
          background: isMobile
            ? 'rgba(0,0,0,0.95)'
            : 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 10%, rgba(0,0,0,0.9) 100%)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-out',
          padding: isMobile ? '60px 20px 80px' : '80px 60px',
          boxSizing: 'border-box',
          overflowY: 'auto',
          zIndex: 100,
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: isMobile ? '15px' : '20px',
            right: isMobile ? '15px' : '20px',
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            color: 'white',
            padding: isMobile ? '10px 16px' : '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: isMobile ? '16px' : '14px',
          }}
        >
          {isMobile ? '← Back' : 'ESC to close'}
        </button>

        <h2
          style={{
            color: 'white',
            fontSize: isMobile ? '22px' : '28px',
            fontWeight: 600,
            marginBottom: isMobile ? '16px' : '24px',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            paddingRight: isMobile ? '80px' : '0',
          }}
        >
          {title}
        </h2>

        <div
          style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: isMobile ? '15px' : '16px',
            lineHeight: 1.6,
          }}
        >
          {children || (
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>
              Content coming soon...
            </p>
          )}
        </div>

        {/* Scroll hint - only on desktop */}
        {!isMobile && (
          <div
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '11px',
              textAlign: 'right',
            }}
          >
            ↑↓ Scroll · PgUp/PgDn · Home/End
          </div>
        )}
      </div>
    </>
  );
}
