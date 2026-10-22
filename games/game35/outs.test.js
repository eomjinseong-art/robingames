'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('./outs.js');

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function codes(list) {
  return list.map((c) => c.code);
}

test('combinations and the 4-2 formulas are computed, not a lookup table', () => {
  assert.equal(P.comb(47, 2), 1081);
  assert.equal(P.comb(38, 2), 703);
  assert.equal(P.comb(32, 2), 496);
  assert.equal(P.comb(10, 2), 45);
  assert.equal(P.comb(0, 2), 0);
  assert.equal(P.exactOutsProb(9, 'flop'), 1 - P.comb(38, 2) / P.comb(47, 2));
  assert.equal(P.exactOutsProb(15, 'flop'), 1 - P.comb(32, 2) / P.comb(47, 2));
  assert.equal(P.exactOutsProb(9, 'turn'), 9 / 46);
  assert.equal(P.exactOutsProb(0, 'flop'), 0);
  assert.equal(P.mental42(9, 'flop'), 36);
  assert.equal(P.mental42(9, 'turn'), 18);
  assert.equal(P.mental42(15, 'flop'), 60);
});

test('crafted flush draw has 9 unseen hearts and no straight', () => {
  const a = P.analyze(['Ah', '7h'], ['Kh', '2h', '9c']);
  assert.equal(a.type, 'flush');
  assert.equal(a.street, 'flop');
  assert.equal(a.outCount, 9);
  assert.ok(a.outs.every((c) => c.suit === 'h'));
  const seen = new Set(['Ah', '7h', 'Kh', '2h', '9c']);
  a.outs.forEach((c) => assert.equal(seen.has(c.code), false));
  assert.equal(a.exact, P.exactOutsProb(9, 'flop'));
  assert.equal(a.mental, 36);
  assert.match(P.formulaText(a), /1 − C\(47−9, 2\)/);
});

test('crafted open-ender, gutshot, set, overcards, two pair', () => {
  const oesd = P.analyze(['8s', '7h'], ['Jd', '6c', '5h']);
  assert.equal(oesd.type, 'oesd');
  assert.equal(oesd.outCount, 8);
  assert.deepEqual(oesd.outs.map((c) => c.rank).filter((r, i, arr) => arr.indexOf(r) === i).sort((a, b) => a - b), [4, 9]);

  const gut = P.analyze(['9s', '8h'], ['6d', '5c', 'Kh']);
  assert.equal(gut.type, 'gutshot');
  assert.equal(gut.outCount, 4);
  assert.ok(gut.outs.every((c) => c.rank === 7));

  const set = P.analyze(['8s', '8h'], ['Kd', '5c', '2h']);
  assert.equal(set.type, 'set');
  assert.equal(set.outCount, 2);
  assert.deepEqual(codes(set.outs).sort(), ['8c', '8d']);

  const overs = P.analyze(['As', 'Kd'], ['9c', '7h', '2s']);
  assert.equal(overs.type, 'overs');
  assert.equal(overs.outCount, 6);

  const tp = P.analyze(['As', 'Kd'], ['Ac', 'Kh', '7d']);
  assert.equal(tp.type, 'twopair');
  assert.equal(tp.outCount, 4);
});

test('monster draw does not double-count cards that are both flush and straight outs', () => {
  const a = P.analyze(['8h', '7h'], ['6h', '5h', 'Kc']);
  assert.equal(a.type, 'monster');
  const flush = new Set(a.groups[0].cards.map((c) => c.code));
  const straight = new Set(a.groups[1].cards.map((c) => c.code));
  const overlap = a.groups[2].cards.map((c) => c.code);
  assert.equal(flush.size, 9);
  assert.equal(straight.size, 8);
  assert.equal(overlap.length, 2);
  overlap.forEach((code) => {
    assert.ok(flush.has(code));
    assert.ok(straight.has(code));
  });
  assert.equal(a.outCount, flush.size + straight.size - overlap.length);
  assert.equal(a.outCount, 15);
  const seen = new Set(codes(a.hole.concat(a.board)));
  a.outs.forEach((c) => assert.equal(seen.has(c.code), false));
  assert.equal(a.exact, 1 - P.comb(32, 2) / P.comb(47, 2));
});

test('trips on the flop are 1 quad card plus 6 pairing cards', () => {
  const a = P.analyze(['8s', '8h'], ['8d', 'Kc', '3h']);
  assert.equal(a.type, 'trips');
  assert.equal(a.street, 'flop');
  assert.equal(a.outCount, 7);
  const quad = a.groups[0].cards;
  const pair = a.groups[1].cards;
  assert.equal(quad.length, 1);
  assert.equal(quad[0].code, '8c');
  assert.equal(pair.length, 6);
  const byRank = {};
  pair.forEach((c) => { byRank[c.rank] = (byRank[c.rank] || 0) + 1; });
  assert.deepEqual(Object.values(byRank).sort(), [3, 3]);
  assert.equal(a.exact, P.exactOutsProb(7, 'flop'));

  const turn = P.analyze(['8s', '8h'], ['8d', 'Kc', '3h', '2s']);
  assert.equal(turn.type, 'trips');
  assert.equal(turn.outCount, 10);
  assert.equal(turn.exact, 10 / 46);
});

