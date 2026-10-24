/* Nadoo Wine & Whisky Cellar data. opt = [ko, en, ok, whyKo, whyEn] */
var CD = window.CD = {};
CD.CP = 'https://link.coupang.com/a/hsdzLh1vB6';
CD.wineSteps = [
{ ic: '🍇', t: ['포도 수확', 'Harvest'], q: ['언제 수확해야 할까요?', 'When do you harvest?'], o: [
  ['당도·산도·껍질이 익은 순간 (8~10월)', 'When sugar, acid and skins are ripe (Aug–Oct)', 1, '정답! 당도(브릭스)가 알코올이 되고, 산도가 상큼함을 만들어요.', 'Right! Sugar becomes alcohol, acid gives freshness.'],
  ['초록색일 때 빨리', 'Early while still green', 0, '너무 시고 당이 적어 알코올이 안 나와요.', 'Too sour, too little sugar.'],
  ['겨울에 얼 때까지 (항상)', 'Always wait until frozen', 0, '아이스와인만 특별히 그렇게 해요.', 'Only for ice wine.']] },
{ ic: '🫙', t: ['파쇄·제경', 'Crush & destem'], q: ['수확한 포도를 어떻게 할까요?', 'What next?'], o: [
  ['줄기를 떼고 살짝 터뜨리기', 'Destem and gently crush', 1, '정답! 줄기는 쓴맛을 내서 보통 제거해요. 씨는 터지지 않게!', 'Right! Stems add bitterness; do not crack seeds.'],
  ['씨까지 갈아 버리기', 'Grind seeds too', 0, '씨가 깨지면 거칠고 쓴 타닌이 나와요.', 'Crushed seeds give harsh tannin.'],
  ['바로 병에 담기', 'Bottle it now', 0, '아직 주스예요. 발효가 필요해요!', 'It is still juice — ferment first!']] }
];
CD.styles = [
 { id: 'red', ic: '🍷', t: ['레드 와인', 'Red wine'], ok: 'skin', why: ['껍질째 발효해야 껍질의 색소(안토시아닌)와 타닌이 우러나요.', 'Fermenting on skins extracts color and tannin.'] },
 { id: 'white', ic: '🥂', t: ['화이트 와인', 'White wine'], ok: 'press', why: ['먼저 착즙해 맑은 즙만 발효하면 색과 타닌 없이 상큼해요. (적포도로도 화이트 가능!)', 'Press first and ferment clear juice — fresh, no tannin.'] },
 { id: 'rose', ic: '🌸', t: ['로제 와인', 'Rosé'], ok: 'macer', why: ['적포도 껍질과 2~24시간만 짧게 침용해 분홍빛만 살짝 입혀요.', 'Brief 2–24 h skin contact gives a pink tint.'] },
 { id: 'champ', ic: '🍾', t: ['샴페인(스파클링)', 'Champagne'], ok: 'bottle', why: ['기본 와인에 효모+당을 넣고 병 안에서 2차 발효 → 탄산이 갇혀 기포가 돼요.', 'Second fermentation in the bottle traps CO₂ as bubbles.'] }];
CD.methods = [
 ['skin', '🟣', ['껍질째 발효', 'Ferment on skins'], ['포도즙+껍질+씨를 함께 1~3주', 'Juice + skins 1–3 weeks']],
 ['press', '⚪', ['먼저 착즙 후 발효', 'Press, then ferment'], ['맑은 즙만 저온 발효', 'Cool-ferment clear juice']],
 ['macer', '🩷', ['짧은 침용', 'Short maceration'], ['껍질과 몇 시간만', 'Skins for a few hours']],
 ['bottle', '🫧', ['병 내 2차 발효', 'Second ferment in bottle'], ['효모+당 넣고 마개', 'Add yeast + sugar, cap']]];
