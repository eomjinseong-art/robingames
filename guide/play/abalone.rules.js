/* 나두 PC 대국 - 아발론 (기본 시작 배치, 흑 먼저). 가이드와 같은 규칙:
 * 내 구슬 1~3개(한 줄로 이어진)를 한 칸 이동. 줄 이동 / 옆 이동(도착 칸 모두 비어야 함).
 * 스미토: 줄 이동으로 더 적은 수(3>2·1, 2>1)의 상대 구슬 줄을 밀기. 밀린 줄 뒤는 빈칸 또는 판 밖, 내 구슬이 끼어 있으면 못 밈.
 * 내 구슬을 판 밖으로 내보내는 수 금지. 상대 구슬 6개를 먼저 떨어뜨리면 승리.
 * 칸: 축 좌표 (x, y), y = 줄-4 (-4..4). 칸 번호 0..60 (줄 순서). move = {c:[칸 번호 1~3개, 줄 순서], d: 방향 0..5}
 * state.b[i]: 0 빈칸, 1 흑, 2 백. turn 0 = 흑. */
(function (root) {
  'use strict';
  var DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1], [-1, 1], [1, -1]]; // →, ←, ↘, ↖, ↙, ↗ (화면 기준: y+ 아래). d^1 = 반대 방향
  var CELLS = [], IDX = {}, ROWLEN = [5, 6, 7, 8, 9, 8, 7, 6, 5];
  for (var y = -4; y <= 4; y++) for (var x = Math.max(-4, -4 - y); x <= Math.min(4, 4 - y); x++) { IDX[x + ',' + y] = CELLS.length; CELLS.push([x, y]); }
  var NB = CELLS.map(function (c) { return DIRS.map(function (d) { var k = IDX[(c[0] + d[0]) + ',' + (c[1] + d[1])]; return k === undefined ? -1 : k; }); });
  function rowcol(i) { var c = CELLS[i], r = c[1] + 4; return [r, c[0] - Math.max(-4, -4 - c[1])]; }
  function idxRC(r, k) { var y = r - 4; return IDX[(k + Math.max(-4, -4 - y)) + ',' + y]; }
  function init() {
    var b = [], i, k; for (i = 0; i < 61; i++) b.push(0);
    for (k = 0; k < 5; k++) { b[idxRC(0, k)] = 1; b[idxRC(8, k)] = 2; }
    for (k = 0; k < 6; k++) { b[idxRC(1, k)] = 1; b[idxRC(7, k)] = 2; }
    for (k = 2; k <= 4; k++) { b[idxRC(2, k)] = 1; b[idxRC(6, k)] = 2; }
    return { b: b, turn: 0, off: [0, 0], last: null, win: null, plies: 0 }; // off[p] = p가 잃은 구슬 수
  }
  // 이동 계산: 성공하면 {b, pushedOff} 아니면 null
  function tryMove(b, cells, d, me) {
    var opp = 3 - me, n = cells.length, i;
    for (i = 0; i < n; i++) if (b[cells[i]] !== me) return null;
    var inline = false, lineDir = -1;
    if (n > 1) {
      for (var k = 0; k < 6; k++) if (NB[cells[0]][k] === cells[1]) lineDir = k;
      if (lineDir < 0) return null;
      for (i = 1; i < n; i++) if (NB[cells[i - 1]][lineDir] !== cells[i]) return null;
      inline = d === lineDir || d === (lineDir ^ 1);
    } else inline = true;
    var nb = b.slice();
    if (!inline) {
      for (i = 0; i < n; i++) { var t = NB[cells[i]][d]; if (t < 0 || b[t] !== 0) return null; }
      for (i = 0; i < n; i++) nb[cells[i]] = 0;
      for (i = 0; i < n; i++) nb[NB[cells[i]][d]] = me;
      return { b: nb, off: 0 };
    }
    // 앞쪽 구슬 = d 방향으로 가장 앞
    var front = cells[0];
    for (i = 0; i < n; i++) { var nx = NB[cells[i]][d]; if (cells.indexOf(nx) < 0) front = cells[i]; }
    var tail = cells[0]; for (i = 0; i < n; i++) { var bk = NB[cells[i]][d ^ 1]; if (cells.indexOf(bk) < 0) tail = cells[i]; }
    var cur = NB[front][d];
    if (cur < 0) return null; // 내 구슬 밖으로 금지
    var oppN = 0, sq = cur;
    while (sq >= 0 && b[sq] === opp) { oppN++; sq = NB[sq][d]; }
    if (b[cur] === me) return null; // 4개 이상 줄 (선택은 최대 3개)
    if (oppN >= n) return null;
    if (oppN > 0 && sq >= 0 && b[sq] !== 0) return null; // 뒤에 구슬(내 것/상대 것)이 있으면 못 밈
    var off = 0;
    if (oppN > 0) { if (sq < 0) off = 1; else nb[sq] = opp; }
    nb[cur] = me; nb[tail] = 0;
    return { b: nb, off: off };
  }
  function gen(b, me) {
    var out = [];
    for (var i = 0; i < 61; i++) {
      if (b[i] !== me) continue;
      for (var d = 0; d < 6; d++) if (tryMove(b, [i], d, me)) out.push({ c: [i], d: d });
      for (var ld = 0; ld < 6; ld += 2) { // 줄 방향 3개 (→, ↘, ↗) 만 = 중복 없음
        var a = NB[i][ld]; if (a < 0 || b[a] !== me) continue;
        var groups = [[i, a]], c3 = NB[a][ld]; if (c3 >= 0 && b[c3] === me) groups.push([i, a, c3]);
        groups.forEach(function (g) { for (var d2 = 0; d2 < 6; d2++) if (tryMove(b, g, d2, me)) out.push({ c: g, d: d2 }); });
      }
    }
    return out;
  }
  function moves(s) { return s.win ? [] : gen(s.b, s.turn + 1); }
  function sortC(c) { return c.slice().sort(function (a, b) { return a - b; }); }
  function legal(s, m) { if (!m || s.win || !m.c || m.c.length < 1 || m.c.length > 3) return false; return !!tryMove(s.b, orderLine(m.c), m.d, s.turn + 1); }
  function orderLine(c) { // 줄 순서로 정렬 (NB 방향 따라)
    if (c.length === 1) return c.slice();
    var s = sortC(c);
    for (var ld = 0; ld < 6; ld++) { var ok = true; for (var i = 1; i < s.length; i++) if (NB[s[i - 1]][ld] !== s[i]) ok = false; if (ok) return s; }
    return s;
  }
  function play(s, m) {
    var r = tryMove(s.b, orderLine(m.c), m.d, s.turn + 1), off = s.off.slice();
    if (r.off) off[1 - s.turn]++;
    var n = { b: r.b, turn: 1 - s.turn, off: off, last: { c: m.c, d: m.d, by: s.turn, push: r.off }, win: null, plies: s.plies + 1 };
    if (off[1 - s.turn] >= 6) n.win = { winner: s.turn };
    else if (n.plies >= 400) n.win = { winner: off[0] < off[1] ? 0 : off[1] < off[0] ? 1 : -1, why: 'limit' };
    return n;
  }
  function over(s) { return s.win; }

  // ---- AI ----
  var DIST = CELLS.map(function (c) { return Math.max(Math.abs(c[0]), Math.abs(c[1]), Math.abs(c[0] + c[1])); });
  function evalB(b, me, offMe, offOpp) {
    var opp = 3 - me, s = (offOpp - offMe) * 1000, i, k;
    if (offOpp >= 6) return 100000; if (offMe >= 6) return -100000;
    for (i = 0; i < 61; i++) {
      var v = b[i]; if (!v) continue;
      var sgn = v === me ? 1 : -1, sc = (4 - DIST[i]) * 12, coh = 0;
      for (k = 0; k < 6; k++) { var nb = NB[i][k]; if (nb >= 0 && b[nb] === v) coh++; }
      sc += coh * 4;
      if (DIST[i] === 4) { // 가장자리: 밀릴 위험
        var danger = 0; for (k = 0; k < 6; k++) { var nn = NB[i][k]; if (nn >= 0 && b[nn] === 3 - v) danger++; }
        sc -= danger * 10;
      }
      s += sgn * sc;
    }
    return s;
  }
  var TIMEOUT = {}, nodes = 0, deadline = 0;
  function order(b, ms, me) {
    // 미는 수·여러 구슬 수 먼저
    ms.forEach(function (m) { var c = m.c; var front = NB[c[c.length - 1]][m.d], f2 = NB[c[0]][m.d]; m.o = c.length + ((front >= 0 && b[front] === 3 - me) || (f2 >= 0 && b[f2] === 3 - me) ? 10 : 0); });
    ms.sort(function (a, c) { return c.o - a.o; });
    return ms;
  }
  function negamax(b, me, off, depth, alpha, beta) {
    if ((++nodes & 511) === 0 && Date.now() > deadline) throw TIMEOUT;
    var offMe = off[me - 1], offOpp = off[2 - me];
    if (depth === 0 || offMe >= 6 || offOpp >= 6) return evalB(b, me, offMe, offOpp);
    var ms = order(b, gen(b, me), me), best = -Infinity;
    for (var i = 0; i < ms.length; i++) {
      var r = tryMove(b, ms[i].c, ms[i].d, me), no = off.slice(); if (r.off) no[2 - me]++;
      var v = -negamax(r.b, 3 - me, no, depth - 1, -beta, -alpha);
      if (v > best) best = v; if (v > alpha) alpha = v; if (alpha >= beta) break;
    }
    return best;
  }
  function rootSearch(s, depth, noise) {
    var me = s.turn + 1, ms = order(s.b, gen(s.b, me), me), best = ms[0], alpha = -Infinity, off = [s.off[0], s.off[1]];
    for (var i = 0; i < ms.length; i++) {
      var r = tryMove(s.b, ms[i].c, ms[i].d, me), no = off.slice(); if (r.off) no[1 - s.turn]++;
      var v = -negamax(r.b, 3 - me, no, depth - 1, -Infinity, noise ? Infinity : -alpha) + (noise ? Math.random() * noise : 0);
      if (v > alpha) { alpha = v; best = ms[i]; }
    }
    return { c: best.c, d: best.d };
  }
  function ai(s, level) {
    nodes = 0;
    if (level === 'easy') {
      var ms = gen(s.b, s.turn + 1);
      if (Math.random() < 0.3) { var m = ms[(Math.random() * ms.length) | 0]; return { c: m.c, d: m.d }; }
      deadline = Date.now() + 3000; return rootSearch(s, 1, 60);
    }
    if (level === 'normal') { deadline = Date.now() + 3000; try { return rootSearch(s, 2, 4); } catch (e) { return rootSearch(s, 1, 4); } }
    deadline = Date.now() + 1000;
    var best = rootSearch(s, 2, 0);
    deadline = Date.now() + 1000;
    for (var d = 3; d <= 4; d++) { try { best = rootSearch(s, d, 0); } catch (e) { if (e !== TIMEOUT) throw e; break; } }
    return best;
  }
  var R = { id: 'abalone', init: init, moves: moves, legal: legal, play: play, over: over, ai: ai, CELLS: CELLS, NB: NB, rowcol: rowcol, tryMove: tryMove, orderLine: orderLine, ROWLEN: ROWLEN };
  (root.NadooRules = root.NadooRules || {}).abalone = R;
  if (typeof module !== 'undefined' && module.exports) module.exports = R;
})(typeof self !== 'undefined' ? self : globalThis);
