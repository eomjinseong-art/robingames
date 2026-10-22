/* 오프닝 라인·SAN·FEN 검사. node scripts/test-openings.js */
var assert = require('assert');
var R = require('../guide/play/chess.rules.js');
var O = require('../games/game36/openings.js');

var fail = 0;
function check(cond, msg) {
  if (!cond) { fail++; console.error('FAIL ' + msg); }
}

var startFen = R.fen(R.init());
check(startFen === 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 'start fen ' + startFen);

var e4 = R.replay(['e4']);
check(R.fen(e4) === 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1', 'after e4 ' + R.fen(e4));
check(R.fen(R.fromFen(R.fen(e4))) === R.fen(e4), 'fen roundtrip e4');

var ep = R.replay(['e4', 'c5', 'e5', 'd5']);
check(ep && R.parseSan(ep, 'exd6'), 'en passant exd6');
var promo = R.fromFen('8/P7/8/8/8/8/8/4K2k w - - 0 1');
var pq = R.parseSan(promo, 'a8=Q');
check(pq && pq.p === 5 && R.toSan(promo, pq).indexOf('a8=Q') === 0, 'promotion a8=Q ' + (pq && R.toSan(promo, pq)));

check(O.list.length === 10, '10 openings');
var sides = { w: 0, b: 0 };
var ids = {};
O.list.forEach(function (op) {
  check(!ids[op.id], 'dup id ' + op.id);
  ids[op.id] = 1;
  sides[op.side] = (sides[op.side] || 0) + 1;
  check(op.goals.length === 3, op.id + ' goals');
  check(op.trap.ko && op.trap.en, op.id + ' trap');
  check(/중앙/.test(op.goals.map(function (g) { return g.ko; }).join(' ')), op.id + ' center goal');
  check(/전개|나이트|비숍/.test(op.goals.map(function (g) { return g.ko; }).join(' ')), op.id + ' development goal');
  check(/캐슬링/.test(op.goals.map(function (g) { return g.ko; }).join(' ')), op.id + ' castle goal');
  check(op.spot >= 1 && op.spot <= op.moves.length, op.id + ' spot');
  var s = R.init();
  for (var i = 0; i < op.moves.length; i++) {
    var mv = R.parseSan(s, op.moves[i].san);
    if (!mv) {
      check(false, op.id + ' illegal ' + (i + 1) + ' ' + op.moves[i].san + ' fen ' + R.fen(s) + ' legal ' + R.moves(s).map(function (m) { return R.toSan(s, m); }).join(' '));
      return;
    }
    var canon = R.toSan(s, mv).replace(/[+#]/g, '');
    var got = R.parseSan(s, canon);
    check(got && got.f === mv.f && got.t === mv.t && (got.p || 0) === (mv.p || 0), op.id + ' san roundtrip ' + op.moves[i].san + ' -> ' + canon);
    var ko = O.sanKo(R.toSan(s, mv));
    check(/[가-힣]/.test(ko), op.id + ' korean name ' + ko);
    check(op.moves[i].why.ko && op.moves[i].why.ko.indexOf('\n') < 0, op.id + ' one line why');
    s = R.play(s, mv);
  }
  check(s && s.b && !s.win, op.id + ' line ends in a live game');
  var endFen = R.fen(s);
  check(R.fen(R.fromFen(endFen)) === endFen, op.id + ' end fen roundtrip ' + endFen);
  var href = O.liveHref(op);
  var params = new URL(href, 'https://robingames.vercel.app').searchParams;
  check(params.get('mode') === 'pc' && params.get('side') === op.side, op.id + ' live query');
  check(params.get('name') === op.name.ko, op.id + ' live name');
  var back = R.replay(params.get('moves').split(','));
  check(back && R.fen(back) === endFen, op.id + ' live moves replay');
  var spot = R.replay(O.sans(op).slice(0, op.spot));
  check(spot && spot.b, op.id + ' spot replays');
  console.log(op.id + ' ' + op.moves.length + ' plies  ' + endFen);
});
check(sides.w === 5 && sides.b === 5, '5 white and 5 black ' + JSON.stringify(sides));

var fs = require('fs');
var home = fs.readFileSync(require('path').join(__dirname, '../index.html'), 'utf8');
var page = fs.readFileSync(require('path').join(__dirname, '../games/game36/index.html'), 'utf8');
check(home.indexOf('./games/game36/') >= 0 && home.indexOf('g36c') >= 0 && home.indexOf('g36d') >= 0, 'home lists the trainer');
check(page.indexOf('nadoo_chess_opening_start') >= 0 && page.indexOf('liveHref') >= 0, 'trainer links into the chess game');
check(page.indexOf('암기') < 0 && page.indexOf('memor') < 0, 'no memorization tracking copy');
var names = ['이탈리안', '루이 로페즈', '퀸즈 갬빗', '런던 시스템', '잉글리시', '시실리안', '프렌치', '카로칸', '스칸디나비안', '킹스 인디언'];
names.forEach(function (n) {
  check(O.list.some(function (op) { return op.name.ko === n; }), 'missing ' + n);
});

function rnd(seed) {
  var a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
for (var q = 0; q < 40; q++) {
  var quiz = O.makeQuiz(R, { rnd: rnd(1000 + q), onlyId: q % 2 ? 'caro' : null });
  check(quiz.options.length === 4, 'quiz options ' + q);
  if (quiz.kind === 'name') {
    check(quiz.options.some(function (o) { return o.id === quiz.answer; }), 'name answer missing');
    var u = {};
    quiz.options.forEach(function (o) { check(!u[o.id], 'dup name opt'); u[o.id] = 1; });
  } else {
    check(quiz.options.indexOf(quiz.answer) >= 0, 'move answer missing');
    var st = R.replay(O.sans(O.byId(quiz.opId)).slice(0, quiz.ply));
    var mv = R.parseSan(st, quiz.answer);
    check(mv && R.toSan(st, mv) === quiz.answer, 'quiz san plays ' + quiz.answer);
    check((quiz.ply % 2) === (O.byId(quiz.opId).side === 'w' ? 0 : 1), 'quiz is learner ply');
    if (q % 2) check(quiz.opId === 'caro', 'filtered move quiz');
  }
}

if (fail) { console.error(fail + ' failed'); process.exit(1); }
console.log('ok ' + O.list.length + ' openings');
