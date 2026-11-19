import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Droplets, 
  Layers, 
  Music, 
  Code, 
  Atom, 
  Zap, 
  Palette, 
  LayoutGrid, 
  Eye, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  Filter 
} from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { Theme, SkillItem, SkillTier } from '../types';
import { soundEngine } from '../services/soundEngine';

interface SkillsProps {
  theme: Theme;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
  Droplets: <Droplets className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
  Layers: <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
  Music: <Music className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
  Code: <Code className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
  Atom: <Atom className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
  Zap: <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
  Palette: <Palette className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
  LayoutGrid: <LayoutGrid className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
  Eye: <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
  ShieldCheck: <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
  Cpu: <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
};

const TIER_STYLES: Record<SkillTier, { bg: string; text: string; border: string }> = {
  Production: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-700 dark:text-emerald-400 font-semibold',
    border: 'border-emerald-500/30',
  },
  Advanced: {
    bg: 'bg-[#0071e3]/15',
    text: 'text-[#0071e3] font-semibold',
    border: 'border-[#0071e3]/30',
  },
  Exploration: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-700 dark:text-amber-400 font-semibold',
    border: 'border-amber-500/30',
  },
};

export const Skills: React.FC<SkillsProps> = ({ theme }) => {
  const [selectedTier, setSelectedTier] = useState<SkillTier | 'All'>('All');
  const [activeSkill, setActiveSkill] = useState<SkillItem | null>(null);

  const handleSkillHover = (skill: SkillItem, index: number) => {
    soundEngine.playMarimbaNote(index % 6);
    setActiveSkill(skill);
  };

  return (
    <section id="skills" className="scroll-mt-24 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative max-w-7xl mx-auto">
      {/* Background Soft Environmental Glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-emerald-500/[0.03] blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium mb-3 ${
            theme === 'dark'
              ? 'bg-white/[0.04] text-slate-200 border border-white/[0.04]'
              : 'bg-black/[0.03] text-[#181c19] border border-black/[0.03]'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#35D07F] shadow-[0_0_8px_rgba(53,208,127,0.4)]" />
            <span>Verifiable Engineering Capabilities</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#181c19]'}`}>
            Systems, Architecture & Tooling.
          </h2>
          <p className="text-[#6e7670] dark:text-[#9ea8a0] text-sm sm:text-base mt-2 max-w-xl leading-relaxed">
            Honest, battle-tested evidence over artificial percentage bars. Categorized by real-world deployment tiers and operational experience.
          </p>
        </div>

        {/* Tier Filter Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] backdrop-blur-md">
          {(['All', 'Production', 'Advanced', 'Exploration'] as const).map((tier) => (
            <motion.button
              key={tier}
              onClick={() => {
                soundEngine.playTick();
                setSelectedTier(tier);
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium cursor-pointer transition-all ${
                selectedTier === tier
                  ? theme === 'dark'
                    ? 'bg-white/15 text-white shadow-sm font-semibold'
                    : 'bg-white text-emerald-800 shadow-sm font-semibold'
                  : theme === 'dark'
                    ? 'text-[#86868b] hover:text-white'
                    : 'text-[#6e7670] hover:text-[#181c19]'
              }`}
            >
              {tier}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Skill Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {SKILL_CATEGORIES.map((category, catIdx) => {
          const filteredSkills = selectedTier === 'All'
            ? category.skills
            : category.skills.filter((s) => s.tier === selectedTier);

          return (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: catIdx * 0.1 }}
              className={`rounded-[22px] p-6 sm:p-7 flex flex-col justify-between ${
                theme === 'dark' ? 'floating-glass-dark' : 'floating-glass-light'
              }`}
            >
              <div>
                <h3 className={`text-xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#181c19]'}`}>
                  {category.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6e7670] dark:text-[#9ea8a0] mt-1 mb-6 leading-relaxed">
                  {category.subtitle}
                </p>

                {/* Skill Items List */}
                <div className="space-y-4">
                  {filteredSkills.map((skill, sIdx) => {
                    const tierStyle = TIER_STYLES[skill.tier];
                    const isHovered = activeSkill?.name === skill.name;

                    return (
                      <motion.div
                        key={skill.name}
                        onMouseEnter={() => handleSkillHover(skill, catIdx * 4 + sIdx)}
                        whileHover={{ 
                          scale: 1.02, 
                          x: 2,
                          transition: { type: 'spring', stiffness: 500, damping: 14 }
                        }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-2xl cursor-pointer transition-all ${
                          isHovered
                            ? theme === 'dark'
                              ? 'bg-white/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.2)]'
                              : 'bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]'
                            : 'bg-black/[0.02] dark:bg-white/[0.03]'
                        }`}
                      >
                        {/* Header: Name and Tier badge */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] text-[#35D07F]">
                              {ICON_MAP[skill.iconName] || <Code className="w-4 h-4" />}
                            </span>
                            <span className={`text-sm sm:text-base font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#181c19]'}`}>
                              {skill.name}
                            </span>
                          </div>

                          <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full ${tierStyle.bg} ${tierStyle.text}`}>
                            {skill.tier}
                          </span>
                        </div>

                        {/* Operational Context */}
                        <div className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-medium mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#35D07F]" />
                          <span>{skill.context}</span>
                        </div>

                        {/* Description - Comfortable, Calm, Legible font size */}
                        <p className="text-xs sm:text-sm text-[#4a554d] dark:text-[#c4ccc5] leading-relaxed mb-3">
                          {skill.description}
                        </p>

                        {/* Concrete Tooling Tags */}
                        <div className="flex flex-wrap gap-1 pt-2 border-t border-black/[0.04] dark:border-white/[0.04]">
                          {skill.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${
                                theme === 'dark'
                                  ? 'bg-white/[0.05] text-slate-300'
                                  : 'bg-black/[0.03] text-[#181c19]'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}

                  {filteredSkills.length === 0 && (
                    <div className="p-6 text-center text-xs font-mono text-[#6e7670] dark:text-[#9ea8a0] rounded-2xl bg-black/[0.02] dark:bg-white/[0.03]">
                      No skills under {selectedTier} in this category.
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-6 pt-4 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between text-xs font-mono text-[#6e7670] dark:text-[#9ea8a0]">
                <span>Rigorous code standards</span>
                <span className="text-[#35D07F] font-semibold">Zero-Jank Tested</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
