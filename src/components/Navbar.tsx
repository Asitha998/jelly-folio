import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Volume2, VolumeX, Menu, X, Headphones, HeadphoneOff } from 'lucide-react';
import { Theme } from '../types';
import { soundEngine, AudioChannelsState } from '../services/soundEngine';
import { PERSONAL_INFO } from '../data/portfolioData';

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
  activeSection?: string;
}

// Exactly the requested options: Home, About, Skills, Experience, Projects, Contact
const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  activeSection: propActiveSection,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentActive, setCurrentActive] = useState('hero');
  const [audioState, setAudioState] = useState<AudioChannelsState>(soundEngine.getAudioChannelsState());
  const [isSoundHovered, setIsSoundHovered] = useState(false);
  const soundHoverTimeoutRef = React.useRef<number | null>(null);
  const isClickScrollingRef = React.useRef(false);
  const scrollTimeoutRef = React.useRef<number | null>(null);
  const isMobileMenuOpenRef = React.useRef(isMobileMenuOpen);
  const lastScrollYRef = React.useRef(0);

  // Keep ref synchronized with state for scroll listener without re-triggering effect
  useEffect(() => {
    isMobileMenuOpenRef.current = isMobileMenuOpen;
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const unsubChannels = soundEngine.onAudioChannelsChange((state) => {
      setAudioState(state);
    });
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const isScrolled = scrollY > 20;
      setScrolled(isScrolled);

      // Only close mobile menu if user actively scrolled by more than 25px
      if (isMobileMenuOpenRef.current && Math.abs(scrollY - lastScrollYRef.current) > 25) {
        setIsMobileMenuOpen(false);
      }
      lastScrollYRef.current = scrollY;

      // If user recently clicked a nav item, let smooth scrolling arrive without snapping back
      if (isClickScrollingRef.current) return;

      // When near the very top of the page
      if (scrollY < 100) {
        setCurrentActive('hero');
        return;
      }

      // When at the bottom of the page, highlight the last section
      if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 60) {
        setCurrentActive('contact');
        return;
      }

      // Dynamic viewport detection using getBoundingClientRect
      const sections = NAV_ITEMS.map((item) => {
        const el = document.getElementById(item.id);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          id: item.id,
          top: rect.top,
          absTop: rect.top + scrollY,
        };
      }).filter((item): item is { id: string; top: number; absTop: number } => item !== null);

      // Sort by actual position in document
      sections.sort((a, b) => a.absTop - b.absTop);

      // Trigger line (180px below top of viewport)
      const triggerY = 180;
      let active = 'hero';

      for (const section of sections) {
        if (section.top <= triggerY) {
          active = section.id;
        }
      }

      setCurrentActive(active);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      unsubChannels();
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (soundHoverTimeoutRef.current) clearTimeout(soundHoverTimeoutRef.current);
    };
  }, []);

  const activeSection = propActiveSection || currentActive;

  const scrollToSection = (id: string, index: number) => {
    soundEngine.playSectionNavigationTone(id);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('portfolio:navigate', { detail: { sectionId: id } }));
    }
    setIsMobileMenuOpen(false);

    // Immediately reflect active tab selection visually
    setCurrentActive(id);
    isClickScrollingRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = window.setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 900);

    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      const topOffset = 85;
      const rect = el.getBoundingClientRect();
      const targetY = rect.top + window.pageYOffset - topOffset;

      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: 'smooth',
      });
    }
  };

  const handleSoundMouseEnter = () => {
    if (soundHoverTimeoutRef.current) clearTimeout(soundHoverTimeoutRef.current);
    setIsSoundHovered(true);
  };

  const handleSoundMouseLeave = () => {
    if (soundHoverTimeoutRef.current) clearTimeout(soundHoverTimeoutRef.current);
    soundHoverTimeoutRef.current = window.setTimeout(() => {
      setIsSoundHovered(false);
    }, 280);
  };

  const toggleBkgMusic = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEngine.playHarmonicClick('toggle');
    soundEngine.toggleBkgMusic();
  };

  const toggleEffects = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEngine.playHarmonicClick('toggle', true);
    soundEngine.toggleEffects();
  };

  const toggleMasterSound = () => {
    const isCurrentlyMuted = audioState.isMuted || (audioState.isBkgMusicMuted && audioState.isEffectsMuted);
    const nextMuted = !isCurrentlyMuted;
    soundEngine.setMuted(nextMuted);
    if (!nextMuted) {
      soundEngine.playHarmonicClick('toggle', true);
    }
  };

  return (
    <>
      {/* Mobile Menu Backdrop Tap Dismissal */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/20 dark:bg-black/45 backdrop-blur-[2px] md:hidden cursor-pointer"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Dynamic Navbar: Flush header at the very top, morphs into floating pill dock on scroll */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none transition-all duration-300 ${
          scrolled ? 'pt-2.5 sm:pt-4 px-3 sm:px-6' : 'pt-0 px-0 sm:px-6 md:px-8'
        }`}
      >
        <nav
          className={`pointer-events-auto flex items-center justify-between transition-all duration-300 ease-out ${
            scrolled
              ? `w-[calc(100%-0.5rem)] sm:w-full max-w-4xl mx-auto px-3 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-2xl ${
                  theme === 'dark' ? 'nav-glass-dark' : 'nav-glass-light'
                }`
              : `w-full max-w-7xl mx-auto px-4 sm:px-8 py-3.5 sm:py-4 rounded-none sm:rounded-b-2xl border-b shadow-none backdrop-blur-md ${
                  theme === 'dark'
                    ? 'bg-[#070b09]/55 border-white/[0.08] text-white'
                    : 'bg-white/60 border-black/[0.06] text-[#181c19]'
                }`
          }`}
        >
          {/* Brand / Developer Name with Monogram avatar */}
          <button
            onClick={() => scrollToSection('hero', 0)}
            className="relative z-10 flex items-center gap-2 group cursor-pointer text-left shrink-0"
            title="Return to top"
          >
            <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-full flex items-center justify-center bg-[#181c19] dark:bg-white text-white dark:text-[#181c19] shadow-sm font-mono text-[10px] sm:text-xs font-bold shrink-0">
              JD
            </div>
            <span
              className={`font-semibold tracking-tight text-xs sm:text-sm whitespace-nowrap transition-colors ${
                theme === 'dark' ? 'text-white' : 'text-[#181c19]'
              }`}
            >
              {PERSONAL_INFO.name}
            </span>
          </button>

          {/* Desktop Navigation Links with Glass Pill Selector */}
          <div className="hidden md:flex items-center gap-1 relative z-10">
            {NAV_ITEMS.map((item, idx) => {
              const isActive = activeSection === item.id;
              return (
                <motion.button
                  key={item.id}
                  id={`pill-nav-link-${item.id}`}
                  onClick={() => scrollToSection(item.id, idx)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors duration-200 ${
                    isActive
                      ? theme === 'dark'
                        ? 'text-white font-semibold'
                        : 'text-emerald-950 font-semibold'
                      : theme === 'dark'
                        ? 'text-slate-400 hover:text-white'
                        : 'text-[#6e7670] hover:text-[#181c19]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePill"
                      className={`absolute inset-0 rounded-full ${
                        theme === 'dark'
                          ? 'bg-white/14 shadow-sm'
                          : 'bg-black/[0.06] shadow-sm'
                      }`}
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Right Tools: Audio Haptics with Hover Popup, Theme Toggle, Mobile Menu Toggle */}
          <div className="relative z-10 flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Header Sound Icon with Hover Popup */}
            <div
              className="relative flex items-center justify-center"
              onMouseEnter={handleSoundMouseEnter}
              onMouseLeave={handleSoundMouseLeave}
            >
              <motion.button
                id="header-sound-icon-btn"
                onClick={toggleMasterSound}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.88 }}
                className={`p-1.5 sm:p-2 rounded-full cursor-pointer transition-colors ${
                  theme === 'dark'
                    ? 'bg-white/10 hover:bg-white/15 text-slate-200'
                    : 'bg-black/[0.04] hover:bg-black/[0.07] text-[#181c19]'
                } shadow-sm backdrop-blur-md`}
                aria-label="Toggle Audio"
                aria-expanded={isSoundHovered}
              >
                {audioState.isMuted || (audioState.isBkgMusicMuted && audioState.isEffectsMuted) ? (
                  <VolumeX className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#86868b]" />
                ) : (
                  <Volume2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#35D07F]" />
                )}
              </motion.button>

              {/* Minimalist Glass Capsule matching Mobile Nav Menu Glass Effect */}
              <AnimatePresence>
                {isSoundHovered && (
                  <motion.div
                    style={{ position: 'absolute' }}
                    initial={{ opacity: 0, y: 4, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.92 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    className={`!absolute right-0 top-full mt-2.5 rounded-2xl shadow-2xl z-50 pointer-events-auto p-1.5 whitespace-nowrap before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 ${
                      theme === 'dark'
                        ? 'nav-glass-dark text-white'
                        : 'nav-glass-light text-[#181c19]'
                    }`}
                  >
                    <div className="flex items-center gap-1 relative z-10">
                      {/* Option 1: Background Music (Headphones / HeadphoneOff) */}
                      <motion.button
                        onClick={toggleBkgMusic}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        aria-label={!audioState.isBkgMusicMuted && !audioState.isMuted ? 'Mute Background Music' : 'Unmute Background Music'}
                        className={`p-2 rounded-xl cursor-pointer transition-colors ${
                          !audioState.isBkgMusicMuted && !audioState.isMuted
                            ? 'text-[#35D07F] bg-[#35D07F]/15 hover:bg-[#35D07F]/25'
                            : 'text-[#86868b] hover:text-[#181c19] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/10'
                        }`}
                      >
                        {!audioState.isBkgMusicMuted && !audioState.isMuted ? (
                          <Headphones className="w-4 h-4" />
                        ) : (
                          <HeadphoneOff className="w-4 h-4" />
                        )}
                      </motion.button>

                      {/* Subtle Translucent Glass Divider */}
                      <div className="w-[1px] h-4 bg-black/10 dark:bg-white/15 mx-0.5" />

                      {/* Option 2: Sound Effects (Volume2 / VolumeX) */}
                      <motion.button
                        onClick={toggleEffects}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        aria-label={!audioState.isEffectsMuted && !audioState.isMuted ? 'Mute Sound Effects' : 'Unmute Sound Effects'}
                        className={`p-2 rounded-xl cursor-pointer transition-colors ${
                          !audioState.isEffectsMuted && !audioState.isMuted
                            ? 'text-[#35D07F] bg-[#35D07F]/15 hover:bg-[#35D07F]/25'
                            : 'text-[#86868b] hover:text-[#181c19] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/10'
                        }`}
                      >
                        {!audioState.isEffectsMuted && !audioState.isMuted ? (
                          <Volume2 className="w-4 h-4" />
                        ) : (
                          <VolumeX className="w-4 h-4" />
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              id="pill-theme-toggle-btn"
              onClick={() => {
                soundEngine.playJiggle();
                onToggleTheme();
              }}
              onMouseEnter={() => !audioState.isEffectsMuted && !audioState.isMuted && soundEngine.playBlob(0, 0.5)}
              whileHover={{ scale: 1.12, rotate: 12 }}
              whileTap={{ scale: 0.88, rotate: -20 }}
              transition={{ type: 'spring', stiffness: 450, damping: 14 }}
              className={`p-1.5 sm:p-2 rounded-full cursor-pointer transition-colors ${
                theme === 'dark'
                  ? 'bg-white/10 hover:bg-white/15 text-amber-300'
                  : 'bg-black/[0.04] hover:bg-black/[0.07] text-[#181c19]'
              } shadow-sm backdrop-blur-md`}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-300" />
              ) : (
                <Moon className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#181c19]" />
              )}
            </motion.button>

            {/* Mobile Hamburger / Close Button */}
            <motion.button
              id="mobile-menu-toggle-btn"
              onClick={() => {
                soundEngine.playTick();
                setIsMobileMenuOpen((prev) => !prev);
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="md:hidden p-1.5 sm:p-2 rounded-full bg-black/[0.04] dark:bg-white/10 text-[#181c19] dark:text-white cursor-pointer"
              aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4 text-red-500 dark:text-red-400" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu Drawer */}
        <div className="w-full max-w-md mx-auto px-2 sm:px-4 pointer-events-none">
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={`pointer-events-auto md:hidden mt-2 p-3 sm:p-3.5 rounded-2xl shadow-2xl ${
                  theme === 'dark'
                    ? 'nav-glass-dark text-white'
                    : 'nav-glass-light text-[#181c19]'
                }`}
              >
                <div className="flex flex-col gap-1 relative z-10">
                  {NAV_ITEMS.map((item, idx) => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`mobile-nav-link-${item.id}`}
                        onClick={() => scrollToSection(item.id, idx)}
                        className={`w-full min-h-[44px] text-left px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors flex items-center justify-between ${
                          isActive
                            ? theme === 'dark'
                              ? 'bg-white/15 text-white font-semibold'
                              : 'bg-black/[0.07] text-[#181c19] font-semibold'
                            : theme === 'dark'
                              ? 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                              : 'text-[#6e7670] hover:bg-black/[0.04] hover:text-[#181c19]'
                        }`}
                      >
                        <span>{item.label}</span>
                        {isActive && (
                          <span className="w-2 h-2 rounded-full bg-[#35D07F] shadow-[0_0_8px_rgba(53,208,127,0.7)]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
};
