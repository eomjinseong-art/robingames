/* 나두 PC 대국 - 장기. 공용 엔진 jx.core.js 사용. 0번 편 = 초(아래, 먼저), 1번 편 = 한(위, 덤 1.5).
 * 차림: 양쪽 모두 마상상마 (가이드 그림과 같음). 궁성 대각선, 포는 꼭 하나를 넘어서(포는 포를 못 넘고 못 잡음), 마·상 멱 막힘.
 * 장군을 못 피하면 외통 패. 둘 곳이 없으면(장군 아님) 한 수 쉼.
 * 빅장(두 궁이 사이에 아무것도 없이 마주 봄)을 만들면 '빅장'을 부른 것: 상대는 바로 다음 수에 빅장을 풀어야 하고, 못 풀면 점수 계산으로 승패
 * (차13 포7 마5 상3 사3 졸2, 한 +1.5). 200수(양쪽 합)가 되면 점수 계산. move = {f, t} */
(function (root) {
  'use strict';
  var JX = root.NadooJX || (typeof require === 'function' ? require('./jx.core.js') : null);
  if (!JX && typeof importScripts === 'function') { importScripts('/guide/play/jx.core.js'); JX = root.NadooJX; }
  var V = 'janggi', PTS = [0, 0, 3, 3, 5, 13, 7, 2], LIMIT = 200;
  function init() {
    var b = [], i; for (i = 0; i < 90; i++) b.push(0);
    var back = [5, 4, 3, 2, 0, 2, 3, 4, 5]; // 차 마 상 사 _ 사 상 마 차
    for (i = 0; i < 9; i++) if (back[i]) { b[i] = back[i] + 8; b[81 + i] = back[i]; }
    b[1 * 9 + 4] = 1 + 8; b[8 * 9 + 4] = 1;
    b[2 * 9 + 1] = b[2 * 9 + 7] = 6 + 8; b[7 * 9 + 1] = b[7 * 9 + 7] = 6;
    for (i = 0; i < 9; i += 2) { b[3 * 9 + i] = 7 + 8; b[6 * 9 + i] = 7; }
    return { b: b, turn: 0, last: null, win: null, check: false, plies: 0, passed: false, bik: false };
  }
  function points(b) { var s = [0, 1.5]; for (var i = 0; i < 90; i++) if (b[i]) s[JX.side(b[i])] += PTS[JX.typ(b[i])]; return s; }
  function byScore(b, why) { var s = points(b); return { winner: s[0] > s[1] ? 0 : 1, why: why, score: s }; }
  function moves(s) { return s.win ? [] : JX.legalList(s.b, s.turn, V); }
  function legal(s, m) { return !!m && moves(s).some(function (x) { return x.f === m.f && x.t === m.t; }); }
  function play(s, m) {
    var b = s.b.slice(); b[m.t] = b[m.f]; b[m.f] = 0;
    var n = { b: b, turn: 1 - s.turn, last: { f: m.f, t: m.t, cap: !!s.b[m.t] }, win: null, check: false, plies: s.plies + 1, passed: false, bik: false };
    n.bik = JX.facing(b);
    n.check = JX.attackedKing(b, n.turn, V);
    if (!JX.legalList(b, n.turn, V).length) {
      if (n.check) { n.win = { winner: s.turn, why: 'mate' }; return n; }
      if (n.bik) { n.win = byScore(b, 'bik'); return n; } // 빅장을 못 풂
      n.turn = s.turn; n.passed = true; // 한 수 쉼
      if (!JX.legalList(b, n.turn, V).length) { n.win = byScore(b, 'stuck'); return n; }
    }
    if (n.plies >= LIMIT) n.win = byScore(b, 'limit');
    return n;
  }
  function over(s) { return s.win; }
  var VAL = [0, 0, 300, 300, 500, 1300, 700, 200];
  function evaluate(b, me) {
    var s = 0;
    for (var i = 0; i < 90; i++) {
      var p = b[i]; if (!p) continue;
      var t = JX.typ(p), sd = JX.side(p), r = (i / 9) | 0, c = i % 9, v = VAL[t];
      if (t === 7) v += (sd === 0 ? 6 - r : r - 3) * 8 - Math.abs(c - 4) * 2;
      else if (t === 4 || t === 6) v += 12 - Math.abs(c - 4) * 3;
      s += sd === me ? v : -v;
    }
    return s + (me === 1 ? 150 : -150);
  }
  var cfg = {
    V: V, evaluate: evaluate,
    order: function (b, ms) { ms.forEach(function (m) { var c = b[m.t]; m.o = c ? VAL[JX.typ(c)] * 10 - VAL[JX.typ(b[m.f])] + 10000 : 0; }); return ms.sort(function (a, c) { return c.o - a.o; }); },
    noMoves: function (b, me, ply, bik) {
      if (JX.attackedKing(b, me, V)) return -JX.MATE + ply;
      if (bik) { var s = points(b); return (s[me] > s[1 - me] ? 1 : -1) * 50000; }
      return evaluate(b, me);
    }
  };
  function ai(s, level) { return JX.think(s.b, s.turn, level, cfg); }
  var R = { id: 'janggi', init: init, moves: moves, legal: legal, play: play, over: over, ai: ai, points: points, JX: JX };
  (root.NadooRules = root.NadooRules || {}).janggi = R;
  if (typeof module !== 'undefined' && module.exports) module.exports = R;
})(typeof self !== 'undefined' ? self : globalThis);
