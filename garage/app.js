(function () {
  'use strict';
  var G = window.GD, A = window.AUD || null;
  var KEY = 'nadooGarage1', S = { lang: 'ko', cases: {}, ch: {}, quiz: 0, all: false };
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
  function score() { return count(S.cases) + count(S.ch) * 2 + S.quiz; }
  function rank() { var s = score(), i = s >= 28 ? 3 : s >= 16 ? 2 : s >= 6 ? 1 : 0; return { n: T(G.ranks[i]), p: Math.min(100, Math.round(s / 30 * 100)) }; }
  function fanfare(ic, big, sub) {
    var f = document.getElementById('fanfare'); snd('fanfare');
    f.innerHTML = ''; var c = h('div', 'fan-card', '<div class="fan-ic">' + ic + '</div><div class="fan-big">' + esc(big) + '</div><p class="muted">' + esc(sub || '') + '</p>');
    c.appendChild(btn('primary wide', L('계속하기 ▶', 'Continue ▶'), function () { f.hidden = true; }));
    f.appendChild(c); f.hidden = false;
  }
  function header() {
    document.getElementById('brand').textContent = L('🔧 나두 모터스 공방', '🔧 Nadoo Garage Lab');
    document.getElementById('langBtn').textContent = S.lang === 'ko' ? 'EN' : '한';
    document.getElementById('homeLink').textContent = L('🏠 홈', '🏠 Home');
    document.getElementById('unlockBtn').textContent = S.all ? L('🔒 순서대로', '🔒 In order') : L('⚙️ 전체 열기', '⚙️ Unlock all');
    var r = rank(); document.getElementById('rankChip').innerHTML = '<span class="rk">' + esc(r.n) + '</span><span>' + score() + ' pt</span>';
    document.documentElement.lang = S.lang;
  }
  var cur = home;
  function go(fn) { cur = fn; header(); app.innerHTML = ''; window.scrollTo(0, 0); fn(); }
  function sub(title, back) {
    var d = h('div', 'subhead'); d.appendChild(btn('ghost small', L('◀ 뒤로', '◀ Back'), function () { go(back || home); }));
    d.appendChild(h('h2', '', esc(title))); app.appendChild(d);
  }
  function mentor(html) { app.appendChild(h('div', 'mentor', '<span class="mt-i">🧑‍🔧</span><p>' + html + '</p>')); }
  function home() {
    var r = rank();
    app.appendChild(h('div', 'hero', '<div class="neon">' + L('나두 모터스 공방', 'Nadoo Garage Lab') + '</div><p class="tagline">' + L('소리·페달 감각·경고등으로 고장을 찾고, 엔진부터 브레이크까지 내 손으로 조립해 보는 자동차 정비 시뮬레이터', 'Diagnose by sound, pedal feel and warning lights, then build a car from engine to brakes.') + '</p></div>'));
    app.appendChild(h('div', 'rankcard', '<div><div class="lab">' + L('내 등급', 'My rank') + '</div><div class="rk-n">' + esc(r.n) + '</div></div><div class="rk-r"><div class="muted">' + score() + ' pt</div><div class="bar"><i style="width:' + r.p + '%"></i></div></div>'));
    if (!count(S.cases)) mentor(L('처음이면 <b>반짝이는 타일</b>부터 눌러 보세요. 첫 케이스는 정답이 반짝이는 <b>따라 하기</b> 모드예요!', 'New here? Tap the <b>glowing tile</b>. The first case is a <b>follow-along</b> with the answer glowing!'));
    var tl = h('div', 'tiles');
    [['🔧', L('실전 트러블슈팅', 'Troubleshooting'), L('12개 고장 케이스 · 점검 → 진단·수리', '12 cases · inspect → repair'), count(S.cases) + '/12', trouble, !count(S.cases)],
     ['⚙️', L('작동 원리 & 내 차 조립', 'How it works & build'), L('4행정 단면 시뮬레이터 · 5개 챕터', '4-stroke simulator · 5 chapters'), count(S.ch) + '/5', course],
     ['📖', L('부품·정비 도감', 'Parts dex'), L(G.dex.length + '장 카드', G.dex.length + ' cards'), '', dex],
     ['⚡', L('실전 정비 퀴즈', 'Repair quiz'), L('8문제 · 최고 ', '8 Qs · best ') + S.quiz + '/8', '', quiz]
    ].forEach(function (t) {
      var b = h('button', 'tile' + (t[5] ? ' glow' : ''), '<span class="ti">' + t[0] + '</span><span class="tt">' + t[1] + (t[3] ? ' <i class="pill">' + t[3] + '</i>' : '') + '</span><span class="td">' + t[2] + '</span>');
      b.type = 'button'; b.onclick = function () { snd('wrench'); go(t[4]); }; tl.appendChild(b);
    });
    app.appendChild(tl);
    app.appendChild(h('div', 'safety-banner', L('⚠️ 안전 안내: 실제 정비는 엔진을 끄고 식힌 뒤, 평지에서 잭 스탠드를 받치고 하세요. 브레이크·에어백·고전압(하이브리드/EV)은 전문 정비소에 맡기세요.', '⚠️ Safety: work on a cool, switched-off car on level ground with jack stands. Leave brakes, airbags and high-voltage systems to professionals.')));
  }
  var tabCat = 'all';
  function trouble() {
    sub(L('🔧 실전 트러블슈팅', '🔧 Troubleshooting'));
    app.appendChild(h('p', 'lead', L('증상과 단서(소리·페달 감각·경고등)를 읽고 ① 점검 → ② 진단·수리를 고르세요. 틀려도 이유를 알려 줘요.', 'Read the clues, pick ① an inspection then ② a repair. Wrong picks explain why.')));
    var tabs = h('div', 'tabs');
    [['all', ['전체', 'All']]].concat(Object.keys(G.cats).map(function (k) { return [k, G.cats[k]]; })).forEach(function (c) {
      var b = h('button', 'tab' + (tabCat === c[0] ? ' on' : ''), esc(T(c[1]))); b.type = 'button';
      b.onclick = function () { tabCat = c[0]; go(trouble); }; tabs.appendChild(b);
    });
    app.appendChild(tabs);
    var firstOpen = null;
    G.cases.forEach(function (c, i) {
      if (tabCat !== 'all' && c.cat !== tabCat) return;
      var done = S.cases[c.id], lock = !S.all && !done && i > count(S.cases) + 2;
      var r = h('button', 'lrow' + (lock ? ' lock' : '') + (!done && !lock && !firstOpen ? ' now glow' : ''), '<span class="lr-s">' + (done ? '✅' : lock ? '🔒' : c.ic) + '</span><span class="lr-n">' + esc(T(c.t)) + '</span><span class="lr-m">' + esc(T(G.cats[c.cat])) + '</span>');
      if (!done && !lock && !firstOpen) firstOpen = c;
      r.type = 'button'; r.onclick = function () { if (lock) { toast(L('앞 케이스를 먼저 풀어요 (또는 ⚙️ 전체 열기)', 'Solve earlier cases first (or ⚙️ Unlock all)')); return; } snd('wrench'); go(function () { caseView(c); }); };
      app.appendChild(r);
    });
  }
  function caseView(c) {
    var guided = count(S.cases) === 0, stage = 1, wrong = 0;
    sub(c.ic + ' ' + T(c.t), trouble);
    var card = h('div', 'diag-card', '<h3>' + L('🚗 손님 증상', '🚗 Customer complaint') + '</h3><p>' + esc(T(c.sym)) + '</p>');
    var cl = h('div', 'clues'); c.clues.forEach(function (q) { cl.appendChild(h('div', 'clue', '<b>' + esc(L(q[0], q[0].split(' ')[0] + ' ' + q[1])) + '</b>' + esc(L(q[2], q[3])))); });
    card.appendChild(cl); app.appendChild(card);
    if (c.cat === 'brake') app.appendChild(brakeSvg(c.id));
    if (guided) mentor(L('<b>따라 하기 모드</b>: 정답 카드 1개가 반짝여요. 눌러 보고 이유를 읽어 보세요!', '<b>Follow-along</b>: one correct card glows. Tap it and read why!'));
    var zone = h('div'); app.appendChild(zone);
    function step() {
      zone.innerHTML = '';
      var opts = stage === 1 ? c.s1 : c.s2;
      zone.appendChild(h('div', 'lab', stage === 1 ? L('STEP 1 · 무엇을 점검할까요?', 'STEP 1 · What do you inspect?') : L('STEP 2 · 진단 & 수리', 'STEP 2 · Diagnose & repair')));
      var grid = h('div', 'optgrid'), fb = h('div'), list = guided ? opts.filter(function (o) { return o[2]; }).concat(opts.filter(function (o) { return !o[2]; }).slice(0, 1)) : shuffle(opts);
      list.forEach(function (o) {
        var b = h('button', 'opt' + (guided && o[2] ? ' glow' : ''), '<b>' + esc(L(o[0], o[1])) + '</b>'); b.type = 'button'; b.dataset.ok = o[2];
        b.onclick = function () {
          if (o[2]) {
            snd('good'); b.className = 'opt done';
            fb.innerHTML = '<div class="fb ok">✅ ' + esc(L(o[3], o[4])) + '</div>';
            grid.querySelectorAll('button').forEach(function (x) { x.disabled = true; });
            fb.appendChild(btn('primary wide', stage === 1 ? L('다음 단계 ▶', 'Next step ▶') : L('수리 완료 🏁', 'Finish repair 🏁'), function () { if (stage === 1) { stage = 2; step(); } else finish(); }));
          } else { wrong++; snd('bad'); b.className = 'opt off'; fb.innerHTML = '<div class="fb bad">❌ ' + esc(L(o[3], o[4])) + '</div>'; }
        };
        grid.appendChild(b);
      });
      zone.appendChild(grid);
      zone.appendChild(btn('ghost small', L('💡 힌트', '💡 Hint'), function () { var g = grid.querySelector('[data-ok="1"]'); if (g) g.classList.add('glow'); }));
      zone.appendChild(fb);
    }
    function finish() {
      var first = !S.cases[c.id]; S.cases[c.id] = 1; save(); header(); snd('vroom');
      zone.innerHTML = '<div class="fb info">🔬 <b>' + L('엔지니어링 원리', 'Engineering principle') + '</b><br>' + esc(T(c.why)) + '</div>';
      zone.appendChild(btn('primary wide', L('다음 케이스 ▶', 'Next case ▶'), function () { var i = G.cases.indexOf(c), n = G.cases[i + 1]; go(n ? function () { caseView(n); } : trouble); }));
      zone.appendChild(btn('ghost wide', L('목록으로', 'Back to list'), function () { go(trouble); }));
      if (first) fanfare('🏆', L('수리 성공!', 'Repair complete!'), (wrong ? L('실수 ' + wrong + '번 · ', wrong + ' mistakes · ') : L('한 번에 정답! · ', 'Perfect! · ')) + T(c.t));
    }
    step();
  }
  var NS = 'http://www.w3.org/2000/svg';
  function brakeSvg(id) {
    var w = h('div', 'scene'), air = id === 'brB', pad = id === 'brA';
    w.innerHTML = '<svg class="scene-svg" viewBox="0 0 360 200"><text x="10" y="20" fill="#ffd166" font-size="13">' + L('유압 브레이크 단면', 'Hydraulic brake cutaway') + '</text>' +
      '<g id="bpedal"><line x1="40" y1="60" x2="40" y2="160" stroke="#b8c7d9" stroke-width="6"/><rect x="25" y="150" width="30" height="10" fill="#ff9f1c"/></g>' +
      '<rect x="60" y="70" width="70" height="26" rx="5" fill="#26364a" stroke="#4cc9f0"/><text x="64" y="88" fill="#caf0f8" font-size="11">' + L('마스터 실린더', 'Master cyl.') + '</text>' +
      '<path id="bline" d="M130 83 H240 V120" stroke="#e63946" stroke-width="6" fill="none" stroke-dasharray="8 6"/>' + (air ? '<circle cx="185" cy="83" r="4" fill="#fff"/><circle cx="205" cy="83" r="3" fill="#fff"/>' : '') +
      '<circle cx="290" cy="130" r="55" fill="#3a4a5c" stroke="#b8c7d9" stroke-width="3"/><circle cx="290" cy="130" r="14" fill="#151f2b"/>' +
      '<rect id="padL" x="222" y="105" width="' + (pad ? 5 : 12) + '" height="50" fill="#a0522d"/><rect x="210" y="98" width="12" height="64" fill="#e63946"/><text x="196" y="190" fill="#ffd166" font-size="11">' + L('캘리퍼·패드·디스크', 'Caliper·pad·disc') + '</text></svg>';
    var info = h('div', 'muted', ''), pressed = false;
    var b = btn('cyan small', L('🦶 브레이크 밟기', '🦶 Press brake'), function () {
      pressed = !pressed; var s = w.querySelector('svg');
      s.querySelector('#bpedal').setAttribute('transform', pressed ? 'rotate(-14 40 60)' : '');
      s.querySelector('#bline').style.strokeDashoffset = pressed ? '-28' : '0';
      s.querySelector('#bline').style.transition = 'stroke-dashoffset .5s';
      s.querySelector('#padL').setAttribute('x', pressed ? (pad ? 230 : 230) : 222);
      info.textContent = pressed ? (air ? L('기포가 압축돼서 힘이 덜 전달돼요 (스펀지 페달)', 'Bubbles compress — weak force (spongy)') : pad ? L('패드가 얇아 금속 받침이 디스크를 긁어요!', 'Thin pad: backing plate scrapes the disc!') : L('유압이 캘리퍼를 밀어 패드가 디스크를 꽉!', 'Pressure pushes the pads onto the disc!')) : '';
    });
    w.appendChild(h('div', 'sim-controls')).appendChild(b); w.appendChild(info); return w;
  }
  function engineSim() {
    var w = h('div', 'scene'), raf = 0, th = 0, rpm = 600, last = 0, paused = false, target = -1;
    var names = [L('① 흡입', '① Intake'), L('② 압축', '② Compression'), L('③ 폭발(동력)', '③ Power'), L('④ 배기', '④ Exhaust')];
    var desc = [L('흡기 밸브 열림 · 피스톤 ↓ · 공기+연료 흡입', 'Intake valve open · piston down · mixture in'), L('밸브 닫힘 · 피스톤 ↑ · 혼합기 압축', 'Valves shut · piston up · squeeze'), L('점화플러그 불꽃! · 폭발 압력이 피스톤 ↓', 'Spark! · combustion pushes piston down'), L('배기 밸브 열림 · 피스톤 ↑ · 배기가스 배출', 'Exhaust valve open · piston up · gases out')];
    w.innerHTML = '<svg class="scene-svg" viewBox="0 0 300 300"><rect x="95" y="40" width="110" height="160" fill="#1c2938" stroke="#b8c7d9" stroke-width="3"/><rect id="gas" x="98" y="43" width="104" height="60" fill="#4cc9f0" opacity=".35"/>' +
      '<line id="vi" x1="120" y1="20" x2="120" y2="43" stroke="#4cc9f0" stroke-width="5"/><line id="ve" x1="180" y1="20" x2="180" y2="43" stroke="#ff6b6b" stroke-width="5"/><rect x="146" y="28" width="8" height="16" fill="#ffd166"/><circle id="spk" cx="150" cy="50" r="10" fill="#ffd166" opacity="0"/>' +
      '<rect id="pis" x="99" y="100" width="102" height="34" rx="3" fill="#94a3b8"/><line id="rod" stroke="#ffd166" stroke-width="8" stroke-linecap="round"/><circle cx="150" cy="240" r="38" fill="none" stroke="#4cc9f0" stroke-dasharray="4 4"/><circle id="pin" r="7" fill="#ff9f1c"/><circle cx="150" cy="240" r="6" fill="#fff"/>' +
      '<text id="stk" x="150" y="294" text-anchor="middle" fill="#ffd166" font-size="17" font-weight="700"></text></svg>';
    var ctl = h('div', 'sim-controls'), lab = h('label', '', L('가속 페달 RPM', 'Throttle RPM') + ' <input type="range" min="0" max="3000" step="100" value="600"> <span>600</span>');
    var d = h('div', 'fb info'); ctl.appendChild(lab);
    ctl.appendChild(btn('gold small', L('⏯ 1행정씩 끊어 보기', '⏯ Step one stroke'), function () { paused = true; target = (Math.floor(th / 180) + 1) * 180; }));
    ctl.appendChild(btn('ghost small', L('▶ 연속 재생', '▶ Play'), function () { paused = false; target = -1; }));
    w.appendChild(ctl); w.appendChild(d);
    var rg = lab.querySelector('input'); rg.oninput = function () { rpm = +rg.value; lab.querySelector('span').textContent = rpm; if (rpm > 2000) snd('vroom'); };
    var q = function (id) { return w.querySelector('#' + id); };
    function draw() {
      var a = th * Math.PI / 180, r = 38, l = 100, px = 150 + r * Math.sin(a), py = 240 - r * Math.cos(a);
      var y = 240 - (r * Math.cos(a) + Math.sqrt(l * l - Math.pow(r * Math.sin(a), 2))), s = Math.floor((th % 720) / 180);
      q('pis').setAttribute('y', y - 2); q('pin').setAttribute('cx', px); q('pin').setAttribute('cy', py);
      q('rod').setAttribute('x1', 150); q('rod').setAttribute('y1', y + 14); q('rod').setAttribute('x2', px); q('rod').setAttribute('y2', py);
      q('gas').setAttribute('height', Math.max(4, y - 45)); q('gas').setAttribute('fill', ['#4cc9f0', '#90e0ef', '#ff9f1c', '#6b7280'][s]);
      q('vi').setAttribute('y2', s === 0 ? 58 : 43); q('ve').setAttribute('y2', s === 3 ? 58 : 43);
      q('spk').setAttribute('opacity', s === 2 && (th % 720) < 420 ? 1 : 0);
      q('stk').textContent = names[s]; d.textContent = desc[s];
    }
    function loop(t) {
      if (!document.body.contains(w)) return;
      var dt = last ? Math.min(0.05, (t - last) / 1000) : 0; last = t;
      var sp = paused ? (target > th ? 240 : 0) : rpm * 6 / 25;
      th += sp * dt; if (paused && target >= 0 && th >= target) { th = target; target = -1; }
      th %= 720; draw(); raf = requestAnimationFrame(loop);
    }
    draw(); raf = requestAnimationFrame(loop); return w;
  }
  function gearSim() {
    var R = [3.6, 2.1, 1.4, 1.0, 0.8], w = h('div', 'scene'), out = h('div', 'fb info');
    var ctl = h('div', 'sim-controls'); ctl.appendChild(h('span', 'lab', L('변속기 기어', 'Gear')));
    function show(i) {
      var tq = Math.round(200 * R[i] * 4.1), sp = Math.round(3000 * 60 * 1.95 / (R[i] * 4.1) / 1000);
      out.innerHTML = '<b>' + (i + 1) + L('단', 'th') + '</b> · ' + L('기어비 ', 'ratio ') + R[i] + ' : 1<br>' + L('바퀴 토크 ', 'Wheel torque ') + tq + ' Nm <div class="bar"><i style="width:' + Math.round(tq / 30) + '%"></i></div>' +
        L('3000rpm 속도 약 ', 'Speed @3000rpm ≈ ') + sp + ' km/h <div class="bar"><i style="width:' + Math.round(sp / 1.6) + '%"></i></div><span class="muted">' + L('저단 = 힘↑ 속도↓ (언덕 출발) · 고단 = 힘↓ 속도↑ (고속도로)', 'Low gear = force up, speed down · High gear = speed up') + '</span>';
      snd('wrench');
    }
    R.forEach(function (r, i) { ctl.appendChild(btn('small', (i + 1) + L('단', ''), function () { show(i); })); });
    w.appendChild(ctl); w.appendChild(out); show(0); return w;
  }
  function coolSim() {
    var w = h('div', 'scene'), out = h('div', 'fb info'), ctl = h('div', 'sim-controls');
    var lab = h('label', '', L('엔진 온도', 'Engine temp') + ' <input type="range" min="20" max="110" value="40"> <span>40℃</span>');
    ctl.appendChild(lab); w.appendChild(ctl); w.appendChild(out);
    var rg = lab.querySelector('input');
    rg.oninput = function () {
      var t = +rg.value; lab.querySelector('span').textContent = t + '℃';
      out.innerHTML = t < 85 ? L('🔒 서모스탯 닫힘 → 엔진 안에서만 순환 (빨리 데우기)', '🔒 Thermostat closed → warms up fast') : t < 100 ? L('🔓 서모스탯 열림 → 워터펌프가 라디에이터로 보내 식혀요 ✅', '🔓 Open → pump sends coolant to the radiator ✅') : L('🔥 과열! 냉각수 부족·서모스탯 고착·팬 고장 의심', '🔥 Overheat! Suspect low coolant, stuck thermostat or fan');
    };
    rg.oninput(); return w;
  }
  function finalSim() {
    var w = h('div', 'scene'), out = h('div', 'fb info', L('모든 계통을 연결했어요. 시동을 걸어 시운전!', 'All systems connected. Start the test drive!'));
    w.appendChild(btn('primary big wide', L('🔑 시동 & 시운전', '🔑 Start & test drive'), function () {
      snd('vroom'); var ck = [L('🔋 전압 14.1V 충전 OK', '🔋 14.1 V charging OK'), L('🛢️ 유압 OK', '🛢️ Oil pressure OK'), L('🌡️ 수온 90℃ OK', '🌡️ 90 °C OK'), L('🛑 제동 테스트 OK', '🛑 Brake test OK'), L('🎡 직진 OK', '🎡 Tracks straight')];
      out.innerHTML = ck.map(function (c) { return '<span class="badge ok">' + c + '</span>'; }).join(' ');
    }));
    w.appendChild(out); return w;
  }
  function course() {
    sub(L('⚙️ 작동 원리 & 내 차 조립', '⚙️ How it works & build'));
    G.chapters.forEach(function (c, i) {
      var done = S.ch[c.id], lock = !S.all && i > 0 && !S.ch[G.chapters[i - 1].id] && !done;
      var r = h('button', 'lrow' + (lock ? ' lock' : '') + (!done && !lock && (i === 0 || S.ch[G.chapters[i - 1].id]) ? ' now glow' : ''), '<span class="lr-s">' + (done ? '✅' : lock ? '🔒' : c.ic) + '</span><span class="lr-n">' + esc(T(c.t)) + '</span><span class="lr-m">' + c.parts.length + L('부품', ' parts') + '</span>');
      r.type = 'button'; r.onclick = function () { if (lock) return toast(L('앞 챕터를 먼저 완성해요', 'Finish the previous chapter')); go(function () { chapter(c); }); };
      app.appendChild(r);
    });
  }
  function chapter(c) {
    sub(c.ic + ' ' + T(c.t), course);
    var n = 0, guided = !count(S.ch), board = h('div', 'lcard'), zone = h('div'), simBox = h('div');
    app.appendChild(board); app.appendChild(zone); app.appendChild(simBox);
    if (c.sim === 'engine' || c.sim === 'brake') simBox.appendChild(c.sim === 'engine' ? engineSim() : brakeSvg('ch'));
    function render() {
      board.innerHTML = '<h3>' + L('조립 진행 ', 'Assembly ') + n + '/' + c.parts.length + '</h3>' + c.parts.slice(0, n).map(function (p) { return '<p>✅ ' + p[0] + ' <b>' + esc(L(p[1], p[2])) + '</b> — ' + esc(L(p[3], p[4])) + '</p>'; }).join('');
      zone.innerHTML = '';
      if (n >= c.parts.length) return complete();
      var want = c.parts[n], k = guided && n < 2 ? 1 : Math.min(4, 2 + Math.floor(n / 2));
      var pool = c.parts.slice(n + 1).concat(G.chapters.filter(function (x) { return x !== c; }).map(function (x) { return x.parts[0]; }));
      pool = pool.filter(function (p) { return p[1] !== want[1]; });
      var opts = shuffle([want].concat(shuffle(pool).slice(0, k - 1)));
      zone.appendChild(h('div', 'lab', L('다음에 조립할 부품은? ', 'Which part goes next? ') + (k === 1 ? L('(따라 하기)', '(follow along)') : '')));
      var grid = h('div', 'optgrid'), fb = h('div');
      opts.forEach(function (p) {
        var b = h('button', 'opt' + (k === 1 ? ' glow' : ''), '<b>' + p[0] + ' ' + esc(L(p[1], p[2])) + '</b>'); b.type = 'button'; b.dataset.ok = p === want ? 1 : 0;
        b.onclick = function () {
          if (p === want) { snd('wrench'); n++; render(); }
          else { snd('bad'); b.className = 'opt off'; fb.innerHTML = '<div class="fb bad">❌ ' + esc(L(p[1] + '은(는) 지금 순서가 아니에요. 힘(동력)이 흐르는 순서를 떠올려 보세요!', p[2] + ' is not next. Follow the flow of power!')) + '</div>'; }
        };
        grid.appendChild(b);
      });
      zone.appendChild(grid); zone.appendChild(btn('ghost small', L('💡 힌트', '💡 Hint'), function () { var g = grid.querySelector('[data-ok="1"]'); g.classList.add('glow'); fb.innerHTML = '<div class="fb info">💡 ' + esc(L(want[3], want[4])) + '</div>'; })); zone.appendChild(fb);
    }
    function complete() {
      if (c.sim === 'gear') simBox.appendChild(gearSim()); if (c.sim === 'cool') simBox.appendChild(coolSim()); if (c.sim === 'final') simBox.appendChild(finalSim());
      var first = !S.ch[c.id]; S.ch[c.id] = 1; save(); header();
      zone.appendChild(btn('primary wide', L('다음 챕터 ▶', 'Next chapter ▶'), function () { var nx = G.chapters[G.chapters.indexOf(c) + 1]; go(nx ? function () { chapter(nx); } : course); }));
      if (first) fanfare(c.ic, L('조립 완료!', 'Assembled!'), T(c.t));
    }
    render();
  }
  function dex() {
    sub(L('📖 부품·정비 도감', '📖 Parts dex'));
    var g = h('div', 'dexgrid');
    G.dex.forEach(function (d) {
      var b = h('button', 'dexcard', '<span class="ti">' + d[0] + '</span><b>' + esc(L(d[1], d[2])) + '</b><span class="muted">' + esc(L(d[3], d[4])) + '</span>');
      b.type = 'button'; b.onclick = function () { snd('tap'); toast(d[0] + ' ' + L(d[1], d[2]) + ' · ' + L(d[3], d[4])); }; g.appendChild(b);
    });
    app.appendChild(g);
  }
  function quiz() {
    sub(L('⚡ 실전 정비 퀴즈', '⚡ Repair quiz'));
    var i = 0, right = 0, qs = shuffle(G.quiz), box = h('div', 'qcard'); app.appendChild(box);
    function show() {
      if (i >= qs.length) {
        if (right > S.quiz) { S.quiz = right; save(); header(); }
        box.innerHTML = '<h3>' + L('결과 ', 'Score ') + right + '/' + qs.length + '</h3>';
        box.appendChild(btn('primary wide', L('다시 풀기', 'Retry'), function () { go(quiz); }));
        if (right === qs.length) fanfare('🥇', L('만점 정비사!', 'Perfect mechanic!'), right + '/' + qs.length);
        return;
      }
      var q = qs[i], opts = S.lang === 'en' ? q[3] : q[2], answered = false;
      box.innerHTML = '<div class="lab">Q' + (i + 1) + '/' + qs.length + '</div><h3>' + esc(L(q[0], q[1])) + '</h3>';
      var og = h('div', 'qopts'), fb = h('div'); box.appendChild(og); box.appendChild(fb);
      opts.forEach(function (o, j) {
        var b = h('button', 'qopt', esc(o)); b.type = 'button';
        b.onclick = function () {
          if (answered) return; answered = true; var ok = j === q[4]; if (ok) right++;
          snd(ok ? 'good' : 'bad'); b.className = 'qopt ' + (ok ? 'right' : 'wrongc'); og.children[q[4]].className = 'qopt right';
          fb.innerHTML = '<div class="fb ' + (ok ? 'ok' : 'bad') + '">' + (ok ? '✅ ' : '❌ ') + esc(L(q[5], q[6])) + '</div>';
          fb.appendChild(btn('primary wide', L('다음 ▶', 'Next ▶'), function () { i++; show(); }));
        };
        og.appendChild(b);
      });
    }
    show();
  }
  document.getElementById('langBtn').onclick = function () { S.lang = S.lang === 'ko' ? 'en' : 'ko'; save(); go(cur); };
  document.getElementById('unlockBtn').onclick = function () { S.all = !S.all; save(); go(cur); toast(S.all ? L('전체 열림', 'All unlocked') : L('순서대로 진행', 'In order')); };
  var muted = false;
  document.getElementById('muteBtn').onclick = function () { muted = !muted; try { if (A) { A.setMute(muted); } } catch (e) {} this.textContent = muted ? '🔇' : '🔊'; };
  document.body.classList.add('live');
  document.addEventListener('pointerdown', function once() { document.removeEventListener('pointerdown', once); try { if (A) { A.init(); A.startMusic(); } } catch (e) {} });
  try { var lq = new URLSearchParams(location.search).get('lang'); if (lq === 'en' || lq === 'ko') S.lang = lq; } catch (e) {}
  go(home);
})();
