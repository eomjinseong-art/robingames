/* 마이티 (단순화): 5자리(빈 자리는 PC). 53장(조커 1). 10장씩 + 바닥 3장. 공약(13~20 + 기루다 무늬) 경매 →
 * 주공이 바닥 3장을 받아 3장 버림 → 프렌드 카드 자동 지정 → 10트릭. 점수 카드 A·K·Q·J·10 (총 20장). */
(function () {
  var rv = TR.rv, SN = { S: '♠', H: '♥', D: '♦', C: '♣', N: 'NT' }, SU = ['S', 'H', 'D', 'C'];
  function su(c) { return c === 'JKB' ? 'J' : c.slice(-1); }
  function isPt(c) { return c !== 'JKB' && 'A K Q J 10'.split(' ').indexOf(c.slice(0, -1)) >= 0; }
  function mighty(s) { return s.trump === 'S' ? 'AD' : 'AS'; }
  function power(s, c, led) { if (c === mighty(s)) return 200; if (c === 'JKB') return 150; if (s.trump !== 'N' && su(c) === s.trump) return 100 + rv(c); if (su(c) === led) return 50 + rv(c); return rv(c); }
  function ledOf(t) { for (var i = 0; i < t.length; i++) if (t[i].c !== 'JKB') return su(t[i].c); return null; }
  function winner(s, t) { var led = ledOf(t), b = t[0]; t.forEach(function (x) { if (power(s, x.c, led) > power(s, b.c, led)) b = x; }); return b.p; }
  function sortH(h) { TR.sort(h); var j = h.indexOf('JKB'); if (j >= 0) { h.splice(j, 1); h.unshift('JKB'); } return h; }
  function legal(s, p) {
    var h = s.hands[p], led = ledOf(s.trick); if (!led) return h.slice();
    var f = h.filter(function (c) { return su(c) === led || c === 'JKB' || c === mighty(s); });
    return h.some(function (c) { return su(c) === led; }) ? f : h.slice();
  }
  function dealNew(s, K) {
    var d = K.deck({ jokers: true }); d.splice(d.indexOf('JKC'), 1);
    s.hands = []; for (var i = 0; i < 5; i++) s.hands.push(sortH(d.splice(0, 10)));
    s.kitty = d; s.phase = 'bid'; s.hi = null; s.out = [0, 0, 0, 0, 0]; s.trick = []; s.lastTrick = []; s.pts = [0, 0, 0, 0, 0];
    s.trump = 'N'; s.friend = null; s.fcard = null; s.revealed = false; s.dealer = (s.dealer + 1) % 5; s.turn = (s.dealer + 1) % 5; s.done = false;
  }
  function est(h, st) {
    var v = 0, m = st === 'S' ? 'AD' : 'AS';
    h.forEach(function (c) { if (c === m) v += 2; else if (c === 'JKB') v += 2; else if (st !== 'N' && su(c) === st) v += 1.2 + (rv(c) >= 11 ? 0.8 : 0); else if (c.slice(0, -1) === 'A') v += 1.2; else if (c.slice(0, -1) === 'K') v += 0.4; });
    return Math.min(20, Math.round(7 + v));
  }
  function team(s, p) { return p === s.decl || (s.revealed && p === s.friend); }
  var G = {
    id: 'mighty', emoji: '💪', title: ['마이티', 'Mighty'], minP: 2, maxP: 5, seats: 5,
    bgm: [67, 70, 74, 77, 75, 74, 70, 0, 65, 69, 72, 77, 75, 72, 69, 0],
    rules: ['5자리(빈 자리는 PC), 53장(조커 1장). 10장씩 받고 3장은 바닥에. 점수 카드는 A·K·Q·J·10 (모두 20장). ① 공약: "점수 몇 장 + 기루다(으뜸 무늬)"를 13~20으로 불러요. 앞사람보다 숫자가 커야 하고, 패스하면 끝까지 빠져요. ② 마지막까지 남은 사람이 주공! 바닥 3장을 받아 필요 없는 3장을 버려요. 프렌드 카드(마이티→조커→기루다 A… 중 주공에게 없는 카드)를 가진 사람이 비밀 친구가 돼요(그 카드를 낼 때 공개). ③ 주공부터 10바퀴. 같은 무늬를 따라 내야 하지만 마이티·조커는 언제나 낼 수 있어요. 세기: 마이티(♠A, 기루다가 ♠이면 ♦A) > 조커 > 기루다 > 처음 낸 무늬. ④ 주공 팀이 딴 점수 카드가 공약 이상이면 주공 팀 승, 아니면 야당 승. (단순화: 조커 콜·첫/마지막 판 조커 제한 없음, 프렌드는 자동 지정)',
      '5 seats (computers fill empty ones), 53 cards incl. one joker. 10 cards each, 3 in the kitty. Point cards: A K Q J 10 (20 total). 1) Bid "number of points + trump suit" from 13 to 20; each bid must be higher, and a pass is final. 2) The last bidder is declarer, takes the kitty and discards 3. The friend card (Mighty → Joker → trump A… whichever declarer lacks) secretly makes its holder declarer\'s partner, revealed when played. 3) Declarer leads; 10 tricks. Follow suit, but Mighty and Joker may always be played. Power: Mighty (♠A, or ♦A if spades are trump) > Joker > trump > led suit. 4) Declarer\'s team needs at least the bid in point cards, otherwise the defenders win. (Simplified: no joker call or first/last-trick joker limits; friend picked automatically.)'],
    init: function (n, lv, K) { var s = { n: 5, dealer: 4 }; dealNew(s, K); return s; },
    view: function (s, me, K) {
      var my = me >= 0 && s.turn === me, acts = '', sel = K.sel();
      var info = s.hi ? '<span class="ck-pill">' + K.L(['공약', 'Bid']) + ' ' + s.hi.n + SN[s.hi.st] + ' · ' + K.esc(K.name(s.hi.p)) + '</span>' : '<span class="ck-pill">' + K.L(['공약 경매', 'Bidding']) + '</span>';
      if (s.phase === 'play') info += '<span class="ck-pill">' + K.L(['마이티 ', 'Mighty ']) + (mighty(s) === 'AS' ? '♠A' : '♦A') + '</span><span class="ck-pill">👫 ' + (s.fcard ? (SN[su(s.fcard)] || '🃏') + s.fcard.slice(0, -1) + (s.revealed ? ' = ' + K.esc(K.name(s.friend)) : '') : K.L(['없음', 'none'])) + '</span>';
      if (my && s.phase === 'bid') {
        var min = s.hi ? s.hi.n + 1 : 13; acts = '<div class="ck-acts"><button class="alt" data-a="pass">' + K.L(['패스', 'Pass']) + '</button></div><div class="ck-acts">';
        for (var n = min; n <= 20; n++) ['S', 'H', 'D', 'C', 'N'].forEach(function (st) { acts += '<button style="min-width:58px;min-height:42px;font-size:16px' + (st === 'H' || st === 'D' ? ';color:#c11' : '') + '" data-a="b:' + n + st + '">' + n + SN[st] + '</button>'; });
        acts += '</div>';
      }
      if (my && s.phase === 'discard') acts = '<div class="ck-lbl">' + K.L(['버릴 카드 3장을 골라요', 'Pick 3 cards to discard']) + '</div><div class="ck-acts"><button data-a="disc"' + (sel.length === 3 ? '' : ' disabled') + '>' + K.L(['버리기', 'Discard']) + ' (' + sel.length + '/3)</button></div>';
      var o = {
        info: info, acts: acts,
        seat: function (p) { return (s.out[p] && s.phase === 'bid' ? '🙅 ' : '') + (p === s.decl && s.phase !== 'bid' ? '👑 ' : '') + (s.revealed && p === s.friend ? '👫 ' : '') + '⭐' + s.pts[p]; },
        legal: my && s.phase === 'play' ? legal(s, me) : null
      };
      if (my && s.phase === 'discard') {
        var h = TR.view(s, -1, K, o);
        return h + '<div class="ck-seat turn"><h4><span>' + K.esc(K.name(me)) + ' 👈</span></h4>' + acts + '<div class="ck-hand tight">' + s.hands[me].map(function (c, i) { return K.card(c, { act: 'sel:' + i, sel: sel.indexOf(i) >= 0 }); }).join('') + '</div></div>';
      }
      return TR.view(s, me, K, o);
    },
    act: function (s, p, a, K) {
      if (p !== s.turn) return false;
      if (s.phase === 'bid') {
        if (a === 'pass') { s.out[p] = 1; K.say(K.name(p) + ': ' + K.L(['패스', 'Pass'])); }
        else {
          var m = /^b:(\d+)([SHDCN])$/.exec(a || ''); if (!m) return false;
          var n = +m[1]; if (n < 13 || n > 20 || (s.hi && n <= s.hi.n)) return false;
          s.hi = { n: n, st: m[2], p: p }; K.say(K.name(p) + ': ' + n + SN[m[2]]);
        }
        var live = [0, 1, 2, 3, 4].filter(function (q) { return !s.out[q]; });
        if (!live.length) { K.say(K.L(['모두 패스 → 다시 나눠요', 'All passed → redeal'])); dealNew(s, K); return; }
        if (s.hi && live.length === 1 && live[0] === s.hi.p) {
          s.decl = s.hi.p; s.trump = s.hi.st; s.hands[s.decl] = sortH(s.hands[s.decl].concat(s.kitty)); s.kitty = []; s.phase = 'discard'; s.turn = s.decl; return;
        }
        var q = p; do { q = (q + 1) % 5; } while (s.out[q]); s.turn = q; return;
      }
      if (s.phase === 'discard') {
        var idx = a === 'disc' ? K.sel().slice() : (/^d:([\d,]+)$/.exec(a || '') || [0, ''])[1].split(',').filter(Boolean).map(Number);
        if (idx.length !== 3) return false;
        idx.sort(function (x, y) { return y - x; }); var h = s.hands[p], dis = idx.map(function (i) { return h.splice(i, 1)[0]; });
        var cand = [mighty(s), 'JKB'].concat(s.trump !== 'N' ? ['A' + s.trump, 'K' + s.trump] : []).concat(SU.map(function (x) { return 'A' + x; }), SU.map(function (x) { return 'K' + x; }));
        s.fcard = cand.filter(function (c) { return h.indexOf(c) < 0 && dis.indexOf(c) < 0; })[0] || null;
        s.friend = -1; for (var i = 0; i < 5; i++) if (s.hands[i].indexOf(s.fcard) >= 0) s.friend = i;
        s.phase = 'play'; s.turn = s.decl;
        K.say(K.name(s.decl) + K.L([' 주공! 기루다 ', ' declares! Trump ']) + SN[s.trump] + ' · 👫 ' + (s.fcard === 'JKB' ? K.L(['조커', 'Joker']) : SN[su(s.fcard)] + s.fcard.slice(0, -1)));
        return;
      }
      var c = (a || '').slice(2); if (legal(s, p).indexOf(c) < 0) return false;
      s.hands[p].splice(s.hands[p].indexOf(c), 1); s.trick.push({ p: p, c: c });
      if (c === s.fcard) { s.revealed = true; K.say('👫 ' + K.name(p) + K.L([' 이(가) 프렌드!', ' is the friend!'])); }
      if (s.trick.length < 5) { s.turn = (p + 1) % 5; return; }
      var w = winner(s, s.trick), got = s.trick.filter(function (t) { return isPt(t.c); }).length;
      s.pts[w] += got; s.lastTrick = s.trick; s.lastWin = w; s.trick = []; s.turn = w;
      K.say(K.name(w) + ' ' + K.L(['가 가져감', 'takes it']) + (got ? ' (+' + got + ')' : ''));
      if (!s.hands[w].length) {
        var sc = s.pts[s.decl] + (s.friend >= 0 && s.friend !== s.decl ? s.pts[s.friend] : 0);
        s.res = { made: sc >= s.hi.n, sc: sc }; s.revealed = true; s.done = true;
      }
    },
    ai: function (s, p, lv) {
      var h = s.hands[p];
      if (s.phase === 'bid') {
        var best = 0, bs = 'S'; ['S', 'H', 'D', 'C', 'N'].forEach(function (st) { var e = est(h, st) + (st === 'N' ? -1 : 0); if (e > best) { best = e; bs = st; } });
        if (lv === 'easy') best += Math.round(Math.random() * 2 - 1);
        var need = s.hi ? s.hi.n + 1 : 13;
        return best >= need && need <= 20 ? 'b:' + need + bs : 'pass';
      }
      if (s.phase === 'discard') {
        var r = h.map(function (c, i) { return { i: i, v: power(s, c, null) + (isPt(c) ? 30 : 0) }; }).sort(function (a, b) { return a.v - b.v; });
        return 'd:' + r.slice(0, 3).map(function (x) { return x.i; }).join(',');
      }
      var L = legal(s, p), led = ledOf(s.trick);
      if (lv === 'easy' && Math.random() < 0.5) return 'c:' + L[Math.floor(Math.random() * L.length)];
      var friendly = function (q) { if (q === p) return true; if (p === s.decl) return s.revealed && q === s.friend; if (p === s.friend) return q === s.decl; return q !== s.decl && !(s.revealed && q === s.friend); };
      var byP = function (x) { return function (a, b) { return x * (power(s, a, led) - power(s, b, led)); }; };
      var cheap = L.filter(function (c) { return !isPt(c) && c !== 'JKB' && c !== mighty(s); }); if (!cheap.length) cheap = L;
      if (!s.trick.length) {
        var strong = L.filter(function (c) { return c === mighty(s) || (c.slice(0, -1) === 'A' && su(c) !== s.trump); });
        return 'c:' + (strong.length ? strong[0] : cheap.slice().sort(byP(1))[0]);
      }
      var w = winner(s, s.trick);
      if (friendly(w)) { var pts = L.filter(function (c) { return isPt(c) && c !== mighty(s) && c.slice(0, -1) !== 'A'; }); return 'c:' + (pts.length && s.trick.length === 4 ? pts[0] : cheap.slice().sort(byP(1))[0]); }
      var win = L.filter(function (c) { return winner(s, s.trick.concat([{ p: -1, c: c }])) === -1; }).sort(byP(1));
      var worth = s.trick.some(function (t) { return isPt(t.c); }) || lv === 'hard';
      if (win.length && (worth || power(s, win[0], led) < 150)) return 'c:' + win[0];
      return 'c:' + cheap.slice().sort(byP(1))[0];
    },
    over: function (s, K) {
      if (!s.done) return null;
      var tm = [s.decl]; if (s.friend >= 0 && s.friend !== s.decl) tm.push(s.friend);
      var w = s.res.made ? tm : [0, 1, 2, 3, 4].filter(function (q) { return tm.indexOf(q) < 0; });
      return { winners: w, text: (K.pc() ? (w.indexOf(0) >= 0 ? '🎉 ' : '😅 ') : '🏆 ') + (s.res.made ? K.L(['주공 팀 승리!', 'Declarer team wins!']) : K.L(['야당 승리!', 'Defenders win!'])), detail: K.L(['공약 ', 'Bid ']) + s.hi.n + SN[s.trump] + ' · ' + K.L(['주공 팀 점수 ', 'Declarer team points ']) + s.res.sc + ' · ' + w.map(K.name).join(', ') };
    }
  };
  window.CKGame = G;
})();