CD.aging = { wine: [
 ['steel', '🥫', ['스테인리스 탱크', 'Stainless steel'], ['산소·나무 향 차단 → 과일 향이 생생하고 상큼 (소비뇽 블랑·리슬링)', 'No oak or oxygen → crisp, fruity (Sauvignon Blanc, Riesling)']],
 ['oak', '🛢️', ['오크통', 'Oak barrel'], ['미세한 산소 + 나무 향 → 바닐라·토스트·버터, 타닌이 부드러워짐 (카베르네·샤르도네)', 'Micro-oxygen + wood → vanilla, toast, butter; softer tannin (Cabernet, Chardonnay)']]] };
CD.grapes = [
 ['🍇', '카베르네 소비뇽', 'Cabernet Sauvignon', 'red', ['블랙커런트·삼나무, 진한 타닌. 레드의 왕. 보르도·칠레·나파', 'Blackcurrant, cedar, firm tannin. Bordeaux, Chile, Napa'], ['스테이크·갈비', 'Steak, galbi']],
 ['🍇', '메를로', 'Merlot', 'red', ['자두·초콜릿, 부드러운 타닌. 입문용', 'Plum, chocolate, soft tannin'], ['불고기·파스타', 'Bulgogi, pasta']],
 ['🍒', '피노 누아', 'Pinot Noir', 'red', ['체리·딸기·흙, 가볍고 섬세. 부르고뉴·뉴질랜드', 'Cherry, earth, light & elegant'], ['연어·오리·버섯', 'Salmon, duck, mushroom']],
 ['🫐', '쉬라즈(시라)', 'Shiraz/Syrah', 'red', ['블랙베리·후추, 진하고 스파이시. 호주 대표', 'Blackberry, pepper, bold. Australia'], ['바비큐·양고기', 'BBQ, lamb']],
 ['🍏', '샤르도네', 'Chardonnay', 'white', ['오크 숙성 시 버터·바닐라, 스틸은 사과·레몬', 'Oaked: butter, vanilla; unoaked: apple'], ['크림 파스타·치킨', 'Creamy pasta, chicken']],
 ['🌿', '소비뇽 블랑', 'Sauvignon Blanc', 'white', ['자몽·풀·패션프루트, 상큼한 산도. 뉴질랜드 말보로', 'Grapefruit, grass, zesty. Marlborough'], ['회·샐러드·염소치즈', 'Sashimi, salad, goat cheese']],
 ['🍑', '리슬링', 'Riesling', 'white', ['복숭아·꿀·석유 향, 드라이~스위트. 독일', 'Peach, honey, petrol; dry to sweet. Germany'], ['매운 음식·태국 요리', 'Spicy food, Thai']],
 ['🌼', '모스카토', 'Moscato', 'white', ['청포도·꽃향, 달콤하고 약한 기포·낮은 도수(5~7%)', 'Grape, flowers; sweet, low ABV'], ['과일·케이크 디저트', 'Fruit, desserts']]];
