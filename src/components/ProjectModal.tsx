import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Github, Sparkles, Cpu } from 'lucide-react';
import { Project } from '../types';
import { soundEngine } from '../services/soundEngine';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  theme,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundEngine.playTick();
        onClose();
      }
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            soundEngine.playTick();
            onClose();
          }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Container (Floating Glass Material) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', stiffness: 450, damping: 26 }}
          className={`relative w-full max-w-3xl rounded-[28px] z-10 overflow-hidden shadow-2xl my-8 ${
            theme === 'dark' ? 'floating-glass-dark text-white' : 'floating-glass-light text-[#181c19]'
          }`}
        >
          {/* Header Image with Gradient Overlay */}
          <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-slate-900">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Close Button */}
            <motion.button
              onClick={() => {
                soundEngine.playTick();
                onClose();
              }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </motion.button>

            {/* Title & Badge on Image */}
            <div className="absolute bottom-6 left-6 right-6">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md mb-2 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#35D07F]" />
                {project.category} • {project.year}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {project.title}
              </h2>
              <p className="text-sm text-slate-200 mt-1 max-w-xl">
                {project.tagline}
              </p>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <motion.span
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-medium ${
                    theme === 'dark'
                      ? 'bg-white/[0.06] text-slate-200'
                      : 'bg-black/[0.04] text-[#181c19]'
                  }`}
                >
                  {tag}
                </motion.span>
              ))}
            </div>

            {/* Overview */}
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#6e7670] dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#35D07F]" />
                <span>Architecture & Purpose</span>
              </h3>
              <p className="text-sm leading-relaxed text-[#181c19] dark:text-slate-200">
                {project.overview}
              </p>
            </div>

            {/* Engineering Challenge & Solution Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div
                className={`p-4 rounded-2xl ${
                  theme === 'dark' ? 'bg-white/[0.03]' : 'bg-black/[0.02]'
                }`}
              >
                <div className="text-xs font-mono font-bold text-[#181c19] dark:text-white uppercase tracking-wider mb-1.5">
                  The Engineering Challenge
                </div>
                <p className="text-xs leading-relaxed text-[#6e7670] dark:text-slate-300">
                  {project.challenge}
                </p>
              </div>

              <div
                className={`p-4 rounded-2xl ${
                  theme === 'dark' ? 'bg-white/[0.03]' : 'bg-black/[0.02]'
                }`}
              >
                <div className="text-xs font-mono font-bold text-[#35D07F] uppercase tracking-wider mb-1.5">
                  Technical Implementation
                </div>
                <p className="text-xs leading-relaxed text-[#6e7670] dark:text-slate-300">
                  {project.solution}
                </p>
              </div>
            </div>

            {/* Key Performance Metrics */}
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#6e7670] dark:text-slate-400 mb-3 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#35D07F]" />
                <span>Measured Impact</span>
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {project.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className={`p-3 rounded-2xl text-center ${
                      theme === 'dark' ? 'bg-white/[0.03]' : 'bg-black/[0.02]'
                    }`}
                  >
                    <div className="text-lg font-bold font-mono text-[#35D07F]">
                      {metric.value}
                    </div>
                    <div className="text-[11px] text-[#6e7670] dark:text-slate-400 mt-0.5 font-medium">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/[0.04] dark:border-white/[0.06]">
              {project.githubUrl && (
                <motion.a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => soundEngine.playTick()}
                  className={`px-4 py-2.5 rounded-full text-xs font-medium flex items-center gap-2 transition-colors ${
                    theme === 'dark'
                      ? 'bg-white/[0.06] text-slate-200 hover:text-white'
                      : 'bg-white text-[#181c19] shadow-sm hover:bg-slate-50'
                  }`}
                >
                  <Github className="w-4 h-4" />
                  <span>Inspect Code</span>
                </motion.a>
              )}

              {project.demoUrl && (
                <motion.a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => soundEngine.playDroplet()}
                  className="apple-btn-forest px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2"
                >
                  <span>Launch Live System</span>
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
