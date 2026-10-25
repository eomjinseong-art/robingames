/* Nadoo Ice Hockey 101 — Easy & Fun Beginner Edition */
'use strict';
(function () {
  var D = HK_DATA, A = window.HK_AUDIO, L = localStorage.getItem('hk_lang') || 'ko';
  var app = document.getElementById('app'), allOpen = localStorage.getItem('hk_all') === '1';
  var done = JSON.parse(localStorage.getItem('hk_done') || '{}');
  var primerIdx = 0;
  var ivAnim = 0;
  function stopAll() { if (ivAnim) { clearInterval(ivAnim); ivAnim = 0; } if (G && G.tmr) { clearInterval(G.tmr); G.tmr = 0; } }
  function saveP(n) { done[n] = 1; localStorage.setItem('hk_done', JSON.stringify(done)); }

  function t(o) { return o && typeof o === 'object' ? (o[L] || o.ko) : o; }
  function k(ko, en) { return L === 'ko' ? ko : en; }
  function esc(s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
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

  function route() {
    stopAll();
    setHead();
    var h = location.hash.slice(1);
    if (/^s\d$/.test(h)) stage(+h[1]);
    else if (h === 'primer') primerView(0);
    else if (h === 'shootout') shootoutInit();
    else if (h === 'bug') bug();
    else if (h === 'dex') dex();
    else if (h === 'quiz') quiz(0);
    else home();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  function back() { return '<button class="btn small" onclick="location.hash=\'\'">⬅ ' + k('목록으로', 'Back') + '</button> '; }

  function renderPrimerSlide(idx) {
    var p = D.primer[idx] || D.primer[0];
    return '<div class="easy-rule-box" style="margin-top:10px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">' +
      '<span class="badge-guide">' + esc(p.step) + '</span>' +
      '<span style="font-size:24px">' + p.icon + '</span></div>' +
      '<div class="coach-title">' + esc(t(p.title)) + '</div>' +
      '<p style="margin:6px 0 10px;white-space:pre-line">' + esc(t(p.body)) + '</p>' +
      '<div style="display:flex;gap:8px">' +
      '<button class="btn small" id="prPrev" ' + (idx === 0 ? 'disabled style="opacity:.45"' : '') + '>◀ ' + k('이전', 'Prev') + '</button>' +
      '<button class="btn small primary" id="prNext" style="flex:1">' + (idx < D.primer.length - 1 ? k('다음 설명 보기 ▶', 'Next Slide ▶') : k('1단계 게임 시작하기! 🏒', 'Start Stage 1! 🏒')) + '</button>' +
      '</div></div>';
  }

  function bindPrimerNav(container) {
    var pv = container.querySelector('#prPrev'), nx = container.querySelector('#prNext');
    if (pv) pv.onclick = function () { if (primerIdx > 0) { primerIdx--; sfx('tap'); updateInlinePrimer(); } };
    if (nx) nx.onclick = function () {
      sfx('tap');
      if (primerIdx < D.primer.length - 1) { primerIdx++; updateInlinePrimer(); }
      else { location.hash = 's1'; }
    };
  }

  function updateInlinePrimer() {
    var box = document.getElementById('inlinePrimerBox');
    if (!box) return;
    box.innerHTML = renderPrimerSlide(primerIdx);
    bindPrimerNav(box);
  }

  function primerView(idx) {
    primerIdx = idx || 0;
    var p = D.primer[primerIdx];
    var h = '<div class="card-box">' + back() +
      '<h2 style="color:var(--gold);margin:10px 0 6px">📖 ' + k('아이스하키 1분 왕초보 입문 가이드', 'Ice Hockey 1-Minute Beginner Guide') + '</h2>' +
      '<p style="margin:0 0 10px;color:var(--mute)">' + k('하키를 처음 봐도 걱정 마세요! 딱 5장만 넘겨보면 규칙이 한눈에 들어옵니다.', 'New to hockey? Flip through these 5 quick cards to understand everything!') + '</p>' +
      '<div id="inlinePrimerBox">' + renderPrimerSlide(primerIdx) + '</div></div>';
    app.innerHTML = h;
    bindPrimerNav(app);
  }

  function home() {
    var h = '<div class="card-box" style="border-color:var(--gold)">' +
      '<div class="badge-guide">📖 ' + k('0단계 · 왕초보 1분 입문서', 'Step 0 · 1-Min Beginner Primer') + '</div>' +
      '<h2 style="margin:4px 0 6px;color:var(--gold)">' + k('🏒 아이스하키, 도대체 어떤 게임일까?', '🏒 How Does Ice Hockey Work?') + '</h2>' +
      '<p style="margin:0 0 8px">' + k('아래 카드를 넘기며 파란 선(오프사이드)·빨간 선(아이싱)·2분 감옥을 1분 만에 먼저 익혀보세요!', 'Read the 5 quick cards below to learn the Blue Line, Red Line, and 2-Minute Penalty Box in 1 minute!') + '</p>' +
      '<div id="inlinePrimerBox">' + renderPrimerSlide(primerIdx) + '</div>' +
      '<button class="btn small wide" onclick="location.hash=\'primer\'">📖 ' + k('[필독] 큰 화면으로 1분 왕초보 설명서 보기', 'Open Full-Screen 1-Min Beginner Guide') + '</button>' +
      '</div>';

    h += '<div class="arcade-card">' +
      '<div class="badge-guide">🎮 ' + k('보너스 아케이드 미니게임', 'Bonus Arcade Mini-Game') + '</div>' +
      '<h3 style="margin:4px 0 6px;color:var(--gold);font-size:20px">' + k('🥅 바로 해보기: 1대1 슛아웃 승부차기 대결!', '🥅 Play Now: 1-on-1 Shootout Showdown!') + '</h3>' +
      '<p style="margin:0 0 10px">' + k('골키퍼와 짜릿한 1대1 승부! 골키퍼가 움직이는 반대쪽 빈틈을 노려 5번 중 3골을 넣어보세요!', 'Go 1-on-1 against the goalie! Read where the goalie leans and score 3 out of 5 shots!') + '</p>' +
      '<button class="btn primary wide" id="goShootoutBtn" onclick="location.hash=\'shootout\'">🥅 ' + k('1대1 승부차기 게임 바로 시작! ▶', 'Start 1-on-1 Shootout Now! ▶') + '</button>' +
      '</div>';

    h += '<div class="card-box"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">' +
      '<h2 style="margin:0;color:var(--gold);font-size:20px">' + k('🎯 차근차근 배우는 5단계 실습 코스', '🎯 5-Stage Interactive Tutorial') + '</h2>' +
      '<button class="btn small" id="allBtn">⚙️ ' + (allOpen ? k('전체 열기 ON', 'Unlock all ON') : k('전체 열기', 'Unlock all')) + '</button></div>' +
      '<p style="margin:6px 0 12px;color:var(--mute)">' + k('단계마다 [쉬운 설명 카드 → 눈으로 따라 하기 → 직접 패스 & 슛] 순서로 진행돼요. 틀려도 친절히 다시 알려주니 마음 편히 눌러보세요!', 'Each stage starts with an Easy Rule Card -> 1-Tap Watch Demo -> Guided Pass & Shot!') + '</p>' +
      '<div class="stage-list">';

    D.stages.forEach(function (s, i) {
      var open = allOpen || i === 0 || done[i];
      h += '<div class="stage-card"><div style="flex:1"><h3>' + s.icon + ' ' + esc(t(s.title)) + (done[i + 1] ? ' ✅' : '') + '</h3>' +
        '<p style="color:#ffe066;margin-bottom:4px">💡 ' + esc(t(s.easyRule)) + '</p>' +
        '<p>' + esc(t(s.sub)) + '</p></div>' +
        (open ? '<button class="btn primary" onclick="location.hash=\'s' + s.id + '\'">▶ ' + k('시작', 'Play') + '</button>' : '<button class="btn" onclick="location.hash=\'s' + s.id + '\'">🔓 ' + k('열기', 'Open') + '</button>') + '</div>';
    });

    h += '</div></div><div class="decoder-grid">' +
      '<button class="btn blue" onclick="location.hash=\'bug\'">📺 ' + k('얼음판 선 & 전광판 해독기', 'Rink Lines & Scoreboard') + '</button>' +
      '<button class="btn" onclick="location.hash=\'dex\'">📖 ' + k('쉬운 포지션 & 규칙 사전', 'Easy Positions & Rules') + '</button>' +
      '<button class="btn ok" onclick="location.hash=\'quiz\'">⚡ ' + k('왕초보 탈출 퀴즈 (5문제)', 'Beginner Quiz (5 Qs)') + '</button></div>';

    app.innerHTML = h;
    bindPrimerNav(app);
    document.getElementById('allBtn').onclick = function () { allOpen = !allOpen; localStorage.setItem('hk_all', allOpen ? '1' : '0'); home(); };
  }
  function bug() {
    var items = D.scorebugItems || [];
    var h = '<div class="card-box">' + back() + '<h2 style="color:var(--gold)">📺 ' + k('얼음판 선 & 전광판 해독기', 'Rink Lines & Scoreboard Decoder') + '</h2>' +
      '<p style="margin:0 0 10px;color:var(--mute)">' + k('TV 중계 화면과 얼음판에 적힌 표시가 무슨 뜻인지 버튼을 눌러 쉽게 확인해 보세요!', 'Tap any item below to see what broadcast scoreboards and ice lines mean in plain language!') + '</p>' +
      '<div class="scorebug"><span class="sb-teams"><span class="sb-team">NAD 2</span><span class="sb-team">OPP 3</span></span><span class="sb-down">PP 1:48</span><span class="sb-spot">SOG 24 · EN</span><span class="sb-clock">2nd 12:34</span></div>' +
      '<div class="decoder-grid" id="bugBtns">';
    items.forEach(function (it, i) { h += '<button class="btn small" data-i="' + i + '">' + esc(it.badge) + '</button>'; });
    h += '</div><div class="coach-box" id="bugOut"><div class="coach-title">' + esc(t(items[0].label)) + '</div>' + esc(t(items[0].desc)) + '</div></div>';
    app.innerHTML = h;
    document.getElementById('bugBtns').onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return; var it = items[b.dataset.i]; sfx('tap');
      document.getElementById('bugOut').innerHTML = '<div class="coach-title">' + esc(t(it.label)) + '</div>' + esc(t(it.desc));
    };
  }

  function dex() {
    var h = '<div class="card-box">' + back() + '<h2 style="color:var(--gold)">📖 ' + k('쉬운 포지션 & 규칙 사전', 'Easy Positions & Rules Guide') + ' (' + D.cards.length + ')</h2>' +
      '<p style="margin:0 0 10px;color:var(--mute)">' + k('어려운 하키 용어를 일상적인 쉬운 말로 풀었어요!', 'All hockey positions and rules explained in everyday language!') + '</p><div class="dex-grid">';
    D.cards.forEach(function (c) { h += '<div class="dex-item"><h4>' + esc(c.code) + ' · ' + esc(t(c.name)) + '</h4><div class="role">' + esc(t(c.role)) + '</div><p>' + esc(t(c.desc)) + '</p></div>'; });
    app.innerHTML = h + '</div></div>';
  }

  function quiz(i) {
    var q = D.quiz[i];
    if (!q) {
      app.innerHTML = '<div class="card-box">' + back() + '<h2 style="color:var(--gold)">🏆 ' + k('왕초보 탈출 퀴즈 완료!', 'Beginner Quiz Complete!') + '</h2>' +
        '<p>' + k('축하합니다! 이제 아이스하키 경기를 보면서 파란 선, 빨간 선, 2분 감옥 규칙을 완벽하게 즐길 수 있어요!', 'Congratulations! You now know all the core rules of ice hockey!') + '</p>' +
        '<button class="btn primary wide" onclick="location.hash=\'\'">🏠 ' + k('홈 화면으로 돌아가기', 'Back to Home') + '</button></div>';
      return;
    }
    var h = '<div class="card-box">' + back() + '<h3 style="color:var(--gold)">⚡ ' + k('쉬운 하키 퀴즈 ', 'Easy Hockey Quiz ') + (i + 1) + ' / ' + D.quiz.length + '</h3><p style="font-size:18px;margin-bottom:12px">' + esc(t(q.q)) + '</p>';
    q.opts.forEach(function (o, j) { h += '<button class="btn quiz-opt" data-j="' + j + '">' + esc(t(o)) + '</button>'; });
    app.innerHTML = h + '<div id="qOut"></div></div>';
    var answered = false;
    app.querySelectorAll('.quiz-opt').forEach(function (b) {
      b.onclick = function () {
        if (answered) return; answered = true; var j = +b.dataset.j, ok = j === q.ans;
        b.classList.add(ok ? 'correct' : 'wrong'); app.querySelectorAll('.quiz-opt')[q.ans].classList.add('correct'); sfx(ok ? 'firstdown' : 'bad');
        document.getElementById('qOut').innerHTML = '<div class="coach-box"><div class="coach-title">' + (ok ? k('정답이에요! 🎉', 'Correct! 🎉') : k('아하! 정답은: ', 'Answer: ') + esc(t(q.opts[q.ans]))) + '</div>' + esc(t(q.exp)) +
          '</div><button class="btn primary wide" id="qNext">' + k('다음 문제 ▶', 'Next Question ▶') + '</button>';
        document.getElementById('qNext').onclick = function () { quiz(i + 1); };
      };
    });
  }

  /* ---------- Bonus Arcade: 1-on-1 Shootout Mode (#shootout) ---------- */
  var SO = null;
  var SO_ROUNDS = [
    { lean: 'left', hint: { ko: '👀 골키퍼가 위쪽(왼쪽)으로 치우쳐 있어요! 아래쪽 빈 구석이나 속임수 슛을 노려보세요!', en: '👀 The goalie is leaning UP/LEFT! Aim for the bottom-right corner or fake left!' }, okMoves: [0, 1] },
    { lean: 'right', hint: { ko: '👀 골키퍼가 아래쪽(오른쪽)으로 쏠렸어요! 위쪽 구석 스냅샷이나 다리 사이를 노려보세요!', en: '👀 The goalie is leaning DOWN/RIGHT! Shoot high corner or through the legs!' }, okMoves: [1, 2] },
    { lean: 'wide', hint: { ko: '👀 골키퍼가 다리를 넓게 벌리고 서 있어요! 다리 사이(파이브홀)나 오른쪽 구석이 활짝 열렸어요!', en: '👀 The goalie has wide legs! Shoot right between the pads (Five-Hole) or fake left!' }, okMoves: [0, 1] },
    { lean: 'right', hint: { ko: '👀 골키퍼가 오른쪽으로 몸을 기울였어요! 왼쪽 위 구석 스냅샷이 완전히 비어 있어요!', en: '👀 The goalie leaned right! The top-left corner is wide open!' }, okMoves: [2, 0] },
    { lean: 'left', hint: { ko: '👀 마지막 5번째 슛! 골키퍼가 왼쪽을 막고 있으니 오른쪽 빈틈이나 다리 사이로 결승골을 넣으세요!', en: '👀 Final shot! Goalie covers left—fake left and shoot right, or go between the legs!' }, okMoves: [0, 1] }
  ];

  function shootoutInit() {
    stopAll();
    SO = { round: 0, goals: 0, misses: 0, msg: null, animPuck: null };
    shootoutDraw();
  }

  function shootoutDraw() {
    if (SO.round >= 5) {
      sfx('touchdown');
      app.innerHTML = '<div class="card-box">' + back() +
        '<h2 style="color:var(--gold)">🏆 ' + k('1대1 승부차기 결과: 5번 중 ', '1-on-1 Shootout Result: ') + SO.goals + k('골 성공!', ' / 5 Goals!') + '</h2>' +
        '<p style="font-size:18px">' + (SO.goals >= 3 ? k('🎉 대단해요! 골키퍼의 움직임을 완벽하게 읽고 승부차기에서 승리했어요!', '🎉 Amazing! You read the goalie and won the Shootout!') : k('👏 아까웠어요! 골키퍼가 치우친 반대쪽 빈틈을 노리면 100% 골을 넣을 수 있어요!', '👏 Good try! Aim opposite where the goalie leans to score every time!')) + '</p>' +
        '<button class="btn primary wide" id="soRetry">🔄 ' + k('승부차기 한 판 더 하기!', 'Play Shootout Again!') + '</button>' +
        '<button class="btn wide" onclick="location.hash=\'\'">🏠 ' + k('홈으로 돌아가기', 'Back to Home') + '</button></div>';
      document.getElementById('soRetry').onclick = shootoutInit;
      return;
    }
    var r = SO_ROUNDS[SO.round];
    var moves = [
      { id: 0, ty: 0.66, title: k('🕺 왼쪽 속임수(페인트) 후 오른쪽 아래 슛!', '🕺 Fake Left, Shoot Bottom-Right!'), desc: k('골키퍼를 흔들어 반대쪽 구석으로 쏙!', 'Deceive the goalie and tuck it in!') },
      { id: 1, ty: 0.50, title: k('🚀 골키퍼 다리 사이(파이브홀) 통과 슛!', '🚀 Five-Hole Shot (Between the Legs)!'), desc: k('골키퍼 패드 사이 빈틈을 빠르게 관통!', 'Quick low shot right between the pads!') },
      { id: 2, ty: 0.34, title: k('🎯 위쪽 빈 구석 번개 스냅샷!', '🎯 Top-Corner Lightning Snapshot!'), desc: k('골키퍼 어깨 위쪽 빈 구석을 조준!', 'High shot into the top corner!') }
    ];
    var h = '<div class="goal-bar">' + back() + '🥅 ' + k('보너스 게임 · 1대1 승부차기 (슛아웃) · 라운드 ', 'Bonus · 1-on-1 Shootout · Round ') + (SO.round + 1) + ' / 5 · ' + k('득점: ', 'Goals: ') + '<b>' + SO.goals + '</b></div>';
    if (SO.msg) h += '<div class="coach-box" style="border-left-color:' + (SO.msg.ok ? 'var(--ok)' : 'var(--gold)') + '">' + esc(SO.msg.t) + '</div>';
    h += '<div class="field-wrap"><canvas id="rinkCanvas"></canvas></div>' +
      '<div class="coach-box"><div class="coach-title">🧢 ' + k('승부차기 족집게 힌트', 'Shootout Read') + '</div>' + esc(t(r.hint)) + '<br><span style="color:#ffe066">' + k('👇 아래 버튼 중 하나를 누르거나 얼음판의 초록 과녁을 탭하세요!', '👇 Click a button below OR tap a green target on the ice!') + '</span></div>' +
      '<div class="play-grid">';
    moves.forEach(function (m) {
      var isBest = r.okMoves.indexOf(m.id) !== -1;
      h += '<button class="btn play-btn' + (isBest ? ' recommend primary' : '') + '" data-m="' + m.id + '">' +
        (isBest ? '<span class="badge-guide">✨ ' + k('골 찬스!', 'Open Target!') + '</span>' : '') +
        '<span class="p-title">' + esc(m.title) + '</span><span class="p-desc">' + esc(m.desc) + '</span></button>';
    });
    h += '</div>';
    app.innerHTML = h;
    paintShootout(r);
    app.querySelectorAll('.play-btn').forEach(function (b) {
      b.onclick = function () { fireShootout(+b.dataset.m, moves[+b.dataset.m].ty, r); };
    });
    var cv = document.getElementById('rinkCanvas');
    if (cv) cv.onclick = function (e) {
      var rect = cv.getBoundingClientRect(), y = (e.clientY - rect.top) / rect.height;
      var pick = y < 0.43 ? 2 : y > 0.57 ? 0 : 1;
      fireShootout(pick, moves[pick].ty, r);
    };
  }

  function fireShootout(mId, ty, r) {
    var ok = r.okMoves.indexOf(mId) !== -1;
    if (ok) {
      SO.goals++; sfx('touchdown');
      SO.msg = { ok: true, t: k('🚨 골인!! 골키퍼 반대쪽 빈틈을 정확히 뚫었어요! (+1골)', '🚨 GOAL!! You beat the goalie clean! (+1 Goal)') };
      SO.round++;
      shootoutDraw();
    } else {
      sfx('kick');
      SO.msg = { ok: false, t: k('🔥 앗, 골키퍼 패드에 막혔지만 리바운드(튕겨 나온 공) 찬스! 다시 골문 빈 곳(✨추천 버튼)을 눌러 밀어 넣으세요!', '🔥 Saved by the pad, but REBOUND chance! Tap an open ✨ button to put it in!') };
      shootoutDraw();
    }
  }

  function paintShootout(r) {
    var cv = document.getElementById('rinkCanvas'); if (!cv) return;
    var dpr = window.devicePixelRatio || 1, W = cv.clientWidth || 360, H = cv.clientHeight || 320;
    cv.width = W * dpr; cv.height = H * dpr;
    var g = cv.getContext('2d'); g.scale(dpr, dpr);
    g.fillStyle = '#eef7ff'; g.fillRect(0, 0, W, H);
    g.strokeStyle = '#1c7ed6'; g.lineWidth = 6; g.beginPath(); g.moveTo(W * 0.25, 0); g.lineTo(W * 0.25, H); g.stroke();
    g.strokeStyle = '#e03131'; g.lineWidth = 3; g.beginPath(); g.moveTo(W * 0.88, 0); g.lineTo(W * 0.88, H); g.stroke();
    g.fillStyle = 'rgba(56,182,255,0.35)'; g.beginPath(); g.arc(W * 0.88, H / 2, 52, Math.PI / 2, Math.PI * 1.5); g.fill();
    g.fillStyle = '#c92a2a'; g.fillRect(W * 0.88, H * 0.28, 18, H * 0.44);
    var gy = r.lean === 'left' ? H * 0.36 : r.lean === 'right' ? H * 0.64 : H * 0.50;
    g.fillStyle = '#c92a2a'; g.beginPath(); g.arc(W * 0.80, gy, 18, 0, 7); g.fill();
    g.fillStyle = '#fff'; g.font = '700 12px sans-serif'; g.textAlign = 'center'; g.fillText(k('골키퍼', 'G'), W * 0.80, gy + 4);
    g.fillStyle = '#1864ab'; g.beginPath(); g.arc(W * 0.42, H * 0.5, 18, 0, 7); g.fill();
    g.fillStyle = '#fff'; g.fillText(k('나(슈터)', 'YOU'), W * 0.42, H * 0.5 + 4);
    g.fillStyle = '#111'; g.beginPath(); g.arc(W * 0.48, H * 0.5, 7, 0, 7); g.fill();
    [0.34, 0.50, 0.66].forEach(function (fy, idx) {
      var mId = idx === 0 ? 2 : idx === 1 ? 1 : 0;
      var ok = r.okMoves.indexOf(mId) !== -1;
      g.strokeStyle = ok ? '#2b8a3e' : '#e03131'; g.lineWidth = 3;
      g.beginPath(); g.arc(W * 0.86, fy * H, 15, 0, 7); g.stroke();
      g.fillStyle = ok ? '#2b8a3e' : '#c92a2a'; g.font = '700 11px sans-serif';
      g.fillText(ok ? k('🎯빈틈', 'OPEN') : k('막힘', 'SAVE'), W * 0.86 - 30, fy * H + 4);
    });
  }
  /* ---------- Stage scripts (rink x: 0–200ft, attack → right) ---------- */
  function O(ko, en, dko, den, x) { var o = { l: { ko: ko, en: en }, d: { ko: dko, en: den } }; for (var p in x) o[p] = x[p]; return o; }
  function M(ko, en) { return { ko: ko, en: en }; }
  function T(x, y, ok, nKo, nEn, descKo, descEn, x2) {
    var o = { x: x, y: y, ok: ok, n: { ko: nKo, en: nEn }, d: { ko: descKo, en: descEn } };
    for (var p in x2) o[p] = x2[p];
    return o;
  }
  function makeShotStep(ko, en, goalMsg) {
    return {
      shot: 1,
      say: M(ko, en),
      hint: M('초록색 빈 구석 과녁(위쪽 또는 아래쪽)을 누르면 골! 정면으로 쏴도 리바운드 찬스가 나와요!', 'Tap either open corner (top or bottom) to score! Even a center shot gives a Rebound chance!'),
      tap: [
        T(192, 0.30, 1, '↖️ 위쪽 빈 구석 슛!', '↖️ Shoot Top Corner!', '골키퍼 어깨 위 빈틈으로 골!', 'High into the open net!', { to: 192, goal: 1, msg: goalMsg }),
        T(192, 0.70, 1, '↙️ 아래쪽 빈 구석 슛!', '↙️ Shoot Bottom Corner!', '골키퍼 반대쪽 아래 빈틈으로 골!', 'Low into the open corner!', { to: 192, goal: 1, msg: goalMsg }),
        T(186, 0.50, 0, '💥 골키퍼 정면 강슛!', '💥 Shoot Right at Goalie!', '골키퍼 패드에 맞고 튕겨요 (리바운드 찬스!)', 'Hits the goalie pads (triggers Rebound!)', { rebound: 1, msg: goalMsg })
      ]
    };
  }

  var SCRIPTS = {
    1: function () {
      return {
        S: { px: 90, py: 0.5, score: [0, 0], per: '1피리어드', clock: 1200, str: '5대5' },
        steps: [
          {
            guide: 1,
            say: M('1단계 따라 하기(눈으로 먼저 보기): 지금 공(퍽)을 가진 내가 파란 선 앞에 있어요! 공이 사람보다 먼저 파란 선을 넘어가야 반칙(오프사이드)이 아니에요. 아래 반짝이는 버튼을 눌러 직접 눈으로 확인해 보세요!', 'Step 1 Watch Demo: You have the puck in front of the Blue Line! The puck must cross the Blue Line BEFORE any teammate. Tap the glowing button below to watch!'),
            hint: M('공이 먼저 파란 선을 넘으면 정상 플레이(온사이드)예요!', 'When the puck crosses first, it is legal (Onside)!'),
            opts: [
              O('✨ 여기를 눌러 시작! (공을 먼저 몰고 파란 선 넘기)', '✨ Tap Here to Start! (Carry the puck across Blue Line first)', '공(퍽)이 사람보다 먼저 파란 선을 통과해요!', 'The puck crosses the Blue Line before your teammates!', {
                ok: 1, rec: 1, toX: 136, toY: 0.5,
                msg: M('👏 참 잘했어요! 공(퍽)이 사람보다 먼저 파란 선을 넘었기 때문에 반칙이 아니에요(온사이드)!', '👏 Great job! Because the puck crossed the Blue Line first, play is legal (Onside)!')
              })
            ]
          },
          {
            say: M('잠깐! 만약 이번에는 공을 아직 안 넘겼는데, 성급한 동료가 공보다 먼저 파란 선 너머로 들어가 있으면 어떻게 될까요? 두 버튼 중 하나를 눌러보세요!', 'Wait! What if a teammate crosses the Blue Line BEFORE the puck? Pick one of the two choices below!'),
            hint: M('파란 선 앞에 있는 동료에게 패스한 뒤 같이 들어가야 안전해요!', 'Pass to the teammate still outside the Blue Line, then cross with the puck first!'),
            opts: [
              O('✅ 공을 먼저 파란 선 너머로 밀어 넣기 (정상 진입)', '✅ Push the puck across the Blue Line first (Legal)', '공이 먼저 선을 넘은 뒤 동료가 달려가요', 'Puck crosses first, then teammates enter', {
                ok: 1, rec: 1, toX: 145, toY: 0.5,
                msg: M('✅ 정답! 공이 먼저 파란 선을 넘었으니 심판이 호루라기를 불지 않아요!', '✅ Correct! The puck crossed first, so no whistle!')
              }),
              O('🚨 공보다 사람이 먼저 파란 선 넘어가기 (실험해 보기)', '🚨 Send a player across BEFORE the puck (See what happens)', '반칙(오프사이드)이 뭔지 직접 구경해 볼까요?', 'See what an Offside whistle looks like!', {
                bad: M('📣 삐익—! 심판 호루라기! "사람이 공(퍽)보다 먼저 파란 선을 넘어서 오프사이드 반칙이에요! 파란 선 밖에서 다시 해볼까요?" (하트는 안 깎여요 😊)', '📣 TWEEEET! Referee whistle: "A player crossed the Blue Line before the puck — Offside! Let us try again!" (No heart lost 😊)'),
                noHeartLoss: 1
              })
            ]
          },
          {
            say: M('이제 파란 선 안쪽(상대 공격 지역)에 무사히 들어왔어요! 위쪽에 수비수가 없는 "🟢 우리 빈 동료"에게 패스해 볼까요? (얼음판의 초록 원을 탭하거나 아래 큰 버튼을 누르세요!)', 'Now we are inside the attacking zone! Pass to the wide-open green teammate at the top! (Tap the green circle on the ice OR click the big button below!)'),
            hint: M('초록색 원(🎯 위쪽 빈 동료)을 고르면 정확하게 패스가 연결돼요!', 'Pick the green target (Top Open Teammate) for a clean pass!'),
            tap: [
              T(165, 0.28, 1, '🎯 위쪽 빈 동료에게 패스!', '🎯 Pass to Open Top Teammate!', '수비수가 없어서 골문 앞 찬스가 열려요!', 'Wide open with a clear lane to the net!', { to: 165 }),
              T(155, 0.76, 0, '❌ 수비수가 막고 있는 아래쪽 동료', '❌ Covered Bottom Teammate', '상대 빨간 수비수가 바로 앞에 서 있어요', 'Blocked by a red defender right in front', { bad: M('앗, 그쪽은 상대 수비수가 길을 막고 있었어요! 위쪽 초록색 빈 동료에게 패스해 볼까요?', 'Oops, a defender blocked that lane! Try passing to the open green teammate at the top!') })
            ]
          },
          makeShotStep(
            '🥅 슛 찬스!! 패스를 받은 동료가 골키퍼와 마주 봤어요! 골문 빈 구석을 골라 시원하게 첫 골을 넣어보세요!',
            '🥅 SHOT CHANCE!! Your teammate is right in front of the net! Pick an open corner to score your first goal!',
            M('🚨 골인!! 파란 선 규칙(오프사이드)을 완벽히 지키고 멋진 첫 골을 넣었어요!', '🚨 GOAL!! You mastered the Blue Line rule and scored your first goal!')
          )
        ]
      };
    },
    2: function () {
      return {
        S: { px: 48, py: 0.5, score: [1, 1], per: '2피리어드', clock: 900, str: '5대5' },
        steps: [
          {
            guide: 1,
            say: M('2단계 따라 하기(눈으로 먼저 보기): 지금 공(퍽)이 우리 땅(가운데 빨간 선 뒤)에 있어요! 여기서 무작정 끝까지 뻥 차버리면 "아이싱 반칙"이 돼요. 먼저 가운데 빨간 선을 넘는 모습을 눈으로 확인해 보세요!', 'Step 2 Watch Demo: The puck is in our half (behind the Center Red Line)! Shooting it all the way from here is an Icing foul. Tap below to skate past the Center Red Line first!'),
            hint: M('가운데 빨간 선만 넘으면 아무리 멀리 보내도 반칙이 아니에요!', 'Once you cross the Center Red Line, shooting deep is completely legal!'),
            opts: [
              O('✨ 여기를 눌러 시작! (가운데 빨간 선까지 공 몰고 가기)', '✨ Tap Here to Start! (Skate past the Center Red Line)', '가운데 빨간 선을 먼저 넘어가요!', 'Skate across the Center Red Line first!', {
                ok: 1, rec: 1, toX: 108, toY: 0.5,
                msg: M('👏 좋아요! 가운데 빨간 선을 넘었으니 이제 공을 멀리 보내도 아이싱 반칙이 아니에요!', '👏 Nice! Now that you crossed the Center Red Line, shooting it deep is legal!')
              })
            ]
          },
          {
            say: M('만약 우리 땅(빨간 선 뒤)에서 귀찮다고 공을 끝까지 뻥 차버리면 어떻게 될지 비교해 볼까요?', 'What happens if you lazily whack the puck from behind the red line vs skating across first?'),
            hint: M('빨간 선을 넘은 뒤 구석으로 공을 보내는 것이 정답이에요!', 'Crossing the red line before sending the puck deep is the right play!'),
            opts: [
              O('✅ 빨간 선 넘은 뒤 상대 구석으로 공 보내기', '✅ Send puck into the corner AFTER crossing Red Line', '반칙 없이 안전하게 공격 지역으로 들어가요!', 'Legal dump-in into the attacking corner!', {
                ok: 1, rec: 1, toX: 175, toY: 0.22,
                msg: M('✅ 완벽해요! 빨간 선을 넘은 뒤 구석으로 공을 보내서 우리 공격수가 공을 잡았어요!', '✅ Perfect! Legal dump-in and your teammate recovered the puck in the corner!')
              }),
              O('🚨 우리 땅(빨간 선 뒤)에서 끝까지 뻥 차보기 (실험)', '🚨 Whack it all the way from behind the Red Line (Test)', '아이싱 반칙이 뭔지 직접 확인해 볼까요?', 'See what an Icing whistle looks like!', {
                bad: M('📣 삐익—! 심판 호루라기! "가운데 빨간 선을 넘기 전에 끝까지 쳐서 아이싱 반칙이에요! 다시 해볼까요?" (하트는 안 깎여요 😊)', '📣 TWEEEET! Referee: "Shot from behind the Center Red Line — Icing foul! Try again!" (No heart lost 😊)'),
                noHeartLoss: 1
              })
            ]
          },
          {
            say: M('구석에서 공을 잡았어요! 이제 골문 바로 앞(명당자리)에 서 있는 "🟢 우리 빈 동료"에게 패스하세요!', 'You have the puck in the corner! Now pass to your wide-open green teammate right in front of the net!'),
            hint: M('골문 정면 앞 초록색 동료에게 패스하면 바로 골 찬스예요!', 'Pass to the green teammate right in front of the net!'),
            tap: [
              T(165, 0.48, 1, '🎯 골문 앞 빈 동료에게 패스!', '🎯 Pass to Open Teammate in Front!', '골키퍼 바로 코앞이라 골 넣기 딱 좋아요!', 'Right in front of the net for an easy shot!', { to: 165 }),
              T(140, 0.82, 0, '❌ 수비에게 막힌 뒤쪽 동료', '❌ Covered Teammate Behind', '상대 수비수가 패스 길을 막고 있어요', 'Defender is blocking this pass lane', { bad: M('앗, 수비수가 패스 길을 막고 있었어요! 골문 앞 초록색 동료에게 패스해 보세요!', 'A defender was in the way! Pass to the open green teammate in front of the net!') })
            ]
          },
          makeShotStep(
            '🥅 골문 코앞 찬스! 골키퍼가 당황하고 있어요! 원하는 구석으로 슛을 날려 골을 넣으세요!',
            '🥅 Point-blank shot chance! Pick a corner and fire it in!',
            M('🚨 골인!! 빨간 선 규칙(아이싱)을 마스터하고 멋지게 득점했어요!', '🚨 GOAL!! You mastered the Red Line (Icing) rule and scored!')
          )
        ]
      };
    }
  };
  SCRIPTS[3] = function () {
    return {
      S: { px: 140, py: 0.5, score: [1, 2], per: '2피리어드', clock: 600, str: '5대4 파워플레이', pp: 120, penBox: 1 },
      steps: [
        {
          guide: 1,
          say: M('3단계 따라 하기(눈으로 먼저 보기): 상대 선수가 발을 거는 반칙을 해서 경기장 위쪽 "⏳ 2분 감옥(페널티 박스)"에 갇혔어요! 지금 우리는 5명, 상대는 4명(파워플레이 찬스)이에요. 먼저 파란 선 앞 동료에게 패스해 대형을 넓혀볼까요?', 'Step 3 Watch Demo: An opponent fouled and is locked in the top 2-Minute Penalty Box! We have 5 players vs their 4 (Power Play). Tap below to spread the ice!'),
          hint: M('우리가 1명 더 많을 때는 패스를 돌리면 무조건 빈 동료가 생겨요!', 'With 5 players against 4, passing creates a wide-open teammate!'),
          opts: [
            O('✨ 여기를 눌러 시작! (파란 선 앞 동료에게 패스해 대형 넓히기)', '✨ Tap Here to Start! (Pass back to spread the 5-on-4)', '상대 수비 4명을 넓게 흔들어 놓아요!', 'Spread out the 4 defenders!', {
              ok: 1, rec: 1, toX: 132, toY: 0.28,
              msg: M('👏 좋아요! 우리가 5명 대 4명으로 1명 더 많아서 반대쪽에 완전히 빈 동료가 생겼어요!', '👏 Nice! With 5 against 4, a teammate on the far side is now wide open!')
            })
          ]
        },
        {
          say: M('지금 상대 수비수 4명이 가운데에 몰려 있어요! 혼자서 4명 사이로 돌진할까요, 아니면 남는 빈 동료에게 패스할까요?', '4 defenders are packed in the middle! Should you charge into all 4 alone, or pass to your extra open teammate?'),
          hint: M('5대4에서는 빈 동료에게 패스하는 게 100배 유리해요!', 'Passing to the open extra teammate is always the smart 5-on-4 play!'),
          opts: [
            O('✅ 반대편 빈 동료에게 빠르게 패스하기', '✅ Quick pass across to the open teammate', '골키퍼가 미처 못 따라오게 패스를 돌려요!', 'Move the puck faster than the goalie can slide!', {
              ok: 1, rec: 1, toX: 136, toY: 0.72,
              msg: M('✅ 나이스 패스! 골키퍼가 허둥지둥 움직이느라 골문 위쪽이 텅 비었어요!', '✅ Great pass! The goalie slid over, leaving the top of the net wide open!')
            }),
            O('🚨 수비수 4명 한가운데로 혼자 돌진하기 (실험)', '🚨 Charge straight into 4 defenders alone (Test)', '왜 패스를 돌려야 하는지 확인해 볼까요?', 'See why solo charging into 4 defenders fails!', {
              bad: M('📣 앗! 상대 수비수 4명이 벽처럼 뭉쳐 있어서 혼자서는 막혔어요! 5대4일 때는 빈 동료에게 패스해 볼까요? (하트는 안 깎여요 😊)', '📣 Oops! 4 defenders crowded the middle! On a 5-on-4, pass to the open teammate! (No heart lost 😊)'),
              noHeartLoss: 1
            })
          ]
        },
        {
          say: M('골키퍼가 아래쪽으로 쏠렸어요! 골문 위쪽에 혼자 서 있는 "🟢 우리 빈 동료"에게 결정적 패스를 보내세요!', 'The goalie is stuck at the bottom! Pass to your wide-open green teammate at the top circle!'),
          hint: M('위쪽 초록색 원(🎯 골문 위쪽 빈 동료)을 누르세요!', 'Tap the green target at the top!'),
          tap: [
            T(166, 0.26, 1, '🎯 골문 위쪽 빈 동료에게 패스!', '🎯 Pass to Open Top Teammate!', '골키퍼 반대쪽이라 골문이 텅 비어 있어요!', 'Opposite the goalie—wide open net!', { to: 166 }),
            T(158, 0.74, 0, '❌ 수비가 붙어 있는 아래쪽 동료', '❌ Covered Bottom Teammate', '골키퍼와 수비수가 바로 앞에 있어요', 'Goalie and defender are right there', { bad: M('그쪽은 골키퍼가 이미 막고 있어요! 위쪽 초록색 빈 동료에게 패스하세요!', 'The goalie is already covering that side! Pass to the open top teammate!') })
          ]
        },
        makeShotStep(
          '🥅 5대4 파워플레이 찬스! 패스를 받자마자 논스톱 슛(원타이머)으로 골을 넣으세요!',
          '🥅 5-on-4 Power Play! Fire the shot into the open net!',
          M('🚨 파워플레이 골!! 우리가 골을 넣어서 2분 감옥에 있던 상대 선수도 즉시 풀려나 다시 5대5가 되었어요!', '🚨 POWER-PLAY GOAL!! Because you scored, the player in the 2-minute penalty box is released immediately!')
        ),
        {
          say: M('💡 보너스 상식: 반대로 우리 선수가 감옥에 가서 우리가 4명(수비)일 때는 불쌍하니까 특별 혜택이 있어요! 우리 땅에서 공을 끝까지 멀리 뻥 쳐도(아이싱) 반칙일까요, 아닐까요?', '💡 Bonus Rule: When YOUR team only has 4 players defending against 5, what happens if you whack the puck all the way down the ice?'),
          hint: M('4명으로 수비하는 팀에게는 아이싱 반칙을 면제해 줘요!', 'A 4-player defending team is exempt from Icing!'),
          opts: [
            O('✅ 반칙 아님! (4명으로 버틸 땐 멀리 뻥 쳐도 OK!)', '✅ NOT a foul! (4-player defense can clear it far!)', '4명 수비 팀에게는 아이싱 면제 특권이 있어요', 'Short-handed teams are allowed to ice the puck', {
              ok: 1, rec: 1,
              msg: M('🎉 정답! 4명으로 버티는 수비 팀(페널티킬)은 공을 끝까지 멀리 뻥 쳐서 한숨 돌릴 수 있답니다!', '🎉 Correct! When defending with 4 skaters, you can clear the puck all the way down without an Icing foul!')
            }),
            O('🚨 그래도 아이싱 반칙이다', '🚨 Still an Icing foul', '5대5 때와 똑같이 반칙?', 'Same as 5-on-5?', {
              bad: M('아하! 4명으로 수비할 때는 불리하니까 특별히 멀리 뻥 쳐도 아이싱 반칙을 안 불어요! 왼쪽 버튼을 눌러보세요 😊', 'Actually, 4-player defending teams get a special break: no Icing foul! Tap the green choice 😊'),
              noHeartLoss: 1
            })
          ]
        }
      ]
    };
  };

  SCRIPTS[4] = function () {
    return {
      S: { px: 105, py: 0.5, score: [2, 3], per: '3피리어드', clock: 120, str: '5대5', stam: 18 },
      steps: [
        {
          guide: 1,
          say: M('4단계 따라 하기(눈으로 먼저 보기): 우리 선수들이 45초 동안 전력 질주해서 체력이 18%밖에 안 남았어요(🔋18%)! 하키는 경기가 멈추지 않아도 벤치 문을 열고 달리는 중에 바로 선수를 바꿔요. 아래 버튼을 눌러 교체해 보세요!', 'Step 4 Watch Demo: Your players skated hard for 45 seconds and are down to 18% stamina (🔋18%)! In hockey, players swap at the bench while the game keeps running. Tap below to change lines!'),
          hint: M('공을 상대 진영에 보낸 뒤 벤치에서 싱싱한 선수들로 바꿔요!', 'Send the puck deep and swap for fresh players at the bench!'),
          opts: [
            O('✨ 여기를 눌러 시작! (경기 중 벤치 문 열고 선수 교체하기)', '✨ Tap Here to Start! (Change players on the fly at the bench)', '체력 18% 지친 선수 → 체력 100% 새 선수 투입!', 'Swap tired players (18%) for fresh legs (100%)!', {
              ok: 1, rec: 1, toX: 115, toY: 0.82,
              fx: function (S) { S.stam = 100; },
              msg: M('🔋 쌩쌩한 새 선수들이 벤치에서 튀어나왔어요! 체력 100% 충전 완료!', '🔋 Fresh players hopped over the bench boards! Stamina 100%!')
            })
          ]
        },
        {
          say: M('치열하게 뛰다 보니 또 체력이 25%로 떨어졌어요! 얼음판 아래쪽 "🚪 우리 팀 교체 벤치"를 탭하거나 아래 버튼을 눌러 선수들을 교체해 주세요! (주의: 나가는 선수가 안 들어왔는데 먼저 뛰어들어 6명 넘게 뛰면 반칙이에요!)', 'Stamina dropped to 25% again! Tap the bottom "🚪 Our Bench" on the ice OR click the button below to swap players cleanly!'),
          hint: M('아래쪽 우리 팀 벤치(초록 원)에서 질서 있게 교대해요!', 'Swap cleanly at our bottom bench (green circle)!'),
          fx0: function (S) { S.stam = 25; },
          tap: [
            T(95, 0.88, 1, '🚪 아래쪽 우리 벤치에서 선수 교체!', '🚪 Swap Players at Our Bottom Bench!', '나가는 선수와 들어오는 선수가 질서 있게 바통 터치!', 'Clean line change—stamina back to 100%!', { to: 95, fx: function (S) { S.stam = 100; } }),
            T(95, 0.14, 0, '❌ 위쪽 감옥(페널티 박스) 문 열기', '❌ Top Penalty Box Door', '위쪽은 교체 벤치가 아니라 2분 감옥이에요!', 'The top box is the Penalty Box, not your bench!', { bad: M('앗, 위쪽은 2분 감옥(페널티 박스)이에요! 아래쪽 초록색 우리 팀 벤치에서 교체해 주세요!', 'Oops, the top is the Penalty Box! Swap at your team bench at the bottom!') })
          ]
        },
        {
          say: M('⏰ 경기 종료 1분 전! 점수는 2 : 3으로 우리가 1점 지고 있어요! 마지막 1분 안에 동점골을 넣으려면 감독님은 어떤 승부수를 던질까요?', '⏰ 1:00 left in the game and we trail 2–3! What is the famous final-minute gamble to score a tying goal?'),
          hint: M('우리 골키퍼를 벤치로 부르고 공격수를 1명 더 넣어 6명 대 5명으로 공격해요!', 'Call your goalie to the bench and put a 6th attacker on the ice (6-on-5)!'),
          opts: [
            O('🔥 우리 골키퍼 빼고 공격수 6명 투입! (6대5 총공격)', '🔥 Pull Goalie for a 6th Attacker! (6-on-5 All-Out Attack)', '우리 골문은 비우지만 공격수 6명으로 동점을 노려요!', 'Leaves our net empty, but gives us 6 attackers vs 5!', {
              ok: 1, rec: 1, toX: 150, toY: 0.5,
              fx: function (S) { S.clock = 60; S.str = '6대5 (골키퍼 뺌)'; },
              msg: M('🔥 골키퍼가 벤치로 나오고 6번째 공격수가 투입됐어요! 이제 6명 대 5명 총공격입니다!', '🔥 Goalie is on the bench and the 6th attacker is on the ice! 6-on-5 attack!')
            }),
            O('⏳ 그냥 5대5로 천천히 기다리기 (실험)', '⏳ Just stay 5-on-5 and wait (Test)', '1분밖에 안 남았는데 괜찮을까요?', 'Only 1 minute left—will waiting work?', {
              bad: M('⏰ 1분밖에 안 남아서 5대5로는 수비를 뚫기 힘들어요! 골키퍼를 빼고 6대5 총공격을 걸어보세요! (하트는 안 깎여요 😊)', '⏰ With 1 minute left, staying 5-on-5 runs out the clock! Pull the goalie for 6-on-5! (No heart lost 😊)'),
              noHeartLoss: 1
            })
          ]
        },
        {
          say: M('6명 대 5명이라 우리 공격수 1명이 완전히 남아요! 골문 앞 "🟢 6번째 빈 동료"에게 패스하세요!', 'With 6 attackers against 5 defenders, one teammate is wide open! Pass to the 6th attacker!'),
          hint: M('초록색 원(🎯 6번째 빈 공격수)에게 패스하세요!', 'Pass to the green 6th attacker target!'),
          tap: [
            T(170, 0.32, 1, '🎯 6번째 빈 공격수에게 패스!', '🎯 Pass to the Open 6th Attacker!', '골키퍼 대신 들어온 공격수가 노마크 찬스예요!', 'The extra attacker is completely uncovered!', { to: 170 }),
            T(155, 0.72, 0, '❌ 수비수에게 둘러싸인 동료', '❌ Surrounded Teammate', '수비수 2명이 막고 있어요', 'Covered by two defenders', { bad: M('그쪽은 수비가 막고 있어요! 위쪽 초록색 6번째 공격수에게 패스하세요!', 'Covered! Pass to the open 6th attacker at the top!') })
          ]
        },
        makeShotStep(
          '🥅 종료 직전 6대5 동점 찬스! 빈 구석으로 슛을 꽂아 극적인 3:3 동점을 만드세요!',
          '🥅 Final-minute 6-on-5 tying chance! Bury the shot to tie it 3–3!',
          M('🚨 극적인 버저비터 동점골!! 3 : 3! 골키퍼를 빼고 6명이 공격한 작전이 대성공했어요!', '🚨 DRAMATIC TYING GOAL!! 3–3! Pulling the goalie for 6 attackers worked to perfection!')
        )
      ]
    };
  };

  SCRIPTS[5] = function () {
    return {
      S: { px: 168, py: 0.5, score: [3, 3], per: '3피리어드', clock: 180, str: '5대5' },
      steps: [
        {
          guide: 1,
          say: M('5단계 따라 하기(눈으로 먼저 보기): 축구와 달리 하키는 "골대 뒤쪽 공간"으로도 다닐 수 있어요! 전설적인 선수 웨인 그레츠키가 가장 좋아해서 "그레츠키의 사무실"이라고 부르는 골대 뒤로 공을 몰고 가볼까요?', 'Step 5 Watch Demo: Unlike soccer, you can skate BEHIND the goal in hockey! Legends call the space behind the net "Gretzky\'s Office." Tap below to skate behind the net!'),
          hint: M('골대 뒤로 가면 골키퍼가 등 뒤를 볼 수 없어서 당황해요!', 'Behind the net, the goalie has to look backward and loses track of passes!'),
          opts: [
            O('✨ 여기를 눌러 시작! (골대 뒤 비밀 공간으로 돌아 들어가기)', '✨ Tap Here to Start! (Skate into the space behind the net)', '골키퍼 등 뒤로 돌아가서 패스 찬스를 만들어요!', 'Go behind the net so the goalie has to turn around!', {
              ok: 1, rec: 1, toX: 195, toY: 0.5,
              msg: M('👏 골대 뒤 도착! 골키퍼가 고개를 뒤로 돌리느라 앞쪽 빈틈이 활짝 열렸어요!', '👏 You are behind the net! The goalie turned around, leaving the front wide open!')
            })
          ]
        },
        {
          say: M('이제 골대 뒤에서 골문 바로 앞으로 달려드는 "🟢 우리 빈 동료"에게 깜짝 패스를 보내 골을 만들어 보세요! (골이 들어가면 패스해 준 선수도 "어시스트 1점"을 받아요!)', 'From behind the net, pass out front to your wide-open green teammate! (Setting up a goal earns an Assist point!)'),
          hint: M('골문 바로 앞 초록색 동료(🎯 골문 앞 동료)를 누르세요!', 'Tap the green teammate right in front of the net!'),
          tap: [
            T(172, 0.42, 1, '🎯 골대 뒤에서 골문 앞 동료에게 패스 & 골!', '🎯 Pass Out Front from Behind the Net & Score!', '골키퍼가 뒤돌아보는 사이에 원터치 골!', 'One-timer goal while the goalie is turned around!', { to: 188, goal: 1, msg: M('🚨 골인!! 골대 뒤 패스로 멋진 득점을 올렸어요!', '🚨 GOAL!! A classic setup from behind the net!') }),
            T(140, 0.84, 0, '❌ 너무 멀리 있는 수비수 쪽', '❌ Too Far Back', '골문에서 너무 멀어요', 'Too far from the net', { bad: M('골문 바로 앞 초록색 동료에게 패스하면 바로 골을 넣을 수 있어요!', 'Pass to the green teammate right in front of the net!') })
          ]
        },
        {
          say: M('💡 잠깐 상식 퀴즈: 하키에서는 골이 들어갈 때 마지막으로 패스한 선수뿐만 아니라, 그 직전에 패스한 선수까지 합쳐서 "최대 몇 명"에게 어시스트 점수(1포인트씩)를 줄까요?', '💡 Quick Rule Check: In hockey, how many teammates can earn an Assist (1 point each) on a single goal?'),
          hint: M('골 넣기 직전 공을 연결한 "최대 2명"까지 어시스트를 받아요!', 'Up to 2 teammates who passed the puck before the goal get an Assist!'),
          opts: [
            O('✅ 최대 2명까지! (골 넣은 사람 + 패스한 2명 모두 각 1포인트!)', '✅ Up to 2 teammates! (Scorer + up to 2 passers each get 1 point!)', '하키가 협동 플레이를 중요하게 여기는 이유예요!', 'Hockey rewards teamwork with up to 2 assists per goal!', {
              ok: 1, rec: 1, toX: 110, toY: 0.5,
              fx: function (S) { S.score = [4, 4]; S.per = '연장전(OT)'; S.str = '3대3 연장'; S.clock = 300; },
              msg: M('🎉 정답! 그런데 상대 팀도 막판에 골을 넣어 4:4 동점이 되었어요! 이제 넓은 얼음판에서 "3대3 연장전(먼저 골 넣으면 즉시 승리)"이 시작됩니다!', '🎉 Correct! Now tied 4–4, we head to 5 minutes of wide-open 3-on-3 Sudden-Death Overtime!')
            }),
            O('❓ 1명만 받는다', '❓ Only 1 player', '축구처럼 1명만?', 'Only 1 like soccer?', {
              bad: M('아하! 하키에서는 패스를 연결한 동료 "최대 2명"까지 모두 어시스트 1포인트를 받아요! 왼쪽 정답 버튼을 눌러보세요 😊', 'In hockey, up to TWO teammates can get an assist on one goal! Tap the green button 😊'),
              noHeartLoss: 1
            })
          ]
        },
        {
          say: M('⚡ 3대3 연장전! 선수가 양 팀 3명뿐이라 얼음판이 엄청 넓어요! 위쪽으로 빠르게 달려가는 "🟢 빈 동료"에게 패스해 단독 찬스를 만드세요!', '⚡ 3-on-3 Overtime! With only 3 skaters per team, the ice is wide open! Pass to the streaking green teammate at the top!'),
          hint: M('위쪽 초록색 원(🎯 3대3 단독 돌파 동료)에게 패스하세요!', 'Pass to the open green teammate at the top!'),
          tap: [
            T(162, 0.28, 1, '🎯 3대3 빈 공간 동료에게 패스!', '🎯 Pass to Open Teammate in 3-on-3!', '수비수가 없어서 골키퍼와 1대1 찬스!', 'Breakaway chance in 3-on-3 OT!', {
              to: 168,
              fx: function (S) { S.per = '승부차기(SO)'; S.str = '1대1 슛아웃'; S.clock = 0; },
              msg: M('😮 아깝다! 연장전 슛이 골대 기둥을 맞고 시간이 0:00이 되었어요! 이제 마지막 "1대1 승부차기(슛아웃)"로 최종 우승을 가립니다!', '😮 Off the post as Overtime expires! Now we go to the 1-on-1 Shootout for the win!')
            }),
            T(145, 0.75, 0, '❌ 수비수가 지키는 아래쪽', '❌ Defended Bottom Lane', '상대 수비수가 버티고 있어요', 'Defender is waiting there', { bad: M('3대3 연장전에서는 공을 뺏기면 위험해요! 위쪽 초록색 빈 동료에게 패스하세요!', 'Do not turn it over in 3-on-3! Pass to the open green teammate at the top!') })
          ]
        },
        makeShotStep(
          '🏆 대망의 1대1 승부차기(슛아웃) 결승골 찬스! 골키퍼를 제치고 빈 구석으로 슛을 날려 최종 우승을 차지하세요!',
          '🏆 1-on-1 Shootout Championship Shot! Pick an open corner to win it all!',
          M('🏆 최종 우승 골인!! 골대 뒤 패스부터 3대3 연장전, 1대1 승부차기까지 아이스하키의 모든 규칙을 완벽하게 마스터했어요!', '🏆 CHAMPIONSHIP GOAL!! You mastered behind-the-net plays, 3-on-3 OT, and the 1-on-1 Shootout!')
        )
      ]
    };
  };
  /* ---------- Stage Engine ---------- */
  var G = null;

  function stage(n) {
    if (G && G.tmr) clearInterval(G.tmr);
    var cfg = SCRIPTS[n]();
    var allSteps = [{ tut: 1 }].concat(cfg.steps);
    G = {
      n: n,
      meta: D.stages[n - 1],
      S: cfg.S,
      steps: allSteps,
      i: 0,
      hearts: 3,
      msg: null,
      done: 0,
      anim: 0,
      goalFlash: 0,
      reboundPend: null
    };
    step();
  }

  function step() {
    var st = G.steps[G.i];
    if (st && st.fx0) st.fx0(G.S);
    G.reboundPend = null;
    draw();
  }

  function fmt(s) {
    var m = Math.floor(s / 60), r = s % 60;
    return m + ':' + (r < 10 ? '0' : '') + r;
  }

  function draw() {
    var S = G.S, st = G.steps[G.i];
    var h = '';
    for (var i = 0; i < 3; i++) h += '<span class="heart' + (i >= G.hearts ? ' lost' : '') + '">❤️</span>';
    var subHtml = '<div class="sb-sub"><span>🏒 ' + t({ ko: '우리 5명 vs 상대 5명 상태', en: 'Skater Strength' }) + ': <b>' + S.str + '</b></span>';
    if (S.pp) subHtml += '<span class="pp-pill">⚡ ' + t({ ko: '파워플레이 남은 시간 ', en: 'Power Play ' }) + fmt(S.pp) + '</span>';
    if (typeof S.stam === 'number') subHtml += '<span>🔋 ' + t({ ko: '선수 체력 ', en: 'Stamina ' }) + S.stam + '%</span>';
    subHtml += '</div>';

    var stepLabel = st && st.tut
      ? t({ ko: '입문 튜토리얼', en: 'Tutorial' })
      : (G.i) + '/' + (G.steps.length - 1);

    app.innerHTML =
      '<div class="stage-hdr"><div><span class="badge">' + t(G.meta.sub) + ' · ' + stepLabel + '</span><h2 style="margin-top:4px">' + t(G.meta.title) + '</h2></div>' +
      '<div style="text-align:right"><div class="hearts">' + h + '</div><button class="btn small" onclick="location.hash=\'#\'">' + k('⬅ 목록으로', '⬅ Back') + '</button></div></div>' +
      (G.meta.easyRule ? '<div class="easy-rule-box"><div class="er-label">' + t({ ko: '💡 5초 한줄 핵심 규칙', en: '💡 5-Second Key Rule' }) + '</div><div class="er-text">' + t(G.meta.easyRule) + '</div></div>' : '') +
      '<div class="scorebug"><div class="sb-top"><div class="sb-teams"><span class="sb-team">🔵 ' + t({ ko: '우리 팀', en: 'HOME' }) + ' <span class="sb-score">' + S.score[0] + '</span></span>' +
      '<span style="color:var(--muted)">:</span><span class="sb-team"><span class="sb-score">' + S.score[1] + '</span> ' + t({ ko: '상대 팀', en: 'AWAY' }) + ' 🔴</span></div>' +
      '<span class="sb-down">' + S.per + ' · ' + fmt(S.clock) + '</span></div>' + subHtml + '</div>' +
      '<div class="field-wrap"><canvas id="rinkCanvas" width="760" height="320"></canvas></div>' +
      '<div id="coachArea"></div><div id="controls"></div>';

    paint();

    var ca = document.getElementById('coachArea'), ct = document.getElementById('controls');

    if (G.done) {
      var won = G.done > 0;
      if (won) { saveP(G.n, G.hearts); sfx('td'); }
      ca.innerHTML = '<div class="card-box" style="text-align:center"><div style="font-size:38px">' + (won ? '🏆' : '💪') + '</div>' +
        '<h2>' + (won ? k('🎉 단계 클리어!', '🎉 Stage Clear!') : k('다시 도전해요!', 'Try Again!')) + '</h2>' +
        '<p style="margin:8px 0">' + t(G.msg || G.meta.why) + '</p>' +
        '<div style="background:rgba(250,204,21,.1);border:1px solid rgba(250,204,21,.35);border-radius:10px;padding:12px;margin:10px 0;text-align:left">' +
        '<b style="color:var(--gold)">💡 ' + t({ ko: '이번 단계 핵심 정리', en: 'Key Takeaway' }) + '</b><p style="margin-top:4px">' + t(G.meta.why) + '</p></div>' +
        '<div class="btn-row" style="justify-content:center">' +
        '<button class="btn" onclick="HK.retry()">' + k('🔄 다시 하기', '🔄 Retry') + '</button>' +
        (won && G.n < 5 ? '<a class="btn primary" href="#s' + (G.n + 1) + '">' + k('다음 단계 ▶', 'Next Stage ▶') + '</a>' : '<a class="btn primary" href="#">' + k('⬅ 목록으로', '⬅ Back') + '</a>') +
        '</div></div>';
      return;
    }

    if (st && st.tut) {
      ca.innerHTML =
        '<div class="card-box" style="border:2px solid var(--gold);background:linear-gradient(180deg,#13284c,#0e1f38)">' +
        '<span class="badge" style="background:rgba(250,204,21,.2);color:var(--gold)">' + t({ ko: '📘 시작 전 30초 핵심 튜토리얼', en: '📘 30-Second Stage Tutorial' }) + '</span>' +
        '<h3 style="margin-top:8px;color:#fff;font-size:19px">' + t(G.meta.title) + ' — ' + t(G.meta.goal) + '</h3>' +
        '<div style="margin-top:10px;display:grid;gap:8px">' +
        '<div style="background:rgba(15,23,42,.75);border-left:4px solid var(--accent);padding:10px 12px;border-radius:8px">' +
        '<b style="color:var(--accent)">📌 ' + t({ ko: '무엇을 배우나요?', en: 'What will I learn?' }) + '</b><p style="margin-top:4px;color:#f8fafc">' + t(G.meta.tutWhat || G.meta.easyRule) + '</p></div>' +
        '<div style="background:rgba(15,23,42,.75);border-left:4px solid var(--gold);padding:10px 12px;border-radius:8px">' +
        '<b style="color:var(--gold)">❓ ' + t({ ko: '왜 이런 규칙이 생겼나요?', en: 'Why does this rule exist?' }) + '</b><p style="margin-top:4px;color:#f8fafc">' + t(G.meta.tutWhy || G.meta.why) + '</p></div>' +
        '<div style="background:rgba(15,23,42,.75);border-left:4px solid var(--green);padding:10px 12px;border-radius:8px">' +
        '<b style="color:var(--green)">🎮 ' + t({ ko: '어떻게 플레이하나요?', en: 'How do I play?' }) + '</b><p style="margin-top:4px;color:#f8fafc">' + t(G.meta.tutHow || G.meta.goal) + '</p></div>' +
        '</div>' +
        '<button class="btn primary wide" style="margin-top:12px;font-size:16px;padding:13px" onclick="HK.startStageSteps()">' +
        t({ ko: '✅ 이해했어! 따라 하기로 직접 해보기 ▶', en: '✅ Got It! Start Guided Play ▶' }) + '</button>' +
        '</div>';
      return;
    }

    var stepBadge = st.guide
      ? '<span class="badge" style="background:rgba(250,204,21,.22);color:var(--gold);margin-bottom:4px">✨ ' + t({ ko: '따라 하기 (눈으로 먼저 보기)', en: 'Guided Demo' }) + '</span>'
      : '';

    ca.innerHTML = '<div class="coach-box"><div class="coach-body">' + stepBadge +
      '<div class="coach-title">🐻 ' + k('곰 코치', 'Coach Bear') + '</div><p>' + t(G.msg || st.say) + '</p>' +
      (st.hint ? '<div style="margin-top:6px;padding:7px 10px;background:rgba(56,189,248,.12);border-radius:8px;color:#bae6fd;font-size:15px">💡 <b>' + t({ ko: '힌트', en: 'Hint' }) + ':</b> ' + t(st.hint) + '</div>' : '') +
      '</div></div>';

    if (G.reboundPend) {
      ct.innerHTML = '<button class="btn primary wide" style="font-size:17px;padding:15px" onclick="HK.scoreRebound()">' +
        t({ ko: '🔥 리바운드 찬스! 튕겨 나온 공을 한 번 더 눌러 골문 안으로 밀어 넣기! 🥅', en: '🔥 REBOUND CHANCE! Tap once more to slam the loose puck into the net! 🥅' }) + '</button>';
      return;
    }

    if (st.opts) {
      var gridClass = st.opts.length === 1 ? 'play-grid single-col' : 'play-grid';
      ct.innerHTML = '<div class="' + gridClass + '">' + st.opts.map(function (o, idx) {
        var cls = 'play-btn' + (o.rec ? ' recommend primary' : '') + (st.guide ? ' guide-glow' : '');
        return '<button class="' + cls + '" onclick="HK.choose(' + idx + ')"><div class="p-title">' + t(o.l) + '</div><div class="p-desc">' + t(o.d) + '</div></button>';
      }).join('') + '</div>';
    } else if (st.tap) {
      var instruction = st.shot
        ? t({ ko: '👇 얼음판 위 과녁을 탭하거나 아래 슛 버튼을 누르세요!', en: '👇 Tap a target on the ice OR click a shot button below!' })
        : t({ ko: '👇 얼음판 위 초록색 동료를 탭하거나 아래 패스 버튼을 누르세요!', en: '👇 Tap the green teammate on the ice OR click a pass button below!' });
      ct.innerHTML = '<div style="margin-bottom:6px;font-size:15px;color:var(--gold);font-weight:700">' + instruction + '</div>' +
        '<div class="play-grid">' + st.tap.map(function (tp, idx) {
          var isGood = tp.ok ? ' recommend primary' : '';
          return '<button class="play-btn' + isGood + '" onclick="HK.tapChoice(' + idx + ')">' +
            '<div class="p-title">' + t(tp.n) + '</div>' +
            (tp.d ? '<div class="p-desc">' + t(tp.d) + '</div>' : '') +
            '</button>';
        }).join('') + '</div>';
    }
  }
  function startStageSteps() {
    sfx('click');
    G.i = 1;
    G.msg = null;
    step();
  }

  function tweenPuck(toX, toY, cb) {
    var S = G.S;
    var fx = S.px, fy = S.py || 0.5;
    var tx = typeof toX === 'number' ? toX : fx;
    var ty = typeof toY === 'number' ? toY : fy;
    var f = 0;
    G.anim = 1;
    if (ivAnim) clearInterval(ivAnim);
    var iv = ivAnim = setInterval(function () {
      f++;
      var p = f / 14;
      S.px = fx + (tx - fx) * p;
      S.py = fy + (ty - fy) * p;
      paint();
      if (f >= 14) {
        clearInterval(iv); if (ivAnim === iv) ivAnim = 0;
        S.px = tx;
        S.py = ty;
        G.anim = 0;
        if (cb) cb();
      }
    }, 24);
  }

  function choose(idx) {
    if (G.anim) return;
    var st = G.steps[G.i], o = st.opts[idx];
    if (!o) return;
    if (o.bad) {
      sfx('whistle');
      if (o.noHeartLoss) {
        G.msg = o.bad;
        draw();
      } else {
        fail(o.bad);
      }
      return;
    }
    sfx('whistle');
    if (o.fx) o.fx(G.S);
    G.msg = o.msg || null;
    tweenPuck(o.toX, o.toY, function () {
      if (o.goal) {
        G.S.score[0]++;
        G.goalFlash = 1;
        sfx('td');
      } else {
        sfx('1st');
      }
      next();
    });
  }

  function tapChoice(idx) {
    if (G.anim) return;
    var st = G.steps[G.i];
    if (!st || !st.tap || !st.tap[idx]) return;
    var hit = st.tap[idx];
    if (hit.rebound) {
      sfx('whistle');
      tweenPuck(180, 0.5, function () {
        G.msg = M('😮 골키퍼 패드에 맞고 공이 바로 앞에 튕겨 나왔어요(리바운드)! 아래 황금 버튼을 눌러 빈 골문으로 밀어 넣으세요!', '😮 The shot bounced off the goalie pads right in front of you (Rebound)! Click the gold button below to slam it in!');
        G.reboundPend = hit;
        draw();
      });
      return;
    }
    if (!hit.ok) {
      sfx('whistle');
      G.msg = hit.bad || M('앗, 그쪽은 상대 수비가 막고 있어요! 초록색 추천 버튼을 눌러보세요 😊', 'Oops, that lane is covered! Try the green recommended choice 😊');
      draw();
      return;
    }
    sfx('click');
    if (hit.fx) hit.fx(G.S);
    G.msg = hit.msg || null;
    tweenPuck(hit.to || hit.x, hit.y, function () {
      if (hit.goal) {
        G.S.score[0]++;
        G.goalFlash = 1;
        sfx('td');
      } else {
        sfx('1st');
      }
      next();
    });
  }

  function scoreRebound() {
    if (!G.reboundPend) return;
    var hit = G.reboundPend;
    G.reboundPend = null;
    G.msg = hit.msg || M('🚨 리바운드 골인!! 튕겨 나온 공을 끝까지 집중해서 밀어 넣었어요!', '🚨 REBOUND GOAL!! You stayed with the loose puck and slammed it home!');
    tweenPuck(192, 0.36, function () {
      G.S.score[0]++;
      G.goalFlash = 1;
      sfx('td');
      next();
    });
  }

  function fail(msg) {
    G.hearts--;
    G.msg = msg;
    sfx('bad');
    if (G.hearts <= 0) G.done = -1;
    draw();
  }

  function next() {
    G.i++;
    if (G.i >= G.steps.length) {
      G.done = 1;
      draw();
    } else {
      setTimeout(function () {
        G.goalFlash = 0;
        step();
      }, 650);
    }
  }

  /* ---------- Canvas Ice Rink (200ft) ---------- */
  function paint() {
    var c = document.getElementById('rinkCanvas');
    if (!c) return;
    var ctx = c.getContext('2d'), W = c.width, H = c.height;
    ctx.clearRect(0, 0, W, H);
    var S = G.S, st = G.steps[G.i] || {};
    var fx = function (ft) { return 24 + (ft / 200) * (W - 48); };

    // Ice surface with rounded boards
    ctx.fillStyle = '#e6f4fe';
    ctx.beginPath();
    ctx.roundRect(14, 14, W - 28, H - 28, 46);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#38bdf8';
    ctx.stroke();

    // Subtle zone shading
    ctx.fillStyle = 'rgba(59,130,246,0.06)';
    ctx.fillRect(fx(0), 18, fx(75) - fx(0), H - 36);
    ctx.fillStyle = 'rgba(250,204,21,0.07)';
    ctx.fillRect(fx(125), 18, fx(200) - fx(125), H - 36);

    // Goal lines (11ft from each end)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    [11, 189].forEach(function (x) {
      ctx.beginPath();
      ctx.moveTo(fx(x), 24);
      ctx.lineTo(fx(x), H - 24);
      ctx.stroke();
    });

    // Blue lines (75ft & 125ft)
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(fx(75) - 4, 16, 8, H - 32);
    ctx.fillRect(fx(125) - 4, 16, 8, H - 32);

    // Center red line (100ft) - dashed style
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(fx(100) - 3, 16, 6, H - 32);

    // Center faceoff circle
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(fx(100), H / 2, 34, 0, Math.PI * 2);
    ctx.stroke();

    // Zone labels at the top of the ice
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#1e3a8a';
    ctx.fillText(L === 'ko' ? '🏠 우리 수비 지역' : '🏠 OUR ZONE', fx(42), 34);
    ctx.fillStyle = '#991b1b';
    ctx.fillText(L === 'ko' ? '🔴 중앙 빨간 선(아이싱)' : '🔴 RED LINE (ICING)', fx(100), 34);
    ctx.fillStyle = '#1d4ed8';
    ctx.fillText(L === 'ko' ? '🔵 파란 선(오프사이드)' : '🔵 BLUE LINE (OFFSIDE)', fx(125), 50);
    ctx.fillStyle = '#0f172a';
    ctx.fillText(L === 'ko' ? '⚔️ 상대 공격 지역 🥅' : '⚔️ ATTACK ZONE 🥅', fx(162), 34);

    // Penalty box (Top) & Team Bench (Bottom) indicators when relevant
    if (S.penBox || G.n === 3 || G.n === 4) {
      ctx.fillStyle = 'rgba(239,68,68,0.18)';
      ctx.fillRect(fx(82), 16, fx(118) - fx(82), 24);
      ctx.fillStyle = '#b91c1c';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(L === 'ko' ? '⏳ 2분 감옥(페널티 박스)' : '⏳ 2-MIN PENALTY BOX', fx(100), 32);
    }
    if (G.n === 4) {
      ctx.fillStyle = 'rgba(34,197,94,0.22)';
      ctx.fillRect(fx(78), H - 42, fx(118) - fx(78), 26);
      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(L === 'ko' ? '🚪 우리 팀 실시간 교체 벤치' : '🚪 OUR TEAM BENCH', fx(98), H - 25);
    }

    // Goal creases & nets
    ctx.fillStyle = 'rgba(56,189,248,0.45)';
    ctx.beginPath();
    ctx.arc(fx(11), H / 2, 18, -Math.PI / 2, Math.PI / 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(fx(189), H / 2, 18, Math.PI / 2, Math.PI * 1.5);
    ctx.fill();

    // Draw nets (Note space behind 189ft up to 200ft!)
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.strokeRect(fx(6), H / 2 - 20, fx(11) - fx(6), 40);
    ctx.strokeRect(fx(189), H / 2 - 20, fx(194) - fx(189), 40);

    // Behind the net highlight in Stage 5
    if (G.n === 5) {
      ctx.fillStyle = 'rgba(250,204,21,0.35)';
      ctx.fillRect(fx(191), H / 2 - 36, fx(200) - fx(191), 72);
    }

    var px = fx(S.px), py = (S.py || 0.5) * H;

    // Opponents (Red) + Goalie
    var defs = [
      { x: fx(148), y: H * 0.42, l: L === 'ko' ? '수비' : 'DEF' },
      { x: fx(156), y: H * 0.68, l: L === 'ko' ? '수비' : 'DEF' },
      { x: fx(185), y: H * 0.50, l: L === 'ko' ? '골키퍼' : 'GK', gk: 1 }
    ];
    defs.forEach(function (d) {
      ctx.fillStyle = d.gk ? '#b91c1c' : '#ef4444';
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.gk ? 16 : 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#fff';
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(d.l, d.x, d.y + 4);
    });

    // Active Player with the Puck (Blue + Gold Halo)
    ctx.fillStyle = 'rgba(250,204,21,0.35)';
    ctx.beginPath();
    ctx.arc(px, py, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.arc(px, py, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#facc15';
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(L === 'ko' ? '나' : 'ME', px, py + 4);

    // Puck right next to active player
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.arc(px + 12, py + 8, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Tap Targets on the Ice (also clickable directly on canvas!)
    if (st && st.tap && !G.reboundPend) {
      st.tap.forEach(function (tp, idx) {
        var tx = fx(tp.x), ty = tp.y * H;
        // Dashed guide line from player to recommended target
        if (tp.ok) {
          ctx.save();
          ctx.setLineDash([6, 4]);
          ctx.strokeStyle = 'rgba(22,163,74,0.75)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(tx, ty);
          ctx.stroke();
          ctx.restore();
        }
        ctx.fillStyle = tp.ok ? 'rgba(34,197,94,0.28)' : 'rgba(239,68,68,0.22)';
        ctx.beginPath();
        ctx.arc(tx, ty, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = tp.ok ? '#16a34a' : '#dc2626';
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(tp.ok ? (st.shot ? '🥅 슛!' : '🟢 동료') : '❌ 주의', tx, ty + 4);
      });

      c.onclick = function (e) {
        var r = c.getBoundingClientRect();
        var mx = (e.clientX - r.left) * (W / r.width);
        var my = (e.clientY - r.top) * (H / r.height);
        var bestIdx = -1, bestDist = 42;
        st.tap.forEach(function (tp, idx) {
          var d = Math.hypot(mx - fx(tp.x), my - tp.y * H);
          if (d < bestDist) { bestDist = d; bestIdx = idx; }
        });
        if (bestIdx >= 0) tapChoice(bestIdx);
      };
    } else {
      c.onclick = null;
    }

    // Goal Flash Banner
    if (G.goalFlash) {
      ctx.fillStyle = 'rgba(220,38,38,0.88)';
      ctx.roundRect(W / 2 - 130, H / 2 - 32, 260, 64, 16);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 26px sans-serif';
      ctx.fillText(L === 'ko' ? '🚨 골인!! GOAL!! 🚨' : '🚨 GOAL!! 🚨', W / 2, H / 2 + 9);
    }
  }

  window.HK = {
    choose: choose,
    tapChoice: tapChoice,
    scoreRebound: scoreRebound,
    startStageSteps: startStageSteps,
    retry: function () { stage(G.n); },
    primerNext: function (d) {
      sfx('click');
      primerIdx = Math.max(0, Math.min(D.primer.length - 1, primerIdx + d));
      if (location.hash === '#primer') primerView(); else home();
    },
    primerGo: function (i) {
      sfx('click');
      primerIdx = i;
      if (location.hash === '#primer') primerView(); else home();
    },
    fireShootout: fireShootout,
    nextShootout: function () {
      sfx('click');
      if (!SO || SO.round >= SO.max) { shootoutInit(); return; }
      SO.round++;
      SO.lean = ['left', 'right', 'center'][Math.floor(Math.random() * 3)];
      SO.busy = 0;
      SO.reboundReady = 0;
      SO.puckX = 380;
      SO.puckY = 250;
      SO.gkX = 380;
      SO.msg = {
        ko: SO.round + '라운드! 골키퍼의 빈틈을 보고 아래 버튼이나 골문 과녁을 누르세요!',
        en: 'Round ' + SO.round + '! Read the goalie and pick your move below!'
      };
      shootoutDraw();
    },
    reboundGoal: function () {
      if (!SO || !SO.reboundReady) return;
      SO.reboundReady = 0;
      SO.goals++;
      SO.hist[SO.round - 1] = 1;
      SO.puckX = 330;
      SO.puckY = 78;
      sfx('td');
      SO.msg = {
        ko: '🚨 리바운드 골인!! 튕겨 나온 공을 끝까지 밀어 넣어 득점했어요!',
        en: '🚨 REBOUND GOAL!! You buried the loose puck!'
      };
      shootoutDraw();
    },
    resetShootout: function () { sfx('click'); shootoutInit(); }
  };

  route();
})();
