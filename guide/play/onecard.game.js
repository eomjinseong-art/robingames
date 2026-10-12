/* 원카드 (한국식, 단순화): 7장씩. 무늬나 숫자 맞춰 내기. 공격 2=2장 A=3장 흑백조커=5장 컬러조커=7장(같거나 센 공격 카드로 막기, 장수 쌓임).
 * J 건너뛰기, Q 방향 바꾸기, K 한 번 더, 7 무늬 바꾸기. 낼 게 없으면 1장 먹기. 20장 이상이면 파산. 먼저 다 내면 승리. */
(function () {
  var ATK = { '2': [1, 2], 'A': [2, 3], 'JKB': [3, 5], 'JKC': [4, 7] }, ORD = 'A 2 3 4 5 6 7 8 9 10 J Q K'.split(' ');
  function rk(c) { return c === 'JKB' || c === 'JKC' ? c : c.slice(0, -1); }
  function su(c) { return c.length === 3 && c.indexOf('JK') === 0 ? '' : c.slice(-1); }
  function atk(c) { return ATK[rk(c)]; }
  function sortH(h) { h.sort(function (a, b) { var sa = 'SHDC'.indexOf(su(a)), sb = 'SHDC'.indexOf(su(b)); return sa - sb || ORD.indexOf(rk(a)) - ORD.indexOf(rk(b)); }); }
  function top(s) { return s.disc[s.disc.length - 1]; }
  function legal(s, c) {
    var t = top(s);
    if (s.attack > 0) return !!atk(c) && atk(c)[0] >= atk(t)[0];
    if (rk(c) === 'JKB' || rk(c) === 'JKC' || t.indexOf('JK') === 0) return true;
    return su(c) === s.suit || rk(c) === rk(t);
  }
  function draw1(s, K) {
    if (!s.draw.length) { var t = s.disc.pop(); s.draw = K.shuffle(s.disc); s.disc = [t]; }
    return s.draw.pop();
  }
  function nextP(s, from, k) { var p = from; for (var i = 0; i < k; i++) { do { p = (p + s.dir + s.n) % s.n; } while (s.out[p]); } return p; }
  function alive(s) { var r = []; for (var i = 0; i < s.n; i++) if (!s.out[i]) r.push(i); return r; }
  var G = {
    id: 'onecard', emoji: '☝️', title: ['원카드', 'One Card'], minP: 2, maxP: 4,
    bgm: [72, 74, 76, 79, 76, 74, 72, 0, 77, 76, 74, 72, 74, 76, 72, 0],
    rules: ['바닥 카드와 무늬나 숫자가 같은 카드를 1장 내요. 낼 게 없으면 더미에서 1장. 공격: 2=2장, A=3장, 흑백 조커=5장, 컬러 조커=7장 (같거나 더 센 공격 카드로 막으면 장수가 쌓여 넘어가요). J=건너뛰기, Q=방향 바꾸기, K=한 번 더, 7=무늬 바꾸기. 조커는 아무 때나, 조커 다음엔 아무 카드나. 손패 20장이면 파산! 가장 먼저 다 내면 승리.',
      'Play one card matching the top card\'s suit or rank. Can\'t? Draw 1. Attacks: 2 = draw 2, A = 3, black Joker = 5, color Joker = 7 (block with an equal or stronger attack card and the total stacks). J = skip, Q = reverse, K = go again, 7 = change suit. Jokers go anytime; anything goes on a Joker. 20 cards = bust! First to empty their hand wins.'],
    init: function (n, lv, K) {
      var s = { n: n, draw: K.deck({ jokers: true }), hands: [], out: [], dir: 1, attack: 0, turn: 0, pick: -1, win: -1 };
      for (var i = 0; i < n; i++) { s.hands.push(s.draw.splice(0, 7)); sortH(s.hands[i]); s.out.push(false); }
      var c; do { c = s.draw.pop(); if (/^(3|4|5|6|8|9|10)[SHDC]$/.test(c)) break; s.draw.unshift(c); } while (true);
      s.disc = [c]; s.suit = su(c); return s;
    },
    view: function (s, me, K, fin) {
      var h = '';
      for (var p = 0; p < s.n; p++) if (p !== me) {
        var m = s.hands[p].length, backs = '';
        for (var i = 0; i < m; i++) backs += fin ? K.card(s.hands[p][i], { small: 1 }) : (i < 10 ? K.card('XX', { small: 1 }) : '');
        h += '<div class="ck-seat' + (s.turn === p ? ' turn' : '') + (s.out[p] ? ' out' : '') + '"><h4><span>' + K.esc(K.name(p)) + '</span><span>' + (s.out[p] ? K.L(['파산', 'bust']) : m + K.t('cards') + (m === 1 ? ' ☝️' : '')) + '</span></h4><div class="ck-row">' + backs + '</div></div>';
      }
      var t = top(s), my = me >= 0 && s.turn === me;
      h += '<div class="ck-center"><div>' + K.card('XX', my && s.pick < 0 ? { act: 'd' } : {}) + '<div class="ck-lbl">' + K.L(['더미', 'Deck']) + ' ' + s.draw.length + '</div></div>' +
        '<div>' + K.card(t, {}) + '<div class="ck-lbl">' + K.L(['무늬', 'Suit']) + ' <b style="font-size:20px">' + (t.indexOf('JK') === 0 && !s.attack ? '★' : K.SYM[s.suit]) + '</b></div></div>' +
        (s.attack ? '<div class="ck-pill" style="font-size:20px;color:#ff8">💥 +' + s.attack + '</div>' : '') + '</div>';
      if (me < 0) return h;
      h += '<div class="ck-seat' + (my ? ' turn' : '') + '"><h4><span>' + K.esc(K.name(me)) + ' 👈</span><span>' + s.hands[me].length + K.t('cards') + '</span></h4>';
      if (my && s.pick >= 0) {
        h += '<div class="ck-msg">' + K.L(['7! 바꿀 무늬를 골라요', '7! Pick the new suit']) + '</div><div class="ck-acts">' + ['S', 'H', 'D', 'C'].map(function (x) { return '<button data-a="p:' + s.pick + ':' + x + '" style="font-size:30px;' + (x === 'H' || x === 'D' ? 'color:#d0112b' : '') + '">' + K.SYM[x] + '</button>'; }).join('') + '</div>';
      }
      h += '<div class="ck-hand">' + s.hands[me].map(function (c, i) { var ok = my && legal(s, c); return K.card(c, ok ? { act: 'p:' + i, sel: s.pick === i } : { dim: my }); }).join('') + '</div>';
      if (my && s.pick < 0) h += '<div class="ck-acts"><button class="alt" data-a="d">' + (s.attack ? K.L(['💥 ' + s.attack + '장 먹기', '💥 Take ' + s.attack]) : K.L(['🂠 1장 먹기', '🂠 Draw 1'])) + '</button></div>';
      return h + '</div>';
    },
    act: function (s, p, a, K) {
      if (p !== s.turn) return false;
      var hand = s.hands[p];
      if (a === 'd') {
        var k = s.attack || 1; for (var i = 0; i < k; i++) { var c = draw1(s, K); if (c) hand.push(c); }
        K.say(K.name(p) + ' ' + K.L([k + '장 먹었어요', 'drew ' + k]));
        s.attack = 0; sortH(hand); s.pick = -1;
        if (hand.length >= 20) { s.out[p] = true; K.say(K.name(p) + ' ' + K.L(['파산! 💸', 'is bust!'])); var al = alive(s); if (al.length === 1) { s.win = al[0]; return; } }
        s.turn = nextP(s, p, 1); return;
      }
      var m = /^p:(\d+)(?::([SHDC]))?$/.exec(a); if (!m) return false;
      var idx = +m[1], card = hand[idx]; if (!card || !legal(s, card)) return false;
      if (rk(card) === '7' && !m[2]) { s.pick = idx; return; }
      hand.splice(idx, 1); s.disc.push(card); s.pick = -1; s.suit = su(card) || s.suit;
      if (m[2]) s.suit = m[2];
      if (!hand.length) { s.win = p; return; }
      var r = rk(card), say = K.name(p) + ': ' + (r.indexOf('JK') === 0 ? 'JOKER' : r + K.SYM[su(card)]);
      if (hand.length === 1) say += ' · ' + K.L(['원카드! ☝️', 'One card! ☝️']);
      var st = 1;
      if (atk(card)) s.attack += atk(card)[1];
      if (r === 'J') st = 2;
      if (r === 'Q') s.dir = -s.dir;
      if (r === 'K') st = 0;
      if (r === '7') say += ' → ' + K.SYM[s.suit];
      K.say(say);
      s.turn = st ? nextP(s, p, st) : p;
    },
    ai: function (s, p, lv, K) {
      var hand = s.hands[p], opts = [];
      hand.forEach(function (c, i) { if (legal(s, c)) opts.push(i); });
      if (!opts.length) return 'd';
      var cnt = { S: 0, H: 0, D: 0, C: 0 }; hand.forEach(function (c) { if (su(c)) cnt[su(c)]++; });
      var nx = s.hands[nextP(s, p, 1)].length, i;
      if (lv === 'easy') i = opts[Math.floor(Math.random() * opts.length)];
      else {
        var sc = function (j) {
          var c = hand[j], r = rk(c), v = 0;
          if (r.indexOf('JK') === 0) v -= 5; // 조커는 아껴 두기
          if (atk(c)) v += lv === 'hard' && nx <= 3 ? 6 : 1;
          if (r === 'K' || r === 'J') v += 2;
          if (r === '7') v -= 2;
          if (su(c)) v += cnt[su(c)] * (lv === 'hard' ? 1 : 0.3);
          return v;
        };
        opts.sort(function (x, y) { return sc(y) - sc(x); }); i = opts[0];
      }
      var a = 'p:' + i;
      if (rk(hand[i]) === '7') { var best = 'S'; for (var k in cnt) if (cnt[k] > cnt[best]) best = k; a += ':' + best; }
      return a;
    },
    over: function (s, K) { return s.win >= 0 ? { winners: [s.win] } : null; }
  };
  window.CKGame = G;
})();
