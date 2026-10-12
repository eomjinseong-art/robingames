/* 럼미·훌라 공용 규칙 엔진. window.RUMMY(opt) → CardKit 게임 객체. */
(function () {
  var RK = 'A 2 3 4 5 6 7 8 9 10 J Q K'.split(' '), SO = { S: 0, H: 1, D: 2, C: 3 };
  function r(c) { return RK.indexOf(c.slice(0, -1)) + 1; }
  function su(c) { return c.slice(-1); }
  function val(c) { return Math.min(10, r(c)); }
  function sortH(h) { h.sort(function (a, b) { return SO[su(a)] - SO[su(b)] || r(a) - r(b); }); return h; }
  function isSet(cs) { return cs.length >= 2 && cs.length <= 4 && cs.every(function (c) { return r(c) === r(cs[0]); }) && new Set(cs.map(su)).size === cs.length; }
  function isRun(cs) { if (cs.length < 2 || !cs.every(function (c) { return su(c) === su(cs[0]); })) return false; var v = cs.map(r).sort(function (a, b) { return a - b; }); for (var i = 1; i < v.length; i++) if (v[i] !== v[i - 1] + 1) return false; return true; }
  function valid(cs, seven) { return (cs.length >= 3 && (isSet(cs) || isRun(cs))) || (seven && cs.length === 1 && r(cs[0]) === 7) || (seven && cs.length === 2 && cs.some(function (c) { return r(c) === 7; }) && (isSet(cs) || isRun(cs))); }
  function findMelds(h, seven) {
    var used = {}, out = [];
    ['S', 'H', 'D', 'C'].forEach(function (s) {
      var idx = h.map(function (c, i) { return i; }).filter(function (i) { return su(h[i]) === s; }).sort(function (a, b) { return r(h[a]) - r(h[b]); }), run = [];
      idx.concat([-1]).forEach(function (i) {
        if (i >= 0 && run.length && r(h[i]) === r(h[run[run.length - 1]]) + 1) run.push(i);
        else { if (run.length >= 3) { out.push(run); run.forEach(function (j) { used[j] = 1; }); } run = i >= 0 ? [i] : []; }
      });
    });
    for (var v = 1; v <= 13; v++) { var g = h.map(function (c, i) { return i; }).filter(function (i) { return !used[i] && r(h[i]) === v; }); if (g.length >= 3) { out.push(g); g.forEach(function (j) { used[j] = 1; }); } }
    if (seven) h.forEach(function (c, i) { if (!used[i] && r(c) === 7) { out.push([i]); used[i] = 1; } });
    return out;
  }
  function canAtt(m, c, seven) { var cs = m.concat([c]); return valid(cs, seven) && cs.length >= 2; }
  window.RUMMY = function (o) {
    function pts(h) { return h.reduce(function (a, c) { return a + val(c); }, 0); }
    function finish(s, w) { s.win = w; s.res = s.hands.map(pts); }
    var G = {
      id: o.id, emoji: o.emoji, title: o.title, minP: 2, maxP: 4, bgm: o.bgm, rules: o.rules,
      init: function (n, lv, K) {
        var d = K.deck(), s = { n: n, hands: [], melds: [], stock: d, disc: [], turn: 0, phase: 'draw', win: -1, laid: [], moves: 0 };
        var per = o.deal(n);
        for (var i = 0; i < n; i++) { s.hands.push(sortH(d.splice(0, per))); s.laid.push(false); }
        s.disc.push(d.pop()); return s;
      },
      view: function (s, me, K, fin) {
        var my = me >= 0 && s.turn === me, sel = K.sel(), top = s.disc[s.disc.length - 1];
        var h = '<div class="ck-seats">';
        for (var p = 0; p < s.n; p++) if (p !== me) h += '<div class="ck-seat' + (s.turn === p ? ' turn' : '') + '"><h4><span>' + K.esc(K.name(p)) + '</span><span>' + (fin ? '' : s.hands[p].length + K.t('cards')) + '</span></h4>' + (fin ? '<div class="ck-row">' + s.hands[p].map(function (c) { return K.card(c, { small: 1 }); }).join('') + '</div>' : '') + '</div>';
        h += '</div><div class="ck-center">' + K.card('XX', my && s.phase === 'draw' ? { act: 'draw' } : {}) + '<div class="ck-lbl">' + K.L(['더미', 'Stock']) + '<br>' + s.stock.length + '</div>' + (top ? K.card(top, my && s.phase === 'draw' ? { act: 'take' } : {}) : '') + '<div class="ck-lbl">' + K.L(['버린 카드', 'Discard']) + '</div></div>';
        h += '<div class="ck-row">' + (s.melds.length ? s.melds.map(function (m, i) { var tap = my && s.phase === 'main' && sel.length === 1 && canAtt(m, s.hands[me][sel[0]], o.seven); return '<div class="ck-meld' + (tap ? ' tap' : '') + '"' + (tap ? ' data-a="att:' + i + '"' : '') + '>' + m.map(function (c) { return K.card(c, { small: 1 }); }).join('') + '</div>'; }).join('') : '<span class="ck-lbl">' + K.L(['바닥에 내려놓은 묶음이 여기에 보여요', 'Melds on the table appear here']) + '</span>') + '</div>';
        if (me < 0) return h;
        h += '<div class="ck-seat' + (my ? ' turn' : '') + '"><h4><span>' + K.esc(K.name(me)) + ' 👈</span><span>' + s.hands[me].length + K.t('cards') + ' · ' + pts(s.hands[me]) + K.L(['점', 'pts']) + '</span></h4>';
        if (my && s.phase === 'draw') h += '<div class="ck-acts"><button data-a="draw">🂠 ' + K.L(['더미에서 1장', 'Draw stock']) + '</button><button class="alt" data-a="take">' + K.L(['버린 카드 가져오기', 'Take discard']) + '</button></div>';
        if (my && s.phase === 'main') {
          var cs = sel.map(function (i) { return s.hands[me][i]; });
          h += '<div class="ck-acts"><button data-a="meld"' + (valid(cs, o.seven) ? '' : ' disabled') + '>⬇️ ' + K.L(['내려놓기', 'Meld']) + '</button><button class="red" data-a="disc"' + (sel.length === 1 ? '' : ' disabled') + '>🗑 ' + K.L(['버리고 끝', 'Discard']) + '</button></div><div class="ck-lbl">' + K.L(['같은 숫자 3장↑ 또는 같은 무늬 연속 3장↑' + (o.seven ? ' (7은 1장도 OK)' : '') + ' · 1장 고르고 바닥 묶음 탭 = 붙이기', '3+ of a rank or 3+ in a suit run' + (o.seven ? ' (a 7 may go alone)' : '') + ' · pick 1 card then tap a meld to lay off']) + '</div>';
        }
        h += '<div class="ck-hand tight">' + s.hands[me].map(function (c, i) { return K.card(c, my && s.phase === 'main' ? { act: 'sel:' + i, sel: sel.indexOf(i) >= 0 } : {}); }).join('') + '</div></div>';
        return h;
      },
      act: function (s, p, a, K) {
        if (p !== s.turn) return false;
        var h = s.hands[p], m;
        if (s.phase === 'draw') {
          if (a === 'draw') {
            if (!s.stock.length) { var top = s.disc.pop(); s.stock = K.shuffle(s.disc); s.disc = [top]; }
            if (!s.stock.length) { finish(s, -2); return; }
            h.push(s.stock.pop()); K.say(K.name(p) + K.L([' 더미에서 1장', ' draws']));
          } else if (a === 'take' && s.disc.length) { h.push(s.disc.pop()); K.say(K.name(p) + K.L([' 버린 카드를 가져감', ' takes the discard'])); }
          else return false;
          sortH(h); s.phase = 'main'; return;
        }
        var idx = null;
        if (a === 'meld') idx = K.sel().slice(); else if ((m = /^meld:([\d,]+)$/.exec(a))) idx = m[1].split(',').map(Number);
        if (idx) {
          var cs = idx.map(function (i) { return h[i]; }); if (!valid(cs, o.seven)) return false;
          idx.sort(function (x, y) { return y - x; }).forEach(function (i) { h.splice(i, 1); });
          s.melds.push(sortH(cs)); s.laid[p] = true; K.say(K.name(p) + ' ⬇️ ' + cs.length + K.t('cards'));
          if (!h.length) finish(s, p); return;
        }
        if ((m = /^att:(\d+)(?::(\d+))?$/.exec(a))) {
          var ci = m[2] != null ? +m[2] : K.sel()[0], md = s.melds[+m[1]]; if (ci == null || !md || !h[ci] || !canAtt(md, h[ci], o.seven)) return false;
          md.push(h.splice(ci, 1)[0]); sortH(md); K.say(K.name(p) + K.L([' 붙이기', ' lays off']));
          if (!h.length) finish(s, p); return;
        }
        var di = a === 'disc' ? (K.sel().length === 1 ? K.sel()[0] : null) : (m = /^disc:(\d+)$/.exec(a)) ? +m[1] : null;
        if (di == null || !h[di]) return false;
        s.disc.push(h.splice(di, 1)[0]); s.moves++;
        if (!h.length) { finish(s, p); return; }
        if (s.moves > 60 * s.n) { finish(s, -2); return; }
        s.phase = 'draw'; s.turn = (p + 1) % s.n;
      },
      ai: function (s, p, lv) {
        var h = s.hands[p], top = s.disc[s.disc.length - 1];
        function inMeld(hh) { return findMelds(hh, o.seven).reduce(function (a, m) { return a + m.length; }, 0); }
        if (s.phase === 'draw') {
          if (lv !== 'easy' && top && (inMeld(h.concat([top])) > inMeld(h) || s.melds.some(function (m) { return canAtt(m, top, o.seven); }))) return 'take';
          return 'draw';
        }
        var ms = findMelds(h, o.seven);
        if (ms.length && (lv !== 'easy' || Math.random() < 0.6)) return 'meld:' + ms[0].join(',');
        for (var mi = 0; mi < s.melds.length; mi++) for (var i = 0; i < h.length; i++) if (canAtt(s.melds[mi], h[i], o.seven) && (h.length > 1 || true)) return 'att:' + mi + ':' + i;
        if (lv === 'easy') return 'disc:' + Math.floor(Math.random() * h.length);
        var best = 0, bv = -99;
        h.forEach(function (c, i) {
          var near = h.some(function (d, j) { return j !== i && (r(d) === r(c) || (su(d) === su(c) && Math.abs(r(d) - r(c)) <= (lv === 'hard' ? 2 : 1))); });
          var v = val(c) - (near ? 12 : 0) - (o.seven && r(c) === 7 ? 20 : 0);
          if (v > bv) { bv = v; best = i; }
        });
        return 'disc:' + best;
      },
      over: function (s, K) {
        if (s.win === -1) return null;
        var w = s.win;
        if (w === -2) { var mn = Math.min.apply(null, s.res), ws = []; s.res.forEach(function (v, i) { if (v === mn) ws.push(i); }); return { winners: ws, detail: K.L(['더미가 다 떨어져 남은 점수가 가장 적은 사람 승리 · ', 'Stock ran out — lowest hand wins · ']) + s.res.map(function (v, i) { return K.name(i) + ' ' + v; }).join(' · ') }; }
        var sum = 0; s.res.forEach(function (v, i) { if (i !== w) sum += v; });
        return { winners: [w], detail: K.name(w) + K.L([' 손패를 모두 털었어요! 다른 사람 남은 카드 ', ' went out! Others\' leftover cards ']) + sum + K.L(['점을 얻어요', ' points scored']) };
      }
    };
    return G;
  };
  window.RUMMY.valid = valid; window.RUMMY.findMelds = findMelds;
})();