test('backdoor flush is runner-runner with no single outs', () => {
  const a = P.analyze(['Ah', '9h'], ['2h', 'Kd', '7c']);
  assert.equal(a.type, 'bdf');
  assert.equal(a.outCount, 0);
  assert.equal(a.mental, null);
  assert.equal(a.runner.left.length, 10);
  assert.equal(a.runner.hits, P.comb(10, 2));
  assert.equal(a.exact, P.comb(10, 2) / P.comb(47, 2));
  assert.ok(Math.abs(a.exact - 0.042) < 0.002);
  assert.match(P.formulaText(a), /C\(10, 2\)/);
});

test('backdoor straight is runner-runner near 4.5% and has no one-card out', () => {
  const a = P.analyze(['9s', '8h'], ['Td', '4c', '2h']);
  assert.equal(a.type, 'bds');
  assert.equal(a.outCount, 0);
  assert.equal(a.mental, null);
  assert.equal(a.runner.hits, 48);
  assert.equal(a.runner.ways.length, 3);
  assert.equal(a.runner.ways.reduce((s, w) => s + w.n, 0), 48);
  assert.equal(a.exact, 48 / P.comb(47, 2));
  assert.ok(Math.abs(a.exact * 100 - 4.5) < 0.2);
});

test('grading accepts the 4-2 number and a close exact percent', () => {
  const a = P.analyze(['Ah', '7h'], ['Kh', '2h', '9c']);
  assert.equal(P.gradeAnswer({ type: 'flush', outs: 9, prob: 36 }, a).allOk, true);
  assert.equal(P.gradeAnswer({ type: 'flush', outs: 9, prob: 35 }, a).probOk, true);
  assert.equal(P.gradeAnswer({ type: 'flush', outs: 8, prob: 36 }, a).outsOk, false);
  assert.equal(P.gradeAnswer({ type: 'oesd', outs: 9, prob: 36 }, a).typeOk, false);
  const bd = P.analyze(['Ah', '9h'], ['2h', 'Kd', '7c']);
  assert.equal(P.gradeAnswer({ type: 'bdf', outs: 0, prob: 4 }, bd).allOk, true);
  assert.equal(P.gradeAnswer({ type: 'bdf', outs: 0, prob: 4.2 }, bd).probOk, true);
  assert.equal(P.gradeAnswer({ type: 'bdf', outs: 9, prob: 4 }, bd).outsOk, false);
  assert.equal(P.gradeAnswer({ type: 'bdf', outs: 0, prob: 0 }, bd).probOk, false);
});

test('pot odds use bet / (pot + bet + bet)', () => {
  assert.equal(P.requiredEquity(100, 50), 50 / 200);
  assert.equal(P.requiredEquity(80, 40), 40 / 160);
  const rng = mulberry32(7);
  for (let i = 0; i < 20; i++) {
    const spot = P.generatePot({ rng });
    assert.equal(spot.required, spot.bet / (spot.pot + spot.bet + spot.bet));
    const call = spot.scenario.exact >= spot.required;
    assert.equal(spot.potAction, call ? 'call' : 'fold');
    if (spot.scenario.mental != null) {
      const mentalCall = spot.scenario.mental / 100 >= spot.required;
      assert.equal(mentalCall, call);
    }
  }
});

test('random scenarios for every type keep an exact outs count', () => {
  const rng = mulberry32(20261022);
  for (const type of P.TYPES) {
    for (const street of P.legalStreets(type.id)) {
      for (let i = 0; i < 12; i++) {
        const a = P.generate(type.id, { street, rng });
        assert.equal(a.type, type.id, type.id + ' ' + street);
        assert.equal(a.street, street);
        const seen = new Set(codes(a.hole.concat(a.board)));
        assert.equal(seen.size, a.hole.length + a.board.length);
        a.outs.forEach((c) => assert.equal(seen.has(c.code), false));
        if (type.id === 'monster') {
          assert.equal(a.outCount, 15);
          assert.equal(a.overlapCount, 2);
          assert.equal(a.outCount, 9 + 8 - a.overlapCount);
        }
        if (type.id === 'trips' && street === 'flop') {
          assert.equal(a.outCount, 7);
          assert.equal(a.groups[0].cards.length, 1);
          assert.equal(a.groups[1].cards.length, 6);
        }
        if (type.id === 'bdf' || type.id === 'bds') {
          assert.equal(a.outCount, 0);
          assert.equal(a.mental, null);
          assert.ok(a.exact > 0.03 && a.exact < 0.06);
          assert.equal(a.exact, a.runner.hits / a.runner.total);
        } else {
          assert.equal(a.exact, P.exactOutsProb(a.outCount, street));
          assert.equal(a.mental, P.mental42(a.outCount, street));
        }
        if (type.id === 'bdf') assert.equal(a.runner.hits, 45);
        if (type.id === 'bds') assert.equal(a.runner.hits, 48);
      }
    }
  }
});

