/* 나두 PC 대국 - 체스 규칙 + 자체 알파-베타 엔진 (외부 엔진 없음).
 * 칸 번호 i = 행*8 + 열, 0행 = 8랭크(위), 7행 = 1랭크. 기물: 1폰 2나이트 3비숍 4룩 5퀸 6킹, 흑은 +8. state.turn 0 = 백(먼저), 1 = 흑.
 * 캐슬링·앙파상·프로모션(선택 가능, 기본 퀸)·체크메이트·스테일메이트·50수·3회 반복·기물 부족 무승부. move = {f, t, p(승격 기물, 없으면 0)} */
(function (root) {
  'use strict';
  var P = 1, N = 2, B = 3, Rk = 4, Q = 5, K = 6;
  var KN = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
  var KG = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  var DIAG = [[-1, -1], [-1, 1], [1, -1], [1, 1]], ORTH = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  function col(p) { return p >> 3; } function typ(p) { return p & 7; }
  function init() {
    var b = [], back = [Rk, N, B, Q, K, B, N, Rk], i;
    for (i = 0; i < 64; i++) b.push(0);
    for (i = 0; i < 8; i++) { b[i] = back[i] + 8; b[8 + i] = P + 8; b[48 + i] = P; b[56 + i] = back[i]; }
    var s = { b: b, turn: 0, castle: 15, ep: -1, half: 0, full: 1, reps: {}, last: null, win: null, check: false };
    s.reps[key(s)] = 1; return s;
  }
  function key(s) { return s.b.join(',') + '|' + s.turn + s.castle + '|' + s.ep; }
  function on(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }
  function attacked(b, sq, by) { // by 색이 sq를 공격하나
    var r = sq >> 3, c = sq & 7, i, rr, cc, p;
    var pr = by === 0 ? r + 1 : r - 1; // 백 폰은 아래(행+1)에서 위를 공격
    for (i = -1; i <= 1; i += 2) { cc = c + i; if (on(pr, cc)) { p = b[pr * 8 + cc]; if (p && typ(p) === P && col(p) === by) return true; } }
    for (i = 0; i < 8; i++) { rr = r + KN[i][0]; cc = c + KN[i][1]; if (on(rr, cc)) { p = b[rr * 8 + cc]; if (p && typ(p) === N && col(p) === by) return true; } }
    for (i = 0; i < 8; i++) { rr = r + KG[i][0]; cc = c + KG[i][1]; if (on(rr, cc)) { p = b[rr * 8 + cc]; if (p && typ(p) === K && col(p) === by) return true; } }
    for (i = 0; i < 4; i++) {
      rr = r + DIAG[i][0]; cc = c + DIAG[i][1];
      while (on(rr, cc)) { p = b[rr * 8 + cc]; if (p) { if (col(p) === by && (typ(p) === B || typ(p) === Q)) return true; break; } rr += DIAG[i][0]; cc += DIAG[i][1]; }
      rr = r + ORTH[i][0]; cc = c + ORTH[i][1];
      while (on(rr, cc)) { p = b[rr * 8 + cc]; if (p) { if (col(p) === by && (typ(p) === Rk || typ(p) === Q)) return true; break; } rr += ORTH[i][0]; cc += ORTH[i][1]; }
    }
    return false;
  }
  function kingSq(b, c) { for (var i = 0; i < 64; i++) if (b[i] === K + c * 8) return i; return -1; }
  // 의사 합법수 (킹 안전 확인 전)
  function pseudo(b, me, castle, ep, capsOnly) {
    var out = [], i, j, r, c, rr, cc, p, q, t, dirs;
    for (i = 0; i < 64; i++) {
      p = b[i]; if (!p || col(p) !== me) continue;
      t = typ(p); r = i >> 3; c = i & 7;
      if (t === P) {
        var dr = me === 0 ? -1 : 1, start = me === 0 ? 6 : 1, last = me === 0 ? 0 : 7;
        rr = r + dr;
        if (!capsOnly && on(rr, c) && !b[rr * 8 + c]) {
          if (rr === last) { out.push({ f: i, t: rr * 8 + c, p: Q }); out.push({ f: i, t: rr * 8 + c, p: N }); out.push({ f: i, t: rr * 8 + c, p: Rk }); out.push({ f: i, t: rr * 8 + c, p: B }); }
          else { out.push({ f: i, t: rr * 8 + c, p: 0 }); if (r === start && !b[(r + 2 * dr) * 8 + c]) out.push({ f: i, t: (r + 2 * dr) * 8 + c, p: 0 }); }
        }
        for (j = -1; j <= 1; j += 2) {
          cc = c + j; if (!on(rr, cc)) continue; var to = rr * 8 + cc; q = b[to];
          if ((q && col(q) !== me) || to === ep) {
            if (rr === last) { out.push({ f: i, t: to, p: Q }); if (!capsOnly) { out.push({ f: i, t: to, p: N }); out.push({ f: i, t: to, p: Rk }); out.push({ f: i, t: to, p: B }); } }
            else out.push({ f: i, t: to, p: 0 });
          }
        }
        continue;
      }
      if (t === N || t === K) {
        dirs = t === N ? KN : KG;
        for (j = 0; j < 8; j++) { rr = r + dirs[j][0]; cc = c + dirs[j][1]; if (!on(rr, cc)) continue; q = b[rr * 8 + cc]; if (q ? col(q) !== me : !capsOnly) out.push({ f: i, t: rr * 8 + cc, p: 0 }); }
        if (t === K && !capsOnly) {
          var home = me === 0 ? 60 : 4, opp = 1 - me;
          if (i === home && !attacked(b, i, opp)) {
            if ((castle & (me === 0 ? 1 : 4)) && !b[i + 1] && !b[i + 2] && b[i + 3] === Rk + me * 8 && !attacked(b, i + 1, opp) && !attacked(b, i + 2, opp)) out.push({ f: i, t: i + 2, p: 0 });
            if ((castle & (me === 0 ? 2 : 8)) && !b[i - 1] && !b[i - 2] && !b[i - 3] && b[i - 4] === Rk + me * 8 && !attacked(b, i - 1, opp) && !attacked(b, i - 2, opp)) out.push({ f: i, t: i - 2, p: 0 });
          }
        }
        continue;
      }
      dirs = t === B ? DIAG : t === Rk ? ORTH : KG;
      for (j = 0; j < dirs.length; j++) {
        rr = r + dirs[j][0]; cc = c + dirs[j][1];
        while (on(rr, cc)) { q = b[rr * 8 + cc]; if (q) { if (col(q) !== me) out.push({ f: i, t: rr * 8 + cc, p: 0 }); break; } if (!capsOnly) out.push({ f: i, t: rr * 8 + cc, p: 0 }); rr += dirs[j][0]; cc += dirs[j][1]; }
      }
    }
    return out;
  }
  // 수 두기 (배열 직접 변경). 반환: {castle, ep, cap}
  function make(b, m, castle) {
    var p = b[m.f], t = typ(p), me = col(p), cap = b[m.t], ep = -1;
    b[m.t] = m.p ? m.p + me * 8 : p; b[m.f] = 0;
    if (t === P) {
      if (!cap && (m.t & 7) !== (m.f & 7)) { var epSq = m.f - (m.f & 7) + (m.t & 7); cap = b[epSq]; b[epSq] = 0; }
      if (Math.abs(m.t - m.f) === 16) ep = (m.f + m.t) >> 1;
    }
    if (t === K && Math.abs(m.t - m.f) === 2) { if (m.t > m.f) { b[m.f + 1] = b[m.f + 3]; b[m.f + 3] = 0; } else { b[m.f - 1] = b[m.f - 4]; b[m.f - 4] = 0; } }
    if (m.f === 60 || m.t === 60) castle &= ~3; if (m.f === 4 || m.t === 4) castle &= ~12;
    if (m.f === 63 || m.t === 63) castle &= ~1; if (m.f === 56 || m.t === 56) castle &= ~2;
    if (m.f === 7 || m.t === 7) castle &= ~4; if (m.f === 0 || m.t === 0) castle &= ~8;
    return { castle: castle, ep: ep, cap: cap, pawn: t === P };
  }
  function legalList(s) {
    var ps = pseudo(s.b, s.turn, s.castle, s.ep, false), out = [];
    for (var i = 0; i < ps.length; i++) { var b = s.b.slice(); make(b, ps[i], s.castle); if (!attacked(b, kingSq(b, s.turn), 1 - s.turn)) out.push(ps[i]); }
    return out;
  }
  function moves(s) { return s.win ? [] : legalList(s); }
  function legal(s, m) { return !!m && moves(s).some(function (x) { return x.f === m.f && x.t === m.t && x.p === (m.p || 0); }); }
  function insufficient(b) {
    var minor = 0, other = 0;
    for (var i = 0; i < 64; i++) { var t = typ(b[i]); if (!b[i] || t === K) continue; if (t === N || t === B) minor++; else other++; }
    return other === 0 && minor <= 1;
  }
  function play(s, m) {
    var b = s.b.slice(), r = make(b, m, s.castle), reps = {};
    for (var k in s.reps) reps[k] = s.reps[k];
    var n = { b: b, turn: 1 - s.turn, castle: r.castle, ep: r.ep, half: r.cap || r.pawn ? 0 : s.half + 1, full: s.full + (s.turn === 1 ? 1 : 0), reps: reps, last: { f: m.f, t: m.t }, win: null, check: false };
    if (r.cap || r.pawn) n.reps = {}; // 되돌릴 수 없는 수 뒤로는 반복 불가
    var kk = key(n); n.reps[kk] = (n.reps[kk] || 0) + 1;
    n.check = attacked(b, kingSq(b, n.turn), s.turn);
    var any = legalList(n).length > 0;
    if (!any) n.win = n.check ? { winner: s.turn, why: 'mate' } : { winner: -1, why: 'stalemate' };
    else if (n.half >= 100) n.win = { winner: -1, why: 'fifty' };
    else if (n.reps[kk] >= 3) n.win = { winner: -1, why: 'repeat' };
    else if (insufficient(b)) n.win = { winner: -1, why: 'material' };
    return n;
  }
  function over(s) { return s.win; }

  // ---------- 엔진 ----------
  var VAL = [0, 100, 320, 330, 500, 900, 0];
  var PST = {
    1: [0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 10, 10, 20, 30, 30, 20, 10, 10, 5, 5, 10, 25, 25, 10, 5, 5, 0, 0, 0, 20, 20, 0, 0, 0, 5, -5, -10, 0, 0, -10, -5, 5, 5, 10, 10, -20, -20, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0],
    2: [-50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 0, 0, 0, -20, -40, -30, 0, 10, 15, 15, 10, 0, -30, -30, 5, 15, 20, 20, 15, 5, -30, -30, 0, 15, 20, 20, 15, 0, -30, -30, 5, 10, 15, 15, 10, 5, -30, -40, -20, 0, 5, 5, 0, -20, -40, -50, -40, -30, -30, -30, -30, -40, -50],
    3: [-20, -10, -10, -10, -10, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5, 10, 10, 5, 0, -10, -10, 5, 5, 10, 10, 5, 5, -10, -10, 0, 10, 10, 10, 10, 0, -10, -10, 10, 10, 10, 10, 10, 10, -10, -10, 5, 0, 0, 0, 0, 5, -10, -20, -10, -10, -10, -10, -10, -10, -20],
    4: [0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 10, 10, 10, 10, 10, 5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, 0, 0, 0, 5, 5, 0, 0, 0],
    5: [-20, -10, -10, -5, -5, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5, 5, 5, 5, 0, -10, -5, 0, 5, 5, 5, 5, 0, -5, 0, 0, 5, 5, 5, 5, 0, -5, -10, 5, 5, 5, 5, 5, 0, -10, -10, 0, 5, 0, 0, 0, 0, -10, -20, -10, -10, -5, -5, -10, -10, -20],
    6: [-30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -20, -30, -30, -40, -40, -30, -30, -20, -10, -20, -20, -20, -20, -20, -20, -10, 20, 20, 0, 0, 0, 0, 20, 20, 20, 30, 10, 0, 0, 10, 30, 20],
    7: [-50, -40, -30, -20, -20, -30, -40, -50, -30, -20, -10, 0, 0, -10, -20, -30, -30, -10, 20, 30, 30, 20, -10, -30, -30, -10, 30, 40, 40, 30, -10, -30, -30, -10, 30, 40, 40, 30, -10, -30, -30, -10, 20, 30, 30, 20, -10, -30, -30, -30, 0, 0, 0, 0, -30, -30, -50, -30, -30, -30, -30, -30, -30, -50]
  };
  function evaluate(b, me) { // me 입장
    var s = 0, mat = 0, i, p;
    for (i = 0; i < 64; i++) { p = b[i]; if (p && typ(p) !== K && typ(p) !== P) mat += VAL[typ(p)]; }
    var endg = mat <= 2600;
    for (i = 0; i < 64; i++) {
      p = b[i]; if (!p) continue;
      var t = typ(p), c = col(p), sq = c === 0 ? i : (7 - (i >> 3)) * 8 + (i & 7);
      var v = VAL[t] + (t === K && endg ? PST[7][sq] : PST[t][sq]);
      s += c === me ? v : -v;
    }
    return s;
  }
  var MATE = 100000, TIMEOUT = {}, nodes = 0, deadline = 0;
  function orderMoves(b, ms) {
    for (var i = 0; i < ms.length; i++) { var m = ms[i], cap = b[m.t]; m.o = (cap ? 10 * VAL[typ(cap)] - VAL[typ(b[m.f])] + 1000 : 0) + (m.p ? VAL[m.p] : 0); }
    ms.sort(function (a, c) { return c.o - a.o; });
    return ms;
  }
  function qs(b, me, alpha, beta, depth) {
    if ((++nodes & 2047) === 0 && Date.now() > deadline) throw TIMEOUT;
    var stand = evaluate(b, me);
    if (stand >= beta) return stand;
    if (stand > alpha) alpha = stand;
    if (depth <= -6) return stand;
    var ms = orderMoves(b, pseudo(b, me, 0, -1, true));
    for (var i = 0; i < ms.length; i++) {
      var nb = b.slice(); make(nb, ms[i], 0);
      if (attacked(nb, kingSq(nb, me), 1 - me)) continue;
      var v = -qs(nb, 1 - me, -beta, -alpha, depth - 1);
      if (v >= beta) return v;
      if (v > alpha) alpha = v;
    }
    return alpha;
  }
  function search(b, me, castle, ep, depth, alpha, beta, ply) {
    if ((++nodes & 2047) === 0 && Date.now() > deadline) throw TIMEOUT;
    var inCheck = attacked(b, kingSq(b, me), 1 - me);
    if (inCheck) depth++;
    if (depth <= 0) return qs(b, me, alpha, beta, 0);
    var ms = orderMoves(b, pseudo(b, me, castle, ep, false)), legalN = 0, best = -Infinity;
    for (var i = 0; i < ms.length; i++) {
      var nb = b.slice(), r = make(nb, ms[i], castle);
      if (attacked(nb, kingSq(nb, me), 1 - me)) continue;
      legalN++;
      var v = -search(nb, 1 - me, r.castle, r.ep, depth - 1, -beta, -alpha, ply + 1);
      if (v > best) best = v;
      if (v > alpha) alpha = v;
      if (alpha >= beta) break;
    }
    if (!legalN) return inCheck ? -MATE + ply : 0;
    return best;
  }
  function rootSearch(s, depth, noise, prevBest) {
    var ms = orderMoves(s.b, legalList(s)), best = ms[0], alpha = -Infinity;
    if (prevBest) { var k = ms.findIndex(function (m) { return m.f === prevBest.f && m.t === prevBest.t && m.p === prevBest.p; }); if (k > 0) ms.unshift(ms.splice(k, 1)[0]); }
    for (var i = 0; i < ms.length; i++) {
      var nb = s.b.slice(), r = make(nb, ms[i], s.castle);
      // 3회 반복이 될 수를 피하도록 (이기고 있을 때)
      var v = -search(nb, 1 - s.turn, r.castle, r.ep, depth - 1, -Infinity, noise ? Infinity : -alpha, 1);
      if (!r.cap && !r.pawn) { var rk = nb.join(',') + '|' + (1 - s.turn) + r.castle + '|' + r.ep, seen = s.reps[rk] || 0; if (seen >= 2) v = 0; else if (seen && v > 0) v -= 40; }
      if (noise) v += (Math.random() - 0.5) * noise;
      if (v > alpha) { alpha = v; best = ms[i]; }
    }
    return best;
  }
  function clean(m) { return { f: m.f, t: m.t, p: m.p || 0 }; }
  function ai(s, level) {
    var ms = legalList(s);
    if (ms.length === 1) return clean(ms[0]);
    nodes = 0;
    if (level === 'easy') {
      deadline = Date.now() + 3000;
      if (Math.random() < 0.2) return clean(ms[(Math.random() * ms.length) | 0]);
      try { return clean(rootSearch(s, 1, 120)); } catch (e) { return clean(ms[0]); }
    }
    if (level === 'normal') {
      deadline = Date.now() + 2500;
      try { return clean(rootSearch(s, 3, 10)); } catch (e) { deadline = Date.now() + 2000; return clean(rootSearch(s, 2, 10)); }
    }
    deadline = Date.now() + 900;
    var best = null;
    for (var d = 1; d <= 8; d++) {
      try { best = rootSearch(s, d, 0, best); } catch (e) { if (e !== TIMEOUT) throw e; break; }
    }
    return clean(best || ms[0]);
  }
  var R = { id: 'chess', init: init, moves: moves, legal: legal, play: play, over: over, ai: ai, attacked: attacked, kingSq: kingSq };
  (root.NadooRules = root.NadooRules || {}).chess = R;
  if (typeof module !== 'undefined' && module.exports) module.exports = R;
})(typeof self !== 'undefined' ? self : globalThis);