/* bottles: [ic, ko, en, grape/type, origin, notes, food, brag line, label tip] */
CD.wines = [
 ['🍷', '1865 카베르네 소비뇽', '1865 Cabernet Sauvignon', '카베르네 소비뇽', '칠레 · 산 페드로', ['블랙베리·오크, 진하고 묵직', 'Blackberry, oak, full-bodied'], ['삼겹살·갈비·스테이크', 'Pork belly, galbi, steak'], ['"1865는 와이너리 설립 연도래요. 18홀 65타 치라고 골프 선물로 유명하죠."', '"1865 is the founding year — golfers gift it hoping for 65 strokes on 18 holes."'], ['Valle del Maipo = 칠레 마이포 계곡 산지', 'Valle del Maipo = region']],
 ['🍷', '몬테스 알파 카베르네 소비뇽', 'Montes Alpha Cabernet Sauvignon', '카베르네 소비뇽', '칠레 · 콜차과', ['카시스·민트·바닐라', 'Cassis, mint, vanilla'], ['양념갈비·치즈', 'Marinated ribs, cheese'], ['"라벨의 천사는 창업자가 사고를 피한 행운을 기념한 거래요."', '"The angel on the label honors the founder\'s lucky escape."'], ['Alpha = 프리미엄 라인', 'Alpha = premium line']],
 ['🥂', '클라우디 베이 소비뇽 블랑', 'Cloudy Bay Sauvignon Blanc', '소비뇽 블랑', '뉴질랜드 · 말보로', ['자몽·라임·패션프루트, 짜릿한 산도', 'Grapefruit, lime, zesty'], ['회·굴·샐러드', 'Sashimi, oysters, salad'], ['"뉴질랜드 소비뇽 블랑을 세계에 알린 주인공이에요. 라벨 산 그림이 말보로 지역이죠."', '"The wine that put NZ Sauvignon Blanc on the map."'], ['Marlborough = 서늘한 기후 → 높은 산도', 'Cool Marlborough → high acidity']],
 ['🧈', '브레드 앤 버터 샤르도네', 'Bread & Butter Chardonnay', '샤르도네', '미국 · 캘리포니아', ['버터·바닐라·토스트, 크리미', 'Butter, vanilla, toast, creamy'], ['크림 파스타·닭가슴살', 'Creamy pasta, chicken'], ['"이 버터 향은 젖산 발효(MLF)와 오크 숙성 덕분이에요."', '"That butteriness comes from malolactic fermentation and oak."'], ['Chardonnay + Oak = 버터리', 'Oak = buttery']],
 ['🦘', '옐로우 테일 쉬라즈', 'Yellow Tail Shiraz', '쉬라즈', '호주', ['잘 익은 자두·후추, 부드럽고 과일 풍부', 'Ripe plum, pepper, juicy'], ['바비큐·피자', 'BBQ, pizza'], ['"호주에선 시라를 쉬라즈라고 불러요. 같은 품종이에요!"', '"Shiraz is what Australians call Syrah — same grape."'], ['[yellow tail] = 왈라비 캐릭터', 'Wallaby mascot']],
 ['🍾', '모엣 샹동 임페리얼 브뤼', 'Moët & Chandon Impérial Brut', '샤르도네·피노 누아·피노 뫼니에', '프랑스 · 샹파뉴', ['사과·브리오슈, 섬세한 기포', 'Apple, brioche, fine bubbles'], ['굴·튀김·축하 자리', 'Oysters, fried food, toasts'], ['"샹파뉴 지역에서 병 내 2차 발효를 해야만 샴페인이라 부를 수 있어요."', '"Only bottle-fermented wine from Champagne may be called Champagne."'], ['Brut = 드라이(당 12g/L 이하)', 'Brut = dry']],
 ['🌼', '간치아 모스카토 다스티', 'Gancia Moscato d\'Asti', '모스카토', '이탈리아 · 피에몬테', ['청포도·복숭아·꽃, 달콤한 약발포 5.5%', 'Grape, peach, sweet, 5.5%'], ['과일·케이크·마카롱', 'Fruit, cake'], ['"발효를 중간에 멈춰서 당이 남고 도수가 낮은 거예요."', '"Fermentation is stopped early — sweet and low alcohol."'], ['DOCG = 이탈리아 최고 등급', 'DOCG = top Italian tier']],
 ['🍒', '킴 크로포드 피노 누아', 'Kim Crawford Pinot Noir', '피노 누아', '뉴질랜드', ['체리·라즈베리, 가볍고 실키', 'Cherry, raspberry, silky'], ['연어·훈제오리', 'Salmon, smoked duck'], ['"피노 누아는 껍질이 얇아 키우기 까다로워서 \'마음이 약한 포도\'라고 해요."', '"Thin-skinned and fussy — the heartbreak grape."'], ['Pinot Noir = 가벼운 레드', 'Light red']]];
