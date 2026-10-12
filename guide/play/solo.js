/* 나두 1인 카드게임 틀 (클론다이크·프리셀): 탭 이동, 자동 올리기, 되돌리기, 시간·이동 수, 최고 기록, 새 게임/다시 시작,
 * 한/영, Web Audio BGM + 음소거, 홈·규칙 버튼, Space/Enter/탭 = 바로 다시 (ms 가드). */
(function () {
  'use strict';
  var LANG_KEY = 'nadoo_lang', MUTE_KEY = 'nadoo_cards_mute', lang = 'ko';
  try { lang = localStorage.getItem(LANG_KEY) || ((navigator.language || 'ko').toLowerCase().indexOf('ko') === 0 ? 'ko' : 'en'); } catch (e) {}
  if (lang !== 'ko' && lang !== 'en') lang = 'ko';
  function L(v) { return Array.isArray(v) ? v[lang === 'ko' ? 0 : 1] : v; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var SYM = { S: '♠', H: '♥', D: '♦', C: '♣' };
  function card(c, o) { // c = {r:1..13, s:'S'}
    o = o || {}; var st = 'top:' + (o.top || 0) + 'px', at = o.act ? ' data-a="' + o.act + '"' : '';
    if (!o.up) return '<div class="sc down" style="' + st + '"' + at + '></div>';
    var red = c.s === 'H' || c.s === 'D', r = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'][c.r];
    return '<div class="sc' + (red ? ' red' : '') + (o.hint ? ' hint' : '') + '" style="' + st + '"' + at + '><span class="r">' + r + '</span><span class="s">' + SYM[c.s] + '</span><span class="m">' + SYM[c.s] + '</span></div>';
  }
  var ac = null, gain = null, muted = false, step = 0, nextT = 0, melody = null;
  try { muted = localStorage.getItem(MUTE_KEY) === '1'; } catch (e) {}
  function hz(n) { return 440 * Math.pow(2, (n - 69) / 12); }
  function tone(n, at, dur, type, vol) { var o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.value = hz(n); g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(vol, at + 0.01); g.gain.exponentialRampToValueAtTime(0.0008, at + dur); o.connect(g); g.connect(gain); o.start(at); o.stop(at + dur + 0.02); }
  function audioOn() {
    if (!ac) {
      var A = window.AudioContext || window.webkitAudioContext; if (!A) return;
      ac = new A(); gain = ac.createGain(); gain.gain.value = muted ? 0 : 0.5; gain.connect(ac.destination); nextT = ac.currentTime + 0.05;
      setInterval(function () { while (nextT < ac.currentTime + 0.3) { var m = melody[step % melody.length], bass = [45, 41, 43, 48][Math.floor(step / 8) % 4]; if (m) tone(m, nextT, 0.28, 'triangle', 0.06); if (step % 2 === 0) tone(bass, nextT, 0.4, 'sine', 0.1); if (step % 4 === 3) tone(88, nextT, 0.02, 'square', 0.01); step++; nextT += 0.28; } }, 100);
    }
    if (ac.state === 'suspended') ac.resume();
  }
  function sfx(n) { if (ac && !muted) tone(n, ac.currentTime, 0.1, 'sine', 0.12); }

  function start(S) {
    melody = S.bgm; var app = document.getElementById('app'), BKEY = 'nadoo_sol_' + S.id + '_best';
    var s, init, undo = [], moves = 0, t0 = 0, el = 0, won = false, ended = 0, rulesOpen = false, tick = null;
    function best() { try { return JSON.parse(localStorage.getItem(BKEY) || 'null'); } catch (e) { return null; } }
    function fmt(ms) { var x = Math.floor(ms / 1000); return Math.floor(x / 60) + ':' + ('0' + x % 60).slice(-2); }
    function now() { return t0 ? (won ? el : Date.now() - t0) : 0; }
    function newDeal(same) { s = same ? JSON.parse(init) : S.deal(); init = JSON.stringify(s); undo = []; moves = 0; t0 = 0; el = 0; won = false; ended = 0; auto(); draw(); }
    function auto() { var g = 0; while (S.autoStep(s) && g++ < 60) {} }
    function draw() {
      var b = best(), h = '<div class="so-bar"><a class="so-b" href="/guide/">' + L(['🏠 홈', '🏠 Home']) + '</a><button class="so-b" data-k="rules">' + L(['📖 규칙', '📖 Rules']) + '</button><button class="so-b" data-k="lang">' + (lang === 'ko' ? 'EN' : '한') + '</button><button class="so-b" data-k="mute">' + (muted ? '🔇' : '🔊') + '</button></div>';
      if (rulesOpen) { app.innerHTML = h + '<div class="so-rp"><h2>' + L(S.title) + '</h2><p>' + esc(L(S.rules)) + '</p><p><a class="so-b" href="/guide/game.html?id=' + S.id + '">' + L(['📚 자세한 가이드', '📚 Full guide']) + '</a></p><button class="so-go" data-k="rules">' + L(['닫기', 'Close']) + '</button></div>'; return; }
      h += '<div class="so-info"><span class="so-pill">' + S.emoji + ' ' + esc(L(S.title)) + (S.label ? ' ' + esc(S.label(s, L)) : '') + '</span><span class="so-pill">⏱ <span id="so-t">' + fmt(now()) + '</span></span><span class="so-pill">👣 ' + moves + '</span><span class="so-pill">🏆 ' + (b ? fmt(b.t) + ' · ' + b.m : '—') + '</span></div>';
      h += '<div class="so-bar"><button class="so-b y" data-k="undo"' + (undo.length && !won ? '' : ' disabled') + '>↩️ ' + L(['되돌리기', 'Undo']) + '</button><button class="so-b" data-k="restart">🔁 ' + L(['다시 시작', 'Restart']) + '</button><button class="so-b" data-k="new">🆕 ' + L(['새 게임', 'New deal']) + '</button></div>';
      h += '<div id="so-board">' + S.render(s, { card: card, L: L }) + '</div><p class="so-lbl">' + L(['카드를 탭하면 갈 수 있는 곳으로 자동으로 옮겨져요', 'Tap a card and it moves to the best legal spot']) + '</p>';
      if (won) h += '<div class="so-end" data-k="again"><div><b>' + L(['🎉 완성!', '🎉 Solved!']) + '</b><p>⏱ ' + fmt(el) + ' · 👣 ' + moves + (b && b.t === el && b.m === moves ? ' · ' + L(['🏆 새 최고 기록!', '🏆 New best!']) : '') + '</p><p class="so-tap">🔄 ' + L(['Space · Enter · 탭 = 바로 새 게임', 'Space · Enter · tap = new deal']) + '</p></div></div>';
      app.innerHTML = h;
    }
    function tap(a) {
      if (won || rulesOpen) return;
      var snap = JSON.stringify(s);
      if (!S.tap(s, a)) { sfx(50); var e = app.querySelector('[data-a="' + a + '"]'); if (e) { e.classList.add('so-shake'); } return; }
      auto(); if (JSON.stringify(s) === snap) { s = JSON.parse(snap); sfx(50); return draw(); }
      undo.push([snap, moves]); if (undo.length > 300) undo.shift(); moves++; if (!t0) t0 = Date.now(); sfx(74);
      if (S.won(s)) {
        won = true; el = Date.now() - t0; ended = performance.now(); sfx(84);
        var b = best(); if (!b || el < b.t || (el === b.t && moves < b.m)) try { localStorage.setItem(BKEY, JSON.stringify({ t: el, m: moves })); } catch (e2) {}
      }
      draw();
    }
    function again() { if (performance.now() - ended < 400) return; newDeal(false); } // ms 가드
    app.addEventListener('click', function (e) {
      audioOn(); var t = e.target.closest('[data-k],[data-a]'); if (!t) return;
      if (t.dataset.a != null) return tap(t.dataset.a);
      var k = t.dataset.k;
      if (k === 'rules') { rulesOpen = !rulesOpen; draw(); }
      else if (k === 'lang') { lang = lang === 'ko' ? 'en' : 'ko'; try { localStorage.setItem(LANG_KEY, lang); } catch (e2) {} document.documentElement.lang = lang; draw(); }
      else if (k === 'mute') { muted = !muted; try { localStorage.setItem(MUTE_KEY, muted ? '1' : '0'); } catch (e3) {} if (gain) gain.gain.value = muted ? 0 : 0.5; draw(); }
      else if (k === 'undo' && undo.length && !won) { var u = undo.pop(); s = JSON.parse(u[0]); moves = u[1]; sfx(62); draw(); }
      else if (k === 'restart') { newDeal(true); }
      else if (k === 'new') { newDeal(false); }
      else if (k === 'again') again();
    });
    document.addEventListener('keydown', function (e) { if ((e.key === ' ' || e.key === 'Enter') && won && !rulesOpen) { e.preventDefault(); audioOn(); again(); } });
    tick = setInterval(function () { var x = document.getElementById('so-t'); if (x && t0 && !won) x.textContent = fmt(now()); }, 500);
    document.documentElement.lang = lang; newDeal(false);
    window.__so = { state: function () { return s; }, tap: tap, moves: function () { return moves; }, won: function () { return won; }, undoN: function () { return undo.length; } }; // 테스트용
  }
  window.Solo = { start: start };
})();
