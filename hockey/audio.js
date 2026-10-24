/* Nadoo Touchdown 101 — Procedural Web Audio Stadium Brass & Drumline BGM + SFX */
'use strict';
var HK_AUDIO = (function () {
  var ctx = null, master = null, musicGain = null, sfxGain = null;
  var playing = false, muted = false, timer = null, step = 0, nextT = 0;
  var BPM = 116, stepDur = (60 / BPM) / 2; // 8th-note steps

  try {
    muted = localStorage.getItem('nadoo_fb_mute') === '1';
  } catch (e) {}

  function mtof(m) {
    return 440 * Math.pow(2, (m - 69) / 12);
  }

  function init() {
    if (ctx) {
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.85;
    musicGain = ctx.createGain();
    musicGain.gain.value = 0.22;
    sfxGain = ctx.createGain();
    sfxGain.gain.value = 0.65;
    musicGain.connect(master);
    sfxGain.connect(master);
    master.connect(ctx.destination);
    return ctx;
  }

  var noiseBuf = null;
  function getNoise() {
    if (!ctx) return null;
    if (noiseBuf) return noiseBuf;
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 1.2, ctx.sampleRate);
    var d = noiseBuf.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return noiseBuf;
  }

  function brassNote(midi, t, dur, vel) {
    if (!ctx || !midi) return;
    var f = mtof(midi);
    var o1 = ctx.createOscillator(), o2 = ctx.createOscillator();
    var lp = ctx.createBiquadFilter(), g = ctx.createGain();
    o1.type = 'sawtooth';
    o2.type = 'square';
    o1.frequency.setValueAtTime(f, t);
    o2.frequency.setValueAtTime(f * 1.003, t);
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(900, t);
    lp.frequency.linearRampToValueAtTime(2400, t + 0.04);
    lp.frequency.exponentialRampToValueAtTime(1300, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime((vel || 0.14), t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.04);
    o1.connect(lp);
    o2.connect(lp);
    lp.connect(g);
    g.connect(musicGain);
    o1.start(t);
    o2.start(t);
    o1.stop(t + dur + 0.05);
    o2.stop(t + dur + 0.05);
  }

  function bassNote(midi, t, dur) {
    if (!ctx || !midi) return;
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(mtof(midi), t);
    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(0.28, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    g.connect(musicGain);
    o.start(t);
    o.stop(t + dur + 0.03);
  }

  function kickDrum(t) {
    if (!ctx) return;
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(130, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
    g.gain.setValueAtTime(0.38, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    o.connect(g);
    g.connect(musicGain);
    o.start(t);
    o.stop(t + 0.18);
  }

  function snareDrum(t, accent) {
    if (!ctx) return;
    var s = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = getNoise();
    bp.type = 'bandpass';
    bp.frequency.value = 1800;
    g.gain.setValueAtTime(accent ? 0.18 : 0.09, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
    s.connect(bp);
    bp.connect(g);
    g.connect(musicGain);
    s.start(t);
    s.stop(t + 0.12);
  }

  // Catchy stadium fight-song melody (32 steps)
  var MEL = [
    60, 0, 64, 67, 72, 0, 71, 67,
    69, 0, 67, 64, 67, 0, 0, 0,
    62, 0, 65, 69, 74, 0, 72, 69,
    67, 0, 64, 62, 60, 0, 67, 0
  ];
  var BAS = [
    36, 36, 43, 43, 45, 45, 43, 43,
    38, 38, 41, 41, 43, 43, 36, 43
  ];

  function schedule() {
    if (!ctx || !playing) return;
    if (nextT < ctx.currentTime) nextT = ctx.currentTime + 0.02;
    while (nextT < ctx.currentTime + 0.25) {
      var idx = step % 32;
      var m = MEL[idx];
      if (m) brassNote(m, nextT, stepDur * 1.4, 0.12);
      if (idx % 2 === 0) bassNote(BAS[(idx >> 1) % 16], nextT, stepDur * 1.7);
      if (idx % 4 === 0) kickDrum(nextT);
      if (idx % 4 === 2) snareDrum(nextT, true);
      else if (idx % 2 === 1 && (idx % 8 === 7)) snareDrum(nextT, false);
      nextT += stepDur;
      step++;
    }
  }

  function startBgm() {
    init();
    if (!ctx) return;
    if (!playing) {
      playing = true;
      nextT = ctx.currentTime + 0.04;
      if (!timer) timer = setInterval(schedule, 60);
    }
  }

  function toggleMute() {
    init();
    muted = !muted;
    try {
      localStorage.setItem('nadoo_fb_mute', muted ? '1' : '0');
    } catch (e) {}
    if (master && ctx) master.gain.setValueAtTime(muted ? 0 : 0.85, ctx.currentTime);
    return muted;
  }

  function isMuted() {
    return muted;
  }

  function sfx(type) {
    init();
    if (!ctx || muted) return;
    var t = ctx.currentTime;
    if (type === 'tap') {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(620, t);
      o.frequency.exponentialRampToValueAtTime(880, t + 0.05);
      g.gain.setValueAtTime(0.15, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      o.connect(g); g.connect(sfxGain);
      o.start(t); o.stop(t + 0.07);
    } else if (type === 'whistle') {
      var w = ctx.createOscillator(), lfo = ctx.createOscillator(), lg = ctx.createGain(), wg = ctx.createGain();
      w.type = 'sine';
      w.frequency.setValueAtTime(2750, t);
      lfo.frequency.value = 38;
      lg.gain.value = 95;
      lfo.connect(lg); lg.connect(w.frequency);
      wg.gain.setValueAtTime(0.001, t);
      wg.gain.linearRampToValueAtTime(0.22, t + 0.02);
      wg.gain.setValueAtTime(0.22, t + 0.22);
      wg.gain.exponentialRampToValueAtTime(0.001, t + 0.30);
      w.connect(wg); wg.connect(sfxGain);
      w.start(t); lfo.start(t);
      w.stop(t + 0.32); lfo.stop(t + 0.32);
    } else if (type === 'hut') {
      var h = ctx.createOscillator(), hg = ctx.createGain();
      h.type = 'sawtooth';
      h.frequency.setValueAtTime(210, t);
      h.frequency.exponentialRampToValueAtTime(145, t + 0.12);
      hg.gain.setValueAtTime(0.22, t);
      hg.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      h.connect(hg); hg.connect(sfxGain);
      h.start(t); h.stop(t + 0.15);
    } else if (type === 'throw') {
      var th = ctx.createOscillator(), tg = ctx.createGain();
      th.type = 'triangle';
      th.frequency.setValueAtTime(340, t);
      th.frequency.exponentialRampToValueAtTime(760, t + 0.16);
      tg.gain.setValueAtTime(0.18, t);
      tg.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      th.connect(tg); tg.connect(sfxGain);
      th.start(t); th.stop(t + 0.19);
    } else if (type === 'kick') {
      var k = ctx.createOscillator(), kg = ctx.createGain();
      k.type = 'sine';
      k.frequency.setValueAtTime(190, t);
      k.frequency.exponentialRampToValueAtTime(52, t + 0.18);
      kg.gain.setValueAtTime(0.38, t);
      kg.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      k.connect(kg); kg.connect(sfxGain);
      k.start(t); k.stop(t + 0.24);
    } else if (type === 'firstdown') {
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
        var o2 = ctx.createOscillator(), g2 = ctx.createGain();
        o2.type = 'triangle';
        o2.frequency.value = f;
        g2.gain.setValueAtTime(0.2, t + i * 0.065);
        g2.gain.exponentialRampToValueAtTime(0.001, t + i * 0.065 + 0.2);
        o2.connect(g2); g2.connect(sfxGain);
        o2.start(t + i * 0.065);
        o2.stop(t + i * 0.065 + 0.22);
      });
    } else if (type === 'touchdown') {
      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach(function (f, i) {
        var o3 = ctx.createOscillator(), g3 = ctx.createGain();
        o3.type = 'sawtooth';
        o3.frequency.value = f;
        g3.gain.setValueAtTime(0.18, t + i * 0.075);
        g3.gain.exponentialRampToValueAtTime(0.001, t + i * 0.075 + 0.28);
        o3.connect(g3); g3.connect(sfxGain);
        o3.start(t + i * 0.075);
        o3.stop(t + i * 0.075 + 0.3);
      });
    } else if (type === 'bad') {
      var b = ctx.createOscillator(), bg = ctx.createGain();
      b.type = 'sawtooth';
      b.frequency.setValueAtTime(175, t);
      b.frequency.linearRampToValueAtTime(115, t + 0.24);
      bg.gain.setValueAtTime(0.22, t);
      bg.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      b.connect(bg); bg.connect(sfxGain);
      b.start(t); b.stop(t + 0.3);
    }
  }

  return {
    startBgm: startBgm,
    toggleMute: toggleMute,
    isMuted: isMuted,
    sfx: sfx
  };
})();
