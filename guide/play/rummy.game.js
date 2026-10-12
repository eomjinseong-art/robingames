window.CKGame = RUMMY({
  id: 'rummy', emoji: '🀄', title: ['럼미', 'Rummy'], seven: false, deal: function (n) { return n === 2 ? 10 : 7; },
  bgm: [65, 69, 72, 69, 70, 74, 77, 0, 72, 70, 69, 65, 67, 70, 72, 0],
  rules: ['2~4명. 2명이면 10장, 3~4명이면 7장씩. 내 차례: ① 더미에서 1장 또는 버린 카드 맨 위 1장을 가져와요. ② 같은 숫자 3~4장(세트) 또는 같은 무늬로 이어지는 3장 이상(런, A는 1로만)을 바닥에 내려놓을 수 있어요. 바닥에 있는 누구의 묶음에든 카드를 1장씩 붙일 수도 있어요. ③ 1장을 버리면 차례 끝. 손패를 가장 먼저 모두 털면 승리! 다른 사람 남은 카드 점수(A=1, 숫자 그대로, J·Q·K=10)를 얻어요. 더미가 바닥나면 남은 점수가 가장 적은 사람이 이겨요.',
    '2–4 players. 10 cards each with 2 players, 7 with 3–4. Your turn: 1) draw from the stock or take the top discard. 2) Lay down sets (3–4 of a rank) or runs (3+ in sequence in one suit, ace low), and lay off single cards onto any meld on the table. 3) Discard one card to end your turn. First to empty their hand wins and scores the other players\' leftover cards (A=1, numbers face value, J/Q/K=10). If the stock runs out, lowest hand wins.']
});
