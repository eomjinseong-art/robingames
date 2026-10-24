/* 나두 모터스 공방 / Nadoo Garage Lab — Web Audio synthwave BGM + garage SFX */
var AUD = (function () {
  'use strict';
  var ctx = null, master = null, music = null, sfx = null;
  var playing = false, muted = false, timer = null, nextT = 0, step = 0, loop = 0;
  var BPM = 96, beat = 60 / BPM, noiseBuf = null;

  function init() {
    if (ctx) return true;
    var A = window.AudioContext || window.webkitAudioContext;
    if (!A) return false;
    ctx = new A();
    master = ctx.createGain(); master.gain.value = muted ? 0 : 0.85;
    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16; comp.ratio.value = 3;
    master.connect(comp); comp.connect(ctx.destination);
    music = ctx.createGain(); music.gain.value = 0.24; music.connect(master);
    sfx = ctx.createGain(); sfx.gain.value = 0.65; sfx.connect(master);
    return true;
  }
  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function noise() {
    if (noiseBuf) return noiseBuf;
    var len = ctx.sampleRate * 2; noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = noiseBuf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return noiseBuf;
  }
  function env(g, t, a, pk, d, s, r, dur) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(pk, t + a);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, pk * s), t + a + d);
    g.gain.setValueAtTime(Math.max(0.0002, pk * s), t + dur);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur + r);
  }
  function synthBass(m, t, dur) {
    var o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
    o.type = 'sawtooth'; o.frequency.value = mtof(m);
    lp.type = 'lowpass'; lp.frequency.setValueAtTime(900, t); lp.frequency.exponentialRampToValueAtTime(240, t + dur);
    o.connect(lp); lp.connect(g);
    env(g, t, 0.008, 0.34, 0.12, 0.35, 0.06, dur * 0.85);
    g.connect(music); o.start(t); o.stop(t + dur + 0.15);
  }
  function pad(m, t, dur, vel) {
    var o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
    o.type = 'triangle'; o2.type = 'sine';
    o.frequency.value = mtof(m); o2.frequency.value = mtof(m) * 1.003;
    lp.type = 'lowpass'; lp.frequency.value = 1800;
    o.connect(lp); o2.connect(lp); lp.connect(g);
    env(g, t, 0.03, 0.09 * (vel || 1), 0.3, 0.55, 0.35, dur);
    g.connect(music); o.start(t); o2.start(t); o.stop(t + dur + 0.45); o2.stop(t + dur + 0.45);
  }
  function lead(m, t, dur, vel) {
    var o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
    o.type = 'square'; o.frequency.value = mtof(m);
    lp.type = 'lowpass'; lp.frequency.value = 2400;
    o.connect(lp); lp.connect(g);
    env(g, t, 0.006, 0.08 * (vel || 1), 0.15, 0.3, 0.2, dur);
    g.connect(music); o.start(t); o.stop(t + dur + 0.3);
  }
  function hat(t, v) {
    var s = ctx.createBufferSource(), hp = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noise(); hp.type = 'highpass'; hp.frequency.value = 6800;
    s.connect(hp); hp.connect(g);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.045 * v, t + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    g.connect(music); s.start(t, Math.random()); s.stop(t + 0.12);
  }
  function kick(t) {
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(125, t); o.frequency.exponentialRampToValueAtTime(44, t + 0.12);
    g.gain.setValueAtTime(0.22, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    o.connect(g); g.connect(music); o.start(t); o.stop(t + 0.26);
  }
  function snare(t) {
    var s = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noise(); bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = 0.8;
    s.connect(bp); bp.connect(g);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.09, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    g.connect(music); s.start(t, Math.random()); s.stop(t + 0.2);
  }
  var CH = [
    [45, [57, 60, 64, 67]], [41, [53, 57, 60, 64]], [48, [60, 64, 67, 71]], [43, [55, 59, 62, 67]],
    [45, [57, 60, 64, 67]], [41, [53, 57, 60, 64]], [38, [50, 53, 57, 60]], [40, [52, 56, 59, 64]]
  ];
  var MEL = [
    [[0, 69, 1.5], [1.5, 72, 1.5], [3, 76, 1]],
    [[0, 76, 1.5], [1.5, 72, 1.5], [3, 69, 1]],
    [[0, 67, 1.5], [1.5, 72, 1.5], [3, 74, 1]],
    [[0, 74, 2], [2, 71, 2]],
    [[0, 69, 1], [1, 72, 1], [2, 76, 1], [3, 79, 1]],
    [[0, 77, 1.5], [1.5, 76, 1.5], [3, 72, 1]],
    [[0, 74, 1.5], [1.5, 69, 1.5], [3, 65, 1]],
    [[0, 64, 3]]
  ];
  function scheduleBar(bar, t0) {
    var c = CH[bar % CH.length], root = c[0], chord = c[1];
    chord.forEach(function (m, i) { pad(m, t0 + i * 0.01, beat * 3.6, 0.85); });
    for (var e = 0; e < 8; e++) {
      var et = t0 + e * (beat * 0.5);
      var bn = (e % 2 === 0) ? root : root + 12;
      if (e === 7) bn = root + 7;
      synthBass(bn, et, beat * 0.44);
      hat(et, e % 2 === 0 ? 0.9 : 0.55);
    }
    kick(t0); kick(t0 + beat * 2);
    snare(t0 + beat); snare(t0 + beat * 3);
    if (loop % 2 === 0) {
      MEL[bar % MEL.length].forEach(function (n) { lead(n[1], t0 + n[0] * beat, n[2] * beat * 0.85, 0.9); });
    } else {
      var sc = [69, 71, 72, 74, 76, 79];
      for (var k = 0; k < 4; k++) if (Math.random() < 0.55) lead(sc[(Math.random() * sc.length) | 0], t0 + k * beat, beat * 0.7, 0.75);
    }
  }
  function tick() {
    if (!ctx) return;
    while (nextT < ctx.currentTime + 0.35) {
      scheduleBar(step, nextT); nextT += beat * 4; step++;
      if (step >= 8) { step = 0; loop++; }
    }
  }
  function startMusic() {
    if (!init() || playing) return;
    if (ctx.state === 'suspended') ctx.resume();
    playing = true; nextT = ctx.currentTime + 0.12; step = 0; timer = setInterval(tick, 70); tick();
  }
  function stopMusic() { playing = false; if (timer) clearInterval(timer); timer = null; }
  function setMute(m) { muted = m; if (master && ctx) master.gain.setTargetAtTime(m ? 0 : 0.85, ctx.currentTime, 0.05); }
  function tone(seq, type, vol) {
    if (!init()) return; var t = ctx.currentTime;
    seq.forEach(function (n) {
      var o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
      o.type = type || 'triangle'; o.frequency.value = mtof(n[0]);
      lp.type = 'lowpass'; lp.frequency.value = 3200;
      o.connect(lp); lp.connect(g); g.connect(sfx);
      var tt = t + n[1]; env(g, tt, 0.008, vol || 0.13, 0.14, 0.4, 0.18, n[2] || 0.18);
      o.start(tt); o.stop(tt + (n[2] || 0.18) + 0.35);
    });
  }
  function ratchet() {
    if (!init()) return; var t = ctx.currentTime;
    for (var i = 0; i < 4; i++) {
      var tt = t + i * 0.045, o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'square'; o.frequency.value = 1100 + i * 180;
      g.gain.setValueAtTime(0.09, tt); g.gain.exponentialRampToValueAtTime(0.0001, tt + 0.035);
      o.connect(g); g.connect(sfx); o.start(tt); o.stop(tt + 0.04);
    }
  }
  function vroom(rpm) {
    if (!init()) return; var t = ctx.currentTime;
    var o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
    var f0 = 55 + ((rpm || 1500) / 6000) * 140;
    o.type = 'sawtooth'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * 1.45, t + 0.18);
    o.frequency.exponentialRampToValueAtTime(f0 * 0.95, t + 0.42);
    lp.type = 'lowpass'; lp.frequency.value = 520;
    g.gain.setValueAtTime(0.001, t); g.gain.linearRampToValueAtTime(0.16, t + 0.04); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
    o.connect(lp); lp.connect(g); g.connect(sfx); o.start(t); o.stop(t + 0.48);
  }
  return {
    init: init, startMusic: startMusic, stopMusic: stopMusic, setMute: setMute,
    tap: function () { tone([[81, 0, 0.04]], 'sine', 0.06); },
    wrench: ratchet,
    vroom: vroom,
    good: function () { tone([[72, 0, .1], [76, .08, .12], [81, .16, .24]], 'triangle', 0.12); },
    bad: function () { tone([[53, 0, .16], [48, .12, .22]], 'sawtooth', 0.08); },
    fanfare: function () { tone([[64, 0, .12], [69, .1, .12], [73, .2, .14], [76, .32, .45], [81, .32, .45]], 'sawtooth', 0.08); }
  };
})();
