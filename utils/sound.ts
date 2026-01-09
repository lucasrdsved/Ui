// Simple audio context synthesizer for beep sounds
let audioCtx: AudioContext | null = null;

const getContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

export const playSound = (type: 'start' | 'end' | 'tick' | 'success' | 'warning') => {
  try {
    const ctx = getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'start') {
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'end') {
      // Double beep
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.frequency.setValueAtTime(800, now + 0.15);
      gain2.gain.setValueAtTime(0.5, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.25);

    } else if (type === 'tick') {
      // Subtle tick (woodblock style)
      osc.frequency.setValueAtTime(800, now);
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.1, now); 
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'warning') {
      // Warning beep (more pronounced, slightly dissonant)
      osc.frequency.setValueAtTime(440, now); // A4
      osc.type = 'square';
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'success') {
       // High pitch success chord arpeggio
      const playNote = (freq: number, startTime: number) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.3, startTime);
        g.gain.exponentialRampToValueAtTime(0.01, startTime + 0.6);
        o.start(startTime);
        o.stop(startTime + 0.6);
      };
      playNote(523.25, now); // C5
      playNote(659.25, now + 0.1); // E5
      playNote(783.99, now + 0.2); // G5
      playNote(1046.50, now + 0.3); // C6
    }
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};