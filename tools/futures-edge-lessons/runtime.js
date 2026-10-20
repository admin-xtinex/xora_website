/* XORA Futures Edge lesson player.
 *
 * Plays a lesson written as scene modules (content/futures-edge/<id>/modules) as a plain web
 * page. Everything on screen is a pure function of the lesson time t, so the page can pause,
 * seek and replay at any point. It provides the small "kit" the scenes are written against
 * (stage, easing, TextFx, assets, json) and a WebAudio synth for score.js.
 *
 * With a voiceover, build-lesson.mjs lengthens some scenes so the narration fits: a scene with
 * stretch factor k plays its animation and sound effects k times slower. Scene code still sees the
 * authored timeline (kit.start, kit.dur and t), so nothing in the modules changes. The voice is
 * one mixed track; the music dips under each line, and the CC button shows the line as text.
 *
 * build-lesson.mjs inlines this file into public/futures-edge/lessons/<id>.html, after a
 * `window.FILM = {...}` block that carries the scene list, module texts and asset paths.
 */
(function () {
  "use strict";

  const F = window.FILM;
  const W = F.width;
  const H = F.height;

  // ── Maths and easing ───────────────────────────────────────────────────────
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const clamp01 = (x) => clamp(x, 0, 1);
  const seg = (t, a, b) => (b <= a ? (t >= b ? 1 : 0) : clamp01((t - a) / (b - a)));
  const lerp = (a, b, p) => a + (b - a) * p;
  const eo = (x) => 1 - Math.pow(1 - clamp01(x), 3);
  const ei = (x) => Math.pow(clamp01(x), 3);
  const eio = (x) => {
    x = clamp01(x);
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  };
  const eob = (x, s = 1.4) => {
    x = clamp01(x);
    return 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2);
  };
  const rng = (seed) => {
    let a = seed >>> 0 || 1;
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  const breathe = (t, amt = 0.012, period = 3.2) => 1 + amt * Math.sin((2 * Math.PI * t) / period);

  // ── DOM helpers ────────────────────────────────────────────────────────────
  const h = (html) => {
    const tpl = document.createElement("template");
    tpl.innerHTML = String(html).trim();
    return tpl.content.firstElementChild;
  };
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const el = (tag, o = {}, children = []) => {
    const e = document.createElement(tag);
    if (o.class) e.className = o.class;
    if (o.style) e.setAttribute("style", o.style);
    if (o.text != null) e.textContent = o.text;
    if (o.html != null) e.innerHTML = o.html;
    for (const [k, v] of Object.entries(o.attrs || {})) e.setAttribute(k, v);
    for (const c of children) e.append(c);
    return e;
  };

  // Words of an element as inline-block spans (inline markup such as <b> is kept).
  const wordCache = new WeakMap();
  function words(root) {
    let list = wordCache.get(root);
    if (list) return list;
    list = [];
    const walk = (node) => {
      for (const child of Array.from(node.childNodes)) {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          for (const part of child.textContent.split(/(\s+)/)) {
            if (!part) continue;
            if (/^\s+$/.test(part)) {
              frag.append(document.createTextNode(part));
            } else {
              const s = document.createElement("span");
              s.textContent = part;
              s.style.display = "inline-block";
              frag.append(s);
              list.push(s);
            }
          }
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      }
    };
    walk(root);
    wordCache.set(root, list);
    return list;
  }
  const TextFx = {
    fadeFromRight(root, t, t0, o = {}) {
      const st = o.stagger ?? 0.11, d = o.dur ?? 0.5, dx = o.dx ?? 26;
      const list = words(root);
      list.forEach((s, i) => {
        const p = eo(seg(t, t0 + i * st, t0 + i * st + d));
        s.style.opacity = p;
        s.style.transform = "translateX(" + ((1 - p) * dx).toFixed(2) + "px)";
      });
      return t0 + Math.max(0, list.length - 1) * st + d;
    },
    fadeOutLeft(root, t, t0, o = {}) {
      const st = o.stagger ?? 0.04, d = o.dur ?? 0.35, dx = o.dx ?? 26;
      const list = words(root);
      list.forEach((s, i) => {
        const p = ei(seg(t, t0 + i * st, t0 + i * st + d));
        s.style.opacity = 1 - p;
        s.style.transform = "translateX(" + (-p * dx).toFixed(2) + "px)";
      });
      return t0 + Math.max(0, list.length - 1) * st + d;
    },
  };

  // ── The kit the scene modules use ──────────────────────────────────────────
  const modules = F.modules;
  const jsonCache = {};
  const assets = {
    url: (name) => F.assetBase + name,
    has: (name) => Object.prototype.hasOwnProperty.call(F.assets, name),
    list: () => Object.keys(F.assets),
  };
  const defs = {};
  let scoreFn = null;

  // start/dur: the scene in the played timeline; oldStart/oldDur: as authored (k = dur / oldDur).
  let acc = 0;
  const scenes = F.scenes.map((s) => {
    const o = Object.assign({ k: 1, oldStart: acc, oldDur: s.dur }, s, { start: acc });
    acc += s.dur;
    return o;
  });
  const END = acc;
  const OLD_END = scenes.reduce((a, s) => a + s.oldDur, 0);
  // Authored time to played time.
  function warp(x) {
    for (let i = scenes.length - 1; i >= 0; i--) {
      const s = scenes[i];
      if (x >= s.oldStart) return s.start + (x - s.oldStart) * s.k;
    }
    return x;
  }
  // Narration lines: spoken when the lesson has a voice track (F.voice.src), always shown as captions.
  const lines = (F.voice && F.voice.lines) || [];
  // Stretches where the music dips under the voice: each line plus a little either side, close ones joined.
  const duckSpans = [];
  if (F.voice && F.voice.src) for (const l of lines) {
    const a = l.t - 0.15, b = l.t + l.d + 0.25, last = duckSpans[duckSpans.length - 1];
    if (last && a - last[1] < 1.2) last[1] = b; else duckSpans.push([a, b]);
  }

  function makeKit(box, start, dur) {
    return {
      stage: box, start, dur, W, H,
      seg, lerp, eo, ei, eio, eob, clamp, clamp01, rng, breathe, TextFx, h, el, esc,
      assets,
      module: (n) => (n in modules ? modules[n] : null),
      json: (n) => (jsonCache[n] ??= JSON.parse(modules[n])),
      modules: () => Object.keys(modules),
      scene: (id, def) => { defs[id] = def; },
      score: (fn) => { scoreFn = fn; },
    };
  }
  const run = (name, kit) => new Function("kit", modules[name] + "\n//# sourceURL=" + F.id + "/" + name)(kit);

  // ── Stage ──────────────────────────────────────────────────────────────────
  const stage = document.getElementById("stage");
  const css = document.createElement("style");
  css.textContent = modules["base.css"] || "";
  document.head.append(css);

  function fit() {
    const s = Math.min(window.innerWidth / W, window.innerHeight / H);
    stage.style.transform = "translate(-50%, -50%) scale(" + s + ")";
  }
  window.addEventListener("resize", fit);
  window.addEventListener("orientationchange", () => setTimeout(fit, 200));
  fit();

  // ── Audio: score.js recorded as events, then synthesised with WebAudio ─────
  function midiOf(p) {
    if (typeof p === "number") return p;
    const m = /^([A-Ga-g])([#b]?)(-?\d)$/.exec(String(p).trim());
    if (!m) return 72;
    const base = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }[m[1].toLowerCase()];
    return 12 * (Number(m[3]) + 1) + base + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0);
  }

  // score.js runs twice: the music against the played timeline, the sound effects against the
  // authored one and then moved onto the played one, so each cue stays with its animation.
  function recordScore() {
    const T = { END };
    for (const s of scenes) T[s.id] = s.start;
    const music = recordPass(T);
    const Told = { END: OLD_END };
    for (const s of scenes) Told[s.id] = s.oldStart;
    const cues = recordPass(Told);
    const ev = music.ev.filter((e) => e.k !== "f");
    for (const e of cues.ev) {
      if (e.k !== "f") continue;
      e.t = warp(e.t);
      e.s = e.name === "revswell" ? e.t - e.d : e.t;
      ev.push(e);
    }
    ev.sort((a, b) => a.s - b.s);
    return { ev, tracks: music.tracks, master: music.master };
  }

  function recordPass(T) {
    const ev = [];
    const tracks = {};
    const master = { gain: -6, music: 0, fadeOut: 1 };
    let B = 0.5, t0 = 0;
    const at = (o) => (o.t != null ? o.t : t0 + (o.beat || 0) * B);
    const len = (o, d) => (o.dur != null ? o.dur : o.beats != null ? o.beats * B : d);
    const push = (e) => {
      e.s = e.name === "revswell" ? e.t - e.d : e.t;
      if (e.s < -0.1) return;
      if (e.s < 0) { e.t += -e.s; e.s = 0; }
      ev.push(e);
    };
    const hits = (str, rep, step, from, vel, fn) => {
      for (let r = 0; r < rep; r++) {
        for (let i = 0; i < str.length; i++) {
          const c = str[i];
          if (c !== "x" && c !== "X" && c !== "o") continue;
          fn(t0 + (from + (r * str.length + i) * step) * B, vel * (c === "X" ? 1.25 : c === "o" ? 0.5 : 1));
        }
      }
    };
    const S = {
      tempo(bpm, o = {}) { B = 60 / bpm; t0 = o.t0 || 0; },
      beat: (n) => t0 + n * B,
      toBeat: (t) => (t - t0) / B,
      seed() {},
      program(track, patch, o = {}) {
        tracks[track] = { patch, gain: o.gain || 0, pan: o.pan || 0, rev: o.rev || 0, bright: o.bright ?? 1 };
      },
      note(track, p, o = {}) { push({ k: "n", track, m: midiOf(p), t: at(o), d: len(o, B), v: o.vel ?? 90 }); },
      chord(track, ps, o = {}) { ps.forEach((p) => S.note(track, p, o)); },
      pattern(track, str, o = {}) {
        const pitches = o.pitch || ["C5"];
        let k = 0;
        const step = o.step ?? 0.5;
        hits(str, o.repeat ?? 1, step, o.from || 0, o.vel ?? 80, (t, v) =>
          push({ k: "n", track, m: midiOf(pitches[k++ % pitches.length]), t, d: o.dur ?? step * B * 0.9, v }));
      },
      drum(name, o = {}) { push({ k: "d", name, t: at(o), d: 0.3, v: o.vel ?? 90 }); },
      drums(map, o = {}) {
        for (const name of Object.keys(map)) {
          hits(map[name], o.repeat ?? 1, o.step ?? 0.5, o.from || 0, o.vel ?? 80, (t, v) => push({ k: "d", name, t, d: 0.3, v }));
        }
      },
      ticks(times, o = {}) { times.forEach((t) => push({ k: "f", name: "tick", t, d: 0.03, v: o.vel ?? 40, pitch: 0 })); },
      fx(name, t, o = {}) { push({ k: "f", name, t, d: o.dur ?? 0.5, v: o.vel ?? 70, pitch: o.pitch || 0 }); },
      run(track, ps, o = {}) {
        const step = o.step ?? 0.1;
        ps.forEach((p, i) => push({ k: "n", track, m: midiOf(p), t: o.t + i * step, d: step * 2.5, v: (o.vel ?? 70) + i * (o.cresc || 0) }));
      },
      master(o = {}) {
        if (o.gain != null) master.gain = o.gain;
        if (o.music != null) master.music = o.music;
        if (o.fadeOut != null) master.fadeOut = o.fadeOut;
      },
    };
    if (scoreFn) scoreFn(S, T);
    return { ev, tracks, master };
  }

  const db = (x) => Math.pow(10, x / 20);
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);

  const audio = {
    ctx: null, enabled: false, muted: false, score: null,
    out: null, verb: null, noise: null, session: null, timer: 0,
    voiceData: null, voiceBuf: null, voiceOut: null,
  };
  const DUCK = 0.4;

  function setupAudio() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    const ctx = (audio.ctx = new AC());
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 4;
    comp.connect(ctx.destination);
    audio.out = ctx.createGain();
    audio.out.gain.value = db(audio.score.master.gain);
    audio.out.connect(comp);
    // A small generated room for the reverb send.
    const len = Math.floor(ctx.sampleRate * 2.4);
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    const r = rng(9);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (r() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    audio.verb = ctx.createConvolver();
    audio.verb.buffer = ir;
    const verbGain = ctx.createGain();
    verbGain.gain.value = 0.5;
    audio.verb.connect(verbGain);
    verbGain.connect(audio.out);
    const nb = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const nd = nb.getChannelData(0);
    const r2 = rng(3);
    for (let i = 0; i < nd.length; i++) nd[i] = r2() * 2 - 1;
    audio.noise = nb;
    // The voice skips the music's compressor and goes straight out.
    audio.voiceOut = ctx.createGain();
    audio.voiceOut.gain.value = 1;
    audio.voiceOut.connect(ctx.destination);
    decodeVoice();
    return true;
  }

  async function decodeVoice() {
    if (!audio.ctx || audio.voiceBuf || !audio.voiceData) return;
    try {
      const data = await audio.voiceData;
      if (!data || audio.voiceBuf) return;
      audio.voiceBuf = await new Promise((ok, fail) => audio.ctx.decodeAudioData(data.slice(0), ok, fail));
    } catch (e) {
      return; // the lesson plays on without the voice
    }
    if (audio.session) startVoice(audio.session);
  }

  // The voice of one session, from the session's start point; the music dips under each line.
  function startVoice(s) {
    if (!audio.voiceBuf || s.voice) return;
    const ctx = audio.ctx;
    const at = Math.max(s.ctx0, ctx.currentTime + 0.02);
    const off = s.film0 + (at - s.ctx0);
    if (off >= audio.voiceBuf.duration) return;
    const src = ctx.createBufferSource();
    src.buffer = audio.voiceBuf;
    src.connect(audio.voiceOut);
    src.start(at, off);
    s.voice = src;
    for (const g of [s.duck.gain, s.send.gain]) {
      for (const [a, b] of duckSpans) {
        if (b <= off) continue;
        const ca = at + (a - off), cb = at + (b - off);
        if (ca > at) { g.setValueAtTime(1, ca); g.linearRampToValueAtTime(DUCK, ca + 0.25); } else g.setValueAtTime(DUCK, at);
        g.setValueAtTime(DUCK, cb);
        g.linearRampToValueAtTime(1, cb + 0.5);
      }
    }
  }

  // One playback session: a bus that can be dropped as a whole on pause or seek.
  function startSession(filmT) {
    stopSession();
    if (!audio.enabled || audio.muted) return;
    const ctx = audio.ctx;
    const bus = ctx.createGain();
    const duck = ctx.createGain();
    bus.connect(duck);
    duck.connect(audio.out);
    const send = ctx.createGain();
    send.connect(audio.verb);
    // The instruments (not the drums or sound effects) go through their own level, master({ music }).
    const music = ctx.createGain();
    music.gain.value = db(audio.score.master.music);
    music.connect(bus);
    const musicSend = ctx.createGain();
    musicSend.gain.value = music.gain.value;
    musicSend.connect(send);
    const tracks = {};
    for (const [name, tr] of Object.entries(audio.score.tracks)) {
      const g = ctx.createGain();
      g.gain.value = db(tr.gain);
      const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (pan) { pan.pan.value = tr.pan; g.connect(pan); pan.connect(music); } else g.connect(music);
      const rs = ctx.createGain();
      rs.gain.value = tr.rev;
      g.connect(rs);
      rs.connect(musicSend);
      tracks[name] = { node: g, def: tr };
    }
    const s = { bus, duck, send, music, musicSend, tracks, ctx0: ctx.currentTime + 0.06, film0: filmT, upTo: filmT, idx: 0, voice: null };
    audio.session = s;
    startVoice(s);
    // Notes already sounding at the seek point start now with what is left of them.
    for (const e of audio.score.ev) {
      if (e.s >= filmT) break;
      if (e.k === "n" && e.s + e.d > filmT + 0.15) sound(e, s, filmT, e.s + e.d - filmT);
    }
    s.idx = audio.score.ev.findIndex((e) => e.s >= filmT);
    if (s.idx < 0) s.idx = audio.score.ev.length;
    // Fade the master out over the last seconds of the lesson.
    const fo = audio.score.master.fadeOut;
    if (fo > 0) {
      const a = Math.max(filmT, END - fo);
      bus.gain.setValueAtTime(1, s.ctx0 + (a - filmT));
      bus.gain.linearRampToValueAtTime(0.0001, s.ctx0 + (END - filmT));
    }
    audio.timer = setInterval(() => pump(), 50);
    pump();
  }

  function stopSession() {
    clearInterval(audio.timer);
    const s = audio.session;
    audio.session = null;
    if (!s) return;
    const now = audio.ctx.currentTime;
    s.bus.gain.cancelScheduledValues(now);
    s.bus.gain.setTargetAtTime(0, now, 0.03);
    s.send.gain.cancelScheduledValues(now);
    s.send.gain.setTargetAtTime(0, now, 0.03);
    if (s.voice) {
      const v = s.voice;
      try { v.stop(now + 0.05); } catch (e) { /* not started yet */ }
      setTimeout(() => v.disconnect(), 400);
    }
    setTimeout(() => { s.bus.disconnect(); s.duck.disconnect(); s.send.disconnect(); s.music.disconnect(); s.musicSend.disconnect(); }, 400);
  }

  function pump() {
    const s = audio.session;
    if (!s) return;
    const filmNow = s.film0 + (audio.ctx.currentTime - s.ctx0);
    const horizon = filmNow + 0.6;
    const ev = audio.score.ev;
    while (s.idx < ev.length && ev[s.idx].s <= horizon) {
      const e = ev[s.idx++];
      if (e.s >= s.film0) sound(e, s, e.s, e.d);
    }
  }

  function sound(e, s, filmStart, dur) {
    const ctx = audio.ctx;
    const when = Math.max(ctx.currentTime, s.ctx0 + (filmStart - s.film0));
    const v = Math.pow(clamp01(e.v / 127), 1.5);
    if (e.k === "n") {
      const tr = s.tracks[e.track];
      if (!tr) return;
      voice(tr.def.patch, tr.node, hz(e.m), when, Math.max(0.05, dur), v, tr.def.bright);
    } else if (e.k === "d") {
      drum(e.name, s.bus, when, v);
    } else {
      fx(e.name, s.bus, s.send, when, e.d, v, e.pitch || 0);
    }
  }

  function env(g, when, peak, attack, hold, release) {
    peak = Math.max(peak, 0.0002);
    g.gain.setValueAtTime(0.0001, when);
    g.gain.linearRampToValueAtTime(peak, when + attack);
    g.gain.setValueAtTime(peak, when + attack + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, when + attack + hold + release);
    return when + attack + hold + release + 0.05;
  }
  function osc(type, f, dest, when, stop, detune) {
    const o = audio.ctx.createOscillator();
    o.type = type;
    o.frequency.value = f;
    if (detune) o.detune.value = detune;
    o.connect(dest);
    o.start(when);
    o.stop(stop);
    return o;
  }
  function noiseSrc(dest, when, stop) {
    const n = audio.ctx.createBufferSource();
    n.buffer = audio.noise;
    n.loop = true;
    n.connect(dest);
    n.start(when);
    n.stop(stop);
    return n;
  }

  function voice(patch, dest, f, when, dur, v, bright) {
    const ctx = audio.ctx;
    const g = ctx.createGain();
    g.connect(dest);
    let stop;
    switch (patch) {
      case "pad": {
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 700 + 900 * bright;
        lp.connect(g);
        stop = env(g, when, 0.22 * v, 0.5, Math.max(0, dur - 0.5), 1.1);
        osc("sawtooth", f, lp, when, stop, -8);
        osc("sawtooth", f, lp, when, stop, 8);
        break;
      }
      case "ep":
      case "keys": {
        g.gain.setValueAtTime(0.0001, when);
        g.gain.linearRampToValueAtTime(0.22 * v + 0.0002, when + 0.008);
        g.gain.exponentialRampToValueAtTime(0.08 * v + 0.0001, when + Math.min(dur, 0.9));
        g.gain.exponentialRampToValueAtTime(0.0001, when + dur + 0.4);
        stop = when + dur + 0.45;
        osc("sine", f, g, when, stop);
        const h2 = ctx.createGain();
        h2.gain.value = 0.25;
        h2.connect(g);
        osc("sine", f * 2, h2, when, stop);
        break;
      }
      case "bass": {
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 500;
        lp.connect(g);
        stop = env(g, when, 0.34 * v, 0.01, Math.max(0, dur - 0.1), 0.18);
        osc("sine", f, lp, when, stop);
        osc("triangle", f * 2, lp, when, stop);
        break;
      }
      case "pluck": {
        g.gain.setValueAtTime(0.0001, when);
        g.gain.linearRampToValueAtTime(0.24 * v + 0.0002, when + 0.004);
        g.gain.exponentialRampToValueAtTime(0.0001, when + Math.min(1.1, dur + 0.45));
        stop = when + Math.min(1.1, dur + 0.45) + 0.05;
        osc("triangle", f, g, when, stop);
        break;
      }
      default: {
        // marimba, vibes, glock and anything unknown: a struck bar.
        g.gain.setValueAtTime(0.0001, when);
        g.gain.linearRampToValueAtTime(0.26 * v + 0.0002, when + 0.003);
        g.gain.exponentialRampToValueAtTime(0.0001, when + 0.7);
        stop = when + 0.75;
        osc("sine", f, g, when, stop);
        const h4 = ctx.createGain();
        h4.gain.value = 0.12;
        h4.connect(g);
        osc("sine", f * 4, h4, when, stop);
      }
    }
  }

  function drum(name, dest, when, v) {
    const ctx = audio.ctx;
    const g = ctx.createGain();
    g.connect(dest);
    if (name === "kick" || name === "tom") {
      const o = osc("sine", 140, g, when, when + 0.4);
      o.frequency.setValueAtTime(140, when);
      o.frequency.exponentialRampToValueAtTime(45, when + 0.12);
      env(g, when, 0.8 * v, 0.002, 0.02, 0.3);
    } else {
      const f = ctx.createBiquadFilter();
      f.type = name === "sidestick" || name === "woodblock" ? "bandpass" : "highpass";
      f.frequency.value = name === "sidestick" || name === "woodblock" ? 1900 : 7000;
      f.connect(g);
      noiseSrc(f, when, when + 0.2);
      env(g, when, 0.22 * v, 0.001, 0.005, name === "openhat" ? 0.25 : 0.045);
    }
  }

  function fx(name, dest, send, when, dur, v, pitch) {
    const ctx = audio.ctx;
    const tr = Math.pow(2, pitch / 12);
    const g = ctx.createGain();
    g.connect(dest);
    const wet = ctx.createGain();
    wet.gain.value = 0.35;
    g.connect(wet);
    wet.connect(send);
    const r = rng(Math.floor(when * 1000));
    switch (name) {
      case "tick": {
        const f = ctx.createBiquadFilter();
        f.type = "bandpass";
        f.frequency.value = 3000 + r() * 1500;
        f.Q.value = 3;
        f.connect(g);
        noiseSrc(f, when, when + 0.06);
        env(g, when, 0.5 * v, 0.001, 0.004, 0.025);
        break;
      }
      case "click": {
        osc("square", 1400, g, when, when + 0.06);
        env(g, when, 0.12 * v, 0.001, 0.005, 0.03);
        break;
      }
      case "ding": {
        osc("sine", 1046.5 * tr, g, when, when + 1.6);
        osc("sine", 1568 * tr, g, when, when + 1.6);
        env(g, when, 0.16 * v, 0.004, 0.02, 1.4);
        break;
      }
      case "chime": {
        [0, 4, 7].forEach((st, i) => {
          const gi = ctx.createGain();
          gi.connect(g);
          const t = when + i * 0.07;
          osc("sine", 1046.5 * tr * Math.pow(2, st / 12), gi, t, t + 1);
          env(gi, t, 0.14 * v, 0.003, 0.01, 0.9);
        });
        g.gain.value = 1;
        break;
      }
      case "sparkle": {
        for (let i = 0; i < 6; i++) {
          const gi = ctx.createGain();
          gi.connect(g);
          const t = when + r() * 0.5;
          osc("sine", 2000 + r() * 2200, gi, t, t + 0.2);
          env(gi, t, 0.07 * v, 0.002, 0.01, 0.12);
        }
        break;
      }
      case "whoosh":
      case "revswell": {
        const f = ctx.createBiquadFilter();
        f.type = "bandpass";
        f.Q.value = 0.8;
        f.frequency.setValueAtTime(300, when);
        f.frequency.exponentialRampToValueAtTime(name === "whoosh" ? 2400 : 3200, when + dur);
        f.connect(g);
        noiseSrc(f, when, when + dur + 0.1);
        g.gain.setValueAtTime(0.0001, when);
        if (name === "whoosh") {
          g.gain.linearRampToValueAtTime(0.3 * v, when + dur * 0.5);
          g.gain.linearRampToValueAtTime(0.0001, when + dur);
        } else {
          g.gain.exponentialRampToValueAtTime(0.28 * v + 0.0002, when + dur);
          g.gain.linearRampToValueAtTime(0.0001, when + dur + 0.06);
        }
        break;
      }
      case "thud": {
        const o = osc("sine", 110, g, when, when + 0.4);
        o.frequency.setValueAtTime(110, when);
        o.frequency.exponentialRampToValueAtTime(45, when + 0.18);
        env(g, when, 0.5 * v, 0.002, 0.02, 0.3);
        break;
      }
      case "boing": {
        const o = osc("sine", 220 * tr, g, when, when + 0.5);
        o.frequency.setValueAtTime(220 * tr, when);
        o.frequency.linearRampToValueAtTime(520 * tr, when + 0.12);
        o.frequency.linearRampToValueAtTime(300 * tr, when + 0.4);
        env(g, when, 0.2 * v, 0.005, 0.05, 0.35);
        break;
      }
      default: {
        // pop, and any name this synth does not know.
        const o = osc("sine", 600 * tr, g, when, when + 0.2);
        o.frequency.setValueAtTime(600 * tr, when);
        o.frequency.exponentialRampToValueAtTime(1200 * tr, when + 0.06);
        env(g, when, 0.3 * v, 0.002, 0.01, 0.12);
      }
    }
  }

  // ── Playback ───────────────────────────────────────────────────────────────
  const state = { t: 0, playing: false, wall0: 0, t0: 0, current: -1 };
  let instances = [];

  function sceneAt(t) {
    for (let i = scenes.length - 1; i >= 0; i--) if (t >= scenes[i].start) return i;
    return 0;
  }

  function renderAt(t) {
    const i = sceneAt(t);
    if (i !== state.current) {
      instances.forEach((inst, k) => { inst.box.style.display = k === i ? "block" : "none"; });
      state.current = i;
    }
    const inst = instances[i];
    inst.def.render.call(inst.def, (Math.min(t, END - 1e-4) - inst.sc.start) / inst.sc.k, inst.kit);
    ui.update(t);
  }

  function now() { return performance.now() / 1000; }

  function play() {
    if (state.t >= END - 0.01) state.t = 0;
    state.playing = true;
    state.wall0 = now();
    state.t0 = state.t;
    startSession(state.t);
    ui.update(state.t);
  }
  function pause() {
    state.playing = false;
    stopSession();
    ui.update(state.t);
  }
  function seek(t) {
    state.t = clamp(t, 0, END);
    state.wall0 = now();
    state.t0 = state.t;
    if (state.playing) startSession(state.t);
    renderAt(state.t);
  }
  function tick() {
    if (state.playing) {
      state.t = state.t0 + (now() - state.wall0);
      if (state.t >= END) {
        state.t = END;
        pause();
      }
      renderAt(state.t);
    }
    requestAnimationFrame(tick);
  }

  async function enableAudio() {
    if (audio.enabled) return;
    if (!audio.ctx && !setupAudio()) return;
    try { await audio.ctx.resume(); } catch (e) { /* stays suspended */ }
    if (audio.ctx.state !== "running") return;
    audio.enabled = true;
    ui.sound();
    if (state.playing) startSession(state.t);
  }

  // ── Controls ───────────────────────────────────────────────────────────────
  const fmt = (t) => {
    const s = Math.max(0, Math.floor(t));
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  };
  const ICON = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h4.5v16H6zM13.5 4H18v16h-4.5z" fill="currentColor"/></svg>',
    replay: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5V1.5L7 6.5l5 5V8a5 5 0 1 1-5 5H5a7 7 0 1 0 7-8z" fill="currentColor"/></svg>',
    on: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4zM16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    off: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16.5 9.5l5 5M21.5 9.5l-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    full: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    exit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  const CC_LANGS = [
    { id: "ml", label: "മലയാളം", short: "മ", name: "Malayalam" },
    { id: "en", label: "English", short: "EN", name: "English" },
    { id: "off", label: "Off", short: "CC", name: "Off" },
  ];

  // ── Full screen ────────────────────────────────────────────────────────────
  // The Fullscreen API where the browser has it (desktop, Android, iPad), turning a phone to
  // landscape where it allows. iPhone Safari has no Fullscreen API for pages, so inside the
  // course page the player asks the parent to grow the lesson to fill the whole screen instead.
  const embedded = window.parent !== window;
  const root = document.documentElement;
  const fs = {
    native: !!(document.fullscreenEnabled || document.webkitFullscreenEnabled),
    pseudo: false,
    available() { return this.native || embedded; },
    active() { return !!(document.fullscreenElement || document.webkitFullscreenElement) || this.pseudo; },
    async toggle() {
      if (this.native) {
        if (document.fullscreenElement || document.webkitFullscreenElement) {
          try { screen.orientation && screen.orientation.unlock && screen.orientation.unlock(); } catch (e) { /* not locked */ }
          await (document.exitFullscreen || document.webkitExitFullscreen).call(document);
          return;
        }
        try {
          await (root.requestFullscreen || root.webkitRequestFullscreen).call(root, { navigationUI: "hide" });
          if (screen.orientation && screen.orientation.lock) await screen.orientation.lock("landscape").catch(() => {});
          return;
        } catch (e) {
          if (!embedded) return; // refused: fall through to the parent page below
        }
      }
      this.pseudo = !this.pseudo;
      window.parent.postMessage({ type: "futures-edge:fullscreen", on: this.pseudo }, location.origin);
      ui.full();
    },
  };
  document.addEventListener("fullscreenchange", () => ui.full());
  document.addEventListener("webkitfullscreenchange", () => ui.full());
  const ui = (() => {
    const bar = h(
      '<div class="fe-ui" role="group" aria-label="Lesson controls">' +
        '<button type="button" class="fe-btn fe-pp" aria-label="Pause"></button>' +
        '<div class="fe-track" role="slider" tabindex="0" aria-label="Lesson position" aria-valuemin="0"><i></i></div>' +
        '<span class="fe-time"></span>' +
        (lines.length ? '<button type="button" class="fe-btn fe-lang" aria-label="Language">EN</button>' : "") +
        (lines.length ? '<div class="fe-ccw"><button type="button" class="fe-btn fe-cc" aria-haspopup="true" aria-expanded="false">CC</button>' +
          '<div class="fe-ccm" role="menu" aria-label="Subtitles" hidden>' +
          CC_LANGS.map((l) => '<button type="button" role="menuitemradio" data-lang="' + l.id + '"' + (l.id === "ml" ? ' lang="ml"' : "") + '>' + l.label + '</button>').join("") +
          '</div></div>' : "") +
        '<button type="button" class="fe-btn fe-snd" aria-label="Turn sound on"></button>' +
        (fs.available() ? '<button type="button" class="fe-btn fe-fs" aria-label="Full screen"></button>' : "") +
      "</div>"
    );
    const hint = h('<button type="button" class="fe-hint">Click anywhere for sound</button>');
    const cap = h('<p class="fe-cap" aria-live="off"></p>');
    document.body.append(cap, bar, hint);
    const cc = bar.querySelector(".fe-cc");
    const ccMenu = bar.querySelector(".fe-ccm");
    const fsb = bar.querySelector(".fe-fs");
    if (fsb) fsb.addEventListener("click", (e) => { e.stopPropagation(); fs.toggle(); wake(); });
    // Subtitle language: Malayalam by default when the lesson has it, then English, or off.
    // The viewer's choice is remembered on this device.
    const hasMl = lines.some((l) => l.ml);
    let ccLang = hasMl ? "ml" : "en", capText = null;
    try {
      const saved = localStorage.getItem("fe-subtitles");
      if (saved === "en" || saved === "off" || (saved === "ml" && hasMl)) ccLang = saved;
    } catch (e) { /* storage blocked: keep the default */ }
    const setLang = (lang) => {
      ccLang = lang;
      try { localStorage.setItem("fe-subtitles", lang); } catch (e) { /* not remembered */ }
      capText = null;
      api.update(state.t);
      api.cc();
    };
    // Language toggle: switches voice track (EN / ML) and reloads.
    const langBtn = bar.querySelector(".fe-lang");
    if (langBtn) {
      langBtn.textContent = voiceLang === "ml" ? "മ" : "EN";
      langBtn.setAttribute("aria-label", voiceLang === "ml" ? "Switch to English" : "Switch to Malayalam");
      langBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const next = voiceLang === "ml" ? "en" : "ml";
        try { localStorage.setItem("fe-voice-lang", next); } catch (e) {}
        location.reload();
      });
    }
    const openMenu = (open) => {
      if (!ccMenu) return;
      ccMenu.hidden = !open;
      cc.setAttribute("aria-expanded", String(open));
      if (open) (ccMenu.querySelector('[aria-checked="true"]') || ccMenu.firstElementChild).focus();
    };
    if (cc) {
      cc.addEventListener("click", (e) => { e.stopPropagation(); openMenu(ccMenu.hidden); wake(); });
      ccMenu.addEventListener("click", (e) => {
        const b = e.target.closest("[data-lang]");
        if (!b) return;
        e.stopPropagation();
        setLang(b.dataset.lang);
        openMenu(false);
        cc.focus();
      });
      ccMenu.addEventListener("keydown", (e) => {
        const items = Array.from(ccMenu.children), i = items.indexOf(document.activeElement);
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          items[(i + (e.key === "ArrowDown" ? 1 : items.length - 1)) % items.length].focus();
        }
        if (e.key === "Escape") { e.stopPropagation(); openMenu(false); cc.focus(); }
      });
      document.addEventListener("pointerdown", (e) => { if (!e.target.closest(".fe-ccw")) openMenu(false); }, true);
      if (!hasMl) ccMenu.querySelector('[data-lang="ml"]').remove();
    }
    const pp = bar.querySelector(".fe-pp");
    const trk = bar.querySelector(".fe-track");
    const fill = trk.querySelector("i");
    const time = bar.querySelector(".fe-time");
    const snd = bar.querySelector(".fe-snd");
    trk.setAttribute("aria-valuemax", String(Math.round(END)));
    let idle = 0;
    const wake = () => {
      document.body.classList.remove("fe-idle");
      clearTimeout(idle);
      idle = setTimeout(() => { if (state.playing) document.body.classList.add("fe-idle"); }, 2600);
    };
    document.addEventListener("pointermove", wake);
    pp.addEventListener("click", (e) => { e.stopPropagation(); enableAudio(); state.playing ? pause() : play(); wake(); });
    snd.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (!audio.enabled) { await enableAudio(); return; }
      audio.muted = !audio.muted;
      if (audio.muted) stopSession(); else if (state.playing) startSession(state.t);
      api.sound();
    });
    const seekTo = (clientX) => {
      const r = trk.getBoundingClientRect();
      seek(clamp01((clientX - r.left) / r.width) * END);
    };
    let drag = false;
    trk.addEventListener("pointerdown", (e) => { e.stopPropagation(); enableAudio(); drag = true; trk.setPointerCapture(e.pointerId); seekTo(e.clientX); });
    trk.addEventListener("pointermove", (e) => { if (drag) seekTo(e.clientX); });
    trk.addEventListener("pointerup", () => { drag = false; });
    trk.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { seek(state.t + 5); e.preventDefault(); }
      if (e.key === "ArrowLeft") { seek(state.t - 5); e.preventDefault(); }
    });
    // The first click anywhere turns the sound on; later clicks on the lesson pause and resume.
    document.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".fe-ui")) return;
      if (!audio.enabled) { enableAudio(); return; }
      state.playing ? pause() : play();
      wake();
    });
    document.addEventListener("keydown", (e) => {
      if (e.target.closest && e.target.closest(".fe-ccw")) return; // the subtitle menu handles its own keys
      if (e.key === " " || e.key === "k") { e.preventDefault(); enableAudio(); state.playing ? pause() : play(); wake(); }
      if ((e.key === "f" || e.key === "F") && fs.available()) { fs.toggle(); wake(); }
      if (e.key === "Escape" && fs.pseudo) fs.toggle();
    });
    const api = {
      update(t) {
        const done = !state.playing && t >= END - 0.01;
        pp.innerHTML = state.playing ? ICON.pause : done ? ICON.replay : ICON.play;
        pp.setAttribute("aria-label", state.playing ? "Pause" : done ? "Replay" : "Play");
        fill.style.width = ((t / END) * 100).toFixed(3) + "%";
        trk.setAttribute("aria-valuenow", String(Math.round(t)));
        time.textContent = fmt(t) + " / " + fmt(END);
        let text = "";
        if (ccLang !== "off") for (const l of lines) if (t >= l.t - 0.1 && t < l.t + l.d + 0.4) text = (ccLang === "ml" && l.ml) || l.text;
        if (text !== capText) {
          capText = text;
          cap.textContent = text;
          cap.hidden = !text;
          cap.lang = ccLang === "ml" ? "ml" : "en";
        }
        if (!state.playing) wake();
      },
      sound() {
        const on = audio.enabled && !audio.muted;
        snd.innerHTML = on ? ICON.on : ICON.off;
        snd.setAttribute("aria-label", on ? "Mute" : "Turn sound on");
        hint.hidden = audio.enabled;
      },
      cc() {
        if (!cc) return;
        const cur = CC_LANGS.find((l) => l.id === ccLang);
        cc.textContent = ccLang === "off" ? "CC" : cur.short;
        cc.classList.toggle("is-off", ccLang === "off");
        cc.setAttribute("aria-label", "Subtitles: " + cur.name);
        for (const b of ccMenu.children) b.setAttribute("aria-checked", String(b.dataset.lang === ccLang));
      },
      full() {
        if (!fsb) return;
        const on = fs.active();
        fsb.innerHTML = on ? ICON.exit : ICON.full;
        fsb.setAttribute("aria-label", on ? "Exit full screen" : "Full screen");
      },
    };
    api.sound();
    api.full();
    api.cc();
    wake();
    return api;
  })();

  // For tests and frame-by-frame capture: window.lessonPlayer.ready.then(() => { pause(); seek(12.5); }).
  let markReady;
  window.lessonPlayer = {
    duration: END,
    ready: new Promise((r) => { markReady = r; }),
    play, pause, seek,
    time: () => state.t,
    score: () => audio.score,
    // The audio graph, for level checks: music and effects reach `out`, the voice `voiceOut`.
    audioGraph: () => ({ ctx: audio.ctx, out: audio.out, voiceOut: audio.voiceOut }),
    voice: () => ({ lines, loaded: !!audio.voiceBuf, playing: !!(audio.session && audio.session.voice) }),
  };

  // ── Boot ───────────────────────────────────────────────────────────────────
  // Voice language: "en" (default) or "ml". Preference is remembered.
  let voiceLang = "en";
  try {
    const saved = localStorage.getItem("fe-voice-lang");
    if (saved === "ml" || saved === "en") voiceLang = saved;
  } catch (e) {}
  function voiceSrc() {
    if (!F.voice || !F.voice.src) return null;
    if (voiceLang === "ml") return F.voice.src.replace(/voice\.mp3$/, "voice-ml.mp3");
    return F.voice.src;
  }
  async function boot() {
    const src = voiceSrc();
    if (src) {
      audio.voiceData = fetch(src).then((r) => (r.ok ? r.arrayBuffer() : null)).catch(() => null);
    }
    try {
      await Promise.all(F.fontChecks.map((f) => document.fonts.load(f)));
    } catch (e) { /* system fonts stand in */ }
    run("shared.js", makeKit(stage, 0, OLD_END));
    for (const sc of scenes) {
      const box = el("div", { class: "fe-scene" });
      stage.append(box);
      const kit = makeKit(box, sc.oldStart, sc.oldDur);
      run("scene-" + sc.id + ".js", kit);
      const def = defs[sc.id];
      if (def && def.init) await def.init.call(def, kit);
      instances.push({ sc, def, box, kit });
    }
    if (modules["score.js"]) run("score.js", makeKit(stage, 0, OLD_END));
    audio.score = recordScore();
    // Wait (briefly) for the images so the first frames do not pop in.
    const imgs = Array.from(stage.querySelectorAll("img"));
    await Promise.race([
      Promise.all(imgs.map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; })))),
      new Promise((r) => setTimeout(r, 4000)),
    ]);
    instances.forEach((inst) => { inst.box.style.display = "none"; });
    renderAt(0);
    document.body.classList.add("fe-ready");
    // A parent page that allows autoplay (iframe allow="autoplay" after a click) gets sound
    // straight away; otherwise the first click turns it on.
    if (setupAudio() && audio.ctx.state === "running") { audio.enabled = true; ui.sound(); }
    play();
    requestAnimationFrame(tick);
    markReady();
  }
  boot().catch((e) => {
    document.querySelector(".fe-loading").textContent = "This lesson could not start. Please reload the page.";
    throw e;
  });
})();
