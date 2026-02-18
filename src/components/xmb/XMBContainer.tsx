import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useXMBNavigation } from '../../hooks/useXMBNavigation';
import { useAudio } from '../../hooks/useAudio';
import { WaveBackground } from './WaveBackground';
import { CategoryBar } from './CategoryBar';
import { ItemList } from './ItemList';
import { DetailPanel } from './DetailPanel';
import { ThemeSelector } from './ThemeSelector';
import { ContentRenderer } from './ContentRenderer';
import { loadSettings, saveSettings } from '../../utils/storage';
import { parseHash, updateUrl } from '../../utils/routing';
import type { XMBCategory, Profile, Experience, Project, Skill, OpenSourceProject, Settings, ThemeColor, XMBCategoryId } from '../../types';

// Import data
import profileData from '../../data/profile.json';
import experienceData from '../../data/experience.json';
import projectsData from '../../data/projects.json';
import skillsData from '../../data/skills.json';
import opensourceData from '../../data/opensource.json';
import { writings } from '../../data/writings';

interface XMBContainerProps {
  initialSettings?: Settings;
}

// Theme display names
const themeNames: Record<ThemeColor, string> = {
  blue: 'Blue',
  red: 'Red',
  green: 'Green',
  purple: 'Purple',
  orange: 'Orange',
  pink: 'Pink',
};

// Entrance animation phases
type EntrancePhase = 'background' | 'ribbons' | 'icons' | 'complete';

