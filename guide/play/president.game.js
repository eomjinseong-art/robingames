/* 대통령 (단순화, 한 판): 세기 3<4<…<K<A<2. 같은 숫자 1~4장. 다음 사람은 같은 장수로 더 높은 숫자만. 패스하면 그 바닥에서는 다시 못 냄.
 * 모두 패스하면 마지막에 낸 사람이 새로 시작. 다 낸 순서대로 대통령 → … → 거지. (카드 교환·혁명은 생략) */
(function () {
  var R = '3 4 5 6 7 8 9 10 J Q K A 2'.split(' ');
  function v(c) { return R.indexOf(c.slice(0, -1)); }
  function sortH(h) { h.sort(function (a, b) { return v(a) - v(b) || a.localeCompare(b); }); }
  function act1(s) { var r = 0; for (var i = 0; i < s.n; i++) if (s.fin.indexOf(i) < 0) r++; return r; }
  function advance(s, from) {
    for (var i = 1; i <= s.n; i++) {
      var q = (from + i) % s.n;
      if (s.fin.indexOf(q) >= 0) continue;
      if (s.top && q === s.top.p) { clear(s); s.turn = q; return; }
      if (!s.passed[q]) { s.turn = q; return; }
    }
    var lp = s.top ? s.top.p : from; clear(s);
    for (var j = 1; j <= s.n; j++) { var r = (lp + j) % s.n; if (s.fin.indexOf(r) < 0) { s.turn = r; return; } }
  }
  function clear(s) { s.top = null; for (var i = 0; i < s.n; i++) s.passed[i] = false; }
  function titles(n) { return n === 2 ? [['대통령', 'President'], ['거지', 'Beggar']] : n === 3 ? [['대통령', 'President'], ['평민', 'Citizen'], ['거지', 'Beggar']] : [['대통령', 'President'], ['부통령', 'Vice'], ['평민', 'Citizen'], ['거지', 'Beggar']]; }
  function okPlay(s, cards) {
    if (!cards.length || cards.length > 4) return false;
    var r = v(cards[0]); if (cards.some(function (c) { return v(c) !== r; })) return false;
    return !s.top || (cards.length === s.top.cards.length && r > v(s.top.cards[0]));
  }
  var G = {
    id: 'president', emoji: '👑', title: ['대통령', 'President'], minP: 2, maxP: 4,
    bgm: [74, 78, 81, 78, 76, 79, 83, 0, 74, 78, 81, 86, 85, 81, 78, 0],
    rules: ['세기: 3 < 4 < … < K < A < 2 (2가 가장 셈). 시작 사람은 같은 숫자 1~4장을 내요. 다음 사람은 같은 장수로 더 높은 숫자만 낼 수 있고, 못 내거나 싫으면 패스 (패스하면 그 바닥에선 다시 못 내요). 모두 패스하면 바닥을 치우고 마지막에 낸 사람이 새로 시작. 손패를 다 낸 순서대로 대통령 → 부통령 → 평민 → 거지! ♣3을 가진 사람이 먼저 시작. (카드 교환·혁명 규칙은 생략)',
      'Rank: 3 < 4 < … < K < A < 2 (2 is highest). The leader plays 1–4 cards of the same rank. Others must play the same number of cards of a higher rank, or pass (once you pass you are out until the pile clears). When everyone passes, the last player to play leads again. Finish order: President → Vice → Citizen → Beggar! Holder of 3♣ starts. (Card swaps and revolution are skipped.)'],
    init: function (n, lv, K) {
      var d = K.deck(), s = { n: n, hands: [], passed: [], fin: [], top: null, turn: 0 };
      if (n === 2) d = d.slice(0, 36);
      for (var i = 0; i < n; i++) { s.hands.push([]); s.passed.push(false); }
      d.forEach(function (c, i) { s.hands[i % n].push(c); });
      s.hands.forEach(function (h, i) { sortH(h); if (h.indexOf('3C') >= 0) s.turn = i; });
      return s;
    },
    view: function (s, me, K, fin) {
      var h = '', T = titles(s.n);
      for (var p = 0; p < s.n; p++) if (p !== me) {
        var m = s.hands[p].length, b = '', f = s.fin.indexOf(p);
        for (var i = 0; i < Math.min(m, 10); i++) b += K.card('XX', { small: 1 });
        h += '<div class="ck-seat' + (s.turn === p ? ' turn' : '') + (s.passed[p] || f >= 0 ? ' out' : '') + '"><h4><span>' + K.esc(K.name(p)) + (f >= 0 ? ' 👑 ' + K.L(T[f]) : '') + '</span><span>' + m + K.t('cards') + (s.passed[p] ? ' · ' + K.L(['패스', 'pass']) : '') + '</span></h4><div class="ck-row">' + b + '</div></div>';
      }
      h += '<div class="ck-center">' + (s.top ? s.top.cards.map(function (c) { return K.card(c); }).join('') + '<div class="ck-lbl">' + K.esc(K.name(s.top.p)) + '</div>' : '<div class="ck-lbl">' + K.L(['바닥이 비었어요 — 아무 숫자나 1~4장', 'Empty — lead any 1–4 of a rank']) + '</div>') + '</div>';
      if (me < 0) return h;
      var my = s.turn === me, sel = K.sel(), cards = sel.map(function (i) { return s.hands[me][i]; }), f2 = s.fin.indexOf(me);
      h += '<div class="ck-seat' + (my ? ' turn' : '') + '"><h4><span>' + K.esc(K.name(me)) + ' 👈' + (f2 >= 0 ? ' 👑 ' + K.L(T[f2]) : '') + '</span><span>' + s.hands[me].length + K.t('cards') + '</span></h4>';
      if (my) h += '<div class="ck-acts"><button data-a="play"' + (okPlay(s, cards) ? '' : ' disabled') + '>' + K.L(['내기', 'Play']) + (cards.length ? ' ×' + cards.length : '') + '</button><button class="alt" data-a="pass"' + (s.top ? '' : ' disabled') + '>' + K.L(['패스', 'Pass']) + '</button></div>';
      h += '<div class="ck-hand">' + s.hands[me].map(function (c, i) { return K.card(c, my ? { act: 'sel:' + i, sel: sel.indexOf(i) >= 0 } : {}); }).join('') + '</div>';
      return h + '</div>';
    },
    act: function (s, p, a, K) {
      if (p !== s.turn) return false;
      if (a === 'pass') { if (!s.top) return false; s.passed[p] = true; K.say(K.name(p) + ' ' + K.L(['패스', 'passes'])); advance(s, p); return; }
      var idx = a === 'play' ? K.sel().slice() : (/^play:([\d,]+)$/.exec(a) || [0, ''])[1].split(',').filter(Boolean).map(Number);
      var cards = idx.map(function (i) { return s.hands[p][i]; });
      if (cards.some(function (c) { return !c; }) || !okPlay(s, cards)) return false;
      idx.sort(function (x, y) { return y - x; }).forEach(function (i) { s.hands[p].splice(i, 1); });
      s.top = { p: p, cards: cards };
      K.say(K.name(p) + ': ' + cards[0].slice(0, -1) + ' ×' + cards.length);
      if (!s.hands[p].length) { s.fin.push(p); K.say(K.name(p) + ' ' + K.L(['다 냈어요! 👑 ', 'is out! 👑 ']) + K.L(titles(s.n)[s.fin.length - 1])); }
      if (act1(s) <= 1) { for (var i = 0; i < s.n; i++) if (s.fin.indexOf(i) < 0) s.fin.push(i); return; }
      advance(s, p);
    },
    ai: function (s, p, lv, K) {
      var h = s.hands[p], groups = {};
      h.forEach(function (c, i) { (groups[v(c)] = groups[v(c)] || []).push(i); });
      var ks = Object.keys(groups).map(Number).sort(function (a, b) { return a - b; });
      if (!s.top) {
        var g = lv === 'easy' ? ks[Math.floor(Math.random() * ks.length)] : ks[0];
        if (lv === 'hard' && ks.length > 1 && groups[ks[0]].length === 1 && groups[ks[1]].length > 1 && ks[1] < 8) g = ks[1]; // 낮은 짝 먼저 털기
        return 'play:' + groups[g].join(',');
      }
      var need = s.top.cards.length, tv = v(s.top.cards[0]), opts = ks.filter(function (k) { return k > tv && groups[k].length >= need; });
      if (!opts.length) return 'pass';
      if (lv === 'easy') { if (Math.random() < 0.2) return 'pass'; return 'play:' + groups[opts[Math.floor(Math.random() * opts.length)]].slice(0, need).join(','); }
      var pick = opts[0];
      if (lv === 'hard') {
        var exact = opts.filter(function (k) { return groups[k].length === need; }); if (exact.length) pick = exact[0]; // 짝 안 깨기
        if (pick >= 11 && h.length > 5 && Math.random() < 0.6) return 'pass'; // A·2는 아껴 두기
      }
      return 'play:' + groups[pick].slice(0, need).join(',');
    },
    over: function (s, K) {
      if (act1(s) > 0 || s.fin.length < s.n) return null;
      var T = titles(s.n);
      return { winners: [s.fin[0]], detail: s.fin.map(function (p, i) { return K.L(T[i]) + ': ' + K.name(p); }).join(' · ') };
    }
  };
  window.CKGame = G;
})();
