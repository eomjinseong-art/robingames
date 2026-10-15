/* 뿡뿡 올림포스 / Toot Olympus — shared myth dex, family tree & quiz (나두Ai)
   Usage: Myth.unlock(id) -> true if new; Myth.openDex(lang); Myth.quiz(lang, cb(correct)); Myth.card(id) */
(function(){
const LINK='https://nadoo-myth.vercel.app/gods/';
// id: [ko,en,abilityKo,abilityEn,symbol,familyKo,familyEn,storyKo,storyEn,slug]
const C={
kronos:['크로노스','Kronos','시간을 삼키는 티탄의 왕','King of the Titans','🌾 낫','우라노스와 가이아의 아들, 레아의 남편','Son of Ouranos & Gaia, husband of Rhea','자식들이 왕위를 빼앗을까 두려워 태어나는 족족 삼켰어요.','Fearing a child would overthrow him, he swallowed his children at birth.','kronos'],
rhea:['레아','Rhea','신들의 어머니','Mother of the gods','🦁 사자','우라노스와 가이아의 딸, 크로노스의 아내','Daughter of Ouranos & Gaia, wife of Kronos','막내 제우스 대신 돌을 포대기에 싸서 크로노스에게 삼키게 했어요.','She gave Kronos a swaddled stone to swallow instead of baby Zeus.','rhea'],
zeus:['제우스','Zeus','번개를 다루는 신들의 왕','King of the gods, wields thunder','⚡ 번개','크로노스와 레아의 막내아들, 헤라의 남편','Youngest son of Kronos & Rhea, husband of Hera','크레타 동굴에서 몰래 자라 형제들을 구하고 티탄을 물리쳤어요.','Raised in secret in a Cretan cave, he freed his siblings and defeated the Titans.','zeus'],
hera:['헤라','Hera','결혼과 가정의 여신','Goddess of marriage','🦚 공작','크로노스와 레아의 딸, 제우스의 아내','Daughter of Kronos & Rhea, wife of Zeus','올림포스의 여왕으로 공작새가 상징이에요. 제우스와 알크메네의 아들 헤라클레스를 미워해 뱀과 광기, 그리고 12과업을 보냈어요.','Queen of Olympus; the peacock is her sacred bird. She hated Heracles, son of Zeus and Alcmene, and sent snakes, madness, and the twelve labors.','hera'],
poseidon:['포세이돈','Poseidon','바다와 지진의 신','God of the sea & earthquakes','🔱 삼지창','크로노스와 레아의 아들, 제우스의 형','Son of Kronos & Rhea, brother of Zeus','삼지창으로 땅을 치면 바다가 요동치고 땅이 흔들려요.','When he strikes with his trident, seas rage and the earth shakes.','poseidon'],
hades:['하데스','Hades','저승의 왕','King of the Underworld','🐕 케르베로스','크로노스와 레아의 아들, 페르세포네의 남편','Son of Kronos & Rhea, husband of Persephone','님프들을 통해 투명 투구를 빌려 주어 페르세우스를 도왔어요.','Via the nymphs he lent the helm of invisibility to help Perseus.','hades'],
demeter:['데메테르','Demeter','곡식과 농사의 여신','Goddess of grain & harvest','🌾 이삭','크로노스와 레아의 딸, 페르세포네의 어머니','Daughter of Kronos & Rhea, mother of Persephone','딸을 잃고 슬퍼하자 세상에 겨울이 찾아왔어요.','When she grieved for her lost daughter, winter came to the world.','demeter'],
hestia:['헤스티아','Hestia','화로와 가정의 불의 여신','Goddess of the hearth','🔥 화로','크로노스와 레아의 맏딸','Eldest daughter of Kronos & Rhea','모든 제사에서 가장 먼저 제물을 받는 화롯불의 여신이에요.','Hearth goddess who received the first offering at every sacrifice.','hestia'],
athena:['아테나','Athena','지혜와 전략의 여신','Goddess of wisdom & strategy','🦉 올빼미','제우스와 메티스의 딸','Daughter of Zeus & Metis','페르세우스에게 광내 청동 방패를 주어 메두사를 비춰 보게 했어요.','She gave Perseus a polished bronze shield to view Medusa safely.','athena'],
apollo:['아폴론','Apollo','음악·예언·궁술의 신','God of music, prophecy & archery','🎵 리라','제우스와 레토의 아들, 아르테미스의 쌍둥이','Son of Zeus & Leto, twin of Artemis','델포이 신탁의 주인으로 리라를 연주해요.','Master of the Delphic oracle who plays the lyre.','apollo'],
artemis:['아르테미스','Artemis','사냥과 달의 여신','Goddess of the hunt','🏹 활','제우스와 레토의 딸, 아폴론의 쌍둥이','Daughter of Zeus & Leto, twin of Apollo','은빛 활을 들고 숲과 야생동물을 지켜요.','With her silver bow she guards forests and wild animals.','artemis'],
ares:['아레스','Ares','전쟁의 신','God of war','🛡️ 창과 방패','제우스와 헤라의 아들','Son of Zeus & Hera','거칠고 맹렬한 싸움 그 자체를 상징해요.','He embodies the fury and violence of battle.','ares'],
hephaistos:['헤파이스토스','Hephaistos','대장장이와 불의 신','God of the forge & fire','🔨 망치','헤라의 아들(제우스와 헤라의 아들이라고도 함)','Son of Hera (or of Zeus & Hera)','신들의 무기와 아킬레우스의 방패를 만들었어요.','He forged the gods\' weapons and the shield of Achilles.','hephaistos'],
hermes:['헤르메스','Hermes','전령과 여행자의 신','Messenger god of travelers','🪽 날개 신발','제우스와 마이아의 아들','Son of Zeus & Maia','페르세우스에게 날개 신발과 굽은 칼(하르페)을 도와주었어요.','He helped Perseus with winged sandals and the curved harpe sword.','hermes'],
dionysos:['디오니소스','Dionysos','포도주와 축제의 신','God of wine & festivity','🍇 포도','제우스와 세멜레의 아들, 아리아드네의 남편','Son of Zeus & Semele, husband of Ariadne','제우스의 허벅지에서 다시 태어난 "두 번 태어난 신"이에요.','The "twice-born" god, born again from Zeus\'s thigh.','dionysos'],
aphrodite:['아프로디테','Aphrodite','사랑과 아름다움의 여신','Goddess of love and beauty','🕊️ 비둘기','『오디세이아』에서는 헤파이스토스의 아내. 헤시오도스는 바다 거품에서, 호메로스는 제우스와 디오네의 딸이라고 해요','In the Odyssey, wife of Hephaistos. Hesiod says she rose from sea foam; Homer calls her daughter of Zeus and Dione','올림포스 12신에 들어요. 비둘기·장미·조개가 상징이고 키프로스와 인연이 깊어요.','One of the twelve Olympians. The dove, rose, and shell are her signs, and Cyprus is sacred to her.','aphrodite'],
persephone:['페르세포네','Persephone','저승의 여왕, 봄의 여신','Queen of the Underworld','🍎 석류','제우스와 데메테르의 딸, 하데스의 아내','Daughter of Zeus & Demeter, wife of Hades','석류 씨를 먹어 해마다 일부를 저승에서 보내야 해요.','Having eaten pomegranate seeds, she must spend part of each year below.','persephone'],
labyrinth:['라비린토스','Labyrinth','한번 들어가면 못 나오는 미궁','A maze no one could escape','🌀 미궁','다이달로스가 미노스 왕을 위해 지음','Built by Daedalus for King Minos','괴물 미노타우로스를 가두려고 크레타 크노소스에 지었어요.','Built at Knossos on Crete to imprison the Minotaur.','minotauros'],
minos:['미노스','Minos','크레타의 왕','King of Crete','👑 왕관','제우스와 에우로페의 아들, 파시파에의 남편','Son of Zeus & Europa, husband of Pasiphaë','다이달로스와 이카로스를 크레타에 가두고, 아테네에 젊은이들을 공물로 바치게 했어요.','He kept Daedalus and Icarus captive and made Athens send young people as tribute.',''],
crete:['크레타','Crete','미노스 왕국의 섬','Island kingdom of Minos','🏝️ 섬','제우스가 몰래 자란 섬','Island where baby Zeus was hidden','레아가 아기 제우스를 크레타의 동굴에 숨겨 키웠어요.','Rhea hid baby Zeus in a cave on Crete.',''],
daidalos:['다이달로스','Daedalus','천재 발명가·건축가','Genius inventor & architect','🪶 깃털 날개','아테네 출신, 이카로스의 아버지','From Athens, father of Icarus','깃털과 밀랍으로 날개를 만들어 크레타를 탈출했어요.','He built wings of feathers and wax to escape Crete.','daidalos'],
ikaros:['이카로스','Icarus','아버지가 만든 날개로 비행','Flew on his father\'s wings','☀️ 녹은 날개','다이달로스와 나우크라테의 아들','Son of Daedalus & Naukrate','"너무 높이 날지 마라"는 말을 어기고 태양에 다가갔다 떨어졌어요.','Ignoring "don\'t fly too high," he neared the sun and fell.','ikaros'],
helios:['헬리오스','Helios','태양 마차를 모는 태양신','Sun god who drives the sun chariot','🌞 태양 마차','티탄 히페리온과 테이아의 아들','Son of the Titans Hyperion & Theia','매일 네 마리 불 말이 끄는 마차로 하늘을 가로질러요.','Each day he crosses the sky in a chariot drawn by fiery horses.','helios'],
icarian:['이카리아 해','Icarian Sea','이카로스가 떨어진 바다','Sea where Icarus fell','🌊 에게해','에게해의 일부, 이카리아 섬 근처','Part of the Aegean, near Ikaria','이카로스가 떨어진 바다라서 그의 이름이 붙었어요.','Named after Icarus, who fell into it.','ikaros'],
theseus:['테세우스','Theseus','미노타우로스를 물리친 아테네의 영웅','Athenian hero who slew the Minotaur','🧶 실타래','아이게우스(또는 포세이돈)와 아이트라의 아들','Son of Aegeus (or Poseidon) & Aethra','공물로 바쳐질 젊은이들 틈에 끼어 크레타로 가서 미노타우로스를 물리쳤어요.','He sailed to Crete among the tribute youths and killed the Minotaur.','theseus'],
ariadne:['아리아드네','Ariadne','미궁을 빠져나갈 실을 준 공주','Princess who gave the thread','🧵 실','미노스와 파시파에의 딸, 디오니소스의 아내','Daughter of Minos & Pasiphaë, wife of Dionysos','테세우스에게 실타래를 줬지만 낙소스 섬에 홀로 남겨졌고, 디오니소스가 그녀를 아내로 맞았어요.','She gave Theseus the thread but was left on Naxos, where Dionysos made her his wife.','ariadne'],
minotauros:['미노타우로스','Minotaur','황소 머리를 한 미궁의 괴물','Bull-headed monster of the Labyrinth','🐂 황소 머리','파시파에와 크레타 황소의 자식, 본명 아스테리온','Child of Pasiphaë & the Cretan Bull, named Asterion','라비린토스 깊은 곳에 갇혀 아테네의 공물을 기다렸어요.','Locked deep in the Labyrinth, it awaited the Athenian tribute.','minotauros'],
pasiphae:['파시파에','Pasiphaë','크레타의 왕비','Queen of Crete','🐄 황소','헬리오스의 딸, 미노스의 아내','Daughter of Helios, wife of Minos','포세이돈이 보낸 흰 황소 때문에 미노타우로스의 어머니가 되었어요.','Because of the white bull sent by Poseidon, she became the Minotaur\'s mother.',''],
aegeus:['아이게우스','Aegeus','아테네의 왕','King of Athens','⛵ 검은 돛','테세우스의 아버지','Father of Theseus','아들이 흰 돛 대신 검은 돛을 달고 돌아오자 바다에 몸을 던졌고, 그 바다가 에게해가 되었어요.','Seeing a black sail instead of white, he threw himself into the sea, now the Aegean.',''],
tribute:['아테네의 공물','Athenian Tribute','미노타우로스에게 바친 젊은이들','Youths sent to the Minotaur','⚓ 7+7','미노스의 아들 안드로게오스의 죽음 때문','Because Minos\'s son Androgeos died in Athens','아테네는 정기적으로(흔히 9년마다) 소년 7명과 소녀 7명을 크레타에 보내야 했어요.','Athens had to send seven youths and seven maidens to Crete, often every nine years.',''],
perseus:['페르세우스','Perseus','메두사를 물리친 영웅','Hero who defeated Medusa','🛡️ 청동 방패','제우스와 다나에의 아들, 안드로메다의 남편','Son of Zeus & Danaë, husband of Andromeda','방패에 비친 메두사를 보고 물리친 뒤, 페가수스가 태어났어요.','He defeated Medusa using her reflection in a shield; Pegasus was born afterward.','perseus'],
medusa:['메두사','Medusa','보면 돌이 되는 고르곤','Gorgon whose gaze turns to stone','🐍 뱀 머리','세 고르곤 자매 중 유일하게 필멸인','The only mortal of the three Gorgon sisters','얼굴을 똑바로 보면 돌이 되지만, 방패에 비친 모습은 안전해요.','Looking at her face turns you to stone, but a reflection is safe.','medusa'],
danae:['다나에','Danaë','페르세우스의 어머니','Mother of Perseus','✨ 황금비','아르고스 왕 아크리시우스의 딸','Daughter of King Acrisius of Argos','제우스가 황금비로 찾아왔고, 예언 때문에 아들과 함께 상자에 실려 바다로 떠내려갔어요.','Zeus came as a shower of gold; because of a prophecy she and her baby were cast adrift in a chest.','danae'],
acrisius:['아크리시우스','Acrisius','아르고스의 왕','King of Argos','👑 왕관','다나에의 아버지, 페르세우스의 외할아버지','Father of Danaë, grandfather of Perseus','손자가 자기를 죽일 것이라는 예언이 두려워 다나에를 탑에 가뒀어요.','Fearing a prophecy that his grandson would kill him, he locked Danaë in a tower.',''],
graeae:['그라이아이','Graeae','눈·이빨을 하나만 나눠 쓰는 세 자매','Three sisters who share one eye and one tooth','👁️ 하나의 눈','포르키스와 케토의 딸들, 고르곤의 친척','Daughters of Phorcys & Ceto, kin to the Gorgons','페르세우스가 그 눈을 빼앗아 메두사로 가는 길을 알아냈어요.','Perseus seized their shared eye to learn the way to Medusa.',''],
polydectes:['폴리덱테스','Polydectes','세리포스의 왕','King of Seriphos','🏛️ 왕좌','세리포스 섬의 왕','King of Seriphos who desired Danaë','페르세우스를 없애려고 메두사의 머리를 가져오라고 시켰어요.','He sent Perseus to fetch Medusa\'s head, hoping the quest would kill him.',''],
pegasus:['페가수스','Pegasus','날개 달린 천마','Winged divine horse','🐴 날개','메두사가 물리쳐질 때 태어남','Sprang from Medusa when she was defeated','메두사가 물리쳐질 때 크리사오르와 함께 태어났어요.','Born with Chrysaor when Medusa was defeated.','pegasos'],
chrysaor:['크리사오르','Chrysaor','황금 칼을 든 거인','Giant with a golden sword','⚔️ 황금 칼','메두사가 물리쳐질 때 페가수스와 함께 태어남','Born with Pegasus when Medusa fell','이름 뜻은 "황금 칼"이에요.','His name means "golden sword".',''],
andromeda:['안드로메다','Andromeda','바다 괴물에게서 구출된 공주','Princess rescued from a sea monster','💎 사슬','케페우스와 카시오페이아의 딸, 페르세우스의 아내','Daughter of Cepheus & Cassiopeia, wife of Perseus','케토스에게 바쳐질 뻔했지만 페르세우스가 구해 아내가 되었어요.','Chained as a sacrifice to Cetus, she was rescued by Perseus and became his wife.','andromeda'],
seriphos:['세리포스','Seriphos','페르세우스가 자란 섬','Island where Perseus grew up','🏝️ 섬','에게해의 섬, 폴리덱테스의 왕국','Aegean island, kingdom of Polydectes','상자에 실려 온 다나에와 아기 페르세우스가 이곳에 도착했어요.','Danaë and baby Perseus washed ashore here in a chest.',''],
heracles:['헤라클레스','Heracles','곤봉과 사자 가죽의 영웅','Hero of the club and the lion skin','🦁 사자 가죽','제우스와 알크메네의 아들, 암피트리온의 집안에서 자람','Son of Zeus and Alcmene, raised in Amphitryon\'s house','헤라의 미움으로 광기에 빠졌다가, 에우리스테우스의 12과업을 마치고 신이 되었어요.','Hera\'s hatred drove him mad; he finished twelve labors for Eurystheus and became a god.','herakles'],
eurystheus:['에우리스테우스','Eurystheus','12과업을 명령한 왕','King who ordered the twelve labors','🏺 청동 항아리','페르세우스의 후손, 헤라클레스의 사촌','Descendant of Perseus and cousin of Heracles','헤라가 헤라클레스의 탄생을 늦춰 대신 왕이 되었고, 겁이 많아 청동 항아리에 숨기도 했어요.','Hera delayed Heracles\' birth so this cousin became king; he was so afraid he hid in a bronze jar.',''],
alcmena:['알크메네','Alcmene','헤라클레스의 어머니','Mother of Heracles','🌙 인간 어머니','엘렉트리온의 딸, 암피트리온의 아내','Daughter of Electryon, wife of Amphitryon','제우스가 암피트리온의 모습으로 찾아와 헤라클레스를 낳았어요.','Zeus visited her in Amphitryon\'s likeness, and she bore Heracles.',''],
amphitryon:['암피트리온','Amphitryon','헤라클레스의 인간 아버지','Mortal father of Heracles','🛡️ 창','알카이오스의 아들, 알크메네의 남편','Son of Alcaeus, husband of Alcmene','전쟁터에 나가 있는 사이 제우스가 그의 모습으로 알크메네를 찾았어요. 이피클레스의 아버지예요.','While he was away at war, Zeus visited Alcmene in his form. He is the father of Iphicles.',''],
nemean:['네메아의 사자','Nemean Lion','무기가 뚫지 못하는 가죽','A hide no weapon could pierce','🦁 황금 갈기','네메아 골짜기의 괴물 사자','Monster lion of the Nemean valley','칼도 창도 가죽을 못 뚫어, 헤라클레스가 맨손으로 목을 졸라 잡고 그 가죽을 둘렀어요.','No sword or spear could pierce it, so Heracles strangled it and wore the pelt.',''],
hydra:['레르나 히드라','Lernaean Hydra','목을 잘라도 두 개가 돋는 물뱀','Water serpent that grows two heads','🐍 여러 머리','티폰과 에키드나의 자식','Child of Typhon and Echidna','이올라오스가 잘린 목을 불로 지지고, 죽지 않는 머리는 바위 아래 묻었어요.','Iolaus seared each cut neck, and the deathless head was buried under a rock.','hydra'],
iolaus:['이올라오스','Iolaus','히드라의 목을 지진 조카','Nephew who cauterized the Hydra','🔥 횃불','이피클레스의 아들, 헤라클레스의 조카','Son of Iphicles, nephew of Heracles','헤라클레스가 목을 치는 동안 횃불로 지져 새 머리가 나지 않게 했어요.','While Heracles cut the heads, he burned the necks so they could not grow back.',''],
ceryneian:['케리네이아의 암사슴','Ceryneian Hind','황금 뿔의 신성한 사슴','Sacred deer with golden horns','🦌 황금 뿔','아르테미스에게 바쳐진 암사슴','Hind sacred to Artemis','청동 발굽과 황금 뿔을 가졌고, 헤라클레스는 일 년을 쫓아 죽이지 않고 산 채로 잡았어요.','It had bronze hooves and golden horns. Heracles chased it for a year and brought it back alive.',''],
erymanthian:['에리만토스의 멧돼지','Erymanthian Boar','눈밭의 거대한 멧돼지','Giant boar of the snow','🐗 멧돼지','에리만토스 산의 괴물 멧돼지','Monster boar of Mount Erymanthus','헤라클레스가 깊은 눈 속으로 몰아 산 채로 묶어 왔고, 에우리스테우스는 항아리에 숨었어요.','Heracles drove it into deep snow and carried it back alive. Eurystheus hid in a jar.',''],
augeas:['아우게이아스','Augeas','외양간의 왕','King of the filthy stables','🐂 소떼','헬리오스의 아들, 엘리스의 왕','Son of Helios, king of Elis','소 삼천 마리의 외양간을 삼십 년 치우지 않았고, 헤라클레스는 강물을 돌려 하루에 씻어 냈어요.','Three thousand cattle left the stables uncleaned for thirty years. Heracles washed them in one day by turning rivers.',''],
stymphalian:['스팀팔로스의 새','Stymphalian Birds','청동 부리의 식인 새','Man-eating birds with bronze beaks','🐦 청동 깃','스팀팔로스 호수에 살던 아레스의 새','Birds of Ares from Lake Stymphalia','아테나의 청동 딸랑이로 하늘을 날려 세운 뒤 화살로 쏘았어요.','Bronze clappers from Athena flushed them into the air, and Heracles shot them.',''],
cretan_bull:['크레타의 황소','Cretan Bull','포세이돈이 보낸 미친 황소','The mad bull sent by Poseidon','🐂 흰 황소','포세이돈의 황소, 미노타우로스의 아버지','Poseidon\'s bull and father of the Minotaur','헤라클레스가 산 채로 데려왔어요. 나중에 풀려나 마라톤의 황소가 되어 테세우스에게 쓰러졌어요.','Heracles brought it back alive. Later freed, it became the Marathonian Bull slain by Theseus.',''],
diomedes:['디오메데스','Diomedes','사람을 먹는 암말의 왕','King of the man-eating mares','🐴 식인 말','아레스의 아들, 트라키아 비스토네스의 왕','Son of Ares, king of the Bistones in Thrace','암말 네 마리가 사람 고기를 먹었어요. 헤라클레스가 디오메데스를 그 말에게 먹이자 잠잠해졌다고 해요.','His four mares ate human flesh. Heracles fed Diomedes to them, and they grew tame.',''],
hippolyta:['히폴리테','Hippolyta','아마존의 여왕','Queen of the Amazons','🎗️ 허리띠','아레스의 딸, 아마존 여왕','Daughter of Ares, queen of the Amazons','아레스가 준 허리띠를 가지러 갔고, 헤라가 아마존을 부추겨 싸움이 벌어졌어요.','Heracles came for the belt Ares had given her. Hera stirred the Amazons and a battle broke out.',''],
geryon:['게리온','Geryon','몸이 셋인 거인','Three-bodied giant','🐄 붉은 소','크리사오르와 칼릴로에의 아들','Son of Chrysaor and Callirrhoe','에리테이아 섬에서 쓰러지고, 그의 붉은 소 떼는 그리스까지 몰려 왔어요.','He fell on the island of Erytheia, and his red cattle were driven all the way to Greece.',''],
hesperides:['헤스페리데스','Hesperides','황금사과를 지키는 님프','Nymphs who guard the golden apples','🍎 황금사과','서쪽 저녁의 님프, 헤라의 사과 정원','Nymphs of the evening, keepers of Hera\'s garden','헤라의 결혼 선물인 황금사과를 용 라돈과 함께 지켰어요.','They guarded the golden apples, a wedding gift for Hera, together with the dragon Ladon.',''],
atlas:['아틀라스','Atlas','하늘을 떠받치는 티탄','Titan who holds up the sky','🌌 하늘','이아페토스의 아들, 헤스페리데스의 아버지로도 전함','Son of Iapetus, sometimes called father of the Hesperides','헤라클레스가 하늘을 대신 지고 사과를 가져오게 한 뒤, 꾀로 다시 하늘을 떠넘겼어요.','Heracles held the sky so Atlas would fetch the apples, then tricked him into taking the sky back.','atlas'],
cerberus:['케르베로스','Cerberus','저승을 지키는 세 머리 개','Three-headed hound of the Underworld','🐕 세 머리','티폰과 에키드나의 자식','Child of Typhon and Echidna','하데스의 허락을 받아 무기 없이 끌어올려 보인 뒤, 다시 저승으로 돌려보냈어요.','With Hades\' permission Heracles dragged him up without weapons, then brought him back.','kerberos'],
labors:['12과업','Twelve Labors','죄를 씻는 열두 가지 임무','Twelve tasks of penance','📜 열두 과업','에우리스테우스가 헤라의 뜻으로 명령','Ordered by Eurystheus at Hera\'s will','델포이 신탁대로 티린스의 왕을 섬기며 해냈어요. 도움이나 보수가 있던 일은 인정되지 않기도 했어요.','An oracle at Delphi sent him to serve the king of Tiryns. Tasks done with help or for pay were sometimes disallowed.','']
};
const TREE=[['kronos','rhea'],['hestia','demeter','hera','hades','poseidon','zeus'],['athena','apollo','artemis','ares','aphrodite','hephaistos','hermes','dionysos','persephone','danae'],['perseus','andromeda','heracles']];
const OLY12=['zeus','hera','poseidon','demeter','athena','apollo','artemis','ares','aphrodite','hephaistos','hermes','dionysos'];
const Q=[
['이카로스의 아버지는?','Icarus\'s father?',['다이달로스','미노스','헬리오스'],['Daedalus','Minos','Helios'],0],
['이카로스의 날개를 녹인 것은?','What melted Icarus\'s wings?',['태양','번개','파도'],['The sun','Lightning','Waves'],0],
['라비린토스에 갇힌 괴물은?','Monster kept in the Labyrinth?',['미노타우로스','메두사','케르베로스'],['Minotaur','Medusa','Kerberos'],0],
['크레타의 왕은?','King of Crete?',['미노스','테세우스','오디세우스'],['Minos','Theseus','Odysseus'],0],
['포세이돈의 무기는?','Poseidon\'s weapon?',['삼지창','번개','활'],['Trident','Thunderbolt','Bow'],0],
['제우스의 부모는?','Zeus\'s parents?',['크로노스와 레아','우라노스와 가이아','히페리온과 테이아'],['Kronos & Rhea','Ouranos & Gaia','Hyperion & Theia'],0],
['이카로스의 날개는 무엇으로 붙였나?','What held Icarus\'s feathers?',['밀랍','실','쇠못'],['Wax','Thread','Iron nails'],0],
['헬리오스는 무엇을 몰고 다니나?','What does Helios drive?',['태양 마차','배','구름'],['Sun chariot','A ship','A cloud'],0],
['아기 제우스가 숨어 자란 섬은?','Island where baby Zeus hid?',['크레타','로도스','시칠리아'],['Crete','Rhodes','Sicily'],0],
['저승을 다스리는 신은?','Who rules the Underworld?',['하데스','아레스','헤르메스'],['Hades','Ares','Hermes'],0],
['아테나는 누구의 머리에서 태어났나?','Athena sprang from whose head?',['제우스','크로노스','포세이돈'],['Zeus','Kronos','Poseidon'],0],
['이카로스가 떨어진 바다 이름은?','Sea named after Icarus?',['이카리아 해','흑해','홍해'],['Icarian Sea','Black Sea','Red Sea'],0],
['테세우스에게 실타래를 준 공주는?','Who gave Theseus the thread?',['아리아드네','메두사','페르세포네'],['Ariadne','Medusa','Persephone'],0],
['아리아드네의 아버지는?','Ariadne\'s father?',['미노스','아이게우스','다이달로스'],['Minos','Aegeus','Daedalus'],0],
['테세우스의 아버지(아테네 왕)는?','Theseus\'s father, king of Athens?',['아이게우스','미노스','크로노스'],['Aegeus','Minos','Kronos'],0],
['미노타우로스의 머리는 어떤 동물?','The Minotaur has the head of a…?',['황소','사자','독수리'],['Bull','Lion','Eagle'],0],
['미노타우로스의 어머니는?','Mother of the Minotaur?',['파시파에','아리아드네','헤라'],['Pasiphaë','Ariadne','Hera'],0],
['아리아드네와 결혼한 신은?','Which god married Ariadne?',['디오니소스','아폴론','헤르메스'],['Dionysos','Apollo','Hermes'],0],
['아테네는 크레타에 소년·소녀를 몇 명씩 보냈나?','Athens sent how many youths & maidens each?',['7명씩','3명씩','12명씩'],['Seven each','Three each','Twelve each'],0],
['아이게우스의 이름이 붙은 바다는?','Sea named after Aegeus?',['에게해','이카리아 해','흑해'],['Aegean Sea','Icarian Sea','Black Sea'],0],
['테세우스가 돌아올 때 바꾸지 않은 돛의 색은?','Theseus forgot to change his sail from…?',['검은색','빨간색','초록색'],['Black','Red','Green'],0],
['아리아드네가 홀로 남겨진 섬은?','Island where Ariadne was left?',['낙소스','크레타','로도스'],['Naxos','Crete','Rhodes'],0],
['라비린토스를 지은 사람은?','Who built the Labyrinth?',['다이달로스','테세우스','미노스'],['Daedalus','Theseus','Minos'],0],
['파시파에의 아버지인 태양신은?','Pasiphaë\'s father, the sun god?',['헬리오스','아레스','포세이돈'],['Helios','Ares','Poseidon'],0],
['페르세우스의 어머니는?','Perseus\'s mother?',['다나에','메두사','아테나'],['Danaë','Medusa','Athena'],0],
['제우스는 다나에에게 어떤 모습으로 왔나?','How did Zeus come to Danaë?',['황금비','황소','백조'],['A shower of gold','A bull','A swan'],0],
['메두사의 시선을 피하려고 쓴 것은?','What did Perseus use to avoid Medusa\'s gaze?',['청동 방패','거울 호수','구름'],['A bronze shield','A mirror lake','A cloud'],0],
['날개 신발을 준 신은?','Who gave the winged sandals?',['헤르메스','아레스','아폴론'],['Hermes','Ares','Apollo'],0],
['투명 투구를 빌려 준 신은?','Who lent the helm of invisibility?',['하데스','포세이돈','헤파이스토스'],['Hades','Poseidon','Hephaistos'],0],
['세 고르곤 중 필멸인(죽을 수 있는)은?','Which Gorgon was mortal?',['메두사','스텐노','에우리알레'],['Medusa','Stheno','Euryale'],0],
['메두사를 물리친 뒤 태어난 천마는?','Winged horse born after Medusa fell?',['페가수스','케르베로스','키마이라'],['Pegasus','Kerberos','Chimera'],0],
['페르세우스가 구한 공주는?','Princess Perseus rescued?',['안드로메다','아리아드네','페르세포네'],['Andromeda','Ariadne','Persephone'],0],
['메두사 머리를 가져오라 한 왕은?','King who sent Perseus for Medusa\'s head?',['폴리덱테스','미노스','아크리시우스'],['Polydectes','Minos','Acrisius'],0],
['그라이아이는 무엇을 나눠 썼나?','What did the Graeae share?',['눈과 이빨 하나','왕관','방패'],['One eye and one tooth','A crown','A shield'],0],
['방패를 준 여신은?','Goddess who gave the polished shield?',['아테나','헤라','아르테미스'],['Athena','Hera','Artemis'],0],
['다나에와 아기가 도착한 섬은?','Island where Danaë and the baby landed?',['세리포스','크레타','낙소스'],['Seriphos','Crete','Naxos'],0],
['아크리시우스가 다나에를 가둔 이유는?','Why did Acrisius lock Danaë away?',['손자 예언 때문에','전쟁이 나서','보물을 숨기려고'],['Because of a grandson prophecy','Because of war','To hide treasure'],0],
['헤라클레스의 어머니는?','Mother of Heracles?',['알크메네','헤라','메두사'],['Alcmene','Hera','Medusa'],0],
['헤라클레스의 신인 아버지는?','Divine father of Heracles?',['제우스','암피트리온','포세이돈'],['Zeus','Amphitryon','Poseidon'],0],
['알크메네의 남편, 인간 쪽 아버지는?','Mortal father in Heracles\' house?',['암피트리온','에우리스테우스','미노스'],['Amphitryon','Eurystheus','Minos'],0],
['12과업을 명령한 왕은?','King who ordered the twelve labors?',['에우리스테우스','미노스','폴리덱테스'],['Eurystheus','Minos','Polydectes'],0],
['헤라가 헤라클레스를 미워한 까닭은?','Why did Hera hate Heracles?',['제우스의 아들이라서','바다를 훔쳐서','사과를 먹어서'],['He was a son of Zeus','He stole the sea','He ate her apples'],0],
['에우리스테우스가 왕이 된 이유는?','Why did Eurystheus become king?',['헤라가 출산을 늦춰서','선거에서 이겨서','바다를 다스려서'],['Hera delayed a birth','He won a vote','He ruled the sea'],0],
['네메아의 사자를 어떻게 이겼나?','How was the Nemean Lion defeated?',['목을 졸라 잡음','불에 태움','노래로 재움'],['Strangled','Burned','Sung to sleep'],0],
['첫 과업 뒤에 헤라클레스가 두른 것은?','What did Heracles wear after the first labor?',['사자 가죽','공작 망토','물고기 비늘'],['The lion skin','A peacock cloak','Fish scales'],0],
['히드라의 목이 다시 안 자라게 한 방법은?','What stopped Hydra heads from regrowing?',['불로 지짐','소금을 뿌림','자장가를 부름'],['Fire on the neck','Salt','A lullaby'],0],
['히드라의 목을 지진 조카는?','Who cauterized the Hydra necks?',['이올라오스','테세우스','페르세우스'],['Iolaus','Theseus','Perseus'],0],
['케리네이아의 암사슴은 누구의 신성한 동물?','The Ceryneian Hind is sacred to whom?',['아르테미스','아레스','디오니소스'],['Artemis','Ares','Dionysos'],0],
['에리만토스 멧돼지는 어떻게 잡았나?','How was the Erymanthian Boar taken?',['살아서 묶어 옴','불에 태움','바다에 버림'],['Brought back alive','Burned','Thrown into the sea'],0],
['아우게이아스 외양간을 깨끗이 한 방법은?','How were the Augean stables cleaned?',['강물을 돌림','거대한 빗자루','불을 지름'],['Rivers were diverted','A giant broom','They were burned'],0],
['스팀팔로스 새를 날려 세운 도구는?','What flushed the Stymphalian birds?',['청동 딸랑이','하프','번개'],['Bronze clappers','A harp','Thunder'],0],
['크레타 황소는 누구의 아버지로도 알려졌나?','The Cretan Bull is also the father of?',['미노타우로스','페가수스','케르베로스'],['The Minotaur','Pegasus','Cerberus'],0],
['디오메데스의 암말은 무엇을 먹었나?','What did the mares of Diomedes eat?',['사람 고기','황금사과','꿀'],['Human flesh','Golden apples','Honey'],0],
['히폴리테에게서 가져온 것은?','What did Heracles take from Hippolyta?',['허리띠','왕관','방패'],['A belt','A crown','A shield'],0],
['게리온의 몸은 몇 개인가?','How many bodies does Geryon have?',['셋','하나','열둘'],['Three','One','Twelve'],0],
['황금사과를 따 오는 동안 하늘을 진 티탄은?','Which Titan held the sky for the golden apples?',['아틀라스','크로노스','프로메테우스'],['Atlas','Kronos','Prometheus'],0],
['헤스페리데스의 황금사과는 누구의 것?','Whose were the golden apples of the Hesperides?',['헤라','아테나','데메테르'],['Hera','Athena','Demeter'],0],
['케르베로스를 데려올 때 쓰지 않은 것은?','What did Heracles not use on Cerberus?',['무기','힘','하데스의 허락'],['Weapons','Strength','Hades\' permission'],0],
['케르베로스의 머리는 흔히 몇 개?','How many heads does Cerberus usually have?',['셋','하나','아홉'],['Three','One','Nine'],0],
['12과업의 첫 번째는?','First of the twelve labors?',['네메아의 사자','케르베로스','히드라'],['Nemean Lion','Cerberus','Hydra'],0],
['12과업의 마지막은?','Last of the twelve labors?',['케르베로스','네메아의 사자','아우게이아스 외양간'],['Cerberus','Nemean Lion','Augean stables'],0],
['제우스의 상징은?','What is Zeus\'s symbol?',['번개','삼지창','활'],['Lightning','Trident','Bow'],0],
['아테나의 새는?','Athena\'s bird?',['올빼미','공작','비둘기'],['Owl','Peacock','Dove'],0],
['헤라의 새는?','Hera\'s bird?',['공작','올빼미','독수리'],['Peacock','Owl','Eagle'],0],
['제우스의 아내는?','Who is Zeus\'s wife?',['헤라','아테나','아르테미스'],['Hera','Athena','Artemis'],0],
['아폴론의 쌍둥이 자매는?','Apollo\'s twin sister?',['아르테미스','아테나','헤스티아'],['Artemis','Athena','Hestia'],0],
['하데스의 아내는?','Who is Hades\'s wife?',['페르세포네','헤라','아프로디테'],['Persephone','Hera','Aphrodite'],0],
['크로노스의 아내는?','Who is Kronos\'s wife?',['레아','가이아','헤라'],['Rhea','Gaia','Hera'],0],
['사랑과 아름다움의 여신은?','Goddess of love and beauty?',['아프로디테','아테나','헤스티아'],['Aphrodite','Athena','Hestia'],0],
['『오디세이아』에서 아프로디테의 남편은?','In the Odyssey, Aphrodite\'s husband is?',['헤파이스토스','아폴론','헤르메스'],['Hephaistos','Apollo','Hermes'],0],
['헤시오도스에서 아프로디테가 태어난 곳은?','In Hesiod, Aphrodite is born from?',['바다 거품','제우스의 머리','제우스의 허벅지'],['Sea foam','Zeus\'s head','Zeus\'s thigh'],0],
['제우스의 머리에서 태어난 여신은?','Which goddess was born from Zeus\'s head?',['아테나','아르테미스','아프로디테'],['Athena','Artemis','Aphrodite'],0],
['디오니소스가 다시 태어난 곳은?','Dionysos was born again from?',['제우스의 허벅지','바다 거품','헤라의 왕관'],['Zeus\'s thigh','Sea foam','Hera\'s crown'],0],
['헤르메스의 어머니는?','Hermes\'s mother?',['마이아','헤라','레토'],['Maia','Hera','Leto'],0],
['아폴론과 아르테미스의 어머니는?','Mother of Apollo and Artemis?',['레토','헤라','데메테르'],['Leto','Hera','Demeter'],0],
['헤파이스토스의 상징은?','Hephaistos\'s symbol?',['망치','리라','삼지창'],['Hammer','Lyre','Trident'],0],
['헤르메스의 신발은?','Hermes\'s famous shoes?',['날개 신발','쇠 부츠','나무 나막신'],['Winged sandals','Iron boots','Wooden clogs'],0],
['헤스티아 대신 12신에 자주 넣는 신은?','Who often takes Hestia\'s seat among the twelve?',['디오니소스','하데스','페르세우스'],['Dionysos','Hades','Perseus'],0],
['저승의 왕이라 12신 명단에 보통 없는 신은?','Underworld king usually left off the twelve?',['하데스','아레스','포세이돈'],['Hades','Ares','Poseidon'],0],
['데메테르의 딸은?','Demeter\'s daughter?',['페르세포네','아테나','헤라'],['Persephone','Athena','Hera'],0],
['아레스의 부모로 많이 나오는 둘은?','Ares is usually the son of?',['제우스와 헤라','크로노스와 레아','제우스와 레토'],['Zeus and Hera','Kronos and Rhea','Zeus and Leto'],0],
['대장장이의 신은?','God of the forge?',['헤파이스토스','헤르메스','아레스'],['Hephaistos','Hermes','Ares'],0],
['포도주와 축제의 신은?','God of wine and festivity?',['디오니소스','아폴론','포세이돈'],['Dionysos','Apollo','Poseidon'],0],
['올림포스 12신의 바다의 신은?','Sea god among the twelve Olympians?',['포세이돈','하데스','헬리오스'],['Poseidon','Hades','Helios'],0],
['크로노스와 레아의 막내아들은?','Youngest son of Kronos and Rhea?',['제우스','하데스','아레스'],['Zeus','Hades','Ares'],0],
['화로와 가정의 불의 여신은?','Goddess of the hearth?',['헤스티아','헤라','데메테르'],['Hestia','Hera','Demeter'],0]
];
const K='olympusDex';
const get=()=>{try{return JSON.parse(localStorage[K]||'[]')}catch(e){return[]}};
function unlock(id){const d=get();if(!C[id]||d.includes(id))return false;d.push(id);localStorage[K]=JSON.stringify(d);return true}
function card(id,lang){const c=C[id],e=lang=='en';return c&&{id,name:e?c[1]:c[0],ability:e?c[3]:c[2],symbol:c[4],family:e?c[6]:c[5],story:e?c[8]:c[7],link:c[9]?LINK+c[9]:''}}
const css=`.myo{position:fixed;inset:0;z-index:50;background:#0b1030f7;color:#fff;overflow:auto;font-family:inherit;padding:60px 14px 40px;-webkit-user-select:none}
.myo h2{text-align:center;color:#ffd76f;margin:8px 0}.myo .x{position:fixed;top:12px;right:12px;width:42px;height:42px;border-radius:14px;border:2px solid #ffd76f;background:#1b1d4a;color:#fff;font-size:20px}
.myg{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;max-width:760px;margin:auto}
.myc{background:linear-gradient(160deg,#2a2f7a,#171a45);border:2px solid #ffd76f88;border-radius:14px;padding:10px;font-size:12px;line-height:1.4}.myc b{font-size:15px;color:#ffe9a8}.myc.l{opacity:.35;text-align:center;font-size:28px}
.myc a{color:#8fd8ff}.myt{max-width:760px;margin:10px auto;text-align:center}.myt div{display:flex;flex-wrap:wrap;justify-content:center;gap:5px;margin:4px 0}
.myt span{padding:4px 8px;border-radius:10px;background:#2a2f7a;border:1px solid #ffd76f88;font-size:12px}.myt span.l{opacity:.35}.myt i{display:block;font-style:normal;opacity:.6}
.myq{position:fixed;inset:0;z-index:40;display:flex;align-items:center;justify-content:center;background:#0008}.myq .b{background:#1b1d4a;border:3px solid #ffd76f;border-radius:18px;padding:16px;width:min(92vw,360px);text-align:center}
.myq button{display:block;width:100%;margin:7px 0;padding:11px;border-radius:12px;border:2px solid #ffd76f88;background:#2a2f7a;color:#fff;font:inherit;font-size:16px}.myq button:disabled{opacity:1;color:#fff}`;
function style(){if(!document.getElementById('myocss')){const s=document.createElement('style');s.id='myocss';s.textContent=css;document.head.appendChild(s)}}
function openDex(lang){style();const e=lang=='en',d=get(),o=document.createElement('div');o.className='myo';
const stop=ev=>ev.stopPropagation();o.addEventListener('pointerdown',stop);
let h=`<button class="x">✕</button><h2>🏛️ ${e?'Olympus Myth Dex':'올림포스 신화 도감'} ${d.length}/${Object.keys(C).length}</h2>`;
h+=`<div class="myt"><b>${e?'Olympus Family Tree':'올림포스 가계도'}</b>`+TREE.map((r,i)=>`<div>${r.map(id=>{const c=card(id,lang);return d.includes(id)?`<span>${c.symbol.split(' ')[0]} ${c.name}</span>`:'<span class="l">❔</span>'}).join('')}</div>${i<TREE.length-1?'<i>↓</i>':''}`).join('')+'</div><div class="myg">';
for(const id in C){if(d.includes(id)){const c=card(id,lang);h+=`<div class="myc"><b>${c.symbol.split(' ')[0]} ${c.name}</b><br>✨ ${c.ability}<br>🔖 ${c.symbol}<br>👪 ${c.family}<br>📜 ${c.story}${c.link?`<br><a href="${c.link}" target="_blank" rel="noopener">${e?'More at 나두신화 →':'나두신화에서 더 보기 →'}</a>`:''}</div>`}else h+='<div class="myc l">❔</div>'}
o.innerHTML=h+'</div>';o.querySelector('.x').onclick=()=>o.remove();document.body.appendChild(o)}
function quiz(lang,cb){style();const e=lang=='en',q=Q[Math.random()*Q.length|0],ord=[0,1,2].sort(()=>Math.random()-.5),A=e?q[3]:q[2],o=document.createElement('div');o.className='myq';
o.innerHTML=`<div class="b"><b>⚡ ${e?'Myth quiz!':'신화 퀴즈!'}</b><p style="margin:8px 0;font-size:17px">${e?q[1]:q[0]}</p>${ord.map((i,n)=>`<button data-i="${i}">${n+1}. ${A[i]}</button>`).join('')}<div class="fb" style="min-height:22px;margin-top:6px;font-weight:bold"></div></div>`;
let done=false,closed=false,tm=0;
const close=()=>{if(closed)return;closed=true;clearTimeout(tm);removeEventListener('keydown',kd,true);o.remove();cb(done)};
const pick=i=>{if(o.dataset.a)return;o.dataset.a=1;const ok=i===q[4];done=ok;const bs=o.querySelectorAll('button');bs.forEach(x=>x.disabled=true);
const ch=o.querySelector(`[data-i="${i}"]`),cr=o.querySelector(`[data-i="${q[4]}"]`),fb=o.querySelector('.fb');
if(ok){ch.style.background='#2a9d5c';ch.style.borderColor='#7f7';fb.style.color='#7f7';fb.textContent=e?'⭕ Correct!':'⭕ 정답!'}
else{ch.style.background='#b23a48';ch.style.borderColor='#f88';cr.style.background='#2a9d5c';cr.style.borderColor='#7f7';fb.style.color='#fbb';fb.innerHTML=(e?'❌ Wrong! Answer: ':'❌ 땡! 정답: ')+A[q[4]]}
tm=setTimeout(close,1200)};
const stop=ev=>{ev.stopPropagation();if(ev.cancelable&&ev.type!='click')ev.preventDefault()};
['pointerdown','pointerup','touchstart','touchend','mousedown','mouseup','click'].forEach(t=>o.addEventListener(t,stop,{passive:false}));
o.addEventListener('pointerup',ev=>{if(o.dataset.a){close();return}const b=ev.target.closest('button');if(b)pick(+b.dataset.i)});
const kd=ev=>{ev.stopPropagation();ev.stopImmediatePropagation();ev.preventDefault();if(ev.repeat)return;const n=+ev.key;if(!o.dataset.a&&n>=1&&n<=ord.length)pick(ord[n-1]);else if(o.dataset.a&&(ev.key=='Enter'||ev.key==' '))close()};
addEventListener('keydown',kd,true);document.body.appendChild(o)}
function quizOpen(){return !!document.querySelector('.myq')}
window.Myth={C,TREE,OLY12,Q,get,unlock,card,openDex,quiz,quizOpen,LINK};
})();
