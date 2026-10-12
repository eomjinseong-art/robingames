/* 포커 (5장 드로우, 가족용): 칩은 점수일 뿐. 모두 20점으로 시작, 참가비 1점. 베팅 → 최대 3장 교환 → 베팅 → 족보 비교. 5판 뒤 점수가 가장 많은 사람 승리. */
(function () {
  var RK = '2 3 4 5 6 7 8 9 10 J Q K A'.split(' ');
  function v(c) { return RK.indexOf(c.slice(0, -1)) + 2; }
  function eva(h) {
    var vs = h.map(v).sort(function (a, b) { return b - a; }), cnt = {}, fl = h.every(function (c) { return c.slice(-1) === h[0].slice(-1); });
    vs.forEach(function (x) { cnt[x] = (cnt[x] || 0) + 1; });
    var g = Object.keys(cnt).map(Number).sort(function (a, b) { return cnt[b] - cnt[a] || b - a; }), c = g.map(function (x) { return cnt[x]; });
    var uniq = g.length === 5, st = uniq && vs[0] - vs[4] === 4, wheel = uniq && vs.join() === '14,5,4,3,2';
    if (wheel) { st = true; g = [5, 4, 3, 2, 1]; }
    var cat = st && fl ? 8 : c[0] === 4 ? 7 : c[0] === 3 && c[1] === 2 ? 6 : fl ? 5 : st ? 4 : c[0] === 3 ? 3 : c[0] === 2 && c[1] === 2 ? 2 : c[0] === 2 ? 1 : 0;
    return [cat].concat(g);
  }
  function cmp(a, b) { for (var i = 0; i < Math.max(a.length, b.length); i++) { var d = (a[i] || 0) - (b[i] || 0); if (d) return d; } return 0; }
  var CAT = [['하이카드', 'High card'], ['원페어', 'One pair'], ['투페어', 'Two pair'], ['트리플', 'Three of a kind'], ['스트레이트', 'Straight'], ['플러시', 'Flush'], ['풀하우스', 'Full house'], ['포카드', 'Four of a kind'], ['스트레이트 플러시', 'Straight flush']];
  function act_(s) { return s.n_ = 0, [0, 1, 2, 3].slice(0, s.n).filter(function (p) { return !s.fold[p]; }); }
  function nextAct(s, p) { for (var i = 1; i <= s.n; i++) { var q = (p + i) % s.n; if (!s.fold[q]) return q; } return p; }
  function newHand(s, K) {
    s.handNo++; s.deck = K.deck(); s.pot = 0; s.fold = []; s.hands = [];
    for (var p = 0; p < s.n; p++) { s.fold[p] = s.chips[p] <= 0; s.hands.push(s.fold[p] ? [] : s.deck.splice(0, 5)); if (!s.fold[p]) { s.chips[p]--; s.pot++; } }
    s.hands.forEach(sortH); s.dealer = (s.dealer + 1) % s.n; startRound(s, 'bet1', nextAct(s, s.dealer));
  }
  function sortH(h) { h.sort(function (a, b) { return v(a) - v(b); }); }
  function startRound(s, ph, first) { s.phase = ph; s.bet = 0; s.put = s.hands.map(function () { return 0; }); s.acted = []; s.raises = 0; s.turn = first; }
  function canRaise(s, p) { var amt = s.bet + (s.phase === 'bet1' ? 1 : 2); return s.raises < 3 && act_(s).every(function (q) { return s.chips[q] >= amt - s.put[q]; }); }
  function roundDone(s) { var a = act_(s); return a.every(function (q) { return s.acted[q] && s.put[q] === s.bet; }); }
  function showdown(s, K) {
    var a = act_(s), best = null, ws = [];
    a.forEach(function (q) { var e = eva(s.hands[q]); var c = best ? cmp(e, best) : 1; if (c > 0) { best = e; ws = [q]; } else if (c === 0) ws.push(q); });
    award(s, K, ws, best);
  }
  function award(s, K, ws, best) {
    var share = Math.floor(s.pot / ws.length), rem = s.pot - share * ws.length;
    ws.forEach(function (q, i) { s.chips[q] += share + (i === 0 ? rem : 0); });
    s.last = { ws: ws, cat: best ? best[0] : -1, hands: act_(s).length > 1 ? act_(s).map(function (q) { return { p: q, h: s.hands[q].slice(), cat: eva(s.hands[q])[0] }; }) : [] };
    K.say('🏆 ' + ws.map(K.name).join(', ') + ' +' + s.pot + (best ? ' (' + K.L(CAT[best[0]]) + ')' : ''));
    s.pot = 0; s.phase = 'result'; s.turn = 0;
    var alive = s.chips.filter(function (c) { return c > 0; }).length;
    if (s.handNo >= s.maxHands || alive <= 1) s.done = true;
  }
  var G = {
    id: 'poker', emoji: '♠️', title: ['포커 (5장 드로우)', 'Poker (5-card draw)'], minP: 2, maxP: 4, family: true,
    bgm: [57, 60, 64, 67, 69, 67, 64, 60, 62, 65, 69, 72, 71, 67, 64, 0],
    rules: ['가족용 5장 드로우 포커예요. 칩은 점수일 뿐이에요. 모두 20점으로 시작하고, 판마다 참가 점수 1점을 가운데에 내요. 5장을 받고 ① 첫 베팅: 체크(그냥 넘김)/베팅·레이즈(+1점)/콜(같이 맞춤)/폴드(이번 판 포기). ② 교환: 필요 없는 카드를 0~3장 바꿔요. ③ 두 번째 베팅(+2점씩). ④ 남은 사람끼리 족보를 비교해 가장 높은 사람이 가운데 점수를 모두 가져가요. 족보(낮음→높음): 하이카드 < 원페어 < 투페어 < 트리플 < 스트레이트 < 플러시 < 풀하우스 < 포카드 < 스트레이트 플러시. 5판 뒤 점수가 가장 많은 사람 승리! (단순화: 한 라운드 레이즈 최대 3번, 모두가 맞출 수 있을 때만 올릴 수 있어요)',
      'Family 5-card draw. Chips are only points. Everyone starts with 20 points and puts 1 point in the middle each hand. 1) First betting: check / bet or raise (+1) / call / fold. 2) Draw: swap 0–3 cards. 3) Second betting (+2 each). 4) Remaining players compare hands; the best takes the middle. Ranks low→high: high card < pair < two pair < three of a kind < straight < flush < full house < four of a kind < straight flush. After 5 hands the most points wins! (Simplified: max 3 raises per round, and you can only raise if everyone can afford to call.)'],
    init: function (n, lv, K) { var s = { n: n, chips: [], handNo: 0, maxHands: 5, dealer: n - 1, done: false }; for (var i = 0; i < n; i++) s.chips.push(20); newHand(s, K); return s; },
    view: function (s, me, K, fin) {
      var h = '<div class="ck-info"><span class="ck-pill">' + K.L(['판', 'Hand']) + ' ' + s.handNo + '/' + s.maxHands + '</span><span class="ck-pill">🪙 ' + K.L(['가운데', 'Pot']) + ' ' + s.pot + '</span></div><div class="ck-seats">';
      var showAll = s.phase === 'result' || fin;
      for (var p = 0; p < s.n; p++) if (p !== me) {
        var row = showAll && s.last && s.last.hands.some(function (x) { return x.p === p; }) ? s.hands[p].map(function (c) { return K.card(c, { small: 1 }); }).join('') + '<div class="ck-lbl">' + K.L(CAT[eva(s.hands[p])[0]]) + '</div>' : '<span class="ck-lbl">' + (s.fold[p] ? K.L(['폴드', 'Folded']) : '🂠 × ' + s.hands[p].length) + (s.put && s.put[p] ? ' · ' + K.L(['베팅 ', 'in ']) + s.put[p] : '') + '</span>';
        h += '<div class="ck-seat' + (s.turn === p && s.phase !== 'result' ? ' turn' : '') + (s.fold[p] ? ' out' : '') + '"><h4><span>' + K.esc(K.name(p)) + '</span><span>⭐' + s.chips[p] + '</span></h4><div class="ck-row">' + row + '</div></div>';
      }
      h += '</div>';
      if (me < 0) return h;
      var my = s.turn === me, sel = K.sel(), acts = '';
      if (my && (s.phase === 'bet1' || s.phase === 'bet2')) {
        var need = s.bet - s.put[me], sz = s.phase === 'bet1' ? 1 : 2;
        acts = '<div class="ck-acts">' + (need ? '<button data-a="call">' + K.L(['콜 ', 'Call ']) + need + '</button>' : '<button data-a="call">' + K.L(['체크', 'Check']) + '</button>') +
          (canRaise(s, me) ? '<button class="alt" data-a="raise">' + (s.bet ? K.L(['레이즈 +', 'Raise +']) : K.L(['베팅 +', 'Bet +'])) + sz + '</button>' : '') +
          (need ? '<button class="red" data-a="fold">' + K.L(['폴드', 'Fold']) + '</button>' : '') + '</div>';
      }
      if (my && s.phase === 'draw') acts = '<div class="ck-acts"><button data-a="swap"' + (sel.length > 3 ? ' disabled' : '') + '>🔄 ' + (sel.length ? sel.length + K.L(['장 바꾸기', ' swap']) : K.L(['그대로', 'Keep all'])) + '</button></div><div class="ck-lbl">' + K.L(['바꿀 카드를 0~3장 골라요', 'Pick 0–3 cards to swap']) + '</div>';
      if (my && s.phase === 'result') acts = '<div class="ck-acts"><button data-a="next">▶ ' + K.L(['다음 판', 'Next hand']) + '</button></div>';
      var mine = s.hands[me];
      h += '<div class="ck-seat' + (my ? ' turn' : '') + (s.fold[me] ? ' out' : '') + '"><h4><span>' + K.esc(K.name(me)) + ' 👈</span><span>⭐' + s.chips[me] + (mine.length ? ' · ' + K.L(CAT[eva(mine)[0]]) : '') + '</span></h4>' + acts +
        '<div class="ck-hand">' + mine.map(function (c, i) { return K.card(c, my && s.phase === 'draw' ? { act: 'sel:' + i, sel: sel.indexOf(i) >= 0 } : {}); }).join('') + '</div></div>';
      return h;
    },
    act: function (s, p, a, K) {
      if (p !== s.turn) return false;
      if (s.phase === 'result') { if (a !== 'next' || s.done) return false; newHand(s, K); return; }
      if (s.phase === 'draw') {
        var idx = a === 'swap' ? K.sel().slice() : (/^swap:([\d,]*)$/.exec(a || '') || [0, null])[1];
        if (idx == null) return false; if (typeof idx === 'string') idx = idx.split(',').filter(Boolean).map(Number);
        if (idx.length > 3) return false;
        idx.forEach(function (i) { s.hands[p][i] = s.deck.pop(); }); sortH(s.hands[p]);
        K.say(K.name(p) + ' 🔄 ' + idx.length);
        var q = nextAct(s, p), first = nextAct(s, s.dealer);
        if (q === first || p === q) startRound(s, 'bet2', first); else s.turn = q;
        return;
      }
      var need = s.bet - s.put[p], sz = s.phase === 'bet1' ? 1 : 2;
      if (a === 'fold' && need > 0) { s.fold[p] = true; K.say(K.name(p) + ' ' + K.L(['폴드', 'folds'])); }
      else if (a === 'call') { s.chips[p] -= need; s.put[p] += need; s.pot += need; K.say(K.name(p) + ' ' + (need ? K.L(['콜', 'calls']) : K.L(['체크', 'checks']))); }
      else if (a === 'raise' && canRaise(s, p)) { s.bet += sz; var d = s.bet - s.put[p]; s.chips[p] -= d; s.put[p] += d; s.pot += d; s.raises++; s.acted = []; K.say(K.name(p) + ' ' + K.L(['올림 ', 'raises to ']) + s.bet); }
      else return false;
      s.acted[p] = true;
      if (act_(s).length === 1) { award(s, K, act_(s), null); return; }
      if (roundDone(s)) { if (s.phase === 'bet1') { s.phase = 'draw'; s.turn = nextAct(s, s.dealer); } else showdown(s, K); return; }
      s.turn = nextAct(s, p);
    },
    ai: function (s, p, lv) {
      if (s.phase === 'result') return 'next';
      var h = s.hands[p], e = eva(h);
      if (s.phase === 'draw') {
        if (e[0] >= 4 && e[0] !== 7) return 'swap:';
        var cnt = {}; h.forEach(function (c) { cnt[v(c)] = (cnt[v(c)] || 0) + 1; });
        var keep = h.map(function (c, i) { return cnt[v(c)] >= 2 ? i : -1; }).filter(function (i) { return i >= 0; });
        if (!keep.length) {
          var bySuit = {}; h.forEach(function (c, i) { (bySuit[c.slice(-1)] = bySuit[c.slice(-1)] || []).push(i); });
          var f = Object.keys(bySuit).filter(function (k) { return bySuit[k].length === 4; })[0];
          if (f && lv !== 'easy') keep = bySuit[f]; else keep = lv === 'easy' ? [4] : [3, 4];
        }
        var sw = [0, 1, 2, 3, 4].filter(function (i) { return keep.indexOf(i) < 0; }).slice(0, 3);
        return 'swap:' + sw.join(',');
      }
      var need = s.bet - s.put[p], str = e[0] * 15 + (e[1] || 0), r = Math.random();
      if (lv === 'easy') return need && r < 0.2 ? 'fold' : r < 0.15 && canRaise(s, p) ? 'raise' : 'call';
      var good = s.phase === 'bet1' ? 15 + 11 : 30, ok = s.phase === 'bet1' ? 12 : 15 + 8;
      if (lv === 'hard' && r < 0.08 && canRaise(s, p)) return 'raise';
      if (str >= good && canRaise(s, p) && r < 0.8) return 'raise';
      if (need === 0) return 'call';
      if (str >= ok || (need <= 1 && r < 0.6)) return 'call';
      return 'fold';
    },
    over: function (s, K) {
      if (!s.done) return null;
      var m = Math.max.apply(null, s.chips), ws = []; s.chips.forEach(function (c, i) { if (c === m) ws.push(i); });
      return { winners: ws, detail: s.chips.map(function (c, i) { return K.name(i) + ' ⭐' + c; }).join(' · ') + K.L([' (점수일 뿐이에요)', ' (just points)']) };
    }
  };
  window.CKGame = G;
})();
