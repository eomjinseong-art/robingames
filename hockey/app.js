/* Nadoo Ice Hockey 101 — app */
'use strict';
(function () {
  var D = HK_DATA, A = window.HK_AUDIO, L = localStorage.getItem('hk_lang') || 'ko';
  var app = document.getElementById('app'), allOpen = localStorage.getItem('hk_all') === '1';
  var done = JSON.parse(localStorage.getItem('hk_done') || '{}');
  function t(o) { return o && typeof o === 'object' ? (o[L] || o.ko) : o; }
  function k(ko, en) { return L === 'ko' ? ko : en; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function sfx(n) { try { A && A.sfx(n); } catch (e) {} }
  var langBtn = document.getElementById('langBtn'), muteBtn = document.getElementById('muteBtn');
  langBtn.onclick = function () { L = L === 'ko' ? 'en' : 'ko'; localStorage.setItem('hk_lang', L); route(); };
  muteBtn.onclick = function () { if (!A) return; A.toggleMute(); muteBtn.textContent = A.isMuted() ? '🔇' : '🔊'; };
  document.addEventListener('pointerdown', function once() { try { A && A.startBgm(); } catch (e) {} document.removeEventListener('pointerdown', once); });
  function setHead() {
    langBtn.textContent = L === 'ko' ? 'EN' : '한국어';
    document.getElementById('brand').textContent = k('🏒 나두 아이스하키 101', '🏒 Nadoo Ice Hockey 101');
    document.getElementById('homeLink').textContent = k('🏠 홈', '🏠 Home');
    document.documentElement.lang = L;
  }
  function route() { stopAll(); setHead(); var h = location.hash.slice(1); if (/^s\d$/.test(h)) stage(+h[1]); else if (h === 'bug') bug(); else if (h === 'dex') dex(); else if (h === 'quiz') quiz(0); else home(); window.scrollTo(0, 0); }
  window.addEventListener('hashchange', route);
  function back() { return '<button class="btn small" onclick="location.hash=\'\'">⬅ ' + k('목록', 'Back') + '</button> '; }

  function home() {
    var h = '<div class="card-box"><h2 style="margin:0 0 6px;color:var(--gold)">' + k('🏒 아이스하키, 5단계로 끝내기', '🏒 Ice Hockey in 5 Stages') + '</h2><p style="margin:0">' +
      k('따라 하기 → 실전 플레이로 규칙을 몸으로 익혀요. 실수해도 ❤️만 줄고 그 자리에서 계속!', 'Guided step, then live play. Mistakes only cost a ❤️ — keep going!') + '</p>' +
      '<button class="btn small wide" id="allBtn">⚙️ ' + (allOpen ? k('전체 열기 ON', 'Unlock all ON') : k('전체 열기', 'Unlock all')) + '</button></div><div class="stage-list">';
    D.stages.forEach(function (s, i) {
      var open = allOpen || i === 0 || done[i];
      h += '<div class="stage-card"><div><h3>' + s.icon + ' ' + esc(t(s.title)) + (done[i + 1] ? ' ✅' : '') + '</h3><p>' + esc(t(s.sub)) + '</p></div>' +
        (open ? '<button class="btn primary" onclick="location.hash=\'s' + s.id + '\'">▶</button>' : '<span style="font-size:24px">🔒</span>') + '</div>';
    });
    h += '</div><div class="decoder-grid"><button class="btn blue" onclick="location.hash=\'bug\'">📺 ' + k('링크 선 & 전광판 해독기', 'Rink Lines & Scorebug') + '</button>' +
      '<button class="btn" onclick="location.hash=\'dex\'">📖 ' + k('포지션 & 규칙 도감', 'Positions & Rules') + '</button>' +
      '<button class="btn ok" onclick="location.hash=\'quiz\'">⚡ ' + k('실전 아이스하키 퀴즈', 'Hockey Quiz') + '</button></div>';
    app.innerHTML = h;
    document.getElementById('allBtn').onclick = function () { allOpen = !allOpen; localStorage.setItem('hk_all', allOpen ? '1' : '0'); home(); };
  }
  function bug() {
    var items = D.scorebugItems || D.scorebug || [];
    var h = '<div class="card-box">' + back() + '<h2 style="color:var(--gold)">📺 ' + k('링크 선 & 전광판 해독기', 'Rink Lines & Scorebug') + '</h2>' +
      '<div class="scorebug"><span class="sb-teams"><span class="sb-team">NAD 2</span><span class="sb-team">OPP 3</span></span><span class="sb-down">PP 1:48</span><span class="sb-spot">SOG 24 · EN</span><span class="sb-clock">2nd 12:34</span></div>' +
      '<div class="decoder-grid" id="bugBtns">';
    items.forEach(function (it, i) { h += '<button class="btn small" data-i="' + i + '">' + esc(it.badge) + '</button>'; });
    h += '</div><div class="coach-box" id="bugOut">' + k('👆 버튼을 눌러 전광판 항목을 해독하세요.', '👆 Tap a badge to decode it.') + '</div></div>';
    app.innerHTML = h;
    document.getElementById('bugBtns').onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return; var it = items[b.dataset.i]; sfx('tap');
      document.getElementById('bugOut').innerHTML = '<div class="coach-title">' + esc(t(it.label)) + '</div>' + esc(t(it.desc));
    };
  }
  function dex() {
    var h = '<div class="card-box">' + back() + '<h2 style="color:var(--gold)">📖 ' + k('포지션 & 규칙 도감', 'Positions & Rules') + ' (' + D.cards.length + ')</h2><div class="dex-grid">';
    D.cards.forEach(function (c) { h += '<div class="dex-item"><h4>' + esc(c.code) + ' · ' + esc(t(c.name)) + '</h4><div class="role">' + esc(t(c.role)) + '</div><p>' + esc(t(c.desc)) + '</p></div>'; });
    app.innerHTML = h + '</div></div>';
  }
  function quiz(i) {
    var q = D.quiz[i];
    if (!q) { app.innerHTML = '<div class="card-box">' + back() + '<h2>🏆 ' + k('퀴즈 완료!', 'Quiz complete!') + '</h2><button class="btn primary wide" onclick="location.hash=\'\'">' + k('홈으로', 'Home') + '</button></div>'; return; }
    var h = '<div class="card-box">' + back() + '<h3>⚡ ' + (i + 1) + '/' + D.quiz.length + '</h3><p style="font-weight:500">' + esc(t(q.q)) + '</p>';
    q.opts.forEach(function (o, j) { h += '<button class="btn quiz-opt" data-j="' + j + '">' + esc(t(o)) + '</button>'; });
    app.innerHTML = h + '<div id="qOut"></div></div>';
    var answered = false;
    app.querySelectorAll('.quiz-opt').forEach(function (b) {
      b.onclick = function () {
        if (answered) return; answered = true; var j = +b.dataset.j, ok = j === q.ans;
        b.classList.add(ok ? 'correct' : 'wrong'); app.querySelectorAll('.quiz-opt')[q.ans].classList.add('correct'); sfx(ok ? 'firstdown' : 'bad');
        document.getElementById('qOut').innerHTML = '<div class="coach-box"><div class="coach-title">' + (ok ? k('정답! 🎉', 'Correct! 🎉') : k('정답은: ', 'Answer: ') + esc(t(q.opts[q.ans]))) + '</div>' + esc(t(q.exp)) +
          '</div><button class="btn primary wide" id="qNext">' + k('다음 문제 ▶', 'Next ▶') + '</button>';
        document.getElementById('qNext').onclick = function () { quiz(i + 1); };
      };
    });
  }


  /* ---------- Stage scripts (rink x: 0–200ft, attack → right) ---------- */
  function O(ko, en, dko, den, x) { var o = { l: { ko: ko, en: en }, d: { ko: dko, en: den } }; for (var p in x) o[p] = x[p]; return o; }
  function M(ko, en) { return { ko: ko, en: en }; }
  function T(x, y, ok, n, x2) { var o = { x: x, y: y, ok: ok, n: n }; for (var p in x2) o[p] = x2[p]; return o; }
  var TAP = M('초록 원 동료를 링크에서 탭해 패스!', 'Tap the green-ring teammate on the rink to pass!');
  function shot(ko, en, msg) { return { timing: 1, say: M(ko, en), goal: 1, msg: msg }; }
  var SLAP = shot('바가 초록 구간에 올 때 SHOOT! (슬랩샷)', 'SHOOT when the bar hits green! (slap shot)');
  var SCRIPTS = {
    1: function () { return { S: { px: 70, py: 0.5, score: [0, 0], per: '1st', clock: 1200, str: '5v5' }, steps: [
      { guide: 1, say: M('따라 하기: 퍽을 가진 동료가 파란 선 앞! 퍽이 먼저 파란 선을 넘어야 해요. 반짝이는 버튼!', 'Guided: The puck must cross the blue line before your skaters. Tap the glowing button!'), hint: M('사람이 먼저 넘으면 오프사이드!', 'Skaters first = Offside!'),
        opts: [O('🏒 퍽 몰고 함께 진입', '🏒 Carry the puck in', '퍽이 먼저 선을 넘어요', 'Puck crosses first', { ok: 1, rec: 1, fx: function (S) { S.px = 135; }, msg: M('온사이드! 퍽이 먼저 들어갔어요 ✅', 'Onside! The puck went in first ✅') }),
          O('⛸️ 윙어 먼저 돌진', '⛸️ Winger rushes ahead', '퍽보다 먼저', 'Ahead of the puck', { bad: M('오프사이드! 🚨 윙어가 퍽보다 먼저 파란 선을 넘었어요.', 'Offside! The winger beat the puck over the line.') })] },
      SLAP,
      { say: M('페이스오프 후 다시 중립 지역. 파란 선 앞(아직 안 넘은) 동료에게 패스하세요!', 'Back in the neutral zone. Pass to the teammate still outside the blue line!'), hint: M('파란 선 너머에 미리 들어가 있는 동료는 오프사이드!', 'A teammate already past the line is offside!'),
        tap: [T(118, 0.25, 1, 'LW', { to: 118 }), T(142, 0.75, 0, 'RW', { bad: M('오프사이드! RW가 이미 파란 선 안에 있어요.', 'Offside! RW is already in the zone.') })] },
      { timing: 1, say: M('동료가 파란 선 쪽으로 질주 중! 퍽을 앞에 먼저 밀어 넣기 — 초록 구간에서 PASS!', 'Your teammate is racing to the line — PASS when green so the puck crosses first!'), btn: 'PASS', msg: M('퍽이 먼저 선을 통과! 온사이드 ✅', 'Puck crossed first — onside ✅'), fx: function (S) { S.px = 140; } },
      SLAP
    ] }; },
    2: function () { return { S: { px: 45, py: 0.5, score: [1, 1], per: '2nd', clock: 900, str: '5v5' }, steps: [
      { guide: 1, say: M('따라 하기: 퍽이 우리 진영(빨간 선 전)! 여기서 멀리 치면 아이싱. 먼저 빨간 선을 넘어요.', 'Guided: The puck is in your half. A long clear here is Icing — cross the red line first.'), hint: M('빨간 선 = 링크 정중앙.', 'Red line = center of the rink.'),
        opts: [O('⛸️ 빨간 선까지 몰고 가기', '⛸️ Skate past the red line', '그 다음 덤프인', 'Then dump it in', { ok: 1, rec: 1, fx: function (S) { S.px = 108; }, msg: M('빨간 선 통과! 이제 덤프인해도 아이싱 아님 ✅', 'Past the red line — a dump-in is now legal ✅') }),
          O('💥 지금 멀리 치기', '💥 Fire it deep now', '우리 진영에서', 'From your half', { bad: M('아이싱! 🚨 퍽이 우리 진영으로 돌아와 페이스오프.', 'Icing! Faceoff back in your zone.') })] },
      { say: M('덤프인! 퍽을 코너로 보낸 뒤 먼저 달려간 동료를 탭하세요.', 'Dump it in! Tap the teammate chasing into the corner.'), hint: M('코너에 수비가 없는 쪽!', 'The corner without a defender!'),
        tap: [T(185, 0.12, 1, 'C', { to: 185 }), T(185, 0.88, 0, 'D?', { bad: M('상대 수비가 먼저 잡았어요!', 'The defender got there first!') })] },
      { say: M('코너에서 퍽 확보! 슬롯(골문 앞)의 빈 동료에게 패스!', 'Corner won! Pass to the open man in the slot!'), hint: M('초록 원!', 'Green ring!'), tap: [T(165, 0.45, 1, 'RW', { to: 165 }), T(150, 0.8, 0, 'LW', { bad: M('패스가 막혔어요!', 'Pass blocked!') })] },
      SLAP
    ] }; },
    3: function () { return { S: { px: 140, py: 0.5, score: [1, 2], per: '2nd', clock: 600, str: '5v4', pp: 120 }, steps: [
      { guide: 1, say: M('따라 하기: 상대 트리핑으로 2분 퇴장! 5대4 파워플레이. 포인트(파란 선 근처) 디펜스맨에게 패스해 판을 넓혀요.', 'Guided: Opponent tripping — 2-minute minor! 5-on-4. Pass back to the point to spread them out.'), hint: M('수적 우위는 패스로 빈 사람을 만드는 것!', 'Use the extra man by moving the puck!'),
        opts: [O('↩️ 포인트로 패스', '↩️ Pass to the point', '판 넓히기', 'Spread the box', { ok: 1, rec: 1, fx: function (S) { S.px = 130; S.py = 0.3; } }), O('🏒 혼자 돌파', '🏒 Solo deke', '4명에게 막힘', 'Into 4 defenders', { bad: M('4명 박스 수비에 막혔어요! 패스를 돌려요.', 'Stopped by the box! Move the puck.') })] },
      { say: M('패스 돌리기 ①: 반대편 포인트의 빈 동료!', 'Cycle ①: the open man at the far point!'), hint: M('초록 원!', 'Green ring!'), tap: [T(130, 0.72, 1, 'D2', { to: 130 }), T(160, 0.5, 0, 'C', { bad: M('PK 수비가 가로챌 뻔! 빈 곳으로.', 'Nearly intercepted!') })] },
      { say: M('패스 돌리기 ②: 골리가 반대로 움직였어요! 서클의 원타이머 슈터에게!', 'Cycle ②: the goalie shifted! Feed the one-timer in the circle!'), hint: M('골리 반대편이 빈틈!', 'Opposite the goalie!'), tap: [T(165, 0.25, 1, 'RW', { to: 165 }), T(165, 0.75, 0, 'LW', { bad: M('골리가 바로 그쪽에 있어요!', 'The goalie is right there!') })] },
      shot('원타이머! 패스가 오는 순간 초록 구간에서 SHOOT!', 'One-timer! SHOOT in the green as the pass arrives!', M('파워플레이 골! 🚨 퇴장 선수는 즉시 복귀(5대5).', 'Power-play goal! 🚨 The penalized player returns at once (5-on-5).')),
      { say: M('퀴즈 상황: 다음 날, 우리가 4명(페널티킬)일 때 우리 진영에서 퍽을 멀리 걷어냈어요. 아이싱일까요?', 'Next game we are short-handed (4) and clear it from our zone. Icing?'), hint: M('페널티킬 팀은 특별 규칙!', 'Special rule for the PK team!'),
        opts: [O('✅ 아이싱 아님', '✅ No icing', '페널티킬은 면제', 'PK is exempt', { ok: 1, msg: M('정답! 페널티킬 팀은 아이싱이 면제돼요.', 'Right! Short-handed teams may ice the puck.') }), O('🚨 아이싱', '🚨 Icing', '평소처럼', 'As usual', { bad: M('수적 열세 팀은 아이싱 면제예요!', 'Short-handed teams are exempt!') })] }
    ] }; },
    4: function () { return { S: { px: 100, py: 0.5, score: [2, 3], per: '3rd', clock: 180, str: '5v5', stam: 18 }, steps: [
      { guide: 1, say: M('따라 하기: 우리 라인 체력 18%! 퍽을 상대 진영에 넣고 벤치에서 플라잉 체인지!', 'Guided: Your line is at 18% stamina! Dump it in and change on the fly!'), hint: M('하키는 경기 중에 실시간 교체해요.', 'Changes happen while play continues.'),
        opts: [O('🔁 덤프인 후 교체', '🔁 Dump in & change', '새 라인 투입', 'Fresh legs', { ok: 1, rec: 1, fx: function (S) { S.stam = 100; S.px = 185; }, msg: M('플라잉 체인지 성공! 체력 100% 🔋', 'Flying change done! Stamina 100% 🔋') }), O('😮‍💨 그냥 계속', '😮‍💨 Keep going', '지친 채로', 'Exhausted', { bad: M('지친 라인이 역습을 허용했어요!', 'The tired line got burned!') })] },
      { say: M('또 체력이 바닥(25%)! 벤치 앞 교체 구역을 링크에서 탭하세요. (6명 넘게 뛰면 투 매니 멘!)', 'Tired again (25%)! Tap the bench change zone. (Too many men = penalty!)'), hint: M('나가는 선수가 들어온 뒤 교체!', 'Swap near the bench!'),
        fx0: function (S) { S.stam = 25; }, tap: [T(90, 0.04, 1, 'BENCH', { to: 90, fx: function (S) { S.stam = 100; } }), T(60, 0.96, 0, '❌', { bad: M('그곳은 상대 벤치 쪽이에요!', "That is the other team's bench!") })] },
      { say: M('2:3, 1:00 남음! 동점을 위해 마지막 승부수는?', '2–3 with 1:00 left! The final gamble?'), hint: M('골리를 빼면 공격수가 6명!', 'Pull the goalie for 6 attackers!'),
        opts: [O('🥅 골리 빼기 (6대5)', '🥅 Pull the goalie (6-on-5)', '엠프티 넷', 'Empty net', { ok: 1, fx: function (S) { S.clock = 60; S.str = '6v5 EN'; S.px = 150; }, msg: M('골리 OUT! 6명 총공격 — 우리 골문은 비었어요!', 'Goalie out! 6 attackers — our net is empty!') }), O('⏳ 그대로 5대5', '⏳ Stay 5-on-5', '시간만 흐름', 'Time runs out', { bad: M('수적 우위 없이 시간이 흘러가요!', 'No advantage and time is ticking!') })] },
      { say: M('6대5! 남는 1명(빈 동료)을 찾아 패스!', '6-on-5! Find the extra open man!'), hint: M('초록 원!', 'Green ring!'), tap: [T(170, 0.3, 1, 'X6', { to: 170 }), T(160, 0.7, 0, 'C', { bad: M('막혔어요! 남는 사람을 찾아요.', 'Covered! Find the free man.') })] },
      shot('동점 찬스! 초록 구간에서 SHOOT!', 'Tying chance! SHOOT in the green!', M('동점골! 3:3 🚨 6대5 성공!', 'Tying goal! 3–3 🚨'))
    ] }; },
    5: function () { return { S: { px: 170, py: 0.5, score: [3, 3], per: '3rd', clock: 300, str: '5v5' }, steps: [
      { guide: 1, say: M('따라 하기: 골문 뒤 "그레츠키 오피스"로 퍽을 가져가요. 골리가 등을 돌려야 해서 패스가 쉬워요!', "Guided: Take the puck behind the net — Gretzky's Office. The goalie must turn!"), hint: M('골문 뒤 공간!', 'Behind the net!'),
        opts: [O('🏢 골문 뒤로', '🏢 Behind the net', '그레츠키 오피스', "Gretzky's Office", { ok: 1, rec: 1, fx: function (S) { S.px = 194; S.py = 0.5; } }), O('💥 먼 거리 슛', '💥 Long shot', '골리 정면', 'Right at the goalie', { bad: M('골리 정면 선방! 각도를 만들어요.', 'Easy save! Create an angle.') })] },
      { say: M('골문 뒤에서 슬롯의 빈 동료에게 패스! 골이 들어가면 어시스트가 기록돼요.', 'From behind the net, feed the open man in the slot!'), hint: M('초록 원!', 'Green ring!'), tap: [T(172, 0.4, 1, 'C', { to: 180, goal: 1 }), T(150, 0.85, 0, 'D', { bad: M('너무 멀어요!', 'Too far!') })] },
      { say: M('골! 이 골에 퍽을 먼저 만진 동료 3명이 있었어요. 어시스트는 몇 명에게?', 'Goal! Three teammates touched it before. How many assists?'), hint: M('골 1개당 최대 2명!', 'Max two per goal!'),
        opts: [O('2명 (각 1포인트)', '2 (1 point each)', '최대 2명', 'Max 2', { ok: 1, fx: function (S) { S.score = [4, 4]; S.per = 'OT'; S.str = '3v3'; S.clock = 300; S.px = 100; }, msg: M('정답! …하지만 상대도 동점골 4:4. 3대3 서든데스 연장!', 'Correct! …but they tie it 4–4. 3-on-3 sudden-death OT!') }), O('3명', '3', '모두', 'All', { bad: M('어시스트는 최대 2명까지!', 'Only up to 2 assists!') })] },
      { say: M('3대3 연장! 빙판이 넓어요. 무리하지 말고 퍽을 지키며 빈 동료를 찾아요.', '3-on-3 OT! Lots of ice. Keep possession and find the open man.'), hint: M('3대3은 소유가 생명!', 'Possession is king in 3-on-3!'), tap: [T(150, 0.2, 1, 'W', { to: 150 }), T(140, 0.6, 0, '❌', { bad: M('턴오버! 역습 위기!', 'Turnover! Odd-man rush against!') })] },
      { timing: 1, say: M('OT 슛! 초록 구간에서 SHOOT!', 'OT shot! SHOOT in the green!'), msg: M('골대 맞고 튕김! 0:00 — 슛아웃으로!', 'Off the post! 0:00 — to the shootout!'), fx: function (S) { S.per = 'SO'; S.str = '1v1'; S.px = 165; S.clock = 0; } },
      { say: M('슛아웃 1대1! 골리가 왼쪽으로 쏠렸어요. 빈 골문 구석을 탭!', 'Shootout 1-on-1! The goalie bit left. Tap the open corner!'), hint: M('골리 반대편!', 'Opposite the goalie!'), tap: [T(197, 0.6, 1, '🥅', { to: 197, goal: 1 }), T(197, 0.4, 0, 'G', { bad: M('골리 선방! 반대편을 노려요.', 'Saved! Go the other way.') })] }
    ] }; }
  };

  /* ---------- Stage engine ---------- */
  var G = null, raf = 0;
  function stopAll() { cancelAnimationFrame(raf); }
  function stage(n) { stopAll(); var sc = SCRIPTS[n](); sc.S.hearts = 3; G = { n: n, st: D.stages[n - 1], S: sc.S, steps: sc.steps.slice(), cur: null, msg: null }; next(); }
  function next() { G.cur = G.steps.shift(); if (!G.cur) return win(); if (G.cur.fx0) G.cur.fx0(G.S); draw(); }
  function clk(S) { var c = Math.max(0, S.clock); return S.per + ' ' + Math.floor(c / 60) + ':' + ('0' + c % 60).slice(-2); }
  function draw() {
    var S = G.S, c = G.cur;
    var h = '<div class="goal-bar">' + back() + '🎯 ' + esc(t(G.st.goal)) + '</div><div class="scorebug"><span class="sb-teams"><span class="sb-team">NAD ' + S.score[0] + '</span><span class="sb-team">OPP ' + S.score[1] + '</span></span>' +
      '<span class="sb-down">' + S.str + '</span><span class="sb-clock">' + clk(S) + '</span>' + (S.stam != null ? '<span class="sb-spot">🔋 ' + S.stam + '%</span>' : '') +
      '<span class="hearts">' + '❤️'.repeat(S.hearts) + '🤍'.repeat(3 - S.hearts) + '</span></div><div class="field-wrap"><canvas id="rinkCanvas" style="display:block;width:100%;height:320px;touch-action:manipulation"></canvas></div>';
    if (G.msg) h += '<div class="coach-box" style="border-left-color:' + (G.msg.ok ? 'var(--ok)' : 'var(--red)') + '"><b>' + esc(G.msg.t) + '</b></div>';
    h += '<div class="coach-box"><div class="coach-title">' + (c.guide ? '<span class="badge-guide">' + k('따라 하기', 'Guided') + '</span> ' : '') + k('🧢 코치', '🧢 Coach') + '</div>' + esc(t(c.say)) +
      (c.hint ? ' <button class="btn small" id="hintBtn">💡 ' + k('힌트', 'Hint') + '</button><div id="hintOut"></div>' : '') + '</div>';
    if (c.opts) { h += '<div class="play-grid">'; c.opts.forEach(function (o, i) { h += '<button class="btn play-btn' + (o.rec ? ' recommend primary' : '') + '" data-i="' + i + '">' + (o.rec ? '<span class="badge-guide">✨ ' + k('추천', 'Pick') + '</span>' : '') + '<span class="p-title">' + esc(t(o.l)) + '</span><span class="p-desc">' + esc(t(o.d)) + '</span></button>'; }); h += '</div>'; }
    if (c.timing) h += '<div style="position:relative;height:30px;background:#333;border-radius:10px;margin:8px 0"><div style="position:absolute;left:42%;width:16%;height:100%;background:var(--ok);opacity:.6"></div><div id="kickMark" style="position:absolute;left:0;width:6px;height:100%;background:var(--gold)"></div></div><button class="btn primary wide" id="kickBtn">🏒 ' + (c.btn || 'SHOOT') + '!</button>';
    app.innerHTML = h;
    var hb = document.getElementById('hintBtn'); if (hb) hb.onclick = function () { document.getElementById('hintOut').textContent = '💡 ' + t(c.hint); };
    app.querySelectorAll('.play-btn').forEach(function (b) { b.onclick = function () { choose(c.opts[+b.dataset.i]); }; });
    paint(); var cv = document.getElementById('rinkCanvas'); cv.onclick = function (e) { tapRink(e, cv); };
    if (c.timing) startBar();
  }
  function paint() {
    var cv = document.getElementById('rinkCanvas'); if (!cv) return;
    var r = window.devicePixelRatio || 1, W = cv.clientWidth, H = cv.clientHeight; cv.width = W * r; cv.height = H * r;
    var g = cv.getContext('2d'); g.scale(r, r); var S = G.S, c = G.cur; function X(x) { return x / 200 * W; }
    g.fillStyle = '#f4faff'; g.beginPath(); if (g.roundRect) g.roundRect(2, 2, W - 4, H - 4, 40); else g.rect(2, 2, W - 4, H - 4); g.fill();
    function vl(x, col, w) { g.strokeStyle = col; g.lineWidth = w; g.beginPath(); g.moveTo(X(x), 4); g.lineTo(X(x), H - 4); g.stroke(); }
    vl(11, '#e03131', 2); vl(189, '#e03131', 2); vl(75, '#1c7ed6', 8); vl(125, '#1c7ed6', 8); vl(100, '#e03131', 6);
    g.strokeStyle = '#1c7ed6'; g.lineWidth = 2; g.beginPath(); g.arc(X(100), H / 2, H * 0.15, 0, 7); g.stroke();
    [[31, 0.27], [31, 0.73], [169, 0.27], [169, 0.73]].forEach(function (p) { g.strokeStyle = '#e03131'; g.beginPath(); g.arc(X(p[0]), p[1] * H, H * 0.14, 0, 7); g.stroke(); });
    g.fillStyle = 'rgba(77,171,247,.45)'; [11, 189].forEach(function (x, i) { g.beginPath(); g.arc(X(x), H / 2, H * 0.08, i ? Math.PI / 2 : -Math.PI / 2, i ? Math.PI * 1.5 : Math.PI / 2); g.fill(); });
    g.fillStyle = '#c92a2a'; g.fillRect(X(189), H / 2 - 12, X(4), 24); g.fillRect(X(7), H / 2 - 12, X(4), 24);
    g.font = '700 11px sans-serif'; g.textAlign = 'center'; g.fillStyle = '#1c7ed6'; g.fillText('BLUE', X(125), 14); g.fillText('BLUE', X(75), 14); g.fillStyle = '#e03131'; g.fillText('RED', X(100), 14);
    function dot(x, y, col, lab) { g.fillStyle = col; g.beginPath(); g.arc(X(x), y * H, 9, 0, 7); g.fill(); if (lab) { g.fillStyle = '#222'; g.fillText(lab, X(x), y * H + 22); } }
    var nOpp = S.str === '5v4' ? 4 : S.str === '3v3' ? 3 : S.str === '1v1' ? 0 : 5;
    [0.3, 0.5, 0.7, 0.4, 0.6].slice(0, nOpp).forEach(function (f, i) { dot(Math.min(186, S.px + 12 + i * 4), f, '#e03131'); });
    dot(S.str === '6v5 EN' ? -50 : 15, 0.5, '#1864ab', 'G'); dot(186, 0.5, '#c92a2a', S.str === '1v1' ? 'G' : '');
    g.fillStyle = '#111'; g.beginPath(); g.ellipse(X(S.px), (S.py || 0.5) * H, 6, 4, 0, 0, 7); g.fill();
    if (c && c.tap) c.tap.forEach(function (tg) { var x = X(tg.x), y = tg.y * H; tg.px = x; tg.py = y; g.lineWidth = 4; g.strokeStyle = tg.ok ? '#2f9e44' : '#e03131'; g.beginPath(); g.arc(x, y, 18, 0, 7); g.stroke(); g.fillStyle = '#222'; g.fillText(tg.n + (tg.ok ? ' ✓' : ' ✕'), x, y - 24); });
  }
  function say(x, ok) { G.msg = { t: x, ok: ok }; }
  function miss(m) { stopAll(); var S = G.S; S.hearts--; sfx('bad'); var x = '❌ ' + t(m); if (S.hearts <= 0) { S.hearts = 3; x += k(' · 하트 충전! 그 자리에서 계속 💪', ' · Hearts refilled! Keep going 💪'); } say(x, false); draw(); }
  function goal(S, msg) { S.score[0]++; sfx('touchdown'); say(msg ? t(msg) : k('🚨 골! ', '🚨 GOAL! ') + S.score[0] + ':' + S.score[1], true); if (S.str === '5v4') S.str = '5v5'; }
  function choose(o) {
    if (o.bad) return miss(o.bad);
    stopAll(); sfx('tap'); G.msg = null; if (o.fx) o.fx(G.S); if (o.msg) say(t(o.msg), true); if (o.then) G.steps = o.then.concat(G.steps); next();
  }
  function tapRink(e, cv) {
    var c = G.cur; if (!c || !c.tap) return; var r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, hit = null;
    c.tap.forEach(function (tg) { if (Math.hypot(tg.px - x, tg.py - y) < 32) hit = tg; }); if (!hit) return;
    if (!hit.ok) return miss(hit.bad || M('막혔어요! 초록 원을 노려요.', 'Blocked! Aim for the green ring.'));
    sfx('throw'); G.msg = null; var S = G.S; S.px = hit.to || hit.x; S.py = hit.y; if (S.clock > 8) S.clock -= 6; if (hit.fx) hit.fx(S); if (hit.goal) goal(S); next();
  }
  function startBar() {
    var t0 = performance.now(), mk = document.getElementById('kickMark'), pos = 0;
    (function loop() { pos = (Math.sin((performance.now() - t0) / 420) + 1) / 2 * 97; mk.style.left = pos + '%'; raf = requestAnimationFrame(loop); })();
    document.getElementById('kickBtn').onclick = function () {
      var c = G.cur; if (pos < 40 || pos > 58) return miss(M('타이밍이 빗나갔어요! 초록 구간에서 다시.', 'Missed the timing! Try again in the green.'));
      stopAll(); sfx('kick'); G.msg = null; var S = G.S;
      if (c.fx) c.fx(S); if (c.goal) { S.px = 190; goal(S, c.msg); } else if (c.msg) say(t(c.msg), true);
      next();
    };
  }
  function win() {
    stopAll(); done[G.n] = 1; localStorage.setItem('hk_done', JSON.stringify(done)); sfx('touchdown'); var S = G.S;
    app.innerHTML = '<div class="card-box"><h2 style="color:var(--gold)">🏆 ' + esc(t(G.st.title)) + ' ' + k('클리어!', 'Clear!') + '</h2>' + (G.msg ? '<p><b>' + esc(G.msg.t) + '</b></p>' : '') +
      '<p>' + k('스코어 ', 'Score ') + S.score[0] + ' : ' + S.score[1] + ' · ' + '❤️'.repeat(S.hearts) + '</p><div class="coach-box"><div class="coach-title">📘 ' + k('왜 그럴까?', 'Why?') + '</div>' + esc(t(G.st.why)) + '</div>' +
      (G.n < 5 ? '<button class="btn primary wide" onclick="location.hash=\'s' + (G.n + 1) + '\'">▶ ' + k('다음 스테이지', 'Next Stage') + '</button>' : '') + '<button class="btn wide" onclick="location.hash=\'\'">🏠 ' + k('스테이지 목록', 'Stages') + '</button></div>';
  }
  window.addEventListener('resize', function () { if (G && document.getElementById('rinkCanvas')) paint(); });
  muteBtn.textContent = A && A.isMuted && A.isMuted() ? '🔇' : '🔊';
  window.__nadooG = function () { return G; };
  route();
})();