CD.whiskySteps = [
{ ic: '🌾', t: ['몰팅(맥아 만들기)', 'Malting'], q: ['보리를 어떻게 준비할까요?', 'How do you prepare barley?'], o: [
  ['물에 불려 싹을 틔운 뒤 건조', 'Steep, sprout, then dry', 1, '정답! 싹이 트면 녹말을 당으로 바꾸는 효소가 생겨요.', 'Right! Sprouting creates enzymes that turn starch into sugar.'],
  ['그냥 볶기', 'Just roast it', 0, '효소가 없으면 당이 안 생겨 발효가 안 돼요.', 'No enzymes, no sugar.'],
  ['포도즙과 섞기', 'Mix with grape juice', 0, '그건 브랜디 쪽이에요 😄', 'That is brandy territory.']] },
{ ic: '🔥', t: ['피트(이탄) 건조', 'Peat drying'], q: ['스모키·소독약 향을 내려면?', 'For smoky, medicinal notes?'], o: [
  ['피트(이탄) 연기로 맥아 건조', 'Dry the malt over peat smoke', 1, '정답! 페놀 성분(PPM)이 맥아에 배어 라프로익 같은 아일라 위스키의 정로환 향이 나요.', 'Right! Phenols (PPM) give Islay whiskies that medicinal smoke.'],
  ['숯불 고기 굽기', 'Grill meat nearby', 0, '😄 향이 배지 않아요.', 'Nope.'],
  ['오래 숙성만', 'Just age longer', 0, '숙성은 스모키함을 오히려 줄여요.', 'Aging actually softens smoke.']] },
{ ic: '🫕', t: ['당화·발효', 'Mashing & fermenting'], q: ['맥아로 무엇을 만들까요?', 'What do you make from malt?'], o: [
  ['뜨거운 물에 당화 → 효모 발효 → 워시(약 8% 맥주)', 'Mash in hot water → yeast → wash (~8%)', 1, '정답! 홉 없는 맥주 같은 "워시"가 증류 원료예요.', 'Right! The hop-less "wash" is what gets distilled.'],
  ['바로 증류기에 맥아 넣기', 'Put dry malt in the still', 0, '알코올이 없어서 증류할 게 없어요.', 'No alcohol yet.'],
  ['식초 만들기', 'Make vinegar', 0, '아니에요!', 'No!']] }];
CD.stills = [['pot', '🏺', ['구리 단식 증류기 (팟 스틸)', 'Copper pot still'], ['한 번에 한 솥씩 2~3회 증류. 무겁고 풍미가 진한 원액 → 싱글몰트 스카치', 'Batch, 2–3 times. Rich, heavy spirit → single malt']],
 ['col', '🏛️', ['연속식 증류기 (컬럼 스틸)', 'Column still'], ['쉬지 않고 연속 증류, 고도수·가벼운 원액 → 그레인·블렌디드·버번', 'Continuous, high-proof, lighter → grain, blends, bourbon']]];
CD.casks = [['bourbon', '🍯', ['버번 캐스크', 'Bourbon cask'], ['아메리칸 오크 → 바닐라·꿀·코코넛, 밝은 황금색', 'American oak → vanilla, honey, golden']],
 ['sherry', '🍫', ['셰리 캐스크', 'Sherry cask'], ['스페인 셰리 와인통 → 건포도·초콜릿·말린 과일, 진한 호박색', 'Ex-sherry → raisin, chocolate, amber']]];
