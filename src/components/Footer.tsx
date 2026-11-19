import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowUp, Clock } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Theme } from '../types';
import { soundEngine } from '../services/soundEngine';

interface FooterProps {
  theme: Theme;
}

export const Footer: React.FC<FooterProps> = ({ theme }) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'America/Los_Angeles',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    soundEngine.playSectionNavigationTone('hero');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('portfolio:navigate', { detail: { sectionId: 'hero' } }));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-black/[0.03] dark:border-white/[0.04] relative">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Left Brand & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="w-8 h-8 rounded-full bg-[#181c19] dark:bg-white text-white dark:text-[#181c19] flex items-center justify-center font-bold text-xs shadow-sm">
            JD
          </div>
          <div>
            <div className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-[#181c19]'}`}>
              {PERSONAL_INFO.name} • Software Engineer
            </div>
            <div className="text-xs text-[#6e7670] dark:text-slate-400 font-mono">
              Engineered with floating glass materials, spatial depth & Web Audio synthesis.
            </div>
          </div>
        </div>

        {/* Center Live Clock */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.02] dark:bg-white/[0.04] text-xs font-mono text-[#6e7670] dark:text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-[#35D07F] shadow-[0_0_8px_rgba(53,208,127,0.4)]" />
          <Clock className="w-3.5 h-3.5 text-[#6e7670] dark:text-slate-400" />
          <span>San Francisco {currentTime || '10:18 AM'} (PT)</span>
        </div>

        {/* Right Scroll to Top */}
        <motion.button
          onClick={scrollToTop}
          whileHover={{ 
            scale: 1.08, 
            y: -2,
            transition: { type: 'spring', stiffness: 500, damping: 14 }
          }}
          whileTap={{ scale: 0.92 }}
          className={`p-3 rounded-full cursor-pointer transition-colors ${
            theme === 'dark'
              ? 'bg-white/[0.06] text-slate-200 hover:bg-white/[0.1] hover:text-white'
              : 'bg-white text-[#181c19] shadow-sm hover:bg-slate-50'
          }`}
          title="Scroll back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </motion.button>

      </div>
    </footer>
  );
};
