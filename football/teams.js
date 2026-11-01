/* Nadoo Touchdown 101 — Teams & Players (2026 season). Data verified 2026-11-01 (KST). */
'use strict';
window.FB_TEAMS = (function () {
  var POS = {
    QB: ['QB 쿼터백: 공격 사령관, 패스를 던지는 사람', 'QB Quarterback: the offense’s leader who throws the passes'],
    RB: ['RB 러닝백: 공을 받아 들고 직접 달리는 사람', 'RB Running back: takes the handoff and runs with the ball'],
    WR: ['WR 와이드 리시버: 멀리 뛰어가 패스를 받는 사람', 'WR Wide receiver: runs downfield to catch passes'],
    TE: ['TE 타이트 엔드: 막기도 하고 패스도 받는 만능 선수', 'TE Tight end: blocks AND catches — a do-it-all player'],
    OL: ['OL 공격 라인: 쿼터백을 지키는 덩치 큰 방패', 'OL Offensive line: big bodyguards who protect the QB'],
    DL: ['DL 수비 라인: 맨 앞에서 밀고 들어가는 힘센 수비수', 'DL Defensive line: strong front-row defenders who push forward'],
    EDGE: ['EDGE 패스 러셔: 바깥에서 달려들어 쿼터백을 잡는 사람', 'EDGE Pass rusher: charges from the outside to sack the QB'],
    LB: ['LB 라인배커: 수비 중간에서 달리는 선수를 막는 사람', 'LB Linebacker: the middle defender who stops runners'],
    CB: ['CB 코너백: 리시버를 따라붙어 패스를 막는 사람', 'CB Cornerback: shadows receivers to block passes'],
    S: ['S 세이프티: 맨 뒤를 지키는 마지막 수비수', 'S Safety: the last line of defense at the back'],
    K: ['K 키커: 발로 차서 3점(필드골)을 얻는 사람', 'K Kicker: kicks field goals for 3 points']
  };
  // [abbr, nameEN, nameKO, cityKO, cityEN, conf, div, W, L, T, traitKO, traitEN, players[[ko,en,pos,featKO,featEN]]]
  var T = [
    ['BUF','Buffalo Bills','버펄로 빌스','버펄로 (뉴욕주)','Buffalo, NY','AFC','East',5,1,0,'눈 오는 추운 도시, 열정적인 팬과 강한 쿼터백의 팀','Snowy city, passionate fans and a star QB',[
      ['조시 앨런','Josh Allen','QB','덩치가 크고 직접 달리기도 하는 힘센 쿼터백','Big, strong QB who also runs the ball himself'],
      ['제임스 쿡','James Cook III','RB','빠른 발로 빈틈을 파고드는 러닝백','Quick runner who slips through gaps'],
      ['DJ 무어','DJ Moore','WR','공을 잡은 뒤 잘 달리는 믿음직한 리시버','Reliable receiver who gains yards after the catch'],
      ['그레그 루소','Greg Rousseau','EDGE','긴 팔로 쿼터백을 압박하는 수비수','Long-armed rusher who pressures QBs']]],
    ['NE','New England Patriots','뉴잉글랜드 패트리어츠','보스턴 근교 (매사추세츠주)','Foxborough, MA','AFC','East',4,3,0,'우승을 여러 번 한 명문, 젊은 쿼터백과 재건 중','A historic winner rebuilding around a young QB',[
      ['드레이크 메이','Drake Maye','QB','젊고 팔 힘이 좋은 미래의 에이스 쿼터백','Young QB with a strong arm — the future star'],
      ['A.J. 브라운','A.J. Brown','WR','몸싸움에 강한 힘센 에이스 리시버','Physical, powerful No. 1 receiver'],
      ['크리스천 곤잘레스','Christian Gonzalez','CB','상대 에이스 리시버를 꽁꽁 묶는 코너백','Cornerback who locks down top receivers'],
      ['헌터 헨리','Hunter Henry','TE','중요한 순간에 패스를 잘 받는 베테랑','Veteran who catches clutch passes']]],
    ['NYJ','New York Jets','뉴욕 제츠','뉴욕 (경기장은 뉴저지)','New York (plays in NJ)','AFC','East',2,5,0,'큰 도시의 팀, 수비와 젊은 공격수가 강점','Big-city team built on defense and young playmakers',[
      ['지노 스미스','Geno Smith','QB','경험 많은 베테랑 쿼터백','Experienced veteran QB'],
      ['개릿 윌슨','Garrett Wilson','WR','몸놀림이 유연해 수비를 잘 따돌리는 리시버','Smooth route-runner who shakes defenders'],
      ['브리스 홀','Breece Hall','RB','한 번 뚫리면 멀리 달려가는 폭발적인 러닝백','Explosive runner who breaks long runs'],
      ['민카 피츠패트릭','Minkah Fitzpatrick','S','공을 가로채는 감각이 좋은 세이프티','Safety with a nose for interceptions']]],
    ['MIA','Miami Dolphins','마이애미 돌핀스','마이애미 (플로리다주)','Miami, FL','AFC','East',1,5,0,'더운 바닷가 도시, 빠른 스피드 축구로 유명','Hot beach city known for speedy football',[
      ['말릭 윌리스','Malik Willis','QB','달리기가 빠른 새 주전 쿼터백','New starting QB who can run fast'],
      ['조딘 브룩스','Jordyn Brooks','LB','태클을 많이 하는 부지런한 라인배커','Busy linebacker who makes lots of tackles'],
      ['잭 실러','Zach Sieler','DL','앞줄에서 꾸준히 힘을 쓰는 수비수','Steady, hard-working front-line defender'],
      ['찹 로빈슨','Chop Robinson','EDGE','출발이 빠른 젊은 패스 러셔','Young rusher with a lightning-fast first step']]],
    ['PIT','Pittsburgh Steelers','피츠버그 스틸러스','피츠버그 (펜실베이니아주)','Pittsburgh, PA','AFC','North',5,2,0,'철강 도시, 거칠고 강한 수비의 전통','Steel city with a tough-defense tradition',[
      ['애런 로저스','Aaron Rodgers','QB','정확한 패스로 유명한 노장 쿼터백','Veteran QB famous for pinpoint passes'],
      ['T.J. 와트','T.J. Watt','EDGE','쿼터백 색(sack)을 밥 먹듯 하는 수비 스타','Star rusher who sacks QBs again and again'],
      ['DK 멧캐프','DK Metcalf','WR','근육질 몸과 스피드를 가진 리시버','Muscular receiver with big speed'],
      ['캠 헤이워드','Cameron Heyward','DL','오랫동안 팀을 이끈 수비 리더','Longtime leader of the defense']]],
    ['CLE','Cleveland Browns','클리블랜드 브라운스','클리블랜드 (오하이오주)','Cleveland, OH','AFC','North',5,2,0,'열성 팬의 팀, 강한 수비 라인이 무기','Loyal fans and a powerful defensive front',[
      ['디숀 왓슨','Deshaun Watson','QB','다시 주전으로 돌아온 쿼터백','QB back in the starting role'],
      ['제러드 버스','Jared Verse','EDGE','힘으로 밀어붙이는 패스 러셔','Power rusher who bulldozes blockers'],
      ['데니절 워드','Denzel Ward','CB','패스를 잘 쳐내는 코너백','Cornerback who knocks passes away'],
      ['퀸숀 저킨스','Quinshon Judkins','RB','힘 있게 밀고 나가는 러닝백','Powerful downhill runner']]],
    ['CIN','Cincinnati Bengals','신시내티 벵골스','신시내티 (오하이오주)','Cincinnati, OH','AFC','North',4,2,0,'호랑이 줄무늬 헬멧, 화려한 패스 공격','Tiger-stripe helmets and a flashy passing attack',[
      ['조 버로','Joe Burrow','QB','침착하고 정확한 패스의 쿼터백','Calm, accurate passer'],
      ["자마 체이스","Ja'Marr Chase",'WR','리그 최고급 스피드와 손을 가진 리시버','One of the league’s most dangerous receivers'],
      ['티 히긴스','Tee Higgins','WR','키가 커서 높은 공을 잘 잡는 리시버','Tall receiver who wins jump balls'],
      ['덱스터 로런스','Dexter Lawrence II','DL','엄청난 덩치로 가운데를 막는 수비수','Huge defender who clogs the middle']]],
    ['BAL','Baltimore Ravens','볼티모어 레이븐스','볼티모어 (메릴랜드주)','Baltimore, MD','AFC','North',4,3,0,'까마귀 팀, 달리는 공격과 단단한 수비','Ravens — a running offense and tough defense',[
      ['라마 잭슨','Lamar Jackson','QB','러닝백처럼 빠르게 달리는 쿼터백','QB who runs like a running back'],
      ['데릭 헨리','Derrick Henry','RB','거대한 몸으로 수비를 끌고 가는 러닝백','Giant runner who drags defenders'],
      ['로콴 스미스','Roquan Smith','LB','수비의 두뇌 역할을 하는 라인배커','Linebacker who is the brain of the defense'],
      ['카일 해밀턴','Kyle Hamilton','S','어디서든 뛸 수 있는 만능 수비수','Do-it-all defender who plays anywhere']]],
    ['JAX','Jacksonville Jaguars','잭슨빌 재규어스','잭슨빌 (플로리다주)','Jacksonville, FL','AFC','South',4,2,0,'재규어 팀, 젊은 재능이 많은 팀','Jaguars — a team full of young talent',[
      ['트레버 로런스','Trevor Lawrence','QB','키가 크고 팔이 강한 쿼터백','Tall QB with a strong arm'],
      ['트래비스 헌터','Travis Hunter','CB','공격·수비 양쪽을 다 하는 특별한 선수','Rare two-way player on offense and defense'],
      ['조시 하인스-앨런','Josh Hines-Allen','EDGE','쿼터백을 쫓는 베테랑 러셔','Veteran QB-chaser'],
      ['트래본 워커','Travon Walker','EDGE','큰 키와 스피드를 가진 수비수','Tall, fast defender']]],
    ['HOU','Houston Texans','휴스턴 텍산스','휴스턴 (텍사스주)','Houston, TX','AFC','South',2,5,0,'카우보이의 땅, 강한 패스 러시 수비','Texas team with a fierce pass rush',[
      ['C.J. 스트라우드','C.J. Stroud','QB','멀리 정확히 던지는 젊은 쿼터백','Young QB with deep accuracy'],
      ['니코 콜린스','Nico Collins','WR','크고 손이 좋은 에이스 리시버','Big receiver with great hands'],
      ['윌 앤더슨 주니어','Will Anderson Jr.','EDGE','에너지 넘치는 젊은 패스 러셔','High-energy young pass rusher'],
      ['데릭 스팅리 주니어','Derek Stingley Jr.','CB','리시버를 꽁꽁 묶는 코너백','Lockdown cornerback']]],
    ['IND','Indianapolis Colts','인디애나폴리스 콜츠','인디애나폴리스 (인디애나주)','Indianapolis, IN','AFC','South',2,5,0,'말발굽 로고, 달리는 공격이 중심','Horseshoe logo, built around the run game',[
      ['대니얼 존스','Daniel Jones','QB','달리기도 하는 베테랑 쿼터백','Veteran QB who can scramble'],
      ['조너선 테일러','Jonathan Taylor','RB','빠르고 힘센 에이스 러닝백','Fast and strong star runner'],
      ['타일러 워런','Tyler Warren','TE','패스를 잘 받는 젊은 타이트 엔드','Young tight end who catches a lot'],
      ['소스 가드너','Sauce Gardner','CB','긴 팔로 패스를 막는 코너백','Long-armed shutdown corner']]],
    ['TEN','Tennessee Titans','테네시 타이탄스','내슈빌 (테네시주)','Nashville, TN','AFC','South',1,6,0,'음악의 도시, 젊은 쿼터백과 재건 중','Music City team rebuilding with a young QB',[
      ['캠 워드','Cam Ward','QB','창의적인 플레이를 하는 2년차 쿼터백','Creative second-year QB'],
      ['토니 폴라드','Tony Pollard','RB','빠르고 날렵한 러닝백','Quick, shifty runner'],
      ['완데일 로빈슨','Wan\'Dale Robinson','WR','짧은 패스를 잘 받는 날쌘 리시버','Quick slot receiver for short passes'],
      ['카넬 테이트','Carnell Tate','WR','새로 합류한 젊은 리시버','Young newcomer at receiver']]],
    ['KC','Kansas City Chiefs','캔자스시티 치프스','캔자스시티 (미주리주)','Kansas City, MO','AFC','West',5,1,0,'최근 슈퍼볼 단골, 마법 같은 쿼터백의 팀','Recent Super Bowl regulars with a magical QB',[
      ['패트릭 마홈스','Patrick Mahomes','QB','어떤 자세에서도 패스를 던지는 천재 쿼터백','Genius QB who throws from any angle'],
      ['트래비스 켈시','Travis Kelce','TE','쿼터백과 호흡이 척척 맞는 베테랑','Veteran TE in sync with his QB'],
      ['크리스 존스','Chris Jones','DL','가운데서 쿼터백을 괴롭히는 수비 스타','Interior star who harasses QBs'],
      ['케네스 워커 3세','Kenneth Walker III','RB','새로 합류한 폭발적인 러닝백','Explosive newcomer at running back']]],
    ['DEN','Denver Broncos','덴버 브롱코스','덴버 (콜로라도주)','Denver, CO','AFC','West',5,2,0,'높은 산 위의 도시, 강한 수비가 자랑','Mile-high city proud of its defense',[
      ['보 닉스','Bo Nix','QB','빠른 판단으로 패스하는 젊은 쿼터백','Young QB who decides quickly'],
      ['팻 서틴 2세','Pat Surtain II','CB','리그 최고급 코너백','One of the best cornerbacks in the league'],
      ['제일런 워들','Jaylen Waddle','WR','순간 스피드가 엄청난 리시버','Receiver with blazing speed'],
      ['닉 보니토','Nik Bonitto','EDGE','빠르게 돌아 들어가는 패스 러셔','Speedy edge rusher']]],
    ['LV','Las Vegas Raiders','라스베이거스 레이더스','라스베이거스 (네바다주)','Las Vegas, NV','AFC','West',3,4,0,'해적 로고, 거친 이미지의 팀','Pirate logo and a tough-guy image',[
      ['커크 커즌스','Kirk Cousins','QB','경험 많은 베테랑 쿼터백','Experienced veteran QB'],
      ['애슈턴 지앤티','Ashton Jeanty','RB','태클을 잘 피하는 젊은 러닝백','Young runner who dodges tackles'],
      ['브록 바워스','Brock Bowers','TE','리시버처럼 빠른 타이트 엔드','Tight end as fast as a receiver'],
      ['맥스 크로스비','Maxx Crosby','EDGE','끝까지 쫓아가는 열정의 러셔','Relentless, never-quit pass rusher']]],
    ['LAC','Los Angeles Chargers','로스앤젤레스 차저스','로스앤젤레스 (캘리포니아주)','Los Angeles, CA','AFC','West',0,6,0,'번개 로고, 팔 힘 좋은 쿼터백의 팀','Lightning-bolt logo and a big-armed QB',[
      ['저스틴 허버트','Justin Herbert','QB','팔 힘이 아주 강한 쿼터백','QB with a cannon arm'],
      ['래드 맥콩키','Ladd McConkey','WR','정교하게 움직이는 리시버','Precise route-runner'],
      ['더윈 제임스 주니어','Derwin James Jr.','S','강하게 태클하는 리더 세이프티','Hard-hitting leader at safety'],
      ['칼릴 맥','Khalil Mack','EDGE','오랫동안 활약한 베테랑 러셔','Long-time veteran pass rusher']]],
    ['NYG','New York Giants','뉴욕 자이언츠','뉴욕 (경기장은 뉴저지)','New York (plays in NJ)','NFC','East',4,2,1,'오래된 명문, 젊은 스타가 늘고 있는 팀','Historic club adding young stars',[
      ['J.J. 매카시','J.J. McCarthy','QB','최근 주전이 된 젊은 쿼터백','Young QB who recently took over'],
      ['말릭 네이버스','Malik Nabers','WR','공 잡은 뒤 폭발적인 리시버','Explosive after the catch'],
      ['압둘 카터','Abdul Carter','EDGE','빠르고 강한 젊은 패스 러셔','Fast, strong young rusher'],
      ['캠 스캐터보','Cam Skattebo','RB','부딪혀도 넘어지지 않는 러닝백','Tough runner who breaks tackles']]],
    ['DAL','Dallas Cowboys','댈러스 카우보이스','댈러스 (텍사스주)','Dallas, TX','NFC','East',3,4,0,'“아메리카의 팀”, 가장 인기 많은 구단 중 하나','"America’s Team" — one of the most popular',[
      ['댁 프레스콧','Dak Prescott','QB','팀을 이끄는 베테랑 쿼터백','Veteran leader at QB'],
      ['시디 램','CeeDee Lamb','WR','어디서든 공을 받는 에이스 리시버','Star receiver who gets open anywhere'],
      ['조지 피컨스','George Pickens','WR','높은 공을 잘 잡는 리시버','Receiver who wins contested catches'],
      ['브랜던 오브리','Brandon Aubrey','K','먼 거리 필드골도 성공하는 키커','Kicker who makes very long field goals']]],
    ['PHI','Philadelphia Eagles','필라델피아 이글스','필라델피아 (펜실베이니아주)','Philadelphia, PA','NFC','East',2,5,0,'독수리 팀, 시끄럽고 열정적인 팬','Eagles with loud, passionate fans',[
      ['세이콴 바클리','Saquon Barkley','RB','힘과 스피드를 다 가진 스타 러닝백','Star runner with power and speed'],
      ['데본타 스미스','DeVonta Smith','WR','날씬하지만 정교한 리시버','Slim but precise receiver'],
      ['제일런 카터','Jalen Carter','DL','가운데를 뚫는 힘센 수비수','Powerful interior disruptor'],
      ['쿠퍼 디진','Cooper DeJean','CB','어디서든 공을 노리는 수비수','Versatile ball-hawking defender']]],
    ['WAS','Washington Commanders','워싱턴 커맨더스','워싱턴 D.C.','Washington, D.C.','NFC','East',1,4,1,'수도의 팀, 달리고 던지는 젊은 쿼터백','Capital team with a dual-threat young QB',[
      ['제이든 대니얼스','Jayden Daniels','QB','달리기와 패스 모두 되는 쿼터백','QB who can run and pass'],
      ['스테폰 디그스','Stefon Diggs','WR','경험 많은 베테랑 리시버','Experienced veteran receiver'],
      ['프랭키 루부','Frankie Luvu','LB','에너지 넘치게 뛰어다니는 라인배커','High-energy linebacker'],
      ['소니 스타일스','Sonny Styles','LB','새로 합류한 젊은 라인배커','Young newcomer at linebacker']]],
    ['MIN','Minnesota Vikings','미네소타 바이킹스','미니애폴리스 (미네소타주)','Minneapolis, MN','NFC','North',6,0,0,'바이킹 팀, 공격적인 수비 작전','Vikings with an aggressive, blitzing defense',[
      ['카일러 머리','Kyler Murray','QB','작지만 빠른 쿼터백','Small but very quick QB'],
      ['저스틴 제퍼슨','Justin Jefferson','WR','리그 최고급 리시버','One of the league’s best receivers'],
      ['T.J. 호켄슨','T.J. Hockenson','TE','믿음직한 타이트 엔드','Dependable tight end'],
      ['해리슨 스미스','Harrison Smith','S','수비를 지휘하는 베테랑 세이프티','Veteran safety who directs the defense']]],
    ['CHI','Chicago Bears','시카고 베어스','시카고 (일리노이주)','Chicago, IL','NFC','North',5,2,0,'가장 오래된 구단 중 하나, 곰 팀','One of the oldest clubs — the Bears',[
      ['케일럽 윌리엄스','Caleb Williams','QB','즉흥 플레이가 뛰어난 젊은 쿼터백','Young QB great at improvising'],
      ['롬 오던지','Rome Odunze','WR','키 크고 손이 좋은 리시버','Tall receiver with good hands'],
      ['콜스턴 러블랜드','Colston Loveland','TE','젊고 빠른 타이트 엔드','Young, fast tight end'],
      ['몬테즈 스웨트','Montez Sweat','EDGE','긴 팔의 패스 러셔','Long-armed pass rusher']]],
    ['DET','Detroit Lions','디트로이트 라이언스','디트로이트 (미시간주)','Detroit, MI','NFC','North',4,2,0,'사자 팀, 투지 넘치는 공격','Lions with a gritty, high-scoring offense',[
      ['재러드 고프','Jared Goff','QB','짧고 정확한 패스의 쿼터백','Accurate, rhythm passer'],
      ['재미어 기브스','Jahmyr Gibbs','RB','엄청 빠른 러닝백','Super-fast running back'],
      ['아몬라 세인트브라운','Amon-Ra St. Brown','WR','공을 거의 놓치지 않는 리시버','Receiver who rarely drops the ball'],
      ['에이든 허친슨','Aidan Hutchinson','EDGE','쿼터백을 괴롭히는 수비 스타','Star rusher who harasses QBs']]],
    ['GB','Green Bay Packers','그린베이 패커스','그린베이 (위스콘신주)','Green Bay, WI','NFC','North',5,3,0,'팬들이 구단 주인인 작은 도시의 명문','Small-town club owned by its fans',[
      ['조던 러브','Jordan Love','QB','팔 힘 좋은 쿼터백','QB with a strong arm'],
      ['조시 제이컵스','Josh Jacobs','RB','부딪혀도 버티는 힘센 러닝백','Strong runner who fights through contact'],
      ['터커 크래프트','Tucker Kraft','TE','공 잡고 잘 달리는 타이트 엔드','Tight end who runs well after the catch'],
      ['재비어 매키니','Xavier McKinney','S','공을 가로채는 세이프티','Safety who grabs interceptions']]],
    ['ATL','Atlanta Falcons','애틀랜타 팰컨스','애틀랜타 (조지아주)','Atlanta, GA','NFC','South',3,4,0,'매 팀, 젊은 공격 무기가 많음','Falcons loaded with young offensive weapons',[
      ['마이클 페닉스 주니어','Michael Penix Jr.','QB','왼손으로 멀리 던지는 쿼터백','Left-handed QB with a deep arm'],
      ['비잔 로빈슨','Bijan Robinson','RB','춤추듯 태클을 피하는 러닝백','Runner who dances past tacklers'],
      ['드레이크 런던','Drake London','WR','크고 강한 리시버','Big, strong receiver'],
      ['제시 베이츠 3세','Jessie Bates III','S','공을 잘 가로채는 세이프티','Ball-hawking safety']]],
    ['CAR','Carolina Panthers','캐롤라이나 팬서스','샬럿 (노스캐롤라이나주)','Charlotte, NC','NFC','South',3,4,0,'표범 팀, 젊은 쿼터백과 성장 중','Panthers growing with a young QB',[
      ['브라이스 영','Bryce Young','QB','작지만 영리한 쿼터백','Small but smart QB'],
      ['테타이로아 맥밀런','Tetairoa McMillan','WR','키 큰 젊은 에이스 리시버','Tall young No. 1 receiver'],
      ['추바 허바드','Chuba Hubbard','RB','꾸준한 러닝백','Steady, dependable runner'],
      ['데릭 브라운','Derrick Brown','DL','앞줄을 지키는 힘센 수비수','Powerful front-line defender']]],
    ['TB','Tampa Bay Buccaneers','탬파베이 버커니어스','탬파 (플로리다주)','Tampa, FL','NFC','South',2,5,0,'해적선 대포가 울리는 팀','Pirate ship cannons fire after scores',[
      ['베이커 메이필드','Baker Mayfield','QB','자신감 넘치는 투지의 쿼터백','Fiery, confident QB'],
      ['에메카 에그부카','Emeka Egbuka','WR','정교한 젊은 리시버','Polished young receiver'],
      ['트리스턴 워프스','Tristan Wirfs','OL','쿼터백을 지키는 최고급 방패','Elite protector of the QB'],
      ['앤트완 윈필드 주니어','Antoine Winfield Jr.','S','어디서든 나타나는 세이프티','Safety who shows up everywhere']]],
    ['NO','New Orleans Saints','뉴올리언스 세인츠','뉴올리언스 (루이지애나주)','New Orleans, LA','NFC','South',2,5,0,'재즈의 도시, 시끄러운 돔 구장','Jazz city with a loud dome stadium',[
      ['타일러 셔프','Tyler Shough','QB','2년차 주전 쿼터백','Second-year starting QB'],
      ['앨빈 카마라','Alvin Kamara','RB','달리고 받기 다 되는 베테랑','Veteran who runs and catches'],
      ['크리스 올레이브','Chris Olave','WR','빠르고 정확한 리시버','Fast, precise receiver'],
      ['캐머런 조던','Cameron Jordan','EDGE','오랫동안 팀을 지킨 베테랑 수비수','Longtime veteran defender']]],
    ['SF','San Francisco 49ers','샌프란시스코 포티나이너스','샌프란시스코 지역 (캘리포니아주)','San Francisco Bay Area, CA','NFC','West',6,1,0,'금광 시대 이름의 명문, 똑똑한 작전','Gold-rush name, famous for clever play-calling',[
      ['브록 퍼디','Brock Purdy','QB','침착하고 정확한 쿼터백','Calm, accurate QB'],
      ['크리스천 매캐프리','Christian McCaffrey','RB','달리기와 받기 모두 최고급','Elite at both running and catching'],
      ['조지 키틀','George Kittle','TE','막기와 받기 다 잘하는 타이트 엔드','Tight end great at blocking and catching'],
      ['닉 보사','Nick Bosa','EDGE','쿼터백을 쫓는 수비 스타','Star pass rusher']]],
    ['SEA','Seattle Seahawks','시애틀 시호크스','시애틀 (워싱턴주)','Seattle, WA','NFC','West',4,3,0,'시끄러운 팬 “12번째 선수”로 유명','Famous for loud fans — the "12th Man"',[
      ['샘 다널드','Sam Darnold','QB','경험 많은 쿼터백','Experienced QB'],
      ['잭슨 스미스-엔지바','Jaxon Smith-Njigba','WR','빠르게 방향을 바꾸는 에이스 리시버','Shifty star receiver'],
      ['데번 위더스푼','Devon Witherspoon','CB','강하게 부딪히는 코너백','Hard-hitting cornerback'],
      ['쿠퍼 컵','Cooper Kupp','WR','영리한 베테랑 리시버','Smart veteran receiver']]],
    ['LAR','Los Angeles Rams','로스앤젤레스 램스','로스앤젤레스 (캘리포니아주)','Los Angeles, CA','NFC','West',3,4,0,'숫양 뿔 헬멧, 영리한 패스 공격','Ram-horn helmets and a clever passing attack',[
      ['매슈 스태퍼드','Matthew Stafford','QB','팔 힘 좋은 베테랑 쿼터백','Big-armed veteran QB'],
      ['푸카 나쿠아','Puka Nacua','WR','공을 잘 잡고 강하게 달리는 리시버','Sure-handed, tough receiver'],
      ['카이렌 윌리엄스','Kyren Williams','RB','열심히 달리는 러닝백','Hard-running back'],
      ['트렌트 맥더피','Trent McDuffie','CB','패스를 잘 막는 코너백','Sticky cover cornerback']]],
    ['ARI','Arizona Cardinals','애리조나 카디널스','피닉스 지역 (애리조나주)','Phoenix area, AZ','NFC','West',2,5,0,'가장 오래된 구단, 사막의 팀','Oldest franchise, now in the desert',[
      ['재코비 브리셋','Jacoby Brissett','QB','안정적인 베테랑 쿼터백','Steady veteran QB'],
      ['트레이 맥브라이드','Trey McBride','TE','패스를 많이 받는 타이트 엔드','Tight end who catches a lot'],
      ['버다 베이커','Budda Baker','S','작지만 강한 세이프티','Small but fierce safety'],
      ['제레마이아 러브','Jeremiyah Love','RB','새로 합류한 빠른 러닝백','Fast newcomer at running back']]]
  ];
  var POSMAP = { QB:'QB', RB:'RB', WR:'WR', TE:'TE', OL:'OL', DL:'DL', EDGE:'EDGE', LB:'LB', CB:'CB', S:'S', K:'K' };
  return {
    asOf: { ko: '2026년 10월 30일 기준 (미국 동부시간 10/29 목요일 경기까지 반영, 8주차 진행 중)', en: 'As of Oct 30, 2026 (through Thu Oct 29 ET games; Week 8 in progress)' },
    sources: 'nflverse game log via NFLAnalytic.com (checked against ESPN), Advanced Football Stats; rosters: ESPN depth charts via nflverse / FantasyTools.ai (Oct 31, 2026), Sports Illustrated QB list',
    pos: POS, posMap: POSMAP, teams: T
  };
})();
