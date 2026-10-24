/* 나두 와이너리 & 위스키 증류소 — soft lounge BGM + cellar SFX (Web Audio) */
var AUD = (function () {
  'use strict';
  var ctx = null, master = null, music = null, sfx = null, timer = null, nextT = 0, step = 0, muted = false, playing = false;
  var beat = 60 / 72;
  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    var A = window.AudioContext || window.webkitAudioContext; if (!A) return;
    ctx = new A(); master = ctx.createGain(); master.gain.value = muted ? 0 : 0.8; master.connect(ctx.destination);
    music = ctx.createGain(); music.gain.value = 0.18; music.connect(master);
    sfx = ctx.createGain(); sfx.gain.value = 0.6; sfx.connect(master);
  }
  function mf(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function tone(notes, type, vol, dest) {
    if (!ctx) return; var t0 = ctx.currentTime;
    notes.forEach(function (n) {
      var o = ctx.createOscillator(), g = ctx.createGain(), t = t0 + n[1];
      o.type = type || 'sine'; o.frequency.value = mf(n[0]);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol || 0.1, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + n[2]);
      o.connect(g); g.connect(dest || sfx); o.start(t); o.stop(t + n[2] + 0.05);
    });
  }
  var prog = [[50, 57, 60, 65], [55, 59, 62, 65], [48, 55, 59, 64], [45, 52, 55, 60]];
  function sched() {
    while (nextT < ctx.currentTime + 0.3) {
      var ch = prog[Math.floor(step / 8) % 4], i = step % 8, t = nextT;
      if (i === 0) ch.forEach(function (m) { var o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'triangle'; o.frequency.value = mf(m); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.05, t + 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t + beat * 8); o.connect(g); g.connect(music); o.start(t); o.stop(t + beat * 8); });
      if (i % 2 === 0) { var o2 = ctx.createOscillator(), g2 = ctx.createGain(); o2.type = 'sine'; o2.frequency.value = mf(ch[0] - 12 + (i === 4 ? 7 : 0)); g2.gain.setValueAtTime(0.12, t); g2.gain.exponentialRampToValueAtTime(0.0001, t + beat * 0.9); o2.connect(g2); g2.connect(music); o2.start(t); o2.stop(t + beat); }
      if (i === 3 || i === 6) { var o3 = ctx.createOscillator(), g3 = ctx.createGain(); o3.type = 'sine'; o3.frequency.value = mf(ch[2 + (i % 2)] + 12); g3.gain.setValueAtTime(0.04, t); g3.gain.exponentialRampToValueAtTime(0.0001, t + 0.6); o3.connect(g3); g3.connect(music); o3.start(t); o3.stop(t + 0.7); }
      nextT += beat / 2; step++;
    }
  }
  function startMusic() { init(); if (!ctx || playing) return; playing = true; nextT = ctx.currentTime + 0.1; timer = setInterval(sched, 100); }
  function stopMusic() { playing = false; clearInterval(timer); }
  function setMute(m) { muted = m; if (master && ctx) master.gain.setTargetAtTime(m ? 0 : 0.8, ctx.currentTime, 0.05); }
  function pour() {
    if (!ctx) return; var t = ctx.currentTime, n = ctx.createBufferSource(), b = ctx.createBuffer(1, ctx.sampleRate * 0.6, ctx.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.5;
    var f = ctx.createBiquadFilter(), g = ctx.createGain(); f.type = 'bandpass'; f.frequency.setValueAtTime(600, t); f.frequency.linearRampToValueAtTime(1400, t + 0.6); f.Q.value = 3;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.25, t + 0.05); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    n.buffer = b; n.connect(f); f.connect(g); g.connect(sfx); n.start(t);
  }
  return {
    init: init, startMusic: startMusic, stopMusic: stopMusic, setMute: setMute, pour: pour,
    tap: function () { tone([[84, 0, 0.05]], 'sine', 0.05); },
    wrench: function () { tone([[93, 0, 0.5], [100, 0.01, 0.4]], 'sine', 0.06); },
    vroom: pour,
    good: function () { tone([[72, 0, .12], [76, .08, .14], [79, .16, .3]], 'triangle', 0.1); },
    bad: function () { tone([[55, 0, .18], [50, .12, .25]], 'triangle', 0.08); },
    fanfare: function () { tone([[67, 0, .2], [72, .12, .2], [76, .24, .25], [79, .36, .6], [84, .36, .6]], 'triangle', 0.08); }
  };
})();