export function XMBContainer({ initialSettings }: XMBContainerProps) {
  const [settings, setSettings] = useState<Settings>(
    () => initialSettings || loadSettings()
  );
  const [entrancePhase, setEntrancePhase] = useState<EntrancePhase>('background');

  // Parse initial navigation from URL hash
  // Don't open detail panel immediately - wait for entrance animation
  const initialNavigation = useMemo(() => {
    const parsed = parseHash(window.location.hash);
    if (parsed) {
      // Navigate to category/item but don't open detail panel yet
      return { ...parsed, openDetail: false };
    }
    return null;
  }, []);

  // Track if we should open detail panel after entrance (use ref to avoid setState in effect)
  const pendingDetailOpenRef = useRef(
    parseHash(window.location.hash)?.openDetail ?? false
  );

  // Update URL when navigation changes
  const handleNavigationChange = useCallback((categoryId: XMBCategoryId, itemId: string, detailOpen: boolean) => {
    updateUrl(categoryId, itemId, detailOpen);
  }, []);

  // Staged entrance animation
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Background is already visible, start ribbons after a short delay
    timers.push(setTimeout(() => setEntrancePhase('ribbons'), 300));
    // Show icons after ribbons have started
    timers.push(setTimeout(() => setEntrancePhase('icons'), 800));
    // Mark entrance complete
    timers.push(setTimeout(() => setEntrancePhase('complete'), 1500));

    return () => timers.forEach(clearTimeout);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Audio system - user has already interacted via boot sequence
  const { playNavigate, playSelect, playBack } = useAudio({
    enabled: settings.soundEnabled,
    userHasInteracted: true,
  });

  // Build categories from data
  const categories: XMBCategory[] = useMemo(() => {
    const profile = profileData as Profile;
    const experiences = experienceData as Experience[];
    const projects = projectsData as Project[];
    const skills = skillsData as Skill[];

    return [
      {
        id: 'profile',
        label: 'Profile',
        icon: 'user',
        items: [
          { id: 'about', label: profile.name, subtitle: profile.title, data: profile },
          { id: 'philosophy', label: 'Philosophy', subtitle: 'Guiding principles', data: profile.philosophy },
          { id: 'education', label: 'Education', subtitle: profile.education[0]?.institution, data: profile.education },
          { id: 'contact', label: 'Contact', subtitle: 'Get in touch', data: profile.contact },
          ...skills.map((skill) => ({
            id: skill.id,
            label: skill.name,
            subtitle: skill.description.slice(0, 50) + '...',
            icon: skill.icon,
            data: skill,
          })),
        ],
      },
      {
        id: 'experience',
        label: 'Experience',
        icon: 'briefcase',
        items: experiences.map((exp) => ({
          id: exp.id,
          label: exp.title,
          subtitle: `${exp.company} · ${exp.startYear}–${exp.endYear ?? 'Present'}`,
          data: exp,
        })),
      },
      {
        id: 'projects',
        label: 'Projects',
        icon: 'folder',
        items: projects.map((project) => ({
          id: project.id,
          label: project.name,
          subtitle: `${project.role} · ${project.year}`,
          data: project,
        })),
      },
      {
        id: 'opensource',
        label: 'Open Source',
        icon: 'code',
        items: (opensourceData as OpenSourceProject[]).map((repo) => ({
          id: repo.id,
          label: repo.name,
          subtitle: `${repo.language} · ${repo.tags[0]}`,
          data: repo,
        })),
      },
      {
        id: 'writing',
        label: 'Writing',
        icon: 'pencil',
        items: writings.map((w) => ({
          id: w.id,
          label: w.title,
          subtitle: w.description.slice(0, 40) + '...',
          data: { type: 'writing', ...w },
        })),
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: 'gear',
        items: [
          {
            id: 'theme',
            label: 'Theme',
            subtitle: themeNames[settings.theme],
            icon: 'theme',
            data: { type: 'theme' },
          },
          {
            id: 'sound',
            label: 'Sound',
            subtitle: settings.soundEnabled ? 'Enabled' : 'Disabled',
            data: { type: 'sound' },
          },
          { id: 'credits', label: 'Credits', subtitle: 'About this site', data: { type: 'credits' } },
        ],
      },
    ];
  }, [settings]);

  const {
    state,
    currentCategory,
    currentItemIndex,
    currentItem,
    goToCategory,
    goToItem,
    navigateUp,
    navigateDown,
    back,
    select,
  } = useXMBNavigation({
    categories,
    initialNavigation,
    onSelect: (categoryId, itemId) => {
      // Handle settings toggles (except theme which uses the panel)
      if (categoryId === 'settings') {
        if (itemId === 'sound') {
          setSettings((prev) => ({
            ...prev,
            soundEnabled: !prev.soundEnabled,
          }));
        }
      }
    },
    onNavigate: playNavigate,
    onConfirm: playSelect,
    onBack: playBack,
    onNavigationChange: handleNavigationChange,
  });

  // Open detail panel after entrance animation if URL requested it
  useEffect(() => {
    if (entrancePhase === 'complete' && pendingDetailOpenRef.current) {
      pendingDetailOpenRef.current = false;
      select();
    }
  }, [entrancePhase, select]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <WaveBackground
        theme={settings.theme}
        showRibbons={entrancePhase !== 'background'}
      />

      {/* Icons fade in after ribbons */}
      <div
        style={{
          opacity: entrancePhase === 'background' || entrancePhase === 'ribbons' ? 0 : 1,
          transition: 'opacity 0.6s ease-out',
        }}
      >
        <CategoryBar
          categories={categories}
          selectedIndex={state.selectedCategoryIndex}
          onCategoryClick={goToCategory}
        />

        {currentCategory && (
          <ItemList
            items={currentCategory.items}
            selectedIndex={currentItemIndex}
            categoryIcon={currentCategory.icon}
            onItemClick={goToItem}
            onWheel={(deltaY) => {
              if (deltaY > 0) {
                navigateDown();
              } else if (deltaY < 0) {
                navigateUp();
              }
            }}
          />
        )}
      </div>

      <DetailPanel
        isOpen={state.detailPanelOpen}
        title={currentItem?.label || ''}
        onClose={back}
      >
        {state.detailPanelOpen && currentItem?.id === 'theme' ? (
          <ThemeSelector
            currentTheme={settings.theme}
            onSelect={(theme) => setSettings((prev) => ({ ...prev, theme }))}
          />
        ) : currentItem ? (
          <ContentRenderer itemId={currentItem.id} data={currentItem.data} />
        ) : null}
      </DetailPanel>

      {/* Navigation hint */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '12px',
          textAlign: 'center',
        }}
      >
        ← → Navigate Categories | ↑ ↓ Navigate Items | Enter Select | Esc Back | Click or Scroll to Navigate
      </div>
    </div>
  );
}
