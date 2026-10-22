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
    fmtPct: fmtPct,
    formulaText: formulaText,
    prettyKey: prettyKey
  };
});
