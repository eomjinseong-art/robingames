(function () {
  'use strict';
  var P = window.PokerOuts;
  var app = document.getElementById('app');
  var STATS_KEY = 'nadoo_outs_trainer_v1';
  var MUTE_KEY = 'nadoo_outs_mute';

  function emptyBucket() { return { n: 0, correct: 0, streak: 0, best: 0, miss: {} }; }
  function loadStats() {
    try {
      var s = JSON.parse(localStorage.getItem(STATS_KEY) || 'null');
      if (s && s.outs && s.pot && s.chart) return s;
    } catch (e) {}
    return { outs: emptyBucket(), pot: emptyBucket(), chart: emptyBucket() };
  }
  function saveStats() {
    try { localStorage.setItem(STATS_KEY, JSON.stringify(stats)); } catch (e) {}
  }

  var mode = 'quiz';
  var stats = loadStats();
  var muted = false;
  try { muted = localStorage.getItem(MUTE_KEY) === '1'; } catch (e) {}
  var hint = '';
  var quizBag = [];
  var potBag = [];
  var quiz = null;
  var draft = blank();
  var graded = null;
  var pot = null;
  var potPick = null;
  var chartPos = 'late';
  var chartView = 'grid';
  var focus = { row: 0, col: 1 };
  var spot = null;
  var spotPick = null;
  var hand = null;
  var handPick = null;
  var handDraft = blank();
  var handGraded = null;

  function blank() { return { type: '', outs: '', prob: '' }; }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function take(bag) {
    if (!bag.length) {
      P.TYPES.forEach(function (t) { bag.push(t.id); });
      shuffle(bag);
    }
    return bag.pop();
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function typeName(id) {
    var t = P.TYPES.filter(function (x) { return x.id === id; })[0];
    return t ? t.ko : '';
  }
  function actionKo(a) { return a === 'raise' ? '레이즈' : a === 'call' ? '콜' : '폴드'; }

  function newQuiz() {
    var type = take(quizBag);
    var streets = P.legalStreets(type);
    quiz = P.generate(type, { street: streets[Math.floor(Math.random() * streets.length)] });
    draft = blank();
    graded = null;
    hint = '';
  }
  function newPot() {
    pot = P.generatePot({ type: take(potBag) });
    potPick = null;
    hint = '';
  }
  function newSpot() {
    spot = P.randomChartSpot();
    spotPick = null;
    hint = '';
  }
  function newHand() {
    hand = P.generateFullHand();
    handPick = null;
    handDraft = blank();
    handGraded = null;
    hint = '';
  }

  newQuiz();
  newPot();
  newSpot();
  newHand();

  function record(bucket, ok, typeId) {
    var s = stats[bucket];
    s.n += 1;
    if (ok) {
      s.correct += 1;
      s.streak += 1;
      if (s.streak > s.best) s.best = s.streak;
    } else {
      s.streak = 0;
      if (typeId) s.miss[typeId] = (s.miss[typeId] || 0) + 1;
    }
    saveStats();
  }

  var audio = null;
  function sfx(ok) {
    if (muted) return;
    var A = window.AudioContext || window.webkitAudioContext;
    if (!A) return;
    if (!audio) audio = new A();
    if (audio.state === 'suspended') audio.resume();
    var t = audio.currentTime;
    var o = audio.createOscillator();
    var g = audio.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(ok ? 620 : 196, t);
    o.frequency.exponentialRampToValueAtTime(ok ? 880 : 130, t + .12);
    g.gain.setValueAtTime(.06, t);
    g.gain.exponentialRampToValueAtTime(.0008, t + .16);
    o.connect(g); g.connect(audio.destination);
    o.start(t); o.stop(t + .18);
  }

  function suitSvg(suit) {
    var body = '';
    if (suit === 'h') body = '<path d="M12 20.7 10.6 19.4C6 15.2 3.1 12.5 3.1 9.1 3.1 6.4 5.2 4.3 7.9 4.3c1.6 0 3 .72 4.1 1.95C13.1 5.02 14.5 4.3 16.1 4.3c2.7 0 4.8 2.1 4.8 4.8 0 3.4-2.9 6.1-7.5 10.3L12 20.7z"/>';
    else if (suit === 'd') body = '<path d="M12 2.1 21.4 12 12 21.9 2.6 12z"/>';
    else if (suit === 's') body = '<path d="M12 2.2C8.3 6.5 4.6 9.6 4.6 13.6a4.7 4.7 0 0 0 5.8 4.5c-.7 1.5-1.4 2.6-1.6 3.8h6.4c-.2-1.2-.9-2.3-1.6-3.8a4.7 4.7 0 0 0 5.8-4.5c0-4-3.7-7.1-7.4-11.4z"/>';
    else body = '<circle cx="12" cy="7.1" r="3.55"/><circle cx="7.35" cy="12.35" r="3.55"/><circle cx="16.65" cy="12.35" r="3.55"/><path d="M10.7 20.9c.25-2.5.55-3.7 1.3-5.3.75 1.6 1.05 2.8 1.3 5.3z"/>';
    return '<svg class="suit" viewBox="0 0 24 24" aria-hidden="true">' + body + '</svg>';
  }

  function cardEl(c, mini) {
    var red = c.suit === 'h' || c.suit === 'd';
    var rank = P.rankLabel(c.rank);
    var label = (c.suit === 's' ? '스페이드 ' : c.suit === 'h' ? '하트 ' : c.suit === 'd' ? '다이아몬드 ' : '클럽 ') + rank;
    return '<div class="pcard' + (red ? ' red' : '') + (rank === '10' ? ' ten' : '') + (mini ? ' mini' : '') + '" data-code="' + c.code + '" role="img" aria-label="' + esc(label) + '">' +
      '<span class="corner tl"><b>' + rank + '</b>' + suitSvg(c.suit) + '</span>' +
      '<span class="mid">' + suitSvg(c.suit) + '</span>' +
      '<span class="corner br"><b>' + rank + '</b>' + suitSvg(c.suit) + '</span></div>';
  }
  function cardRow(list, mini) {
    return '<div class="cards">' + list.map(function (c) { return cardEl(c, mini); }).join('') + '</div>';
  }
  function backs(n) {
    var s = '';
    for (var i = 0; i < n; i++) s += '<i class="back"></i>';
    return '<span class="backs" aria-hidden="true">' + s + '</span>';
  }
  function tableHtml(a) {
    var left = a.street === 'flop' ? 2 : 1;
    return '<section class="table"><div class="street"><span class="badge">' + esc(a.streetLabel) + '</span>' + backs(left) + '</div>' +
      '<div class="rowlabel">내 핸드</div>' + cardRow(a.hole, false) +
      '<div class="rowlabel">보드</div>' + cardRow(a.board, false) + '</section>';
  }
  function statsHtml(bucket, withMiss) {
    var s = stats[bucket];
    var acc = s.n ? Math.round(100 * s.correct / s.n) + '%' : '—';
    var html = '<div class="stats">정답률 <b>' + acc + '</b> · ' + s.correct + '/' + s.n + ' · 연속 <b>' + s.streak + '</b> · 최장 ' + s.best;
    if (withMiss) {
      var top = Object.keys(s.miss).map(function (id) { return { id: id, n: s.miss[id] }; }).sort(function (a, b) { return b.n - a.n; }).slice(0, 3);
      html += '<div class="miss">자주 틀린 드로우: ' + (top.length ? top.map(function (t) { return esc(typeName(t.id)) + ' ' + t.n + '번'; }).join(' · ') : '아직 없어요') + '</div>';
    }
    return html + '</div>';
  }

  function typeGrid(selected, locked, scope) {
    return '<div class="type-grid">' + P.TYPES.map(function (t) {
      var cls = selected === t.id ? ' sel' : '';
      return '<button type="button" class="type-btn' + cls + '" data-act="type" data-scope="' + scope + '" data-type="' + t.id + '"' + (locked ? ' disabled' : '') + '>' + esc(t.ko) + '</button>';
    }).join('') + '</div>';
  }
  function chipsHtml(scope) {
    var vals = [4, 8, 12, 16, 18, 24, 28, 30, 32, 36, 60];
    return '<div class="chips">' + vals.map(function (v) {
      return '<button type="button" class="chip" data-act="chip" data-scope="' + scope + '" data-v="' + v + '">' + v + '%</button>';
    }).join('') + '</div>';
  }
  function answerForm(a, d, locked, scope) {
    var mult = a.street === 'flop' ? 4 : 2;
    return '<div class="step">1. 어떤 드로우인가요?</div>' + typeGrid(d.type, locked, scope) +
      '<div class="step">2. 아웃츠는 몇 장인가요?</div>' +
      '<label class="field">아웃츠 <input inputmode="numeric" data-field="' + (scope === 'h' ? 'houts' : 'outs') + '" value="' + esc(d.outs) + '"' + (locked ? ' disabled' : '') + ' aria-label="아웃츠 장수"> <span class="unit">장</span></label>' +
      '<div class="step">3. 확률은 몇 %인가요? (4-2 규칙)</div>' +
      '<p class="disclaimer" style="margin:0 0 6px">플랍은 아웃츠 × 4, 턴은 아웃츠 × 2. 이 판은 × ' + mult + '. 백도어는 한 장 아웃츠가 없어요.</p>' +
      '<label class="field">약 <input inputmode="decimal" data-field="' + (scope === 'h' ? 'hprob' : 'prob') + '" value="' + esc(d.prob) + '"' + (locked ? ' disabled' : '') + ' aria-label="확률 퍼센트"> <span class="unit">%</span></label>' +
      chipsHtml(scope);
  }

  function line(label, ok, right, mine) {
    return '<div class="check"><span>' + label + '</span><span>내 답 ' + esc(mine) + ' · 정답 ' + esc(right) + ' <b class="' + (ok ? 'ok' : 'no') + '">' + (ok ? '맞음' : '다름') + '</b></span></div>';
  }
  function explainHtml(a, grade, d) {
    var mineType = typeName(d.type) || '선택 안 함';
    var outsRight = a.backdoor ? '0장' : (a.outCount + '장');
    var probRight = a.backdoor ? ('정확 ' + P.fmtPct(a.exact)) : ('암산 ' + a.mental + '% / 정확 ' + P.fmtPct(a.exact));
    var html = '<div class="result" id="result"><div class="banner ' + (grade.allOk ? 'ok' : 'no') + '">' + (grade.allOk ? '세 단계 모두 맞았어요' : '다시 보면 다음엔 맞아요') + '</div>';
    html += line('드로우', grade.typeOk, a.typeLabel, mineType);
    html += line('아웃츠', grade.outsOk, outsRight, (d.outs === '' ? '—' : d.outs + '장'));
    html += line('확률', grade.probOk, probRight, (d.prob === '' ? '—' : d.prob + '%'));
    html += '<div class="formula"><b>' + esc(a.typeLabel) + '</b>';
    if (a.backdoor) {
      html += '<div>한 장으로 끝나는 아웃츠는 없어요. 남은 두 장을 둘 다 맞춰야 해서 4-2 규칙은 쓰지 않아요.</div>';
      html += '<code>' + esc(P.formulaText(a)) + ' = ' + P.fmtPct(a.exact) + '</code>';
    } else {
      var mult = a.street === 'flop' ? 4 : 2;
      html += '<div>4-2 암산: ' + a.outCount + ' × ' + mult + ' = ' + a.mental + '%</div>';
      html += '<code>' + esc(P.formulaText(a)) + ' = ' + P.fmtPct(a.exact) + '</code>';
    }
    html += '</div>';
    if (a.backdoor && a.type === 'bdf') {
      var suitKo = { s: '스페이드', h: '하트', d: '다이아몬드', c: '클럽' }[a.runner.suit];
      html += '<div class="group"><h3>남은 ' + suitKo + ' ' + a.runner.left.length + '장 — 이 중에서 2장</h3>' + cardRow(a.runner.left, true) + '</div>';
    } else if (a.backdoor && a.type === 'bds') {
      html += '<div class="group"><h3>런너런너로 스트레이트가 되는 조합</h3><ul class="ways">' +
        a.runner.ways.map(function (w) {
          return '<li>' + w.ranks.map(P.rankLabel).join(' + ') + ' · ' + w.n + '가지</li>';
        }).join('') + '</ul><div>합계 ' + a.runner.hits + ' / ' + a.runner.total + '</div></div>';
    } else {
      a.groups.forEach(function (g) {
        html += '<div class="group"><h3>' + esc(g.label) + ' · ' + g.cards.length + '장</h3>' + cardRow(g.cards, true) + '</div>';
      });
      if (a.type === 'monster') html += '<p>겹치는 ' + a.overlapCount + '장은 한 번만 세서 아웃츠는 ' + a.outCount + '장이에요.</p>';
      if (a.type === 'trips' && a.street === 'flop') html += '<p>플랍 트립스는 쿼드 카드 1장 + 페어링 카드 6장 = 7장이에요.</p>';
    }
    return html + '</div>';
  }

  function potExplain(spot, pick) {
    var a = spot.scenario;
    var req = P.fmtPct(spot.required);
    var eq = P.fmtPct(a.exact);
    var better = a.exact + 1e-12 >= spot.required;
    var sentence = better
      ? '드로우 확률이 필요한 에쿼티보다 커서 콜이 맞아요.'
      : '드로우 확률이 필요한 에쿼티보다 작아서 폴드가 맞아요.';
    var mental = a.mental == null ? '4-2 암산은 없어요. 백도어는 두 장을 둘 다 맞춰야 해요.' : ('4-2 암산은 ' + a.mental + '%예요.');
    var ok = pick === spot.potAction;
    return '<div class="result" id="result"><div class="banner ' + (ok ? 'ok' : 'no') + '">' + (ok ? '판단이 맞아요' : '판단이 달라요') + '</div>' +
      '<p>필요한 에쿼티 = ' + spot.bet + ' / (' + spot.pot + ' + ' + spot.bet + ' + ' + spot.bet + ') = <b>' + req + '</b></p>' +
      '<p>' + esc(a.typeLabel) + ' ' + (a.backdoor ? '(한 장 아웃츠 없음)' : (a.outCount + '아웃츠')) + '의 정확 확률은 <b>' + eq + '</b>. ' + mental + '</p>' +
      '<p>' + sentence + '</p></div>';
  }

  function quizView() {
    var locked = !!graded;
    return statsHtml('outs', true) + tableHtml(quiz) + answerForm(quiz, draft, locked, 'q') +
      (hint ? '<p class="hint">' + esc(hint) + '</p>' : '') +
      (graded ? explainHtml(quiz, graded, draft) + '<button type="button" class="next" data-act="next-quiz">다음 문제</button>'
        : '<button type="button" class="go" data-act="grade-quiz">정답 확인</button><button type="button" class="ghost" data-act="next-quiz">다른 문제</button>');
  }

  function potView() {
    var a = pot.scenario;
    var locked = potPick != null;
    return statsHtml('pot', false) + tableHtml(a) +
      '<p>이 드로우는 <b>' + esc(a.typeLabel) + '</b>' + (a.backdoor ? ' · 한 장 아웃츠 없음 (런너런너)' : (' · 아웃츠 ' + a.outCount + '장')) + '.</p>' +
      '<div class="potbox"><div><span>지금 팟</span><strong>' + pot.pot + '</strong><span>바둑돌</span></div><div><span>상대의 벳</span><strong>' + pot.bet + '</strong><span>바둑돌</span></div></div>' +
      '<p>콜하면 바둑돌 ' + pot.bet + '개를 더 넣어요. 필요한 에쿼티 = 벳 / (팟 + 벳 + 벳).</p>' +
      '<div class="acts two">' +
        '<button type="button" class="act call' + actClass(potPick, pot.potAction, 'call', locked) + '" data-act="pot" data-pick="call"' + (locked ? ' disabled' : '') + '>콜</button>' +
        '<button type="button" class="act fold' + actClass(potPick, pot.potAction, 'fold', locked) + '" data-act="pot" data-pick="fold"' + (locked ? ' disabled' : '') + '>폴드</button></div>' +
      (locked ? potExplain(pot, potPick) + '<button type="button" class="next" data-act="next-pot">다음 문제</button>' : '');
  }
  function actClass(pick, correct, value, locked) {
    if (!locked) return pick === value ? ' sel' : '';
    if (value === correct) return ' good';
    if (pick === value) return ' bad';
    return '';
  }

  function chartGrid() {
    var head = '<div class="rh"></div>' + P.RANK_ORDER.map(function (r) { return '<div class="rh">' + (r === 'T' ? '10' : r) + '</div>'; }).join('');
    var body = '';
    for (var i = 0; i < 13; i++) {
      body += '<div class="rh">' + (P.RANK_ORDER[i] === 'T' ? '10' : P.RANK_ORDER[i]) + '</div>';
      for (var j = 0; j < 13; j++) {
        var key = P.cellKey(i, j);
        var action = P.chartAction(key, chartPos);
        var on = focus && focus.row === i && focus.col === j ? ' on' : '';
        body += '<button type="button" class="cell ' + action + on + '" data-act="cell" data-row="' + i + '" data-col="' + j + '" aria-label="' + esc(P.prettyKey(key) + ' ' + actionKo(action)) + '">' + esc(key) + '</button>';
      }
    }
    var key0 = P.cellKey(focus.row, focus.col);
    var act = P.chartAction(key0, chartPos);
    var pos = P.POSITIONS.filter(function (p) { return p.id === chartPos; })[0].ko;
    return '<div class="legend"><span><i class="sw raise"></i>레이즈</span><span><i class="sw call"></i>콜</span><span><i class="sw fold"></i>폴드</span></div>' +
      '<div class="chart-wrap"><div class="chart" role="grid" aria-label="13 곱하기 13 스타팅 핸드 차트">' + head + body + '</div></div>' +
      '<div class="detail"><b>' + esc(P.prettyKey(key0)) + '</b> · ' + esc(pos) + ' · <span class="tag ' + act + '">' + actionKo(act) + '</span><p>' + esc(P.chartReason(key0, chartPos)) + '</p></div>';
  }
  function holeOnly(hole, badge) {
    return '<section class="table"><div class="street"><span class="badge">' + esc(badge) + '</span></div>' +
      '<div class="rowlabel">내 핸드</div>' + cardRow(hole, false) +
      '<div class="rowlabel">보드</div><p class="badge">아직 없어요</p></section>';
  }
  function chartQuiz() {
    var locked = spotPick != null;
    var ok = locked && spotPick === spot.action;
    return statsHtml('chart', false) + holeOnly(spot.hole, '프리플랍 · ' + spot.positionLabel) +
      '<p><b>' + esc(P.prettyKey(spot.key)) + '</b><br>아직 아무도 레이즈하지 않았어요. 어떻게 할까요?</p>' +
      choiceRow('spot', spotPick, spot.action, locked) +
      (locked ? '<div class="result" id="result"><div class="banner ' + (ok ? 'ok' : 'no') + '">' + (ok ? '맞아요' : '달라요') + '</div>' +
        (ok ? '' : '<div class="why">' + esc(spot.reason) + '</div>') + '</div><button type="button" class="next" data-act="next-spot">다음 핸드</button>' : '');
  }
  function choiceRow(act, pick, correct, locked) {
    return '<div class="acts">' + ['fold', 'call', 'raise'].map(function (v) {
      return '<button type="button" class="act ' + v + actClass(pick, correct, v, locked) + '" data-act="' + act + '" data-pick="' + v + '"' + (locked ? ' disabled' : '') + '>' + actionKo(v) + '</button>';
    }).join('') + '</div>';
  }
  function chartViewHtml() {
    var posBtns = P.POSITIONS.map(function (p) {
      return '<button type="button" class="pos' + (chartPos === p.id ? ' on' : '') + '" data-act="pos" data-pos="' + p.id + '">' + esc(p.ko) + '</button>';
    }).join('');
    return '<p class="rule"><b>참고용 초보자 기준.</b> 앞에서 레이즈가 없고 내가 처음 말할 때의 단순한 표예요. 오른쪽 위는 수티드, 왼쪽 아래는 오프수트, 대각선은 페어. 13×13 = 169가지.</p>' +
      '<div class="posrow">' + posBtns + '</div>' +
      '<div class="seg"><button type="button" class="' + (chartView === 'grid' ? 'on' : '') + '" data-act="chart-view" data-view="grid">차트</button>' +
      '<button type="button" class="' + (chartView === 'quiz' ? 'on' : '') + '" data-act="chart-view" data-view="quiz">연습 퀴즈</button></div>' +
      (chartView === 'grid' ? chartGrid() : chartQuiz());
  }

  function handView() {
    var preLocked = handPick != null;
    var preOk = preLocked && handPick === hand.action;
    var html = statsHtml('chart', false) + statsHtml('outs', true);
    html += '<section class="table"><div class="street"><span class="badge">프리플랍 · ' + esc(hand.positionLabel) + '</span></div>' +
      '<div class="rowlabel">내 핸드 · ' + esc(P.prettyKey(hand.key)) + '</div>' + cardRow(hand.scenario.hole, false) + '</section>';
    html += '<p>아직 아무도 레이즈하지 않았어요. 참고용 초보자 기준으로 고르세요.</p>';
    html += choiceRow('hpre', handPick, hand.action, preLocked);
    if (!preLocked) return html;
    html += '<div class="result"><div class="banner ' + (preOk ? 'ok' : 'no') + '">' + (preOk ? '프리플랍 맞아요' : '프리플랍이 달라요') + '</div>' +
      (preOk ? '' : '<div class="why">' + esc(hand.reason) + '</div>') + '</div>';
    if (hand.action === 'fold') {
      html += '<p>이 핸드는 폴드라 플랍을 보지 않아요.</p><button type="button" class="next" data-act="next-hand">다음 핸드</button>';
      return html;
    }
    var a = hand.scenario;
    html += '<h2 class="step">플랍 아웃츠</h2>' + tableHtml(a);
    var locked = !!handGraded;
    html += answerForm(a, handDraft, locked, 'h');
    if (hint && !locked) html += '<p class="hint">' + esc(hint) + '</p>';
    if (locked) html += explainHtml(a, handGraded, handDraft) + '<button type="button" class="next" data-act="next-hand">다음 핸드</button>';
    else html += '<button type="button" class="go" data-act="grade-hand">아웃츠 정답 확인</button>';
    return html;
  }

  function cheatView() {
    var rows = P.cheatSheet();
    var body = rows.map(function (r) {
      return '<tr><td>' + esc(r.ko) + '</td><td>' + esc(r.outsLabel) + '</td><td>' + (r.flopMental == null ? '—' : r.flopMental + '%') + '</td><td>' + P.fmtPct(r.flopExact) + '</td><td>' + (r.turnMental == null ? '—' : r.turnMental + '%') + '</td><td>' + (r.turnExact == null ? '—' : P.fmtPct(r.turnExact)) + '</td></tr>';
    }).join('');
    var bdf = rows.filter(function (r) { return r.id === 'bdf'; })[0];
    var bds = rows.filter(function (r) { return r.id === 'bds'; })[0];
    var notes = rows.filter(function (r) { return r.note; }).map(function (r) { return '<li><b>' + esc(r.ko) + '.</b> ' + esc(r.note) + '</li>'; }).join('');
    return '<div class="rule"><h2>4-2 규칙</h2><p>플랍은 카드가 2장 남아서 아웃츠 × 4, 턴은 1장 남아서 아웃츠 × 2. 그 수가 대략적인 확률(%)이에요. 아웃츠가 12장보다 많으면 실제보다 조금 크게 나와요. 플러쉬 9장은 플랍 36%, 턴 18%.</p></div>' +
      '<div class="rule"><h2>정확 확률</h2><p>보이는 카드를 뺀 뒤에 조합으로 계산해요. 플랍은 1 − C(47−아웃츠, 2) / C(47, 2), 턴은 아웃츠 / 46. 백도어는 한 장 아웃츠가 없어서 4-2를 쓰지 않고, 남은 두 장이 모두 맞는 경우의 수로 계산해요. 백도어 플러쉬 ' + P.fmtPct(bdf.flopExact) + ', 3연속 백도어 스트레이트 ' + P.fmtPct(bds.flopExact) + '.</p></div>' +
      '<div class="scroll"><table><thead><tr><th>드로우</th><th>아웃츠</th><th>플랍 암산</th><th>플랍 정확</th><th>턴 암산</th><th>턴 정확</th></tr></thead><tbody>' + body + '</tbody></table></div>' +
      '<ul class="clean">' + notes + '</ul>' +
      '<button type="button" class="ghost" data-act="reset">연습 기록 지우기</button>';
  }

  function shell(body) {
    var tabs = [['quiz', '아웃츠'], ['pot', '팟 오즈'], ['chart', '스타팅 핸드'], ['hand', '한 판'], ['cheat', '치트시트']].map(function (t) {
      return '<button type="button" class="' + (mode === t[0] ? 'on' : '') + '" data-act="mode" data-mode="' + t[0] + '">' + t[1] + '</button>';
    }).join('');
    return '<header class="top"><a href="/">홈</a><h1>포커 아웃츠 트레이너</h1><button type="button" data-act="mute" aria-label="소리">' + (muted ? '음소거' : '소리') + '</button></header>' +
      '<nav class="tabs">' + tabs + '</nav><p class="disclaimer">바둑돌로 세는 연습이에요. 실제 돈을 걸지 않아요.</p><main class="pad">' + body + '</main>' +
      '<footer class="foot">© 나두게임즈 · <a href="/guide/game.html?id=poker">포커 족보 가이드</a></footer>';
  }

  function view() {
    if (mode === 'quiz') return quizView();
    if (mode === 'pot') return potView();
    if (mode === 'chart') return chartViewHtml();
    if (mode === 'hand') return handView();
    return cheatView();
  }
  var chartLeft = 0;
  function render(scrollTop) {
    var wrap = document.querySelector('.chart-wrap');
    if (wrap) chartLeft = wrap.scrollLeft;
    var y = scrollTop ? 0 : window.scrollY;
    app.innerHTML = shell(view());
    window.scrollTo(0, scrollTop ? 0 : y);
    var wrap2 = document.querySelector('.chart-wrap');
    if (wrap2 && !scrollTop) wrap2.scrollLeft = chartLeft;
  }

  function currentDraft(scope) { return scope === 'h' ? handDraft : draft; }
  function gradeCurrent(scope) {
    var d = currentDraft(scope);
    var a = scope === 'h' ? hand.scenario : quiz;
    if (!d.type) { hint = '드로우 종류를 골라 주세요.'; render(false); return; }
    if (d.outs === '' || !isFinite(parseInt(d.outs, 10))) { hint = '아웃츠 장수를 숫자로 적어 주세요. 백도어는 0.'; render(false); return; }
    if (d.prob === '' || !isFinite(parseFloat(d.prob))) { hint = '확률을 %로 적어 주세요.'; render(false); return; }
    hint = '';
    var g = P.gradeAnswer({ type: d.type, outs: d.outs, prob: d.prob }, a);
    if (scope === 'h') handGraded = g;
    else graded = g;
    record('outs', g.allOk, g.allOk ? null : a.type);
    sfx(g.allOk);
    render(false);
    var box = document.getElementById('result');
    if (box && box.scrollIntoView) box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  app.addEventListener('input', function (e) {
    var field = e.target.getAttribute('data-field');
    if (field === 'outs') draft.outs = e.target.value;
    else if (field === 'prob') draft.prob = e.target.value;
    else if (field === 'houts') handDraft.outs = e.target.value;
    else if (field === 'hprob') handDraft.prob = e.target.value;
  });

  app.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el || el.disabled) return;
    var act = el.getAttribute('data-act');
    if (act === 'mode') { mode = el.getAttribute('data-mode'); hint = ''; render(true); return; }
    if (act === 'mute') {
      muted = !muted;
      try { localStorage.setItem(MUTE_KEY, muted ? '1' : '0'); } catch (err) {}
      render(false);
      return;
    }
    if (act === 'type') {
      var scope = el.getAttribute('data-scope');
      if (scope === 'h' ? handGraded : graded) return;
      currentDraft(scope).type = el.getAttribute('data-type');
      render(false);
      return;
    }
    if (act === 'chip') {
      var scope2 = el.getAttribute('data-scope');
      if (scope2 === 'h' ? handGraded : graded) return;
      currentDraft(scope2).prob = el.getAttribute('data-v');
      render(false);
      return;
    }
    if (act === 'grade-quiz') { gradeCurrent('q'); return; }
    if (act === 'grade-hand') { gradeCurrent('h'); return; }
    if (act === 'next-quiz') { newQuiz(); render(true); return; }
    if (act === 'next-pot') { newPot(); render(true); return; }
    if (act === 'next-spot') { newSpot(); render(true); return; }
    if (act === 'next-hand') { newHand(); render(true); return; }
    if (act === 'pot') {
      if (potPick) return;
      potPick = el.getAttribute('data-pick');
      record('pot', potPick === pot.potAction, null);
      sfx(potPick === pot.potAction);
      render(false);
      var box = document.getElementById('result');
      if (box && box.scrollIntoView) box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }
    if (act === 'spot') {
      if (spotPick) return;
      spotPick = el.getAttribute('data-pick');
      record('chart', spotPick === spot.action, null);
      sfx(spotPick === spot.action);
      render(false);
      return;
    }
    if (act === 'hpre') {
      if (handPick) return;
      handPick = el.getAttribute('data-pick');
      record('chart', handPick === hand.action, null);
      sfx(handPick === hand.action);
      render(false);
      return;
    }
    if (act === 'pos') { chartPos = el.getAttribute('data-pos'); render(false); return; }
    if (act === 'chart-view') { chartView = el.getAttribute('data-view'); render(false); return; }
    if (act === 'cell') { focus = { row: Number(el.getAttribute('data-row')), col: Number(el.getAttribute('data-col')) }; render(false); return; }
    if (act === 'reset') {
      stats = { outs: emptyBucket(), pot: emptyBucket(), chart: emptyBucket() };
      saveStats();
      render(false);
    }
  });

  render(true);
})();
