import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Music, 
  Sliders, 
  X, 
  Sparkles, 
  Activity, 
  Compass, 
  Radio, 
  Check, 
  Disc,
  Play,
  RotateCcw
} from 'lucide-react';
import { 
  soundEngine, 
  SoundProfile, 
  SoundTriggerEvent, 
  SECTION_HARMONICS,
  AudioChannelsState
} from '../services/soundEngine';
import { Theme } from '../types';

interface SoundManagerProps {
  theme: Theme;
}

export const SoundManager: React.FC<SoundManagerProps> = ({ theme }) => {
  const [isMuted, setIsMuted] = useState<boolean>(soundEngine.getMuted());
  const [audioState, setAudioState] = useState<AudioChannelsState>(soundEngine.getAudioChannelsState());
  const [volume, setVolume] = useState<number>(soundEngine.getVolume());
  const [soundProfile, setSoundProfileState] = useState<SoundProfile>(soundEngine.getSoundProfile());
  const [isAmbientPlaying, setIsAmbientPlaying] = useState<boolean>(soundEngine.getIsAmbientPlaying());
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [lastEvent, setLastEvent] = useState<SoundTriggerEvent | null>(null);
  const [isSoundActive, setIsSoundActive] = useState<boolean>(false);
  
  // Granular settings persisted in localStorage
  const [enableButtonClicks, setEnableButtonClicks] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('sound_btn_enabled');
    return saved !== null ? saved === 'true' : true;
  });
  
  const [enableSectionNav, setEnableSectionNav] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('sound_nav_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  const soundTimeoutRef = useRef<number | null>(null);
  const hasInteractedRef = useRef<boolean>(false);
  const lastNavSectionRef = useRef<string>('hero');
  const lastNavTimeRef = useRef<number>(0);

  // Sync state with soundEngine and subscribe to events
  useEffect(() => {
    setIsMuted(soundEngine.getMuted());
    setVolume(soundEngine.getVolume());
    setSoundProfileState(soundEngine.getSoundProfile());
    setIsAmbientPlaying(soundEngine.getIsAmbientPlaying());

    const unsubChannels = soundEngine.onAudioChannelsChange((state) => {
      setAudioState(state);
      setIsMuted(state.isMuted);
    });
    const unsubProfile = soundEngine.onProfileChange((profile) => setSoundProfileState(profile));
    
    // Live visualizer trigger
    const unsubTrigger = soundEngine.onSoundTrigger((event) => {
      setLastEvent(event);
      setIsSoundActive(true);
      if (soundTimeoutRef.current) clearTimeout(soundTimeoutRef.current);
      soundTimeoutRef.current = window.setTimeout(() => {
        setIsSoundActive(false);
      }, 550);
    });

    return () => {
      unsubChannels();
      unsubProfile();
      unsubTrigger();
      if (soundTimeoutRef.current) clearTimeout(soundTimeoutRef.current);
    };
  }, []);

  // 1. AUTOMATIC BUTTON CLICK CAPTURE
  // Listens globally for clicks on buttons, triggers soft harmonic UI tones
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      hasInteractedRef.current = true;
      if (!enableButtonClicks || soundEngine.getMuted()) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Find closest clickable button or interactive role
      const clickable = target.closest<HTMLElement>(
        'button, [role="button"], a.apple-btn-primary, input[type="submit"], input[type="button"], [data-sound]'
      );

      if (!clickable) return;

      // Explicit suppression via data-sound="none"
      const explicitSound = clickable.getAttribute('data-sound');
      if (explicitSound === 'none') return;

      // Determine tone variation
      const id = clickable.id || '';
      const text = (clickable.textContent || '').trim().toLowerCase();
      const isDismiss = id.includes('close') || id.includes('dismiss') || id.includes('cancel') || text === 'x' || text === 'close';
      const isToggle = id.includes('toggle') || clickable.getAttribute('aria-pressed') !== null || clickable.getAttribute('role') === 'switch';
      const isPrimary = clickable.classList.contains('apple-btn-primary') || id.includes('primary') || id.includes('submit') || text.includes('view') || text.includes('explore');

      if (explicitSound === 'droplet') {
        soundEngine.playDroplet();
      } else if (explicitSound === 'blob') {
        soundEngine.playBlob();
      } else if (explicitSound === 'jiggle') {
        soundEngine.playJiggle();
      } else if (explicitSound === 'chime') {
        soundEngine.playMarimbaNote(3);
      } else if (isDismiss) {
        soundEngine.playHarmonicClick('dismiss');
      } else if (isToggle) {
        soundEngine.playHarmonicClick('toggle');
      } else if (isPrimary) {
        soundEngine.playHarmonicClick('primary');
      } else {
        soundEngine.playHarmonicClick('subtle');
      }
    };

    window.addEventListener('click', handleGlobalClick, { capture: true });
    return () => {
      window.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, [enableButtonClicks]);

  // 2. AUTOMATIC SECTION NAVIGATION INTERSECTION WATCHER
  // Detects when the user navigates between sections via scrolling or clicking
  useEffect(() => {
    const sectionIds = ['hero', 'about', 'skills', 'experience', 'systems', 'projects', 'contact'];
    const sectionElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sectionElements.length === 0) return;

    // Use IntersectionObserver with calibrated viewport rootMargin
    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible section with highest intersection ratio
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length === 0) return;

        // Sort by intersection ratio or proximity to viewport center
        visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const topEntry = visibleEntries[0];
        const newSectionId = topEntry.target.id;

        if (newSectionId && newSectionId !== lastNavSectionRef.current) {
          const now = Date.now();
          const prevSection = lastNavSectionRef.current;
          lastNavSectionRef.current = newSectionId;
          setActiveSection(newSectionId);

          // Only trigger audio if user has interacted with the document
          // and throttling prevents rapid continuous scroll spam
          if (hasInteractedRef.current && enableSectionNav && !soundEngine.getMuted()) {
            if (now - lastNavTimeRef.current > 650) {
              lastNavTimeRef.current = now;
              soundEngine.playSectionNavigationTone(newSectionId);
            }
          }
        }
      },
      {
        threshold: [0.2, 0.5, 0.8],
        rootMargin: '-15% 0px -40% 0px',
      }
    );

    sectionElements.forEach((el) => observer.observe(el));

    // Also listen to custom navigation events if needed
    const handleManualNav = (e: CustomEvent<{ sectionId: string }>) => {
      if (e.detail?.sectionId && enableSectionNav && !soundEngine.getMuted()) {
        hasInteractedRef.current = true;
        soundEngine.playSectionNavigationTone(e.detail.sectionId);
        setActiveSection(e.detail.sectionId);
      }
    };

    window.addEventListener('portfolio:navigate' as any, handleManualNav as EventListener);

    return () => {
      observer.disconnect();
      window.removeEventListener('portfolio:navigate' as any, handleManualNav as EventListener);
    };
  }, [enableSectionNav]);

  const toggleMute = () => {
    hasInteractedRef.current = true;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
    if (!nextMuted) {
      soundEngine.playHarmonicClick('toggle', true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    hasInteractedRef.current = true;
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundEngine.setVolume(val);
    if (isMuted && val > 0) {
      setIsMuted(false);
      soundEngine.setMuted(false);
    }
  };

  const handleProfileChange = (profile: SoundProfile) => {
    hasInteractedRef.current = true;
    soundEngine.setSoundProfile(profile);
  };

  const toggleAmbient = () => {
    hasInteractedRef.current = true;
    soundEngine.playHarmonicClick('toggle');
    const playing = soundEngine.toggleAmbientPad();
    setIsAmbientPlaying(playing);
  };

  const toggleButtonClicks = () => {
    hasInteractedRef.current = true;
    soundEngine.playHarmonicClick('toggle');
    const next = !enableButtonClicks;
    setEnableButtonClicks(next);
    localStorage.setItem('sound_btn_enabled', String(next));
  };

  const toggleSectionNav = () => {
    hasInteractedRef.current = true;
    soundEngine.playHarmonicClick('toggle');
    const next = !enableSectionNav;
    setEnableSectionNav(next);
    localStorage.setItem('sound_nav_enabled', String(next));
  };

  const previewSectionTone = (sectionId: string) => {
    hasInteractedRef.current = true;
    soundEngine.playSectionNavigationTone(sectionId);
    setActiveSection(sectionId);
  };

  const scrollToSectionFromConsole = (sectionId: string) => {
    previewSectionTone(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const previewClickTone = (variation: 'primary' | 'subtle' | 'soft' | 'toggle' | 'dismiss') => {
    hasInteractedRef.current = true;
    soundEngine.playHarmonicClick(variation, true);
  };

  const audioStats = soundEngine.getAudioStats();

  return (
    <aside 
      aria-label="Sound Manager"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 select-none print:hidden pointer-events-none"
    >
      <div className="relative pointer-events-auto flex flex-col items-end">
        {/* Floating Mini Audio Pill (Closed state) */}
        <motion.button
          id="sound-manager-floating-pill"
          onClick={() => {
            hasInteractedRef.current = true;
            soundEngine.playHarmonicClick('toggle');
            setIsOpen(!isOpen);
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 450, damping: 18 }}
          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full cursor-pointer transition-all shadow-xl backdrop-blur-xl border ${
            theme === 'dark'
              ? 'bg-[#121614]/85 border-white/[0.08] text-slate-200 hover:bg-[#181d1a]'
              : 'bg-white/90 border-black/[0.06] text-[#181c19] hover:bg-white shadow-emerald-950/[0.04]'
          }`}
          title="Sound Manager: Harmonic UI tones & acoustic synthesizer"
          aria-expanded={isOpen}
          aria-controls="sound-manager-panel"
        >
          {/* Speaker Icon & Dynamic Equalizer Bars */}
          <div className="flex items-center gap-1.5">
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-[#86868b]" />
            ) : (
              <div className="flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-[#35D07F]" />
                
                {/* 3 Animated Waveform Bars */}
                <div className="flex items-center gap-[2px] h-3 px-0.5">
                  <motion.span
                    animate={
                      !isMuted
                        ? isSoundActive
                          ? { height: [4, 13, 6, 14, 5] }
                          : { height: [3, 7, 4, 8, 3] }
                        : { height: 2 }
                    }
                    transition={{
                      repeat: Infinity,
                      duration: isSoundActive ? 0.35 : 1.6,
                      ease: 'easeInOut',
                    }}
                    className={`w-[2px] rounded-full inline-block ${
                      isSoundActive ? 'bg-[#35D07F]' : 'bg-[#35D07F]/70'
                    }`}
                  />
                  <motion.span
                    animate={
                      !isMuted
                        ? isSoundActive
                          ? { height: [9, 5, 14, 7, 11] }
                          : { height: [6, 3, 9, 4, 6] }
                        : { height: 2 }
                    }
                    transition={{
                      repeat: Infinity,
                      duration: isSoundActive ? 0.42 : 1.8,
                      ease: 'easeInOut',
                    }}
                    className={`w-[2px] rounded-full inline-block ${
                      isSoundActive ? 'bg-[#35D07F]' : 'bg-[#35D07F]/70'
                    }`}
                  />
                  <motion.span
                    animate={
                      !isMuted
                        ? isSoundActive
                          ? { height: [5, 12, 8, 4, 13] }
                          : { height: [4, 8, 5, 3, 7] }
                        : { height: 2 }
                    }
                    transition={{
                      repeat: Infinity,
                      duration: isSoundActive ? 0.3 : 1.5,
                      ease: 'easeInOut',
                    }}
                    className={`w-[2px] rounded-full inline-block ${
                      isSoundActive ? 'bg-[#35D07F]' : 'bg-[#35D07F]/70'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Label and live event badge */}
            <div className="flex items-center gap-1.5 font-mono text-[11px] font-medium">
              <span className="hidden sm:inline">Sound</span>
              {isMuted || (audioState.isBkgMusicMuted && audioState.isEffectsMuted) ? (
                <span className="text-[#86868b]">Muted</span>
              ) : (
                <span className="text-emerald-700 dark:text-[#35D07F]">
                  {!audioState.isBkgMusicMuted && audioState.isBkgMusicPlaying ? 'Bkg Music' : soundProfile}
                </span>
              )}
            </div>
          </div>

          {/* Mini Real-Time Audio Trigger Indicator */}
          <AnimatePresence>
            {isSoundActive && lastEvent && !isMuted && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8, x: -4 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 2 }}
                transition={{ duration: 0.15 }}
                className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#35D07F]/15 text-[#35D07F] font-mono text-[10px]"
              >
                <span className="w-1 h-1 rounded-full bg-[#35D07F] animate-ping" />
                <span className="truncate max-w-[90px]">{lastEvent.label}</span>
              </motion.span>
            )}
          </AnimatePresence>

          <Sliders className="w-3 h-3 text-[#6e7670] dark:text-slate-400 ml-0.5" />
        </motion.button>

        {/* Expanded Sound Manager Glass Console Card */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="sound-manager-panel"
              role="region"
              aria-label="Sound Manager Console"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: 'spring', stiffness: 420, damping: 24 }}
              className={`mb-3 w-[calc(100vw-2.5rem)] sm:w-96 max-h-[82vh] overflow-y-auto p-4 sm:p-5 rounded-[24px] shadow-2xl backdrop-blur-2xl border ${
                theme === 'dark'
                  ? 'bg-[#0f1411]/92 border-white/[0.09] text-slate-200'
                  : 'bg-white/94 border-black/[0.08] text-[#181c19]'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-black/[0.05] dark:border-white/[0.07]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-[#35D07F] flex items-center justify-center">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold tracking-tight">Sound Synthesis Manager</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#35D07F] shadow-[0_0_8px_rgba(53,208,127,0.7)]" />
                    </div>
                    <p className="text-[10px] text-[#6e7670] dark:text-[#9ea8a0] font-mono">
                      Harmonic UI tones • Web Audio API
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundEngine.playHarmonicClick('dismiss');
                    setIsOpen(false);
                  }}
                  className="p-1.5 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/10 text-[#6e7670] dark:text-slate-400 cursor-pointer transition-colors"
                  aria-label="Close Sound Manager"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Main Controls Area */}
              <div className="py-3.5 space-y-4 text-xs">
                
                {/* 1. Mute & Volume Bar */}
                <div className="p-3 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.05] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-emerald-700 dark:text-[#35D07F]" />
                      <span className="font-semibold text-xs">Master Audio State</span>
                    </div>

                    <button
                      onClick={toggleMute}
                      className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                        !isMuted
                          ? 'bg-[#181c19] dark:bg-white text-white dark:text-[#181c19] shadow-sm'
                          : 'bg-black/[0.06] dark:bg-white/10 text-[#86868b] dark:text-slate-400'
                      }`}
                    >
                      {!isMuted ? 'Active' : 'Muted'}
                    </button>
                  </div>

                  {/* Volume Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-mono text-[#6e7670] dark:text-slate-400">
                      <span>Synthesizer Gain</span>
                      <span>{Math.round(volume * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.02"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-full h-1.5 bg-black/[0.08] dark:bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#35D07F]"
                    />
                  </div>
                </div>

                {/* 2. Sound Profile Selector */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#6e7670] dark:text-[#9ea8a0] mb-2 font-mono uppercase tracking-wider">
                    Harmonic Sound Profile
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.05]">
                    {(['harmonic', 'liquid', 'minimal'] as SoundProfile[]).map((prof) => {
                      const isActive = soundProfile === prof;
                      return (
                        <button
                          key={prof}
                          onClick={() => handleProfileChange(prof)}
                          className={`py-1.5 px-2 rounded-xl text-center text-xs font-medium capitalize cursor-pointer transition-all ${
                            isActive
                              ? theme === 'dark'
                                ? 'bg-white/15 text-white font-semibold shadow-sm'
                                : 'bg-white text-emerald-950 font-semibold shadow-sm'
                              : 'text-[#6e7670] dark:text-slate-400 hover:text-white'
                          }`}
                        >
                          {prof}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Audio Channels: Background Music & Other Sounds Separately */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03]">
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        !audioState.isBkgMusicMuted && !audioState.isMuted
                          ? 'bg-[#35D07F]/15 text-[#35D07F]'
                          : 'bg-black/[0.04] dark:bg-white/10 text-[#86868b]'
                      }`}>
                        <Music className={`w-3.5 h-3.5 ${!audioState.isBkgMusicMuted && !audioState.isMuted && audioState.isBkgMusicPlaying ? 'animate-pulse' : ''}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs flex items-center gap-1.5">
                          <span>Background Music</span>
                          {!audioState.isBkgMusicMuted && !audioState.isMuted && audioState.isBkgMusicPlaying && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#35D07F]" />
                          )}
                        </div>
                        <div className="text-[10px] text-[#6e7670] dark:text-[#9ea8a0] font-mono truncate">
                          Inception • Patrik Pietschmann (On by default)
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        hasInteractedRef.current = true;
                        soundEngine.toggleBkgMusic();
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-colors cursor-pointer shrink-0 ${
                        !audioState.isBkgMusicMuted && !audioState.isMuted
                          ? 'bg-emerald-500/20 text-emerald-800 dark:text-[#35D07F] border border-emerald-500/30'
                          : 'bg-black/[0.05] dark:bg-white/10 text-[#86868b]'
                      }`}
                    >
                      {!audioState.isBkgMusicMuted && !audioState.isMuted ? 'Playing' : 'Muted'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03]">
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        !audioState.isEffectsMuted && !audioState.isMuted
                          ? 'bg-[#35D07F]/15 text-[#35D07F]'
                          : 'bg-black/[0.04] dark:bg-white/10 text-[#86868b]'
                      }`}>
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs">Interaction Sounds & Tones</div>
                        <div className="text-[10px] text-[#6e7670] dark:text-[#9ea8a0] font-mono truncate">
                          Soft harmonic button clicks & section tones
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        hasInteractedRef.current = true;
                        soundEngine.toggleEffects();
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-colors cursor-pointer shrink-0 ${
                        !audioState.isEffectsMuted && !audioState.isMuted
                          ? 'bg-emerald-500/20 text-emerald-800 dark:text-[#35D07F] border border-emerald-500/30'
                          : 'bg-black/[0.05] dark:bg-white/10 text-[#86868b]'
                      }`}
                    >
                      {!audioState.isEffectsMuted && !audioState.isMuted ? 'Enabled' : 'Muted'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03]">
                    <div>
                      <div className="font-medium text-xs">Button Click Tones</div>
                      <div className="text-[10px] text-[#6e7670] dark:text-[#9ea8a0]">
                        Triggers warm, soft harmonic chimes on user clicks
                      </div>
                    </div>
                    <button
                      onClick={toggleButtonClicks}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-colors cursor-pointer ${
                        enableButtonClicks && !isMuted && !audioState.isEffectsMuted
                          ? 'bg-emerald-500/20 text-emerald-800 dark:text-[#35D07F] border border-emerald-500/30'
                          : 'bg-black/[0.05] dark:bg-white/10 text-[#86868b]'
                      }`}
                    >
                      {enableButtonClicks ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03]">
                    <div>
                      <div className="font-medium text-xs">Section Navigation Tones</div>
                      <div className="text-[10px] text-[#6e7670] dark:text-[#9ea8a0]">
                        Harmonic pentatonic intervals as you move between sections
                      </div>
                    </div>
                    <button
                      onClick={toggleSectionNav}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium transition-colors cursor-pointer ${
                        enableSectionNav && !isMuted && !audioState.isEffectsMuted
                          ? 'bg-emerald-500/20 text-emerald-800 dark:text-[#35D07F] border border-emerald-500/30'
                          : 'bg-black/[0.05] dark:bg-white/10 text-[#86868b]'
                      }`}
                    >
                      {enableSectionNav ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                </div>

                {/* 4. Section Navigation Harmonic Tones Soundboard */}
                <div className="pt-2 border-t border-black/[0.05] dark:border-white/[0.07]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-[#6e7670] dark:text-[#9ea8a0] font-mono uppercase tracking-wider">
                      Section Harmonic Chords
                    </span>
                    <span className="text-[10px] font-mono text-[#6e7670] dark:text-slate-400">
                      Active: {activeSection}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {Object.values(SECTION_HARMONICS).map((sec) => {
                      const isCurrent = activeSection === sec.id;
                      return (
                        <motion.button
                          key={sec.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => scrollToSectionFromConsole(sec.id)}
                          className={`p-2 rounded-xl text-left transition-all cursor-pointer border ${
                            isCurrent
                              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-900 dark:text-[#35D07F]'
                              : 'bg-black/[0.02] dark:bg-white/[0.03] border-black/[0.04] dark:border-white/[0.05] hover:bg-black/[0.05] dark:hover:bg-white/[0.08]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs">{sec.name}</span>
                            <Play className="w-2.5 h-2.5 opacity-60" />
                          </div>
                          <div className="text-[10px] font-mono opacity-70 mt-0.5 truncate">
                            {sec.chordName}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Button Tone Variations Preview */}
                <div className="pt-2 border-t border-black/[0.05] dark:border-white/[0.07]">
                  <span className="block text-[11px] font-semibold text-[#6e7670] dark:text-[#9ea8a0] mb-2 font-mono uppercase tracking-wider">
                    Interactive Button Tones Preview
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    <button
                      onClick={() => previewClickTone('primary')}
                      className="py-1.5 px-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] hover:bg-emerald-500/15 text-[10px] font-mono text-center font-medium cursor-pointer transition-colors"
                      title="Primary Action Tone (C5 523Hz)"
                    >
                      Primary
                    </button>
                    <button
                      onClick={() => previewClickTone('subtle')}
                      className="py-1.5 px-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] hover:bg-emerald-500/15 text-[10px] font-mono text-center font-medium cursor-pointer transition-colors"
                      title="Subtle Glass Tone (E5 659Hz)"
                    >
                      Subtle
                    </button>
                    <button
                      onClick={() => previewClickTone('toggle')}
                      className="py-1.5 px-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] hover:bg-emerald-500/15 text-[10px] font-mono text-center font-medium cursor-pointer transition-colors"
                      title="Two-Step Toggle Tone (A4 → E5)"
                    >
                      Toggle
                    </button>
                    <button
                      onClick={() => previewClickTone('dismiss')}
                      className="py-1.5 px-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] hover:bg-emerald-500/15 text-[10px] font-mono text-center font-medium cursor-pointer transition-colors"
                      title="Dismiss Soft Drop (C5 → G4)"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>

                {/* 6. Audio Engine Diagnostics Strip */}
                <div className="pt-2 border-t border-black/[0.04] dark:border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-[#6e7670] dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-[#35D07F]" />
                    <span>DSP: {audioStats.sampleRate / 1000}kHz</span>
                  </div>
                  <div>Latency: {audioStats.latency}</div>
                  <div>Zero External Assets</div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
};
