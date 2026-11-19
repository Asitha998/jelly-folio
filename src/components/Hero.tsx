import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Copy, Check, Send, Sparkles, Compass, ShieldCheck, Activity } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Theme } from '../types';
import { soundEngine } from '../services/soundEngine';

interface HeroProps {
  theme: Theme;
}

interface Node3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  phase: number;
  freq: number;
  color: string;
}

export const Hero: React.FC<HeroProps> = ({ theme }) => {
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'biosphere' | 'mesh' | 'cluster'>('biosphere');
  const [isInteracting, setIsInteracting] = useState(false);

  // Dynamic Typing Animation State - Short, punchy, high-impact phrases
  const TYPED_PHRASES = [
    'the modern web.',
    'distributed systems.',
    'cloud scale.',
    'high performance.',
    'real-world impact.',
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const targetPhrase = TYPED_PHRASES[phraseIndex];

    if (!isDeleting && currentText === targetPhrase) {
      // Completed typing full phrase, pause to allow comfortable reading
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 1800);
    } else if (isDeleting && currentText === '') {
      // Completed deleting, brief natural breather before typing next phrase
      timer = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % TYPED_PHRASES.length);
      }, 240);
    } else {
      // Keystroke cadence: faster on deletion, crisp on typing
      const speed = isDeleting ? 25 : 50;
      timer = setTimeout(() => {
        const nextText = isDeleting
          ? targetPhrase.substring(0, currentText.length - 1)
          : targetPhrase.substring(0, currentText.length + 1);
        setCurrentText(nextText);
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, phraseIndex]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotXRef = useRef(0.2);
  const rotYRef = useRef(0);
  const targetRotXRef = useRef(0.2);
  const targetRotYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    soundEngine.playBlobBounce();
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const scrollTo = (id: string, noteIndex: number = 0) => {
    soundEngine.playSectionNavigationTone(id);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('portfolio:navigate', { detail: { sectionId: id } }));
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Interactive 3D Living Systems Canvas Object
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };
    window.addEventListener('resize', handleResize);

    // Generate 3D topological points (Fibonacci sphere distribution)
    const count = 120;
    const nodes: Node3D[] = [];
    const radius = Math.min(width, height) * 0.28;

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      // Natural environmental colors: forest green, sage, electric blue
      const isGreen = i % 3 === 0;
      const isTeal = i % 3 === 1;
      const color = isGreen
        ? 'rgba(45, 106, 79, ' // sage forest
        : isTeal
        ? 'rgba(16, 185, 129, ' // emerald
        : 'rgba(0, 113, 227, '; // apple blue

      nodes.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        phase: Math.random() * Math.PI * 2,
        freq: 0.8 + Math.random() * 0.6,
        color,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.014;

      // Smooth rotation damping
      rotXRef.current += (targetRotXRef.current - rotXRef.current) * 0.05;
      rotYRef.current += (targetRotYRef.current - rotYRef.current) * 0.05;

      // Gentle continuous ambient drift
      if (!isDraggingRef.current) {
        targetRotYRef.current += 0.003;
      }

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const fov = 450 * window.devicePixelRatio;

      const cosX = Math.cos(rotXRef.current);
      const sinX = Math.sin(rotXRef.current);
      const cosY = Math.cos(rotYRef.current);
      const sinY = Math.sin(rotYRef.current);

      // Projected points
      const projected: { x: number; y: number; z: number; scale: number; color: string; alpha: number }[] = [];

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        // Harmonic organic respiration wave
        const wave = Math.sin(time * node.freq + node.phase) * (radius * 0.09);
        const curRadius = radius + wave;
        const norm = Math.sqrt(node.baseX ** 2 + node.baseY ** 2 + node.baseZ ** 2);
        const bx = (node.baseX / norm) * curRadius;
        const by = (node.baseY / norm) * curRadius;
        const bz = (node.baseZ / norm) * curRadius;

        // Rotate Y
        const x1 = bx * cosY - bz * sinY;
        const z1 = bz * cosY + bx * sinY;

        // Rotate X
        const y2 = by * cosX - z1 * sinX;
        const z2 = z1 * cosX + by * sinX;

        // Perspective Projection
        const distance = fov + z2;
        if (distance > 10) {
          const scale = fov / distance;
          const px = cx + x1 * scale;
          const py = cy + y2 * scale;
          const depthAlpha = Math.max(0.12, Math.min(1, (z2 + radius) / (radius * 2)));

          projected.push({
            x: px,
            y: py,
            z: z2,
            scale,
            color: node.color,
            alpha: depthAlpha,
          });
        }
      }

      // Sort by depth (back to front)
      projected.sort((a, b) => a.z - b.z);

      // Draw subtle lattice connecting lines between close neighbors
      const maxConnectDist = 65 * window.devicePixelRatio;
      ctx.lineWidth = 1 * window.devicePixelRatio;

      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            const lineAlpha = (1 - dist / maxConnectDist) * p1.alpha * 0.35;
            ctx.strokeStyle =
              theme === 'dark'
                ? `rgba(110, 231, 183, ${lineAlpha * 0.8})`
                : `rgba(45, 106, 79, ${lineAlpha * 0.6})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const dotRadius = Math.max(1.5, p.scale * 2.2);

        // Core dot
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, dotRadius, 0, Math.PI * 2);
        ctx.fill();

        // Subtle specular glow for forefront nodes
        if (p.z > radius * 0.3) {
          ctx.fillStyle = `${p.color}${p.alpha * 0.25})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, dotRadius * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, mode]);

  // Pointer interaction handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    setIsInteracting(true);
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    soundEngine.playDroplet();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) {
      // Subtle tilt tracking cursor
      const rect = e.currentTarget.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotXRef.current = 0.2 + ny * 0.4;
      targetRotYRef.current += nx * 0.02;
      return;
    }

    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    targetRotYRef.current += dx * 0.008;
    targetRotXRef.current += dy * 0.008;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    setTimeout(() => setIsInteracting(false), 800);
  };

  return (
    <section
      id="hero"
      className="relative min-h-[95vh] flex flex-col items-center justify-center pt-32 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background Subtle Environmental Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[550px] rounded-full bg-emerald-500/[0.04] dark:bg-emerald-500/[0.07] blur-[150px] pointer-events-none" />

      {/* Main Centered Hero Content */}
      <div className="max-w-4xl w-full mx-auto flex flex-col items-center text-center z-10">
        
        {/* Eyebrow / Technical Identity Badge */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-medium mb-6 ${
            theme === 'dark'
              ? 'bg-white/[0.04] text-slate-200 border border-white/[0.04]'
              : 'bg-black/[0.03] text-[#181c19] border border-black/[0.03]'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#35D07F] shadow-[0_0_8px_rgba(53,208,127,0.4)]" />
          <span className="tracking-wide uppercase text-[11px]">
            SOFTWARE ENGINEER • SYSTEMS & ARCHITECTURE
          </span>
        </motion.div>

        {/* Memorable Display Headline with Dynamic Typing Effect */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className={`text-4xl sm:text-6xl lg:text-[64px] font-bold tracking-tight leading-[1.12] mb-6 max-w-4xl min-h-[2.4em] sm:min-h-[2.3em] flex flex-wrap items-center justify-center ${
            theme === 'dark' ? 'text-white' : 'text-[#181c19]'
          }`}
        >
          <span>I build thoughtful software for&nbsp;</span>
          <span
            onClick={() => {
              soundEngine.playDroplet();
              setIsDeleting(true);
            }}
            title="Click to cycle next system"
            className="relative inline-flex items-center cursor-pointer text-emerald-700 dark:text-[#35D07F] hover:opacity-90 transition-opacity"
          >
            <span>{currentText}</span>
            <span className="inline-block w-[3.5px] h-[0.82em] align-middle ml-1 bg-[#35D07F] rounded-full animate-cursor-blink shadow-[0_0_10px_rgba(53,208,127,0.7)]" />
          </span>
        </motion.h1>

        {/* Supporting Narrative - Clear, Calibrated, Legible */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16 }}
          className="text-base sm:text-lg lg:text-xl text-[#6e7670] dark:text-[#9ea8a0] max-w-2xl leading-relaxed mb-8 font-normal"
        >
          Hi, I’m <strong className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#181c19]'}`}>{PERSONAL_INFO.name}</strong>. 
          Specializing in high-throughput distributed systems, WebGPU browser engines, and resilient cloud architectures that unite computational rigor with natural fluidity.
        </motion.p>

        {/* Action Buttons with Tactile Physics */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10"
        >
          {/* View Work (Apple Blue + Gloss + Tactile Spring Jiggle) */}
          <motion.button
            id="hero-view-work-btn"
            onClick={() => scrollTo('projects', 2)}
            onMouseEnter={() => soundEngine.playBlob(0, 0.75)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 450, damping: 14 }}
            className="apple-btn-primary px-7 py-3.5 rounded-full font-medium text-sm flex items-center gap-2.5 cursor-pointer shadow-md"
          >
            <span>View Selected Work</span>
            <ArrowDown className="w-4 h-4" />
          </motion.button>

          {/* Explore Systems (Forest / Sage Pill) */}
          <motion.button
            id="hero-explore-systems-btn"
            onClick={() => scrollTo('systems', 1)}
            onMouseEnter={() => soundEngine.playBlob(30, 0.75)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 450, damping: 14 }}
            className={`px-6 py-3.5 rounded-full font-medium text-sm flex items-center gap-2 cursor-pointer transition-all ${
              theme === 'dark'
                ? 'apple-glass-pill-dark text-slate-200 hover:text-white'
                : 'apple-glass-pill-light text-[#181c19] hover:bg-white'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Architecture Breakdown</span>
          </motion.button>

          {/* Get In Touch */}
          <motion.button
            id="hero-contact-btn"
            onClick={() => scrollTo('contact', 4)}
            onMouseEnter={() => soundEngine.playBlob(60, 0.75)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 450, damping: 14 }}
            className={`px-5 py-3.5 rounded-full font-medium text-sm flex items-center gap-2 cursor-pointer transition-all ${
              theme === 'dark'
                ? 'bg-white/[0.07] hover:bg-white/[0.12] text-white shadow-sm'
                : 'bg-black/[0.04] hover:bg-black/[0.07] text-[#181c19] shadow-sm'
            }`}
          >
            <Send className="w-4 h-4 text-[#35D07F]" />
            <span>Initiate Transmission</span>
          </motion.button>

          {/* Direct Email Quick Copy */}
          <motion.button
            id="hero-copy-email-btn"
            onClick={handleCopyEmail}
            onMouseEnter={() => soundEngine.playJiggle(270)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 450, damping: 14 }}
            className={`p-3.5 rounded-full cursor-pointer transition-all ${
              theme === 'dark'
                ? 'bg-white/[0.07] text-slate-300 hover:text-white shadow-sm'
                : 'bg-white text-[#181c19] hover:bg-slate-50 shadow-sm'
            }`}
            title="Copy email to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4 text-[#35D07F]" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </motion.button>
        </motion.div>

        {/* Distinctive ONE Hero Object: Interactive Living Systems Core (Kept and polished) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl h-[340px] sm:h-[400px] flex items-center justify-center my-2 select-none"
        >
          {/* Canvas for 3D topological biosphere */}
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="w-full h-full cursor-grab active:cursor-grabbing relative z-10 touch-none"
          />

          {/* Subtle Ambient Ring */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-[300px] sm:w-[360px] h-[300px] sm:h-[360px] rounded-full border border-dashed border-emerald-500/10 dark:border-emerald-400/5 animate-spin-slow" />
          </div>

          {/* Bottom Interactive Hint Pill */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 pointer-events-none">
            <div
              className={`text-[11px] font-mono px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-2 transition-opacity ${
                isInteracting ? 'opacity-90' : 'opacity-65'
              } ${
                theme === 'dark'
                  ? 'bg-white/[0.05] text-slate-300 shadow-sm'
                  : 'bg-white/80 text-[#181c19] shadow-sm'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#35D07F] shadow-[0_0_8px_rgba(53,208,127,0.4)]" />
              <span>Drag to orbit • Living topological core</span>
            </div>
          </div>
        </motion.div>

        {/* Grounded Engineering Credibility Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-[#6e7670] dark:text-[#9ea8a0] pt-4 border-t border-black/[0.04] dark:border-white/[0.04] w-full max-w-2xl"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#35D07F]" />
            <span>120k msgs/s Ingestion</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3]" />
            <span>&lt; 14ms P99 Sync</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#35D07F]" />
            <span>60 FPS WebGPU</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            <span>Zero-Lock Ring Buffer</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
