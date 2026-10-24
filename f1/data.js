// Nadoo F1 Pit Wall 101 — Bilingual Beginner-Friendly Data ([ko, en] pairs)
window.F1DATA = {
  primer: {
    btn: ["📖 [필독] F1이 도대체 무슨 경주야? (1분 왕초보 설명서)", "📖 [Start Here] What is Formula 1? (1-Min Beginner Guide)"],
    sub: ["F1을 처음 보신다면 이 5장만 먼저 읽어보세요! 왜 경기 중에 멈춰서 타이어를 바꾸고, 왜 뒷날개가 열리는지 1분 만에 이해됩니다.", "New to Formula 1? Read these 5 quick cards first! Understand tyre stops, the Undercut, Safety Cars, and DRS in 1 minute."],
    slides: [
      {
        num: "1 / 5",
        icon: "🏎️",
        title: ["F1은 시속 350km로 달리는 '세계에서 제일 빠른 자동차 경주(20대 출전)'예요!", "F1 is the 'World's Fastest Car Race' (20 Cars at 350 km/h)!"],
        diagram: "🏁 출발(20대: 10개 팀 × 2대씩) ━━(트랙 50~70바퀴 질주!)━━▶ 🏆 결승선 1등(25점!)",
        body: [
          "F1(포뮬러 원)은 페라리·메르세데스·레드불·맥라렌 같은 10개 팀에서 자동차를 딱 2대씩 내보내 총 20대가 달리는 경주예요!\n일반 고속도로(시속 100km)보다 3배나 빠른 시속 350km로 트랙을 50~70바퀴(약 1시간 30분) 돌아서 제일 먼저 결승선을 통과하는 사람이 우승해요!",
          "In Formula 1, 10 teams each enter 2 cars (20 cars total). They race 50–70 laps at up to 350 km/h (220 mph), and the first driver across the finish line wins!"
        ]
      },
      {
        num: "2 / 5",
        icon: "🛞",
        title: ["타이어가 지우개처럼 닳아요! (왜 바쁜 경기 중에 멈춰서 타이어를 바꿀까?)", "Tyres Wear Out Like Erasers! (Why Stop Mid-Race?)"],
        diagram: "🔴 빨강(소프트: 엄청 빠름/금방 닳음) · 🟡 노랑(미디엄: 중간) · ⚪ 하양(하드: 조금 느림/오래 감)",
        body: [
          "F1 자동차는 너무 빨라서 달리다 보면 고무 타이어가 지우개처럼 팍팍 닳아서 미끄러져요! 타이어는 3가지 색깔이 있어요:\n• 🔴 빨간 타이어(소프트): 쫀득해서 엄청 빠르지만 15바퀴면 다 닳아요.\n• 🟡 노란 타이어(미디엄): 적당히 빠르고 적당히 오래 가요(25바퀴).\n• ⚪ 하얀 타이어(하드): 단단해서 조금 느리지만 40바퀴까지 버텨요.\n🚨 핵심 규칙: 비가 안 오는 날엔 반드시 경기 중에 최소 1번 정비소(피트)에 들러 '다른 색깔 타이어'로 갈아 끼워야 해요! (안 바꾸면 실격! 무전으로 '박스, 박스(BOX, BOX)!'라고 외치면 '지금 정비소로 들어와!'라는 뜻이에요.)",
          "F1 tyres wear down fast! There are 3 dry tyre colors:\n• 🔴 Red (Soft): super fast, wears out quickly.\n• 🟡 Yellow (Medium): balanced speed and life.\n• ⚪ White (Hard): slightly slower, lasts a long time.\n🚨 Key Rule: In a dry race, every driver MUST stop at least once to use 2 different tyre colors! ('BOX, BOX!' on the radio means 'Come into the pit stop now!')"
        ]
      },
      {
        num: "3 / 5",
        icon: "⚡",
        title: ["왜 앞차보다 '1바퀴 먼저' 타이어를 바꾸러 들어갈까? (언더컷의 비밀!)", "Why Pit 1 Lap BEFORE the Car Ahead? (The 'Undercut' Secret!)"],
        diagram: "앞차에 막힘 ➔ 🔧 내가 1바퀴 먼저 새 타이어 교체! ➔ 💨 새 타이어로 폭풍 질주 ➔ 🏆 앞차 역전!",
        body: [
          "앞차 바로 뒤에서 코너를 돌면, 앞차가 내뿜는 뜨겁고 어지러운 바람(더티 에어) 때문에 내 차가 미끄러져서 추월하기가 정말 힘들어요.\n이때 꾀를 내서 '앞차보다 1바퀴 먼저' 정비소에 들어가 새 타이어로 갈아 끼우는 거예요! 방금 갈아 끼운 새 타이어는 헌 타이어보다 바퀴당 2초나 빨라서, 다음 바퀴에 앞차가 뒤늦게 타이어를 바꾸고 나올 때 내가 그 앞을 쌩—! 하고 지나쳐 역전하게 돼요. 이걸 '언더컷(먼저 찌르기)'이라고 불러요!",
          "Following closely in corners is tough because the car ahead leaves hot, messy air ('Dirty Air').\nIf you pit 1 lap BEFORE your rival and put on fresh tyres, you can drive 2 seconds faster on your out-lap—passing them while they pit the next lap! This famous move is called the 'Undercut'!"
        ]
      },
      {
        num: "4 / 5",
        icon: "🟡",
        title: ["사고가 나면 왜 다 같이 우르르 타이어를 바꾸러 갈까? (세이프티카 반값 찬스!)", "Why Does Everyone Pit During a Crash? (Safety Car Half-Price Stop!)"],
        diagram: "평소 타이어 교체 = 22초 손해 😭  |  🟡 안전차(세이프티카) 나왔을 때 교체 = 10초만 손해! 🎉",
        body: [
          "경기장에 사고가 나면 치우는 동안 노란 '안전차(세이프티카, SC)'가 나와서 모든 경주차를 천천히 줄지어 몰고 다녀요(이땐 추월 금지!).\n원래 평소에 나 혼자 타이어를 바꾸러 들어가면, 다른 차들이 시속 300km로 쌩쌩 지나가 버려서 약 22초나 손해를 봐요. 하지만 안전차 때문에 다른 차들이 시속 100km로 거북이처럼 기어갈 때 정비소에 들어가면 딱 10초밖에 손해를 안 봐요! 그래서 사고가 나면 '와! 반값 세일 찬스다!' 하고 다 같이 타이어를 바꾸러 들어가는 거예요.",
          "When there is a crash, the yellow Safety Car (SC) comes out and forces every car on track to slow way down (no overtaking allowed!).\nNormally, pitting costs ~22 seconds while rivals fly past at 300 km/h. Under the Safety Car, rivals are crawling slowly, so pitting only costs ~10 seconds—a 'half-price' free pit stop!"
        ]
      },
      {
        num: "5 / 5",
        icon: "🚀",
        title: ["뒷날개 부스터(DRS) · 파란 깃발 · 같은 팀 양보는 무슨 뜻일까?", "What are DRS Rear-Wing Boost, Blue Flags & Team Orders?"],
        diagram: "🚀 DRS(1초 이내 접근 시 뒷날개 열고 +15km/h!) · 🔵 파란 깃발(한 바퀴 잡힌 꼴찌는 비켜주기!)",
        body: [
          "• 🚀 뒷날개 부스터(DRS): 앞차와 간격이 '1.0초 이내'로 가까워지면, 직선 도로에서 자동차 뒷날개를 활짝 열어 바람 저항을 없애고 시속 +15km 부스터로 추월할 수 있어요!\n• 🔵 파란 깃발: 1등 차가 너무 빨라서 꼴찌 차를 한 바퀴 통째로 따라잡았을 때 꼴찌 차에게 흔드는 깃발이에요. '1등 싸움 방해하지 말고 옆으로 비켜줘!'라는 뜻이에요(3번 안 비키면 벌칙!).\n• 🤝 같은 팀 양보(팀 오더): F1은 2명이 한 팀이에요! 내 타이어는 낡아서 느린데 바로 뒤 우리 팀 동료가 새 타이어로 엄청 빠르면, 감독님이 '우리 팀 동료 먼저 보내줘!'라고 작전을 내려요.",
          "• 🚀 DRS Boost: Get within 1.0 second of the car ahead to flip open your rear wing on the straight for a +15 km/h speed boost!\n• 🔵 Blue Flag: Waved at a slow backmarker about to be lapped by the leader—meaning 'Move aside and let the leader pass!'\n• 🤝 Team Orders: Since 2 cars share a team, a slower driver on old tyres will often let a faster teammate on fresh tyres pass!"
        ]
      }
    ]
  },

  stages: [
    {
      t: ["Stage 1 · 3가지 색깔 타이어와 '박스, 박스!' 타이어 교체", "Stage 1 · 3 Tyre Colors & Calling 'BOX, BOX!'"],
      easyRule: [
        "한줄 규칙: 비 안 오는 날엔 반드시 경기 중 최소 1번 멈춰서 '다른 색깔 타이어'로 갈아 끼워야 해요! (안 바꾸면 실격!)",
        "Key Rule: In a dry race, you MUST stop at least once to use 2 different tyre colors!"
      ],
      tutWhat: [
        "빨강(빠름/금방 닳음)·노랑(중간)·하양(오래 감) 타이어의 차이를 알고, 타이어가 닳았을 때 정비소로 부르는 '박스, 박스(BOX, BOX!)' 무전과 2.0초 타이어 교체 미니게임을 해봐요!",
        "Learn Red (Soft), Yellow (Medium), and White (Hard) tyres, call 'BOX, BOX!' when tyres wear out, and play the 2.0s Pit Stop mini-game!"
      ],
      tutWhy: [
        "시속 350km로 달리면 고무 타이어가 뜨거워져서 지우개처럼 닳아요! 게다가 경주를 더 재미있게 만들려고 '한 경기에 무조건 서로 다른 색깔 타이어 2종류 이상을 써야 한다'는 의무 규칙을 만들었어요.",
        "At 350 km/h, tyres wear out rapidly! Plus, F1 rules require every driver to use at least 2 different dry tyre colors during a race."
      ],
      tutHow: [
        "먼저 따라 하기 버튼으로 타이어 규칙을 확인한 뒤, 타이어가 닳았을 때 정비소로 부르고 직접 4개의 바퀴를 탭해 갈아 끼워 보세요!",
        "Start with the guided demo, call your car into the pit lane when the tyres wear out, and tap all 4 wheels in the Pit Stop mini-game!"
      ],
      goal: ["목표: 타이어가 다 닳기 전에 정비소(BOX, BOX!)로 부르고, 2초 만에 타이어 4개를 갈아 끼우세요!", "Goal: Call BOX, BOX! when tyres wear out and swap all 4 wheels in the Pit Stop Challenge!"],
      learn: [
        "🔴 빨강(소프트): 쫀득해서 제일 빠르지만 금방 닳음 · 🟡 노랑(미디엄): 속도와 수명 균형 · ⚪ 하양(하드): 단단해서 끝까지 오래 감 · 🟢 초록(인터미디엇): 비 와서 땅이 젖었을 때! 비 안 오는 날엔 서로 다른 색 타이어를 최소 2종류 꼭 써야 해요.",
        "🔴 Soft: fastest, short life · 🟡 Medium: balanced · ⚪ Hard: durable · 🟢 Intermediate: for rain. In a dry race you must use at least 2 different dry tyre colors!"
      ],
      guide: {
        q: ["✨ [따라 하기] 지금 우리 차는 '🔴 빨간 타이어(소프트)'를 끼고 출발했어요! 실격당하지 않으려면 결승선에 들어오기 전에 무조건 해야 하는 것은 무엇일까요?", "✨ [Guided Demo] You started the race on 🔴 Red (Soft) tyres! To avoid disqualification in a dry race, what MUST you do before the finish?"],
        o: [
          ["✨ 정비소에 1번 들러서 다른 색깔 타이어(🟡노랑 또는 ⚪하양)로 갈아 끼우기!", "✨ Stop once at the pit lane to switch to another color (🟡Yellow or ⚪White)!"]
        ],
        a: 0,
        h: ["마른 땅에서는 서로 다른 색깔 타이어를 2종류 이상 꼭 써야 해요!", "You must use at least two different tyre colors!"],
        e: ["👏 정답이에요! 빨간 타이어로 출발했으니 경기 중에 노란색이나 하얀색 타이어로 한 번 갈아 끼워야 실격되지 않아요!", "👏 Correct! Since you started on Red tyres, switching once to Yellow or White satisfies the 2-color rule!"]
      },
      sc: [
        {
          q: ["18바퀴째! 빨간 타이어가 다 닳아서 한 바퀴 도는 시간이 1분 32초 → 1분 34초로 갑자기 2초나 느려졌어요! 감독님, 무전기로 뭐라고 외칠까요?", "Lap 18! Your Red tyres are worn out and your lap time just dropped by 2 full seconds! What is your radio call?"],
          o: [
            ["📻 '박스, 박스(BOX, BOX)!' 지금 바로 정비소로 들어와서 ⚪ 하얀 타이어(하드)로 바꾸자!", "📻 'BOX, BOX!' Come into the pits now and switch to durable ⚪ White (Hard) tyres!"],
            ["⏳ 타이어가 다 닳았지만 그냥 미끄러지면서 5바퀴 더 버텨보자", "⏳ Stay out on worn tyres for 5 more laps"]
          ],
          a: 0,
          e: ["정답! 타이어가 다 닳으면 바퀴당 2초씩 손해를 봐요. 바로 정비소로 불러 튼튼한 ⚪ 하얀 타이어로 바꾸면 결승선까지 한 번에 갈 수 있어요!", "Correct! Worn tyres lose 2 seconds a lap. Switching to White (Hard) tyres gets you all the way to the finish!"],
          ev: "pit",
          minigame: "pit"
        },
        {
          q: ["어라? 갑자기 하늘에서 비가 쏟아져서 도로가 흥건하게 젖었어요! 미끄러운 빗길에서는 홈이 파여 있어서 물을 빼주는 어떤 타이어로 바꿔야 할까요?", "Suddenly rain starts falling and the track is wet! Which grooved rain tyre should you put on?"],
          o: [
            ["🟢 초록색 비 타이어 (인터미디엇 — 빗물 배수용 타이어!)", "🟢 Green Rain Tyre (Intermediate — grooved for wet tracks!)"],
            ["🔴 빨간색 민무늬 타이어 (소프트 — 빗길에선 빙판처럼 미끄러짐!)", "🔴 Red Slick Tyre (Soft — slides like ice on water!)"]
          ],
          a: 0,
          e: ["완벽해요! 평소에 쓰는 빨강·노랑·하양 타이어는 무늬가 없는 민무늬(슬릭)라 빗길에선 미끄러져요. 비가 오면 초록색(인터미디엇)이나 파란색(폭우용 웻) 타이어를 껴야 해요!", "Spot on! Dry tyres have no grooves and hydroplane in rain. Green Intermediates grip wet tracks!"],
          ev: "pit"
        }
      ]
    },
    {
      t: ["Stage 2 · 앞차보다 먼저 타이어 바꾸기! ('언더컷' 작전의 비밀)", "Stage 2 · Pitting First to Pass! (The 'Undercut' Secret)"],
      easyRule: [
        "한줄 규칙: 앞차에 막혀 추월이 안 될 땐, 앞차보다 '1바퀴 먼저' 들어가 새 타이어로 갈아 끼우고 전속력으로 달려 역전해요(언더컷)!",
        "Key Rule: Stuck behind a rival? Pit 1 lap BEFORE them so your fresh tyres let you jump ahead (the Undercut)!"
      ],
      tutWhat: [
        "트랙 위에서 직접 추월하지 않고도 '타이어 바꾸는 타이밍'만으로 앞차를 제치는 F1 최고의 두뇌 싸움(언더컷·오버컷·더블스택)을 배워요!",
        "Learn how F1 teams pass rivals using pit stop timing alone: the Undercut, Overcut, and Double Stack!"
      ],
      tutWhy: [
        "새 타이어는 헌 타이어보다 한 바퀴에 2초나 빨라요! 그래서 내가 1바퀴 먼저 새 타이어로 바꾸고 전속력으로 달리면, 앞차가 다음 바퀴에 타이어를 바꾸고 나올 때 내가 그 앞을 휙 지나가게 된답니다.",
        "Fresh tyres are up to 2 seconds faster per lap than worn tyres! Pitting 1 lap earlier lets you use that speed advantage to jump ahead."
      ],
      tutHow: [
        "앞차에 막혔을 때 [🔧 1바퀴 먼저 타이어 바꾸기(언더컷)]를 선택해 순위가 2등에서 1등으로 바뀌는 마법을 확인해 보세요!",
        "Pick [🔧 Pit 1 Lap Earlier (Undercut)] when stuck behind a rival and watch your car jump into P1!"
      ],
      goal: ["목표: 영리한 타이어 교체 타이밍(언더컷)으로 앞차를 추월해 1등으로 올라서세요!", "Goal: Use smart pit timing (the Undercut) to jump past the leader into P1!"],
      learn: [
        "⚡ 언더컷(먼저 찌르기): 앞차보다 1바퀴 먼저 새 타이어로 바꿔서 새 타이어 속도로 역전하기! · 💨 오버컷(나중에 들어가기): 앞차가 먼저 들어갔을 때 뻥 뚫린 빈 도로에서 전속력으로 달린 뒤 들어가 역전하기! · 👯 더블스택: 우리 팀 차 2대가 동시에 정비소에 들어오면 정비사가 1팀뿐이라 뒷차는 기다려야 해요!",
        "⚡ Undercut: pit 1 lap earlier and use fresh-tyre speed to jump ahead! · 💨 Overcut: stay out in clean air when the rival pits first! · 👯 Double Stack: if both teammates pit on the same lap, the second car has to wait!"
      ],
      guide: {
        q: ["✨ [따라 하기] 지금 우리가 2등인데, 1등 차 바로 뒤(0.8초 차이)에서 1등 차가 내뿜는 뜨거운 바람 때문에 코너에서 자꾸 미끄러져 추월을 못 하고 있어요! 어떻게 하면 단숨에 역전할 수 있을까요?", "✨ [Guided Demo] You are in 2nd place, stuck 0.8s behind the leader in their hot turbulent air! How can you jump ahead using pit strategy?"],
        o: [
          ["✨ 1등 차보다 '1바퀴 먼저' 정비소에 들어가 새 타이어로 바꾸고 전속력으로 달리기! (언더컷)", "✨ Pit '1 lap BEFORE' the leader for fresh tyres and sprint on the out-lap! (Undercut)"]
        ],
        a: 0,
        h: ["새 타이어가 헌 타이어보다 바퀴당 2초 빠르다는 점을 이용해 먼저 들어가요!", "Use the 2-second fresh-tyre speed advantage by pitting first!"],
        e: ["👏 정답! 내가 1바퀴 먼저 새 타이어를 끼고 2초 빠르게 달리는 사이, 다음 바퀴에 1등 차가 타이어를 바꾸러 들어가면서 우리가 1등으로 올라서요!", "👏 Correct! Your fast lap on fresh tyres puts you ahead while the leader pits the next lap!"]
      },
      sc: [
        {
          q: ["실전 상황! 지금 2등으로 달리고 있는데, 새 타이어로 바꾸면 바퀴당 2.2초나 빨라진다는 계산이 나왔어요! 1등 차는 아직 안 들어갔어요. 감독님의 선택은?", "Live Call! You are P2, and data shows fresh tyres are 2.2s faster per lap! The leader stayed out. What is your call?"],
          o: [
            ["🔧 지금 바로 '박스, 박스!' 먼저 타이어를 바꿔서 언더컷으로 1등 뺏기!", "🔧 Call 'BOX, BOX!' right now to Undercut the leader for P1!"],
            ["🐢 아무것도 안 하고 1등 차 뒤에서 계속 답답하게 따라가기", "🐢 Do nothing and stay stuck behind the leader"]
          ],
          a: 0,
          e: ["🎉 언더컷 대성공!! 우리가 새 타이어로 날아가는 동안 1등 차가 한 바퀴 늦게 타이어를 바꾸러 들어가서, 우리가 1등(Leader)으로 올라섰어요!", "🎉 Undercut worked! While the rival pitted a lap later, you flew past on fresh tyres into P1!"],
          ev: "swap"
        },
        {
          q: ["이번엔 반대 상황! 내 앞에 있던 차가 먼저 정비소로 쏙 들어갔어요. 덕분에 내 앞 도로가 뻥 뚫렸고 내 타이어는 아직 쌩쌩해요! 어떻게 할까요?", "Opposite situation! The car ahead just pitted first, leaving wide-open road in front of you, and your tyres still have good grip! What do you do?"],
          o: [
            ["💨 뻥 뚫린 빈 도로에서 2바퀴 동안 전속력으로 달린 뒤에 타이어 바꾸기! (오버컷)", "💨 Push flat-out in clear air for 2 laps before pitting! (Overcut)"],
            ["🛑 타이어가 아직 쌩쌩한데도 무조건 바로 따라 들어가기", "🛑 Pit immediately even though your tyres are still strong"]
          ],
          a: 0,
          e: ["👍 나이스 오버컷! 앞차가 정비소에서 나온 뒤 다른 느린 차들 뒤에 갇힌 사이, 우리는 뻥 뚫린 도로에서 빠르게 달려 역전했어요!", "👍 Great Overcut! While your rival got stuck in traffic on cold tyres, you used clear air to jump ahead!"],
          ev: "swap"
        },
        {
          q: ["잠깐! 만약 우리 팀 자동차 2대가 '같은 바퀴에 동시에' 타이어를 바꾸러 들어오면(더블스택) 뒤에 들어온 우리 팀 2번째 차는 어떻게 될까요?", "Wait! What happens if BOTH cars from your team come into the pit stop at the exact same time (a Double Stack)?"],
          o: [
            ["⏳ 정비사 팀이 딱 1팀뿐이라 앞차 타이어를 다 바꿀 때까지 뒤에서 줄 서서 기다려야 한다!", "⏳ Since each team only has ONE pit crew, the second car must wait in line behind the first car!"],
            ["🪄 정비사가 갑자기 2배로 늘어나서 두 대를 동시에 갈아 끼운다", "🪄 A second pit crew magically appears to service both cars at once"]
          ],
          a: 0,
          e: ["정답! 한 팀에 타이어 교체 공간과 정비사 팀은 딱 하나뿐이에요! 그래서 두 대가 너무 붙어서 들어오면 뒷차는 3~5초 동안 줄 서서 기다려야 한답니다.", "Correct! Each team only has one pit box and crew, so if two teammates pit too close together, the second car loses time waiting!"],
          ev: "pit"
        }
      ]
    }
  ]
};

