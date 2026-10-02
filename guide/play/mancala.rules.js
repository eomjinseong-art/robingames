/* 나두 PC 대국 - 만칼라 (칼라 규칙 6구멍 x 4개). 가이드와 같은 규칙:
 * 시계 반대 방향으로 뿌리기, 상대 집은 건너뜀(한 바퀴 돌면 처음 구멍에도 넣음), 마지막이 내 집 → 한 번 더,
 * 마지막이 내 쪽 빈 구멍 + 맞은편에 씨앗 있음 → 둘 다 내 집으로(잡기, 맞은편이 비면 잡기 없음),
 * 한쪽 줄이 다 비면 끝 → 남은 씨앗은 그 줄 주인 집으로.
 * p[0..5] = 0번 선수 구멍(뿌리는 순서), p[6] = 0번 집, p[7..12] = 1번 구멍, p[13] = 1번 집. state.turn 0 = 먼저 하는 사람. move = 구멍 번호 0..5 (자기 줄 기준) */
(function (root) {
  'use strict';
  function init() { return { p: [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0], turn: 0, last: null, extra: false, cap: null, win: null }; }
  function movesP(p, t) { var m = [], o = t * 7; for (var i = 0; i < 6; i++) if (p[o + i] > 0) m.push(i); return m; }
  function moves(s) { return s.win ? [] : movesP(s.p, s.turn); }
  function legal(s, mv) { return !s.win && mv >= 0 && mv < 6 && s.p[s.turn * 7 + mv] > 0; }
  // 원 배열 p를 바꾸고 {extra, cap, lastIdx, end} 반환
  function sow(p, t, mv) {
    var o = t * 7, i = o + mv, n = p[i], myStore = o + 6, oppStore = t ? 6 : 13, path = [];
    p[i] = 0;
    while (n > 0) { i = (i + 1) % 14; if (i === oppStore) continue; p[i]++; n--; path.push(i); }
    var extra = i === myStore, cap = null;
    if (!extra && i >= o && i < o + 6 && p[i] === 1 && p[12 - i] > 0) {
      cap = [i, 12 - i]; p[myStore] += p[12 - i] + 1; p[i] = 0; p[12 - i] = 0;
    }
    var a = 0, b = 0, k; for (k = 0; k < 6; k++) { a += p[k]; b += p[7 + k]; }
    var end = false;
    if (a === 0 || b === 0) { end = true; for (k = 0; k < 6; k++) { p[6] += p[k]; p[k] = 0; p[13] += p[7 + k]; p[7 + k] = 0; } }
    return { extra: extra && !end, cap: cap, path: path, end: end };
  }
  function play(s, mv) {
    var p = s.p.slice(), r = sow(p, s.turn, mv), win = null;
    if (r.end) win = { winner: p[6] > p[13] ? 0 : p[13] > p[6] ? 1 : -1, score: [p[6], p[13]] };
    return { p: p, turn: r.extra || r.end ? s.turn : 1 - s.turn, last: { by: s.turn, pit: s.turn * 7 + mv, path: r.path }, extra: r.extra, cap: r.cap, win: win };
  }
  function over(s) { return s.win; }

  var TIMEOUT = {}, nodes = 0;
  function evalP(p, t) { var o = t * 7, q = (1 - t) * 7, s = (p[o + 6] - p[q + 6]) * 4, a = 0, b = 0; for (var k = 0; k < 6; k++) { a += p[o + k]; b += p[q + k]; } return s + (a - b) * 0.25; }
  // 값: t(최대화) 입장
  function search(p, turn, t, depth, alpha, beta, deadline) {
    if ((++nodes & 2047) === 0 && Date.now() > deadline) throw TIMEOUT;
    var a = 0, b = 0, k; for (k = 0; k < 6; k++) { a += p[k]; b += p[7 + k]; }
    if (a === 0 || b === 0) { var s0 = p[6] + a, s1 = p[13] + b, d = t ? s1 - s0 : s0 - s1; return d * 1000; }
    if (depth <= 0) return evalP(p, t);
    var ms = movesP(p, turn), max = turn === t, best = max ? -Infinity : Infinity;
    // 한 번 더 되는 수를 먼저
    ms.sort(function (x, y) { return ((6 - y) === p[turn * 7 + y] % 13) - ((6 - x) === p[turn * 7 + x] % 13); });
    for (var i = 0; i < ms.length; i++) {
      var q = p.slice(), r = sow(q, turn, ms[i]), nt = r.extra ? turn : 1 - turn;
      var v = r.end ? (t ? q[13] - q[6] : q[6] - q[13]) * 1000 : search(q, nt, t, depth - 1, alpha, beta, deadline);
      if (max) { if (v > best) best = v; if (v > alpha) alpha = v; } else { if (v < best) best = v; if (v < beta) beta = v; }
      if (alpha >= beta) break;
    }
    return best;
  }
  function rootSearch(s, depth, deadline) {
    var t = s.turn, ms = movesP(s.p, t), bm = ms[0], bv = -Infinity, alpha = -Infinity, ties = [];
    for (var i = 0; i < ms.length; i++) {
      var q = s.p.slice(), r = sow(q, t, ms[i]);
      var v = r.end ? (t ? q[13] - q[6] : q[6] - q[13]) * 1000 : search(q, r.extra ? t : 1 - t, t, depth - 1, alpha, Infinity, deadline);
      if (v > bv) { bv = v; bm = ms[i]; ties = [ms[i]]; } else if (v === bv) ties.push(ms[i]);
      if (v > alpha) alpha = v;
    }
    return { m: bm, v: bv };
  }
  function ai(s, level) {
    var t = s.turn, ms = movesP(s.p, t);
    if (ms.length === 1) return ms[0];
    if (level === 'easy') {
      if (Math.random() < 0.45) return ms[(Math.random() * ms.length) | 0];
      var best = -Infinity, bm = ms[0];
      ms.forEach(function (m) { var q = s.p.slice(), r = sow(q, t, m), v = (q[t * 7 + 6] - s.p[t * 7 + 6]) + (r.extra ? 3 : 0) + Math.random(); if (v > best) { best = v; bm = m; } });
      return bm;
    }
    if (level === 'normal') return rootSearch(s, 4, Date.now() + 5000).m;
    var deadline = Date.now() + 900, res = rootSearch(s, 4, Date.now() + 5000).m;
    for (var d = 6; d <= 14; d += 2) {
      try { res = rootSearch(s, d, deadline).m; } catch (e) { if (e !== TIMEOUT) throw e; break; }
    }
    return res;
  }
  var R = { id: 'mancala', init: init, moves: moves, legal: legal, play: play, over: over, ai: ai };
  (root.NadooRules = root.NadooRules || {}).mancala = R;
  if (typeof module !== 'undefined' && module.exports) module.exports = R;
})(typeof self !== 'undefined' ? self : globalThis);
