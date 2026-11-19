import React from 'react';
import { motion } from 'motion/react';
import { Compass, Terminal, ShieldCheck, Waves, Cpu, Sparkles } from 'lucide-react';
import { PHILOSOPHY } from '../data/portfolioData';
import { Theme } from '../types';
import { soundEngine } from '../services/soundEngine';

interface AboutProps {
  theme: Theme;
}

const TOOLBOX = [
  'TypeScript 5.x',
  'React 19 & Next.js',
  'Go / Golang',
  'Java EE & Spring',
  'MySQL & PostgreSQL',
  'Node.js Clusters',
  'Rust / WASM Solvers',
  'WebGPU & Shaders',
  'Web Audio API',
  'Docker & Kubernetes',
  'Android & Firebase',
  'OpenTelemetry & gRPC',
];

export const About: React.FC<AboutProps> = ({ theme }) => {
  return (
    <section id="about" className="scroll-mt-24 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative max-w-7xl mx-auto">
      {/* Background Soft Environmental Glow */}
      <div className="absolute top-1/2 right-12 w-80 h-80 rounded-full bg-[#35D07F]/[0.02] blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="mb-16 text-center max-w-2xl mx-auto">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium mb-3 ${
          theme === 'dark'
            ? 'bg-white/[0.04] text-slate-200 border border-white/[0.04]'
            : 'bg-black/[0.03] text-[#181c19] border border-black/[0.03]'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#35D07F] shadow-[0_0_8px_rgba(53,208,127,0.4)]" />
          <span>Engineering Philosophy & Principles</span>
        </div>
        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#181c19]'}`}>
          How I Think & Build.
        </h2>
        <p className="text-[#6e7670] dark:text-[#9ea8a0] text-sm sm:text-base mt-2 max-w-xl mx-auto leading-relaxed">
          Systems must be mathematically sound, performant under concurrent strain, and tactile to human interaction.
        </p>
      </div>

      {/* 3 Core Tenets (Floating Glass Panels) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
        {PHILOSOPHY.map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ 
              y: -3,
              transition: { duration: 0.2, ease: 'easeOut' }
            }}
            onClick={() => soundEngine.playMarimbaNote(idx * 2)}
            className={`rounded-[22px] p-7 flex flex-col justify-between cursor-pointer ${
              theme === 'dark' ? 'floating-glass-dark' : 'floating-glass-light'
            }`}
          >
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide bg-black/[0.03] dark:bg-white/[0.05] text-[#35D07F] mb-4 inline-block">
                {item.badge}
              </span>
              <h3 className={`text-xl font-bold tracking-tight mb-3 ${theme === 'dark' ? 'text-white' : 'text-[#181c19]'}`}>
                {item.title}
              </h3>
              <p className="text-sm text-[#4a554d] dark:text-[#c4ccc5] leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-black/[0.04] dark:border-white/[0.04] flex items-center gap-2 text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400">
              <Waves className="w-3.5 h-3.5 text-[#35D07F]" />
              <span>Foundational Law</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Behind the Architecture Card (Floating Glass Material) */}
      <div
        className={`rounded-[24px] p-8 sm:p-10 ${
          theme === 'dark' ? 'floating-glass-dark' : 'floating-glass-light'
        } grid grid-cols-1 lg:grid-cols-12 gap-8 items-center`}
      >
        <div className="lg:col-span-7">
          <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#181c19]'}`}>
            Behind the Architecture
          </h3>
          <p className="text-sm sm:text-base text-[#4a554d] dark:text-[#c4ccc5] leading-relaxed mb-4">
            Computing power is immense, yet too many digital tools feel sluggish, uninspiring, and disconnected from genuine physical feedback.
          </p>
          <p className="text-sm sm:text-base text-[#4a554d] dark:text-[#c4ccc5] leading-relaxed mb-6">
            I unite rigorous systems engineering — zero-copy ring buffers, lock-free queues, deterministic typing, and ACID data integrity — with organic spring dynamics to create software that feels exceptionally fast, stable, and durable.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#6e7670] dark:text-[#9ea8a0]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#35D07F]" />
              WCAG AA Calibrated Contrast
            </span>
            <span className="flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-[#0071e3]" />
              Deterministic Type Safety
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 p-6 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03]">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#6e7670] dark:text-[#9ea8a0] mb-3">
            Production Tooling Ecosystem
          </div>
          <div className="flex flex-wrap gap-2">
            {TOOLBOX.map((tool) => (
              <motion.span
                key={tool}
                whileHover={{ 
                  scale: 1.04, 
                  y: -1,
                  transition: { type: 'spring', stiffness: 500, damping: 14 }
                }}
                whileTap={{ scale: 0.96 }}
                onClick={() => soundEngine.playTick()}
                className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium shadow-sm cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-white/[0.06] text-white hover:bg-white/[0.1]'
                    : 'bg-white text-[#181c19] hover:bg-slate-50'
                }`}
              >
                {tool}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};
