/* 클론다이크 솔리테어 (1장 넘기기, 무제한 다시 돌리기). */
(function () {
  var SU = ['S', 'H', 'D', 'C'];
  function red(c) { return c.s === 'H' || c.s === 'D'; }
  function top(a) { return a[a.length - 1]; }
  function fi(c) { return SU.indexOf(c.s); }
  function toF(s, c) { var f = s.fnd[fi(c)]; return (f.length ? top(f).r : 0) === c.r - 1; }
  function onT(col, c) { var t = top(col); return t ? t.up && red(t.c) !== red(c) && t.c.r === c.r + 1 : c.r === 13; }
  function flip(s) { s.tab.forEach(function (col) { var t = top(col); if (t && !t.up) t.up = true; }); }
  var S = {
    id: 'klondike', emoji: '🎴', title: ['클론다이크', 'Klondike'], bgm: [72, 76, 79, 76, 77, 81, 79, 0, 74, 77, 81, 77, 76, 72, 74, 0],
    rules: ['목표: 52장을 모두 오른쪽 위 파운데이션 4칸에 무늬별로 A→2→…→K 순서로 올려요. 아래 7줄(테이블)에서는 색(빨강/검정)을 번갈아 1씩 작은 숫자를 얹을 수 있어요(예: 검정 8 위에 빨강 7). 앞면 카드 묶음은 통째로 옮길 수 있고, 빈 줄에는 K(또는 K로 시작하는 묶음)만 놓아요. 왼쪽 위 스톡을 탭하면 1장씩 넘겨요. 다 넘기면 다시 탭해 처음부터. 카드를 탭하면 갈 수 있는 곳으로 자동 이동하고, 안전한 카드는 저절로 파운데이션에 올라가요. ↩️ 되돌리기 무제한, 🔁 같은 판 다시, 🆕 새 판.',
      'Goal: build all 52 cards onto the 4 foundations (top right) by suit, A→2→…→K. On the 7 tableau piles, stack down in alternating colours (red 7 on black 8). Face-up runs move together; only a K (or a run starting with K) goes into an empty pile. Tap the stock (top left) to turn one card; when empty, tap to recycle. Tap any card to auto-move it to a legal spot; safe cards fly to the foundations by themselves. Unlimited undo, 🔁 restart the same deal, 🆕 new deal.'],
    deal: function () {
      var d = []; SU.forEach(function (s) { for (var r = 1; r <= 13; r++) d.push({ r: r, s: s }); });
      for (var i = d.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = d[i]; d[i] = d[j]; d[j] = x; }
      var s = { stock: [], waste: [], fnd: [[], [], [], []], tab: [] };
      for (var c = 0; c < 7; c++) { var col = []; for (var k = 0; k <= c; k++) col.push({ c: d.pop(), up: k === c }); s.tab.push(col); }
      s.stock = d; return s;
    },
    tap: function (s, a) {
      if (a === 'stock') { if (s.stock.length) { s.waste.push(s.stock.pop()); return true; } if (!s.waste.length) return false; s.stock = s.waste.reverse(); s.waste = []; return true; }
      var m, cards, from;
      if (a === 'w') { if (!s.waste.length) return false; cards = [top(s.waste)]; from = function () { s.waste.pop(); }; }
      else if ((m = /^f(\d)$/.exec(a))) { var f = s.fnd[+m[1]]; if (!f.length) return false; cards = [top(f)]; from = function () { f.pop(); }; }
      else if ((m = /^t(\d):(\d+)$/.exec(a))) {
        var col = s.tab[+m[1]], j = +m[2]; if (!col[j] || !col[j].up) return false;
        cards = col.slice(j).map(function (x) { return x.c; }); from = function () { col.splice(j); };
      } else return false;
      var c = cards[0], src = m && a[0] === 't' ? +m[1] : -1;
      if (cards.length === 1 && a[0] !== 'f' && toF(s, c)) { from(); s.fnd[fi(c)].push(c); flip(s); return true; }
      var cand = [];
      for (var i = 0; i < 7; i++) if (i !== src && onT(s.tab[i], c)) cand.push(i);
      cand.sort(function (x, y) { return (s.tab[x].length ? 0 : 1) - (s.tab[y].length ? 0 : 1); });
      if (!cand.length) return false;
      from(); cards.forEach(function (x) { s.tab[cand[0]].push({ c: x, up: true }); }); flip(s); return true;
    },
    autoStep: function (s) {
      var allUp = !s.stock.length && !s.waste.length && s.tab.every(function (col) { return col.every(function (x) { return x.up; }); });
      function safe(c) { if (allUp || c.r <= 2) return true; var o = red(c) ? ['S', 'C'] : ['H', 'D']; return o.every(function (su) { var f = s.fnd[SU.indexOf(su)]; return (f.length ? top(f).r : 0) >= c.r - 1; }); }
      var w = top(s.waste); if (w && toF(s, w) && safe(w)) { s.waste.pop(); s.fnd[fi(w)].push(w); return true; }
      for (var i = 0; i < 7; i++) { var t = top(s.tab[i]); if (t && t.up && toF(s, t.c) && safe(t.c)) { s.tab[i].pop(); s.fnd[fi(t.c)].push(t.c); flip(s); return true; } }
      return false;
    },
    won: function (s) { return s.fnd.every(function (f) { return f.length === 13; }); },
    render: function (s, U) {
      var h = '<div class="so-top" style="grid-template-columns:repeat(7,1fr)">';
      h += '<div class="so-slot" data-a="stock">' + (s.stock.length ? U.card(null, { act: 'stock' }) : '↻') + '</div>';
      h += '<div class="so-slot">' + (s.waste.length ? U.card(top(s.waste), { up: 1, act: 'w' }) : '') + '</div><div></div>';
      s.fnd.forEach(function (f, i) { h += '<div class="so-slot">' + (f.length ? U.card(top(f), { up: 1, act: 'f' + i }) : ['♠', '♥', '♦', '♣'][i]) + '</div>'; });
      h += '</div><div class="so-tab" style="grid-template-columns:repeat(7,1fr)">';
      s.tab.forEach(function (col, i) {
        var y = 0, inner = '';
        col.forEach(function (x, j) { inner += U.card(x.c, { up: x.up, top: y, act: x.up ? 't' + i + ':' + j : null }); y += x.up ? 26 : 9; });
        h += '<div class="so-col" style="height:calc(var(--cw)*1.42 + ' + Math.max(0, y - (col.length && col[col.length - 1].up ? 26 : 9)) + 'px)">' + (col.length ? inner : '<div class="so-slot">K</div>') + '</div>';
      });
      return h + '</div>';
    }
  };
  window.SoloGame = S;
})();
