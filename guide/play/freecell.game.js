/* 프리셀: 마이크로소프트 방식 딜 번호(#1~32000), 빈칸 4개, 테이블 8줄. */
(function () {
  var SU = ['S', 'H', 'D', 'C'];
  function red(c) { return c.s === 'H' || c.s === 'D'; }
  function top(a) { return a[a.length - 1]; }
  function fi(c) { return SU.indexOf(c.s); }
  function toF(s, c) { var f = s.fnd[fi(c)]; return (f.length ? top(f).r : 0) === c.r - 1; }
  function seqOk(cs) { for (var i = 1; i < cs.length; i++) if (cs[i].r !== cs[i - 1].r - 1 || red(cs[i]) === red(cs[i - 1])) return false; return true; }
  function cap(s, toEmpty) { var fc = s.cells.filter(function (x) { return !x; }).length, ec = s.tab.filter(function (c) { return !c.length; }).length - (toEmpty ? 1 : 0); return (fc + 1) * Math.pow(2, Math.max(0, ec)); }
  function msDeal(n) {
    var deck = [], seed = n, cols = [[], [], [], [], [], [], [], []], CS = ['C', 'D', 'H', 'S'];
    for (var i = 0; i < 52; i++) deck.push(i);
    for (var k = 0; k < 52; k++) { seed = (seed * 214013 + 2531011) & 0x7fffffff; var left = 52 - k, j = (seed >> 16) % left, c = deck[j]; deck[j] = deck[left - 1]; cols[k % 8].push({ r: Math.floor(c / 4) + 1, s: CS[c % 4] }); }
    return cols;
  }
  var S = {
    id: 'freecell', emoji: '🗂️', title: ['프리셀', 'FreeCell'], bgm: [69, 72, 76, 81, 79, 76, 72, 0, 71, 74, 77, 83, 81, 77, 74, 0],
    label: function (s) { return '#' + s.no; },
    rules: ['목표: 52장을 모두 오른쪽 위 파운데이션 4칸에 무늬별로 A→K 순서로 올려요. 모든 카드가 처음부터 앞면이라 운보다 생각이 중요해요(거의 모든 판을 풀 수 있어요). 왼쪽 위 빈칸(프리셀) 4개에는 아무 카드나 1장씩 잠시 둘 수 있어요. 아래 8줄에서는 색을 번갈아 1씩 작은 숫자를 얹어요. 빈 줄에는 아무 카드나 놓을 수 있어요. 여러 장 묶음은 (빈 프리셀+1)×2^(빈 줄 수) 장까지 한 번에 옮길 수 있어요. 카드를 탭하면 파운데이션 → 다른 줄 → 빈 줄 → 프리셀 순으로 자동 이동해요. ↩️ 되돌리기, 🔁 같은 판 다시, 🆕 새 판(딜 번호 #).',
      'Goal: move all 52 cards to the 4 foundations (top right) by suit, A→K. Every card is face up, so it is skill over luck (almost every deal is solvable). The 4 free cells (top left) each hold any one card. On the 8 tableau columns, build down in alternating colours; an empty column takes any card. Runs of up to (free cells+1)×2^(empty columns) cards move at once. Tap a card: it goes to foundation → another column → an empty column → a free cell. Undo, 🔁 restart the same deal, 🆕 new deal (deal number #).'],
    deal: function () { var no = 1 + Math.floor(Math.random() * 32000); return { no: no, cells: [null, null, null, null], fnd: [[], [], [], []], tab: msDeal(no) }; },
    tap: function (s, a) {
      var m, cards, from, src = -1, fromCell = false;
      if ((m = /^c(\d)$/.exec(a))) { var ci = +m[1]; if (!s.cells[ci]) return false; cards = [s.cells[ci]]; from = function () { s.cells[ci] = null; }; fromCell = true; }
      else if ((m = /^t(\d):(\d+)$/.exec(a))) { var col = s.tab[+m[1]], j = +m[2]; src = +m[1]; if (!col[j]) return false; cards = col.slice(j); if (!seqOk(cards)) return false; from = function () { col.splice(j); }; }
      else return false;
      var c = cards[0];
      if (cards.length === 1 && toF(s, c)) { from(); s.fnd[fi(c)].push(c); return true; }
      for (var i = 0; i < 8; i++) { var t = top(s.tab[i]); if (i !== src && t && t.r === c.r + 1 && red(t) !== red(c) && cards.length <= cap(s, false)) { from(); s.tab[i] = s.tab[i].concat(cards); return true; } }
      if (!(src >= 0 && s.tab[src].length === cards.length)) for (i = 0; i < 8; i++) if (!s.tab[i].length && cards.length <= cap(s, true)) { from(); s.tab[i] = cards.slice(); return true; }
      if (cards.length === 1 && !fromCell) { var e = s.cells.indexOf(null); if (e >= 0) { from(); s.cells[e] = c; return true; } }
      if (cards.length > 1) return S.tap(s, 't' + src + ':' + (s.tab[src].length - 1)) && true;
      return false;
    },
    autoStep: function (s) {
      function safe(c) { if (c.r <= 2) return true; var o = red(c) ? ['S', 'C'] : ['H', 'D']; return o.every(function (su) { var f = s.fnd[SU.indexOf(su)]; return (f.length ? top(f).r : 0) >= c.r - 1; }); }
      for (var k = 0; k < 4; k++) { var c = s.cells[k]; if (c && toF(s, c) && safe(c)) { s.cells[k] = null; s.fnd[fi(c)].push(c); return true; } }
      for (var i = 0; i < 8; i++) { var t = top(s.tab[i]); if (t && toF(s, t) && safe(t)) { s.tab[i].pop(); s.fnd[fi(t)].push(t); return true; } }
      return false;
    },
    won: function (s) { return s.fnd.every(function (f) { return f.length === 13; }); },
    render: function (s, U) {
      var h = '<div class="so-top" style="grid-template-columns:repeat(8,1fr)">';
      s.cells.forEach(function (c, i) { h += '<div class="so-slot">' + (c ? U.card(c, { up: 1, act: 'c' + i }) : '') + '</div>'; });
      s.fnd.forEach(function (f, i) { h += '<div class="so-slot">' + (f.length ? U.card(top(f), { up: 1 }) : ['♠', '♥', '♦', '♣'][i]) + '</div>'; });
      h += '</div><div class="so-tab" style="grid-template-columns:repeat(8,1fr)">';
      s.tab.forEach(function (col, i) {
        var y = 0, inner = '', step = col.length > 12 ? 20 : 24;
        col.forEach(function (c, j) { inner += U.card(c, { up: 1, top: y, act: 't' + i + ':' + j }); y += step; });
        h += '<div class="so-col" style="height:calc(var(--cw)*1.42 + ' + Math.max(0, y - step) + 'px)">' + (col.length ? inner : '<div class="so-slot"></div>') + '</div>';
      });
      return h + '</div>';
    }
  };
  window.SoloGame = S;
})();
