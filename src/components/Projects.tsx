import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowRight, Eye, Layers, Sparkles, ExternalLink, Github, CheckCircle2 } from 'lucide-react';
import { PROJECTS } from '../data/portfolioData';
import { Project, Theme } from '../types';
import { ProjectModal } from './ProjectModal';
import { soundEngine } from '../services/soundEngine';

interface ProjectsProps {
  theme: Theme;
}

const CATEGORIES = ['All', 'Systems & UI', 'Creative Tech'] as const;

export const Projects: React.FC<ProjectsProps> = ({ theme }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Spotlight project (BookVerse or first featured)
  const spotlightProject = PROJECTS.find((p) => p.id === 'bookverse-platform') || PROJECTS[0];

  const galleryProjects = (
    selectedCategory === 'All'
      ? PROJECTS.filter((p) => p.id !== spotlightProject.id)
      : PROJECTS.filter((p) => p.category === selectedCategory && p.id !== spotlightProject.id)
  );

  const handleSelectCategory = (cat: string) => {
    soundEngine.playTick();
    setSelectedCategory(cat);
  };

  const openProject = (project: Project, noteIndex: number = 3) => {
    soundEngine.playMarimbaNote(noteIndex);
    setActiveProject(project);
  };

  return (
    <section id="projects" className="scroll-mt-24 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative max-w-7xl mx-auto">
      {/* Background Soft Ambient Glow */}
      <div className="absolute top-1/4 right-10 w-80 h-80 rounded-full bg-emerald-500/[0.04] blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium mb-3 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <Layers className="w-3.5 h-3.5" />
            <span>Case Studies & Systems Gallery</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#181c19]'}`}>
            Selected Work & Architecture.
          </h2>
          <p className="text-[#6e7670] dark:text-[#9ea8a0] text-sm sm:text-base mt-2 max-w-xl leading-relaxed">
            Deep technical case studies: multi-platform ecosystems, distributed runtimes, and real-time collaboration engines built for scale.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] backdrop-blur-md border border-black/[0.06] dark:border-white/10">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => handleSelectCategory(cat)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              className={`px-4 py-1.5 rounded-xl text-xs font-mono font-medium cursor-pointer transition-all ${
                selectedCategory === cat
                  ? theme === 'dark'
                    ? 'bg-white/15 text-white shadow-sm font-semibold'
                    : 'bg-white text-emerald-800 shadow-sm font-semibold border border-black/[0.04]'
                  : theme === 'dark'
                    ? 'text-[#86868b] hover:text-white'
                    : 'text-[#6e7670] hover:text-[#181c19]'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* FEATURED SPOTLIGHT PROJECT CARD (Refined Floating Glass Material) */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`mb-14 rounded-[24px] overflow-hidden transition-all duration-300 relative ${
          theme === 'dark' ? 'floating-glass-dark' : 'floating-glass-light'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Visual Showcase Left (7 cols) */}
          <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-auto overflow-hidden bg-slate-950 group">
            <img
              src={spotlightProject.image}
              alt={spotlightProject.title}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950/80 via-slate-950/30 to-transparent" />

            {/* Spotlight Banner Badge */}
            <div className="absolute top-5 left-5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-black/60 text-white backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#35D07F] shadow-[0_0_8px_rgba(53,208,127,0.4)]" />
                Featured Engineering Case Study
              </span>
            </div>

            {/* Quick Metrics floating glass overlay */}
            <div className="absolute bottom-5 left-5 right-5 sm:right-auto flex flex-wrap gap-2.5">
              {spotlightProject.metrics.map((m, mIdx) => (
                <div
                  key={mIdx}
                  className="px-3.5 py-2 rounded-2xl bg-black/60 backdrop-blur-md text-white flex items-center gap-2 text-xs font-mono"
                >
                  <span className="text-[#35D07F] font-semibold">{m.value}</span>
                  <span className="text-slate-300 text-[11px]">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Case Study Details Right (5 cols) */}
          <div className="lg:col-span-5 p-7 sm:p-9 lg:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 text-xs font-mono text-[#6e7670] dark:text-slate-400">
                <span>{spotlightProject.category}</span>
                <span>{spotlightProject.year}</span>
              </div>

              <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight mb-3 ${theme === 'dark' ? 'text-white' : 'text-[#181c19]'}`}>
                {spotlightProject.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#6e7670] dark:text-[#9ea8a0] leading-relaxed mb-6">
                {spotlightProject.tagline}
              </p>

              {/* Engineering Highlight Box (Subtle translucent glass) */}
              <div className="p-4 rounded-2xl mb-6 bg-black/[0.03] dark:bg-white/[0.04]">
                <div className="text-xs font-mono font-semibold mb-1 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Engineering Highlights:
                </div>
                <div className="text-xs sm:text-sm text-[#6e7670] dark:text-slate-300 leading-relaxed">
                  Designed order management, atomic row inventory locks, payment configuration, and background audiobook processing.
                </div>
              </div>

              {/* Stack Chips */}
              <div className="flex flex-wrap gap-1.5 mb-8">
                {spotlightProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs font-mono px-3 py-1 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-white/[0.05] text-slate-200'
                        : 'bg-black/[0.04] text-[#181c19]'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Compelling Call to Action */}
            <div className="flex items-center gap-3 pt-4 border-t border-black/[0.04] dark:border-white/[0.06]">
              <motion.button
                onClick={() => openProject(spotlightProject, 4)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="apple-btn-forest px-6 py-3 rounded-full text-xs font-mono font-semibold flex items-center gap-2 cursor-pointer"
              >
                <span>View Case Study</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              {spotlightProject.githubUrl && (
                <a
                  href={spotlightProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-full transition-all ${
                    theme === 'dark'
                      ? 'bg-white/[0.06] text-slate-300 hover:text-white shadow-sm'
                      : 'bg-white text-[#181c19] hover:bg-slate-50 shadow-sm'
                  }`}
                  title="Source Code"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>

          </div>

        </div>
      </motion.div>

      {/* CURATED CASE STUDY GALLERY GRID (Floating Glass Panels without colored borders) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {galleryProjects.map((project, idx) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.06 }}
            whileHover={{ 
              y: -3,
              transition: { duration: 0.2, ease: 'easeOut' }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openProject(project, idx + 1)}
            className={`group relative rounded-[22px] overflow-hidden cursor-pointer flex flex-col ${
              theme === 'dark' ? 'floating-glass-dark' : 'floating-glass-light'
            }`}
          >
            {/* Image Showcase */}
            <div className="relative h-56 w-full overflow-hidden bg-slate-900">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-85" />

              {/* Floating Category Pill */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[11px] font-mono font-medium tracking-wide bg-black/60 text-white border border-white/15 backdrop-blur-md">
                  {project.category}
                </span>
              </div>

              {/* Year Badge */}
              <div className="absolute top-4 right-4">
                <span className="text-[11px] font-mono text-white/90 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md">
                  {project.year}
                </span>
              </div>

              {/* Hover Reveal Action */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-950/40 backdrop-blur-[2px]">
                <div className="px-4 py-2 rounded-full bg-white text-[#181c19] text-xs font-semibold flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Inspect Case Study</span>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className={`text-lg font-bold tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center justify-between ${theme === 'dark' ? 'text-white' : 'text-[#181c19]'}`}>
                  <span>{project.title}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#6e7670] group-hover:text-emerald-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </h3>
                <p className="text-xs sm:text-sm text-[#6e7670] dark:text-[#9ea8a0] mt-2 line-clamp-2 leading-relaxed">
                  {project.tagline}
                </p>
              </div>

              {/* Tags and Metric Footer */}
              <div className="mt-6 pt-4 border-t border-black/[0.06] dark:border-white/10 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5 max-w-[70%]">
                  {project.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${
                        theme === 'dark' ? 'bg-white/[0.08] text-slate-300' : 'bg-black/[0.04] text-[#181c19]'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 2 && (
                    <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-md bg-black/[0.04] dark:bg-white/[0.08] text-[#6e7670]">
                      +{project.tags.length - 2}
                    </span>
                  )}
                </div>

                <span className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                  {project.metrics[0].value}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Case Study Modal */}
      <ProjectModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        theme={theme}
      />
    </section>
  );
};
