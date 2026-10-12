/* 나두 트릭 테이킹 공용 도우미 (하트·스페이드·브릿지·마이티). window.TR */
(function () {
  var RO = '2 3 4 5 6 7 8 9 10 J Q K A'.split(' '), SO = { S: 0, H: 1, C: 2, D: 3 };
  function rv(c) { return RO.indexOf(c.slice(0, -1)); }
  function su(c) { return c === 'JKB' || c === 'JKC' ? 'J' : c.slice(-1); }
  function sort(h) { h.sort(function (a, b) { return ((SO[su(a)] == null ? -1 : SO[su(a)]) - (SO[su(b)] == null ? -1 : SO[su(b)])) || (rv(b) - rv(a)); }); return h; }
  function legal(h, led) { if (!led) return h.slice(); var f = h.filter(function (c) { return su(c) === led; }); return f.length ? f : h.slice(); }
  function winner(trick, trump) {
    var best = trick[0];
    trick.forEach(function (t) { var a = su(t.c), b = su(best.c); if (a === b ? rv(t.c) > rv(best.c) : a === trump) best = t; });
    return best.p;
  }
  function deal(K, n, per, opt) { var d = K.deck(opt), h = []; for (var i = 0; i < n; i++) h.push(sort(d.splice(0, per))); return { hands: h, rest: d }; }
  // 화면: o = { info: html, seat(p) -> 짧은 글, legal: 카드 배열(내 차례일 때), extra: html, open: {p:true} 앞면 공개 자리, ctrl: {p: me} 대신 내는 자리 }
  function view(s, me, K, o) {
    o = o || {};
    var h = o.info ? '<div class="ck-info">' + o.info + '</div>' : '', seats = '';
    for (var p = 0; p < s.n; p++) if (p !== me) {
      var cnt = s.hands[p].length, open = o.open && o.open[p], b = '';
      if (open) b = s.hands[p].map(function (c) { var tap = o.ctrlLegal && o.ctrlLegal[p] && o.ctrlLegal[p].indexOf(c) >= 0; return K.card(c, tap ? { small: 1, act: 'c:' + c } : { small: 1, dim: !!o.ctrlLegal && !!o.ctrlLegal[p] }); }).join('');
      else b = '<span class="ck-lbl">🂠 × ' + cnt + '</span>';
      seats += '<div class="ck-seat' + (s.turn === p || (o.cur === p) ? ' turn' : '') + (open ? ' dummy' : '') + '"' + (open ? ' style="grid-column:1/-1"' : '') + '><h4><span>' + K.esc(K.name(p)) + '</span><span>' + (o.seat ? o.seat(p) : '') + '</span></h4><div class="ck-row">' + b + '</div></div>';
    }
    h += '<div class="ck-seats">' + seats + '</div>';
    var tr = s.trick && s.trick.length ? s.trick : (s.lastTrick || []);
    h += '<div class="ck-trick">' + (tr.length ? tr.map(function (t) { return '<figure>' + K.card(t.c) + '<figcaption>' + K.esc(K.name(t.p)) + (s.trick && s.trick.length ? '' : (t.p === s.lastWin ? ' 🏆' : '')) + '</figcaption></figure>'; }).join('') : '<span class="ck-lbl">' + K.L(['가운데', 'Table']) + '</span>') + '</div>';
    if (o.extra) h += o.extra;
    if (me < 0 || me >= s.n) return h;
    var lg = o.legal;
    h += '<div class="ck-seat' + (s.turn === me && o.cur == null ? ' turn' : (o.cur === me ? ' turn' : '')) + '"><h4><span>' + K.esc(K.name(me)) + ' 👈</span><span>' + (o.seat ? o.seat(me) : '') + '</span></h4>' + (o.acts || '') +
      '<div class="ck-hand tight">' + s.hands[me].map(function (c) { var ok = lg && lg.indexOf(c) >= 0; return K.card(c, ok ? { act: 'c:' + c } : { dim: !!lg }); }).join('') + '</div></div>';
    return h;
  }
  // 쉬운 AI: 따라 낼 때 이길 수 있으면 가장 약한 이기는 카드, 아니면 가장 약한 카드
  function lowest(cs, trump) { return cs.slice().sort(function (a, b) { return ((su(a) === trump) - (su(b) === trump)) || rv(a) - rv(b); })[0]; }
  function highest(cs) { return cs.slice().sort(function (a, b) { return rv(b) - rv(a); })[0]; }
  function smart(trick, L, trump, isPartner, lv) {
    if (lv === 'easy' && Math.random() < 0.5) return L[Math.floor(Math.random() * L.length)];
    if (!trick.length) {
      var hi = L.filter(function (c) { return su(c) !== trump && rv(c) >= 11; }); if (hi.length && lv !== 'easy') return highest(hi);
      var nt = L.filter(function (c) { return su(c) !== trump; }); return lowest(nt.length ? nt : L, trump);
    }
    var w = winner(trick, trump), b = trick.filter(function (t) { return t.p === w; })[0];
    if (isPartner(b.p) && (rv(b.c) >= 10 || su(b.c) === trump)) return lowest(L, trump);
    var win = L.filter(function (c) { return winner(trick.concat([{ p: -1, c: c }]), trump) === -1; });
    return lowest(win.length ? win : L, trump);
  }
  window.TR = { smart: smart, RO: RO, rv: rv, su: su, sort: sort, legal: legal, winner: winner, deal: deal, view: view, lowest: lowest, highest: highest };
})();
