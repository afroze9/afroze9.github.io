import type { XMBItem } from "../../types";
import { CATEGORY_ICON_SIZE, CATEGORY_Y, INTERSECTION_X_PERCENT } from "./CategoryBar";

interface ItemListProps {
  items: XMBItem[];
  selectedIndex: number;
  categoryIcon: string;
}

// Use same size as category icons for consistency
const ITEM_ICON_SIZE = CATEGORY_ICON_SIZE * 0.85; // Slightly smaller than category
const ITEM_ICON_SELECTED_SIZE = CATEGORY_ICON_SIZE; // Selected matches category size
const ITEM_SPACING = 85; // Vertical spacing between items
const ABOVE_BAR_GAP = 0; // Gap between category bar and items above
const BELOW_BAR_GAP = 80; // Gap between category bar and items below (more push)
const TEXT_OFFSET = CATEGORY_ICON_SIZE + 15; // Text starts after icon + small gap

// Simple icon mapping (duplicated from XMBIcon for now)
const iconMap: Record<string, string> = {
  user: "👤",
  briefcase: "💼",
  folder: "📁",
  pencil: "✏️",
  gear: "⚙️",
  brain: "🧠",
  cloud: "☁️",
  users: "👥",
  refresh: "🔄",
};

export function ItemList({ items, selectedIndex, categoryIcon }: ItemListProps) {
  if (items.length === 0) {
    return null;
  }

  const getItemY = (index: number): number => {
    const offsetFromSelected = index - selectedIndex;

    // Category bar center is at CATEGORY_Y
    const categoryBarTop = CATEGORY_Y - CATEGORY_ICON_SIZE / 2;
    const categoryBarBottom = CATEGORY_Y + CATEGORY_ICON_SIZE / 2;

    if (offsetFromSelected < 0) {
      // Items ABOVE selected - position above the category bar
      // First item above should be flush with the top of the bar (with small gap)
      const firstAboveY = categoryBarTop - ABOVE_BAR_GAP - ITEM_ICON_SIZE;
      return firstAboveY + (offsetFromSelected + 1) * ITEM_SPACING;
    } else {
      // Selected item (0) and items below - position below the category bar
      const firstBelowY = categoryBarBottom + BELOW_BAR_GAP;
      return firstBelowY + offsetFromSelected * ITEM_SPACING;
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {items.map((item, index) => {
        const yPosition = getItemY(index);
        const isSelected = index === selectedIndex;
        const iconChar = iconMap[item.icon || categoryIcon] || "📄";
        const iconSize = isSelected ? ITEM_ICON_SELECTED_SIZE : ITEM_ICON_SIZE;

        return (
          <div
            key={item.id}
            style={{
              position: "absolute",
              left: `${INTERSECTION_X_PERCENT}%`,
              top: yPosition,
              transition: "top 0.3s ease-out, opacity 0.3s ease-out",
              display: "flex",
              alignItems: "center",
              opacity: isSelected ? 1 : 0.6,
              height: ITEM_ICON_SELECTED_SIZE, // Fixed height for alignment
            }}
          >
            {/* Icon container - fixed width to keep icons centered */}
            <div
              style={{
                width: ITEM_ICON_SELECTED_SIZE, // Fixed width container (same as category)
                height: ITEM_ICON_SELECTED_SIZE,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {/* Actual icon - grows when selected but stays centered in container */}
              <div
                style={{
                  width: iconSize,
                  height: iconSize,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: iconSize * 0.5,
                  filter: isSelected ? "brightness(1.2)" : "brightness(0.8)",
                  transition: "all 0.2s ease-out",
                }}
              >
                {iconChar}
              </div>
            </div>
            {/* Label and subtitle - fixed position from left edge */}
            <div
              style={{
                marginLeft: TEXT_OFFSET - ITEM_ICON_SELECTED_SIZE, // Keep text aligned
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <span
                style={{
                  color: "white",
                  fontSize: isSelected ? "17px" : "14px",
                  fontWeight: isSelected ? 600 : 400,
                  textShadow: "0 2px 4px rgba(0,0,0,0.7)",
                  whiteSpace: "nowrap",
                  transition: "font-size 0.2s ease-out",
                }}
              >
                {item.label}
              </span>
              {item.subtitle && (
                <span
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    fontSize: isSelected ? "12px" : "11px",
                    fontWeight: 400,
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                    whiteSpace: "nowrap",
                    transition: "font-size 0.2s ease-out",
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
