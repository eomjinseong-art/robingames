/* Nadoo Touchdown 101 — Bilingual Data (1-Min Primer, Stages, Scorebug Decoder, Positions/Rules Dex, Quiz) */
'use strict';
var FB_DATA = {
  primer: {
    btn: { ko: '📖 [필독] 미식축구는 도대체 어떤 게임일까? (1분 왕초보 설명서)', en: '📖 [Start Here] What is American Football? (1-Min Beginner Guide)' },
    sub: { ko: '미식축구가 처음이라면 이 5장만 먼저 읽어보세요! 왜 멈추고, 왜 노란 선이 나오고, 왜 4번째에 공을 차는지 1분 만에 이해됩니다.', en: 'Brand new to football? Read these 5 quick cards first! Understand downs, the yellow line, and why teams kick on 4th down in 1 minute.' },
    slides: [
      {
        num: '1 / 5',
        icon: '🏈',
        title: { ko: '미식축구는 한마디로 "10야드씩 끊어서 전진하는 땅따먹기 게임"이에요!', en: 'Football is a "10-Yard Territory-Capturing Game"!' },
        diagram: '🏠우리 진영 ━━[🔵출발선 ➔ 🟡10야드 목표선]━━▶ 🙌상대 엔드존(터치다운!)',
        body: {
          ko: '축구처럼 쉬지 않고 계속 달리는 게임이 아니에요! 공을 가진 선수가 상대 수비에게 붙잡혀 바닥에 넘어지면(태클) "삐익!" 하고 그 자리에서 경기가 딱 멈춰요. 그리고 넘어진 바로 그 자리에서 양 팀이 다시 마주 보고 줄을 서서 다음 공격을 시작합니다.',
          en: 'Unlike soccer, play is not continuous! Whenever the player with the ball is tackled to the ground, the whistle blows and play stops right there. Both teams line up again at that exact spot for the next play.'
        }
      },
      {
        num: '2 / 5',
        icon: '📏',
        title: { ko: '가장 중요한 규칙 딱 하나: "기회 4번 안에 노란 선(10야드) 넘기!"', en: 'The #1 Core Rule: "4 Chances (Downs) to Cross the Yellow Line (10 Yards)!"' },
        diagram: '🔵 파란 출발선 ──(기회 4번 안에 10야드 전진!)──▶ 🟡 노란 목표선 통과 = 새 기회 4번 리셋!',
        body: {
          ko: '공격팀에게는 기회(영어로는 다운, Down)를 딱 4번 줘요. 4번 안에 파란 출발선에서 노란 목표선(10야드, 약 9미터)까지만 넘어가면 "퍼스트다운(성공)!"이 선언되고, 그 자리에서 다시 새로운 기회 4번(1st & 10)을 또 받아요! 이렇게 10야드씩 계속 땅을 따먹으며 끝까지 가는 게임이에요.',
          en: 'The offense gets 4 chances (called "Downs"). If you advance 10 yards from the Blue Line past the Yellow Line within 4 tries, you earn a "First Down!" and get a brand-new set of 4 chances! You repeat this all the way down the field.'
        }
      },
      {
        num: '3 / 5',
        icon: '🏃',
        title: { ko: '공격 방법은 딱 2가지! ① 몸으로 달리기(런) vs ② 공 던지기(패스)', en: 'Only 2 Ways to Advance: ① Run vs ② Pass' },
        diagram: '🏃 달리기(런): 짧고 안전함(+3~6야드)  |  🎯 던지기(패스): 길지만 땅에 떨어지면 0야드!',
        body: {
          ko: '① 달리기(런, Run): 대장(쿼터백)이 뒤 선수(러닝백)에게 공을 건네주고 수비 틈으로 달려요. 3~6야드씩 안전하게 가요.\n② 던지기(패스, Pass): 대장(쿼터백)이 앞으로 달려간 동료(리시버)에게 공을 던져요! 잡으면 10~20야드씩 크게 가지만, 땅에 떨어지면 0야드(패스 실패)로 기회 1번이 날아가고, 너무 늦게 던지면 수비에게 잡혀 뒤로 밀려나요(색, Sack)!',
          en: '① Run: The Quarterback hands the ball to a Running Back who bursts through an open gap for a safe 3–6 yards.\n② Pass: The Quarterback throws downfield to a Receiver! It gains big yards, but drops for 0 yards if incomplete, or loses yards if the QB is tackled before throwing (a Sack)!'
        }
      },
      {
        num: '4 / 5',
        icon: '🦵',
        title: { ko: '초보자가 제일 궁금한 것: "왜 4번째 기회엔 공격 안 하고 발로 뻥 차버릴까?"', en: 'Biggest Beginner Question: "Why Kick the Ball Away on 4th Down?"' },
        diagram: '3번 해보고 안 되면? ➔ ① 멀면 뻥 차서 밀어내기(펀트) / ② 가까우면 골대에 차서 +3점(필드골)',
        body: {
          ko: '만약 4번째 마지막 기회까지 써서 노란 선을 못 넘으면, "공이 멈춘 바로 그 자리"에서 상대에게 공을 뺏겨요! 우리 골대 코앞에서 공을 뺏기면 바로 실점하겠죠?\n그래서 3번 해보고 안 되면, 4번째에는 안전하게 ① 멀리 뻥 차서(펀트) 상대가 저 멀리서 시작하게 하거나, ② 상대 노란 골대(Y자 기둥)가 가까우면 기둥 사이로 차 넣어서 안전하게 3점(필드골)을 챙기는 거예요! (단, 1야드밖에 안 남았을 때만 4번째에도 공격을 강행해요!)',
          en: 'If you fail on 4th down, the opponent takes over the ball right at that spot! So after 3 tries, teams usually play it safe on 4th down: ① Punt (kick it far away) if deep in their own half, or ② Kick a 3-point Field Goal if close to the opponent’s yellow uprights! (Teams only "Go for It" when just 1 yard remains.)'
        }
      },
      {
        num: '5 / 5',
        icon: '🙌',
        title: { ko: '점수 계산의 비밀: 왜 6점 + 보너스 1점 또는 2점일까?', en: 'Scoring Secret: Why 6 Points + Bonus 1 or 2 Points?' },
        diagram: '🙌 터치다운(+6점) 직후 보너스 1번! ➔ 🦵 안전하게 차면 +1점(총 7점) / 💪 한 번 더 뚫으면 +2점(총 8점)',
        body: {
          ko: '상대방 끝 땅(엔드존)에 공을 들고 들어가거나 엔드존 안에서 패스를 잡으면 "터치다운(6점)"이에요!\n터치다운 직후엔 보너스 기회를 딱 1번 주는데: ① 골대 기둥 사이로 안전하게 차 넣으면 +1점(성공률 95%, 총 7점)을 받고, ② 골대 2야드 앞에서 한 번 더 몸으로 뚫고 들어가면 +2점(총 8점)을 받아요! 그래서 미식축구 점수는 7점, 14점, 21점처럼 올라간답니다.',
          en: 'Carrying or catching the ball in the opponent’s End Zone is a Touchdown (6 points)! Right after, you get ONE bonus try: ① Kick through the uprights for +1 point (7 total), or ② Run/pass into the end zone from the 2-yard line for +2 points (8 total)!'
        }
      }
    ]
  },

  stages: [
    {
      id: 1,
      icon: '📏',
      title: { ko: 'Stage 1 · 4번 안에 10야드! (퍼스트다운 땅따먹기)', en: 'Stage 1 · 4 Chances to Gain 10 Yards (First Down!)' },
      sub: { ko: '파란 출발선에서 노란 목표선까지! 기회 4번 안에 10야드를 가면 기회가 다시 4번으로 리셋돼요.', en: 'Advance 10 yards from the Blue Line to the Yellow Line within 4 tries to reset your chances!' },
      easyRule: {
        ko: '한줄 규칙: 기회 4번 안에 노란 선(10야드)만 넘으면 "퍼스트다운!"이 되어 다시 새 기회 4번(1st & 10)을 받아요!',
        en: 'Key Rule: Cross the Yellow Line (10 yards) within 4 tries to earn a First Down and reset to a fresh 1st & 10!'
      },
      tutWhat: {
        ko: '파란 출발선(공이 놓인 선)에서 노란 목표선(10야드 앞)까지 전진해 "퍼스트다운(새 기회 4번 리셋)"을 2번 만드는 법을 배워요!',
        en: 'Learn how to advance from the Blue Line to the Yellow Line (10 yards) to earn 2 First Downs!'
      },
      tutWhy: {
        ko: '100야드나 되는 큰 경기장을 한 번에 끝까지 달릴 순 없어요! 그래서 "4번 안에 10야드씩만 가면 계속 새 기회 4번을 준다"는 징검다리 땅따먹기 규칙을 만든 거예요.',
        en: 'Going 100 yards in one play is nearly impossible! So football rewards you with a fresh set of 4 chances every time you gain 10 yards.'
      },
      tutHow: {
        ko: '먼저 [🏃 달리기(런)] 또는 [🎯 패스]를 고른 뒤, 수비수가 없는 초록색 빈틈/빈 동료 버튼(또는 잔디밭 위 초록 원)을 누르면 앞으로 전진해요!',
        en: 'First pick [🏃 Run] or [🎯 Pass], then click the green open lane/receiver button below (or tap the green circle on the field)!'
      },
      goal: { ko: '목표: 노란 선(10야드)을 두 번 넘어서 퍼스트다운 2번을 달성해 보세요!', en: 'Goal: Cross the Yellow Line twice to earn 2 First Downs!' },
      why: {
        ko: '미식축구의 심장은 "4번 안에 10야드 전진 = 퍼스트다운!"입니다. 전광판의 "1st & 10"은 "1번째 기회, 노란 선까지 10야드 남음"이라는 뜻이고, 6야드를 가면 "2nd & 4(2번째 기회, 4야드 남음)"로 바뀌어요!',
        en: 'The heart of football is gaining 10 yards in 4 tries. "1st & 10" means 1st try with 10 yards to go; gaining 6 yards changes it to "2nd & 4"!'
      }
    },
    {
      id: 2,
      icon: '🏃',
      title: { ko: 'Stage 2 · 달리기(런) vs 던지기(패스)와 색(Sack)', en: 'Stage 2 · Run vs Pass & Avoiding a Sack' },
      sub: { ko: '짧지만 안전한 달리기(런)와 멀리 가지만 수비에게 잡힐 위험(색 Sack)이 있는 패스를 배워요.', en: 'Learn safe Run plays through open gaps vs big Pass plays before defenders sack the QB!' },
      easyRule: {
        ko: '한줄 규칙: 달리기(런)는 빈틈으로 안전하게 전진! 패스는 멀리 가지만 너무 오래 망설이면 수비에게 잡혀 뒤로 밀려요(색, Sack)!',
        en: 'Key Rule: Runs gain safe yards through gaps! Passes gain big yards, but holding the ball too long leads to a Sack!'
      },
      tutWhat: {
        ko: '공격의 두 가지 무기인 "🏃 달리기(런)"와 "🎯 던지기(패스)"의 차이점, 그리고 패스할 때 쿼터백이 수비에게 잡히는 "색(Sack)"이 무엇인지 배워요!',
        en: 'Learn the difference between a Run and a Pass, and what happens when the Quarterback is tackled before throwing (a Sack)!'
      },
      tutWhy: {
        ko: '패스는 한 번에 10~15야드씩 크게 갈 수 있지만, 땅에 떨어지면 0야드(패스 실패)가 되고 공을 쥔 대장(쿼터백)이 우물쭈물하면 상대 수비수에게 덮쳐져서 오히려 뒤로 후퇴(색, Sack)하게 돼요!',
        en: 'Passes can gain huge chunks of yards, but drop for 0 yards if incomplete—and if the QB hesitates too long, defenders rush in for a Sack (yardage loss)!'
      },
      tutHow: {
        ko: '패스할 때는 수비수가 안 붙어 있는 "🟢 초록색 빈 동료(리시버)"를 고르고, 달리기할 때는 "🟢 초록색 열린 길(빈틈)"을 고르면 대성공이에요!',
        en: 'When passing, pick the open green receiver; when running, pick the open green gap!'
      },
      goal: { ko: '목표: 패스와 달리기를 조합해 노란 선을 넘고 상대 진영까지 전진하세요!', en: 'Goal: Combine Passes and Runs to cross the Yellow Line and march downfield!' },
      why: {
        ko: '패스가 땅에 떨어지면 인컴플리트(0야드, 시계 정지)가 되고, 던지기 전에 잡히면 색(Sack, 야드 손실)을 당해요. 또한 앞으로 던지는 패스는 한 번의 공격에 딱 1번, 파란 출발선 뒤에서만 던질 수 있답니다!',
        en: 'An incomplete pass gains 0 yards, and getting tackled before throwing is a Sack. Also, only one forward pass is allowed per play from behind the Blue Line!'
      }
    },
    {
      id: 3,
      icon: '🦵',
      title: { ko: 'Stage 3 · 4번째 기회(4th Down): 왜 공을 발로 뻥 차버릴까?', en: 'Stage 3 · 4th Down: Why Kick the Ball Away?' },
      sub: { ko: '초보자가 제일 궁금한 "왜 4번째엔 공격 안 하고 펀트나 필드골로 차버릴까?"를 3가지 상황으로 직접 해봐요.', en: 'Experience all 3 fourth-down situations: Punt deep, kick a 3-point Field Goal, or Go for It on 4th & 1!' },
      easyRule: {
        ko: '한줄 규칙: 4번째에 실패하면 그 자리에서 공을 뺏겨요! 그래서 ① 멀면 뻥 차서 밀어내고(펀트), ② 골대 근처면 차 넣어서 3점(필드골), ③ 1야드 남았을 때만 돌파해요!',
        en: 'Key Rule: Failing on 4th down gives the ball away right there! So ① Punt when far, ② Kick a 3-pt Field Goal when close, ③ Go for It on 4th & 1!'
      },
      tutWhat: {
        ko: '마지막 4번째 기회(4th Down)가 되었을 때 감독이 내리는 3가지 선택: ① 펀트(멀리 차기), ② 필드골(3점 슛), ③ 1야드 강행 돌파를 배워요!',
        en: 'Learn the 3 classic 4th-down calls: ① Punt (kick deep), ② Field Goal (3-point kick), and ③ Go for It (when 1 yard remains)!'
      },
      tutWhy: {
        ko: '3번 공격했는데 노란 선을 못 넘으면 마지막 4번째 기회(4th Down)가 돼요. 만약 4번째에도 실패하면 "공이 멈춘 바로 그 자리"에서 상대에게 공을 뺏겨요! 그래서 위험할 땐 안전하게 발로 차는 거예요.',
        en: 'If you fail on 4th down, the opponent gets the ball at that exact spot! That is why teams usually kick on 4th down instead of risking a turnover.'
      },
      tutHow: {
        ko: '상황 1(우리 진영 깊숙한 곳)에선 [🦵 펀트], 상황 2(상대 골대 근처)에선 [🥅 필드골 3점], 상황 3(단 1야드 남음)에선 [💪 강행 돌파]를 선택해 보세요!',
        en: 'Pick [🦵 Punt] deep in your own territory, [🥅 Field Goal] near the opponent uprights, and [💪 Go for It] with just 1 yard to go!'
      },
      goal: { ko: '목표: 4번째 기회(4th Down)의 3가지 상황을 차례대로 완벽하게 해결하세요!', en: 'Goal: Make the smart call in all 3 fourth-down scenarios!' },
      why: {
        ko: '4번째 기회(4th Down)의 공식! ① 우리 땅 깊숙이 = 펀트(Punt)로 멀리 차 넘기기, ② 상대 골대 근처 = 필드골(Field Goal)로 3점 챙기기, ③ 1야드 남음 = 과감하게 강행(Go for It)!',
        en: 'The 4th-down formula: ① Deep in own territory = Punt, ② In kicking range = 3-pt Field Goal, ③ 4th & 1 = Go for It!'
      }
    },
    {
      id: 4,
      icon: '🙌',
      title: { ko: 'Stage 4 · 점수 계산의 비밀 (터치다운 6점 + 보너스 1점/2점)', en: 'Stage 4 · Scoring Secrets: Touchdown (6) + Bonus 1 or 2' },
      sub: { ko: '터치다운(6점)을 넣은 뒤, 왜 1점 킥과 2점 공격 중 하나를 고를까요? 직접 동점을 만들어 보세요!', en: 'Score a 6-point Touchdown, then choose between a 1-point kick or 2-point play to tie the game!' },
      easyRule: {
        ko: '한줄 규칙: 터치다운은 6점! 직후 보너스 1번으로 골대에 차 넣으면 +1점(총 7점), 한 번 더 뚫고 들어가면 +2점(총 8점)이에요!',
        en: 'Key Rule: A Touchdown is 6 points! Right after, kick for +1 pt (7 total) or run/pass from the 2-yard line for +2 pts (8 total)!'
      },
      tutWhat: {
        ko: '상대 끝 땅(엔드존)에 공을 넣어 "터치다운(6점)"을 올리고, 이어지는 보너스 기회에서 "+1점 킥" 대신 "+2점 공격(2점 컨버전)"으로 8점 차 경기를 한 번에 동점으로 만드는 법을 배워요!',
        en: 'Learn how to score a 6-point Touchdown and use the 2-Point Conversion (+2) to erase an 8-point deficit in a single drive!'
      },
      tutWhy: {
        ko: '보통은 터치다운(6점) 후 안전한 킥(+1점)을 차서 7점을 얻지만, 만약 우리가 8점 차이(16:24)로 지고 있다면? 6점 + 보너스 2점 공격(총 8점)을 성공시켜야 한 번에 24:24 동점을 만들 수 있기 때문이에요!',
        en: 'Teams usually kick for +1 point (7 total), but when trailing by 8 points (16–24), scoring a 6-pt Touchdown plus a 2-Point Conversion (+2) ties the game 24–24 in one drive!'
      },
      tutHow: {
        ko: '먼저 엔드존 안의 빈 동료에게 패스해 터치다운(+6점)을 넣은 뒤, 보너스 선택에서 [✌️ 2점 컨버전 (+2점)]을 골라 24:24 동점을 완성하세요!',
        en: 'First pass into the End Zone for a Touchdown (+6), then select [✌️ 2-Pt Conversion (+2)] and punch it in to tie the game 24–24!'
      },
      goal: { ko: '목표: 16:24(8점 차)에서 터치다운(6점) + 2점 컨버전(2점)으로 24:24 동점을 만드세요!', en: 'Goal: Trailing 16–24, score a Touchdown (6) + 2-Point Conversion (2) to tie it 24–24!' },
      why: {
        ko: '이제 미식축구 점수가 왜 3점(필드골), 7점(6+1), 8점(6+2)씩 오르는지 완전히 이해했죠? 참고로 상대를 자기 엔드존 안에서 넘어뜨리면 수비팀이 2점을 얻는 "세이프티(Safety)"라는 진귀한 규칙도 있답니다!',
        en: 'Now you know why football scores jump by 3 (Field Goal), 7 (6+1), or 8 (6+2)! Bonus fact: tackling an opponent in their own end zone scores 2 points for the defense (a Safety)!'
      }
    },
    {
      id: 5,
      icon: '⏱️',
      title: { ko: 'Stage 5 · 시계 멈추기 마법과 종료 직전 역전 드라마', en: 'Stage 5 · Stopping the Clock & 2-Minute Comeback' },
      sub: { ko: '종료 1분 20초 전 4점 뒤진 상황! 시계를 멈추는 3가지 마법으로 시간을 아끼며 역전 터치다운을 넣으세요!', en: 'Down by 4 with 1:20 left! Use the 3 clock-stopping rules to save time and score the winning Touchdown!' },
      easyRule: {
        ko: '한줄 규칙: 경기장 한가운데서 잡히면 시계가 계속 흘러요! 시간이 없을 땐 ① 옆선 밖으로 나가기, ② 공 바닥에 찍기(스파이크), ③ 타임아웃으로 시계를 멈춰요!',
        en: 'Key Rule: Getting tackled inbounds keeps the clock ticking! Stop the clock by ① stepping Out of Bounds, ② QB Spike, or ③ Timeout!'
      },
      tutWhat: {
        ko: '경기 종료 직전 시간이 부족할 때 시계를 딱 멈추는 3가지 기술(① 옆선 밖으로 나가기, ② 스파이크, ③ 타임아웃)을 써서 버저비터 역전 터치다운을 만드는 법을 배워요!',
        en: 'Learn the 3 ways to stop the game clock in the final two minutes (① Out of Bounds, ② QB Spike, ③ Timeout) to score a comeback Touchdown!'
      },
      tutWhy: {
        ko: '미식축구는 경기장 안쪽(가운데)에서 태클당하면 다음 줄을 설 때까지 30~40초 동안 시계가 멈추지 않고 계속 흘러가요! 종료 1분 전에는 그렇게 시간이 흐르면 경기가 그대로 끝나버리기 때문에 시계를 멈추는 작전이 필수예요.',
        en: 'When tackled in the middle of the field, the game clock keeps running for 30–40 seconds while teams line up! In the final minute, you must stop the clock to preserve time.'
      },
      tutHow: {
        ko: '코치님의 안내를 따라 ① 옆선(사이드라인) 패스 → ② 공 바닥에 찍기(스파이크) → ③ 타임아웃으로 시계를 멈추면서 마지막 역전 터치다운 패스를 성공시켜 보세요!',
        en: 'Follow Coach’s calls: ① Sideline Pass → ② QB Spike → ③ Timeout to stop the clock, then throw the game-winning Touchdown pass!'
      },
      goal: { ko: '목표: 시계를 멈추며 전진해 시간이 0:00이 되기 전에 역전 터치다운을 성공하세요!', en: 'Goal: Stop the clock and score the winning Touchdown before time runs out!' },
      why: {
        ko: '축하합니다! ① 4번 안에 10야드(퍼스트다운), ② 런 vs 패스, ③ 4번째 기회의 펀트/필드골, ④ 터치다운 6+1/2점, ⑤ 시계 멈추기까지 미식축구의 5대 핵심 규칙을 완벽하게 마스터했어요!',
        en: 'Congratulations! You mastered all 5 core pillars of American football: 4 downs for 10 yards, Run vs Pass, 4th-down kicking, 6+1/2 scoring, and 2-minute clock management!'
      }
    }
  ],
  scorebugItems: [
    {
      id: 'down_dist',
      badge: '1st & 10',
      label: { ko: '몇 번째 기회 & 노란 선까지 남은 거리 (Down & Distance)', en: 'Down & Distance (1st & 10)' },
      desc: {
        ko: '앞 숫자(1st~4th)는 "4번의 기회 중 몇 번째인지", 뒤 숫자는 "노란 선까지 몇 야드 남았는지"예요! 예를 들어 "1st & 10"에서 6야드를 전진하면, 다음엔 "2nd & 4 (2번째 기회, 4야드 남음)"로 바뀌어요. 노란 선을 넘으면 다시 "1st & 10"으로 리셋됩니다!',
        en: 'Shows which try (1st–4th) it is and how many yards remain to reach the Yellow Line. Gain 6 yards on 1st & 10 and it becomes 2nd & 4!'
      }
    },
    {
      id: 'yard_spot',
      badge: 'OWN 35 / OPP 20',
      label: { ko: '현재 공의 위치 (OWN 우리 땅 / OPP 상대 땅)', en: 'Ball Spot (OWN vs OPP Yard Line)' },
      desc: {
        ko: '경기장 길이는 총 100야드(가운데가 50야드)예요. "OWN 35"는 우리 골대에서 35야드 나온 우리 땅이라는 뜻이고, "OPP 20"은 상대 골대(엔드존)까지 딱 20야드밖에 안 남은 절호의 찬스라는 뜻이에요!',
        en: 'The field is 100 yards long (50 is midfield). OWN 35 is in your own half; OPP 20 means you are just 20 yards from the opponent’s End Zone!'
      }
    },
    {
      id: 'red_zone',
      badge: '🚨 RED ZONE',
      label: { ko: '레드존 (상대 엔드존 20야드 안쪽 득점 찬스!)', en: 'Red Zone (Inside Opponent 20-Yard Line)' },
      desc: {
        ko: '상대 골라인까지 20야드 안쪽에 들어오면 TV 전광판에 빨간 불이 켜지며 "RED ZONE"이라고 떠요! 실패해도 최소 3점(필드골)은 차 넣을 수 있는 아주 유리한 득점 지역이에요.',
        en: 'Inside the opponent’s 20-yard line, broadcast graphics flash "RED ZONE"—prime scoring range for a Touchdown or Field Goal!'
      }
    },
    {
      id: 'clocks',
      badge: 'Q4 01:42 · PLAY 25',
      label: { ko: '경기 시계(15분×4쿼터) vs 공격 제한시간(40초)', en: 'Game Clock vs 40s Play Clock' },
      desc: {
        ko: '왼쪽은 이번 쿼터 남은 시간이고, 오른쪽 작은 숫자(40초 또는 25초)는 "공격 시작 제한시간(플레이 클락)"이에요! 농구의 24초 룰처럼, 이 숫자가 0이 되기 전에 다음 공격을 시작하지 않으면 5야드 뒤로 물러나는 벌칙을 받아요.',
        en: 'Left is the quarter clock; right is the 40-second Play Clock. You must start the next play before it hits 0 or lose 5 yards!'
      }
    },
    {
      id: 'blue_line',
      badge: '🔵 파란 선 (출발선)',
      label: { ko: '파란색 출발선 (공이 놓인 자리)', en: 'Blue Line (Line of Scrimmage)' },
      desc: {
        ko: 'TV 화면 바닥에 컴퓨터 그래픽으로 그려주는 파란 선은 "이번 공격을 시작하는 출발선"이에요! 출발 신호(스냅) 전에 이 선을 넘으면 반칙이고, 앞으로 던지는 패스는 무조건 이 파란 선 뒤에서만 던져야 해요.',
        en: 'The virtual Blue Line marks where the ball starts. Neither team can cross it before the snap, and forward passes must be thrown from behind it.'
      }
    },
    {
      id: 'yellow_line',
      badge: '🟡 노란 선 (목표선)',
      label: { ko: '노란색 목표선 (10야드 퍼스트다운 선)', en: 'Yellow Line (First Down Target Line)' },
      desc: {
        ko: '미식축구 중계에서 이것만 보면 돼요! 이번 4번의 기회 안에 넘어야 하는 10야드 목표선이에요. 우리 선수가 공을 들고 이 노란 선을 넘는 순간 새로운 기회 4번(1st & 10)이 다시 생깁니다!',
        en: 'The most important line on TV! Cross this Yellow Line within 4 tries to earn a brand-new set of 4 downs!'
      }
    },
    {
      id: 'goal_to_go',
      badge: '1st & GOAL',
      label: { ko: '앤드 골 (노란 선 대신 엔드존이 바로 코앞!)', en: '1st & Goal (End Zone is the Target!)' },
      desc: {
        ko: '상대 엔드존까지 10야드도 안 남았을 때는 "1st & 8" 대신 "1st & GOAL"이라고 적혀요! 이제는 중간 노란 선이 없고, 바로 상대 엔드존에 들어가서 터치다운을 넣으면 된다는 뜻이에요.',
        en: 'When less than 10 yards remain to the End Zone, the graphic reads "1st & Goal"—meaning the Goal Line itself is the target!'
      }
    },
    {
      id: 'flag_penalty',
      badge: '🟨 FLAG (노란 손수건)',
      label: { ko: '노란 깃발 표시 (심판이 반칙 손수건을 던짐!)', en: 'Yellow Flag (Referee Penalty Marker)' },
      desc: {
        ko: '미식축구 심판은 호루라기 대신 반칙이 일어난 자리에 "노란 주머니 손수건(Flag)"을 휙 던져요! 전광판에 노란색 FLAG가 뜨면 누군가 반칙(출발 전 먼저 움직임 -5야드, 상대 옷 잡아당김 -10야드 등)을 했다는 뜻이에요.',
        en: 'Referees toss a yellow weighted cloth ("Flag") onto the field when they spot a foul! When FLAG flashes on screen, a penalty was called.'
      }
    }
  ],

  cards: [
    { id: 'qb', cat: 'off', code: 'QB', name: { ko: '쿼터백 (공격 대장)', en: 'Quarterback (QB)' }, role: { ko: '우리 팀의 사령관 · 패스를 던지거나 공을 건네주는 대장', en: 'Field General · Passes or Hands Off the Ball' }, desc: { ko: '모든 공격은 쿼터백이 공을 받으면서 시작해요! 뒤에 있는 러닝백에게 공을 건네주어 달리게 하거나, 앞으로 달려간 동료(리시버)에게 멋지게 패스를 던지는 주인공이에요.', en: 'Every play starts in the QB’s hands! He hands off to a runner, throws passes downfield, or runs it himself.' } },
    { id: 'rb', cat: 'off', code: 'RB', name: { ko: '러닝백 (돌파 달리기 선수)', en: 'Running Back (RB)' }, role: { ko: '공을 건네받아 수비 빈틈으로 돌진하는 특공대', en: 'Ball Carrier · Ground Attack' }, desc: { ko: '쿼터백 뒤에 서 있다가 공을 넘겨받자마자 우리 팀 거구들이 열어준 빈틈(Hole)으로 재빠르게 달려 3~6야드씩 땅을 따내는 선수예요.', en: 'Takes handoffs from the QB and bursts through gaps opened by blockers for steady yards.' } },
    { id: 'wr', cat: 'off', code: 'WR', name: { ko: '와이드 리시버 (날쌘 패스 잡기 선수)', en: 'Wide Receiver (WR)' }, role: { ko: '팀에서 제일 발이 빠른 선수 · 멀리 날아온 패스를 캐치!', en: 'Speedy Pass Catcher' }, desc: { ko: '경기장 양쪽 끝에 서 있다가 출발과 동시에 앞으로 쏜살같이 달려가 쿼터백이 던진 긴 패스를 공중에서 낚아채는 선수예요.', en: 'Sprints downfield along routes to get open and catch passes from the Quarterback.' } },
    { id: 'te', cat: 'off', code: 'TE', name: { ko: '타이트엔드 (힘 좋고 공도 잘 잡는 만능 선수)', en: 'Tight End (TE)' }, role: { ko: '몸싸움 길막기 + 중간 거리 패스 잡기를 둘 다 하는 만능맨', en: 'Hybrid Blocker & Receiver' }, desc: { ko: '덩치도 크고 손도 빨라서 달리기 공격 때는 수비를 막아주고, 패스 공격 때는 빈 곳으로 빠져나와 패스를 받아내는 든든한 동료예요.', en: 'Big enough to block defenders on run plays and agile enough to catch passes over the middle.' } },
    { id: 'ol', cat: 'off', code: 'OL', name: { ko: '오펜시브 라인 (쿼터백 보디가드 5인방)', en: 'Offensive Line (5 Blockers)' }, role: { ko: '몸무게 140kg 거구 5명 · 쿼터백을 지키는 든든한 성벽', en: '5 Big Protectors for the QB' }, desc: { ko: '공을 직접 잡거나 달릴 수는 없지만, 상대 수비수들이 우리 대장(쿼터백)을 덮치지 못하게 온몸으로 막아주고 달리기 길을 열어주는 숨은 영웅들이에요.', en: 'Five huge blockers who form a protective wall around the QB and push defenders aside on run plays.' } },
    { id: 'dl', cat: 'def', code: 'DL', name: { ko: '디펜시브 라인 (수비 최전방 돌격대)', en: 'Defensive Line (DL)' }, role: { ko: '쿼터백을 덮치러 달려드는 상대 수비 거구들', en: 'Pass Rushers & Run Stoppers' }, desc: { ko: '우리 보디가드들을 뚫고 들어와 달리는 선수를 넘어뜨리거나, 패스를 던지려는 쿼터백을 덮쳐 색(Sack)을 만드는 무서운 수비수들이에요.', en: 'Charges across the line to stop runners or tackle the Quarterback for a Sack.' } },
    { id: 'lb', cat: 'def', code: 'LB', name: { ko: '라인배커 (수비팀의 대장)', en: 'Linebacker (LB)' }, role: { ko: '수비 중앙을 지키며 달리기도 막고 짧은 패스도 막는 핵심 수비수', en: 'Defensive Leader · Tackles & Coverage' }, desc: { ko: '수비 라인 바로 뒤에서 눈치싸움을 하다가, 달리기가 오면 달려가 태클하고 패스가 오면 길목을 지키는 수비의 중심이에요.', en: 'Patrols the middle of the defense to tackle runners and cover short pass zones.' } },
    { id: 'cb', cat: 'def', code: 'CB', name: { ko: '코너백 (리시버 그림자 마크맨)', en: 'Cornerback (CB)' }, role: { ko: '상대 패스 받는 선수를 1대1로 졸졸 따라다니며 방해하는 수비수', en: '1-on-1 Pass Defender' }, desc: { ko: '발이 아주 빨라서 우리 와이드 리시버 옆에 딱 붙어 달리며 패스를 손으로 쳐내거나 공중에서 가로채기(인터셉트)를 노려요.', en: 'Shadows wide receivers stride-for-stride to swat away passes or grab interceptions.' } },
    { id: 's', cat: 'def', code: 'S', name: { ko: '세이프티 (수비 최후방 문지기)', en: 'Safety (S)' }, role: { ko: '제일 뒤쪽을 지키며 한 방에 뚫리는 롱패스를 막는 최후의 수비수', en: 'Last Line of Defense' }, desc: { ko: '수비 진영 가장 깊은 곳에서 기다리다가 상대가 멀리 터치다운 패스를 던지면 달려와서 막아내는 든든한 최후방 수비수예요.', en: 'Guards deep territory as the final protector against long touchdown throws.' } },
    { id: 'r_downs', cat: 'rule', code: '4DN', name: { ko: '4번 안에 10야드 (퍼스트다운 규칙)', en: '4 Tries for 10 Yards (First Down)' }, role: { ko: '미식축구의 심장 · 10야드만 가면 기회가 다시 4번!', en: 'The Core Rule of Football' }, desc: { ko: '공격팀은 4번의 기회 안에 파란 선에서 노란 선까지 총 10야드를 전진해야 해요. 성공하면 다시 1번째 기회(1st & 10)로 리셋되어 끝까지 갈 수 있어요!', en: 'Gain 10 yards within 4 tries to earn a First Down and reset your chances back to 1st & 10!' } },
    { id: 'r_td', cat: 'rule', code: '6+1/2', name: { ko: '터치다운(6점) + 보너스(1점 또는 2점)', en: 'Touchdown (6) + Bonus (1 or 2)' }, role: { ko: '미식축구에서 한 번에 7점이나 8점이 오르는 이유!', en: 'Why Teams Score 7 or 8 Points at Once' }, desc: { ko: '상대 끝 땅(엔드존)에 공을 가지고 들어가면 6점! 바로 직후 보너스 1번으로 골대에 차 넣으면 +1점(총 7점), 2야드 앞에서 한 번 더 뚫고 들어가면 +2점(총 8점)을 받아요.', en: 'Reach the End Zone for 6 points, then kick for +1 pt (7 total) or run/pass from the 2-yard line for +2 pts (8 total).' } },
    { id: 'r_fg', cat: 'rule', code: 'FG/P', name: { ko: '필드골(3점) vs 펀트(멀리 차 넘기기)', en: 'Field Goal (3 pts) vs Punt' }, role: { ko: '4번째 마지막 기회에 공을 발로 차는 두 가지 이유', en: 'Why Teams Kick on 4th Down' }, desc: { ko: '3번 해보고 노란 선을 못 넘었을 때, 상대 노란 Y자 골대가 가까우면 기둥 사이로 차 넣어서 3점(필드골)을 챙기고, 너무 멀면 뻥 차서(펀트) 상대가 저 멀리서 시작하게 만들어요!', en: 'On 4th down, kick a 3-point Field Goal if close to the uprights, or Punt the ball deep if far away.' } },
    { id: 'r_safety', cat: 'rule', code: 'SAFE', name: { ko: '세이프티 (수비가 따내는 2점 + 공격권!)', en: 'Safety (2 Points for Defense)' }, role: { ko: '자기 팀 골대(엔드존) 안에서 잡히면 상대에게 2점을 헌납!', en: 'Tackled in Your Own End Zone' }, desc: { ko: '공을 가진 공격수가 너무 뒤로 밀려서 자기 팀 엔드존 안에서 태클당하면, 수비팀이 즉석에서 2점을 얻고 공까지 넘겨받는 특별한 규칙이에요!', en: 'If an offensive player is tackled inside his own End Zone, the defense scores 2 points AND gets the ball!' } },
    { id: 'r_turnover', cat: 'rule', code: 'INT', name: { ko: '인터셉트 & 펌블 (공 뺏기기)', en: 'Interception & Fumble (Turnover)' }, role: { ko: '4번의 기회가 끝나지 않았는데도 즉시 공을 뺏기는 순간!', en: 'Instant Change of Possession' }, desc: { ko: '던진 패스를 상대 수비가 공중에서 가로채거나(인터셉트), 들고 달리던 공을 놓쳐서(펌블) 상대가 주우면 그 즉시 공수교대가 돼요!', en: 'If the defense catches your pass (Interception) or recovers a dropped ball (Fumble), they take over immediately!' } },
    { id: 'k_p', cat: 'off', code: 'K/P', name: { ko: '키커 & 펀터 (발차기 전문가)', en: 'Kicker (K) & Punter (P)' }, role: { ko: '4번째 기회에 등장해 발로 공을 차는 스페셜리스트', en: 'Kicking Specialists' }, desc: { ko: '평소엔 벤치에 있다가 4번째 기회에 나와서 3점 필드골을 차 넣거나(키커), 공을 하늘 높이 멀리 차서 상대를 뒤로 밀어내는(펀터) 선수예요.', en: 'Specialists who come onto the field to kick 3-point Field Goals, 1-point PATs, or deep Punts.' } },
    { id: 'kr_pr', cat: 'off', code: 'RET', name: { ko: '리터너 & 페어캐치(안전하게 잡기 손짓)', en: 'Returner & Fair Catch' }, role: { ko: '상대가 멀리 찬 공을 받아서 역습하거나 손을 흔들어 보호받기', en: 'Catches Kicks & Signals Fair Catch' }, desc: { ko: '상대가 찬 공을 잡아서 앞으로 달려요! 만약 상대 수비가 코앞까지 달려와 부딪힐 것 같으면 공중에서 손을 흔들어(페어캐치) 태클당하지 않고 안전하게 잡을 수 있어요.', en: 'Catches punts and kickoffs. Waving a hand overhead calls a Fair Catch—preventing defenders from tackling him.' } },
    { id: 'r_sack', cat: 'rule', code: 'SACK', name: { ko: '색 (Sack · 패스하기 전에 쿼터백이 잡힘!)', en: 'Quarterback Sack' }, role: { ko: '공을 던지려다 우물쭈물하면 뒤로 크게 밀려나요!', en: 'Tackling the QB Behind the Line' }, desc: { ko: '패스를 던지려고 뒤로 물러난 쿼터백이 공을 미처 던지기 전에 수비수에게 붙잡혀 넘어지면 "색(Sack)"이 되어, 잡힌 자리만큼 야드를 잃고 기회도 1번 날아가요!', en: 'If defenders tackle the QB behind the Blue Line before he throws, the offense loses yards and a down!' } },
    { id: 'r_clock', cat: 'rule', code: 'CLK', name: { ko: '시계 멈추기 4가지 마법', en: '4 Ways to Stop the Clock' }, role: { ko: '종료 직전 지고 있을 때 시간을 아끼는 필수 기술!', en: 'Saving Time in the Final Minutes' }, desc: { ko: '경기장 안에서 넘어지면 시계가 계속 가요! 시계를 멈추려면 ① 옆선(사이드라인) 밖으로 나가기, ② 패스가 땅에 떨어지기, ③ 공을 바닥에 찍기(스파이크), ④ 작전타임(타임아웃)을 써야 해요.', en: 'Stop the clock by stepping Out of Bounds, throwing Incomplete, spiking the ball, or calling Timeout!' } },
    { id: 'r_redzone', cat: 'rule', code: 'RED', name: { ko: '레드존 (상대 골대 20야드 앞 황금 구역)', en: 'The Red Zone (Inside Opp 20)' }, role: { ko: '터치다운이나 필드골이 눈앞에 온 찬스!', en: 'Prime Scoring Territory' }, desc: { ko: '상대 엔드존까지 20야드 안쪽에 들어오면 레드존이라고 불러요. 경기장이 좁아져 수비도 빽빽하지만 점수를 낼 확률이 아주 높은 구역이에요.', en: 'Inside the opponent’s 20-yard line, where scoring chances are highest.' } },
    { id: 'r_penalty', cat: 'rule', code: 'FLAG', name: { ko: '자주 나오는 반칙 3가지', en: '3 Most Common Penalties' }, role: { ko: '심판이 노란 손수건(Flag)을 던지는 대표 이유', en: 'Why Refs Throw Yellow Flags' }, desc: { ko: '① 폴스 스타트: 출발 신호 전에 공격수가 먼저 움찔함(5야드 후퇴) ② 홀딩: 상대 선수의 옷이나 몸을 손으로 잡아당김(10야드 후퇴) ③ 패스 방해: 날아오는 공을 잡기 전에 상대를 밀침.', en: '① False Start (moving early, -5 yds) ② Holding (grabbing a jersey, -10 yds) ③ Pass Interference (pushing a receiver before the ball arrives).' } }
  ],

  quiz: [
    {
      q: { ko: 'TV 중계 전광판에 "2nd & 6"라고 적혀 있어요. 무슨 뜻일까요?', en: 'The TV scoreboard says "2nd & 6". What does this mean?' },
      opts: [
        { ko: '4번의 기회 중 2번째 기회이고, 노란 선(퍼스트다운)까지 6야드 남았다!', en: '2nd try out of 4, with 6 yards left to reach the Yellow Line!' },
        { ko: '2쿼터 종료까지 6분 남았다', en: '2nd quarter with 6 minutes remaining' },
        { ko: '2점짜리 슛을 6번 쏠 수 있다', en: 'You get six tries to score 2 points' }
      ],
      ans: 0,
      exp: { ko: '정답! 앞 숫자(2nd)는 몇 번째 기회인지, 뒤 숫자(6)는 노란 목표선까지 몇 야드 남았는지를 뜻해요!', en: 'Correct! The first number is the current try (down), and the second number is the yards needed to cross the Yellow Line!' }
    },
    {
      q: { ko: '초보자가 제일 궁금해하는 상황! 우리 골대 근처(우리 땅 25야드)에서 마지막 4번째 기회(4th & 9)가 되었을 때 왜 공을 발로 멀리 뻥 차버릴까요(펀트)?', en: 'On 4th & 9 deep in your own territory (OWN 25), why do teams kick the ball far away (Punt)?' },
      opts: [
        { ko: '4번째에 실패하면 바로 그 자리에서 공을 뺏기니까, 차라리 멀리 차서 상대가 저 멀리서 시작하게 하려고!', en: 'Because failing on 4th down gives the ball away right there—punting pushes the opponent far back!' },
        { ko: '발로 차면 무조건 10점을 주기 때문에', en: 'Because kicking from your own half gives 10 bonus points' },
        { ko: '원래 4번째에는 패스나 달리기가 규칙상 금지되어 있어서', en: 'Because running or passing on 4th down is illegal' }
      ],
      ans: 0,
      exp: { ko: '정답! 4번째 기회에 노란 선을 못 넘으면 그 자리에서 상대에게 공을 뺏겨요! 그래서 우리 진영 깊숙한 곳에선 안전하게 펀트(멀리 차기)로 상대를 밀어낸답니다.', en: 'Correct! Failing on 4th down turns the ball over on the spot, so teams punt to push the opponent deep into their own half.' }
    },
    {
      q: { ko: '방금 터치다운(+6점)을 넣어서 점수가 22 : 24(우리가 2점 뒤짐)가 되었어요! 이어지는 보너스 기회에서 동점(24 : 24)을 만들려면 무엇을 골라야 할까요?', en: 'Right after a 6-point Touchdown, the score is 22–24 (you trail by 2). Which bonus try ties the game at 24–24?' },
      opts: [
        { ko: '✌️ 2점 컨버전 (골대 2야드 앞에서 한 번 더 뚫고 들어가 +2점!)', en: '✌️ 2-Point Conversion (one more play from the 2-yard line for +2 pts!)' },
        { ko: '🦵 1점 킥 (안전하게 골대 기둥 사이로 차서 +1점)', en: '🦵 1-Point Kick (+1 pt kick through the uprights)' },
        { ko: '🦵 펀트 (멀리 차 넘기기, 0점)', en: '🦵 Punt (0 pts)' }
      ],
      ans: 0,
      exp: { ko: '정답! 터치다운(6점) 직후 2점 컨버전(+2점)에 성공하면 한 번의 공격으로 총 8점(6+2)을 얻어 24:24 동점을 만들 수 있어요!', en: 'Correct! A 6-point Touchdown plus a 2-Point Conversion gives 8 points total—tying a 22–24 game at 24–24!' }
    },
    {
      q: { ko: '경기 종료 50초 전! 우리가 지고 있어서 시계를 멈춰야 해요. 다음 중 시계가 멈추지 않고 계속 흘러가는 행동은?', en: 'With 0:50 left and trailing, you need to stop the clock. Which action does NOT stop the clock?' },
      opts: [
        { ko: '경기장 한가운데(안쪽)에서 상대 수비에게 붙잡혀 넘어지기', en: 'Getting tackled in the middle of the field (inbounds)' },
        { ko: '공을 들고 경기장 옆선(사이드라인) 밖으로 걸어 나가기', en: 'Running Out of Bounds over the sideline' },
        { ko: '타임아웃(작전타임) 부르기 또는 공을 바닥에 찍기(스파이크)', en: 'Calling a Timeout or spiking the ball' }
      ],
      ans: 0,
      exp: { ko: '정답! 경기장 안쪽 한가운데서 태클당하면 시계가 멈추지 않고 계속 흘러가요! 시간이 없을 땐 옆선 밖으로 나가거나 타임아웃/스파이크를 써야 해요.', en: 'Correct! Being tackled inbounds keeps the clock running! Use the sidelines, a spike, or a timeout to stop it.' }
    },
    {
      q: { ko: '앞으로 공을 던지는 "패스(Forward Pass)"에 대한 설명 중 맞는 것은?', en: 'Which statement about throwing a Forward Pass is TRUE?' },
      opts: [
        { ko: '한 번의 공격에 딱 1번, 파란 출발선 뒤에서만 앞으로 던질 수 있고 땅에 떨어지면 0야드(기회 1번 소모)가 된다', en: 'Allowed once per play from behind the Blue Line, and if it hits the ground it gains 0 yards (Incomplete)' },
        { ko: '공이 땅에 원바운드로 튀어도 주워서 계속 달릴 수 있다', en: 'Even if the pass bounces on the ground, receivers can pick it up and keep running' },
        { ko: '쿼터백이 파란 출발선을 한참 넘어간 뒤에도 앞으로 패스할 수 있다', en: 'The QB can run 15 yards past the Blue Line and still throw a forward pass' }
      ],
      ans: 0,
      exp: { ko: '정답! 앞으로 던지는 패스는 파란 출발선 뒤에서 딱 1번만 던질 수 있고, 선수가 공중에서 잡지 못해 땅에 닿으면 그 즉시 0야드(인컴플리트)로 멈춰요!', en: 'Correct! Forward passes must be thrown from behind the Blue Line, and if the ball hits the ground un-caught, it is an Incomplete pass for 0 yards!' }
    }
  ]
};
