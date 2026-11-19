import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, MapPin, CheckCircle2, ChevronDown, ChevronUp, Terminal, Sparkles } from 'lucide-react';
import { EXPERIENCES } from '../data/portfolioData';
import { Theme } from '../types';
import { soundEngine } from '../services/soundEngine';

interface ExperienceProps {
  theme: Theme;
}

export const Experience: React.FC<ExperienceProps> = ({ theme }) => {
  const [expandedId, setExpandedId] = useState<string>(EXPERIENCES[0].id);

  const toggleExpand = (id: string, index: number) => {
    soundEngine.playMarimbaNote(index);
    setExpandedId(expandedId === id ? '' : id);
  };

  return (
    <section id="experience" className="scroll-mt-24 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative max-w-6xl mx-auto">
      {/* ATMOSPHERIC CONTRAST BLOCK (Refined Floating Dark Glass Material, NO green outlines) */}
      <div className="relative rounded-[28px] p-6 sm:p-10 lg:p-14 overflow-hidden deep-system-card text-slate-100">
        
        {/* Soft Ambient Depth Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#35D07F]/[0.03] blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-[#0071e3]/[0.03] blur-[100px] pointer-events-none" />

        {/* Header inside Atmospheric Contrast Zone */}
        <div className="mb-14 text-center max-w-2xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium mb-3 bg-white/[0.04] text-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#35D07F] shadow-[0_0_8px_rgba(53,208,127,0.4)]" />
            <span>Career Arc & Systems Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Engineering Leadership & Timeline.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl mx-auto leading-relaxed">
            Real-world impact across distributed infrastructure, low-latency browser engines, and high-concurrency systems.
          </p>
        </div>

        {/* Subtle Timeline Spine */}
        <div className="relative pl-6 sm:pl-10 border-l border-white/10 space-y-10 z-10">
          {EXPERIENCES.map((exp, idx) => {
            const isExpanded = expandedId === exp.id;
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative"
              >
                {/* Localized Green Glow Node on Timeline */}
                <div className="absolute -left-[31px] sm:-left-[47px] top-6 w-3.5 h-3.5 rounded-full bg-[#35D07F] shadow-[0_0_12px_rgba(53,208,127,0.45)] ring-4 ring-[#0e1214]" />

                {/* Milestone Glass Card (Floating material, NO green border) */}
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-[22px] p-6 sm:p-7 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-md transition-all duration-200 shadow-md"
                >
                  <div
                    onClick={() => toggleExpand(exp.id, idx + 1)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.08] text-slate-200">
                          {exp.period}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                          <MapPin className="w-3 h-3 text-[#35D07F]" />
                          {exp.location}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold tracking-tight text-white">
                        {exp.role}
                      </h3>
                      <p className="text-sm font-medium text-[#35D07F] mt-0.5">
                        {exp.company}
                      </p>
                    </div>

                    {/* Expand Toggle with Tactile Physics */}
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                      className="self-end sm:self-center p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 cursor-pointer"
                      aria-label="Expand details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </motion.button>
                  </div>

                  {/* Body Overview - Calm & Legible */}
                  <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed font-normal">
                    {exp.description}
                  </p>

                  {/* Highlights Expandable */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-5 pt-5 border-t border-white/10 space-y-3"
                      >
                        <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                          Key Deliverables & Architectural Impact
                        </div>
                        <ul className="space-y-2.5">
                          {exp.highlights.map((h, i) => (
                            <li key={i} className="text-xs sm:text-sm flex items-start gap-2.5 leading-relaxed text-slate-200">
                              <CheckCircle2 className="w-4 h-4 text-[#35D07F] shrink-0 mt-0.5" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Tech Used Chips */}
                        <div className="pt-3 flex flex-wrap gap-1.5">
                          {exp.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.06] text-slate-200"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
