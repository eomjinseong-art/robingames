/* 나두 PC 대국 - 쿼리도 2인 (9x9, 벽 10개씩). 가이드와 같은 규칙:
 * 차례마다 말 1칸 이동 또는 벽 1개. 벽은 겹치기·십자 금지, 누구의 길도 완전히 막으면 안 됨(BFS 확인).
 * 바로 앞 상대 말은 뛰어넘기, 뒤가 벽/판 끝이면 대각선 옆으로. 반대편 끝줄에 닿으면 승리.
 * pos[p] = [행, 열], goal[p] = 목표 행. h[r*8+c]=1: r행과 r+1행 사이, c·c+1열에 걸친 가로벽. v[r*8+c]=1: c열과 c+1열 사이, r·r+1행에 걸친 세로벽.
 * move: {t:'m', r, c} | {t:'h'|'v', r, c} (0..7) */
(function (root) {
  'use strict';
  function init(opt) {
    var bottom = opt && opt.bottom != null ? opt.bottom : 0; // 화면 아래에서 시작하는 선수
    var pos = [[0, 4], [0, 4]], goal = [0, 0];
    pos[bottom] = [8, 4]; goal[bottom] = 0; pos[1 - bottom] = [0, 4]; goal[1 - bottom] = 8;
    var h = [], v = []; for (var i = 0; i < 64; i++) { h.push(0); v.push(0); }
    var wo = []; for (i = 0; i < 128; i++) wo.push(0);
    return { pos: pos, goal: goal, walls: [10, 10], h: h, v: v, wo: wo, turn: 0, last: null, win: null }; // wo: 벽 주인(0 없음, 선수+1), 가로 0..63 · 세로 64..127
  }
  function hW(h, r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8 && h[r * 8 + c] === 1; }
  // (r,c)에서 (dr,dc) 방향 한 칸 이동이 벽/판 끝에 막혔나
  function blocked(h, v, r, c, dr, dc) {
    var nr = r + dr, nc = c + dc;
    if (nr < 0 || nr > 8 || nc < 0 || nc > 8) return true;
    if (dr === -1) return hW(h, r - 1, c) || hW(h, r - 1, c - 1);
    if (dr === 1) return hW(h, r, c) || hW(h, r, c - 1);
    if (dc === -1) return hW(v, r, c - 1) || hW(v, r - 1, c - 1);
    return hW(v, r, c) || hW(v, r - 1, c);
  }
  var D4 = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  // 목표 줄까지 최단 거리 (말 무시). 길 없으면 -1. dist 배열을 원하면 out 사용
  function dist(h, v, r0, c0, goal, out) {
    var d = out || new Array(81); for (var i = 0; i < 81; i++) d[i] = -1;
    var q = [r0 * 9 + c0], head = 0; d[q[0]] = 0;
    while (head < q.length) {
      var x = q[head++], r = (x / 9) | 0, c = x % 9;
      if (r === goal) return d[x];
      for (var k = 0; k < 4; k++) {
        var dr = D4[k][0], dc = D4[k][1];
        if (blocked(h, v, r, c, dr, dc)) continue;
        var y = (r + dr) * 9 + c + dc; if (d[y] >= 0) continue;
        d[y] = d[x] + 1; q.push(y);
      }
    }
    return -1;
  }
  // 목표 줄에서 거꾸로 BFS한 거리 지도 (경로 따라가기용)
  function distMap(h, v, goal) {
    var d = new Array(81), q = [], head = 0, i;
    for (i = 0; i < 81; i++) d[i] = -1;
    for (i = 0; i < 9; i++) { d[goal * 9 + i] = 0; q.push(goal * 9 + i); }
    while (head < q.length) {
      var x = q[head++], r = (x / 9) | 0, c = x % 9;
      for (var k = 0; k < 4; k++) { var dr = D4[k][0], dc = D4[k][1]; if (blocked(h, v, r, c, dr, dc)) continue; var y = (r + dr) * 9 + c + dc; if (d[y] >= 0) continue; d[y] = d[x] + 1; q.push(y); }
    }
    return d;
  }
  function pawnMoves(s, p) {
    var me = s.pos[p], op = s.pos[1 - p], h = s.h, v = s.v, out = [];
    for (var k = 0; k < 4; k++) {
      var dr = D4[k][0], dc = D4[k][1];
      if (blocked(h, v, me[0], me[1], dr, dc)) continue;
      var nr = me[0] + dr, nc = me[1] + dc;
      if (nr === op[0] && nc === op[1]) {
        if (!blocked(h, v, nr, nc, dr, dc)) out.push({ t: 'm', r: nr + dr, c: nc + dc });
        else for (var j = 0; j < 4; j++) {
          var pr = D4[j][0], pc = D4[j][1]; if ((pr === 0) === (dr === 0)) continue;
          if (!blocked(h, v, nr, nc, pr, pc)) out.push({ t: 'm', r: nr + pr, c: nc + pc });
        }
      } else out.push({ t: 'm', r: nr, c: nc });
    }
    return out;
  }
  function wallFits(s, t, r, c) {
    if (r < 0 || r > 7 || c < 0 || c > 7) return false;
    var i = r * 8 + c, h = s.h, v = s.v;
    if (h[i] || v[i]) return false; // 겹침·십자
    if (t === 'h') return !hW(h, r, c - 1) && !hW(h, r, c + 1);
    return !hW(v, r - 1, c) && !hW(v, r + 1, c);
  }
  function wallLegal(s, t, r, c) {
    if (s.win || s.walls[s.turn] <= 0 || !wallFits(s, t, r, c)) return false;
    var arr = t === 'h' ? s.h : s.v, i = r * 8 + c; arr[i] = 1;
    var ok = dist(s.h, s.v, s.pos[0][0], s.pos[0][1], s.goal[0]) >= 0 && dist(s.h, s.v, s.pos[1][0], s.pos[1][1], s.goal[1]) >= 0;
    arr[i] = 0; return ok;
  }
  function moves(s) {
    if (s.win) return [];
    var out = pawnMoves(s, s.turn);
    if (s.walls[s.turn] > 0) for (var r = 0; r < 8; r++) for (var c = 0; c < 8; c++) { if (wallLegal(s, 'h', r, c)) out.push({ t: 'h', r: r, c: c }); if (wallLegal(s, 'v', r, c)) out.push({ t: 'v', r: r, c: c }); }
    return out;
  }
  function legal(s, mv) {
    if (!mv || s.win) return false;
    if (mv.t === 'm') return pawnMoves(s, s.turn).some(function (x) { return x.r === mv.r && x.c === mv.c; });
    return (mv.t === 'h' || mv.t === 'v') && wallLegal(s, mv.t, mv.r, mv.c);
  }
  function play(s, mv) {
    var n = { pos: [s.pos[0].slice(), s.pos[1].slice()], goal: s.goal.slice(), walls: s.walls.slice(), h: s.h.slice(), v: s.v.slice(), wo: (s.wo || []).slice(), turn: 1 - s.turn, last: { by: s.turn, mv: mv }, win: null };
    if (mv.t === 'm') { n.pos[s.turn] = [mv.r, mv.c]; if (mv.r === s.goal[s.turn]) { n.win = { winner: s.turn }; n.turn = s.turn; } }
    else { (mv.t === 'h' ? n.h : n.v)[mv.r * 8 + mv.c] = 1; n.wo[(mv.t === 'h' ? 0 : 64) + mv.r * 8 + mv.c] = s.turn + 1; n.walls[s.turn]--; }
    return n;
  }
  function over(s) { return s.win; }

  // ---- AI ----
  var TIMEOUT = {}, nodes = 0;
  function dd(s, p) { return dist(s.h, s.v, s.pos[p][0], s.pos[p][1], s.goal[p]); }
  // p 입장 평가 (p 차례가 아닐 수도)
  function evalS(s, p) {
    if (s.win) return s.win.winner === p ? 10000 : -10000;
    var me = dd(s, p), op = dd(s, 1 - p), tempo = s.turn === p ? 0.5 : -0.5;
    return (op - me + tempo) * 10 + (s.walls[p] - s.walls[1 - p]) * 1.2 - me * 0.3;
  }
  function bestStep(s, p) {
    var map = distMap(s.h, s.v, s.goal[p]), ms = pawnMoves(s, p), best = null, bv = Infinity;
    for (var i = 0; i < ms.length; i++) { var dv = map[ms[i].r * 9 + ms[i].c] + Math.random() * 0.1; if (dv < bv) { bv = dv; best = ms[i]; } }
    return best;
  }
  // 벽 후보: 상대 최단 경로 위 칸 주변 + 내 말 주변 (가지치기)
  function wallCands(s, p) {
    var opp = 1 - p, map = distMap(s.h, s.v, s.goal[opp]), seen = {}, out = [];
    var r = s.pos[opp][0], c = s.pos[opp][1], path = [[r, c]], guard = 0;
    while (map[r * 9 + c] > 0 && guard++ < 81) {
      var moved = false;
      for (var k = 0; k < 4 && !moved; k++) { var dr = D4[k][0], dc = D4[k][1]; if (blocked(s.h, s.v, r, c, dr, dc)) continue; var y = (r + dr) * 9 + c + dc; if (map[y] === map[r * 9 + c] - 1) { r += dr; c += dc; path.push([r, c]); moved = true; } }
      if (!moved) break;
    }
    path.push(s.pos[p]);
    function add(t, rr, cc) { var key = t + rr * 8 + cc; if (seen[key]) return; seen[key] = 1; if (wallLegal(s, t, rr, cc)) out.push({ t: t, r: rr, c: cc }); }
    for (var i = 0; i < path.length && i < 7; i++) {
      var pr = path[i][0], pc = path[i][1];
      for (var a = -1; a <= 0; a++) for (var b = -1; b <= 0; b++) { add('h', pr + a, pc + b); add('v', pr + a, pc + b); }
    }
    return out;
  }
  function gen(s, wallsToo) {
    var p = s.turn, ms = pawnMoves(s, p);
    if (wallsToo && s.walls[p] > 0) ms = ms.concat(wallCands(s, p));
    return ms;
  }
  function negamax(s, depth, alpha, beta, deadline) {
    if ((++nodes & 255) === 0 && Date.now() > deadline) throw TIMEOUT;
    if (s.win || depth === 0) return evalS(s, s.turn);
    var ms = gen(s, true), best = -Infinity;
    // 정렬: 빠른 평가
    var sc = ms.map(function (m) { var n = play(s, m); return { m: m, n: n, v: -evalS(n, n.turn) }; });
    sc.sort(function (a, b) { return b.v - a.v; });
    if (sc.length > 14) sc = sc.slice(0, 14);
    for (var i = 0; i < sc.length; i++) {
      var n = sc[i].n, v = n.win ? 10000 + depth : -negamax(n, depth - 1, -beta, -alpha, deadline);
      if (v > best) best = v; if (v > alpha) alpha = v; if (alpha >= beta) break;
    }
    return best;
  }
  function ai(s, level) {
    var p = s.turn;
    // 바로 이기는 이동
    var pm = pawnMoves(s, p);
    for (var i = 0; i < pm.length; i++) if (pm[i].r === s.goal[p]) return pm[i];
    if (level === 'easy') {
      if (s.walls[p] > 0 && Math.random() < 0.12) {
        var wc = wallCands(s, p);
        if (wc.length) return wc[(Math.random() * wc.length) | 0];
      }
      if (Math.random() < 0.1) return pm[(Math.random() * pm.length) | 0];
      return bestStep(s, p);
    }
    var ms = gen(s, true), scored = ms.map(function (m) { return { m: m, n: play(s, m) }; });
    if (level === 'normal') {
      // 1~2수: 내 수 → 상대의 가장 좋은 이동/벽 응수 (벽 후보는 적게)
      var bv = -Infinity, bm = bestStep(s, p);
      scored.forEach(function (x) { x.v = evalS(x.n, p); });
      scored.sort(function (a, b) { return b.v - a.v; });
      scored.slice(0, 10).forEach(function (x) {
        var v;
        if (x.n.win) v = 10000;
        else {
          var rep = gen(x.n, true), worst = Infinity;
          rep.forEach(function (rm) { var e = evalS(play(x.n, rm), p); if (e < worst) worst = e; });
          v = worst + Math.random() * 0.5;
        }
        if (v > bv) { bv = v; bm = x.m; }
      });
      return bm;
    }
    // hard: alpha-beta 반복 심화 (2→3수)
    var deadline = Date.now() + 1500, best = bestStep(s, p);
    scored.forEach(function (x) { x.v = evalS(x.n, p); });
    scored.sort(function (a, b) { return b.v - a.v; });
    var root = scored.slice(0, 18);
    for (var depth = 2; depth <= 3; depth++) {
      try {
        var alpha = -Infinity, bmv = root[0].m;
        for (var k = 0; k < root.length; k++) {
          var n = root[k].n, v = n.win ? 20000 : -negamax(n, depth - 1, -Infinity, -alpha, deadline);
          if (v > alpha) { alpha = v; bmv = root[k].m; }
        }
        best = bmv;
      } catch (e) { if (e !== TIMEOUT) throw e; break; }
    }
    return best;
  }
  var R = { id: 'quoridor', init: init, moves: moves, legal: legal, play: play, over: over, ai: ai, pawnMoves: pawnMoves, wallLegal: wallLegal, wallFits: wallFits, dist: dist };
  (root.NadooRules = root.NadooRules || {}).quoridor = R;
  if (typeof module !== 'undefined' && module.exports) module.exports = R;
})(typeof self !== 'undefined' ? self : globalThis);
