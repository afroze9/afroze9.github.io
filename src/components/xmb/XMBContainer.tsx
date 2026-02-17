import { useMemo, useState, useEffect } from 'react';
import { useXMBNavigation } from '../../hooks/useXMBNavigation';
import { WaveBackground } from './WaveBackground';
import { CategoryBar } from './CategoryBar';
import { ItemList } from './ItemList';
import { DetailPanel } from './DetailPanel';
import { ThemeSelector } from './ThemeSelector';
import { loadSettings, saveSettings } from '../../utils/storage';
import type { XMBCategory, Profile, Experience, Project, Skill, Settings, ThemeColor } from '../../types';

// Import data
import profileData from '../../data/profile.json';
import experienceData from '../../data/experience.json';
import projectsData from '../../data/projects.json';
import skillsData from '../../data/skills.json';

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

export function XMBContainer({ initialSettings }: XMBContainerProps) {
  const [settings, setSettings] = useState<Settings>(
    () => initialSettings || loadSettings()
  );

  // Save settings to localStorage whenever they change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

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
        id: 'writing',
        label: 'Writing',
        icon: 'pencil',
        items: [
          {
            id: 'batch-reporting-tool',
            label: 'A Simple Batch Reporting Tool',
            subtitle: 'Healthcare automation case study',
            data: { slug: 'batch-reporting-tool' },
          },
        ],
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
    back,
  } = useXMBNavigation({
    categories,
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
  });

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <WaveBackground theme={settings.theme} />

      <CategoryBar categories={categories} selectedIndex={state.selectedCategoryIndex} />

      {currentCategory && (
        <ItemList
          items={currentCategory.items}
          selectedIndex={currentItemIndex}
          categoryIcon={currentCategory.icon}
        />
      )}

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
        ) : currentItem?.data ? (
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>
            {JSON.stringify(currentItem.data, null, 2)}
          </pre>
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
        ← → Navigate Categories | ↑ ↓ Navigate Items | Enter Select | Esc Back
      </div>
    </div>
  );
}