CD.whiskies = [
 ['🥃', '글렌피딕 12년', 'Glenfiddich 12', '싱글몰트 · 스페이사이드', '스코틀랜드', ['서양배·사과·꿀, 산뜻한 입문용', 'Pear, apple, honey; easy starter'], ['하이볼·가벼운 안주', 'Highball, light snacks'], ['"세계에서 가장 많이 팔리는 싱글몰트 중 하나, 삼각 병이 트레이드마크예요."', '"One of the best-selling single malts — the triangular bottle."'], ['Single Malt = 한 증류소·100% 맥아', 'One distillery, 100% malt']],
 ['🥃', '발베니 12년 더블우드', 'Balvenie 12 DoubleWood', '싱글몰트 · 스페이사이드', '스코틀랜드', ['꿀·바닐라 + 셰리의 건포도', 'Honey, vanilla + sherry raisin'], ['치즈·견과류', 'Cheese, nuts'], ['"버번 캐스크에서 숙성 후 셰리 캐스크로 옮겨 피니시해서 더블우드예요."', '"Bourbon cask, then sherry-cask finish — hence DoubleWood."'], ['Double Wood = 두 가지 통', 'Two casks']],
 ['🥃', '맥캘란 12년 셰리 오크', 'Macallan 12 Sherry Oak', '싱글몰트 · 스페이사이드', '스코틀랜드', ['말린 과일·초콜릿·생강, 진한 호박색', 'Dried fruit, chocolate, ginger'], ['다크초콜릿·스테이크', 'Dark chocolate, steak'], ['"맥캘란은 셰리 캐스크의 롤스로이스로 불려요. 색소 없이 통에서만 색을 얻어요."', '"The Rolls-Royce of sherry casks — natural color only."'], ['Sherry Oak = 셰리통 100%', '100% sherry casks']],
 ['🔥', '라프로익 10년', 'Laphroaig 10', '싱글몰트 · 아일라', '스코틀랜드', ['피트 스모크·요오드·소독약·바다', 'Peat smoke, iodine, sea'], ['훈제연어·굴', 'Smoked salmon, oysters'], ['"정로환·병원 냄새가 난다면 그게 피트 맛이에요. 찰스 3세가 좋아한대요."', '"That hospital smell is peat — a royal favorite."'], ['Islay = 피트의 섬', 'Islay = peat island']],
 ['🖤', '조니워커 블랙 12년', 'Johnnie Walker Black 12', '블렌디드 스카치', '스코틀랜드', ['바닐라·말린 과일·은은한 스모크', 'Vanilla, dried fruit, light smoke'], ['하이볼·안주 무난', 'Highball, anything'], ['"약 40종 몰트·그레인을 섞은 블렌디드예요. 비스듬한 라벨 24도!"', '"Around 40 whiskies blended; the label slants 24°."'], ['Blended = 몰트+그레인 혼합', 'Malt + grain']],
 ['💙', '조니워커 블루', 'Johnnie Walker Blue', '블렌디드 스카치', '스코틀랜드', ['꿀·스모크·견과, 매우 부드러움', 'Honey, smoke, silky'], ['스트레이트로 천천히', 'Neat, slowly'], ['"만 개 통 중 하나만 블루에 쓰일 만큼 귀한 원액이래요."', '"Said to use one cask in ten thousand."'], ['연수 표기 없음(NAS)', 'No age statement']],
 ['🎩', '발렌타인 17년', 'Ballantine\'s 17', '블렌디드 스카치', '스코틀랜드', ['꿀·바닐라·오크, 균형 잡힌 맛', 'Honey, vanilla, balanced'], ['명절 선물·한식', 'Gifts, Korean food'], ['"17년은 들어간 원액 중 가장 어린 게 17년이라는 뜻이에요."', '"17 means the youngest whisky inside is 17."'], ['17 Years = 최소 숙성 연수', 'Minimum age']],
 ['🐎', '메이커스 마크', 'Maker\'s Mark', '버번 (밀 버번)', '미국 · 켄터키', ['캐러멜·바닐라·밀의 부드러움', 'Caramel, vanilla, soft wheat'], ['바비큐·올드패션드', 'BBQ, Old Fashioned'], ['"빨간 왁스 봉인은 손으로 하나하나 담가서 모양이 다 달라요. 버번은 새 오크통 필수!"', '"Each red wax seal is hand-dipped. Bourbon must use new charred oak."'], ['Bourbon = 옥수수 51%↑·새 탄화 오크', '51%+ corn, new charred oak']],
 ['🇯🇵', '산토리 가쿠빈', 'Suntory Kakubin', '재패니즈 블렌디드', '일본', ['가볍고 깔끔, 하이볼 최강', 'Light, clean; highball king'], ['가라아게·꼬치', 'Karaage, yakitori'], ['"일본 이자카야 하이볼의 정석, 거북이 등껍질 모양 병이에요."', '"The izakaya highball classic — tortoise-shell bottle."'], ['角瓶 = 각진 병', 'Square bottle']],
 ['⛩️', '야마자키 12년', 'Yamazaki 12', '재패니즈 싱글몰트', '일본', ['복숭아·꿀·미즈나라 오크 향(백단향)', 'Peach, honey, Mizunara sandalwood'], ['스시·사시미', 'Sushi'], ['"일본 첫 몰트 증류소, 일본 참나무 미즈나라 통이 특징이에요."', '"Japan\'s first malt distillery; Mizunara oak."'], ['Single Malt Japanese', 'Japanese single malt']],
 ['☘️', '제임슨', 'Jameson', '아이리시 블렌디드', '아일랜드', ['3회 증류 → 매우 부드러움, 바닐라·견과', 'Triple-distilled, smooth'], ['맥주와 함께·아이리시 커피', 'With beer, Irish coffee'], ['"아이리시 위스키는 보통 3번 증류해 스카치보다 부드러워요. 철자도 Whiskey!"', '"Triple distilled and spelled Whiskey."'], ['Triple Distilled', '3x distilled']]];