test('starting-hand chart is 13×13 with suited above the diagonal', () => {
  const keys = P.allHandKeys();
  assert.equal(keys.length, 169);
  assert.equal(new Set(keys).size, 169);
  assert.equal(P.cellKey(0, 0), 'AA');
  assert.equal(P.cellKey(0, 1), 'AKs');
  assert.equal(P.cellKey(1, 0), 'AKo');
  assert.equal(P.cellKey(4, 4), 'TT');
  assert.equal(P.cellKey(5, 6), '98s');
  assert.equal(P.cellKey(6, 5), '98o');

  const chart = P.chart();
  for (const pos of ['early', 'middle', 'late']) {
    assert.equal(Object.keys(chart[pos]).length, 169);
    Object.values(chart[pos]).forEach((action) => {
      assert.ok(action === 'raise' || action === 'call' || action === 'fold');
    });
  }
  assert.equal(chart.early.AA, 'raise');
  assert.equal(chart.early['22'], 'fold');
  assert.equal(chart.middle['22'], 'call');
  assert.equal(chart.late['22'], 'raise');
  assert.equal(chart.early['76s'], 'fold');
  assert.equal(chart.middle['76s'], 'call');
  assert.equal(chart.late['76s'], 'raise');
  assert.equal(chart.early.AKs, 'raise');
  assert.equal(chart.late['72o'], 'fold');
  assert.equal(chart.middle.A5s, 'raise');
  assert.equal(chart.middle.A4s, 'call');
  assert.equal(chart.early.ATo, 'fold');
  assert.equal(chart.middle.ATo, 'raise');
  assert.match(P.chartReason('72o', 'early'), /폴드/);
  assert.match(P.chartReason('AA', 'late'), /레이즈/);
  assert.equal(P.chartReason('76s', 'middle').split('\n').length, 1);

  const spot = P.randomChartSpot(mulberry32(3));
  assert.equal(P.handKeyFromCards(spot.hole), spot.key);
  assert.equal(spot.action, P.chartAction(spot.key, spot.position));

  const flow = P.generateFullHand({ rng: mulberry32(11), type: 'flush' });
  assert.equal(flow.scenario.street, 'flop');
  assert.equal(flow.scenario.type, 'flush');
  assert.equal(P.handKeyFromCards(flow.scenario.hole), flow.key);
  assert.ok(flow.reason.length > 8);
});

test('cheat sheet percents come from the same formulas', () => {
  const rows = P.cheatSheet();
  assert.equal(rows.length, 10);
  const flush = rows[0];
  assert.equal(flush.flopMental, 36);
  assert.equal(flush.flopExact, P.exactOutsProb(9, 'flop'));
  assert.equal(flush.turnExact, 9 / 46);
  const trips = rows.find((r) => r.id === 'trips');
  assert.equal(trips.flopExact, P.exactOutsProb(7, 'flop'));
  assert.equal(trips.turnExact, 10 / 46);
  const bdf = rows.find((r) => r.id === 'bdf');
  const bds = rows.find((r) => r.id === 'bds');
  assert.equal(bdf.flopMental, null);
  assert.equal(bdf.flopExact, 45 / 1081);
  assert.equal(bds.flopExact, 48 / 1081);
  assert.ok(Math.abs(bdf.flopExact * 100 - 4.2) < 0.15);
  assert.ok(Math.abs(bds.flopExact * 100 - 4.5) < 0.15);
  assert.equal(P.fmtPct(P.exactOutsProb(9, 'flop')), '34.97%');
  assert.equal(P.fmtPct(9 / 46), '19.57%');
  assert.equal(P.fmtPct(45 / 1081), '4.16%');
  assert.equal(P.fmtPct(48 / 1081), '4.44%');
});

test('the trainer is on the home list and the new files avoid personal names', () => {
  const fs = require('fs');
  const path = require('path');
  const home = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8');
  assert.match(home, /games\/game35\//);
  assert.match(home, /포커 아웃츠 트레이너/);
  assert.match(home, /g35c:/);
  const banned = ['진' + '성', '엄진' + '성', '로' + '빈', 'ro' + 'bin'];
  ['outs.js', 'app.js', 'index.html'].forEach((name) => {
    const text = fs.readFileSync(path.join(__dirname, name), 'utf8');
    banned.forEach((word) => assert.equal(text.toLowerCase().includes(word.toLowerCase()), false, name + ' contains a personal name'));
  });
});
