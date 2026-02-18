import type { XMBItem } from "../../types";
import { useLayout } from "../../context/LayoutContext";
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
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ItemListProps {
  items: XMBItem[];
  selectedIndex: number;
  categoryIcon: string;
  onItemClick?: (index: number) => void;
  onWheel?: (deltaY: number) => void;
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

// CSS keyframes for pulsing glow (injected once)
const pulseKeyframes = `
@keyframes textGlow {
  0%, 100% {
    text-shadow: 0 0 8px rgba(255,255,255,0.4), 0 0 16px rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.7);
  }
  50% {
    text-shadow: 0 0 12px rgba(255,255,255,0.6), 0 0 24px rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.7);
  }
}
`;

// Inject keyframes into document
if (typeof document !== "undefined") {
  const styleId = "xmb-item-list-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = pulseKeyframes;
    document.head.appendChild(style);
  }
}

export function ItemList({
  items,
  selectedIndex,
  categoryIcon,
  onItemClick,
  onWheel,
}: ItemListProps) {
  const layout = useLayout();

  if (items.length === 0) {
    return null;
  }

  // Responsive layout values
  const iconSize = layout.categoryIconSize;
  const itemIconSize = iconSize * 0.85;
  const itemIconSelectedSize = iconSize;
  const itemSpacing = layout.itemSpacing;
  const belowBarGap = layout.belowBarGap;
  const intersectionX = layout.intersectionX;
  const intersectionY = layout.intersectionY;
  const aboveBarGap = 0;
  const textOffset = iconSize + (layout.isMobile ? 8 : 15);

  const getItemY = (index: number): number => {
    const offsetFromSelected = index - selectedIndex;

    // Category bar center is at intersectionY
    const categoryBarTop = intersectionY - iconSize / 2;
    const categoryBarBottom = intersectionY + iconSize / 2;

    if (offsetFromSelected < 0) {
      // Items ABOVE selected - position above the category bar
      const firstAboveY = categoryBarTop - aboveBarGap - itemIconSize;
      return firstAboveY + (offsetFromSelected + 1) * itemSpacing;
    } else {
      // Selected item (0) and items below - position below the category bar
      const firstBelowY = categoryBarBottom + belowBarGap;
      return firstBelowY + offsetFromSelected * itemSpacing;
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (onWheel) {
      e.preventDefault();
      onWheel(e.deltaY);
    }
  };

  return (
    <div
      onWheel={handleWheel}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {items.map((item, index) => {
        const yPosition = getItemY(index);
        const isSelected = index === selectedIndex;
        const IconComponent = iconMap[item.icon || categoryIcon] || FileText;
        const currentIconSize = isSelected ? itemIconSelectedSize : itemIconSize;

        return (
          <div
            key={item.id}
            onClick={() => onItemClick?.(index)}
            style={{
              position: "absolute",
              left: `${intersectionX}%`,
              top: yPosition,
              transition: "top 0.3s ease-out, opacity 0.3s ease-out",
              display: "flex",
              alignItems: "center",
              opacity: isSelected ? 1 : 0.6,
              height: itemIconSelectedSize,
              cursor: "pointer",
              pointerEvents: "auto",
            }}
          >
            {/* Icon container - fixed width to keep icons centered */}
            <div
              style={{
                width: itemIconSelectedSize,
                height: itemIconSelectedSize,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {/* Actual icon - grows when selected but stays centered in container */}
              <div
                style={{
                  width: currentIconSize,
                  height: currentIconSize,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  filter: isSelected ? "brightness(1.2)" : "brightness(0.8)",
                  transition: "all 0.2s ease-out",
                }}
              >
                <IconComponent
                  size={currentIconSize * 0.5}
                  color="white"
                  strokeWidth={1.5}
                />
              </div>
            </div>
            {/* Label and subtitle - fixed position from left edge */}
            <div
              style={{
                marginLeft: textOffset - itemIconSelectedSize,
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                maxWidth: layout.isMobile ? 'calc(100vw - 100px)' : 'none',
              }}
            >
              <span
                style={{
                  color: "white",
                  fontSize: isSelected ? `${layout.itemFontSize}px` : `${layout.itemFontSize - 3}px`,
                  fontWeight: isSelected ? 600 : 400,
                  textShadow: isSelected
                    ? undefined
                    : "0 2px 4px rgba(0,0,0,0.7)",
                  whiteSpace: layout.isMobile ? "normal" : "nowrap",
                  overflow: layout.isMobile ? "visible" : "hidden",
                  textOverflow: "ellipsis",
                  transition: "font-size 0.2s ease-out",
                  animation: isSelected ? "textGlow 2s ease-in-out infinite" : "none",
                  lineHeight: 1.2,
                }}
              >
                {item.label}
              </span>
              {item.subtitle && (
                <span
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    fontSize: `${layout.subtitleFontSize}px`,
                    fontWeight: 400,
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                    whiteSpace: layout.isMobile ? "normal" : "nowrap",
                    overflow: layout.isMobile ? "visible" : "hidden",
                    textOverflow: "ellipsis",
                    transition: "font-size 0.2s ease-out",
                    lineHeight: 1.2,
                  }}
                >
                  {item.subtitle}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
