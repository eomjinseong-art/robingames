/* Nadoo Touchdown 101 — Easy, Beginner-Friendly & Fun App */
'use strict';
(function () {
  var D = FB_DATA, A = window.FB_AUDIO, L = localStorage.getItem('fb_lang') || 'ko';
  var app = document.getElementById('app'), allOpen = localStorage.getItem('fb_all') !== '0';
  var done = JSON.parse(localStorage.getItem('fb_done') || '{}');
  var primerIdx = 0;

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

  function route() {
    stopAll();
    setHead();
    var h = location.hash.slice(1);
    if (/^s[1-5]$/.test(h)) stage(+h[1]);
    else if (h === 'primer') primerView();
    else if (h === 'bug') bug();
    else if (h === 'dex') dex();
    else if (h === 'quiz') quiz(0);
    else home();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);

  function back() {
    return '<button class="btn small" onclick="location.hash=\'\'">⬅ ' + k('목록으로', 'Back') + '</button> ';
  }

  function renderPrimerSlide() {
    var slides = D.primer.slides;
    var s = slides[primerIdx] || slides[0];
    var dots = slides.map(function (_, i) {
      return '<button class="btn small' + (i === primerIdx ? ' primary' : '') + '" style="min-height:36px;padding:4px 11px" onclick="FB.primerGo(' + i + ')">' + (i + 1) + '</button>';
    }).join(' ');
    return '<div class="card-box" style="border-color:var(--gold);background:linear-gradient(180deg,#153d26,#0c2617)">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">' +
      '<span class="badge-guide">📖 ' + k('0단계 · 1분 왕초보 입문 가이드', 'Step 0 · 1-Min Beginner Guide') + ' (' + s.num + ')</span>' +
      '<div>' + dots + '</div></div>' +
      '<h3 style="margin:10px 0 6px;color:var(--gold);font-size:19px">' + s.icon + ' ' + esc(t(s.title)) + '</h3>' +
      '<div style="background:rgba(0,0,0,0.38);border:1.5px dashed rgba(255,213,74,0.55);border-radius:10px;padding:10px 12px;margin:8px 0;font-weight:700;color:#ffe066;font-size:15.5px;text-align:center">' +
      esc(s.diagram) + '</div>' +
      '<p style="margin:8px 0 12px;white-space:pre-line;color:#f5faf7;font-size:17px;line-height:1.6">' + esc(t(s.body)) + '</p>' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">' +
      '<button class="btn small" onclick="FB.primerNext(-1)" ' + (primerIdx === 0 ? 'disabled style="opacity:.4"' : '') + '>◀ ' + k('이전 설명', 'Prev') + '</button>' +
      (primerIdx < slides.length - 1
        ? '<button class="btn primary small" onclick="FB.primerNext(1)">' + k('다음 설명 보기 ▶', 'Next Slide ▶') + '</button>'
        : '<button class="btn primary small" onclick="location.hash=\'s1\'">🚀 ' + k('이해 완료! Stage 1 시작하기 ▶', 'Got It! Start Stage 1 ▶') + '</button>') +
      '</div></div>';
  }

  function primerView() {
    app.innerHTML = '<div style="margin-bottom:10px">' + back() + '</div>' + renderPrimerSlide();
  }

  function home() {
    var h = '<div class="card-box"><h2 style="margin:0 0 6px;color:var(--gold)">' + k('🏈 미식축구, 왕초보도 5분이면 완전 정복!', '🏈 Football 101 in 5 Easy Stages!') + '</h2>' +
      '<p style="margin:0">' + k('복잡한 영어 용어는 싹 빼고 "왜 노란 선을 넘어야 하는지, 왜 4번째에 발로 차는지"부터 차근차근 알려드려요!', 'Zero jargon! Learn why teams chase the Yellow Line and why they kick on 4th down step by step!') + '</p>' +
      '</div>' +
      renderPrimerSlide() +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin:12px 0 8px">' +
      '<h3 style="margin:0;color:var(--gold)">🎮 ' + k('단계별 따라 하기 & 실전 코스 (Stage 1~5)', 'Step-by-Step Guided Stages (1–5)') + '</h3>' +
      '<button class="btn small" id="allBtn">⚙️ ' + (allOpen ? k('전체 열기 ON', 'All Open ON') : k('전체 열기', 'Unlock All')) + '</button></div>' +
      '<div class="stage-list">';
    D.stages.forEach(function (s, i) {
      var open = allOpen || i === 0 || done[i];
      h += '<div class="stage-card"><div><h3>' + s.icon + ' ' + esc(t(s.title)) + (done[i + 1] ? ' ✅' : '') + '</h3><p>' + esc(t(s.sub)) + '</p>' +
        (s.easyRule ? '<p style="margin-top:5px;color:#ffe066;font-size:15.5px">💡 ' + esc(t(s.easyRule)) + '</p>' : '') +
        '</div>' +
        (open ? '<button class="btn primary" onclick="location.hash=\'s' + s.id + '\'">' + k('시작 ▶', 'Play ▶') + '</button>' : '<span style="font-size:24px">🔒</span>') + '</div>';
    });
    h += '</div><div class="decoder-grid">' +
      '<button class="btn blue" onclick="location.hash=\'bug\'">📺 ' + k('TV 중계 전광판 해독기', 'TV Scoreboard Guide') + '</button>' +
      '<button class="btn" onclick="location.hash=\'dex\'">📖 ' + k('포지션 & 규칙 쉬운 사전', 'Easy Rules Guide') + '</button>' +
      '<button class="btn ok" onclick="location.hash=\'quiz\'">⚡ ' + k('왕초보 탈출 퀴즈 5문제', '5-Question Quiz') + '</button></div>';
    app.innerHTML = h;
    document.getElementById('allBtn').onclick = function () { allOpen = !allOpen; localStorage.setItem('fb_all', allOpen ? '1' : '0'); home(); };
  }

  function bug() {
    var items = D.scorebugItems || [];
    var h = '<div class="card-box">' + back() + '<h2 style="color:var(--gold)">📺 ' + k('TV 중계 전광판 해독기', 'TV Scoreboard Decoder') + '</h2>' +
      '<p>' + k('TV 중계 화면 아래에 나오는 숫자와 색깔 선들이 무슨 뜻인지 궁금한 버튼을 눌러보세요!', 'Tap any item below to see what the numbers and lines on a TV broadcast mean!') + '</p>' +
      '<div class="scorebug"><span class="sb-teams"><span class="sb-team">🔵 우리 팀 21</span><span class="sb-team">🔴 상대 팀 24</span></span><span class="sb-down">2nd & 4</span><span class="sb-spot">상대 18야드 🚨</span><span class="sb-clock">4쿼터 01:42 · 25초</span></div>' +
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
    var h = '<div class="card-box">' + back() + '<h2 style="color:var(--gold)">📖 ' + k('포지션 & 규칙 쉬운 사전', 'Easy Positions & Rules Guide') + ' (' + D.cards.length + ')</h2><div class="dex-grid">';
    D.cards.forEach(function (c) { h += '<div class="dex-item"><h4>' + esc(c.code) + ' · ' + esc(t(c.name)) + '</h4><div class="role">' + esc(t(c.role)) + '</div><p>' + esc(t(c.desc)) + '</p></div>'; });
    app.innerHTML = h + '</div></div>';
  }

  function quiz(i) {
    var q = D.quiz[i];
    if (!q) { app.innerHTML = '<div class="card-box">' + back() + '<h2>🏆 ' + k('왕초보 탈출 퀴즈 완료!', 'Quiz Complete!') + '</h2><p>' + k('이제 미식축구 중계를 보면서 모든 규칙을 이해할 수 있어요!', 'You are ready to enjoy any football broadcast!') + '</p><button class="btn primary wide" onclick="location.hash=\'\'">' + k('홈으로 돌아가기', 'Back to Home') + '</button></div>'; return; }
    var h = '<div class="card-box">' + back() + '<h3>⚡ ' + k('미식축구 상식 퀴즈 ', 'Football Quiz ') + (i + 1) + ' / ' + D.quiz.length + '</h3><p style="font-weight:500">' + esc(t(q.q)) + '</p>';
    q.opts.forEach(function (o, j) { h += '<button class="btn quiz-opt" data-j="' + j + '">' + esc(t(o)) + '</button>'; });
    app.innerHTML = h + '<div id="qOut"></div></div>';
    var answered = false;
    app.querySelectorAll('.quiz-opt').forEach(function (b) {
      b.onclick = function () {
        if (answered) return; answered = true; var j = +b.dataset.j, ok = j === q.ans;
        b.classList.add(ok ? 'correct' : 'wrong'); app.querySelectorAll('.quiz-opt')[q.ans].classList.add('correct'); sfx(ok ? 'firstdown' : 'bad');
        document.getElementById('qOut').innerHTML = '<div class="coach-box"><div class="coach-title">' + (ok ? k('정답이에요! 🎉', 'Correct! 🎉') : k('아하! 정답은: ', 'Answer: ') + esc(t(q.opts[q.ans]))) + '</div>' + esc(t(q.exp)) +
          '</div><button class="btn primary wide" id="qNext">' + k('다음 문제 ▶', 'Next ▶') + '</button>';
        document.getElementById('qNext').onclick = function () { quiz(i + 1); };
      };
    });
  }
  /* ---------- Stage scripts (with plain Korean labels & buttons on every step) ---------- */
  function O(ko, en, dko, den, x) { var o = { l: { ko: ko, en: en }, d: { ko: dko, en: den } }; for (var p in x) o[p] = x[p]; return o; }
  function M(ko, en) { return { ko: ko, en: en }; }
  function lanes(okI, gain) {
    var names = [
      { ko: '위쪽 길 A', en: 'Top Lane A' },
      { ko: '가운데 길 B', en: 'Middle Lane B' },
      { ko: '아래쪽 길 C', en: 'Bottom Lane C' }
    ];
    return [0, 1, 2].map(function (i) {
      var isOk = i === okI;
      return {
        x: 3,
        y: [0.30, 0.50, 0.72][i],
        ok: isOk,
        g: gain,
        n: '길 ' + ['A', 'B', 'C'][i],
        btnTitle: {
          ko: (isOk ? '🟢 ' : '🔴 ') + names[i].ko + (isOk ? '로 달리기 (+' + gain + '야드 열린 빈틈!)' : ' (수비수가 막고 있음)'),
          en: (isOk ? '🟢 Run ' : '🔴 ') + names[i].en + (isOk ? ' (+' + gain + ' yds Open Gap!)' : ' (Blocked by Defender)')
        },
        btnDesc: {
          ko: isOk ? '우리 보디가드들이 수비를 밀어내서 길이 활짝 열렸어요!' : '빨간 상대 수비수가 바로 앞에서 기다리고 있어요!',
          en: isOk ? 'Your blockers opened a wide running lane!' : 'A red defender is waiting right in that gap!'
        }
      };
    });
  }
  function recv(okI, gain) {
    var names = [
      { ko: '위쪽 날쌘 동료(WR1)', en: 'Top Receiver (WR1)' },
      { ko: '가운데 든든한 동료(TE)', en: 'Middle Tight End (TE)' },
      { ko: '아래쪽 날쌘 동료(WR2)', en: 'Bottom Receiver (WR2)' }
    ];
    return [0, 1, 2].map(function (i) {
      var isOk = i === okI;
      return {
        x: [7, 9, 7][i],
        y: [0.22, 0.50, 0.78][i],
        ok: isOk,
        g: gain,
        n: ['WR1', 'TE', 'WR2'][i],
        btnTitle: {
          ko: (isOk ? '🟢 ' : '🔴 ') + names[i].ko + (isOk ? '에게 패스! (+' + gain + '야드 노마크 찬스!)' : ' (수비수가 바짝 붙어 있음)'),
          en: (isOk ? '🟢 Pass to ' : '🔴 ') + names[i].en + (isOk ? ' (+' + gain + ' yds Wide Open!)' : ' (Tightly Covered)')
        },
        btnDesc: {
          ko: isOk ? '수비수를 따돌리고 혼자 비어 있어요! 지금 던지면 성공!' : '상대 수비수가 옆에 딱 붙어 있어서 던지면 위험해요!',
          en: isOk ? 'Wide open with no defender nearby!' : 'Tightly covered by a defender!'
        }
      };
    });
  }

  var TAPRUN = M('👇 잔디밭의 초록색 원(열린 빈틈)을 탭하거나, 아래 초록색 버튼을 눌러 달리세요!', '👇 Tap the green gap on the field OR click the green button below to run!');
  var TAPPASS = M('👇 수비수가 없는 초록색 빈 동료(리시버)를 잔디밭에서 탭하거나 아래 초록색 버튼을 누르세요!', '👇 Tap the open green receiver on the field OR click the green button below to pass!');

  var SCRIPTS = {
    1: function () {
      return {
        S: { los: 25, fd: 35, down: 1 },
        steps: [
          {
            guide: 1,
            say: M('1단계 따라 하기(눈으로 먼저 보기): 지금 전광판에 "1st & 10"이라고 적혀 있죠? "1번째 기회이고, 노란 선까지 10야드 남았다"는 뜻이에요! 먼저 안전하게 공을 건네주어 달리는 [🏃 달리기(런)] 버튼을 눌러보세요!', 'Step 1 Watch Demo: The scoreboard says "1st & 10"—meaning 1st try with 10 yards to the Yellow Line! Tap the glowing [🏃 Run] button below to start!'),
            hint: M('달리기(런)는 공을 뺏길 위험이 적고 4~6야드씩 꾸준히 전진해요!', 'Running the ball is safe and gains steady yards!'),
            opts: [
              O('✨ [따라 하기] 🏃 달리기(런) 시작하기!', '✨ [Guided] 🏃 Start with a Run Play!', '뒤에 있는 달리기 선수(러닝백)에게 공을 건네줘요!', 'Hand the ball off to your Running Back!', {
                ok: 1, rec: 1, sfx: 'hut',
                then: [{ tap: lanes(1, 6), say: TAPRUN, hint: M('가운데 초록색 길 B(+6야드)를 고르세요!', 'Pick the open green Middle Lane B (+6 yds)!') }]
              })
            ]
          },
          {
            say: M('전광판을 보세요! 방금 1번째 기회에 6야드를 갔더니 노란 선까지 4야드만 남아서 "2nd & 4 (2번째 기회, 4야드 남음)"로 바뀌었어요! 이제 4야드만 더 가면 노란 선을 넘어요. 달리기와 패스 중 원하는 작전을 골라보세요!', 'Look at the scoreboard! You gained 6 yards on 1st down, so now it reads "2nd & 4" (2nd try, 4 yards to the Yellow Line)! Pick either Run or Short Pass to cross the Yellow Line!'),
            hint: M('달리기(+5야드)든 패스(+7야드)든 초록색 빈 곳을 고르면 노란 선을 넘어요!', 'Either Run (+5 yds) or Pass (+7 yds) will cross the Yellow Line!'),
            opts: [
              O('🏃 몸으로 뚫고 달리기 (Run)', '🏃 Run Through a Gap', '+5야드 전진해서 노란 선 넘기!', 'Gain +5 yards and cross the Yellow Line!', {
                ok: 1, rec: 1, sfx: 'hut',
                then: [{ tap: lanes(2, 5), say: TAPRUN }]
              }),
              O('🎯 앞으로 짧게 던지기 (Short Pass)', '🎯 Throw a Short Pass', '+7야드 패스로 노란 선 넘기!', 'Gain +7 yards through the air!', {
                ok: 1, rec: 1, sfx: 'hut',
                then: [{ tap: recv(0, 7), say: TAPPASS }]
              })
            ]
          },
          {
            say: M('🎉 짝짝짝! 노란 선을 넘었더니 "퍼스트다운!"이 선언되면서 전광판이 다시 "1st & 10 (새로운 1번째 기회!)"으로 리셋되었어요! 노란 선도 10야드 앞으로 새로 그어졌죠? 한 번만 더 노란 선을 넘어 스테이지를 클리어해 보세요!', '🎉 Awesome! Crossing the Yellow Line earned a FIRST DOWN and reset the scoreboard to a brand-new "1st & 10"! Cross the new Yellow Line one more time to clear Stage 1!'),
            hint: M('패스를 고르면 한 번에 11야드를 날아가 단숨에 노란 선을 넘어요!', 'A pass gains 11 yards at once to cross the Yellow Line in one play!'),
            opts: [
              O('🎯 빈 동료에게 시원하게 패스! (+11야드)', '🎯 Pass to Open Teammate! (+11 yds)', '한 번에 10야드 넘게 전진해요!', 'Cross the Yellow Line in one throw!', {
                ok: 1, rec: 1, sfx: 'hut',
                then: [{ tap: recv(2, 11), say: TAPPASS }]
              }),
              O('🏃 빈틈으로 힘차게 달리기! (+10야드)', '🏃 Burst Through for a 10-Yard Run!', '달리기로도 노란 선을 넘을 수 있어요!', 'Run 10 yards for a First Down!', {
                ok: 1, rec: 1, sfx: 'hut',
                then: [{ tap: lanes(0, 10), say: TAPRUN }]
              })
            ]
          }
        ]
      };
    },
    2: function () {
      return {
        S: { los: 40, fd: 50, down: 1 },
        steps: [
          {
            guide: 1,
            say: M('2단계 따라 하기(눈으로 먼저 보기): 이번엔 공을 던지는 "🎯 패스"와 "색(Sack)"을 배워볼게요! 대장(쿼터백)이 공을 잡고 너무 오래(3~4초 이상) 망설이면 상대 수비수에게 덮쳐져서 뒤로 밀리는 "색(Sack)"을 당해요. 아래 버튼을 눌러 수비가 덮치기 전에 패스해 보세요!', 'Step 2 Watch Demo: Let us learn about Passing and "Sacks"! If the Quarterback holds the ball too long without throwing, defenders tackle him behind the line (a Sack). Tap below to pass before the rush arrives!'),
            hint: M('가운데 비어 있는 든든한 동료(TE, +12야드)에게 패스하세요!', 'Pass to your wide-open Tight End (TE) in the middle for +12 yards!'),
            opts: [
              O('✨ [따라 하기] 🎯 수비가 덮치기 전에 패스하기!', '✨ [Guided] 🎯 Throw Pass Before Defenders Arrive!', '가운데 빈 동료에게 빠르게 던져요!', 'Throw quickly to the open receiver!', {
                ok: 1, rec: 1, sfx: 'hut',
                then: [{ tap: recv(1, 12), say: TAPPASS }]
              })
            ]
          },
          {
            say: M('잠깐! 만약 쿼터백이 공을 안 던지고 5초 동안 우물쭈물 망설이면 무슨 일(색, Sack)이 벌어지는지 비교해 볼까요?', 'Wait! What happens if the Quarterback hesitates for 5 seconds instead of getting the ball out?'),
            hint: M('빠르게 달리기(런)로 빈틈을 찌르면 색(Sack) 걱정 없이 전진해요!', 'Handing off for a quick Run avoids the pass rush!'),
            opts: [
              O('✅ 수비가 몰려올 땐 안전하게 달리기(런)! (+5야드)', '✅ Beat the Rush with a Quick Run! (+5 yds)', '재빠르게 공을 건네주어 빈틈으로 달려요!', 'Hand off quickly and burst through the gap!', {
                ok: 1, rec: 1, sfx: 'hut',
                then: [{ tap: lanes(2, 5), say: TAPRUN }]
              }),
              O('🚨 5초 동안 안 던지고 가만히 서 있기 (색 Sack 실험)', '🚨 Hold the Ball for 5 Seconds (See what a Sack is)', '쿼터백이 잡히면 왜 손해인지 직접 구경해 볼까요?', 'See what happens when the QB gets Sacked!', {
                bad: M('💥 쾅!! 공을 너무 오래 쥐고 있다가 수비수에게 잡혀서 뒤로 밀리는 "색(Sack)"을 당했어요! (원래는 7야드 뒤로 밀리고 기회도 1번 날아가요! 이제 왼쪽 초록 추천 버튼을 눌러보세요 😊)', '💥 BOOM!! Holding the ball too long causes a SACK (losing yards and a down)! Now tap the green choice on the left 😊'),
                noHeartLoss: 1
              })
            ]
          },
          {
            say: M('이제 "2nd & 5 (2번째 기회, 노란 선까지 5야드 남음)"예요! 빈 동료에게 정확하게 패스를 던져 노란 선을 넘어보세요!', 'Now it is "2nd & 5" (5 yards to the Yellow Line)! Throw a pass to the open receiver to earn a First Down!'),
            hint: M('아래쪽 초록색 빈 동료(WR2, +11야드)를 고르세요!', 'Pick the open green receiver at the bottom (WR2, +11 yds)!'),
            opts: [
              O('🎯 빈 동료에게 패스 던지기 (+11야드)', '🎯 Pass to the Open Receiver (+11 yds)', '노란 선을 훌쩍 넘어 퍼스트다운!', 'Cross the Yellow Line for a First Down!', {
                ok: 1, rec: 1, sfx: 'hut',
                then: [{ tap: recv(2, 11), say: TAPPASS }]
              }),
              O('🏃 빈틈으로 달리기 (+7야드)', '🏃 Run Through the Open Gap (+7 yds)', '달리기로도 노란 선을 넘을 수 있어요!', 'Run for the First Down!', {
                ok: 1, rec: 1, sfx: 'hut',
                then: [{ tap: lanes(0, 7), say: TAPRUN }]
              })
            ]
          }
        ]
      };
    }
  };
  SCRIPTS[3] = function () {
    return {
      S: { los: 22, fd: 31, down: 4 },
      steps: [
        {
          guide: 1,
          say: M('3단계 따라 하기 · 상황 1: 지금 3번이나 공격했는데 노란 선까지 아직 9야드나 남은 "4th & 9 (마지막 4번째 기회)"이고, 위치는 우리 골대 바로 앞(우리 땅 22야드)이에요! 만약 여기서 억지로 공격하다 실패하면 바로 이 자리에서 상대에게 공을 뺏겨 실점해요! 어떻게 해야 안전할까요?', 'Step 3 Guided · Case 1: It is "4th & 9" (last chance, 9 yards to go) deep in your own territory (OWN 22)! If you fail here, the opponent gets the ball right in front of your goal! What is the smart play?'),
          hint: M('우리 땅 깊숙한 곳에서는 발로 멀리 뻥 차서(펀트, Punt) 상대가 저 멀리서 시작하게 만들어요!', 'Deep in your own half, kick a Punt far downfield so the opponent starts way back!'),
          opts: [
            O('✨ 🦵 펀트 (발로 멀리 뻥 차서 넘기기!)', '✨ 🦵 Punt (Kick the Ball Deep!)', '공은 넘겨주지만 상대를 저 멀리 밀어내요!', 'Give up the ball safely and pin the opponent far back!', {
              ok: 1, rec: 1, sfx: 'kick',
              msg: M('🦵 뻥—! 45야드 펀트 성공! 상대가 우리 골대 코앞 대신 저 멀리 자기 땅에서 시작하게 만들었어요! 👍', '🦵 BOOM! 45-yard Punt! Instead of taking over near your goal, the opponent starts far back! 👍'),
              fx: function (S) { S.los = 78; S.fd = 83; S.down = 4; }
            }),
            O('🚨 무작정 패스 강행하기 (실험)', '🚨 Go for It Anyway (See why it is risky)', '실패하면 왜 큰일 나는지 볼까요?', 'See why failing here is disastrous!', {
              bad: M('😱 앗! 9야드를 못 넘어서 우리 골대 22야드 코앞에서 상대에게 공을 그대로 뺏겼어요! 이래서 4번째에는 멀리 차는(펀트) 거랍니다! (하트는 안 깎여요 😊)', '😱 Failing on 4th & 9 turns the ball over right at your own 22! That is why teams Punt! (No heart lost 😊)'),
              noHeartLoss: 1
            })
          ]
        },
        {
          say: M('상황 2: 이번엔 반대로 상대 골대 근처(상대 22야드 앞)까지 왔는데 "4th & 5 (4번째 기회, 5야드 남음)"가 되었어요! 상대 노란 Y자 골대 기둥이 바로 눈앞이에요! 빈손으로 돌아가지 않으려면 무엇을 할까요?', 'Case 2: Now you are close to the opponent’s goal (OPP 22) facing "4th & 5"! The yellow uprights are right in front of you! How do you come away with points?'),
          hint: M('상대 골대가 가까울 땐 기둥 사이로 차 넣어서 안전하게 3점(필드골)을 챙겨요!', 'When close to the opponent’s uprights, kick a Field Goal for 3 points!'),
          opts: [
            O('🥅 필드골 차서 +3점 챙기기! (Field Goal)', '🥅 Kick a Field Goal for +3 Points!', '노란 Y자 골대 기둥 사이로 차 넣어요!', 'Kick it through the yellow uprights for 3 points!', {
              ok: 1, rec: 1,
              then: [{
                timing: 1,
                say: M('🥅 필드골 찬스! 아래 넓은 초록색 구간에 노란 바가 왔을 때 [🦵 슛! KICK!] 버튼을 누르세요!', '🥅 Field Goal Attempt! Tap [🦵 KICK!] when the marker is in the wide green zone!'),
                msg: M('🥅 슛 골인!! 노란 기둥 사이를 통과해 필드골 +3점을 챙겼어요! (3 : 0)', '🥅 IT IS GOOD!! Right through the uprights for +3 points! (3–0)'),
                fx: function (S) { S.score[0] += 3; S.los = 50; S.fd = 51; S.down = 4; }
              }]
            }),
            O('🦵 여기서도 멀리 차버리기 (펀트)', '🦵 Punt from here too', '점수를 낼 수 있는데 아까워요!', 'Wastes an easy scoring chance!', {
              bad: M('상대 골대 코앞인데 그냥 넘겨주면 아깝죠! [🥅 필드골 +3점] 버튼을 눌러 점수를 챙기세요 😊', 'You are right in front of the goalposts! Pick [🥅 Field Goal] to score 3 points 😊'),
              noHeartLoss: 1
            })
          ]
        },
        {
          say: M('상황 3: 경기장 한가운데(50야드)에서 "4th & 1"이 되었어요! 노란 선까지 단 1야드(한 걸음, 90cm)밖에 안 남았어요! 이럴 때는 감독들이 과감하게 4번째 공격을 강행(Go for It)해요! 힘차게 1야드를 밀고 나가 볼까요?', 'Case 3: It is "4th & 1" at midfield! Only ONE yard (one step) left to cross the Yellow Line! When it is just 1 yard, coaches boldly "Go for It"!'),
          hint: M('[💪 1야드 강행 돌파!] 버튼을 눌러 노란 선을 넘으세요!', 'Tap [💪 Go for It · Power Run!] to push across the Yellow Line!'),
          opts: [
            O('💪 1야드 강행 돌파! (Go for It · 파워 런)', '💪 Go for It! (1-Yard Power Run)', '단 한 걸음! 몸으로 밀어붙여 퍼스트다운!', 'Push forward 1 yard for the First Down!', {
              ok: 1, rec: 1, sfx: 'hut',
              then: [{ tap: lanes(1, 3), say: TAPRUN }]
            })
          ]
        }
      ]
    };
  };

  SCRIPTS[4] = function () {
    return {
      S: { los: 93, fd: 100, down: 1, score: [16, 24] },
      steps: [
        {
          guide: 1,
          say: M('4단계 따라 하기(점수 계산의 비밀): 지금 점수는 16 : 24로 우리가 8점 지고 있고, 상대 엔드존 코앞 7야드("1st & Goal")에 왔어요! 먼저 엔드존 안의 동료에게 패스해 "터치다운(+6점)"을 만들어 보세요!', 'Step 4 Watch Demo (Scoring Secrets): We trail 16–24 (down by 8 points) at "1st & Goal" (7 yards from the End Zone)! First, pass into the End Zone for a 6-point Touchdown!'),
          hint: M('[🎯 엔드존 터치다운 패스!] 버튼을 누른 뒤 초록색 빈 동료를 고르세요!', 'Tap [🎯 End Zone Pass!] then pick the open green receiver!'),
          opts: [
            O('✨ 🎯 엔드존으로 터치다운 패스 던지기! (+6점)', '✨ 🎯 Throw Touchdown Pass into End Zone! (+6 pts)', '엔드존 안에서 공을 잡으면 터치다운 6점!', 'Catching the ball in the End Zone scores 6 points!', {
              ok: 1, rec: 1, sfx: 'hut',
              then: [{ tap: recv(1, 8), say: TAPPASS }]
            })
          ]
        },
        {
          say: M('🙌 터치다운(+6점) 성공!! 점수가 16점에서 22점이 되어 이제 "22 : 24 (2점 차이)"가 되었어요! 터치다운 직후엔 보너스 기회를 딱 1번 주는데, ① 안전하게 골대에 차 넣으면 +1점(23:24), ② 골대 2야드 앞에서 한 번 더 뚫고 들어가면 +2점(24:24 동점!)을 받아요. 무엇을 고를까요?', '🙌 TOUCHDOWN (+6 pts)!! Now the score is 22–24 (we trail by 2)! You get ONE bonus try: ① Kick for +1 point (23–24), or ② Run/Pass from the 2-yard line for +2 points (24–24 tie!). Which do you choose?'),
          hint: M('2점 뒤지고 있으니 [+2점 보너스 공격(2점 컨버전)]을 골라야 24:24 동점이 돼요!', 'Trailing by 2 points, pick the [+2 Bonus Play (2-Pt Conversion)] to tie it 24–24!'),
          opts: [
            O('✌️ 2점 보너스 공격! (2-Pt Conversion · +2점)', '✌️ 2-Point Conversion Play! (+2 pts)', '6점 + 2점 = 총 8점! 단숨에 24:24 동점 만들기!', '6 + 2 = 8 points total! Tie the game at 24–24!', {
              ok: 1, rec: 1, sfx: 'hut',
              fx: function (S) { S.los = 98; S.fd = 100; },
              then: [{ tap: lanes(0, 3), say: TAPRUN, conv: 1 }]
            }),
            O('🦵 1점 보너스 킥 (PAT Kick · +1점)', '🦵 1-Point Bonus Kick (+1 pt)', '성공해도 23 : 24로 1점 모자라요!', 'Makes it 23–24—still down by 1 point!', {
              bad: M('아하! 1점 킥을 차면 23 : 24가 되어 아직 1점 지고 있어요! 2점 차이를 한 번에 따라잡으려면 왼쪽 [✌️ 2점 보너스 공격 (+2점)]을 눌러보세요 😊', 'A 1-point kick leaves you down 23–24! To tie the game, pick the [✌️ 2-Point Conversion (+2)] on the left 😊'),
              noHeartLoss: 1
            })
          ]
        }
      ]
    };
  };

  SCRIPTS[5] = function () {
    return {
      S: { los: 45, fd: 55, down: 1, clock: 75, score: [20, 24], tos: 1 },
      steps: [
        {
          guide: 1,
          say: M('5단계 따라 하기(시계 멈추기 마법): 경기 종료 1분 15초 전, 20 : 24(4점 차이)로 지고 있어요! 3점짜리 필드골로는 못 이기고 꼭 터치다운(6점)이 필요해요! 미식축구는 경기장 한가운데서 잡히면 시계가 계속 흘러가요. 시계를 멈추면서 전진하려면 어디로 패스해야 할까요?', 'Step 5 Watch Demo (Clock Management): 1:15 left, trailing 20–24! Being tackled in the middle of the field keeps the clock running. Where should you throw to advance AND stop the clock?'),
          hint: M('공을 잡고 경기장 옆선(사이드라인) 밖으로 나가면 시계가 즉시 딱 멈춰요!', 'Stepping Out of Bounds over the sideline stops the game clock immediately!'),
          opts: [
            O('✨ ➡️ 옆선(사이드라인) 밖으로 나가는 패스! (+15야드 & 시계 정지)', '✨ ➡️ Sideline Pass Out of Bounds! (+15 yds & Stops Clock)', '공을 잡고 선 밖으로 나가서 시계를 딱 멈춰요!', 'Catch and step out of bounds to stop the clock!', {
              ok: 1, rec: 1, sfx: 'throw', sec: 6, g: 15,
              msg: M('⏸️ 나이스! 15야드를 전진하고 옆선(사이드라인) 밖으로 나가서 시계가 1:09에 딱 멈췄어요!', '⏸️ Nice! Gained 15 yards and stepped Out of Bounds—clock stopped at 1:09!')
            }),
            O('🚨 경기장 한가운데로 패스하기 (실험)', '🚨 Throw to the Middle of the Field (Test)', '가운데서 잡히면 시계가 어떻게 될까요?', 'See what happens to the clock when tackled inbounds!', {
              bad: M('⏳ 앗! 경기장 한가운데서 태클당하면 다음 줄을 설 때까지 30초나 시계가 그냥 흘러가 버려요! 시간이 없을 땐 왼쪽 [➡️ 옆선(사이드라인) 패스]를 고르세요 😊', '⏳ Tackled inbounds—the clock keeps burning! Pick the [➡️ Sideline Pass] on the left to stop the clock 😊'),
              noHeartLoss: 1
            })
          ]
        },
        {
          say: M('시계를 멈추는 두 번째 마법: 이번엔 방금 플레이가 경기장 안에서 끝나서 시계가 째깍째깍 흐르고 있어요! 작전회의(허들) 할 시간도 없을 때, 대장(쿼터백)이 공을 받자마자 바닥에 쾅! 찍어서 시계를 즉시 멈추는 기술은 무엇일까요?', 'Clock Magic #2: The clock is ticking down! What is the special move where the Quarterback immediately slams the ball to the ground to stop the clock?'),
          hint: M('기회(다운) 1번을 쓰는 대신 시계를 1초 만에 멈추는 "스파이크(Spike)"예요!', 'It is called a "Spike"—sacrificing 1 down to stop the clock instantly!'),
          opts: [
            O('⬇️ 스파이크! (공을 바닥에 찍어 시계 즉시 멈추기)', '⬇️ QB Spike! (Slam Ball Down to Stop Clock)', '기회 1번을 쓰는 대신 시계를 즉시 멈춰요!', 'Uses 1 down to stop the clock right now!', {
              ok: 1, rec: 1, sfx: 'whistle', sec: 3, g: 0, spike: 1,
              msg: M('⏸️ 스파이크 성공! 1번째 기회를 하나 썼지만(2nd & 10), 소중한 시간을 지켰어요!', '⏸️ Spike! Now it is 2nd & 10 with the clock stopped!')
            })
          ]
        },
        {
          say: M('시계를 멈추는 세 번째 마법: 이번엔 25야드 롱패스로 상대 골대 코앞(상대 15야드, 레드존!)까지 단숨에 갔는데 선수가 경기장 안에서 넘어져 시계가 흐르고 있어요! 우리에게 남은 마지막 "작전타임(타임아웃)" 1개를 써서 시계를 멈춰볼까요?', 'Clock Magic #3: A 25-yard pass got us inside the Red Zone (OPP 15), but the clock is running! Use your final Timeout to stop the clock!'),
          hint: M('[⏸️ 마지막 타임아웃 쓰기!] 버튼을 누르면 25야드 전진 후 시계가 딱 멈춰요!', 'Tap [⏸️ Call Final Timeout!] to gain 25 yards and freeze the clock!'),
          opts: [
            O('⏸️ 25야드 전진 후 마지막 타임아웃(작전타임) 부르기!', '⏸️ Gain 25 Yards & Call Final Timeout!', '레드존 진입 + 시계 즉시 정지!', 'Advance into the Red Zone and stop the clock!', {
              ok: 1, rec: 1, sfx: 'whistle', sec: 8, g: 25, to: 1,
              msg: M('⏸️ 타임아웃! 상대 골대 15야드 코앞(레드존)에서 시계를 멈췄어요! 이제 마지막 한 방이면 역전입니다!', '⏸️ Timeout called at the opponent 15-yard line! One final play for the win!')
            })
          ]
        },
        {
          say: M('🔥 종료 직전 마지막 플레이! 상대 엔드존까지 15야드! 엔드존 안으로 달려 들어간 빈 동료에게 역전 터치다운 패스를 던지세요!', '🔥 Final Play of the Game! 15 yards to the End Zone! Throw the game-winning Touchdown pass!'),
          hint: M('[🎯 역전 엔드존 터치다운 패스!] 버튼을 누른 뒤 초록색 빈 동료(WR1)를 고르세요!', 'Tap [🎯 Game-Winning End Zone Pass!] then pick the open green receiver (WR1)!'),
          opts: [
            O('🎯 역전 엔드존 터치다운 패스! (Winning TD Pass)', '🎯 Game-Winning End Zone Pass!', '6점을 추가해 26 : 24로 대역전승!', 'Score 6 points to win 26–24!', {
              ok: 1, rec: 1, sfx: 'hut',
              then: [{ tap: recv(0, 20), say: TAPPASS }]
            })
          ]
        }
      ]
    };
  };
  /* ---------- Stage engine ---------- */
  var G = null, raf = 0, tmr = 0;
  function stopAll() { cancelAnimationFrame(raf); clearInterval(tmr); }

  function stage(n) {
    stopAll();
    var sc = SCRIPTS[n](), S = sc.S;
    S.score = S.score || [0, 0];
    S.togo = S.fd - S.los;
    S.hearts = 3;
    S.fdc = 0;
    var allSteps = [{ tut: 1 }].concat(sc.steps.slice());
    G = { n: n, st: D.stages[n - 1], S: S, steps: allSteps, cur: null, msg: null, last: null };
    next();
  }

  function next() {
    G.cur = G.steps.shift();
    if (!G.cur) return win();
    draw();
  }

  function spot(S) {
    var y = Math.round(S.los);
    return y >= 100 ? 'TD' : y > 50 ? k('상대 ', 'OPP ') + (100 - y) + k('야드', '') : y === 50 ? '50' : k('우리 ', 'OWN ') + y + k('야드', '');
  }

  function downTxt(S) {
    var o = ['1st', '2nd', '3rd', '4th'][Math.min(S.down, 4) - 1];
    var tg = Math.max(1, Math.round(S.fd - S.los));
    return o + ' & ' + (S.fd >= 100 ? 'Goal' : tg);
  }

  function downKoreanExplain(S) {
    if (L !== 'ko') return '';
    var tg = Math.max(1, Math.round(S.fd - S.los));
    return '(' + Math.min(S.down, 4) + '번째 기회 · ' + (S.fd >= 100 ? '골라인까지 ' + tg + '야드' : '노란 선까지 ' + tg + '야드') + ')';
  }

  function clk(S) {
    var c = S.clock == null ? 900 : Math.max(0, S.clock);
    return 'Q4 ' + Math.floor(c / 60) + ':' + ('0' + c % 60).slice(-2);
  }

  function draw() {
    var S = G.S, c = G.cur, st = G.st;
    var h = '<div class="goal-bar">' + back() + '🎯 ' + esc(t(st.goal)) + '</div>' +
      (st.easyRule ? '<div class="easy-rule-box"><div class="er-label">💡 ' + k('5초 한줄 핵심 규칙', '5-Second Key Rule') + '</div><div class="er-text">' + esc(t(st.easyRule)) + '</div></div>' : '') +
      '<div class="scorebug"><span class="sb-teams"><span class="sb-team">🔵 ' + k('우리 ', 'HOME ') + S.score[0] + '</span><span class="sb-team">🔴 ' + k('상대 ', 'AWAY ') + S.score[1] + '</span></span>' +
      '<span class="sb-down">' + downTxt(S) + ' ' + downKoreanExplain(S) + '</span><span class="sb-spot">📍 ' + spot(S) + (S.los >= 80 && S.los < 100 ? ' 🚨레드존' : '') + '</span><span class="sb-clock">' + clk(S) + '</span>' +
      '<span class="hearts">' + '❤️'.repeat(S.hearts) + '🤍'.repeat(3 - S.hearts) + '</span></div>' +
      '<div class="field-wrap"><canvas id="fieldCanvas"></canvas></div>';

    if (c && c.tut) {
      h += '<div class="card-box" style="border-color:var(--gold);background:linear-gradient(180deg,#153d26,#0c2617)">' +
        '<span class="badge-guide">📘 ' + k('시작 전 30초 핵심 튜토리얼', '30-Second Stage Tutorial') + '</span>' +
        '<h3 style="margin:8px 0;color:var(--gold);font-size:19px">' + st.icon + ' ' + esc(t(st.title)) + '</h3>' +
        '<div style="display:grid;gap:8px;margin:10px 0">' +
        '<div style="background:rgba(0,0,0,0.35);border-left:4px solid var(--blue);padding:10px 12px;border-radius:8px">' +
        '<b style="color:var(--blue)">📌 ' + k('이번 단계에서 무엇을 배우나요?', 'What will I learn?') + '</b><p style="margin:4px 0 0">' + esc(t(st.tutWhat || st.sub)) + '</p></div>' +
        '<div style="background:rgba(0,0,0,0.35);border-left:4px solid var(--gold);padding:10px 12px;border-radius:8px">' +
        '<b style="color:var(--gold)">❓ ' + k('왜 이런 규칙이 생겼나요?', 'Why does this rule exist?') + '</b><p style="margin:4px 0 0">' + esc(t(st.tutWhy || st.why)) + '</p></div>' +
        '<div style="background:rgba(0,0,0,0.35);border-left:4px solid var(--ok);padding:10px 12px;border-radius:8px">' +
        '<b style="color:var(--ok)">🎮 ' + k('지금 화면에서 어떻게 플레이하나요?', 'How do I play?') + '</b><p style="margin:4px 0 0">' + esc(t(st.tutHow || st.goal)) + '</p></div>' +
        '</div>' +
        '<button class="btn primary wide" id="tutStartBtn">✅ ' + k('이해했어! 따라 하기로 직접 해보기 ▶', 'Got It! Start Guided Play ▶') + '</button></div>';
      app.innerHTML = h;
      paint();
      document.getElementById('tutStartBtn').onclick = function () { sfx('tap'); next(); };
      return;
    }

    if (G.msg) h += '<div class="coach-box" style="border-left-color:' + (G.msg.ok ? 'var(--ok)' : 'var(--red)') + '"><b>' + esc(G.msg.t) + '</b></div>';

    h += '<div class="coach-box"><div class="coach-title">' + (c.guide ? '<span class="badge-guide">✨ ' + k('따라 하기 (눈으로 먼저 보기)', 'Guided Demo') + '</span> ' : '') + k('🧢 친절한 코치님 설명', '🧢 Coach') + '</div>' + esc(t(c.say)) +
      (c.hint ? '<div style="margin-top:8px;padding:8px 10px;background:rgba(255,213,74,0.12);border-radius:8px;color:#ffe066;font-size:15.5px">💡 <b>' + k('힌트', 'Hint') + ':</b> ' + esc(t(c.hint)) + '</div>' : '') + '</div>';

    if (c.opts) {
      h += '<div class="play-grid">';
      c.opts.forEach(function (o, i) {
        h += '<button class="btn play-btn' + (o.rec ? ' recommend primary' : '') + '" data-i="' + i + '">' +
          (o.rec ? '<span class="badge-guide">✨ ' + k('추천 선택', 'Recommended') + '</span>' : '') +
          '<span class="p-title">' + esc(t(o.l)) + '</span><span class="p-desc">' + esc(t(o.d)) + '</span></button>';
      });
      h += '</div>';
    }

    if (c.tap) {
      h += '<div style="margin:8px 0 6px;font-weight:700;color:var(--gold)">👇 ' + k('잔디밭 위 초록색 원을 탭하거나, 아래 버튼을 눌러 선택하세요!', 'Tap a green circle on the field OR click a button below!') + '</div>';
      h += '<div class="play-grid">';
      c.tap.forEach(function (tg, idx) {
        h += '<button class="btn play-btn' + (tg.ok ? ' recommend primary' : '') + '" data-tap="' + idx + '">' +
          '<span class="p-title">' + esc(t(tg.btnTitle || { ko: tg.n, en: tg.n })) + '</span>' +
          (tg.btnDesc ? '<span class="p-desc">' + esc(t(tg.btnDesc)) + '</span>' : '') +
          '</button>';
      });
      h += '</div>';
    }

    if (c.timing) {
      h += '<div style="position:relative;height:34px;background:#1e293b;border:2px solid var(--gold);border-radius:10px;margin:8px 0;overflow:hidden">' +
        '<div style="position:absolute;left:22%;width:56%;height:100%;background:var(--ok);opacity:.55"></div>' +
        '<div id="kickMark" style="position:absolute;left:50%;width:8px;height:100%;background:var(--gold)"></div></div>' +
        '<button class="btn primary wide" id="kickBtn">🦵 ' + k('초록 구간에서 슛! (KICK! · +3점 필드골)', 'KICK FIELD GOAL! (+3 pts)') + '</button>';
    }

    app.innerHTML = h;
    app.querySelectorAll('.play-btn[data-i]').forEach(function (b) { b.onclick = function () { choose(c.opts[+b.dataset.i]); }; });
    app.querySelectorAll('.play-btn[data-tap]').forEach(function (b) { b.onclick = function () { pickTap(c.tap[+b.dataset.tap]); }; });
    paint();
    var cv = document.getElementById('fieldCanvas');
    if (cv) cv.onclick = function (e) { tapField(e, cv); };
    if (c.timing) startKick();
  }

  function X(W, y) { return (y + 10) / 120 * W; }

  function paint() {
    var cv = document.getElementById('fieldCanvas'); if (!cv) return;
    var r = window.devicePixelRatio || 1, W = cv.clientWidth, H = cv.clientHeight;
    cv.width = W * r; cv.height = H * r;
    var g = cv.getContext('2d'); g.scale(r, r);
    var S = G.S, c = G.cur || {};

    for (var i = 0; i < 12; i++) {
      g.fillStyle = i % 2 ? '#14532d' : '#166534';
      g.fillRect(X(W, i * 10 - 10), 0, W / 12 + 1, H);
    }
    g.fillStyle = '#1e3a8a'; g.fillRect(0, 0, X(W, 0), H);
    g.fillStyle = '#7f1d1d'; g.fillRect(X(W, 100), 0, W - X(W, 100), H);

    g.strokeStyle = 'rgba(255,255,255,.65)'; g.lineWidth = 1.5; g.fillStyle = '#fff'; g.font = '600 11px sans-serif'; g.textAlign = 'center';
    for (var y = 0; y <= 100; y += 10) {
      g.beginPath(); g.moveTo(X(W, y), 0); g.lineTo(X(W, y), H); g.stroke();
      if (y && y < 100) g.fillText(String(y > 50 ? 100 - y : y), X(W, y), H - 8);
    }
    g.save();
    g.font = '700 13px sans-serif';
    g.fillStyle = '#ffd54a';
    g.fillText(k('🙌 상대 엔드존(터치다운!)', '🙌 END ZONE'), X(W, 105), 20);
    g.fillStyle = '#93c5fd';
    g.fillText(k('🏠 우리 진영', '🏠 HOME'), X(W, -5), 20);
    g.restore();

    function vline(yd, col, label) {
      g.strokeStyle = col; g.lineWidth = 4;
      g.beginPath(); g.moveTo(X(W, yd), 0); g.lineTo(X(W, yd), H); g.stroke();
      if (label) {
        g.fillStyle = col;
        g.font = '700 11px sans-serif';
        g.fillText(label, X(W, yd), 34);
      }
    }
    vline(S.los, '#38b6ff', k('🔵 출발선', '🔵 LOS'));
    if (S.fd < 100) vline(S.fd, '#ffd54a', k('🟡 목표선(10야드)', '🟡 1st DOWN'));

    function dot(yd, fy, col, lab) {
      g.fillStyle = col; g.beginPath(); g.arc(X(W, yd), fy * H, 10, 0, 7); g.fill();
      g.strokeStyle = '#fff'; g.lineWidth = 2; g.stroke();
      if (lab) { g.fillStyle = '#fff'; g.font = '700 10px sans-serif'; g.fillText(lab, X(W, yd), fy * H + 23); }
    }
    [0.35, 0.45, 0.55, 0.65].forEach(function (f) { dot(S.los - 1, f, '#2563eb'); dot(S.los + 2, f, '#dc2626'); });
    dot(S.los - 5, 0.5, '#38bdf8', k('쿼터백(대장)', 'QB'));

    if (G.last) {
      g.strokeStyle = '#ffd54a'; g.setLineDash([5, 4]); g.lineWidth = 3;
      g.beginPath(); g.moveTo(X(W, G.last[0]), H / 2); g.lineTo(X(W, G.last[1]), G.last[2] * H); g.stroke();
      g.setLineDash([]);
    }
    g.fillStyle = '#a16207'; g.beginPath(); g.ellipse(X(W, S.los), H / 2, 8, 5, 0, 0, 7); g.fill();

    if (c && c.tap) {
      c.tap.forEach(function (tg) {
        var x = X(W, S.los + tg.x), yy = tg.y * H; tg.px = x; tg.py = yy;
        g.fillStyle = tg.ok ? 'rgba(85,230,140,0.28)' : 'rgba(255,94,87,0.22)';
        g.beginPath(); g.arc(x, yy, 22, 0, 7); g.fill();
        g.lineWidth = 3.5; g.strokeStyle = tg.ok ? '#55e68c' : '#ff5e57'; g.stroke();
        g.fillStyle = '#fff'; g.font = '700 12px sans-serif';
        g.fillText(tg.n + (tg.ok ? ' 🟢' : ' ❌'), x, yy + 4);
      });
    }
  }

  function say(txt, ok) { G.msg = { t: txt, ok: ok }; }

  function miss(m, noHeartLoss) {
    stopAll();
    var S = G.S;
    if (!noHeartLoss) S.hearts--;
    sfx('bad');
    var txt = t(m);
    if (S.hearts <= 0) { S.hearts = 3; txt += k(' · 하트 다시 충전! 계속 해봐요 💪', ' · Hearts refilled! Keep going 💪'); }
    say(txt, false);
    draw();
  }

  function gain(g, conv) {
    var S = G.S, from = S.los, prevDown = S.down;
    S.los = Math.min(100, S.los + g);
    if (S.los >= 100) {
      S.score[0] += conv ? 2 : 6;
      sfx('touchdown');
      say(conv
        ? k('✌️ 2점 보너스 공격(2점 컨버전) 대성공!! (+2점 추가 → ', '✌️ 2-Point Conversion GOOD!! (+2 pts → ') + S.score[0] + ' : ' + S.score[1] + ')'
        : k('🙌 터치다운 성공!! 상대 엔드존에 들어가 +6점을 얻었어요! (', '🙌 TOUCHDOWN!! +6 points! (') + S.score[0] + ' : ' + S.score[1] + ')', true);
      S.los = 97; S.fd = 100; S.down = 1;
      return from;
    }
    if (S.los >= S.fd) {
      S.fdc++; S.down = 1; S.fd = Math.min(100, S.los + 10);
      sfx('firstdown');
      say(k('🟡 퍼스트다운(FIRST DOWN) 달성!! (+' + g + '야드 전진해 노란 선을 넘어서 다시 새로운 1번째 기회 "1st & 10"으로 리셋되었어요!)', '🟡 FIRST DOWN!! (+' + g + ' yards across the Yellow Line—reset to a brand-new 1st & 10!)'), true);
    } else {
      S.down = Math.min(4, S.down + 1);
      var rem = Math.max(1, Math.round(S.fd - S.los));
      say(k('👏 방금 ' + prevDown + '번째 기회에 +' + g + '야드를 전진했어요! 노란 선까지 이제 ' + rem + '야드가 남아서 전광판이 "' + downTxt(S) + '"로 바뀌었어요!', '👏 Gained +' + g + ' yards! With ' + rem + ' yards left to the Yellow Line, the scoreboard is now "' + downTxt(S) + '"!'), true);
    }
    return from;
  }

  function choose(o) {
    if (o.bad) return miss(o.bad, o.noHeartLoss);
    stopAll();
    sfx(o.sfx || 'tap');
    G.msg = null; G.last = null;
    var S = G.S;
    if (o.fx) o.fx(S);
    if (o.sec) S.clock -= o.sec;
    if (o.spike) S.down++;
    if (o.g) gain(o.g);
    if (o.msg) say(t(o.msg), true);
    if (o.then) G.steps = o.then.slice().concat(G.steps);
    next();
  }

  function pickTap(hit) {
    if (!hit) return;
    var c = G.cur;
    if (!hit.ok) return miss(M('앗, 그쪽은 빨간 상대 수비수가 막고 있어요! 초록색 추천 길/동료를 눌러보세요 😊', 'Oops, a defender is covering that spot! Pick the green open target 😊'), true);
    stopAll();
    sfx(hit.x > 4 ? 'throw' : 'hut');
    var from = gain(hit.g, c && c.conv);
    G.last = [from, from + hit.x, hit.y];
    next();
  }

  function tapField(e, cv) {
    var c = G.cur; if (!c || !c.tap) return;
    var r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, hit = null;
    c.tap.forEach(function (tg) { if (Math.hypot(tg.px - x, tg.py - y) < 36) hit = tg; });
    if (hit) pickTap(hit);
  }

  function startKick() {
    var t0 = performance.now(), mk = document.getElementById('kickMark'), pos = 0.5;
    (function loop() {
      pos = (Math.sin((performance.now() - t0) / 680) + 1) / 2;
      if (mk) mk.style.left = (pos * 96) + '%';
      raf = requestAnimationFrame(loop);
    })();
    document.getElementById('kickBtn').onclick = function () {
      var c = G.cur;
      if (pos * 96 >= 18 && pos * 96 <= 80) {
        stopAll(); sfx('kick'); G.last = null; c.fx(G.S); say(t(c.msg), true); next();
      } else {
        miss(M('아깝게 골대 옆으로 빗나갔어요! 노란 바가 가운데 초록색 구간에 들어왔을 때 다시 눌러보세요 😊', 'Just wide! Tap KICK when the yellow marker is inside the wide green zone 😊'), true);
      }
    };
  }

  function win() {
    stopAll();
    done[G.n] = 1;
    localStorage.setItem('fb_done', JSON.stringify(done));
    sfx('touchdown');
    var S = G.S, nx = G.n < 5;
    app.innerHTML = '<div class="card-box"><h2 style="color:var(--gold)">🏆 ' + esc(t(G.st.title)) + ' ' + k('클리어!', 'Clear!') + '</h2>' +
      (G.msg ? '<p><b>' + esc(G.msg.t) + '</b></p>' : '') +
      '<p>' + k('최종 스코어 ', 'Final Score ') + S.score[0] + ' : ' + S.score[1] + ' · ' + '❤️'.repeat(S.hearts) + '</p>' +
      '<div class="coach-box"><div class="coach-title">💡 ' + k('이번 단계 핵심 정리', 'Key Takeaway') + '</div>' + esc(t(G.st.why)) + '</div>' +
      (nx ? '<button class="btn primary wide" onclick="location.hash=\'s' + (G.n + 1) + '\'">▶ ' + k('다음 스테이지로 이동', 'Next Stage') + '</button>' : '') +
      '<button class="btn wide" onclick="location.hash=\'\'">🏠 ' + k('홈 목록으로', 'Back to Home') + '</button></div>';
  }

  window.FB = {
    primerNext: function (d) {
      sfx('tap');
      primerIdx = Math.max(0, Math.min(D.primer.slides.length - 1, primerIdx + d));
      if (location.hash === '#primer') primerView(); else home();
    },
    primerGo: function (i) {
      sfx('tap');
      primerIdx = i;
      if (location.hash === '#primer') primerView(); else home();
    }
  };

  window.addEventListener('resize', function () { if (G && document.getElementById('fieldCanvas')) paint(); });
  muteBtn.textContent = A && A.isMuted && A.isMuted() ? '🔇' : '🔊';
  window.__nadooG = function () { return G; };
  route();
})();
