/* 하트 (단순화): 4자리, 13장씩, 카드 넘기기 없음. ♣2 가 첫 리드. 하트 1점, ♠Q 13점. 문 슛(26점 독식)이면 나머지 모두 +26. 누가 50점을 넘으면 끝, 가장 낮은 사람 승리. */
(function () {
  var rv = TR.rv, su = TR.su;
  function pts(c) { return su(c) === 'H' ? 1 : c === 'QS' ? 13 : 0; }
  function dealHand(s, K) { var d = TR.deal(K, 4, 13); s.hands = d.hands; s.pts = [0, 0, 0, 0]; s.trick = []; s.lastTrick = []; s.broken = false; s.first = true; s.handNo++; s.turn = s.hands.findIndex(function (h) { return h.indexOf('2C') >= 0; }); }
  function legal(s, p) {
    var h = s.hands[p], led = s.trick.length ? su(s.trick[0].c) : null, L = TR.legal(h, led);
    if (!led) {
      if (s.first) return ['2C'];
      if (!s.broken) { var nh = L.filter(function (c) { return su(c) !== 'H'; }); if (nh.length) L = nh; }
    } else if (s.first) { var np = L.filter(function (c) { return !pts(c); }); if (np.length) L = np; }
    return L;
  }
  var G = {
    id: 'hearts', emoji: '♥️', title: ['하트', 'Hearts'], minP: 2, maxP: 4, seats: 4,
    bgm: [69, 72, 76, 72, 74, 77, 81, 77, 76, 72, 69, 0, 71, 74, 79, 0],
    rules: ['4자리(빈 자리는 PC). 13장씩 받아요. ♣2를 가진 사람이 먼저 내요. 같은 무늬가 있으면 꼭 따라 내야 하고, 없으면 아무거나 낼 수 있어요. 낸 무늬 중 가장 높은 카드가 한 바퀴(트릭)를 가져가요. 하트 1장 = 1점, ♠Q = 13점 — 점수는 적을수록 좋아요! 하트가 한 번 나오기 전에는 하트로 시작할 수 없어요. 첫 바퀴엔 점수 카드를 피해야 해요. 한 사람이 26점을 모두 가져가면(문 슛) 나머지 모두 +26점. 누군가 50점을 넘으면 끝, 가장 점수가 낮은 사람이 이겨요. (단순화: 카드 넘기기는 없어요)',
      '4 seats (computers fill empty ones), 13 cards each. Whoever holds ♣2 leads. Follow suit if you can; otherwise play anything. Highest card of the led suit takes the trick. Each heart = 1 point, ♠Q = 13 — fewer points is better! You cannot lead hearts until hearts are broken. No point cards on the first trick if you can avoid it. Take all 26 (shoot the moon) and everyone else gets +26. When someone passes 50, lowest score wins. (Simplified: no card passing.)'],
    init: function (n, lv, K) { var s = { n: 4, scores: [0, 0, 0, 0], handNo: 0, done: false }; dealHand(s, K); return s; },
    view: function (s, me, K) {
      return TR.view(s, me, K, {
        info: '<span class="ck-pill">' + K.L(['판', 'Hand']) + ' ' + s.handNo + '</span><span class="ck-pill">' + (s.broken ? '💔 ' + K.L(['하트 깨짐', 'Hearts broken']) : '♥ ' + K.L(['하트 아직', 'Hearts closed'])) + '</span>',
        seat: function (p) { return '⭐' + s.scores[p] + ' (+' + s.pts[p] + ')'; },
        legal: me >= 0 && s.turn === me ? legal(s, me) : null
      });
    },
    act: function (s, p, a, K) {
      var c = (a || '').slice(2); if (p !== s.turn || legal(s, p).indexOf(c) < 0) return false;
      s.hands[p].splice(s.hands[p].indexOf(c), 1); s.trick.push({ p: p, c: c }); if (su(c) === 'H') s.broken = true;
      if (s.trick.length < 4) { s.turn = (p + 1) % 4; return; }
      var w = TR.winner(s.trick, null), got = 0;
      s.trick.forEach(function (t) { got += pts(t.c); }); s.pts[w] += got; s.lastTrick = s.trick; s.lastWin = w; s.trick = []; s.first = false; s.turn = w;
      K.say(K.name(w) + ' ' + K.L(['가 가져감', 'takes it']) + (got ? ' (+' + got + ')' : ''));
      if (!s.hands[0].length) {
        var moon = s.pts.indexOf(26);
        for (var i = 0; i < 4; i++) s.scores[i] += moon >= 0 ? (i === moon ? 0 : 26) : s.pts[i];
        if (moon >= 0) K.say('🌙 ' + K.name(moon) + K.L([' 문 슛! 나머지 +26', ' shot the moon! Others +26']));
        if (Math.max.apply(null, s.scores) >= 50) s.done = true; else dealHand(s, K);
      }
    },
    ai: function (s, p, lv) {
      var L = legal(s, p);
      if (lv === 'easy' && Math.random() < 0.6) return 'c:' + L[Math.floor(Math.random() * L.length)];
      if (!s.trick.length) return 'c:' + L.slice().sort(function (a, b) { return (su(a) === 'H') - (su(b) === 'H') || (a === 'QS') - (b === 'QS') || rv(a) - rv(b); })[0];
      var led = su(s.trick[0].c);
      if (su(L[0]) === led) {
        var best = s.trick.filter(function (t) { return su(t.c) === led; }).reduce(function (m, t) { return rv(t.c) > rv(m.c) ? t : m; }).c;
        var under = L.filter(function (c) { return rv(c) < rv(best); });
        if (lv === 'hard' && led === 'S' && L.indexOf('QS') >= 0 && rv(best) > rv('QS')) return 'c:QS';
        if (under.length) return 'c:' + TR.highest(under);
        var any = s.trick.some(function (t) { return pts(t.c); });
        if (s.trick.length === 3 && !any) return 'c:' + (TR.highest(L.filter(function (c) { return c !== 'QS'; })) || L[0]);
        return 'c:' + TR.lowest(L);
      }
      if (L.indexOf('QS') >= 0) return 'c:QS';
      var hs = L.filter(function (c) { return su(c) === 'H'; });
      return 'c:' + TR.highest(hs.length ? hs : L);
    },
    over: function (s, K) {
      if (!s.done) return null;
      var m = Math.min.apply(null, s.scores), w = []; s.scores.forEach(function (v, i) { if (v === m) w.push(i); });
      return { winners: w, detail: s.scores.map(function (v, i) { return K.name(i) + ' ' + v; }).join(' · ') };
    }
  };
  window.CKGame = G;
})();
