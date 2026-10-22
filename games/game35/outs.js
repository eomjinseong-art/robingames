/* 포커 아웃츠 트레이너 엔진.
 * 카드에서 아웃츠를 세고, 플랍/턴 확률은 조합으로 계산한다.
 * 플랍(아웃츠 n): 1 - C(47-n, 2) / C(47, 2)
 * 턴: n / 46
 * 백도어는 한 장 아웃츠가 없고, 남은 두 장을 모두 맞추는 경우의 수로 계산한다.
 */
(function (factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.PokerOuts = api;
})(function () {
  'use strict';

  var SUITS = ['s', 'h', 'd', 'c'];
  var SUIT_SYM = { s: '♠', h: '♥', d: '♦', c: '♣' };
  var RANK_CHAR = { 14: 'A', 13: 'K', 12: 'Q', 11: 'J', 10: 'T', 9: '9', 8: '8', 7: '7', 6: '6', 5: '5', 4: '4', 3: '3', 2: '2' };
  var CHAR_RANK = { A: 14, K: 13, Q: 12, J: 11, T: 10, '10': 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2 };
  var RANK_NUMS = [14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
  var RANK_ORDER = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

  var TYPES = [
    { id: 'flush', ko: '플러쉬 드로우' },
    { id: 'oesd', ko: '양방 스트레이트' },
    { id: 'gutshot', ko: '샷건(구멍) 스트레이트' },
    { id: 'monster', ko: '몬스터(플러쉬+양방)' },
    { id: 'set', ko: '포켓페어→셋' },
    { id: 'overs', ko: '오버카드 2장' },
    { id: 'twopair', ko: '투페어→풀하우스' },
    { id: 'trips', ko: '트립스→풀하우스 이상' },
    { id: 'bdf', ko: '백도어 플러쉬' },
    { id: 'bds', ko: '백도어 스트레이트' }
  ];

  var POSITIONS = [
    { id: 'early', ko: '앞자리' },
    { id: 'middle', ko: '중간자리' },
    { id: 'late', ko: '뒷자리(버튼)' }
  ];

  function comb(n, k) {
    if (k < 0 || n < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    if (k > n - k) k = n - k;
    var r = 1;
    for (var i = 1; i <= k; i++) r = r * (n - k + i) / i;
    return Math.round(r);
  }

  function exactOutsProb(outs, street) {
    if (street === 'turn') return outs / 46;
    var total = comb(47, 2);
    return 1 - comb(47 - outs, 2) / total;
  }

  function mental42(outs, street) {
    return outs * (street === 'turn' ? 2 : 4);
  }

  function card(rank, suit) {
    return { rank: rank, suit: suit, code: RANK_CHAR[rank] + suit };
  }

  function parseCard(c) {
    if (c && typeof c === 'object') return card(c.rank, c.suit);
    var suit = c.slice(-1);
    var r = c.slice(0, -1);
    var rank = CHAR_RANK[r];
    if (!rank || SUITS.indexOf(suit) < 0) throw new Error('bad card ' + c);
    return card(rank, suit);
  }

  function parseCards(list) {
    return list.map(parseCard);
  }

  function rankLabel(rank) {
    return rank === 10 ? '10' : RANK_CHAR[rank];
  }

  function cardLabel(c) {
    return rankLabel(c.rank) + SUIT_SYM[c.suit];
  }

  function sortCards(list) {
    return list.slice().sort(function (a, b) {
      if (b.rank !== a.rank) return b.rank - a.rank;
      return SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit);
    });
  }

  function codesOf(list) {
    return list.map(function (c) { return c.code; });
  }

  function allCards() {
    var out = [];
    for (var i = 0; i < RANK_NUMS.length; i++) {
      for (var s = 0; s < SUITS.length; s++) out.push(card(RANK_NUMS[i], SUITS[s]));
    }
    return out;
  }

  function remaining(visible) {
    return allCards().filter(function (c) { return !visible[c.code]; });
  }

  function remainingOfRank(rank, visible) {
    return SUITS.map(function (s) { return card(rank, s); }).filter(function (c) { return !visible[c.code]; });
  }

  function visibleMap(cards) {
    var m = {};
    cards.forEach(function (c) { m[c.code] = true; });
    return m;
  }

  function rankCounts(cards) {
    var m = {};
    cards.forEach(function (c) { m[c.rank] = (m[c.rank] || 0) + 1; });
    return m;
  }

  function suitCounts(cards) {
    var m = { s: 0, h: 0, d: 0, c: 0 };
    cards.forEach(function (c) { m[c.suit]++; });
    return m;
  }

  function straightWindows() {
    var w = [];
    for (var hi = 14; hi >= 6; hi--) w.push([hi, hi - 1, hi - 2, hi - 3, hi - 4]);
    w.push([14, 5, 4, 3, 2]);
    return w;
  }

  function hasStraight(set) {
    return straightWindows().some(function (seq) {
      for (var i = 0; i < seq.length; i++) if (!set[seq[i]]) return false;
      return true;
    });
  }

  function rankSet(cards) {
    var s = {};
    cards.forEach(function (c) { s[c.rank] = true; });
    return s;
  }

  function makesStraight(cards) {
    return hasStraight(rankSet(cards));
  }

  function straightCompleters(cards) {
    var set = rankSet(cards);
    if (hasStraight(set)) return [];
    var out = [];
    for (var r = 2; r <= 14; r++) {
      if (set[r]) continue;
      set[r] = true;
      if (hasStraight(set)) out.push(r);
      delete set[r];
    }
    return out;
  }

  function openEndedRuns() {
    var runs = [];
    for (var b = 2; b <= 10; b++) {
      var have = [b, b + 1, b + 2, b + 3];
      var outs = b === 2 ? [14, 6] : [b - 1, b + 4];
      runs.push({ have: have, outs: outs });
    }
    return runs;
  }

  function sameRanks(a, b) {
    if (a.length !== b.length) return false;
    var x = a.slice().sort(function (p, q) { return p - q; });
    var y = b.slice().sort(function (p, q) { return p - q; });
    for (var i = 0; i < x.length; i++) if (x[i] !== y[i]) return false;
    return true;
  }

  function isOESD(cards, completers) {
    if (completers.length !== 2) return false;
    var set = rankSet(cards);
    return openEndedRuns().some(function (run) {
      for (var i = 0; i < run.have.length; i++) if (!set[run.have[i]]) return false;
      return sameRanks(run.outs, completers);
    });
  }

  function madeKind(cards) {
    var rc = rankCounts(cards);
    var ranks = Object.keys(rc);
    var trips = 0, pairs = 0, quads = 0;
    ranks.forEach(function (r) {
      if (rc[r] >= 4) quads++;
      else if (rc[r] === 3) trips++;
      else if (rc[r] === 2) pairs++;
    });
    if (quads) return 'quads';
    if (trips && pairs) return 'fullhouse';
    var sc = suitCounts(cards);
    for (var i = 0; i < SUITS.length; i++) if (sc[SUITS[i]] >= 5) return 'flush';
    if (hasStraight(rankSet(cards))) return 'straight';
    return null;
  }

  function flushSuit(cards) {
    var sc = suitCounts(cards);
    var found = null;
    for (var i = 0; i < SUITS.length; i++) {
      if (sc[SUITS[i]] >= 5) return null;
      if (sc[SUITS[i]] === 4) {
        if (found) return null;
        found = SUITS[i];
      }
    }
    return found;
  }

  function countRunnerFlush(cards, suit) {
    var vis = visibleMap(cards);
    var left = remaining(vis).filter(function (c) { return c.suit === suit; });
    return { left: left, hits: comb(left.length, 2), total: comb(47, 2) };
  }

  function countRunnerStraight(cards) {
    var vis = visibleMap(cards);
    var remain = remaining(vis);
    var hits = 0;
    var pairHits = {};
    for (var i = 0; i < remain.length; i++) {
      for (var j = i + 1; j < remain.length; j++) {
        var a = remain[i], b = remain[j];
        if (!makesStraight(cards.concat([a, b]))) continue;
        hits++;
        if (a.rank === b.rank) continue;
        var lo = Math.min(a.rank, b.rank), hi = Math.max(a.rank, b.rank);
        var key = lo + '-' + hi;
        pairHits[key] = (pairHits[key] || 0) + 1;
      }
    }
    var ways = Object.keys(pairHits).map(function (key) {
      var parts = key.split('-').map(Number);
      return { ranks: parts, n: pairHits[key] };
    }).sort(function (a, b) { return a.ranks[0] - b.ranks[0] || a.ranks[1] - b.ranks[1]; });
    return { hits: hits, total: comb(remain.length, 2), ways: ways };
  }

  function uniqByCode(list) {
    var m = {};
    var out = [];
    list.forEach(function (c) {
      if (!m[c.code]) { m[c.code] = true; out.push(c); }
    });
    return out;
  }

  function analyze(holeIn, boardIn) {
    var hole = sortCards(parseCards(holeIn));
    var board = parseCards(boardIn);
    if (hole.length !== 2 || (board.length !== 3 && board.length !== 4)) {
      throw new Error('need 2 hole cards and a flop or turn');
    }
    var cards = hole.concat(board);
    var seen = {};
    for (var i = 0; i < cards.length; i++) {
      if (seen[cards[i].code]) throw new Error('duplicate card ' + cards[i].code);
      seen[cards[i].code] = true;
    }
    var street = board.length === 3 ? 'flop' : 'turn';
    var vis = visibleMap(cards);
    var made = madeKind(cards);
    var fSuit = flushSuit(cards);
    var flushOuts = fSuit ? sortCards(remaining(vis).filter(function (c) { return c.suit === fSuit; })) : [];
    var completers = straightCompleters(cards);
    var oesd = !made && isOESD(cards, completers);
    var gutshot = !made && !oesd && completers.length === 1;
    var straightOuts = [];
    completers.forEach(function (r) { straightOuts = straightOuts.concat(remainingOfRank(r, vis)); });
    straightOuts = sortCards(straightOuts);

    var rc = rankCounts(cards);
    var tripRank = null, pairRanks = [], quadRank = null;
    Object.keys(rc).forEach(function (r) {
      var n = rc[r], num = Number(r);
      if (n >= 4) quadRank = num;
      else if (n === 3) tripRank = num;
      else if (n === 2) pairRanks.push(num);
    });

    var tripsOuts = null;
    if (!made && tripRank && pairRanks.length === 0 && !quadRank) {
      var singles = Object.keys(rc).map(Number).filter(function (r) { return rc[r] === 1; });
      tripsOuts = remainingOfRank(tripRank, vis);
      singles.forEach(function (r) { tripsOuts = tripsOuts.concat(remainingOfRank(r, vis)); });
      tripsOuts = sortCards(tripsOuts);
    }

    var twoPairOuts = null;
    if (!made && !tripRank && !quadRank && pairRanks.length === 2) {
      twoPairOuts = [];
      pairRanks.forEach(function (r) { twoPairOuts = twoPairOuts.concat(remainingOfRank(r, vis)); });
      twoPairOuts = sortCards(twoPairOuts);
    }

    var setRank = null;
    if (hole[0].rank === hole[1].rank && !board.some(function (c) { return c.rank === hole[0].rank; })) {
      setRank = hole[0].rank;
    }
    var setOuts = setRank ? sortCards(remainingOfRank(setRank, vis)) : [];

    var overRanks = null;
    if (hole[0].rank !== hole[1].rank) {
      var maxB = board.reduce(function (m, c) { return Math.max(m, c.rank); }, 0);
      if (hole[0].rank > maxB && hole[1].rank > maxB) overRanks = [hole[0].rank, hole[1].rank];
    }
    var overOuts = [];
    if (overRanks) {
      overRanks.forEach(function (r) { overOuts = overOuts.concat(remainingOfRank(r, vis)); });
      overOuts = sortCards(overOuts);
    }

    var bdf = null;
    if (street === 'flop' && !fSuit) {
      var sc = suitCounts(cards);
      SUITS.forEach(function (s) {
        if (sc[s] === 3 && hole.some(function (c) { return c.suit === s; })) {
          bdf = { suit: s, pack: countRunnerFlush(cards, s) };
        }
      });
    }

    var bds = null;
    if (street === 'flop' && completers.length === 0 && !hasStraight(rankSet(cards))) {
      var pack = countRunnerStraight(cards);
      if (pack.hits > 0) bds = pack;
    }

    var monster = !!(fSuit && oesd);
    var flags = [];
    if (!made) {
      if (monster) flags.push('monster');
      else {
        if (fSuit) flags.push('flush');
        if (oesd) flags.push('oesd');
        if (gutshot) flags.push('gutshot');
      }
      if (tripsOuts) flags.push('trips');
      if (twoPairOuts) flags.push('twopair');
      if (setRank) flags.push('set');
      if (overRanks) flags.push('overs');
      if (bdf) flags.push('bdf');
      if (bds) flags.push('bds');
    }
    var type = flags.length === 1 ? flags[0] : null;

    var outs = [];
    var groups = [];
    var backdoor = type === 'bdf' || type === 'bds';
    var runner = null;

    if (type === 'flush') {
      outs = flushOuts;
      groups = [{ id: 'flush', label: '플러쉬가 되는 카드', cards: flushOuts }];
    } else if (type === 'oesd' || type === 'gutshot') {
      outs = straightOuts;
      groups = [{ id: 'straight', label: '스트레이트가 되는 카드', cards: straightOuts }];
    } else if (type === 'monster') {
      var overlap = flushOuts.filter(function (c) {
        return straightOuts.some(function (s) { return s.code === c.code; });
      });
      outs = sortCards(uniqByCode(flushOuts.concat(straightOuts)));
      groups = [
        { id: 'flush', label: '플러쉬 아웃', cards: flushOuts },
        { id: 'straight', label: '스트레이트 아웃', cards: straightOuts },
        { id: 'overlap', label: '겹쳐서 한 번만 세는 카드', cards: sortCards(overlap) }
      ];
    } else if (type === 'set') {
      outs = setOuts;
      groups = [{ id: 'set', label: '셋이 되는 카드', cards: setOuts }];
    } else if (type === 'overs') {
      outs = overOuts;
      groups = [{ id: 'overs', label: '페어가 되는 오버카드', cards: overOuts }];
    } else if (type === 'twopair') {
      outs = twoPairOuts;
      groups = [{ id: 'fh', label: '풀하우스가 되는 카드', cards: twoPairOuts }];
    } else if (type === 'trips') {
      var quadCards = tripsOuts.filter(function (c) { return c.rank === tripRank; });
      var pairCards = tripsOuts.filter(function (c) { return c.rank !== tripRank; });
      outs = tripsOuts;
      groups = [
        { id: 'quad', label: '쿼드가 되는 카드', cards: quadCards },
        { id: 'pair', label: '풀하우스가 되는 카드', cards: pairCards }
      ];
    } else if (type === 'bdf') {
      outs = [];
      runner = { kind: 'flush', suit: bdf.suit, left: bdf.pack.left, hits: bdf.pack.hits, total: bdf.pack.total, ways: [] };
    } else if (type === 'bds') {
      outs = [];
      runner = { kind: 'straight', hits: bds.hits, total: bds.total, ways: bds.ways };
    }

    var exact = null;
    var detail = null;
    if (type && !backdoor) {
      var total = comb(47, 2);
      var miss = comb(47 - outs.length, 2);
      exact = street === 'turn' ? outs.length / 46 : 1 - miss / total;
      detail = street === 'turn'
        ? { kind: 'turn', outs: outs.length, denom: 46 }
        : { kind: 'flop', outs: outs.length, miss: miss, total: total, hit: total - miss };
    } else if (backdoor && runner) {
      exact = runner.hits / runner.total;
      detail = { kind: 'runner', hits: runner.hits, total: runner.total, suit: runner.suit || null };
    }

    var meta = TYPES.filter(function (t) { return t.id === type; })[0] || null;
    return {
      type: type,
      typeLabel: meta ? meta.ko : '',
      flags: flags,
      made: made,
      street: street,
      streetLabel: street === 'flop' ? '플랍: 2장 남음' : '턴: 1장 남음',
      hole: hole,
      board: board,
      outs: outs,
      outCount: outs.length,
      groups: groups,
      backdoor: backdoor,
      runner: runner,
      mental: type && !backdoor ? mental42(outs.length, street) : null,
      exact: exact,
      detail: detail,
      tripRank: tripRank,
      flushSuit: fSuit,
      overlapCount: type === 'monster' ? groups[2].cards.length : 0
    };
  }

  function makeRng(rng) {
    var r = rng || Math.random;
    return {
      float: function () { return r(); },
      int: function (n) { return Math.floor(r() * n); },
      pick: function (arr) { return arr[Math.floor(r() * arr.length)]; },
      sample: function (arr, k) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
          var j = Math.floor(r() * (i + 1));
          var t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a.slice(0, k);
      }
    };
  }

  function tryBuild(fn, times) {
    for (var i = 0; i < times; i++) {
      var v = fn();
      if (v) return v;
    }
    return null;
  }

  function handOk(hole, board, type) {
    if (!hole || !board) return null;
    var codes = {};
    var all = hole.concat(board);
    for (var i = 0; i < all.length; i++) {
      if (codes[all[i].code]) return null;
      codes[all[i].code] = true;
    }
    var a = analyze(hole, board);
    if (a.type !== type) return null;
    return a;
  }

  function dealSuits(n, maxPer, rng) {
    for (var attempt = 0; attempt < 80; attempt++) {
      var suits = [];
      var cnt = { s: 0, h: 0, d: 0, c: 0 };
      var ok = true;
      for (var i = 0; i < n; i++) {
        var opts = SUITS.filter(function (s) { return cnt[s] < maxPer; });
        if (!opts.length) { ok = false; break; }
        var s = rng.pick(opts);
        cnt[s]++;
        suits.push(s);
      }
      if (ok) return suits;
    }
    return null;
  }

  function otherRanks(used) {
    return RANK_NUMS.filter(function (r) { return used.indexOf(r) < 0; });
  }

  function buildFlush(street, rng) {
    var suit = rng.pick(SUITS);
    var ranks = rng.sample(RANK_NUMS, 4);
    var holeN = rng.float() < 0.7 ? 2 : 1;
    var holeRanks = ranks.slice(0, holeN);
    var boardFlushRanks = ranks.slice(holeN);
    var needOff = (street === 'turn' ? 4 : 3) - boardFlushRanks.length;
    if (holeN === 1) needOff -= 1;
    if (needOff < 1) return null;
    var offPool = otherRanks(ranks);
    var off = rng.sample(offPool, needOff + (holeN === 1 ? 1 : 0));
    if (off.length !== needOff + (holeN === 1 ? 1 : 0)) return null;
    var hole, boardRanksFlush, offBoard;
    if (holeN === 2) {
      hole = [card(holeRanks[0], suit), card(holeRanks[1], suit)];
      boardRanksFlush = boardFlushRanks;
      offBoard = off;
    } else {
      var offSuitHole = rng.pick(SUITS.filter(function (s) { return s !== suit; }));
      hole = [card(holeRanks[0], suit), card(off[0], offSuitHole)];
      boardRanksFlush = boardFlushRanks;
      offBoard = off.slice(1);
    }
    var board = boardRanksFlush.map(function (r) { return card(r, suit); });
    offBoard.forEach(function (r) {
      var s = rng.pick(SUITS.filter(function (x) { return x !== suit; }));
      board.push(card(r, s));
    });
    if (board.length !== (street === 'turn' ? 4 : 3)) return null;
    return handOk(hole, board, 'flush');
  }

  function buildStraightDraw(street, rng, kind) {
    var pattern = null;
    if (kind === 'oesd') {
      var b = 2 + rng.int(9);
      var have = [b, b + 1, b + 2, b + 3];
      pattern = { have: have, ban: b === 2 ? [14, 6] : [b - 1, b + 4] };
    } else {
      var windows = [];
      for (var w = 2; w <= 10; w++) windows.push([w, w + 1, w + 2, w + 3, w + 4]);
      windows.push([14, 2, 3, 4, 5]);
      var win = rng.pick(windows);
      var interior = [1, 2, 3];
      var drop = win[rng.pick(interior)];
      pattern = { have: win.filter(function (r) { return r !== drop; }), ban: [drop] };
    }
    var have = pattern.have.slice().sort(function (a, b) { return a - b; });
    var holeRanks = [have[0], have[1]];
    var boardRanks = [have[2], have[3]];
    var ban = {};
    have.forEach(function (r) { ban[r] = true; });
    pattern.ban.forEach(function (r) { ban[r] = true; });
    var ragPool = RANK_NUMS.filter(function (r) { return !ban[r]; });
    var ragN = street === 'turn' ? 2 : 1;
    var rags = rng.sample(ragPool, ragN);
    if (rags.length !== ragN) return null;
    var suitN = holeRanks.length + boardRanks.length + rags.length;
    var suits = dealSuits(suitN, 2, rng);
    if (!suits) return null;
    var idx = 0;
    var hole = holeRanks.map(function (r) { return card(r, suits[idx++]); });
    var board = boardRanks.map(function (r) { return card(r, suits[idx++]); });
    rags.forEach(function (r) { board.push(card(r, suits[idx++])); });
    return handOk(hole, board, kind);
  }

  function buildMonster(street, rng) {
    var b = 2 + rng.int(9);
    var have = [b, b + 1, b + 2, b + 3].sort(function (a, c) { return a - c; });
    var ban = {};
    have.forEach(function (r) { ban[r] = true; });
    (b === 2 ? [14, 6] : [b - 1, b + 4]).forEach(function (r) { ban[r] = true; });
    var ragPool = RANK_NUMS.filter(function (r) { return !ban[r]; });
    var ragN = street === 'turn' ? 2 : 1;
    var rags = rng.sample(ragPool, ragN);
    if (rags.length !== ragN) return null;
    var suit = rng.pick(SUITS);
    var hole = [card(have[0], suit), card(have[1], suit)];
    var board = [card(have[2], suit), card(have[3], suit)];
    rags.forEach(function (r) {
      var s = rng.pick(SUITS.filter(function (x) { return x !== suit; }));
      board.push(card(r, s));
    });
    return handOk(hole, board, 'monster');
  }

  function buildSet(street, rng) {
    var pr = rng.pick(RANK_NUMS);
    var hs = rng.sample(SUITS, 2);
    var hole = [card(pr, hs[0]), card(pr, hs[1])];
    var n = street === 'turn' ? 4 : 3;
    var br = rng.sample(otherRanks([pr]), n);
    var suits = dealSuits(n, 2, rng);
    if (!suits || br.length !== n) return null;
    var board = br.map(function (r, i) { return card(r, suits[i]); });
    return handOk(hole, board, 'set');
  }

  function buildOvers(street, rng) {
    var n = street === 'turn' ? 4 : 3;
    var holeRanks = rng.sample(RANK_NUMS.filter(function (r) { return r - 2 >= n; }), 2);
    if (holeRanks.length < 2) return null;
    var lo = Math.min(holeRanks[0], holeRanks[1]);
    var below = RANK_NUMS.filter(function (r) { return r < lo; });
    if (below.length < n) return null;
    var br = rng.sample(below, n);
    var suits = dealSuits(2 + n, 2, rng);
    if (!suits) return null;
    var hole = [card(holeRanks[0], suits[0]), card(holeRanks[1], suits[1])];
    var board = br.map(function (r, i) { return card(r, suits[i + 2]); });
    return handOk(hole, board, 'overs');
  }

  function buildTwoPair(street, rng) {
    var pairR = rng.sample(RANK_NUMS, 2);
    var ragN = street === 'turn' ? 2 : 1;
    var rags = rng.sample(otherRanks(pairR), ragN);
    if (rags.length !== ragN) return null;
    var suits = dealSuits(4 + ragN, 2, rng);
    if (!suits) return null;
    var hole = [card(pairR[0], suits[0]), card(pairR[1], suits[1])];
    var board = [card(pairR[0], suits[2]), card(pairR[1], suits[3])];
    rags.forEach(function (r, i) { board.push(card(r, suits[4 + i])); });
    return handOk(hole, board, 'twopair');
  }

  function buildTrips(street, rng) {
    var tr = rng.pick(RANK_NUMS);
    var sideN = street === 'turn' ? 3 : 2;
    var sides = rng.sample(otherRanks([tr]), sideN);
    if (sides.length !== sideN) return null;
    var hs = rng.sample(SUITS, 2);
    var hole = [card(tr, hs[0]), card(tr, hs[1])];
    var boardSuitPool = SUITS.filter(function (s) { return s !== hs[0] && s !== hs[1]; });
    if (!boardSuitPool.length) boardSuitPool = SUITS.slice();
    var board = [card(tr, rng.pick(boardSuitPool))];
    var maxPer = street === 'turn' ? 3 : 2;
    sides.forEach(function (r) {
      var used = {};
      hole.concat(board).forEach(function (c) { used[c.suit] = (used[c.suit] || 0) + 1; });
      var opts = SUITS.filter(function (s) { return (used[s] || 0) < maxPer; });
      if (!opts.length) opts = SUITS.slice();
      board.push(card(r, rng.pick(opts)));
    });
    return handOk(hole, board, 'trips');
  }

  function buildBackdoorFlush(street, rng) {
    if (street === 'turn') return null;
    var suit = rng.pick(SUITS);
    var ranks = rng.sample(RANK_NUMS, 5);
    var holeRanks = ranks.slice(0, 2);
    var boardSuitRank = ranks[2];
    var ragRanks = ranks.slice(3);
    if (Math.max(ragRanks[0], ragRanks[1], boardSuitRank) < Math.max(holeRanks[0], holeRanks[1])) return null;
    var hole = [card(holeRanks[0], suit), card(holeRanks[1], suit)];
    var board = [card(boardSuitRank, suit)];
    var ragSuits = rng.sample(SUITS.filter(function (s) { return s !== suit; }), 2);
    if (ragSuits.length < 2) return null;
    board.push(card(ragRanks[0], ragSuits[0]));
    board.push(card(ragRanks[1], ragSuits[1]));
    return handOk(hole, board, 'bdf');
  }

  function buildBackdoorStraight(street, rng) {
    if (street === 'turn') return null;
    var s = 3 + rng.int(8);
    var triple = [s, s + 1, s + 2];
    var ban = {};
    for (var r = s - 2; r <= s + 4; r++) if (r >= 2 && r <= 14) ban[r] = true;
    var pool = RANK_NUMS.filter(function (r) { return !ban[r]; });
    var rags = rng.sample(pool, 2);
    if (rags.length < 2) return null;
    var suits = dealSuits(5, 2, rng);
    if (!suits) return null;
    var hole = [card(triple[0], suits[0]), card(triple[1], suits[1])];
    var board = [card(triple[2], suits[2]), card(rags[0], suits[3]), card(rags[1], suits[4])];
    var a = handOk(hole, board, 'bds');
    if (!a) return null;
    if (a.runner.hits !== 48) return null;
    return a;
  }

  var BUILDERS = {
    flush: buildFlush,
    oesd: function (street, rng) { return buildStraightDraw(street, rng, 'oesd'); },
    gutshot: function (street, rng) { return buildStraightDraw(street, rng, 'gutshot'); },
    monster: buildMonster,
    set: buildSet,
    overs: buildOvers,
    twopair: buildTwoPair,
    trips: buildTrips,
    bdf: buildBackdoorFlush,
    bds: buildBackdoorStraight
  };

  function legalStreets(type) {
    if (type === 'bdf' || type === 'bds') return ['flop'];
    return ['flop', 'turn'];
  }

  function generate(type, opts) {
    opts = opts || {};
    if (!BUILDERS[type]) throw new Error('unknown type ' + type);
    var rng = makeRng(opts.rng);
    var street = opts.street;
    if (!street) {
      var choices = legalStreets(type);
      street = rng.pick(choices);
    }
    if (legalStreets(type).indexOf(street) < 0) street = 'flop';
    var built = tryBuild(function () { return BUILDERS[type](street, rng); }, 400);
    if (!built) throw new Error('failed to generate ' + type + ' ' + street);
    return built;
  }

  function requiredEquity(pot, bet) {
    return bet / (pot + bet + bet);
  }

  function pickSpot(scenario, rng) {
    var eq = scenario.exact;
    var mental = scenario.mental == null ? null : scenario.mental / 100;
    var forceCall = eq >= 0.5;
    var wantCall = forceCall ? true : rng.float() < 0.5;
    var bets = [10, 20, 30, 40, 50, 60, 80, 100];
    var pots = [20, 40, 60, 80, 100, 150, 200, 300, 400, 600, 800, 1000];
    var relaxed = false;
    for (var pass = 0; pass < 2; pass++) {
      var margin = pass === 0 ? 0.025 : 0.012;
      for (var i = 0; i < 500; i++) {
        var bet = rng.pick(bets);
        var pot = rng.pick(pots);
        var req = requiredEquity(pot, bet);
        var call = eq + 1e-12 >= req;
        if (call !== wantCall) continue;
        if (mental != null) {
          var mentalCall = mental + 1e-12 >= req;
          if (mentalCall !== call) continue;
        }
        if (Math.abs(eq - req) < margin) continue;
        return { pot: pot, bet: bet, required: req, potAction: call ? 'call' : 'fold' };
      }
      relaxed = true;
    }
    if (relaxed && forceCall) {
      return { pot: 200, bet: 50, required: requiredEquity(200, 50), potAction: 'call' };
    }
    return null;
  }

  function generatePot(opts) {
    opts = opts || {};
    var rng = makeRng(opts.rng);
    var type = opts.type || rng.pick(TYPES).id;
    var scenario = generate(type, { street: opts.street, rng: opts.rng || rng.float });
    var spot = pickSpot(scenario, rng);
    if (!spot) throw new Error('failed to build pot spot for ' + type);
    return {
      scenario: scenario,
      pot: spot.pot,
      bet: spot.bet,
      required: spot.required,
      potAction: spot.potAction
    };
  }

  function gradeProb(input, analysis) {
    var x = typeof input === 'number' ? input : parseFloat(String(input).replace('%', '').trim());
    if (!isFinite(x) || analysis.exact == null) return false;
    var exactPct = analysis.exact * 100;
    if (analysis.backdoor) return Math.abs(x - exactPct) <= 1;
    if (Math.round(x) === analysis.mental) return true;
    return Math.abs(x - exactPct) <= 1;
  }

  function gradeAnswer(answer, analysis) {
    var typeOk = answer.type === analysis.type;
    var outsN = typeof answer.outs === 'number' ? answer.outs : parseInt(answer.outs, 10);
    var outsOk = outsN === analysis.outCount;
    var probOk = gradeProb(answer.prob, analysis);
    return { typeOk: typeOk, outsOk: outsOk, probOk: probOk, allOk: typeOk && outsOk && probOk };
  }

  function cellKey(row, col) {
    var a = RANK_ORDER[row], b = RANK_ORDER[col];
    if (row === col) return a + a;
    if (row < col) return a + b + 's';
    return b + a + 'o';
  }

  function allHandKeys() {
    var list = [];
    for (var i = 0; i < 13; i++) {
      for (var j = 0; j < 13; j++) list.push(cellKey(i, j));
    }
    return list;
  }

  function handKeyFromCards(holeIn) {
    var hole = sortCards(parseCards(holeIn));
    var a = RANK_CHAR[hole[0].rank];
    var b = RANK_CHAR[hole[1].rank];
    if (hole[0].rank === hole[1].rank) return a + a;
    var suited = hole[0].suit === hole[1].suit;
    return a + b + (suited ? 's' : 'o');
  }

  var EARLY_RAISE = ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', 'AKs', 'AQs', 'AJs', 'ATs', 'KQs', 'KJs', 'QJs', 'JTs', 'AKo', 'AQo', 'AJo', 'KQo'];
  var MIDDLE_RAISE = EARLY_RAISE.concat(['66', '55', 'A9s', 'A8s', 'A5s', 'KTs', 'QTs', 'J9s', 'T9s', '98s', 'ATo', 'KJo', 'QJo']);
  var MIDDLE_CALL = ['44', '33', '22', 'A7s', 'A6s', 'A4s', 'A3s', 'A2s', 'K9s', 'Q9s', '87s', '76s', '65s', 'KTo', 'QTo', 'JTo'];
  var LATE_RAISE = ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
    'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
    'KQs', 'KJs', 'KTs', 'K9s', 'QJs', 'QTs', 'Q9s', 'JTs', 'J9s', 'T9s', 'T8s', '98s', '97s', '87s', '86s', '76s', '75s', '65s', '64s', '54s',
    'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'KQo', 'KJo', 'KTo', 'QJo', 'QTo', 'JTo', 'T9o'];
  var LATE_CALL = ['K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s', 'Q8s', 'J8s', 'T7s', '96s', '85s', '74s', '63s', '53s', '43s',
    'A8o', 'A7o', 'A6o', 'A5o', 'A4o', 'A3o', 'A2o', 'K9o', 'Q9o', 'J9o', 'T8o', '98o'];

  function buildChart() {
    var chart = { early: {}, middle: {}, late: {} };
    function fill(pos, action, list) {
      list.forEach(function (k) {
        if (chart[pos][k] && chart[pos][k] !== action) throw new Error('chart overlap ' + pos + ' ' + k);
        chart[pos][k] = action;
      });
    }
    fill('early', 'raise', EARLY_RAISE);
    fill('middle', 'raise', MIDDLE_RAISE);
    fill('middle', 'call', MIDDLE_CALL);
    fill('late', 'raise', LATE_RAISE);
    fill('late', 'call', LATE_CALL);
    allHandKeys().forEach(function (k) {
      POSITIONS.forEach(function (p) {
        if (!chart[p.id][k]) chart[p.id][k] = 'fold';
      });
    });
    return chart;
  }

  var CHART = buildChart();

  function chartAction(key, position) {
    if (!CHART[position] || !CHART[position][key]) throw new Error('bad hand ' + key);
    return CHART[position][key];
  }

  function posKo(position) {
    var p = POSITIONS.filter(function (x) { return x.id === position; })[0];
    return p ? p.ko : position;
  }

  function prettyKey(key) {
    if (key.length === 2) return '포켓 ' + (key[0] === 'T' ? '10' : key[0]);
    var a = key[0] === 'T' ? '10' : key[0];
    var b = key[1] === 'T' ? '10' : key[1];
    return a + '·' + b + (key[2] === 's' ? ' 수티드' : ' 오프수트');
  }

  function chartReason(key, position) {
    var action = chartAction(key, position);
    var where = posKo(position);
    var name = prettyKey(key);
    if (key === 'A5s' && action === 'raise') {
      return where + '에서 A5 수티드는 낮은 에이스지만 A-2-3-4-5 스트레이트가 있어서 레이즈예요.';
    }
    if (action === 'raise') {
      if (key.length === 2 && 'AKQJT'.indexOf(key[0]) >= 0) return where + '에서 ' + name + '는 강한 포켓 페어라 레이즈예요.';
      if (key.length === 2) return where + '에서 ' + name + '는 셋을 노릴 수 있어 레이즈예요.';
      if (key[2] === 's') return where + '에서 ' + name + '는 플러시가 되는 좋은 핸드라 먼저 레이즈해요.';
      return where + '에서 ' + name + '는 높은 카드라 레이즈예요.';
    }
    if (action === 'call') {
      if (key.length === 2) return where + '에서 ' + name + '는 작은 포켓 페어예요. 초보자 기준으로는 콜로 셋만 노려요.';
      if (key[2] === 's') return where + '에서 ' + name + '는 수티드 보조 핸드예요. 초보자 기준으로는 콜로 플랍을 봐요.';
      return where + '에서 ' + name + '는 애매한 오프수트예요. 이 자리에서는 콜로만 봐요.';
    }
    return where + '에서 ' + name + '는 너무 약해요. 초보자 기준은 폴드예요.';
  }

  function randomChartSpot(rngIn) {
    var rng = makeRng(rngIn);
    var row = rng.int(13), col = rng.int(13);
    var key = cellKey(row, col);
    var position = rng.pick(POSITIONS).id;
    var suited = key.length === 3 && key[2] === 's';
    var pair = key.length === 2;
    var r1 = CHAR_RANK[key[0]];
    var r2 = pair ? r1 : CHAR_RANK[key[1]];
    var suits;
    if (pair) suits = rng.sample(SUITS, 2);
    else if (suited) { var s = rng.pick(SUITS); suits = [s, s]; }
    else {
      suits = rng.sample(SUITS, 2);
    }
    return {
      key: key,
      position: position,
      positionLabel: posKo(position),
      action: chartAction(key, position),
      reason: chartReason(key, position),
      hole: [card(r1, suits[0]), card(r2, suits[1])]
    };
  }

  function generateFullHand(opts) {
    opts = opts || {};
    var rng = makeRng(opts.rng);
    var type = opts.type || rng.pick(TYPES).id;
    var scenario = generate(type, { street: 'flop', rng: opts.rng || rng.float });
    var key = handKeyFromCards(scenario.hole);
    var position = opts.position || rng.pick(POSITIONS).id;
    return {
      scenario: scenario,
      key: key,
      position: position,
      positionLabel: posKo(position),
      action: chartAction(key, position),
      reason: chartReason(key, position)
    };
  }

  function cheatSheet() {
    function row(id, outs, streetOuts) {
      var meta = TYPES.filter(function (t) { return t.id === id; })[0];
      var flopOuts = outs;
      var turnOuts = streetOuts == null ? outs : streetOuts;
      return {
        id: id,
        ko: meta.ko,
        outsLabel: streetOuts == null ? String(outs) : (outs + ' / ' + streetOuts),
        flopMental: mental42(flopOuts, 'flop'),
        flopExact: exactOutsProb(flopOuts, 'flop'),
        turnMental: mental42(turnOuts, 'turn'),
        turnExact: exactOutsProb(turnOuts, 'turn'),
        backdoor: false
      };
    }
    var rows = [
      row('flush', 9),
      row('oesd', 8),
      row('gutshot', 4),
      row('monster', 15),
      row('set', 2),
      row('overs', 6),
      row('twopair', 4),
      row('trips', 7, 10)
    ];
    var total = comb(47, 2);
    rows.push({
      id: 'bdf', ko: '백도어 플러쉬', outsLabel: '없음',
      flopMental: null, flopExact: comb(10, 2) / total,
      turnMental: null, turnExact: null, backdoor: true,
      note: '무늬 3장. 남은 10장 중 2장이 연속으로 와야 해요.'
    });
    rows.push({
      id: 'bds', ko: '백도어 스트레이트', outsLabel: '없음',
      flopMental: null, flopExact: (3 * 4 * 4) / total,
      turnMental: null, turnExact: null, backdoor: true,
      note: '3연속인 대표 경우. 서로 다른 랭크 두 조합이 3가지예요.'
    });
    rows.forEach(function (r) {
      if (r.id === 'trips') r.note = '플랍은 쿼드 1장 + 페어링 6장. 턴에 랭크가 하나 더 살아 있으면 보통 10장.';
      if (r.id === 'monster') r.note = '플러쉬 9장 + 양방 8장 − 겹치는 2장 = 15장.';
    });
    return rows;
  }

  var HAND_RANKS = [
    { rank: 1, name: '로열 스트레이트 플러쉬', blurb: 'A·K·Q·J·10이 모두 같은 무늬. 제일 세요.', cards: ['As', 'Ks', 'Qs', 'Js', 'Ts'] },
    { rank: 2, name: '스트레이트 플러쉬', blurb: '이어진 숫자 5장이 같은 무늬.', cards: ['9h', '8h', '7h', '6h', '5h'] },
    { rank: 3, name: '포카드', blurb: '같은 숫자 4장. 쿼드라고도 해요.', cards: ['Qc', 'Qd', 'Qh', 'Qs', '3d'] },
    { rank: 4, name: '풀하우스', blurb: '같은 숫자 3장과, 다른 숫자 2장이 같이 있는 족보예요.', cards: ['8c', '8d', '8s', 'Kh', 'Kc'] },
    { rank: 5, name: '플러쉬', blurb: '같은 무늬 5장. 숫자는 안 이어져도 돼요. 플러시와 같은 말이에요.', cards: ['Ad', 'Jd', '8d', '6d', '2d'] },
    { rank: 6, name: '스트레이트', blurb: '숫자가 이어진 5장. 무늬는 달라도 돼요. A는 K 옆(맨 위)이나 2 옆(A-2-3-4-5)에만 붙고, K-A-2처럼 휘감지는 안 돼요.', cards: ['Tc', '9d', '8h', '7s', '6c'] },
    { rank: 7, name: '트리플', blurb: '같은 숫자 3장. 셋, 트립스와 같은 족보예요.', cards: ['7c', '7d', '7h', 'Ks', '2c'] },
    { rank: 8, name: '투페어', blurb: '페어(같은 숫자 2장)가 두 개.', cards: ['Jc', 'Js', '4h', '4d', 'Ac'] },
    { rank: 9, name: '원페어', blurb: '같은 숫자 2장 하나. 가장 흔한 만든 족보예요.', cards: ['Th', 'Td', 'Ks', '6c', '3h'] },
    { rank: 10, name: '하이카드', blurb: '위 족보가 하나도 없을 때. 가장 높은 숫자로 겨뤄요.', cards: ['Ah', 'Qc', '9s', '5d', '3c'] }
  ];

  var DRAW_LESSONS = [
    {
      id: 'flush',
      aimName: '플러쉬',
      aim: '같은 무늬 5장이에요. 하트·다이아·스페이드·클럽 중 하나만 같으면 되고, 숫자가 이어질 필요는 없어요. 스트레이트보다 높고 풀하우스보다 낮아요.',
      when: '내 핸드와 보드를 합쳐 같은 무늬가 이미 4장일 때예요. 그 무늬가 한 장만 더 나오면 플러쉬가 됩니다.',
      countWhy: '한 무늬는 13장이에요. 이 예시는 하트를 4장(A♥ K♥ 7♥ 2♥) 봤으니, 아직 안 나온 하트 9장이 아웃츠예요. 그 9장 중 아무거나 한 장이 오면 하트 5장 = 플러쉬. 9♣처럼 다른 무늬는 아웃츠가 아니에요.',
      hole: ['Ah', '7h'],
      board: ['Kh', '2h', '9c']
    },
    {
      id: 'oesd',
      aimName: '스트레이트',
      aim: '숫자가 빈칸 없이 이어진 5장이에요. 무늬는 달라도 됩니다. 예를 들면 5-6-7-8-9. 플러쉬보다 낮고 트리플보다 높아요. A는 K 옆에 붙거나, A-2-3-4-5처럼 맨 아래에만 이어져요. K-A-2처럼 한 바퀴 도는 건 스트레이트가 아니에요.',
      when: '이어진 4장을 가지고, 그 줄의 아래와 위가 둘 다 열려 있을 때예요. 어느 쪽이 나와도 5장이 이어집니다. 양쪽이 살아 있어서 양방 스트레이트라고 해요.',
      countWhy: '이 예시는 5-6-7-8이 이어져 있어요. 보드의 J는 9가 없어서 이 줄에 안 붙어요. 4가 오면 4-5-6-7-8, 9가 오면 5-6-7-8-9. 4는 무늬가 4개, 9도 4개라 4+4=8장이에요.',
      hole: ['8s', '7h'],
      board: ['Jd', '6c', '5h']
    },
    {
      id: 'gutshot',
      aimName: '스트레이트',
      aim: '노리는 족보는 양방과 같은 스트레이트예요. 숫자가 이어진 5장이고, 무늬는 달라도 돼요.',
      when: '다섯 칸 중 가운데 한 칸이 비어 있을 때예요. 그 구멍의 숫자만 오면 스트레이트가 됩니다. 양 끝 숫자가 나와도 구멍은 그대로라 아직 스트레이트가 아니에요. 구멍이 하나 있어서 구멍 스트레이트, 줄여서 샷건이라고 해요.',
      countWhy: '이 예시는 5, 6, 8, 9가 있어요. 빈칸은 7뿐이에요. 7은 무늬가 4개라 아웃츠는 4장이고, 7이 오면 5-6-7-8-9가 돼요. 4가 오면 4-5-6-8-9로 7이 여전히 비고, 10이 와도 5-6-8-9-10으로 역시 7이 비어서 아웃츠가 아니에요. 양방(8장)보다 절반이라 더 어려워요.',
      hole: ['9s', '8h'],
      board: ['6d', '5c', 'Kh']
    },
    {
      id: 'monster',
      aimName: '플러쉬 또는 스트레이트',
      aim: '플러쉬(같은 무늬 5장)와 스트레이트(이어진 5장) 중 하나만 돼도 성공이에요. 둘을 동시에 노려서 아웃츠가 제일 많아요.',
      when: '플러쉬 드로우와 양방 스트레이트가 겹쳐 있을 때예요. 같은 무늬가 4장이고, 숫자도 양쪽으로 열린 4연속일 때입니다. 버튼 이름의 몬스터(플러쉬+양방)가 그 뜻이에요.',
      countWhy: '하트 플러쉬 아웃은 9장, 양방 스트레이트 아웃은 4와 9로 8장이에요. 그런데 4♥와 9♥는 플러쉬이면서 스트레이트예요. 같은 카드를 두 번 세면 안 되니 빼요. 9 + 8 - 2 = 15장.',
      hole: ['8h', '7h'],
      board: ['6h', '5h', 'Kc']
    },
    {
      id: 'set',
      aimName: '셋 (트리플)',
      aim: '같은 숫자 3장이에요. 셋·트리플·트립스는 완성된 족보로는 같아요. 투페어보다 높고 스트레이트보다 낮아요.',
      when: '내 두 장이 같은 숫자면 포켓 페어예요. 보드에는 그 숫자가 아직 없고, 그 숫자 한 장이 더 오면 셋이 됩니다. 이미 3장인 트립스→풀하우스 드로우와는 달라요. 이건 아직 2장이에요.',
      countWhy: '8은 카드 52장 안에 4장뿐이에요. 8♠ 8♥를 내가 갖고 있으니 남은 건 8♦와 8♣, 두 장. 이 두 장만 아웃츠예요. 다른 숫자는 셋을 못 만들어요.',
      hole: ['8s', '8h'],
      board: ['Kd', '5c', '2h']
    },
    {
      id: 'overs',
      aimName: '원페어',
      aim: '같은 숫자 2장이에요. 족보에서는 낮은 편이지만, 보드의 어떤 카드보다 높은 숫자로 페어가 되면 그 판에서는 센 페어가 돼요.',
      when: '내 두 장의 숫자가 서로 다르고, 둘 다 보드에 깔린 카드보다 높을 때예요. 보드보다 높은 카드를 오버카드라고 해요.',
      countWhy: 'A와 K가 둘 다 보드의 제일 높은 9보다 높아요. A는 한 장 봤으니 3장 남고, K도 3장 남아요. 3+3=6장. A가 오면 A 페어, K가 오면 K 페어. 9보다 낮은 카드는 이 드로우의 아웃츠가 아니에요.',
      hole: ['As', 'Kd'],
      board: ['9c', '7h', '2s']
    },
    {
      id: 'twopair',
      aimName: '풀하우스',
      aim: '같은 숫자 3장과 다른 숫자 2장이 같이 있는 족보예요. 플러쉬보다 높아요.',
      when: '이미 페어가 두 개일 때예요. 그 두 숫자 중 하나가 한 장만 더 오면 3장+2장, 풀하우스가 됩니다.',
      countWhy: 'A 페어와 K 페어가 있어요. A는 두 장을 봤으니 2장 남고, K도 2장 남아요. 2+2=4장. 남은 A가 오면 A 세 장 + K 두 장, 남은 K가 오면 K 세 장 + A 두 장. 7이 하나 더 나와도 7 페어가 생길 뿐, 3장이 없어서 풀하우스가 아니에요. 그래서 7은 아웃츠가 아니에요.',
      hole: ['As', 'Kd'],
      board: ['Ac', 'Kh', '7d']
    },
    {
      id: 'trips',
      aimName: '풀하우스 또는 포카드',
      aim: '풀하우스는 3장+2장, 포카드는 같은 숫자 4장이에요. 포카드가 더 세요. 이미 같은 숫자가 3장이면 둘 다 노릴 수 있어요.',
      when: '같은 숫자가 이미 3장(트리플)일 때예요. 이 예시는 포켓 8이 보드의 8과 만나 8이 세 장이 된 경우예요. 포켓페어→셋은 3장을 기다리는 드로우이고, 이 드로우는 3장이 이미 있을 때예요.',
      countWhy: '플랍에서는 아웃츠가 7장이에요. 남은 8 한 장(8♣)이 오면 8이 4장 = 포카드. 보드의 K나 3이 한 장 더 오면 그 숫자가 2장이 되어, 8 세 장 + 2장 = 풀하우스예요. K는 3장, 3도 3장 남아서 6장. 포카드 1장 + 풀하우스 6장 = 7장. 턴에 보드 숫자가 하나 더 있으면 그 숫자의 남은 3장도 풀하우스 아웃츠가 되어, 보통 10장이 돼요.',
      hole: ['8s', '8h'],
      board: ['8d', 'Kc', '3h']
    },
    {
      id: 'bdf',
      aimName: '플러쉬',
      aim: '같은 무늬 5장, 플러쉬를 노리는 건 플러쉬 드로우와 같아요. 차이는 카드 한 장으로는 부족하고, 앞으로 나올 두 장이 둘 다 그 무늬여야 한다는 점이에요.',
      when: '플랍(뒤에 2장이 남은 때)에 같은 무늬가 3장이고, 그 무늬가 내 핸드에도 있을 때예요. 뒷문으로 두 장을 연달아 맞춰야 해서 백도어라고 하고, 런너런너라고도 해요. 턴에는 카드가 1장뿐이라 이 드로우가 없어요.',
      countWhy: '한 장짜리 아웃츠는 0장이에요. 아웃츠×4 같은 4-2 규칙은 쓰지 않아요. 하트 13장 중 3장(A♥ 9♥ 2♥)을 봤으니 10장이 남아요. 뒤에 나올 두 장이 그 10장 안에서 둘 다 나와야 해요. 10장 중 2장을 고르는 수는 45, 아무 두 장을 고르는 수는 1,081이에요. 하트가 한 장만 오면 아직 플러쉬가 아니에요.',
      hole: ['Ah', '9h'],
      board: ['2h', 'Kd', '7c']
    },
    {
      id: 'bds',
      aimName: '스트레이트',
      aim: '숫자가 이어진 5장, 스트레이트를 노려요. 역시 한 장으로는 안 되고, 남은 두 장이 둘 다 맞아야 해요.',
      when: '플랍에서 카드 한 장으로는 스트레이트가 안 되는데, 두 장이 특정 숫자로 오면 되는 경우예요. 가장 보기 쉬운 예는 숫자가 3장 이어져 있을 때예요. 턴에는 백도어가 없어요.',
      countWhy: '한 장짜리 아웃츠는 0장이에요. 8-9-10이 이어져 있고, 스트레이트가 되는 두 장 조합은 세 가지뿐이에요. 6과 7이면 6-7-8-9-10, 7과 J면 7-8-9-10-J, J와 Q면 8-9-10-J-Q. 서로 다른 숫자 두 장은 무늬가 4×4=16가지라 3×16=48가지이고, 아무 두 장은 1,081가지예요. 4나 2는 이 줄과 안 이어져요.',
      hole: ['9s', '8h'],
      board: ['Td', '4c', '2h'],
      samples: [
        { label: '6과 7이 같이 오면 6-7-8-9-10', n: 16, cards: ['6s', '7h'] },
        { label: '7과 J가 같이 오면 7-8-9-10-J', n: 16, cards: ['7d', 'Jh'] },
        { label: 'J와 Q가 같이 오면 8-9-10-J-Q', n: 16, cards: ['Js', 'Qd'] }
      ]
    }
  ];

  function handRanks() {
    return HAND_RANKS.map(function (row) {
      return { rank: row.rank, name: row.name, blurb: row.blurb, cards: parseCards(row.cards) };
    });
  }

  function drawLessons() {
    return DRAW_LESSONS.map(function (lesson) {
      var meta = TYPES.filter(function (t) { return t.id === lesson.id; })[0];
      var analysis = analyze(lesson.hole, lesson.board);
      if (!meta || analysis.type !== lesson.id) throw new Error('draw lesson does not match ' + lesson.id);
      return {
        id: lesson.id,
        ko: meta.ko,
        aimName: lesson.aimName,
        aim: lesson.aim,
        when: lesson.when,
        countWhy: lesson.countWhy,
        samples: (lesson.samples || []).map(function (s) {
          return { label: s.label, n: s.n, cards: parseCards(s.cards) };
        }),
        analysis: analysis
      };
    });
  }

  function fmtPct(fraction) {
    if (fraction == null || !isFinite(fraction)) return '—';
    var n = Math.round(fraction * 10000) / 100;
    return n.toFixed(2) + '%';
  }

  function formulaText(analysis) {
    if (!analysis.detail) return '';
    var d = analysis.detail;
    if (d.kind === 'turn') return analysis.outCount + ' / 46';
    if (d.kind === 'flop') {
      return '1 − C(47−' + d.outs + ', 2) / C(47, 2) = 1 − ' + d.miss + '/' + d.total + ' = ' + d.hit + '/' + d.total;
    }
    if (d.kind === 'runner') {
      if (analysis.type === 'bdf') return 'C(' + analysis.runner.left.length + ', 2) / C(47, 2) = ' + d.hits + '/' + d.total;
      return d.hits + ' / ' + d.total;
    }
    return '';
  }

  return {
    SUITS: SUITS,
    SUIT_SYM: SUIT_SYM,
    TYPES: TYPES,
    POSITIONS: POSITIONS,
    RANK_ORDER: RANK_ORDER,
    comb: comb,
    exactOutsProb: exactOutsProb,
    mental42: mental42,
    card: card,
    parseCard: parseCard,
    cardLabel: cardLabel,
    rankLabel: rankLabel,
    analyze: analyze,
    generate: generate,
    legalStreets: legalStreets,
    requiredEquity: requiredEquity,
    generatePot: generatePot,
    gradeAnswer: gradeAnswer,
    gradeProb: gradeProb,
    cellKey: cellKey,
    allHandKeys: allHandKeys,
    handKeyFromCards: handKeyFromCards,
    chart: function () { return CHART; },
    chartAction: chartAction,
    chartReason: chartReason,
    randomChartSpot: randomChartSpot,
    generateFullHand: generateFullHand,
    cheatSheet: cheatSheet,
    handRanks: handRanks,
    drawLessons: drawLessons,
    fmtPct: fmtPct,
    formulaText: formulaText,
    prettyKey: prettyKey
  };
});
