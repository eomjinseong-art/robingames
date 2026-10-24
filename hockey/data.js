/* Nadoo Ice Hockey 101 — Easy Beginner Bilingual Data */
'use strict';
var HK_DATA = {
  primer: [
    {
      step: '1 / 5',
      icon: '🏒',
      title: { ko: '1. 아이스하키는 어떤 스포츠인가요?', en: '1. What is Ice Hockey?' },
      body: {
        ko: '한마디로 "얼음판 위에서 하는 6대6 초고속 축구"예요! 골키퍼(골리) 1명과 스케이트 선수 5명이 한 팀이 되어, 스틱으로 납작한 고무공(퍽)을 쳐서 상대 골대에 넣으면 1점을 얻어요. 경기장 둘레에 둥근 벽(보드)이 있어서 공이 밖으로 잘 안 나가고, 축구와 달리 골대 뒤쪽 공간으로도 다닐 수 있어요!',
        en: 'Think of it as 6-on-6 high-speed soccer on ice! 1 goalie and 5 skaters use sticks to shoot a rubber puck into the opponent net for 1 point. Rounded boards keep the puck in play, and you can even skate BEHIND the net!'
      }
    },
    {
      step: '2 / 5',
      icon: '🎨',
      title: { ko: '2. 얼음판 위 선 3개(🔵파란 선 - 🔴빨간 선 - 🔵파란 선)의 비밀!', en: '2. The Secret of the 3 Lines (🔵Blue - 🔴Red - 🔵Blue)' },
      body: {
        ko: '얼음 위는 시속 40km가 넘을 만큼 엄청나게 빨라요! 그래서 얌체 같은 플레이를 막으려고 바닥에 선을 긋고 딱 2가지 핵심 규칙(파란 선 오프사이드, 빨간 선 아이싱)을 만들었답니다. 이 두 선만 알면 하키 중계가 한눈에 보여요!',
        en: 'Because hockey is super fast, three lines divide the rink to prevent cheap plays: two Blue Lines (Offside rule) and one Center Red Line (Icing rule). Understand these two lines and you understand hockey!'
      }
    },
    {
      step: '3 / 5',
      icon: '🔵',
      title: { ko: '3. 🔵 파란 선 규칙 = 오프사이드 (미리 가서 기다리기 금지!)', en: '3. 🔵 Blue Line Rule = Offside (No Camping Ahead!)' },
      body: {
        ko: '상대방 진영으로 넘어가는 경계선이 "파란 선"이에요. 우리 공격수가 공(퍽)보다 먼저 파란 선을 넘어가서 기다리고 있으면 반칙(오프사이드)이에요! 무조건 "공(퍽)이 먼저 파란 선을 넘고, 사람은 그다음에" 넘어가야 해요!',
        en: 'The attacking Blue Line is the entrance to the opponent zone. Your teammates CANNOT cross the blue line before the puck does! Always remember: "Puck crosses first, players cross second!"'
      }
    },
    {
      step: '4 / 5',
      icon: '🔴',
      title: { ko: '4. 🔴 가운데 빨간 선 규칙 = 아이싱 (멀리 뻥 치기 금지!)', en: '4. 🔴 Center Red Line Rule = Icing (No Lazy Long Clears!)' },
      body: {
        ko: '수비하다가 힘들다고 우리 땅(가운데 빨간 선 뒤)에서 공을 상대방 끝까지 무작정 뻥 쳐버리면 반칙(아이싱)이에요! 벌칙으로 공을 다시 우리 골대 앞으로 가져와서 시작해요. 해결법은 간단해요: "가운데 빨간 선을 먼저 넘은 다음에" 공을 보내면 OK!',
        en: 'You cannot just whack the puck from behind the center red line all the way past the opponent goal line (that is Icing!). Cross the center red line first, then you can shoot or dump it in freely!'
      }
    },
    {
      step: '5 / 5',
      icon: '⏳',
      title: { ko: '5. 2분 감옥(파워플레이) & 실시간 교체 & 골키퍼 빼기!', en: '5. 2-Min Penalty Box, Flying Changes & Pulling the Goalie' },
      body: {
        ko: '① 반칙하면 퇴장이 아니라 "2분 감옥(페널티 박스)"에 갇혀요! 그동안 우리 5명 vs 상대 4명(파워플레이)으로 공격해요.\n② 너무 힘들어서 45초마다 경기가 안 멈춰도 문을 열고 선수를 바로 바꿔요!\n③ 끝나기 1분 전 지고 있으면 우리 골키퍼를 빼고 공격수 6명(6대5)이 총공격해요!',
        en: '1) Foul = 2 minutes in the Penalty Box, giving the other team a 5-on-4 Power Play!\n2) Tired players swap at the bench every 45 seconds while play continues!\n3) Trailing with 1 minute left? Pull the goalie for 6 attackers!'
      }
    }
  ],
  stages: [
    {
      id: 1,
      icon: '🔵',
      title: { ko: '1단계 · 파란 선 규칙 (오프사이드)', en: 'Stage 1 · Blue Line Rule (Offside)' },
      easyRule: {
        ko: '공(퍽)이 사람보다 먼저 파란 선을 넘어야 해요! 사람이 공보다 먼저 넘어가면 반칙(오프사이드)!',
        en: 'The puck must cross the blue line BEFORE your players! If a player crosses first, it is Offside!'
      },
      tutWhat: {
        ko: '상대방 땅 입구에 그어진 "파란 선"을 넘을 때는 반드시 공(퍽)이 사람보다 먼저 넘어가야 해요(온사이드). 만약 우리 팀 선수가 공보다 먼저 파란 선 너머에 들어가 있으면 심판이 호루라기를 불며 반칙(오프사이드)을 선언해요!',
        en: 'When entering the attacking zone across the Blue Line, the puck must cross the line before any attacking player. If a teammate crosses ahead of the puck, the referee blows the whistle for Offside!'
      },
      tutWhy: {
        ko: '만약 이 규칙이 없다면, 공격수가 아예 상대 골키퍼 코앞에 미리 가서 서 있다가 패스만 받아서 쉽게 골을 넣겠죠? 그런 얌체 플레이를 막기 위해 만들어진 규칙이에요!',
        en: 'Without this rule, attackers would just camp right in front of the opposing goalie all game waiting for long passes!'
      },
      tutHow: {
        ko: '① 먼저 공을 가진 선수가 파란 선을 넘어 들어가고 → ② 파란 선 앞에 있는 동료에게 패스한 뒤 → ③ 빈 골문 구석을 골라 슛을 쏘면 클리어!',
        en: '1) Skate the puck across the blue line first -> 2) Pass to an onside teammate -> 3) Aim at the open corner of the net to score!'
      },
      sub: {
        ko: '공(퍽)이 사람보다 먼저 파란 선을 넘어야 해요! 공을 먼저 몰고 들어가서 시원하게 첫 골을 넣어볼까요?',
        en: 'The puck must cross the blue line before your teammates! Carry the puck in first and score!'
      },
      goal: {
        ko: '목표: 공(퍽)을 사람보다 먼저 파란 선 너머로 보낸 뒤 골 넣기!',
        en: 'Goal: Send the puck across the blue line before your players, then score!'
      },
      why: {
        ko: '왜 이런 규칙이 있을까요? 만약 공격수가 상대 골문 앞에 미리 가서 기다리기만 하면 게임이 재미없겠죠! 그래서 "공(퍽)이 파란 선을 먼저 넘은 다음에만 공격수가 들어갈 수 있다"는 파란 선 규칙(오프사이드)이 있답니다.',
        en: 'Why does this rule exist? Without it, attackers would just camp right in front of the goalie! So the puck must always cross the attacking blue line before any attacker does.'
      }
    },
    {
      id: 2,
      icon: '🔴',
      title: { ko: '2단계 · 빨간 선 규칙 (아이싱)', en: 'Stage 2 · Red Line Rule (Icing)' },
      easyRule: {
        ko: '우리 땅(가운데 빨간 선 뒤)에서 공을 끝까지 뻥 차버리면 반칙(아이싱)! 가운데 빨간 선을 먼저 넘은 다음에 보내요!',
        en: 'Do not shoot the puck all the way down from behind the center red line (Icing)! Cross the red line first!'
      },
      tutWhat: {
        ko: '경기장 정중앙에 있는 "빨간 선"을 넘기 전에 공을 상대방 끝(골라인 뒤)까지 멀리 보내버리면 "아이싱(Icing)" 반칙이 돼요! 반칙을 하면 공을 다시 우리 골대 앞으로 가져와서 시작해야 해요.',
        en: 'Shooting the puck from behind the Center Red Line all the way past the opponent goal line untouched is an Icing foul, bringing the faceoff all the way back to your own goal!'
      },
      tutWhy: {
        ko: '수비하는 팀이 힘들 때마다 자기 골대 앞에서 공을 무작정 저 멀리 뻥뻥 쳐버리면 경기가 계속 끊기고 지루해지겠죠? 그래서 최소한 가운데 빨간 선까지는 직접 달려서 넘어가게 한 거예요!',
        en: 'If defenders could endlessly whack the puck down the ice whenever they got tired, the game would stall. Forcing players to cross the red line keeps the action moving!'
      },
      tutHow: {
        ko: '① 먼저 가운데 빨간 선을 넘어간 뒤 → ② 구석으로 공을 보내 잡은 다음 → ③ 골문 앞 빈 동료에게 패스해서 골을 넣어보세요!',
        en: '1) Skate past the center red line first -> 2) Chase the puck into the corner -> 3) Pass to the open teammate in front of the net and score!'
      },
      sub: {
        ko: '우리 땅에서 공을 끝까지 멀리 보내면 반칙(아이싱)이에요! 가운데 빨간 선을 먼저 넘은 뒤 패스해서 골을 넣어요.',
        en: 'Firing the puck all the way from your half is a foul (Icing). Skate past the center red line first!'
      },
      goal: {
        ko: '목표: 가운데 빨간 선을 먼저 넘은 뒤 동료에게 패스해 골 넣기!',
        en: 'Goal: Cross the center red line first, pass to an open teammate, and score!'
      },
      why: {
        ko: '왜 멀리 뻥 치면 안 될까요? 수비하는 팀이 힘들다고 자기 땅에서 공을 무조건 저 멀리 뻥뻥 쳐버리면 경기가 자꾸 멈추고 지루해져요. 그래서 "가운데 빨간 선을 넘은 뒤에만 멀리 보낼 수 있다"는 빨간 선 규칙(아이싱)이 있어요!',
        en: 'If tired defenders could just launch the puck down the ice from their own zone all game, it would be boring. So you must cross the center red line before shooting it deep!'
      }
    },
    {
      id: 3,
      icon: '⏳',
      title: { ko: '3단계 · 2분 감옥과 5대4 공격 (파워플레이)', en: 'Stage 3 · 2-Min Penalty Box & 5-on-4 Attack' },
      easyRule: {
        ko: '상대가 반칙하면 2분 동안 감옥(페널티 박스)에 갇혀요! 우리가 5명 대 4명으로 많을 때 빈 동료에게 패스해 골!',
        en: 'When an opponent fouls, they sit in the Penalty Box for 2 minutes! Attack 5-on-4 and score!'
      },
      tutWhat: {
        ko: '상대 선수가 발을 걸거나 스틱으로 방해하는 반칙을 하면 2분 동안 경기장 위쪽 "감옥(페널티 박스)"에 들어가 있어야 해요! 그동안 우리 팀은 5명, 상대 팀은 4명이 되어 우리가 1명 더 많은 유리한 공격 시간(파워플레이)이 시작됩니다.',
        en: 'When an opponent commits a minor foul, they sit in the Penalty Box for 2 minutes. Your team gets a 5-on-4 man-advantage called a Power Play!'
      },
      tutWhy: {
        ko: '축구의 옐로카드는 경고만 주지만, 하키는 반칙한 선수를 2분 동안 실제로 빼버려서 반칙하지 못하게 막고 더 많은 골이 터지게 만들어요! (우리가 골을 넣으면 감옥에 있던 선수는 즉시 풀려나요.)',
        en: 'Sitting the offending player for 2 minutes creates exciting scoring chances. If your 5-on-4 Power Play scores a goal, the 2-minute penalty ends immediately and the player returns!'
      },
      tutHow: {
        ko: '5대4로 우리가 1명 더 많으니 혼자 무리하지 말고, 초록색 원으로 표시된 "수비가 없는 빈 동료"에게 패스를 두 번 돌린 뒤 골을 넣어보세요!',
        en: 'Since you have 5 skaters against 4 defenders, one teammate is always wide open! Pass to the open green-ring teammates and fire it into the net!'
      },
      sub: {
        ko: '상대가 반칙해서 2분 감옥에 갔어요! 우리가 5명 대 4명으로 한 명 더 많을 때 빈 동료를 찾아 골을 넣어요.',
        en: 'An opponent is in the 2-minute penalty box! Use your 5-on-4 advantage to find the open teammate and score!'
      },
      goal: {
        ko: '목표: 5명 대 4명 찬스(파워플레이)에서 빈 동료에게 패스해 골 넣기!',
        en: 'Goal: Pass to the open teammate during the 5-on-4 Power Play and score!'
      },
      why: {
        ko: '하키에서는 발을 걸거나 스틱으로 잡는 반칙을 하면 2분 동안 경기장 밖 작은 방(페널티 박스)에 갇혀요! 그동안 우리 팀은 5명, 상대는 4명이라 골 넣기 아주 좋은 찬스(파워플레이)가 됩니다. 우리가 골을 넣으면 감옥에 있던 상대 선수도 바로 풀려나요!',
        en: 'When a player commits a minor foul, they sit in the penalty box for 2 minutes. Your team attacks 5-on-4 (Power Play), and if you score, the penalized player comes right back out!'
      }
    }
  ]
};
HK_DATA.stages.push(
  {
    id: 4,
    icon: '🔁',
    title: { ko: '4단계 · 달리는 중 선수 교체 & 골키퍼 빼기', en: 'Stage 4 · Change While Playing & Pull Goalie' },
    easyRule: {
      ko: '하키는 엄청 힘들어서 경기 도중 문을 열고 선수를 바로 바꿔요! 끝나기 직전 지고 있으면 골키퍼를 빼고 공격수 6명이 총공격!',
      en: 'Players get tired in 45 seconds, so they swap during play! Trailing late? Pull the goalie for 6 attackers!'
    },
    tutWhat: {
      ko: '① 하키는 경기가 멈추지 않아도 벤치 문을 열고 달리는 도중에 선수를 실시간으로 교체해요(플라잉 체인지)!\n② 경기 끝나기 1분 전 1점 지고 있으면, 우리 골키퍼를 벤치로 빼고 대신 공격수를 1명 더 넣어 6명 대 5명으로 총공격을 펼쳐요!',
      en: '1) Players swap at the bench every 45 seconds while the game clock keeps running (Flying Change)!\n2) Trailing by 1 in the final minute, coaches pull the goalie to put a 6th attacker on the ice!'
    },
    tutWhy: {
      ko: '얼음 위에서 전속력으로 부딪히며 달리면 45초 만에 체력이 바닥나기 때문이에요! 그리고 어차피 1점 지면 끝나는 마지막 1분에는 우리 골문이 텅 비는(엠프티 넷) 위험을 감수하고서라도 6명이 공격해 동점을 노리는 거랍니다.',
      en: 'Full-speed skating drains stamina in under a minute. And when losing with 1 minute left, risking an empty net for a 6-on-5 advantage is the best chance to tie the game!'
    },
    tutHow: {
      ko: '① 먼저 지친 선수들을 아래쪽 벤치에서 교체해 체력을 100%로 채우고 → ② 종료 1분 전 골키퍼를 빼서 6대5를 만든 뒤 → ③ 남는 빈 동료에게 패스해 동점골을 넣으세요!',
      en: '1) Swap tired players at the bottom bench for 100% stamina -> 2) Pull the goalie with 1:00 left for 6-on-5 -> 3) Pass to the extra open attacker and score!'
    },
    sub: {
      ko: '체력이 바닥난 선수를 경기 중에 바로 바꾸고, 끝나기 1분 전 골키퍼를 빼서 공격수 6명이 다 같이 총공격해요!',
      en: 'Swap tired players on the fly, then pull your goalie in the final minute for a 6-on-5 comeback goal!'
    },
    goal: {
      ko: '목표: 지친 선수를 벤치에서 교체하고, 골키퍼 대신 6명이 공격해 극적인 동점골 넣기!',
      en: 'Goal: Swap tired players at the bench, then attack with 6 skaters to score the tying goal!'
    },
    why: {
      ko: '얼음 위를 전속력으로 달리면 45초 만에 숨이 턱 끝까지 차올라요! 그래서 심판이 경기를 멈추지 않아도 벤치 문을 열고 달리는 중에 선수를 바로 바꿉니다. 또 경기 끝나기 1분 전에 1점 지고 있으면, 우리 골키퍼를 빼고 공격수를 1명 더 넣어 6명 대 5명으로 마지막 승부를 걸어요!',
      en: 'Skating full speed is exhausting, so players change every 45 seconds while the clock runs! And when trailing by 1 goal with a minute left, coaches pull the goalie to put 6 attackers on the ice!'
    }
  },
  {
    id: 5,
    icon: '🏆',
    title: { ko: '5단계 · 골대 뒤 비밀 공간 & 연장 승부차기', en: 'Stage 5 · Behind the Net & Overtime Shootout' },
    easyRule: {
      ko: '하키는 골대 뒤로도 다닐 수 있어요! 골대 뒤에서 패스해 골을 넣고, 비기면 3대3 연장전 → 1대1 승부차기!',
      en: 'You can skate BEHIND the net in hockey! Pass from behind the net, then win in 3-on-3 OT and Shootout!'
    },
    tutWhat: {
      ko: '① 하키 골대는 벽에서 떨어져 있어서 골대 뒤쪽 공간(일명 그레츠키 오피스)으로도 공을 몰고 다닐 수 있어요!\n② 3피리어드가 동점으로 끝나면 5분 동안 넓은 얼음판에서 3명 대 3명 연장전(먼저 골 넣으면 즉시 끝!)을 하고, 그래도 비기면 1대1 승부차기(슛아웃)를 해요!',
      en: '1) You can skate behind the goal net to set up passes!\n2) If tied after 3 periods, teams play 5 minutes of wide-open 3-on-3 sudden-death Overtime, followed by a 1-on-1 Shootout!'
    },
    tutWhy: {
      ko: '골대 뒤에 숨어서 패스를 준비하면 골키퍼가 고개를 계속 돌려야 해서 빈틈이 크게 생겨요! 또 연장전을 5대5 대신 3대3으로 하는 이유는 경기장을 넓게 써서 박진감 넘치는 골이 빨리 나오게 하기 위해서예요.',
      en: 'Passing from behind the net forces the goalie to look backward, opening huge gaps! And 3-on-3 Overtime opens up the ice for thrilling breakaways.'
    },
    tutHow: {
      ko: '① 골대 뒤 공간으로 가서 골문 앞 동료에게 패스해 골을 넣고 → ② 어시스트 보너스 퀴즈를 맞힌 뒤 → ③ 3대3 연장과 1대1 승부차기에서 결승골을 넣어 우승하세요!',
      en: '1) Go behind the net and pass to the slot for a goal -> 2) Answer the assist bonus question -> 3) Win the game in 3-on-3 OT and the 1-on-1 Shootout!'
    },
    sub: {
      ko: '축구와 달리 골대 뒤로도 다닐 수 있어요! 골대 뒤 패스 → 3대3 연장전 → 1대1 승부차기로 우승 트로피를 들어 올려요!',
      en: 'Skate behind the net to set up a goal, then battle through 3-on-3 Overtime and a 1-on-1 Shootout!'
    },
    goal: {
      ko: '목표: 골대 뒤에서 패스해 골을 넣고, 연장전과 1대1 승부차기에서 최종 우승하기!',
      en: 'Goal: Score from behind the net, then win the game in the 1-on-1 Shootout!'
    },
    why: {
      ko: '아이스하키는 골대가 벽에서 떨어져 있어서 골대 뒤로도 자유롭게 다닐 수 있어요! 골키퍼는 등 뒤가 안 보여서 골대 뒤에서 패스하면 골 넣기가 훨씬 쉽답니다. 3피리어드가 동점이면 3대3 연장전(먼저 골 넣으면 즉시 승리!)을 하고, 그래도 비기면 1대1 승부차기(슛아웃)로 승자를 가려요!',
      en: 'In hockey there is space behind the goal! Passing from behind the net forces the goalie to turn around. Tied after 3 periods? Play 5 minutes of 3-on-3 sudden-death OT, then a 1-on-1 Shootout!'
    }
  }
);
HK_DATA.scorebugItems = [
  { badge: '2nd 12:34', label: { ko: '피리어드(전·중·후반) & 남은 시간', en: 'Period & Time Remaining' }, desc: { ko: '아이스하키는 20분씩 총 3번(1·2·3피리어드) 경기를 해요. 심판이 호루라기를 불 때마다 시계가 딱 멈춘답니다!', en: 'A hockey game has three 20-minute periods. Whenever the referee blows the whistle, the clock stops!' } },
  { badge: 'PP 1:48', label: { ko: '파워플레이 (우리가 1명 더 많은 찬스!)', en: 'Power Play (5-on-4 Advantage!)' }, desc: { ko: '상대 선수가 반칙해서 2분 감옥(페널티 박스)에 들어가 있는 남은 시간이에요! 우리가 5명 대 4명으로 공격하며, 골을 넣으면 상대 선수는 바로 감옥에서 나와요.', en: 'Time remaining while an opponent is in the penalty box. Your team attacks 5-on-4! Scoring ends a 2-minute penalty right away.' } },
  { badge: 'SOG 24', label: { ko: '유효 슈팅 수 (골문으로 정확히 날아간 슛)', en: 'Shots on Goal (SOG)' }, desc: { ko: '골키퍼가 막아냈거나 실제 골이 된 정확한 슛 횟수예요. 옆으로 빗나가거나 골대 기둥을 맞고 튕긴 슛은 안 세요!', en: 'Counts shots that either went in for a goal or were saved by the goalie. Shots that miss or hit the post do not count.' } },
  { badge: 'EN', label: { ko: '골키퍼 빼고 총공격 (엠프티 넷)', en: 'Empty Net (Goalie Pulled)' }, desc: { ko: '경기 막판 지고 있는 팀이 우리 골키퍼를 벤치로 빼고 공격수 1명을 더 넣었다는 표시예요! 우리 골문이 텅 비어 있어서 아슬아슬해요.', en: 'Shows that a trailing team pulled its goalie off the ice to add a 6th attacker, leaving its own net completely empty!' } },
  { badge: '🔵 파란 선', label: { ko: '공격 지역 입구 파란 선 (오프사이드 기준선)', en: 'Blue Line (Offside Rule Line)' }, desc: { ko: '상대방 진영으로 들어가는 입구 선이에요! 무조건 "공(퍽)이 사람보다 먼저" 이 파란 선을 넘어야 반칙(오프사이드)이 아니에요.', en: 'Marks the entrance to the attacking zone. The puck must always cross this blue line before any attacking player!' } },
  { badge: '🔴 중앙 빨간 선', label: { ko: '경기장 한가운데 선 (아이싱 기준선)', en: 'Center Red Line (Icing Rule Line)' }, desc: { ko: '경기장을 반으로 나누는 가운데 선이에요. 이 빨간 선을 넘기 전에 공을 상대방 끝까지 뻥 차버리면 반칙(아이싱)이 돼요!', en: 'Divides the rink in half. You must skate past this red line before shooting the puck all the way to the far end!' } },
  { badge: '⭕ 페이스오프 원', label: { ko: '공 떨어뜨려 시작하는 점 (페이스오프)', en: 'Faceoff Circles & Dots' }, desc: { ko: '경기가 멈춘 뒤 다시 시작할 때, 심판이 두 팀 선수 사이에 공(퍽)을 툭 떨어뜨리는 9개의 동그란 점이에요!', en: 'Whenever play stops, the referee drops the puck between two players at one of the 9 faceoff dots on the ice.' } },
  { badge: '🥅 파란 반원', label: { ko: '골키퍼 전용 집 (골 크리스)', en: 'Goalie Home Area (Goal Crease)' }, desc: { ko: '골문 바로 앞 하늘색 반원 구역이에요. 골키퍼가 안전하게 공을 막을 수 있는 보호 구역이라 공격수가 골키퍼를 밀치면 골이 취소돼요!', en: 'The light-blue semicircle right in front of the net. It protects the goalie—if an attacker pushes the goalie here, a goal will not count!' } }
];

