/* 나두 PC 대국 - 바둑 9x9. 따내기, 패(바로 되따내기 금지), 자충수 금지(따낼 수 있으면 허용), 통과(패스), 연속 두 번 통과하면 끝.
 * 계가: 판 위 내 돌 + 내 돌로만 둘러싼 빈 점(중국식 계가, 가이드 '해외 규칙' 참고), 백 덤 7.5.
 * 끝났을 때 죽은 돌(사석)은 무작위 끝내기 시뮬레이션으로 추정해 들어냄. 250수가 되면 그 자리에서 계가.
 * 칸 = 행*9 + 열, move = 칸 번호 또는 -1(통과). state.turn 0 = 흑(먼저), 돌 값 1 흑 2 백. */
(function (root) {
  'use strict';
  var N = 9, NN = 81, KOMI = 7.5, LIMIT = 250;
  var NB = [], DG = [];
  for (var i0 = 0; i0 < NN; i0++) {
    var r0 = (i0 / N) | 0, c0 = i0 % N, a = [], d = [];
    if (r0 > 0) a.push(i0 - N); if (r0 < N - 1) a.push(i0 + N); if (c0 > 0) a.push(i0 - 1); if (c0 < N - 1) a.push(i0 + 1);
    [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(function (x) { var rr = r0 + x[0], cc = c0 + x[1]; if (rr >= 0 && rr < N && cc >= 0 && cc < N) d.push(rr * N + cc); });
    NB.push(a); DG.push(d);
  }
  var mark = new Int32Array(NN), lmark = new Int32Array(NN), stamp = 1, stack = new Int32Array(NN), stones = new Int32Array(NN), gN = 0;
  function libs(c, p, max) {
    var col = c[p], sp = 0, n = 0, L = 0; stamp++;
    stack[sp++] = p; mark[p] = stamp;
    while (sp) {
      var x = stack[--sp], nb = NB[x]; stones[n++] = x;
      for (var k = 0; k < nb.length; k++) {
        var y = nb[k], v = c[y];
        if (v === 0) { if (lmark[y] !== stamp) { lmark[y] = stamp; L++; if (L >= max) { gN = -1; return L; } } }
        else if (v === col && mark[y] !== stamp) { mark[y] = stamp; stack[sp++] = y; }
      }
    }
    gN = n; return L;
  }
  function legalAt(c, p, col, ko) {
    if (c[p] || p === ko) return false;
    var nb = NB[p], k, opp = 3 - col;
    for (k = 0; k < nb.length; k++) if (c[nb[k]] === 0) return true;
    for (k = 0; k < nb.length; k++) { var v = c[nb[k]]; if (v === opp && libs(c, nb[k], 2) === 1) return true; if (v === col && libs(c, nb[k], 2) >= 2) return true; }
    return false;
  }
  // 돌 놓기 (c 직접 변경). 반환: 새 패 자리 (없으면 -1). capOut[0] = 따낸 수
  var capOut = [0];
  function place(c, p, col) {
    var opp = 3 - col, nb = NB[p], caps = 0, lastCap = -1;
    c[p] = col;
    for (var k = 0; k < nb.length; k++) {
      var y = nb[k];
      if (c[y] === opp && libs(c, y, 1) === 0) { for (var j = 0; j < gN; j++) { c[stones[j]] = 0; } caps += gN; lastCap = y; }
    }
    capOut[0] = caps;
    if (caps === 1) { var L = libs(c, p, 3); if (gN === 1 && L === 1) return lastCap; }
    return -1;
  }
  function isEye(c, p, col) {
    var nb = NB[p], k; for (k = 0; k < nb.length; k++) if (c[nb[k]] !== col) return false;
    var dg = DG[p], bad = 0; for (k = 0; k < dg.length; k++) if (c[dg[k]] === 3 - col) bad++;
    return dg.length < 4 ? bad === 0 : bad < 2;
  }
  function init() { var b = []; for (var i = 0; i < NN; i++) b.push(0); return { b: b, turn: 0, ko: -1, passes: 0, caps: [0, 0], last: null, win: null, plies: 0 }; }
  function moves(s) {
    if (s.win) return [];
    var c = Int8Array.from(s.b), col = s.turn + 1, out = [];
    for (var p = 0; p < NN; p++) if (legalAt(c, p, col, s.ko)) out.push(p);
    out.push(-1); return out;
  }
  function legal(s, m) { if (s.win) return false; if (m === -1) return true; return m >= 0 && m < NN && legalAt(Int8Array.from(s.b), m, s.turn + 1, s.ko); }
  function play(s, m) {
    var c = Int8Array.from(s.b), col = s.turn + 1, ko = -1, caps = s.caps.slice(), passes = 0;
    if (m === -1) passes = s.passes + 1;
    else { ko = place(c, m, col); caps[s.turn] += capOut[0]; }
    var n = { b: Array.prototype.slice.call(c), turn: 1 - s.turn, ko: ko, passes: passes, caps: caps, last: { m: m, by: s.turn, cap: m === -1 ? 0 : capOut[0] }, win: null, plies: s.plies + 1 };
    if (passes >= 2 || n.plies >= LIMIT) n.win = finalScore(n);
    return n;
  }
  function over(s) { return s.win; }

  // ---- 무작위 끝내기 (MCTS용) ----
  var emp = new Int32Array(NN), firstBy = new Int8Array(NN);
  function playout(c, col, ko, heur, maxMoves) {
    var passes = 0, moves = 0, last = -1;
    while (passes < 2 && moves < maxMoves) {
      var ne = 0, p, found = -1;
      if (heur && last >= 0) { // 방금 수 주변의 단수(활로 1) 돌 따내기·살리기
        var nb = NB[last];
        for (var k = 0; k < nb.length && found < 0; k++) {
          var y = nb[k]; if (!c[y]) continue;
          if (libs(c, y, 2) === 1) { // 활로 하나 찾기
            for (var j = 0; j < gN; j++) { var sn = NB[stones[j]]; for (var q = 0; q < sn.length; q++) if (!c[sn[q]]) { p = sn[q]; j = gN; break; } }
            if (legalAt(c, p, col, ko) && !isEye(c, p, col)) found = p;
          }
        }
      }
      if (found < 0) {
        for (p = 0; p < NN; p++) if (!c[p]) emp[ne++] = p;
        while (ne > 0) {
          var r = (Math.random() * ne) | 0; p = emp[r];
          if (!isEye(c, p, col) && legalAt(c, p, col, ko)) { found = p; break; }
          emp[r] = emp[--ne];
        }
      }
      if (found < 0) { passes++; ko = -1; last = -1; }
      else { passes = 0; ko = place(c, found, col); if (!firstBy[found]) firstBy[found] = col; last = found; }
      col = 3 - col; moves++;
    }
  }
  function quickArea(c) { // 끝내기 후: 돌 + 한 색으로만 둘러싼 빈 점
    var b = 0, w = 0;
    for (var p = 0; p < NN; p++) {
      var v = c[p];
      if (v === 1) b++; else if (v === 2) w++;
      else { var nb = NB[p], sb = false, sw = false; for (var k = 0; k < nb.length; k++) { if (c[nb[k]] === 1) sb = true; else if (c[nb[k]] === 2) sw = true; } if (sb && !sw) b++; else if (sw && !sb) w++; }
    }
    return b - w - KOMI;
  }
  function owner(c, p) { var v = c[p]; if (v) return v; var nb = NB[p], sb = false, sw = false; for (var k = 0; k < nb.length; k++) { if (c[nb[k]] === 1) sb = true; else if (c[nb[k]] === 2) sw = true; } return sb && !sw ? 1 : sw && !sb ? 2 : 0; }
  // 사석 추정 → 영역 계가
  function finalScore(s) {
    var base = Int8Array.from(s.b), own = new Float32Array(NN * 3), T = 160, p, t;
    for (t = 0; t < T; t++) { var c = Int8Array.from(base); firstBy.fill(0); playout(c, (t & 1) + 1, -1, true, 200); for (p = 0; p < NN; p++) own[p * 3 + owner(c, p)]++; }
    var c2 = Int8Array.from(base), dead = [];
    for (p = 0; p < NN; p++) if (base[p] && own[p * 3 + base[p]] / T < 0.35) { dead.push(p); c2[p] = 0; }
    // 영역 계가 (빈 영역을 칠해서 한 색에만 닿으면 그 색 집)
    var sc = [0, 0, 0], seen = new Int8Array(NN);
    for (p = 0; p < NN; p++) {
      if (c2[p]) { sc[c2[p]]++; continue; }
      if (seen[p]) continue;
      var st = [p], reg = [], tb = false, tw = false; seen[p] = 1;
      while (st.length) { var x = st.pop(); reg.push(x); NB[x].forEach(function (y) { if (c2[y] === 0) { if (!seen[y]) { seen[y] = 1; st.push(y); } } else if (c2[y] === 1) tb = true; else tw = true; }); }
      if (tb && !tw) sc[1] += reg.length; else if (tw && !tb) sc[2] += reg.length;
    }
    var diff = sc[1] - sc[2] - KOMI;
    return { winner: diff > 0 ? 0 : 1, score: [sc[1], sc[2] + KOMI], dead: dead, why: s.passes >= 2 ? 'pass' : 'limit' };
  }

  // ---- AI ----
  function meaningful(c, col, ko) { var out = []; for (var p = 0; p < NN; p++) if (!c[p] && !isEye(c, p, col) && legalAt(c, p, col, ko)) out.push(p); return out; }
  function easy(s) {
    var c = Int8Array.from(s.b), col = s.turn + 1, opp = 3 - col, ms = meaningful(c, col, s.ko);
    if (!ms.length) return -1;
    if (s.passes && Math.random() < 0.6) return -1;
    var best = [], bv = -1e9;
    ms.forEach(function (p) {
      var v = Math.random() * 3, nb = NB[p], r = (p / N) | 0, cc = p % N, edge = Math.min(r, cc, N - 1 - r, N - 1 - cc);
      for (var k = 0; k < nb.length; k++) {
        var y = nb[k];
        if (c[y] === opp) { var L = libs(c, y, 3); if (L === 1) v += 20 + gN; else if (L === 2) v += 3; v += 1; }
        else if (c[y] === col) { if (libs(c, y, 3) === 1) v += 12; v += 0.5; }
      }
      if (edge === 0) v -= 2; else if (edge >= 2) v += 1;
      if (v > bv) { bv = v; best = [p]; } else if (v === bv) best.push(p);
    });
    return best[(Math.random() * best.length) | 0];
  }
  function mcts(s, ms, rave, heur) {
    var col = s.turn + 1, base = Int8Array.from(s.b), deadline = Date.now() + ms;
    var root = { m: -2, n: 0, w: 0, an: 0, aw: 0, kids: null, col: 3 - col }, ownAcc = new Float32Array(NN), sims = 0;
    function expand(node, c, toPlay, ko) {
      node.kids = [];
      for (var p = 0; p < NN; p++) if (!c[p] && !isEye(c, p, toPlay) && legalAt(c, p, toPlay, ko)) node.kids.push({ m: p, n: 0, w: 0, an: 0, aw: 0, kids: null, col: toPlay });
    }
    var path = [];
    while (Date.now() < deadline || sims < 50) {
      for (var batch = 0; batch < 8; batch++) {
        var c = Int8Array.from(base), node = root, toPlay = col, ko = s.ko;
        path.length = 0; path.push(root); firstBy.fill(0);
        while (node.kids && node.kids.length) {
          var best = null, bv = -1, lnN = Math.log(node.n + 1);
          for (var i = 0; i < node.kids.length; i++) {
            var ch = node.kids[i], q;
            if (rave) {
              var beta = ch.an / (ch.n + ch.an + 4 * ch.n * ch.an * 0.0004 + 1e-9), qm = ch.n ? ch.w / ch.n : 0.5, qa = ch.an ? ch.aw / ch.an : 0.5;
              q = (ch.n || ch.an) ? (1 - beta) * qm + beta * qa : 0.5;
              q += 0.15 * Math.sqrt(lnN / (ch.n + 1));
            } else q = ch.n ? ch.w / ch.n + 0.9 * Math.sqrt(lnN / ch.n) : 10 + Math.random();
            if (q > bv) { bv = q; best = ch; }
          }
          node = best; ko = place(c, node.m, toPlay); if (!firstBy[node.m]) firstBy[node.m] = toPlay; toPlay = 3 - toPlay; path.push(node);
          if (node.n === 0) break;
        }
        if (!node.kids && node.n >= 1) { expand(node, c, toPlay, ko); }
        else if (node === root && !root.kids) expand(root, c, toPlay, ko);
        playout(c, toPlay, ko, heur, 160);
        var res = quickArea(c), winner = res > 0 ? 1 : 2; sims++;
        for (var p2 = 0; p2 < NN; p2++) { var o = owner(c, p2); if (o === col) ownAcc[p2]++; else if (o === 3 - col) ownAcc[p2]--; }
        for (var j = 0; j < path.length; j++) {
          var nd = path[j]; nd.n++; if (winner === nd.col) nd.w++;
          if (rave && nd.kids) for (var k2 = 0; k2 < nd.kids.length; k2++) { var kk = nd.kids[k2]; if (firstBy[kk.m] === kk.col) { kk.an++; if (winner === kk.col) kk.aw++; } }
        }
      }
    }
    var top = null; (root.kids || []).forEach(function (k) { if (!top || k.n > top.n) top = k; });
    return { move: top ? top.m : -1, rate: top && top.n ? top.w / top.n : 0, own: ownAcc, sims: sims };
  }
  function ai(s, level) {
    var c = Int8Array.from(s.b), col = s.turn + 1, ms = meaningful(c, col, s.ko);
    if (!ms.length) return -1;
    if (level === 'easy') return easy(s);
    var r = mcts(s, level === 'hard' ? 1300 : 600, level === 'hard', level === 'hard');
    if (r.move < 0) return -1;
    var sure = r.own[r.move] / Math.max(1, r.sims); // 이미 확실한 내 집 안이면 의미 없는 수
    if (s.passes && (r.rate > 0.6 || r.rate < 0.1)) return -1; // 상대가 통과: 이기고 있거나 희망이 없으면 끝내기
    if (r.rate > 0.97 && sure > 0.9) return -1;
    if (r.rate < 0.03 && s.plies > 60) return -1;
    return r.move;
  }
  var R = { id: 'baduk', N: N, KOMI: KOMI, init: init, moves: moves, legal: legal, play: play, over: over, ai: ai };
  (root.NadooRules = root.NadooRules || {}).baduk = R;
  if (typeof module !== 'undefined' && module.exports) module.exports = R;
})(typeof self !== 'undefined' ? self : globalThis);
