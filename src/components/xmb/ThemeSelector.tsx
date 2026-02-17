import { useState, useEffect, useCallback } from 'react';
import { Check } from 'lucide-react';
import type { ThemeColor } from '../../types';

interface ThemeSelectorProps {
  currentTheme: ThemeColor;
  onSelect: (theme: ThemeColor) => void;
}

// Theme color configurations with preview colors
const themes: { id: ThemeColor; name: string; colors: string[] }[] = [
  {
    id: 'blue',
    name: 'Blue',
    colors: ['#0d1b2a', '#1b3a5f', '#274c77', '#4a7fa8'],
  },
  {
    id: 'red',
    name: 'Red',
    colors: ['#2a0d0d', '#5f1b1b', '#772727', '#a84a4a'],
  },
  {
    id: 'green',
    name: 'Green',
    colors: ['#0d2a0d', '#1b5f1b', '#277727', '#4aa84a'],
  },
  {
    id: 'purple',
    name: 'Purple',
    colors: ['#1d0d2a', '#3d1b5f', '#522777', '#7a4aa8'],
  },
  {
    id: 'orange',
    name: 'Orange',
    colors: ['#2a1d0d', '#5f3d1b', '#775227', '#a87a4a'],
  },
  {
    id: 'pink',
    name: 'Pink',
    colors: ['#2a0d1d', '#5f1b4a', '#772760', '#a84a8a'],
  },
];

export function ThemeSelector({ currentTheme, onSelect }: ThemeSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState(() =>
    themes.findIndex((t) => t.id === currentTheme)
  );

  // Handle keyboard navigation within the grid
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const cols = 3; // 3 columns in grid
      const rows = 2; // 2 rows

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          e.stopPropagation();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : themes.length - 1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          e.stopPropagation();
          setSelectedIndex((prev) => (prev < themes.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          e.stopPropagation();
          setSelectedIndex((prev) => (prev >= cols ? prev - cols : prev + cols * (rows - 1)));
          break;
        case 'ArrowDown':
          e.preventDefault();
          e.stopPropagation();
          setSelectedIndex((prev) => (prev < cols ? prev + cols : prev - cols * (rows - 1)));
          break;
        case 'Enter':
          e.preventDefault();
          e.stopPropagation();
          onSelect(themes[selectedIndex].id);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [selectedIndex, onSelect]);

  // Sync selection when currentTheme changes externally
  useEffect(() => {
    const index = themes.findIndex((t) => t.id === currentTheme);
    if (index !== -1) setSelectedIndex(index);
  }, [currentTheme]);

  const handleClick = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      onSelect(themes[index].id);
    },
    [onSelect]
  );

  return (
    <div>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
        Choose a color theme for your XMB background. Use arrow keys to navigate, Enter to select.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          maxWidth: '400px',
        }}
      >
        {themes.map((theme, index) => {
          const isSelected = index === selectedIndex;
          const isCurrent = theme.id === currentTheme;

          return (
            <button
              key={theme.id}
              onClick={() => handleClick(index)}
              style={{
                position: 'relative',
                border: isSelected
                  ? '3px solid white'
                  : '3px solid transparent',
                borderRadius: '12px',
                padding: '4px',
                background: 'rgba(255,255,255,0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease-out',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                boxShadow: isSelected
                  ? '0 0 20px rgba(255,255,255,0.3)'
                  : 'none',
              }}
            >
              {/* Color gradient preview */}
              <div
                style={{
                  width: '100%',
                  height: '60px',
                  borderRadius: '8px',
                  background: `linear-gradient(135deg, ${theme.colors.join(', ')})`,
                  marginBottom: '8px',
                }}
              />

              {/* Theme name */}
              <div
                style={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: isSelected ? 600 : 400,
                  textAlign: 'center',
                  paddingBottom: '4px',
                }}
              >
                {theme.name}
              </div>

              {/* Checkmark for current theme */}
              {isCurrent && (
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(255,255,255,0.9)',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={16} color="#333" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
