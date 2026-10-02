/* 나두 PC 대국 - 샹치. 공용 엔진 jx.core.js 사용. 0번 편 = 홍(빨강, 아래, 먼저), 1번 편 = 흑(위).
 * 장·사는 궁성 안, 상은 밭 전(田) 자 2칸(눈 막힘·강 못 건넘), 마는 멱 막힘, 포는 이동은 차처럼·잡을 땐 정확히 하나를 넘음(포도 넘을 수 있음),
 * 병은 강을 건넌 뒤 옆으로도. 두 장이 사이 없이 마주 보는 수 금지(비장). 둘 수 있는 수가 없으면 패(장군이 아니어도).
 * 300수(양쪽 합)가 되면 무승부(장장 반복 판정은 생략). move = {f, t} */
(function (root) {
  'use strict';
  var JX = root.NadooJX || (typeof require === 'function' ? require('./jx.core.js') : null);
  if (!JX && typeof importScripts === 'function') { importScripts('/guide/play/jx.core.js'); JX = root.NadooJX; }
  var V = 'xiangqi', LIMIT = 300;
  function init() {
    var b = [], i; for (i = 0; i < 90; i++) b.push(0);
    var back = [5, 4, 3, 2, 1, 2, 3, 4, 5]; // 車 馬 象 士 將 士 象 馬 車
    for (i = 0; i < 9; i++) { b[i] = back[i] + 8; b[81 + i] = back[i]; }
    b[2 * 9 + 1] = b[2 * 9 + 7] = 6 + 8; b[7 * 9 + 1] = b[7 * 9 + 7] = 6;
    for (i = 0; i < 9; i += 2) { b[3 * 9 + i] = 7 + 8; b[6 * 9 + i] = 7; }
    return { b: b, turn: 0, last: null, win: null, check: false, plies: 0 };
  }
  function moves(s) { return s.win ? [] : JX.legalList(s.b, s.turn, V); }
  function legal(s, m) { return !!m && moves(s).some(function (x) { return x.f === m.f && x.t === m.t; }); }
  function play(s, m) {
    var b = s.b.slice(); b[m.t] = b[m.f]; b[m.f] = 0;
    var n = { b: b, turn: 1 - s.turn, last: { f: m.f, t: m.t, cap: !!s.b[m.t] }, win: null, check: false, plies: s.plies + 1 };
    n.check = JX.attackedKing(b, n.turn, V);
    if (!JX.legalList(b, n.turn, V).length) n.win = { winner: s.turn, why: n.check ? 'mate' : 'stalemate' };
    else if (n.plies >= LIMIT) n.win = { winner: -1, why: 'limit' };
    return n;
  }
  function over(s) { return s.win; }
  var VAL = [0, 0, 200, 200, 400, 900, 450, 100];
  function evaluate(b, me) {
    var s = 0;
    for (var i = 0; i < 90; i++) {
      var p = b[i]; if (!p) continue;
      var t = JX.typ(p), sd = JX.side(p), r = (i / 9) | 0, c = i % 9, v = VAL[t];
      if (t === 7) { var crossed = sd === 0 ? r <= 4 : r >= 5; if (crossed) v += 90 - Math.abs(c - 4) * 10 + (sd === 0 ? 4 - r : r - 5) * 5; }
      else if (t === 4) v += 15 - Math.abs(c - 4) * 3;
      else if (t === 6 && c === 4) v += 20;
      s += sd === me ? v : -v;
    }
    return s;
  }
  var cfg = {
    V: V, evaluate: evaluate,
    order: function (b, ms) { ms.forEach(function (m) { var c = b[m.t]; m.o = c ? VAL[JX.typ(c)] * 10 - VAL[JX.typ(b[m.f])] + 10000 : 0; }); return ms.sort(function (a, c) { return c.o - a.o; }); },
    noMoves: function (b, me, ply) { return -JX.MATE + ply; }
  };
  function ai(s, level) { return JX.think(s.b, s.turn, level, cfg); }
  var R = { id: 'xiangqi', init: init, moves: moves, legal: legal, play: play, over: over, ai: ai, JX: JX };
  (root.NadooRules = root.NadooRules || {}).xiangqi = R;
  if (typeof module !== 'undefined' && module.exports) module.exports = R;
})(typeof self !== 'undefined' ? self : globalThis);
