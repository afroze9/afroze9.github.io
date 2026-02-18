import type { XMBCategory } from '../../types';
import { XMBIcon } from './XMBIcon';
import { useLayout } from '../../context/LayoutContext';

interface CategoryBarProps {
  categories: XMBCategory[];
  selectedIndex: number;
  onCategoryClick?: (index: number) => void;
}

// Default values for export (used by ItemList)
export const INTERSECTION_X_PERCENT = 25;
export const CATEGORY_ICON_SIZE = 100;
export const CATEGORY_Y = 260;

export function CategoryBar({ categories, selectedIndex, onCategoryClick }: CategoryBarProps) {
  const layout = useLayout();

  const iconSize = layout.categoryIconSize;
  const spacing = layout.categorySpacing;
  const xPercent = layout.intersectionX;
  const yPosition = layout.intersectionY;

  return (
    <div
      style={{
        position: 'absolute',
        top: yPosition,
        left: 0,
        right: 0,
        height: `${iconSize}px`,
        pointerEvents: 'none',
      }}
    >
      {categories.map((category, index) => {
        const offsetFromSelected = index - selectedIndex;
        const xOffset = offsetFromSelected * spacing;
        const isSelected = index === selectedIndex;

        return (
          <div
            key={category.id}
            onClick={() => onCategoryClick?.(index)}
            style={{
              position: 'absolute',
              left: `calc(${xPercent}% + ${iconSize / 2}px + ${xOffset}px)`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              transition: 'left 0.3s ease-out, opacity 0.3s ease-out',
              opacity: isSelected ? 1 : 0.7,
              pointerEvents: 'auto',
              cursor: 'pointer',
            }}
          >
            <XMBIcon
              icon={category.icon}
              label={category.label}
              isSelected={isSelected}
              isCategory={true}
              size={iconSize}
            />
          </div>
        );
      })}
    </div>
  );
}
