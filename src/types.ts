export type Theme = 'dark' | 'light';

export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: 'Creative Tech' | 'Systems & UI' | 'Spatial & Shaders' | 'Experimental';
  featured: boolean;
  year: string;
  image: string;
  tags: string[];
  gradient: string;
  accentColor: string;
  demoUrl?: string;
  githubUrl?: string;
  overview: string;
  challenge: string;
  solution: string;
  metrics: { label: string; value: string }[];
}

export type SkillTier = 'Production' | 'Advanced' | 'Exploration';

export interface SkillItem {
  name: string;
  tier: SkillTier;
  context: string;
  iconName: string;
  description: string;
  tags: string[];
}

export interface SkillCategory {
  title: string;
  subtitle: string;
  skills: SkillItem[];
}

export interface SystemPillar {
  id: string;
  title: string;
  badge: string;
  role: string;
  description: string;
  technologies: string[];
  metrics: { label: string; value: string }[];
  details: string[];
}

export interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  company: string;
  location: string;
  description: string;
  highlights: string[];
  technologies: string[];
}

export interface JellyParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  scaleX: number;
  scaleY: number;
}
