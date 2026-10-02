/* 나두 PC 대국 - 오목 규칙 + AI (15x15, 자유 규칙: 5개 이상 이으면 승리, 렌주 금수 없음)
 * 브라우저(Web Worker)와 node 테스트에서 함께 씀. state.turn: 0=흑(먼저), 1=백. 돌 값 = turn+1 */
(function (root) {
  'use strict';
  var N = 15, NN = N * N, DIRS = [[0, 1], [1, 0], [1, 1], [1, -1]];
  var FIVE = 6, OPEN4 = 5, FOUR = 4, OPEN3 = 3, C3 = 2, OPEN2 = 1, C2 = 0.5;
  var VAL = { 6: 1000000, 5: 100000, 4: 12000, 3: 6000, 2: 600, 1: 300, 0.5: 40 };

  function init() { var b = []; for (var i = 0; i < NN; i++) b.push(0); return { b: b, turn: 0, last: -1, n: 0, win: null, line: null }; }
  function moves(s) { if (s.win) return []; var m = []; for (var i = 0; i < NN; i++) if (!s.b[i]) m.push(i); return m; }
  function at(b, r, c) { return r < 0 || r >= N || c < 0 || c >= N ? -1 : b[r * N + c]; }
  function fiveLine(b, i, col) {
    var r = (i / N) | 0, c = i % N;
    for (var d = 0; d < 4; d++) {
      var dr = DIRS[d][0], dc = DIRS[d][1], a = 0, z = 0;
      while (at(b, r - (a + 1) * dr, c - (a + 1) * dc) === col) a++;
      while (at(b, r + (z + 1) * dr, c + (z + 1) * dc) === col) z++;
      if (a + z + 1 >= 5) return [(r - a * dr) * N + (c - a * dc), (r + z * dr) * N + (c + z * dc)];
    }
    return null;
  }
  function legal(s, mv) { return !s.win && mv >= 0 && mv < NN && !s.b[mv]; }
  function play(s, mv) {
    var b = s.b.slice(), col = s.turn + 1; b[mv] = col;
    var n = s.n + 1, ln = fiveLine(b, mv, col);
    return { b: b, turn: 1 - s.turn, last: mv, n: n, line: ln, win: ln ? { winner: s.turn } : (n >= NN ? { winner: -1 } : null) };
  }
  function over(s) { return s.win; }

  // 한 방향 모양 (i 자리에 col 돌이 있다고 보고)
  function dirShape(b, r, c, dr, dc, col) {
    var cnt = 1, k, sides = [];
    for (var sd = -1; sd <= 1; sd += 2) {
      k = 1; while (at(b, r + sd * k * dr, c + sd * k * dc) === col) { cnt++; k++; }
      var open = at(b, r + sd * k * dr, c + sd * k * dc) === 0, gap = 0, gopen = false, far = false;
      if (open) {
        var k2 = k + 1; while (at(b, r + sd * k2 * dr, c + sd * k2 * dc) === col) { gap++; k2++; }
        var e = at(b, r + sd * k2 * dr, c + sd * k2 * dc); gopen = e === 0;
        far = gap === 0 && e === 0; // 두 칸 이상 비어 있음
      }
      sides.push({ open: open, gap: gap, gopen: gopen, far: far });
    }
    var L = sides[0], R = sides[1];
    if (cnt >= 5) return FIVE;
    if (cnt === 4) return L.open && R.open ? OPEN4 : (L.open || R.open ? FOUR : 0);
    var g = Math.max(L.open ? L.gap : 0, R.open ? R.gap : 0);
    if (cnt + g >= 4 && g > 0) {
      // 빈칸 하나 메우면 5 (xxx.x, xx.xx, x.xxx)
      var four = (L.open && L.gap && cnt + L.gap >= 4) + (R.open && R.gap && cnt + R.gap >= 4);
      return four >= 2 ? OPEN4 : FOUR;
    }
    if (cnt === 3) {
      if (L.open && R.open) return (L.far || R.far) ? OPEN3 : C3;
      return (L.open || R.open) ? C3 : 0;
    }
    if (cnt === 2) {
      if (L.open && R.open) {
        if ((L.gap === 1 && L.gopen) || (R.gap === 1 && R.gopen)) return OPEN3;
        if (L.gap === 1 || R.gap === 1) return C3;
        return (L.far || R.far) ? OPEN2 : C2;
      }
      if ((L.open && L.gap === 1) || (R.open && R.gap === 1)) return C3;
      return (L.open || R.open) ? C2 : 0;
    }
    // cnt 1
    if (L.open && R.open) {
      if ((L.gap === 2 && L.gopen) || (R.gap === 2 && R.gopen)) return OPEN3;
      if (L.gap === 2 || R.gap === 2) return C3;
      if ((L.gap === 1 && L.gopen) || (R.gap === 1 && R.gopen)) return OPEN2;
    }
    return 0;
  }
  // 빈 자리 i에 col을 두었을 때의 공격 점수
  function pointScore(b, i, col) {
    var r = (i / N) | 0, c = i % N, sum = 0, f4 = 0, o3 = 0, five = false;
    for (var d = 0; d < 4; d++) {
      var sh = dirShape(b, r, c, DIRS[d][0], DIRS[d][1], col);
      if (sh === FIVE) five = true; else if (sh === OPEN4 || sh === FOUR) f4 += sh === OPEN4 ? 2 : 1; else if (sh === OPEN3) o3++;
      sum += VAL[sh] || 0;
    }
    if (five) return VAL[FIVE];
    if (f4 >= 2 || (f4 >= 1 && o3 >= 1)) sum += 90000; // 4-4, 4-3 → 사실상 승리
    else if (o3 >= 2) sum += 40000; // 3-3 (자유 규칙이라 허용)
    return sum;
  }
  function candidates(b, n) {
    var out = [];
    if (n === 0) return [7 * N + 7];
    for (var i = 0; i < NN; i++) {
      if (b[i]) continue;
      var r = (i / N) | 0, c = i % N, near = false;
      for (var dr = -2; dr <= 2 && !near; dr++) for (var dc = -2; dc <= 2; dc++) { var v = at(b, r + dr, c + dc); if (v > 0) { near = true; break; } }
      if (near) out.push(i);
    }
    return out;
  }
  function scored(b, n, col, defW) {
    var opp = 3 - col, cs = candidates(b, n), arr = [];
    for (var k = 0; k < cs.length; k++) {
      var i = cs[k], a = pointScore(b, i, col), d = pointScore(b, i, opp);
      arr.push({ i: i, a: a, d: d, s: a + d * defW });
    }
    arr.sort(function (x, y) { return y.s - x.s; });
    return arr;
  }
  // 판 전체 평가 (col 입장, col 차례)
  function evalBoard(b, col) {
    var my = 0, op = 0, myF = 0, opF = 0, opO4 = 0;
    for (var i = 0; i < NN; i++) {
      var v = b[i]; if (v <= 0) continue;
      var r = (i / N) | 0, c = i % N;
      for (var d = 0; d < 4; d++) {
        var dr = DIRS[d][0], dc = DIRS[d][1];
        if (at(b, r - dr, c - dc) === v) continue; // 줄의 시작 돌만
        var sh = dirShape(b, r, c, dr, dc, v), val = VAL[sh] || 0;
        if (v === col) { my += val; if (sh >= FOUR) myF++; } else { op += val; if (sh >= FOUR) opF++; if (sh === OPEN4) opO4++; }
      }
    }
    if (myF) return 500000; // 내 차례에 4가 있으면 다음 수에 5
    if (opO4 || opF >= 2) return -400000;
    return my * 1.1 - op;
  }
  function pickTop(arr, tol) {
    var best = arr[0].s, pool = arr.filter(function (x) { return x.s >= best * (1 - tol); });
    return pool[(Math.random() * pool.length) | 0].i;
  }
  // VCF: 4를 계속 만들어 이기는 수순 찾기
  function vcf(b, col, depth, deadline) {
    if (depth <= 0 || Date.now() > deadline) return -1;
    var opp = 3 - col, cs = candidates(b, 1);
    for (var k = 0; k < cs.length; k++) {
      var i = cs[k], r = (i / N) | 0, c = i % N, makes4 = false;
      for (var d = 0; d < 4; d++) { var sh = dirShape(b, r, c, DIRS[d][0], DIRS[d][1], col); if (sh === FIVE) return i; if (sh >= FOUR) makes4 = true; }
      if (!makes4) continue;
      b[i] = col;
      // 상대가 막아야 할 자리(내가 5를 만드는 자리)
      var wins = [];
      for (var j = 0; j < NN && wins.length < 2; j++) if (!b[j]) { b[j] = col; if (fiveLine(b, j, col)) wins.push(j); b[j] = 0; }
      var ok = false;
      if (wins.length >= 2) ok = true;
      else if (wins.length === 1) {
        var bl = wins[0];
        b[bl] = opp;
        // 막는 수로 상대가 5를 만들면 실패, 상대가 4를 만들었으면 실패로 봄(단순화)
        var oppThreat = fiveLine(b, bl, opp) || hasFive(b, opp);
        if (!oppThreat && vcf(b, col, depth - 1, deadline) >= 0) ok = true;
        b[bl] = 0;
      }
      b[i] = 0;
      if (ok) return i;
    }
    return -1;
  }
  function hasFive(b, col) {
    for (var j = 0; j < NN; j++) if (!b[j]) { b[j] = col; var f = fiveLine(b, j, col); b[j] = 0; if (f) return true; }
    return false;
  }
  var TIMEOUT = {};
  function negamax(b, n, col, depth, alpha, beta, deadline, width) {
    if (Date.now() > deadline) throw TIMEOUT;
    if (depth === 0) return evalBoard(b, col);
    var arr = scored(b, n, col, 0.9);
    if (!arr.length) return 0;
    if (arr[0].a >= VAL[FIVE]) return 900000 + depth;
    var forced = arr.filter(function (x) { return x.d >= VAL[FIVE]; });
    var list = forced.length ? forced.slice(0, 1) : arr.slice(0, width);
    var best = -Infinity;
    for (var k = 0; k < list.length; k++) {
      var i = list[k].i; b[i] = col;
      var v = -negamax(b, n + 1, 3 - col, depth - 1, -beta, -alpha, deadline, Math.max(6, width - 2));
      b[i] = 0;
      if (v > best) best = v;
      if (v > alpha) alpha = v;
      if (alpha >= beta) break;
    }
    return best;
  }
  function ai(s, level) {
    var b = s.b.slice(), col = s.turn + 1, n = s.n;
    if (n === 0) return 7 * N + 7;
    var arr = scored(b, n, col, level === 'easy' ? 0.45 : 0.9);
    if (arr[0].a >= VAL[FIVE]) return arr[0].i; // 이기는 수
    var block = arr.filter(function (x) { return x.d >= VAL[FIVE]; });
    if (level === 'easy') {
      if (block.length && Math.random() < 0.75) return block[0].i;
      if (Math.random() < 0.4) return arr[(Math.random() * Math.min(8, arr.length)) | 0].i;
      return pickTop(arr, 0.15);
    }
    if (block.length) return block[0].i;
    if (level === 'normal') return pickTop(arr, 0.03);
    // hard
    var deadline = Date.now() + 1100;
    var w = vcf(b, col, 8, Date.now() + 350);
    if (w >= 0) return w;
    var bestMove = arr[0].i, root = arr.slice(0, 12);
    for (var depth = 2; depth <= 6; depth++) {
      try {
        var bm = -1, bv = -Infinity, alpha = -Infinity;
        for (var k = 0; k < root.length; k++) {
          var i = root[k].i; b[i] = col;
          var v = -negamax(b, n + 1, 3 - col, depth - 1, -Infinity, -alpha, deadline, 9);
          b[i] = 0;
          if (v > bv) { bv = v; bm = i; }
          if (v > alpha) alpha = v;
        }
        bestMove = bm;
        if (bv >= 900000) break;
      } catch (e) { if (e !== TIMEOUT) throw e; for (var q = 0; q < NN; q++) b[q] = s.b[q]; break; }
    }
    return bestMove;
  }
  var R = { id: 'omok', N: N, init: init, moves: moves, legal: legal, play: play, over: over, ai: ai, fiveLine: fiveLine };
  (root.NadooRules = root.NadooRules || {}).omok = R;
  if (typeof module !== 'undefined' && module.exports) module.exports = R;
})(typeof self !== 'undefined' ? self : globalThis);
