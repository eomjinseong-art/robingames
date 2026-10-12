/* 인디언 포커 (가족용·칩은 점수): A~10 두 벌 20장, 1장씩. 남의 카드는 보이고 내 카드는 안 보임. 콜/레이즈/다이. 5판 뒤 칩 많은 사람 승. */
(function () {
  var ROUNDS = 5, START = 15, MAXR = 2;
  function val(c) { var r = c.slice(0, -1); return r === 'A' ? 1 : +r; }
  function deal(s, K) {
    s.deck = K.deck({ suits: ['S', 'H'], ranks: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10'] });
    s.card = []; s.folded = []; s.bet = []; s.acted = [];
    for (var i = 0; i < s.n; i++) { s.card.push(s.deck.pop()); s.folded.push(false); s.bet.push(1); s.chips[i] -= 1; s.pot += 1; s.acted.push(false); }
    s.cur = 1; s.raises = 0; s.phase = 'bet'; s.hand++; s.turn = (s.hand - 1) % s.n; s.res = '';
  }
  function live(s) { var r = []; for (var i = 0; i < s.n; i++) if (!s.folded[i]) r.push(i); return r; }
  function next(s) {
    var L = live(s);
    if (L.length > 1) for (var i = 1; i <= s.n; i++) { var q = (s.turn + i) % s.n; if (!s.folded[q] && (!s.acted[q] || s.bet[q] < s.cur)) { s.turn = q; return; } }
    showdown(s);
  }
  function showdown(s) {
    var L = live(s), best = -1, w = [];
    L.forEach(function (p) { var v = val(s.card[p]); if (v > best) { best = v; w = [p]; } else if (v === best) w.push(p); });
    var each = Math.floor(s.pot / w.length);
    w.forEach(function (p) { s.chips[p] += each; }); s.pot -= each * w.length;
    s.win = w; s.phase = 'show'; s.turn = -1;
  }
  var G = {
    id: 'indianpoker', emoji: '🪶', title: ['인디언 포커', 'Indian Poker'], minP: 2, maxP: 4, family: true,
    bgm: [69, 72, 76, 72, 74, 77, 74, 0, 69, 72, 76, 79, 77, 74, 72, 0],
    rules: ['카드 A(1)~10, 1장씩 받아요. 남의 카드는 보이지만 내 카드는 안 보여요! 모두 칩 1개를 내고 시작. 차례마다 콜(따라가기)·레이즈(+1)·다이(포기). 한 판에 레이즈는 2번까지. 남은 사람 중 숫자가 가장 높은 사람이 가운데 칩을 가져가요 (같으면 나눔). 5판 뒤 칩이 가장 많은 사람이 승리. 칩은 점수일 뿐, 돈은 걸지 않아요.',
      'Cards A(1)–10, one each. You see everyone else\'s card but never your own! Everyone puts in 1 chip. On your turn: Call, Raise (+1) or Fold. Max 2 raises per hand. Highest card left takes the middle chips (ties split). After 5 hands, most chips wins. Chips are just points — no money.'],
    init: function (n, lv, K) { var s = { n: n, chips: [], pot: 0, hand: 0 }; for (var i = 0; i < n; i++) s.chips.push(START); deal(s, K); return s; },
    view: function (s, me, K, fin) {
      var h = '<div class="ck-info"><span class="ck-pill">' + K.L(['판', 'Hand']) + ' ' + s.hand + '/' + ROUNDS + '</span><span class="ck-pill">🪙 ' + K.L(['가운데', 'Pot']) + ' ' + s.pot + '</span></div>';
      for (var p = 0; p < s.n; p++) {
        var hide = s.phase === 'bet' && p === me;
        h += '<div class="ck-seat' + (s.turn === p ? ' turn' : '') + (s.folded[p] ? ' out' : '') + '"><h4><span>' + K.esc(K.name(p)) + (p === me ? ' 👈' : '') + '</span><span>🪙 ' + s.chips[p] + ' · ' + K.L(['낸 칩', 'in']) + ' ' + s.bet[p] + (s.folded[p] ? ' · ' + K.L(['다이', 'fold']) : '') + '</span></h4>' +
          '<div class="ck-row">' + K.card(s.card[p], { back: hide }) + (hide ? '<div class="ck-lbl" style="align-self:center">' + K.L(['내 카드는 비밀! ❓', 'Your card is hidden! ❓']) + '</div>' : '') + '</div></div>';
      }
      if (fin) return h;
      if (s.phase === 'bet' && s.turn === me) {
        var need = s.cur - s.bet[me];
        h += '<div class="ck-acts"><button data-a="call">' + K.L(['콜', 'Call']) + (need ? ' +' + need : '') + '</button>' +
          '<button class="alt" data-a="raise"' + (s.raises >= MAXR ? ' disabled' : '') + '>' + K.L(['레이즈', 'Raise']) + ' +' + (need + 1) + '</button>' +
          '<button class="red" data-a="fold">' + K.L(['다이', 'Fold']) + '</button></div>';
      } else if (s.phase === 'show') {
        h += '<div class="ck-msg">' + K.esc(s.win.map(K.name).join(', ')) + ' ' + K.L(['가 가장 높아요! 칩을 가져가요', ' had the highest card and takes the chips']) + '</div>' +
          '<div class="ck-acts"><button data-a="next">' + (s.hand >= ROUNDS ? K.L(['결과 보기 ▶', 'Results ▶']) : K.L(['다음 판 ▶', 'Next hand ▶'])) + '</button></div>';
      }
      return h;
    },
    act: function (s, p, a, K) {
      if (s.phase === 'show') { if (a !== 'next') return false; if (s.hand >= ROUNDS) s.phase = 'end'; else deal(s, K); return; }
      if (s.phase !== 'bet' || p !== s.turn) return false;
      var need = s.cur - s.bet[p];
      if (a === 'raise' && s.raises < MAXR) { s.raises++; s.cur++; need++; for (var i = 0; i < s.n; i++) s.acted[i] = false; K.say(K.name(p) + ' ' + K.L(['레이즈!', 'raises!'])); }
      else if (a === 'fold') { s.folded[p] = true; K.say(K.name(p) + ' ' + K.L(['다이', 'folds'])); need = 0; }
      else { a = 'call'; K.say(K.name(p) + ' ' + K.L(['콜', 'calls'])); }
      if (a !== 'fold') { s.chips[p] -= need; s.bet[p] += need; s.pot += need; }
      s.acted[p] = true; next(s);
    },
    ai: function (s, p, lv, K) {
      var all = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10'], pool = [], best = 0;
      all.forEach(function (r) { pool.push(r + 'S', r + 'H'); });
      for (var i = 0; i < s.n; i++) if (i !== p) { pool.splice(pool.indexOf(s.card[i]), 1); if (!s.folded[i]) best = Math.max(best, val(s.card[i])); }
      var win = 0; pool.forEach(function (c) { var v = val(c); win += v > best ? 1 : v === best ? 0.5 : 0; });
      var pr = win / pool.length, need = s.cur - s.bet[p];
      if (lv === 'easy') pr += (Math.random() - 0.5) * 0.6;
      if (lv === 'hard' && Math.random() < 0.1) pr += 0.4; // 가끔 허세
      if (pr > (lv === 'hard' ? 0.7 : 0.78) && s.raises < MAXR) return 'raise';
      if (need === 0 || pr > (lv === 'hard' ? 0.4 : 0.33)) return 'call';
      return 'fold';
    },
    over: function (s, K) {
      if (s.phase !== 'end') return null;
      var m = Math.max.apply(null, s.chips), w = [];
      s.chips.forEach(function (c, i) { if (c === m) w.push(i); });
      return { winners: w, detail: s.chips.map(function (c, i) { return K.name(i) + ' 🪙' + c; }).join(' · ') };
    }
  };
  window.CKGame = G;
})();
