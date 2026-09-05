// ABYYS ATELIER High-Fashion Subversive Web Audio Sequencer
// Multi-track procedural darkwave / neo-grunge music synthesizer

export interface MusicTrack {
  id: string;
  title: string;
  genre: string;
  bpm: number;
}

export const SOUNDTRACK_LIST: MusicTrack[] = [
  {
    id: 'abyys_noir',
    title: 'ABYYS NOIR',
    genre: 'DARKWAVE // 116 BPM',
    bpm: 116,
  },
  {
    id: 'subterranean_pulse',
    title: 'BERLIN VAULT',
    genre: 'INDUSTRIAL TECHNO // 124 BPM',
    bpm: 124,
  },
  {
    id: 'chrome_cathedral',
    title: 'GOTHIC NOCTURNE',
    genre: 'POST-PUNK AMBIENT // 100 BPM',
    bpm: 100,
  },
];

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isAudioPlaying = false;
let currentTrackIndex = 0;
let stepCounter = 0;
let sequencerInterval: number | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playTactileClick(): void {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.025);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.026);
  } catch {
    // Audio context may be restricted before gesture
  }
}

// Synthesizer voice generators
function triggerKick(ctx: AudioContext, destination: GainNode, time: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.frequency.setValueAtTime(140, time);
  osc.frequency.exponentialRampToValueAtTime(32, time + 0.12);

  gain.gain.setValueAtTime(0.45, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

  osc.connect(gain);
  gain.connect(destination);

  osc.start(time);
  osc.stop(time + 0.25);
}

function triggerHat(ctx: AudioContext, destination: GainNode, time: number, open: boolean = false) {
  const bufferSize = ctx.sampleRate * (open ? 0.08 : 0.03);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(7500, time);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(open ? 0.12 : 0.08, time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + (open ? 0.08 : 0.03));

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(destination);

  noise.start(time);
  noise.stop(time + (open ? 0.09 : 0.04));
}

function triggerBass(
  ctx: AudioContext,
  destination: GainNode,
  time: number,
  freq: number,
  duration: number
) {
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(freq, time);

  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(freq / 2, time); // Sub octave

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(freq * 3.5, time);
  filter.frequency.exponentialRampToValueAtTime(freq * 1.2, time + duration);
  filter.Q.setValueAtTime(3, time);

  gain.gain.setValueAtTime(0.22, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(destination);

  osc1.start(time);
  osc2.start(time);
  osc1.stop(time + duration + 0.05);
  osc2.stop(time + duration + 0.05);
}

function triggerLead(
  ctx: AudioContext,
  destination: GainNode,
  time: number,
  freq: number,
  duration: number
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'square';
  osc.frequency.setValueAtTime(freq, time);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(freq * 2.8, time);
  filter.frequency.linearRampToValueAtTime(freq * 1.5, time + duration);
  filter.Q.setValueAtTime(4.5, time);

  gain.gain.setValueAtTime(0.09, time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(destination);

  osc.start(time);
  osc.stop(time + duration + 0.05);
}

function triggerPad(
  ctx: AudioContext,
  destination: GainNode,
  time: number,
  freqs: number[],
  duration: number
) {
  freqs.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 1.5, time);
    filter.Q.setValueAtTime(1.2, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.04, time + duration * 0.3);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    osc.start(time);
    osc.stop(time + duration + 0.1);
  });
}

// Melodic patterns for tracks
// Note frequencies (Hz)
const NOTES = {
  D2: 73.42,
  F2: 87.31,
  G2: 98.0,
  A2: 110.0,
  Bb2: 116.54,
  C3: 130.81,
  D3: 146.83,
  F3: 174.61,
  G3: 196.0,
  A3: 220.0,
  Bb3: 233.08,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  C5: 523.25,
  D5: 587.33,
};

