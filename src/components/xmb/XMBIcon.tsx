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
  // Experience icons
  Award,
  TrendingUp,
  Target,
  Rocket,
  // Project icons
  Bot,
  Activity,
  MessageSquare,
  CreditCard,
  Server,
  Link,
  Video,
  DollarSign,
  Stethoscope,
  Smartphone,
  LayoutDashboard,
  UserCircle,
  FileSearch,
  BarChart3,
  Calendar,
  GraduationCap,
  Workflow,
  // Open source icons
  GitBranch,
  Shield,
  Kanban,
  Sparkles,
  Github,
  // Writing icons
  FileCode,
  // Settings icons
  Palette,
  Volume2,
  Info,
  Maximize,
  // Profile icons
  BookOpen,
  Mail,
  Heart,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface XMBIconProps {
  icon: string;
  label: string;
  isSelected: boolean;
  isCategory?: boolean;
  showLabel?: boolean;
  size?: number; // Base size override
  style?: CSSProperties;
}

// Lucide icon mapping
const iconMap: Record<string, LucideIcon> = {
  // Category icons
  user: User,
  briefcase: Briefcase,
  folder: Folder,
  pencil: Pencil,
  gear: Settings,
  code: Code,

  // Skills icons
  brain: Brain,
  cloud: Cloud,
  users: Users,
  refresh: RefreshCw,

  // Experience icons
  award: Award,
  'trending-up': TrendingUp,
  target: Target,
  rocket: Rocket,

  // Project icons
  bot: Bot,
  activity: Activity,
  'message-square': MessageSquare,
  'credit-card': CreditCard,
  server: Server,
  link: Link,
  video: Video,
  'dollar-sign': DollarSign,
  stethoscope: Stethoscope,
  smartphone: Smartphone,
  'layout-dashboard': LayoutDashboard,
  'user-circle': UserCircle,
  'file-search': FileSearch,
  'bar-chart': BarChart3,
  calendar: Calendar,
  'graduation-cap': GraduationCap,
  workflow: Workflow,

  // Open source icons
  'git-branch': GitBranch,
  shield: Shield,
  kanban: Kanban,
  sparkles: Sparkles,
  github: Github,

  // Writing icons
  'file-code': FileCode,
  file: FileText,

  // Settings icons
  palette: Palette,
  volume: Volume2,
  info: Info,
  maximize: Maximize,

  // Profile icons
  'book-open': BookOpen,
  mail: Mail,
  heart: Heart,
};

export function XMBIcon({
  icon,
  label,
  isSelected,
  isCategory = false,
  showLabel = true,
  size: sizeOverride,
  style
}: XMBIconProps) {
  const IconComponent = iconMap[icon] || FileText;

  // Categories: only show label when selected
  // For categories, label appears below icon
  const shouldShowLabel = isCategory ? (showLabel && isSelected) : showLabel;

  // Calculate size - use override if provided, otherwise use defaults
  const defaultBaseSize = isCategory ? 90 : 70;
  const baseSize = sizeOverride ?? defaultBaseSize;
  const selectedSize = isSelected ? baseSize * 1.1 : baseSize;
  const size = selectedSize;

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
