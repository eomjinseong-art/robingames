/* 체스 오프닝 트레이너 — 초급 메인 라인 10개.
 * 수는 표준 이론의 SAN. 한국어 이름·설명은 화면에서 같이 보여 준다. */
(function (root) {
  'use strict';
  function M(san, ko, en) { return { san: san, why: { ko: ko, en: en } }; }
  function T(ko, en) { return { ko: ko, en: en }; }

  var OPENINGS = [
    {
      id: 'italian', side: 'w', spot: 6,
      name: T('이탈리안', 'Italian Game'),
      diff: T('쉬움', 'Easy'),
      blurb: T('비숍으로 f7을 바라보는 가장 익숙한 시작', 'The familiar bishop aim at f7'),
      goals: [
        T('e4로 중앙 칸을 먼저 차지해요.', 'Take the center first with e4.'),
        T('나이트와 비숍을 활성 칸으로 빨리 꺼내요.', 'Develop the knight and bishop to active squares.'),
        T('킹사이드로 캐슬링해 킹을 피신시켜요.', 'Castle kingside and tuck the king away.')
      ],
      trap: T('상대가 나이트로 중앙 폰을 되잡은 뒤 내 나이트가 f7에 들어가면 킹이 끌려 나올 수 있어요. 그 그림이 보이면 나이트로 비숍을 쫓아 압박을 먼저 푸세요.', 'If a knight recaptures in the center and your knight can jump to f7, the king can be pulled out. Chase the bishop away before that sacrifice appears.'),
      moves: [
        M('e4', '킹 앞 폰으로 중앙을 잡고 퀸과 비숍의 길을 열어요.', 'The king pawn takes the center and opens lines for the queen and bishop.'),
        M('e5', '같은 방식으로 중앙을 지키며 맞받아요.', 'Black meets the center in the same way.'),
        M('Nf3', '나이트를 꺼내 상대 폰을 압박하고 캐슬링을 준비해요.', 'The knight develops, attacks the pawn, and prepares castling.'),
        M('Nc6', '나이트로 중앙 폰을 지켜요.', 'The knight defends the center pawn.'),
        M('Bc4', '비숍이 약한 칸 f7을 바라보며 활발히 나왔어요.', 'The bishop comes out and eyes the weak f7 square.'),
        M('Bc5', '비숍을 대칭으로 꺼내 f2를 바라봐요.', 'The bishop develops in mirror fashion and eyes f2.'),
        M('c3', '곧 중앙을 넓히려고 폰으로 받침을 만들어요.', 'The pawn builds a support for a later central push.'),
        M('Nf6', '나이트가 상대 중앙 폰을 공격하며 전개해요.', 'The knight develops and attacks the center pawn.'),
        M('d3', '중앙을 단단히 지키며 다른 비숍의 길을 열어요.', 'A solid center pawn also opens the other bishop.'),
        M('d6', '중앙 폰을 받치고 비숍 길을 열어요.', 'The pawn supports the center and opens a bishop.'),
        M('O-O', '킹을 안전한 쪽으로 옮기고 룩을 연결해요.', 'The king steps aside and the rooks are connected.'),
        M('O-O', '킹을 피신시켜 오프닝의 목표를 마쳐요.', 'Black castles and finishes the opening goals.')
      ]
    },
    {
      id: 'lopez', side: 'w', spot: 5,
      name: T('루이 로페즈', 'Spanish Game'),
      diff: T('보통', 'Medium'),
      blurb: T('비숍으로 나이트를 묶어 중앙을 흔들어요', 'The bishop ties down the knight that holds the center'),
      goals: [
        T('e4로 중앙을 잡고 그 폰을 끝까지 지켜요.', 'Take the center with e4 and keep that pawn safe.'),
        T('비숍과 나이트를 먼저 꺼내 상대 나이트를 묶어요.', 'Develop the bishop and knight so the enemy knight stays tied down.'),
        T('킹사이드 캐슬링 뒤 룩을 중앙 파일에 둬요.', 'Castle kingside, then bring a rook to the center file.')
      ],
      trap: T('비숍이 가장자리에 있을 때 중앙을 함부로 열고 퇴로를 막으면, 상대의 b·c 폰이 비숍을 가둘 수 있어요. 비숍이 빠질 칸을 남겨 두세요.', 'If the bishop is on the edge and its retreat is sealed when the center opens, the b- and c-pawns can shut it in. Leave the bishop a way back.'),
      moves: [
        M('e4', '킹 폰으로 중앙 칸을 차지해요.', 'The king pawn occupies the center.'),
        M('e5', '중앙을 바로 맞받아요.', 'Black answers in the center at once.'),
        M('Nf3', '나이트로 중앙 폰을 노리며 전개를 시작해요.', 'The knight attacks the center pawn and starts development.'),
        M('Nc6', '나이트가 그 폰을 지켜요.', 'The knight defends that pawn.'),
        M('Bb5', '비숍이 나이트를 묶어 중앙 폰의 방어를 흔들어요.', 'The bishop pins the knight and loosens the center pawn.'),
        M('a6', '폰으로 비숍에게 물러날지 바꿀지 물어봐요.', 'The pawn asks the bishop to trade or retreat.'),
        M('Ba4', '비숍을 지키며 대각선을 유지해요.', 'The bishop keeps the diagonal instead of trading.'),
        M('Nf6', '나이트를 꺼내 상대 폰을 공격해요.', 'The knight develops and attacks the pawn.'),
        M('O-O', '킹을 피신시키고 룩이 중앙으로 올 준비를 해요.', 'The king is safe and a rook is ready for the center.'),
        M('Be7', '비숍을 빼서 킹사이드 캐슬링을 준비해요.', 'The bishop steps out so kingside castling is ready.'),
        M('Re1', '룩으로 중앙 폰을 지키며 파일이 열릴 때를 대비해요.', 'The rook defends the center pawn and waits for an open file.'),
        M('b5', '폰으로 비숍을 한 칸 더 밀어내요.', 'The pawn pushes the bishop one square farther.'),
        M('Bb3', '밀려도 f7을 계속 바라보는 자리로 가요.', 'The bishop retreats but still eyes f7.'),
        M('d6', '중앙 폰을 단단히 받쳐요.', 'The pawn firmly supports the center.'),
        M('c3', '다음 중앙 전진을 위한 받침이에요.', 'The pawn prepares a later push in the center.'),
        M('O-O', '킹을 안전하게 옮기고 룩을 연결해요.', 'The king castles and the rooks are connected.')
      ]
    },
    {
      id: 'queens', side: 'w', spot: 4,
      name: T('퀸즈 갬빗', 'Queen\'s Gambit'),
      diff: T('보통', 'Medium'),
      blurb: T('c폰으로 d5를 흔들어 중앙을 열어요', 'The c-pawn challenges d5 and opens the center'),
      goals: [
        T('d4와 c4로 중앙 폰 구조를 먼저 묻어요.', 'Ask the central pawn question with d4 and c4.'),
        T('나이트 둘과 비숍을 꺼내 중앙을 압박해요.', 'Develop both knights and the bishop to press the center.'),
        T('킹사이드로 캐슬링한 뒤 룩을 c파일에 둘 준비를 해요.', 'Castle kingside, then be ready to put a rook on the c-file.')
      ],
      trap: T('핀이 걸린 채 중앙 폰을 나이트로 먹으면, 상대 비숍 체크와 함께 퀸을 되돌려 줘야 할 수 있어요. 먹기 전에 핀을 확인하세요.', 'Capturing the center pawn with a knight while a pin is on can cost the queen to a bishop check. Look for the pin before you take.'),
      moves: [
        M('d4', '퀸 폰으로 중앙을 잡아요.', 'The queen pawn takes the center.'),
        M('d5', '같은 폰으로 중앙을 맞받아요.', 'Black meets it with the same pawn.'),
        M('c4', '옆 폰으로 중앙 폰을 흔들어 길을 열어 보려는 수예요.', 'The side pawn challenges the center and offers to open a file.'),
        M('e6', '중앙 폰을 단단히 지키며 비숍 길을 열어요.', 'The pawn holds the center and opens a bishop.'),
        M('Nc3', '나이트가 중앙을 더 압박하고 전개해요.', 'The knight adds pressure to the center.'),
        M('Nf6', '나이트를 꺼내 중앙을 지켜요.', 'The knight develops and guards the center.'),
        M('Bg5', '비숍이 나이트를 묶어 중앙 싸움을 도와요.', 'The bishop pins the knight and helps the central fight.'),
        M('Be7', '핀을 풀고 캐슬링을 준비해요.', 'The bishop breaks the pin and prepares castling.'),
        M('e3', '폰 구조를 단단히 하고 비숍의 길을 열어요.', 'The pawn solidifies the center and frees the light bishop.'),
        M('O-O', '중앙이 열리기 전에 킹을 피신시켜요.', 'The king leaves the center before files open.'),
        M('Nf3', '나이트를 꺼내 킹사이드 캐슬링을 준비해요.', 'The knight develops and prepares kingside castling.'),
        M('Nbd7', '남은 나이트를 자연스럽게 꺼내요.', 'The other knight develops to its natural square.'),
        M('Bd3', '비숍이 킹 쪽을 바라보며 활발히 나왔어요.', 'The bishop aims toward the enemy king.'),
        M('c6', '중앙 폰을 한 번 더 받쳐요.', 'Another pawn supports the center.'),
        M('O-O', '킹을 안전한 쪽으로 옮기고 룩을 연결해요.', 'The king castles and the rooks connect.')
      ]
    },
    {
      id: 'london', side: 'w', spot: 5,
      name: T('런던 시스템', 'London System'),
      diff: T('쉬움', 'Easy'),
      blurb: T('비숍을 먼저 빼 두고 단단한 폰으로 이어가요', 'The bishop comes out early, then a solid pawn wall'),
      goals: [
        T('d4로 중앙을 잡고 폰은 단단히 유지해요.', 'Hold the center with d4 and keep the pawns solid.'),
        T('검은 칸 비숍을 폰 밖으로 먼저 전개해요.', 'Develop the dark-squared bishop outside the pawn chain.'),
        T('나이트를 모두 꺼낸 뒤 킹사이드로 캐슬링해요.', 'Finish the knights, then castle kingside.')
      ],
      trap: T('비숍을 빼자마자 상대 퀸이 b2를 노릴 수 있어요. 그 폰을 비운 채 다른 기물만 꺼내지 말고, 지키거나 압박을 먼저 풀어요.', 'Right after the bishop leaves, the enemy queen may eye b2. Do not wander off and leave that pawn hanging.'),
      moves: [
        M('d4', '퀸 폰으로 중앙 칸을 잡아요.', 'The queen pawn takes the central squares.'),
        M('d5', '중앙을 바로 맞받아요.', 'Black answers in the center.'),
        M('Nf3', '나이트를 먼저 꺼내 유연하게 전개해요.', 'The knight develops first and keeps the setup flexible.'),
        M('Nf6', '나이트로 중앙을 견제해요.', 'The knight watches the center.'),
        M('Bf4', '비숍을 폰 밖으로 먼저 빼 두는 것이 이 오프닝의 핵심이에요.', 'Putting the bishop outside the pawns is the point of this opening.'),
        M('e6', '중앙을 단단히 하고 비숍 길을 열어요.', 'The pawn solidifies the center and frees a bishop.'),
        M('e3', '중앙 구조를 고정하며 비숍이 앞으로 갈 길을 열어요.', 'The pawn sets the structure and opens the light bishop.'),
        M('Bd6', '비숍을 꺼내 상대 비숍과 마주해요.', 'The bishop develops and faces the enemy bishop.'),
        M('Bg3', '교환을 피하고 비숍의 대각선을 유지해요.', 'The bishop keeps its diagonal instead of trading.'),
        M('c5', '옆에서 중앙 폰을 흔들며 반격을 시작해요.', 'The side pawn starts counterplay against the center.'),
        M('c3', '중앙 폰을 받치고 퀸이 나올 길을 남겨요.', 'The pawn supports the center and leaves a path for the queen.'),
        M('Nc6', '나이트로 중앙을 더 압박해요.', 'The knight adds pressure to the center.'),
        M('Nbd2', '나이트를 꺼내면서 중앙 폰의 전진 칸을 남겨 둬요.', 'The knight develops without blocking a later pawn push.'),
        M('O-O', '킹을 피신시켜 전개를 거의 마쳐요.', 'The king castles and development is nearly done.'),
        M('Bd3', '비숍이 상대 킹 쪽을 바라봐요.', 'The bishop aims at the enemy king\'s side.'),
        M('Re8', '룩을 중앙 파일 쪽으로 옮겨 다음 수를 준비해요.', 'The rook shifts toward the center file.'),
        M('O-O', '킹을 안전하게 옮기고 룩을 연결해요.', 'The king castles and the rooks are connected.')
      ]
    },
    {
      id: 'english', side: 'w', spot: 4,
      name: T('잉글리시', 'English Opening'),
      diff: T('보통', 'Medium'),
      blurb: T('c4로 중앙을 옆에서 견제해요', 'c4 fights for the center from the side'),
      goals: [
        T('c4로 중앙 d5 칸을 옆에서 견제해요.', 'Restrain the d5 square from the side with c4.'),
        T('나이트를 꺼내고 비숍은 긴 대각선에 둬요.', 'Develop the knights and put the bishop on the long diagonal.'),
        T('킹사이드로 캐슬링한 뒤 중앙 폰을 단단히 받쳐요.', 'Castle kingside, then support the center pawn.')
      ],
      trap: T('상대 나이트가 중앙에서 빠지면 긴 대각선 비숍과 내 나이트가 그 칸을 함께 노려요. 중앙 말을 빼기 전에 폰으로 받아 두세요.', 'When a knight leaves the center, the long-diagonal bishop and a knight can eye that square together. Support the center before the knight steps away.'),
      moves: [
        M('c4', '사이드 폰으로 중앙 칸을 견제하며 시작해요.', 'The side pawn starts by restraining the center.'),
        M('e5', '킹 폰으로 중앙을 차지해 맞서는 수예요.', 'The king pawn claims the center in reply.'),
        M('Nc3', '나이트가 중앙 칸을 함께 봐요.', 'The knight shares control of the central squares.'),
        M('Nf6', '나이트를 꺼내 중앙을 견제해요.', 'The knight develops and watches the center.'),
        M('g3', '비숍을 긴 대각선에 두기 위한 칸을 만들어요.', 'The pawn makes a home for the bishop on the long diagonal.'),
        M('d5', '중앙 폰을 밀어 긴장을 만들어요.', 'The pawn pushes and creates central tension.'),
        M('cxd5', '중앙을 열어 빗선 비숍이 일할 길을 만들어요.', 'Opening the center gives the bishop a job.'),
        M('Nxd5', '나이트로 폰을 되잡아 중앙에 서요.', 'The knight recaptures and stands in the center.'),
        M('Bg2', '비숍이 긴 대각선에서 중앙을 압박해요.', 'The bishop presses the center from the long diagonal.'),
        M('Nb6', '나이트를 안전한 칸으로 빼 비숍의 시선을 피해요.', 'The knight steps aside, off the bishop\'s line.'),
        M('Nf3', '나이트를 꺼내 중앙 폰을 노리고 캐슬링을 준비해요.', 'The knight develops, eyes the pawn, and prepares castling.'),
        M('Nc6', '남은 나이트로 중앙을 지켜요.', 'The other knight helps hold the center.'),
        M('O-O', '킹을 피신시키고 룩을 연결해요.', 'The king castles and the rooks connect.'),
        M('Be7', '비숍을 빼서 캐슬링 길을 열어요.', 'The bishop clears the way to castle.'),
        M('d3', '중앙을 단단히 지키며 다른 비숍의 길을 열어요.', 'The pawn secures the center and frees the other bishop.'),
        M('O-O', '킹을 안전하게 옮기고 전개를 마쳐요.', 'The king castles and development is complete.')
      ]
    },
    {
      id: 'sicilian', side: 'b', spot: 6,
      name: T('시실리안', 'Sicilian Defense'),
      diff: T('보통', 'Medium'),
      blurb: T('c5로 비대칭 카운터를 시작해요', 'c5 starts an asymmetrical counter'),
      goals: [
        T('c5로 중앙 d4를 옆에서 견제해요.', 'Fight for d4 from the side with c5.'),
        T('나이트와 비숍을 꺼내 c파일을 내 룩 길로 만들어요.', 'Develop the knights and bishop, and make the c-file yours.'),
        T('킹사이드로 캐슬링해 킹을 먼저 피신시켜요.', 'Castle kingside before the center blows open.')
      ],
      trap: T('전개를 끝내기 전에 폰으로 중앙 나이트만 쫓으면, 그 나이트가 옆칸으로 가 약한 폰을 집요하게 노려요. 나이트와 비숍을 먼저 꺼내세요.', 'Chasing the central knight with a pawn before you develop lets that knight sit next to a weak pawn. Bring out the knight and bishop first.'),
      moves: [
        M('e4', '백이 킹 폰으로 중앙을 열어요.', 'White opens the center with the king pawn.'),
        M('c5', '사이드에서 중앙을 견제하며 비대칭 구조를 만들어요.', 'The side pawn fights the center and makes an asymmetrical structure.'),
        M('Nf3', '백 나이트가 중앙 전진을 준비해요.', 'The knight prepares a central advance.'),
        M('Nc6', '나이트로 중앙 칸을 압박해요.', 'The knight presses the central squares.'),
        M('d4', '백이 중앙 폰을 내주며 길을 열어요.', 'White offers a center pawn to open lines.'),
        M('cxd4', '폰으로 잡아 c파일을 내 룩이 쓸 길로 만들어요.', 'Taking opens the c-file for a rook.'),
        M('Nxd4', '백 나이트가 중앙에 자리해요.', 'The knight recaptures and stands in the center.'),
        M('Nf6', '나이트가 상대 중앙 폰을 공격하며 전개해요.', 'The knight develops and attacks the center pawn.'),
        M('Nc3', '백이 그 폰을 지키며 나이트를 꺼내요.', 'White defends the pawn and develops the knight.'),
        M('d6', '중앙을 받치고 킹사이드를 단단히 해요.', 'The pawn supports the center and keeps the kingside solid.'),
        M('Be2', '백 비숍이 나오며 캐슬링을 준비해요.', 'The bishop develops and prepares castling.'),
        M('e6', '중앙 전진을 노리며 비숍이 나올 칸을 만들어요.', 'The pawn prepares a central break and frees a bishop.'),
        M('O-O', '백이 킹을 피신시켜요.', 'White castles the king to safety.'),
        M('Be7', '비숍을 꺼내 캐슬링 길을 열어요.', 'The bishop clears the way to castle.'),
        M('Be3', '백 비숍이 중앙을 도우며 전개를 마쳐요.', 'The bishop helps the center and finishes development.'),
        M('O-O', '킹을 안전하게 옮기고 룩을 연결해요.', 'The king castles and the rooks are connected.')
      ]
    },
    {
      id: 'french', side: 'b', spot: 4,
      name: T('프렌치', 'French Defense'),
      diff: T('보통', 'Medium'),
      blurb: T('e6과 d5로 중앙을 단단히 막아요', 'e6 and d5 build a solid central wall'),
      goals: [
        T('d5로 중앙에 바로 맞서요.', 'Meet the center immediately with d5.'),
        T('나이트와 비숍을 꺼내 핀을 풀어요.', 'Develop the knight and bishop and break the pin.'),
        T('캐슬링으로 킹을 피신시킨 뒤 c5 반격을 시작해요.', 'Castle the king away, then start the c5 counter.')
      ],
      trap: T('중앙이 고정된 뒤 나이트로 상대 중앙 폰을 함부로 잡으면, 비숍 체크와 함께 퀸이 위험해져요. 잡기 전에 킹과 퀸의 자리를 보세요.', 'When the center is fixed, grabbing the center pawn with a knight can leave the queen in trouble after a bishop check. Look at the king and queen first.'),
      moves: [
        M('e4', '백이 킹 폰으로 시작해요.', 'White starts with the king pawn.'),
        M('e6', 'd5를 받칠 준비를 하며 단단히 시작해요.', 'The pawn prepares to support d5.'),
        M('d4', '백이 중앙을 넓혀요.', 'White widens the center.'),
        M('d5', '바로 중앙에 맞서요.', 'Black challenges the center at once.'),
        M('Nc3', '백 나이트가 중앙 폰을 지켜요.', 'The knight defends the center pawn.'),
        M('Nf6', '나이트가 상대 폰을 공격하며 전개해요.', 'The knight develops and attacks the pawn.'),
        M('Bg5', '백 비숍이 나이트를 묶어요.', 'The bishop pins the knight.'),
        M('Be7', '핀을 풀고 캐슬링을 준비해요.', 'The bishop breaks the pin and prepares castling.'),
        M('e5', '백이 폰을 밀어 나이트를 쫓아요.', 'The pawn advances and chases the knight.'),
        M('Nfd7', '밀린 나이트가 다시 싸울 자리로 물러나요.', 'The knight retreats to a square where it can fight again.'),
        M('Bxe7', '백이 비숍을 교환해요.', 'White trades bishops.'),
        M('Qxe7', '퀸으로 되잡아 전개와 캐슬링 길을 유지해요.', 'The queen recaptures and still leaves castling open.'),
        M('f4', '백이 킹사이드 공간을 더 잡아요.', 'White gains more space on the kingside.'),
        M('O-O', '중앙이 열리기 전에 킹을 피신시켜요.', 'The king leaves before the center opens.'),
        M('Nf3', '백 나이트를 꺼내 전개를 이어요.', 'White develops the knight.'),
        M('c5', '중앙 받침을 흔들어 옆에서 반격을 시작해요.', 'The side pawn shakes the center and starts counterplay.')
      ]
    },
    {
      id: 'caro', side: 'b', spot: 8,
      name: T('카로칸', 'c6 Defense'),
      diff: T('쉬움', 'Easy'),
      blurb: T('c6으로 d5를 받치고 비숍을 밖으로 꺼내요', 'c6 supports d5, then the bishop steps outside'),
      goals: [
        T('c6으로 받친 d5로 중앙에 맞서요.', 'Challenge the center with d5, supported by c6.'),
        T('밝은 칸 비숍을 폰 밖으로 전개해요.', 'Develop the light-squared bishop outside the pawn chain.'),
        T('나이트와 비숍을 끝내고 킹사이드로 캐슬링해요.', 'Finish the knight and bishop, then castle kingside.')
      ],
      trap: T('중앙 폰을 정리하기 전에 나이트를 꺼내면 상대 폰에 밀려 템포를 잃어요. 또 옆 폰의 추격을 무시하면 비숍이 가장자리에 갇혀요.', 'Developing the knight before the center pawn is resolved can lose time to a pawn push. Ignoring the side-pawn chase can also trap the bishop on the edge.'),
      moves: [
        M('e4', '백이 킹 폰으로 중앙을 열어요.', 'White opens the center with the king pawn.'),
        M('c6', '다음 중앙 폰을 옆에서 받칠 준비를 해요.', 'The pawn gets ready to support the center.'),
        M('d4', '백이 중앙을 두 칸 차지해요.', 'White occupies the center with both pawns.'),
        M('d5', '바로 중앙에 맞서는 수예요.', 'Black challenges the center at once.'),
        M('Nc3', '백 나이트가 중앙 폰을 공격해요.', 'The knight attacks the center pawn.'),
        M('dxe4', '긴장을 풀고 비숍이 편하게 나오게 해요.', 'Releasing the tension lets the bishop develop freely.'),
        M('Nxe4', '백 나이트가 중앙에 나와요.', 'The knight recaptures and stands in the center.'),
        M('Bf5', '비숍을 폰 밖으로 활발히 꺼내요.', 'The bishop develops outside the pawn chain.'),
        M('Ng3', '백 나이트가 그 비숍을 쫓아요.', 'The knight chases that bishop.'),
        M('Bg6', '비숍을 지키며 대각선을 유지해요.', 'The bishop keeps the diagonal.'),
        M('h4', '백이 옆 폰으로 비숍을 더 밀어 보려 해요.', 'A side pawn tries to push the bishop farther.'),
        M('h6', '숨 쉴 칸을 만들어 비숍이 갇히지 않게 해요.', 'The pawn gives the bishop an air square so it is not trapped.'),
        M('Nf3', '백이 나이트를 꺼내 전개해요.', 'White develops the knight.'),
        M('Nd7', '나이트를 자연스럽게 꺼내요.', 'The knight develops to its natural square.'),
        M('h5', '백 폰이 비숍을 한 칸 더 쫓아요.', 'The pawn chases the bishop one more square.'),
        M('Bh7', '비숍을 안전한 대각선으로 빼요.', 'The bishop slips to a safe diagonal.'),
        M('Bd3', '백 비숍이 내 비숍과 마주해요.', 'White\'s bishop faces the bishop.'),
        M('Bxd3', '상대의 좋은 비숍을 제거해요.', 'Trading removes White\'s active bishop.'),
        M('Qxd3', '백 퀸이 되잡으며 중앙에 나와요.', 'The queen recaptures and enters the game.'),
        M('e6', '중앙을 단단히 하고 킹사이드 길을 열어요.', 'The pawn secures the center and opens the kingside.'),
        M('Bd2', '백이 비숍을 꺼내 퀸사이드 캐슬링을 준비해요.', 'The bishop develops and prepares queenside castling.'),
        M('Ngf6', '나이트를 꺼내 캐슬링을 준비해요.', 'The knight develops and prepares castling.'),
        M('O-O-O', '백이 킹을 퀸사이드로 피신시켜요.', 'White castles the king queenside.'),
        M('Be7', '비숍을 빼서 킹이 캐슬링할 길을 열어요.', 'The bishop clears the king\'s path to castle.'),
        M('Kb1', '백 킹이 한 칸 비켜 중앙 파일을 정리해요.', 'The king steps aside and clears the center file.'),
        M('O-O', '킹을 안전하게 옮기고 룩을 연결해요.', 'The king castles and the rooks are connected.')
      ]
    },
    {
      id: 'scandi', side: 'b', spot: 4,
      name: T('스칸디나비안', 'Scandinavian Defense'),
      diff: T('쉬움', 'Easy'),
      blurb: T('d5로 바로 중앙 폰을 제안해요', 'd5 offers a central pawn trade at once'),
      goals: [
        T('d5로 첫 수부터 중앙을 열어요.', 'Open the center on the first move with d5.'),
        T('퀸을 안전한 옆으로 뺀 뒤 마이너 피스를 전개해요.', 'Move the queen aside, then develop the minor pieces.'),
        T('킹사이드 캐슬링으로 킹을 피신시켜요.', 'Castle kingside and bring the king to safety.')
      ],
      trap: T('되잡은 퀸을 중앙에 두면 상대 나이트가 한 수로 퀸을 쫓으며 전개까지 이득을 봐요. 퀸은 옆으로 빼 두세요.', 'Leaving the recaptured queen in the center lets a knight gain time and development in one move. Step the queen aside.'),
      moves: [
        M('e4', '백이 킹 폰으로 시작해요.', 'White starts with the king pawn.'),
        M('d5', '첫 수부터 중앙 폰을 제안해요.', 'The pawn offers a central trade on move one.'),
        M('exd5', '백이 그 폰을 받아요.', 'White accepts the pawn.'),
        M('Qxd5', '퀸으로 폰을 되잡아 균형을 맞춰요.', 'The queen recaptures and restores the balance.'),
        M('Nc3', '백 나이트가 퀸을 쫓으며 전개해요.', 'The knight develops and chases the queen.'),
        M('Qa5', '나이트의 공격에서 퀸을 옆으로 빼요.', 'The queen steps aside, out of the knight\'s attack.'),
        M('d4', '백이 중앙 폰으로 공간을 잡아요.', 'White takes space with the center pawn.'),
        M('Nf6', '나이트를 꺼내 전개를 시작해요.', 'The knight starts development.'),
        M('Nf3', '백이 나이트를 더 꺼내요.', 'White develops the other knight.'),
        M('c6', '퀸의 퇴로를 만들고 중앙을 받쳐요.', 'The pawn gives the queen a retreat and supports the center.'),
        M('Bc4', '백 비숍이 약한 칸을 바라보며 나와요.', 'The bishop develops and eyes a weak square.'),
        M('Bf5', '비숍을 활발한 칸으로 꺼내요.', 'The bishop develops to an active square.'),
        M('Bd2', '백 비숍이 퀸을 견제하며 전개해요.', 'The bishop develops and eyes the queen.'),
        M('e6', '중앙을 단단히 하고 비숍 길을 열어요.', 'The pawn secures the center and frees a bishop.'),
        M('Qe2', '백 퀸이 캐슬링 길을 정리해요.', 'The queen clears the way to castle.'),
        M('Bb4', '비숍이 상대 나이트를 묶어 압박을 줄여요.', 'The bishop pins the knight and eases the pressure.'),
        M('O-O-O', '백이 킹을 퀸사이드로 피신시켜요.', 'White castles the king queenside.'),
        M('Nbd7', '남은 나이트를 꺼내 전개를 끝내요.', 'The other knight finishes development.'),
        M('Kb1', '백 킹이 한 칸 비켜 서요.', 'The king steps one square aside.'),
        M('O-O', '킹을 피신시키고 룩을 연결해요.', 'The king castles and the rooks are connected.')
      ]
    },
    {
      id: 'kid', side: 'b', spot: 6,
      name: T('킹스 인디언', 'King\'s Indian Defense'),
      diff: T('보통', 'Medium'),
      blurb: T('비숍을 g7에 두고 나중에 중앙을 쳐요', 'The bishop sits on g7, then the center is challenged'),
      goals: [
        T('상대가 중앙을 차지하게 둔 뒤 e5로 맞서요.', 'Let the opponent take space, then challenge it with e5.'),
        T('나이트와 g7 비숍을 먼저 전개해요.', 'Develop the knight and the bishop on g7 first.'),
        T('중앙이 열리기 전에 킹사이드로 캐슬링해요.', 'Castle kingside before the center opens.')
      ],
      trap: T('퀸이 마주 본 상태에서 나이트로 중앙 폰을 성급히 잡으면 퀸을 잃을 수 있어요. 룩으로 퀸을 바꾼 다음에 되잡으세요.', 'Grabbing the center pawn with a knight while the queens still face each other can lose the queen. Trade queens with the rook first, then recapture.'),
      moves: [
        M('d4', '백이 퀸 폰으로 중앙을 잡아요.', 'White takes the center with the queen pawn.'),
        M('Nf6', '나이트로 중앙을 견제하며 시작해요.', 'The knight starts by watching the center.'),
        M('c4', '백이 옆 폰으로 중앙을 더 넓혀요.', 'White gains more space from the side.'),
        M('g6', '비숍을 긴 대각선에 두려고 칸을 만들어요.', 'The pawn prepares the bishop\'s long diagonal.'),
        M('Nc3', '백 나이트가 중앙을 지켜요.', 'The knight supports the center.'),
        M('Bg7', '빗선 비숍이 중앙을 멀리서 압박해요.', 'The dark bishop presses the center from a distance.'),
        M('e4', '백이 중앙 폰을 둘 다 앞으로 둬요.', 'White puts both center pawns forward.'),
        M('d6', 'e5를 받칠 튼튼한 받침이에요.', 'The pawn is a solid support for e5.'),
        M('Nf3', '백 나이트를 꺼내 캐슬링을 준비해요.', 'White develops the knight and prepares castling.'),
        M('O-O', '중앙이 열리기 전에 킹을 피신시켜요.', 'The king castles before the center opens.'),
        M('Be2', '백 비숍이 나오며 캐슬링을 준비해요.', 'The bishop develops and prepares castling.'),
        M('e5', '중앙에 발을 들여 공간을 다퉈요.', 'The pawn steps into the center and fights for space.'),
        M('O-O', '백도 킹을 피신시켜요.', 'White castles as well.'),
        M('Nc6', '나이트가 중앙 폰을 더 압박해요.', 'The knight adds pressure to the center pawn.'),
        M('d5', '백이 폰으로 나이트를 쫓으며 중앙을 닫아요.', 'The pawn chases the knight and closes the center.'),
        M('Ne7', '닫힌 중앙에서 나이트를 빼고, 나중에 킹사이드 반격을 준비해요.', 'The knight steps aside and gets ready for a later kingside break.')
      ]
    }
  ];

  function sanKo(san) {
    var raw = String(san || '');
    var mark = raw.indexOf('#') >= 0 ? ' 체크메이트' : raw.indexOf('+') >= 0 ? ' 체크' : '';
    var t = raw.replace(/[+#?!]/g, '');
    if (t === 'O-O') return '킹사이드 캐슬링' + mark;
    if (t === 'O-O-O') return '퀸사이드 캐슬링' + mark;
    var promo = '', pm = /=([NBRQ])/.exec(t);
    var pk = { N: '나이트', B: '비숍', R: '룩', Q: '퀸' };
    if (pm) { promo = ', ' + pk[pm[1]] + '으로 승격'; t = t.replace(/=[NBRQ]/, ''); }
    var cap = t.indexOf('x') >= 0;
    t = t.replace('x', '');
    var piece = '폰';
    if ('NBRQK'.indexOf(t.charAt(0)) >= 0) {
      piece = { N: '나이트', B: '비숍', R: '룩', Q: '퀸', K: '킹' }[t.charAt(0)];
      t = t.slice(1);
    }
    var dest = t.slice(-2);
    return piece + (cap ? '가 ' + dest + '를 잡기' : ' ' + dest) + promo + mark;
  }

  function sanEn(san) {
    var raw = String(san || '');
    var mark = raw.indexOf('#') >= 0 ? ', checkmate' : raw.indexOf('+') >= 0 ? ', check' : '';
    var t = raw.replace(/[+#?!]/g, '');
    if (t === 'O-O') return 'Kingside castling' + mark;
    if (t === 'O-O-O') return 'Queenside castling' + mark;
    var promo = '', pm = /=([NBRQ])/.exec(t);
    var pk = { N: 'knight', B: 'bishop', R: 'rook', Q: 'queen' };
    if (pm) { promo = ', promotes to a ' + pk[pm[1]]; t = t.replace(/=[NBRQ]/, ''); }
    var cap = t.indexOf('x') >= 0;
    t = t.replace('x', '');
    var piece = 'Pawn';
    if ('NBRQK'.indexOf(t.charAt(0)) >= 0) {
      piece = { N: 'Knight', B: 'Bishop', R: 'Rook', Q: 'Queen', K: 'King' }[t.charAt(0)];
      t = t.slice(1);
    }
    var dest = t.slice(-2);
    return piece + (cap ? ' takes ' : ' ') + dest + promo + mark;
  }

  function byId(id) {
    for (var i = 0; i < OPENINGS.length; i++) if (OPENINGS[i].id === id) return OPENINGS[i];
    return null;
  }
  function sans(op) { return op.moves.map(function (m) { return m.san; }); }
  function liveHref(op) {
    return '/guide/play/chess.html?mode=pc&side=' + op.side + '&name=' + encodeURIComponent(op.name.ko) + '&moves=' + encodeURIComponent(sans(op).join(','));
  }
  function shuffle(arr, rnd) {
    var a = arr.slice(), i, j, t;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(rnd() * (i + 1));
      t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function makeQuiz(R, opt) {
    opt = opt || {};
    var rnd = opt.rnd || Math.random;
    var kind = opt.kind === 'name' || opt.kind === 'move' ? opt.kind : (rnd() < 0.5 ? 'name' : 'move');
    var source = OPENINGS;
    if (kind === 'move' && opt.onlyId && byId(opt.onlyId)) source = [byId(opt.onlyId)];
    var op = source[Math.floor(rnd() * source.length)];
    if (kind === 'name') {
      var others = shuffle(OPENINGS.filter(function (o) { return o.id !== op.id; }), rnd).slice(0, 3);
      return {
        kind: 'name', opId: op.id, ply: op.spot, answer: op.id,
        options: shuffle([op].concat(others), rnd).map(function (o) { return { id: o.id, name: o.name }; })
      };
    }
    var user = op.side === 'w' ? 0 : 1, idxs = [], i;
    for (i = 0; i < op.moves.length; i++) if ((i % 2) === user) idxs.push(i);
    var ply = 0, s = null, book = null, correct = '', legal = [], guard = 0;
    do {
      ply = idxs[Math.floor(rnd() * idxs.length)];
      s = R.replay(sans(op).slice(0, ply));
      book = R.parseSan(s, op.moves[ply].san);
      correct = R.toSan(s, book);
      var seen = {};
      legal = [];
      R.moves(s).forEach(function (m) {
        var san = R.toSan(s, m);
        if (san === correct || seen[san]) return;
        seen[san] = 1; legal.push(san);
      });
      guard++;
    } while (legal.length < 3 && guard < 8);
    legal = shuffle(legal, rnd).slice(0, 3);
    return {
      kind: 'move', opId: op.id, ply: ply, answer: correct, why: op.moves[ply].why,
      options: shuffle([correct].concat(legal), rnd)
    };
  }

  var api = { list: OPENINGS, sanKo: sanKo, sanEn: sanEn, byId: byId, sans: sans, makeQuiz: makeQuiz, liveHref: liveHref };
  root.NadooOpenings = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof self !== 'undefined' ? self : globalThis);