HK_DATA.cards = [
  { code: 'C', name: { ko: '가운데 공격 대장 (센터 · Center)', en: 'Center (C) · Middle Playmaker' }, role: { ko: '경기 시작 공 뺏기 · 공격과 수비 연결', en: 'Takes faceoffs & connects offense/defense' }, desc: { ko: '경기장 한가운데에서 뛰는 핵심 공격수예요! 심판이 떨어뜨리는 공(페이스오프)을 가장 먼저 뺏고, 동료들에게 패스를 나눠주며 수비까지 돕는 만능 선수랍니다.', en: 'Plays in the middle of the ice, takes faceoffs when the ref drops the puck, sets up teammates with passes, and helps defend.' } },
  { code: 'LW/RW', name: { ko: '양옆 날개 공격수 (윙어 · Winger)', en: 'Wingers (LW / RW) · Side Scorers' }, role: { ko: '왼쪽·오른쪽 빠른 돌파와 슛!', en: 'Fast side attacks & goal scoring' }, desc: { ko: '왼쪽(LW)과 오른쪽(RW)을 빠르게 달리며 패스를 받아 골문으로 슛을 날리는 득점 사냥꾼이에요!', en: 'Speedy forwards on the left and right wings who race down the boards, take passes, and fire shots at the net.' } },
  { code: 'D', name: { ko: '든든한 수비수 2명 (디펜스맨)', en: 'Defensemen (D) · Blue-Line Guards' }, role: { ko: '우리 골문 지키기 · 파란 선 앞 장거리 강슛', en: 'Stop opponents & fire shots from the blue line' }, desc: { ko: '우리 골문 앞에서 상대를 막아내고, 공격할 때는 파란 선 바로 앞을 지키며 밖으로 나오는 공을 잡아 시원한 장거리 슛을 쏴요!', en: 'Two defenders who protect your goal and stand just inside the blue line on offense to keep the puck in and fire long shots.' } },
  { code: 'G', name: { ko: '골키퍼 (골리 · Goalie)', en: 'Goaltender (Goalie · G)' }, role: { ko: '두꺼운 갑옷을 입은 최후의 수호신', en: 'heavily padded net guardian' }, desc: { ko: '시속 150km로 날아오는 고무공(퍽)을 온몸으로 막아내는 수호신이에요! 경기 막판에 지고 있으면 벤치로 나가고 공격수에게 자리를 양보하기도 해요.', en: 'Wears thick pads to block fast pucks! In the final minute when trailing, the goalie can skate to the bench so a 6th attacker can come on.' } },
  { code: 'OFF', name: { ko: '파란 선 반칙 (오프사이드 · Offside)', en: 'Offside (Blue Line Rule)' }, role: { ko: '공(퍽)이 사람보다 먼저 파란 선을 넘어야 해요!', en: 'Puck must cross the blue line before players!' }, desc: { ko: '우리 팀 공격수가 공보다 먼저 상대쪽 파란 선을 넘어가면 반칙! 심판이 호루라기를 불고 파란 선 밖에서 다시 시작해요.', en: 'If an attacking player crosses the opponent blue line before the puck does, the referee stops play for a faceoff outside the zone.' } },
  { code: 'ICE', name: { ko: '빨간 선 반칙 (아이싱 · Icing)', en: 'Icing (Center Red Line Rule)' }, role: { ko: '우리 땅에서 끝까지 무작정 멀리 치기 금지!', en: 'No firing the puck all the way from your half!' }, desc: { ko: '가운데 빨간 선을 넘기 전에 공을 멀리 쳐서 상대방 골라인 뒤까지 넘기면 반칙! 벌칙으로 우리 골문 앞까지 돌아와서 다시 시작해요.', en: 'Shooting the puck from behind the center red line past the far goal line is a foul that brings the faceoff back to your own goal.' } },
  { code: 'BOX2', name: { ko: '2분 감옥 벌칙 (마이너 페널티)', en: '2-Minute Penalty Box (Minor)' }, role: { ko: '반칙하면 2분 동안 감옥 방에 갇혀요!', en: 'Sit in the penalty box for 2 minutes!' }, desc: { ko: '상대 발을 걸거나 스틱으로 방해하면 2분 동안 감옥(페널티 박스)에 갇혀요. 그동안 상대 팀이 골을 넣으면 벌칙이 끝나고 바로 나올 수 있어요!', en: 'Tripping or hooking sends a player to the penalty box for 2 minutes. If the other team scores during those 2 minutes, the player is released!' } },
  { code: 'PP', name: { ko: '5대4 찬스 공격 (파워플레이)', en: 'Power Play (5-on-4 Advantage)' }, role: { ko: '상대가 감옥에 간 동안 5명 대 4명으로 공격!', en: 'Attacking with 5 skaters against 4!' }, desc: { ko: '상대 선수가 2분 감옥에 가 있는 동안 우리가 5명 대 4명으로 한 명 더 많아서, 패스를 돌리며 골을 넣기 가장 좋은 황금 찬스예요!', en: 'While an opponent sits in the penalty box, your 5 skaters outnumber their 4 defenders—making it much easier to find an open teammate and score!' } },
  { code: 'PK', name: { ko: '4명으로 버티기 수비 (페널티킬)', en: 'Penalty Kill (4-on-5 Defense)' }, role: { ko: '이때는 공을 멀리 뻥 쳐도(아이싱) 반칙이 아니에요!', en: '4 defenders holding on—Icing is allowed!' }, desc: { ko: '우리 선수가 감옥에 가서 4명으로 5명을 막아야 하는 위기 상황이에요! 대신 불쌍하니까 이때만큼은 공을 끝까지 멀리 뻥 쳐도 아이싱 반칙을 안 불어요!', en: 'When defending with only 4 skaters against 5, the rules give you a break: you are allowed to shoot the puck all the way down the ice without an Icing foul!' } },
  { code: 'CHG', name: { ko: '달리는 중 선수 교체 (플라잉 체인지)', en: 'Change on the Fly (Flying Change)' }, role: { ko: '경기가 안 멈춰도 문을 열고 바로 교체!', en: 'Swap players at the bench while play continues!' }, desc: { ko: '하키는 너무 힘들어서 한 번 나가면 45초밖에 못 뛰어요! 그래서 심판이 호루라기를 안 불어도 경기 도중 벤치 문을 열고 선수를 바로 바꾼답니다.', en: 'Skating is so tiring that shifts last only 45 seconds. Players jump over the bench boards to swap while the game keeps going!' } },
  { code: 'EN6', name: { ko: '골키퍼 빼고 6명 총공격 (엠프티 넷)', en: 'Pulling the Goalie (6-on-5 Empty Net)' }, role: { ko: '끝나기 1분 전 지고 있을 때 쓰는 마지막 승부수!', en: 'All-out 6-attacker comeback play!' }, desc: { ko: '경기 종료 직전 1점 지고 있으면 골키퍼를 벤치로 부르고 공격수를 1명 더 넣어 6명 대 5명으로 공격해요! 대신 우리 골문은 텅 비어 있어요.', en: 'Trailing by a goal in the last minute, a team swaps its goalie for a 6th attacker—leaving its own net wide open!' } },
  { code: 'OT', name: { ko: '골대 뒤 공간 & 3대3 연장 · 승부차기', en: 'Behind the Net, 3-on-3 OT & Shootout' }, role: { ko: '골대 뒤 패스 + 먼저 넣으면 끝나는 연장전!', en: 'Pass from behind the net & sudden-death OT!' }, desc: { ko: '하키는 골대 뒤로도 다닐 수 있어요! 그리고 동점이면 넓은 얼음판에서 3명 대 3명 연장전(먼저 골 넣으면 즉시 승리!)을 하고, 그래도 비기면 1대1 승부차기를 해요.', en: 'You can skate behind the net! And if tied after 3 periods, teams play 5 minutes of 3-on-3 sudden-death Overtime, then a 1-on-1 Shootout.' } }
];

