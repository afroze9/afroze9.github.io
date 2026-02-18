// Profile types
export interface ContactLinks {
  linkedin: string;
  github: string;
  email: string;
}

export interface Stats {
  yearsExperience: number;
  engineersLed: number;
  developersImpacted: number;
  clientsServed: number;
}

export interface TimelineEntry {
  year: number;
  event: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  philosophy: string[];
  timeline: TimelineEntry[];
  education: Education[];
  contact: ContactLinks;
  stats: Stats;
}

// Experience types
export interface Experience {
  id: string;
  company: string;
  title: string;
  startYear: number;
  endYear: number | null;
  description: string;
  achievements: string[];
  technologies: string[];
}

// Project types
export interface Project {
  id: string;
  name: string;
  year: number;
  description: string;
  technologies: string[];
  role: string;
  category: 'featured' | 'additional';
}

// Skills types
export interface Skill {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

// Impact types
export interface Impact {
  id: string;
  metric: string;
  value: string;
  description: string;
}

// Open Source types
export interface OpenSourceProject {
  id: string;
  name: string;
  description: string;
  url: string;
  language: string;
  tags: string[];
}

// Blog post types
export interface BlogPostFrontmatter {
  title: string;
  date: string;
  description: string;
  tags: string[];
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogPostFrontmatter;
  content: string;
}

// XMB types
export type XMBCategoryId = 'profile' | 'experience' | 'projects' | 'opensource' | 'writing' | 'settings';

export interface XMBItem {
  id: string;
  label: string;
  subtitle?: string;
  icon?: string;
  data?: unknown;
}

export interface XMBCategory {
  id: XMBCategoryId;
  label: string;
  icon: string;
  items: XMBItem[];
}

// Theme colors (PS3-style)
export type ThemeColor = 'blue' | 'red' | 'green' | 'purple' | 'orange' | 'pink';

// Settings types
export interface Settings {
  theme: ThemeColor;
  soundEnabled: boolean;
}

// Navigation state
export interface XMBNavigationState {
  selectedCategoryIndex: number;
  selectedItemIndices: Record<XMBCategoryId, number>;
  detailPanelOpen: boolean;
}
