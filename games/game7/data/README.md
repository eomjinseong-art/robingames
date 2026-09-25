# 끝말잇기 명사 목록

`stdict-nouns.txt`는 국립국어원 [표준국어대사전](https://stdict.korean.go.kr)에서 끝말잇기에 쓰려고 골라 낸 명사 목록입니다. 한 줄에 한 단어이며, 198,441개입니다.

## 출처와 라이선스

- 출처: 국립국어원 표준국어대사전
- 데이터 빌드: 2026-06-05 (`lastBuildDate` 20260605)
- 배포본: [spellcheck-ko/korean-dict-nikl](https://github.com/spellcheck-ko/korean-dict-nikl) `stdict/` (commit `c31ae259de4cd0a355cf8a19b16e75578fd396e2`, “표준국어대사전 업데이트 20260605”)
- 라이선스: [크리에이티브 커먼즈 저작자표시-동일조건변경허락 2.0 대한민국 (CC BY-SA 2.0 KR)](https://creativecommons.org/licenses/by-sa/2.0/kr/)

이 목록은 원본 사전 XML을 그대로 옮긴 것이 아닙니다. 끝말잇기 규칙에 맞게 아래처럼 골라 고쳤습니다.

- 구성 단위가 단어인 항목만 남김 (구, 속담, 관용구 제외)
- 품사가 명사인 뜻만 봄 (의존 명사 제외)
- 명사 뜻이 모두 인명, 지명, 책명, 고유명 일반인 항목 제외
- 어깨번호(동형어 번호)와 `-`, `^` 표시를 지움
- 완성형 한글 음절만, 두 음절 이상
- 같은 표제어는 한 번만

원본 XML은 이 저장소에 넣지 않습니다.

## 다시 만들기

저장소 루트에서:

```bash
pip install lxml
python3 scripts/build-stdict-nouns.py
```

스크립트가 위 커밋의 XML을 임시 폴더에 받아 `games/game7/data/stdict-nouns.txt`를 다시 씁니다. 이미 받아 둔 XML이 있으면 `--xml-dir`로 그 폴더를 넘기면 됩니다.
