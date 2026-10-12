/* 나두 카드게임 공용 틀 (빌드 없음): 설정(PC 1~3명·초/중/고 또는 한 폰 2~4명), 가림 화면, 큰 카드,
 * PC 0.5초, 즉시 다시 하기(Space/Enter/탭), 한/영, Web Audio BGM + 음소거, 홈 버튼.
 * 게임 페이지가 CardKit.start(G) 를 부른다.
 * G = { id, title:[ko,en], rules:[ko,en], minP, maxP, bgm:[음 높이 배열], init(n, lv), view(s, me, K), act(s, p, a, K), ai(s, p, lv, K), over(s) }
 * s.turn = 지금 행동할 사람 번호, -1 이면 '누구나'(가림 화면 없이 지금 보는 사람). */
(function () {
  'use strict';
  var LANG_KEY = 'nadoo_lang', MUTE_KEY = 'nadoo_cards_mute', lang = 'ko';
  try { lang = localStorage.getItem(LANG_KEY) || ((navigator.language || 'ko').toLowerCase().indexOf('ko') === 0 ? 'ko' : 'en'); } catch (e) {}
  if (lang !== 'ko' && lang !== 'en') lang = 'ko';
  var T = {
    home: ['🏠 홈', '🏠 Home'], rules: ['📖 규칙', '📖 Rules'], setup: ['⚙️ 설정', '⚙️ Setup'],
    mode: ['어떻게 할까요?', 'How to play?'], m_pc: ['🤖 PC랑 하기', '🤖 vs Computer'], m_pass: ['👥 한 폰으로 같이 (2~4명)', '👥 Pass & play (2–4)'],
    opp: ['PC 상대 수', 'Computer opponents'], ppl: ['사람 수', 'Players'], level: ['난이도', 'Level'],
    easy: ['초급', 'Easy'], normal: ['중급', 'Normal'], hard: ['고급', 'Hard'], go: ['▶ 시작!', '▶ Start!'],
    me: ['나', 'Me'], pc: ['PC', 'PC'], p: ['P', 'P'], pcThink: ['🤖 PC 차례…', '🤖 Computer…'],
    cover: ['차례예요!', "'s turn!"], coverSub: ['다른 사람은 화면을 보지 말아요 🙈', 'Everyone else, look away 🙈'], coverTap: ['👉 준비되면 탭하세요', '👉 Tap when ready'],
    again: ['Space · Enter · 탭 = 바로 다시 하기', 'Space · Enter · tap = play again'], win: ['🎉 이겼어요!', '🎉 You win!'], lose: ['😅 아쉬워요! 다시 해 봐요', '😅 So close! Try again'],
    wins: ['승리! 🎉', 'wins! 🎉'], family: ['가족 게임 · 칩은 점수일 뿐이에요 (돈 X)', 'Family game · chips are just points'],
    mute: ['🔇', '🔇'], unmute: ['🔊', '🔊'], cards: ['장', ' cards'], credit: ['© 나두 보드게임 라운지', '© Nadoo Board Lounge']
  };
  function L(v) { return Array.isArray(v) ? v[lang === 'ko' ? 0 : 1] : v; }
  function t(k) { return T[k] ? L(T[k]) : k; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  // ---------- 카드 ----------
  var SUITS = ['S', 'H', 'D', 'C'], SYM = { S: '♠', H: '♥', D: '♦', C: '♣' };
  function deck(opt) {
    opt = opt || {}; var d = [], ranks = opt.ranks || ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    (opt.suits || SUITS).forEach(function (s) { ranks.forEach(function (r) { d.push(r + s); }); });
    if (opt.jokers) d.push('JKB', 'JKC');
    return shuffle(d);
  }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  function rank(c) { return c.slice(0, -1); }
  function suit(c) { return c.slice(-1); }
  function cardHtml(c, o) {
    o = o || {};
    var cls = 'ck-card' + (o.small ? ' sm' : '') + (o.sel ? ' sel' : '') + (o.act != null ? ' tap' : '') + (o.dim ? ' dim' : '');
    var at = o.act != null ? ' data-a="' + esc(o.act) + '" role="button" tabindex="0"' : '';
    if (!c || c === 'XX' || o.back) return '<div class="' + cls + ' back"' + at + '><span>🂠</span></div>';
    if (c === 'JKB' || c === 'JKC') return '<div class="' + cls + ' jk ' + (c === 'JKC' ? 'red' : '') + '"' + at + '><b>🃏</b><i>JOKER</i></div>';
    var r = rank(c), su = suit(c), red = su === 'H' || su === 'D';
    if (/^N\d+$/.test(c)) return '<div class="' + cls + ' num"' + at + '><b>' + esc(c.slice(1)) + '</b></div>';
    return '<div class="' + cls + (red ? ' red' : '') + '"' + at + '><b>' + esc(r) + '</b><i>' + SYM[su] + '</i></div>';
  }

  // ---------- BGM (Web Audio, 직접 만든 짧은 반복 멜로디) ----------
  var ac = null, gain = null, muted = false, bgTimer = null, step = 0, nextT = 0, melody = null;
  try { muted = localStorage.getItem(MUTE_KEY) === '1'; } catch (e) {}
  function hz(n) { return 440 * Math.pow(2, (n - 69) / 12); }
  function tone(n, at, dur, type, vol) {
    var o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.value = hz(n); g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(vol, at + 0.01); g.gain.exponentialRampToValueAtTime(0.0008, at + dur);
    o.connect(g); g.connect(gain); o.start(at); o.stop(at + dur + 0.02);
  }
  function audioOn() {
    if (!ac) {
      var A = window.AudioContext || window.webkitAudioContext; if (!A) return;
      ac = new A(); gain = ac.createGain(); gain.gain.value = muted ? 0 : 0.5; gain.connect(ac.destination);
      nextT = ac.currentTime + 0.05;
      bgTimer = setInterval(function () { // 0.25초 박자, 앞으로 0.3초 분량 예약
        while (nextT < ac.currentTime + 0.3) {
          var m = melody[step % melody.length], bass = [48, 48, 53, 55][Math.floor(step / 8) % 4];
          if (m) tone(m, nextT, 0.22, 'square', 0.05);
          if (step % 2 === 0) tone(bass, nextT, 0.3, 'triangle', 0.09);
          if (step % 4 === 2) tone(84, nextT, 0.03, 'square', 0.015);
          step++; nextT += 0.25;
        }
      }, 100);
    }
    if (ac.state === 'suspended') ac.resume();
  }
  function sfx(n) { if (ac && !muted) tone(n, ac.currentTime, 0.12, 'sine', 0.12); }

  // ---------- 틀 ----------
  function start(G) {
    melody = G.bgm || [72, 76, 79, 76, 74, 77, 81, 0, 72, 76, 79, 84, 83, 79, 76, 0];
    var SKEY = 'nadoo_cards_' + G.id + '_set';
    var set = { mode: 'pc', opp: 1, ppl: 2, level: 'normal' };
    try { var sv = JSON.parse(localStorage.getItem(SKEY) || 'null'); if (sv) for (var k in set) if (sv[k] != null) set[k] = sv[k]; } catch (e) {}
    try { var qm = new URLSearchParams(location.search).get('mode'); if (qm === '2p' || qm === 'pass') set.mode = 'pass'; if (qm === 'pc') set.mode = 'pc'; } catch (e) {}
    var minO = Math.max(1, G.minP - 1), maxO = Math.min(3, G.maxP - 1);
    set.opp = Math.min(maxO, Math.max(minO, set.opp)); set.ppl = Math.min(Math.min(4, G.maxP), Math.max(G.minP, set.ppl));
    var app = document.getElementById('app'), s = null, cfg = null, viewer = 0, covered = false, busy = false, ended = 0, sel = [], msg = '', timer = null;

    function names() {
      var n = [];
      for (var i = 0; i < cfg.n; i++) n.push(cfg.mode === 'pc' ? (i === 0 ? t('me') : t('pc') + i) : (i + 1) + 'P');
      return n;
    }
    var K = {
      L: L, t: t, esc: esc, deck: deck, shuffle: shuffle, rank: rank, suit: suit, card: cardHtml, SYM: SYM, lang: function () { return lang; },
      sel: function () { return sel; }, isHuman: function (p) { return cfg.mode === 'pass' || p === 0; },
      name: function (p) { return names()[p]; }, pc: function () { return cfg.mode === 'pc'; }, sfx: sfx,
      say: function (m) { msg = m; }
    };
    function bar() {
      return '<div class="ck-bar"><a class="ck-b" href="/guide/">' + t('home') + '</a>' +
        '<a class="ck-b" href="/guide/game.html?id=' + esc(G.guide || G.id) + '">' + t('rules') + '</a>' +
        (s ? '<button class="ck-b" data-k="setup">' + t('setup') + '</button>' : '') +
        '<button class="ck-b" data-k="lang">' + (lang === 'ko' ? 'EN' : '한') + '</button>' +
        '<button class="ck-b" data-k="mute" aria-label="sound">' + (muted ? t('mute') : t('unmute')) + '</button></div>';
    }
    function seg(key, opts) {
      return '<div class="ck-seg">' + opts.map(function (o) { return '<button data-set="' + key + ':' + o[0] + '" class="' + (String(set[key]) === String(o[0]) ? 'on' : '') + '">' + esc(o[1]) + '</button>'; }).join('') + '</div>';
    }
    function rng(a, b) { var r = []; for (var i = a; i <= b; i++) r.push([i, String(i)]); return r; }
    function drawSetup() {
      var h = bar() + '<h1 class="ck-h">' + esc(L(G.emoji || '') + ' ' + L(G.title)) + '</h1>';
      if (G.family) h += '<p class="ck-note">🍬 ' + t('family') + '</p>';
      h += '<div class="ck-panel"><h3>' + t('mode') + '</h3>' + seg('mode', [['pc', t('m_pc')], ['pass', t('m_pass')]]);
      if (set.mode === 'pc') h += '<h3>' + t('opp') + '</h3>' + seg('opp', rng(minO, maxO)) + '<h3>' + t('level') + '</h3>' + seg('level', [['easy', t('easy')], ['normal', t('normal')], ['hard', t('hard')]]);
      else h += '<h3>' + t('ppl') + '</h3>' + seg('ppl', rng(Math.max(2, G.minP), Math.min(4, G.maxP)));
      h += '<button class="ck-go" data-k="go">' + t('go') + '</button></div><p class="ck-rules">' + esc(L(G.rules)) + '</p><p class="ck-cr">' + t('credit') + '</p>';
      s = null; app.innerHTML = h;
    }
    function newGame() {
      clearTimeout(timer);
      cfg = { mode: set.mode, n: set.mode === 'pc' ? set.opp + 1 : set.ppl, level: set.level };
      try { localStorage.setItem(SKEY, JSON.stringify(set)); } catch (e) {}
      s = G.init(cfg.n, cfg.level, K); viewer = 0; sel = []; msg = ''; ended = 0; covered = false; busy = false;
      step0();
    }
    function step0() {
      var o = G.over(s, K);
      if (o) { ended = performance.now(); return draw(o); } // ms 단위
      var p = s.turn;
      if (p >= 0 && !K.isHuman(p)) {
        busy = true; draw();
        timer = setTimeout(function () { busy = false; var a = G.ai(s, p, cfg.level, K); G.act(s, p, a, K); sfx(67); step0(); }, 500);
        return;
      }
      if (p >= 0 && cfg.mode === 'pass' && p !== viewer) { viewer = p; covered = true; sel = []; }
      draw();
    }
    function draw(o) {
      if (!s) return drawSetup();
      var h = bar();
      if (covered) {
        h += '<div class="ck-cover" data-k="uncover"><div><b>' + esc(K.name(viewer)) + (lang === 'ko' ? ' ' : '') + t('cover') + '</b><p>' + t('coverSub') + '</p><p class="ck-tap">' + t('coverTap') + '</p></div></div>';
        app.innerHTML = h; return;
      }
      h += '<div class="ck-msg">' + (busy ? '<span class="ck-think">' + t('pcThink') + '</span> ' : '') + esc(msg) + '</div>';
      h += '<div class="ck-table">' + G.view(s, o ? -1 : viewer, K, !!o) + '</div>';
      if (o) {
        var txt = o.text || (cfg.mode === 'pc' ? (o.winners.indexOf(0) >= 0 ? t('win') : t('lose')) : o.winners.map(K.name).join(', ') + ' ' + t('wins'));
        h += '<div class="ck-end" data-k="again"><div><b>' + esc(txt) + '</b>' + (o.detail ? '<p>' + esc(o.detail) + '</p>' : '') + '<p class="ck-tap">🔄 ' + t('again') + '</p></div></div>';
        sfx(o.winners.indexOf(0) >= 0 || cfg.mode === 'pass' ? 84 : 60);
      }
      app.innerHTML = h;
    }
    function act(a) {
      if (!s || busy || covered || G.over(s, K)) return;
      var p = s.turn >= 0 ? s.turn : viewer;
      if (!K.isHuman(p)) return;
      if (a.indexOf('sel:') === 0) { var i = +a.slice(4), j = sel.indexOf(i); if (j >= 0) sel.splice(j, 1); else sel.push(i); sfx(76); return draw(); }
      if (G.act(s, p, a, K) === false) { sfx(55); return draw(); }
      sel = []; sfx(72); step0();
    }
    function again() { if (performance.now() - ended < 400) return; newGame(); }
    app.addEventListener('click', function (e) {
      audioOn();
      var el = e.target.closest('[data-k],[data-a],[data-set]'); if (!el) return;
      if (el.dataset.set) { var kv = el.dataset.set.split(':'); set[kv[0]] = isNaN(+kv[1]) ? kv[1] : +kv[1]; return drawSetup(); }
      if (el.dataset.a != null) return act(el.dataset.a);
      var k = el.dataset.k;
      if (k === 'go') newGame();
      else if (k === 'setup') { clearTimeout(timer); busy = false; drawSetup(); }
      else if (k === 'lang') { lang = lang === 'ko' ? 'en' : 'ko'; try { localStorage.setItem(LANG_KEY, lang); } catch (e2) {} document.documentElement.lang = lang; s ? draw(G.over(s, K)) : drawSetup(); }
      else if (k === 'mute') { muted = !muted; try { localStorage.setItem(MUTE_KEY, muted ? '1' : '0'); } catch (e3) {} if (gain) gain.gain.value = muted ? 0 : 0.5; s ? draw(G.over(s, K)) : drawSetup(); }
      else if (k === 'uncover') { covered = false; draw(); }
      else if (k === 'again') again();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      audioOn();
      if (s && G.over(s, K)) { e.preventDefault(); again(); }
      else if (s && covered) { e.preventDefault(); covered = false; draw(); }
      else if (!s && document.activeElement === document.body) { e.preventDefault(); newGame(); }
    });
    document.documentElement.lang = lang;
    drawSetup();
    window.__ck = { state: function () { return s; }, cfg: function () { return cfg; }, act: act, K: K, covered: function () { return covered; } }; // 테스트용
  }
  window.CardKit = { start: start };
})();
