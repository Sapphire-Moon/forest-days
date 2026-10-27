// Procedural ASMR ambience built with the Web Audio API — no audio files to download.
// Each "layer" (rain, sizzle, train, crickets...) is synthesized from filtered noise and soft tones.
const rand = (a, b) => a + Math.random() * (b - a);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

class Ambience {
  constructor() {
    this.ctx = null;
    this.bus = null;
    this.sources = [];
    this.timers = [];
    this.volume = 0.6;
    this.muted = false;
    this.current = null;
  }

  init() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : this.volume;
      const comp = this.ctx.createDynamicsCompressor();
      this.master.connect(comp);
      comp.connect(this.ctx.destination);
      this.buffers = { white: this.noise('white'), pink: this.noise('pink'), brown: this.noise('brown') };
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return true;
  }

  get running() { return !!this.bus && this.ctx?.state === 'running'; }

  noise(kind) {
    const len = this.ctx.sampleRate * 6;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (kind === 'white') d[i] = w * 0.5;
      else if (kind === 'pink') {
        b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759;
        b2 = 0.969 * b2 + w * 0.153852; b3 = 0.8665 * b3 + w * 0.3104856;
        b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926;
      } else { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
    }
    return buf;
  }

  play(layers, { music = false } = {}) {
    if (!this.init()) return;
    this.stop();
    const t = this.ctx.currentTime;
    this.bus = this.ctx.createGain();
    this.bus.gain.setValueAtTime(0, t);
    this.bus.gain.linearRampToValueAtTime(1, t + 2.5);
    this.bus.connect(this.master);
    layers.forEach(name => LAYERS[name]?.(this));
    if (music) LAYERS.music(this);
    this.current = { layers, music };
  }

  stop() {
    this.timers.forEach(clearTimeout);
    this.timers = [];
    if (this.bus) {
      const bus = this.bus, srcs = this.sources, t = this.ctx.currentTime;
      bus.gain.cancelScheduledValues(t);
      bus.gain.setValueAtTime(bus.gain.value, t);
      bus.gain.linearRampToValueAtTime(0, t + 1);
      setTimeout(() => { srcs.forEach(s => { try { s.stop(); } catch { } }); bus.disconnect(); }, 1200);
    }
    this.bus = null;
    this.sources = [];
    this.current = null;
  }

  setVolume(v) {
    this.volume = v;
    if (this.master && !this.muted) this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.1);
  }

  setMuted(m) {
    this.muted = m;
    if (this.master) this.master.gain.setTargetAtTime(m ? 0 : this.volume, this.ctx.currentTime, 0.1);
  }

  // ---- building blocks ----
  filter(type, freq, Q = 1) {
    const f = this.ctx.createBiquadFilter();
    f.type = type; f.frequency.value = freq; f.Q.value = Q;
    return f;
  }

  loop(kind, chain, gain) {
    const s = this.ctx.createBufferSource();
    s.buffer = this.buffers[kind];
    s.loop = true;
    let node = s;
    for (const f of chain) { node.connect(f); node = f; }
    const g = this.ctx.createGain();
    g.gain.value = gain;
    node.connect(g);
    g.connect(this.bus);
    s.start(0, rand(0, 5));
    this.sources.push(s);
    return g;
  }

  lfo(param, rate, depth) {
    const o = this.ctx.createOscillator();
    o.frequency.value = rate;
    const g = this.ctx.createGain();
    g.gain.value = depth;
    o.connect(g); g.connect(param);
    o.start();
    this.sources.push(o);
  }

  burst(kind, { at = 0, dur = 0.05, type = 'bandpass', freq = 2000, Q = 1, gain = 0.3, attack = 0.004, dest = this.bus } = {}) {
    if (!dest) return;
    const t = this.ctx.currentTime + at;
    const s = this.ctx.createBufferSource();
    s.buffer = this.buffers[kind];
    const f = this.filter(type, freq, Q);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + dur);
    s.connect(f); f.connect(g); g.connect(dest);
    s.start(t, rand(0, 5));
    s.stop(t + attack + dur + 0.05);
  }

  tone({ at = 0, freq, dur = 0.3, type = 'sine', gain = 0.1, attack = 0.005, slideTo = null, dest = this.bus }) {
    if (!dest) return;
    const t = this.ctx.currentTime + at;
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + dur);
    o.connect(g); g.connect(dest);
    o.start(t);
    o.stop(t + attack + dur + 0.05);
  }

  every(min, max, fn) {
    const bus = this.bus;
    const run = () => {
      if (this.bus !== bus) return;
      fn();
      this.timers.push(setTimeout(run, rand(min, max)));
    };
    this.timers.push(setTimeout(run, rand(0, max)));
  }

  // Totoro's reminder chime: plays even when no ambience is running.
  chime(sad = false) {
    if (!this.init()) return;
    const notes = sad ? [659.25, 587.33, 493.88] : [783.99, 1046.5, 1318.5];
    notes.forEach((f, i) => {
      this.tone({ at: i * 0.18, freq: f, dur: 1.4, type: 'triangle', gain: 0.12, dest: this.master });
      this.tone({ at: i * 0.18, freq: f * 2, dur: 0.6, gain: 0.03, dest: this.master });
    });
  }

  // One-shot game sound effects (cooking & shopping).
  sfx(name) {
    if (!this.init()) return;
    const m = this.master;
    const fx = {
      chop: () => { this.burst('brown', { dur: 0.06, type: 'lowpass', freq: 900, gain: 0.9, dest: m }); this.burst('white', { dur: 0.03, freq: 2600, gain: 0.15, dest: m }); },
      crack: () => { this.burst('white', { dur: 0.03, type: 'highpass', freq: 2000, gain: 0.35, dest: m }); this.burst('white', { at: 0.07, dur: 0.05, freq: 1500, Q: 2, gain: 0.2, dest: m }); },
      plop: () => this.tone({ freq: 320, slideTo: 110, dur: 0.14, gain: 0.25, dest: m }),
      bubble: () => this.tone({ freq: rand(180, 380), slideTo: rand(600, 900), dur: 0.06, gain: 0.08, dest: m }),
      sizzle: () => this.burst('white', { dur: 0.35, type: 'highpass', freq: 3500, gain: 0.12, attack: 0.02, dest: m }),
      swish: () => this.burst('pink', { dur: 0.2, freq: 1400, Q: 0.8, gain: 0.18, attack: 0.08, dest: m }),
      squish: () => this.tone({ freq: 220, slideTo: 160, dur: 0.1, type: 'triangle', gain: 0.15, dest: m }),
      pick: () => { this.tone({ freq: 660, slideTo: 990, dur: 0.08, gain: 0.12, dest: m }); this.tone({ at: 0.07, freq: 1320, dur: 0.15, gain: 0.06, dest: m }); },
      wrong: () => this.tone({ freq: 260, slideTo: 190, dur: 0.18, type: 'triangle', gain: 0.12, dest: m }),
      ding: () => [1046.5, 1318.5, 1568].forEach((f, i) => this.tone({ at: i * 0.09, freq: f, dur: 0.8, type: 'triangle', gain: 0.08, dest: m })),
    };
    fx[name]?.();
  }

  pop() {
    if (!this.init()) return;
    this.tone({ freq: 500, slideTo: 1100, dur: 0.12, gain: 0.12, dest: this.master });
  }
}

