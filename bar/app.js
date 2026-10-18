/* 나두 바 아카데미 / Nadoo Bar Academy — game logic */
'use strict';
(function () {
var $ = function (s, r) { return (r || document).querySelector(s); };
var KEY = 'nadooBarAcademy_v1', AGEKEY = 'nadooBar_age19';
var S = load();
var lang = S.lang || 'ko';
function L(x) { if (x == null) return ''; if (Array.isArray(x)) return lang === 'en' ? (x[1] != null ? x[1] : x[0]) : x[0]; return x; }
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function load() { try { var o = JSON.parse(localStorage.getItem(KEY)); if (o && o.v === 1) return o; } catch (e) {} return { v: 1, lang: 'ko', mute: false, xp: 0, ch: {}, best: {}, disc: {}, srs: {}, mist: {}, rush: { best: 0, total: 0 }, taste: 0, quiz: 0, served: 0 }; }
function save() { S.lang = lang; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
function rnd(a) { return a[(Math.random() * a.length) | 0]; }
function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = (Math.random() * (i + 1)) | 0, t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function now() { return performance.now(); }
function fmt(n) { return (Math.round(n * 10) / 10).toString(); }
function oz(ml) { var o = ml / 30; var q = Math.round(o * 4) / 4; var w = Math.floor(q), f = q - w, fr = f === .25 ? '¼' : f === .5 ? '½' : f === .75 ? '¾' : ''; return (w ? w : (fr ? '' : '0')) + fr + ' oz'; }

var T = {
  title: ['나두 바 아카데미', 'Nadoo Bar Academy'], home: ['🏠 홈', '🏠 Home'], back: ['‹ 뒤로', '‹ Back'],
  tag: ['제로에서 실전 바텐더까지. 한 잔씩, 진짜 바의 순서대로.', 'From zero to behind the bar, one drink at a time, the way real bars work.'],
  academy: ['아카데미', 'Academy'], academyD: ['계열별 레슨 → 가이드 연습 → 블라인드 → 퀴즈', 'Family lessons → guided → blind → quiz'],
  free: ['자유 연습', 'Free practice'], freeD: ['45가지 레시피 아무거나 골라서', 'Pick any of the 45 recipes'],
  rush: ['금요일 밤 러시', 'Friday Night Rush'], rushD: ['밀려드는 주문, 속도와 정확도, 팁', 'A queue of tickets, speed + accuracy, tips'],
  lab: ['조합 발견 랩', 'Discovery Lab'], labD: ['재료를 섞어 진짜 칵테일을 찾아내기', 'Mix freely and uncover real cocktails'],
  dex: ['레시피 도감', 'Recipe Dex'], dexD: ['카드·플래시카드·실수 복습', 'Cards, flashcards, review mistakes'],
  lib: ['바 도서관', 'Bar Library'], libD: ['스피릿·위스키·이야기·프로 팁', 'Spirits, whisky, stories, pro tips'],
  taste: ['위스키 테이스팅', 'Whisky Tasting'], tasteD: ['향을 읽고 지역을 맞히기', 'Read the notes, name the region'],
  quiz: ['바 퀴즈', 'Bar Quiz'], quizD: ['10문제 랜덤 시험', '10 random questions'],
  respons: ['🍷 이 게임은 칵테일 지식과 기술 훈련용이에요. 실제로 마실 때는 천천히, 적당히, 물과 함께. 음주 후 운전은 절대 금지. 임신 중이거나 약을 복용 중이면 마시지 마세요.', '🍷 This is a training game for cocktail knowledge and skill. If you drink, go slow, in moderation, with water. Never drink and drive. Avoid alcohol if pregnant or on medication.'],
  gateQ: ['만 19세 이상인가요?', 'Are you of legal drinking age?'], gateSub: ['나두 바 아카데미는 성인을 위한 칵테일 훈련 페이지예요.', 'Nadoo Bar Academy is a cocktail-training page for adults.'],
  gateYes: ['네, 만 19세 이상이에요', 'Yes, I am of legal drinking age'], gateNo: ['아니요', 'No'],
  gateBye: ['이 페이지는 성인 전용이에요. 홈에서 다른 게임을 즐겨 주세요!', 'This page is for adults only. Please enjoy the other games on the home page!'],
  rank: ['등급', 'Rank'], xp: ['XP', 'XP'],
  ticket: ['주문 티켓', 'Order ticket'], take: ['주문 받기 →', 'Take the order →'], next: ['다음 →', 'Next →'], cont: ['계속 →', 'Continue →'],
  sGlass: ['① 글라스 고르기', '① Pick a glass'], sIce: ['② 얼음 & 잔 준비', '② Ice & glass prep'], sMeasure: ['③ 계량', '③ Measure'],
  sTech: ['④ 기법', '④ Technique'], sTop: ['탑 업', 'Top up'], sFloat: ['플로트', 'Float'], sGarn: ['⑤ 가니시', '⑤ Garnish'],
  chill: ['❄ 얼음물로 잔 칠링', '❄ Chill glass with ice water'], preheat: ['♨ 뜨거운 물로 잔 예열', '♨ Preheat glass with hot water'],
  vessel: ['어디에 따를까요?', 'Where do you build it?'], hold: ['길게 눌러 붓기', 'Hold to pour'], holdK: ['(Space 길게)', '(hold Space)'],
  commit: ['틴에 붓기 ✓', 'Pour it in ✓'], commitG: ['잔에 붓기 ✓', 'Into the glass ✓'], redo: ['다시 계량', 'Re-measure'], done: ['완료 ✓', 'Done ✓'],
  dashBtn: ['대시 💧', 'Dash 💧'], mintBtn: ['민트 한 줄기 🌿', 'Add a mint sprig 🌿'],
  shelf: ['백바에서 재료 고르기', 'Choose from the back bar'], shelfDone: ['계량 끝 → 기법', 'Done measuring → technique'],
  pickTech: ['필요한 기법을 모두 고르세요(순서대로 실행돼요)', 'Pick every technique needed (they run in order)'], run: ['실행 ▶', 'Go ▶'],
  serve: ['서빙하기 🍸', 'Serve 🍸'], express: ['✨ 오일 짜기', '✨ Express oils'], expressed: ['오일을 짰어요 ✨', 'Oils expressed ✨'],
  correct: ['정답!', 'Correct!'], wrong: ['오답', 'Not quite'], answer: ['정답: ', 'Answer: '],
  guided: ['가이드', 'Guided'], blind: ['블라인드', 'Blind'], lesson: ['레슨', 'Lesson'],
  again: ['다시 만들기', 'Make it again'], menu: ['메뉴로', 'Menu'], grade: ['평가', 'Grade'],
  peek: ['📋 레시피 보기 (팁 −30%)', '📋 Peek at spec (tip −30%)'],
  guest: ['손님 한마디', 'The guest says'], fix: ['고칠 점', 'What to fix'], specCard: ['정확한 스펙', 'The correct spec'],
  float: ['플로트로 마지막에 올리기', 'Float it on top at the end'],
  mute: ['음악', 'Music'], lGlass: ['글라스', 'Glass'], lIce: ['얼음·잔', 'Ice & prep'], lTech: ['기법', 'Method'], lGarn: ['가니시', 'Garnish']
};
function t(k) { return L(T[k]); }

/* ---------- first-input gate for animation/audio ---------- */
var live = false;
function goLive() {
  if (live) return; live = true; document.body.classList.add('live');
  AUD.init(); AUD.setMute(!!S.mute); if (!S.mute) AUD.startMusic();
}
addEventListener('pointerdown', goLive, { capture: true }); addEventListener('keydown', goLive, { capture: true });

/* ---------- input guard / keyboard ---------- */
var renderedAt = 0, GUARD = 380;
function guardOK() { return now() - renderedAt > GUARD; }
var holdKey = null; /* function(down:boolean) when a hold control is active */
addEventListener('keydown', function (e) {
  if ($('#gate') && !$('#gate').hidden) return;
  if (e.key === ' ' && holdKey) { e.preventDefault(); if (!e.repeat) holdKey(true); return; }
  if (e.key === 'Enter' || e.key === ' ') {
    var b = document.querySelector('[data-enter]:not([disabled])');
    if (b && !e.repeat) { e.preventDefault(); if (guardOK()) b.click(); }
  }
});
addEventListener('keyup', function (e) { if (e.key === ' ' && holdKey) { e.preventDefault(); holdKey(false); } });

/* ---------- toast / fanfare ---------- */
function toast(msg, ms) {
  var el = $('#toast'); el.innerHTML = msg; el.hidden = false; el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(function () { el.hidden = true; }, ms || 2200);
}

/* ---------- XP / ranks ---------- */
function rankOf(xp) { var r = 0; BAR.RANKS.forEach(function (k, i) { if (xp >= k.xp) r = i; }); return r; }
function addXP(n) {
  var before = rankOf(S.xp); S.xp += Math.max(0, Math.round(n)); save(); topbar();
  var after = rankOf(S.xp);
  if (after > before) { AUD.fanfare(); showFanfare('🎖️', L(T.rank) + ' UP!', L(BAR.RANKS[after].n), L(BAR.RANKS[after].d)); }
}
function showFanfare(icon, title, big, sub, extra) {
  var f = $('#fanfare');
  f.innerHTML = '<div class="fan-card"><div class="fan-ic">' + icon + '</div><div class="fan-t">' + esc(title) + '</div><div class="fan-big">' + big + '</div>' +
    (sub ? '<p class="fan-sub">' + sub + '</p>' : '') + (extra || '') + '<button class="btn primary" id="fanOk">' + t('cont') + '</button></div>';
  f.hidden = false; renderedAt = now();
  var ok = $('#fanOk'); ok.setAttribute('data-enter', '');
  ok.onclick = function () { if (!guardOK()) return; f.hidden = true; f.innerHTML = ''; renderedAt = now(); };
}

/* ---------- top bar ---------- */
function topbar() {
  var r = rankOf(S.xp), nx = BAR.RANKS[r + 1];
  $('#rankChip').innerHTML = '<span class="rk">' + esc(L(BAR.RANKS[r].n)) + '</span><span class="rx">' + S.xp + (nx ? ' / ' + nx.xp : '') + ' XP</span>';
  $('#langBtn').textContent = lang === 'ko' ? 'EN' : '한국어';
  $('#muteBtn').textContent = S.mute ? '🔇' : '🔊';
  $('#muteBtn').setAttribute('aria-label', t('mute'));
  $('#homeLink').textContent = t('home');
  $('#brand').innerHTML = '<span class="bf">' + t('title') + '</span><span class="bs">' + (lang === 'ko' ? '나두 바' : 'Nadoo Bar') + '</span>'; $('#brand').className = lang;
  document.documentElement.lang = lang;
  document.title = lang === 'ko' ? '나두 바 아카데미 · 칵테일 트레이닝 (성인용)' : 'Nadoo Bar Academy · cocktail training (adults)';
}

/* ---------- navigation ---------- */
var cur = null; /* {fn, args} */
function go(fn) { var args = [].slice.call(arguments, 1); cur = { fn: fn, args: args }; holdKey = null; AUD.stopLoop(); fn.apply(null, args); renderedAt = now(); window.scrollTo(0, 0); }
function rerender() { if (cur) { holdKey = null; cur.fn.apply(null, cur.args); renderedAt = now(); } }
function view(html) { $('#app').innerHTML = html; renderedAt = now(); }
function head(title, backFn, sub) {
  return '<div class="subhead"><button class="btn ghost small" id="backBtn">' + t('back') + '</button><h2>' + title + '</h2></div>' + (sub ? '<p class="lead">' + sub + '</p>' : '');
}
function bindBack(fn) { var b = $('#backBtn'); if (b) b.onclick = function () { AUD.tap(); fn(); }; }

/* ======================================================================
   SCENE: glass SVG with liquid, ice, garnish
   ====================================================================== */
var GD = {
  highball: { o: 'M58 40 L142 40 L139 248 Q100 252 61 248 Z', b: 'M62 44 L138 44 L135.5 232 L64.5 232 Z', top: 44, bot: 232, x0: 64, x1: 136, p: 1 },
  collins:  { o: 'M66 14 L134 14 L132 248 Q100 252 68 248 Z', b: 'M70 18 L130 18 L128.5 232 L71.5 232 Z', top: 18, bot: 232, x0: 72, x1: 128, p: 1 },
  rocks:    { o: 'M46 140 L154 140 L150 248 Q100 252 50 248 Z', b: 'M50 144 L150 144 L147 226 L53 226 Z', top: 144, bot: 226, x0: 54, x1: 146, p: 1 },
  dbl:      { o: 'M40 112 L160 112 L156 248 Q100 252 44 248 Z', b: 'M44 116 L156 116 L152.5 228 L47.5 228 Z', top: 116, bot: 228, x0: 48, x1: 152, p: 1 },
  martini:  { o: 'M28 60 L172 60 L104 138 L104 240 Q130 243 140 248 L60 248 Q70 243 96 240 L96 138 Z', b: 'M33 63 L167 63 L100 136 Z', top: 63, bot: 136, x0: 60, x1: 140, p: 3 },
  coupe:    { o: 'M36 96 Q38 150 96 156 L96 240 Q125 243 136 248 L64 248 Q75 243 104 240 L104 156 Q162 150 164 96 Z', b: 'M40 99 Q42 148 100 152 Q158 148 160 99 Z', top: 99, bot: 152, x0: 56, x1: 144, p: 2 },
  nicknora: { o: 'M56 66 Q54 140 96 150 L96 240 Q120 243 132 248 L68 248 Q80 243 104 240 L104 150 Q146 140 144 66 Z', b: 'M60 69 Q60 138 100 146 Q140 138 140 69 Z', top: 69, bot: 146, x0: 66, x1: 134, p: 1.6 },
  mug:      { o: 'M48 96 L146 96 L150 248 Q98 252 44 248 Z', b: 'M52 100 L142 100 L145 236 L49 236 Z', top: 100, bot: 236, x0: 54, x1: 140, p: 1, opaque: 1,
              h: 'M146 122 Q184 124 182 172 Q180 212 148 214' },
  tiki:     { o: 'M70 20 Q56 60 64 100 Q74 140 62 180 Q56 214 86 226 L88 236 L70 248 L130 248 L112 236 L114 226 Q144 214 138 180 Q126 140 136 100 Q144 60 130 20 Z',
              b: 'M74 24 Q60 60 68 100 Q78 140 66 180 Q62 210 90 220 L110 220 Q138 210 134 180 Q122 140 132 100 Q140 60 126 24 Z', top: 24, bot: 220, x0: 70, x1: 130, p: 1 },
  flute:    { o: 'M80 30 Q76 120 96 168 L96 240 Q120 243 130 248 L70 248 Q80 243 104 240 L104 168 Q124 120 120 30 Z', b: 'M84 33 Q81 118 100 162 Q119 118 116 33 Z', top: 33, bot: 162, x0: 86, x1: 114, p: 1.3 },
  wine:     { o: 'M58 40 Q42 120 70 156 Q84 168 96 170 L96 240 Q122 243 134 248 L66 248 Q78 243 104 240 L104 170 Q116 168 130 156 Q158 120 142 40 Z',
              b: 'M62 44 Q47 120 74 152 Q88 164 100 165 Q112 164 126 152 Q153 120 138 44 Z', top: 44, bot: 165, x0: 60, x1: 140, p: 1.5 },
  irish:    { o: 'M58 64 L142 64 L132 182 Q100 192 68 182 Z M94 186 L94 234 Q72 240 66 248 L134 248 Q128 240 106 234 L106 186 Z', b: 'M62 68 L138 68 L129 178 Q100 186 71 178 Z', top: 68, bot: 182, x0: 66, x1: 134, p: 1,
              h: 'M140 86 Q174 92 168 128 Q162 160 134 160' }
};
function hexRGB(h) { var n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function mixColor(parts) { /* parts: [{id, ml}] → {c:'rgb()', a} */
  var tot = 0, r = 0, g = 0, b = 0, op = 0;
  parts.forEach(function (p) {
    var I = BAR.ING[p.id]; if (!I || p.ml <= 0) return;
    var w = p.ml * (0.02 + Math.pow(I[3], 1.3) * 1.6), c = hexRGB(I[2]);
    r += c[0] * w; g += c[1] * w; b += c[2] * w; tot += w; op += I[3] * p.ml;
  });
  var ml = parts.reduce(function (s, p) { return s + (p.ml > 0 ? p.ml : 0); }, 0);
  if (!tot) return { c: 'rgb(240,246,248)', a: 0.15 };
  return { c: 'rgb(' + (r / tot | 0) + ',' + (g / tot | 0) + ',' + (b / tot | 0) + ')', a: clamp(0.18 + (op / ml) * 1.4, 0.18, 0.95) };
}
var CARB = { soda: 1, tonic: 1, cola: 1, gingerbeer: 1, gfsoda: 1, prosecco: 1, champagne: 1 };
var uid = 0;
/* G: {glass, ice, chilled, liquid:[{id,ml}], water, floats:[{id,ml,ok}], foam, garn:[], pour:{id}|null, fill: target ml line} */
function glassSVG(G, opts) {
  opts = opts || {};
  var d = GD[G.glass], id = 'g' + (++uid), cap = BAR.GLASS[G.glass].cap, out = [];
  var liqML = (G.liquid || []).reduce(function (s, p) { return s + p.ml; }, 0) + (G.water || 0);
  var flML = (G.floats || []).reduce(function (s, p) { return s + p.ml; }, 0);
  var hasIce = G.ice && G.ice !== 'none';
  function levelY(ml) {
    var eff = ml * (hasIce ? 1.55 : 1); var f = clamp(eff / cap, 0, 1); var h = Math.pow(f, 1 / d.p);
    return d.bot - (d.bot - d.top) * h;
  }
  var yMain = levelY(liqML), yTop = levelY(liqML + flML);
  out.push('<defs><clipPath id="' + id + 'c"><path d="' + d.b + '"/></clipPath>' +
    '<linearGradient id="' + id + 'gl" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".18" stop-color="#fff" stop-opacity=".05"/><stop offset=".8" stop-color="#fff" stop-opacity=".02"/><stop offset="1" stop-color="#fff" stop-opacity=".16"/></linearGradient>' +
    '<linearGradient id="' + id + 'cu" x1="0" x2="1"><stop offset="0" stop-color="#7a3a1a"/><stop offset=".3" stop-color="#e09060"/><stop offset=".55" stop-color="#b8643a"/><stop offset="1" stop-color="#5a2810"/></linearGradient></defs>');
  /* glass body tint (behind liquid) */
  if (!d.opaque) out.push('<path d="' + d.o + '" fill="rgba(255,236,205,.13)"/>');
  /* liquid */
  out.push('<g clip-path="url(#' + id + 'c)">');
  if (liqML > 0.5) {
    var mc = mixColor((G.liquid || []).concat(G.water ? [{ id: 'soda', ml: G.water * 0.6 }] : []));
    var rgb = mc.c.match(/\d+/g).map(Number), lum = 0.3 * rgb[0] + 0.59 * rgb[1] + 0.11 * rgb[2];
    if (lum < 70 && mc.a > 0.35) { /* dark liquids: backlit amber edge so they read on the dark bar */
      var k = 0.55 + (70 - lum) / 70 * 0.2; rgb = [rgb[0] + (168 - rgb[0]) * k, rgb[1] + (88 - rgb[1]) * k, rgb[2] + (40 - rgb[2]) * k].map(function (v) { return v | 0; });
      mc = { c: 'rgb(' + rgb.join(',') + ')', a: Math.max(mc.a, 0.9) };
      out.push('<radialGradient id="' + id + 'dk" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>');
    }
    out.push('<rect class="liq" x="0" y="' + yMain + '" width="200" height="' + (d.bot - yMain + 2) + '" fill="' + mc.c + '" fill-opacity="' + mc.a + '"/>');
    if (lum < 70 && mc.a >= 0.9) out.push('<rect x="0" y="' + yMain + '" width="200" height="' + (d.bot - yMain + 2) + '" fill="url(#' + id + 'dk)"/><rect x="0" y="' + yMain + '" width="200" height="2.5" fill="#e0a060" fill-opacity=".7"/>');
    out.push('<rect x="0" y="' + yMain + '" width="200" height="3" fill="#fff" fill-opacity=".25"/>');
  }
  (G.floats || []).forEach(function (f, i) {
    var I = BAR.ING[f.id], y0 = levelY(liqML + (G.floats.slice(0, i).reduce(function (s, q) { return s + q.ml; }, 0))), y1 = levelY(liqML + G.floats.slice(0, i + 1).reduce(function (s, q) { return s + q.ml; }, 0));
    if (f.ok) out.push('<rect x="0" y="' + y1 + '" width="200" height="' + Math.max(3, y0 - y1 + 1) + '" fill="' + I[2] + '" fill-opacity="' + clamp(I[3] + .1, .4, 1) + '"/>');
    else out.push('<rect x="0" y="' + y1 + '" width="200" height="' + (d.bot - y1) + '" fill="' + I[2] + '" fill-opacity=".25"/>');
  });
  if (G.foam && liqML > 1) out.push('<rect x="0" y="' + (yTop - 7) + '" width="200" height="9" fill="' + (G.foam === 'crema' ? '#c89a6a' : '#f8f2e2') + '" fill-opacity=".92"/>');
  /* bubbles */
  if (G.carb && liqML > 5 && live) {
    for (var bI = 0; bI < 14; bI++) { var bx = d.x0 + 6 + Math.random() * (d.x1 - d.x0 - 12), dl = (Math.random() * 3).toFixed(2);
      out.push('<circle class="bub" cx="' + bx.toFixed(1) + '" cy="' + (d.bot - 4) + '" r="' + (1 + Math.random() * 1.6).toFixed(1) + '" fill="#fff" fill-opacity=".55" style="animation-delay:-' + dl + 's;--rise:' + (yTop - d.bot + 8).toFixed(0) + 'px"/>'); }
  }
  /* ice */
  if (hasIce) out.push(iceSVG(G.ice, d, G.seed || 1));
  out.push('</g>');
  /* pour stream */
  if (G.pour) { var pc = BAR.ING[G.pour.id] ? BAR.ING[G.pour.id][2] : '#ddd'; out.push('<rect class="stream" x="97" y="-40" width="6" height="' + (Math.max(yTop, d.top) + 40) + '" rx="3" fill="' + pc + '" fill-opacity=".85"/>'); }
  /* target line */
  if (G.fill) { var ty = levelY(G.fill); out.push('<line x1="' + (d.x0 - 14) + '" x2="' + (d.x1 + 14) + '" y1="' + ty + '" y2="' + ty + '" stroke="#ffd27a" stroke-width="2" stroke-dasharray="5 4"/><text x="' + (d.x1 + 16) + '" y="' + (ty + 5) + '" class="svgt">' + Math.round(G.fill) + 'ml</text>'); }
  /* glass outline & shine */
  if (d.opaque) {
    out.push('<path d="' + d.o + '" fill="url(#' + id + 'cu)" stroke="#3a1a08" stroke-width="2"/>');
    if (d.h) out.push('<path d="' + d.h + '" fill="none" stroke="#b8643a" stroke-width="9" stroke-linecap="round"/>');
    if (liqML > 1) { var my = clamp(levelY(liqML + flML), d.top + 2, d.bot); var mc2 = mixColor(G.liquid || []); out.push('<ellipse cx="97" cy="' + Math.max(d.top + 4, my) + '" rx="44" ry="5" fill="' + mc2.c + '" fill-opacity=".9"/>'); }
    out.push('<ellipse cx="97" cy="96" rx="49" ry="5" fill="none" stroke="#f0b080" stroke-width="2"/>');
  } else {
    out.push('<path d="' + d.o + '" fill="url(#' + id + 'gl)" stroke="rgba(235,245,250,.75)" stroke-width="2.2" stroke-linejoin="round"/>');
    if (d.h) out.push('<path d="' + d.h + '" fill="none" stroke="rgba(235,245,250,.7)" stroke-width="5" stroke-linecap="round"/>');
  }
  if (G.chilled && !d.opaque) out.push('<path d="' + d.o + '" fill="#e8f4ff" fill-opacity=".14"/>' + dropsSVG(d, 22));
  else if (hasIce && liqML > 20 && !d.opaque) out.push(dropsSVG(d, 12));
  /* rim garnishes */
  out.push(garnSVG(G.garn || [], d, yTop));
  return '<g class="glassg ' + (opts.cls || '') + '">' + out.join('') + '</g>';
}
function dropsSVG(d, n) {
  var s = '', seed = 7;
  for (var i = 0; i < n; i++) { seed = (seed * 9301 + 49297) % 233280; var rx = seed / 233280; seed = (seed * 9301 + 49297) % 233280; var ry = seed / 233280;
    var x = d.x0 - 2 + rx * (d.x1 - d.x0 + 4), y = d.top + 8 + ry * (d.bot - d.top - 10);
    s += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="1.4" ry="2.1" fill="#fff" fill-opacity=".38"/>'; }
  return s;
}
function iceSVG(kind, d, seed) {
  var s = '', w = d.x1 - d.x0, x, y;
  if (kind === 'big') {
    var sz = Math.min(w * 0.72, (d.bot - d.top) * 0.62, 70); x = (d.x0 + d.x1) / 2 - sz / 2; y = d.bot - sz - 3;
    return '<rect x="' + x + '" y="' + y + '" width="' + sz + '" height="' + sz + '" rx="9" fill="#eaf6ff" fill-opacity=".14" stroke="#fff" stroke-opacity=".55" stroke-width="1.5"/><path d="M' + (x + 8) + ' ' + (y + 10) + ' l' + (sz * .4) + ' -2" stroke="#fff" stroke-opacity=".7" stroke-width="2"/>';
  }
  var size = kind === 'crushed' ? 9 : Math.min(30, w / 2.6), rows = Math.floor((d.bot - d.top) * 0.88 / (size * 0.92)), r = seed * 13;
  for (var j = 0; j < rows; j++) for (x = d.x0 + 2; x < d.x1 - size * 0.6; x += size * (kind === 'crushed' ? 0.9 : 1.02)) {
    r = (r * 9301 + 49297) % 233280; var jx = (r / 233280 - .5) * size * .3; y = d.bot - (j + 1) * size * 0.92 + jx * .4;
    if (kind === 'crushed') s += '<polygon points="' + [x + jx, y, x + size + jx, y + 2, x + size * .8, y + size, x + 1, y + size * .8].map(function (v) { return v.toFixed(1); }).join(' ') + '" fill="#f2faff" fill-opacity=".26" stroke="#fff" stroke-opacity=".35" stroke-width=".6"/>';
    else s += '<rect x="' + (x + jx).toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + (size - 3) + '" height="' + (size - 3) + '" rx="4" transform="rotate(' + (jx * 2).toFixed(1) + ' ' + (x + size / 2).toFixed(1) + ' ' + (y + size / 2).toFixed(1) + ')" fill="#eaf6ff" fill-opacity=".1" stroke="#fff" stroke-opacity=".5" stroke-width="1.1"/>';
  }
  return s;
}
function garnSVG(list, d, yTop) {
  var s = '', rx = d.x1 - 4, ry = d.top, cx = (d.x0 + d.x1) / 2;
  list.forEach(function (g) {
    if (g === 'salt_rim' || g === 'sugar_rim') { for (var i = 0; i < 26; i++) s += '<circle cx="' + (d.x0 - 4 + i * (d.x1 - d.x0 + 8) / 25).toFixed(1) + '" cy="' + (ry - 2 + (i % 3)) + '" r="1.8" fill="' + (g === 'salt_rim' ? '#ffffff' : '#fff3c8') + '"/>'; }
    else if (g === 'lime_wedge' || g === 'lemon_wedge') s += '<path d="M' + (rx - 6) + ' ' + (ry + 8) + ' Q' + (rx + 18) + ' ' + (ry - 26) + ' ' + (rx + 30) + ' ' + (ry + 4) + ' Z" fill="#9ccc3c" stroke="#5a8a1a" stroke-width="2"/><path d="M' + (rx) + ' ' + (ry + 4) + ' Q' + (rx + 16) + ' ' + (ry - 16) + ' ' + (rx + 24) + ' ' + (ry + 2) + '" fill="none" stroke="#e8f4c0" stroke-width="2"/>';
    else if (g === 'lime_wheel' || g === 'lemon_wheel' || g === 'orange_slice' || g === 'cucumber') {
      var col = { lime_wheel: ['#b6dc5a', '#5a8a1a'], lemon_wheel: ['#f6e25a', '#c8a820'], orange_slice: ['#ffa53a', '#d0701a'], cucumber: ['#d8f0c0', '#4a8a3a'] }[g];
      s += '<g transform="translate(' + (rx + 4) + ' ' + (ry - 4) + ')"><circle r="17" fill="' + col[0] + '" stroke="' + col[1] + '" stroke-width="3"/>' + [0, 1, 2, 3, 4, 5].map(function (k) { var a = k * Math.PI / 3; return '<line x1="0" y1="0" x2="' + (13 * Math.cos(a)).toFixed(1) + '" y2="' + (13 * Math.sin(a)).toFixed(1) + '" stroke="#fffbe8" stroke-width="1.5"/>'; }).join('') + '</g>';
    }
    else if (g === 'lemon_twist') s += '<path d="M' + (rx - 10) + ' ' + (ry - 2) + ' q10 -18 20 -4 q10 14 20 -2" fill="none" stroke="#f2d64a" stroke-width="6" stroke-linecap="round"/>';
    else if (g === 'orange_peel') s += '<path d="M' + (rx - 12) + ' ' + (ry - 4) + ' q14 -14 30 -2" fill="none" stroke="#f08a2a" stroke-width="8" stroke-linecap="round"/>';
    else if (g === 'olive' || g === 'onion' || g === 'cherry' || g === 'ginger') {
      var ci = { olive: '#6c8a2a', onion: '#f2f0e0', cherry: '#b0102a', ginger: '#d8a040' }[g], pyy = Math.max(yTop + 10, ry + 26);
      s += '<line x1="' + (cx - 30) + '" y1="' + (ry - 22) + '" x2="' + (cx + 8) + '" y2="' + (pyy + 8) + '" stroke="#c9a45c" stroke-width="2.4"/>';
      s += g === 'ginger' ? '<rect x="' + (cx - 8) + '" y="' + (pyy - 6) + '" width="14" height="14" rx="3" fill="' + ci + '"/>' : '<circle cx="' + (cx - 2) + '" cy="' + pyy + '" r="8" fill="' + ci + '" stroke="rgba(0,0,0,.3)"/>';
      if (g === 'olive') s += '<circle cx="' + (cx - 2) + '" cy="' + pyy + '" r="2.5" fill="#c0302a"/>';
    }
    else if (g === 'mint') s += [[-8, -14], [4, -22], [14, -12], [-2, -28]].map(function (o) { return '<ellipse cx="' + (cx + 20 + o[0]) + '" cy="' + (ry + o[1]) + '" rx="7" ry="11" transform="rotate(' + (o[0] * 2) + ' ' + (cx + 20 + o[0]) + ' ' + (ry + o[1]) + ')" fill="#3fa046" stroke="#246a2a"/>'; }).join('');
    else if (g === 'celery') s += '<rect x="' + (cx + 14) + '" y="' + (ry - 44) + '" width="9" height="' + (d.bot - ry + 30) + '" rx="4" fill="#9ccf5a" stroke="#5a8a2a" transform="rotate(8 ' + cx + ' ' + ry + ')"/>';
    else if (g === 'pineapple') s += '<path d="M' + (rx - 8) + ' ' + (ry + 6) + ' L' + (rx + 26) + ' ' + (ry - 14) + ' L' + (rx + 22) + ' ' + (ry + 12) + ' Z" fill="#f6d040" stroke="#b08a10" stroke-width="2"/><path d="M' + (rx + 24) + ' ' + (ry - 14) + ' l6 -16 l2 14 l8 -10 l-4 14" fill="#3a8a3a"/>';
    else if (g === 'nutmeg') { for (var k = 0; k < 18; k++) s += '<circle cx="' + (cx - 22 + Math.random() * 44).toFixed(1) + '" cy="' + (yTop - 1 + Math.random() * 3).toFixed(1) + '" r="1.3" fill="#7a4a20"/>'; }
    else if (g === 'coffee_beans') s += [-12, 0, 12].map(function (o) { return '<ellipse cx="' + (cx + o) + '" cy="' + (yTop - 3) + '" rx="4.5" ry="3" fill="#3a1e0e" stroke="#1a0a04"/>'; }).join('');
  });
  return s;
}
/* tools beside the glass */
function toolSVG(kind, fillML, color, state) {
  var s = '', pct = clamp(fillML / 220, 0, 1);
  if (kind === 'tin') {
    s += '<g class="tool ' + (state || '') + '"><path d="M30 60 L90 60 L84 210 L36 210 Z" fill="url(#steel)" stroke="#888" stroke-width="2"/>';
    if (state !== 'shaking') { var yy = 210 - 140 * pct; s += '<path d="M' + (36 - 1) + ' ' + yy + ' L85 ' + yy + ' L84 210 L36 210 Z" fill="' + color + '" fill-opacity=".0"/>'; }
    if (state === 'shaking') s += '<path d="M34 10 L86 10 L90 62 L30 62 Z" fill="url(#steel)" stroke="#888" stroke-width="2"/>';
    s += '<text x="60" y="235" class="svgt" text-anchor="middle">' + Math.round(fillML) + 'ml</text></g>';
  } else if (kind === 'mixglass') {
    var y2 = 210 - 130 * pct;
    s += '<g class="tool ' + (state || '') + '"><rect x="28" y="70" width="64" height="142" rx="8" fill="rgba(220,240,250,.1)" stroke="rgba(235,245,250,.7)" stroke-width="2"/>' +
      (fillML > 0 ? '<rect x="31" y="' + y2 + '" width="58" height="' + (209 - y2) + '" fill="' + color + '" fill-opacity=".55"/>' : '') +
      '<g class="spoon"><line x1="64" y1="20" x2="58" y2="205" stroke="#d8c48a" stroke-width="3"/><circle cx="64" cy="18" r="4" fill="#d8c48a"/></g>' +
      '<text x="60" y="235" class="svgt" text-anchor="middle">' + Math.round(fillML) + 'ml</text></g>';
  } else if (kind === 'blender') {
    var y3 = 170 - 100 * pct;
    s += '<g class="tool ' + (state || '') + '"><path d="M30 60 L90 60 L80 170 L40 170 Z" fill="rgba(220,240,250,.12)" stroke="rgba(235,245,250,.7)" stroke-width="2"/>' +
      (fillML > 0 ? '<path d="M' + (30 + (y3 - 60) / 11) + ' ' + y3 + ' L' + (90 - (y3 - 60) / 11) + ' ' + y3 + ' L80 170 L40 170 Z" fill="' + color + '" fill-opacity=".7"/>' : '') +
      '<rect x="32" y="170" width="56" height="44" rx="6" fill="#2a2a2a" stroke="#555"/><circle cx="60" cy="192" r="6" fill="#c9a45c"/>' +
      '<text x="60" y="235" class="svgt" text-anchor="middle">' + Math.round(fillML) + 'ml</text></g>';
  }
  return s;
}

/* ======================================================================
   PRACTICE ENGINE
   ====================================================================== */
var P = null;
var FLOATABLE = { cream: 1, islay: 1, darkrum: 1, mure: 1 };
function iname(id) { return id.split('|').map(function (x) { return L(BAR.ING[x]); }).join(lang === 'ko' ? ' 또는 ' : ' or '); }
function kindOf(x) { return x[2] || BAR.ING[x[0].split('|')[0]][8]; }
function amtStr(x) {
  var k = kindOf(x);
  if (k === 'dash') return x[1] + (lang === 'ko' ? ' 대시' : (x[1] > 1 ? ' dashes' : ' dash'));
  if (k === 'count') return x[1] + (lang === 'ko' ? ' 줄기' : ' sprigs');
  if (k === 'rinse') return lang === 'ko' ? '린스' : 'rinse';
  if (k === 'top') return x[1] + 'ml (' + (lang === 'ko' ? '탑' : 'top') + ')';
  if (k === 'float') return x[1] + 'ml · ' + oz(x[1]) + ' (' + (lang === 'ko' ? '플로트' : 'float') + ')';
  return x[1] + 'ml · ' + oz(x[1]);
}
function validVessels(r) {
  var bld = r.t.some(function (g) { return g.indexOf('build') >= 0 || g.indexOf('muddle') >= 0; });
  var M = { shake: ['tin'], dry: ['tin'], blend: ['blender'], stir: bld ? ['mixglass', 'glass'] : ['mixglass'], build: ['glass'], muddle: ['glass'] };
  var res = null;
  r.t.forEach(function (g) {
    if (!g.some(function (k) { return k === 'shake' || k === 'dry' || k === 'blend' || k === 'stir'; })) return;
    var u = []; g.forEach(function (k) { (M[k] || []).forEach(function (v) { if (u.indexOf(v) < 0) u.push(v); }); });
    res = res ? res.filter(function (v) { return u.indexOf(v) >= 0; }) : u;
  });
  return res && res.length ? res : ['glass'];
}
function mainTech(r) { var f = r.t.map(function (g) { return g[0]; }); return f.indexOf('shake') >= 0 || f.indexOf('dry') >= 0 ? 'shake' : f.indexOf('blend') >= 0 ? 'blend' : (f.indexOf('stir') >= 0 && f.indexOf('build') < 0) ? 'stir' : 'build'; }
function specCardHTML(r, compact) {
  var sv = r.s[0];
  var h = '<div class="spec"><div class="spec-row"><span class="lab">' + t('lGlass') + '</span><span>' + r.s.map(function (s) { return s.g.map(function (g) { return L(BAR.GLASS[g].n); }).join(' / '); }).join(' | ') + '</span></div>' +
    '<div class="spec-row"><span class="lab">' + (lang === 'ko' ? '얼음' : 'Ice') + '</span><span>' + r.s.map(function (s) { return s.i.map(function (i) { return L(BAR.ICE[i].n); }).join(' / ') + (s.c === 1 && s.i[0] === 'none' ? (lang === 'ko' ? ' + 잔 칠링' : ' + chilled glass') : s.c === 'hot' ? (lang === 'ko' ? ' + 잔 예열' : ' + preheated glass') : ''); }).join(' | ') + '</span></div>' +
    '<ul class="ings">' + r.x.map(function (x) { return '<li><span class="dot" style="background:' + BAR.ING[x[0].split('|')[0]][2] + '"></span><span class="in">' + esc(iname(x[0])) + '</span><span class="am">' + amtStr(x) + '</span></li>'; }).join('') + '</ul>' +
    '<div class="spec-row"><span class="lab">' + t('lTech') + '</span><span>' + r.t.map(function (g) { return g.map(function (k) { return L(BAR.TECH[k].n); }).join(lang === 'ko' ? ' 또는 ' : ' or '); }).join(' → ') + '</span></div>' +
    '<div class="spec-row"><span class="lab">' + t('lGarn') + '</span><span>' + (r.gn.need.length ? r.gn.need.map(function (g) { return g.map(function (k) { return L(BAR.GARNISH[k]); }).join(' / '); }).join(' + ') : (lang === 'ko' ? '없음' : 'none')) + (r.gn.ok.length ? ' <span class="muted">(' + (lang === 'ko' ? '선택: ' : 'optional: ') + r.gn.ok.map(function (k) { return L(BAR.GARNISH[k]); }).join(', ') + ')</span>' : '') + '</span></div>';
  if (!compact) h += '<p class="note">' + esc(L(r.note)) + '</p>';
  return h + '</div>';
}

function startPractice(rid, mode, extra) {
  var r = BAR.RMAP[rid];
  P = { r: r, mode: mode, step: 'ticket', extra: extra || {}, gTries: 0, iTries: 0, vTries: 0, tTries: 0, nTries: 0,
        glass: null, ice: null, chill: false, preheat: false, vessel: null, pours: [], inV: [], inG: [], waterG: 0, floatsDone: [], tops: [],
        techSel: [], actions: [], res: {}, garn: [], expressed: false, seed: 1 + (Math.random() * 50 | 0), t0: 0, issues: [], peeked: false };
  go(practiceScreen);
}
function practiceScreen() {
  var r = P.r, title = L(r.n);
  view('<div class="prac">' + (P.mode === 'rush' ? '<div id="rushq" class="rushq"></div>' : '') +
    '<div class="prac-head"><button class="btn ghost small" id="backBtn">' + t('back') + '</button><div class="ph-t"><span class="badge ' + P.mode + '">' + (P.mode === 'guided' ? t('guided') : P.mode === 'blind' ? t('blind') : t('rush')) + '</span> ' + esc(title) + '</div><div id="timer" class="timer"></div></div>' +
    '<div class="scene" id="scene"></div><div class="panel" id="panel"></div></div>');
  bindBack(function () { stopRushTimers(); if (P.mode === 'rush') go(rushIntro); else if (P.extra.fam) go(chapter, P.extra.fam); else go(freePick); });
  if (P.mode === 'rush') drawRushQ();
  if (P.step === 'result') { scene(); if (P.mode === 'rush') rushServedView(); else resultView(P.R); return; }
  step(P.step);
}
function step(s) { P.step = s; holdKey = null; AUD.stopLoop(); scene(); ({ ticket: stTicket, glass: stGlass, ice: stIce, vessel: stVessel, measure: stMeasure, tech: stTech, action: stAction, top: stTop, float: stFloat, garnish: stGarn })[s](); renderedAt = now(); }
function panel(html) { var pn = $('#panel'); pn.innerHTML = html; requestAnimationFrame(function () { revealPanel(pn); }); }
function revealPanel(pn) {
  if (!pn || !pn.isConnected) return; var bs = pn.querySelectorAll('.btn'), last = bs[bs.length - 1]; if (!last) return;
  var vh = window.innerHeight, r = last.getBoundingClientRect(), top = pn.getBoundingClientRect().top, hdr = 76;
  if (r.bottom <= vh - 10) return; var dy = Math.min(r.bottom - vh + 16, top - hdr); if (dy > 4) window.scrollBy({ top: dy, behavior: document.body.classList.contains('live') ? 'smooth' : 'auto' });
}
function sumML(a) { return a.reduce(function (s, p) { return s + p.ml; }, 0); }
function hasCarb() { return P.inG.some(function (p) { return CARB[p.id]; }); }
function foamKind() { var shaken = P.res.shake != null; if (!shaken) return null; if (P.pours.some(function (p) { return p.id === 'egg'; })) return P.res.dry != null ? 'foam' : 'thin'; if (P.pours.some(function (p) { return p.id === 'espresso'; })) return 'crema'; return null; }
function scene(extra) {
  var el = $('#scene'); if (!el) return; extra = extra || {};
  var s = '<svg viewBox="0 0 400 300" class="scene-svg" aria-hidden="true"><defs><linearGradient id="steel" x1="0" x2="1"><stop offset="0" stop-color="#6d6d70"/><stop offset=".35" stop-color="#e8e8ec"/><stop offset=".6" stop-color="#9a9aa0"/><stop offset="1" stop-color="#4a4a4e"/></linearGradient></defs>';
  s += '<defs><linearGradient id="ctr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a3e1c"/><stop offset=".25" stop-color="#4a2a12"/><stop offset="1" stop-color="#22120a"/></linearGradient><linearGradient id="brs" x1="0" x2="1"><stop offset="0" stop-color="#7a5a2a"/><stop offset=".5" stop-color="#f3d58f"/><stop offset="1" stop-color="#7a5a2a"/></linearGradient></defs>' +
    '<rect x="0" y="258" width="400" height="42" fill="url(#ctr)"/><rect x="0" y="256" width="400" height="3" fill="url(#brs)"/><rect x="0" y="259" width="400" height="10" fill="#fff" fill-opacity=".05"/>' +
    '<ellipse cx="130" cy="272" rx="80" ry="6" fill="#000" fill-opacity=".45"/><ellipse cx="322" cy="252" rx="40" ry="5" fill="#000" fill-opacity=".35"/>';
  if (P.step === 'ticket') {
    s += '<g transform="translate(110 30) rotate(-3)"><rect width="180" height="210" rx="4" fill="#f4ecd8"/><rect y="0" width="180" height="22" fill="#e2d6b8"/>' +
      '<text x="90" y="16" text-anchor="middle" class="tk-s">NADOO BAR · #' + (100 + (P.seed * 7) % 900) + '</text>' +
      '<text x="90" y="80" text-anchor="middle" class="tk-b">' + esc(L(P.r.n)) + '</text>' +
      '<text x="90" y="112" text-anchor="middle" class="tk-s">' + (lang === 'ko' ? '1잔' : 'x1') + ' · ' + esc(L(BAR.FAM.filter(function (f) { return f.id === P.r.f; })[0].n)) + '</text>' +
      '<line x1="16" x2="164" y1="140" y2="140" stroke="#b8a888" stroke-dasharray="4 3"/><text x="90" y="170" text-anchor="middle" class="tk-s">$' + P.r.p + '</text></g>';
  } else if (!P.glass) {
    s += '<g transform="translate(30 22)" opacity=".35"><path d="' + GD.rocks.o + '" fill="none" stroke="#e8d8b0" stroke-dasharray="6 5" stroke-width="2"/><text x="100" y="200" text-anchor="middle" class="svgt big">?</text></g>';
  } else {
    var G = { glass: P.glass, ice: (P.ice && P.ice !== 'none' && P.step !== 'glass') ? P.ice : null, chilled: P.chill, liquid: P.inG, water: P.waterG, floats: P.floatsDone,
      foam: foamKind() === 'foam' ? 'foam' : foamKind() === 'crema' ? 'crema' : null, garn: P.garn, pour: extra.pourG ? { id: extra.pourG } : null, fill: extra.fill, carb: hasCarb() && !P.res.flat, seed: P.seed };
    s += '<g transform="translate(30 22)">' + glassSVG(G) + '</g>';
    if (P.vessel && P.vessel !== 'glass' && (P.step === 'measure' || P.step === 'tech' || P.step === 'action' || sumML(P.inV) > 0)) {
      var mc = mixColor(P.inV);
      s += '<g transform="translate(262 40)">' + toolSVG(P.vessel, sumML(P.inV), mc.c, extra.toolState || '') + '</g>';
    }
    if (extra.muddle) s += '<g transform="translate(118 ' + (extra.muddleDown ? 70 : 40) + ')"><rect x="-6" y="0" width="12" height="150" rx="5" fill="#8a5a30" stroke="#4a2a10"/><rect x="-9" y="140" width="18" height="16" rx="4" fill="#5a3a1a"/></g>';
  }
  el.innerHTML = s + '</svg>';
}
/* ---- step: ticket ---- */
function stTicket() {
  var r = P.r, guided = P.mode === 'guided';
  var h = '<h3 class="step-t">' + t('ticket') + '</h3><p class="order-line">“' + esc(L(r.n)) + (lang === 'ko' ? ', 부탁해요!' : ', please!') + '”</p>';
  if (guided) h += '<p class="hint">' + (lang === 'ko' ? '가이드 모드: 스펙을 보면서 순서대로 만들어요. 틀리면 이유를 알려 줄게요.' : 'Guided: follow the spec step by step; mistakes get explained.') + '</p>' + specCardHTML(r);
  else h += '<p class="hint">' + (lang === 'ko' ? '블라인드: 힌트 없이 기억으로! 평가는 서빙 후에.' : 'Blind: no hints, from memory! Feedback after you serve.') + '</p>';
  h += '<button class="btn primary wide" id="takeBtn" data-enter>' + t('take') + '</button>';
  panel(h);
  $('#takeBtn').onclick = function () { if (!guardOK()) return; AUD.tap(); P.t0 = now(); startTimer(); step('glass'); };
}
var timerInt = null;
function startTimer() { clearInterval(timerInt); timerInt = setInterval(function () { var el = $('#timer'); if (!el || !P || P.step === 'result') { clearInterval(timerInt); return; } el.textContent = '⏱ ' + Math.floor((now() - P.t0) / 1000) + 's'; }, 250); }
/* ---- step: glass ---- */
function glassIcon(g) { var d = GD[g]; return '<svg viewBox="20 0 170 256" class="gicon"><path d="' + d.o + '" fill="' + (d.opaque ? '#b8643a' : 'rgba(220,240,250,.12)') + '" stroke="' + (d.opaque ? '#e09060' : 'rgba(235,245,250,.85)') + '" stroke-width="5"/>' + (d.h ? '<path d="' + d.h + '" fill="none" stroke="' + (d.opaque ? '#b8643a' : 'rgba(235,245,250,.8)') + '" stroke-width="8"/>' : '') + '</svg>'; }
function servesFor(g) { return P.r.s.filter(function (s) { return s.g.indexOf(g) >= 0; })[0] || null; }
function stGlass() {
  var h = '<h3 class="step-t">' + t('sGlass') + '</h3><div class="grid glasses">' + BAR.GLASS_ORDER.map(function (g) {
    return '<button class="gbtn' + (P.glass === g ? ' sel' : '') + '" data-g="' + g + '">' + glassIcon(g) + '<span>' + esc(L(BAR.GLASS[g].n)) + '</span></button>'; }).join('') + '</div><div id="fb"></div>';
  panel(h);
  [].forEach.call(document.querySelectorAll('.gbtn'), function (b) {
    b.onclick = function () {
      var g = b.getAttribute('data-g'); P.gTries++; P.glass = g; AUD.clink(1);
      var ok = !!servesFor(g);
      if (P.mode === 'guided') {
        scene();
        [].forEach.call(document.querySelectorAll('.gbtn'), function (x) { x.classList.toggle('sel', x === b); });
        if (ok) { AUD.good(); $('#fb').innerHTML = '<div class="fb ok"><b>' + t('correct') + '</b> ' + esc(L(BAR.GLASS[g].why)) + '</div><button class="btn primary wide" id="nx" data-enter>' + t('next') + '</button>'; renderedAt = now(); $('#nx').onclick = function () { if (guardOK()) step('ice'); }; }
        else { AUD.bad(); var right = P.r.s[0].g[0]; $('#fb').innerHTML = '<div class="fb bad"><b>' + esc(L(BAR.GLASS[g].n)) + '</b>: ' + esc(L(BAR.GLASS[g].why)) + '<br>→ ' + esc(L(P.r.n)) + (lang === 'ko' ? '에는 ' : ' wants a ') + '<b>' + esc(L(BAR.GLASS[right].n)) + '</b>' + (lang === 'ko' ? '. ' : '. ') + esc(L(BAR.GLASS[right].why)) + '</div>'; }
      } else { P.glassOK = ok; step('ice'); }
    };
  });
}
/* ---- step: ice & prep ---- */
function stIce() {
  var hot = P.r.s[0].c === 'hot';
  var h = '<h3 class="step-t">' + t('sIce') + '</h3><div class="grid ice">' + Object.keys(BAR.ICE).map(function (k) {
    return '<button class="opt' + (P.ice === k ? ' sel' : '') + '" data-i="' + k + '"><b>' + esc(L(BAR.ICE[k].n)) + '</b><span>' + esc(L(BAR.ICE[k].d)) + '</span></button>'; }).join('') + '</div>' +
    '<div class="toggles"><button class="tog' + (P.chill ? ' on' : '') + '" id="tChill">' + t('chill') + '</button><button class="tog' + (P.preheat ? ' on' : '') + '" id="tHeat">' + t('preheat') + '</button></div>' +
    '<div id="fb"></div><button class="btn primary wide" id="nx" ' + (P.ice ? '' : 'disabled') + ' data-enter>' + t('next') + '</button>';
  panel(h);
  [].forEach.call(document.querySelectorAll('.opt[data-i]'), function (b) { b.onclick = function () { P.ice = b.getAttribute('data-i'); if (P.ice !== 'none') AUD.clink(4); else AUD.tap(); stIce(); scene(); }; });
  $('#tChill').onclick = function () { P.chill = !P.chill; if (P.chill) P.preheat = false; AUD.clink(2); stIce(); scene(); };
  $('#tHeat').onclick = function () { P.preheat = !P.preheat; if (P.preheat) P.chill = false; AUD.tap(); stIce(); scene(); };
  $('#nx').onclick = function () {
    if (!P.ice || !guardOK()) return;
    var sv = servesFor(P.glass) || P.r.s[0], iceOK = sv.i.indexOf(P.ice) >= 0, needChill = sv.c === 1 && P.ice === 'none', needHot = sv.c === 'hot';
    var chillOK = needChill ? P.chill : needHot ? P.preheat : !P.preheat;
    if (P.mode === 'guided') {
      P.iTries++;
      if (!iceOK || !chillOK) {
        AUD.bad(); var msg = [];
        if (!iceOK) msg.push((lang === 'ko' ? '얼음: ' : 'Ice: ') + '<b>' + sv.i.map(function (i) { return esc(L(BAR.ICE[i].n)); }).join(' / ') + '</b> — ' + esc(L(BAR.ICE[sv.i[0]].d)));
        if (needChill && !P.chill) msg.push(lang === 'ko' ? '업으로 내는 술이라 잔을 얼음물로 칠링해야 해요. 따뜻한 잔은 몇 초 만에 술을 미지근하게 만들어요.' : 'Served up, so chill the glass with ice water; a warm glass warms the drink in seconds.');
        if (needHot && !P.preheat) msg.push(lang === 'ko' ? '뜨거운 술은 잔을 뜨거운 물로 예열해요.' : 'Hot drinks need a preheated glass.');
        if (!needHot && P.preheat) msg.push(lang === 'ko' ? '차가운 칵테일인데 잔을 데우면 안 돼요!' : 'Don’t heat the glass for a cold drink!');
        $('#fb').innerHTML = '<div class="fb bad">' + msg.join('<br>') + '</div>'; return;
      }
      AUD.good();
    }
    if (P.chill) AUD.clink(3);
    step('vessel');
  };
}
/* ---- step: vessel ---- */
function stVessel() {
  var h = '<h3 class="step-t">' + t('sMeasure') + ' · ' + t('vessel') + '</h3><div class="grid vessels">' + Object.keys(BAR.VESSEL).map(function (k) {
    return '<button class="opt" data-v="' + k + '"><b>' + esc(L(BAR.VESSEL[k])) + '</b><span>' + esc(L({ glass: ['빌드: 잔에서 바로 완성', 'Build: finish in the glass'], tin: ['흔들 술 (시트러스·크림·달걀)', 'For shaken drinks (citrus, cream, egg)'], mixglass: ['저을 술 (스피릿 위주)', 'For stirred drinks (spirit-forward)'], blender: ['갈아서 프로즌으로', 'Blended / frozen'] }[k])) + '</span></button>'; }).join('') + '</div><div id="fb"></div>';
  panel(h);
  [].forEach.call(document.querySelectorAll('.opt[data-v]'), function (b) {
    b.onclick = function () {
      var v = b.getAttribute('data-v'), ok = validVessels(P.r).indexOf(v) >= 0; AUD.tap();
      if (P.mode === 'guided' && !ok) { P.vTries++; AUD.bad(); var mt = mainTech(P.r);
        $('#fb').innerHTML = '<div class="fb bad">' + (lang === 'ko' ? '이 술은 <b>' + L(BAR.TECH[mt].n) + '</b>로 만들어요 → ' : 'This drink is <b>' + L(BAR.TECH[mt].n) + '</b> → ') + '<b>' + validVessels(P.r).map(function (x) { return esc(L(BAR.VESSEL[x])); }).join(' / ') + '</b>. ' + esc(lang === 'ko' ? BAR.TIPS[1][2] : BAR.TIPS[1][3]) + '</div>'; return; }
      P.vessel = v; P.vesselOK = ok; buildMeasureQueue(); step('measure');
    };
  });
}
function buildMeasureQueue() {
  if (P.mode === 'guided') {
    P.mq = P.r.x.filter(function (x) { var k = kindOf(x); return k === 'ml' || k === 'dash' || k === 'count' || k === 'float'; })
      .map(function (x) { return { id: x[0].split('|')[0], alt: x[0], t: x[1], k: kindOf(x) === 'float' ? 'ml' : kindOf(x), fl: kindOf(x) === 'float' }; });
    P.mi = 0;
  }
}
/* ---- step: measure ---- */
function addPour(id, ml, k, fl) {
  P.pours.push({ id: id, ml: ml, k: k, fl: !!fl });
  if (fl) return;
  var dest = P.vessel === 'glass' ? P.inG : P.inV;
  if (k === 'ml' || k === 'count') { var e = dest.filter(function (p) { return p.id === id; })[0]; var v = k === 'count' ? 0 : ml; if (e) e.ml += v; else dest.push({ id: id, ml: v }); }
}
function stMeasure() {
  if (P.mode === 'guided') {
    if (P.mi >= P.mq.length) { step('tech'); return; }
    var q = P.mq[P.mi];
    var list = '<ol class="mlist">' + P.mq.map(function (m, i) { return '<li class="' + (i < P.mi ? 'done' : i === P.mi ? 'now' : '') + '">' + esc(iname(m.alt)) + ' <span class="am">' + (m.k === 'dash' ? m.t + (lang === 'ko' ? ' 대시' : ' dash') : m.k === 'count' ? m.t + (lang === 'ko' ? ' 줄기' : ' sprigs') : m.t + 'ml') + (m.fl ? (lang === 'ko' ? ' · 플로트용' : ' · for the float') : '') + '</span></li>'; }).join('') + '</ol>';
    var later = P.r.x.filter(function (x) { var k = kindOf(x); return k === 'top' || k === 'rinse'; });
    var tip = P.mi === 0 ? '<p class="hint">💡 ' + (lang === 'ko' ? '싼 재료(시트러스·시럽)부터, 스피릿은 마지막에. 실수해도 비싼 술을 버리지 않아요.' : 'Cheapest first (citrus, syrup), spirits last, so mistakes don’t waste expensive liquor.') + (later.length ? '<br>' + (lang === 'ko' ? '나중에: ' : 'Later: ') + later.map(function (x) { return esc(iname(x[0])) + ' (' + amtStr(x) + ')'; }).join(', ') : '') + '</p>' : '';
    pourUI(q.id, q.k, q.t, list + tip, function (amt) { addPour(q.id, amt, q.k, q.fl); P.mi++; stMeasure(); scene(); });
  } else shelfUI();
}
function shelfUI() {
  var cats = {}; Object.keys(BAR.ING).forEach(function (id) { if (id === 'absinthe') return; var c = BAR.ING[id][7]; (cats[c] = cats[c] || []).push(id); });
  var poured = P.pours.map(function (p) { return '<span class="chip on">' + esc(L(BAR.ING[p.id])) + ' ' + (p.k === 'dash' ? p.ml + 'd' : p.k === 'count' ? '×' + p.ml : Math.round(p.ml) + 'ml') + (p.fl ? ' ⬆' : '') + '</span>'; }).concat(P.tops.map(function (id) { return '<span class="chip on">' + esc(L(BAR.ING[id])) + ' (' + (lang === 'ko' ? '탑' : 'top') + ')</span>'; })).join('');
  var h = '<h3 class="step-t">' + t('sMeasure') + ' · ' + t('shelf') + '</h3>' + (poured ? '<div class="chips poured">' + poured + '</div>' : '<p class="hint">' + (lang === 'ko' ? '재료를 하나씩 골라 계량해요. 탄산·주스 탑은 나중에, 압생트 린스는 기법 단계에서.' : 'Pick each ingredient and measure it. Tops are poured later; the absinthe rinse is a technique.') + '</p>') +
    (P.mode === 'rush' && !P.peeked ? '<button class="btn ghost small" id="peek">' + t('peek') + '</button>' : '') + (P.peeked ? specCardHTML(P.r, true) : '') +
    BAR.CAT_ORDER.filter(function (c) { return cats[c]; }).map(function (c) { return '<div class="shelf-cat"><div class="sc-t">' + esc(L(BAR.CAT_NAME[c])) + '</div><div class="chips">' + cats[c].map(function (id) { return '<button class="chip" data-id="' + id + '"><span class="dot" style="background:' + BAR.ING[id][2] + '"></span>' + esc(L(BAR.ING[id])) + '</button>'; }).join('') + '</div></div>'; }).join('') +
    '<button class="btn primary wide sticky-b" id="sdone" data-enter ' + (P.pours.length || P.tops.length ? '' : 'disabled') + '>' + t('shelfDone') + '</button>';
  panel(h);
  if ($('#peek')) $('#peek').onclick = function () { P.peeked = true; shelfUI(); };
  [].forEach.call(document.querySelectorAll('.chip[data-id]'), function (b) {
    b.onclick = function () {
      var id = b.getAttribute('data-id'), k = BAR.ING[id][8]; AUD.tap();
      if (k === 'top') { P.tops.push(id); toast(esc(L(BAR.ING[id])) + (lang === 'ko' ? ': 마지막에 탑 업할게요' : ': will top up at the end')); shelfUI(); return; }
      pourUI(id, k, null, '', function (amt, fl) { addPour(id, amt, k, fl); shelfUI(); scene(); });
    };
  });
  $('#sdone').onclick = function () { if (guardOK()) step('tech'); };
}
/* jigger geometry */
var JT = (function () { var H = 160, rb = 30, rt = 58, n = 200, acc = [0], v = 0; for (var i = 1; i <= n; i++) { var y = (i - .5) / n * H, r = rb + (rt - rb) * y / H; v += r * r; acc.push(v); } return acc.map(function (a) { return a / v; }); })();
function jigH(frac) { frac = clamp(frac, 0, 1); for (var i = 1; i < JT.length; i++) if (JT[i] >= frac) return (i / (JT.length - 1)); return 1; }
function jiggerSVG(cap, ml, target, showNum, color, pouring) {
  var H = 160, y0 = 190, marks = cap === 30 ? [7.5, 15, 22.5, 30] : [15, 30, 45, 60];
  var hf = jigH(Math.min(ml, cap) / cap), ly = y0 - H * hf;
  function xAt(y) { var f = (y0 - y) / H; return 30 + 28 * f; }
  var s = '<svg viewBox="0 0 220 230" class="jig"><defs><linearGradient id="jsteel" x1="0" x2="1"><stop offset="0" stop-color="#5a5a5e"/><stop offset=".4" stop-color="#d8d8dc"/><stop offset="1" stop-color="#4a4a4e"/></linearGradient><clipPath id="jc"><path d="M' + (110 - 58) + ' 30 L' + (110 + 58) + ' 30 L' + (110 + 30) + ' 190 L' + (110 - 30) + ' 190 Z"/></clipPath></defs>';
  if (pouring) s += '<rect x="106" y="0" width="8" height="' + ly + '" rx="4" fill="' + color + '" opacity=".9"/>';
  s += '<path d="M' + (110 - 62) + ' 26 L' + (110 + 62) + ' 26 L' + (110 + 33) + ' 194 L' + (110 - 33) + ' 194 Z" fill="url(#jsteel)" opacity=".35"/>';
  s += '<g clip-path="url(#jc)"><rect x="0" y="' + ly + '" width="220" height="' + (y0 - ly + 2) + '" fill="' + color + '" fill-opacity=".92"/><rect x="0" y="' + ly + '" width="220" height="2.5" fill="#fff" fill-opacity=".4"/></g>';
  s += '<path d="M' + (110 - 58) + ' 30 L' + (110 + 58) + ' 30 L' + (110 + 30) + ' 190 L' + (110 - 30) + ' 190 Z" fill="none" stroke="#e8e8ee" stroke-width="3"/>';
  marks.forEach(function (m) { var y = y0 - H * jigH(m / cap), x = xAt(y); var isT = target != null && Math.abs(m - target) < .01;
    s += '<line x1="' + (110 - x + 4) + '" x2="' + (110 + x - 4) + '" y1="' + y + '" y2="' + y + '" stroke="' + (isT ? '#ffd27a' : 'rgba(255,255,255,.55)') + '" stroke-width="' + (isT ? 2.5 : 1.2) + '" stroke-dasharray="' + (isT ? '' : '3 3') + '"/><text x="' + (110 + x + 4) + '" y="' + (y + 5) + '" class="svgt' + (isT ? ' tg' : '') + '">' + m + '</text>'; });
  if (target != null && marks.indexOf(target) < 0) { var yt = y0 - H * jigH(target / cap), xt = xAt(yt); s += '<line x1="' + (110 - xt + 4) + '" x2="' + (110 + xt - 4) + '" y1="' + yt + '" y2="' + yt + '" stroke="#ffd27a" stroke-width="2.5"/><text x="' + (110 + xt + 4) + '" y="' + (yt + 5) + '" class="svgt tg">' + target + '</text>'; }
  if (ml > cap) s += '<path d="M' + (110 + 60) + ' 30 q8 30 2 60" stroke="' + color + '" stroke-width="5" fill="none"/>';
  s += '<text x="110" y="222" text-anchor="middle" class="svgt big">' + (showNum ? fmt(Math.min(ml, cap)) + ' ml' : (lang === 'ko' ? '선을 보고 맞춰요' : 'read the lines')) + '</text></svg>';
  return s;
}
function bindHold(btn, h) {
  var on = false, last = 0, raf = 0;
  function loop() { if (!on) return; var n = now(); h.tick((n - last) / 1000, n - h._t0); last = n; raf = requestAnimationFrame(loop); }
  function down(e) { if (e && e.preventDefault) e.preventDefault(); if (on) return; on = true; last = now(); h._t0 = last; btn.classList.add('holding'); if (h.start) h.start(); raf = requestAnimationFrame(loop); }
  function up() { if (!on) return; on = false; cancelAnimationFrame(raf); btn.classList.remove('holding'); if (h.end) h.end(); }
  btn.addEventListener('pointerdown', down); btn.addEventListener('pointerup', up); btn.addEventListener('pointercancel', up); btn.addEventListener('pointerleave', up);
  btn.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  holdKey = function (d) { if (d) down(); else up(); };
}
function pourUI(id, k, target, pre, cb) {
  var I = BAR.ING[id], guided = P.mode === 'guided', nm = esc(L(I));
  if (k === 'dash' || k === 'count') {
    var n = 0, isD = k === 'dash', lastTap = 0;
    var draw = function () {
      panel(pre + '<h3 class="step-t">' + nm + '</h3><div class="counter"><div class="cnum">' + n + '</div><div class="clab">' + (isD ? (lang === 'ko' ? '대시' : 'dashes') : (lang === 'ko' ? '줄기' : 'sprigs')) + (guided && target != null ? ' / ' + target : '') + '</div></div>' +
        '<div class="row"><button class="btn big" id="cb">' + (isD ? t('dashBtn') : t('mintBtn')) + '</button></div><div class="row"><button class="btn ghost" id="cr">↺</button><button class="btn primary" id="cd" data-enter ' + (n ? '' : 'disabled') + '>' + t('done') + '</button></div>');
      $('#cb').onclick = function () { if (now() - lastTap < 160) return; lastTap = now(); n++; isD ? AUD.dash() : AUD.tap(); draw(); };
      $('#cr').onclick = function () { n = 0; draw(); };
      $('#cd').onclick = function () { if (!guardOK() || !n) return; cb(n); };
    };
    draw(); return;
  }
  var cap = target != null ? (target > 30 ? 60 : 30) : 30, ml = 0, acc = 0, pouring = false, fl = false;
  var jt = function () { return guided && target != null ? (target - acc > cap ? cap : Math.max(0, Math.round((target - acc) * 10) / 10)) : null; };
  var draw2 = function () {
    panel(pre + '<h3 class="step-t">' + nm + (guided && target != null ? ' <span class="tgt">→ ' + target + 'ml · ' + oz(target) + '</span>' : '') + '</h3>' +
      '<div class="jigwrap"><div id="jig">' + jiggerSVG(cap, ml, jt(), guided, I[2], false) + '</div>' +
      '<div class="jigside"><div class="seg"><button class="segb' + (cap === 30 ? ' on' : '') + '" data-c="30">30ml</button><button class="segb' + (cap === 60 ? ' on' : '') + '" data-c="60">60ml</button></div>' +
      (FLOATABLE[id] && !guided ? '<label class="tog small' + (fl ? ' on' : '') + '" id="flt">⬆ ' + t('float') + '</label>' : '') +
      '<button class="btn hold" id="holdB">' + t('hold') + '<small>' + t('holdK') + '</small></button>' +
      (acc > 0 ? '<p class="acc">' + (lang === 'ko' ? '누적 ' : 'Total so far ') + fmt(acc) + ' ml</p>' : '') +
      ((target == null || target > 30 || acc > 0) ? '<button class="btn ghost" id="ag"' + (ml > 0 ? '' : ' disabled') + '>' + (lang === 'ko' ? '＋ 한 번 더 계량' : '＋ Measure again') + '</button>' : '') + '</div></div>' +
      '<div class="row"><button class="btn ghost" id="rd">' + t('redo') + '</button><button class="btn primary" id="cm" data-enter ' + (ml > 0 || acc > 0 ? '' : 'disabled') + '>' + (P.vessel === 'glass' ? t('commitG') : t('commit')) + '</button></div>');
    [].forEach.call(document.querySelectorAll('.segb'), function (b) { b.onclick = function () { if (ml > 0) return; cap = +b.getAttribute('data-c'); draw2(); }; });
    if ($('#flt')) $('#flt').onclick = function () { fl = !fl; draw2(); };
    $('#rd').onclick = function () { ml = 0; acc = 0; draw2(); };
    if ($('#ag')) $('#ag').onclick = function () { if (!guardOK() || ml <= 0) return; if (ml > cap + 0.5) P.issues.push('spill'); acc += Math.min(ml, cap); ml = 0; AUD.clink(1); draw2(); };
    $('#cm').onclick = function () { if (!guardOK() || (ml <= 0 && acc <= 0)) return; var amt = acc + Math.min(ml, cap); if (ml > cap + 0.5) { P.issues.push('spill'); } AUD.clink(1); cb(Math.round(amt * 10) / 10, fl); };
    bindHold($('#holdB'), {
      start: function () { pouring = true; AUD.startLoop('pour'); },
      tick: function (dt, el) { var rate = (cap === 30 ? 13 : 22) * (el < 140 ? 0.35 : 1); ml += rate * dt; $('#jig').innerHTML = jiggerSVG(cap, ml, jt(), guided, I[2], true); },
      end: function () { pouring = false; AUD.stopLoop(); draw2(); renderedAt = now() - GUARD + 120; if (ml > cap + 0.5) toast(lang === 'ko' ? '넘쳤어요! 흘린 술은 손해예요.' : 'Overflow! Spilled liquor is money lost.'); }
    });
  };
  draw2();
}

/* ---- step: technique selection ---- */
function techCheck(sel) {
  var r = P.r, miss = [], extra = [];
  r.t.forEach(function (g) { if (!g.some(function (k) { return sel.indexOf(k) >= 0; })) miss.push(g); });
  var flat = [].concat.apply([], r.t);
  sel.forEach(function (k) {
    if (flat.indexOf(k) >= 0) return;
    if (k === 'double' && sel.indexOf('shake') >= 0) return; /* fine-straining a shaken drink is never wrong */
    extra.push(k);
  });
  return { miss: miss, extra: extra, ok: !miss.length && !extra.length };
}
function techWhy(k) {
  var r = P.r, hasCit = r.x.some(function (x) { var c = BAR.ING[x[0].split('|')[0]]; return c[7] === 'citrus' || c[7] === 'juice' || c[7] === 'dairy' || x[0] === 'egg' || x[0] === 'espresso'; });
  var m = {
    shake: hasCit ? ['시트러스·주스·크림·달걀이 있으면 세게 흔들어 섞고 공기를 넣어요.', 'Citrus, juice, cream or egg → shake hard to mix and aerate.'] : ['이 술은 전통적으로 흔들어요.', 'This one is traditionally shaken.'],
    stir: ['스피릿·베르무트 위주의 술은 저어서 투명하고 매끈하게.', 'Spirit-and-vermouth drinks are stirred for clarity and silk.'],
    build: ['서빙 잔에 바로 따라 완성해요.', 'Built straight in the serving glass.'],
    muddle: ['민트는 살살 눌러 향만 내요.', 'Press the mint gently to release its oils.'],
    blend: ['얼음과 함께 블렌더로 갈아요.', 'Blend with ice.'],
    layer: ['마지막 재료를 위에 띄워요.', 'The last ingredient is floated on top.'],
    rinse: ['압생트로 잔 안쪽을 코팅하고 버려요.', 'Coat the glass with absinthe and discard.'],
    dry: ['달걀흰자 거품을 위해 먼저 얼음 없이 흔들어요.', 'Dry shake first for the egg-white foam.'],
    double: ['고운 체로 얼음 조각과 찌꺼기를 걸러요.', 'Fine-strain out ice shards and bits.']
  };
  return L(m[k]);
}
function stTech() {
  var h = '<h3 class="step-t">' + t('sTech') + '</h3><p class="hint">' + t('pickTech') + '</p><div class="grid techs">' + BAR.TECH_ORDER.map(function (k) {
    return '<button class="opt tech' + (P.techSel.indexOf(k) >= 0 ? ' sel' : '') + '" data-k="' + k + '"><b>' + esc(L(BAR.TECH[k].n)) + '</b><span>' + esc(L(BAR.TECH[k].d)) + '</span></button>'; }).join('') + '</div><div id="fb"></div>' +
    '<button class="btn primary wide" id="run" data-enter ' + (P.techSel.length ? '' : 'disabled') + '>' + t('run') + '</button>';
  panel(h);
  [].forEach.call(document.querySelectorAll('.opt.tech'), function (b) { b.onclick = function () { var k = b.getAttribute('data-k'), i = P.techSel.indexOf(k); if (i >= 0) P.techSel.splice(i, 1); else P.techSel.push(k); AUD.tap(); stTech(); }; });
  $('#run').onclick = function () {
    if (!guardOK() || !P.techSel.length) return;
    var c = techCheck(P.techSel);
    if (P.mode === 'guided' && !c.ok) {
      P.tTries++; AUD.bad();
      $('#fb').innerHTML = '<div class="fb bad">' + c.miss.map(function (g) { return '➕ <b>' + g.map(function (k) { return esc(L(BAR.TECH[k].n)); }).join(' / ') + '</b>: ' + esc(techWhy(g[0])); }).concat(c.extra.map(function (k) { return '➖ <b>' + esc(L(BAR.TECH[k].n)) + '</b>: ' + (lang === 'ko' ? '이 레시피에는 필요 없어요.' : 'not needed here.') + (k === 'shake' && mainTech(P.r) === 'stir' ? ' ' + esc(techWhy('stir')) : '') + (k === 'stir' && mainTech(P.r) === 'shake' ? ' ' + esc(techWhy('shake')) : ''); })).join('<br>') + '</div>';
      return;
    }
    P.actions = BAR.TECH_ORDER.filter(function (k) { return P.techSel.indexOf(k) >= 0 && k !== 'layer' && k !== 'double'; });
    if (!P.actions.length) P.actions = [];
    P.ai = 0; step('action');
  };
}
/* ---- step: actions ---- */
var WIN = { shake: [10, 15], stir: [20, 30], dry: [5, 10], blend: [10, 20] };
function stAction() {
  if (P.ai >= P.actions.length) { finishMixing(); return; }
  var k = P.actions[P.ai], nm = esc(L(BAR.TECH[k].n));
  var nextA = function () { P.ai++; stAction(); renderedAt = now(); };
  if (k === 'rinse') {
    var st = 0;
    var dr = function () {
      panel('<h3 class="step-t">' + nm + ' · ' + esc(L(BAR.ING.absinthe)) + '</h3><p class="hint">' + (lang === 'ko' ? '압생트를 조금 붓고 잔을 돌려 안쪽을 코팅한 뒤, 남은 것은 버려요. 향만 남기는 기술.' : 'Pour a little absinthe, swirl to coat the inside, then discard the excess. Aroma only.') + '</p>' +
        '<div class="row"><button class="btn big" id="r1" ' + (st > 0 ? 'disabled' : '') + '>🌀 ' + (lang === 'ko' ? '붓고 돌리기' : 'Pour & swirl') + '</button><button class="btn big" id="r2" ' + (st !== 1 ? 'disabled' : '') + ' data-enter>🗑 ' + (lang === 'ko' ? '남은 것 버리기' : 'Discard excess') + '</button></div>');
      $('#r1').onclick = function () { st = 1; P.inG.push({ id: 'absinthe', ml: 3 }); AUD.startLoop('pour'); setTimeout(AUD.stopLoop, 300); scene(); dr(); };
      $('#r2').onclick = function () { if (st !== 1) return; P.inG = P.inG.filter(function (p) { return p.id !== 'absinthe'; }); P.res.rinse = true; AUD.tap(); scene(); nextA(); };
    };
    dr(); return;
  }
  if (k === 'muddle' || k === 'build') {
    var n = 0, lt = 0, isM = k === 'muddle';
    var dm = function (down) {
      panel('<h3 class="step-t">' + nm + '</h3><p class="hint">' + (isM ? (lang === 'ko' ? '머들러로 살살 눌러요. 4–8번이면 충분. 너무 짓이기면 쓴맛이 나요.' : 'Press gently with the muddler. 4–8 presses is plenty; too many turns it bitter.') : (lang === 'ko' ? '바스푼으로 가볍게 1–3번 섞어요. 탄산은 세게 저으면 빠져요.' : 'Give it 1–3 gentle turns with a bar spoon; churning kills the fizz.')) + '</p>' +
        '<div class="counter"><div class="cnum">' + n + '</div><div class="clab">' + (isM ? (lang === 'ko' ? '번 눌렀어요' : 'presses') : (lang === 'ko' ? '번 저었어요' : 'turns')) + '</div></div>' +
        '<div class="row"><button class="btn big" id="mb">' + (isM ? '⬇ ' + (lang === 'ko' ? '꾹' : 'Press') : '🥄 ' + (lang === 'ko' ? '휘휘' : 'Turn')) + '</button><button class="btn primary" id="md" data-enter ' + (n ? '' : 'disabled') + '>' + t('done') + '</button></div>');
      scene(isM ? { muddle: 1, muddleDown: down } : {});
      $('#mb').onclick = function () { if (now() - lt < 170) return; lt = now(); n++; AUD.tap(); dm(true); setTimeout(function () { if (P.step === 'action') scene(isM ? { muddle: 1 } : {}); }, 140); };
      $('#md').onclick = function () { if (!guardOK() || !n) return; P.res[k] = n; if (!isM && P.vessel !== 'glass') transfer(0); nextA(); };
    };
    dm(false); return;
  }
  /* timed holds: dry / shake / stir / blend */
  var w = WIN[k], sec = 0, tool = { shake: 'tin', dry: 'tin', stir: 'mixglass', blend: 'blender' }[k];
  var inGlassStir = P.vessel === 'glass';
  var dh = function () {
    panel('<h3 class="step-t">' + nm + '</h3><p class="hint">' + ({ shake: lang === 'ko' ? '얼음을 채우고 세게! 목표 10–15초(바 시간). 틴에 서리가 끼면 OK.' : 'Fill with ice and shake hard! Aim for 10–15 s (bar time). Frost on the tin = good.',
      dry: lang === 'ko' ? '얼음 없이 5–10초 흔들어 달걀흰자를 풀어요.' : 'No ice: shake 5–10 s to whip the egg white.',
      stir: lang === 'ko' ? '얼음과 함께 부드럽게 20–30초, 약 30바퀴.' : 'Stir smoothly with ice for 20–30 s, about 30 turns.',
      blend: lang === 'ko' ? '얼음과 함께 10–20초 곱게 갈아요.' : 'Blend with ice 10–20 s until smooth.' })[k] + ' <span class="muted">(' + (lang === 'ko' ? '바 시간 = 실제의 2배속' : 'bar time runs 2× real time') + ')</span></p>' +
      '<div class="meter"><div class="mzone" style="left:' + (w[0] / (w[1] * 1.6) * 100) + '%;width:' + ((w[1] - w[0]) / (w[1] * 1.6) * 100) + '%"></div><div class="mfill" id="mf" style="width:' + clamp(sec / (w[1] * 1.6) * 100, 0, 100) + '%"></div></div>' +
      '<div class="counter"><div class="cnum" id="sc">' + sec.toFixed(1) + 's</div><div class="clab" id="sl">' + (k === 'stir' ? Math.round(sec * 1.2) + (lang === 'ko' ? '바퀴' : ' turns') : '') + '</div></div>' +
      '<div class="row"><button class="btn hold" id="hb">' + (lang === 'ko' ? '길게 눌러 ' : 'Hold to ') + nm + '<small>' + t('holdK') + '</small></button></div>' +
      '<div class="row"><button class="btn ghost" id="hr">↺</button><button class="btn primary" id="hd" data-enter ' + (sec > 0 ? '' : 'disabled') + '>' + t('done') + '</button></div>');
    var st = (k === 'shake' || k === 'dry') ? 'shaking' : k === 'stir' ? 'stirring' : 'blending';
    if (inGlassStir) scene(); else scene({ toolState: '' });
    bindHold($('#hb'), {
      start: function () { AUD.startLoop(k === 'stir' ? 'stir' : k === 'blend' ? 'blend' : 'shake'); if (!inGlassStir) scene({ toolState: st }); else $('#scene').classList.add('stirring'); },
      tick: function (dt) { sec += dt * 2; $('#sc').textContent = sec.toFixed(1) + 's'; $('#mf').style.width = clamp(sec / (w[1] * 1.6) * 100, 0, 100) + '%'; if (k === 'stir') $('#sl').textContent = Math.round(sec * 1.2) + (lang === 'ko' ? '바퀴' : ' turns'); },
      end: function () { AUD.stopLoop(); $('#scene').classList.remove('stirring'); dh(); renderedAt = now() - GUARD + 120; }
    });
    $('#hr').onclick = function () { sec = 0; dh(); };
    $('#hd').onclick = function () {
      if (!guardOK() || sec <= 0) return; P.res[k] = sec;
      if (k === 'dry') { nextA(); return; }
      if (inGlassStir) { var fr = dilFrac(k, sec); P.waterG += sumML(P.inG) * fr * 0.6; scene(); nextA(); return; }
      strainUI(k, sec, nextA);
    };
  };
  dh();
}
function dilFrac(k, s) { return k === 'shake' ? 0.25 * clamp(s / 12.5, 0.2, 1.8) : k === 'stir' ? 0.2 * clamp(s / 25, 0.2, 1.8) : k === 'blend' ? 0.3 : 0; }
function transfer(fr) { var tot = sumML(P.inV); P.inV.forEach(function (p) { var e = P.inG.filter(function (q) { return q.id === p.id; })[0]; if (e) e.ml += p.ml; else P.inG.push({ id: p.id, ml: p.ml }); }); P.waterG += tot * fr; P.inV = []; }
function strainUI(k, sec, nextA) {
  var dbl = P.techSel.indexOf('double') >= 0;
  panel('<h3 class="step-t">' + (k === 'blend' ? (lang === 'ko' ? '잔에 붓기' : 'Pour into the glass') : (lang === 'ko' ? '스트레인' : 'Strain')) + '</h3><p class="hint">' +
    (k === 'blend' ? (lang === 'ko' ? '블렌더 내용을 잔에 부어요.' : 'Pour the blend into the glass.') : (lang === 'ko' ? (k === 'stir' ? '줄렙 스트레이너' : '호손 스트레이너') + (dbl ? ' + 고운 체(더블 스트레인)' : '') + '로 걸러 ' + (P.ice !== 'none' ? '새 얼음 위에' : '칠링한 잔에') + ' 따라요.' : (k === 'stir' ? 'Julep strainer' : 'Hawthorne strainer') + (dbl ? ' + fine strainer (double strain)' : '') + ', into ' + (P.ice !== 'none' ? 'fresh ice.' : 'the chilled glass.'))) + '</p>' +
    '<button class="btn primary wide" id="sb" data-enter>' + (lang === 'ko' ? '따르기 ↘' : 'Pour ↘') + '</button>');
  renderedAt = now();
  $('#sb').onclick = function () {
    if (!guardOK()) return; AUD.startLoop('pour');
    var fr = dilFrac(k, sec), first = P.inV.length ? P.inV[0].id : 'gin';
    scene({ pourG: first });
    setTimeout(function () { AUD.stopLoop(); transfer(fr); P.res.strained = true; scene(); nextA(); }, 700);
  };
}
function finishMixing() {
  if (sumML(P.inV) > 0) transfer(0); /* nothing chilled it: just dumped */
  P.topQ = P.mode === 'guided' ? P.r.x.filter(function (x) { return kindOf(x) === 'top'; }).map(function (x) { return { id: x[0], t: x[1] }; }) : P.tops.map(function (id) { return { id: id, t: null }; });
  P.ti = 0; step(P.topQ.length ? 'top' : 'float');
}
/* ---- step: top up ---- */
function stTop() {
  if (P.ti >= P.topQ.length) { liftUI(); return; }
  var q = P.topQ[P.ti], I = BAR.ING[q.id], ml = 0, base = sumML(P.inG) + P.waterG, guided = P.mode === 'guided';
  var dr = function () {
    panel('<h3 class="step-t">' + t('sTop') + ' · ' + esc(L(I)) + (guided ? ' <span class="tgt">→ ' + q.t + 'ml</span>' : '') + '</h3><p class="hint">' + (lang === 'ko' ? '차갑게 보관한 믹서를 잔 벽·바스푼을 타고 얼음 사이로 부어요.' : 'Pour the cold mixer down the side, between the ice.') + '</p>' +
      '<div class="counter"><div class="cnum" id="tc">' + (guided ? Math.round(ml) + 'ml' : '🫗') + '</div></div>' +
      '<div class="row"><button class="btn hold" id="hb">' + t('hold') + '<small>' + t('holdK') + '</small></button></div><div class="row"><button class="btn primary" id="td" data-enter ' + (ml > 0 ? '' : 'disabled') + '>' + t('done') + '</button></div>');
    bindHold($('#hb'), {
      start: function () { AUD.startLoop('pour'); },
      tick: function (dt, el) { ml += 45 * dt * (el < 140 ? 0.35 : 1); if (guided) $('#tc').textContent = Math.round(ml) + 'ml';
        var e = P.inG.filter(function (p) { return p.id === q.id; })[0]; if (!e) { e = { id: q.id, ml: 0 }; P.inG.push(e); } e.ml = (e._b || 0) + ml;
        scene({ pourG: q.id, fill: guided ? base + q.t : null }); },
      end: function () { AUD.stopLoop(); var e = P.inG.filter(function (p) { return p.id === q.id; })[0]; if (CARB[q.id]) AUD.fizz(); scene({ fill: guided ? base + q.t : null }); dr(); renderedAt = now() - GUARD + 120;
        var tot = sumML(P.inG) + P.waterG, cap = BAR.GLASS[P.glass].cap / (P.ice && P.ice !== 'none' ? 1.55 : 1); if (tot > cap) { toast(lang === 'ko' ? '넘쳤어요! 잔을 닦아야 해요.' : 'It overflowed! Wipe the glass.'); P.issues.push('overflow'); } }
    });
    $('#td').onclick = function () { if (!guardOK() || ml <= 0) return; var e = P.inG.filter(function (p) { return p.id === q.id; })[0]; e._b = e.ml; P.pours.push({ id: q.id, ml: ml, k: 'top' }); P.ti++; stTop(); renderedAt = now(); };
  };
  scene({ fill: guided ? base + q.t : null }); dr();
}
function liftUI() {
  if (!P.topQ.some(function (q) { return CARB[q.id]; })) { step('float'); return; }
  var n = 0, lt = 0;
  var dr = function () {
    panel('<h3 class="step-t">' + (lang === 'ko' ? '마무리 섞기' : 'Final lift') + '</h3><p class="hint">' + (lang === 'ko' ? '바스푼을 바닥까지 넣어 한두 번 들어 올리듯 섞어요. 더 저으면 탄산이 빠져요.' : 'Slide the bar spoon to the bottom and lift once or twice. More kills the bubbles.') + '</p>' +
      '<div class="counter"><div class="cnum">' + n + '</div></div><div class="row"><button class="btn big" id="lb">🥄 ' + (lang === 'ko' ? '들어 올리기' : 'Lift') + '</button><button class="btn primary" id="ld" data-enter>' + t('done') + '</button></div>');
    $('#lb').onclick = function () { if (now() - lt < 170) return; lt = now(); n++; AUD.tap(); if (n > 3) { P.res.flat = true; scene(); } dr(); };
    $('#ld').onclick = function () { if (!guardOK()) return; P.res.lift = n; step('float'); };
  };
  dr();
}
/* ---- step: float ---- */
function stFloat() {
  var fl = P.pours.filter(function (p) { return p.fl && !p.done; });
  if (!fl.length) { step('garnish'); return; }
  var f = fl[0], layer = P.techSel.indexOf('layer') >= 0;
  if (!layer) { f.done = true; P.floatsDone.push({ id: f.id, ml: f.ml, ok: false }); P.res.layerQ = (P.res.layerQ || []).concat([0]); stFloat(); scene(); return; }
  var pos = 0, dir = 1, raf = 0, last = now(), stopped = false;
  panel('<h3 class="step-t">' + t('sFloat') + ' · ' + esc(L(BAR.ING[f.id])) + '</h3><p class="hint">' + (lang === 'ko' ? '바스푼 뒷면을 액면 바로 위에 대고, 붓는 속도가 가장 느린 초록 구간에서 탭!' : 'Hold the back of a bar spoon just above the surface and tap when the pour speed is in the slow green zone!') + '</p>' +
    '<div class="meter"><div class="mzone" style="left:8%;width:22%"></div><div class="mneedle" id="nd"></div></div><div class="row"><button class="btn big" id="fb2" data-enter>🥄 ' + (lang === 'ko' ? '지금 붓기' : 'Pour now') + '</button></div>');
  function loop() { var n = now(), dt = (n - last) / 1000; last = n; pos += dir * dt * 0.9; if (pos > 1) { pos = 1; dir = -1; } if (pos < 0) { pos = 0; dir = 1; } var el = $('#nd'); if (el) el.style.left = (pos * 100) + '%'; if (!stopped) raf = requestAnimationFrame(loop); }
  raf = requestAnimationFrame(loop);
  $('#fb2').onclick = function () {
    if (stopped || !guardOK()) return; stopped = true; cancelAnimationFrame(raf);
    var q = pos >= 0.08 && pos <= 0.30 ? 1 : (pos < 0.45 ? 0.5 : 0); f.done = true;
    P.floatsDone.push({ id: f.id, ml: f.ml, ok: q >= 0.5 }); P.res.layerQ = (P.res.layerQ || []).concat([q]);
    AUD.startLoop('pour'); scene({ pourG: f.id }); setTimeout(function () { AUD.stopLoop(); q ? AUD.good() : AUD.bad(); scene(); toast(q === 1 ? (lang === 'ko' ? '깔끔한 층! ✨' : 'Clean layer! ✨') : q ? (lang === 'ko' ? '조금 섞였지만 층은 생겼어요' : 'A bit mixed, but it layered') : (lang === 'ko' ? '너무 빨라서 섞였어요' : 'Too fast, it mixed in')); stFloat(); renderedAt = now(); }, 600);
  };
}
/* ---- step: garnish ---- */
function stGarn() {
  var hasEx = P.garn.some(function (g) { return BAR.EXPRESS[g]; });
  var h = '<h3 class="step-t">' + t('sGarn') + '</h3><div class="chips garn">' + Object.keys(BAR.GARNISH).map(function (g) { return '<button class="chip' + (P.garn.indexOf(g) >= 0 ? ' on' : '') + '" data-g="' + g + '">' + esc(L(BAR.GARNISH[g])) + '</button>'; }).join('') + '</div>' +
    (hasEx ? '<div class="row"><button class="btn ' + (P.expressed ? 'ok' : 'gold') + '" id="ex">' + (P.expressed ? t('expressed') : t('express')) + '</button></div>' : '') +
    '<p class="hint">' + (lang === 'ko' ? '가니시가 없는 술이면 아무것도 고르지 말고 서빙해요.' : 'If the drink takes no garnish, serve it as is.') + '</p><div id="fb"></div><button class="btn primary wide" id="sv" data-enter>' + t('serve') + '</button>';
  panel(h);
  [].forEach.call(document.querySelectorAll('.chip[data-g]'), function (b) { b.onclick = function () { var g = b.getAttribute('data-g'), i = P.garn.indexOf(g); if (i >= 0) P.garn.splice(i, 1); else P.garn.push(g); AUD.tap(); scene(); stGarn(); }; });
  if ($('#ex')) $('#ex').onclick = function () { P.expressed = true; AUD.fizz(); $('#scene').classList.add('mist'); setTimeout(function () { var s = $('#scene'); if (s) s.classList.remove('mist'); }, 900); stGarn(); };
  $('#sv').onclick = function () {
    if (!guardOK()) return;
    var gc = garnCheck();
    if (P.mode === 'guided' && gc.msgs.length) { P.nTries++; AUD.bad(); $('#fb').innerHTML = '<div class="fb bad">' + gc.msgs.join('<br>') + '</div>'; return; }
    finish();
  };
}
function garnCheck() {
  var r = P.r, msgs = [], need = 0, got = 0, wrong = [];
  r.gn.need.forEach(function (g) { need++; if (g.some(function (k) { return P.garn.indexOf(k) >= 0; })) got++; else msgs.push('➕ ' + g.map(function (k) { return esc(L(BAR.GARNISH[k])); }).join(' / ')); });
  var okSet = [].concat.apply([], r.gn.need).concat(r.gn.ok);
  P.garn.forEach(function (k) { if (okSet.indexOf(k) < 0) { wrong.push(k); msgs.push('➖ ' + esc(L(BAR.GARNISH[k])) + (lang === 'ko' ? ': 이 술엔 어울리지 않아요' : ': doesn’t belong on this drink')); } });
  var exNeeded = P.garn.some(function (k) { return BAR.EXPRESS[k] && okSet.indexOf(k) >= 0; });
  var exMiss = exNeeded && !P.expressed;
  if (exMiss) msgs.push('✨ ' + (lang === 'ko' ? '필은 잔 위에서 오일을 짜야 향이 살아요' : 'Express the peel over the glass for the aroma'));
  var sc = (need ? 7 * got / need : 7) + 3 - 1.5 * wrong.length - (exMiss ? 2 : 0);
  return { msgs: msgs, score: clamp(sc, 0, 10) };
}

/* ---- scoring ---- */
var TASTE = {
  sweet: ['달아요. 시럽이나 리큐어가 많았어요.', 'Too sweet: too much syrup or liqueur.'],
  sour: ['시큼해요. 시트러스가 이겼어요.', 'Too sour: the citrus is winning.'],
  dry: ['단맛이 모자라 날카로워요.', 'Not enough sweetness; it tastes sharp.'],
  strong: ['독해요! 알코올이 확 올라와요.', 'Too strong: the alcohol jumps out.'],
  weak: ['밍밍하고 물 탄 맛이에요.', 'Weak and watery.'],
  hot: ['덜 차갑고 알코올이 뜨겁게 튀어요. 더 오래 흔들거나 저어야 해요.', 'Not cold enough, hot with alcohol: shake or stir longer.'],
  watery: ['너무 오래 섞어서 묽어졌어요.', 'Over-diluted from mixing too long.'],
  warm: ['미지근해요. 차갑게 칠링하지 않았어요.', 'Lukewarm: it was never properly chilled.'],
  cool: ['금방 식어 버렸어요. 잔을 예열해야 해요.', 'It cooled off fast; preheat the glass.'],
  flat: ['탄산이 다 빠졌어요.', 'The fizz is gone.'],
  bitter: ['민트를 너무 짓이겨 쓰고 풀 비린내가 나요.', 'Over-muddled mint: bitter and grassy.'],
  cloudy: ['흔들어서 뿌옇고 거품이 섞였어요. 스피릿만 든 술은 저어요.', 'Shaken, so it’s cloudy and bubbly; spirit-only drinks are stirred.'],
  dense: ['흔들지 않아 무겁고 덜 섞였어요. 시트러스·크림은 흔들어요.', 'Not shaken, so it’s dense and under-mixed; shake citrus and cream.'],
  nobitters: ['비터스가 빠져 맛이 납작해요.', 'No bitters: it tastes flat and one-note.'],
  layer: ['위에 올려야 할 층이 섞여 버렸어요.', 'The float sank and mixed in.'],
  nofoam: ['거품이 빈약해요. 드라이 셰이크를 먼저!', 'Thin foam: dry shake first!'],
  missing: ['뭔가 빠진 맛이에요… 핵심 재료가 없어요.', 'Something’s missing… a key ingredient isn’t there.'],
  perfect: ['완벽해요. 온도도 균형도 딱, 바에 바로 낼 수 있는 맛!', 'Perfect: right temperature, balanced and ready for the bar!'],
  good: ['좋아요! 거의 완벽해요.', 'Good! Very close to perfect.']
};
function totals(list, water) { var sw = 0, so = 0, al = 0, v = 0; list.forEach(function (p) { var I = BAR.ING[p.id]; if (!I || p.ml <= 0) return; sw += p.ml * I[5]; so += p.ml * I[6]; al += p.ml * I[4] / 100; v += p.ml; }); v += water || 0; return { sw: sw, so: so, al: al, v: v }; }
function quality(v, lo, hi) { if (v == null) return 0; if (v >= lo && v <= hi) return 1; if (v < lo) return clamp(v / lo, 0, 1) * 0.8; return clamp(1 - (v - hi) / (hi * 0.8), 0.2, 1) * 0.8; }
function finish() {
  clearInterval(timerInt);
  var r = P.r, res = P.res, issues = [], tasteK = [];
  var elapsed = (now() - P.t0) / 1000;
  /* glass */
  var sv = servesFor(P.glass), glassOK = !!sv; sv = sv || r.s[0];
  var sGlass = P.mode === 'guided' ? (P.gTries <= 1 ? 15 : P.gTries === 2 ? 8 : 3) : (glassOK ? 15 : 0);
  if (!glassOK) issues.push('🍸 ' + (lang === 'ko' ? '글라스: ' : 'Glass: ') + esc(L(BAR.GLASS[P.glass].n)) + ' → ' + sv.g.map(function (g) { return esc(L(BAR.GLASS[g].n)); }).join(' / '));
  /* ice & temperature */
  var iceOK = sv.i.indexOf(P.ice) >= 0, needChill = sv.c === 1 && P.ice === 'none', needHot = sv.c === 'hot';
  var sIce = (iceOK ? 7 : 0) + ((needChill ? P.chill : needHot ? P.preheat : !P.preheat) ? 3 : 0);
  if (P.mode === 'guided' && P.iTries > 1) sIce = Math.max(0, sIce - 4);
  if (!iceOK) issues.push('🧊 ' + (lang === 'ko' ? '얼음: ' : 'Ice: ') + esc(L(BAR.ICE[P.ice].n)) + ' → ' + sv.i.map(function (i) { return esc(L(BAR.ICE[i].n)); }).join(' / '));
  if (needChill && !P.chill) { issues.push('❄ ' + (lang === 'ko' ? '잔을 칠링하지 않았어요' : 'Glass wasn’t chilled')); tasteK.push('warm'); }
  if (needHot && !P.preheat) { issues.push('♨ ' + (lang === 'ko' ? '잔을 예열하지 않았어요' : 'Glass wasn’t preheated')); tasteK.push('cool'); }
  if (!needHot && P.preheat) { issues.push('♨ ' + (lang === 'ko' ? '찬 술인데 잔을 데웠어요' : 'Heated the glass for a cold drink')); tasteK.push('warm'); }
  /* spec accuracy */
  var U = {}; P.pours.forEach(function (p) { U[p.id] = (U[p.id] || 0) + p.ml; }); if (res.rinse) U.absinthe = 1;
  var used = {}, accs = [], specList = [], userList = [];
  r.x.forEach(function (x) {
    var ids = x[0].split('|'), k = kindOf(x), id = ids.filter(function (i) { return U[i] != null; })[0], tgt = x[1], got = id ? U[id] : 0, acc;
    if (id) used[id] = 1;
    specList.push({ id: ids[0], ml: (k === 'ml' || k === 'top' || k === 'float') ? tgt : 0 });
    if (!id) { acc = 0; issues.push('❌ ' + esc(iname(x[0])) + (lang === 'ko' ? ' 빠짐' : ' missing') + ' (' + amtStr(x) + ')'); if (k !== 'dash' && k !== 'rinse') tasteK.push('missing'); if (BAR.ING[ids[0]][7] === 'bitters' && ids[0] !== 'worcester' && ids[0] !== 'spice') tasteK.push('nobitters'); }
    else if (k === 'dash') acc = got === tgt ? 1 : Math.abs(got - tgt) === 1 ? (tgt >= 2 ? 0.85 : 0.6) : 0.25;
    else if (k === 'count') acc = Math.abs(got - tgt) <= 2 ? 1 : Math.abs(got - tgt) <= 4 ? 0.5 : 0.2;
    else if (k === 'rinse') acc = 1;
    else { var e = Math.abs(got - tgt) / tgt, tol = k === 'top' ? 0.15 : 0.05, span = k === 'top' ? 0.45 : 0.35; acc = clamp(1 - Math.max(0, e - tol) / span, 0, 1); }
    if (id && acc < 0.95 && k !== 'rinse') issues.push('📏 ' + esc(L(BAR.ING[id])) + ': ' + (lang === 'ko' ? '목표 ' : 'target ') + tgt + (k === 'dash' ? 'd' : k === 'count' ? '' : 'ml') + ' → ' + fmt(got) + (k === 'dash' ? 'd' : k === 'count' ? '' : 'ml'));
    accs.push(acc);
  });
  var extras = Object.keys(U).filter(function (id) { return !used[id]; });
  extras.forEach(function (id) { issues.push('➖ ' + esc(L(BAR.ING[id])) + (lang === 'ko' ? ': 이 레시피에 없어요' : ': not in this recipe')); });
  P.pours.forEach(function (p) { if (BAR.ING[p.id][8] !== 'dash' && BAR.ING[p.id][8] !== 'count') userList.push({ id: p.id, ml: p.ml }); });
  var sSpec = 35 * accs.reduce(function (a, b) { return a + b; }, 0) / (accs.length + extras.length * 0.7);
  /* technique */
  var tc = techCheck(P.techSel), groups = r.t.length, sat = groups - tc.miss.length;
  var sSel = clamp(10 * sat / groups - 3 * tc.extra.length - (P.vesselOK === false || validVessels(r).indexOf(P.vessel) < 0 ? 3 : 0) - (P.mode === 'guided' ? 2 * Math.max(0, P.tTries + P.vTries - 0) : 0), 0, 10);
  tc.miss.forEach(function (g) { issues.push('🛠 ' + (lang === 'ko' ? '빠진 기법: ' : 'Missing technique: ') + g.map(function (k) { return esc(L(BAR.TECH[k].n)); }).join(' / ')); });
  tc.extra.forEach(function (k) { issues.push('🛠 ' + (lang === 'ko' ? '불필요한 기법: ' : 'Unneeded technique: ') + esc(L(BAR.TECH[k].n))); });
  if (validVessels(r).indexOf(P.vessel) < 0) issues.push('🥤 ' + (lang === 'ko' ? '도구: ' : 'Vessel: ') + esc(L(BAR.VESSEL[P.vessel])) + ' → ' + validVessels(r).map(function (v) { return esc(L(BAR.VESSEL[v])); }).join(' / '));
  var qs = [], dil = 'ok', mt = mainTech(r);
  ['shake', 'stir', 'dry', 'blend'].forEach(function (k) { if (res[k] != null) { var q = quality(res[k], WIN[k][0], WIN[k][1]); qs.push(q); if (k !== 'dry') { if (res[k] < WIN[k][0] * 0.75) dil = 'under'; else if (res[k] > WIN[k][1] * 1.35) dil = 'over'; }
    if (q < 0.95) issues.push('⏱ ' + esc(L(BAR.TECH[k].n)) + ': ' + res[k].toFixed(1) + 's (' + (lang === 'ko' ? '목표 ' : 'aim ') + WIN[k][0] + '–' + WIN[k][1] + 's)'); } });
  if (res.muddle != null) { var mq = res.muddle > 10 ? 0.4 : res.muddle < 3 ? 0.6 : 1; qs.push(mq); if (res.muddle > 10 && U.mint) tasteK.push('bitter'); }
  if (res.build != null) qs.push(res.build > 5 && P.topQ && P.topQ.some(function (q) { return CARB[q.id]; }) ? 0.6 : 1);
  if (res.lift != null) { qs.push(res.lift > 3 ? 0.4 : 1); if (res.lift > 3) tasteK.push('flat'); }
  if (res.layerQ) { res.layerQ.forEach(function (q) { qs.push(q); }); if (res.layerQ.some(function (q) { return q === 0; })) tasteK.push('layer'); }
  if (res.rinse) qs.push(1);
  var chilledByMix = res.shake != null || res.stir != null || res.blend != null;
  if (sv.i[0] === 'none' && sv.c !== 'hot' && !chilledByMix) { dil = 'warm'; tasteK.push('warm'); qs.push(0); }
  var sExec = 10 * (qs.length ? qs.reduce(function (a, b) { return a + b; }, 0) / qs.length : 0.5);
  if (dil === 'under') tasteK.push('hot'); if (dil === 'over') tasteK.push('watery');
  if (mt === 'stir' && res.shake != null && r.t.every(function (g) { return g.indexOf('shake') < 0; })) tasteK.push('cloudy');
  if (mt === 'shake' && res.shake == null) tasteK.push('dense');
  if (U.egg && res.shake != null && res.dry == null) tasteK.push('nofoam');
  /* balance */
  var expFr = { shake: .25, stir: .2, blend: .3, build: .08 }[mt];
  var uFr = res.shake != null ? dilFrac('shake', res.shake) : res.stir != null ? dilFrac('stir', res.stir) : res.blend != null ? .3 : (P.ice !== 'none' ? .08 : 0);
  var su = totals(userList, 0), ss = totals(specList, 0); su.v += su.v * uFr; ss.v += ss.v * expFr;
  if (ss.so > 1 && su.so > 0.1) { var rr = (su.sw / su.so) / (ss.sw / ss.so); if (rr > 1.3) tasteK.push('sweet'); else if (rr < 0.77) tasteK.push('sour'); }
  else if (ss.sw > 0.5 && su.v > 0) { var cr = (su.sw / su.v) / (ss.sw / ss.v); if (cr > 1.4) tasteK.push('sweet'); else if (cr < 0.6) tasteK.push('dry'); }
  if (ss.al > 0 && su.v > 0) { var ar = (su.al / su.v) / (ss.al / ss.v); if (ar > 1.18) tasteK.push('strong'); else if (ar < 0.8 && tasteK.indexOf('watery') < 0) tasteK.push('weak'); }
  if (res.flat && tasteK.indexOf('flat') < 0) tasteK.push('flat');
  /* garnish */
  var gc = garnCheck(); var sGarn = gc.score - (P.mode === 'guided' ? Math.max(0, P.nTries) * 2 : 0); sGarn = clamp(sGarn, 0, 10);
  gc.msgs.forEach(function (m) { issues.push('🍋 ' + m); });
  if (P.issues.indexOf('spill') >= 0) issues.push('💧 ' + (lang === 'ko' ? '지거를 넘치게 따랐어요' : 'Overfilled the jigger'));
  if (P.issues.indexOf('overflow') >= 0) issues.push('💧 ' + (lang === 'ko' ? '잔이 넘쳤어요' : 'The glass overflowed'));
  /* speed */
  var nI = r.x.length, par = 22 + 7 * nI + (mt === 'shake' ? 8 : mt === 'stir' ? 14 : mt === 'blend' ? 8 : 3) + (r.t.length - 1) * 6;
  if (P.mode === 'guided') par *= 1.8;
  var sSpeed = elapsed <= par ? 10 : clamp(10 * (1 - (elapsed - par) / (par * 1.2)), 0, 10);
  var spill = (P.issues.indexOf('spill') >= 0 ? 1 : 0) + (P.issues.indexOf('overflow') >= 0 ? 1 : 0);
  var total = Math.round(clamp(sGlass + sIce + sSpec + sSel + sExec + sGarn + sSpeed - spill, 0, 100));
  /* taste line */
  var uniq = []; tasteK.forEach(function (k) { if (uniq.indexOf(k) < 0) uniq.push(k); });
  var lines = uniq.slice(0, 2).map(function (k) { return L(TASTE[k]); });
  if (!lines.length) lines = [L(total >= 90 ? TASTE.perfect : TASTE.good)];
  var R = { total: total, parts: [[t('lGlass'), sGlass, 15], [t('lIce'), sIce, 10], [lang === 'ko' ? '스펙 정확도' : 'Spec accuracy', sSpec, 35], [lang === 'ko' ? '기법 선택' : 'Technique choice', sSel, 10], [lang === 'ko' ? '희석·온도·실행' : 'Dilution, temp & execution', sExec, 10], [t('lGarn'), sGarn, 10], [lang === 'ko' ? '속도' : 'Speed', sSpeed, 10]],
    lines: lines, issues: issues, elapsed: elapsed, par: par };
  recordResult(R);
  P.step = 'result'; P.R = R;
  if (P.mode === 'rush') { rushServed(R); return; }
  resultView(R);
}
function gradeOf(s) { return s >= 90 ? ['S', ['바에 내도 돼요!', 'Ready for the bar!']] : s >= 75 ? ['A', ['훌륭해요', 'Great work']] : s >= 60 ? ['B', ['괜찮아요, 조금만 더', 'Decent, keep going']] : ['C', ['다시 연습해요', 'Practise again']]; }
function recordResult(R) {
  var r = P.r, m = P.mode, s = R.total;
  S.served = (S.served || 0) + 1;
  S.best[r.id] = S.best[r.id] || {}; var key = m === 'guided' ? 'g' : 'b'; if (!(S.best[r.id][key] >= s)) S.best[r.id][key] = s;
  if (P.extra.fam) { var c = S.ch[P.extra.fam] = S.ch[P.extra.fam] || {}; c[key] = c[key] || {}; if (!(c[key][r.id] >= s)) c[key][r.id] = s; }
  var srs = S.srs[r.id] = S.srs[r.id] || { box: 0, due: 0 };
  if (s < 75) { srs.box = 0; srs.due = Date.now(); S.mist[r.id] = R.issues.slice(0, 6).map(function (x) { return x.replace(/<[^>]+>/g, ''); }); }
  else if (m !== 'guided' && s >= 85) { srs.box = Math.min(5, srs.box + 1); srs.due = Date.now() + [0, 6e5, 864e5, 2592e5, 6048e5, 18144e5][srs.box]; if (S.mist[r.id] && s >= 90) delete S.mist[r.id]; }
  S.disc[r.id] = S.disc[r.id] || 'made';
  save();
  addXP(s * (m === 'guided' ? 0.25 : m === 'blind' ? 0.45 : 0.35));
}
function resultView(R) {
  var g = gradeOf(R.total), r = P.r;
  (R.total >= 75 ? AUD.good : AUD.bad)(); if (R.total >= 90) AUD.fanfare();
  panel('<div class="result"><div class="grade g' + g[0] + '">' + g[0] + '</div><div class="rs-t"><div class="rs-score">' + R.total + '<small>/100</small></div><div>' + esc(L(g[1])) + ' · ⏱ ' + Math.round(R.elapsed) + 's</div></div></div>' +
    '<div class="guest"><div class="lab">🗣 ' + t('guest') + '</div><p>“' + R.lines.map(esc).join(' ') + '”</p></div>' +
    '<div class="bars">' + R.parts.map(function (p) { return '<div class="bar-row"><span>' + esc(p[0]) + '</span><div class="bar"><i style="width:' + (p[1] / p[2] * 100) + '%"></i></div><b>' + Math.round(p[1]) + '/' + p[2] + '</b></div>'; }).join('') + '</div>' +
    (R.issues.length ? '<div class="issues"><div class="lab">' + t('fix') + '</div><ul>' + R.issues.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul></div>' : '') +
    '<details class="specd" ' + (R.total < 75 ? 'open' : '') + '><summary>' + t('specCard') + '</summary>' + specCardHTML(r) + '</details>' +
    '<div class="row wrap"><button class="btn" id="ag">' + t('again') + '</button>' + (P.mode === 'guided' ? '<button class="btn gold" id="bl">' + t('blind') + ' →</button>' : '') + '<button class="btn primary" id="mn" data-enter>' + t('menu') + '</button></div>');
  renderedAt = now();
  $('#ag').onclick = function () { startPractice(r.id, P.mode, P.extra); };
  if ($('#bl')) $('#bl').onclick = function () { startPractice(r.id, 'blind', P.extra); };
  $('#mn').onclick = function () { if (!guardOK()) return; if (P.extra.fam) go(chapter, P.extra.fam); else go(freePick); };
  var sc = $('#scene'); if (sc) sc.scrollIntoView({ block: 'start' });
}

/* ======================================================================
   SCREENS
   ====================================================================== */
function famOf(id) { return BAR.FAM.filter(function (f) { return f.id === id; })[0]; }
function recsOf(fid) { return BAR.REC.filter(function (r) { return r.f === fid; }); }
function home() {
  var r = rankOf(S.xp), nx = BAR.RANKS[r + 1], pct = nx ? (S.xp - BAR.RANKS[r].xp) / (nx.xp - BAR.RANKS[r].xp) * 100 : 100;
  var due = BAR.REC.filter(function (x) { var s = S.srs[x.id]; return s && s.due <= Date.now(); }).length;
  var tiles = [['academy', '📚', academy], ['free', '🍸', freePick], ['rush', '🔥', rushIntro], ['lab', '⚗️', lab], ['dex', '🗂️', dex], ['lib', '📖', library], ['taste', '🥃', tasting], ['quiz', '❓', quizHome]];
  view('<section class="hero"><div class="neon">' + t('title') + '</div><p class="tagline">' + t('tag') + '</p></section>' +
    '<div class="rankcard"><div><div class="lab">' + t('rank') + '</div><div class="rk-n">' + esc(L(BAR.RANKS[r].n)) + '</div><div class="muted">' + esc(L(BAR.RANKS[r].d)) + '</div></div><div class="rk-r"><div class="bar"><i style="width:' + pct + '%"></i></div><div class="muted">' + S.xp + ' XP' + (nx ? ' → ' + esc(L(nx.n)) + ' ' + nx.xp : '') + '</div></div></div>' +
    '<div class="tiles">' + tiles.map(function (x) { return '<button class="tile" data-k="' + x[0] + '"><span class="ti">' + x[1] + '</span><span class="tt">' + t(x[0]) + (x[0] === 'dex' && due ? ' <em class="pill">' + due + '</em>' : '') + '</span><span class="td">' + t(x[0] + 'D') + '</span></button>'; }).join('') + '</div>' +
    '<div class="stats"><span>🍹 ' + (S.served || 0) + (lang === 'ko' ? '잔 서빙' : ' served') + '</span><span>🔓 ' + Object.keys(S.disc).length + '/' + BAR.REC.length + (lang === 'ko' ? ' 레시피' : ' recipes') + '</span><span>🔥 $' + (S.rush.best || 0) + (lang === 'ko' ? ' 최고 팁' : ' best tips') + '</span></div>' +
    '<p class="respons">' + t('respons') + '</p>');
  [].forEach.call(document.querySelectorAll('.tile'), function (b) { b.onclick = function () { AUD.tap(); var k = b.getAttribute('data-k'); tiles.forEach(function (x) { if (x[0] === k) go(x[2]); }); }; });
}
function academy() {
  view(head(t('academy'), null, lang === 'ko' ? '템플릿 6–8개만 익히면 수백 가지 칵테일이 열려요. 각 장: 레슨 → 가이드 연습 → 블라인드 → 퀴즈.' : 'Learn 6–8 templates and hundreds of drinks open up. Each chapter: lesson → guided → blind → quiz.') +
    '<div class="chapters">' + BAR.FAM.map(function (f, i) {
      var rs = recsOf(f.id), c = S.ch[f.id] || {}, g = rs.filter(function (r) { return (c.g || {})[r.id] >= 75; }).length, b = rs.filter(function (r) { return (c.b || {})[r.id] >= 75; }).length;
      var prog = ((c.lesson ? 1 : 0) + g / rs.length + b / rs.length + (c.q >= 4 ? 1 : 0)) / 4;
      return '<button class="chap" data-f="' + f.id + '"><span class="cnum2">' + (i + 1) + '</span><span class="ci">' + f.icon + '</span><span class="cbody"><span class="ct">' + esc(L(f.n)) + '</span><span class="cd">' + esc(L(f.tpl)) + '</span><span class="bar"><i style="width:' + (prog * 100) + '%"></i></span></span></button>'; }).join('') + '</div>');
  bindBack(function () { go(home); });
  [].forEach.call(document.querySelectorAll('.chap'), function (b) { b.onclick = function () { AUD.tap(); go(chapter, b.getAttribute('data-f')); }; });
}
function chapter(fid) {
  var f = famOf(fid), rs = recsOf(fid), c = S.ch[fid] || {};
  view(head(f.icon + ' ' + esc(L(f.n))) + '<div class="tpl"><div class="lab">' + (lang === 'ko' ? '템플릿' : 'Template') + '</div><div class="tpl-t">' + esc(L(f.tpl)) + '</div></div>' +
    '<div class="steps4"><button class="btn ' + (c.lesson ? 'ok' : 'gold') + '" id="les">① ' + t('lesson') + (c.lesson ? ' ✓' : '') + '</button><button class="btn ' + (c.q >= 4 ? 'ok' : '') + '" id="cq">④ ' + t('quiz') + (c.q != null ? ' ' + c.q + '/5' : '') + '</button></div>' +
    '<div class="reclist">' + rs.map(function (r) { var g = (c.g || {})[r.id], b = (c.b || {})[r.id];
      return '<div class="rec"><div class="rec-l"><span class="rec-n">' + esc(L(r.n)) + '</span><span class="muted">' + '★'.repeat(r.lv) + ' · ' + esc(L(BAR.GLASS[r.s[0].g[0]].n)) + '</span></div><div class="rec-b"><button class="btn small" data-g="' + r.id + '">② ' + t('guided') + (g != null ? ' <em>' + g + '</em>' : '') + '</button><button class="btn small gold" data-b="' + r.id + '">③ ' + t('blind') + (b != null ? ' <em>' + b + '</em>' : '') + '</button></div></div>'; }).join('') + '</div>');
  bindBack(function () { go(academy); });
  $('#les').onclick = function () { go(lesson, fid, 0); };
  $('#cq').onclick = function () { go(quizRun, chapterQuiz(fid), L(f.n), function (sc) { c = S.ch[fid] = S.ch[fid] || {}; if (!(c.q >= sc)) c.q = sc; save(); go(chapter, fid); }); };
  [].forEach.call(document.querySelectorAll('[data-g]'), function (b) { b.onclick = function () { startPractice(b.getAttribute('data-g'), 'guided', { fam: fid }); }; });
  [].forEach.call(document.querySelectorAll('[data-b]'), function (b) { b.onclick = function () { startPractice(b.getAttribute('data-b'), 'blind', { fam: fid }); }; });
}
function lesson(fid, i) {
  var f = famOf(fid), c = f.lesson[i], last = i === f.lesson.length - 1;
  view(head(f.icon + ' ' + esc(L(f.n)) + ' · ' + t('lesson')) + '<div class="lcard"><div class="lc-k">' + (i + 1) + ' / ' + f.lesson.length + '</div><h3>' + esc(lang === 'ko' ? c[0] : c[1]) + '</h3><p>' + esc(lang === 'ko' ? c[2] : c[3]) + '</p></div>' +
    (last ? '<div class="lcard"><h3>' + (lang === 'ko' ? '이 장의 레시피' : 'Recipes in this chapter') + '</h3><p>' + recsOf(fid).map(function (r) { return esc(L(r.n)); }).join(' · ') + '</p></div>' : '') +
    '<div class="row"><button class="btn ghost" id="pv" ' + (i ? '' : 'disabled') + '>‹</button><button class="btn primary" id="nx" data-enter>' + (last ? (lang === 'ko' ? '레슨 완료 ✓' : 'Lesson done ✓') : t('next')) + '</button></div>');
  bindBack(function () { go(chapter, fid); });
  $('#pv').onclick = function () { if (i) go(lesson, fid, i - 1); };
  $('#nx').onclick = function () { if (!guardOK()) return; AUD.tap(); if (last) { var c2 = S.ch[fid] = S.ch[fid] || {}; if (!c2.lesson) { c2.lesson = 1; save(); addXP(30); } go(chapter, fid); } else go(lesson, fid, i + 1); };
}
function freePick() {
  view(head(t('free'), null, lang === 'ko' ? '가이드로 익히고 블라인드로 외워요.' : 'Learn with guided, lock it in with blind.') + BAR.FAM.map(function (f) {
    return '<h3 class="fam-h">' + f.icon + ' ' + esc(L(f.n)) + '</h3><div class="reclist">' + recsOf(f.id).map(function (r) { var b = S.best[r.id] || {};
      return '<div class="rec"><div class="rec-l"><span class="rec-n">' + esc(L(r.n)) + '</span><span class="muted">' + '★'.repeat(r.lv) + '</span></div><div class="rec-b"><button class="btn small" data-g="' + r.id + '">' + t('guided') + (b.g != null ? ' <em>' + b.g + '</em>' : '') + '</button><button class="btn small gold" data-b="' + r.id + '">' + t('blind') + (b.b != null ? ' <em>' + b.b + '</em>' : '') + '</button></div></div>'; }).join('') + '</div>'; }).join(''));
  bindBack(function () { go(home); });
  [].forEach.call(document.querySelectorAll('[data-g]'), function (b) { b.onclick = function () { startPractice(b.getAttribute('data-g'), 'guided'); }; });
  [].forEach.call(document.querySelectorAll('[data-b]'), function (b) { b.onclick = function () { startPractice(b.getAttribute('data-b'), 'blind'); }; });
}

/* ---------- QUIZ ENGINE ---------- */
function normQ(q) { return { q: [q[0], q[1]], o: q[2].map(function (x, i) { return [x, q[3][i]]; }), a: q[4], e: [q[5], q[6]] }; }
function genQ(r, type) {
  var nm = L(r.n);
  if (type === 'glass') {
    var right = r.s[0].g[0], all = [].concat.apply([], r.s.map(function (s) { return s.g; }));
    var wrong = shuffle(BAR.GLASS_ORDER.filter(function (g) { return all.indexOf(g) < 0; })).slice(0, 3);
    var opts = shuffle([right].concat(wrong));
    return { q: [nm + '에 가장 알맞은 글라스는?', 'Which glass suits a ' + r.n[1] + '?'], o: opts.map(function (g) { return BAR.GLASS[g].n; }), a: opts.indexOf(right), e: BAR.GLASS[right].why };
  }
  if (type === 'method') {
    var m = mainTech(r); if (r.t.some(function (g) { return g.length > 1; })) return null;
    var o2 = ['shake', 'stir', 'build', 'blend'];
    return { q: [nm + '은(는) 어떻게 만들까요?', 'How is a ' + r.n[1] + ' made?'], o: o2.map(function (k) { return BAR.TECH[k].n; }), a: o2.indexOf(m),
      e: [{ shake: '시트러스·크림·달걀이 들어가면 흔들어요.', stir: '스피릿 위주의 술은 저어서 투명하고 매끈하게.', build: '서빙 잔에 바로 빌드해요.', blend: '얼음과 함께 블렌드해요.' }[m] + ' ' + r.note[0], { shake: 'Citrus, cream or egg means shake.', stir: 'Spirit-forward drinks are stirred for clarity.', build: 'Built straight in the glass.', blend: 'Blended with ice.' }[m] + ' ' + r.note[1]] };
  }
  if (type === 'missing') {
    var xs = r.x.filter(function (x) { var k = kindOf(x); return k !== 'dash' && k !== 'rinse'; }); if (xs.length < 3) return null;
    var mi = (Math.random() * xs.length) | 0, miss = xs[mi][0].split('|')[0], rest = xs.filter(function (_, i) { return i !== mi; }).map(function (x) { return x[0].split('|')[0]; });
    var pool = shuffle(Object.keys(BAR.ING).filter(function (id) { return r.x.every(function (x) { return x[0].split('|').indexOf(id) < 0; }) && id !== 'absinthe'; }));
    var same = pool.filter(function (id) { return BAR.ING[id][7] === BAR.ING[miss][7]; }), w2 = same.concat(pool.filter(function (id) { return same.indexOf(id) < 0; })).slice(0, 3);
    var op = shuffle([miss].concat(w2));
    return { q: [nm + ' = ' + rest.map(function (id) { return BAR.ING[id][0]; }).join(' + ') + ' + ?', r.n[1] + ' = ' + rest.map(function (id) { return BAR.ING[id][1]; }).join(' + ') + ' + ?'], o: op.map(function (id) { return [BAR.ING[id][0], BAR.ING[id][1]]; }), a: op.indexOf(miss),
      e: ['정확한 스펙: ' + r.x.map(function (x) { return BAR.ING[x[0].split('|')[0]][0] + ' ' + x[1]; }).join(', '), 'Spec: ' + r.x.map(function (x) { return BAR.ING[x[0].split('|')[0]][1] + ' ' + x[1]; }).join(', ')] };
  }
  if (type === 'amount') {
    var ml = r.x.filter(function (x) { return kindOf(x) === 'ml'; }); if (!ml.length) return null;
    var x = rnd(ml), id = x[0].split('|')[0], vals = [7.5, 10, 15, 20, 22.5, 25, 30, 45, 50, 60].filter(function (v) { return v !== x[1]; });
    vals.sort(function (a, b) { return Math.abs(a - x[1]) - Math.abs(b - x[1]); }); var op2 = shuffle([x[1]].concat(shuffle(vals.slice(0, 5)).slice(0, 3)));
    return { q: [nm + '에 들어가는 ' + BAR.ING[id][0] + '의 양은?', 'How much ' + BAR.ING[id][1].toLowerCase() + ' goes into a ' + r.n[1] + '?'], o: op2.map(function (v) { return v + 'ml (' + oz(v) + ')'; }), a: op2.indexOf(x[1]),
      e: ['전체 스펙: ' + r.x.map(function (y) { return BAR.ING[y[0].split('|')[0]][0] + ' ' + y[1]; }).join(', '), 'Full spec: ' + r.x.map(function (y) { return BAR.ING[y[0].split('|')[0]][1] + ' ' + y[1]; }).join(', ')] };
  }
  return null;
}
function autoQs(recs, n) { var out = [], tries = 0, types = ['glass', 'method', 'missing', 'amount']; while (out.length < n && tries++ < 60) { var q = genQ(rnd(recs), rnd(types)); if (q) out.push(q); } return out; }
function chapterQuiz(fid) { var hand = shuffle(BAR.QUIZ.filter(function (q) { return q[7] === fid; })).slice(0, 2).map(normQ); return shuffle(autoQs(recsOf(fid), 5 - hand.length).concat(hand)); }
function quizHome() {
  var qs = shuffle(BAR.QUIZ.map(normQ)).slice(0, 5).concat(autoQs(BAR.REC, 5));
  go(quizRun, shuffle(qs), t('quiz'), function (sc) { if (!(S.quiz >= sc)) S.quiz = sc; save(); go(home); });
}
function quizRun(qs, title, done) {
  var i = 0, score = 0;
  function show() {
    var q = qs[i];
    view(head('❓ ' + esc(title)) + '<div class="qprog">' + (i + 1) + ' / ' + qs.length + ' · ✔ ' + score + '</div><div class="qcard"><p class="qq">' + esc(L(q.q)) + '</p><div class="qopts">' +
      q.o.map(function (o, k) { return '<button class="qopt" data-k="' + k + '">' + esc(L(o)) + '</button>'; }).join('') + '</div><div id="qfb"></div></div>');
    bindBack(function () { go(home); });
    var locked = false;
    [].forEach.call(document.querySelectorAll('.qopt'), function (b) {
      b.onclick = function () {
        if (locked) return; locked = true; var k = +b.getAttribute('data-k'), ok = k === q.a;
        [].forEach.call(document.querySelectorAll('.qopt'), function (x, j) { x.disabled = true; if (j === q.a) x.classList.add('right'); });
        if (ok) { score++; AUD.good(); b.classList.add('right'); $('#qfb').innerHTML = '<div class="fb ok"><b>' + t('correct') + '</b> ' + esc(L(q.e)) + '</div>'; }
        else { AUD.bad(); b.classList.add('wrongc'); $('#qfb').innerHTML = '<div class="fb bad"><b>' + t('wrong') + '</b> — ' + t('answer') + '<b>' + esc(L(q.o[q.a])) + '</b><br>' + esc(L(q.e)) + '</div>'; }
        $('#qfb').innerHTML += '<button class="btn primary wide" id="qn" data-enter>' + (i + 1 < qs.length ? t('next') : (lang === 'ko' ? '결과 보기' : 'See results')) + '</button>';
        renderedAt = now();
        $('#qn').onclick = function () { if (!guardOK()) return; i++; if (i < qs.length) show(); else end(); };
      };
    });
  }
  function end() {
    addXP(score * 10);
    view(head('❓ ' + esc(title)) + '<div class="qcard center"><div class="grade g' + (score >= qs.length * .9 ? 'S' : score >= qs.length * .7 ? 'A' : score >= qs.length * .5 ? 'B' : 'C') + '">' + score + '/' + qs.length + '</div><p>' + (score === qs.length ? (lang === 'ko' ? '만점! 바 뒤에 설 준비가 됐어요.' : 'Perfect! Ready to stand behind the bar.') : (lang === 'ko' ? '틀린 문제는 도서관과 도감에서 복습해요.' : 'Review the misses in the library and dex.')) + '</p><button class="btn primary wide" id="qd" data-enter>' + t('cont') + '</button></div>');
    bindBack(function () { done(score); });
    $('#qd').onclick = function () { if (guardOK()) done(score); };
  }
  show();
}

/* ---------- RUSH ---------- */
var RU = null, rushInt = null;
function stopRushTimers() { clearInterval(rushInt); rushInt = null; }
function rushIntro() {
  stopRushTimers();
  view(head('🔥 ' + t('rush'), null, lang === 'ko' ? '금요일 밤 10시, 손님이 몰려와요. 티켓 6장이 차례로 들어오고, 손님마다 인내심이 줄어들어요. 블라인드로 만들고, 막히면 레시피를 볼 수 있지만 팁이 줄어요. 정확하고 빠를수록 팁이 커져요.' : 'Friday, 10 pm, the crowd arrives. Six tickets come in one after another and every guest’s patience drains. Make them blind; peeking at a spec costs tip. Accuracy and speed earn the big tips.') +
    '<div class="lcard"><p>🏆 ' + (lang === 'ko' ? '최고 팁: $' : 'Best night: $') + (S.rush.best || 0) + '<br>💰 ' + (lang === 'ko' ? '누적 팁: $' : 'Lifetime tips: $') + (S.rush.total || 0) + '</p></div><button class="btn primary wide" id="go" data-enter>' + (lang === 'ko' ? '영업 시작 ▶' : 'Open the bar ▶') + '</button>');
  bindBack(function () { go(home); });
  $('#go').onclick = function () { if (!guardOK()) return; startRush(); };
}
function pickRushRec() { var w = BAR.REC.filter(function (r) { return r.lv <= (RU && RU.spawned > 2 ? 3 : 2); }); return rnd(w).id; }
function startRush() {
  RU = { queue: [], spawned: 0, total: 6, done: [], tips: 0, next: now() + 20000 };
  for (var i = 0; i < 2; i++) spawnTicket();
  rushInt = setInterval(rushTick, 500); go(rushBoard);
}
function spawnTicket() { RU.spawned++; RU.queue.push({ id: RU.spawned, rid: pickRushRec(), born: now(), pat: 170000 }); AUD.tap(); }
function rushTick() {
  if (!RU) return;
  if (RU.spawned < RU.total && now() > RU.next) { spawnTicket(); RU.next = now() + 18000 + Math.random() * 12000; toast('🔔 ' + (lang === 'ko' ? '새 주문!' : 'New order!'), 1200); }
  RU.queue = RU.queue.filter(function (q) { if (now() - q.born > q.pat) { RU.done.push({ rid: q.rid, tip: 0, score: 0, left: true }); toast('😤 ' + (lang === 'ko' ? '손님이 기다리다 떠났어요' : 'A guest gave up and left'), 1600); return false; } return true; });
  drawRushQ();
  if (cur && cur.fn === rushBoard) { rushBoardList(); if (RU.done.length >= RU.total) rushEnd(); }
}
function patBar(q) { var f = clamp(1 - (now() - q.born) / q.pat, 0, 1); return '<span class="pat"><i style="width:' + (f * 100) + '%;background:' + (f > .5 ? '#7fd36a' : f > .25 ? '#f2c14e' : '#e5533d') + '"></i></span>'; }
function drawRushQ() {
  var el = $('#rushq'); if (!el || !RU) return;
  var act = P && P.extra.ticket ? '<span class="rq act">▶ ' + esc(L(BAR.RMAP[P.extra.ticket.rid].n)) + patBar(P.extra.ticket) + '</span>' : '';
  el.innerHTML = act + RU.queue.map(function (q) { return '<span class="rq">' + esc(L(BAR.RMAP[q.rid].n)) + patBar(q) + '</span>'; }).join('') + '<span class="rq tips">💰 $' + RU.tips + ' · ' + RU.done.length + '/' + RU.total + '</span>';
}
function rushBoard() {
  view(head('🔥 ' + t('rush')) + '<div id="rb"></div>');
  bindBack(function () { stopRushTimers(); RU = null; go(rushIntro); });
  rushBoardList();
  if (RU.done.length >= RU.total) rushEnd();
}
function rushBoardList() {
  var el = $('#rb'); if (!el) return;
  el.innerHTML = '<div class="tipbox">💰 $' + RU.tips + ' · ' + (lang === 'ko' ? '처리 ' : 'done ') + RU.done.length + '/' + RU.total + '</div>' +
    (RU.queue.length ? '<p class="hint">' + (lang === 'ko' ? '만들 티켓을 고르세요. 인내심이 적은 손님부터!' : 'Pick a ticket. Least patient guests first!') + '</p>' : '<p class="hint">' + (lang === 'ko' ? '다음 주문을 기다리는 중… 🎷' : 'Waiting for the next order… 🎷') + '</p>') +
    '<div class="tickets">' + RU.queue.map(function (q) { var r = BAR.RMAP[q.rid]; return '<button class="ticket" data-q="' + q.id + '"><span class="tk-n">' + esc(L(r.n)) + '</span><span class="muted">$' + r.p + ' · ' + '★'.repeat(r.lv) + '</span>' + patBar(q) + '</button>'; }).join('') + '</div>' +
    (RU.done.length ? '<ul class="donelist">' + RU.done.map(function (d) { return '<li>' + esc(L(BAR.RMAP[d.rid].n)) + ' — ' + (d.left ? '😤' : d.score + (lang === 'ko' ? '점 · 팁 $' : ' pts · tip $') + d.tip) + '</li>'; }).join('') + '</ul>' : '');
  [].forEach.call(document.querySelectorAll('.ticket'), function (b) { b.onclick = function () {
    var id = +b.getAttribute('data-q'), q = RU.queue.filter(function (x) { return x.id === id; })[0]; if (!q) return;
    RU.queue = RU.queue.filter(function (x) { return x.id !== id; }); startPractice(q.rid, 'rush', { ticket: q }); P.step = 'glass'; P.t0 = now(); startTimer(); step('glass'); }; });
}
function rushServed(R) {
  var q = P.extra.ticket, r = P.r, f = 1 - (now() - q.born) / q.pat, left = f <= 0;
  var tip = left ? 0 : Math.round(r.p * Math.pow(R.total / 100, 1.5) * (f > .5 ? 1.2 : .8) * (P.peeked ? .7 : 1) * 2) / 2;
  RU.tips = Math.round((RU.tips + tip) * 10) / 10; RU.done.push({ rid: r.id, tip: tip, score: R.total, left: left });
  if (tip > 0) AUD.cash(); else AUD.bad();
  P.rushInfo = { tip: tip, left: left }; rushServedView();
}
function rushServedView() {
  var R = P.R, tip = P.rushInfo.tip, left = P.rushInfo.left;
  var g = gradeOf(R.total);
  panel('<div class="result"><div class="grade g' + g[0] + '">' + g[0] + '</div><div class="rs-t"><div class="rs-score">' + R.total + '<small>/100</small></div><div>' + (left ? (lang === 'ko' ? '손님이 이미 떠났어요…' : 'The guest already left…') : '💰 ' + (lang === 'ko' ? '팁 $' : 'Tip $') + tip) + '</div></div></div>' +
    '<div class="guest"><div class="lab">🗣 ' + t('guest') + '</div><p>“' + R.lines.map(esc).join(' ') + '”</p></div>' +
    (R.issues.length ? '<div class="issues"><ul>' + R.issues.slice(0, 5).map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul></div>' : '') +
    '<button class="btn primary wide" id="nb" data-enter>' + (lang === 'ko' ? '티켓 보드로 →' : 'Back to the tickets →') + '</button>');
  renderedAt = now(); drawRushQ();
  $('#nb').onclick = function () { if (!guardOK()) return; P = null; go(rushBoard); };
}
function rushEnd() {
  stopRushTimers(); if (!RU || RU.ended) return; RU.ended = true;
  var served = RU.done.filter(function (d) { return !d.left; }), avg = served.length ? Math.round(served.reduce(function (s, d) { return s + d.score; }, 0) / served.length) : 0;
  var newBest = RU.tips > (S.rush.best || 0); if (newBest) S.rush.best = RU.tips; S.rush.total = Math.round(((S.rush.total || 0) + RU.tips) * 10) / 10; save(); addXP(RU.tips * 4);
  AUD.fanfare();
  view(head('🔥 ' + t('rush')) + '<div class="qcard center"><div class="fan-ic">🌙</div><h3>' + (lang === 'ko' ? '영업 종료!' : 'Last call!') + '</h3><div class="rs-score">$' + RU.tips + '</div><p>' + (lang === 'ko' ? '평균 점수 ' : 'Average score ') + avg + ' · ' + served.length + '/' + RU.total + (lang === 'ko' ? ' 서빙' : ' served') + (newBest ? '<br>🏆 ' + (lang === 'ko' ? '최고 기록!' : 'New best night!') : '') + '</p><button class="btn primary wide" id="re" data-enter>' + t('cont') + '</button></div>');
  bindBack(function () { RU = null; go(rushIntro); });
  $('#re').onclick = function () { if (!guardOK()) return; RU = null; go(rushIntro); };
}

/* ---------- DISCOVERY LAB ---------- */
var labSel = [];
function recMatch(r, sel) {
  var specs = r.x.map(function (x) { return x[0].split('|'); }), usedSel = {};
  for (var i = 0; i < specs.length; i++) { var hit = specs[i].filter(function (id) { return sel.indexOf(id) >= 0; })[0]; if (!hit) return { exact: false, diff: diffCount(specs, sel) }; usedSel[hit] = 1; }
  var extra = sel.filter(function (id) { return !usedSel[id]; }).length;
  return { exact: extra === 0, diff: extra };
}
function diffCount(specs, sel) { var miss = specs.filter(function (alts) { return !alts.some(function (id) { return sel.indexOf(id) >= 0; }); }).length; var extra = sel.filter(function (id) { return !specs.some(function (alts) { return alts.indexOf(id) >= 0; }); }).length; return miss + extra; }
function lab() {
  var cats = {}; Object.keys(BAR.ING).forEach(function (id) { var c = BAR.ING[id][7]; (cats[c] = cats[c] || []).push(id); });
  var found = BAR.REC.filter(function (r) { return S.disc[r.id] === 'lab' || S.disc[r.id] === 'made'; });
  view(head('⚗️ ' + t('lab'), null, lang === 'ko' ? '재료를 자유롭게 골라 "섞기!" 진짜 레시피와 재료 조합이 맞으면 해금돼요. (양은 신경 쓰지 말고 조합만!)' : 'Pick ingredients freely and hit Mix! If the combination matches a real recipe, it unlocks. (Just the combination, not amounts.)') +
    '<div class="labsel">' + (labSel.length ? labSel.map(function (id) { return '<button class="chip on" data-x="' + id + '">' + esc(L(BAR.ING[id])) + ' ✕</button>'; }).join('<span class="plus">+</span>') : '<span class="muted">' + (lang === 'ko' ? '재료를 골라 보세요' : 'Choose some ingredients') + '</span>') + '</div>' +
    '<div class="row"><button class="btn ghost" id="clr">↺</button><button class="btn primary" id="mix" data-enter ' + (labSel.length >= 2 ? '' : 'disabled') + '>⚗️ ' + (lang === 'ko' ? '섞기!' : 'Mix!') + '</button></div><div id="labfb"></div>' +
    BAR.CAT_ORDER.filter(function (c) { return cats[c]; }).map(function (c) { return '<div class="shelf-cat"><div class="sc-t">' + esc(L(BAR.CAT_NAME[c])) + '</div><div class="chips">' + cats[c].map(function (id) { return '<button class="chip' + (labSel.indexOf(id) >= 0 ? ' on' : '') + '" data-id="' + id + '"><span class="dot" style="background:' + BAR.ING[id][2] + '"></span>' + esc(L(BAR.ING[id])) + '</button>'; }).join('') + '</div></div>'; }).join('') +
    '<h3 class="fam-h">🔓 ' + found.length + ' / ' + BAR.REC.length + '</h3><div class="chips">' + found.map(function (r) { return '<span class="chip on">' + esc(L(r.n)) + '</span>'; }).join('') + '</div>');
  bindBack(function () { go(home); });
  [].forEach.call(document.querySelectorAll('.chip[data-id]'), function (b) { b.onclick = function () { var id = b.getAttribute('data-id'), i = labSel.indexOf(id); if (i >= 0) labSel.splice(i, 1); else labSel.push(id); AUD.tap(); var y = window.scrollY; lab(); window.scrollTo(0, y); }; });
  [].forEach.call(document.querySelectorAll('.chip[data-x]'), function (b) { b.onclick = function () { labSel.splice(labSel.indexOf(b.getAttribute('data-x')), 1); lab(); }; });
  $('#clr').onclick = function () { labSel = []; lab(); };
  $('#mix').onclick = function () {
    if (!guardOK() || labSel.length < 2) return;
    var exact = BAR.REC.filter(function (r) { return recMatch(r, labSel).exact; });
    if (exact.length) {
      var fresh = exact.filter(function (r) { return !S.disc[r.id]; });
      exact.forEach(function (r) { if (!S.disc[r.id]) S.disc[r.id] = 'lab'; }); save(); if (fresh.length) addXP(25 * fresh.length);
      AUD.fanfare();
      var eq = labSel.map(function (id) { return esc(L(BAR.ING[id])); }).join(' + ') + ' = ';
      var sibs = []; exact.forEach(function (r) { BAR.SIB.forEach(function (s) { if (s[0] === r.id) sibs.push([s[1], lang === 'ko' ? s[2] : s[3], '→']); else if (s[1] === r.id) sibs.push([s[0], lang === 'ko' ? s[2] : s[3], '←']); }); });
      var extra = (exact.length > 1 ? '<p class="fan-sub">' + (lang === 'ko' ? '같은 재료, 다른 기법·가니시로 갈라지는 형제들이에요.' : 'Same ingredients; technique or garnish tells them apart.') + '</p>' : '') +
        (sibs.length ? '<div class="sibs"><div class="lab">' + (lang === 'ko' ? '한 칸만 바꾸면…' : 'Swap one thing…') + '</div>' + sibs.map(function (s) { return '<div class="sib">' + s[2] + ' <b>' + esc(L(BAR.RMAP[s[0]].n)) + '</b>: ' + esc(s[1]) + '</div>'; }).join('') + '</div>' : '') +
        '<div class="row"><button class="btn small" id="fpg">' + t('guided') + ' ▶ ' + esc(L(exact[0].n)) + '</button></div>';
      showFanfare('🎉', fresh.length ? (lang === 'ko' ? '새 레시피 발견!' : 'New recipe discovered!') : (lang === 'ko' ? '이미 아는 레시피' : 'Already discovered'), eq + exact.map(function (r) { return esc(L(r.n)); }).join(' / ') + '!', esc(L(exact[0].note)), extra);
      var fpg = $('#fpg'); if (fpg) fpg.onclick = function () { $('#fanfare').hidden = true; startPractice(exact[0].id, 'guided'); };
      labSel = []; lab();
    } else {
      var near = BAR.REC.map(function (r) { return { r: r, d: recMatch(r, labSel).diff }; }).filter(function (x) { return x.d === 1; });
      AUD.bad();
      $('#labfb').innerHTML = '<div class="fb bad">' + (near.length ? (lang === 'ko' ? '거의 다 왔어요! 재료 하나 차이로 <b>' + esc(L(famOf(near[0].r.f).n)) + '</b> 계열 칵테일이 숨어 있어요. 하나를 빼거나 더해 보세요.' : 'So close! One ingredient away from a <b>' + esc(L(famOf(near[0].r.f).n)) + '</b> cocktail. Add or remove one.') : (lang === 'ko' ? '아는 레시피와 맞지 않아요. 템플릿을 떠올려 봐요: 스피릿 + 신맛 + 단맛 = 사워!' : 'No match. Think templates: spirit + sour + sweet = a sour!')) + '</div>';
    }
  };
}

/* ---------- DEX ---------- */
function dex() {
  var due = BAR.REC.filter(function (x) { var s = S.srs[x.id]; return s && s.due <= Date.now(); });
  var mist = Object.keys(S.mist);
  view(head('🗂️ ' + t('dex')) + '<div class="row wrap"><button class="btn gold" id="fl">🃏 ' + (lang === 'ko' ? '플래시카드' : 'Flashcards') + (due.length ? ' (' + due.length + ')' : '') + '</button><button class="btn" id="ms" ' + (mist.length ? '' : 'disabled') + '>🩹 ' + (lang === 'ko' ? '실수 복습' : 'Review mistakes') + ' (' + mist.length + ')</button></div>' +
    BAR.FAM.map(function (f) { return '<h3 class="fam-h">' + f.icon + ' ' + esc(L(f.n)) + '</h3><div class="dexgrid">' + recsOf(f.id).map(function (r) { var b = S.best[r.id] || {}, s = S.srs[r.id];
      return '<button class="dexcard' + (S.disc[r.id] ? ' got' : '') + '" data-r="' + r.id + '">' + glassIcon(r.s[0].g[0]) + '<span class="dn">' + esc(L(r.n)) + '</span><span class="muted">' + (b.b != null ? '🎯' + b.b : b.g != null ? '📘' + b.g : (S.disc[r.id] ? '🔓' : '·')) + (s ? ' · 📦' + s.box : '') + '</span></button>'; }).join('') + '</div>'; }).join(''));
  bindBack(function () { go(home); });
  $('#fl').onclick = function () { go(flash); };
  $('#ms').onclick = function () { if (mist.length) go(mistakes); };
  [].forEach.call(document.querySelectorAll('.dexcard'), function (b) { b.onclick = function () { AUD.tap(); go(recDetail, b.getAttribute('data-r')); }; });
}
function recDetail(rid) {
  var r = BAR.RMAP[rid], stories = BAR.STORY.filter(function (s) { return s.r === rid; });
  var sibs = BAR.SIB.filter(function (s) { return s[0] === rid || s[1] === rid; });
  view(head(esc(L(r.n))) + '<div class="detail"><div class="dglass">' + glassIcon(r.s[0].g[0]) + '</div>' + specCardHTML(r) + '</div>' +
    stories.map(function (s) { return '<div class="lcard"><h3>' + (s.lg ? '<span class="lg">' + (lang === 'ko' ? '전설·논쟁' : 'legend / disputed') + '</span> ' : '') + esc(L(s.t)) + '</h3><p>' + esc(L(s.b)) + '</p></div>'; }).join('') +
    (sibs.length ? '<div class="lcard"><h3>' + (lang === 'ko' ? '형제 칵테일' : 'Sibling drinks') + '</h3>' + sibs.map(function (s) { var o = s[0] === rid ? s[1] : s[0]; return '<p class="sib">' + (s[0] === rid ? '→ ' : '← ') + '<b>' + esc(L(BAR.RMAP[o].n)) + '</b>: ' + esc(lang === 'ko' ? s[2] : s[3]) + '</p>'; }).join('') + '</div>' : '') +
    '<div class="row"><button class="btn" id="pg">' + t('guided') + '</button><button class="btn gold" id="pb">' + t('blind') + '</button></div>');
  bindBack(function () { go(dex); });
  $('#pg').onclick = function () { startPractice(rid, 'guided'); };
  $('#pb').onclick = function () { startPractice(rid, 'blind'); };
}
function flash() {
  var due = BAR.REC.filter(function (x) { var s = S.srs[x.id]; return s && s.due <= Date.now(); });
  var deck = shuffle(due.length ? due : BAR.REC).slice(0, 10), i = 0, seen = 0;
  function card(flipped) {
    if (i >= deck.length) { addXP(seen * 3); view(head('🃏 ' + (lang === 'ko' ? '플래시카드' : 'Flashcards')) + '<div class="qcard center"><p>' + (lang === 'ko' ? '복습 완료! ' : 'Review done! ') + seen + (lang === 'ko' ? '장' : ' cards') + '</p><button class="btn primary wide" id="fd" data-enter>' + t('cont') + '</button></div>'); bindBack(function () { go(dex); }); $('#fd').onclick = function () { if (guardOK()) go(dex); }; return; }
    var r = deck[i];
    view(head('🃏 ' + (lang === 'ko' ? '플래시카드' : 'Flashcards') + ' · ' + (i + 1) + '/' + deck.length) + (due.length ? '' : '<p class="hint">' + (lang === 'ko' ? '복습할 카드가 없어서 랜덤 카드로 연습해요.' : 'Nothing due, so here is a random deck.') + '</p>') +
      '<div class="flashc' + (flipped ? ' flip' : '') + '"><div class="fc-front"><div class="fc-n">' + esc(L(r.n)) + '</div><p class="muted">' + (lang === 'ko' ? '글라스, 얼음, 재료와 양, 기법, 가니시를 떠올려 보세요.' : 'Recall the glass, ice, ingredients and amounts, technique and garnish.') + '</p></div>' + (flipped ? specCardHTML(r, true) : '') + '</div>' +
      (flipped ? '<div class="row wrap"><button class="btn bad" data-q="0">' + (lang === 'ko' ? '다시 😵' : 'Again 😵') + '</button><button class="btn" data-q="1">' + (lang === 'ko' ? '애매 🤔' : 'Hard 🤔') + '</button><button class="btn primary" data-q="2" data-enter>' + (lang === 'ko' ? '완벽 😎' : 'Easy 😎') + '</button></div>' : '<button class="btn primary wide" id="fp" data-enter>' + (lang === 'ko' ? '뒤집기 ↻' : 'Flip ↻') + '</button>'));
    bindBack(function () { go(dex); });
    if (!flipped) $('#fp').onclick = function () { if (guardOK()) { AUD.tap(); card(true); renderedAt = now(); } };
    else [].forEach.call(document.querySelectorAll('[data-q]'), function (b) { b.onclick = function () { if (!guardOK()) return; var q = +b.getAttribute('data-q'), s = S.srs[r.id] = S.srs[r.id] || { box: 0, due: 0 };
      if (q === 0) { s.box = 0; s.due = Date.now() + 6e4; } else if (q === 1) { s.due = Date.now() + 6e5; } else { s.box = Math.min(5, s.box + 1); s.due = Date.now() + [0, 6e5, 864e5, 2592e5, 6048e5, 18144e5][s.box]; }
      save(); seen++; i++; card(false); renderedAt = now(); }; });
  }
  card(false);
}
function mistakes() {
  var ids = Object.keys(S.mist);
  view(head('🩹 ' + (lang === 'ko' ? '실수 복습' : 'Review mistakes'), null, lang === 'ko' ? '75점 미만이었던 레시피예요. 블라인드로 90점 이상이면 목록에서 빠져요.' : 'Recipes that scored under 75. Score 90+ blind to clear them.') +
    ids.map(function (id) { var r = BAR.RMAP[id]; return '<div class="lcard"><h3>' + esc(L(r.n)) + '</h3><ul class="issues-s">' + S.mist[id].map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul><div class="row"><button class="btn small" data-g="' + id + '">' + t('guided') + '</button><button class="btn small gold" data-b="' + id + '">' + t('blind') + '</button></div></div>'; }).join(''));
  bindBack(function () { go(dex); });
  [].forEach.call(document.querySelectorAll('[data-g]'), function (b) { b.onclick = function () { startPractice(b.getAttribute('data-g'), 'guided'); }; });
  [].forEach.call(document.querySelectorAll('[data-b]'), function (b) { b.onclick = function () { startPractice(b.getAttribute('data-b'), 'blind'); }; });
}

/* ---------- LIBRARY ---------- */
var libTab = 'spirits';
function library() {
  var tabs = [['spirits', lang === 'ko' ? '스피릿' : 'Spirits'], ['whisky', lang === 'ko' ? '위스키 심화' : 'Whisky'], ['stories', lang === 'ko' ? '이야기' : 'Stories'], ['tips', lang === 'ko' ? '프로 팁' : 'Pro tips'], ['terms', lang === 'ko' ? '바 용어' : 'Bar terms']];
  var body = '';
  if (libTab === 'spirits') body = BAR.SPIRITS.map(function (s) { return '<details class="lcard sp"><summary><span class="ci">' + s.ic + '</span> ' + esc(L(s.n)) + '<span class="muted sm">' + esc(L(s.base)) + '</span></summary>' +
    [['🌍', lang === 'ko' ? '기원' : 'Origin', s.origin], ['⚙️', lang === 'ko' ? '만드는 법' : 'How it’s made', s.make], ['👅', lang === 'ko' ? '맛' : 'Flavour', s.taste], ['🏷️', lang === 'ko' ? '스타일' : 'Styles', s.styles], ['💡', lang === 'ko' ? '알쓸바잡' : 'Fun fact', s.fact]].map(function (f) { return '<p><span class="lab">' + f[0] + ' ' + f[1] + '</span><br>' + esc(L(f[2])) + '</p>'; }).join('') + '</details>'; }).join('');
  else if (libTab === 'whisky') body = BAR.WHISKY.map(function (w) { return '<div class="lcard"><h3>' + w.ic + ' ' + esc(L(w.t)) + '</h3><p>' + esc(L(w.b)) + '</p></div>'; }).join('') + '<button class="btn gold wide" id="gt">🥃 ' + t('taste') + ' →</button>';
  else if (libTab === 'stories') body = BAR.STORY.map(function (s) { return '<div class="lcard"><h3>' + (s.lg ? '<span class="lg">' + (lang === 'ko' ? '전설·논쟁' : 'legend / disputed') + '</span> ' : '') + esc(L(s.t)) + '</h3><p>' + esc(L(s.b)) + '</p></div>'; }).join('');
  else if (libTab === 'tips') body = BAR.TIPS.map(function (x, i) { return '<div class="lcard"><h3>' + (i + 1) + '. ' + esc(lang === 'ko' ? x[0] : x[1]) + '</h3><p>' + esc(lang === 'ko' ? x[2] : x[3]) + '</p></div>'; }).join('');
  else body = '<div class="terms">' + BAR.TERMS.map(function (x) { return '<div class="term"><b>' + esc(lang === 'ko' ? x[0] + ' (' + x[1] + ')' : x[1]) + '</b><span>' + esc(lang === 'ko' ? x[2] : x[3]) + '</span></div>'; }).join('') + '</div>';
  view(head('📖 ' + t('lib')) + '<div class="tabs">' + tabs.map(function (x) { return '<button class="tab' + (libTab === x[0] ? ' on' : '') + '" data-t="' + x[0] + '">' + x[1] + '</button>'; }).join('') + '</div>' + body);
  bindBack(function () { go(home); });
  [].forEach.call(document.querySelectorAll('.tab'), function (b) { b.onclick = function () { libTab = b.getAttribute('data-t'); AUD.tap(); library(); }; });
  if ($('#gt')) $('#gt').onclick = function () { go(tasting); };
}

/* ---------- WHISKY TASTING ---------- */
function tasting() {
  var deck = shuffle(BAR.TASTE).slice(0, 8), i = 0, sc = 0;
  function show() {
    var c = deck[i], opts = shuffle([c].concat(shuffle(BAR.TASTE.filter(function (x) { return x !== c; })).slice(0, 3)));
    view(head('🥃 ' + t('taste')) + '<div class="qprog">' + (i + 1) + ' / ' + deck.length + ' · ✔ ' + sc + '</div><div class="qcard nose"><div class="glencairn">' + glencairn() + '</div><p class="lab">' + (lang === 'ko' ? '테이스팅 노트' : 'Tasting notes') + '</p><p class="qq">“' + esc(L(c[2])) + '”</p><p class="muted">' + (lang === 'ko' ? '어느 지역·스타일일까요?' : 'Which region or style?') + '</p><div class="qopts">' +
      opts.map(function (o, k) { return '<button class="qopt" data-k="' + k + '">' + esc(L(o[1])) + '</button>'; }).join('') + '</div><div id="qfb"></div></div>');
    bindBack(function () { go(home); });
    var locked = false;
    [].forEach.call(document.querySelectorAll('.qopt'), function (b) { b.onclick = function () {
      if (locked) return; locked = true; var o = opts[+b.getAttribute('data-k')], ok = o === c;
      [].forEach.call(document.querySelectorAll('.qopt'), function (x, j) { x.disabled = true; if (opts[j] === c) x.classList.add('right'); });
      var info = BAR.WHISKY.filter(function (w) { return w.t[1].toLowerCase().indexOf(c[1][1].split(' ')[0].toLowerCase()) >= 0; })[0];
      if (ok) { sc++; AUD.good(); b.classList.add('right'); } else { AUD.bad(); b.classList.add('wrongc'); }
      $('#qfb').innerHTML = '<div class="fb ' + (ok ? 'ok' : 'bad') + '"><b>' + (ok ? t('correct') : t('wrong') + ' — ' + t('answer') + esc(L(c[1]))) + '</b>' + (info ? '<br>' + esc(L(info.b)).slice(0, 220) + '…' : '') + '</div><button class="btn primary wide" id="qn" data-enter>' + t('next') + '</button>';
      renderedAt = now();
      $('#qn').onclick = function () { if (!guardOK()) return; i++; if (i < deck.length) show(); else end(); };
    }; });
  }
  function end() { if (!(S.taste >= sc)) S.taste = sc; save(); addXP(sc * 8);
    view(head('🥃 ' + t('taste')) + '<div class="qcard center"><div class="rs-score">' + sc + '/' + deck.length + '</div><p>' + (lang === 'ko' ? '코가 곧 실력! 도서관의 위스키 심화 카드로 복습해요.' : 'Your nose is your skill! Review the whisky cards in the library.') + '</p><button class="btn primary wide" id="td" data-enter>' + t('cont') + '</button></div>');
    bindBack(function () { go(home); }); $('#td').onclick = function () { if (guardOK()) go(home); }; }
  show();
}
function glencairn() { return '<svg viewBox="0 0 100 120" width="70" height="84"><path d="M30 10 Q22 50 34 70 Q42 80 46 84 L46 100 L30 110 L70 110 L54 100 L54 84 Q58 80 66 70 Q78 50 70 10 Z" fill="rgba(220,240,250,.1)" stroke="rgba(235,245,250,.8)" stroke-width="2.5"/><path d="M27 50 Q30 68 38 74 Q46 80 50 80 Q54 80 62 74 Q70 68 73 50 Z" fill="#c8862e" opacity=".85"/></svg>'; }

/* ---------- AGE GATE & INIT ---------- */
function gate() {
  var g = $('#gate');
  g.innerHTML = '<div class="gate-card"><div class="neon small">' + t('title') + '</div><h2>' + esc(T.gateQ[0]) + '<br><span class="en">' + esc(T.gateQ[1]) + '</span></h2><p>' + t('gateSub') + '</p><p class="respons">' + t('respons') + '</p>' +
    '<div class="row wrap"><button class="btn primary" id="gy">' + t('gateYes') + '</button><button class="btn ghost" id="gn">' + t('gateNo') + '</button></div><div id="gbye"></div>' +
    '<div class="row"><button class="btn ghost small" id="glang">' + (lang === 'ko' ? 'English' : '한국어') + '</button></div></div>';
  g.hidden = false;
  $('#gy').onclick = function () { try { localStorage.setItem(AGEKEY, '1'); } catch (e) {} g.hidden = true; g.innerHTML = ''; go(home); };
  $('#gn').onclick = function () { $('#gbye').innerHTML = '<div class="fb bad">' + t('gateBye') + '</div><a class="btn" href="/">' + t('home') + '</a>'; };
  $('#glang').onclick = function () { lang = lang === 'ko' ? 'en' : 'ko'; save(); topbar(); gate(); };
}
function init() {
  topbar();
  $('#langBtn').onclick = function () { lang = lang === 'ko' ? 'en' : 'ko'; save(); topbar(); if (!$('#gate').hidden) gate(); else if (P && P.step && cur && cur.fn === practiceScreen) { practiceScreen(); } else rerender(); };
  $('#muteBtn').onclick = function () { S.mute = !S.mute; save(); topbar(); AUD.setMute(S.mute); if (!S.mute && live) AUD.startMusic(); };
  var ok = false; try { ok = localStorage.getItem(AGEKEY) === '1'; } catch (e) {}
  if (ok) go(home); else { view(''); gate(); }
}
init();
})();
