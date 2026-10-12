/* 러시안 뱅크 (단순화): 2명이 각자 52장. 리저브 12장, 내 쪽 테이블 4칸, 나머지는 스톡.
 * 가운데 파운데이션 8칸(A부터 같은 무늬 오름), 테이블 8칸(색 번갈아 내림), 상대 리저브·버림 더미에 같은 무늬 ±1 '얹기'.
 * 스톡에서 뒤집은 카드를 쓰지 못하면 버림 더미에 놓고 차례 끝. 리저브·스톡·버림을 모두 비우면 승리. */
(function () {
  var RK = 'A 2 3 4 5 6 7 8 9 10 J Q K'.split(' ');
  function r(c) { return RK.indexOf(c.slice(0, -1)) + 1; }
  function su(c) { return c.slice(-1); }
  function red(c) { return su(c) === 'H' || su(c) === 'D'; }
  function top(a) { return a[a.length - 1]; }
  function left(s, p) { var P = s.P[p]; return P.res.length + P.stock.length + P.waste.length + (P.flip ? 1 : 0); }
  function srcCard(s, p, src) { var P = s.P[p]; if (src === 'r') return top(P.res); if (src === 'f') return P.flip; var m = /^t(\d)$/.exec(src); return m ? top(s.tab[+m[1]]) : null; }
  function fndFor(s, c) { if (r(c) === 1) return s.fnd.findIndex(function (f) { return !f.length; }); return s.fnd.findIndex(function (f) { return f.length && su(top(f)) === su(c) && r(top(f)) === r(c) - 1; }); }
  function ok(s, p, src, dst) {
    var c = srcCard(s, p, src); if (!c || src === dst) return false;
    if (dst === 'F') return fndFor(s, c) >= 0;
    var m = /^t(\d)$/.exec(dst);
    if (m) { var t = top(s.tab[+m[1]]); return !t || (r(t) === r(c) + 1 && red(t) !== red(c)); }
    var O = s.P[1 - p], pile = dst === 'or' ? O.res : dst === 'ow' ? O.waste : null, o = pile && top(pile);
    return !!o && su(o) === su(c) && Math.abs(r(o) - r(c)) === 1;
  }
  function take(s, p, src) { var P = s.P[p]; if (src === 'r') return P.res.pop(); if (src === 'f') { var c = P.flip; P.flip = null; return c; } return s.tab[+src.slice(1)].pop(); }
  function put(s, p, dst, c) { if (dst === 'F') s.fnd[fndFor(s, c)].push(c); else if (dst[0] === 't') s.tab[+dst.slice(1)].push(c); else (dst === 'or' ? s.P[1 - p].res : s.P[1 - p].waste).push(c); }
  function moves(s, p) {
    var out = [], srcs = ['r', 'f', 't0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'], dsts = ['F', 'or', 'ow', 't0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'];
    srcs.forEach(function (a) { if (srcCard(s, p, a)) dsts.forEach(function (b) { if (ok(s, p, a, b)) out.push([a, b]); }); });
    return out;
  }
  function endTurn(s, K, p) { s.turn = 1 - p; s.pick = null; s.turns++; K.say(K.name(1 - p) + K.L([' 차례', '\'s turn'])); }
  function fin(s) { [0, 1].forEach(function (p) { if (!left(s, p)) s.win = p; }); if (s.win < 0 && (s.passes >= 2 || s.turns > 400)) s.win = left(s, 0) <= left(s, 1) ? (left(s, 0) === left(s, 1) ? -3 : 0) : 1; }
  var G = {
    id: 'russianbank', emoji: '🏦', title: ['러시안 뱅크', 'Russian Bank'], minP: 2, maxP: 2,
    bgm: [62, 65, 69, 74, 72, 69, 65, 0, 64, 67, 70, 74, 73, 70, 67, 0],
    rules: ['2명이 각자 52장 덱을 가져요. 리저브 12장(맨 위만 앞면), 내 쪽 테이블 4칸에 1장씩, 나머지 36장은 스톡. 가운데: 파운데이션 8칸(A부터 같은 무늬로 2,3…K까지 쌓기), 테이블 8칸(한 장씩, 색을 번갈아 1 작은 숫자 얹기, 빈칸엔 아무 카드). 내 차례에 리저브 맨 위·테이블 맨 위·뒤집은 스톡 카드를 옮겨요. 상대의 리저브나 버림 더미 맨 위에 같은 무늬 ±1을 "얹기"해서 상대를 귀찮게 할 수도 있어요! 스톡을 뒤집어 그 카드를 쓰지 못하면 내 버림 더미에 놓고 차례가 끝나요. 스톡이 다 떨어지면 버림 더미를 뒤집어 다시 스톡으로. 리저브·스톡·버림을 모두 먼저 비우면 승리! (단순화: "먼저 파운데이션" 같은 반칙 지적 규칙은 없어요. 카드를 고르고 → 옮길 곳을 탭)',
      'Each player has a full 52-card deck: reserve of 12 (top face up), 4 cards to your side of the tableau, 36 in the stock. Middle: 8 foundations (ace up in suit to king) and 8 tableau piles (one card at a time, alternating colour, one lower; any card on an empty pile). On your turn move the top of your reserve, a tableau top, or your flipped stock card. You may also "load" the opponent: put a card of the same suit ±1 on their reserve or waste! If you flip a stock card you can\'t use, it goes to your waste and your turn ends. Empty stock → turn the waste over. First to empty reserve, stock and waste wins! (Simplified: no "stop!" penalty calls. Tap a card, then tap where it goes.)'],
    init: function (n, lv, K) {
      var s = { n: 2, P: [], tab: [[], [], [], [], [], [], [], []], fnd: [[], [], [], [], [], [], [], []], turn: 0, pick: null, win: -1, passes: 0, turns: 0 };
      for (var p = 0; p < 2; p++) { var d = K.deck(), P = { res: d.splice(0, 12), stock: [], waste: [], flip: null }; for (var i = 0; i < 4; i++) s.tab[p * 4 + i].push(d.pop()); P.stock = d; s.P.push(P); }
      return s;
    },
    view: function (s, me, K, finished) {
      var vp = me < 0 ? 0 : me, my = me >= 0 && s.turn === me, O = s.P[1 - vp], M = s.P[vp], pk = s.pick;
      function tgt(dst) { return my && pk && ok(s, me, pk, dst) ? dst : null; }
      function cardAt(c, src, dst, opt) { opt = opt || {}; var t = tgt(dst); if (t) return K.card(c || 'N0', { act: 'to:' + t, small: opt.small }).replace('ck-card', 'ck-card ' + (c ? '' : 'num') + ' sel').replace('<b>0</b>', '<b>＋</b>'); if (my && src && c) return K.card(c, { act: 'p:' + src, sel: pk === src, small: opt.small }); return c ? K.card(c, { small: opt.small }) : '<div class="ck-card num' + (opt.small ? ' sm' : '') + '" style="opacity:.3"><b>·</b></div>'; }
      var h = '<div class="ck-seat' + (s.turn === 1 - vp ? ' turn' : '') + '"><h4><span>' + K.esc(K.name(1 - vp)) + '</span><span>' + K.L(['남은 ', 'left ']) + left(s, 1 - vp) + '</span></h4><div class="ck-row">' +
        '<figure style="margin:0;text-align:center">' + cardAt(top(O.res), null, 'or', { small: 1 }) + '<figcaption class="ck-lbl">' + K.L(['리저브 ', 'Reserve ']) + O.res.length + '</figcaption></figure>' +
        '<figure style="margin:0;text-align:center">' + cardAt(top(O.waste), null, 'ow', { small: 1 }) + '<figcaption class="ck-lbl">' + K.L(['버림 ', 'Waste ']) + O.waste.length + '</figcaption></figure>' +
        '<figure style="margin:0;text-align:center">' + (O.flip ? K.card(O.flip, { small: 1 }) : O.stock.length ? K.card('XX', { small: 1 }) : cardAt(null, null, null, { small: 1 })) + '<figcaption class="ck-lbl">' + K.L(['스톡 ', 'Stock ']) + O.stock.length + '</figcaption></figure></div></div>';
      var ft = tgt('F');
      h += '<div class="ck-lbl">' + K.L(['파운데이션 (A→K)', 'Foundations (A→K)']) + '</div><div class="ck-row" style="gap:3px"' + (ft ? ' data-a="to:F" style="outline:3px dashed #ffd32a;border-radius:10px;cursor:pointer"' : '') + '>' + s.fnd.map(function (f) { return f.length ? K.card(top(f), { small: 1 }) : '<div class="ck-card sm num" style="opacity:.3"><b>A</b></div>'; }).join('') + '</div>';
      h += '<div class="ck-lbl">' + K.L(['테이블 (색 번갈아 내림)', 'Tableau (down, alternating colour)']) + '</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;justify-items:center">';
      for (var i = 0; i < 8; i++) { var col = s.tab[i]; h += '<figure style="margin:0;text-align:center">' + cardAt(top(col), 't' + i, 't' + i) + '<figcaption class="ck-lbl">' + (col.length > 1 ? '×' + col.length : '&nbsp;') + '</figcaption></figure>'; }
      h += '</div>';
      if (me < 0) return h;
      h += '<div class="ck-seat' + (my ? ' turn' : '') + '"><h4><span>' + K.esc(K.name(me)) + ' 👈</span><span>' + K.L(['남은 ', 'left ']) + left(s, me) + '</span></h4><div class="ck-row">' +
        '<figure style="margin:0;text-align:center">' + cardAt(top(M.res), 'r', null) + '<figcaption class="ck-lbl">' + K.L(['리저브 ', 'Reserve ']) + M.res.length + '</figcaption></figure>' +
        '<figure style="margin:0;text-align:center">' + (M.flip ? cardAt(M.flip, 'f', null) : (M.stock.length || M.waste.length ? K.card('XX', my ? { act: 'flip' } : {}) : cardAt(null, null, null))) + '<figcaption class="ck-lbl">' + K.L(['스톡 ', 'Stock ']) + M.stock.length + '</figcaption></figure>' +
        '<figure style="margin:0;text-align:center">' + (top(M.waste) ? K.card(top(M.waste), { small: 1 }) : '') + '<figcaption class="ck-lbl">' + K.L(['버림 ', 'Waste ']) + M.waste.length + '</figcaption></figure></div>';
      if (my) {
        h += '<div class="ck-acts">' + (!M.flip && (M.stock.length || M.waste.length) ? '<button data-a="flip">🂠 ' + K.L(['스톡 뒤집기', 'Flip stock']) + '</button>' : '') +
          (M.flip ? '<button class="red" data-a="end">' + K.L(['버림에 놓고 끝', 'To waste, end turn']) + '</button>' : '') +
          (!M.flip && !M.stock.length && !M.waste.length ? '<button class="alt" data-a="pass">' + K.L(['넘기기', 'Pass']) + '</button>' : '') + '</div>' +
          '<div class="ck-lbl">' + (pk ? K.L(['노란 점선/＋ 자리를 탭해 옮겨요', 'Tap a highlighted spot to move']) : K.L(['옮길 카드(리저브·뒤집은 카드·테이블)를 탭', 'Tap a card to move (reserve, flipped, tableau)'])) + '</div>';
      }
      return h + '</div>';
    },
    act: function (s, p, a, K) {
      if (p !== s.turn) return false;
      var P = s.P[p], m;
      if ((m = /^p:(r|f|t\d)$/.exec(a || ''))) { if (!srcCard(s, p, m[1])) return false; s.pick = s.pick === m[1] ? null : m[1]; return; }
      var src = null, dst = null;
      if ((m = /^to:(F|or|ow|t\d)$/.exec(a || ''))) { src = s.pick; dst = m[1]; }
      else if ((m = /^m:(r|f|t\d):(F|or|ow|t\d)$/.exec(a || ''))) { src = m[1]; dst = m[2]; }
      if (dst) {
        if (!src || !ok(s, p, src, dst)) return false;
        put(s, p, dst, take(s, p, src)); s.pick = null; s.passes = 0;
        K.say(K.name(p) + ' → ' + (dst === 'F' ? K.L(['파운데이션', 'foundation']) : dst[0] === 't' ? K.L(['테이블', 'tableau']) : K.L(['상대에게 얹기!', 'loads the opponent!'])));
        fin(s); return;
      }
      if (a === 'flip' && !P.flip) {
        if (!P.stock.length) { if (!P.waste.length) return false; P.stock = P.waste.reverse(); P.waste = []; }
        P.flip = P.stock.pop(); s.pick = 'f'; return;
      }
      if (a === 'end' && P.flip) { P.waste.push(P.flip); P.flip = null; s.passes = 0; endTurn(s, K, p); fin(s); return; }
      if (a === 'pass' && !P.flip && !P.stock.length && !P.waste.length) { s.passes++; endTurn(s, K, p); fin(s); return; }
      return false;
    },
    ai: function (s, p, lv) {
      var mv = moves(s, p), P = s.P[p];
      function f(fn) { return mv.filter(function (x) { return fn(x[0], x[1]); })[0]; }
      var pick = f(function (a, b) { return b === 'F' && a === 'r'; }) || f(function (a, b) { return b === 'F' && a === 'f'; }) || f(function (a, b) { return b === 'F'; }) ||
        (lv === 'easy' && Math.random() < 0.5 ? null : f(function (a, b) { return (a === 'r' || a === 'f') && (b === 'or' || b === 'ow'); })) ||
        f(function (a, b) { return a === 'r' && b[0] === 't' && s.tab[+b.slice(1)].length; }) || f(function (a, b) { return a === 'r' && b[0] === 't'; }) ||
        f(function (a, b) { return a === 'f' && b[0] === 't' && s.tab[+b.slice(1)].length; }) ||
        (lv !== 'easy' && P.res.length ? f(function (a, b) { return a[0] === 't' && b[0] === 't' && s.tab[+a.slice(1)].length === 1 && s.tab[+b.slice(1)].length; }) : null);
      if (pick) return 'm:' + pick[0] + ':' + pick[1];
      if (!P.flip) return P.stock.length || P.waste.length ? 'flip' : 'pass';
      return 'end';
    },
    over: function (s, K) {
      if (s.win === -1) return null;
      if (s.win === -3) return { winners: [0, 1], text: K.L(['무승부!', 'Draw!']) };
      return { winners: [s.win], detail: K.name(0) + ' ' + left(s, 0) + ' · ' + K.name(1) + ' ' + left(s, 1) + K.L(['장 남음', ' cards left']) };
    }
  };
  window.CKGame = G;
})();
