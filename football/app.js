/* Nadoo Touchdown 101 — app */
'use strict';
(function () {
  var D = FB_DATA, A = window.FB_AUDIO, L = localStorage.getItem('fb_lang') || 'ko';
  var app = document.getElementById('app'), allOpen = localStorage.getItem('fb_all') === '1';
  var done = JSON.parse(localStorage.getItem('fb_done') || '{}');
  function t(o) { return o && typeof o === 'object' ? (o[L] || o.ko) : o; }
  function k(ko, en) { return L === 'ko' ? ko : en; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function sfx(n) { try { A && A.sfx(n); } catch (e) {} }
  var langBtn = document.getElementById('langBtn'), muteBtn = document.getElementById('muteBtn');
  langBtn.onclick = function () { L = L === 'ko' ? 'en' : 'ko'; localStorage.setItem('fb_lang', L); route(); };
  muteBtn.onclick = function () { if (!A) return; A.toggleMute(); muteBtn.textContent = A.isMuted() ? '🔇' : '🔊'; };
  document.addEventListener('pointerdown', function once() { try { A && A.startBgm(); } catch (e) {} document.removeEventListener('pointerdown', once); });
  function setHead() {
    langBtn.textContent = L === 'ko' ? 'EN' : '한국어';
    document.getElementById('brand').textContent = k('🏈 나두 터치다운 101', '🏈 Nadoo Touchdown 101');
    document.getElementById('homeLink').textContent = k('🏠 홈', '🏠 Home');
    document.documentElement.lang = L;
  }
  function route() { stopAll(); setHead(); var h = location.hash.slice(1); if (/^s\d$/.test(h)) stage(+h[1]); else if (h === 'bug') bug(); else if (h === 'dex') dex(); else if (h === 'quiz') quiz(0); else home(); window.scrollTo(0, 0); }
  window.addEventListener('hashchange', route);
  function back() { return '<button class="btn small" onclick="location.hash=\'\'">⬅ ' + k('목록', 'Back') + '</button> '; }

  function home() {
    var h = '<div class="card-box"><h2 style="margin:0 0 6px;color:var(--gold)">' + k('🏈 미식축구, 5단계로 끝내기', '🏈 Football in 5 Stages') + '</h2><p style="margin:0">' +
      k('따라 하기 → 실전 플레이로 규칙을 몸으로 익혀요. 실수해도 ❤️만 줄고 그 자리에서 계속!', 'Guided step, then live play. Mistakes only cost a ❤️ — keep going!') + '</p>' +
      '<button class="btn small wide" id="allBtn">⚙️ ' + (allOpen ? k('전체 열기 ON', 'Unlock all ON') : k('전체 열기', 'Unlock all')) + '</button></div><div class="stage-list">';
    D.stages.forEach(function (s, i) {
      var open = allOpen || i === 0 || done[i];
      h += '<div class="stage-card"><div><h3>' + s.icon + ' ' + esc(t(s.title)) + (done[i + 1] ? ' ✅' : '') + '</h3><p>' + esc(t(s.sub)) + '</p></div>' +
        (open ? '<button class="btn primary" onclick="location.hash=\'s' + s.id + '\'">▶</button>' : '<span style="font-size:24px">🔒</span>') + '</div>';
    });
    h += '</div><div class="decoder-grid"><button class="btn blue" onclick="location.hash=\'bug\'">📺 ' + k('중계 전광판 해독기', 'Scorebug Decoder') + '</button>' +
      '<button class="btn" onclick="location.hash=\'dex\'">📖 ' + k('포지션 & 규칙 도감', 'Positions & Rules') + '</button>' +
      '<button class="btn ok" onclick="location.hash=\'quiz\'">⚡ ' + k('실전 미식축구 퀴즈', 'Football Quiz') + '</button></div>';
    app.innerHTML = h;
    document.getElementById('allBtn').onclick = function () { allOpen = !allOpen; localStorage.setItem('fb_all', allOpen ? '1' : '0'); home(); };
  }
  function bug() {
    var items = D.scorebugItems || D.scorebug || [];
    var h = '<div class="card-box">' + back() + '<h2 style="color:var(--gold)">📺 ' + k('중계 전광판 해독기', 'Scorebug Decoder') + '</h2>' +
      '<div class="scorebug"><span class="sb-teams"><span class="sb-team">NAD 21</span><span class="sb-team">OPP 24</span></span><span class="sb-down">2nd & 4</span><span class="sb-spot">OPP 18 🚨</span><span class="sb-clock">Q4 01:42 · 25</span></div>' +
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

  /* ---------- Stage scripts ---------- */
  function O(ko, en, dko, den, x) { var o = { l: { ko: ko, en: en }, d: { ko: dko, en: den } }; for (var p in x) o[p] = x[p]; return o; }
  function M(ko, en) { return { ko: ko, en: en }; }
  function lanes(okI, gain) { return [{ x: -2, y: 0.35, ok: okI === 0, g: gain, n: 'A' }, { x: -2, y: 0.55, ok: okI === 1, g: gain, n: 'B' }, { x: -2, y: 0.75, ok: okI === 2, g: gain, n: 'C' }]; }
  function recv(okI, gain) { return [{ x: 6, y: 0.15, ok: okI === 0, g: gain, n: 'WR1' }, { x: 9, y: 0.5, ok: okI === 1, g: gain, n: 'TE' }, { x: 6, y: 0.85, ok: okI === 2, g: gain, n: 'WR2' }]; }
  var TAPRUN = M('초록 빛 빈틈(Hole)을 필드에서 탭하세요! 빨간 수비가 막은 곳은 피하세요.', 'Tap the glowing green gap on the field! Avoid red-covered lanes.');
  var TAPPASS = M('수비가 떨어진(초록 원) 리시버를 필드에서 탭해 패스!', 'Tap the open receiver (green ring) on the field to throw!');
  var SCRIPTS = {
    1: function () { return { S: { los: 25, fd: 35, down: 1 }, need: 2, steps: [
      { guide: 1, say: M('따라 하기: 지금은 1st & 10. 먼저 안전한 런(Run)으로 시작해 봐요. 반짝이는 버튼을 누르세요!', 'Guided: It is 1st & 10. Start with a safe Run — tap the glowing button!'), hint: M('런은 짧지만 안전하게 전진합니다.', 'Runs gain steady, safe yards.'),
        opts: [O('🏃 런 (Run)', '🏃 Run', '러닝백에게 핸드오프', 'Hand off to the RB', { ok: 1, rec: 1, sfx: 'hut', then: [{ tap: lanes(1, 6), say: TAPRUN }] }), O('🎯 숏 패스', '🎯 Short Pass', '가이드에서는 런 먼저!', 'Guided: Run first!', { bad: M('따라 하기에서는 반짝이는 런 버튼을 눌러요!', 'In guided mode, tap the glowing Run!') })] },
      { say: M('2nd & 4! 노란 선까지 4야드. 이제 직접 골라요: 런 또는 숏 패스!', '2nd & 4! 4 yards to the yellow line. Your call: Run or Short Pass!'), hint: M('어느 쪽이든 빈틈/빈 리시버만 고르면 노란 선을 넘어요.', 'Either works if you pick the open lane/receiver.'),
        opts: [O('🏃 런', '🏃 Run', '빈틈 돌파', 'Burst a gap', { ok: 1, sfx: 'hut', then: [{ tap: lanes(2, 5), say: TAPRUN }] }), O('🎯 숏 패스', '🎯 Short Pass', '빈 리시버에게', 'To the open man', { ok: 1, sfx: 'hut', then: [{ tap: recv(0, 7), say: TAPPASS }] })] },
      { say: M('새로운 1st & 10! 한 번 더 노란 선을 넘어 보세요.', 'Fresh 1st & 10! Cross the yellow line once more.'), hint: M('숏 패스로 크게 전진하면 한 번에 10야드!', 'A pass can gain 10+ at once!'),
        opts: [O('🏃 런', '🏃 Run', '빈틈 돌파', 'Burst a gap', { ok: 1, sfx: 'hut', then: [{ tap: lanes(0, 10), say: TAPRUN }] }), O('🎯 숏 패스', '🎯 Short Pass', '빈 리시버에게', 'To the open man', { ok: 1, sfx: 'hut', then: [{ tap: recv(2, 11), say: TAPPASS }] })] }
    ] }; },
    2: function () { return { S: { los: 40, fd: 50, down: 1 }, need: 2, steps: [
      { guide: 1, say: M('따라 하기: 패스를 고르면 포켓 타이머가 돌아요. 바가 끝나기 전에 빈 리시버를 탭! (늦으면 색 Sack)', 'Guided: Passing starts a pocket timer. Tap the open receiver before it runs out (or get Sacked)!'), hint: M('타이머는 버튼을 누른 뒤에만 시작돼요.', 'The timer only starts after you tap.'),
        opts: [O('🎯 패스', '🎯 Pass', '포켓 타이머 3.5초', '3.5s pocket', { ok: 1, rec: 1, sfx: 'hut', then: [{ tap: recv(1, 12), timer: 3.5, say: TAPPASS }] }), O('🏃 런', '🏃 Run', '가이드는 패스 먼저', 'Guided: pass first', { bad: M('반짝이는 패스 버튼부터!', 'Tap the glowing Pass first!') })] },
      { say: M('1st & 10. 수비가 패스 러시를 준비 중! 안전한 런 빈틈을 고르거나 빠르게 패스하세요.', '1st & 10. The rush is coming! Pick a safe Run gap or pass fast.'), hint: M('타이머가 더 짧아요(2.5초)!', 'Shorter timer (2.5s)!'),
        opts: [O('🏃 런', '🏃 Run', '안전한 빈틈', 'Safe gap', { ok: 1, sfx: 'hut', then: [{ tap: lanes(2, 4), say: TAPRUN }, { tap: lanes(0, 7), say: TAPRUN }] }), O('🎯 패스', '🎯 Pass', '2.5초 포켓', '2.5s pocket', { ok: 1, sfx: 'hut', then: [{ tap: recv(2, 11), timer: 2.5, say: TAPPASS }] })] }
    ] }; },
    3: function () { return { S: { los: 22, fd: 31, down: 4 }, need: 3, steps: [
      { guide: 1, say: M('따라 하기 · 상황 1: 우리 진영 22야드, 4th & 9! 실패하면 우리 골대 앞에서 공을 뺏겨요.', 'Guided · Case 1: 4th & 9 at your own 22! Failing hands the ball over near your goal.'), hint: M('멀리 차서 상대를 뒤로 밀어내요.', 'Kick it far to pin them back.'),
        opts: [O('🦵 펀트 (Punt)', '🦵 Punt', '멀리 차서 넘기기', 'Kick it deep', { ok: 1, rec: 1, sfx: 'kick', msg: M('펀트 45야드! 상대는 자기 33야드에서 시작 👍', '45-yd punt! Opponent starts at their 33 👍'), fx: function (S) { S.los = 78; S.fd = 87; S.down = 4; S.togo = 5; S.spot = 'OPP 22'; S.los = 78; S.fd = 83; } }),
          O('💪 강행 (Go)', '💪 Go for It', '9야드는 너무 멀어요', '9 yards is too far', { bad: M('9야드 강행 실패 = 우리 22야드에서 공 뺏김!', 'Failing on 4th & 9 gives the ball away at your 22!') }), O('🥅 필드골', '🥅 Field Goal', '95야드 킥?', '95-yd kick?', { bad: M('너무 멀어요! 필드골은 보통 55야드 이내.', 'Way too far! FGs are usually under 55 yds.') })] },
      { say: M('상황 2: 상대 22야드, 4th & 5. 킥 거리 약 40야드 — 3점을 노려요!', 'Case 2: 4th & 5 at the opponent 22. ~40-yd kick — go for 3!'), hint: M('필드골을 고른 뒤, 움직이는 바가 초록 구간일 때 KICK!', 'Pick Field Goal, then KICK when the bar is in green!'),
        opts: [O('🥅 필드골 (3점)', '🥅 Field Goal (3)', '타이밍 킥', 'Timed kick', { ok: 1, then: [{ timing: 1, say: M('바가 초록 구간에 오면 KICK!', 'KICK when the bar hits green!'), msg: M('필드골 성공! +3점 🥅', 'Field goal is GOOD! +3 🥅'), fx: function (S) { S.score[0] += 3; S.los = 50; S.fd = 51; S.down = 4; } }] }),
          O('🦵 펀트', '🦵 Punt', '점수 기회 버림', 'Wastes points', { bad: M('골대 근처에선 3점을 챙겨요!', 'Near the uprights, take the 3 points!') })] },
      { say: M('상황 3: 중앙선 50야드, 4th & 1! 단 1야드만 남았어요.', 'Case 3: 4th & 1 at midfield! Only 1 yard to go.'), hint: M('1야드면 강행(Go for It)할 가치가 있어요.', 'One yard is worth going for.'),
        opts: [O('💪 강행 · 파워 런', '💪 Go · Power Run', '1야드 돌파', 'Push 1 yard', { ok: 1, sfx: 'hut', then: [{ tap: lanes(1, 3), say: TAPRUN }] }), O('🦵 펀트', '🦵 Punt', '너무 소극적', 'Too timid', { bad: M('1야드인데 포기하기엔 아까워요!', 'Too timid for just 1 yard!') })] }
    ] }; },
    4: function () { return { S: { los: 93, fd: 100, down: 1, score: [16, 24] }, need: 2, steps: [
      { guide: 1, say: M('따라 하기: 1st & Goal, 상대 7야드! 엔드존(골라인 너머)에 공을 넣으면 터치다운 6점!', 'Guided: 1st & Goal at the 7! Get into the End Zone for a 6-point Touchdown!'), hint: M('패스로 엔드존 안 빈 리시버를 노려요.', 'Pass to the open receiver in the End Zone.'),
        opts: [O('🎯 엔드존 패스', '🎯 End Zone Pass', '빈 리시버 찾기', 'Find the open man', { ok: 1, rec: 1, sfx: 'hut', then: [{ tap: recv(1, 8), timer: 3.5, say: TAPPASS }] }), O('🦵 필드골', '🦵 Field Goal', '3점뿐', 'Only 3', { bad: M('8점 뒤지는데 3점으론 부족해요!', 'Down 8 — 3 points is not enough!') })] },
      { say: M('터치다운! 22 : 24 (2점 차). 보너스 시도를 골라 동점을 만드세요!', 'Touchdown! 22–24 (down 2). Pick the extra try that ties it!'), hint: M('1점 킥이면 23:24, 아직 져요. 2점이 필요!', 'A 1-pt kick makes 23–24 — still losing. You need 2!'),
        opts: [O('✌️ 2점 컨버전 (+2)', '✌️ 2-Pt Conversion (+2)', '2야드에서 한 번 더', 'One play from the 2', { ok: 1, sfx: 'hut', fx: function (S) { S.los = 98; S.fd = 100; }, then: [{ tap: lanes(0, 3), say: TAPRUN, conv: 1 }] }),
          O('🦵 PAT 킥 (+1)', '🦵 PAT Kick (+1)', '23:24', '23–24', { bad: M('23:24 — 여전히 1점 뒤져요!', '23–24 — still down by one!') })] }
    ] }; },
    5: function () { return { S: { los: 40, fd: 50, down: 1, clock: 80, score: [20, 24], tos: 1 }, need: 1, steps: [
      { guide: 1, say: M('따라 하기: 4점 차, 1:20 남음! 필드골(3점)론 부족. 사이드라인 밖으로 나가 시계를 멈추며 전진!', 'Guided: Down 4, 1:20 left! A FG is not enough. Get out of bounds to stop the clock!'), hint: M('경기장 안에서 태클당하면 시계가 계속 흘러요.', 'Tackled inbounds = clock keeps running.'),
        opts: [O('➡️ 사이드라인 아웃 패스', '➡️ Sideline Out Pass', '+12야드 · 시계 정지', '+12 · clock stops', { ok: 1, rec: 1, sfx: 'throw', sec: 6, g: 12, msg: M('아웃 오브 바운즈! 시계 정지 ⏸️', 'Out of bounds! Clock stopped ⏸️') }),
          O('⬆️ 가운데 패스', '⬆️ Middle Pass', '태클 = 시계 흐름', 'Tackled inbounds', { bad: M('경기장 안 태클! 시계가 40초 흘러요 ⏳', 'Tackled inbounds! 40 seconds burn ⏳') })] },
      { say: M('공이 막 멈췄지만 허들 없이 빨리 시계를 세우고 싶어요. 쿼터백이 공을 땅에 찍으면?', 'Need to stop the clock fast without a huddle. QB slams the ball down?'), hint: M('스파이크 = 다운 1개 쓰고 시계 정지.', 'Spike = uses a down, stops the clock.'),
        opts: [O('⬇️ 스파이크 (Spike)', '⬇️ Spike', '다운 1개 · 시계 정지', 'Costs a down', { ok: 1, sfx: 'whistle', sec: 3, g: 0, spike: 1, msg: M('스파이크! 2nd & 10, 시계 정지', 'Spike! 2nd & 10, clock stopped') }),
          O('🏃 가운데 런', '🏃 Middle Run', '시계 흐름', 'Clock runs', { bad: M('안에서 태클당하면 시간이 아까워요!', 'Inbounds tackle wastes precious time!') })] },
      { say: M('사이드라인 패스로 상대 진영 깊숙이! 다음 플레이 후 시계를 멈출 방법은?', 'Deep into their side! How do you stop the clock after this play?'), hint: M('타임아웃이 1개 남았어요.', 'You have 1 timeout left.'),
        opts: [O('➡️ 사이드라인 패스', '➡️ Sideline Pass', '+15야드', '+15 yds', { ok: 1, sfx: 'throw', sec: 7, g: 15 }), O('⬆️ 가운데 롱패스', '⬆️ Deep Middle', '태클 위험', 'Inbounds risk', { bad: M('안쪽 태클 = 시계 흐름!', 'Inbounds = clock runs!') })] },
      { say: M('가운데로 9야드 전진했지만 시계가 흘러요! 바로 멈추세요!', 'Gained 9 inbounds but the clock is running! Stop it now!'), hint: M('남은 타임아웃 1개를 써요.', 'Use your last timeout.'),
        opts: [O('⏸️ 타임아웃', '⏸️ Timeout', '즉시 정지', 'Stops now', { ok: 1, sfx: 'whistle', sec: 5, g: 9, to: 1, msg: M('타임아웃! 시계 정지', 'Timeout! Clock stopped') }), O('⏳ 그냥 허들', '⏳ Huddle up', '시간 낭비', 'Wastes time', { bad: M('허들하는 동안 30초가 흘러요!', 'Huddling burns 30 seconds!') })] },
      { say: M('레드존! 마지막 공격, 엔드존의 빈 리시버를 찾아 역전 터치다운!', 'Red Zone! Final play — find the open receiver for the winning TD!'), hint: M('타이머 전에 초록 원 리시버를 탭!', 'Tap the green-ring receiver before the timer!'),
        opts: [O('🎯 엔드존 패스', '🎯 End Zone Pass', '역전 TD!', 'Winning TD!', { ok: 1, sfx: 'hut', then: [{ tap: recv(0, 30), timer: 3, say: TAPPASS }] })] }
    ] }; }
  };

  /* ---------- Stage engine ---------- */
  var G = null, raf = 0, tmr = 0;
  function stopAll() { cancelAnimationFrame(raf); clearInterval(tmr); }
  function stage(n) {
    stopAll(); var sc = SCRIPTS[n](), S = sc.S;
    S.score = S.score || [0, 0]; S.togo = S.fd - S.los; S.hearts = 3; S.fdc = 0;
    G = { n: n, st: D.stages[n - 1], S: S, steps: sc.steps.slice(), cur: null, msg: null, last: null };
    next();
  }
  function next() { G.cur = G.steps.shift(); if (!G.cur) return win(); draw(); }
  function spot(S) { var y = Math.round(S.los); return y >= 100 ? 'TD' : y > 50 ? 'OPP ' + (100 - y) : y === 50 ? '50' : 'OWN ' + y; }
  function downTxt(S) { var o = ['1st', '2nd', '3rd', '4th'][Math.min(S.down, 4) - 1]; var tg = Math.max(1, Math.round(S.fd - S.los)); return o + ' & ' + (S.fd >= 100 ? 'Goal' : tg); }
  function clk(S) { var c = S.clock == null ? 900 : Math.max(0, S.clock); return 'Q4 ' + Math.floor(c / 60) + ':' + ('0' + c % 60).slice(-2); }
  function draw() {
    var S = G.S, c = G.cur, st = G.st;
    var h = '<div class="goal-bar">' + back() + '🎯 ' + esc(t(st.goal)) + '</div>' +
      '<div class="scorebug"><span class="sb-teams"><span class="sb-team">NAD ' + S.score[0] + '</span><span class="sb-team">OPP ' + S.score[1] + '</span></span>' +
      '<span class="sb-down">' + downTxt(S) + '</span><span class="sb-spot">Ball on ' + spot(S) + (S.los >= 80 && S.los < 100 ? ' 🚨' : '') + '</span><span class="sb-clock">' + clk(S) + '</span>' +
      '<span class="hearts">' + '❤️'.repeat(S.hearts) + '🤍'.repeat(3 - S.hearts) + '</span></div>' +
      '<div class="field-wrap"><canvas id="fieldCanvas"></canvas></div>';
    if (G.msg) h += '<div class="coach-box" style="border-left-color:' + (G.msg.ok ? 'var(--ok)' : 'var(--red)') + '"><b>' + esc(G.msg.t) + '</b></div>';
    h += '<div class="coach-box"><div class="coach-title">' + (c.guide ? '<span class="badge-guide">' + k('따라 하기', 'Guided') + '</span> ' : '') + k('🧢 코치', '🧢 Coach') + '</div>' + esc(t(c.say)) +
      (c.hint ? ' <button class="btn small" id="hintBtn">💡 ' + k('힌트', 'Hint') + '</button><div id="hintOut"></div>' : '') + '</div>';
    if (c.opts) {
      h += '<div class="play-grid">';
      c.opts.forEach(function (o, i) { h += '<button class="btn play-btn' + (o.rec ? ' recommend primary' : '') + '" data-i="' + i + '">' + (o.rec ? '<span class="badge-guide">✨ ' + k('추천', 'Pick') + '</span>' : '') + '<span class="p-title">' + esc(t(o.l)) + '</span><span class="p-desc">' + esc(t(o.d)) + '</span></button>'; });
      h += '</div>';
    }
    if (c.timer) h += '<div id="pocket" style="height:16px;background:#333;border-radius:8px;overflow:hidden;margin:8px 0"><div id="pocketBar" style="height:100%;width:100%;background:var(--ok)"></div></div>';
    if (c.timing) h += '<div style="position:relative;height:30px;background:#333;border-radius:10px;margin:8px 0"><div style="position:absolute;left:42%;width:16%;height:100%;background:var(--ok);opacity:.6"></div><div id="kickMark" style="position:absolute;left:0;width:6px;height:100%;background:var(--gold)"></div></div><button class="btn primary wide" id="kickBtn">🦵 KICK!</button>';
    app.innerHTML = h;
    var hb = document.getElementById('hintBtn'); if (hb) hb.onclick = function () { document.getElementById('hintOut').textContent = '💡 ' + t(c.hint); };
    app.querySelectorAll('.play-btn').forEach(function (b) { b.onclick = function () { choose(c.opts[+b.dataset.i]); }; });
    paint();
    var cv = document.getElementById('fieldCanvas'); cv.onclick = function (e) { tapField(e, cv); };
    if (c.timer) startPocket(c.timer);
    if (c.timing) startKick();
  }
  function X(W, y) { return (y + 10) / 120 * W; }
  function paint() {
    var cv = document.getElementById('fieldCanvas'); if (!cv) return;
    var r = window.devicePixelRatio || 1, W = cv.clientWidth, H = cv.clientHeight; cv.width = W * r; cv.height = H * r;
    var g = cv.getContext('2d'); g.scale(r, r); var S = G.S, c = G.cur;
    for (var i = 0; i < 12; i++) { g.fillStyle = i % 2 ? '#14532d' : '#166534'; g.fillRect(X(W, i * 10 - 10), 0, W / 12 + 1, H); }
    g.fillStyle = '#1e3a8a'; g.fillRect(0, 0, X(W, 0), H); g.fillStyle = '#7f1d1d'; g.fillRect(X(W, 100), 0, W - X(W, 100), H);
    g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 1.5; g.fillStyle = '#fff'; g.font = '600 12px sans-serif'; g.textAlign = 'center';
    for (var y = 0; y <= 100; y += 10) { g.beginPath(); g.moveTo(X(W, y), 0); g.lineTo(X(W, y), H); g.stroke(); if (y && y < 100) g.fillText(String(y > 50 ? 100 - y : y), X(W, y), H - 6); }
    g.save(); g.font = '700 14px sans-serif'; g.fillText('END ZONE', X(W, 105), 18); g.fillText('NAD', X(W, -5), 18); g.restore();
    function vline(yd, col) { g.strokeStyle = col; g.lineWidth = 4; g.beginPath(); g.moveTo(X(W, yd), 0); g.lineTo(X(W, yd), H); g.stroke(); }
    vline(S.los, '#38b6ff'); if (S.fd < 100) vline(S.fd, '#ffd54a');
    function dot(yd, fy, col, lab) { g.fillStyle = col; g.beginPath(); g.arc(X(W, yd), fy * H, 9, 0, 7); g.fill(); if (lab) { g.fillStyle = '#fff'; g.font = '700 10px sans-serif'; g.fillText(lab, X(W, yd), fy * H + 22); } }
    [0.35, 0.45, 0.55, 0.65].forEach(function (f) { dot(S.los - 1, f, '#2563eb'); dot(S.los + 2, f, '#dc2626'); });
    dot(S.los - 5, 0.5, '#60a5fa', 'QB');
    if (G.last) { g.strokeStyle = '#fff'; g.setLineDash([5, 4]); g.lineWidth = 2; g.beginPath(); g.moveTo(X(W, G.last[0]), H / 2); g.lineTo(X(W, G.last[1]), G.last[2] * H); g.stroke(); g.setLineDash([]); }
    g.fillStyle = '#8b4513'; g.beginPath(); g.ellipse(X(W, S.los), H / 2, 7, 4.5, 0, 0, 7); g.fill();
    if (c && c.tap) c.tap.forEach(function (tg) {
      var x = X(W, S.los + tg.x), yy = tg.y * H; tg.px = x; tg.py = yy;
      g.lineWidth = 4; g.strokeStyle = tg.ok ? '#55e68c' : '#ff5e57'; g.beginPath(); g.arc(x, yy, 18, 0, 7); g.stroke();
      g.fillStyle = '#fff'; g.font = '700 12px sans-serif'; g.fillText(tg.n + (tg.ok ? ' ✓' : ' ✕'), x, yy - 24);
    });
  }
  function say(txt, ok) { G.msg = { t: txt, ok: ok }; }
  function miss(m) {
    stopAll(); var S = G.S; S.hearts--; sfx('bad');
    var txt = '❌ ' + t(m);
    if (S.hearts <= 0) { S.hearts = 3; txt += k(' · 하트 충전! 그 자리에서 계속해요 💪', ' · Hearts refilled! Keep going 💪'); }
    say(txt, false); draw();
  }
  function gain(g, conv) {
    var S = G.S, from = S.los; S.los = Math.min(100, S.los + g);
    if (S.los >= 100) { S.score[0] += conv ? 2 : 6; sfx('touchdown'); say(conv ? k('2점 컨버전 성공! ✌️ ', '2-Point conversion GOOD! ✌️ ') + S.score[0] + ':' + S.score[1] : k('🙌 터치다운! +6점 ', '🙌 TOUCHDOWN! +6 ') + S.score[0] + ':' + S.score[1], true); S.los = 97; S.fd = 100; S.down = 1; return from; }
    if (S.los >= S.fd) { S.fdc++; S.down = 1; S.fd = Math.min(100, S.los + 10); sfx('firstdown'); say(k('🟡 FIRST DOWN! 1st & 10 리셋! (+', '🟡 FIRST DOWN! Reset to 1st & 10! (+') + g + k('야드)', ' yds)'), true); }
    else { S.down = Math.min(4, S.down + 1); say('+' + g + k('야드 전진!', ' yards!'), true); }
    return from;
  }
  function choose(o) {
    if (o.bad) return miss(o.bad);
    stopAll(); sfx(o.sfx || 'tap'); G.msg = null; G.last = null; var S = G.S;
    if (o.fx) o.fx(S);
    if (o.sec) S.clock -= o.sec;
    if (o.spike) { S.down++; }
    if (o.g) gain(o.g);
    if (o.msg) say(t(o.msg), true);
    if (o.then) G.steps = o.then.slice().concat(G.steps);
    next();
  }
  function tapField(e, cv) {
    var c = G.cur; if (!c || !c.tap) return;
    var r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, hit = null;
    c.tap.forEach(function (tg) { if (Math.hypot(tg.px - x, tg.py - y) < 32) hit = tg; });
    if (!hit) return;
    if (!hit.ok) return miss(M('수비가 막고 있어요! 초록 원을 노리세요.', 'Covered! Aim for the green ring.'));
    stopAll(); sfx(hit.x > 0 ? 'throw' : 'hut');
    var from = gain(hit.g, c.conv); G.last = [from, from + hit.x, hit.y]; next();
  }
  function startPocket(sec) {
    var t0 = performance.now(), bar = document.getElementById('pocketBar');
    tmr = setInterval(function () {
      var p = 1 - (performance.now() - t0) / (sec * 1000); if (!bar) return;
      bar.style.width = Math.max(0, p * 100) + '%'; bar.style.background = p < 0.35 ? 'var(--red)' : 'var(--ok)';
      if (p <= 0) { clearInterval(tmr); G.S.los = Math.max(1, G.S.los - 7); G.S.down = Math.min(4, G.S.down + 1); miss(M('색(SACK)! -7야드. 더 빨리 탭하세요!', 'SACKED! -7 yards. Tap faster!')); }
    }, 50);
  }
  function startKick() {
    var t0 = performance.now(), mk = document.getElementById('kickMark'), pos = 0;
    (function loop() { pos = (Math.sin((performance.now() - t0) / 450) + 1) / 2; mk.style.left = (pos * 97) + '%'; raf = requestAnimationFrame(loop); })();
    document.getElementById('kickBtn').onclick = function () {
      var c = G.cur; if (pos * 97 >= 40 && pos * 97 <= 58) { stopAll(); sfx('kick'); G.last = null; c.fx(G.S); say(t(c.msg), true); next(); }
      else { miss(M('빗나감! 바가 초록 구간에 있을 때 차세요.', 'No good! Kick when the bar is in green.')); }
    };
  }
  function win() {
    stopAll(); done[G.n] = 1; localStorage.setItem('fb_done', JSON.stringify(done)); sfx('touchdown');
    var S = G.S, nx = G.n < 5;
    app.innerHTML = '<div class="card-box"><h2 style="color:var(--gold)">🏆 ' + esc(t(G.st.title)) + ' ' + k('클리어!', 'Clear!') + '</h2>' +
      (G.msg ? '<p><b>' + esc(G.msg.t) + '</b></p>' : '') + '<p>' + k('스코어 ', 'Score ') + S.score[0] + ' : ' + S.score[1] + ' · ' + '❤️'.repeat(S.hearts) + '</p>' +
      '<div class="coach-box"><div class="coach-title">📘 ' + k('왜 그럴까?', 'Why?') + '</div>' + esc(t(G.st.why)) + '</div>' +
      (nx ? '<button class="btn primary wide" onclick="location.hash=\'s' + (G.n + 1) + '\'">▶ ' + k('다음 스테이지', 'Next Stage') + '</button>' : '') +
      '<button class="btn wide" onclick="location.hash=\'\'">🏠 ' + k('스테이지 목록', 'Stages') + '</button></div>';
  }
  window.addEventListener('resize', function () { if (G && document.getElementById('fieldCanvas')) paint(); });
  muteBtn.textContent = A && A.isMuted && A.isMuted() ? '🔇' : '🔊';
  window.__nadooG = function () { return G; };
  route();
})();