CD.guests = [
 ['🥩', ['스테이크 집에서 진한 레드를 찾는 손님', 'Steak dinner, wants bold red'], 'w', 0, ['카베르네의 진한 타닌이 고기 지방을 씻어 줘요.', 'Cabernet tannin cuts the fat.']],
 ['🍣', ['회·굴과 함께 상큼한 화이트', 'Sashimi & oysters, wants crisp white'], 'w', 2, ['소비뇽 블랑의 높은 산도가 해산물 비린맛을 잡아요.', 'High acidity tames fishiness.']],
 ['🍰', ['술은 약하지만 달콤한 걸 원하는 손님', 'Light drinker, likes sweet'], 'w', 6, ['모스카토 다스티는 5.5%로 낮고 달콤해요.', 'Moscato d\'Asti is sweet at 5.5%.']],
 ['🎉', ['승진 축하 건배', 'Celebration toast'], 'w', 5, ['축하엔 샴페인! 병 내 2차 발효 기포.', 'Celebrate with Champagne.']],
 ['🌱', ['위스키 처음, 부드러운 하이볼', 'First whisky, smooth highball'], 'k', 8, ['가쿠빈·글렌피딕처럼 가벼운 위스키가 하이볼에 좋아요.', 'Light whiskies suit highballs.']],
 ['🔥', ['스모키한 위스키 마니아', 'Loves smoky whisky'], 'k', 3, ['아일라 피트 위스키 라프로익!', 'Islay peat: Laphroaig!']],
 ['🍫', ['진하고 달콤한 셰리 풍미', 'Rich sherried flavor'], 'k', 2, ['맥캘란 셰리 오크 = 건포도·초콜릿.', 'Macallan Sherry Oak.']],
 ['🍔', ['바비큐에 달달한 미국 위스키', 'Sweet American whisky with BBQ'], 'k', 7, ['버번은 새 탄화 오크로 캐러멜·바닐라가 진해요.', 'Bourbon: caramel and vanilla.']]];
