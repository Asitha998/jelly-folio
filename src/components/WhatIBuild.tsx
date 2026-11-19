import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Server, 
  Cpu, 
  Cloud, 
  Activity, 
  ArrowRight, 
  Workflow, 
  Check, 
  ShieldCheck, 
  Zap, 
  Layers 
} from 'lucide-react';
import { Theme } from '../types';
import { SYSTEM_PILLARS } from '../data/portfolioData';
import { soundEngine } from '../services/soundEngine';

interface WhatIBuildProps {
  theme: Theme;
}

export function WhatIBuild({ theme }: WhatIBuildProps) {
  const [activePillarIndex, setActivePillarIndex] = useState<number>(0);
  const [activeNode, setActiveNode] = useState<string>('runtime');
  const [telemetrySim, setTelemetrySim] = useState<boolean>(true);

  const activePillar = SYSTEM_PILLARS[activePillarIndex];

  const topologyNodes = [
    {
      id: 'ingress',
      name: 'Envoy Edge Ingress',
      type: 'Gateway',
      protocol: 'TLS 1.3 / HTTP/3',
      rate: '120k req/s',
      status: 'Optimal',
      latency: '1.2ms',
    },
    {
      id: 'buffer',
      name: 'Shared Ring Buffer',
      type: 'Zero-Copy Queue',
      protocol: 'SharedArrayBuffer',
      rate: 'Zero Jitter',
      status: 'Lock-Free',
      latency: '0.4ms',
    },
    {
      id: 'runtime',
      name: 'Distributed Compute Core',
      type: 'Rust WASM / Go Pool',
      protocol: 'Worker Thread Mesh',
      rate: '60 FPS Parallel',
      status: 'Active',
      latency: '2.1ms',
    },
    {
      id: 'storage',
      name: 'ACID Transaction Engine',
      type: 'PostgreSQL + Redis Lock',
      protocol: 'Monotonic Consensus',
      rate: '25k tx/s',
      status: 'Synchronized',
      latency: '4.8ms',
    },
  ];

  return (
    <section
      id="systems"
      className="py-24 sm:py-32 relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium mb-4 ${
            theme === 'dark'
              ? 'bg-white/[0.04] text-slate-200 border border-white/[0.04]'
              : 'bg-black/[0.03] text-[#181c19] border border-black/[0.03]'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#35D07F] shadow-[0_0_8px_rgba(53,208,127,0.35)]" />
          <span>System Topology & Architecture</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${
            theme === 'dark' ? 'text-white' : 'text-[#181c19]'
          }`}
        >
          What I Build & Architect.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.14 }}
          className="text-[#6e7670] dark:text-[#9ea8a0] text-sm sm:text-base mt-3 max-w-xl mx-auto leading-relaxed"
        >
          A peek into the structural foundations: from low-level distributed message buffers to silky 60fps browser rendering pipelines.
        </motion.p>
      </div>

      {/* 3 Large Visual Ideas: Floating Glass System Pillars (NO colored borders, NO top lines) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        {SYSTEM_PILLARS.map((pillar, idx) => {
          const isSelected = activePillarIndex === idx;
          const icons = [
            <Server key="0" className="w-5 h-5" />,
            <Zap key="1" className="w-5 h-5" />,
            <Cloud key="2" className="w-5 h-5" />,
          ];

          return (
            <motion.div
              key={pillar.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                soundEngine.playSwoosh();
                setActivePillarIndex(idx);
              }}
              className={`p-6 sm:p-7 rounded-[22px] cursor-pointer transition-all duration-300 relative overflow-hidden ${
                theme === 'dark' ? 'floating-glass-dark' : 'floating-glass-light'
              } ${
                isSelected
                  ? theme === 'dark'
                    ? 'shadow-[0_20px_50px_rgba(0,0,0,0.45)] ring-1 ring-white/15'
                    : 'shadow-[0_20px_45px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.05]'
                  : ''
              }`}
            >
              {/* Header inside glass: Localized green light for active indicator */}
              <div className="flex items-center justify-between mb-5">
                <div className="relative">
                  {isSelected && (
                    <div className="absolute inset-0 rounded-2xl bg-[#35D07F]/15 blur-md pointer-events-none" />
                  )}
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors relative z-10 ${
                      isSelected
                        ? 'bg-black/[0.05] dark:bg-white/[0.1] text-[#35D07F]'
                        : 'bg-black/[0.03] dark:bg-white/[0.04] text-[#6e7670]'
                    }`}
                  >
                    {icons[idx]}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full bg-black/[0.03] dark:bg-white/[0.05] text-[#6e7670] dark:text-slate-300 font-medium">
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#35D07F] shadow-[0_0_8px_rgba(53,208,127,0.4)]" />
                  )}
                  <span>{pillar.badge}</span>
                </div>
              </div>

              <div className="text-xs font-mono uppercase tracking-wider text-[#6e7670] mb-1">
                {pillar.role}
              </div>
              <h3
                className={`text-lg sm:text-xl font-bold tracking-tight mb-2.5 ${
                  theme === 'dark' ? 'text-white' : 'text-[#181c19]'
                }`}
              >
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#6e7670] dark:text-[#9ea8a0] leading-relaxed mb-6">
                {pillar.description}
              </p>

              {/* Technologies row with soft subdued tags */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-black/[0.04] dark:border-white/[0.04]">
                {pillar.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-md ${
                      theme === 'dark'
                        ? 'bg-white/[0.04] text-slate-300'
                        : 'bg-black/[0.03] text-[#181c19]'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Atmospheric System Topology Workbench (Refined floating instrument panel, NO glowing border) */}
      <motion.div
        layout
        className={`rounded-[24px] p-6 sm:p-8 lg:p-10 relative overflow-hidden transition-all duration-300 ${
          theme === 'dark' ? 'deep-system-card' : 'floating-glass-light'
        }`}
      >
        {/* Soft Ambient Light (Gentle depth) */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#35D07F]/[0.03] blur-3xl pointer-events-none" />

        {/* Workbench Control Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/[0.04] dark:border-white/[0.06] relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#35D07F] shadow-[0_0_10px_rgba(53,208,127,0.35)]" />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Live Topology Inspector: {activePillar.title}
              </span>
            </div>
            <div className="text-xs text-[#6e7670] dark:text-slate-400 mt-1">
              Select any architecture stage to inspect data flow, protocol guarantees, and latency budgets.
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundEngine.playTick();
                setTelemetrySim(!telemetrySim);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 cursor-pointer ${
                telemetrySim
                  ? theme === 'dark'
                    ? 'bg-white/[0.08] text-white shadow-sm'
                    : 'bg-black/[0.05] text-[#181c19] shadow-sm'
                  : 'bg-black/[0.02] dark:bg-white/[0.03] text-[#6e7670]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  telemetrySim
                    ? 'bg-[#35D07F] shadow-[0_0_8px_rgba(53,208,127,0.3)]'
                    : 'bg-slate-500'
                }`}
              />
              <span>{telemetrySim ? 'Telemetry Active (120k/s)' : 'Telemetry Paused'}</span>
            </button>
          </div>
        </div>

        {/* Interactive Architecture Flow Graph */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 relative z-10 items-center">
          
          {/* Node Selector Diagram (Left 7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="text-[11px] font-mono text-[#6e7670] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>Pipeline Stages</span>
              <ArrowRight className="w-3 h-3 text-[#6e7670]" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topologyNodes.map((node) => {
                const isActive = activeNode === node.id;
                return (
                  <motion.div
                    key={node.id}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      soundEngine.playPop();
                      setActiveNode(node.id);
                    }}
                    className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 relative ${
                      isActive
                        ? theme === 'dark'
                          ? 'bg-white/[0.09] shadow-[0_8px_24px_rgba(0,0,0,0.22)]'
                          : 'bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]'
                        : theme === 'dark'
                          ? 'bg-white/[0.03] hover:bg-white/[0.06]'
                          : 'bg-white/70 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#35D07F] shadow-[0_0_8px_rgba(53,208,127,0.35)]" />
                        )}
                        <span className="text-[10px] font-mono uppercase tracking-wide text-emerald-600 dark:text-emerald-400 font-semibold">
                          {node.type}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/[0.03] dark:bg-white/10 text-[#6e7670] dark:text-slate-300">
                        {node.latency}
                      </span>
                    </div>

                    <div className={`text-sm font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#181c19]'}`}>
                      {node.name}
                    </div>

                    <div className="flex items-center justify-between mt-3 text-xs text-[#6e7670] dark:text-slate-400 font-mono">
                      <span>{node.protocol}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{node.rate}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Architecture Details Bullet List */}
            <div className="mt-6 pt-4 border-t border-black/[0.04] dark:border-white/[0.06] space-y-2">
              <div className="text-xs font-semibold text-[#181c19] dark:text-slate-200">
                Key Architectural Safeguards:
              </div>
              <ul className="space-y-1.5">
                {activePillar.details.map((detail, dIdx) => (
                  <li
                    key={dIdx}
                    className="text-xs sm:text-sm text-[#6e7670] dark:text-slate-300 flex items-start gap-2.5 leading-relaxed"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Real-time Telemetry Readout Panel (Right 5 cols) - Floating Sub-panel */}
          <div className="lg:col-span-5">
            <div
              className={`p-6 rounded-2xl ${
                theme === 'dark'
                  ? 'bg-black/40 shadow-inner'
                  : 'bg-white/80 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#6e7670] dark:text-slate-400">
                  Performance Metrics
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#35D07F] shadow-[0_0_8px_rgba(53,208,127,0.4)]" />
                  Live Sync
                </span>
              </div>

              {/* Metrics grid */}
              <div className="space-y-3">
                {activePillar.metrics.map((metric, mIdx) => (
                  <div
                    key={mIdx}
                    className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs text-[#6e7670] dark:text-slate-400 font-mono">
                        {metric.label}
                      </div>
                      <div className={`text-lg font-bold tracking-tight mt-0.5 ${theme === 'dark' ? 'text-white' : 'text-[#181c19]'}`}>
                        {metric.value}
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-[#35D07F]/10 flex items-center justify-center text-[#35D07F]">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] text-xs text-[#6e7670] dark:text-slate-300 leading-relaxed font-mono">
                <span className="text-[#35D07F] font-semibold">Architectural Goal:</span> Prioritizing zero-copy memory pipelines over premature abstractions to ensure predictable latency at scale.
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </section>
  );
}
