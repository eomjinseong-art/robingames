/* 스페이드 (단순화): 4자리 2:2 팀(1·3 vs 2·4). 13장씩. 각자 이길 트릭 수를 부르고(1~13), ♠가 으뜸패. 팀 비드 이상 따면 10×비드 + 초과 1점, 못 따면 −10×비드. 150점 먼저. */
(function () {
  var su = TR.su;
  function team(p) { return p % 2; }
  function dealHand(s, K) { var d = TR.deal(K, 4, 13); s.hands = d.hands; s.bids = [null, null, null, null]; s.tricks = [0, 0, 0, 0]; s.trick = []; s.lastTrick = []; s.broken = false; s.dealer = (s.dealer + 1) % 4; s.turn = (s.dealer + 1) % 4; s.phase = 'bid'; s.handNo++; }
  function legal(s, p) {
    var h = s.hands[p], led = s.trick.length ? su(s.trick[0].c) : null, L = TR.legal(h, led);
    if (!led && !s.broken) { var ns = L.filter(function (c) { return su(c) !== 'S'; }); if (ns.length) L = ns; }
    return L;
  }
  function tname(K, t) { return t === 0 ? K.L(['우리 팀(1·3)', 'Team 1·3']) : K.L(['상대 팀(2·4)', 'Team 2·4']); }
  var G = {
    id: 'spades', emoji: '♤', title: ['스페이드', 'Spades'], minP: 2, maxP: 4, seats: 4,
    bgm: [64, 67, 71, 74, 72, 71, 67, 0, 62, 66, 69, 74, 72, 69, 66, 0],
    rules: ['4자리, 마주 앉은 둘이 한 팀(나+맞은편 vs 양옆). 13장씩 받고, 먼저 "몇 트릭 딸지" 1~13으로 불러요(팀 비드 = 둘의 합). ♠가 으뜸패(트럼프)라서 낸 무늬가 없을 때 ♠를 내면 이겨요. 같은 무늬가 있으면 꼭 따라 내요. ♠가 한 번 나오기 전에는 ♠로 시작할 수 없어요. 팀이 비드 이상 따면 10×비드 + 넘친 트릭 1점씩, 모자라면 −10×비드. 먼저 150점에 닿는 팀이 이겨요. (단순화: 닐 비드와 백 벌점은 없어요)',
      '4 seats; partners sit opposite (me + across vs the sides). 13 cards each. First everyone bids how many tricks they will take (1–13); team bid = sum. Spades are trump: if you cannot follow suit, a spade wins. Follow suit when you can. No leading spades until spades are broken. Make your team bid: 10×bid + 1 per extra trick; miss it: −10×bid. First team to 150 wins. (Simplified: no nil bids or bag penalties.)'],
    init: function (n, lv, K) { var s = { n: 4, score: [0, 0], dealer: 3, handNo: 0, done: false }; dealHand(s, K); return s; },
    view: function (s, me, K) {
      var my = me >= 0 && s.turn === me, acts = '';
      if (my && s.phase === 'bid') { acts = '<div class="ck-lbl">' + K.L(['몇 트릭 딸까요?', 'How many tricks?']) + '</div><div class="ck-acts">'; for (var b = 1; b <= 13; b++) acts += '<button style="min-width:54px" data-a="b:' + b + '">' + b + '</button>'; acts += '</div>'; }
      return TR.view(s, me, K, {
        info: '<span class="ck-pill">' + tname(K, 0) + ' ' + s.score[0] + '</span><span class="ck-pill">' + tname(K, 1) + ' ' + s.score[1] + '</span>',
        seat: function (p) { return (team(p) ? '🔷' : '🔶') + ' ' + K.L(['비드 ', 'bid ']) + (s.bids[p] == null ? '?' : s.bids[p]) + ' · ' + K.L(['딴 ', 'won ']) + s.tricks[p]; },
        legal: my && s.phase === 'play' ? legal(s, me) : null, acts: acts
      });
    },
    act: function (s, p, a, K) {
      if (p !== s.turn) return false;
      if (s.phase === 'bid') {
        var b = +(/^b:(\d+)$/.exec(a) || [])[1]; if (!(b >= 1 && b <= 13)) return false;
        s.bids[p] = b; K.say(K.name(p) + ': ' + K.L(['비드 ', 'bids ']) + b); s.turn = (p + 1) % 4;
        if (s.bids.every(function (x) { return x != null; })) s.phase = 'play';
        return;
      }
      var c = (a || '').slice(2); if (legal(s, p).indexOf(c) < 0) return false;
      s.hands[p].splice(s.hands[p].indexOf(c), 1); s.trick.push({ p: p, c: c }); if (su(c) === 'S') s.broken = true;
      if (s.trick.length < 4) { s.turn = (p + 1) % 4; return; }
      var w = TR.winner(s.trick, 'S'); s.tricks[w]++; s.lastTrick = s.trick; s.lastWin = w; s.trick = []; s.turn = w;
      K.say(K.name(w) + K.L([' 트릭!', ' takes the trick']));
      if (!s.hands[0].length) {
        var m = [];
        for (var t = 0; t < 2; t++) {
          var bid = s.bids[t] + s.bids[t + 2], got = s.tricks[t] + s.tricks[t + 2], d = got >= bid ? 10 * bid + (got - bid) : -10 * bid;
          s.score[t] += d; m.push(tname(K, t) + ' ' + got + '/' + bid + ' → ' + (d > 0 ? '+' : '') + d);
        }
        K.say(m.join(' · '));
        if (Math.max(s.score[0], s.score[1]) >= 150 && s.score[0] !== s.score[1]) s.done = true; else dealHand(s, K);
      }
    },
    ai: function (s, p, lv) {
      if (s.phase === 'bid') {
        var h = s.hands[p], v = 0, sp = h.filter(function (c) { return su(c) === 'S'; }).length;
        h.forEach(function (c) {
          var r = c.slice(0, -1), len = h.filter(function (x) { return su(x) === su(c); }).length;
          if (r === 'A') v += 1; else if (r === 'K' && len >= 2) v += 0.75; else if (r === 'Q' && su(c) === 'S' && len >= 3) v += 0.5;
        });
        v += Math.max(0, sp - 3) * 0.8;
        if (lv === 'easy') v += Math.random() * 2 - 1;
        return 'b:' + Math.max(1, Math.min(13, Math.round(v)));
      }
      return 'c:' + TR.smart(s.trick, legal(s, p), 'S', function (q) { return team(q) === team(p); }, lv);
    },
    over: function (s, K) {
      if (!s.done) return null;
      var t = s.score[0] > s.score[1] ? 0 : 1;
      return { winners: [t, t + 2], text: '🏆 ' + tname(K, t) + K.L([' 승리!', ' wins!']), detail: s.score[0] + ' : ' + s.score[1] };
    }
  };
  window.CKGame = G;
})();
