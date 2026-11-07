import { SoundscapeType } from './types';

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: { stop?: () => void }[] = [];
  private currentType: SoundscapeType = 'none';
  private volume: number = 0.5; // 0 to 1
  private isPlaying: boolean = false;
  private schedulerInterval: any = null;

  constructor() {
    // Lazy initialize to avoid blocking main thread or triggering browser security warnings
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        console.warn('Web Audio API not supported in this browser.');
        return false;
      }
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;
      this.masterGain.connect(this.ctx.destination);
    }
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return true;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume() {
    return this.volume;
  }

  public getEngineState() {
    return {
      isPlaying: this.isPlaying,
      currentType: this.currentType,
      volume: this.volume
    };
  }

  public stop() {
    this.isPlaying = false;
    this.currentType = 'none';
    
    if (this.schedulerInterval) {
      clearInterval(this.schedulerInterval);
      this.schedulerInterval = null;
    }

    this.activeNodes.forEach(node => {
      try {
        node.stop?.();
      } catch (e) {
        // Safe disposal
      }
    });
    this.activeNodes = [];
  }

  public start(type: SoundscapeType) {
    this.stop(); // Clear any existing playing soundscapes
    
    if (type === 'none') return;
    
    const success = this.initContext();
    if (!success || !this.ctx || !this.masterGain) return;

    this.isPlaying = true;
    this.currentType = type;

    try {
      if (type === 'ambient') {
        this.playAmbient();
      } else if (type === 'lofi') {
        this.playLofi();
      } else if (type === 'nature') {
        this.playNature();
      }
    } catch (err) {
      console.error('Error starting soundscape:', err);
    }
  }

  // Create a reusable Noise buffer for ambient/lofi crackle/nature rain
  private createNoiseBuffer(duration: number = 2): AudioBuffer {
    if (!this.ctx) throw new Error('Context not initialized');
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  private playAmbient() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // We'll create a shifting drone with a minor-seventh chord feel
    // Chord: G1 (49Hz), D2 (73.4Hz), G2 (98Hz), Bb2 (116.5Hz), D3 (146.8Hz), F3 (174.6Hz)
    const baseFrequencies = [49.00, 73.42, 98.00, 116.54, 146.83, 174.61];
    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    // Master lowpass filter to make it deeply warm and underwater
    const masterFilter = ctx.createBiquadFilter();
    masterFilter.type = 'lowpass';
    masterFilter.frequency.setValueAtTime(300, ctx.currentTime);
    masterFilter.Q.setValueAtTime(1.5, ctx.currentTime);
    masterFilter.connect(this.masterGain);

    // Dynamic delay line for spaciousness
    const delay = ctx.createDelay(5.0);
    const delayFeedback = ctx.createGain();
    delay.delayTime.setValueAtTime(0.8, ctx.currentTime);
    delayFeedback.gain.setValueAtTime(0.4, ctx.currentTime);

    delay.connect(delayFeedback);
    delayFeedback.connect(delay);
    delay.connect(masterFilter);

    baseFrequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();

      // Alternate triangle and sine waves for rich harmonic structure
      osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
      // Detune slightly for lush chorusing effect
      osc.frequency.setValueAtTime(freq + (Math.random() * 0.4 - 0.2), ctx.currentTime);

      // Low volume per note to avoid clipping
      oscGain.gain.setValueAtTime(0.08 / baseFrequencies.length, ctx.currentTime);

      osc.connect(oscGain);
      oscGain.connect(masterFilter);
      // Feed some of the higher frequencies into the delay line
      if (freq > 100) {
        oscGain.connect(delay);
      }

      osc.start();
      oscillators.push(osc);
      gains.push(oscGain);
    });

    // Slow moving LFO for filter sweep
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.06, ctx.currentTime); // 1 cycle every 16 seconds
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(120, ctx.currentTime); // sweep filter +- 120Hz

    lfo.connect(lfoGain);
    lfoGain.connect(masterFilter.frequency);
    lfo.start();

    // Slow moving LFO for amplitude breathing
    const breathingLfo = ctx.createOscillator();
    breathingLfo.frequency.setValueAtTime(0.1, ctx.currentTime); // 10s cycles
    const breathingGain = ctx.createGain();
    breathingGain.gain.setValueAtTime(0.02, ctx.currentTime);
    breathingLfo.connect(breathingGain);
    breathingGain.connect(masterFilter.gain || masterGainGainStub(ctx)); // breathing volume adjustments
    breathingLfo.start();

    this.activeNodes.push({
      stop: () => {
        lfo.stop();
        breathingLfo.stop();
        oscillators.forEach(o => o.stop());
      }
    });
  }

  private playLofi() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // 1. Vinyl Crackle & Soft Background Hiss
    const noiseBuffer = this.createNoiseBuffer(3);
    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1500, ctx.currentTime);
    noiseFilter.Q.setValueAtTime(0.5, ctx.currentTime);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.015, ctx.currentTime); // Very subtle crackle

    noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noiseNode.start();

    // 2. Procedural Electric Piano Chords
    // Dm7 -> G7 -> Cmaj7 -> Fmaj7
    const chords = [
      [146.83, 174.61, 220.00, 261.63], // Dm7 (D3, F3, A3, C4)
      [146.83, 196.00, 246.94, 293.66], // G7sus4/G7 (D3, G3, B3, D4)
      [130.81, 164.81, 196.00, 246.94], // Cmaj7 (C3, E3, G3, B3)
      [130.81, 174.61, 220.00, 261.63]  // Fmaj7/Dm9 flavor (C3, F3, A3, C4)
    ];

    let chordIndex = 0;
    const playNextChord = () => {
      if (!this.isPlaying || !ctx || !this.masterGain) return;
      const now = ctx.currentTime;
      const duration = 4.0; // Play chord for 4 seconds

      const chordNotes = chords[chordIndex];
      const activeOscs: OscillatorNode[] = [];
      const chordGain = ctx.createGain();
      chordGain.connect(this.masterGain);

      // Warm lofi bandpass filter to give "vintage cassette" warmth
      const lofiFilter = ctx.createBiquadFilter();
      lofiFilter.type = 'bandpass';
      lofiFilter.frequency.setValueAtTime(800, now);
      lofiFilter.Q.setValueAtTime(1.0, now);
      lofiFilter.connect(chordGain);

      // Gentle chord attack/release envelope
      chordGain.gain.setValueAtTime(0.0, now);
      chordGain.gain.linearRampToValueAtTime(0.08, now + 1.2); // 1.2 second fade in
      chordGain.gain.setValueAtTime(0.08, now + duration - 1.2);
      chordGain.gain.linearRampToValueAtTime(0.0, now + duration); // 1.2 second fade out

      chordNotes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const tremolo = ctx.createGain();

        // Sine with slight detuning
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq + (Math.random() * 0.5 - 0.25), now);

        // Soft Tremolo effect (Rhodes-like vibrato)
        const tremoloOsc = ctx.createOscillator();
        tremoloOsc.frequency.setValueAtTime(3.5, now); // 3.5 Hz tremolo
        const tremoloGain = ctx.createGain();
        tremoloGain.gain.setValueAtTime(0.15, now);
        
        tremoloOsc.connect(tremoloGain);
        tremoloGain.connect(tremolo.gain);
        
        osc.connect(tremolo);
        tremolo.connect(lofiFilter);

        osc.start(now);
        tremoloOsc.start(now);

        osc.stop(now + duration);
        tremoloOsc.stop(now + duration);
      });

      chordIndex = (chordIndex + 1) % chords.length;
    };

    // Kick off immediately
    playNextChord();
    
    // Set up scheduler
    this.schedulerInterval = setInterval(() => {
      playNextChord();
    }, 4000);

    this.activeNodes.push({
      stop: () => {
        noiseNode.stop();
      }
    });
  }

  private playNature() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // 1. Forest Rain Noise
    const rainBuffer = this.createNoiseBuffer(2);
    const rainNode = ctx.createBufferSource();
    rainNode.buffer = rainBuffer;
    rainNode.loop = true;

    // Rain is a combination of rumbling low frequencies and pattering high frequencies
    const rainLowFilter = ctx.createBiquadFilter();
    rainLowFilter.type = 'lowpass';
    rainLowFilter.frequency.setValueAtTime(400, ctx.currentTime);

    const rainHighFilter = ctx.createBiquadFilter();
    rainHighFilter.type = 'highpass';
    rainHighFilter.frequency.setValueAtTime(2000, ctx.currentTime);

    const rainLowGain = ctx.createGain();
    rainLowGain.gain.setValueAtTime(0.05, ctx.currentTime);

    const rainHighGain = ctx.createGain();
    rainHighGain.gain.setValueAtTime(0.015, ctx.currentTime);

    rainNode.connect(rainLowFilter);
    rainLowFilter.connect(rainLowGain);
    rainLowGain.connect(this.masterGain);

    rainNode.connect(rainHighFilter);
    rainHighFilter.connect(rainHighGain);
    rainHighGain.connect(this.masterGain);

    rainNode.start();

    // 2. Gusty Wind
    const windBuffer = this.createNoiseBuffer(3);
    const windNode = ctx.createBufferSource();
    windNode.buffer = windBuffer;
    windNode.loop = true;

    const windFilter = ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.setValueAtTime(350, ctx.currentTime);
    windFilter.Q.setValueAtTime(1.5, ctx.currentTime); // Resonant peaks sound like wind whistling

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.02, ctx.currentTime);

    windNode.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(this.masterGain);
    windNode.start();

    // Wind modulation LFO (creates sweeping wind gusts)
    const windLfo = ctx.createOscillator();
    windLfo.frequency.setValueAtTime(0.05, ctx.currentTime); // 20-second sweep cycle
    const windLfoGain = ctx.createGain();
    windLfoGain.gain.setValueAtTime(200, ctx.currentTime); // sweeps between 150Hz and 550Hz

    windLfo.connect(windLfoGain);
    windLfoGain.connect(windFilter.frequency);
    windLfo.start();

    // Wind Volume LFO (makes gusts louder and softer)
    const windVolLfo = ctx.createOscillator();
    windVolLfo.frequency.setValueAtTime(0.07, ctx.currentTime);
    const windVolLfoGain = ctx.createGain();
    windVolLfoGain.gain.setValueAtTime(0.015, ctx.currentTime);
    
    windVolLfo.connect(windVolLfoGain);
    windVolLfoGain.connect(windGain.gain);
    windVolLfo.start();

    // 3. Periodic Soft Bird Chirps
    const triggerBirdChirp = () => {
      if (!this.isPlaying || !ctx || !this.masterGain) return;
      const now = ctx.currentTime;
      const chirpOsc = ctx.createOscillator();
      const chirpGain = ctx.createGain();

      chirpOsc.type = 'sine';
      chirpOsc.connect(chirpGain);
      chirpGain.connect(this.masterGain);

      // Pitch sweep from 2.5kHz to 4kHz back to 3kHz (makes a beautiful cardinal/sparrow chirp)
      chirpOsc.frequency.setValueAtTime(2500, now);
      chirpOsc.frequency.exponentialRampToValueAtTime(4200, now + 0.08);
      chirpOsc.frequency.exponentialRampToValueAtTime(3000, now + 0.15);
      chirpOsc.frequency.exponentialRampToValueAtTime(3800, now + 0.22);
      chirpOsc.frequency.exponentialRampToValueAtTime(2000, now + 0.3);

      chirpGain.gain.setValueAtTime(0, now);
      chirpGain.gain.linearRampToValueAtTime(0.005, now + 0.05); // low volume
      chirpGain.gain.setValueAtTime(0.005, now + 0.2);
      chirpGain.gain.linearRampToValueAtTime(0, now + 0.3);

      chirpOsc.start(now);
      chirpOsc.stop(now + 0.32);
    };

    // Random chirps scheduled between 8 and 20 seconds
    const scheduleNextChirp = () => {
      if (!this.isPlaying) return;
      const randomTime = 8000 + Math.random() * 12000;
      this.schedulerInterval = setTimeout(() => {
        triggerBirdChirp();
        scheduleNextChirp();
      }, randomTime);
    };
    scheduleNextChirp();

    this.activeNodes.push({
      stop: () => {
        rainNode.stop();
        windNode.stop();
        windLfo.stop();
        windVolLfo.stop();
      }
    });
  }
}

// Simple stub for breathing effect when gain parameter is not fully supported as an audionode target
function masterGainGainStub(ctx: AudioContext): AudioParam {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  return gain.gain;
}

export const soundscapeEngine = new SoundscapeEngine();
