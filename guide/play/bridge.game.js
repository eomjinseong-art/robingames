/* 브릿지 (단순화): 4자리(빈 자리는 PC), 나(남)+맞은편(북) vs 동·서. 경매로 계약(레벨 1~7 + 무늬/NT)을 정하고,
 * 계약자 짝꿍(더미)의 카드는 공개되어 계약자가 대신 내요. 6+레벨 트릭 이상 따면 성공. 한 딜 = 한 판. */
(function () {
  var su = TR.su, ST = ['C', 'D', 'H', 'S', 'N'], SN = { C: '♣', D: '♦', H: '♥', S: '♠', N: 'NT' };
  function hcp(h) { var v = 0; h.forEach(function (c) { v += { A: 4, K: 3, Q: 2, J: 1 }[c.slice(0, -1)] || 0; }); return v; }
  function lens(h) { var l = { S: 0, H: 0, D: 0, C: 0 }; h.forEach(function (c) { l[su(c)]++; }); return l; }
  function bidTxt(b) { return b.lvl + SN[b.st]; }
  function higher(b, hi) { return !hi || b.lvl > hi.lvl || (b.lvl === hi.lvl && ST.indexOf(b.st) > ST.indexOf(hi.st)); }
  function partner(p) { return (p + 2) % 4; }
  function dealNew(s, K) { var d = TR.deal(K, 4, 13); s.hands = d.hands; s.dealer = (s.dealer + 1) % 4; s.turn = s.dealer; s.cur = null; s.phase = 'bid'; s.auction = []; s.hi = null; s.passes = 0; s.trick = []; s.lastTrick = []; s.tricks = [0, 0, 0, 0]; s.shown = false; }
  function legal(s) { var h = s.hands[s.cur], led = s.trick.length ? su(s.trick[0].c) : null; return TR.legal(h, led); }
  function ctrl(s, p) { return p === s.dummy ? s.decl : p; }
  var G = {
    id: 'bridge', emoji: '🌉', title: ['브릿지', 'Contract Bridge'], minP: 2, maxP: 4, seats: 4,
    bgm: [62, 65, 69, 72, 71, 67, 64, 0, 60, 64, 67, 71, 69, 65, 62, 0],
    rules: ['4자리, 마주 앉은 둘이 한 팀이에요(빈 자리는 PC). 13장씩 받아요. ① 경매: 차례대로 "레벨+무늬"(예: 2♥)를 부르거나 패스. 레벨 = 6을 넘겨 딸 트릭 수, 무늬 순서 ♣<♦<♥<♠<NT(으뜸패 없음). 앞사람보다 높게만 부를 수 있고, 3명이 연속 패스하면 마지막 비드가 계약이 돼요. 그 무늬를 팀에서 먼저 부른 사람이 계약자, 짝꿍은 더미. ② 플레이: 계약자 왼쪽이 먼저 내고, 그 뒤 더미의 카드는 모두 공개되고 계약자가 대신 내요. 같은 무늬가 있으면 따라 내고, 없으면 으뜸패로 이길 수 있어요. ③ 계약 팀이 6+레벨 트릭 이상 따면 성공(트릭 점수 + 보너스), 모자라면 상대가 모자란 트릭당 50점. 한 딜이 한 판이에요. (단순화: 더블/리더블·취약 없음, 4명 모두 패스면 다시 나눠요)',
      '4 seats, partners sit opposite (computers fill empty seats). 13 cards each. 1) Auction: in turn bid "level + strain" (e.g. 2♥) or pass. Level = tricks above 6; strains rank ♣<♦<♥<♠<NT (no trump). Each bid must be higher; three passes in a row end it and the last bid is the contract. The partner who first named that strain is declarer; their partner is dummy. 2) Play: the player left of declarer leads, then dummy\'s hand is laid face up and declarer plays it. Follow suit if you can; otherwise a trump can win. 3) Declarer\'s side needs 6+level tricks: success scores trick points + bonus; each trick short gives defenders 50. One deal = one game. (Simplified: no doubles, no vulnerability; all-pass redeals.)'],
    init: function (n, lv, K) { var s = { n: 4, dealer: 3, done: false }; dealNew(s, K); return s; },
    view: function (s, me, K) {
      var my = me >= 0 && s.turn === me, acts = '', o = {};
      var info = s.phase === 'bid' ? '<span class="ck-pill">' + K.L(['경매', 'Auction']) + ': ' + (s.hi ? bidTxt(s.hi) + ' (' + K.esc(K.name(s.hi.p)) + ')' : '—') + '</span>'
        : '<span class="ck-pill">' + K.L(['계약', 'Contract']) + ' ' + bidTxt(s.con) + ' · ' + K.esc(K.name(s.decl)) + '</span><span class="ck-pill">' + K.L(['필요', 'Need']) + ' ' + (6 + s.con.lvl) + '</span>';
      if (s.phase === 'bid') {
        o.extra = '<div class="ck-lbl">' + s.auction.map(function (a) { return K.esc(K.name(a.p)) + ':' + (a.b ? bidTxt(a.b) : K.L(['패스', 'Pass'])); }).join(' · ') + '</div>';
        if (my) {
          acts = '<div class="ck-acts"><button class="alt" data-a="pass">' + K.L(['패스', 'Pass']) + '</button>';
          for (var l = 1; l <= 7; l++) ST.forEach(function (st) { var b = { lvl: l, st: st }; if (higher(b, s.hi)) acts += '<button style="min-width:58px;min-height:44px;font-size:17px' + (st === 'H' || st === 'D' ? ';color:#c11' : '') + '" data-a="b:' + l + st + '">' + bidTxt(b) + '</button>'; });
          acts += '</div><div class="ck-lbl">' + K.L(['내 점수(HCP) ', 'My HCP ']) + hcp(s.hands[me]) + K.L([' · 팀 합 25↑이면 3NT/4♥·4♠ 도전!', ' · team 25+ → try 3NT/4♥/4♠']) + '</div>';
        }
      } else {
        o.cur = s.cur; o.open = {}; if (s.shown) o.open[s.dummy] = true;
        if (my && s.cur === s.dummy && s.dummy !== me) { o.ctrlLegal = {}; o.ctrlLegal[s.dummy] = legal(s); }
        if (my && s.cur === me) o.legal = legal(s);
        if (my && s.cur === s.dummy && s.dummy === me) o.legal = legal(s);
        if (my && s.cur === s.dummy) acts = '<div class="ck-lbl">👉 ' + K.L(['더미 카드를 내 주세요', 'Play a card from dummy']) + '</div>';
      }
      o.info = info; o.acts = acts;
      o.seat = function (p) { return (p % 2 ? '🔷' : '🔶') + (s.phase === 'play' ? ' ' + K.L(['트릭 ', 'tricks ']) + s.tricks[p] + (p === s.dummy ? ' ' + K.L(['더미', 'dummy']) : p === s.decl ? ' ' + K.L(['계약자', 'declarer']) : '') : ''); };
      return TR.view(s, me, K, o);
    },
    act: function (s, p, a, K) {
      if (p !== s.turn) return false;
      if (s.phase === 'bid') {
        var b = null;
        if (a !== 'pass') { var m = /^b:([1-7])([CDHSN])$/.exec(a || ''); if (!m) return false; b = { lvl: +m[1], st: m[2], p: p }; if (!higher(b, s.hi)) return false; }
        s.auction.push({ p: p, b: b }); K.say(K.name(p) + ': ' + (b ? bidTxt(b) : K.L(['패스', 'Pass'])));
        if (b) { s.hi = b; s.passes = 0; } else s.passes++;
        if (!s.hi && s.passes >= 4) { K.say(K.L(['모두 패스 → 다시 나눠요', 'All passed → redeal'])); dealNew(s, K); return; }
        if (s.hi && s.passes >= 3) {
          s.con = s.hi; var side = s.hi.p % 2;
          s.decl = s.auction.filter(function (x) { return x.b && x.p % 2 === side && x.b.st === s.hi.st; })[0].p;
          s.dummy = partner(s.decl); s.phase = 'play'; s.cur = (s.decl + 1) % 4; s.turn = ctrl(s, s.cur);
          K.say(K.L(['계약 ', 'Contract ']) + bidTxt(s.con) + ' — ' + K.name(s.decl));
          return;
        }
        s.turn = (p + 1) % 4; return;
      }
      var c = (a || '').slice(2); if (legal(s).indexOf(c) < 0) return false;
      var h = s.hands[s.cur]; h.splice(h.indexOf(c), 1); s.trick.push({ p: s.cur, c: c }); s.shown = true;
      var tr = s.con.st === 'N' ? null : s.con.st;
      if (s.trick.length < 4) { s.cur = (s.cur + 1) % 4; s.turn = ctrl(s, s.cur); return; }
      var w = TR.winner(s.trick, tr); s.tricks[w]++; s.lastTrick = s.trick; s.lastWin = w; s.trick = []; s.cur = w; s.turn = ctrl(s, w);
      K.say(K.name(w) + K.L([' 트릭!', ' takes the trick']));
      if (!s.hands[0].length && !s.hands[1].length) {
        var side = s.decl % 2, got = s.tricks[side] + s.tricks[side + 2], need = 6 + s.con.lvl, st = s.con.st, pts = 0;
        if (got >= need) {
          var per = st === 'C' || st === 'D' ? 20 : 30, ts = (got - 6) * per + (st === 'N' ? 10 : 0), cs = s.con.lvl * per + (st === 'N' ? 10 : 0);
          pts = ts + (cs >= 100 ? 300 : 50) + (s.con.lvl === 6 ? 500 : s.con.lvl === 7 ? 1000 : 0);
          s.res = { side: side, pts: pts, got: got, need: need };
        } else s.res = { side: 1 - side, pts: 50 * (need - got), got: got, need: need };
        s.done = true;
      }
    },
    ai: function (s, p, lv) {
      if (s.phase === 'play') { var me = s.cur; return 'c:' + TR.smart(s.trick, legal(s), s.con.st === 'N' ? null : s.con.st, function (q) { return q % 2 === me % 2; }, lv); }
      var h = s.hands[p], v = hcp(h) + (lv === 'easy' ? Math.round(Math.random() * 6 - 3) : 0), ln = lens(h), pa = partner(p);
      var pb = s.auction.filter(function (x) { return x.p === pa; }), pBid = pb.filter(function (x) { return x.b; }).pop();
      var team = v + (pBid ? 13 : pb.length ? 5 : 7);
      var maxL = team >= 37 ? 7 : team >= 33 ? 6 : team >= 29 ? 5 : team >= 26 ? 4 : team >= 25 ? 3 : team >= 23 ? 2 : team >= 19 ? 1 : 0;
      var ourBid = s.auction.some(function (x) { return x.b && x.p % 2 === p % 2; });
      if (!ourBid && v >= 12) maxL = Math.max(maxL, 1);
      var st, order = ['S', 'H', 'D', 'C'].sort(function (a, b) { return ln[b] - ln[a]; });
      if (pBid && pBid.b.st !== 'N' && ln[pBid.b.st] >= 3) st = pBid.b.st;
      else if (ln[order[0]] >= 5) st = order[0];
      else if (ln[order[3]] >= 2) st = 'N'; else st = order[0];
      if (st === 'N' && maxL === 4 && pBid) maxL = 3;
      if (s.hi && s.hi.p === pa && maxL <= s.hi.lvl) return 'pass';
      var lvl = !s.hi ? 1 : ST.indexOf(st) > ST.indexOf(s.hi.st) ? s.hi.lvl : s.hi.lvl + 1;
      return lvl <= maxL && lvl <= 7 ? 'b:' + lvl + st : 'pass';
    },
    over: function (s, K) {
      if (!s.done) return null;
      var r = s.res, nm = function (t) { return t === 0 ? K.name(0) + '+' + K.name(2) : K.name(1) + '+' + K.name(3); };
      return { winners: [r.side, r.side + 2], text: '🏆 ' + nm(r.side) + ' +' + r.pts, detail: K.L(['계약 ', 'Contract ']) + s.con.lvl + SN[s.con.st] + ' · ' + K.L(['딴 트릭 ', 'tricks ']) + r.got + '/' + r.need + (r.got >= r.need ? K.L([' 성공!', ' made!']) : K.L([' 실패', ' down'])) };
    }
  };
  window.CKGame = G;
})();
