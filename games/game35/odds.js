/* Hand Odds: preflop Texas Hold'em equity by Monte Carlo (KO/EN). */
(function (root) {
  'use strict';
  var RCH = '23456789TJQKA';
  // card int 0..51: rank = c >> 2 (0 = 2 ... 12 = A), suit = c & 3
  function straightHigh(m) {
    var x = (m << 1) | ((m >> 12) & 1); // bit0 = ace-low
    for (var i = 13; i >= 4; i--) if (((x >> (i - 4)) & 31) === 31) return i - 1; // returns high rank index (wheel => 3)
    return -1;
  }
  function topBits(m, n) { var out = []; for (var r = 12; r >= 0 && out.length < n; r--) if (m & (1 << r)) out.push(r); return out; }
  function score(cat, ks) { var s = cat; for (var i = 0; i < 5; i++) s = s * 16 + (ks[i] == null ? 0 : ks[i]); return s; }
  function eval7(cs) {
    var cnt = [0,0,0,0,0,0,0,0,0,0,0,0,0], sm = [0,0,0,0], sc = [0,0,0,0], mask = 0, i, r;
    for (i = 0; i < cs.length; i++) { r = cs[i] >> 2; var s = cs[i] & 3; cnt[r]++; sm[s] |= 1 << r; sc[s]++; mask |= 1 << r; }
    for (i = 0; i < 4; i++) if (sc[i] >= 5) {
      var sh = straightHigh(sm[i]);
      if (sh >= 0) return score(8, [sh]);
      return score(5, topBits(sm[i], 5));
    }
    var quad = -1, trips = [], pairs = [];
    for (r = 12; r >= 0; r--) { if (cnt[r] === 4) quad = r; else if (cnt[r] === 3) trips.push(r); else if (cnt[r] === 2) pairs.push(r); }
    if (quad >= 0) return score(7, [quad, topBits(mask & ~(1 << quad), 1)[0]]);
    if (trips.length && (trips.length > 1 || pairs.length)) { var p = trips.length > 1 ? trips[1] : pairs[0]; if (pairs.length && pairs[0] > p) p = pairs[0]; return score(6, [trips[0], p]); }
    var st = straightHigh(mask);
    if (st >= 0) return score(4, [st]);
    if (trips.length) { var k = topBits(mask & ~(1 << trips[0]), 2); return score(3, [trips[0], k[0], k[1]]); }
    if (pairs.length >= 2) return score(2, [pairs[0], pairs[1], topBits(mask & ~(1 << pairs[0]) & ~(1 << pairs[1]), 1)[0]]);
    if (pairs.length) { var k2 = topBits(mask & ~(1 << pairs[0]), 3); return score(1, [pairs[0], k2[0], k2[1], k2[2]]); }
    return score(0, topBits(mask, 5));
  }
  // run sims; returns {win, tie, eq, n}
  function simulate(hole, opp, sims, acc) {
    acc = acc || { n: 0, win: 0, tie: 0, eq: 0 };
    var deck = [], i, j;
    for (i = 0; i < 52; i++) if (i !== hole[0] && i !== hole[1]) deck.push(i);
    var need = opp * 2 + 5, me = [hole[0], hole[1], 0, 0, 0, 0, 0], h = [0, 0, 0, 0, 0, 0, 0];
    for (var s = 0; s < sims; s++) {
      for (i = 0; i < need; i++) { j = i + Math.floor(Math.random() * (deck.length - i)); var t = deck[i]; deck[i] = deck[j]; deck[j] = t; }
      for (i = 0; i < 5; i++) { me[2 + i] = deck[i]; h[2 + i] = deck[i]; }
      var mine = eval7(me), best = -1, ties = 0;
      for (var o = 0; o < opp; o++) {
        h[0] = deck[5 + o * 2]; h[1] = deck[6 + o * 2];
        var v = eval7(h);
        if (v > best) { best = v; ties = 0; }
        if (v === best) ties++;
      }
      acc.n++;
      if (mine > best) { acc.win++; acc.eq += 1; }
      else if (mine === best) { acc.tie++; acc.eq += 1 / (ties + 1); }
    }
    return acc;
  }
  function chen(a, b) { // a,b card ints
    var r1 = Math.max(a >> 2, b >> 2), r2 = Math.min(a >> 2, b >> 2), suited = (a & 3) === (b & 3);
    var base = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 10][r1];
    var p;
    if (r1 === r2) { p = Math.max(5, base * 2); }
    else {
      p = base + (suited ? 2 : 0);
      var gap = r1 - r2 - 1;
      p -= [0, 1, 2, 4, 5][Math.min(gap, 4)];
      if (gap <= 1 && r1 < 10) p += 1; // both below Q
    }
    return Math.ceil(p * 2) / 2;
  }
  function handInfo(a, b) {
    var r1 = Math.max(a >> 2, b >> 2), r2 = Math.min(a >> 2, b >> 2), suited = (a & 3) === (b & 3);
    var code = RCH[r1] + RCH[r2] + (r1 === r2 ? '' : suited ? 's' : 'o');
    code = code.replace(/T/g, '10');
    var kind = r1 === r2 ? 'pair' : suited ? 'suited' : 'offsuit';
    var c = chen(a, b);
    var tier = c >= 12 ? 0 : c >= 9 ? 1 : c >= 6 ? 2 : 3; // premium, strong, medium, weak
    return { code: code, kind: kind, chen: c, tier: tier };
  }
  function recommend(eq, opp, tier) {
    var fair = 1 / (opp + 1), ratio = eq / fair;
    var act = 'fold';
    if (tier === 0 || (ratio >= 1.5 && tier <= 1)) act = 'raise';
    else if (ratio >= 1.1 || tier <= 1) act = 'call';
    return { act: act, fair: fair, ratio: ratio };
  }
  var api = { eval7: eval7, simulate: simulate, handInfo: handInfo, recommend: recommend, chen: chen };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.HandOdds = api;
})(this);