// 16-step sequencer step execution
function stepSequence(track: MusicTrack, step: number) {
  if (!audioCtx || !masterGain || !isAudioPlaying) return;
  const now = audioCtx.currentTime;
  const sixteenth = (60 / track.bpm) / 4;

  if (track.id === 'abyys_noir') {
    // Darkwave Driving Song
    // Kick on 1, 5, 9, 13 (quarter notes)
    if (step % 4 === 0) {
      triggerKick(audioCtx, masterGain, now);
    }
    // Off-beat hats on 2, 4, 6, 8, 10, 12, 14, 16
    if (step % 2 === 1) {
      triggerHat(audioCtx, masterGain, now, step % 8 === 2);
    }
    // Bassline: D2, D2, F2, D2, G2, F2, A2, G2
    const bassNotes = [
      NOTES.D2, NOTES.D2, NOTES.F2, NOTES.D2,
      NOTES.G2, NOTES.F2, NOTES.D2, NOTES.D2,
      NOTES.Bb2, NOTES.Bb2, NOTES.A2, NOTES.A2,
      NOTES.G2, NOTES.F2, NOTES.E4 ? NOTES.D2 : NOTES.D2, NOTES.C3,
    ];
    triggerBass(audioCtx, masterGain, now, bassNotes[step % 16], sixteenth * 1.5);

    // Arpeggiated melody line on odd 16th steps
    const leadPattern: Record<number, number> = {
      0: NOTES.D4,
      3: NOTES.F4,
      6: NOTES.A4,
      8: NOTES.G4,
      11: NOTES.F4,
      14: NOTES.D4,
    };
    if (leadPattern[step % 16]) {
      triggerLead(audioCtx, masterGain, now, leadPattern[step % 16], sixteenth * 3);
    }

    // Atmospheric dark chord pad every 16 steps (once per bar)
    if (step % 16 === 0) {
      const bar = Math.floor(step / 16) % 4;
      if (bar === 0 || bar === 1) {
        triggerPad(audioCtx, masterGain, now, [NOTES.D3, NOTES.F3, NOTES.A3], sixteenth * 15);
      } else if (bar === 2) {
        triggerPad(audioCtx, masterGain, now, [NOTES.Bb2, NOTES.D3, NOTES.F3], sixteenth * 15);
      } else {
        triggerPad(audioCtx, masterGain, now, [NOTES.C3, NOTES.F3, NOTES.A3], sixteenth * 15);
      }
    }
  } else if (track.id === 'subterranean_pulse') {
    // Industrial Techno / Berlin Vault
    // Heavy 4-on-the-floor
    if (step % 4 === 0) {
      triggerKick(audioCtx, masterGain, now);
    }
    if (step % 4 === 2) {
      triggerHat(audioCtx, masterGain, now, true);
    } else if (step % 2 === 1) {
      triggerHat(audioCtx, masterGain, now, false);
    }
    // Relentless resonant bass sequence
    const industrialBass = [
      NOTES.D2, NOTES.D2, NOTES.D3, NOTES.D2,
      NOTES.F2, NOTES.D2, NOTES.D2, NOTES.G2,
      NOTES.D2, NOTES.D2, NOTES.D3, NOTES.D2,
      NOTES.Bb2, NOTES.A2, NOTES.G2, NOTES.F2,
    ];
    triggerBass(audioCtx, masterGain, now, industrialBass[step % 16], sixteenth * 1.1);

    // Staccato Industrial Chimes
    if (step % 8 === 4) {
      triggerLead(audioCtx, masterGain, now, NOTES.A4, sixteenth * 1.5);
    }
    if (step % 8 === 7) {
      triggerLead(audioCtx, masterGain, now, NOTES.D5, sixteenth * 1.5);
    }
  } else {
    // Gothic Nocturne (atmospheric post-punk)
    // Slower, deep heartbeat kick
    if (step % 8 === 0 || step % 16 === 10) {
      triggerKick(audioCtx, masterGain, now);
    }
    if (step % 4 === 2) {
      triggerHat(audioCtx, masterGain, now, false);
    }
    // Hypnotic walking bass
    const gothicBass = [
      NOTES.D2, NOTES.D2, NOTES.F2, NOTES.A2,
      NOTES.D3, NOTES.A2, NOTES.F2, NOTES.D2,
      NOTES.C3, NOTES.C3, NOTES.G2, NOTES.E4 ? NOTES.C3 : NOTES.C3,
      NOTES.Bb2, NOTES.A2, NOTES.G2, NOTES.A2,
    ];
    triggerBass(audioCtx, masterGain, now, gothicBass[step % 16], sixteenth * 2.8);

    // Minor melodic lead
    const gothicLead: Record<number, number> = {
      2: NOTES.F4,
      4: NOTES.A4,
      6: NOTES.D5,
      10: NOTES.C5,
      12: NOTES.A4,
      14: NOTES.G4,
    };
    if (gothicLead[step % 16]) {
      triggerLead(audioCtx, masterGain, now, gothicLead[step % 16], sixteenth * 3.5);
    }

    if (step % 16 === 0) {
      triggerPad(audioCtx, masterGain, now, [NOTES.D3, NOTES.A3, NOTES.D4], sixteenth * 16);
    }
  }
}

