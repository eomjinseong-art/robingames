/* Nadoo Ice Hockey 101 — Bilingual Data */
'use strict';
var HK_DATA = {
  stages: [
    { id: 1, icon: '🔵', title: { ko: 'Stage 1 · 파란 선과 오프사이드', en: 'Stage 1 · Blue Line & Offside' },
      sub: { ko: '퍽이 우리 공격수보다 먼저 상대 파란 선을 넘어야 온사이드! 타이밍 맞춰 패스 후 슬랩샷.', en: 'The puck must cross the attacking blue line before your skaters. Time the pass, then slap shot!' },
      goal: { ko: '목표: 퍽을 먼저 파란 선 너머로 보내고(온사이드) 슬랩샷으로 골!', en: 'Goal: Get the puck over the blue line first (onside), then score with a slap shot!' },
      why: { ko: '공격수가 퍽보다 먼저 상대 공격 지역(파란 선 너머)에 들어가면 오프사이드! 플레이가 멈추고 중립 지역에서 페이스오프를 합니다. 퍽이 먼저, 사람은 나중!', en: 'If an attacker enters the offensive zone (past the blue line) before the puck, it is Offside: play stops for a neutral-zone faceoff. Puck first, skaters second!' } },
    { id: 2, icon: '🔴', title: { ko: 'Stage 2 · 빨간 선과 아이싱', en: 'Stage 2 · Center Red Line & Icing' },
      sub: { ko: '빨간 선을 넘기 전에 멀리 쳐서 상대 골라인을 넘기면 아이싱! 빨간 선을 먼저 넘은 뒤 덤프인하세요.', en: 'Shooting the puck from your half past the far goal line is Icing. Cross the red line first, then dump it in!' },
      goal: { ko: '목표: 빨간 선을 먼저 넘은 뒤 덤프인/패스로 공격 지역에 진입해 골!', en: 'Goal: Cross the red line first, then dump in or pass to attack and score!' },
      why: { ko: '자기 진영(빨간 선 이전)에서 친 퍽이 아무도 건드리지 않고 상대 골라인을 넘으면 아이싱! 퍽은 우리 진영으로 돌아와 페이스오프하고, 아이싱한 팀은 선수 교체도 못 합니다.', en: 'If the puck is shot from behind the center red line and crosses the opponent goal line untouched, it is Icing: faceoff back in your zone, and the icing team cannot change lines.' } },
    { id: 3, icon: '⏳', title: { ko: 'Stage 3 · 페널티 박스와 파워플레이 (5대4)', en: 'Stage 3 · Penalty Box & Power Play (5-on-4)' },
      sub: { ko: '상대 2분 퇴장! 5대4 수적 우위에서 패스를 돌려 골리 빈틈에 원타이머!', en: 'Opponent takes a 2-minute minor! Move the puck 5-on-4 and hit a one-timer!' },
      goal: { ko: '목표: 파워플레이에서 패스를 돌려 골리를 흔든 뒤 원타이머 골!', en: 'Goal: Cycle passes on the power play and score a one-timer!' },
      why: { ko: '2분 마이너 페널티 동안 상대는 4명. 파워플레이 팀이 골을 넣으면 퇴장 선수가 즉시 복귀합니다. 수비하는 4명(페널티킬 팀)은 아이싱을 해도 반칙이 아니에요!', en: 'During a 2-minute minor the opponent plays with 4. If the power-play team scores, the penalized player returns immediately. The short-handed (penalty-kill) team is allowed to ice the puck!' } },
    { id: 4, icon: '🔁', title: { ko: 'Stage 4 · 플라잉 체인지 & 골리 빼기 (6대5)', en: 'Stage 4 · Line Change & Pulling the Goalie (6-on-5)' },
      sub: { ko: '체력 떨어진 라인을 경기 중에 교체하고, 종료 1분 전 골리를 빼 6명 총공격으로 동점골!', en: 'Change tired lines on the fly, then pull the goalie for a 6-on-5 tying goal in the last minute!' },
      goal: { ko: '목표: 지친 라인을 교체하고, 1분 전 골리를 빼 엠프티 넷 6대5로 동점골!', en: 'Goal: Change lines, then pull the goalie with 1:00 left and tie it 6-on-5!' },
      why: { ko: '하키는 너무 힘들어 한 라인이 보통 40~60초만 뛰고 경기 중에 벤치와 교체합니다(플라잉 체인지). 지고 있는 팀은 막판에 골리를 빼고 공격수 1명을 더 넣어 6대5로 몰아붙여요. 대신 우리 골문은 텅 빈 엠프티 넷!', en: 'Shifts last only 40–60 seconds, so teams swap players while play continues (a flying change). A trailing team pulls its goalie late for a 6th attacker — leaving its own net empty!' } },
    { id: 5, icon: '🏆', title: { ko: 'Stage 5 · 3피리어드 · 3대3 연장 · 슛아웃', en: 'Stage 5 · 3 Periods · 3-on-3 OT · Shootout' },
      sub: { ko: '골문 뒤 그레츠키 오피스, 어시스트 2명 포인트, 3대3 서든데스 연장, 1대1 슛아웃까지!', en: "Gretzky's Office behind the net, 2-assist points, 3-on-3 sudden-death OT, and a 1-on-1 shootout!" },
      goal: { ko: '목표: 골문 뒤에서 어시스트 → 3대3 연장 → 슛아웃 결승골!', en: 'Goal: Set up from behind the net, survive 3-on-3 OT, win the shootout!' },
      why: { ko: '정규 경기는 20분 × 3피리어드. 골 1개에 어시스트는 최대 2명까지 기록돼 각각 1포인트! 동점이면 NHL 정규시즌은 5분 3대3 서든데스 연장(먼저 넣으면 끝), 그래도 동점이면 1대1 슛아웃으로 승부를 가립니다.', en: 'Regulation is three 20-minute periods. Up to 2 assists are credited per goal (1 point each). If tied, NHL regular season plays 5 minutes of 3-on-3 sudden-death OT, then a 1-on-1 shootout.' } }
  ],
  scorebugItems: [
    { badge: '2nd 12:34', label: { ko: '피리어드 & 시계', en: 'Period & Clock' }, desc: { ko: '20분짜리 3피리어드 중 몇 번째인지와 남은 시간. 휘슬이 불리면 시계가 멈춥니다.', en: 'Which of three 20-minute periods, and time left. The clock stops on every whistle.' } },
    { badge: 'PP 1:48', label: { ko: '파워플레이 (PP)', en: 'Power Play (PP)' }, desc: { ko: '상대 선수가 페널티 박스에 있어 수적 우위인 시간. 골을 넣으면 마이너 페널티는 즉시 끝나요.', en: 'Time left with a man advantage. A power-play goal ends a minor penalty immediately.' } },
    { badge: 'SOG 24', label: { ko: '유효 슈팅 (Shots on Goal)', en: 'Shots on Goal' }, desc: { ko: '골리가 막았거나 골이 된 슈팅 수. 골대 맞은 슛은 포함되지 않아요.', en: 'Shots that were saved or scored. Hitting the post does not count.' } },
    { badge: 'EN', label: { ko: '엠프티 넷 (Empty Net)', en: 'Empty Net' }, desc: { ko: '골리를 빼고 공격수를 추가한 상태. 골문이 비어 있어 상대가 멀리서도 득점할 수 있어요.', en: 'The goalie is pulled for an extra attacker; the net is empty.' } },
    { badge: '🔵 BLUE', label: { ko: '파란 선 (Blue Line)', en: 'Blue Lines' }, desc: { ko: '수비/중립/공격 지역을 나누는 선. 오프사이드 판정 기준입니다.', en: 'Divide defensive, neutral and offensive zones; the offside reference.' } },
    { badge: '🔴 RED', label: { ko: '중앙 빨간 선 (Center Line)', en: 'Center Red Line' }, desc: { ko: '링크 한가운데 선. 아이싱 판정 기준이에요.', en: 'Splits the rink in half; the icing reference.' } },
    { badge: '⭕ 5 DOTS', label: { ko: '페이스오프 서클 & 점', en: 'Faceoff Circles & Dots' }, desc: { ko: '휘슬 뒤 경기 재개 지점. 9개의 페이스오프 점이 있어요.', en: 'Where play restarts after a whistle — 9 faceoff spots.' } },
    { badge: '🥅 CREASE', label: { ko: '골 크리스 (파란 반원)', en: 'Goal Crease' }, desc: { ko: '골문 앞 파란 반원. 골리 보호 구역으로, 공격수가 골리를 방해하면 골이 취소될 수 있어요.', en: 'Blue area in front of the net protecting the goalie; interference can wipe out a goal.' } }
  ],
  cards: [
    { code: 'C', name: { ko: '센터 (Center)', en: 'Center (C)' }, role: { ko: '페이스오프 · 공수 연결', en: 'Faceoffs · two-way playmaker' }, desc: { ko: '가운데 공격수. 페이스오프를 하고 수비까지 내려와 돕는 만능 포지션.', en: 'Middle forward who takes faceoffs and supports defense.' } },
    { code: 'LW/RW', name: { ko: '윙어 (Winger)', en: 'Wingers (LW/RW)' }, role: { ko: '측면 돌파 · 득점', en: 'Wing attack · scoring' }, desc: { ko: '좌우 측면을 달리며 슛과 리바운드를 노리는 공격수.', en: 'Forwards on each side who shoot and crash for rebounds.' } },
    { code: 'D', name: { ko: '디펜스맨 (Defenseman)', en: 'Defensemen (D)' }, role: { ko: '수비 · 블루라인 포인트', en: 'Defense · point shots' }, desc: { ko: '2명이 수비를 맡고, 공격 땐 파란 선 근처(포인트)에서 퍽을 지키며 강슛을 날려요.', en: 'Two defenders who hold the blue line on offense and fire point shots.' } },
    { code: 'G', name: { ko: '골리 (Goaltender)', en: 'Goaltender (G)' }, role: { ko: '최후의 방패', en: 'Last line of defense' }, desc: { ko: '두꺼운 패드로 골문을 지키는 선수. 막판엔 벤치로 빠져 6번째 공격수와 교체되기도 해요.', en: 'Guards the net in heavy pads; may be pulled late for an extra attacker.' } },
    { code: 'OFF', name: { ko: '오프사이드', en: 'Offside' }, role: { ko: '퍽이 먼저 파란 선을 넘어야!', en: 'Puck must cross first' }, desc: { ko: '공격수가 퍽보다 먼저 공격 지역에 들어가면 휘슬, 중립 지역 페이스오프.', en: 'Attacker enters the zone ahead of the puck: whistle, neutral-zone faceoff.' } },
    { code: 'ICE', name: { ko: '아이싱', en: 'Icing' }, role: { ko: '빨간 선 전에 멀리 치기 금지', en: 'No long clears from your half' }, desc: { ko: '자기 진영에서 친 퍽이 상대 골라인을 그대로 넘으면 반칙. 페널티킬 팀은 예외!', en: 'Puck shot from your half crossing the far goal line untouched. Penalty-killing teams are exempt.' } },
    { code: 'PIM2', name: { ko: '2분 마이너 페널티', en: '2-Minute Minor' }, role: { ko: '트리핑·후킹·슬래싱 등', en: 'Tripping, hooking, slashing' }, desc: { ko: '반칙 선수는 페널티 박스에서 2분. 상대가 골 넣으면 즉시 복귀.', en: '2 minutes in the box; ends early if the other team scores.' } },
    { code: 'PIM5', name: { ko: '5분 메이저 페널티', en: '5-Minute Major' }, role: { ko: '싸움 등 심한 반칙', en: 'Fighting, severe fouls' }, desc: { ko: '5분 동안 퇴장. 골을 먹어도 끝까지 다 채워야 해요.', en: 'Full 5 minutes even if goals are scored.' } },
    { code: 'PP', name: { ko: '파워플레이', en: 'Power Play' }, role: { ko: '수적 우위 공격', en: 'Man advantage' }, desc: { ko: '상대 퇴장으로 5대4 등 숫자가 많은 상황. 패스를 돌려 골리를 흔들어요.', en: 'Attack with more skaters; move the puck to shift the goalie.' } },
    { code: 'PK', name: { ko: '페널티킬', en: 'Penalty Kill' }, role: { ko: '수적 열세 수비', en: 'Short-handed defense' }, desc: { ko: '4명이 박스 형태로 버티는 수비. 아이싱이 허용돼 퍽을 멀리 걷어내요.', en: 'Four skaters in a box; icing is allowed to clear the puck.' } },
    { code: 'LC', name: { ko: '플라잉 체인지', en: 'Flying Change' }, role: { ko: '경기 중 실시간 교체', en: 'Change on the fly' }, desc: { ko: '시계가 흐르는 중에 벤치에서 선수가 뛰어들고 나가요. 한 시프트 40~60초.', en: 'Players hop the boards while play continues; shifts last 40–60 s.' } },
    { code: 'TMM', name: { ko: '투 매니 멘', en: 'Too Many Men' }, role: { ko: '교체 실수 반칙', en: 'Bad change penalty' }, desc: { ko: '교체 때 6명 넘게 빙판에서 플레이하면 2분 벤치 마이너 페널티.', en: 'More than the allowed skaters involved in play: 2-minute bench minor.' } },
    { code: 'EN', name: { ko: '엠프티 넷 (골리 빼기)', en: 'Empty Net' }, role: { ko: '6대5 총공격', en: '6-on-5 all-out attack' }, desc: { ko: '지는 팀이 막판 골리를 빼고 공격수를 추가. 대신 골문이 텅 비어요.', en: 'Trailing team pulls the goalie for a sixth attacker, leaving the net empty.' } },
    { code: 'A', name: { ko: '어시스트 & 포인트', en: 'Assists & Points' }, role: { ko: '골 1개에 최대 2명', en: 'Up to 2 per goal' }, desc: { ko: '골 직전 퍽을 만진 최대 2명에게 어시스트. 골 1 + 어시스트 1 = 각 1포인트.', en: 'Up to two players who touched it before the goal get assists; goals and assists are 1 point each.' } },
    { code: 'GO', name: { ko: '그레츠키 오피스', en: "Gretzky's Office" }, role: { ko: '골문 뒤 플레이메이킹', en: 'Behind-the-net playmaking' }, desc: { ko: '전설 웨인 그레츠키가 즐겨 쓴 골문 뒤 공간. 골리가 등을 돌려야 해서 패스하기 좋아요.', en: 'The area behind the net Wayne Gretzky made famous; goalies must turn to track passes.' } },
    { code: 'OT', name: { ko: '3대3 연장 & 슛아웃', en: '3-on-3 OT & Shootout' }, role: { ko: '서든데스 → 1대1', en: 'Sudden death → 1-on-1' }, desc: { ko: 'NHL 정규시즌: 5분 3대3 연장, 먼저 넣으면 승리. 그래도 동점이면 3라운드 슛아웃.', en: 'NHL regular season: 5-min 3-on-3 sudden death, then a 3-round shootout.' } },
    { code: 'HAT', name: { ko: '해트트릭', en: 'Hat Trick' }, role: { ko: '한 경기 3골', en: '3 goals in a game' }, desc: { ko: '한 선수가 3골을 넣으면 팬들이 빙판에 모자를 던져 축하해요.', en: 'One player scores three; fans toss hats onto the ice.' } },
    { code: 'FO', name: { ko: '페이스오프', en: 'Faceoff' }, role: { ko: '경기 재개', en: 'Restart' }, desc: { ko: '심판이 두 센터 사이에 퍽을 떨어뜨려 재개. 오프사이드·아이싱 뒤 위치가 달라져요.', en: 'The official drops the puck between two centers; location depends on the stoppage.' } }
  ],
  quiz: [
    { q: { ko: '우리 윙어가 퍽보다 먼저 상대 파란 선을 넘어 들어갔다. 판정은?', en: 'Your winger crosses the attacking blue line before the puck. Call?' }, opts: [{ ko: '오프사이드', en: 'Offside' }, { ko: '아이싱', en: 'Icing' }, { ko: '정상 플레이', en: 'Play on' }], ans: 0, exp: { ko: '퍽이 먼저, 사람은 나중! 먼저 들어가면 오프사이드입니다.', en: 'Puck first, skaters after — otherwise Offside.' } },
    { q: { ko: '우리 진영에서 친 퍽이 아무도 안 건드리고 상대 골라인을 넘었다(5대5). 판정은?', en: 'At 5-on-5 you shoot from your half and it crosses the far goal line untouched. Call?' }, opts: [{ ko: '아이싱', en: 'Icing' }, { ko: '골킥', en: 'Goal kick' }, { ko: '오프사이드', en: 'Offside' }], ans: 0, exp: { ko: '빨간 선 이전에서 멀리 친 퍽 = 아이싱. 우리 진영에서 페이스오프!', en: 'From behind the red line to past the goal line = Icing; faceoff in your zone.' } },
    { q: { ko: '2분 마이너 페널티 중 파워플레이 팀이 골을 넣으면?', en: 'A power-play goal is scored during a 2-minute minor. Then?' }, opts: [{ ko: '퇴장 선수가 즉시 복귀한다', en: 'The penalized player returns immediately' }, { ko: '2분을 다 채워야 한다', en: 'They must serve all 2 minutes' }, { ko: '2분이 추가된다', en: '2 more minutes are added' }], ans: 0, exp: { ko: '마이너 페널티는 상대 골로 즉시 끝나요(메이저는 예외).', en: 'A minor ends on a power-play goal (majors do not).' } },
    { q: { ko: '1골 뒤진 종료 1분 전, 감독이 골리를 벤치로 부른 이유는?', en: 'Down 1 with 1:00 left, why pull the goalie?' }, opts: [{ ko: '공격수 1명을 더 넣어 6대5로 공격하려고', en: 'To add a sixth attacker (6-on-5)' }, { ko: '골리가 반칙을 해서', en: 'The goalie took a penalty' }, { ko: '시간을 멈추려고', en: 'To stop the clock' }], ans: 0, exp: { ko: '엠프티 넷 위험을 감수하고 수적 우위로 동점을 노려요.', en: 'Risk the empty net to gain a man advantage.' } },
    { q: { ko: '골 1개에 기록될 수 있는 어시스트는 최대 몇 명?', en: 'Max assists credited on one goal?' }, opts: [{ ko: '2명', en: '2' }, { ko: '1명', en: '1' }, { ko: '5명', en: '5' }], ans: 0, exp: { ko: '골 직전 퍽을 만진 최대 2명까지 어시스트, 각 1포인트!', en: 'Up to two assists, 1 point each.' } },
    { q: { ko: 'NHL 정규시즌 연장전은 몇 대 몇?', en: 'NHL regular-season overtime is played…' }, opts: [{ ko: '3대3 서든데스', en: '3-on-3 sudden death' }, { ko: '5대5 20분', en: '5-on-5 for 20 min' }, { ko: '바로 슛아웃', en: 'Straight to shootout' }], ans: 0, exp: { ko: '5분 3대3, 먼저 넣으면 승리. 동점이면 슛아웃!', en: '5 minutes of 3-on-3; then a shootout.' } }
  ]
};
