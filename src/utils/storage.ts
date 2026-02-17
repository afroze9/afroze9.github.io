import type { Settings, ThemeColor } from '../types';

const STORAGE_KEY = 'xmb-portfolio-settings';

const defaultSettings: Settings = {
  theme: 'blue',
  soundEnabled: true,
};

// Validate that a theme color is valid
function isValidTheme(theme: unknown): theme is ThemeColor {
  return ['blue', 'red', 'green', 'purple', 'orange', 'pink'].includes(theme as string);
}

// Load settings from localStorage
export function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultSettings;

    const parsed = JSON.parse(stored);

    // Validate and merge with defaults
    return {
      theme: isValidTheme(parsed.theme) ? parsed.theme : defaultSettings.theme,
      soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : defaultSettings.soundEnabled,
    };
  } catch {
    return defaultSettings;
  }
}

// Save settings to localStorage
export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage errors (e.g., quota exceeded, private browsing)
    console.warn('Failed to save settings to localStorage');
  }
}
