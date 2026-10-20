// Standalone Web Audio API sound generator for Zen / TCM relaxation & meditation

class SoundEngine {
  private ctx: AudioContext | null = null;
  private activeStreams: { [key: string]: { stop: () => void } } = {};
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play Tibetan Singing Bowl resonance with harmonics
  public playSingingBowl(fundamental: number = 216, durationSec: number = 6) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.exponentialRampToValueAtTime(0.3, now + 0.05);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);
    masterGain.connect(ctx.destination);

    // Fundamental and 3 rich resonant harmonics with slight detune for singing bowl wobble
    const harmonics = [
      { freqMult: 1.0, gain: 0.5, detune: 0 },
      { freqMult: 2.76, gain: 0.25, detune: 1.2 }, // Characteristic bowl overtone
      { freqMult: 5.14, gain: 0.12, detune: -1.5 },
      { freqMult: 8.22, gain: 0.05, detune: 2.1 }
    ];

    harmonics.forEach(h => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(fundamental * h.freqMult, now);
      osc.detune.setValueAtTime(h.detune, now);

      gain.gain.setValueAtTime(h.gain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + durationSec);
    });
  }

  // Play Temple Chime for breath pacing (soft high chime)
  public playBreathChime(isInhale: boolean) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    const now = ctx.currentTime;
    const freq = isInhale ? 528 : 432; // 528 Hz (Qi vitality) for inhale, 432 Hz (Grounding) for exhale

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 2.5);
  }

  // Ambient Bamboo Stream / Water Flow Generator
  public startWaterStream(): () => void {
    if (this.isMuted) return () => {};
    const ctx = this.initCtx();
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate soft brown/pink noise
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Filter simulating water bubbling through bamboo tubes
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);
    filter.Q.setValueAtTime(1.5, ctx.currentTime);

    // LFO to gently modulate water flow
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(150, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    lfo.start();

    const stopFn = () => {
      try {
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
        setTimeout(() => {
          noise.stop();
          lfo.stop();
          noise.disconnect();
          lfo.disconnect();
        }, 550);
      } catch (e) {
        // cleanup safe
      }
    };

    return stopFn;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }
}

export const soundEngine = new SoundEngine();
