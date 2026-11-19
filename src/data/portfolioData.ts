import { Project, SkillCategory, ExperienceItem, SystemPillar } from '../types';

export const PERSONAL_INFO = {
  name: 'John Developer',
  role: 'Software Engineer & Systems Architect',
  tagline: 'Architecting high-concurrency systems, liquid-smooth interfaces, and resilient web infrastructure.',
  bio: 'I specialize in full-stack distributed systems, browser engine performance, and tactile interaction design. I build applications that are mathematically robust, performant at scale, and feel exceptionally fluid.',
  location: 'San Francisco, CA',
  status: 'Open for Engineering Opportunities',
  email: 'john.developer@gmail.com',
  github: 'https://github.com',
  x: 'https://x.com',
  dribbble: 'https://dribbble.com',
  linkedin: 'https://linkedin.com',
};

export const DYNAMIC_ROLES = ['Systems & UI Architect'];

export const SYSTEM_PILLARS: SystemPillar[] = [
  {
    id: 'distributed-runtimes',
    title: 'Distributed Runtimes & State Sync',
    badge: 'Core Architecture',
    role: 'Backend & Concurrency',
    description: 'Constructing high-throughput data processing engines, CRDT-based deterministic state reconciliation, and fault-tolerant message streaming pipelines.',
    technologies: ['Go / Golang', 'TypeScript', 'gRPC', 'WebSockets', 'CRDTs', 'Redis Streams'],
    metrics: [
      { label: 'Event Ingestion', value: '120k/sec' },
      { label: 'P99 Synchronization', value: '< 14ms' },
      { label: 'State Convergence', value: '100% Deterministic' },
    ],
    details: [
      'Multi-threaded ring buffers using SharedArrayBuffer for lock-free cross-worker queues.',
      'Delta-encoded binary protocol over WebSockets reducing egress payloads by 68%.',
      'Idempotent distributed consensus via monotonic fencing tokens and Redis Redlock.',
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'bookverse-platform',
    title: 'BookVerse Digital Platform',
    tagline: 'Full-stack enterprise digital bookstore & audiobook ecosystem with real-time inventory and payments',
    category: 'Systems & UI',
    featured: true,
    year: '2025',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80',
    tags: ['Java EE', 'MySQL', 'Android', 'Firebase', 'REST API', 'Stripe'],
    gradient: '',
    accentColor: '#0071e3',
    demoUrl: 'https://example.com/bookverse',
    githubUrl: 'https://github.com/example/bookverse-platform',
    overview: 'BookVerse is an end-to-end multi-platform digital literature distribution system. It unites a robust Java enterprise backend with MySQL transactional storage, an Android reader application, and Firebase real-time user notification synchronizers.',
    challenge: 'Handling simultaneous flash-sale purchasing spikes while maintaining atomic inventory locks across web and native Android clients without race conditions.',
    solution: 'Designed an idempotent order management pipeline with strict transactional row locks in MySQL, paired with asynchronous Firebase cloud events for instant receipt dispatch.',
    metrics: [
      { label: 'Catalog Capacity', value: '45,000+ titles' },
      { label: 'Order Processing', value: '< 180ms' },
      { label: 'Transaction Integrity', value: '100% ACID' },
    ],
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Frontend Architecture & Systems',
    subtitle: 'High-performance UI engineering, state engines, and reactive ergonomics',
    skills: [
      {
        name: 'TypeScript & Modern JavaScript',
        tier: 'Production',
        context: 'Daily Core Tooling',
        iconName: 'Code',
        description: 'Advanced generics, type-level programming, strict AST analysis, and library architecture.',
        tags: ['Strict Mode', 'Generics', 'AST Analysis', 'Modular ESM'],
      },
    ],
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'exp-1',
    period: '2023 — Present',
    role: 'Staff Software Engineer / Architecture Lead',
    company: 'Apex Systems Lab (San Francisco, CA)',
    location: 'San Francisco, CA',
    description: 'Leading the core web architecture and systems team, developing high-throughput real-time web applications, design systems, and developer infrastructure.',
    highlights: [
      'Architected the internal real-time canvas engine that scaled to 350+ simultaneous concurrent peers with <15ms latency.',
      'Established engineering-wide web performance standards, improving Core Web Vitals (INP and LCP) by 42%.',
      'Engineered an enterprise design token architecture adopted by 24 product teams across web and mobile.',
    ],
    technologies: ['TypeScript', 'React 19', 'Go', 'WebSockets', 'Tailwind CSS', 'Motion'],
  },
];

export const PHILOSOPHY = [
  {
    title: 'Mathematical Cohesion & Ratios',
    description: 'Every easing curve, border radius, and typographic step should follow mathematical ratios. When visual rhythm aligns with underlying logic, interfaces feel intrinsically stable and intuitive.',
    badge: 'Precision Geometry',
  },
];