// Append Stages 3-5, TV Decoder, Rulebook Cards & Quiz
window.F1DATA.stages.push(
  {
    t: ["Stage 3 · 사고가 났을 때! '안전차(세이프티카)' 반값 타이어 교체 찬스", "Stage 3 · Crash Alert! The 'Safety Car' Half-Price Pit Stop"],
    easyRule: [
      "한줄 규칙: 사고가 나서 노란 안전차(세이프티카)가 나오면 모든 차가 천천히 달려요! 이때 타이어를 바꾸면 손해 시간이 반값(22초→10초)으로 줄어들어요!",
      "Key Rule: When the yellow Safety Car slows everyone down, pitting costs HALF the normal time (10s instead of 22s)!"
    ],
    tutWhat: [
      "트랙에 사고가 났을 때 나오는 '노란 안전차(세이프티카·SC)', '가상 안전차(VSC)', 그리고 경기가 아예 멈추는 '빨간 깃발(레드플랙)' 때 어떻게 이득을 보는지 배워요!",
      "Learn how to take advantage of a yellow Safety Car (SC), Virtual Safety Car (VSC), and Red Flag race suspension!"
    ],
    tutWhy: [
      "평소엔 내가 정비소에 들어간 사이 다른 차들이 시속 300km로 지나가서 22초나 손해를 봐요. 하지만 안전차가 나와서 다른 차들이 시속 100km로 천천히 달릴 때 들어가면 10초밖에 손해를 안 봐서 '반값 보너스 찬스'라고 불러요!",
      "Normally rivals pass at 300 km/h while you pit (costing 22s). Under a Safety Car, rivals must drive slowly, so pitting only costs ~10s!"
    ],
    tutHow: [
      "안전차(SC)가 떴을 때 망설이지 말고 바로 정비소로 들어가는 버튼을 눌러 '반값 타이어 교체'를 성공시켜 보세요!",
      "When the Safety Car comes out, call your driver into the pits immediately for a half-price stop!"
    ],
    goal: ["목표: 안전차(SC)와 빨간 깃발(레드플랙) 상황에 맞게 가장 이득 보는 작전을 선택하세요!", "Goal: Make the smartest pit calls during Safety Car and Red Flag situations!"],
    learn: [
      "🟡 노란 깃발/안전차(SC): 사고 수습 동안 서행 & 추월 절대 금지! 지금 타이어 바꾸면 손해 시간 반값(22초→10초)! · 💻 가상 안전차(VSC): 진짜 안전차는 안 나오지만 화면 신호로 전 구간 30% 감속! · 🔴 빨간 깃발(레드플랙): 큰 사고로 경기 일시 중단! 모든 차가 차고로 들어오며, 이때는 순위 손해 없이 '공짜로' 새 타이어로 바꿀 수 있어요!",
      "🟡 Safety Car (SC): slow down, no overtaking, half-price pit stop (10s vs 22s)! · 💻 VSC: electronic speed limit across the track. · 🔴 Red Flag: race stopped—drivers return to the pit lane and can change tyres for FREE without losing positions!"
    ],
    guide: {
      q: ["✨ [따라 하기] 쾅! 트랙에 사고가 나서 노란 '안전차(세이프티카)'가 출동했어요! 다른 차들이 전부 천천히 줄지어 달리고 있을 때, 아직 타이어를 안 바꾼 우리 차는 어떻게 하는 게 대박 찬스일까요?", "✨ [Guided Demo] Crash on track! The yellow Safety Car is out and every car on track has slowed way down. You still need a tyre stop—what is the jackpot move?"],
      o: [
        ["✨ 지금 바로 정비소로 들어가서 평소(22초 손해)의 절반(10초 손해) 시간만으로 새 타이어 갈아 끼우기!", "✨ Pit right now while everyone is driving slowly to save 12 seconds ('half-price pit stop')!"]
      ],
      a: 0,
      h: ["다른 차들이 천천히 달릴 때 타이어를 바꾸면 손해 보는 시간이 절반으로 줄어요!", "Pitting while rivals drive slowly cuts your time loss in half!"],
      e: ["👏 정답이에요! 안전차가 나왔을 때 재빨리 들어가면 등수를 거의 안 뺏기고 새 타이어를 공짜처럼 얻을 수 있어요!", "👏 Correct! Pitting under the Safety Car lets you get fresh tyres while losing almost no track position!"]
    },
    sc: [
      {
        q: ["삐용삐용! 🟡 안전차(세이프티카)가 방금 출동했고, 마침 우리 차가 정비소 입구 바로 200m 앞에 있어요! 어떻게 할까요?", "🟡 SAFETY CAR DEPLOYED! Your car is just 200 meters before the pit lane entrance! What is your call?"],
        o: [
          ["📻 '박스, 박스!' 안전차 반값 찬스다! 지금 당장 들어가서 새 타이어로 바꾸자!", "📻 'BOX, BOX!' Take the Safety Car half-price pit stop right now!"],
          ["🐢 찬스를 버리고 그냥 헌 타이어로 트랙에 남아 있는다", "🐢 Skip the cheap stop and stay out on old tyres"]
        ],
        a: 0,
        e: ["🎉 대박 찬스 성공! 다른 차들이 거북이처럼 달리는 사이에 타이어를 갈아 끼워서, 1등 자리를 그대로 지키면서 새 타이어까지 얻었어요!", "🎉 Jackpot! Because everyone on track was crawling behind the Safety Car, you got fresh tyres and kept the lead!"],
        ev: "sc"
      },
      {
        q: ["이번엔 방호벽이 크게 부서져서 경기가 아예 잠깐 멈추는 '🔴 빨간 깃발(레드플랙)'이 선언됐어요! 모든 차가 정비소 차고로 들어와 멈추는데, 이때의 대박 규칙은 무엇일까요?", "A big crash damaged the barrier and brought out the 🔴 RED FLAG (race paused)! All cars line up in the pit lane. What is the special rule under a Red Flag?"],
        o: [
          ["🎁 경기가 멈춰 있는 동안 등수 손해 0초! 완전 공짜로 새 타이어로 갈아 끼울 수 있다!", "🎁 Free tyre change! Crews can put on fresh tyres during the stoppage without losing a single place!"],
          ["🚫 경기가 끝날 때까지 절대로 타이어를 만지면 안 된다", "🚫 Nobody is allowed to touch the car until tomorrow"]
        ],
        a: 0,
        e: ["정답! 빨간 깃발(레드플랙)로 경기가 중단되면 모든 차가 멈춰 서 있는 동안 공짜로 새 타이어로 갈아 끼울 수 있어요! 그래서 레드플랙 직전에 타이어를 바꾼 선수는 엄청 억울해한답니다.", "Correct! During a Red Flag stoppage, teams can fit fresh tyres in the pit lane without losing any positions!"],
        ev: "sc"
      }
    ]
  },
  {
    t: ["Stage 4 · 뒷날개 부스터(DRS) 추월 미니게임 & 깃발·팀 작전", "Stage 4 · DRS Rear-Wing Boost Mini-Game, Blue Flags & Team Orders"],
    easyRule: [
      "한줄 규칙: 앞차와 '1.0초 이내'로 붙으면 직선에서 뒷날개를 열어 시속 +15km 부스터(DRS)를 쓸 수 있어요!",
      "Key Rule: Get within 1.0 second of the car ahead to open your rear wing for a +15 km/h DRS boost on the straight!"
    ],
    tutWhat: [
      "F1에서 가장 짜릿한 추월 무기인 '바람막이 효과(슬립스트림)'와 '뒷날개 부스터(DRS)'를 미니게임으로 직접 써보고, 파란 깃발과 같은 팀 양보 작전을 배워요!",
      "Play the interactive Slipstream + DRS Boost overtake mini-game, and learn Blue Flags and Team Orders!"
    ],
    tutWhy: [
      "F1 자동차는 공기 저항이 엄청 커서 그냥 달리기만 해서는 앞차를 추월하기 힘들어요. 그래서 '앞차와 1초 이내로 붙은 차에게만 뒷날개를 열어 속도를 +15km/h 높여주는 DRS 부스터' 규칙을 만들었어요!",
      "F1 cars create huge air resistance, making passing hard. So F1 gives any chasing car within 1.0 second a 'DRS rear-wing flap' that adds +15 km/h on straights!"
    ],
    tutHow: [
      "따라 하기를 마친 뒤, 직선 추월 미니게임에서 [💨 앞차 뒤에 바짝 붙기] ➔ [🟢 DRS 부스터 ON!]을 차례대로 눌러 1등 차를 시원하게 추월해 보세요!",
      "In the DRS Overtake mini-game, tap [💨 Tuck Behind Rival (Slipstream)] then [🟢 Activate DRS Boost!] to rocket past into 1st place!"
    ],
    goal: ["목표: 슬립스트림과 DRS 뒷날개 부스터 미니게임으로 앞차를 추월하고, 파란 깃발·팀 작전을 마스터하세요!", "Goal: Overtake the leader using Slipstream + DRS Boost, and master Blue Flags & Team Orders!"],
    learn: [
      "🚀 DRS(뒷날개 부스터): 앞차와 간격이 1.0초 이내일 때 지정된 직선 도로에서 뒷날개를 열어 시속 +15km 가속! · 💨 슬립스트림(바람막이): 앞차 바로 뒤에 붙어 공기 저항을 줄이는 기술 · 🔵 파란 깃발: 1등에게 한 바퀴 따라잡힌 꼴찌 차는 즉시 길 비켜주기! · 🤝 팀 오더: 새 타이어 낀 빠른 같은 팀 동료 먼저 보내주기!",
      "🚀 DRS: open rear wing for +15 km/h when within 1.0s · 💨 Slipstream: draft right behind the car ahead · 🔵 Blue Flag: lapped backmarker must let leaders pass · 🤝 Team Orders: let a faster teammate on fresher tyres through!"
    ],
    guide: {
      q: ["✨ [따라 하기] 직선 도로에서 앞차를 추월하려고 해요! 내 차의 '🚀 DRS 뒷날개 부스터(+15km/h)' 버튼에 초록불이 들어오려면 앞차와의 간격이 몇 초 이내여야 할까요?", "✨ [Guided Demo] You want to pass the car ahead on the main straight! How close must you be for your '🚀 DRS Rear-Wing Boost (+15 km/h)' button to light up green?"],
      o: [
        ["✨ 앞차와 간격이 '1.0초 이내'로 가까워졌을 때!", "✨ Within '1.0 second' of the car ahead!"]
      ],
      a: 0,
      h: ["1초 안쪽으로 바짝 붙어야 DRS 부스터를 켤 수 있어요!", "You must be less than 1.0 second behind!"],
      e: ["👏 맞아요! 앞차와 1.0초 이내로 가까워지면 운전대에 초록불이 켜지면서 직선 구간에서 뒷날개를 활짝 열어 시속 15km나 더 빠르게 날아갈 수 있어요!", "👏 Spot on! Once you are within 1.0s at the detection line, you can flip open your rear wing and blast past at +15 km/h!"]
    },
    sc: [
      {
        q: ["지금 앞차와의 간격은 0.6초(1초 이내 달성!)이고 긴 직선 도로에 들어섰어요! 어떻게 추월할까요?", "You are 0.6 seconds behind the leader entering the main straight! How do you make the pass?"],
        o: [
          ["🚀 앞차 바로 뒤에 붙어 바람을 피한 뒤(슬립스트림) 🟢 DRS 뒷날개 부스터를 켜고 추월한다!", "🚀 Tuck into the Slipstream, hit the 🟢 DRS Rear-Wing Boost, and blast past!"],
          ["🛑 부스터를 안 켜고 바람을 다 맞으면서 천천히 달린다", "🛑 Leave DRS off and stay in the wind"]
        ],
        a: 0,
        e: ["🔥 환상적인 추월! 이제 아래 미니게임에서 직접 슬립스트림과 DRS 부스터 버튼을 눌러 시속 342km로 1등 차를 제쳐보세요!", "🔥 Awesome! Now try the interactive DRS Overtake Duel below and pass the rival at 342 km/h!"],
        ev: "swap",
        minigame: "drs"
      },
      {
        q: ["1등으로 신나게 달리고 있는데, 우리한테 한 바퀴 통째로 뒤처진 꼴찌(20등) 차가 앞에 나타났어요! 심판들이 그 꼴찌 차에게 '1등 차 지나가게 당장 옆으로 비켜!'라며 흔드는 깃발은 무슨 색일까요?", "You are leading the race and catch up to the 20th-place car (about to lap them). Which flag do marshals wave telling that slow car 'Move aside and let the leader pass!'?"],
        o: [
          ["🔵 파란 깃발 (블루플랙 — 3번 연속 안 비키면 벌점!)", "🔵 Blue Flag (Lapped car must yield within 3 flags!)"],
          ["🏁 체크무늬 깃발 (경기 끝!)", "🏁 Checkered Flag (Race over!)"]
        ],
        a: 0,
        e: ["정답! 파란 깃발(블루플랙)을 받은 느린 차는 선두권 차들의 우승 경쟁을 방해하지 않도록 곧바로 길을 비켜줘야 해요!", "Correct! A lapped car shown the Blue Flag must move aside promptly so it doesn't ruin the leaders' race!"]
      },
      {
        q: ["우리 차는 다 닳은 헌 타이어라 느린데, 바로 뒤에 '같은 팀 동료'가 방금 바꾼 쌩쌩한 새 타이어를 끼고 1등을 잡으러 달려오고 있어요! 감독님의 가장 현명한 팀 작전(팀 오더)은?", "Your tyres are old and slow, while your own TEAMMATE right behind you has brand-new tyres and can catch the race leader! What is the smartest Team Order?"],
        o: [
          ["🤝 '같은 팀끼리 싸우지 마! 빠른 동료가 먼저 가서 1등 잡게 살짝 양보해 줘!'", "🤝 'Don't fight your teammate—let them pass cleanly so our team can catch P1!'"],
          ["💥 같은 팀 동료와 부딪혀서 둘 다 탈락한다", "💥 Block your own teammate and crash both cars"]
        ],
        a: 0,
        e: ["완벽한 팀워크! F1은 두 선수의 점수를 합쳐서 '팀 우승(컨스트럭터 챔피언)'도 가리기 때문에, 타이어가 쌩쌩한 동료에게 길을 열어주는 작전을 자주 써요!", "Great teamwork! Since both cars score points for the team championship, letting a much faster teammate pass helps the whole team win!"]
      }
    ]
  },
  {
    t: ["Stage 5 · 토요일 출발 자리 정하기(예선) & 점수 따기 결승전!", "Stage 5 · Saturday Qualifying Grid & Championship Points!"],
    easyRule: [
      "한줄 규칙: 토요일엔 '누가 한 바퀴를 제일 빨리 도는지(예선)' 재서 일요일 출발 순서를 정하고, 일요일 결승선 1등~10등까지 점수를 받아요!",
      "Key Rule: Saturday's fastest single lap sets Sunday's starting line, and Sunday's Top 10 finishers score points (P1 = 25 pts)!"
    ],
    tutWhat: [
      "일요일 본경기 전에 왜 토요일에 달리는지(예선전 1등 = 폴 포지션), 그리고 결승선에서 몇 등까지 점수를 받는지(1등 25점 ~ 10등 1점) 배워요!",
      "Learn how Saturday Qualifying sets the starting order (Pole Position = P1), and how Sunday points work (1st = 25 pts down to 10th = 1 pt)!"
    ],
    tutWhy: [
      "20대가 동시에 출발할 때 맨 앞자리(1번 자리 = 폴 포지션)에서 출발하면 앞차에 막히지 않아 우승할 확률이 훨씬 높아요! 그래서 토요일마다 '누가 딱 한 바퀴를 제일 빠르게 도는지' 타임어택 예선전을 치른답니다.",
      "Starting at the very front (Pole Position) gives a huge advantage! So every Saturday, drivers run a time-attack Qualifying session to set Sunday's starting grid."
    ],
    tutHow: [
      "가장 빠른 타이어로 토요일 예선 1등 자리(폴 포지션)를 차지하고, 일요일 마지막 바퀴 작전으로 우승 트로피를 들어 올려 보세요!",
      "Pick the fastest tyre for Saturday Pole Position, then make the winning final-lap call on Sunday!"
    ],
    goal: ["목표: 토요일 예선 1등(폴 포지션)을 차지하고 일요일 결승전을 우승으로 마무리하세요!", "Goal: Claim Saturday Pole Position and win Sunday's Grand Prix!"],
    learn: [
      "⏱️ 토요일 예선(퀄리파잉): 1차(20명→15명) · 2차(15명→10명) · 3차(최종 10명)로 느린 차를 5대씩 탈락시키며 '가장 빠른 한 바퀴 기록'을 재요! 1등은 일요일 맨 앞자리(폴 포지션)에서 출발! · 🏆 일요일 점수: 1등(25점), 2등(18점), 3등(15점)... 10등(1점)까지만 점수를 받고 11등부터는 0점이에요!",
      "⏱️ Saturday Qualifying: 3 knockout rounds (Q1→Q2→Q3) where the fastest single lap wins Pole Position (P1 start on Sunday)! · 🏆 Sunday Points: Top 10 finishers score (25-18-15-12-10-8-6-4-2-1 pts); 11th to 20th get 0 points!"
    ],
    guide: {
      q: ["✨ [따라 하기] 토요일 예선 마지막 3차전(Q3)! '딱 한 바퀴만 세상에서 제일 빠르게 돌면' 내일 일요일 경기를 맨 앞 1번 자리(폴 포지션)에서 출발할 수 있어요! 어떤 타이어를 끼고 나갈까요?", "✨ [Guided Demo] It's Saturday Qualifying (Q3)! You just need ONE super-fast lap to win Pole Position (1st place on Sunday's starting line). Which tyre do you choose?"],
      o: [
        ["✨ 수명은 짧아도 딱 한 바퀴 속도는 무조건 제일 빠른 '🔴 빨간 타이어(소프트)'!", "✨ Brand-new '🔴 Red (Soft)' tyres—the absolute fastest for a single flying lap!"]
      ],
      a: 0,
      h: ["딱 한 바퀴 최고 속도를 낼 때는 가장 부드럽고 쫀득한 빨간 타이어가 최고예요!", "For one flying lap, Red (Soft) tyres have the most grip and speed!"],
      e: ["👏 정답! 토요일 예선전에서는 오래 달릴 필요가 없기 때문에, 모든 선수가 가장 빠른 🔴 빨간 타이어(소프트)를 끼고 최고 기록 대결을 펼쳐요!", "👏 Correct! In Qualifying you only need one explosive lap, so everyone uses fresh Red (Soft) tyres!"]
    },
    sc: [
      {
        q: ["일요일 본경기 중반! 우리 차가 흰색 트랙 바깥 선을 네 바퀴 모두 넘어갔다고 심판에게 '3번 경고(트랙 이탈)'를 받았어요! 만약 한 번만 더 선을 넘으면(4번째) 어떻게 될까요?", "Mid-race on Sunday! Your driver has stepped outside the white track lines 3 times. What happens if they cross the line a 4th time?"],
        o: [
          ["⚠️ '5초 벌칙(페널티)'을 받아서 기록에 5초가 추가되거나 정비소에서 5초 동안 손대지 못하고 벌을 서야 한다!", "⚠️ A 5-second time penalty is added to your race time (or served motionless in the pit box)!"],
          ["🎉 지름길로 잘 다녔다고 상점을 준다", "🎉 You get bonus points for taking a shortcut"]
        ],
        a: 0,
        e: ["정답! 흰색 선 밖으로 지름길을 쓰면 반칙이에요. 3번까지는 경고지만 4번째부터는 5초 벌칙(페널티)이 붙으니 무전으로 '선 넘지 않게 조심해!'라고 알려줘야 해요!", "Correct! Crossing the white track limits 4 times triggers an automatic 5-second penalty!"]
      },
      {
        q: ["드디어 일요일 결승전 마지막 2바퀴! 우리가 10등(마지막 점수 자리, 1점)인데 바로 앞 9등 차(2점)와 간격이 0.5초밖에 안 나요! 배터리 부스터도 100% 꽉 차 있어요! 마지막 명령은?", "Final 2 laps on Sunday! You are in 10th place (1 point), just 0.5s behind 9th place (2 points), with 100% battery boost left! Your final call?"],
        o: [
          ["🔥 '직선에서 🟢 DRS 뒷날개 부스터 + 배터리 100% 모두 쏟아부어서 9등 추월하고 결승선 통과하자!'", "🔥 'Deploy 100% battery + 🟢 DRS Boost on the main straight to take 9th place before the Checkered Flag!'"],
          ["😴 '그냥 부스터 아껴서 집으로 가져가자'", "😴 'Save the battery for next week'"]
        ],
        a: 0,
        e: ["🏁 체크무늬 깃발 통과!! 마지막 직선에서 DRS와 배터리를 모두 터뜨려 멋지게 추월 성공! 이제 당신은 F1 중계를 완벽하게 즐길 수 있는 최고의 총감독이에요!", "🏁 CHECKERED FLAG!! You deployed DRS + full battery to make the last-lap pass! You are now a certified F1 Pit Wall Strategist!"],
        ev: "swap"
      }
    ]
  }
);

