/**
 * Liquid Web Audio Tone Synthesizer
 * Generates organic water droplet tones, crystal marimba notes, jelly squishes,
 * and soothing ambient chords procedurally with zero external asset dependencies.
 */

export type SoundProfile = 'harmonic' | 'liquid' | 'minimal';

export interface AudioChannelsState {
  isMuted: boolean;
  isBkgMusicMuted: boolean;
  isEffectsMuted: boolean;
  isBkgMusicPlaying: boolean;
  volume: number;
}

export interface SoundTriggerEvent {
  type: 'click' | 'navigation' | 'ambient' | 'effect';
  label: string;
  freq?: number;
  sectionId?: string;
  timestamp: number;
}

export interface SectionHarmonicConfig {
  id: string;
  name: string;
  chordName: string;
  notes: number[];
  description: string;
}

export const SECTION_HARMONICS: Record<string, SectionHarmonicConfig> = {
  hero: {
    id: 'hero',
    name: 'Home',
    chordName: 'Cmaj (C4 + G4)',
    notes: [261.63, 392.00],
    description: 'Grounding Root Fifth',
  },
  about: {
    id: 'about',
    name: 'About',
    chordName: 'D-sus (D4 + A4)',
    notes: [293.66, 440.00],
    description: 'Reflective Open Interval',
  },
  skills: {
    id: 'skills',
    name: 'Skills',
    chordName: 'E-min (E4 + B4)',
    notes: [329.63, 493.88],
    description: 'Expansive Harmonic Fifth',
  },
  experience: {
    id: 'experience',
    name: 'Experience',
    chordName: 'G-add9 (392.00 + 587.33)',
    notes: [392.00, 587.33],
    description: 'Dynamic Career Interval',
  },
  systems: {
    id: 'systems',
    name: 'Systems',
    chordName: 'A-modal (440.00 + 659.25)',
    notes: [440.00, 659.25],
    description: 'Resonant Technical Fifth',
  },
  projects: {
    id: 'projects',
    name: 'Projects',
    chordName: 'C-high (523.25 + 783.99)',
    notes: [523.25, 783.99],
    description: 'Crystal Showcase Chime',
  },
  contact: {
    id: 'contact',
    name: 'Contact',
    chordName: 'D-high (587.33 + 880.00)',
    notes: [587.33, 880.00],
    description: 'Airy Transmission Harmony',
  },
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5;
  private soundProfile: SoundProfile = 'harmonic';

  // Background Music Audio Element
  private bgAudio: HTMLAudioElement | null = null;
  private bkgVolume: number = 0.38;
  private isBkgMusicMuted: boolean = false;
  private isEffectsMuted: boolean = false;
  private isBkgMusicPlaying: boolean = false;

  private muteListeners: Set<(muted: boolean) => void> = new Set();
  private profileListeners: Set<(profile: SoundProfile) => void> = new Set();
  private triggerListeners: Set<(event: SoundTriggerEvent) => void> = new Set();
  private channelListeners: Set<(state: AudioChannelsState) => void> = new Set();
  private lastSoundTimes: Record<string, number> = {};

  // Ambient pad nodes
  private ambientGain: GainNode | null = null;
  private ambientOscillators: OscillatorNode[] = [];
  private isAmbientPlaying: boolean = false;

  private pentatonicFrequencies = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25, // E5
  ];

  constructor() {
    // AudioContext will be initialized on first user gesture
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('sound_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
      const savedBkgMute = localStorage.getItem('bkg_music_muted');
      if (savedBkgMute !== null) {
        this.isBkgMusicMuted = savedBkgMute === 'true';
      } else {
        // By default background music is turned ON!
        this.isBkgMusicMuted = false;
      }
      const savedSfxMute = localStorage.getItem('sfx_music_muted');
      if (savedSfxMute !== null) {
        this.isEffectsMuted = savedSfxMute === 'true';
      }
      const savedVol = localStorage.getItem('sound_volume');
      if (savedVol !== null) {
        this.volume = parseFloat(savedVol);
      }
      const savedProfile = localStorage.getItem('sound_profile') as SoundProfile | null;
      if (savedProfile === 'harmonic' || savedProfile === 'liquid' || savedProfile === 'minimal') {
        this.soundProfile = savedProfile;
      }

      // Initialize background music automatically on startup
      this.initBackgroundMusic();
    }
  }

  /**
   * Subscribe to audio channel state updates (Bkg music, SFX, Master Mute)
   */
  public onAudioChannelsChange(callback: (state: AudioChannelsState) => void): () => void {
    this.channelListeners.add(callback);
    callback(this.getAudioChannelsState());
    return () => this.channelListeners.delete(callback);
  }

  private notifyAudioChannels() {
    const state = this.getAudioChannelsState();
    this.channelListeners.forEach((cb) => {
      try {
        cb(state);
      } catch {
        /* ignore */
      }
    });
  }

  public getAudioChannelsState(): AudioChannelsState {
    return {
      isMuted: this.isMuted,
      isBkgMusicMuted: this.isBkgMusicMuted,
      isEffectsMuted: this.isEffectsMuted,
      isBkgMusicPlaying: this.isBkgMusicPlaying,
      volume: this.volume,
    };
  }

  /**
   * Initialize and buffer the background music track
   */
  public initBackgroundMusic() {
    if (typeof window === 'undefined' || this.bgAudio) return;
    try {
      this.bgAudio = new Audio('/background-music.mp3');
      this.bgAudio.loop = true;
      this.bgAudio.preload = 'auto';
      this.bgAudio.volume = this.isBkgMusicMuted || this.isMuted ? 0 : this.bkgVolume;

      this.bgAudio.addEventListener('play', () => {
        this.isBkgMusicPlaying = true;
        this.notifyAudioChannels();
      });

      this.bgAudio.addEventListener('pause', () => {
        this.isBkgMusicPlaying = false;
        this.notifyAudioChannels();
      });

      // By default background music is turned ON
      if (!this.isBkgMusicMuted && !this.isMuted) {
        this.attemptPlayBkgMusic();
      }
    } catch {
      // Audio element fallback
    }
  }

  /**
   * Attempt to play background music with autoplay policy unlock
   */
  public attemptPlayBkgMusic() {
    if (typeof window === 'undefined') return;
    if (!this.bgAudio) {
      this.initBackgroundMusic();
    }
    if (!this.bgAudio || this.isBkgMusicMuted || this.isMuted) return;

    this.bgAudio.volume = this.bkgVolume;
    const playPromise = this.bgAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isBkgMusicPlaying = true;
          this.notifyAudioChannels();
        })
        .catch(() => {
          // Browser requires user interaction before autoplay
          this.isBkgMusicPlaying = false;
          const unlock = () => {
            if (!this.isBkgMusicMuted && !this.isMuted && this.bgAudio) {
              this.bgAudio.volume = this.bkgVolume;
              this.bgAudio.play().then(() => {
                this.isBkgMusicPlaying = true;
                this.notifyAudioChannels();
              }).catch(() => {});
            }
            window.removeEventListener('pointerdown', unlock);
            window.removeEventListener('click', unlock);
            window.removeEventListener('keydown', unlock);
            window.removeEventListener('touchstart', unlock);
          };
          window.addEventListener('pointerdown', unlock, { once: true });
          window.addEventListener('click', unlock, { once: true });
          window.addEventListener('keydown', unlock, { once: true });
          window.addEventListener('touchstart', unlock, { once: true });
        });
    }
  }

  public setBkgMusicMuted(muted: boolean) {
    this.isBkgMusicMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('bkg_music_muted', String(muted));
    }
    if (this.bgAudio) {
      if (muted) {
        this.bgAudio.volume = 0;
        this.bgAudio.pause();
        this.isBkgMusicPlaying = false;
      } else {
        this.bgAudio.volume = this.bkgVolume;
        this.attemptPlayBkgMusic();
      }
    }
    this.notifyAudioChannels();
  }

  public getBkgMusicMuted(): boolean {
    return this.isBkgMusicMuted;
  }

  public toggleBkgMusic(): boolean {
    const next = !this.isBkgMusicMuted;
    this.setBkgMusicMuted(next);
    return next;
  }

  public setEffectsMuted(muted: boolean) {
    this.isEffectsMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sfx_music_muted', String(muted));
    }
    this.notifyAudioChannels();
  }

  public getEffectsMuted(): boolean {
    return this.isEffectsMuted;
  }

  public toggleEffects(): boolean {
    const next = !this.isEffectsMuted;
    this.setEffectsMuted(next);
    return next;
  }

  public isSfxMuted(): boolean {
    return this.isMuted || this.isEffectsMuted;
  }

  /**
   * Subscribe to mute changes so all UI switches stay perfectly synchronized
   */
  public onMuteChange(callback: (muted: boolean) => void): () => void {
    this.muteListeners.add(callback);
    return () => this.muteListeners.delete(callback);
  }

  /**
   * Subscribe to sound profile changes
   */
  public onProfileChange(callback: (profile: SoundProfile) => void): () => void {
    this.profileListeners.add(callback);
    return () => this.profileListeners.delete(callback);
  }

  /**
   * Subscribe to live audio trigger events for visualizers and HUD readouts
   */
  public onSoundTrigger(callback: (event: SoundTriggerEvent) => void): () => void {
    this.triggerListeners.add(callback);
    return () => this.triggerListeners.delete(callback);
  }

  private emitTrigger(event: SoundTriggerEvent) {
    this.triggerListeners.forEach((cb) => {
      try {
        cb(event);
      } catch {
        /* listener error */
      }
    });
  }

  public getSoundProfile(): SoundProfile {
    return this.soundProfile;
  }

  public setSoundProfile(profile: SoundProfile) {
    this.soundProfile = profile;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sound_profile', profile);
    }
    this.profileListeners.forEach((cb) => {
      try {
        cb(profile);
      } catch {
        /* listener error */
      }
    });
    // Trigger preview of new profile
    this.playHarmonicClick('primary');
  }

  public getAudioStats() {
    return {
      state: this.ctx ? this.ctx.state : 'suspended',
      sampleRate: this.ctx ? this.ctx.sampleRate : 48000,
      latency: '< 5ms',
      profile: this.soundProfile,
      isMuted: this.isMuted,
      volume: this.volume,
    };
  }

  /**
   * Soft, Harmonic UI Tones for Button Clicks
   * Pure procedural sine/triangle synthesis with gentle exponential decay,
   * warm low-pass acoustic filtering, and zero digital harshness or clicks.
   */
  public playHarmonicClick(
    variation: 'primary' | 'subtle' | 'soft' | 'toggle' | 'dismiss' = 'primary',
    forcePlay: boolean = false
  ) {
    if ((this.isMuted || this.isEffectsMuted) && !forcePlay) return;
    if (!this.canPlay('harmonic_click_' + variation, 45)) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;

      // Delegate to profile if alternate profile chosen
      if (this.soundProfile === 'liquid') {
        if (variation === 'primary') this.playBlobBounce();
        else if (variation === 'toggle') this.playJiggle();
        else if (variation === 'dismiss') this.playBlobPop();
        else this.playDroplet();
        this.emitTrigger({
          type: 'click',
          label: `Liquid • ${variation}`,
          timestamp: Date.now(),
        });
        return;
      }

      if (this.soundProfile === 'minimal') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const freq = variation === 'primary' ? 1200 : variation === 'toggle' ? 1600 : 900;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.04);
        this.emitTrigger({
          type: 'click',
          label: `Minimal Tap • ${freq}Hz`,
          freq,
          timestamp: Date.now(),
        });
        return;
      }

      // Default 'harmonic' profile: Pure, silky musical tones
      if (variation === 'toggle') {
        // Cheerful two-tone micro-arpeggio (A4 -> E5)
        const f1 = 440.0;
        const f2 = 659.25;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        const gain2 = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, now);

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(f1, now);
        gain1.gain.setValueAtTime(0.0001, now);
        gain1.gain.linearRampToValueAtTime(0.18, now + 0.008);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(f2, now + 0.035);
        gain2.gain.setValueAtTime(0.0001, now + 0.035);
        gain2.gain.linearRampToValueAtTime(0.2, now + 0.043);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

        osc1.connect(gain1);
        osc2.connect(gain2);
        gain1.connect(filter);
        gain2.connect(filter);
        filter.connect(this.masterGain);

        osc1.start(now);
        osc1.stop(now + 0.14);
        osc2.start(now + 0.035);
        osc2.stop(now + 0.2);

        this.emitTrigger({
          type: 'click',
          label: 'Harmonic Toggle (A4 → E5)',
          freq: f2,
          timestamp: Date.now(),
        });
        return;
      }

      if (variation === 'dismiss') {
        // Soft falling interval (C5 -> G4)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, now);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(392.00, now + 0.12);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.16, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.18);

        this.emitTrigger({
          type: 'click',
          label: 'Harmonic Dismiss (C5 → G4)',
          freq: 392,
          timestamp: Date.now(),
        });
        return;
      }

      // 'primary' (C5 523Hz + subtle G5 5th) and 'subtle' (E5 659Hz) and 'soft' (G4 392Hz)
      let baseFreq = 523.25; // C5
      let overtoneRatio = 1.5; // G5
      let duration = 0.22;
      let amp = 0.22;
      let label = 'Primary Harmonic (C5)';

      if (variation === 'subtle') {
        baseFreq = 659.25; // E5
        overtoneRatio = 2.0; // E6 shimmer
        duration = 0.14;
        amp = 0.15;
        label = 'Subtle Glass (E5)';
      } else if (variation === 'soft') {
        baseFreq = 392.00; // G4
        overtoneRatio = 1.5; // D5
        duration = 0.25;
        amp = 0.18;
        label = 'Soft Bell (G4)';
      }

      const osc = this.ctx.createOscillator();
      const overtoneOsc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const overtoneGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2600, now);
      filter.Q.setValueAtTime(1.2, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);

      overtoneOsc.type = 'sine';
      overtoneOsc.frequency.setValueAtTime(baseFreq * overtoneRatio, now);

      // Smooth click-free envelope
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(amp, now + 0.009);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      overtoneGain.gain.setValueAtTime(0.0001, now);
      overtoneGain.gain.linearRampToValueAtTime(amp * 0.25, now + 0.008);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);

      osc.connect(gain);
      overtoneOsc.connect(overtoneGain);
      gain.connect(filter);
      overtoneGain.connect(filter);
      filter.connect(this.masterGain);

      osc.start(now);
      overtoneOsc.start(now);
      osc.stop(now + duration + 0.02);
      overtoneOsc.stop(now + duration + 0.02);

      this.emitTrigger({
        type: 'click',
        label,
        freq: baseFreq,
        timestamp: Date.now(),
      });
    } catch {
      // Audio fallback handling
    }
  }

  /**
   * Harmonic Navigation Tones between Sections
   * Triggers calibrated pentatonic intervals and chords for each section
   * in the portfolio: Hero (C4+G4), About (D4+A4), Skills (E4+B4),
   * Experience (G4+D5), Systems (A4+E5), Projects (C5+G5), Contact (D5+A5).
   */
  public playSectionNavigationTone(sectionId: string, customDirection?: 'up' | 'down') {
    if (this.isMuted || this.isEffectsMuted) return;
    const cleanId = sectionId.replace('#', '').toLowerCase();
    const normalizedId = cleanId === 'what-i-build' ? 'systems' : cleanId;
    const config = SECTION_HARMONICS[normalizedId] || SECTION_HARMONICS.hero;

    // Throttle section transitions so continuous fast scroll doesn't cascade
    if (!this.canPlay('sec_nav', 480)) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const notes = config.notes;

      // Play notes with soft arpeggiated voicing
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const noteStartTime = now + idx * 0.038;
        const osc = this.ctx.createOscillator();
        const subOsc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, noteStartTime);
        filter.Q.setValueAtTime(1.8, noteStartTime);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStartTime);

        // Soft sub-octave overtone gives body & warmth
        subOsc.type = 'triangle';
        subOsc.frequency.setValueAtTime(freq * 0.5, noteStartTime);

        const duration = 0.42;
        gain.gain.setValueAtTime(0.0001, noteStartTime);
        gain.gain.linearRampToValueAtTime(0.18 / (idx + 1), noteStartTime + 0.016);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStartTime + duration);

        osc.connect(filter);
        subOsc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(noteStartTime);
        subOsc.start(noteStartTime);
        osc.stop(noteStartTime + duration + 0.04);
        subOsc.stop(noteStartTime + duration + 0.04);
      });

      this.emitTrigger({
        type: 'navigation',
        label: `Section • ${config.name} (${config.chordName})`,
        sectionId: config.id,
        freq: notes[0],
        timestamp: Date.now(),
      });
    } catch {
      // Audio fallback handling
    }
  }

  /**
   * Micro-cooldown to prevent audio clipping during rapid mouse hover movements
   */
  private canPlay(key: string, cooldownMs: number = 40): boolean {
    const now = Date.now();
    if (this.lastSoundTimes[key] && now - this.lastSoundTimes[key] < cooldownMs) {
      return false;
    }
    this.lastSoundTimes[key] = now;
    return true;
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sound_muted', String(muted));
    }
    if (this.bgAudio) {
      if (muted) {
        this.bgAudio.volume = 0;
        this.bgAudio.pause();
        this.isBkgMusicPlaying = false;
      } else if (!this.isBkgMusicMuted) {
        this.bgAudio.volume = this.bkgVolume;
        this.attemptPlayBkgMusic();
      }
    }
    if (this.masterGain && this.ctx) {
      const targetGain = muted ? 0 : this.volume;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }
    this.muteListeners.forEach((cb) => {
      try {
        cb(muted);
      } catch {
        /* listener error fallback */
      }
    });
    this.notifyAudioChannels();
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.bkgVolume = Math.max(0, Math.min(1, vol * 0.75));
    if (typeof window !== 'undefined') {
      localStorage.setItem('sound_volume', String(this.volume));
    }
    if (this.bgAudio && !this.isBkgMusicMuted && !this.isMuted) {
      this.bgAudio.volume = this.bkgVolume;
    }
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
    this.notifyAudioChannels();
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Water Droplet sound: Frequency drop with high-resonance bandpass filter
   */
  public playDroplet(pitchOffset: number = 0) {
    if (this.isMuted || this.isEffectsMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.Q.setValueAtTime(4.0, now);
      filter.frequency.setValueAtTime(1400 + pitchOffset, now);
      filter.frequency.exponentialRampToValueAtTime(700 + pitchOffset, now + 0.12);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1600 + pitchOffset, now);
      osc.frequency.exponentialRampToValueAtTime(650 + pitchOffset, now + 0.14);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Audio fallback handling
    }
  }

  /**
   * Organic Liquid Blob / Bloop sound effect
   * Procedural resonant dual-oscillator liquid acoustic formant
   */
  public playBlob(pitchOffset: number = 0, volumeScale: number = 1) {
    if (this.isMuted || this.isEffectsMuted) return;
    if (!this.canPlay('blob', 45)) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const subOsc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Resonant bandpass gives the distinctive watery bloop formant
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(4.8, now);
      filter.frequency.setValueAtTime(460 + pitchOffset, now);
      filter.frequency.exponentialRampToValueAtTime(880 + pitchOffset, now + 0.045);
      filter.frequency.exponentialRampToValueAtTime(310 + pitchOffset, now + 0.17);

      // Primary blob frequency scoop
      osc.type = 'sine';
      const baseFreq = 230 + pitchOffset * 0.5;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.linearRampToValueAtTime(baseFreq * 1.72, now + 0.04);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.94, now + 0.16);

      // Soft sub-triangle harmonic adds liquid body & viscosity
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(baseFreq * 0.5, now);
      subOsc.frequency.linearRampToValueAtTime(baseFreq * 0.85, now + 0.045);
      subOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.45, now + 0.16);

      // Amplitude envelope
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.28 * volumeScale, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(filter);
      subOsc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      subOsc.start(now);
      osc.stop(now + 0.19);
      subOsc.stop(now + 0.19);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Gelatinous Jiggle Wobble sound effect
   * Procedural LFO-modulated spring vibrato simulating rubbery jelly physical mass
   */
  public playJiggle(baseFreq: number = 240) {
    if (this.isMuted || this.isEffectsMuted) return;
    if (!this.canPlay('jiggle', 60)) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      const masterToneGain = this.ctx.createGain();

      // LFO frequency matches spring oscillation (~16Hz wobble)
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(16.5, now);

      // Wobble depth decays exponentially like physical jelly coming to rest
      lfoGain.gain.setValueAtTime(46, now);
      lfoGain.gain.exponentialRampToValueAtTime(1.0, now + 0.23);

      lfo.connect(osc.frequency);

      // Carrier frequency with soft bend
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.linearRampToValueAtTime(baseFreq + 32, now + 0.035);
      osc.frequency.exponentialRampToValueAtTime(baseFreq - 12, now + 0.22);

      // Warm low-pass filter gives tactile mass
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(920, now);
      filter.frequency.exponentialRampToValueAtTime(360, now + 0.24);

      // Smooth amplitude envelope
      masterToneGain.gain.setValueAtTime(0.001, now);
      masterToneGain.gain.linearRampToValueAtTime(0.25, now + 0.015);
      masterToneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      osc.connect(filter);
      filter.connect(masterToneGain);
      masterToneGain.connect(this.masterGain);

      lfo.start(now);
      osc.start(now);
      lfo.stop(now + 0.26);
      osc.stop(now + 0.26);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Playful Double-Bounce Blob sound
   */
  public playBlobBounce() {
    if (this.isMuted || this.isEffectsMuted) return;
    this.playBlob(0, 1);
    setTimeout(() => {
      if (!this.isMuted && !this.isEffectsMuted) {
        this.playBlob(70, 0.72);
      }
    }, 70);
  }

  /**
   * Wet Jelly Suction / Pop sound
   */
  public playBlobPop() {
    if (this.isMuted || this.isEffectsMuted) return;
    if (!this.canPlay('blob_pop', 40)) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      filter.type = 'lowpass';
      filter.Q.setValueAtTime(5.5, now);
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(320, now + 0.09);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.linearRampToValueAtTime(580, now + 0.025);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.08);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // fallback
    }
  }

  /**
   * Jelly Squish / Wobble sound: Pitch wobble with soft triangle wave
   */
  public playSquish() {
    if (this.isMuted || this.isEffectsMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(360, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.15);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Audio fallback handling
    }
  }

  /**
   * Bubble Pop tone
   */
  public playPop() {
    if (this.isMuted || this.isEffectsMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.06);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Audio fallback handling
    }
  }

  /**
   * Fluid organic aerodynamic swoosh for spatial canvas switching
   */
  public playSwoosh() {
    if (this.isMuted || this.isEffectsMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.18);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.18);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.24);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Crisp UI micro-tick for pills & toggles
   */
  public playTick() {
    if (this.isMuted || this.isEffectsMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch {
      // Audio fallback handling
    }
  }

  /**
   * Tuned crystal marimba note from pentatonic scale
   */
  public playMarimbaNote(index: number = 0) {
    if (this.isMuted || this.isEffectsMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const noteIdx = Math.abs(index) % this.pentatonicFrequencies.length;
      const freq = this.pentatonicFrequencies[noteIdx];
      const now = this.ctx.currentTime;

      // Primary tone
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Glassy harmonic overtone
      const harmonicOsc = this.ctx.createOscillator();
      const harmonicGain = this.ctx.createGain();
      harmonicOsc.type = 'sine';
      harmonicOsc.frequency.setValueAtTime(freq * 2.76, now); // Metallic glassy overtone ratio

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      harmonicGain.gain.setValueAtTime(0.001, now);
      harmonicGain.gain.linearRampToValueAtTime(0.09, now + 0.01);
      harmonicGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain);

      harmonicOsc.connect(harmonicGain);
      harmonicGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.65);

      harmonicOsc.start(now);
      harmonicOsc.stop(now + 0.3);
    } catch {
      // Audio fallback handling
    }
  }

  /**
   * Success chime: Triad arpeggio
   */
  public playSuccess() {
    if (this.isMuted || this.isEffectsMuted) return;
    [0, 2, 4, 7].forEach((step, i) => {
      setTimeout(() => {
        this.playMarimbaNote(step);
      }, i * 90);
    });
  }

  /**
   * Ambient generative soundscape: Gentle warm liquid chord
   */
  public toggleAmbientPad(): boolean {
    this.initContext();
    if (this.isAmbientPlaying) {
      this.stopAmbientPad();
      return false;
    } else {
      this.startAmbientPad();
      return true;
    }
  }

  public getIsAmbientPlaying(): boolean {
    return this.isAmbientPlaying;
  }

  public startAmbientPad() {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isAmbientPlaying) return;

    try {
      this.isAmbientPlaying = true;
      const now = this.ctx.currentTime;

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.0001, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.12, now + 2.0); // Gentle fade in
      this.ambientGain.connect(this.masterGain);

      // Low pass filter with subtle warmth
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(550, now);
      filter.connect(this.ambientGain);

      // Chord: Cmaj9 chord (C3, G3, B3, D4, E4)
      const chordFrequencies = [130.81, 196.00, 246.94, 293.66, 329.63];

      this.ambientOscillators = chordFrequencies.map((freq, i) => {
        const osc = this.ctx!.createOscillator();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq + (Math.random() * 0.4 - 0.2), now); // Detune
        osc.connect(filter);
        osc.start(now);
        return osc;
      });
    } catch {
      this.isAmbientPlaying = false;
    }
  }

  public stopAmbientPad() {
    if (!this.ctx || !this.ambientGain) {
      this.isAmbientPlaying = false;
      return;
    }

    try {
      const now = this.ctx.currentTime;
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      setTimeout(() => {
        this.ambientOscillators.forEach(osc => {
          try { osc.stop(); osc.disconnect(); } catch { /* ignore */ }
        });
        this.ambientOscillators = [];
        this.isAmbientPlaying = false;
      }, 1250);
    } catch {
      this.isAmbientPlaying = false;
    }
  }
}

export const soundEngine = new SoundEngine();
