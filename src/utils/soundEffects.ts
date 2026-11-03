/**
 * Procedural Audio Synthesis Engine for Debian Silk OS / OpenKylin
 * Built with the Web Audio API (AudioContext) for zero-latency, offline,
 * and non-intrusive desktop auditory feedback.
 */

export type SoundEvent =
  | 'window-open'
  | 'window-close'
  | 'window-minimize'
  | 'window-restore'
  | 'window-snap'
  | 'notification'
  | 'click'
  | 'toggle-on'
  | 'toggle-off'
  | 'trash';

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.7; // 0.0 to 1.0

  constructor() {
    // Lazily load persisted sound preferences if in browser
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('silk_sound_settings');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (typeof parsed.enabled === 'boolean') this.enabled = parsed.enabled;
          if (typeof parsed.volume === 'number') this.volume = Math.max(0, Math.min(1, parsed.volume / 100));
        }
      } catch {
        // Fallback to default
      }
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    this.persist();
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setVolume(volume0to100: number) {
    this.volume = Math.max(0, Math.min(1, volume0to100 / 100));
    this.persist();
  }

  public getVolume(): number {
    return Math.round(this.volume * 100);
  }

  private persist() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(
        'silk_sound_settings',
        JSON.stringify({ enabled: this.enabled, volume: Math.round(this.volume * 100) })
      );
    } catch {
      // Storage unavailable
    }
  }

  /**
   * Subtle rising glass chime on window opening
   */
  public playWindowOpen() {
    if (!this.enabled || this.volume <= 0) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.16, now);
    masterGain.connect(ctx.destination);

    // Primary bell tone (C5 to E5 harmonic)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now);
    osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.12);

    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(0.8, now + 0.015);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc1.connect(gain1);
    gain1.connect(masterGain);

    // Soft overtone (silk glass shimmer)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1046.5, now);
    osc2.frequency.exponentialRampToValueAtTime(1318.5, now + 0.12);

    gain2.gain.setValueAtTime(0.001, now);
    gain2.gain.linearRampToValueAtTime(0.25, now + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc2.connect(gain2);
    gain2.connect(masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.17);
    osc2.stop(now + 0.15);
  }

  /**
   * Discreet descending tone on window closing
   */
  public playWindowClose() {
    if (!this.enabled || this.volume <= 0) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.13, now);
    masterGain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(392.0, now + 0.12); // G4

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.7, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.14);
  }

  /**
   * Smooth swoop down on window minimize
   */
  public playWindowMinimize() {
    if (!this.enabled || this.volume <= 0) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.12, now);
    masterGain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440.0, now);
    osc.frequency.exponentialRampToValueAtTime(261.63, now + 0.14);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.6, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  /**
   * Smooth ascending swoop on window restore
   */
  public playWindowRestore() {
    if (!this.enabled || this.volume <= 0) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.12, now);
    masterGain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(261.63, now);
    osc.frequency.exponentialRampToValueAtTime(493.88, now + 0.14);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.65, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  /**
   * Crisp magnetic snap chime when snapping a window to screen edge
   */
  public playWindowSnap() {
    if (!this.enabled || this.volume <= 0) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.15, now);
    masterGain.connect(ctx.destination);

    // Initial click
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(1200, now);
    osc1.frequency.exponentialRampToValueAtTime(300, now + 0.02);
    gain1.gain.setValueAtTime(0.7, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc1.connect(gain1);
    gain1.connect(masterGain);

    // Harmonic settle chime
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.01);
    gain2.gain.setValueAtTime(0.001, now + 0.01);
    gain2.gain.linearRampToValueAtTime(0.4, now + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc2.connect(gain2);
    gain2.connect(masterGain);

    osc1.start(now);
    osc1.stop(now + 0.035);
    osc2.start(now + 0.01);
    osc2.stop(now + 0.1);
  }

  /**
   * Authentic, dignified Linux desktop notification chime (two-note marimba/rhodes chime)
   */
  public playNotification() {
    if (!this.enabled || this.volume <= 0) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.18, now);
    masterGain.connect(ctx.destination);

    // First note: F5 (698.46 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(698.46, now);

    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(0.8, now + 0.01);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc1.connect(gain1);
    gain1.connect(masterGain);
    osc1.start(now);
    osc1.stop(now + 0.19);

    // Second note: A5 (880.00 Hz) at +80ms delay
    const note2Time = now + 0.08;
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.0, note2Time);

    gain2.gain.setValueAtTime(0.001, note2Time);
    gain2.gain.linearRampToValueAtTime(0.9, note2Time + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.001, note2Time + 0.28);

    osc2.connect(gain2);
    gain2.connect(masterGain);
    osc2.start(note2Time);
    osc2.stop(note2Time + 0.3);

    // Subtle harmonic overtone on second note for depth
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(1760.0, note2Time);

    gain3.gain.setValueAtTime(0.001, note2Time);
    gain3.gain.linearRampToValueAtTime(0.2, note2Time + 0.01);
    gain3.gain.exponentialRampToValueAtTime(0.001, note2Time + 0.2);

    osc3.connect(gain3);
    gain3.connect(masterGain);
    osc3.start(note2Time);
    osc3.stop(note2Time + 0.22);
  }

  /**
   * Tactile micro-click for UI buttons and icons
   */
  public playClick() {
    if (!this.enabled || this.volume <= 0) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.08, now);
    masterGain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1600, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.015);

    gain.gain.setValueAtTime(0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.02);
  }

  /**
   * Tactile switch/toggle feedback
   */
  public playToggle(state: boolean = true) {
    if (!this.enabled || this.volume <= 0) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.1, now);
    masterGain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    if (state) {
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(960, now + 0.03);
    } else {
      osc.frequency.setValueAtTime(960, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.03);
    }

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  /**
   * Soft paper/crumple whoosh when emptying trash or deleting an item
   */
  public playTrash() {
    if (!this.enabled || this.volume <= 0) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.08);
    filter.Q.setValueAtTime(1.5, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(this.volume * 0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.085);
  }

  /**
   * Generic dispatcher for system sound events
   */
  public play(event: SoundEvent) {
    switch (event) {
      case 'window-open':
        this.playWindowOpen();
        break;
      case 'window-close':
        this.playWindowClose();
        break;
      case 'window-minimize':
        this.playWindowMinimize();
        break;
      case 'window-restore':
        this.playWindowRestore();
        break;
      case 'window-snap':
        this.playWindowSnap();
        break;
      case 'notification':
        this.playNotification();
        break;
      case 'click':
        this.playClick();
        break;
      case 'toggle-on':
        this.playToggle(true);
        break;
      case 'toggle-off':
        this.playToggle(false);
        break;
      case 'trash':
        this.playTrash();
        break;
    }
  }
}

export const soundEffects = new SoundEffectsEngine();