function startSequencer(track: MusicTrack) {
  if (sequencerInterval) {
    clearInterval(sequencerInterval);
  }
  const sixteenthMs = ((60 / track.bpm) / 4) * 1000;
  sequencerInterval = window.setInterval(() => {
    stepCounter = (stepCounter + 1) % 64;
    stepSequence(track, stepCounter);
  }, sixteenthMs);
}

function stopSequencer() {
  if (sequencerInterval) {
    clearInterval(sequencerInterval);
    sequencerInterval = null;
  }
  stepCounter = 0;
}

export function getCurrentTrack(): MusicTrack {
  return SOUNDTRACK_LIST[currentTrackIndex];
}

export function isTrackPlaying(): boolean {
  return isAudioPlaying;
}

export function toggleAmbientSoundscape(): { isPlaying: boolean; track: MusicTrack } {
  try {
    const ctx = getAudioContext();
    const track = SOUNDTRACK_LIST[currentTrackIndex];

    if (isAudioPlaying) {
      if (masterGain) {
        masterGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      }
      stopSequencer();
      isAudioPlaying = false;
      return { isPlaying: false, track };
    } else {
      if (!masterGain) {
        masterGain = ctx.createGain();
        masterGain.connect(ctx.destination);
      }
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.4);

      isAudioPlaying = true;
      stepCounter = 0;
      // Start immediate first beat
      stepSequence(track, 0);
      startSequencer(track);

      return { isPlaying: true, track };
    }
  } catch {
    return { isPlaying: false, track: SOUNDTRACK_LIST[currentTrackIndex] };
  }
}

// Function specifically to CHANGE the song (gan ta change koro)
export function nextAudioTrack(): { isPlaying: boolean; track: MusicTrack } {
  try {
    const ctx = getAudioContext();
    currentTrackIndex = (currentTrackIndex + 1) % SOUNDTRACK_LIST.length;
    const newTrack = SOUNDTRACK_LIST[currentTrackIndex];

    if (isAudioPlaying) {
      // Smoothly transition into the new song
      stopSequencer();
      stepCounter = 0;
      stepSequence(newTrack, 0);
      startSequencer(newTrack);
      playTactileClick();
      return { isPlaying: true, track: newTrack };
    } else {
      // Auto-start playing the new song
      if (!masterGain) {
        masterGain = ctx.createGain();
        masterGain.connect(ctx.destination);
      }
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.4);

      isAudioPlaying = true;
      stepCounter = 0;
      stepSequence(newTrack, 0);
      startSequencer(newTrack);
      playTactileClick();
      return { isPlaying: true, track: newTrack };
    }
  } catch {
    return { isPlaying: false, track: SOUNDTRACK_LIST[currentTrackIndex] };
  }
}
