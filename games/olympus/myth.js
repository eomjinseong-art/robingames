/* 뿡뿡 올림포스 / Toot Olympus — shared myth dex, family tree & quiz (나두Ai)
   Usage: Myth.unlock(id) -> true if new; Myth.openDex(lang); Myth.quiz(lang, cb(correct)); Myth.card(id) */
(function(){
const LINK='https://nadoo-myth.vercel.app/gods/';
// id: [ko,en,abilityKo,abilityEn,symbol,familyKo,familyEn,storyKo,storyEn,slug]
const C={
kronos:['크로노스','Kronos','시간을 삼키는 티탄의 왕','King of the Titans','🌾 낫','우라노스와 가이아의 아들, 레아의 남편','Son of Ouranos & Gaia, husband of Rhea','자식들이 왕위를 빼앗을까 두려워 태어나는 족족 삼켰어요.','Fearing a child would overthrow him, he swallowed his children at birth.','kronos'],
rhea:['레아','Rhea','신들의 어머니','Mother of the gods','🦁 사자','우라노스와 가이아의 딸, 크로노스의 아내','Daughter of Ouranos & Gaia, wife of Kronos','막내 제우스 대신 돌을 포대기에 싸서 크로노스에게 삼키게 했어요.','She gave Kronos a swaddled stone to swallow instead of baby Zeus.','rhea'],
zeus:['제우스','Zeus','번개를 다루는 신들의 왕','King of the gods, wields thunder','⚡ 번개','크로노스와 레아의 막내아들, 헤라의 남편','Youngest son of Kronos & Rhea, husband of Hera','크레타 동굴에서 몰래 자라 형제들을 구하고 티탄을 물리쳤어요.','Raised in secret in a Cretan cave, he freed his siblings and defeated the Titans.','zeus'],
hera:['헤라','Hera','결혼과 가정의 여신','Goddess of marriage','🦚 공작','크로노스와 레아의 딸, 제우스의 아내','Daughter of Kronos & Rhea, wife of Zeus','올림포스의 여왕으로 공작새가 그녀의 상징이에요.','Queen of Olympus; the peacock is her sacred bird.','hera'],
poseidon:['포세이돈','Poseidon','바다와 지진의 신','God of the sea & earthquakes','🔱 삼지창','크로노스와 레아의 아들, 제우스의 형','Son of Kronos & Rhea, brother of Zeus','삼지창으로 땅을 치면 바다가 요동치고 땅이 흔들려요.','When he strikes with his trident, seas rage and the earth shakes.','poseidon'],
hades:['하데스','Hades','저승의 왕','King of the Underworld','🐕 케르베로스','크로노스와 레아의 아들, 페르세포네의 남편','Son of Kronos & Rhea, husband of Persephone','제비뽑기로 저승을 맡아 죽은 이들의 세계를 다스려요.','He drew the Underworld by lot and rules the realm of the dead.','hades'],
demeter:['데메테르','Demeter','곡식과 농사의 여신','Goddess of grain & harvest','🌾 이삭','크로노스와 레아의 딸, 페르세포네의 어머니','Daughter of Kronos & Rhea, mother of Persephone','딸을 잃고 슬퍼하자 세상에 겨울이 찾아왔어요.','When she grieved for her lost daughter, winter came to the world.','demeter'],
hestia:['헤스티아','Hestia','화로와 가정의 불의 여신','Goddess of the hearth','🔥 화로','크로노스와 레아의 맏딸','Eldest daughter of Kronos & Rhea','모든 제사에서 가장 먼저 제물을 받는 화롯불의 여신이에요.','Hearth goddess who received the first offering at every sacrifice.','hestia'],
athena:['아테나','Athena','지혜와 전략의 여신','Goddess of wisdom & strategy','🦉 올빼미','제우스와 메티스의 딸','Daughter of Zeus & Metis','완전무장한 채로 제우스의 머리에서 태어났어요.','She sprang fully armed from the head of Zeus.','athena'],
apollo:['아폴론','Apollo','음악·예언·궁술의 신','God of music, prophecy & archery','🎵 리라','제우스와 레토의 아들, 아르테미스의 쌍둥이','Son of Zeus & Leto, twin of Artemis','델포이 신탁의 주인으로 리라를 연주해요.','Master of the Delphic oracle who plays the lyre.','apollo'],
artemis:['아르테미스','Artemis','사냥과 달의 여신','Goddess of the hunt','🏹 활','제우스와 레토의 딸, 아폴론의 쌍둥이','Daughter of Zeus & Leto, twin of Apollo','은빛 활을 들고 숲과 야생동물을 지켜요.','With her silver bow she guards forests and wild animals.','artemis'],
ares:['아레스','Ares','전쟁의 신','God of war','🛡️ 창과 방패','제우스와 헤라의 아들','Son of Zeus & Hera','거칠고 맹렬한 싸움 그 자체를 상징해요.','He embodies the fury and violence of battle.','ares'],
hephaistos:['헤파이스토스','Hephaistos','대장장이와 불의 신','God of the forge & fire','🔨 망치','헤라의 아들(제우스와 헤라의 아들이라고도 함)','Son of Hera (or of Zeus & Hera)','신들의 무기와 아킬레우스의 방패를 만들었어요.','He forged the gods\' weapons and the shield of Achilles.','hephaistos'],
hermes:['헤르메스','Hermes','전령과 여행자의 신','Messenger god of travelers','🪽 날개 신발','제우스와 마이아의 아들','Son of Zeus & Maia','태어난 날 아폴론의 소를 훔치고 리라를 발명했어요.','On the day he was born he stole Apollo\'s cattle and invented the lyre.','hermes'],
dionysos:['디오니소스','Dionysos','포도주와 축제의 신','God of wine & festivity','🍇 포도','제우스와 세멜레의 아들','Son of Zeus & Semele','제우스의 허벅지에서 다시 태어난 "두 번 태어난 신"이에요.','The "twice-born" god, born again from Zeus\'s thigh.','dionysos'],
persephone:['페르세포네','Persephone','저승의 여왕, 봄의 여신','Queen of the Underworld','🍎 석류','제우스와 데메테르의 딸, 하데스의 아내','Daughter of Zeus & Demeter, wife of Hades','석류 씨를 먹어 해마다 일부를 저승에서 보내야 해요.','Having eaten pomegranate seeds, she must spend part of each year below.','persephone'],
labyrinth:['라비린토스','Labyrinth','한번 들어가면 못 나오는 미궁','A maze no one could escape','🌀 미궁','다이달로스가 미노스 왕을 위해 지음','Built by Daedalus for King Minos','괴물 미노타우로스를 가두려고 크레타 크노소스에 지었어요.','Built at Knossos on Crete to imprison the Minotaur.','minotauros'],
minos:['미노스','Minos','크레타의 왕','King of Crete','👑 왕관','제우스와 에우로페의 아들','Son of Zeus & Europa','다이달로스와 이카로스를 크레타에 가두고 놓아주지 않았어요.','He kept Daedalus and Icarus captive on Crete.',''],
crete:['크레타','Crete','미노스 왕국의 섬','Island kingdom of Minos','🏝️ 섬','제우스가 몰래 자란 섬','Island where baby Zeus was hidden','레아가 아기 제우스를 크레타의 동굴에 숨겨 키웠어요.','Rhea hid baby Zeus in a cave on Crete.',''],
daidalos:['다이달로스','Daedalus','천재 발명가·건축가','Genius inventor & architect','🪶 깃털 날개','아테네 출신, 이카로스의 아버지','From Athens, father of Icarus','깃털과 밀랍으로 날개를 만들어 크레타를 탈출했어요.','He built wings of feathers and wax to escape Crete.','daidalos'],
ikaros:['이카로스','Icarus','아버지가 만든 날개로 비행','Flew on his father\'s wings','☀️ 녹은 날개','다이달로스와 나우크라테의 아들','Son of Daedalus & Naukrate','"너무 높이 날지 마라"는 말을 어기고 태양에 다가갔다 떨어졌어요.','Ignoring "don\'t fly too high," he neared the sun and fell.','ikaros'],
helios:['헬리오스','Helios','태양 마차를 모는 태양신','Sun god who drives the sun chariot','🌞 태양 마차','티탄 히페리온과 테이아의 아들','Son of the Titans Hyperion & Theia','매일 네 마리 불 말이 끄는 마차로 하늘을 가로질러요.','Each day he crosses the sky in a chariot drawn by fiery horses.','helios'],
icarian:['이카리아 해','Icarian Sea','이카로스가 떨어진 바다','Sea where Icarus fell','🌊 에게해','에게해의 일부, 이카리아 섬 근처','Part of the Aegean, near Ikaria','이카로스가 떨어진 바다라서 그의 이름이 붙었어요.','Named after Icarus, who fell into it.','ikaros']
};
const TREE=[['kronos','rhea'],['hestia','demeter','hera','hades','poseidon','zeus'],['athena','apollo','artemis','ares','hephaistos','hermes','dionysos','persephone']];
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
['이카로스가 떨어진 바다 이름은?','Sea named after Icarus?',['이카리아 해','흑해','홍해'],['Icarian Sea','Black Sea','Red Sea'],0]
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
.myq button{display:block;width:100%;margin:7px 0;padding:11px;border-radius:12px;border:2px solid #ffd76f88;background:#2a2f7a;color:#fff;font:inherit;font-size:16px}.myq .bar{height:6px;background:#ffd76f;border-radius:3px;margin-top:8px;transition:width 3s linear}`;
function style(){if(!document.getElementById('myocss')){const s=document.createElement('style');s.id='myocss';s.textContent=css;document.head.appendChild(s)}}
function openDex(lang){style();const e=lang=='en',d=get(),o=document.createElement('div');o.className='myo';
const stop=ev=>ev.stopPropagation();o.addEventListener('pointerdown',stop);
let h=`<button class="x">✕</button><h2>🏛️ ${e?'Olympus Myth Dex':'올림포스 신화 도감'} ${d.length}/${Object.keys(C).length}</h2>`;
h+=`<div class="myt"><b>${e?'Olympus Family Tree':'올림포스 가계도'}</b>`+TREE.map((r,i)=>`<div>${r.map(id=>{const c=card(id,lang);return d.includes(id)?`<span>${c.symbol.split(' ')[0]} ${c.name}</span>`:'<span class="l">❔</span>'}).join('')}</div>${i<2?'<i>↓</i>':''}`).join('')+'</div><div class="myg">';
for(const id in C){if(d.includes(id)){const c=card(id,lang);h+=`<div class="myc"><b>${c.symbol.split(' ')[0]} ${c.name}</b><br>✨ ${c.ability}<br>🔖 ${c.symbol}<br>👪 ${c.family}<br>📜 ${c.story}${c.link?`<br><a href="${c.link}" target="_blank" rel="noopener">${e?'More at 나두신화 →':'나두신화에서 더 보기 →'}</a>`:''}</div>`}else h+='<div class="myc l">❔</div>'}
o.innerHTML=h+'</div>';o.querySelector('.x').onclick=()=>o.remove();document.body.appendChild(o)}
function quiz(lang,cb){style();const e=lang=='en',q=Q[Math.random()*Q.length|0],ord=[0,1,2].sort(()=>Math.random()-.5),o=document.createElement('div');o.className='myq';
o.innerHTML=`<div class="b"><b>⚡ ${e?'Quick quiz!':'3초 퀴즈!'}</b><p style="margin:8px 0;font-size:17px">${e?q[1]:q[0]}</p>${ord.map(i=>`<button data-i="${i}">${(e?q[3]:q[2])[i]}</button>`).join('')}<div class="bar" style="width:100%"></div></div>`;
let done=false;const fin=ok=>{if(done)return;done=true;clearTimeout(t);setTimeout(()=>{o.remove();cb(ok)},ok===null?0:450)};
o.addEventListener('pointerdown',ev=>{ev.stopPropagation();const b=ev.target.closest('button');if(!b)return;const ok=+b.dataset.i===q[4];b.style.background=ok?'#2a9d5c':'#b23a48';if(!ok)o.querySelector(`[data-i="${q[4]}"]`).style.background='#2a9d5c';fin(ok)});
document.body.appendChild(o);requestAnimationFrame(()=>o.querySelector('.bar').style.width='0%');const t=setTimeout(()=>fin(false),3000)}
window.Myth={C,TREE,Q,get,unlock,card,openDex,quiz,LINK};
})();
