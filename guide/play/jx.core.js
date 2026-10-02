/* 나두 PC 대국 - 장기·샹치 공용 판/궁성/수 생성/탐색 엔진.
 * 판 10행 x 9열, 칸 = 행*9 + 열. 0번 편(먼저 두는 쪽: 장기 초, 샹치 홍)은 아래(7~9행 궁성), 1번 편은 위(0~2행 궁성).
 * 기물 값 = 종류 + 편*8. 종류: 1궁/장 2사 3상 4마 5차 6포 7졸·병 */
(function (root) {
  'use strict';
  var KING = 1, ADV = 2, ELE = 3, HOR = 4, CHA = 5, CAN = 6, SOL = 7;
  var ORTH = [[-1, 0], [1, 0], [0, -1], [0, 1]], DIAG = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  function on(r, c) { return r >= 0 && r < 10 && c >= 0 && c < 9; }
  function side(p) { return p >> 3; } function typ(p) { return p & 7; }
  function inPalace(r, c, s) { return c >= 3 && c <= 5 && (s === 0 ? r >= 7 : r <= 2); }
  function anyPalace(r, c) { return c >= 3 && c <= 5 && (r >= 7 || r <= 2); }
  function palaceTop(r) { return r <= 2 ? 0 : 7; }
  // 궁성 대각선 위의 점인가 (모서리 4 + 가운데)
  function onDiag(r, c) { if (!anyPalace(r, c)) return false; var r0 = palaceTop(r), dr = r - r0, dc = c - 3; return (dr === dc) || (dr + dc === 2); }
  // 궁성 대각선을 따라 (r,c)에서 (dr,dc) 한 칸 갈 수 있나 (장기)
  function diagStep(r, c, dr, dc) {
    if (!onDiag(r, c)) return false;
    var nr = r + dr, nc = c + dc;
    if (!anyPalace(nr, nc) || palaceTop(nr) !== palaceTop(r)) return false;
    return onDiag(nr, nc);
  }
  function kingSq(b, s) { for (var i = 0; i < 90; i++) if (b[i] === KING + s * 8) return i; return -1; }
  function facing(b) {
    var a = kingSq(b, 0), k = kingSq(b, 1); if (a < 0 || k < 0 || a % 9 !== k % 9) return false;
    for (var i = k + 9; i < a; i += 9) if (b[i]) return false;
    return true;
  }
  // 의사 합법수. V: 'janggi' | 'xiangqi'. capsOnly: 잡는 수만
  function pseudo(b, me, V, capsOnly) {
    var J = V === 'janggi', out = [], i, k, r, c, nr, nc, q, t, p;
    function add(to) { q = b[to]; if (q) { if (side(q) !== me) out.push({ f: i, t: to }); } else if (!capsOnly) out.push({ f: i, t: to }); }
    for (i = 0; i < 90; i++) {
      p = b[i]; if (!p || side(p) !== me) continue;
      t = typ(p); r = (i / 9) | 0; c = i % 9;
      if (t === KING || t === ADV) {
        var steps = [];
        if (J || t === KING) ORTH.forEach(function (d) { steps.push(d); });
        if (J) DIAG.forEach(function (d) { if (diagStep(r, c, d[0], d[1])) steps.push(d); });
        else if (t === ADV) DIAG.forEach(function (d) { steps.push(d); });
        for (k = 0; k < steps.length; k++) { nr = r + steps[k][0]; nc = c + steps[k][1]; if (on(nr, nc) && inPalace(nr, nc, me)) add(nr * 9 + nc); }
      } else if (t === HOR) {
        for (k = 0; k < 4; k++) {
          var lr = r + ORTH[k][0], lc = c + ORTH[k][1]; if (!on(lr, lc) || b[lr * 9 + lc]) continue;
          for (var s2 = -1; s2 <= 1; s2 += 2) {
            nr = lr + (ORTH[k][0] || s2); nc = lc + (ORTH[k][1] || s2);
            if (on(nr, nc)) add(nr * 9 + nc);
          }
        }
      } else if (t === ELE) {
        if (J) {
          for (k = 0; k < 4; k++) {
            var er = r + ORTH[k][0], ec = c + ORTH[k][1]; if (!on(er, ec) || b[er * 9 + ec]) continue;
            for (var s3 = -1; s3 <= 1; s3 += 2) {
              var dr2 = ORTH[k][0] || s3, dc2 = ORTH[k][1] || s3, mr = er + dr2, mc = ec + dc2;
              if (!on(mr, mc) || b[mr * 9 + mc]) continue;
              nr = mr + dr2; nc = mc + dc2; if (on(nr, nc)) add(nr * 9 + nc);
            }
          }
        } else {
          for (k = 0; k < 4; k++) {
            var xr = r + DIAG[k][0], xc = c + DIAG[k][1]; nr = r + 2 * DIAG[k][0]; nc = c + 2 * DIAG[k][1];
            if (!on(nr, nc) || b[xr * 9 + xc]) continue;
            if (me === 0 ? nr < 5 : nr > 4) continue; // 강 못 건넘
            add(nr * 9 + nc);
          }
        }
      } else if (t === CHA) {
        for (k = 0; k < 4; k++) { nr = r + ORTH[k][0]; nc = c + ORTH[k][1]; while (on(nr, nc)) { var to = nr * 9 + nc; if (b[to]) { add(to); break; } add(to); nr += ORTH[k][0]; nc += ORTH[k][1]; } }
        if (J && onDiag(r, c)) for (k = 0; k < 4; k++) {
          var cr = r, cc = c;
          while (diagStep(cr, cc, DIAG[k][0], DIAG[k][1])) { cr += DIAG[k][0]; cc += DIAG[k][1]; var t2 = cr * 9 + cc; if (b[t2]) { add(t2); break; } add(t2); }
        }
      } else if (t === CAN) {
        for (k = 0; k < 4; k++) {
          nr = r + ORTH[k][0]; nc = c + ORTH[k][1]; var jumped = false;
          while (on(nr, nc)) {
            var sq = nr * 9 + nc, v = b[sq];
            if (!jumped) {
              if (v) { if (J && typ(v) === CAN) break; jumped = true; }
              else if (!J && !capsOnly) out.push({ f: i, t: sq }); // 샹치 포: 그냥 이동은 차처럼
            } else {
              if (v) { if (side(v) !== me && !(J && typ(v) === CAN)) out.push({ f: i, t: sq }); break; }
              if (J && !capsOnly) out.push({ f: i, t: sq });
            }
            nr += ORTH[k][0]; nc += ORTH[k][1];
          }
        }
        if (J && onDiag(r, c) && (c !== 4 || (r !== 1 && r !== 8))) for (k = 0; k < 4; k++) { // 모서리에서 가운데를 넘어 반대 모서리로
          if (!diagStep(r, c, DIAG[k][0], DIAG[k][1])) continue;
          var mr2 = r + DIAG[k][0], mc2 = c + DIAG[k][1], sc = b[mr2 * 9 + mc2];
          if (!sc || typ(sc) === CAN || !diagStep(mr2, mc2, DIAG[k][0], DIAG[k][1])) continue;
          var tr = mr2 + DIAG[k][0], tc = mc2 + DIAG[k][1], tv = b[tr * 9 + tc];
          if (tv && typ(tv) === CAN) continue;
          add(tr * 9 + tc);
        }
      } else if (t === SOL) {
        var fw = me === 0 ? -1 : 1;
        nr = r + fw; if (on(nr, c)) add(nr * 9 + c);
        var crossed = J || (me === 0 ? r <= 4 : r >= 5);
        if (crossed) { if (on(r, c - 1)) add(r * 9 + c - 1); if (on(r, c + 1)) add(r * 9 + c + 1); }
        if (J) for (var s4 = -1; s4 <= 1; s4 += 2) if (diagStep(r, c, fw, s4) && inPalace(r + fw, c + s4, 1 - me)) add((r + fw) * 9 + c + s4);
      }
    }
    return out;
  }
  function attackedKing(b, s, V) { // s편 궁이 공격받나 (+샹치는 장끼리 마주 보기도)
    var k = kingSq(b, s); if (k < 0) return true;
    if (V === 'xiangqi' && facing(b)) return true;
    var ms = pseudo(b, 1 - s, V, true);
    for (var i = 0; i < ms.length; i++) if (ms[i].t === k) return true;
    return false;
  }
  // 장기: 빅장 상태(두 궁이 마주 봄)에서 차례인 쪽은 빅장을 풀어야 함
  function legalList(b, me, V) {
    var ps = pseudo(b, me, V, false), out = [], must = V === 'janggi' && facing(b);
    for (var i = 0; i < ps.length; i++) { var nb = b.slice(); nb[ps[i].t] = nb[ps[i].f]; nb[ps[i].f] = 0; if (!attackedKing(nb, me, V) && !(must && facing(nb))) out.push(ps[i]); }
    return out;
  }
  // ---- 탐색 ----
  var TIMEOUT = {}, nodes = 0, deadline = 0, MATE = 100000;
  function search(b, me, depth, alpha, beta, ply, cfg) {
    if ((++nodes & 1023) === 0 && Date.now() > deadline) throw TIMEOUT;
    var must = cfg.V === 'janggi' && facing(b);
    if (depth <= 0 && !must) return qsearch(b, me, alpha, beta, 0, cfg);
    var ms = cfg.order(b, pseudo(b, me, cfg.V, false)), legalN = 0, best = -Infinity;
    for (var i = 0; i < ms.length; i++) {
      var nb = b.slice(); nb[ms[i].t] = nb[ms[i].f]; nb[ms[i].f] = 0;
      if (attackedKing(nb, me, cfg.V) || (must && facing(nb))) continue;
      legalN++;
      var v = -search(nb, 1 - me, depth - 1, -beta, -alpha, ply + 1, cfg);
      if (v > best) best = v; if (v > alpha) alpha = v; if (alpha >= beta) break;
    }
    if (!legalN) return cfg.noMoves(b, me, ply, must);
    return best;
  }
  function qsearch(b, me, alpha, beta, d, cfg) {
    if ((++nodes & 1023) === 0 && Date.now() > deadline) throw TIMEOUT;
    if (cfg.V === 'janggi' && facing(b)) return search(b, me, 1, alpha, beta, 30, cfg);
    var stand = cfg.evaluate(b, me);
    if (stand >= beta || d <= -4) return stand;
    if (stand > alpha) alpha = stand;
    var ms = cfg.order(b, pseudo(b, me, cfg.V, true));
    for (var i = 0; i < ms.length; i++) {
      if (typ(b[ms[i].t]) === KING) return MATE; // 궁을 잡을 수 있으면(상대가 장군을 못 피한 상태)
      var nb = b.slice(); nb[ms[i].t] = nb[ms[i].f]; nb[ms[i].f] = 0;
      if (attackedKing(nb, me, cfg.V)) continue;
      var v = -qsearch(nb, 1 - me, -beta, -alpha, d - 1, cfg);
      if (v >= beta) return v; if (v > alpha) alpha = v;
    }
    return alpha;
  }
  function rootSearch(b, me, depth, noise, cfg, prev) {
    var ms = cfg.order(b, legalList(b, me, cfg.V)), best = ms[0], alpha = -Infinity;
    if (prev) { var k = -1; for (var j = 0; j < ms.length; j++) if (ms[j].f === prev.f && ms[j].t === prev.t) k = j; if (k > 0) ms.unshift(ms.splice(k, 1)[0]); }
    for (var i = 0; i < ms.length; i++) {
      var nb = b.slice(); nb[ms[i].t] = nb[ms[i].f]; nb[ms[i].f] = 0;
      var v = -search(nb, 1 - me, depth - 1, -Infinity, noise ? Infinity : -alpha, 1, cfg) + (noise ? (Math.random() - 0.5) * noise : 0);
      if (v > alpha) { alpha = v; best = ms[i]; }
    }
    return { f: best.f, t: best.t };
  }
  function think(b, me, level, cfg) {
    var ms = legalList(b, me, cfg.V); if (!ms.length) return null;
    if (ms.length === 1) return { f: ms[0].f, t: ms[0].t };
    nodes = 0;
    if (level === 'easy') {
      if (Math.random() < 0.2) { var m = ms[(Math.random() * ms.length) | 0]; return { f: m.f, t: m.t }; }
      deadline = Date.now() + 3000; try { return rootSearch(b, me, 1, 250, cfg); } catch (e) { return { f: ms[0].f, t: ms[0].t }; }
    }
    if (level === 'normal') { deadline = Date.now() + 1500; var bm = null; for (var d0 = 1; d0 <= 3; d0++) { try { bm = rootSearch(b, me, d0, 8, cfg, bm); } catch (e) { break; } } return bm || { f: ms[0].f, t: ms[0].t }; }
    deadline = Date.now() + 1000; var best = null;
    for (var d = 1; d <= 7; d++) { try { best = rootSearch(b, me, d, 0, cfg, best); } catch (e) { if (e !== TIMEOUT) throw e; break; } }
    return best || { f: ms[0].f, t: ms[0].t };
  }
  var JX = { KING: KING, ADV: ADV, ELE: ELE, HOR: HOR, CHA: CHA, CAN: CAN, SOL: SOL, pseudo: pseudo, legalList: legalList, attackedKing: attackedKing, facing: facing, kingSq: kingSq, think: think, typ: typ, side: side, MATE: MATE };
  root.NadooJX = JX;
  if (typeof module !== 'undefined' && module.exports) module.exports = JX;
})(typeof self !== 'undefined' ? self : globalThis);
