import type { CSSProperties } from 'react';
import {
  User,
  Briefcase,
  Folder,
  Pencil,
  Settings,
  Brain,
  Cloud,
  Users,
  RefreshCw,
  FileText,
  Code,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface XMBIconProps {
  icon: string;
  label: string;
  isSelected: boolean;
  isCategory?: boolean;
  showLabel?: boolean;
  style?: CSSProperties;
}

// Lucide icon mapping
const iconMap: Record<string, LucideIcon> = {
  user: User,
  briefcase: Briefcase,
  folder: Folder,
  pencil: Pencil,
  gear: Settings,
  brain: Brain,
  cloud: Cloud,
  users: Users,
  refresh: RefreshCw,
  file: FileText,
  code: Code,
};

export function XMBIcon({
  icon,
  label,
  isSelected,
  isCategory = false,
  showLabel = true,
  style
}: XMBIconProps) {
  const IconComponent = iconMap[icon] || FileText;

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
          // No background box - just brightness change like PS3
          filter: isSelected ? 'brightness(1.3)' : 'brightness(0.7)',
          transition: 'all 0.2s ease-out',
        }}
      >
        <IconComponent
          size={size * 0.55}
          color="white"
          strokeWidth={1.5}
        />
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
