// Web Audio API Sound System - No external audio files needed!
// All sounds are generated programmatically using oscillators and audio nodes

class GameSoundSystem {
  private audioContext: AudioContext | null = null;
  private masterVolume = 0.3;
  private musicVolume = 0.15;
  private enabled = true;
  private musicEnabled = true;
  
  // Background music state
  private musicNodes: {
    oscillators: OscillatorNode[];
    gains: GainNode[];
    masterGain: GainNode | null;
  } | null = null;
  private musicPlaying = false;
  private musicInterval: NodeJS.Timeout | null = null;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // Resume if suspended (browser autoplay policy)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  setVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicNodes?.masterGain) {
      this.musicNodes.masterGain.gain.setValueAtTime(this.musicVolume, this.getContext().currentTime);
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopBackgroundMusic();
    }
  }

  setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.stopBackgroundMusic();
    }
  }

  isMusicPlaying(): boolean {
    return this.musicPlaying;
  }

  // ==================== BACKGROUND MUSIC ====================
  // Generates a calm, ambient loop using multiple oscillators

  startBackgroundMusic() {
    if (!this.enabled || !this.musicEnabled || this.musicPlaying) return;

    const ctx = this.getContext();
    this.musicPlaying = true;

    // Create master gain for music
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(this.musicVolume, ctx.currentTime + 2);
    masterGain.connect(ctx.destination);

    // Chord progression for ambient music (Am - F - C - G pattern in lower octave)
    const chordProgressions = [
      [220, 261.63, 329.63], // Am
      [174.61, 220, 261.63], // F
      [261.63, 329.63, 392],  // C
      [196, 246.94, 293.66],  // G
    ];

    let chordIndex = 0;
    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    // Create drone bass
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(110, ctx.currentTime); // A2
    bassGain.gain.setValueAtTime(0.3, ctx.currentTime);
    bassOsc.connect(bassGain);
    bassGain.connect(masterGain);
    bassOsc.start();
    oscillators.push(bassOsc);
    gains.push(bassGain);

    // Create pad oscillators (3 for chord)
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(chordProgressions[0][i], ctx.currentTime);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.Q.setValueAtTime(1, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      osc.start();

      oscillators.push(osc);
      gains.push(gain);
    }

    // Add subtle high shimmer
    const shimmerOsc = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    const shimmerFilter = ctx.createBiquadFilter();
    shimmerOsc.type = 'triangle';
    shimmerOsc.frequency.setValueAtTime(880, ctx.currentTime);
    shimmerFilter.type = 'highpass';
    shimmerFilter.frequency.setValueAtTime(600, ctx.currentTime);
    shimmerGain.gain.setValueAtTime(0.02, ctx.currentTime);
    shimmerOsc.connect(shimmerFilter);
    shimmerFilter.connect(shimmerGain);
    shimmerGain.connect(masterGain);
    shimmerOsc.start();
    oscillators.push(shimmerOsc);
    gains.push(shimmerGain);

    this.musicNodes = { oscillators, gains, masterGain };

    // Change chords every 4 seconds
    this.musicInterval = setInterval(() => {
      if (!this.musicPlaying) return;

      chordIndex = (chordIndex + 1) % chordProgressions.length;
      const chord = chordProgressions[chordIndex];
      const currentTime = ctx.currentTime;

      // Update bass note (root of chord lowered)
      oscillators[0].frequency.linearRampToValueAtTime(chord[0] / 2, currentTime + 1);

      // Update chord tones with smooth transition
      for (let i = 0; i < 3; i++) {
        oscillators[i + 1].frequency.linearRampToValueAtTime(chord[i], currentTime + 1);
      }

      // Subtle shimmer variation
      shimmerOsc.frequency.linearRampToValueAtTime(chord[2] * 2, currentTime + 0.5);
    }, 4000);
  }

  stopBackgroundMusic() {
    if (!this.musicPlaying || !this.musicNodes) return;

    const ctx = this.getContext();
    const { oscillators, gains, masterGain } = this.musicNodes;

    // Fade out
    if (masterGain) {
      masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    }

    // Stop after fade
    setTimeout(() => {
      oscillators.forEach(osc => {
        try { osc.stop(); } catch (e) {}
      });
      this.musicNodes = null;
    }, 1200);

    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }

    this.musicPlaying = false;
  }

  toggleBackgroundMusic(): boolean {
    if (this.musicPlaying) {
      this.stopBackgroundMusic();
      return false;
    } else {
      this.startBackgroundMusic();
      return true;
    }
  }

  // ==================== CORE SOUND GENERATORS ====================

  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = 1,
    fadeOut: boolean = true
  ) {
    if (!this.enabled) return;

    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    const vol = this.masterVolume * volume;
    gainNode.gain.setValueAtTime(vol, ctx.currentTime);

    if (fadeOut) {
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    }

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }

  private playNoise(duration: number, volume: number = 0.5) {
    if (!this.enabled) return;

    const ctx = this.getContext();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = ctx.createBufferSource();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    noise.buffer = buffer;
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    gainNode.gain.setValueAtTime(this.masterVolume * volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.start(ctx.currentTime);
    noise.stop(ctx.currentTime + duration);
  }

  // ==================== GAME SOUNDS ====================

  // Button click - short, crisp tap
  click() {
    this.playTone(800, 0.05, 'sine', 0.3);
    setTimeout(() => this.playTone(600, 0.03, 'sine', 0.2), 20);
  }

  // Button hover - subtle tick
  hover() {
    this.playTone(1200, 0.02, 'sine', 0.1);
  }

  // Dice roll - rattling sound
  diceRoll() {
    if (!this.enabled) return;

    // Multiple quick taps to simulate dice rattling
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const freq = 200 + Math.random() * 400;
        this.playTone(freq, 0.05, 'triangle', 0.2 + Math.random() * 0.2);
      }, i * 60);
    }

    // Final landing sound
    setTimeout(() => {
      this.playTone(150, 0.15, 'sine', 0.4);
      this.playNoise(0.08, 0.3);
    }, 500);
  }

  // Move piece - whoosh
  move() {
    if (!this.enabled) return;

    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.2);

    gainNode.gain.setValueAtTime(this.masterVolume * 0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  }

  // Correct answer - happy ascending melody
  correct() {
    if (!this.enabled) return;

    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.15, 'sine', 0.4);
        this.playTone(freq * 1.5, 0.1, 'triangle', 0.15);
      }, i * 80);
    });
  }

  // Wrong answer - descending sad tone
  wrong() {
    if (!this.enabled) return;

    this.playTone(400, 0.2, 'sawtooth', 0.3);
    setTimeout(() => this.playTone(300, 0.3, 'sawtooth', 0.25), 150);
    setTimeout(() => this.playTone(200, 0.4, 'sawtooth', 0.2), 300);
  }

  // Earn money - coin sound
  coin() {
    if (!this.enabled) return;

    this.playTone(1318, 0.08, 'sine', 0.3); // E6
    setTimeout(() => this.playTone(1568, 0.12, 'sine', 0.35), 60); // G6
  }

  // Lose money - negative sound
  loseMoney() {
    if (!this.enabled) return;

    this.playTone(300, 0.15, 'square', 0.2);
    setTimeout(() => this.playTone(250, 0.2, 'square', 0.15), 100);
  }

  // Level up / Passive income increase
  levelUp() {
    if (!this.enabled) return;

    const notes = [392, 494, 587, 784, 988]; // G4, B4, D5, G5, B5
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.2, 'sine', 0.35);
        this.playTone(freq * 2, 0.15, 'triangle', 0.15);
      }, i * 100);
    });
  }

  // Victory fanfare - winning the game!
  victory() {
    if (!this.enabled) return;

    // Stop background music for victory
    this.stopBackgroundMusic();

    // Triumphant melody
    const melody = [
      { freq: 523, time: 0 },      // C5
      { freq: 659, time: 150 },    // E5
      { freq: 784, time: 300 },    // G5
      { freq: 1047, time: 500 },   // C6
      { freq: 784, time: 700 },    // G5
      { freq: 1047, time: 850 },   // C6
      { freq: 1319, time: 1000 },  // E6
    ];

    melody.forEach(({ freq, time }) => {
      setTimeout(() => {
        this.playTone(freq, 0.25, 'sine', 0.4);
        this.playTone(freq / 2, 0.3, 'triangle', 0.2);
      }, time);
    });
  }

  // Start game - energetic start
  gameStart() {
    if (!this.enabled) return;

    this.playTone(262, 0.1, 'sine', 0.3); // C4
    setTimeout(() => this.playTone(330, 0.1, 'sine', 0.3), 100); // E4
    setTimeout(() => this.playTone(392, 0.1, 'sine', 0.3), 200); // G4
    setTimeout(() => this.playTone(523, 0.2, 'sine', 0.4), 300); // C5

    // Start background music after game start sound
    setTimeout(() => this.startBackgroundMusic(), 500);
  }

  // Open modal - whoosh up
  modalOpen() {
    if (!this.enabled) return;

    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);

    gainNode.gain.setValueAtTime(this.masterVolume * 0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }

  // Close modal - whoosh down
  modalClose() {
    if (!this.enabled) return;

    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(500, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.12);

    gainNode.gain.setValueAtTime(this.masterVolume * 0.12, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.12);
  }

  // Turn end - subtle notification
  turnEnd() {
    this.playTone(440, 0.08, 'sine', 0.2);
    setTimeout(() => this.playTone(550, 0.1, 'sine', 0.25), 80);
  }

  // Select option - pop sound
  select() {
    if (!this.enabled) return;

    this.playTone(600, 0.04, 'sine', 0.3);
    this.playTone(900, 0.06, 'triangle', 0.2);
  }

  // Payday / Bonus - cheerful jingle
  payday() {
    if (!this.enabled) return;

    const notes = [659, 784, 988, 784, 988, 1175]; // E5, G5, B5, G5, B5, D6
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.12, 'sine', 0.35);
      }, i * 70);
    });
  }

  // Streak increase - power up
  streak() {
    if (!this.enabled) return;

    const ctx = this.getContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(300, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.2);

    gainNode.gain.setValueAtTime(this.masterVolume * 0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.25);
  }

  // Risk tile warning
  riskWarning() {
    if (!this.enabled) return;

    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.playTone(200, 0.1, 'square', 0.25);
      }, i * 120);
    }
  }

  // Investment opportunity
  investSound() {
    if (!this.enabled) return;

    this.playTone(523, 0.1, 'sine', 0.3);
    setTimeout(() => this.playTone(659, 0.1, 'sine', 0.3), 100);
    setTimeout(() => this.playTone(784, 0.15, 'triangle', 0.35), 200);
  }

  // Notification / Alert
  notification() {
    this.playTone(880, 0.08, 'sine', 0.25);
    setTimeout(() => this.playTone(880, 0.08, 'sine', 0.2), 150);
  }

  // Pause sound
  pause() {
    if (!this.enabled) return;

    this.playTone(400, 0.1, 'sine', 0.2);
    setTimeout(() => this.playTone(300, 0.15, 'sine', 0.15), 80);
  }

  // Resume sound
  resume() {
    if (!this.enabled) return;

    this.playTone(300, 0.1, 'sine', 0.2);
    setTimeout(() => this.playTone(400, 0.15, 'sine', 0.25), 80);
  }
}

// Export singleton instance
export const sounds = new GameSoundSystem();

// Export type for use in components
export type { GameSoundSystem };
