/* 나두 PC 대국 공용 틀: 언어(nadoo_lang), 난이도, 먼저/나중, 무르기, 새 게임, 승패 기록(localStorage), AI Web Worker.
 * 게임별 페이지가 NadooPlay.start({...}) 를 부른다. 규칙·AI는 /guide/play/<id>.rules.js (NadooRules[id]) */
(function () {
  'use strict';
  var LANG_KEY = 'nadoo_lang', lang = 'ko';
  try { lang = localStorage.getItem(LANG_KEY) || ((navigator.language || 'ko').toLowerCase().indexOf('ko') === 0 ? 'ko' : 'en'); } catch (e) {}
  if (lang !== 'ko' && lang !== 'en') lang = 'ko';
  var T = {
    home: ['🏠 홈', '🏠 Home'], guide: ['📖 규칙 가이드', '📖 Rules guide'], list: ['📚 가이드 목록', '📚 All guides'],
    level: ['난이도', 'Level'], easy: ['초급', 'Easy'], normal: ['중급', 'Normal'], hard: ['고급', 'Hard'],
    side: ['순서', 'Order'], newGame: ['🔄 새 게임', '🔄 New game'], undo: ['↩️ 무르기', '↩️ Undo'],
    myTurn: ['내 차례예요', 'Your turn'], thinking: ['🤖 컴퓨터가 생각 중…', '🤖 Computer is thinking…'],
    win: ['🎉 이겼어요!', '🎉 You win!'], lose: ['😢 컴퓨터가 이겼어요. 다시 해 봐요!', '😢 The computer wins. Try again!'], draw: ['🤝 비겼어요!', '🤝 Draw!'],
    rec: ['내 기록', 'My record'], w: ['승', 'W'], l: ['패', 'L'], d: ['무', 'D'],
    applyNext: ['바뀐 설정은 새 게임부터 적용돼요.', 'New settings apply from the next game.'],
    credit: ['© 나두게임즈 | 나두Ai', '© Nadoo Games | 나두Ai'], vs: ['PC 대국', 'vs Computer'],
    hintNote: ['초급에서는 둘 수 있는 곳을 표시해 줘요.', 'Easy shows where you can move.'],
    me: ['나', 'Me'], pc: ['컴퓨터', 'Computer'], pcShort: ['PC', 'PC'], nth: ['수', ' moves'],
    pcPass: ['컴퓨터가 둘 곳이 없어 패스! 한 번 더 두세요.', 'The computer has no move and passes. Your turn again!'],
    mePass: ['둘 곳이 없어서 패스했어요.', 'You have no move, so you pass.'],
    meExtra: ['⭐ 내 집에 쏙! 한 번 더!', '⭐ Into your store! Go again!'], pcExtra: ['컴퓨터가 한 번 더 해요.', 'The computer goes again.'],
    meCap: ['🎯 잡기 성공!', '🎯 Capture!'], pcCap: ['컴퓨터가 잡았어요.', 'The computer captured.'],
    topLab: ['컴퓨터 구멍 (← 이쪽으로)', "Computer's pits (←)"], botLab: ['내 구멍 (이쪽으로 →) · 눌러서 뿌리기', 'Your pits (→) · tap to sow'],
    pcStore: ['컴퓨터 집', 'PC store'], myStore: ['내 집', 'My store'],
    mode: ['상대', 'Opponent'], m_pc: ['🤖 PC랑', '🤖 vs PC'], m_2p: ['👥 둘이서', '👥 2 Players'], twoP: ['둘이서', '2 Players'],
    first: ['먼저', 'first'], second: ['나중', 'second'], turnOf: ['차례예요', "'s turn"], waitFor: ['차례를 기다려요…', "'s turn — please wait"],
    winsP: ['승리! 🎉', 'wins! 🎉'], faceNote: ['폰을 두 사람 사이에 눕혀 놓고 해요. 위쪽 칸은 2P, 아래쪽 칸은 1P 거예요.', 'Lay the phone flat between you: the top panel is for 2P, the bottom one for 1P.']
  };
  // 둘이서 모드에서 바뀌는 글자
  var T2 = {
    me: ['1P', '1P'], pc: ['2P', '2P'], pcShort: ['2P', '2P'],
    pcPass: ['2P가 둘 곳이 없어 패스! 1P가 한 번 더 둬요.', '2P has no move and passes. 1P plays again!'],
    mePass: ['1P가 둘 곳이 없어 패스! 2P가 한 번 더 둬요.', '1P has no move and passes. 2P plays again!'],
    meExtra: ['⭐ 1P 한 번 더!', '⭐ 1P goes again!'], pcExtra: ['⭐ 2P 한 번 더!', '⭐ 2P goes again!'],
    meCap: ['🎯 1P 잡기!', '🎯 1P captured!'], pcCap: ['🎯 2P 잡기!', '🎯 2P captured!'],
    topLab: ['2P 구멍 (← 이쪽으로)', "2P's pits (←)"], botLab: ['1P 구멍 (이쪽으로 →)', "1P's pits (→)"], pcStore: ['2P 집', '2P store'], myStore: ['1P 집', '1P store']
  };
  function t(k, extra) { var v = (extra && extra[k]) || T[k]; return v ? v[lang === 'ko' ? 0 : 1] : k; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function start(cfg) {
    var R = window.NadooRules[cfg.id], X = cfg.text || {}, SKEY = 'nadoo_play_' + cfg.id + '_v1';
    var set = { level: 'normal', human: 0, mode: 'pc' }, pending = null;
    try { var sv = JSON.parse(localStorage.getItem(SKEY + '_set') || 'null'); if (sv && T[sv.level] && (sv.human === 0 || sv.human === 1)) { set.level = sv.level; set.human = sv.human; set.mode = sv.mode === '2p' ? '2p' : 'pc'; } } catch (e) {}
    try { var qm = new URLSearchParams(location.search).get('mode'); if (qm === '2p' || qm === 'pc') set.mode = qm; } catch (e) {}
    var cur = { level: set.level, human: set.mode === '2p' ? 0 : set.human, mode: set.mode }; // 지금 판 설정
    var two = function () { return cur.mode === '2p'; };
    var tt = function (k) { return two() && T2[k] ? t(k, T2) : t(k, X); };
    // 편 이름: side0/side1 글의 괄호 안 (예: '흑 ●'), 없으면 먼저/나중
    function sideName(p) { var m = /\(([^)]*)\)/.exec(t('side' + p, X)); return m ? m[1] : t(p ? 'second' : 'first'); }
    function pName(p) { return (p ? '2P' : '1P') + ' (' + sideName(p) + ')'; }
    var state, hist, busy = false, reqId = 0, worker = null, recorded = false, msg = '';
    var app = document.getElementById('playApp');

    function stats() { try { return JSON.parse(localStorage.getItem(SKEY) || '{}') || {}; } catch (e) { return {}; } }
    function record(res) {
      var s = stats(), k = cur.level, o = s[k] || { w: 0, l: 0, d: 0 };
      o[res]++; s[k] = o; try { localStorage.setItem(SKEY, JSON.stringify(s)); } catch (e) {}
    }
    function mkWorker() {
      if (worker || typeof Worker === 'undefined') return;
      try {
        worker = new Worker('/guide/play/worker.js');
        worker.onmessage = function (e) { onAI(e.data.id, e.data.move, e.data.err); };
        worker.onerror = function () { worker = null; };
      } catch (e) { worker = null; }
    }
    function killWorker() { if (worker && busy) { worker.terminate(); worker = null; } busy = false; reqId++; }
    function askAI() {
      busy = true; var id = ++reqId, t0 = Date.now(); draw();
      var done = function (mv) { var wait = Math.max(0, 380 - (Date.now() - t0)); setTimeout(function () { onAI(id, mv); }, wait); };
      mkWorker();
      if (worker) {
        var w = worker;
        w.onmessage = function (e) { if (e.data.err) { console.warn(e.data.err); } done(e.data.move); };
        w.postMessage({ id: id, game: cfg.id, state: state, level: cur.level });
      } else setTimeout(function () { done(R.ai(state, cur.level)); }, 30);
    }
    function onAI(id, mv) {
      if (id !== reqId || !busy) return;
      busy = false;
      if (mv == null || !R.legal(state, mv)) { var ms = R.moves(state); mv = ms[(Math.random() * ms.length) | 0]; }
      state = R.play(state, mv);
      after();
    }
    function after() {
      var o = R.over(state);
      if (two()) { draw(); return; }
      if (o) {
        if (!recorded) { recorded = true; record(o.winner === -1 ? 'd' : o.winner === cur.human ? 'w' : 'l'); }
        draw(); return;
      }
      if (state.turn !== cur.human) askAI(); else draw();
    }
    function humanMove(mv) {
      if (busy || R.over(state) || (!two() && state.turn !== cur.human) || !R.legal(state, mv)) return false;
      hist.push(state); state = R.play(state, mv); msg = '';
      after(); return true;
    }
    function newGame() {
      var rebuild = cur.mode !== set.mode;
      killWorker(); cur = { level: set.level, human: set.mode === '2p' ? 0 : set.human, mode: set.mode }; pending = null;
      if (rebuild) shell();
      state = R.init({ bottom: cur.human }); hist = []; recorded = false; msg = '';
      after();
    }
    function undo() {
      if (!hist.length) return;
      killWorker();
      if (R.over(state) && recorded && !two()) { // 끝난 판을 무르면 기록도 되돌림
        var o = R.over(state), s = stats(), k = cur.level, res = o.winner === -1 ? 'd' : o.winner === cur.human ? 'w' : 'l';
        if (s[k] && s[k][res] > 0) { s[k][res]--; try { localStorage.setItem(SKEY, JSON.stringify(s)); } catch (e) {} }
        recorded = false;
      }
      state = hist.pop(); msg = ''; draw();
    }
    function choose(k, v) {
      set[k] = v; try { localStorage.setItem(SKEY + '_set', JSON.stringify(set)); } catch (e) {}
      if (!hist.length && !R.over(state) && !busy) newGame();
      else if (!hist.length && busy) newGame();
      else { pending = true; draw(); }
    }
    function seatHTML(p) { // 둘이서 모드 한 사람 자리: 차례 표시·정보·도구·무르기
      return '<section class="panel seat' + (p ? ' seat2' : '') + '" data-seat="' + p + '"><div class="status" data-st></div><div class="info" data-info></div>' +
        (cfg.extraControls ? '<div class="ctl" data-extra></div>' : '') + '<div class="actions"><button class="btn" data-undo type="button">' + esc(t('undo')) + '</button></div></section>';
    }
    function shell() {
      document.documentElement.lang = lang;
      var tw = two(), title = tw ? t('twoP') : t('vs');
      document.title = tt('title') + ' ' + title + ' | 나두게임즈';
      var h = '<div class="topbar"><a class="btn" href="/guide/game.html?id=' + cfg.id + '">' + esc(t('guide')) + '</a>' +
        '<span style="display:flex;gap:8px"><a class="btn" href="/">' + esc(t('home')) + '</a><button class="btn" id="langBtn" type="button" aria-label="Language 언어">' + (lang === 'ko' ? '🌏 EN' : '🌏 한') + '</button></span></div>' +
        '<header class="hero"><h1>' + (tw ? '👥 ' : '🤖 ') + esc(tt('title')) + ' ' + esc(title) + '<small>' + esc(tt('sub')) + '</small></h1></header>' +
        '<section class="panel"><div class="seg" role="group"><span class="lab">' + esc(t('mode')) + '</span>' +
        ['pc', '2p'].map(function (m) { return '<button type="button" data-k="mode" data-v="' + m + '" aria-pressed="' + (set.mode === m) + '">' + esc(t('m_' + m)) + '</button>'; }).join('') + '</div>' +
        '<div class="seg pcOnly" role="group"' + (set.mode === '2p' ? ' style="display:none"' : '') + '><span class="lab">' + esc(t('level')) + '</span>' +
        ['easy', 'normal', 'hard'].map(function (l) { return '<button type="button" data-k="level" data-v="' + l + '" aria-pressed="' + (set.level === l) + '">' + esc(t(l)) + '</button>'; }).join('') + '</div>' +
        '<div class="seg pcOnly" role="group"' + (set.mode === '2p' ? ' style="display:none"' : '') + '><span class="lab">' + esc(t('side')) + '</span>' +
        [0, 1].map(function (p) { return '<button type="button" data-k="human" data-v="' + p + '" aria-pressed="' + (set.human === p) + '">' + esc(t('side' + p, X)) + '</button>'; }).join('') + '</div>' +
        '<p class="prog" id="pendNote"></p></section>';
      if (tw) {
        h += seatHTML(1) + '<section class="panel boardpanel"><div class="boardwrap" id="board"></div></section>' + seatHTML(0) +
          '<section class="panel" style="display:flex;flex-direction:column;gap:8px"><p class="prog" style="text-align:center">' + esc(t('faceNote')) + '</p><div class="actions"><button class="btn cta" id="newBtn" type="button">' + esc(t('newGame')) + '</button></div></section>';
      } else {
        h += '<section class="panel" style="display:flex;flex-direction:column;gap:8px"><div class="status" id="status" aria-live="polite"></div>' +
          '<div class="info" id="info"></div><div class="boardwrap" id="board"></div>' + (cfg.extraControls ? '<div id="extra"></div>' : '') +
          '<div class="actions"><button class="btn" id="undoBtn" type="button">' + esc(t('undo')) + '</button><button class="btn cta" id="newBtn" type="button">' + esc(t('newGame')) + '</button></div>' +
          '<div class="stats" id="stats"></div></section>';
      }
      h += '<section class="panel"><p class="prog">' + esc(tt('rulesNote')) + '</p></section>' + '<footer>' + esc(t('credit')) + '</footer>';
      app.innerHTML = h;
      Array.prototype.forEach.call(app.querySelectorAll('.seg button'), function (b) {
        b.addEventListener('click', function () {
          var k = b.getAttribute('data-k'), v = b.getAttribute('data-v'); if (k === 'human') v = +v;
          if (k === 'mode') { Array.prototype.forEach.call(app.querySelectorAll('.pcOnly'), function (x) { x.style.display = v === '2p' ? 'none' : ''; }); }
          Array.prototype.forEach.call(app.querySelectorAll('.seg button[data-k="' + k + '"]'), function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
          choose(k, v);
        });
      });
      document.getElementById('langBtn').addEventListener('click', function () { lang = lang === 'ko' ? 'en' : 'ko'; try { localStorage.setItem(LANG_KEY, lang); } catch (e) {} shell(); draw(); });
      document.getElementById('newBtn').addEventListener('click', newGame);
      if (tw) {
        Array.prototype.forEach.call(app.querySelectorAll('[data-undo]'), function (b) { b.addEventListener('click', undo); });
        if (cfg.extraControls) Array.prototype.forEach.call(app.querySelectorAll('[data-extra]'), function (el) { cfg.extraControls(el, api); });
      } else {
        document.getElementById('undoBtn').addEventListener('click', undo);
        if (cfg.extraControls) cfg.extraControls(document.getElementById('extra'), api);
      }
    }
    var api = {
      t: tt, lang: function () { return lang; }, esc: esc, move: humanMove, redraw: function () { draw(); },
      say: function (m) { msg = m; draw(); }
    };
    function draw() {
      var o = R.over(state), cls = '', txt, note = cfg.note ? cfg.note(state, api, cur) : '';
      var infoH = (cfg.info ? cfg.info(state, api, cur) : '') + (msg ? '<div class="note">' + esc(msg) + '</div>' : '') + (note ? '<div class="prog">' + esc(note) + '</div>' : '');
      var tw = two();
      var ctx = tw ? { hints: true, myTurn: !o, human: state.turn, view: 0, over: !!o, level: 'easy', two: true }
        : { hints: cur.level === 'easy', myTurn: !o && !busy && state.turn === cur.human, human: cur.human, view: cur.human, over: !!o, level: cur.level };
      if (tw) {
        var lastBy = hist.length ? hist[hist.length - 1].turn : -1;
        Array.prototype.forEach.call(app.querySelectorAll('[data-seat]'), function (seat) {
          var p = +seat.getAttribute('data-seat'), st = seat.querySelector('[data-st]'), mine = !o && state.turn === p, c2 = '';
          if (o) { if (o.winner === -1) txt = t('draw'); else { txt = '🏆 ' + pName(o.winner) + ' ' + t('winsP'); c2 = o.winner === p ? 'win' : 'lose'; } }
          else txt = mine ? '👉 ' + pName(p) + ' ' + t('turnOf') : '⏳ ' + pName(state.turn) + ' ' + t('waitFor');
          st.className = 'status ' + c2; st.textContent = txt;
          seat.querySelector('[data-info]').innerHTML = infoH;
          seat.classList.toggle('off', !mine);
          seat.classList.toggle('turn', mine);
          var ub = seat.querySelector('[data-undo]'); ub.disabled = !hist.length || (o ? false : lastBy !== p); // 방금 둔 사람이 무르기
        });
        cfg.render(document.getElementById('board'), state, ctx, api);
        document.getElementById('pendNote').textContent = pending ? t('applyNext') : '';
        return;
      }
      var st = document.getElementById('status');
      if (o) { txt = o.winner === -1 ? t('draw') : o.winner === cur.human ? t('win') : t('lose'); cls = o.winner === -1 ? '' : o.winner === cur.human ? 'win' : 'lose'; }
      else if (busy) { txt = t('thinking'); cls = 'thinking'; }
      else txt = t('myTurn') + (cfg.turnNote ? ' · ' + cfg.turnNote(state, api, cur) : '');
      st.className = 'status ' + cls; st.textContent = txt;
      document.getElementById('info').innerHTML = infoH;
      cfg.render(document.getElementById('board'), state, ctx, api);
      document.getElementById('undoBtn').disabled = !hist.length;
      var s = stats();
      document.getElementById('stats').textContent = t('rec') + ' · ' + ['easy', 'normal', 'hard'].map(function (l) { var x = s[l] || { w: 0, l: 0, d: 0 }; return t(l) + ' ' + x.w + t('w') + ' ' + x.l + t('l') + ' ' + x.d + t('d'); }).join(' | ');
      document.getElementById('pendNote').textContent = pending ? t('applyNext') : (set.level === 'easy' && cfg.hintNote !== false ? t('hintNote') : '');
    }
    shell(); newGame();
    window.__nadooPlay = { get state() { return state; }, get busy() { return busy; }, get human() { return cur.human; }, get mode() { return cur.mode; }, R: R, move: humanMove, newGame: newGame, undo: undo };
  }
  window.NadooPlay = { start: start };
})();
/* SVG 좌표 변환 도우미 */
window.NadooPlay.pt = function (svg, ev) {
  var r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
  return { x: (ev.clientX - r.left) * vb.width / r.width, y: (ev.clientY - r.top) * vb.height / r.height };
};
