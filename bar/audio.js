/* Nadoo Bar Academy — self-made Web Audio lounge-jazz loop + SFX. No samples. */
'use strict';
var AUD = (function () {
  var ctx = null, master, music, sfx, comp, playing = false, muted = false, timer = null;
  var BPM = 96, beat = 60 / BPM, nextT = 0, step = 0, loop = 0;
  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function init() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    ctx = new AC();
    comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3;
    master = ctx.createGain(); master.gain.value = muted ? 0 : 0.9;
    music = ctx.createGain(); music.gain.value = 0.2;
    var warm = ctx.createBiquadFilter(); warm.type = 'lowpass'; warm.frequency.value = 5200;
    sfx = ctx.createGain(); sfx.gain.value = 0.55;
    music.connect(warm); warm.connect(comp); sfx.connect(comp); comp.connect(master); master.connect(ctx.destination);
    return ctx;
  }
  var noiseBuf = null;
  function noise() {
    if (noiseBuf) return noiseBuf;
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
    var d = noiseBuf.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return noiseBuf;
  }
  function env(g, t, a, peak, dec, sus, rel, dur) {
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak * sus), t + a + dec);
    g.gain.setValueAtTime(Math.max(0.0001, peak * sus), t + dur); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + rel);
  }
  /* ---- instruments ---- */
  function rhodes(m, t, dur, vel) {
    var f = mtof(m), o = ctx.createOscillator(), o2 = ctx.createOscillator(), mod = ctx.createOscillator(), mg = ctx.createGain(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = f; o2.type = 'sine'; o2.frequency.value = f * 2.001;
    mod.frequency.value = f * 7; mg.gain.setValueAtTime(f * 1.2, t); mg.gain.exponentialRampToValueAtTime(1, t + 0.25);
    mod.connect(mg); mg.connect(o.frequency);
    var g2 = ctx.createGain(); g2.gain.value = 0.18; o2.connect(g2); g2.connect(g);
    o.connect(g); env(g, t, 0.006, 0.07 * vel, 0.9, 0.35, 0.35, dur);
    g.connect(music); [o, o2, mod].forEach(function (x) { x.start(t); x.stop(t + dur + 0.5); });
  }
  function bass(m, t, dur) {
    var o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
    o.type = 'triangle'; o.frequency.value = mtof(m); lp.type = 'lowpass'; lp.frequency.value = 700;
    o.connect(lp); lp.connect(g); env(g, t, 0.01, 0.42, 0.2, 0.45, 0.08, dur * 0.85); g.connect(music);
    o.start(t); o.stop(t + dur + 0.2);
  }
  function vibe(m, t, dur, vel) {
    var o = ctx.createOscillator(), o3 = ctx.createOscillator(), g = ctx.createGain(), trem = ctx.createOscillator(), tg = ctx.createGain(), out = ctx.createGain();
    o.type = 'sine'; o.frequency.value = mtof(m); o3.type = 'sine'; o3.frequency.value = mtof(m) * 4;
    var g3 = ctx.createGain(); g3.gain.setValueAtTime(0.25, t); g3.gain.exponentialRampToValueAtTime(0.001, t + 0.15); o3.connect(g3); g3.connect(g);
    o.connect(g); trem.frequency.value = 5.2; tg.gain.value = 0.35; trem.connect(tg); tg.connect(out.gain); out.gain.value = 0.75;
    env(g, t, 0.004, 0.11 * (vel || 1), 1.4, 0.12, 0.4, dur); g.connect(out); out.connect(music);
    [o, o3, trem].forEach(function (x) { x.start(t); x.stop(t + dur + 0.8); });
  }
  function ride(t, v) {
    var s = ctx.createBufferSource(), hp = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noise(); hp.type = 'highpass'; hp.frequency.value = 7000; s.connect(hp); hp.connect(g);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.05 * v, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    g.connect(music); s.start(t, Math.random()); s.stop(t + 0.4);
  }
  function brush(t, len, v) {
    var s = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noise(); bp.type = 'bandpass'; bp.frequency.value = 2500; bp.Q.value = 0.6; s.connect(bp); bp.connect(g);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.035 * v, t + len * 0.4); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    g.connect(music); s.start(t, Math.random()); s.stop(t + len + 0.05);
  }
  function kick(t) {
    var o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2); o.connect(g); g.connect(music); o.start(t); o.stop(t + 0.25);
  }
  /* ---- song: 16 bars in F ---- */
  var Q = { M7: [4, 7, 11, 14], m7: [3, 7, 10, 14], d7: [4, 10, 14, 9] };
  var CH = [[41, 'M7'], [38, 'm7'], [43, 'm7'], [36, 'd7'], [41, 'M7'], [38, 'm7'], [43, 'm7'], [36, 'd7'],
            [45, 'm7'], [38, 'd7'], [43, 'm7'], [36, 'd7'], [41, 'M7'], [38, 'd7'], [43, 'm7', 36, 'd7'], [41, 'M7']];
  var MEL = [
    [[0, 72, 2], [2, 69, 1], [3, 72, 1], [4, 74, 3]], [[0, 72, 2], [2, 69, 2], [4, 65, 4]],
    [[0, 70, 1], [1, 69, 1], [2, 67, 2], [4, 65, 1], [5, 67, 3]], [[0, 64, 2], [2, 67, 2], [4, 70, 1], [5, 69, 3]],
    [[0, 72, 2], [2, 69, 1], [3, 72, 1], [4, 74, 3]], [[0, 72, 2], [2, 74, 1], [3, 77, 3], [6, 74, 2]],
    [[0, 72, 1], [1, 70, 1], [2, 69, 2], [4, 67, 2], [6, 70, 2]], [[0, 67, 2], [2, 64, 2], [4, 65, 4]],
    [[0, 76, 2], [2, 72, 1], [3, 76, 1], [4, 79, 4]], [[0, 78, 2], [2, 74, 2], [4, 72, 1], [5, 74, 3]],
    [[0, 70, 2], [2, 74, 2], [4, 77, 2], [6, 74, 2]], [[0, 76, 3], [3, 74, 1], [4, 72, 4]],
    [[0, 69, 2], [2, 72, 2], [4, 76, 4]], [[0, 78, 2], [2, 77, 1], [3, 74, 1], [4, 72, 4]],
    [[0, 70, 2], [2, 69, 2], [4, 67, 2], [6, 64, 2]], [[0, 65, 6]]
  ];
  function chordAt(bar, half) { var c = CH[bar]; return (half && c.length > 2) ? [c[2], c[3]] : [c[0], c[1]]; }
  function tones(root, q) { return Q[q].map(function (i) { var m = root + 24 + i; while (m > 67) m -= 12; while (m < 55) m += 12; return m; }); }
  function eighthTime(barStart, e) { var b = Math.floor(e / 2); return barStart + b * beat + (e % 2 ? beat * 0.64 : 0); }
  function scheduleBar(bar, t0) {
    var c1 = chordAt(bar, 0), c2 = chordAt(bar, 1), nb = CH[(bar + 1) % 16][0];
    /* walking bass */
    for (var b = 0; b < 4; b++) {
      var c = b < 2 ? c1 : c2, r = c[0], tn = Q[c[1]], n;
      if (b === 0) n = r; else if (b === 1) n = r + (tn[0] > 3 ? 4 : 3) + (Math.random() < .5 ? 3 : 0);
      else if (b === 2) n = (c2 !== c1 ? c2[0] : r + 7); else n = nb + (Math.random() < .5 ? 1 : -1);
      bass(n, t0 + b * beat, beat * 0.95);
    }
    /* rhodes comping: charleston-ish */
    var v1 = tones(c1[0], c1[1]), v2 = tones(c2[0], c2[1]);
    var hits = (bar % 2) ? [[0, v1, 1.3], [3, v1, 0.6], [5, v2, 0.9]] : [[0, v1, 1.1], [3, v2, 1.4]];
    hits.forEach(function (h) { h[1].forEach(function (m, i) { rhodes(m, eighthTime(t0, h[0]) + i * 0.008, h[2], 0.8); }); });
    /* drums */
    for (var k = 0; k < 4; k++) { ride(t0 + k * beat, k % 2 ? 1 : 0.8); if (k % 2) { ride(eighthTime(t0, k * 2 + 1), 0.55); brush(t0 + k * beat - 0.05, 0.3, 1); } }
    brush(t0, beat * 1.8, 0.5); if (bar % 4 === 0) kick(t0);
    /* melody: tune on even loops, sparse improv on odd */
    if (loop % 2 === 0) MEL[bar].forEach(function (n) { vibe(n[1], eighthTime(t0, n[0]), n[2] * beat * 0.5, 1); });
    else {
      var sc = [65, 67, 69, 72, 74, 77]; for (var e = 0; e < 8; e++) if (Math.random() < 0.28) vibe(sc[(Math.random() * sc.length) | 0] + (Math.random() < .3 ? 12 : 0) - 12 + 12, eighthTime(t0, e), beat * 0.6, 0.7);
    }
  }
  function tick() {
    if (!ctx) return;
    while (nextT < ctx.currentTime + 0.35) {
      scheduleBar(step, nextT); nextT += beat * 4; step++; if (step >= 16) { step = 0; loop++; }
    }
  }
  function startMusic() {
    if (!init() || playing) return; if (ctx.state === 'suspended') ctx.resume();
    playing = true; nextT = ctx.currentTime + 0.15; step = 0; timer = setInterval(tick, 60); tick();
  }
  function stopMusic() { playing = false; if (timer) clearInterval(timer); timer = null; }
  function setMute(m) { muted = m; if (master) master.gain.setTargetAtTime(m ? 0 : 0.9, ctx.currentTime, 0.05); }
  /* ---- SFX ---- */
  function clink(n) {
    if (!init()) return; var t = ctx.currentTime;
    for (var i = 0; i < (n || 3); i++) {
      var tt = t + i * (0.05 + Math.random() * 0.08), o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = 2400 + Math.random() * 2600; o.type = 'sine';
      g.gain.setValueAtTime(0.12, tt); g.gain.exponentialRampToValueAtTime(0.0001, tt + 0.12 + Math.random() * 0.1);
      o.connect(g); g.connect(sfx); o.start(tt); o.stop(tt + 0.3);
    }
  }
  var loopSrc = null, loopG = null;
  function startLoop(kind) {
    if (!init()) return; stopLoop(); var t = ctx.currentTime;
    var s = ctx.createBufferSource(); s.buffer = noise(); s.loop = true;
    var f = ctx.createBiquadFilter(), g = ctx.createGain();
    if (kind === 'pour') { f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 1.2; g.gain.value = 0.16;
      var lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 9; lg.gain.value = 300; lfo.connect(lg); lg.connect(f.frequency); lfo.start(t); s._lfo = lfo; }
    else if (kind === 'shake') { f.type = 'bandpass'; f.frequency.value = 3200; f.Q.value = 0.8; g.gain.value = 0;
      var l2 = ctx.createOscillator(), l2g = ctx.createGain(); l2.type = 'square'; l2.frequency.value = 7; l2g.gain.value = 0.12; l2.connect(l2g); l2g.connect(g.gain); l2.start(t); s._lfo = l2; }
    else if (kind === 'stir') { f.type = 'highpass'; f.frequency.value = 5000; g.gain.value = 0;
      var l3 = ctx.createOscillator(), l3g = ctx.createGain(); l3.frequency.value = 2.5; l3g.gain.value = 0.03; l3.connect(l3g); l3g.connect(g.gain); l3.start(t); s._lfo = l3; }
    else if (kind === 'blend') { f.type = 'lowpass'; f.frequency.value = 1400; g.gain.value = 0.12;
      var o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 95; var og = ctx.createGain(); og.gain.value = 0.05; o.connect(og); og.connect(sfx); o.start(t); s._osc = o; }
    s.connect(f); f.connect(g); g.connect(sfx); s.start(t); loopSrc = s; loopG = g;
  }
  function stopLoop() {
    if (!loopSrc) return; var t = ctx.currentTime;
    try { loopG.gain.cancelScheduledValues(t); loopG.gain.setTargetAtTime(0, t, 0.03); loopSrc.stop(t + 0.15); if (loopSrc._lfo) loopSrc._lfo.stop(t + 0.15); if (loopSrc._osc) loopSrc._osc.stop(t + 0.05); } catch (e) {}
    loopSrc = null;
  }
  function tone(seq, type, vol) {
    if (!init()) return; var t = ctx.currentTime;
    seq.forEach(function (n) {
      var o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter(); o.type = type || 'triangle';
      o.frequency.value = mtof(n[0]); lp.type = 'lowpass'; lp.frequency.value = 3000; o.connect(lp); lp.connect(g); g.connect(sfx);
      var tt = t + n[1]; env(g, tt, 0.01, vol || 0.12, 0.15, 0.4, 0.2, n[2] || 0.2); o.start(tt); o.stop(tt + (n[2] || 0.2) + 0.5);
    });
  }
  return {
    init: init, startMusic: startMusic, stopMusic: stopMusic, setMute: setMute, isPlaying: function () { return playing; },
    clink: clink, startLoop: startLoop, stopLoop: stopLoop,
    tap: function () { tone([[84, 0, 0.04]], 'sine', 0.05); },
    good: function () { tone([[76, 0, .12], [83, .1, .25]], 'sine', 0.1); },
    bad: function () { tone([[52, 0, .18], [49, .14, .25]], 'triangle', 0.08); },
    dash: function () { tone([[90, 0, .03]], 'sine', 0.04); },
    fizz: function () { if (!init()) return; var t = ctx.currentTime, s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = noise(); f.type = 'highpass'; f.frequency.value = 6000; g.gain.setValueAtTime(0.06, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2); s.connect(f); f.connect(g); g.connect(sfx); s.start(t); s.stop(t + 1.3); },
    fanfare: function () { tone([[65, 0, .15], [69, .12, .15], [72, .24, .15], [77, .38, .5], [81, .38, .5], [72, .38, .5]], 'sawtooth', 0.06); },
    cash: function () { tone([[88, 0, .08], [93, .08, .4]], 'sine', 0.09); clink(2); }
  };
})();
