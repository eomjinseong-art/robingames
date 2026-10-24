/* Nadoo F1 Pit Wall — Self-made Web Audio synthwave race pulse + Pit Wall SFX. */
(function (root) {
  'use strict';
  var MUTE_KEY = 'nadoo_f1_mute_v1';
  var ctx = null, master = null, music = null, sfx = null;
  var playing = false, muted = false, timer = null, step = 0;
  try { muted = localStorage.getItem(MUTE_KEY) === '1'; } catch (e) {}

  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  function init() {
    try {
      if (ctx) {
        if (ctx.state === 'suspended' && ctx.resume) {
          var p = ctx.resume();
          if (p && p.catch) p.catch(function () {});
        }
        return ctx;
      }
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.85;
      music = ctx.createGain();
      music.gain.value = 0.16;
      sfx = ctx.createGain();
      sfx.gain.value = 0.45;
      music.connect(master);
      sfx.connect(master);
      master.connect(ctx.destination);
      return ctx;
    } catch (e) {
      return null;
    }
  }

  function tone(freq, dur, type, vol, dest, slideTo) {
    try {
      if (muted || !init()) return;
      var t = ctx.currentTime;
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.type = type || 'sawtooth';
      o.frequency.setValueAtTime(freq, t);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vol || 0.12, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g);
      g.connect(dest || sfx);
      o.start(t);
      o.stop(t + dur + 0.02);
    } catch (e) {}
  }

  var BASS = [40, 40, 52, 40, 43, 43, 55, 43, 45, 45, 57, 45, 38, 38, 50, 47];
  var ARP  = [64, 67, 71, 76, 67, 71, 74, 79, 69, 72, 76, 81, 66, 69, 74, 78];

  function tick() {
    try {
      if (!playing || muted || !init()) return;
      var bNote = BASS[step % BASS.length];
      var aNote = ARP[step % ARP.length];
      tone(mtof(bNote), 0.19, 'sawtooth', 0.11, music);
      if (step % 2 === 0) tone(mtof(aNote), 0.14, 'triangle', 0.07, music);
      if (step % 4 === 0) tone(110, 0.09, 'sine', 0.16, music, 38);
      step++;
    } catch (e) {}
  }

  function startBgm() {
    try {
      init();
      if (playing) return;
      playing = true;
      if (timer) clearInterval(timer);
      timer = setInterval(tick, 220);
    } catch (e) {}
  }

  function stopBgm() {
    playing = false;
    if (timer) { clearInterval(timer); timer = null; }
  }

  function setMuted(m) {
    muted = !!m;
    try { localStorage.setItem(MUTE_KEY, muted ? '1' : '0'); } catch (e) {}
    try {
      if (master && ctx) master.gain.setValueAtTime(muted ? 0 : 0.85, ctx.currentTime);
      if (!muted && !playing) startBgm();
    } catch (e) {}
    return muted;
  }

  function toggleMute() { return setMuted(!muted); }
  function isMuted() { return muted; }

  /* Pit Wall SFX */
  function radioBeep() {
    tone(1180, 0.07, 'sine', 0.18, sfx);
    setTimeout(function () { tone(1560, 0.09, 'sine', 0.18, sfx); }, 75);
  }
  function pitGun() {
    for (var i = 0; i < 4; i++) {
      (function (k) {
        setTimeout(function () { tone(320 + k * 90, 0.06, 'sawtooth', 0.16, sfx, 680); }, k * 65);
      })(i);
    }
  }
  function drsOpen() {
    tone(340, 0.28, 'triangle', 0.2, sfx, 920);
  }
  function passWhoosh() {
    tone(740, 0.32, 'sawtooth', 0.16, sfx, 220);
  }
  function okChime() {
    tone(523.25, 0.11, 'triangle', 0.22, sfx);
    setTimeout(function () { tone(659.25, 0.12, 'triangle', 0.22, sfx); }, 90);
    setTimeout(function () { tone(783.99, 0.2, 'triangle', 0.24, sfx); }, 180);
  }
  function badBuzz() {
    tone(210, 0.16, 'sawtooth', 0.2, sfx, 145);
    setTimeout(function () { tone(165, 0.22, 'sawtooth', 0.2, sfx, 120); }, 130);
  }
  function fanfare() {
    var notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach(function (f, idx) {
      setTimeout(function () { tone(f, idx === 3 ? 0.35 : 0.13, 'triangle', 0.24, sfx); }, idx * 105);
    });
  }

  root.F1Audio = {
    init: init, startBgm: startBgm, stopBgm: stopBgm,
    toggleMute: toggleMute, isMuted: isMuted, setMuted: setMuted,
    radioBeep: radioBeep, pitGun: pitGun, drsOpen: drsOpen,
    passWhoosh: passWhoosh, okChime: okChime, badBuzz: badBuzz, fanfare: fanfare
  };
})(window);
