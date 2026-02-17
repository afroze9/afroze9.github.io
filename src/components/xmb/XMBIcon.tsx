import type { CSSProperties } from 'react';

interface XMBIconProps {
  icon: string;
  label: string;
  isSelected: boolean;
  isCategory?: boolean;
  showLabel?: boolean;
  style?: CSSProperties;
}

// Simple icon mapping - will be replaced with actual SVG icons
const iconMap: Record<string, string> = {
  user: '👤',
  briefcase: '💼',
  folder: '📁',
  pencil: '✏️',
  gear: '⚙️',
  brain: '🧠',
  cloud: '☁️',
  users: '👥',
  refresh: '🔄',
};

export function XMBIcon({
  icon,
  label,
  isSelected,
  isCategory = false,
  showLabel = true,
  style
}: XMBIconProps) {
  const iconChar = iconMap[icon] || '📄';

  // Categories: only show label when selected
  // For categories, label appears below icon
  const shouldShowLabel = isCategory ? (showLabel && isSelected) : showLabel;

  const baseSize = isCategory ? 90 : 70;
  const selectedSize = isCategory ? 100 : 80;
  const size = isSelected ? selectedSize : baseSize;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.2s ease-out',
        ...style,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.55,
          // No background box - just brightness change like PS3
          filter: isSelected ? 'brightness(1.3)' : 'brightness(0.7)',
          transition: 'all 0.2s ease-out',
        }}
      >
        {iconChar}
      </div>
      {shouldShowLabel && (
        <span
          style={{
            color: 'white',
            fontSize: '13px',
            fontWeight: isSelected ? 600 : 400,
            textShadow: '0 2px 4px rgba(0,0,0,0.6)',
            textAlign: 'center',
            maxWidth: '90px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