const LAYERS = {
  rain(a) {
    a.loop('pink', [a.filter('highpass', 500), a.filter('lowpass', 6500)], 0.35);
    a.every(25, 90, () => a.burst('white', { dur: rand(0.01, 0.03), freq: rand(1500, 6000), Q: 2, gain: rand(0.03, 0.1) }));
  },
  drips(a) {
    a.every(350, 1500, () => a.tone({ freq: rand(900, 1500), slideTo: rand(1800, 2600), dur: 0.07, gain: 0.05 }));
  },
  wind(a) {
    const f = a.filter('bandpass', 500, 0.6);
    const g = a.loop('brown', [f], 0.45);
    a.lfo(g.gain, 0.07, 0.22);
    a.lfo(f.frequency, 0.05, 250);
  },
  breeze(a) {
    const f = a.filter('bandpass', 700, 0.5);
    const g = a.loop('brown', [f], 0.2);
    a.lfo(g.gain, 0.09, 0.1);
  },
  birds(a) {
    a.every(2500, 7000, () => {
      const base = rand(2200, 4200), n = Math.floor(rand(2, 6));
      for (let i = 0; i < n; i++) {
        a.tone({ at: i * rand(0.09, 0.15), freq: base * rand(0.9, 1.1), slideTo: base * rand(1.1, 1.45), dur: rand(0.05, 0.1), gain: 0.035 });
      }
    });
  },
  crickets(a) {
    const cricket = () => {
      const f = rand(4200, 4800);
      for (let i = 0; i < 3; i++) a.tone({ at: i * 0.045, freq: f, dur: 0.03, gain: 0.02 });
    };
    a.every(700, 1500, cricket);
    a.every(900, 2100, cricket);
  },
  fire(a) {
    a.loop('brown', [a.filter('lowpass', 500)], 0.3);
    a.every(60, 400, () => a.burst('white', { dur: rand(0.005, 0.02), type: 'highpass', freq: rand(1000, 3000), gain: rand(0.05, 0.22) }));
  },
  sizzle(a) {
    const g = a.loop('white', [a.filter('highpass', 2500), a.filter('lowpass', 9000)], 0.12);
    a.every(40, 120, () => g.gain.setTargetAtTime(rand(0.05, 0.2), a.ctx.currentTime, 0.03));
    a.every(60, 300, () => a.burst('white', { dur: 0.02, type: 'highpass', freq: 3000, gain: rand(0.05, 0.14) }));
  },
  bubbles(a) {
    a.every(150, 550, () => a.tone({ freq: rand(150, 400), slideTo: rand(500, 900), dur: rand(0.04, 0.08), gain: 0.05 }));
  },
  clinks(a) {
    a.every(3000, 9000, () => {
      const f = rand(2200, 3400);
      a.tone({ freq: f, dur: 0.6, gain: 0.03 });
      a.tone({ freq: f * 2.7, dur: 0.3, gain: 0.012 });
    });
  },
  pencil(a) {
    a.every(1500, 4000, () => {
      let t = 0;
      const n = Math.floor(rand(3, 8));
      for (let i = 0; i < n; i++) {
        const d = rand(0.08, 0.3);
        a.burst('white', { at: t, dur: d, freq: rand(3500, 5500), Q: 1.5, gain: 0.045, attack: 0.02 });
        t += d + rand(0.02, 0.1);
      }
    });
  },
  pages(a) {
    a.every(9000, 18000, () => {
      a.burst('pink', { dur: 0.45, freq: 1800, Q: 0.6, gain: 0.14, attack: 0.15 });
      a.burst('white', { at: 0.35, dur: 0.08, freq: 3000, gain: 0.07 });
    });
  },
  clock(a) {
    let tock = false;
    a.every(1000, 1000, () => { a.burst('white', { dur: 0.012, freq: tock ? 3200 : 4200, Q: 6, gain: 0.05 }); tock = !tock; });
  },
  shower(a) {
    a.loop('white', [a.filter('bandpass', 3500, 0.4)], 0.22);
    a.loop('pink', [a.filter('lowpass', 400)], 0.25);
    a.every(30, 90, () => a.burst('white', { dur: 0.02, freq: rand(800, 2500), Q: 3, gain: 0.05 }));
  },
  crowd(a) {
    const f = a.filter('bandpass', 600, 1.2);
    const g = a.loop('brown', [f], 0.3);
    a.lfo(g.gain, 0.3, 0.1);
    a.lfo(f.frequency, 0.2, 150);
    a.every(300, 1200, () => a.burst('pink', { dur: rand(0.1, 0.3), freq: rand(400, 1100), Q: 6, gain: 0.035, attack: 0.05 }));
  },
  chimes(a) {
    const scale = [0, 2, 4, 7, 9];
    a.every(5000, 11000, () => {
      for (let i = 0; i < 3; i++) {
        const st = pick(scale) + 12 * Math.floor(rand(0, 2));
        a.tone({ at: i * 0.2, freq: 880 * 2 ** (st / 12), dur: 2, gain: 0.025 });
      }
    });
  },
  footsteps(a) {
    a.every(480, 560, () => {
      a.burst('brown', { dur: 0.08, type: 'lowpass', freq: 300, gain: 0.5 });
      a.burst('white', { at: 0.01, dur: 0.06, freq: rand(1500, 2500), gain: 0.025 });
    });
  },
  train(a) {
    a.loop('brown', [a.filter('lowpass', 180)], 0.6);
    a.loop('pink', [a.filter('bandpass', 900, 0.5)], 0.05);
    a.every(1050, 1100, () => {
      a.burst('brown', { dur: 0.07, type: 'lowpass', freq: 700, gain: 0.8 });
      a.burst('brown', { at: 0.16, dur: 0.07, type: 'lowpass', freq: 650, gain: 0.6 });
    });
  },
  broom(a) {
    a.every(1100, 1500, () => a.burst('pink', { dur: 0.45, freq: rand(1500, 2500), Q: 0.8, gain: 0.16, attack: 0.15 }));
  },
  stream(a) {
    const f = a.filter('bandpass', 1200, 2);
    a.loop('pink', [f], 0.28);
    a.every(80, 200, () => f.frequency.setTargetAtTime(rand(700, 2200), a.ctx.currentTime, 0.05));
    a.every(150, 500, () => a.tone({ freq: rand(500, 1100), slideTo: rand(1200, 2000), dur: 0.05, gain: 0.018 }));
  },
  leaves(a) {
    a.every(2000, 6000, () => a.burst('pink', { dur: rand(0.6, 1.4), freq: rand(2500, 4000), Q: 0.5, gain: 0.05, attack: 0.4 }));
  },
  // A gentle, original music-box melody on a C-major pentatonic scale.
  music(a) {
    const scale = [0, 2, 4, 7, 9, 12, 14, 16, 19];
    const bass = [130.81, 110, 87.31, 98];
    let step = 0;
    a.every(560, 580, () => {
      const bar = Math.floor(step / 8) % bass.length;
      if (step % 8 === 0) a.tone({ freq: bass[bar], dur: 3.5, gain: 0.04, attack: 0.05 });
      if (Math.random() < 0.65) {
        const f = 523.25 * 2 ** (pick(scale) / 12);
        a.tone({ freq: f, dur: 1.8, type: 'triangle', gain: 0.022 });
        a.tone({ freq: f * 2, dur: 0.5, gain: 0.006 });
      }
      step++;
    });
  },
};

export const audio = new Ambience();
