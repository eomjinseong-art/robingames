(() => {
  const D = window.F1DATA, SND = window.F1Audio;
  const K = "nadoo_f1_v2";
  let S = Object.assign(
    { lang: 0, unlocked: 1, st: 0, step: 0, done: {}, qIdx: 0, qScore: 0, primerIdx: 0, stageIntroDone: {}, mgMode: "pit" },
    (() => { try { return JSON.parse(localStorage.getItem(K) || "{}") || {}; } catch (e) { return {}; } })()
  );
  if (S.st !== "primer" && S.st !== "minigame" && S.st !== "quiz" && S.st !== "rules" && !(Number.isInteger(S.st) && S.st >= 0 && S.st < D.stages.length)) S.st = 0;
  if (Number.isInteger(S.st) && !(Number.isInteger(S.step) && S.step >= 0 && S.step < 50)) S.step = 0;
  if (!S.stageIntroDone) S.stageIntroDone = {};
  const save = () => localStorage.setItem(K, JSON.stringify(S));
  const L = (x) => (Array.isArray(x) ? x[S.lang] : x);
  const $ = (id) => document.getElementById(id);

  let pos = 0, scOn = false, myTyre = "S", myPos = 2, gap = "+1.2s", hintUsed = false, answered = false;
  let activeMiniGame = null;

  function applyHeader() {
    $("title").textContent = S.lang ? "🏎️ Nadoo F1 Pit Wall 101" : "🏎️ 나두 F1 피트월 101";
    $("openAll").textContent = S.lang ? "⚙️ Unlock All" : "⚙️ 전체 열기";
    $("lang").textContent = S.lang ? "한국어" : "EN";
    $("mute").textContent = SND.isMuted() ? "🔇" : "🔊";
  }

  $("openAll").onclick = () => {
    SND.click();
    S.unlocked = 5;
    for (let i = 0; i < 5; i++) S.stageIntroDone[i] = true;
    save();
    render();
  };
  $("lang").onclick = () => {
    SND.click();
    S.lang = S.lang ? 0 : 1;
    save();
    applyHeader();
    render();
  };
  $("mute").onclick = () => {
    $("mute").textContent = SND.toggle() ? "🔇" : "🔊";
  };

  function renderPrimerView(root) {
    const P = D.primer;
    const slides = P.slides;
    if (S.primerIdx < 0 || S.primerIdx >= slides.length) S.primerIdx = 0;
    const cur = slides[S.primerIdx];

    let dots = '<div style="display:flex;gap:8px;justify-content:center;margin:10px 0">';
    slides.forEach((sl, idx) => {
      const on = idx === S.primerIdx;
      dots += `<button data-pidx="${idx}" style="padding:7px 13px;border-radius:999px;font-weight:700;background:${on ? "var(--gold)" : "#222837"};color:${on ? "#0f172a" : "var(--tx)"};border:1.5px solid ${on ? "#fef08a" : "var(--ln)"}">${idx + 1}</button>`;
    });
    dots += "</div>";

    const box = document.createElement("div");
    box.className = "pn";
    box.style.borderColor = "var(--gold)";
    box.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <span style="background:rgba(250,204,21,0.18);color:var(--gold);padding:4px 12px;border-radius:999px;font-weight:700;font-size:15px">📖 ${S.lang ? "Step 0 · 1-Min F1 Beginner Guide" : "0단계 · F1이 무슨 경주야? (1분 왕초보 설명서)"} (${cur.num})</span>
        <button id="primerToStage1" class="btn-grn" style="padding:8px 14px;font-size:15px">${S.lang ? "🏎️ Start Stage 1 ▶" : "🏎️ 바로 Stage 1 시작하기 ▶"}</button>
      </div>
      ${dots}
      <div style="background:#10141f;border:1.5px solid var(--ln);border-radius:14px;padding:18px;margin-top:8px">
        <div style="font-size:21px;font-weight:700;color:#fff;margin-bottom:10px">${cur.icon} ${L(cur.title)}</div>
        <div style="background:rgba(56,189,248,0.12);border:1.5px dashed rgba(56,189,248,0.5);border-radius:10px;padding:11px 14px;font-weight:700;color:#bae6fd;margin-bottom:12px;font-size:16px;text-align:center">${cur.diagram}</div>
        <div style="white-space:pre-line;font-size:17px;font-weight:400;line-height:1.65;color:var(--tx)">${L(cur.body)}</div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:14px">
        <button id="pPrev" ${S.primerIdx === 0 ? "disabled style='opacity:0.4'" : ""}>⬅️ ${S.lang ? "Prev" : "이전 장"}</button>
        ${
          S.primerIdx < slides.length - 1
            ? `<button id="pNext" class="btn-gold" style="flex:1">${S.lang ? "Next Slide ➡️" : "다음 설명 보기 (" + (S.primerIdx + 2) + "/5) ➡️"}</button>`
            : `<button id="pFinish" class="btn-grn" style="flex:1">${S.lang ? "🎉 Got It! Start Stage 1 ▶" : "🎉 5장 모두 이해 완료! Stage 1 출발하기 ▶"}</button>`
        }
      </div>
    `;
    root.appendChild(box);

    box.querySelectorAll("[data-pidx]").forEach((b) => {
      b.onclick = () => {
        SND.click();
        S.primerIdx = +b.dataset.pidx;
        save();
        render();
      };
    });
    const prev = box.querySelector("#pPrev");
    if (prev) prev.onclick = () => { if (S.primerIdx > 0) { SND.click(); S.primerIdx--; save(); render(); } };
    const next = box.querySelector("#pNext");
    if (next) next.onclick = () => { SND.click(); S.primerIdx++; save(); render(); };
    const fin = box.querySelector("#pFinish");
    if (fin) fin.onclick = () => { SND.ok(); S.st = 0; S.step = 0; save(); render(); };
    box.querySelector("#primerToStage1").onclick = () => { SND.click(); S.st = 0; S.step = 0; save(); render(); };
  }

  function renderPitStopMiniGame(container, onDone) {
    let chosenTyre = "H";
    let wheels = [false, false, false, false];
    let tStart = 0;
    let elapsed = 0;

    const tyreColors = { S: ["#ef4444", "🔴 소프트(빨강·빠름)", "🔴 Soft (Fast)"], M: ["#facc15", "🟡 미디엄(노랑·균형)", "🟡 Medium (Balanced)"], H: ["#f8fafc", "⚪ 하드(하양·오래감)", "⚪ Hard (Durable)"] };

    function draw() {
      const doneCount = wheels.filter(Boolean).length;
      const allDone = doneCount === 4;
      const tc = tyreColors[chosenTyre][0];
      container.innerHTML = `
        <div class="pn" style="border:2px solid var(--gold);background:#111622">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
            <div style="font-size:19px;font-weight:700;color:var(--gold)">🔧 ${S.lang ? "Mini-Game 1: 2.0s Pit Stop Tyre Swap Challenge!" : "미니게임 1 · 2.0초 타이어 갈아 끼우기 챌린지!"}</div>
            <span style="background:#1e293b;padding:4px 12px;border-radius:999px;font-weight:700;color:#86efac">${doneCount} / 4 ${S.lang ? "Wheels" : "바퀴 완료"}</span>
          </div>
          <p style="margin:8px 0;font-weight:400;color:var(--tx)">${S.lang ? "Tap all 4 wheels as fast as you can to bolt on fresh tyres with the pneumatic wheel gun!" : "정비소(피트)에 우리 차가 멈췄어요! 1) 갈아 끼울 새 타이어 색깔을 고르고, 2) 바퀴 4개 버튼을 빠르게 다다다닥 눌러 전동건(위이잉!)으로 갈아 끼워 보세요!"}</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin:10px 0">
            ${["S", "M", "H"].map((k) => `<button data-tc="${k}" style="flex:1;border-color:${chosenTyre === k ? tyreColors[k][0] : "var(--ln)"};background:${chosenTyre === k ? "rgba(255,255,255,0.12)" : "#1e2433"}">${tyreColors[k][S.lang ? 2 : 1]}</button>`).join("")}
          </div>
          <div style="text-align:center;margin:10px 0;padding:12px;background:#0b0f19;border-radius:12px;border:1px solid var(--ln)">
            <div style="font-size:15px;color:var(--mu)">${S.lang ? "🏎️ Top-Down Pit Box View (Tap All 4 Wheels!)" : "🏎️ 위에서 본 정비소(피트 박스) — 바퀴 4개를 모두 터치하세요!"}</div>
            <div class="wheel-grid">
              ${[
                [0, S.lang ? "↖️ Front-Left Wheel" : "↖️ 앞왼쪽 바퀴"],
                [1, S.lang ? "↗️ Front-Right Wheel" : "↗️ 앞오른쪽 바퀴"],
                [2, S.lang ? "↙️ Rear-Left Wheel" : "↙️ 뒤왼쪽 바퀴"],
                [3, S.lang ? "↘️ Rear-Right Wheel" : "↘️ 뒤오른쪽 바퀴"]
              ].map(([idx, label]) => `
                <button class="wheel-btn ${wheels[idx] ? "done" : ""}" data-w="${idx}">
                  <span class="tb" style="border-color:${wheels[idx] ? tc : "#64748b"};color:${wheels[idx] ? tc : "#94a3b8"}">${wheels[idx] ? chosenTyre : "OLD"}</span>
                  ${wheels[idx] ? (S.lang ? "✅ Locked!" : "✅ 교체 완료!") : label}
                </button>
              `).join("")}
            </div>
            ${allDone ? `
              <div style="margin-top:10px;padding:12px;border-radius:10px;background:rgba(34,197,94,0.18);border:1.5px solid var(--grn)">
                <div style="font-size:21px;font-weight:700;color:#86efac">⏱️ ${elapsed.toFixed(2)}${S.lang ? "s! Pit Stop Complete!" : "초! 타이어 4개 교체 완료!"}</div>
                <div style="margin-top:4px;font-weight:400">${elapsed < 2.3 ? (S.lang ? "⚡ World-record Red Bull Pit Crew speed! You gained huge time on track!" : "⚡ 와우! 2초대 레드불 정비팀급 신기록이에요! 이러면 앞차를 단숨에 언더컷으로 제칠 수 있어요!") : (S.lang ? "👍 Clean pit stop! Fresh tyres are ready to roll!" : "👍 안정적인 타이어 교체 성공! 이제 새 타이어로 쌩쌩 달릴 수 있어요!")}</div>
                <div style="display:flex;gap:8px;justify-content:center;margin-top:10px">
                  <button id="pitRetry">🔄 ${S.lang ? "Try Faster" : "더 빠른 기록 도전"}</button>
                  ${onDone ? `<button id="pitCont" class="btn-grn">${S.lang ? "Continue Stage ▶" : "좋았어! 다음 문제로 이동 ▶"}</button>` : ""}
                </div>
              </div>
            ` : `<div style="font-size:15px;color:var(--gold)">⚡ ${S.lang ? "First wheel tap starts the stopwatch!" : "첫 번째 바퀴를 누르는 순간 초시계가 작동합니다!"}</div>`}
          </div>
        </div>
      `;

      container.querySelectorAll("[data-tc]").forEach((b) => {
        b.onclick = () => { SND.click(); chosenTyre = b.dataset.tc; myTyre = chosenTyre; draw(); };
      });
      container.querySelectorAll("[data-w]").forEach((b) => {
        b.onclick = () => {
          const idx = +b.dataset.w;
          if (wheels[idx]) return;
          if (!tStart) tStart = performance.now();
          wheels[idx] = true;
          SND.pitGun();
          if (wheels.every(Boolean)) {
            elapsed = Math.max(1.65, (performance.now() - tStart) / 1000 + 1.1);
            myTyre = chosenTyre;
            SND.ok();
          }
          draw();
        };
      });
      const retry = container.querySelector("#pitRetry");
      if (retry) retry.onclick = () => { SND.click(); wheels = [false, false, false, false]; tStart = 0; draw(); };
      const cont = container.querySelector("#pitCont");
      if (cont && onDone) cont.onclick = () => { SND.click(); onDone(); };
    }
    draw();
  }

  function renderDrsDuelMiniGame(container, onDone) {
    let phase = 0; // 0: 1.4s behind, 1: slipstream (0.6s behind, DRS ready!), 2: DRS boost passed P1!

    function draw() {
      const gapStr = phase === 0 ? "1.4초 (DRS 불가 ❌)" : phase === 1 ? "0.6초 (1초 이내 달성! 🟢 DRS 가능!)" : "추월 성공! 🏆 1등(P1)!";
      const gapEn = phase === 0 ? "1.4s (Too far for DRS ❌)" : phase === 1 ? "0.6s (<1.0s! 🟢 DRS Ready!)" : "Overtake Complete! 🏆 P1!";
      const spd = phase === 0 ? "308 km/h" : phase === 1 ? "324 km/h (바람막이 효과!)" : "342 km/h (🚀 뒷날개 활짝 OPEN!)";
      const myX = phase === 0 ? 70 : phase === 1 ? 155 : 295;
      const myY = phase === 2 ? 32 : 68;
      const rivX = phase === 2 ? 205 : 235;

      container.innerHTML = `
        <div class="pn" style="border:2px solid var(--grn);background:#111622">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
            <div style="font-size:19px;font-weight:700;color:#86efac">🚀 ${S.lang ? "Mini-Game 2: Slipstream & DRS Rear-Wing Overtake!" : "미니게임 2 · 바람막이(슬립스트림) & DRS 뒷날개 부스터 추월!"}</div>
            <span style="background:#1e293b;padding:4px 12px;border-radius:999px;font-weight:700;color:var(--gold)">${S.lang ? gapEn : gapStr}</span>
          </div>
          <p style="margin:8px 0;font-weight:400;color:var(--tx)">${S.lang ? "Step 1: Tuck right behind the rival to cut wind resistance and drop the gap under 1.0s. Step 2: Hit the green DRS Rear-Wing Boost (+15 km/h) to blast into 1st place!" : "1단계: 먼저 앞차 바로 뒤에 바짝 붙어 바람 저항을 줄이세요(간격 1.4초 ➔ 0.6초). 2단계: 간격이 1초 안으로 들어와 초록불이 켜지면 [🟢 DRS 뒷날개 부스터 ON!]을 눌러 시속 342km로 추월하세요!"}</p>
          <svg viewBox="0 0 420 115" style="width:100%;background:#0a0d14;border-radius:12px;border:1.5px solid var(--ln);margin:8px 0">
            <line x1="0" y1="18" x2="420" y2="18" stroke="#475569" stroke-width="2"/>
            <line x1="0" y1="56" x2="420" y2="56" stroke="#334155" stroke-dasharray="10 8" stroke-width="2"/>
            <line x1="0" y1="96" x2="420" y2="96" stroke="#475569" stroke-width="2"/>
            ${phase >= 1 ? `<path d="M ${rivX - 50} 68 L ${rivX} 55 L ${rivX} 81 Z" fill="rgba(56,189,248,0.22)"/>` : ""}
            <g transform="translate(${rivX}, 58)">
              <rect width="58" height="22" rx="6" fill="#2563eb" stroke="#93c5fd" stroke-width="1.5"/>
              <text x="29" y="15" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">#33 VER</text>
            </g>
            <g transform="translate(${myX}, ${myY})">
              ${phase === 2 ? `<polygon points="-26,4 0,2 0,20 -26,18" fill="#facc15" opacity="0.85"/>` : ""}
              <rect width="62" height="22" rx="6" fill="#e10600" stroke="#fde047" stroke-width="2"/>
              <text x="31" y="15" text-anchor="middle" fill="#fff" font-size="11" font-weight="700">${phase === 2 ? "🚀 #1 NAD" : "#1 NAD"}</text>
            </g>
            <text x="14" y="110" fill="#cbd5e1" font-size="12" font-weight="700">⚡ ${S.lang ? "My Speed: " : "내 속도: "}${spd}</text>
          </svg>
          <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px">
            ${phase === 0 ? `<button id="drsStep1" class="btn-gold glow" style="padding:14px;font-size:17px">💨 ${S.lang ? "Step 1: Tuck Behind Rival (Slipstream: 1.4s ➔ 0.6s!)" : "1단계: 앞차 바로 뒤에 바짝 붙기! (바람막이 효과로 1.4초 ➔ 0.6초 좁히기)"}</button>` : ""}
            ${phase === 1 ? `<button id="drsStep2" class="btn-grn glow" style="padding:14px;font-size:17px">🟢 ${S.lang ? "Step 2: 1.0s Reached! OPEN DRS REAR WING (+15 km/h Overtake!)" : "2단계: 1.0초 이내 달성! 🟢 DRS 뒷날개 활짝 열고 342km/h로 1등 추월하기!"}</button>` : ""}
            ${phase === 2 ? `
              <div style="padding:12px;border-radius:10px;background:rgba(34,197,94,0.18);border:1.5px solid var(--grn);text-align:center">
                <div style="font-size:20px;font-weight:700;color:#86efac">🏆 ${S.lang ? "342 km/h Slingshot Pass Complete! You are P1!" : "시속 342km 추월 대성공! 뒷날개(DRS)를 열어 단숨에 1등으로 올라섰어요!"}</div>
                <div style="display:flex;gap:8px;justify-content:center;margin-top:10px">
                  <button id="drsReplay">🔄 ${S.lang ? "Replay Pass" : "다시 추월해보기"}</button>
                  ${onDone ? `<button id="drsCont" class="btn-grn">${S.lang ? "Continue Stage ▶" : "좋았어! 다음 문제로 이동 ▶"}</button>` : ""}
                </div>
              </div>
            ` : ""}
          </div>
        </div>
      `;
      const b1 = container.querySelector("#drsStep1");
      if (b1) b1.onclick = () => { SND.drs(); phase = 1; gap = "+0.6s"; draw(); };
      const b2 = container.querySelector("#drsStep2");
      if (b2) b2.onclick = () => { SND.drs(); SND.ok(); phase = 2; myPos = 1; gap = "Leader"; draw(); };
      const rep = container.querySelector("#drsReplay");
      if (rep) rep.onclick = () => { SND.click(); phase = 0; draw(); };
      const cont = container.querySelector("#drsCont");
      if (cont && onDone) cont.onclick = () => { SND.click(); onDone(); };
    }
    draw();
  }

  function render() {
    applyHeader();
    const root = $("app");
    root.innerHTML = "";

    const tabs = document.createElement("div");
    tabs.className = "tabs";
    const mkTab = (label, active, fn) => {
      const b = document.createElement("button");
      b.textContent = label;
      if (active) b.className = "on";
      b.onclick = () => { SND.click(); fn(); };
      tabs.appendChild(b);
    };
    mkTab(S.lang ? "📖 0. 1-Min Guide" : "📖 0단계 · 1분 왕초보 설명서", S.st === "primer", () => { S.st = "primer"; save(); render(); });
    for (let i = 0; i < 5; i++) {
      const lock = i + 1 > S.unlocked;
      const clear = S.done[i] ? "✅ " : lock ? "🔒 " : "";
      mkTab(`${clear}Stage ${i + 1}`, S.st === i, () => {
        if (!lock) { S.st = i; S.step = 0; hintUsed = false; answered = false; activeMiniGame = null; save(); render(); }
      });
    }
    mkTab(S.lang ? "🎮 Mini-Games (2)" : "🎮 미니게임 2종", S.st === "minigame", () => { S.st = "minigame"; save(); render(); });
    mkTab(S.lang ? "📺 TV & Rules" : "📺 중계 해독·규칙 백과", S.st === "rules", () => { S.st = "rules"; save(); render(); });
    mkTab(S.lang ? "🎓 Quiz" : "🎓 졸업 퀴즈", S.st === "quiz", () => { S.st = "quiz"; S.qIdx = 0; S.qScore = 0; save(); render(); });
    root.appendChild(tabs);

    if (S.st === "primer") return renderPrimerView(root);
    if (S.st === "minigame") {
      const wrap = document.createElement("div");
      wrap.innerHTML = `
        <div class="pn" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
          <div>
            <div style="font-size:20px;font-weight:700;color:var(--gold)">🎮 ${S.lang ? "F1 Arcade Mini-Game Zone" : "F1 아케이드 미니게임 놀이터"}</div>
            <div style="font-size:15.5px;color:var(--mu)">${S.lang ? "Experience 2-second tyre stops and 342 km/h DRS overtakes firsthand!" : "2.0초 타이어 갈아 끼우기와 시속 342km DRS 뒷날개 부스터 추월을 직접 손으로 체험해 보세요!"}</div>
          </div>
          <div style="display:flex;gap:8px">
            <button id="mgTabPit" class="${S.mgMode === "pit" ? "btn-gold" : ""}">🔧 ${S.lang ? "Pit Stop Challenge" : "2.0초 타이어 교체"}</button>
            <button id="mgTabDrs" class="${S.mgMode === "drs" ? "btn-grn" : ""}">🚀 ${S.lang ? "DRS Overtake Duel" : "DRS 부스터 추월"}</button>
          </div>
        </div>
        <div id="mgHost"></div>
      `;
      root.appendChild(wrap);
      wrap.querySelector("#mgTabPit").onclick = () => { SND.click(); S.mgMode = "pit"; save(); render(); };
      wrap.querySelector("#mgTabDrs").onclick = () => { SND.click(); S.mgMode = "drs"; save(); render(); };
      const host = wrap.querySelector("#mgHost");
      if (S.mgMode === "drs") renderDrsDuelMiniGame(host, null);
      else renderPitStopMiniGame(host, null);
      return;
    }
    if (S.st === "rules") return renderRules(root);
    if (S.st === "quiz") return renderQuiz(root);

    // Quick Beginner Banner at top of Stage 1
    if (S.st === 0) {
      const banner = document.createElement("div");
      banner.className = "pn";
      banner.style.cssText = "border-color:var(--gold);background:linear-gradient(135deg,#1e1b2e,#151924);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px";
      banner.innerHTML = `
        <div>
          <div style="font-weight:700;font-size:18px;color:var(--gold)">${L(D.primer.btn)}</div>
          <div style="font-size:15.5px;color:var(--tx);margin-top:2px">${L(D.primer.sub)}</div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button id="openPrimerBtn" class="btn-gold">${S.lang ? "📖 Read 1-Min Guide (5 Cards)" : "📖 1분 왕초보 설명서 열기 (5장)"}</button>
          <button id="openMgBtn" class="btn-grn">${S.lang ? "🎮 Play Mini-Games" : "🎮 타이어·DRS 미니게임 바로 하기"}</button>
        </div>
      `;
      root.appendChild(banner);
      banner.querySelector("#openPrimerBtn").onclick = () => { SND.click(); S.st = "primer"; S.primerIdx = 0; save(); render(); };
      banner.querySelector("#openMgBtn").onclick = () => { SND.click(); S.st = "minigame"; save(); render(); };
    }

    const st = D.stages[S.st];

    // Step 0 Stage Tutorial Card before questions begin
    if (!S.stageIntroDone[S.st]) {
      const tut = document.createElement("div");
      tut.className = "pn";
      tut.style.borderColor = "var(--blue)";
      tut.innerHTML = `
        <div style="display:inline-block;background:rgba(56,189,248,0.18);color:#7dd3fc;padding:4px 12px;border-radius:999px;font-weight:700;font-size:15px;margin-bottom:8px">📘 ${S.lang ? "30-Second Stage Briefing" : "시작 전 30초 핵심 튜토리얼"}</div>
        <h2 style="margin:4px 0 10px;font-size:22px;color:#fff">${L(st.t)}</h2>
        <div class="easy-rule-box">
          <div class="er-label">💡 ${S.lang ? "One-Line Summary" : "왕초보 한줄 핵심"}</div>
          <div class="er-text">${L(st.easyRule)}</div>
        </div>
        <div style="display:grid;gap:10px;margin:12px 0">
          <div style="background:#10141f;padding:12px 14px;border-radius:12px;border-left:4px solid var(--gold)">
            <div style="font-weight:700;color:var(--gold);margin-bottom:4px">📌 ${S.lang ? "What You'll Learn" : "이번 스테이지에서 무엇을 배우나요?"}</div>
            <div style="font-weight:400">${L(st.tutWhat)}</div>
          </div>
          <div style="background:#10141f;padding:12px 14px;border-radius:12px;border-left:4px solid var(--blue)">
            <div style="font-weight:700;color:#7dd3fc;margin-bottom:4px">❓ ${S.lang ? "Why Does This Rule Exist?" : "왜 이런 규칙·작전이 생겼나요?"}</div>
            <div style="font-weight:400">${L(st.tutWhy)}</div>
          </div>
          <div style="background:#10141f;padding:12px 14px;border-radius:12px;border-left:4px solid var(--grn)">
            <div style="font-weight:700;color:#86efac;margin-bottom:4px">🎮 ${S.lang ? "How to Play" : "어떻게 플레이하나요?"}</div>
            <div style="font-weight:400">${L(st.tutHow)}</div>
          </div>
        </div>
        <button id="startStageBtn" class="btn-grn glow" style="width:100%;padding:15px;font-size:18px;margin-top:6px">✅ ${S.lang ? "Got It! Start Guided Demo ▶" : "이해했어! 따라 하기로 직접 해보기 ▶"}</button>
      `;
      root.appendChild(tut);
      tut.querySelector("#startStageBtn").onclick = () => {
        SND.ok();
        S.stageIntroDone[S.st] = true;
        save();
        render();
      };
      return;
    }

    const total = 1 + st.sc.length;
    const isGuide = S.step === 0;
    const item = isGuide ? st.guide : st.sc[S.step - 1];
    const tc = { S: ["#ef4444", "🔴소프트"], M: ["#facc15", "🟡미디엄"], H: ["#f8fafc", "⚪하드"], I: ["#22c55e", "🟢비타이어"] }[myTyre] || ["#ef4444", "🔴소프트"];

    const wall = document.createElement("div");
    wall.className = "wall";
    wall.innerHTML = `
      <div class="pn">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px">
          <strong style="font-size:19px">${L(st.t)}</strong>
          <button id="reopenTut" style="padding:5px 10px;font-size:14px">📘 ${S.lang ? "30s Briefing" : "설명 다시 보기"}</button>
        </div>
        <div class="easy-rule-box">
          <div class="er-label">💡 ${S.lang ? "Core Rule" : "핵심 규칙 요약"} (${S.step + 1} / ${total})</div>
          <div class="er-text">${L(st.easyRule)}</div>
        </div>
        <div class="goal">${L(st.goal)}</div>
        <p style="color:var(--mu);margin:6px 0;font-size:15.5px">${L(st.learn)}</p>
        <div style="margin-top:12px;font-weight:700;font-size:18px;color:#fff">${L(item.q)}</div>
        <div class="opts" id="opts"></div>
        ${isGuide ? `<button id="hintBtn" style="margin-top:10px">💡 ${S.lang ? "Hint" : "힌트 보기"}</button>` : ""}
        <div id="fb"></div>
        <div id="mgInline" style="margin-top:12px"></div>
      </div>
      <div class="pn">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <strong>📡 ${S.lang ? "Live Track & Leaderboard" : "실시간 트랙 & 순위표"}</strong>
          <span id="scBadge" style="color:var(--gold);font-weight:700">${scOn ? "🟡 SAFETY CAR (서행 중)" : "🟢 GREEN FLAG (정상 주행)"}</span>
        </div>
        <svg viewBox="0 0 260 130" style="width:100%;background:#0c0f16;border-radius:10px;margin-top:8px;border:1px solid var(--ln)">
          <rect x="20" y="20" width="220" height="90" rx="42" fill="none" stroke="#334155" stroke-width="14"/>
          <path d="M 75 110 L 90 94 L 170 94 L 185 110" fill="none" stroke="#facc15" stroke-dasharray="4 3" stroke-width="2"/>
          <text x="130" y="90" text-anchor="middle" fill="#fde047" font-size="10" font-weight="700">🔧 ${S.lang ? "PIT LANE (정비소)" : "정비소 (피트 레인)"}</text>
          <circle id="rivalDot" cx="70" cy="20" r="7" fill="#38bdf8"/>
          <circle id="myDot" cx="120" cy="20" r="8" fill="#e10600" stroke="#fff" stroke-width="2"/>
        </svg>
        <div class="tower">
          <div class="${myPos === 1 ? "me" : ""}"><span>1위</span><strong>${myPos === 1 ? "🏎️ 나 (나두 F1)" : "VER (베르스타펜)"}</strong><span class="tb" style="border-color:${myPos === 1 ? tc[0] : "#f8fafc"};color:${myPos === 1 ? tc[0] : "#f8fafc"}">${myPos === 1 ? myTyre : "H"}</span><span style="margin-left:auto">${myPos === 1 ? "선두(Leader)" : "+0.0s"}</span></div>
          <div class="${myPos === 2 ? "me" : ""}"><span>2위</span><strong>${myPos === 2 ? "🏎️ 나 (나두 F1)" : "VER (베르스타펜)"}</strong><span class="tb" style="border-color:${myPos === 2 ? tc[0] : "#f8fafc"};color:${myPos === 2 ? tc[0] : "#f8fafc"}">${myPos === 2 ? myTyre : "H"}</span><span style="margin-left:auto">${myPos === 2 ? gap : "+1.1s"}</span></div>
          <div><span>3위</span><strong>NOR (노리스)</strong><span class="tb" style="border-color:#facc15;color:#facc15">M</span><span style="margin-left:auto">+4.8s</span></div>
        </div>
        <div style="margin-top:10px;padding:10px;border-radius:10px;background:#10141f;font-size:15px;color:var(--mu)">
          🛞 ${S.lang ? "My Current Tyre: " : "현재 내 타이어: "}<strong style="color:${tc[0]}">${tc[1]}</strong> · ${S.lang ? "Red=Fast/Short, Yellow=Balanced, White=Long life" : "빨강=빠름, 노랑=균형, 하양=오래감"}
        </div>
      </div>
    `;
    root.appendChild(wall);

    wall.querySelector("#reopenTut").onclick = () => {
      SND.click();
      S.stageIntroDone[S.st] = false;
      save();
      render();
    };

    const opts = wall.querySelector("#opts"), fb = wall.querySelector("#fb"), mgInline = wall.querySelector("#mgInline");
    const hb = wall.querySelector("#hintBtn");
    if (hb) hb.onclick = () => { SND.click(); hintUsed = true; fb.innerHTML = `<div class="fb">💡 ${L(item.h)}</div>`; renderOpts(); };

    function advanceStep() {
      if (S.step + 1 < total) {
        S.step++;
        hintUsed = false;
        answered = false;
        activeMiniGame = null;
        save();
        render();
      } else {
        S.done[S.st] = true;
        if (S.unlocked < 5 && S.st + 1 >= S.unlocked) S.unlocked = S.st + 2;
        save();
        fb.innerHTML = `<div class="fb ok">🏆 ${S.lang ? "Stage Clear!" : "스테이지 클리어! 이제 이 규칙을 완벽히 마스터했어요!"}<div style="margin-top:10px"><button class="btn-grn" id="nxtSt">${S.st < 4 ? (S.lang ? "Next Stage ▶" : "다음 스테이지로 이동 ▶") : (S.lang ? "🎓 Graduate Quiz ▶" : "🎓 졸업 퀴즈 풀러 가기 ▶")}</button></div></div>`;
        $("nxtSt").onclick = () => { SND.ok(); S.st = S.st < 4 ? S.st + 1 : "quiz"; S.step = 0; save(); render(); };
      }
    }

    function renderOpts() {
      opts.innerHTML = "";
      item.o.forEach((o, idx) => {
        const b = document.createElement("button");
        b.textContent = L(o);
        if ((isGuide && idx === item.a) || (hintUsed && idx === item.a)) b.classList.add("glow");
        b.onclick = () => {
          if (idx === item.a) {
            SND.ok();
            answered = true;
            if (item.ev === "pit") { SND.pitGun(); myTyre = S.step === 2 ? "I" : "H"; gap = "+0.5s"; }
            if (item.ev === "swap") { SND.drs(); myPos = 1; gap = "Leader"; }
            if (item.ev === "sc") { SND.Alert(); scOn = true; myPos = 1; }
            fb.innerHTML = `<div class="fb ok">✅ ${L(item.e)}<div style="margin-top:10px"><button class="btn-gold" id="nxtBtn">${S.lang ? "Next ▶" : "다음 단계로 ▶"}</button></div></div>`;
            $("nxtBtn").onclick = () => { SND.click(); advanceStep(); };
            if (item.minigame === "pit") renderPitStopMiniGame(mgInline, advanceStep);
            if (item.minigame === "drs") renderDrsDuelMiniGame(mgInline, advanceStep);
          } else {
            SND.bad();
            fb.innerHTML = `<div class="fb bad">❌ ${S.lang ? "Wait! Think about tyre life and time loss:" : "앗! 다시 한번 생각해 볼까요?"} ${L(item.e)}</div>`;
          }
        };
        opts.appendChild(b);
      });
    }
    renderOpts();
  }

  function renderRules(root) {
    let h = `<div class="pn"><strong>📺 ${S.lang ? "F1 TV Broadcast Scoreboard Decoder" : "F1 TV 중계 화면 글자 1초 해독기"}</strong><div class="grid" style="margin-top:10px">`;
    D.tv.forEach((r) => {
      h += `<div class="pn" style="margin:0;background:#10141f"><strong style="color:var(--gold);font-size:18px">${r[0]}</strong><div style="color:var(--tx);font-size:16px;margin-top:4px">${r[S.lang ? 2 : 1]}</div></div>`;
    });
    h += `</div></div>`;
    D.cards.forEach((c) => {
      h += `<details open><summary>${c[S.lang ? 1 : 0]}</summary><p>${c[S.lang ? 3 : 2]}</p></details>`;
    });
    const d = document.createElement("div");
    d.innerHTML = h;
    root.appendChild(d);
  }

  function renderQuiz(root) {
    const q = D.quiz[S.qIdx];
    const box = document.createElement("div");
    box.className = "pn";
    if (!q) {
      box.innerHTML = `<h2>🎓 ${S.lang ? "Certified F1 Pit Wall Strategist!" : "축하합니다! F1 피트월 총감독 수료 완료!"} (${S.qScore}/${D.quiz.length})</h2><p>${S.lang ? "You now understand Tyre Colors, the Undercut, Safety Cars, and DRS Boost!" : "이제 빨강·노랑·하양 타이어 규칙, 언더컷 역전 작전, 세이프티카 반값 찬스, 그리고 DRS 뒷날개 부스터까지 모두 마스터하셨어요!"}</p><button class="btn-gold" id="reQ">${S.lang ? "Retry Quiz" : "퀴즈 다시 풀기"}</button>`;
      root.appendChild(box);
      $("reQ").onclick = () => { S.qIdx = 0; S.qScore = 0; render(); };
      return;
    }
    box.innerHTML = `<strong>🎓 Q${S.qIdx + 1}/${D.quiz.length}</strong><p style="font-size:18px;font-weight:700;margin:10px 0">${L(q.q)}</p><div class="opts" id="qOpts"></div><div id="qFb"></div>`;
    root.appendChild(box);
    q.o.forEach((o, i) => {
      const b = document.createElement("button");
      b.textContent = L(o);
      b.onclick = () => {
        const ok = i === q.a;
        if (ok) { SND.ok(); S.qScore++; } else SND.bad();
        $("qFb").innerHTML = `<div class="fb ${ok ? "ok" : "bad"}">${ok ? "✅ " : "❌ "}${L(q.e)}<div style="margin-top:8px"><button class="btn-gold" id="qNxt">${S.lang ? "Next ▶" : "다음 문제 ▶"}</button></div></div>`;
        $("qNxt").onclick = () => { S.qIdx++; render(); };
      };
      $("qOpts").appendChild(b);
    });
  }

  let started = false;
  document.addEventListener("click", () => { started = true; }, true);
  setInterval(() => {
    if (!started) return;
    pos = (pos + (scOn ? 2 : 6)) % 360;
    const rad = (pos * Math.PI) / 180;
    const m = $("myDot"), r = $("rivalDot");
    if (m && r) {
      m.setAttribute("cx", 130 + Math.cos(rad) * 90);
      m.setAttribute("cy", 65 + Math.sin(rad) * 38);
      const r2 = rad + (myPos === 1 ? -0.35 : 0.35);
      r.setAttribute("cx", 130 + Math.cos(r2) * 90);
      r.setAttribute("cy", 65 + Math.sin(r2) * 38);
    }
  }, 90);

  render();
})();