window.F1DATA.tv = [
  ["1 VER", "1등 · 베르스타펜 (선수 이름 앞 3글자 약자)", "1st Place · Verstappen (3-letter driver code)"],
  ["+0.642 (DRS!)", "앞차와 0.64초 차이! (1초 이내라 뒷날개 부스터 DRS 사용 가능!)", "0.64s behind the car ahead! (Within 1.0s = DRS Boost enabled!)"],
  ["🔴 S (12L)", "빨간 소프트 타이어 장착 중 (끼고 달린 지 12바퀴째)", "On Red Soft tyres (12 laps old)"],
  ["🟡 M / ⚪ H", "노란 미디엄(균형) / 하얀 하드(오래 가는 단단한 타이어)", "Yellow Medium (balanced) / White Hard (long-lasting tyre)"],
  ["PIT 1", "오늘 경기 중 정비소에 들러 타이어를 바꾼 횟수(1번)", "Number of pit stops made today (1 stop)"],
  ["🟡 SC / VSC", "사고 발생! 노란 안전차 출동 (천천히 주행·추월 금지·반값 타이어 교체 찬스!)", "Crash! Yellow Safety Car out (slow down, no passing, half-price pit stop!)"]
];

window.F1DATA.cards = [
  ["🏎️ 1. F1은 어떤 경주인가요? (20대 출전 · 점수 계산법)", "🏎️ 1. What is Formula 1? (20 Cars & Points)", "10개 팀에서 자동차 2대씩 총 20대가 출전해 시속 350km로 트랙을 50~70바퀴 도는 경주예요! 결승선에 1등~10등으로 들어온 선수만 점수(1등 25점, 2등 18점, 3등 15점... 10등 1점)를 받고, 1년 동안 점수를 제일 많이 모은 선수와 팀이 챔피언이 돼요!", "10 teams run 2 cars each (20 cars total) for 50–70 laps at up to 350 km/h. Only the Top 10 finishers score points (25-18-15-12-10-8-6-4-2-1), crowning the season Driver and Team (Constructor) Champions!"],
  ["🛞 2. 타이어 색깔(빨강·노랑·하양)과 의무 교체 규칙", "🛞 2. Tyre Colors (Red, Yellow, White) & Mandatory Pit Stop", "🔴빨강(소프트=제일 빠르지만 금방 닳음) · 🟡노랑(미디엄=중간) · ⚪하양(하드=조금 느리지만 오래 감)! 비가 안 오는 날엔 반드시 경기 중 최소 1번 정비소(피트)에 들러 '서로 다른 색깔 타이어 2종류 이상'을 써야 해요. 무전으로 '박스, 박스(BOX, BOX)!'라고 하면 '지금 타이어 바꾸러 들어와!'라는 뜻이에요.", "🔴Red (Soft = fastest, short life), 🟡Yellow (Medium = balanced), ⚪White (Hard = durable). In a dry race, every driver MUST stop at least once to use 2 different dry tyre colors! 'BOX, BOX!' means pit this lap."],
  ["⚡ 3. 언더컷(먼저 바꾸기) vs 오버컷(나중에 바꾸기)", "⚡ 3. Undercut (Pit Early) vs Overcut (Pit Late)", "앞차 뒤에 막혀 추월이 안 될 때, 앞차보다 '1바퀴 먼저' 들어가 새 타이어로 갈아 끼우고 전속력으로 달려 앞차를 역전하는 작전을 '언더컷'이라고 해요! 반대로 앞차가 먼저 들어갔을 때 뻥 뚫린 도로에서 빠르게 달린 뒤 들어가는 건 '오버컷'이에요.", "Pitting 1 lap BEFORE the car ahead to use fresh-tyre speed to jump them is the 'Undercut'. Staying out in clear open air when your rival pits first is the 'Overcut'."],
  ["🟡 4. 노란 안전차(세이프티카)와 빨간 깃발(레드플랙)", "🟡 4. Safety Car (SC) & Red Flag", "사고가 나면 노란 안전차(SC)가 나와 모든 차를 천천히 줄지어 몰고 가요(추월 금지). 이때 타이어를 바꾸러 들어가면 손해 보는 시간이 평소 22초에서 10초로 확 줄어드는 '반값 찬스'가 돼요! 큰 사고로 '빨간 깃발(레드플랙)'이 뜨면 경기가 잠깐 멈추며 공짜로 타이어를 바꿀 수 있어요.", "When a crash brings out the yellow Safety Car (SC), all cars slow down—cutting pit-stop time loss in half (~10s instead of ~22s)! A Red Flag pauses the race completely and lets teams swap tyres for free."],
  ["🚀 5. 뒷날개 부스터(DRS) · 파란 깃발 · 팀 오더", "🚀 5. DRS Rear-Wing Boost, Blue Flags & Team Orders", "앞차와 간격이 '1.0초 이내'면 직선 도로에서 뒷날개를 활짝 열어 시속 +15km 부스터(DRS)로 추월할 수 있어요! '🔵파란 깃발'은 1등에게 한 바퀴 잡힌 꼴찌 차에게 '길 비켜!'라고 흔드는 깃발이고, '🤝팀 오더'는 같은 팀의 더 빠른 동료에게 자리를 양보하는 팀 작전이에요.", "Within 1.0s of the car ahead, a driver can flip open the rear wing (DRS) on straights for +15 km/h! Blue Flags tell lapped backmarkers to yield to leaders, and Team Orders let a faster teammate pass."]
];

