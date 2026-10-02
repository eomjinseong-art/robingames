/* 나두 PC 대국 - 오델로 규칙 + AI (8x8). state.turn: 0=흑(먼저), 1=백. 칸 값: 0 빈칸, 1 흑, 2 백.
 * 둘 곳이 없으면 자동 패스(state.passed), 둘 다 없으면 끝. */
(function (root) {
  'use strict';
  var D8 = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  var W = [
    120, -20, 20, 5, 5, 20, -20, 120,
    -20, -40, -5, -5, -5, -5, -40, -20,
    20, -5, 15, 3, 3, 15, -5, 20,
    5, -5, 3, 3, 3, 3, -5, 5,
    5, -5, 3, 3, 3, 3, -5, 5,
    20, -5, 15, 3, 3, 15, -5, 20,
    -20, -40, -5, -5, -5, -5, -40, -20,
    120, -20, 20, 5, 5, 20, -20, 120];
  function init() {
    var b = []; for (var i = 0; i < 64; i++) b.push(0);
    b[27] = 2; b[28] = 1; b[35] = 1; b[36] = 2; // d4·e5 백, d5·e4 흑 (행3열3=d4)
    return { b: b, turn: 0, last: -1, passed: false, win: null, flips: [] };
  }
  function flipsFor(b, i, col) {
    if (b[i]) return null;
    var r = i >> 3, c = i & 7, opp = 3 - col, out = [];
    for (var d = 0; d < 8; d++) {
      var dr = D8[d][0], dc = D8[d][1], rr = r + dr, cc = c + dc, tmp = [];
      while (rr >= 0 && rr < 8 && cc >= 0 && cc < 8 && b[rr * 8 + cc] === opp) { tmp.push(rr * 8 + cc); rr += dr; cc += dc; }
      if (tmp.length && rr >= 0 && rr < 8 && cc >= 0 && cc < 8 && b[rr * 8 + cc] === col) out = out.concat(tmp);
    }
    return out.length ? out : null;
  }
  function movesB(b, col) { var m = []; for (var i = 0; i < 64; i++) if (!b[i] && flipsFor(b, i, col)) m.push(i); return m; }
  function moves(s) { return s.win ? [] : movesB(s.b, s.turn + 1); }
  function legal(s, mv) { return !s.win && mv >= 0 && mv < 64 && !!flipsFor(s.b, mv, s.turn + 1); }
  function count(b) { var x = 0, o = 0; for (var i = 0; i < 64; i++) { if (b[i] === 1) x++; else if (b[i] === 2) o++; } return [x, o]; }
  function play(s, mv) {
    var col = s.turn + 1, fl = flipsFor(s.b, mv, col), b = s.b.slice();
    b[mv] = col; for (var k = 0; k < fl.length; k++) b[fl[k]] = col;
    var nt = 1 - s.turn, passed = false, win = null;
    if (!movesB(b, nt + 1).length) {
      if (movesB(b, s.turn + 1).length) { nt = s.turn; passed = true; }
      else { var c = count(b); win = { winner: c[0] > c[1] ? 0 : c[1] > c[0] ? 1 : -1, score: c }; }
    }
    return { b: b, turn: nt, last: mv, passed: passed, win: win, flips: fl };
  }
  function over(s) { return s.win; }

  // ---- AI ----
  var TIMEOUT = {};
  function applyB(b, i, col) { var fl = flipsFor(b, i, col), nb = b.slice(); nb[i] = col; for (var k = 0; k < fl.length; k++) nb[fl[k]] = col; return nb; }
  function evalPos(b, col, mob) {
    var opp = 3 - col, s = 0, i;
    for (i = 0; i < 64; i++) if (b[i] === col) s += W[i]; else if (b[i] === opp) s -= W[i];
    // 모서리를 이미 잡았으면 옆 X·C 칸 감점 취소
    var corners = [[0, 1, 8, 9], [7, 6, 15, 14], [56, 57, 48, 49], [63, 62, 55, 54]];
    for (var k = 0; k < 4; k++) { var cn = corners[k]; if (b[cn[0]]) for (var j = 1; j < 4; j++) { var v = b[cn[j]], w = -W[cn[j]]; if (v === col) s += w; else if (v === opp) s -= w; } }
    if (mob) { var m1 = movesB(b, col).length, m2 = movesB(b, opp).length; s += 8 * (m1 - m2); if (!m1 && m2) s -= 30; }
    return s;
  }
  function empties(b) { var e = 0; for (var i = 0; i < 64; i++) if (!b[i]) e++; return e; }
  function order(ms) { return ms.slice().sort(function (a, c) { return W[c] - W[a]; }); }
  var nodes = 0;
  function search(b, col, depth, alpha, beta, deadline, mob, exact, passed) {
    if ((++nodes & 1023) === 0 && Date.now() > deadline) throw TIMEOUT;
    var ms = movesB(b, col);
    if (!ms.length) {
      var om = movesB(b, 3 - col);
      if (!om.length) { var c = count(b), d = col === 1 ? c[0] - c[1] : c[1] - c[0]; return d * 10000; }
      return -search(b, 3 - col, depth, -beta, -alpha, deadline, mob, exact, true);
    }
    if (depth <= 0 && !exact) return evalPos(b, col, mob);
    ms = order(ms);
    var best = -Infinity;
    for (var k = 0; k < ms.length; k++) {
      var v = -search(applyB(b, ms[k], col), 3 - col, depth - 1, -beta, -alpha, deadline, mob, exact, false);
      if (v > best) best = v; if (v > alpha) alpha = v; if (alpha >= beta) break;
    }
    return best;
  }
  function rootSearch(b, col, depth, deadline, mob, exact) {
    var ms = order(movesB(b, col)), bm = ms[0], alpha = -Infinity;
    for (var k = 0; k < ms.length; k++) {
      var v = -search(applyB(b, ms[k], col), 3 - col, depth - 1, -Infinity, -alpha, deadline, mob, exact, false);
      if (v > alpha) { alpha = v; bm = ms[k]; }
    }
    return bm;
  }
  function ai(s, level) {
    var b = s.b, col = s.turn + 1, ms = movesB(b, col);
    if (ms.length === 1) return ms[0];
    if (level === 'easy') {
      if (Math.random() < 0.5) return ms[(Math.random() * ms.length) | 0];
      var best = -1, bm = ms[0];
      ms.forEach(function (m) { var n = flipsFor(b, m, col).length + Math.random(); if (n > best) { best = n; bm = m; } });
      return bm;
    }
    if (level === 'normal') { try { return rootSearch(b, col, 3, Date.now() + 5000, false, false); } catch (e) { return ms[0]; } }
    var deadline = Date.now() + 1500, e = empties(b), best2 = order(ms)[0];
    if (e <= 11) { // 끝내기 완전 탐색
      try { return rootSearch(b, col, 64, Date.now() + 1800, false, true); } catch (er) { if (er !== TIMEOUT) throw er; }
    }
    for (var d = 2; d <= 6; d++) {
      try { best2 = rootSearch(b, col, d, deadline, true, false); } catch (er2) { if (er2 !== TIMEOUT) throw er2; break; }
    }
    return best2;
  }
  var R = { id: 'othello', init: init, moves: moves, legal: legal, play: play, over: over, ai: ai, count: count, flipsFor: flipsFor };
  (root.NadooRules = root.NadooRules || {}).othello = R;
  if (typeof module !== 'undefined' && module.exports) module.exports = R;
})(typeof self !== 'undefined' ? self : globalThis);
