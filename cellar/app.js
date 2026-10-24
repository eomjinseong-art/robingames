(function () {
  'use strict';
  var C = window.CD, A = window.AUD || null, KEY = 'nadooCellar1';
  var S = { lang: 'ko', done: {}, quiz: 0, cart: [], age: 0, all: false };
  try { var sv = JSON.parse(localStorage.getItem(KEY) || 'null'); if (sv) for (var k in sv) S[k] = sv[k]; } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  var app = document.getElementById('app');
  function L(a, b) { return S.lang === 'en' ? (b != null ? b : a) : a; }
  function T(p) { return Array.isArray(p) ? L(p[0], p[1]) : p; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function snd(n) { try { if (A && A[n]) A[n](); } catch (e) {} }
  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function btn(cls, html, fn) { var b = h('button', 'btn ' + cls, html); b.type = 'button'; b.onclick = function () { snd('tap'); fn(); }; return b; }
  function toast(m) { var t = document.getElementById('toast'); t.textContent = m; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(function () { t.hidden = true; }, 2200); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
  function count(o) { return Object.keys(o).length; }
  function fanfare(ic, big, sub) {
    var f = document.getElementById('fanfare'); snd('fanfare'); f.innerHTML = '';
    var c = h('div', 'fan-card', '<div class="fan-ic">' + ic + '</div><div class="fan-big">' + esc(big) + '</div><p class="muted">' + esc(sub || '') + '</p>');
    c.appendChild(btn('primary wide', L('계속하기 ▶', 'Continue ▶'), function () { f.hidden = true; })); f.appendChild(c); f.hidden = false;
  }
  function rankName() { var s = count(S.done) + S.quiz; return s >= 14 ? L('마스터 소믈리에 & 디스틸러', 'Master Sommelier & Distiller') : s >= 8 ? L('소믈리에', 'Sommelier') : s >= 3 ? L('셀러 마스터 견습', 'Cellar apprentice') : L('첫 잔 손님', 'First-sip guest'); }
  function header() {
    document.getElementById('brand').textContent = L('🍷 나두 와이너리 & 증류소', '🍷 Nadoo Wine & Whisky Cellar');
    document.getElementById('langBtn').textContent = S.lang === 'ko' ? 'EN' : '한';
    document.getElementById('homeLink').textContent = L('🏠 홈', '🏠 Home');
    document.getElementById('unlockBtn').textContent = '🛒 ' + S.cart.length;
    document.getElementById('rankChip').innerHTML = '<span class="rk">' + esc(rankName()) + '</span><span>' + (count(S.done) + S.quiz) + ' pt</span>';
    document.documentElement.lang = S.lang;
  }
  var cur = home;
  function go(fn) { cur = fn; header(); app.innerHTML = ''; window.scrollTo(0, 0); fn(); }
  function sub(title, back) { var d = h('div', 'subhead'); d.appendChild(btn('ghost small', L('◀ 뒤로', '◀ Back'), function () { go(back || home); })); d.appendChild(h('h2', '', esc(title))); app.appendChild(d); }
  function mentor(html, ic) { app.appendChild(h('div', 'mentor', '<span class="mt-i">' + (ic || '🧑‍🍳') + '</span><p>' + html + '</p>')); }
  function mark(id) { var f = !S.done[id]; S.done[id] = 1; save(); header(); return f; }
  function cpLink(txt) { return '<a class="cp" href="' + C.CP + '" target="_blank" rel="sponsored noopener">' + esc(txt) + '</a>'; }
  function disclosure() { return '<p class="disc">' + L('이 링크는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다. 쿠팡 링크는 잔·오프너·디캔터 등 용품용이며, <b>주류는 매장에서 구입하세요</b> (온라인 주류 판매 제한 · 19세 이상).', 'As a Coupang Partners affiliate we may earn a commission. Coupang links are for glassware and accessories — <b>buy alcohol in stores</b> (19+).') + '</p>'; }
  function home() {
    app.appendChild(h('div', 'hero', '<div class="neon">' + L('나두 와이너리 & 위스키 증류소', 'Nadoo Wine & Whisky Cellar') + '</div><p class="tagline">' + L('포도 수확부터 오크통 숙성, 피트 연기부터 셰리 캐스크까지 — 직접 만들어 보고 자리에서 "아는 척" 한 줄까지 챙기는 성인용 주류 아카데미', 'From harvest to oak, peat smoke to sherry casks — make it yourself and pick up a one-liner to impress.') + '</p></div>'));
    if (!count(S.done)) mentor(L('처음이면 <b>반짝이는 🍷 와이너리 코스</b>부터! 첫 단계는 정답이 반짝이는 <b>따라 하기</b>예요.', 'Start with the <b>glowing 🍷 Winery course</b>; the first step glows as a follow-along.'));
    var tl = h('div', 'tiles');
    [['🍷', L('와이너리 코스', 'Winery course'), L('수확→파쇄→발효 4방식→숙성 · 8대 품종', 'Harvest → ferment → age · 8 grapes'), wine, !count(S.done)],
     ['🥃', L('위스키 증류소 코스', 'Distillery course'), L('몰팅·피트→증류기→캐스크·연수', 'Malting, peat → stills → casks'), whisky],
     ['🍾', L('인기 와인 & 위스키', 'Popular bottles'), L(C.wines.length + C.whiskies.length + '병 · 라벨·궁합·아는 척 멘트', 'labels, pairings, one-liners'), bottles],
     ['🎩', L('손님 추천 모드', 'Guest recommender'), L('소믈리에·디스틸러로 손님에게 한 병', 'Pick the right bottle'), guests],
     ['🔍', L('라벨 해독기', 'Label decoder'), L('Brut·Grand Cru·Cask Strength…', 'Brut, Grand Cru, Cask Strength…'), labels],
     ['⚡', L('퀴즈', 'Quiz'), L('8문제 · 최고 ', '8 Qs · best ') + S.quiz + '/8', quiz],
     ['🛒', L('살 것 목록', 'Shopping list'), S.cart.length + L('개 담김', ' items'), cart]].forEach(function (t, i) {
      var b = h('button', 'tile' + (t[4] ? ' glow' : '') + (i === 6 ? ' wide' : ''), '<span class="ti">' + t[0] + '</span><span class="tt">' + t[1] + '</span><span class="td">' + t[2] + '</span>');
      b.type = 'button'; b.onclick = function () { snd('wrench'); go(t[3]); }; tl.appendChild(b);
    });
    app.appendChild(tl);
    app.appendChild(h('div', 'safety-banner', L('🔞 만 19세 이상 성인용 교육 콘텐츠입니다. 지나친 음주는 뇌졸중·기억력 손상이나 치매를 유발합니다. 임신 중 음주는 기형아 출생 위험을 높입니다. 음주운전은 절대 금지!', '🔞 For adults 19+. Drink responsibly; never drink and drive.')));
  }
  function stations(list, box, guided, done) {
    var i = 0;
    function show() {
      if (i >= list.length) return done();
      var st = list[i]; box.innerHTML = '';
      var card = h('div', 'lcard', '<div class="lab">STEP ' + (i + 1) + '/' + list.length + '</div><h3>' + st.ic + ' ' + esc(T(st.t)) + '</h3><p>' + esc(T(st.q)) + '</p>');
      var grid = h('div', 'optgrid'), fb = h('div'), g1 = guided && i === 0;
      (g1 ? st.o.filter(function (o) { return o[2]; }).concat(st.o.filter(function (o) { return !o[2]; }).slice(0, 1)) : shuffle(st.o)).forEach(function (o) {
        var b = h('button', 'opt' + (g1 && o[2] ? ' glow' : ''), '<b>' + esc(L(o[0], o[1])) + '</b>'); b.type = 'button'; b.dataset.ok = o[2];
        b.onclick = function () {
          if (o[2]) { snd('good'); b.className = 'opt done'; grid.querySelectorAll('button').forEach(function (x) { x.disabled = true; }); fb.innerHTML = '<div class="fb ok">✅ ' + esc(L(o[3], o[4])) + '</div>'; fb.appendChild(btn('primary wide', L('다음 ▶', 'Next ▶'), function () { i++; show(); })); }
          else { snd('bad'); b.className = 'opt off'; fb.innerHTML = '<div class="fb bad">❌ ' + esc(L(o[3], o[4])) + '</div>'; }
        };
        grid.appendChild(b);
      });
      card.appendChild(grid); card.appendChild(btn('ghost small', L('💡 힌트', '💡 Hint'), function () { grid.querySelector('[data-ok="1"]').classList.add('glow'); })); card.appendChild(fb); box.appendChild(card);
    }
    show();
  }
  function glass(color, level) { return '<svg viewBox="0 0 120 150" width="120" height="150" aria-hidden="true"><path d="M25 10 H95 Q95 80 60 90 Q25 80 25 10Z" fill="none" stroke="#f4c27a" stroke-width="3"/><path d="M' + (25 + level * 0.1) + ' ' + (80 - level) + ' H' + (95 - level * 0.1) + ' Q92 80 60 88 Q28 80 ' + (25 + level * 0.1) + ' ' + (80 - level) + 'Z" fill="' + color + '"/><line x1="60" y1="90" x2="60" y2="135" stroke="#f4c27a" stroke-width="3"/><line x1="38" y1="138" x2="82" y2="138" stroke="#f4c27a" stroke-width="4"/></svg>'; }
  function wine() {
    sub(L('🍷 와이너리 코스', '🍷 Winery course'));
    var box = h('div'); app.appendChild(box);
    stations(C.wineSteps, box, !count(S.done), function () { styleLab(box); });
  }
  function styleLab(box) {
    box.innerHTML = ''; var done = {}, col = { red: '#7b1e2b', white: '#f1e3a0', rose: '#f2a2b5', champ: '#f6e7a8' };
    var card = h('div', 'lcard', '<div class="lab">' + L('발효 실습', 'Fermentation lab') + '</div><h3>' + L('🧪 같은 포도즙, 4가지 와인 만들기', '🧪 One must, four wines') + '</h3><p>' + L('목표 와인을 고르고 맞는 발효 방식을 선택하세요.', 'Pick a target wine and the right method.') + '</p>');
    var area = h('div'); card.appendChild(area); box.appendChild(card);
    function pick() {
      area.innerHTML = '';
      var todo = C.styles.filter(function (s) { return !done[s.id]; });
      if (!todo.length) return agingLab(box, 'wine');
      var s = todo[0];
      area.appendChild(h('div', 'row wrap', C.styles.map(function (x) { return '<span class="badge ' + (done[x.id] ? 'ok' : x === s ? 'warn' : '') + '">' + x.ic + ' ' + esc(T(x.t)) + '</span>'; }).join(' ')));
      area.appendChild(h('p', '', '<b>' + L('목표: ', 'Target: ') + s.ic + ' ' + esc(T(s.t)) + '</b>'));
      var grid = h('div', 'optgrid'), fb = h('div');
      C.methods.forEach(function (m) {
        var b = h('button', 'opt', '<b>' + m[1] + ' ' + esc(T(m[2])) + '</b><span>' + esc(T(m[3])) + '</span>'); b.type = 'button'; b.dataset.ok = m[0] === s.ok ? 1 : 0;
        b.onclick = function () {
          if (m[0] === s.ok) { snd('pour'); done[s.id] = 1; fb.innerHTML = '<div class="fb ok">' + glass(col[s.id], 40) + '<br>✅ ' + esc(T(s.why)) + '</div>'; grid.querySelectorAll('button').forEach(function (x) { x.disabled = true; }); fb.appendChild(btn('primary wide', L('다음 ▶', 'Next ▶'), pick)); }
          else { snd('bad'); b.className = 'opt off'; fb.innerHTML = '<div class="fb bad">❌ ' + esc(L('그 방식으론 ' + T(s.t) + '이(가) 안 돼요. 색·기포가 어디서 오는지 생각해 보세요!', 'That will not make ' + T(s.t) + '. Where do color and bubbles come from?')) + '</div>'; }
        };
        grid.appendChild(b);
      });
      area.appendChild(grid); area.appendChild(btn('ghost small', L('💡 힌트', '💡 Hint'), function () { grid.querySelector('[data-ok="1"]').classList.add('glow'); })); area.appendChild(fb);
    }
    pick();
  }
  function agingLab(box, kind) {
    box.innerHTML = ''; var wineK = kind === 'wine', opts = wineK ? C.aging.wine : C.casks, sel = opts[0][0];
    var card = h('div', 'lcard', '<div class="lab">' + L('숙성 실습', 'Aging lab') + '</div><h3>' + (wineK ? L('🛢️ 스테인리스 vs 오크통', '🛢️ Steel vs oak') : L('🛢️ 버번 캐스크 vs 셰리 캐스크 + 숙성 연수', '🛢️ Bourbon vs sherry cask + age')) + '</h3>');
    var row = h('div', 'row'), out = h('div', 'fb info'), lab = h('label', '', (wineK ? L('숙성 개월', 'Months') : L('숙성 연수', 'Years')) + ' <input type="range" min="' + (wineK ? 0 : 3) + '" max="' + (wineK ? 24 : 25) + '" value="' + (wineK ? 12 : 12) + '"> <span></span>');
    var ctl = h('div', 'sim-controls'); ctl.appendChild(lab);
    opts.forEach(function (o) { row.appendChild(btn('cyan', o[1] + ' ' + esc(T(o[2])), function () { sel = o[0]; upd(); snd('pour'); })); });
    card.appendChild(row); card.appendChild(ctl); card.appendChild(out); box.appendChild(card);
    var rg = lab.querySelector('input'); rg.oninput = upd;
    function upd() {
      var v = +rg.value, o = opts.filter(function (x) { return x[0] === sel; })[0], c;
      lab.querySelector('span').textContent = v + (wineK ? L('개월', ' mo') : L('년', ' yrs'));
      if (wineK) { c = sel === 'oak' ? 'hsl(45,70%,' + (80 - v) + '%)' : '#f3eaa6'; }
      else { var d = Math.min(1, v / 25); c = sel === 'sherry' ? 'hsl(' + (28 - d * 12) + ',75%,' + (55 - d * 28) + '%)' : 'hsl(' + (44 - d * 10) + ',80%,' + (68 - d * 22) + '%)'; }
      var extra = wineK ? '' : '<br>👼 ' + L('엔젤스 쉐어: 매년 약 2% 증발 → 남은 양 ', 'Angel\'s share ~2%/yr → remaining ') + Math.round(Math.pow(0.98, v) * 100) + '%' + (v >= 18 ? L(' · 18년: 깊고 복합적, 비싸지는 이유!', ' · 18 yrs: deep and pricey!') : v >= 12 ? L(' · 12년: 대표적인 입문 숙성', ' · 12 yrs: classic') : L(' · 짧은 숙성: 거칠고 곡물 향', ' · young: grainy'));
      out.innerHTML = '<div style="display:flex;gap:12px;align-items:center">' + glass(c, 45) + '<div><b>' + o[1] + ' ' + esc(T(o[2])) + '</b><br>' + esc(T(o[3])) + extra + '</div></div>';
    }
    upd();
    card.appendChild(btn('primary wide', L('코스 완료 🏁', 'Finish course 🏁'), function () { finishCourse(kind); }));
  }
  function finishCourse(kind) {
    var f = mark(kind); go(function () { sub(kind === 'wine' ? L('🍇 8대 품종', '🍇 8 key grapes') : L('🥃 시중 대표 위스키', '🥃 Popular whiskies'));
      if (kind === 'wine') { var g = h('div', 'dexgrid'); C.grapes.forEach(function (x) { g.appendChild(h('div', 'dexcard', '<span class="ti">' + x[0] + '</span><b>' + esc(L(x[1], x[2])) + '</b><span class="badge">' + (x[3] === 'red' ? L('레드', 'Red') : L('화이트', 'White')) + '</span><span>' + esc(T(x[4])) + '</span><span class="muted">🍽️ ' + esc(T(x[5])) + '</span>')); }); app.appendChild(g); }
      else bottleList(C.whiskies);
      app.appendChild(btn('primary wide', L('🍾 인기 병 보러 가기', '🍾 See popular bottles'), function () { go(bottles); }));
    });
    if (f) fanfare(kind === 'wine' ? '🍷' : '🥃', L('코스 완료!', 'Course complete!'), kind === 'wine' ? L('와인 메이커 배지 획득', 'Winemaker badge') : L('디스틸러 배지 획득', 'Distiller badge'));
  }
  function whisky() {
    sub(L('🥃 위스키 증류소 코스', '🥃 Distillery course'));
    var box = h('div'); app.appendChild(box);
    stations(C.whiskySteps, box, !count(S.done), function () { stillLab(box); });
  }
  function stillLab(box) {
    box.innerHTML = '';
    var card = h('div', 'lcard', '<div class="lab">' + L('증류 실습', 'Distillation lab') + '</div><h3>' + L('⚗️ 싱글몰트 스카치를 만들려면 어떤 증류기?', '⚗️ Which still for single malt Scotch?') + '</h3><p class="muted">' + L('알코올(78℃)은 물(100℃)보다 먼저 끓어요 → 증기를 모아 식히면 도수가 올라가요.', 'Alcohol boils at 78 °C, before water → condense the vapor to concentrate it.') + '</p>');
    var t = '<table class="cmp-table"><tr><th></th><th>' + L('특징', 'Traits') + '</th></tr>' + C.stills.map(function (s) { return '<tr><td>' + s[1] + ' ' + esc(T(s[2])) + '</td><td>' + esc(T(s[3])) + '</td></tr>'; }).join('') + '</table>';
    card.appendChild(h('div', '', t)); var fb = h('div'), row = h('div', 'row');
    C.stills.forEach(function (s) { var b = btn('cyan', s[1] + ' ' + esc(T(s[2])), function () {
      if (s[0] === 'pot') { snd('good'); fb.innerHTML = '<div class="fb ok">✅ ' + L('정답! 스카치 싱글몰트는 구리 팟 스틸로 2회 증류해요. 구리가 황 냄새를 잡아줘요.', 'Right! Single malt Scotch is double-distilled in copper pot stills; copper strips sulfur.') + '</div>'; fb.appendChild(btn('primary wide', L('숙성하러 가기 ▶', 'To the casks ▶'), function () { agingLab(box, 'whisky'); })); }
      else { snd('bad'); fb.innerHTML = '<div class="fb bad">❌ ' + L('연속식은 가볍고 효율적이라 그레인·블렌디드·버번에 주로 써요.', 'Column stills are for grain, blends and bourbon.') + '</div>'; }
    }); row.appendChild(b); });
    card.appendChild(row); card.appendChild(fb); box.appendChild(card);
  }
  function bottleList(list) {
    var g = h('div', 'dexgrid');
    list.forEach(function (x) {
      var c = h('div', 'dexcard', '<span class="ti">' + x[0] + '</span><b>' + esc(L(x[1], x[2])) + '</b><span class="badge">' + esc(x[3]) + '</span><span class="muted">📍 ' + esc(x[4]) + '</span><span>👃 ' + esc(T(x[5])) + '</span><span>🍽️ ' + esc(T(x[6])) + '</span><span>💬 <b>' + L('아는 척 한 줄', 'One-liner') + '</b> ' + esc(T(x[7])) + '</span><span class="muted">🏷️ ' + esc(T(x[8])) + '</span>' + cpLink(L('🛒 어울리는 잔·용품 보기 (쿠팡)', '🛒 Matching glassware (Coupang)')) + '<span class="disc">' + L('주류는 매장에서 구입하세요', 'Buy alcohol in stores') + '</span>');
      var inCart = S.cart.indexOf(x[1]) >= 0;
      c.appendChild(btn('small' + (inCart ? ' ok' : ''), inCart ? L('✅ 살 것 목록에 있음', '✅ On list') : L('➕ 살 것 목록에 담기', '➕ Add to list'), function () { if (S.cart.indexOf(x[1]) < 0) { S.cart.push(x[1]); save(); header(); toast(L('살 것 목록에 담았어요', 'Added to list')); go(cur); } }));
      g.appendChild(c);
    });
    app.appendChild(g); app.appendChild(h('div', '', disclosure()));
  }
  var btab = 'w';
  function bottles() {
    sub(L('🍾 인기 와인 & 위스키', '🍾 Popular bottles'));
    var tabs = h('div', 'tabs');
    [['w', L('🍷 와인', '🍷 Wine')], ['k', L('🥃 위스키', '🥃 Whisky')]].forEach(function (t) { var b = h('button', 'tab' + (btab === t[0] ? ' on' : ''), t[1]); b.type = 'button'; b.onclick = function () { btab = t[0]; go(bottles); }; tabs.appendChild(b); });
    app.appendChild(tabs); bottleList(btab === 'w' ? C.wines : C.whiskies);
  }
  function guests() {
    sub(L('🎩 소믈리에 & 디스틸러 손님 추천', '🎩 Sommelier & distiller mode'));
    var i = 0, ok = 0, qs = shuffle(C.guests), box = h('div'); app.appendChild(box);
    function show() {
      box.innerHTML = '';
      if (i >= qs.length) { box.appendChild(h('div', 'lcard', '<h3>' + L('추천 성공 ', 'Great picks ') + ok + '/' + qs.length + '</h3>')); if (mark('guests')) fanfare('🎩', L('명 소믈리에!', 'Star sommelier!'), ok + '/' + qs.length); box.appendChild(btn('primary wide', L('다시', 'Again'), function () { go(guests); })); return; }
      var g = qs[i], list = g[2] === 'w' ? C.wines : C.whiskies, ans = list[g[3]], pool = shuffle(list.filter(function (x) { return x !== ans; })).slice(0, 2), opts = shuffle([ans].concat(pool)), done = false;
      var card = h('div', 'lcard', '<div class="lab">' + L('손님 ', 'Guest ') + (i + 1) + '/' + qs.length + '</div><h3>' + g[0] + ' ' + esc(T(g[1])) + '</h3>');
      var grid = h('div', 'optgrid'), fb = h('div');
      opts.forEach(function (x) { var b = h('button', 'opt', '<b>' + x[0] + ' ' + esc(L(x[1], x[2])) + '</b><span>' + esc(T(x[5])) + '</span>'); b.type = 'button';
        b.onclick = function () { if (done) return; var r = x === ans; if (r) { done = true; ok++; snd('pour'); b.className = 'opt done'; fb.innerHTML = '<div class="fb ok">✅ ' + esc(T(g[4])) + '<br>💬 ' + esc(T(ans[7])) + '</div>'; fb.appendChild(btn('primary wide', L('다음 손님 ▶', 'Next guest ▶'), function () { i++; show(); })); } else { snd('bad'); b.className = 'opt off'; fb.innerHTML = '<div class="fb bad">❌ ' + esc(L('손님 취향과 달라요: ', 'Not their taste: ') + T(x[5])) + '</div>'; } };
        grid.appendChild(b); });
      card.appendChild(grid); card.appendChild(fb); box.appendChild(card);
    }
    show();
  }
  function labels() {
    sub(L('🔍 라벨 해독기', '🔍 Label decoder'));
    app.appendChild(h('p', 'lead', L('라벨 속 단어를 눌러 뜻을 확인하세요.', 'Tap a label term to decode it.')));
    var lab = h('div', 'lcard'), out = h('div', 'fb info', L('👆 단어를 눌러 보세요', '👆 Tap a term')), seen = {};
    C.label.forEach(function (x) { var b = btn('small gold', esc(x[0]), function () { seen[x[0]] = 1; out.innerHTML = '<b>' + esc(x[0]) + '</b> — ' + esc(T(x[1])); if (count(seen) === C.label.length && mark('labels')) fanfare('🔍', L('라벨 박사!', 'Label expert!'), ''); }); b.style.margin = '4px'; lab.appendChild(b); });
    app.appendChild(lab); app.appendChild(out);
  }
  function quiz() {
    sub(L('⚡ 와인 & 위스키 퀴즈', '⚡ Wine & whisky quiz'));
    var i = 0, right = 0, qs = shuffle(C.quiz), box = h('div', 'qcard'); app.appendChild(box);
    function show() {
      if (i >= qs.length) { if (right > S.quiz) { S.quiz = right; save(); header(); } box.innerHTML = '<h3>' + L('결과 ', 'Score ') + right + '/' + qs.length + '</h3>'; box.appendChild(btn('primary wide', L('다시 풀기', 'Retry'), function () { go(quiz); })); if (right === qs.length) fanfare('🥇', L('만점!', 'Perfect!'), ''); return; }
      var q = qs[i], answered = false; box.innerHTML = '<div class="lab">Q' + (i + 1) + '/' + qs.length + '</div><h3>' + esc(L(q[0], q[1])) + '</h3>';
      var og = h('div', 'qopts'), fb = h('div'); box.appendChild(og); box.appendChild(fb);
      (S.lang === 'en' ? q[3] : q[2]).forEach(function (o, j) { var b = h('button', 'qopt', esc(o)); b.type = 'button';
        b.onclick = function () { if (answered) return; answered = true; var ok = j === q[4]; if (ok) right++; snd(ok ? 'good' : 'bad'); b.className = 'qopt ' + (ok ? 'right' : 'wrongc'); og.children[q[4]].className = 'qopt right'; fb.innerHTML = '<div class="fb ' + (ok ? 'ok' : 'bad') + '">' + (ok ? '✅ ' : '❌ ') + esc(T(q[5])) + '</div>'; fb.appendChild(btn('primary wide', L('다음 ▶', 'Next ▶'), function () { i++; show(); })); };
        og.appendChild(b); });
    }
    show();
  }
  function cart() {
    sub(L('🛒 살 것 목록', '🛒 Shopping list'));
    var c = h('div', 'lcard');
    c.innerHTML = S.cart.length ? '<h3>' + L('매장에서 찾을 병', 'Bottles to look for in store') + '</h3>' + S.cart.map(function (n) { return '<p>🍾 ' + esc(n) + '</p>'; }).join('') : '<p class="muted">' + L('아직 비어 있어요. 병 카드에서 ➕ 담기!', 'Empty — add from bottle cards.') + '</p>';
    c.innerHTML += '<h3 style="margin-top:12px">' + L('함께 준비하면 좋은 용품', 'Handy accessories') + '</h3><p>🍷 ' + L('와인잔 · 소믈리에 나이프 · 디캔터', 'Wine glasses · corkscrew · decanter') + '<br>🥃 ' + L('글렌케런 잔 · 하이볼 잔 · 아이스볼 틀', 'Glencairn · highball glass · ice-ball mold') + '</p>' + cpLink(L('🛒 쿠팡에서 잔·용품 보기', '🛒 Glassware on Coupang')) + disclosure();
    app.appendChild(c);
    if (S.cart.length) app.appendChild(btn('ghost wide', L('목록 비우기', 'Clear list'), function () { S.cart = []; save(); go(cart); }));
  }
  document.getElementById('langBtn').onclick = function () { S.lang = S.lang === 'ko' ? 'en' : 'ko'; save(); go(cur); };
  document.getElementById('unlockBtn').onclick = function () { go(cart); };
  var muted = false;
  document.getElementById('muteBtn').onclick = function () { muted = !muted; try { if (A) A.setMute(muted); } catch (e) {} this.textContent = muted ? '🔇' : '🔊'; };
  document.body.classList.add('live');
  var age = document.getElementById('age');
  if (S.age) age.className = 'ok';
  document.getElementById('ageYes').onclick = function () { S.age = 1; save(); age.className = 'ok'; try { if (A) { A.init(); A.startMusic(); } } catch (e) {} };
  document.addEventListener('pointerdown', function once() { if (!S.age) return; document.removeEventListener('pointerdown', once); try { if (A) { A.init(); A.startMusic(); } } catch (e) {} });
  try { var lq = new URLSearchParams(location.search).get('lang'); if (lq === 'en' || lq === 'ko') S.lang = lq; } catch (e) {}
  go(home);
})();