HK_DATA.quiz = [
  { q: { ko: '우리 팀 공격수가 공(퍽)보다 먼저 상대쪽 파란 선을 넘어가 버렸어요! 심판의 판정은?', en: 'Your teammate crosses the opponent blue line BEFORE the puck. What is the call?' }, opts: [{ ko: '🔵 오프사이드 반칙 (공이 사람보다 먼저 넘어야 함!)', en: '🔵 Offside foul (Puck must cross before players!)' }, { ko: '🔴 아이싱 반칙', en: '🔴 Icing foul' }, { ko: '✅ 아무 문제 없음', en: '✅ Play continues' }], ans: 0, exp: { ko: '정답! 파란 선을 넘을 때는 무조건 "공(퍽)이 먼저, 사람은 나중"이에요! 사람이 먼저 넘으면 오프사이드 반칙입니다.', en: 'Correct! Across the blue line, it is always "puck first, players second"—otherwise it is Offside!' } },
  { q: { ko: '가운데 빨간 선을 넘기 전(우리 땅)에서 공을 끝까지 멀리 뻥 쳐버렸어요! 무슨 반칙일까요?', en: 'From behind the center red line, you shoot the puck all the way to the far end. What foul is called?' }, opts: [{ ko: '🔴 아이싱 반칙 (다시 우리 골문 앞으로 돌아와서 시작)', en: '🔴 Icing foul (Faceoff comes back to your own goal)' }, { ko: '🔵 오프사이드 반칙', en: '🔵 Offside foul' }, { ko: '🏆 2점 보너스 골', en: '🏆 2-point bonus goal' }], ans: 0, exp: { ko: '정답! 가운데 빨간 선을 먼저 넘은 다음에 멀리 쳐야 해요. 우리 땅에서 끝까지 뻥 치면 아이싱 반칙이에요!', en: 'Correct! You must cross the center red line before shooting the puck all the way down the ice.' } },
  { q: { ko: '상대 선수가 2분 감옥(페널티 박스)에 들어가서 우리가 5대4로 공격하다가 골을 넣었어요! 감옥에 있던 상대 선수는 어떻게 될까요?', en: 'While an opponent is in the 2-minute penalty box, your team scores a 5-on-4 goal! What happens to the player in the box?' }, opts: [{ ko: '🔓 즉시 감옥에서 풀려나와 다시 5대5가 된다', en: '🔓 Released immediately and play returns to 5-on-5' }, { ko: '🔒 경기 끝날 때까지 못 나온다', en: '🔒 Locked in for the rest of the game' }, { ko: '➕ 2분이 더 늘어난다', en: '➕ 2 more minutes are added' }], ans: 0, exp: { ko: '정답! 2분짜리 반칙(마이너 페널티)은 상대 팀이 골을 넣는 순간 벌칙이 바로 끝나고 감옥에서 풀려나요!', en: 'Correct! Scoring a power-play goal ends a 2-minute minor penalty immediately!' } },
  { q: { ko: '경기 끝나기 1분 전 1점 지고 있을 때, 우리 감독님이 골키퍼를 벤치로 부르는 이유는 무엇일까요?', en: 'Trailing by 1 goal with 1 minute left, why does the coach call the goalie to the bench?' }, opts: [{ ko: '🔥 골키퍼 대신 공격수 1명을 더 넣어 6명 대 5명으로 동점골을 넣으려고', en: '🔥 To put a 6th attacker on the ice (6-on-5) for a tying goal' }, { ko: '😴 골키퍼가 졸려서 집에 가려고', en: '😴 Because the goalie wants to go home early' }, { ko: '⏸️ 시간을 멈추려고', en: '⏸️ To stop the game clock' }], ans: 0, exp: { ko: '정답! 우리 골문이 텅 비는(엠프티 넷) 위험을 감수하고 공격수 6명을 투입해 마지막 동점골을 노리는 작전이에요!', en: 'Correct! Teams risk an empty net in the final minute to attack with 6 skaters against 5!' } },
  { q: { ko: '아이스하키에서 3피리어드가 동점으로 끝나면 어떻게 승부를 가릴까요?', en: 'If a regular-season hockey game is tied after 3 periods, how is the winner decided?' }, opts: [{ ko: '⚡ 3대3 연장전(먼저 골 넣으면 즉시 승리) → 그래도 비기면 1대1 승부차기(슛아웃)', en: '⚡ 3-on-3 Sudden-Death Overtime -> then 1-on-1 Shootout' }, { ko: '🪙 동전 던지기', en: '🪙 A coin flip' }, { ko: '🤝 무조건 무승부로 끝낸다', en: '🤝 Ends in a tie right away' }], ans: 0, exp: { ko: '정답! 넓은 얼음판에서 5분 동안 3대3 연장전을 해서 먼저 골을 넣는 팀이 바로 이기고, 그래도 비기면 1대1 승부차기(슛아웃)를 해요!', en: 'Correct! Teams play 5 minutes of wide-open 3-on-3 sudden-death OT, and if still tied, a 1-on-1 Shootout!' } }
];
