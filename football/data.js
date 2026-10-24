/* Nadoo Touchdown 101 — Bilingual Data (Stages, Scorebug Decoder, Positions/Rules Dex, Quiz) */
'use strict';
var FB_DATA = {
  stages: [
    {
      id: 1,
      icon: '📏',
      title: { ko: 'Stage 1 · 4번 안에 10야드! (퍼스트다운의 마법)', en: 'Stage 1 · 4 Downs to Gain 10 Yards!' },
      sub: { ko: '파란 출발선에서 노란 선까지! 10야드를 전진하면 기회가 다시 1st & 10으로 리셋됩니다.', en: 'Advance 10 yards from the Blue Line to the Yellow Line to reset to 1st & 10!' },
      goal: { ko: '목표: 따라 하기(가이드)로 1st Down을 이해한 뒤, 실전 공격으로 퍼스트다운 2번을 달성하세요!', en: 'Goal: Learn 1st Down in Guided Mode, then earn 2 First Downs in live play!' },
      why: {
        ko: '미식축구의 가장 핵심 규칙은 "4번의 기회(Down) 안에 10야드를 전진하라!"입니다. 10야드만 넘으면 다시 1번째 기회(1st & 10)가 무한히 주어집니다.',
        en: 'The core rule of American football: you get 4 chances (downs) to gain 10 yards. Cross the yellow line and your downs reset to a fresh 1st & 10!'
      }
    },
    {
      id: 2,
      icon: '🏃',
      title: { ko: 'Stage 2 · 달리기(런) vs 던지기(패스)와 색(Sack)', en: 'Stage 2 · Run vs Pass, Incomplete & Sack' },
      sub: { ko: '안전하게 빈틈을 파고드는 런(Run)과 크게 전진하지만 위험이 따르는 패스(Pass)를 구분해요.', en: 'Balance safe Run plays through open gaps vs high-reward Pass routes under pressure.' },
      goal: { ko: '목표: 런 홀(빈틈) 돌파와 오픈된 리시버 패스를 조합해 상대 진영까지 전진하세요!', en: 'Goal: Combine Run gap bursts and timed Passes to open receivers before the Sack timer expires!' },
      why: {
        ko: '패스는 땅에 떨어지면 인컴플리트(Incomplete = 0야드, 시계 정지)가 되고, 쿼터백이 너무 오래 공을 쥐고 있으면 수비에게 잡혀 뒤로 밀리는 색(Sack)을 당합니다! 또한 전진 패스는 한 다운에 딱 1번, 파란 출발선 뒤에서만 던질 수 있습니다.',
        en: 'An incomplete pass gains 0 yards and stops the clock. Holding the ball too long in the pocket leads to a Sack (yardage loss)! Also, only 1 forward pass per down is allowed from behind the Line of Scrimmage.'
      }
    },
    {
      id: 3,
      icon: '🦵',
      title: { ko: 'Stage 3 · 4번째 기회(4th Down): 왜 공을 차서 넘겨줄까?', en: 'Stage 3 · 4th Down Decisions: Punt, Field Goal, or Go?' },
      sub: { ko: '초보자가 가장 궁금해하는 "왜 4번째에 공격 안 하고 공을 뻥 차버릴까?"를 3가지 상황으로 체험합니다.', en: 'Experience all 3 classic 4th-down scenarios: Punt deep, kick a Field Goal, or Go for It!' },
      goal: { ko: '목표: 4th Down 3가지 상황(자기 진영 4th&9, 적진 22야드 4th&5, 중앙 4th&1)에서 올바른 작전을 완수하세요!', en: 'Goal: Make the right call and execute in all 3 fourth-down situations!' },
      why: {
        ko: '4번째 기회(4th Down)에 10야드를 못 채우면 "바로 그 자리에서" 상대에게 공격권을 뺏깁니다! 그래서 우리 진영 깊숙한 곳에서는 펀트(Punt)로 멀리 차서 상대를 뒤로 밀어내고, 골대 근처면 필드골(3점)을 차고, 1야드 남았을 때만 강행(Go for It)합니다.',
        en: 'Failing on 4th down turns the ball over on the spot! Deep in your own territory you Punt to pin the opponent back; near the uprights you kick a 3-point Field Goal; on 4th & 1 you can Go for It.'
      }
    },
    {
      id: 4,
      icon: '🙌',
      title: { ko: 'Stage 4 · 점수 계산의 비밀 (6점 + 1점/2점 & 세이프티)', en: 'Stage 4 · Scoring Secrets: 6 Pts + 1 or 2 Conversion' },
      sub: { ko: '터치다운(6점) 후 왜 1점 킥(PAT)과 2점 공격(2-Pt) 중 하나를 고를까요? 점수 차이에 맞춰 역전해 보세요!', en: 'Score a 6-pt Touchdown, then pick PAT (+1) or 2-Pt Conversion (+2) based on the score!' },
      goal: { ko: '목표: 터치다운(6점) 성공 후, 22:24(2점 차) 상황에서 2점 컨버전으로 동점을 만드세요!', en: 'Goal: Score a Touchdown (6 pts) then trailing 22–24 convert a 2-Point play to tie it 24–24!' },
      why: {
        ko: '터치다운은 6점입니다! 직후 보너스 기회로 골대에 차 넣으면 +1점(PAT, 성공률 약 95% → 총 7점), 2야드 앞에서 한 번 더 엔드존에 들어가면 +2점(2점 컨버전 → 총 8점)을 얻습니다. 8점 뒤질 때는 6+2=8점으로 한 번에 동점을 만들 수 있어요!',
        en: 'A Touchdown is worth 6 points. Afterward, kick a PAT for +1 pt (7 total) or run/pass from the 2-yard line for +2 pts (8 total). Trailing by 8 points, 6 + 2 ties the game in one drive!'
      }
    },
    {
      id: 5,
      icon: '⏱️',
      title: { ko: 'Stage 5 · 시계 관리와 마지막 2분 역전 드라마 (2-Minute Drill)', en: 'Stage 5 · Clock Management & 2-Minute Drill' },
      sub: { ko: '4점 뒤진 종료 1분 20초 전! 필드골(3점)로는 부족합니다. 시계를 멈추며 터치다운으로 역전하세요!', en: 'Down by 4 with 1:20 left! Use sidelines, incompletions, spikes & timeouts to score a winning TD!' },
      goal: { ko: '목표: 시계 정지 규칙(사이드라인·스파이크·타임아웃)을 활용해 시간 안에 역전 터치다운을 성공하세요!', en: 'Goal: Manage the clock and score a go-ahead Touchdown before 0:00!' },
      why: {
        ko: '경기장 안(Inbounds)에서 태클당하면 시계가 계속 흐릅니다! 반면 ① 사이드라인 밖으로 나가기(Out of Bounds), ② 패스 실패(Incomplete), ③ 쿼터백이 공을 바닥에 찍는 스파이크(Spike, 1다운 소모), ④ 타임아웃(Timeout)을 쓰면 시계가 즉시 멈춥니다.',
        en: 'Being tackled inbounds keeps the game clock running! Stepping Out of Bounds, throwing an Incomplete pass, clocking the ball with a QB Spike, or calling a Timeout stops the clock immediately.'
      }
    }
  ],

  scorebugItems: [
    {
      id: 'down_dist',
      badge: '1st & 10',
      label: { ko: '다운 & 남은 거리 (Down & Distance)', en: 'Down & Distance (1st & 10)' },
      desc: {
        ko: '현재 몇 번째 기회(1st~4th Down)인지와 노란색 퍼스트다운 선까지 몇 야드가 남았는지를 뜻합니다. 예: "2nd & 4"는 2번째 기회에 4야드만 더 가면 다시 1st & 10으로 리셋된다는 뜻입니다!',
        en: 'Shows which down (1st–4th) it is and how many yards remain to reach the yellow First Down line. "2nd & 4" means 2nd try with 4 yards needed to reset back to 1st & 10.'
      }
    },
    {
      id: 'yard_spot',
      badge: 'OWN 35 / OPP 20',
      label: { ko: '공의 위치 (OWN 우리 진영 / OPP 상대 진영)', en: 'Ball Spot (OWN vs OPP Yard Line)' },
      desc: {
        ko: '경기장 전체 길이는 100야드(양쪽 엔드존 각 10야드 포함 시 총 120야드)이며 중앙선이 50야드입니다. OWN 35는 우리 엔드존에서 35야드 나온 지점, OPP 20은 상대 엔드존까지 딱 20야드 남은 공격 찬스 지점입니다!',
        en: 'The field is 100 yards between goal lines (50 is midfield). OWN 35 is 35 yards from your own end zone; OPP 20 means you are just 20 yards away from scoring in the opponent’s end zone!'
      }
    },
    {
      id: 'red_zone',
      badge: '🚨 RED ZONE',
      label: { ko: '레드존 (상대 엔드존 20야드 이내)', en: 'Red Zone (Inside Opponent 20-Yard Line)' },
      desc: {
        ko: '상대 골라인까지 20야드 안쪽에 들어오면 전광판이 빨갛게 빛나며 "RED ZONE"이라고 표시됩니다. 최소 필드골(3점) 이상, 터치다운(6점) 확률이 매우 높은 핵심 득점 구역입니다.',
        en: 'Once the offense reaches inside the opponent’s 20-yard line, broadcast graphics light up with "RED ZONE"—prime scoring territory for a Touchdown or Field Goal.'
      }
    },
    {
      id: 'clocks',
      badge: 'Q4 01:42 · PLAY 25',
      label: { ko: '게임 시계(15분×4쿼터) vs 플레이 클락(40초)', en: 'Game Clock vs 40s Play Clock' },
      desc: {
        ko: '왼쪽은 쿼터 남은 시간(15분씩 4쿼터), 오른쪽 노란 숫자는 "플레이 클락(40초/25초)"입니다. 이전 플레이가 끝난 뒤 40초 안에 다음 공격(스냅)을 시작하지 않으면 Delay of Game(지연 반칙, 5야드 후퇴)이 선언됩니다.',
        en: 'Left is the quarter game clock (four 15-minute quarters). Right is the 40-second Play Clock: if the offense does not snap the ball before :00, it’s a 5-yard Delay of Game penalty.'
      }
    },
    {
      id: 'blue_line',
      badge: '🔵 파란 선 (LOS)',
      label: { ko: '파란색 출발선 (Line of Scrimmage)', en: 'Blue Line (Line of Scrimmage)' },
      desc: {
        ko: 'TV 중계 화면에 그래픽으로 그려지는 파란 선은 공이 놓인 출발선(Line of Scrimmage)입니다. 스냅 전에 이 선을 넘으면 반칙이며, 전진 패스는 반드시 이 파란 선 뒤에서만 던질 수 있습니다!',
        en: 'The virtual blue line marks where the ball is spotted. Neither team may cross it before the snap, and a forward pass is only legal when thrown from behind this line.'
      }
    },
    {
      id: 'yellow_line',
      badge: '🟡 노란 선 (1st Down)',
      label: { ko: '노란색 목표선 (First Down Line)', en: 'Yellow Line (First Down Target Line)' },
      desc: {
        ko: 'TV 중계의 꽃! 이번 4번의 기회 안에 도달해야 하는 10야드 목표선입니다. 공을 가진 선수가 이 노란 선을 넘는 순간 "1st Down!"이 선언되며 새로운 4번의 기회가 생깁니다.',
        en: 'The famous TV yellow line shows the target for a First Down. Cross it with the ball and the chains move—granting a brand-new set of 4 downs!'
      }
    },
    {
      id: 'goal_to_go',
      badge: '1st & GOAL',
      label: { ko: '앤드 골 (& Goal — 엔드존이 곧 목표!)', en: 'Goal to Go (1st & Goal)' },
      desc: {
        ko: '상대 엔드존까지 10야드도 안 남았을 때는 노란 선이 엔드존 골라인과 겹치므로 숫자가 아니라 "1st & Goal"로 표시됩니다. 즉 더 이상 퍼스트다운 리셋이 없고 바로 터치다운을 넣어야 합니다!',
        en: 'When less than 10 yards remain to the End Zone, the yellow line merges with the Goal Line and the graphic reads "1st & Goal"—meaning only a Touchdown counts!'
      }
    },
    {
      id: 'flag_penalty',
      badge: '🟨 FLAG (페널티)',
      label: { ko: '노란 깃발 (심판 반칙 선언 Flag)', en: 'Yellow Flag (Penalty Marker)' },
      desc: {
        ko: '전광판에 노란색 "FLAG"가 뜨면 심판이 반칙 지점에 노란 주머니 손수건을 던진 것입니다! 대표 반칙: ① 폴스 스타트(False Start: 공격수가 스냅 전 움찔, -5야드) ② 홀딩(Holding: 수비 옷/몸 붙잡기, -10야드) ③ 패스 인터피어런스(날아오는 공을 잡으려는 리시버를 미리 밀침).',
        en: 'When "FLAG" flashes in yellow, an official threw a penalty marker! Common calls: False Start (offense flinches early, -5 yds), Holding (grabbing a jersey, -10 yds), and Pass Interference.'
      }
    }
  ],

  cards: [
    { id: 'qb', cat: 'off', code: 'QB', name: { ko: '쿼터백 (Quarterback)', en: 'Quarterback (QB)' }, role: { ko: '공격의 사령관 · 패스 & 작전 지휘', en: 'Field General · Passing & Playcalling' }, desc: { ko: '센터에게서 스냅으로 공을 받아 러닝백에게 건네거나(Hand-off), 빈 리시버에게 패스를 던지고, 직접 달릴 수도 있는 핵심 포지션입니다.', en: 'Receives the snap, hands off to the running back, throws passes to receivers downfield, or scrambles for yards.' } },
    { id: 'rb', cat: 'off', code: 'RB', name: { ko: '러닝백 (Running Back)', en: 'Running Back (RB)' }, role: { ko: '돌파 전문가 · 런 플레이의 핵심', en: 'Ball Carrier · Ground Game' }, desc: { ko: '쿼터백 뒤에서 공을 넘겨받아 라인맨들이 열어준 틈(Hole)으로 돌진하거나 짧은 체크다운 패스를 받아 달립니다.', en: 'Lines up behind the QB to burst through blocking lanes for steady rushing yards or catch short checkdown passes.' } },
    { id: 'wr', cat: 'off', code: 'WR', name: { ko: '와이드 리시버 (Wide Receiver)', en: 'Wide Receiver (WR)' }, role: { ko: '스피드 패스 캐처 · 외곽 루트 주행', en: 'Deep & Route Pass Catcher' }, desc: { ko: '양쪽 사이드라인 근처에 서서 약속된 길(Route: 슬랜트, 아웃, 포스트 등)을 빠르게 달려 쿼터백의 패스를 잡아냅니다.', en: 'Splits out wide and runs crisp routes (Slant, Out, Post, Go) to get open and catch forward passes.' } },
    { id: 'te', cat: 'off', code: 'TE', name: { ko: '타이트엔드 (Tight End)', en: 'Tight End (TE)' }, role: { ko: '블로킹 + 패스 캐치 만능 하이브리드', en: 'Hybrid Blocker & Receiver' }, desc: { ko: '공격 라인 바로 옆에 서서 런 플레이 때는 든든하게 길을 막아주고, 패스 플레이 때는 중거리 패스를 받는 만능 포지션입니다.', en: 'Lines up next to the offensive tackles—strong enough to block defensive ends and agile enough to catch passes over the middle.' } },
    { id: 'ol', cat: 'off', code: 'OL', name: { ko: '오펜시브 라인 (Offensive Line 5명)', en: 'Offensive Line (C, OG, OT)' }, role: { ko: '쿼터백 보호벽(포켓) & 런 길 열기', en: 'Pass Protection & Run Blocking' }, desc: { ko: '가운데 센터(C), 양옆 가드(G), 바깥 태클(T) 총 5명의 거구들입니다. 공을 잡을 수는 없지만 쿼터백을 지키는 성벽입니다.', en: 'Five blockers (Center, two Guards, two Tackles) who snap the ball, form a protective pocket for the QB, and open running lanes.' } },
    { id: 'dl', cat: 'def', code: 'DL', name: { ko: '디펜시브 라인 (Defensive Line)', en: 'Defensive Line (DT, DE)' }, role: { ko: '최전선 돌격 · 쿼터백 압박(Pass Rush)', en: 'Trench Rushers & Run Stoppers' }, desc: { ko: '공격 라인 바로 맞은편에서 러닝백의 길을 막고, 패스 플레이 때는 쿼터백을 덮쳐 색(Sack)을 노립니다.', en: 'Battles the offensive line at the line of scrimmage to stuff the run and rush the quarterback for sacks.' } },
    { id: 'lb', cat: 'def', code: 'LB', name: { ko: '라인배커 (Linebacker)', en: 'Linebacker (LB)' }, role: { ko: '수비의 사령관 · 런 저지 & 중단 커버', en: 'Defensive Captain · Run & Short Pass' }, desc: { ko: '수비 라인 바로 뒤에서 런 돌파를 태클로 막고, 짧은 패스 길목을 차단하거나 기습 돌격(Blitz)을 감행합니다.', en: 'Patrols behind the D-line to tackle runners, cover tight ends and running backs, or blitz the quarterback.' } },
    { id: 'cb', cat: 'def', code: 'CB', name: { ko: '코너백 (Cornerback)', en: 'Cornerback (CB)' }, role: { ko: '와이드 리시버 1대1 마크 & 인터셉트', en: 'Outside Pass Coverage' }, desc: { ko: '상대 와이드 리시버를 그림자처럼 따라붙어 패스를 쳐내거나 가로채는(Interception) 빠른 수비수입니다.', en: 'Shadows wide receivers on the perimeter to break up passes and snag interceptions.' } },
    { id: 's', cat: 'def', code: 'S', name: { ko: '세이프티 (Safety)', en: 'Safety (FS / SS)' }, role: { ko: '최후방 수비수 · 장거리 패스 차단', en: 'Last Line of Defense' }, desc: { ko: '수비 진영 가장 깊은 곳을 지키며 한 방에 뚫리는 장거리 터치다운 패스(Deep Ball)를 막아내는 최후의 보루입니다.', en: 'Guards deep territory as the last line of defense against long touchdown bombs.' } },
    { id: 'r_downs', cat: 'rule', code: '4DN', name: { ko: '4다운 10야드 시스템', en: '4 Downs & 10 Yards Rule' }, role: { ko: '미식축구의 심장 · 땅따먹기 규칙', en: 'Core Progression Rule' }, desc: { ko: '공격팀은 4번의 시도 안에 총 10야드를 전진해야 합니다. 성공하면 다시 1st & 10이 되어 엔드존까지 계속 전진할 수 있습니다.', en: 'The offense has 4 downs to gain 10 yards. Succeeding awards a First Down and resets the count to 1st & 10.' } },
    { id: 'r_td', cat: 'rule', code: '6+1/2', name: { ko: '터치다운(6점) & 추가 시도(PAT/2점)', en: 'Touchdown (6) + Extra Try (1 or 2)' }, role: { ko: '왜 7점 또는 8점이 한 번에 오를까?', en: 'Why Teams Score 7 or 8 at Once' }, desc: { ko: '공을 들고 엔드존에 들어가거나 엔드존 안에서 패스를 받으면 6점! 직후 킥(PAT)으로 +1점, 또는 2야드 전진 플레이로 +2점을 추가합니다.', en: 'Carry or catch the ball in the End Zone for 6 points, then choose a 1-point kick (PAT) or a 2-point conversion play.' } },
    { id: 'r_fg', cat: 'rule', code: 'FG/P', name: { ko: '필드골(3점) vs 펀트(Punt)', en: 'Field Goal (3 pts) vs Punt' }, role: { ko: '4번째 다운의 두 가지 킥', en: 'Fourth-Down Kicking Options' }, desc: { ko: '상대 골대(노란 Y자 기둥)가 가까우면 필드골을 차서 3점을 얻고, 멀면 펀트로 공을 멀리 차서 상대 출발 위치를 뒤로 밀어냅니다.', en: 'In range, kick a Field Goal through the uprights for 3 points; out of range, Punt the ball deep to pin the opponent.' } },
    { id: 'r_safety', cat: 'rule', code: 'SAFE', name: { ko: '세이프티 (Safety = 수비 2점)', en: 'Safety (2 Points for Defense)' }, role: { ko: '수비팀이 점수를 따고 공까지 받는 진귀한 상황', en: 'Defense Scores 2 Pts + Gets Ball' }, desc: { ko: '공격수가 자기 팀 엔드존 안에서 태클당하면 수비팀이 즉시 2점을 얻고, 심지어 공격권까지 넘겨받습니다!', en: 'Tackling an offensive ball-carrier inside his own end zone awards the defense 2 points AND possession of the ball!' } },
    { id: "r_turnover", cat: "rule", code: "INT", name: { ko: "인터셉트 & 펌블 (턴오버)", en: "Interception & Fumble (Turnover)" }, role: { ko: "공격권이 즉시 뒤바뀌는 결정적 순간", en: "Instant Change of Possession" }, desc: { ko: "패스를 수비가 공중에서 가로채면 인터셉트(Interception), 달리는 선수가 땅에 흘린 공을 수비가 덮치면 펌블 리커버리(Fumble)입니다.", en: "Catching an opponent’s pass (Interception) or recovering a dropped live ball (Fumble) immediately flips possession!" } },
    { id: "k_p", cat: "off", code: "K/P", name: { ko: "키커 & 펀터 (Kicker & Punter)", en: "Kicker (K) & Punter (P)" }, role: { ko: "스페셜팀의 발 · 3점 필드골 & 장거리 펀트", en: "Special Teams Specialists" }, desc: { ko: "키커(K)는 필드골(3점)과 PAT(1점) 및 킥오프를 전담하고, 펀터(P)는 4th 다운에 공을 들고 멀리 차서 상대 출발선을 뒤로 밀어냅니다.", en: "The Kicker handles 3-pt Field Goals, 1-pt PATs, and Kickoffs; the Punter drop-kicks the ball on 4th down to pin opponents deep." } },
    { id: "kr_pr", cat: "off", code: "RET", name: { ko: "리터너 (Kick / Punt Returner)", en: "Kick & Punt Returner (KR/PR)" }, role: { ko: "상대 킥을 받아 역습 질주 · 페어캐치(Fair Catch)", en: "Explosive Return Specialist" }, desc: { ko: "상대가 찬 공을 받아 전진합니다. 만약 수비가 코앞까지 달려왔다면 손을 흔들어 페어캐치(Fair Catch)를 선언해 태클 없이 안전하게 잡을 수 있습니다.", en: "Catches kickoffs and punts to run them back, or waves a hand for a Fair Catch to secure the ball safely without being tackled." } },
    { id: "r_sack", cat: "rule", code: "SACK", name: { ko: "색 (Sack) & 패스 러시", en: "Quarterback Sack" }, role: { ko: "패스 전 쿼터백 태클 = 큰 야드 손실!", en: "Tackling the QB Behind the Line" }, desc: { ko: "패스를 던지려는 쿼터백이 파란 출발선(LOS) 뒤에서 수비에게 잡히면 색(Sack)이 되어 잡힌 지점만큼 야드를 잃고 다운도 하나 소모됩니다.", en: "Tackling the quarterback behind the Line of Scrimmage before he throws results in a heavy loss of yards and costs a down." } },
    { id: "r_clock", cat: "rule", code: "CLK", name: { ko: "시계 정지 규칙 (2분 드릴의 핵심)", en: "Clock Stoppage Rules" }, role: { ko: "사이드라인 아웃 · 인컴플리트 · 스파이크 · 타임아웃", en: "How to Stop the Game Clock" }, desc: { ko: "경기장 안(Inbounds)에서 태클당하면 시계가 계속 흐릅니다. 시간이 없을 때는 사이드라인 밖으로 나가거나 패스 실패, 스파이크, 타임아웃으로 시계를 멈춰야 합니다.", en: "Being tackled inbounds keeps the clock moving. Step out of bounds, throw incomplete, spike the ball, or call timeout to stop it." } },
    { id: "r_redzone", cat: "rule", code: "RED", name: { ko: "레드존 (Red Zone · 상대 20야드 이내)", en: "The Red Zone (Inside Opp 20)" }, role: { ko: "터치다운 확률이 치솟는 황금 득점 구역", en: "High-Alert Scoring Territory" }, desc: { ko: "상대 엔드존까지 20야드 이내에 진입하면 전광판에 RED ZONE이 켜집니다. 필드가 좁아져 수비가 촘촘해지므로 정교한 패스나 파워 런이 필요합니다.", en: "Inside the opponent’s 20-yard line, space tightens vertically, demanding crisp red-zone routes or power goal-line runs." } },
    { id: "r_penalty", cat: "rule", code: "FLAG", name: { ko: "주요 반칙 3대장 (False Start / Holding / DPI)", en: "Key Penalties (Yellow Flag)" }, role: { ko: "심판이 노란 깃발(Flag)을 던지는 이유", en: "Why Refs Throw Yellow Flags" }, desc: { ko: "① 폴스 스타트(공격수가 스냅 전 움직임, -5야드) ② 오펜시브 홀딩(수비 붙잡기, -10야드) ③ 패스 인터피어런스(공 잡기 전 리시버 밀침, 반칙 지점 퍼스트다운).", en: "False Start (-5 yds for flinching early), Offensive Holding (-10 yds for grabbing), and Defensive Pass Interference (spot foul 1st down)." } }
  ],

  quiz: [
    {
      q: { ko: '전광판에 "2nd & 6"라고 적혀 있습니다. 무슨 뜻일까요?', en: 'The scorebug reads "2nd & 6". What does this mean?' },
      opts: [
        { ko: '2번째 공격 기회이며, 노란 선까지 6야드 남았다', en: '2nd down, with 6 yards needed to reach the First Down line' },
        { ko: '2쿼터 6분이 남았다', en: '2nd quarter with 6 minutes remaining' },
        { ko: '2점짜리 공격을 6번 할 수 있다', en: 'You get six tries to score 2 points' }
      ],
      ans: 0,
      exp: { ko: '앞 숫자는 현재 몇 번째 다운(기회)인지, 뒤 숫자는 퍼스트다운(노란 선)까지 남은 야드 수입니다!', en: 'The first number is the current down (1st–4th); the second is the yards remaining to reach the yellow First Down line.' }
    },
    {
      q: { ko: '우리 진영 깊숙한 곳(OWN 25)에서 "4th & 9"가 되었습니다. 가장 일반적이고 안전한 선택은?', en: 'You face "4th & 9" deep in your own territory (OWN 25). What is the standard smart call?' },
      opts: [
        { ko: '펀트(Punt)로 공을 멀리 차서 상대를 뒤로 밀어낸다', en: 'Punt the ball deep so the opponent starts far back' },
        { ko: '무조건 패스를 던져 9야드를 노린다', en: 'Always go for it—there is no penalty for failing' },
        { ko: '75야드짜리 필드골을 찬다', en: 'Kick a 92-yard field goal from your own 25' }
      ],
      ans: 0,
      exp: { ko: '4th 다운에 실패하면 그 자리(우리 골대 25야드 앞!)에서 바로 상대에게 공을 뺏깁니다. 그래서 펀트로 멀리 차 넘깁니다.', en: 'Failing on 4th down surrenders the ball right at your own 25! Punting flips field position safely.' }
    },
    {
      q: { ko: '터치다운(6점) 직후, 우리 팀이 22:24(2점 차)로 뒤지고 있습니다. 동점을 만들려면 어떤 추가 시도를 해야 할까요?', en: 'Right after a 6-point Touchdown, your team still trails 22–24. Which Extra Try ties the game at 24–24?' },
      opts: [
        { ko: '2점 컨버전 (+2점 공격 시도)', en: '2-Point Conversion (+2 pts play from the 2-yard line)' },
        { ko: 'PAT 킥 (+1점 킥 시도)', en: 'PAT Kick (+1 pt kick)' },
        { ko: '펀트 (0점)', en: 'Punt (0 pts)' }
      ],
      ans: 0,
      exp: { ko: '터치다운(6점) 후 2점 컨버전에 성공하면 +2점을 얻어 한 번의 공격으로 총 8점(6+2)을 추격할 수 있습니다!', en: 'A 2-Point Conversion adds 2 points to the 6-point Touchdown (8 total), tying a 22–24 game at 24–24!' }
    },
    {
      q: { ko: '4쿼터 종료 50초 전, 시계를 멈추는(Clock Stop) 방법이 아닌 것은?', en: 'With 0:50 left in Q4, which of the following does NOT stop the game clock?' },
      opts: [
        { ko: '경기장 한가운데(Inbounds)에서 수비에게 태클당하기', en: 'Getting tackled in the middle of the field (inbounds)' },
        { ko: '공을 들고 사이드라인 밖(Out of Bounds)으로 나가기', en: 'Running Out of Bounds over the sideline' },
        { ko: '패스가 땅에 떨어져 인컴플리트(Incomplete)가 되기', en: 'Throwing an Incomplete forward pass' }
      ],
      ans: 0,
      exp: { ko: '필드 안(Inbounds)에서 태클당하면 시계가 멈추지 않고 계속 흘러갑니다! 사이드라인 아웃·인컴플리트·스파이크·타임아웃만 시계를 멈춥니다.', en: 'Being tackled inbounds keeps the clock ticking! Stepping out of bounds, an incomplete pass, a QB spike, or a timeout stops it.' }
    },
    {
      q: { ko: '전진 패스(Forward Pass)에 대한 규칙으로 올바른 것은?', en: 'Which rule about a Forward Pass is TRUE?' },
      opts: [
        { ko: '한 다운에 딱 1번, 파란 출발선(Line of Scrimmage) 뒤에서만 앞으로 던질 수 있다', en: 'Allowed only ONCE per down, and only from behind the blue Line of Scrimmage' },
        { ko: '럭비처럼 아무 때나 앞으로 여러 번 던질 수 있다', en: 'You can throw forward as many times as you want on the same play' },
        { ko: '출발선을 넘은 뒤에도 앞으로 패스할 수 있다', en: 'You can run 15 yards past the blue line and still throw forward' }
      ],
      ans: 0,
      exp: { ko: '미식축구에서 앞으로 던지는 전진 패스는 한 플레이당 오직 1번, 출발선(파란 선)을 넘기 전에만 허용됩니다!', en: 'Only one forward pass is permitted per down, and the passer must still be behind the Line of Scrimmage.' }
    }
  ]
};