CD.label = [
 ['Grand Cru', ['프랑스 최고 등급 포도밭', 'Top French vineyard rank']], ['Reserva / Reserve', ['일반보다 오래 숙성한 상급 와인', 'Aged longer than standard']], ['Brut', ['드라이(당분 적음) 스파클링', 'Dry sparkling']], ['DOCG / AOC', ['이탈리아·프랑스 원산지 통제 등급', 'Protected origin tier']], ['Vintage 2019', ['포도 수확 연도', 'Harvest year']], ['Single Malt', ['한 증류소·100% 보리 맥아·팟 스틸', 'One distillery, malt, pot still']], ['Blended', ['몰트+그레인 위스키 혼합', 'Malt + grain blend']], ['12 Years Old', ['가장 어린 원액이 12년 숙성', 'Youngest whisky is 12']], ['Cask Strength', ['물 타지 않은 통 그대로 고도수(55%+)', 'Undiluted, high proof']], ['Non-Chill Filtered', ['냉각 여과 안 함 → 풍미 유지', 'Not chill-filtered']], ['Sherry Cask Finish', ['마지막에 셰리통에서 추가 숙성', 'Finished in sherry casks']], ['Kentucky Straight Bourbon', ['켄터키산·2년 이상 숙성 버번', 'Kentucky, 2+ years']]];
CD.quiz = [
 ['레드 와인의 색과 타닌은 어디서 올까요?', 'Where do red color and tannin come from?', ['포도 껍질·씨', '오크통 색소', '설탕'], ['Skins & seeds', 'Oak dye', 'Sugar'], 0, ['껍질째 발효해야 우러나요.', 'From skin contact.']],
 ['샴페인 기포는 어떻게 생길까요?', 'How do Champagne bubbles form?', ['탄산가스 주입', '병 내 2차 발효', '흔들어서'], ['CO₂ injection', 'Second ferment in bottle', 'Shaking'], 1, ['효모가 병 안에서 만든 CO₂가 갇혀요.', 'Yeast CO₂ is trapped.']],
 ['로제 와인 만드는 법은?', 'How is rosé made?', ['레드+화이트 섞기만', '적포도 껍질과 짧게 침용', '딸기 첨가'], ['Mix red+white', 'Short skin contact', 'Add strawberries'], 1, ['대부분 짧은 침용으로 만들어요.', 'Mostly brief maceration.']],
 ['스모키·소독약 향의 원인은?', 'Cause of smoky medicinal notes?', ['피트(이탄) 연기', '셰리 캐스크', '연속식 증류'], ['Peat smoke', 'Sherry cask', 'Column still'], 0, ['피트 페놀 성분이에요.', 'Peat phenols.']],
 ['셰리 캐스크의 대표 풍미는?', 'Sherry cask flavor?', ['바닐라·코코넛', '건포도·초콜릿', '레몬·풀'], ['Vanilla, coconut', 'Raisin, chocolate', 'Lemon, grass'], 1, ['셰리통 → 말린 과일·호박색.', 'Dried fruit, amber.']],
 ['엔젤스 쉐어(Angel\'s Share)란?', 'What is the Angel\'s Share?', ['천사 그림 라벨', '숙성 중 증발해 사라지는 위스키', '첫 잔 서비스'], ['Angel label', 'Whisky evaporated during aging', 'Free first pour'], 1, ['스코틀랜드에서 매년 약 2%씩 증발해요.', 'About 2% a year in Scotland.']],
 ['싱글몰트의 뜻은?', 'Single malt means?', ['한 증류소·100% 맥아', '한 통에서만', '1년 숙성'], ['One distillery, all malt', 'One cask only', '1 year old'], 0, ['한 통은 Single Cask예요.', 'One cask = single cask.']],
 ['버번 위스키의 필수 조건은?', 'Bourbon must...', ['옥수수 51%↑·새 탄화 오크통', '셰리통 숙성', '스코틀랜드 생산'], ['51% corn, new charred oak', 'Sherry casks', 'Made in Scotland'], 0, ['그래서 바닐라·캐러멜이 진해요.', 'Hence vanilla & caramel.']]];
