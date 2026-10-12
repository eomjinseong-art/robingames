window.CKGame = RUMMY({
  id: 'hula', emoji: '🌺', title: ['훌라', 'Hula'], seven: true, deal: function () { return 7; },
  bgm: [72, 76, 79, 81, 79, 76, 74, 0, 72, 74, 76, 79, 76, 74, 72, 0],
  rules: ['2~4명, 7장씩. 내 차례: ① 더미에서 1장 또는 버린 카드 1장을 가져와요. ② 같은 숫자 3~4장(세트) 또는 같은 무늬 연속 3장 이상(런)을 바닥에 내려놓아요. 숫자 7은 특별해서 1장만 있어도 혼자 내려놓을 수 있어요! 바닥의 아무 묶음에나 카드를 붙일 수도 있어요(7 옆에 같은 무늬 6·8, 또는 다른 7). ③ 1장을 버리면 차례 끝. 가장 먼저 손패를 모두 털면 "훌라!" 승리. 더미가 바닥나면 남은 카드 점수(A=1, J·Q·K=10)가 가장 적은 사람이 이겨요. (단순화: 땡큐·스톱 규칙 없음)',
    '2–4 players, 7 cards each. Your turn: 1) draw from the stock or take the top discard. 2) Lay down sets (3–4 of a rank) or runs (3+ in sequence in one suit). Sevens are special: a single 7 can be laid down on its own! You may also lay off cards onto any meld (6/8 of the same suit next to a 7, or another 7). 3) Discard one card to end your turn. First to empty their hand shouts "Hula!" and wins. If the stock runs out, the lowest hand (A=1, J/Q/K=10) wins. (Simplified: no "thank you" or "stop" calls.)']
});
