// Small synthesized sounds: a wax crack and a paper slide for the seal, and a soft
// santoor-style phrase over a tanpura drone for the music button. Nothing plays without a tap.

let ac: AudioContext | null = null;
function ctx() {
  if (!ac) ac = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (ac.state === 'suspended') ac.resume();
  return ac;
}

function noise(a: AudioContext, dur: number) {
  const b = a.createBuffer(1, Math.ceil(a.sampleRate * dur), a.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const s = a.createBufferSource(); s.buffer = b; return s;
}

/** Wax snapping: a few sharp clicks through a bandpass. */
export function crack() {
  try {
    const a = ctx(), t = a.currentTime;
    [0, 0.05, 0.11].forEach((o, i) => {
      const n = noise(a, 0.08), f = a.createBiquadFilter(), g = a.createGain();
      f.type = 'bandpass'; f.frequency.value = 1800 - i * 400; f.Q.value = 1.2;
      g.gain.setValueAtTime(0.0001, t + o); g.gain.exponentialRampToValueAtTime(0.35 - i * 0.08, t + o + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + o + 0.07);
      n.connect(f); f.connect(g); g.connect(a.destination); n.start(t + o); n.stop(t + o + 0.09);
    });
  } catch { /* audio unavailable */ }
}

/** Paper sliding: a filtered noise sweep. */
export function rustle(delay = 0, dur = 0.9) {
  try {
    const a = ctx(), t = a.currentTime + delay;
    const n = noise(a, dur), f = a.createBiquadFilter(), g = a.createGain();
    f.type = 'bandpass'; f.Q.value = 0.7; f.frequency.setValueAtTime(900, t); f.frequency.linearRampToValueAtTime(2600, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.07, t + dur * 0.3); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    n.connect(f); f.connect(g); g.connect(a.destination); n.start(t); n.stop(t + dur);
  } catch { /* audio unavailable */ }
}

// ---- music ----
const SA = 261.63;
const SEQ = [0, 4, 7, 9, 12, 11, 9, 7, 4, 6, 7, 9, 7, 4, 2, 0, 7, 9, 11, 12, 14, 12, 11, 9, 7, 6, 4, 2, 4, 0, -1, 0];
let master: GainNode | null = null, timer = 0, step = 0, next = 0, playing = false, droneOn = false;

function pluck(a: AudioContext, t: number, f: number, v: number) {
  [1, 2, 3].forEach((h, i) => {
    const o = a.createOscillator(), g = a.createGain();
    o.type = i ? 'sine' : 'triangle'; o.frequency.value = f * h;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v / (h * h), t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8 / h);
    o.connect(g); g.connect(master!); o.start(t); o.stop(t + 2);
  });
}

function drone(a: AudioContext) {
  [SA / 2, SA * 0.75, (SA / 2) * 1.002].forEach((f) => {
    const o = a.createOscillator(), g = a.createGain(), fl = a.createBiquadFilter(), l = a.createOscillator(), lg = a.createGain();
    o.type = 'sawtooth'; o.frequency.value = f; fl.type = 'lowpass'; fl.frequency.value = 700;
    g.gain.value = 0.016; l.frequency.value = 0.15; lg.gain.value = 0.009;
    l.connect(lg); lg.connect(g.gain); o.connect(fl); fl.connect(g); g.connect(master!); o.start(); l.start();
  });
}

export function toggleMusic(): boolean {
  const a = ctx();
  if (!master) {
    master = a.createGain(); master.gain.value = 0;
    const dl = a.createDelay(); dl.delayTime.value = 0.32; const fb = a.createGain(); fb.gain.value = 0.26;
    master.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(a.destination); master.connect(a.destination);
  }
  if (!droneOn) { drone(a); droneOn = true; }
  playing = !playing;
  master.gain.cancelScheduledValues(a.currentTime);
  master.gain.linearRampToValueAtTime(playing ? 0.9 : 0, a.currentTime + 0.6);
  if (playing) {
    next = a.currentTime + 0.1;
    timer = window.setInterval(() => {
      while (next < a.currentTime + 0.4) {
        const n = SEQ[step % SEQ.length];
        pluck(a, next, SA * Math.pow(2, n / 12), 0.15);
        if (step % 4 === 0) pluck(a, next, SA * Math.pow(2, (n - 12) / 12), 0.05);
        next += step % 8 === 7 ? 0.9 : 0.45; step++;
      }
    }, 100);
  } else clearInterval(timer);
  return playing;
}
