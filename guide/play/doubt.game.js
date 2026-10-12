/* 다우트 (단순화): 52장을 모두 나눔. 차례 숫자 A→2→…→K→A. 1~4장을 뒷면으로 내며 "○ ○장!" (거짓말 가능).
 * 바로 다음 사람이 '다우트!' 또는 '믿기'를 골라요. 거짓이면 낸 사람이, 진짜면 외친 사람이 가운데 더미를 모두 가져가요.
 * 마지막 카드를 내고 통과(믿기 또는 진짜)하면 승리. */
(function () {
  var R = 'A 2 3 4 5 6 7 8 9 10 J Q K'.split(' ');
  function rk(c) { return c.slice(0, -1); }
  function sortH(h) { h.sort(function (a, b) { return R.indexOf(rk(a)) - R.indexOf(rk(b)) || a.localeCompare(b); }); }
  function nx(s, p) { return (p + 1) % s.n; }
  var G = {
    id: 'doubt', emoji: '🤥', title: ['다우트', 'Doubt'], minP: 2, maxP: 4,
    bgm: [67, 71, 74, 71, 72, 76, 72, 0, 67, 71, 74, 79, 78, 74, 71, 0],
    rules: ['카드를 모두 나눠요. 차례 숫자는 A→2→3…→K→다시 A. 내 차례에 1~4장을 뒷면으로 내며 "○ ○장!"이라고 말해요. 진짜가 아니어도 돼요(거짓말 OK)! 바로 다음 사람이 "다우트!" 또는 "믿기"를 골라요. 카드를 뒤집어 거짓말이면 낸 사람이, 진짜면 외친 사람이 가운데 더미를 모두 가져가요. 가장 먼저 손패를 다 내고 통과하면 승리. (한 폰 버전: 바로 다음 사람만 다우트를 외칠 수 있어요)',
      'Deal out all cards. The called rank goes A→2→…→K→A. On your turn place 1–4 cards face down and claim "N of rank X" — lying is allowed! The next player chooses Doubt or Believe. Flip: if it was a lie the player takes the whole pile, if true the doubter does. First to empty their hand and survive wins. (One-phone version: only the next player may call Doubt.)'],
    init: function (n, lv, K) {
      var d = K.deck(), s = { n: n, hands: [], pile: [], need: 0, last: null, phase: 'play', turn: 0, win: -1, rev: null };
      for (var i = 0; i < n; i++) s.hands.push([]);
      d.forEach(function (c, i) { s.hands[i % n].push(c); });
      s.hands.forEach(sortH); return s;
    },
    view: function (s, me, K, fin) {
      var h = '<div class="ck-info"><span class="ck-pill">' + K.L(['이번 숫자', 'Call']) + ' <b style="font-size:22px">' + R[s.need] + '</b></span><span class="ck-pill">' + K.L(['가운데', 'Pile']) + ' ' + s.pile.length + K.t('cards') + '</span></div>';
      for (var p = 0; p < s.n; p++) if (p !== me) {
        var m = s.hands[p].length, b = ''; for (var i = 0; i < Math.min(m, 10); i++) b += K.card('XX', { small: 1 });
        h += '<div class="ck-seat' + (s.turn === p ? ' turn' : '') + '"><h4><span>' + K.esc(K.name(p)) + '</span><span>' + m + K.t('cards') + '</span></h4><div class="ck-row">' + b + '</div></div>';
      }
      if (s.rev) h += '<div class="ck-lbl">' + K.L(['방금 뒤집은 카드', 'Just flipped']) + '</div><div class="ck-row">' + s.rev.cards.map(function (c) { return K.card(c, { small: 1 }); }).join('') + '</div>';
      if (s.last && s.phase === 'judge') h += '<div class="ck-center">' + s.last.cards.map(function () { return K.card('XX'); }).join('') + '<div class="ck-pill" style="font-size:20px">' + K.esc(K.name(s.last.p)) + ': "' + R[s.last.claim] + ' ×' + s.last.cards.length + '"</div></div>';
      if (me < 0) return h;
      var my = s.turn === me, sel = K.sel();
      h += '<div class="ck-seat' + (my ? ' turn' : '') + '"><h4><span>' + K.esc(K.name(me)) + ' 👈</span><span>' + s.hands[me].length + K.t('cards') + '</span></h4>';
      if (my && s.phase === 'judge') h += '<div class="ck-acts"><button class="red" data-a="doubt">' + K.L(['다우트!', 'Doubt!']) + '</button><button class="alt" data-a="trust">' + K.L(['믿기', 'Believe']) + '</button></div>';
      if (my && s.phase === 'play') h += '<div class="ck-acts"><button data-a="play"' + (sel.length < 1 || sel.length > 4 ? ' disabled' : '') + '>"' + R[s.need] + ' ×' + sel.length + '" ' + K.L(['내기', 'play']) + '</button></div><div class="ck-lbl">' + K.L(['카드를 1~4장 골라요 (거짓말 OK)', 'Pick 1–4 cards (bluffing OK)']) + '</div>';
      h += '<div class="ck-hand">' + s.hands[me].map(function (c, i) { return K.card(c, my && s.phase === 'play' ? { act: 'sel:' + i, sel: sel.indexOf(i) >= 0 } : {}); }).join('') + '</div>';
      return h + '</div>';
    },
    act: function (s, p, a, K) {
      if (p !== s.turn) return false;
      if (s.phase === 'play') {
        var idx = a === 'play' ? K.sel().slice() : (/^play:([\d,]+)$/.exec(a) || [0, ''])[1].split(',').filter(Boolean).map(Number);
        if (idx.length < 1 || idx.length > 4) return false;
        idx.sort(function (x, y) { return y - x; });
        var cards = idx.map(function (i) { return s.hands[p].splice(i, 1)[0]; });
        s.pile = s.pile.concat(cards); s.last = { p: p, cards: cards, claim: s.need }; s.rev = null;
        K.say(K.name(p) + ': "' + R[s.need] + ' ×' + cards.length + '!"');
        s.need = (s.need + 1) % 13; s.phase = 'judge'; s.turn = nx(s, p); return;
      }
      var L = s.last, lie = L.cards.some(function (c) { return R.indexOf(rk(c)) !== L.claim; });
      if (a === 'doubt') {
        var taker = lie ? L.p : p;
        s.rev = { cards: L.cards }; s.hands[taker] = s.hands[taker].concat(s.pile); sortH(s.hands[taker]); s.pile = [];
        K.say(K.name(p) + ' ' + K.L(['다우트! → ', 'doubts! → ']) + (lie ? K.L(['거짓말이었어요! ', 'It was a lie! ']) : K.L(['진짜였어요! ', 'It was true! '])) + K.name(taker) + ' ' + K.L(['가 더미를 가져가요', 'takes the pile']));
      } else if (a === 'trust') { s.rev = null; K.say(K.name(p) + ' ' + K.L(['믿기', 'believes'])); }
      else return false;
      if (!s.hands[L.p].length) { s.win = L.p; return; }
      s.phase = 'play';
    },
    ai: function (s, p, lv, K) {
      var h = s.hands[p];
      if (s.phase === 'judge') {
        var L = s.last, own = h.filter(function (c) { return R.indexOf(rk(c)) === L.claim; }).length;
        if (own + L.cards.length > 4) return 'doubt';
        if (!s.hands[L.p].length) return lv === 'easy' && Math.random() < 0.5 ? 'trust' : 'doubt';
        var pr = lv === 'easy' ? 0.25 : lv === 'normal' ? (L.cards.length >= 3 ? 0.5 : 0.15) : (own + L.cards.length >= 4 ? 0.7 : L.cards.length >= 3 ? 0.4 : 0.1);
        return Math.random() < pr ? 'doubt' : 'trust';
      }
      var mine = [], other = [];
      h.forEach(function (c, i) { (R.indexOf(rk(c)) === s.need ? mine : other).push(i); });
      if (mine.length) {
        if (lv === 'hard' && other.length > 2 && mine.length < 4 && Math.random() < 0.3) mine.push(far(other));
        return 'play:' + mine.slice(0, 4).join(',');
      }
      if (lv === 'easy') return 'play:' + other[Math.floor(Math.random() * other.length)];
      var pick = [far(other)];
      if (lv === 'hard' && other.length > 4 && Math.random() < 0.3) { var o2 = other.filter(function (i) { return i !== pick[0]; }); pick.push(far(o2)); }
      return 'play:' + pick.join(',');
      function far(list) { // 차례가 가장 늦게 돌아오는 숫자 = 지금 버려도 아깝지 않음
        var best = list[0], bd = -1;
        list.forEach(function (i) { var d = (R.indexOf(rk(h[i])) - s.need + 13) % 13; if (d > bd) { bd = d; best = i; } });
        return best;
      }
    },
    over: function (s) { return s.win >= 0 ? { winners: [s.win] } : null; }
  };
  window.CKGame = G;
})();