window.F1DATA.quiz = [
  {
    q: ["비가 안 오는 날, 🔴 빨간 타이어(소프트)로 출발한 선수가 실격당하지 않으려면 결승선 전까지 꼭 해야 하는 것은?", "In a dry race, what MUST a driver starting on 🔴 Red (Soft) tyres do before the finish to avoid disqualification?"],
    o: [
      ["정비소에 최소 1번 들러서 다른 색깔 타이어(🟡노랑 또는 ⚪하양)로 갈아 끼운다", "Stop at least once to put on a different color tyre (🟡Yellow or ⚪White)"],
      ["똑같은 빨간 타이어로만 바꾸거나 끝까지 한 번도 안 멈춘다", "Only use Red tyres or never stop at all"]
    ],
    a: 0,
    e: ["비 안 오는 날엔 한 경기에 무조건 서로 다른 색깔 타이어 2종류 이상을 써야 해요!", "Dry races require using at least two different tyre colors!"]
  },
  {
    q: ["앞차에 막혀 추월이 힘들 때, 앞차보다 '1바퀴 먼저' 정비소에 들어가 새 타이어의 빠른 속도로 역전하는 작전 이름은?", "What do we call pitting '1 lap BEFORE' the car ahead to jump them using fresh-tyre speed?"],
    o: [
      ["⚡ 언더컷 (먼저 찌르기!)", "⚡ The Undercut!"],
      ["🔵 파란 깃발 (블루플랙)", "🔵 Blue Flag"]
    ],
    a: 0,
    e: ["앞차보다 먼저 들어가 새 타이어의 속도로 역전하는 가장 유명한 작전이 바로 '언더컷'이에요!", "Pitting earlier to jump a rival on fresh tyres is the Undercut!"]
  },
  {
    q: ["사고가 나서 노란 '안전차(세이프티카)'가 나왔을 때 다 같이 타이어를 바꾸러 들어가는 이유는?", "Why do drivers rush to pit when the yellow Safety Car comes out after a crash?"],
    o: [
      ["트랙 위 차들이 다 같이 천천히 달려서, 타이어 바꾸느라 손해 보는 시간이 절반(22초→10초)으로 줄어들기 때문!", "Because everyone on track must drive slowly, cutting pit-stop time loss in half (22s → 10s)!"],
      ["안전차를 추월하면 보너스 100점을 주기 때문", "Because passing the Safety Car gives 100 bonus points"]
    ],
    a: 0,
    e: ["안전차가 나와서 모두가 서행할 때 들어가면 등수 손해를 거의 안 보고 새 타이어로 바꿀 수 있어요!", "Pitting while the pack is slowed by the Safety Car saves ~12 seconds!"]
  },
  {
    q: ["직선 도로에서 자동차 뒷날개를 활짝 열어 시속 +15km 가속하는 '🚀 DRS 부스터'를 켜려면 앞차와 몇 초 이내여야 할까요?", "How close to the car ahead must you be to activate the '🚀 DRS Rear-Wing Boost (+15 km/h)' on the straight?"],
    o: [
      ["1.0초 이내!", "Within 1.0 second!"],
      ["10초 이내", "Within 10 seconds"]
    ],
    a: 0,
    e: ["앞차와 1.0초 안쪽으로 바짝 붙어야 DRS 부스터 버튼에 초록불이 켜져요!", "You must be within 1.0 second at the detection point to open DRS!"]
  },
  {
    q: ["1등 차가 너무 빨라서 한 바퀴 통째로 따라잡힌 꼴찌 차에게 '1등 지나가게 당장 길 비켜!'라며 흔드는 깃발은?", "Which flag is waved at a slow lapped car to say 'Move aside and let the race leader pass!'?"],
    o: [
      ["🔵 파란 깃발 (블루플랙)", "🔵 Blue Flag"],
      ["🏁 체크무늬 깃발", "🏁 Checkered Flag"]
    ],
    a: 0,
    e: ["파란 깃발을 3번 연속 무시하고 길을 안 비키면 벌칙(페널티)을 받게 돼요!", "Ignoring 3 Blue Flags in a row results in a penalty!"]
  }
];
