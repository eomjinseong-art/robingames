/* 나두게임즈 게임 가이드 렌더러 (빌드 없음)
 * - /guide/index.html  : 목록 (data/index.json)
 * - /guide/game.html?id=xxx : 게임 한 개 (data/xxx.json)
 * 도식은 모두 데이터로부터 SVG로 그림 (외부 이미지 없음). */
(function () {
  'use strict';
  var LANG_KEY = 'nadoo_lang', PKEY = 'nadoo_guide_progress_v1', DATA = '/guide/data/';
  var lang = 'ko';
  try { lang = localStorage.getItem(LANG_KEY) || ((navigator.language || 'ko').toLowerCase().indexOf('ko') === 0 ? 'ko' : 'en'); } catch (e) {}
  if (lang !== 'ko' && lang !== 'en') lang = 'ko';

  var T = {
    home: ['🏠 홈', '🏠 Home'], list: ['📚 가이드 목록', '📚 All guides'],
    gTitle: ['나두 게임 가이드', 'Nadoo Game Guide'], gSub: ['처음 하는 사람을 위한 규칙 교과서', 'Rulebooks for total beginners'],
    gIntro: ['보드게임·카드게임 규칙을 그림으로 한 판씩 따라 하며 배워요. 돈은 걸지 않아요!', 'Learn board & card games step by step with pictures. No money involved!'],
    enNote: ['', 'Guide texts are in Korean for now (menus are bilingual).'],
    board: ['보드게임', 'Board games'], card: ['카드게임', 'Card games'],
    ready: ['가이드 있음', 'Guide ready'], soon: ['준비 중', 'Coming soon'],
    solo: ['혼자 연습 가능', 'Solo practice'], kids: ['아이랑 하기 좋음', 'Great with kids'],
    order: ['추천 학습 순서 (쉬움 → 어려움)', 'Suggested learning order (easy → hard)'],
    orderNote: ['★ 개수가 적은 것부터 차례로 해 보세요. 준비 중인 게임은 곧 채워져요.', 'Start with fewer ★. Coming-soon guides will be added.'],
    cats: ['게임 고르기', 'Pick a game'], cmp: ['체스·장기·샹치·쇼기 비교표', 'Chess · Janggi · Xiangqi · Shogi compared'],
    legend: ['배지 설명', 'Badges'], players: ['명', 'p'], progress: ['진도', 'Progress'],
    s_glance: ['한눈에 보기', 'At a glance'], s_goal: ['목표 한 문장', 'Goal in one sentence'], s_setup: ['준비', 'Setup'],
    s_play: ['한 판 따라 하기', 'Play along: one game'], s_rules: ['규칙 전체와 예외 규칙', 'Full rules & exceptions'],
    s_strategy: ['초보 전략 3가지 + 자주 하는 실수', '3 beginner tips + common mistakes'], s_glossary: ['용어 사전', 'Glossary'],
    s_variants: ['한국식 vs 해외 규칙 차이', 'Korean vs international rules'], s_progress: ['내 진도 체크', 'My progress'],
    k_players: ['인원', 'Players'], k_time: ['시간', 'Time'], k_level: ['난이도', 'Difficulty'], k_mat: ['준비물', 'You need'], k_similar: ['비슷한 게임', 'Similar games'],
    basic: ['기본 규칙', 'Basic rules'], except: ['예외·헷갈리는 규칙', 'Exceptions & tricky rules'],
    tips: ['초보 전략 3가지', '3 beginner tips'], mistakes: ['자주 하는 실수', 'Common mistakes'],
    item: ['항목', 'Item'], korean: ['한국식', 'Korean'], intl: ['해외·공식', 'International'],
    saved: ['체크하면 이 기기에 자동 저장돼요.', 'Saved on this device automatically.'], reset: ['진도 지우기', 'Reset'],
    playNow: ['🤖 PC랑 게임 시작하기', '🤖 Play vs Computer'], playSub: ['가이드 읽고 바로 컴퓨터와 한 판!', 'Read the guide, then play right away!'], playGo: ['바로 하기 ▶', 'Play now ▶'], play2p: ['👥 둘이서 하기 (한 폰으로)', '👥 2 players on one device'], pc: ['PC 대국', 'vs Computer'],
    notFound: ['이 게임 가이드를 찾을 수 없어요.', 'Guide not found.'], loadErr: ['불러오기에 실패했어요. 새로고침해 보세요.', 'Failed to load. Please refresh.'],
    soonPage: ['이 게임 가이드는 아직 준비 중이에요.', 'This guide is coming soon.'], credit: ['© 나두게임즈 | 나두Ai', '© Nadoo Games | 나두Ai'],
    top: ['맨 위로 ↑', 'Top ↑']
  };
  function t(k) { var v = T[k]; return v ? v[lang === 'ko' ? 0 : 1] : k; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function nm(g) { return lang === 'ko' ? g.ko : (g.en || g.ko); }
  function stars(n) { n = Math.max(1, Math.min(5, n | 0)); return '<span class="stars" aria-label="' + n + '/5">' + '★★★★★'.slice(0, n) + '<span style="opacity:.25">' + '★★★★★'.slice(n) + '</span></span>'; }
  function getJSON(url) { return fetch(url, { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw new Error(r.status + ' ' + url); return r.json(); }); }
  function loadProg() { try { return JSON.parse(localStorage.getItem(PKEY) || '{}') || {}; } catch (e) { return {}; } }
  function saveProg(p) { try { localStorage.setItem(PKEY, JSON.stringify(p)); } catch (e) {} }
  function badges(g) {
    var h = '';
    if (g.status === 'ready') h += '<span class="badge ready">📗 ' + esc(t('ready')) + '</span>'; else h += '<span class="badge soon">⏳ ' + esc(t('soon')) + '</span>';
    if (g.solo) h += '<span class="badge solo">🧍 ' + esc(t('solo')) + '</span>';
    if (g.kids) h += '<span class="badge kids">🧒 ' + esc(t('kids')) + '</span>';
    if (g.pc) h += '<span class="badge pc">🤖 ' + esc(t('pc')) + '</span>';
    return h;
  }
  function applyStatic() {
    document.documentElement.lang = lang;
    Array.prototype.forEach.call(document.querySelectorAll('[data-t]'), function (el) { el.textContent = t(el.getAttribute('data-t')); });
    var lb = document.getElementById('langBtn'); if (lb) lb.textContent = lang === 'ko' ? '🌏 EN' : '🌏 한';
  }
  function bindLang(rerender) {
    var lb = document.getElementById('langBtn'); if (!lb) return;
    lb.addEventListener('click', function () { lang = lang === 'ko' ? 'en' : 'ko'; try { localStorage.setItem(LANG_KEY, lang); } catch (e) {} applyStatic(); rerender(); });
  }

  /* ================= SVG 도식 ================= */
  var SVGNS = 'xmlns="http://www.w3.org/2000/svg"';
  function svgOpen(w, h, label) { return '<svg ' + SVGNS + ' viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" role="img" aria-label="' + esc(label || '') + '">'; }

  // 격자판: 오목·바둑·장기·샹치(교차점: mode "line"), 오델로·체스·쇼기·쿼리도·블로커스(칸: mode "cell")
  var AID = 0;
  var PCOL = { r: '#c0392b', g: '#1e8449', b: '#1f4fa8', k: '#111', w: '#fff', v: '#111' };
  var FCOL = { blue: '#3d7be0', yellow: '#f5c518', red: '#e0453d', green: '#3fae5a', gray: '#999' };
  function svgGrid(d) {
    var rows = d.rows || d.size || 8, cols = d.cols || d.size || 8, cell = d.cell || (Math.max(rows, cols) > 11 ? 20 : (d.pieceStyle ? 34 : 30));
    var line = d.mode !== 'cell', pad = d.coords ? 24 : 14;
    var gw = line ? (cols - 1) * cell : cols * cell, gh = line ? (rows - 1) * cell : rows * cell;
    var W = gw + pad + 14, H = gh + pad + 14, i, j, s = svgOpen(W, H, d.caption), aid = 'ga' + (++AID);
    function X(c) { return pad + (line ? c * cell : c * cell + cell / 2); }
    function Y(r) { return pad + (line ? r * cell : r * cell + cell / 2); }
    s += '<defs><marker id="' + aid + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#e74c3c"/></marker></defs>';
    s += '<rect x="0" y="0" width="' + W + '" height="' + H + '" rx="10" fill="' + (d.bg || (line ? '#e9c27d' : '#2f8f5b')) + '"/>';
    var lc = d.lineColor || (line ? '#5a3a10' : '#14502f');
    if (!line && d.checker) for (i = 0; i < rows; i++) for (j = 0; j < cols; j++) s += '<rect x="' + (pad + j * cell) + '" y="' + (pad + i * cell) + '" width="' + cell + '" height="' + cell + '" fill="' + ((i + j) % 2 ? '#b58863' : '#f0d9b5') + '"/>';
    (d.fills || []).forEach(function (f) { s += '<rect x="' + (pad + f[1] * cell + 1) + '" y="' + (pad + f[0] * cell + 1) + '" width="' + (cell - 2) + '" height="' + (cell - 2) + '" rx="2" fill="' + (FCOL[f[2]] || f[2]) + '" stroke="#2d1b00" stroke-width="1"/>'; });
    if (line) {
      for (i = 0; i < rows; i++) s += '<line x1="' + pad + '" y1="' + Y(i) + '" x2="' + (pad + gw) + '" y2="' + Y(i) + '" stroke="' + lc + '" stroke-width="1"/>';
      for (i = 0; i < cols; i++) {
        if (d.river != null && i > 0 && i < cols - 1) {
          s += '<line x1="' + X(i) + '" y1="' + pad + '" x2="' + X(i) + '" y2="' + Y(d.river) + '" stroke="' + lc + '" stroke-width="1"/>';
          s += '<line x1="' + X(i) + '" y1="' + Y(d.river + 1) + '" x2="' + X(i) + '" y2="' + (pad + gh) + '" stroke="' + lc + '" stroke-width="1"/>';
        } else s += '<line x1="' + X(i) + '" y1="' + pad + '" x2="' + X(i) + '" y2="' + (pad + gh) + '" stroke="' + lc + '" stroke-width="1"/>';
      }
      if (d.river != null) s += '<text x="' + (pad + gw / 2) + '" y="' + ((Y(d.river) + Y(d.river + 1)) / 2 + 6) + '" font-size="' + (cell * 0.5) + '" text-anchor="middle" fill="' + lc + '" letter-spacing="6">' + esc(d.riverText || '楚 河　　漢 界') + '</text>';
      (d.palace || []).forEach(function (p) {
        s += '<line x1="' + X(p[1]) + '" y1="' + Y(p[0]) + '" x2="' + X(p[1] + 2) + '" y2="' + Y(p[0] + 2) + '" stroke="' + lc + '" stroke-width="1"/><line x1="' + X(p[1] + 2) + '" y1="' + Y(p[0]) + '" x2="' + X(p[1]) + '" y2="' + Y(p[0] + 2) + '" stroke="' + lc + '" stroke-width="1"/>';
      });
    } else {
      for (i = 0; i <= rows; i++) s += '<line x1="' + pad + '" y1="' + (pad + i * cell) + '" x2="' + (pad + gw) + '" y2="' + (pad + i * cell) + '" stroke="' + lc + '" stroke-width="' + (d.checker ? 0 : 1.5) + '"/>';
      for (i = 0; i <= cols; i++) s += '<line x1="' + (pad + i * cell) + '" y1="' + pad + '" x2="' + (pad + i * cell) + '" y2="' + (pad + gh) + '" stroke="' + lc + '" stroke-width="' + (d.checker ? 0 : 1.5) + '"/>';
      if (d.checker) s += '<rect x="' + pad + '" y="' + pad + '" width="' + gw + '" height="' + gh + '" fill="none" stroke="#5a3a10" stroke-width="2"/>';
    }
    if (d.coords) {
      var tc = d.coordColor || (line || d.checker || d.bg ? '#5a3a10' : '#fff');
      var colL = d.colLabels || 'abcdefghijklmnopqrstu'.split(''), rowL = d.rowLabels || null;
      for (i = 0; i < cols; i++) s += '<text x="' + X(i) + '" y="' + (pad - 8) + '" font-size="11" text-anchor="middle" fill="' + tc + '">' + esc(colL[i]) + '</text>';
      for (i = 0; i < rows; i++) s += '<text x="' + (pad - 12) + '" y="' + (Y(i) + 4) + '" font-size="11" text-anchor="middle" fill="' + tc + '">' + esc(rowL ? rowL[i] : (i + 1)) + '</text>';
    }
    (d.stars || []).forEach(function (p) { s += '<circle cx="' + X(p[1]) + '" cy="' + Y(p[0]) + '" r="' + (line ? 2.6 : 3) + '" fill="' + lc + '"/>'; });
    if (d.line) { var a = d.line[0], b = d.line[1]; s += '<line x1="' + X(a[1]) + '" y1="' + Y(a[0]) + '" x2="' + X(b[1]) + '" y2="' + Y(b[0]) + '" stroke="#ff3b3b" stroke-width="' + (cell * 0.35) + '" stroke-linecap="round" opacity=".45"/>'; }
    (d.walls || []).forEach(function (w) {
      if (w[2] === 'h') s += '<rect class="wall" x="' + (pad + w[1] * cell + 2) + '" y="' + (pad + (w[0] + 1) * cell - 4) + '" width="' + (2 * cell - 4) + '" height="8" rx="3" fill="#e8452c" stroke="#fff" stroke-width="1.5" style="filter:drop-shadow(0 1px 1.2px rgba(0,0,0,.55))"/>';
      else s += '<rect class="wall" x="' + (pad + (w[1] + 1) * cell - 4) + '" y="' + (pad + w[0] * cell + 2) + '" width="8" height="' + (2 * cell - 4) + '" rx="3" fill="#e8452c" stroke="#fff" stroke-width="1.5" style="filter:drop-shadow(0 1px 1.2px rgba(0,0,0,.55))"/>';
    });
    var R = cell * 0.43;
    (d.stones || []).forEach(function (p) {
      var bl = p[2] === 'b', col = p[2] === 'b' ? '#1b1b1b' : p[2] === 'w' ? '#fafafa' : (FCOL[p[2]] || p[2]);
      s += '<circle class="stone" cx="' + X(p[1]) + '" cy="' + Y(p[0]) + '" r="' + R + '" fill="' + col + '" stroke="#111" stroke-width="1.2"/>';
      if (p[3] != null) s += '<text x="' + X(p[1]) + '" y="' + (Y(p[0]) + R * 0.38) + '" font-size="' + (R * 1.05) + '" text-anchor="middle" fill="' + (bl ? '#fff' : '#111') + '" font-weight="700">' + esc(p[3]) + '</text>';
    });
    var st = d.pieceStyle || 'disc';
    (d.pieces || []).forEach(function (p) {
      var x = X(p[1]), y = Y(p[0]), col = PCOL[p[3]] || '#111', lab = esc(p[2]);
      if (st === 'glyph') {
        s += '<text class="piece" x="' + x + '" y="' + (y + cell * 0.32) + '" font-size="' + (cell * 0.86) + '" text-anchor="middle" font-family="DejaVu Sans,Segoe UI Symbol,Apple Symbols,Noto Sans Symbols2,sans-serif" fill="' + (p[3] === 'w' ? '#fff' : '#111') + '" stroke="' + (p[3] === 'w' ? '#111' : '#fff') + '" stroke-width="' + (p[3] === 'w' ? 1.2 : 0.6) + '" paint-order="stroke">' + lab + '\uFE0E</text>';
      } else if (st === 'shogi') {
        var h = cell * 0.46, w = cell * 0.38, rot = p[3] === 'v' ? ' transform="rotate(180 ' + x + ' ' + y + ')"' : '';
        s += '<g class="piece"' + rot + '><path d="M' + x + ' ' + (y - h) + 'L' + (x + w * 0.8) + ' ' + (y - h * 0.6) + 'L' + (x + w) + ' ' + (y + h) + 'L' + (x - w) + ' ' + (y + h) + 'L' + (x - w * 0.8) + ' ' + (y - h * 0.6) + 'Z" fill="#f3d9a4" stroke="#5a3a10" stroke-width="1.2"/>';
        s += '<text x="' + x + '" y="' + (y + (p[4] ? 2 : 6)) + '" font-size="' + (cell * 0.42) + '" text-anchor="middle" fill="' + (p[5] ? '#c0392b' : '#111') + '" font-weight="700">' + lab + '</text>';
        if (p[4]) s += '<text x="' + x + '" y="' + (y + h - 2) + '" font-size="' + (cell * 0.22) + '" text-anchor="middle" fill="#5a3a10">' + esc(p[4]) + '</text>';
        s += '</g>';
      } else {
        var rr = R * (p[4] || 1);
        s += '<circle class="piece" cx="' + x + '" cy="' + y + '" r="' + rr + '" fill="#fdf3d8" stroke="' + col + '" stroke-width="2"/>';
        s += '<text x="' + x + '" y="' + (y + rr * 0.36) + '" font-size="' + (rr * 1.0) + '" text-anchor="middle" fill="' + col + '" font-weight="700">' + lab + '</text>';
      }
    });
    (d.flipped || []).forEach(function (p) { s += '<circle cx="' + X(p[1]) + '" cy="' + Y(p[0]) + '" r="' + (R * 0.45) + '" fill="none" stroke="#ff9f43" stroke-width="2.5"/>'; });
    if (d.last) s += '<circle cx="' + X(d.last[1]) + '" cy="' + Y(d.last[0]) + '" r="' + (R + 2) + '" fill="none" stroke="#ff3b3b" stroke-width="2.5"/>';
    (d.arrows || []).forEach(function (a) { s += '<line x1="' + X(a[1]) + '" y1="' + Y(a[0]) + '" x2="' + X(a[3]) + '" y2="' + Y(a[2]) + '" stroke="#e74c3c" stroke-width="3" opacity=".85" marker-end="url(#' + aid + ')"/>'; });
    (d.marks || []).forEach(function (m) {
      var x = X(m[1]), y = Y(m[0]), k = cell * 0.25;
      if (m[2] === 'x') s += '<path d="M' + (x - k) + ' ' + (y - k) + 'L' + (x + k) + ' ' + (y + k) + 'M' + (x + k) + ' ' + (y - k) + 'L' + (x - k) + ' ' + (y + k) + '" stroke="#e00" stroke-width="3" stroke-linecap="round"/>';
      else if (m[2] === 'dot') s += '<circle cx="' + x + '" cy="' + y + '" r="' + (cell * 0.16) + '" fill="#ffd32a" stroke="#2d1b00" stroke-width="1"/>';
      else if (m[2] === 'sq') s += '<rect x="' + (x - cell / 2 + 2) + '" y="' + (y - cell / 2 + 2) + '" width="' + (cell - 4) + '" height="' + (cell - 4) + '" fill="none" stroke="#ffd32a" stroke-width="3"/>';
      else s += '<text x="' + x + '" y="' + (y + 5) + '" font-size="14" text-anchor="middle" fill="#c00" font-weight="700" stroke="#fff" stroke-width="3" paint-order="stroke">' + esc(m[3] || '') + '</text>';
    });
    return s + '</svg>';
  }

  // 육각 판 (아발론류 일반 도식): 줄 길이 n..2n-1..n, 구슬 [[줄, 칸, "b"|"w"]], 화살표 [[줄,칸,줄,칸]]
  function svgHex(d) {
    var n = d.n || 5, rowsN = 2 * n - 1, dd = d.cell || 30, W = dd * rowsN + 30, H = Math.round(dd * 0.866 * (rowsN - 1) + dd + 30), aid = 'ha' + (++AID);
    function len(r) { return n + Math.min(r, rowsN - 1 - r); }
    function P(r, k) { return [W / 2 + (k - (len(r) - 1) / 2) * dd, 15 + dd / 2 + r * dd * 0.866]; }
    var s = svgOpen(W, H, d.caption);
    s += '<defs><marker id="' + aid + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#e74c3c"/></marker></defs>';
    s += '<rect x="0" y="0" width="' + W + '" height="' + H + '" rx="14" fill="#5d6d7e"/>';
    var occ = {};
    (d.marbles || []).forEach(function (m) { occ[m[0] + ',' + m[1]] = m[2]; });
    for (var r = 0; r < rowsN; r++) for (var k = 0; k < len(r); k++) {
      var p = P(r, k), c = occ[r + ',' + k];
      s += '<circle' + (c ? ' class="stone"' : '') + ' cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + (dd * 0.42) + '" fill="' + (c === 'b' ? '#1b1b1b' : c === 'w' ? '#fafafa' : '#34495e') + '" stroke="#1c2833" stroke-width="1.2"/>';
    }
    (d.marks || []).forEach(function (m) { var p = P(m[0], m[1]); s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (dd * 0.47) + '" fill="none" stroke="#ffd32a" stroke-width="3"/>'; });
    (d.arrows || []).forEach(function (a) { var p = P(a[0], a[1]), q = P(a[2], a[3]); s += '<line x1="' + p[0] + '" y1="' + p[1] + '" x2="' + q[0] + '" y2="' + q[1] + '" stroke="#e74c3c" stroke-width="4" marker-end="url(#' + aid + ')"/>'; });
    return s + '</svg>';
  }

  // 솔리테어 배치: top [{label, card|null}], cols [{down:n, up:[codes], hl:[i]}]
  function svgTableau(d) {
    var top = d.top || [], cols = d.cols || [], n = Math.max(top.length, cols.length, 1), sp = 46;
    var maxH = 0; cols.forEach(function (c) { var h = (c.down || 0) * 8 + Math.max(0, (c.up || []).length - 1) * 18 + 58; if (h > maxH) maxH = h; });
    var topH = top.length ? 92 : 0, W = 12 + n * sp + 6, H = topH + maxH + 16, s = svgOpen(W, H, d.caption);
    s += '<rect x="0" y="0" width="' + W + '" height="' + H + '" rx="12" fill="#1e7a4c"/>';
    top.forEach(function (t, i) {
      var x = 12 + i * sp;
      if (t && t.label) s += '<text x="' + (x + 20) + '" y="14" font-size="10" text-anchor="middle" fill="#fff">' + esc(t.label) + '</text>';
      if (t && t.card) s += card(t.card, x, 22, !!t.hl);
      else if (t) s += '<rect x="' + x + '" y="22" width="40" height="58" rx="5" fill="none" stroke="#bfe9cf" stroke-width="1.5" stroke-dasharray="4 3"/>';
    });
    cols.forEach(function (c, i) {
      var x = 12 + i * sp, y = topH + 8, k;
      if (!(c.down || 0) && !(c.up || []).length) { s += '<rect x="' + x + '" y="' + y + '" width="40" height="58" rx="5" fill="none" stroke="#bfe9cf" stroke-width="1.5" stroke-dasharray="4 3"/>'; return; }
      for (k = 0; k < (c.down || 0); k++) { s += card('XX', x, y, false); y += 8; }
      (c.up || []).forEach(function (cd, j) { s += card(cd, x, y, (c.hl || []).indexOf(j) >= 0); y += 18; });
    });
    return s + '</svg>';
  }

  // 만칼라 판: top(상대 구멍, 화면 왼→오), bottom(내 구멍, 왼→오), storeL(상대 집), storeR(내 집)
  function svgMancala(d) {
    var cw = 50, W = cw * 8 + 20, H = 170, s = svgOpen(W, H, d.caption), hl = d.hl || [], cap = d.cap || [];
    s += '<rect x="2" y="16" width="' + (W - 4) + '" height="' + (H - 32) + '" rx="34" fill="#c98b4a" stroke="#5a3a10" stroke-width="3"/>';
    function seeds(cx, cy, n, rad) {
      var o = '', m = Math.min(n, 12);
      for (var i = 0; i < m; i++) { var a = i * 2.399, rr = rad * 0.55 * Math.sqrt((i + 0.5) / Math.max(m, 1)); o += '<circle cx="' + (cx + rr * Math.cos(a)).toFixed(1) + '" cy="' + (cy + rr * Math.sin(a)).toFixed(1) + '" r="3.2" fill="' + ['#6ab04c', '#e056fd', '#f0932b', '#22a6b3'][i % 4] + '" opacity=".85"/>'; }
      return o;
    }
    function pit(key, cx, cy, n, store) {
      var stroke = d.from === key ? '#e74c3c' : (hl.indexOf(key) >= 0 ? '#ffd32a' : (cap.indexOf(key) >= 0 ? '#8e44ad' : '#5a3a10'));
      var sw = stroke === '#5a3a10' ? 2 : 4, o = '';
      if (store) o += '<rect x="' + (cx - 20) + '" y="' + (cy - 52) + '" width="40" height="104" rx="20" fill="#8a5a2b" stroke="' + stroke + '" stroke-width="' + sw + '"/>';
      else o += '<circle cx="' + cx + '" cy="' + cy + '" r="20" fill="#8a5a2b" stroke="' + stroke + '" stroke-width="' + sw + '"/>';
      o += seeds(cx, cy, n, 20);
      o += '<text x="' + cx + '" y="' + (cy + 6) + '" font-size="17" font-weight="700" text-anchor="middle" fill="#fff" stroke="#2d1b00" stroke-width="3" paint-order="stroke">' + n + '</text>';
      return o;
    }
    s += pit('L', 10 + cw / 2, H / 2, d.storeL || 0, true);
    s += pit('R', 10 + cw * 7.5, H / 2, d.storeR || 0, true);
    for (var i = 0; i < 6; i++) {
      s += pit('t' + i, 10 + cw * (i + 1.5), 52, (d.top || [])[i] || 0, false);
      s += pit('b' + i, 10 + cw * (i + 1.5), H - 52, (d.bottom || [])[i] || 0, false);
    }
    s += '<text x="' + (W / 2) + '" y="12" font-size="12" text-anchor="middle" fill="#2d1b00">' + esc(d.topLabel || '상대 구멍 (← 이쪽으로 뿌림)') + '</text>';
    s += '<text x="' + (W / 2) + '" y="' + (H - 2) + '" font-size="12" text-anchor="middle" fill="#2d1b00">' + esc(d.bottomLabel || '내 구멍 (이쪽으로 뿌림 →)') + '</text>';
    s += '<text x="' + (10 + cw / 2) + '" y="' + (H / 2 + 66) + '" font-size="11" text-anchor="middle" fill="#2d1b00">상대 집</text>';
    s += '<text x="' + (10 + cw * 7.5) + '" y="' + (H / 2 + 66) + '" font-size="11" text-anchor="middle" fill="#2d1b00">내 집</text>';
    return s + '</svg>';
  }

  // 카드: rows [{label, cards:["AS","10H","JKB","JKC","XX"], hl:[index], back:n, note}]
  var SUIT = { S: ['♠', '#111'], C: ['♣', '#111'], H: ['♥', '#d10000'], D: ['♦', '#d10000'] };
  function card(code, x, y, hl) {
    var w = 40, h = 58, o = '', lift = hl ? -6 : 0; y += lift;
    var stroke = hl ? '#ff9f43' : '#2d1b00', sw = hl ? 3 : 1.5;
    if (code === 'XX') {
      o += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="5" fill="#3d5af1" stroke="' + stroke + '" stroke-width="' + sw + '"/>';
      o += '<rect x="' + (x + 5) + '" y="' + (y + 5) + '" width="' + (w - 10) + '" height="' + (h - 10) + '" rx="3" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 2"/>';
      return o;
    }
    o += '<rect class="card" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="5" fill="#fff" stroke="' + stroke + '" stroke-width="' + sw + '"/>';
    if (code === 'JKB' || code === 'JKC') {
      var col = code === 'JKC' ? '#d10000' : '#111';
      o += '<text x="' + (x + w / 2) + '" y="' + (y + 33) + '" font-size="20" text-anchor="middle">🃏</text>';
      o += '<text x="' + (x + w / 2) + '" y="' + (y + 52) + '" font-size="9" text-anchor="middle" fill="' + col + '" font-weight="700">' + (code === 'JKC' ? '컬러' : '흑백') + '</text>';
      o += '<text x="' + (x + 4) + '" y="' + (y + 12) + '" font-size="9" fill="' + col + '" font-weight="700">JK</text>';
      return o;
    }
    var su = SUIT[code.slice(-1)] || ['?', '#111'], rank = code.slice(0, -1);
    o += '<text x="' + (x + 4) + '" y="' + (y + 15) + '" font-size="' + (rank.length > 1 ? 12 : 14) + '" font-weight="700" fill="' + su[1] + '">' + esc(rank) + '</text>';
    o += '<text x="' + (x + w / 2) + '" y="' + (y + 44) + '" font-size="24" text-anchor="middle" fill="' + su[1] + '">' + su[0] + '</text>';
    return o;
  }
  function svgCards(d) {
    var rows = d.rows || [], rowH = 86, maxN = 1;
    var SP = 46;
    rows.forEach(function (r) { var n = (r.cards || []).length + (r.back ? Math.min(r.back, 6) : 0); if (n > maxN) maxN = n; });
    if (maxN > 8) SP = 26;
    var W = Math.max(200, 14 + (maxN - 1) * SP + 40 + 12), H = rows.length * rowH + 6, s = svgOpen(W, H, d.caption);
    s += '<rect x="0" y="0" width="' + W + '" height="' + H + '" rx="12" fill="#1e7a4c"/>';
    rows.forEach(function (r, ri) {
      var y0 = ri * rowH + 4, x = 12;
      s += '<text x="12" y="' + (y0 + 14) + '" font-size="13" fill="#fff" font-weight="700">' + esc(r.label || '') + (r.note ? ' <tspan fill="#ffd32a">' + esc(r.note) + '</tspan>' : '') + '</text>';
      (r.cards || []).forEach(function (c, i) { s += card(c, x, y0 + 22, (r.hl || []).indexOf(i) >= 0); x += SP; });
      if (r.back) {
        var k = Math.min(r.back, 6);
        for (var i = 0; i < k; i++) { s += card('XX', x, y0 + 22, false); x += SP; }
      }
      if (!(r.cards || []).length && !r.back) s += '<text x="12" y="' + (y0 + 56) + '" font-size="13" fill="#d7ffe0">' + esc(r.empty || '(빈손)') + '</text>';
    });
    return s + '</svg>';
  }
  function diagram(d) {
    if (!d) return '';
    var svg = d.type === 'mancala' ? svgMancala(d) : d.type === 'cards' ? svgCards(d) : d.type === 'hex' ? svgHex(d) : d.type === 'tableau' ? svgTableau(d) : svgGrid(d);
    return '<figure class="diagram">' + svg + (d.caption ? '<figcaption>' + esc(d.caption) + '</figcaption>' : '') + '</figure>';
  }

  /* ================= 목록 페이지 ================= */
  function renderIndex() {
    var root = document.getElementById('guideApp');
    var tab = (location.hash === '#card') ? 'card' : 'board', idx = null;
    function draw() {
      if (!idx) return;
      var prog = loadProg(), games = idx.games;
      Array.prototype.forEach.call(document.querySelectorAll('.tab'), function (b) { b.setAttribute('aria-selected', b.getAttribute('data-cat') === tab ? 'true' : 'false'); });
      var h = '';
      games.filter(function (g) { return g.cat === tab; }).forEach(function (g) {
        var p = prog[g.id] || [], done = p.filter(Boolean).length;
        var inner = '<span class="ic" aria-hidden="true">' + esc(g.emoji) + '</span><b>' + esc(nm(g)) + '</b><span class="meta">' + stars(g.level) + ' · ' + esc(g.players) + '</span>' +
          (g.status === 'ready' && done ? '<span class="prog">✅ ' + esc(t('progress')) + ' ' + done + '</span>' : '') + '<span class="bd">' + badges(g) + '</span>';
        var gurl = '/guide/game.html?id=' + encodeURIComponent(g.id);
        if (g.status === 'ready' && g.pc) h += '<div class="gcard ready haspc"><a class="gmain" href="' + gurl + '">' + inner + '</a><a class="playgo" href="/guide/play/' + encodeURIComponent(g.id) + '.html">🤖 ' + esc(t('playGo')) + '</a></div>';
        else h += g.status === 'ready' ? '<a class="gcard ready" href="' + gurl + '">' + inner + '</a>' : '<div class="gcard soon" aria-disabled="true">' + inner + '</div>';
      });
      document.getElementById('gameGrid').innerHTML = h;
      var ord = games.slice().sort(function (a, b) { return (a.level - b.level) || (a.order - b.order); });
      document.getElementById('orderList').innerHTML = ord.map(function (g) {
        var name = esc(g.emoji + ' ' + nm(g));
        return '<li>' + (g.status === 'ready' ? '<a href="/guide/game.html?id=' + encodeURIComponent(g.id) + '">' + name + '</a>' : '<span>' + name + '</span>') + stars(g.level) + '<span class="badge">' + esc(t(g.cat)) + '</span>' + badges(g) + '</li>';
      }).join('');
    }
    Array.prototype.forEach.call(document.querySelectorAll('.tab'), function (b) {
      b.addEventListener('click', function () { tab = b.getAttribute('data-cat'); try { history.replaceState(null, '', '#' + tab); } catch (e) {} draw(); });
    });
    applyStatic(); bindLang(draw);
    getJSON(DATA + 'index.json').then(function (j) { idx = j; draw(); }).catch(function () { root.insertAdjacentHTML('afterbegin', '<div class="note err">' + esc(t('loadErr')) + '</div>'); });
  }

  /* ================= 게임 페이지 ================= */
  function renderGame() {
    var root = document.getElementById('guideApp');
    var id = (new URLSearchParams(location.search).get('id') || '').toLowerCase();
    if (!/^[a-z0-9-]{1,40}$/.test(id)) id = '';
    var idx = null, g = null, data = null;
    function list(arr, ordered) { return '<' + (ordered ? 'ol' : 'ul') + '>' + (arr || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</' + (ordered ? 'ol' : 'ul') + '>'; }
    function sec(key, n, body) { return '<section class="panel" id="' + key + '"><h2><span class="no">' + n + '</span>' + esc(t('s_' + key)) + '</h2>' + body + '</section>'; }
    function draw() {
      applyStatic();
      if (!data) return;
      var d = data, gl = d.glance || {}, byId = {};
      (idx ? idx.games : []).forEach(function (x) { byId[x.id] = x; });
      document.title = (d.title.ko) + ' 초보 가이드 | 나두게임즈';
      var sim = (gl.similar || []).map(function (s) {
        var x = byId[s];
        if (!x) return esc(s);
        return x.status === 'ready' ? '<a href="/guide/game.html?id=' + encodeURIComponent(x.id) + '">' + esc(nm(x)) + '</a>' : esc(nm(x)) + ' <span class="badge soon">' + esc(t('soon')) + '</span>';
      }).join(', ');
      var h = '<header class="hero"><h1>' + esc((d.emoji || '') + ' ' + d.title.ko) + '<small>' + esc(d.title.en || '') + '</small></h1>' +
        (g ? '<p>' + badges(g) + '</p>' : '') + (d.intro ? '<p>' + esc(d.intro) + '</p>' : '') + '</header>';
      if (d.notice) h += '<div class="note warn">' + esc(d.notice) + '</div>';
      if (lang === 'en') h += '<div class="note">' + esc(t('enNote')) + '</div>';
      var playBtn = d.play && d.play.url ? function (pos) { return '<a class="playbig" id="playBtn' + pos + '" href="' + esc(d.play.url) + '"><span class="pb-main">' + esc(t('playNow')) + '</span><span class="pb-sub">' + esc(t('playSub')) + '</span></a>'; } : null;
      if (playBtn) h += playBtn('Top');
      if (playBtn) h += '<p style="text-align:center;margin-top:-6px"><a class="btn" id="play2pTop" href="' + esc(d.play.url) + '?mode=2p">' + esc(t('play2p')) + '</a></p>';
      var keys = ['glance', 'goal', 'setup', 'play', 'rules', 'strategy', 'glossary', 'variants', 'progress'];
      h += '<nav class="toc" aria-label="목차">' + keys.map(function (k, i) { return '<a href="#' + k + '">' + (i + 1) + '. ' + esc(t('s_' + k)) + '</a>'; }).join('') + '</nav>';
      h += sec('glance', 1, '<table class="glance"><tr><th>' + esc(t('k_players')) + '</th><td>' + esc(gl.players) + '</td></tr><tr><th>' + esc(t('k_time')) + '</th><td>' + esc(gl.time) + '</td></tr><tr><th>' + esc(t('k_level')) + '</th><td>' + stars(gl.level) + ' (' + (gl.level | 0) + '/5)</td></tr><tr><th>' + esc(t('k_mat')) + '</th><td>' + esc(gl.materials) + '</td></tr><tr><th>' + esc(t('k_similar')) + '</th><td>' + sim + '</td></tr></table>');
      h += sec('goal', 2, '<p style="font-size:18px">🎯 ' + esc(d.goal) + '</p>');
      h += sec('setup', 3, list(d.setup.text, true) + diagram(d.setup.diagram));
      h += sec('play', 4, '<ol class="steps">' + (d.walkthrough || []).map(function (st) { return '<li><p>' + esc(st.text) + '</p>' + diagram(st.diagram) + '</li>'; }).join('') + '</ol>');
      h += sec('rules', 5, '<h3>' + esc(t('basic')) + '</h3>' + list(d.rules.basic, true) + '<h3>' + esc(t('except')) + '</h3>' + list(d.rules.exceptions));
      h += sec('strategy', 6, '<h3>💡 ' + esc(t('tips')) + '</h3>' + list(d.strategy, true) + '<h3>⚠️ ' + esc(t('mistakes')) + '</h3>' + list(d.mistakes));
      h += sec('glossary', 7, '<dl class="gloss">' + (d.glossary || []).map(function (x) { return '<dt>' + esc(x[0]) + '</dt><dd>' + esc(x[1]) + '</dd>'; }).join('') + '</dl>');
      var v = d.variants || {};
      h += sec('variants', 8, '<div class="tbl-wrap"><table><tr><th>' + esc(t('item')) + '</th><th>' + esc(v.koLabel || t('korean')) + '</th><th>' + esc(v.intlLabel || t('intl')) + '</th></tr>' +
        (v.rows || []).map(function (r) { return '<tr><th>' + esc(r[0]) + '</th><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>'; }).join('') + '</table></div>' + (v.notes ? list(v.notes) : ''));
      var prog = loadProg(), mine = prog[d.id] || [];
      h += sec('progress', 9, '<p class="prog">' + esc(t('saved')) + '</p>' + (d.progress || []).map(function (x, i) {
        return '<label class="check"><input type="checkbox" data-i="' + i + '"' + (mine[i] ? ' checked' : '') + '> <span>' + esc(x) + '</span></label>';
      }).join('') + '<p style="margin-top:8px"><button class="btn" id="resetProg" type="button">' + esc(t('reset')) + '</button></p>');
      if (playBtn) h += playBtn('Bottom');
      h += '<p style="text-align:center"><a class="btn" href="/guide/">' + esc(t('list')) + '</a> <a class="btn" href="#">' + esc(t('top')) + '</a></p>';
      root.innerHTML = h;
      Array.prototype.forEach.call(root.querySelectorAll('.check input'), function (cb) {
        cb.addEventListener('change', function () { var p = loadProg(), a = p[d.id] || []; a[+cb.getAttribute('data-i')] = cb.checked; p[d.id] = a; saveProg(p); });
      });
      document.getElementById('resetProg').addEventListener('click', function () { var p = loadProg(); delete p[d.id]; saveProg(p); draw(); });
    }
    applyStatic(); bindLang(draw);
    if (!id) { root.innerHTML = '<div class="note err">' + esc(t('notFound')) + '</div>'; return; }
    getJSON(DATA + 'index.json').then(function (j) {
      idx = j; g = j.games.filter(function (x) { return x.id === id; })[0] || null;
      if (!g) throw new Error('nf');
      if (g.status !== 'ready') { root.innerHTML = '<header class="hero"><h1>' + esc(g.emoji + ' ' + nm(g)) + '</h1><p>' + esc(t('soonPage')) + '</p></header>'; return null; }
      return getJSON(DATA + id + '.json');
    }).then(function (j) { if (j) { data = j; draw(); if (location.hash) { var el = document.getElementById(location.hash.slice(1)); if (el) el.scrollIntoView(); } } })
      .catch(function (e) { root.innerHTML = '<div class="note err">' + esc(e && e.message === 'nf' ? t('notFound') : t('loadErr')) + '</div>'; });
  }

  window.NadooGuide = { renderIndex: renderIndex, renderGame: renderGame, diagram: diagram };
})();
