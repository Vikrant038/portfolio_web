"use client";

/* Module-level WebAudio state — opt-in only (user must enable). */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let analyser: AnalyserNode | null = null;
let enabled = false;
let padGain: GainNode | null = null;

function ensureCtx() {
  if (typeof window === "undefined") return;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.32;
    analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    master.connect(analyser);
    analyser.connect(ctx.destination);
    startPad();
  }
  if (ctx.state === "suspended") void ctx.resume();
}

function startPad() {
  if (!ctx || !master || padGain) return;
  // very low ambient hum so the 3D scene has something to react to
  const osc1 = ctx.createOscillator();
  osc1.type = "sine";
  osc1.frequency.value = 55;
  const osc2 = ctx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.value = 110.4;
  padGain = ctx.createGain();
  padGain.gain.value = 0;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.11;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.018;
  lfo.connect(lfoGain);
  lfoGain.connect(padGain.gain);
  osc1.connect(padGain);
  osc2.connect(padGain);
  padGain.connect(master);
  osc1.start();
  osc2.start();
  lfo.start();
  // fade the pad in
  padGain.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 2);
}

export function setSoundEnabled(v: boolean) {
  enabled = v;
  if (v) ensureCtx();
  else if (ctx && padGain) {
    padGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
  }
}

export function soundEnabled() {
  return enabled;
}

/** Soft UI tick. */
export function playTick() {
  if (!enabled) return;
  ensureCtx();
  if (!ctx || !master) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(660, t);
  osc.frequency.exponentialRampToValueAtTime(520, t + 0.07);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.12, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
  osc.connect(g);
  g.connect(master);
  osc.start(t);
  osc.stop(t + 0.1);
}

/** Whoosh on section transitions. */
export function playWhoosh() {
  if (!enabled) return;
  ensureCtx();
  if (!ctx || !master) return;
  const t = ctx.currentTime;
  const dur = 0.6;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const p = i / data.length;
    data[i] = (Math.random() * 2 - 1) * (1 - p) * 0.6;
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(220, t);
  filter.frequency.exponentialRampToValueAtTime(1400, t + dur);
  filter.Q.value = 0.9;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.001, t);
  g.gain.exponentialRampToValueAtTime(0.1, t + 0.15);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter);
  filter.connect(g);
  g.connect(master);
  src.start(t);
  src.stop(t + dur);
}

/** 0..1 audio level for the 3D scene to react to. */
export function getAudioLevel(): number {
  if (!enabled || !analyser) return 0;
  const buf = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(buf);
  let sum = 0;
  for (let i = 0; i < buf.length; i++) sum += buf[i];
  return Math.min(1, sum / buf.length / 90);
}
