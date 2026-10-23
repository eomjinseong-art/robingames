/* Nadoo Bar Academy: convenience-store shopping guide (real, well-known brands only; no prices) */
(function () {
  'use strict';
  /* [ko name, en name, label color, cap color, shape(b=bottle,s=squat,c=can,p=pet), note ko, note en, startHere] */
  BAR.SHOP = {
    gin: [["고든스 런던 드라이 진", "Gordon's London Dry Gin", '#d8e8c8', '#b23a2a', 'b', '주니퍼가 또렷하고 깔끔한 기본 진.', 'Clean, juniper-forward everyday gin.', 1],
      ['봄베이 사파이어', 'Bombay Sapphire', '#3f7fcf', '#c8d4e0', 's', '꽃·시트러스 향이 부드럽고 화사해요.', 'Soft, floral and citrusy.'],
      ['탱커레이 런던 드라이 진', 'Tanqueray London Dry', '#2f7a4a', '#b23a2a', 's', '주니퍼가 진하고 단단한 맛.', 'Bold, juniper-heavy and firm.'],
      ['비피터 런던 드라이 진', 'Beefeater London Dry', '#e8e0d0', '#b23a2a', 'b', '레몬 껍질 향이 산뜻한 클래식.', 'Bright lemon-peel classic.']],
    tonic: [['진로 토닉워터', 'Jinro Tonic Water', '#f2f2ea', '#2f6fbf', 'p', '달콤하고 쓴맛이 약해 입문용.', 'Sweet, gentle bitterness: easy start.', 1],
      ['슈웹스 토닉워터', 'Schweppes Tonic Water', '#f0d040', '#f0d040', 'c', '탄산이 세고 쌉싸름해요.', 'Sharp fizz, clearly bitter.'],
      ['피버트리 인디언 토닉워터', 'Fever-Tree Indian Tonic', '#f4ecd8', '#2a3a5a', 'b', '단맛이 적고 퀴닌 향이 고급스러워요.', 'Less sweet, refined quinine.']],
    jwhisky: [['산토리 가쿠빈', 'Suntory Kakubin', '#e8c060', '#c8a040', 's', '하이볼의 정석. 가볍고 달큰해요.', 'The classic highball whisky: light, honeyed.', 1],
      ['산토리 토키', 'Suntory Toki', '#d8d8d0', '#3a3a3a', 's', '청사과 향의 가볍고 깔끔한 블렌디드.', 'Light, crisp, green-apple notes.'],
      ['짐빔 화이트 (대체)', 'Jim Beam White (substitute)', '#f0f0e8', '#202020', 'b', '버번이라 더 달고 바닐라 향. 짐빔 하이볼로 좋아요.', 'Bourbon: sweeter, vanilla; makes a fine highball.']],
    soda: [['씨그램 탄산수 (플레인)', 'Seagram Sparkling Water (plain)', '#e8f4f8', '#2a8a4a', 'p', '탄산이 강해 하이볼에 딱.', 'Strong bubbles, great for highballs.', 1],
      ['트레비 (플레인)', 'Trevi (plain)', '#e0f0ff', '#3a6ab0', 'p', '부드러운 탄산. 플레인 맛을 골라요.', 'Softer fizz; pick the plain one.']],
    cola: [['코카콜라', 'Coca-Cola', '#d42020', '#d42020', 'c', '바닐라 향 단맛. 쿠바 리브레의 기본.', 'Vanilla-sweet; the Cuba Libre default.', 1], ['펩시콜라', 'Pepsi', '#1a4ab0', '#1a4ab0', 'c', '조금 더 달고 시트러스 느낌.', 'A touch sweeter, more citrus.']],
    rum: [['바카디 카르타 블랑카', 'Bacardí Carta Blanca', '#f0ece0', '#c8102e', 'b', '가볍고 깔끔한 화이트 럼.', 'Light, clean white rum.', 1], ['하바나 클럽 3년', 'Havana Club 3 Años', '#f2e8d0', '#a02020', 'b', '바닐라·사탕수수 향이 조금 더 진해요.', 'More vanilla and cane character.']],
    darkrum: [['캡틴모건 오리지널 스파이스드 (대체)', 'Captain Morgan Original Spiced (substitute)', '#e8c890', '#202020', 'b', '바닐라·향신료가 들어간 럼. 다크 럼 대신.', 'Spiced, vanilla rum: a stand-in for dark rum.', 1]],
    vodka: [['앱솔루트 보드카', 'Absolut Vodka', '#e8f0f8', '#1a3a7a', 's', '깨끗하고 중립적. 무엇과도 잘 섞여요.', 'Clean and neutral; mixes with anything.', 1], ['스미노프 레드', 'Smirnoff Red', '#f4f4f4', '#c02020', 'b', '가볍고 부드러운 기본 보드카.', 'Light, smooth standard vodka.']],
    tequila: [['호세 쿠엘보 에스페셜 실버', 'Jose Cuervo Especial Silver', '#e8e8e0', '#2a2a2a', 'b', '구하기 쉬워요(100% 아가베는 아님).', 'Easy to find (not 100% agave).', 1], ['패트론 실버', 'Patrón Silver', '#eef2f2', '#d8b050', 's', '100% 아가베. 깨끗하고 달큰한 아가베 향.', '100% agave: clean, sweet agave.']],
    oj: [['델몬트 오렌지 100', 'Del Monte Orange 100%', '#f39a1a', '#2a8a3a', 'p', '새콤달콤한 100% 오렌지 주스.', '100% orange juice, sweet-tart.', 1], ['미닛메이드 오렌지', 'Minute Maid Orange', '#f7a020', '#f7a020', 'p', '과즙감이 진해요.', 'Juicy and rich.']],
    gingerbeer: [['피버트리 진저비어', 'Fever-Tree Ginger Beer', '#e8d8a0', '#2a3a5a', 'b', '생강이 맵싸한 진짜 진저비어.', 'Properly spicy ginger beer.'], ['캐나다드라이 진저에일 (대체)', 'Canada Dry Ginger Ale (substitute)', '#2a8a4a', '#2a8a4a', 'c', '더 순하고 달아요. 입문용 대체품.', 'Milder and sweeter: an easy substitute.', 1]],
    triplesec: [['쿠앵트로', 'Cointreau', '#e8a040', '#c86020', 's', '진한 오렌지 껍질 향의 정석.', 'The benchmark orange liqueur.', 1], ['드카이퍼 트리플 섹', 'DeKuyper Triple Sec', '#f0e8c8', '#e08020', 'b', '달고 가벼운 오렌지 리큐어.', 'Sweeter, lighter orange liqueur.']],
    bourbon: [['짐빔 화이트', 'Jim Beam White', '#f0f0e8', '#202020', 'b', '바닐라·캐러멜. 무난한 시작점.', 'Vanilla and caramel: a safe start.', 1], ["메이커스 마크", "Maker's Mark", '#e8d8b0', '#b01818', 's', '밀이 들어가 부드럽고 달큰해요.', 'Wheated, soft and sweet.'], ['와일드 터키 101', 'Wild Turkey 101', '#e8c890', '#6a3a1a', 'b', '도수가 높고 스파이시.', 'High proof and spicy.']],
    rye: [['불렛 라이', 'Bulleit Rye', '#d8e0c8', '#3a5a3a', 'b', '드라이하고 후추 같은 스파이스.', 'Dry, peppery spice.', 1], ['짐빔 라이', 'Jim Beam Rye', '#f0e8d8', '#3a3a3a', 'b', '가볍게 스파이시한 라이.', 'Lightly spicy rye.']],
    scotch: [['조니워커 레드 라벨', 'Johnnie Walker Red Label', '#c02020', '#d8b050', 's', '스모키하고 힘 있는 블렌디드.', 'Punchy, lightly smoky blend.', 1], ['발렌타인 파이니스트', "Ballantine's Finest", '#e8d8b0', '#7a1a1a', 'b', '부드럽고 달콤한 블렌디드.', 'Soft, sweet blend.']],
    irish: [['제임슨', 'Jameson', '#2a6a3a', '#2a6a3a', 'b', '부드럽고 가벼운 아이리시 위스키.', 'Smooth, light Irish whiskey.', 1]],
    cognac: [['헤네시 VS', 'Hennessy V.S', '#2a2a2a', '#c8a040', 's', '과일·오크 향의 기본 코냑.', 'Fruity, oaky everyday cognac.', 1], ['레미 마르탱 VSOP', 'Rémy Martin VSOP', '#b04020', '#c8a040', 's', '더 부드럽고 깊어요.', 'Rounder and deeper.']],
    aperol: [['아페롤', 'Aperol', '#f06a1a', '#f06a1a', 'b', '오렌지·허브의 가벼운 쌉쌀함.', 'Light orange-herbal bitterness.', 1]],
    campari: [['캄파리', 'Campari', '#c8102e', '#c8102e', 'b', '진하게 쓴 붉은 아페리티보.', 'Boldly bitter red aperitivo.', 1]],
    sweetverm: [['마티니 로쏘', 'Martini Rosso', '#9a2020', '#c8a040', 'b', '달콤하고 허브 향의 레드 베르무트.', 'Sweet, herbal red vermouth.', 1], ['친자노 로쏘', 'Cinzano Rosso', '#a02a20', '#2a2a7a', 'b', '바닐라·향신료 느낌.', 'Vanilla and spice.']],
    dryverm: [['마티니 엑스트라 드라이', 'Martini Extra Dry', '#e8f0e0', '#c8a040', 'b', '가볍고 드라이한 화이트 베르무트.', 'Light, dry white vermouth.', 1], ['노일리 프랏 오리지널 드라이', 'Noilly Prat Original Dry', '#e0e8c8', '#2a4a2a', 'b', '허브 향이 더 진해요.', 'More herbal depth.']],
    coffeeliq: [['깔루아', 'Kahlúa', '#3a2010', '#f0d040', 's', '달콤한 커피 리큐어의 대표.', 'The classic sweet coffee liqueur.', 1]],
    cream: [['서울우유 생크림', 'Seoul Milk Fresh Cream', '#ffffff', '#1a6ac0', 'p', '유지방이 풍부해 잘 떠요.', 'Rich cream that floats well.', 1]],
    simple: [['모닌 퓨어 케인 시럽', 'Monin Pure Cane Syrup', '#f4f0e0', '#202020', 'b', '바로 쓰는 설탕 시럽. (설탕+물 1:1로 직접 만들어도 OK)', 'Ready-made sugar syrup (or mix sugar and water 1:1).', 1]],
    cranberry: [['오션스프레이 크랜베리', 'Ocean Spray Cranberry', '#b01030', '#b01030', 'p', '새콤한 크랜베리 칵테일 주스.', 'Tart cranberry cocktail juice.', 1]],
    pineapple: [['델몬트 파인애플', 'Del Monte Pineapple', '#f0d040', '#2a8a3a', 'p', '달콤한 파인애플 주스.', 'Sweet pineapple juice.', 1]],
    prosecco: [['마르티니 프로세코', 'Martini Prosecco', '#e8e0b0', '#c8a040', 'b', '가볍고 과일 향 나는 스파클링.', 'Light, fruity sparkling wine.', 1]],
    champagne: [['모엣 & 샹동 임페리얼 브뤼', 'Moët & Chandon Impérial Brut', '#1a1a1a', '#e8d8a0', 'b', '사과·브리오슈 향의 샴페인.', 'Apple and brioche Champagne.', 1]],
    angostura: [['앙고스투라 아로마틱 비터스', 'Angostura Aromatic Bitters', '#f0e8d0', '#e0a020', 's', '몇 방울이면 맛이 입체적으로.', 'A few dashes add depth.', 1]]
  };
  /* fresh produce tips (not products) */
  BAR.SHOP_TIP = {
    lime: ['🍋 라임: 편의점엔 드물어요. 마트 과일 코너의 생라임을 사서 바로 짜요.', '🍋 Lime: rare in convenience stores; buy fresh limes at a supermarket and squeeze to order.'],
    lemon: ['🍋 레몬: 편의점·마트의 생레몬을 사서 짜요. 하이볼엔 웨지 하나를 짜 넣고 껍질을 잔 위에서 비틀면 향이 확 살아요.', '🍋 Lemon: buy fresh lemons; for a highball squeeze in a wedge and twist the peel over the glass.'],
    mint: ['🌿 민트: 마트 허브 코너의 생민트.', '🌿 Mint: fresh mint from the supermarket herb shelf.'],
    jwhisky: ['🍋 하이볼 팁: 레몬 웨지 하나 짜 넣으면 훨씬 상큼해요. 잔·위스키·탄산수 모두 차갑게!', '🍋 Highball tip: squeeze in a lemon wedge; keep the glass, whisky and soda ice-cold!']
  };
  BAR.CP = { url: 'https://link.coupang.com/a/hsdzLh1vB6', note: ['이 게시물은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.', 'This page is part of the Coupang Partners program; we receive a commission from qualifying purchases.'] };
})();
