// Web Audio API Synthesizer for SFX and Relaxing Ambient Soundscapes

class AudioManager {
  private ctx: AudioContext | null = null;
  private sfxGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientSource: AudioNode | null = null;
  private currentAmbientType: string = 'none';

  private isMuted: boolean = false;
  private sfxVol: number = 0.8;
  private ambientVol: number = 0.4;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxVol;
      this.sfxGain.connect(this.ctx.destination);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.value = this.ambientVol;
      this.ambientGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolumes(sfx: number, ambient: number) {
    this.sfxVol = sfx;
    this.ambientVol = ambient;
    if (this.sfxGain) this.sfxGain.gain.value = sfx;
    if (this.ambientGain) this.ambientGain.gain.value = ambient;
  }

  // --- SOUND EFFECTS ---

  // Card slide / draw sound
  public playCardSlide() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.sfxVol <= 0) return;

    const bufferSize = this.ctx.sampleRate * 0.12; // 120ms
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value = 1.2;

    noise.connect(filter);
    filter.connect(this.sfxGain);
    noise.start();
  }

  // Card drop / placement tap sound
  public playCardDrop() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.sfxVol <= 0) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.6, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  // Meld complete chime
  public playMeldChime() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.sfxVol <= 0) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + idx * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.06 + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(this.ctx.currentTime + idx * 0.06);
      osc.stop(this.ctx.currentTime + idx * 0.06 + 0.35);
    });
  }

  // Knock / Close gong sound
  public playKnockSound() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.sfxVol <= 0) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.7, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.36);
  }

  // Victory Fanfare
  public playVictoryFanfare() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.sfxVol <= 0) return;

    const melody = [
      { freq: 440, dur: 0.15, delay: 0 },
      { freq: 554.37, dur: 0.15, delay: 0.15 },
      { freq: 659.25, dur: 0.15, delay: 0.3 },
      { freq: 880, dur: 0.5, delay: 0.45 },
    ];

    melody.forEach(item => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.freq, this.ctx.currentTime + item.delay);

      gain.gain.setValueAtTime(0.4, this.ctx.currentTime + item.delay);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + item.delay + item.dur);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(this.ctx.currentTime + item.delay);
      osc.stop(this.ctx.currentTime + item.delay + item.dur + 0.05);
    });
  }

  // Achievement Unlocked
  public playAchievementUnlocked() {
    this.initCtx();
    if (!this.ctx || !this.sfxGain || this.sfxVol <= 0) return;

    const notes = [587.33, 739.99, 880, 1174.66]; // D5, F#5, A5, D6
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.4, this.ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(this.ctx.currentTime + idx * 0.08);
      osc.stop(this.ctx.currentTime + idx * 0.08 + 0.45);
    });
  }

  // --- AMBIENT SOUNDSCAPES ---

  public setAmbientSound(type: 'none' | 'fireside' | 'rain' | 'lounge' | 'breeze') {
    this.initCtx();
    if (!this.ctx || !this.ambientGain) return;

    if (this.ambientSource) {
      try {
        (this.ambientSource as AudioBufferSourceNode).stop();
        this.ambientSource.disconnect();
      } catch {
        // Ignore if already stopped
      }
      this.ambientSource = null;
    }

    this.currentAmbientType = type;
    if (type === 'none' || this.ambientVol <= 0) return;

    // Synthesize ambient loop buffer
    const duration = 5; // 5 second loop
    const buffer = this.ctx.createBuffer(2, this.ctx.sampleRate * duration, this.ctx.sampleRate);

    if (type === 'rain') {
      // Soft pink noise
      for (let channel = 0; channel < 2; channel++) {
        const data = buffer.getChannelData(channel);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < data.length; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.03;
          b6 = white * 0.115926;
        }
      }
    } else if (type === 'fireside') {
      // Warm crackling fire
      for (let channel = 0; channel < 2; channel++) {
        const data = buffer.getChannelData(channel);
        for (let i = 0; i < data.length; i++) {
          const crackle = Math.random() > 0.997 ? (Math.random() * 0.8 - 0.4) : 0;
          const lowRoar = (Math.random() * 2 - 1) * 0.015;
          data[i] = crackle + lowRoar;
        }
      }
    } else if (type === 'breeze') {
      // Gentle wind sway
      for (let channel = 0; channel < 2; channel++) {
        const data = buffer.getChannelData(channel);
        for (let i = 0; i < data.length; i++) {
          const t = i / this.ctx.sampleRate;
          const modulation = (Math.sin(2 * Math.PI * 0.2 * t) + 1) * 0.5;
          data[i] = (Math.random() * 2 - 1) * 0.02 * modulation;
        }
      }
    } else if (type === 'lounge') {
      // Warm mellow chords
      for (let channel = 0; channel < 2; channel++) {
        const data = buffer.getChannelData(channel);
        for (let i = 0; i < data.length; i++) {
          const t = i / this.ctx.sampleRate;
          const note1 = Math.sin(2 * Math.PI * 220 * t) * 0.01;
          const note2 = Math.sin(2 * Math.PI * 277.18 * t) * 0.008;
          const note3 = Math.sin(2 * Math.PI * 329.63 * t) * 0.008;
          data[i] = note1 + note2 + note3;
        }
      }
    }

    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = type === 'fireside' ? 'lowpass' : 'lowpass';
    filter.frequency.value = type === 'rain' ? 1200 : 800;

    src.connect(filter);
    filter.connect(this.ambientGain);
    src.start();

    this.ambientSource = src;
  }
}

export const audioManager = new AudioManager();
