# 나두 게임 가이드 (/guide)

빌드 없이 동작하는 데이터 기반 가이드입니다.

- `index.html` : 목록 페이지 (카테고리 탭, 추천 학습 순서, 체스·장기·샹치·쇼기 비교표)
- `game.html?id=<id>` : 게임 한 개를 `data/<id>.json`에서 읽어 그리는 공용 페이지
- `guide.js` : 렌더러 (목록·게임 페이지 + SVG 도식: 격자판 / 만칼라 판 / 카드)
- `guide.css` : 공용 스타일
- `play/<id>.html` : 컴퓨터와 한 판 (오목·오델로·만칼라·쿼리도·체스·아발론·장기·샹치·바둑 9×9). 장기·샹치는 공용 엔진 `play/jx.core.js` + 판 그리기 `play/jx.ui.js`. 규칙·AI는 `play/<id>.rules.js`(Web Worker `play/worker.js`에서 계산), 공용 틀 `play/play.js`. 목록에 `"pc": true`면 '🤖 PC 대국' 배지
- `data/index.json` : 전체 게임 목록 (27개, 모두 가이드 있음). `status`가 `ready`면 링크, `soon`이면 '준비 중'

## 새 게임 추가하는 법 (2단계)

1. `data/<id>.json` 파일을 만든다. 기존 파일(예: `omok.json`)을 복사해서 내용만 바꾸면 가장 쉽다.
2. `data/index.json`의 해당 게임 줄에서 `"status": "soon"`을 `"ready"`로 바꾼다. (목록에 없는 새 게임이면 한 줄 추가)

끝. 빌드·배포 설정 변경 없이 main에 올리면 바로 `/guide/game.html?id=<id>`로 보인다.

## 목록 한 줄 (`data/index.json`)

```json
{"id": "omok", "ko": "오목", "en": "Gomoku", "cat": "board", "emoji": "⚫", "level": 1, "order": 1, "players": "2명", "solo": false, "kids": true, "status": "ready"}
```

- `cat`: `board`(보드게임) 또는 `card`(카드게임)
- `level`: 난이도 1~5 (추천 학습 순서는 level → order 순)
- `solo`: '혼자 연습 가능' 배지, `kids`: '아이랑 하기 좋음' 배지
- `id`는 영어 소문자·숫자·하이픈만

## 게임 파일 (`data/<id>.json`) 구조

섹션은 페이지에 항상 이 순서로 나온다.

| 키 | 섹션 |
|---|---|
| `glance` | 한눈에 보기: `players`, `time`, `level`(1~5), `materials`, `similar`(게임 id 또는 그냥 글자) |
| `goal` | 목표 한 문장 |
| `setup` | 준비: `text`(목록), `diagram` |
| `walkthrough` | 한 판 따라 하기: `[{ "text", "diagram" }]` — 한 단계에 한 수/한 차례, 도식 하나 |
| `rules` | `basic`(기본 규칙), `exceptions`(예외 규칙) |
| `strategy`, `mistakes` | 초보 전략 3가지, 자주 하는 실수 |
| `glossary` | 용어 사전: `[["용어", "설명"]]` |
| `variants` | 한국식 vs 해외: `rows` = `[["항목", "한국식", "해외"]]`, `notes` |
| `progress` | 내 진도 체크 항목 (체크 상태는 브라우저 localStorage `nadoo_guide_progress_v1`) |

선택: `intro`(소개 한 줄), `notice`(노란 안내 상자), `play`(`{"url": "/games/gameN/"}` → '가이드 읽고 바로 해 보기' 버튼. 나두게임즈에 같은 게임이 있을 때만, 게임 쪽에도 가이드 링크를 함께 단다).

## 도식 (외부 이미지 금지, 전부 SVG로 그림)

- 격자판 `{"type":"grid","mode":"line"|"cell","size":15,"stones":[[행,열,"b"|"w",번호?]],"last":[행,열],"marks":[[행,열,"x"|"dot"|"txt","글자"]],"line":[[행,열],[행,열]],"flipped":[[행,열]],"stars":[[행,열]],"coords":true,"caption":"..."}`
  - `line` = 교차점에 두는 판(오목·바둑·장기), `cell` = 칸에 두는 판(오델로·체스). 행·열은 0부터.
- 만칼라 `{"type":"mancala","top":[6개],"bottom":[6개],"storeL":0,"storeR":0,"from":"b2","hl":["b3","R"],"cap":["b5","t5"]}`
  - `top`은 상대 줄(화면 왼→오), `bottom`은 내 줄, `L`/`R`은 상대 집/내 집.
- 카드 `{"type":"cards","rows":[{"label":"나","cards":["AS","10H","JKB"],"hl":[0],"note":"..."},{"label":"상대","back":7}]}`
  - 카드 코드: 숫자/A·J·Q·K + 무늬 `S H D C`, `JKB` 흑백 조커, `JKC` 컬러 조커, `XX` 뒷면. `back`: 뒷면 장수.

- 격자판 추가 옵션
  - `pieces`: `[[행,열,"글자",편,크기/보조글자,승격]]` + `pieceStyle`: `disc`(장기·샹치 원형 말, 편 `r`빨강 `g`초록 `k`검정), `glyph`(체스 유니코드 ♚♛♜♝♞♟, 편 `w`/`b`), `shogi`(오각형 말, 편 `s` 선수 / `v` 후수=거꾸로, 5번째 값은 한국어 이름, 6번째 1이면 빨간 글자=승격)
  - `palace`: `[[위행,왼열]]` 궁성 X선, `river`: 강 위쪽 행 번호(샹치), `checker`: 체스판 무늬, `bg`·`lineColor`·`colLabels`·`rowLabels`
  - `walls`: `[[행,열,"h"|"v"]]` 쿼리도 벽(칸 2개 길이), `fills`: `[[행,열,"blue"|"yellow"|"red"|"green"]]` 블로커스 칸 칠하기, `arrows`: `[[행1,열1,행2,열2]]` 이동 화살표, `marks`의 `"sq"` 칸 테두리
- 육각판 `{"type":"hex","n":5,"marbles":[[줄,칸,"b"|"w"]],"arrows":[[줄,칸,줄,칸]],"marks":[[줄,칸]]}` (줄 길이 5·6·7·8·9·8·7·6·5)
- 솔리테어 `{"type":"tableau","top":[{"label":"기초♠","card":"AS"}, null, ...],"cols":[{"down":3,"up":["KH","QS"],"hl":[1]}]}` (`card`가 없으면 빈 자리)

## 예시 수순 검증

한 판 따라 하기의 수순은 가능한 한 스크립트로 검증해서 만든다 (체스·쇼기는 규칙 라이브러리, 장기·샹치·바둑·쿼리도·블로커스·아발론·솔리테어는 간이 규칙 검사기). 손으로 고칠 때도 규칙에 맞는지 꼭 다시 확인한다.

## 지켜야 할 것

- 모든 페이지 `<head>`에 `<script src="/counter.js" defer></script>`
- 브랜드는 '나두' / '나두Ai'. 광고·추적 코드·제휴 링크 넣지 않기.
- 상표 게임(블로커스·쿼리도·아발론 등)은 공식 이미지 사용 금지, 직접 그린 SVG만.
- 블랙잭·포커·인디언 포커·훌라·마이티처럼 걸기·점수 주고받기가 있는 게임은 '돈 걸지 않고 규칙 배우기'로 설명하고 바둑돌·사탕으로 대신한다.
