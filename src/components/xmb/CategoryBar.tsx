import type { XMBCategory } from '../../types';
import { XMBIcon } from './XMBIcon';

interface CategoryBarProps {
  categories: XMBCategory[];
  selectedIndex: number;
}

// Fixed X position for the selected category (left-ish, like PS3)
// This is the LEFT EDGE of the selected category icon
const INTERSECTION_X_PERCENT = 25;
const CATEGORY_ICON_SIZE = 100; // Size of category icon (larger)
const CATEGORY_SPACING = 160; // px between category centers
const CATEGORY_Y = 260; // Fixed Y position for horizontal bar center

export function CategoryBar({ categories, selectedIndex }: CategoryBarProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: CATEGORY_Y,
        left: 0,
        right: 0,
        height: '80px',
        pointerEvents: 'none',
      }}
    >
      {categories.map((category, index) => {
        const offsetFromSelected = index - selectedIndex;
        const xOffset = offsetFromSelected * CATEGORY_SPACING;
        const isSelected = index === selectedIndex;

        return (
          <div
            key={category.id}
            style={{
              position: 'absolute',
              // Position so the CENTER of this icon is at INTERSECTION_X + half icon width + offset
              left: `calc(${INTERSECTION_X_PERCENT}% + ${CATEGORY_ICON_SIZE / 2}px + ${xOffset}px)`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              transition: 'left 0.3s ease-out, opacity 0.3s ease-out',
              opacity: isSelected ? 1 : 0.7,
            }}
          >
            <XMBIcon
              icon={category.icon}
              label={category.label}
              isSelected={isSelected}
              isCategory={true}
            />
          </div>
        );
      })}
    </div>
  );
}

export { INTERSECTION_X_PERCENT, CATEGORY_ICON_SIZE, CATEGORY_Y };
