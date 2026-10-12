/* 블랙잭 (가족용): PC 딜러와 겨뤄요. 여러 명이면 차례대로 각자 딜러와 대결. 칩은 점수일 뿐. 20점으로 시작, 5라운드. */
(function () {
  function cv(c) { var r = c.slice(0, -1); return r === 'A' ? 11 : 'JQK'.indexOf(r) >= 0 || r === '10' ? 10 : +r; }
  function tot(h) { var t = 0, a = 0; h.forEach(function (c) { t += cv(c); if (c[0] === 'A') a++; }); while (t > 21 && a) { t -= 10; a--; } return t; }
  function soft(h) { var t = 0, a = 0; h.forEach(function (c) { t += cv(c); if (c[0] === 'A') a++; }); while (t > 21 && a) { t -= 10; a--; } return a > 0; }
  function bj(h) { return h.length === 2 && tot(h) === 21; }
  function live(s) { return s.chips.map(function (c, i) { return i; }).filter(function (i) { return s.in[i]; }); }
  function nextFrom(s, p, f) { for (var q = p + 1; q < s.n; q++) if (f(q)) return q; return -1; }
  function draw1(s, K) { if (s.deck.length < 12) s.deck = K.deck(); return s.deck.pop(); }
  function newRound(s, K) {
    s.round++; s.phase = 'bet'; s.bets = []; s.hands = []; s.dealer = []; s.res = [];
    s.in = s.chips.map(function (c) { return c > 0; }); for (var i = 0; i < s.n; i++) { s.hands.push([]); s.bets.push(0); }
    s.turn = nextFrom(s, -1, function (q) { return s.in[q]; });
  }
  function canPlay(s, q) { return s.in[q] && !s.res[q] && tot(s.hands[q]) < 21; }
  function startPlay(s, K) {
    s.phase = 'play';
    for (var k = 0; k < 2; k++) { live(s).forEach(function (q) { s.hands[q].push(draw1(s, K)); }); s.dealer.push(draw1(s, K)); }
    if (bj(s.dealer)) return resolve(s, K);
    s.turn = nextFrom(s, -1, function (q) { return canPlay(s, q); });
    if (s.turn < 0) resolve(s, K);
  }
  function resolve(s, K) {
    var anyLive = live(s).some(function (q) { return tot(s.hands[q]) <= 21 && !bj(s.hands[q]); });
    if (anyLive && !bj(s.dealer)) while (tot(s.dealer) < 17) s.dealer.push(draw1(s, K));
    var d = tot(s.dealer), out = [];
    live(s).forEach(function (q) {
      var h = s.hands[q], t = tot(h), b = s.bets[q], g;
      if (t > 21) g = -b; else if (bj(h) && !bj(s.dealer)) g = Math.ceil(b * 1.5); else if (bj(s.dealer) && !bj(h)) g = -b;
      else if (d > 21 || t > d) g = b; else if (t === d) g = 0; else g = -b;
      s.chips[q] += b + g; s.res[q] = g; out.push(K.name(q) + ' ' + (g > 0 ? '+' + g : g));
    });
    K.say(K.L(['딜러 ', 'Dealer ']) + (d > 21 ? K.L(['버스트!', 'busts!']) : d) + ' · ' + out.join(' · '));
    s.phase = 'result'; s.turn = 0;
    if (s.round >= s.maxRounds || !s.chips.some(function (c) { return c > 0; })) s.done = true;
  }
  var G = {
    id: 'blackjack', emoji: '🔢', title: ['블랙잭', 'Blackjack'], minP: 2, maxP: 4, family: true,
    bgm: [60, 64, 67, 72, 71, 67, 64, 62, 65, 69, 72, 77, 76, 72, 69, 0],
    rules: ['PC 딜러와 겨루는 덧셈 게임이에요. 칩은 점수일 뿐. 모두 20점으로 시작해요. ① 1~3점을 걸어요. ② 2장씩 받아요(딜러는 1장만 보여요). 카드 값: 2~10 그대로, J·Q·K = 10, A = 1 또는 11. ③ 내 차례에 히트(1장 더)/스탠드(멈춤)/더블(건 점수 2배, 딱 1장만 더). 21을 넘으면 버스트로 짐! ④ 모두 끝나면 딜러가 16 이하면 반드시 받고, 17 이상이면 멈춰요. 딜러보다 21에 가까우면 건 만큼 얻고, 처음 2장이 A+10점 카드(블랙잭)면 1.5배! 여러 명이면 각자 차례대로 딜러와 대결해요. 5라운드 뒤 점수가 가장 많은 사람 승리. (단순화: 스플릿·보험 없음)',
      'An adding game against a computer dealer. Chips are just points. Everyone starts with 20. 1) Bet 1–3. 2) Two cards each (the dealer shows one). Values: 2–10 as shown, J/Q/K = 10, A = 1 or 11. 3) On your turn Hit (one more), Stand, or Double (double the bet, exactly one more card). Over 21 = bust, you lose! 4) Then the dealer must hit on 16 or less and stand on 17+. Beat the dealer to win your bet; a natural (A + 10-card) pays 1.5×. With several players, each takes a turn against the dealer. Most points after 5 rounds wins. (Simplified: no split or insurance.)'],
    init: function (n, lv, K) { var s = { n: n, chips: [], round: 0, maxRounds: 5, deck: K.deck(), done: false }; for (var i = 0; i < n; i++) s.chips.push(20); newRound(s, K); return s; },
    view: function (s, me, K, fin) {
      var hide = s.phase === 'play' && !fin;
      var h = '<div class="ck-info"><span class="ck-pill">' + K.L(['라운드', 'Round']) + ' ' + s.round + '/' + s.maxRounds + '</span></div>';
      h += '<div class="ck-seat"><h4><span>🎩 ' + K.L(['딜러 (PC)', 'Dealer (PC)']) + '</span><span>' + (s.dealer.length ? (hide ? '?' : tot(s.dealer)) : '') + '</span></h4><div class="ck-row">' + s.dealer.map(function (c, i) { return K.card(hide && i === 1 ? 'XX' : c); }).join('') + '</div></div>';
      function seat(p, mine) {
        var r = s.res[p], hh = s.hands[p];
        return '<div class="ck-seat' + (s.turn === p && s.phase !== 'result' ? ' turn' : '') + (!s.in[p] ? ' out' : '') + '"><h4><span>' + K.esc(K.name(p)) + (mine ? ' 👈' : '') + '</span><span>⭐' + s.chips[p] + (s.bets[p] ? ' · ' + K.L(['걸음 ', 'bet ']) + s.bets[p] : '') + (hh.length ? ' · ' + tot(hh) + (bj(hh) ? ' 🂡BJ' : tot(hh) > 21 ? ' 💥' : '') : '') + (r != null && s.phase === 'result' ? ' → ' + (r > 0 ? '+' : '') + r : '') + '</span></h4><div class="ck-row">' + hh.map(function (c) { return K.card(c, mine ? {} : { small: 1 }); }).join('') + '</div>';
      }
      for (var p = 0; p < s.n; p++) if (p !== me) h += seat(p) + '</div>';
      if (me < 0) return h;
      var my = s.turn === me, acts = '';
      if (my && s.phase === 'bet') { acts = '<div class="ck-lbl">' + K.L(['몇 점 걸까요?', 'How many points?']) + '</div><div class="ck-acts">'; for (var b = 1; b <= Math.min(3, s.chips[me]); b++) acts += '<button data-a="b:' + b + '">' + b + '</button>'; acts += '</div>'; }
      if (my && s.phase === 'play') acts = '<div class="ck-acts"><button data-a="hit">' + K.L(['히트 +1장', 'Hit']) + '</button><button class="alt" data-a="stand">' + K.L(['스탠드', 'Stand']) + '</button>' + (s.hands[me].length === 2 && s.chips[me] >= s.bets[me] ? '<button class="alt" data-a="double">' + K.L(['더블', 'Double']) + '</button>' : '') + '</div>';
      if (my && s.phase === 'result') acts = '<div class="ck-acts"><button data-a="next">▶ ' + K.L(['다음 라운드', 'Next round']) + '</button></div>';
      return h + seat(me, true) + acts + '</div>';
    },
    act: function (s, p, a, K) {
      if (p !== s.turn) return false;
      if (s.phase === 'result') { if (a !== 'next' || s.done) return false; newRound(s, K); return; }
      if (s.phase === 'bet') {
        var b = +(/^b:(\d)$/.exec(a || '') || [])[1]; if (!(b >= 1 && b <= 3 && b <= s.chips[p])) return false;
        s.bets[p] = b; s.chips[p] -= b; K.say(K.name(p) + ' ' + K.L(['걸기 ', 'bets ']) + b);
        var q = nextFrom(s, p, function (x) { return s.in[x]; }); if (q < 0) startPlay(s, K); else s.turn = q; return;
      }
      var h = s.hands[p];
      if (a === 'hit') { h.push(draw1(s, K)); K.say(K.name(p) + ' ' + K.L(['히트 → ', 'hits → ']) + tot(h)); if (tot(h) < 21) return; }
      else if (a === 'double' && h.length === 2 && s.chips[p] >= s.bets[p]) { s.chips[p] -= s.bets[p]; s.bets[p] *= 2; h.push(draw1(s, K)); K.say(K.name(p) + ' ' + K.L(['더블 → ', 'doubles → ']) + tot(h)); }
      else if (a === 'stand') K.say(K.name(p) + ' ' + K.L(['스탠드 ', 'stands on ']) + tot(h));
      else return false;
      var nq = nextFrom(s, p, function (x) { return canPlay(s, x); }); if (nq < 0) resolve(s, K); else s.turn = nq;
    },
    ai: function (s, p, lv) {
      if (s.phase === 'result') return 'next';
      if (s.phase === 'bet') { var b = lv === 'easy' ? 1 + Math.floor(Math.random() * 3) : lv === 'hard' ? 2 : 1; return 'b:' + Math.min(b, s.chips[p]); }
      var h = s.hands[p], t = tot(h), up = Math.min(10, cv(s.dealer[0])) === 10 && s.dealer[0][0] !== 'A' ? 10 : cv(s.dealer[0]);
      if (lv === 'easy') return t < 15 ? 'hit' : 'stand';
      if (lv === 'hard' && h.length === 2 && (t === 10 || t === 11) && up <= 9 && s.chips[p] >= s.bets[p]) return 'double';
      if (soft(h) && t <= 17) return 'hit';
      if (t <= 11) return 'hit';
      if (t <= 16) return up >= 7 ? 'hit' : (t === 12 && up <= 3 ? 'hit' : 'stand');
      return 'stand';
    },
    over: function (s, K) {
      if (!s.done) return null;
      var m = Math.max.apply(null, s.chips), ws = []; s.chips.forEach(function (c, i) { if (c === m) ws.push(i); });
      return { winners: ws, detail: s.chips.map(function (c, i) { return K.name(i) + ' ⭐' + c; }).join(' · ') + K.L([' (점수일 뿐이에요)', ' (just points)']) };
    }
  };
  window.CKGame = G;
})();
