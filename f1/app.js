(function(){
var D=window.F1DATA,A=window.F1Audio||window.NadooF1Audio||null,app=document.getElementById('app');
var L=localStorage.getItem('f1lang')||'ko',tab='stage',si=0,step=0,hearts=3,qi=0,allOpen=false;
var cars=[{n:'VER',c:'#3671c6',t:'M'},{n:'NAD',c:'#e10600',t:'S',me:1},{n:'NOR',c:'#ff8000',t:'H'},{n:'LEC',c:'#e8002d',t:'M'},{n:'HAM',c:'#27f4d2',t:'H'}];
var prog=[0.10,0.06,0.02,0.97,0.93],raf=null,flag='';
function T(p){return p[L===
'ko'?0:1]}
function snd(f){try{if(A&&A[f])A[f]()}catch(e){}}
function shuffle(o,a){var idx=o.map(function(_,i){return i});for(var i=idx.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=idx[i];idx[i]=idx[j];idx[j]=t}return idx}
function el(h){var d=document.createElement('div');d.innerHTML=h;return d}
function tabs(){var ts=[['stage',['🏁 스테이지','🏁 Stages']],['tv',['📺 중계 해독기','📺 TV Decoder']],['cards',['📖 도감','📖 Rulebook']],['quiz',['⚡ 퀴즈','⚡ Quiz']]];
 return '<div class="tabs">'+ts.map(function(t){return '<button data-tab="'+t[0]+'" class="'+(tab===t[0]?'on':'')+'">'+T(t[1])+'</button>'}).join('')+'</div>'}
function render(){cancelAnimationFrame(raf);raf=null;
 document.getElementById('title').textContent=L==='ko'?'🏎️ 나두 F1 피트월':'🏎️ Nadoo F1 Pit Wall';
 document.documentElement.lang=L;
 var h=tabs();
 if(tab==='stage')h+=stageHTML();
 else if(tab==='tv')h+='<div class="grid">'+D.tv.map(function(x){return '<details'+(allOpen?' open':'')+'><summary>'+T(x[0])+'</summary>'+T(x[1])+'</details>'}).join('')+'</div>';
 else if(tab==='cards')h+='<div class="grid">'+D.cards.map(function(x){return '<details'+(allOpen?' open':'')+'><summary>'+T(x[0])+'</summary>'+T(x[1])+'</details>'}).join('')+'</div>';
 else h+=quizHTML();
 app.innerHTML=h;bind();if(tab==='stage'&&step>0)drawTrack();}
function stageHTML(){var s=D.stages[si];
 var h='<div class="tabs">'+D.stages.map(function(x,i){return '<button data-st="'+i+'" class="'+(i===si?'on':'')+'">'+(i+1)+'</button>'}).join('')+'</div>';
 h+='<div class="pn"><h2>'+T(s.t)+'</h2><div class="goal">🎯 '+T(s.goal)+'</div><p>'+T(s.learn)+'</p><div>'+'❤️'.repeat(hearts)+'🤍'.repeat(3-hearts)+'</div></div>';
 var item,guide=step===0;
 if(step>s.sc.length)return h+'<div class="pn"><h3 class="ok">🏆 '+(L==='ko'?'스테이지 완료!':'Stage complete!')+'</h3>'+(si<D.stages.length-1?'<button id="nextSt">'+(L==='ko'?'다음 스테이지 ▶':'Next stage ▶')+'</button>':'<p>'+(L==='ko'?'모든 스테이지 클리어! 퀴즈에 도전하세요.':'All stages cleared! Try the quiz.')+'</p>')+'</div>';
 item=guide?s.guide:s.sc[step-1];
 h+='<div class="wall"><div class="pn"><b>'+(guide?(L==='ko'?'👣 따라 하기':'👣 Follow along'):'📻 '+(L==='ko'?'피트월 결정 ':'Pit wall call ')+step+'/'+s.sc.length)+'</b><p>'+T(item.q)+'</p><div class="opts">';
 var ord=item._ord||(item._ord=shuffle(item.o));
 ord.forEach(function(i){h+='<button data-op="'+i+'" class="'+(guide&&i===item.a?'glow':'')+'">'+T(item.o[i])+'</button>'});
 h+='</div>'+(guide?'<button id="hint" style="margin-top:8px">💡 '+(L==='ko'?'힌트':'Hint')+'</button>':'')+'<div id="fb"></div></div>';
 h+='<div class="pn"><svg id="trk" viewBox="0 0 300 180" width="100%"><path id="tp" d="M40,90 C40,20 260,20 260,90 C260,160 40,160 40,90Z" fill="none" stroke="#3a4256" stroke-width="14"/><path d="M40,90 C40,20 260,20 260,90 C260,160 40,160 40,90Z" fill="none" stroke="#fff" stroke-width="1" stroke-dasharray="4 6"/><g id="dots"></g><text id="flag" x="150" y="96" text-anchor="middle" fill="#ffd400" font-size="18"></text></svg><div class="tower" id="tower"></div></div></div>';
 return h}
function tcol(t){return {S:'#e10600',M:'#ffd400',H:'#ffffff',I:'#21d07a',W:'#2f7bff'}[t]}
function drawTrack(){var p=document.getElementById('tp');if(!p)return;var len=p.getTotalLength(),g=document.getElementById('dots');
 g.innerHTML=cars.map(function(c,i){var pt=p.getPointAtLength(((prog[i]%1)+1)%1*len);return '<circle cx="'+pt.x+'" cy="'+pt.y+'" r="'+(c.me?8:6)+'" fill="'+c.c+'" stroke="#fff" stroke-width="'+(c.me?2:0)+'"/>'}).join('');
 document.getElementById('flag').textContent=flag;
 var ord=cars.map(function(c,i){return i}).sort(function(a,b){return prog[b]-prog[a]});
 document.getElementById('tower').innerHTML='<div><b>'+(L==='ko'?'순위':'POS')+'</b><span style="margin-left:auto">Interval</span></div>'+ord.map(function(i,k){var c=cars[i];var gap=k===0?'Leader':'+'+((prog[ord[k-1]]-prog[i])*30).toFixed(3);
  return '<div class="'+(c.me?'me':'')+'"><span>'+(k+1)+'</span><span style="color:'+c.c+'">▌'+c.n+'</span><span class="tb" style="border-color:'+tcol(c.t)+';color:'+tcol(c.t)+'">'+c.t+'</span><span style="margin-left:auto">'+gap+'</span></div>'}).join('')}
function animate(ev){var me=1,t0=performance.now(),dur=1600,start=prog.slice();
 var tgt=prog.slice();
 if(ev==='swap'||ev==='drs'){tgt[me]=Math.max.apply(null,prog)+0.03;if(ev==='drs')flag='DRS 🟢'}
 else if(ev==='pit'){cars[me].t=cars[me].t==='S'?'H':(cars[me].t==='H'?'I':'M');flag='PIT 🔧'}
 else if(ev==='sc'){flag='🟡 SC';tgt[me]=Math.max.apply(null,prog)+0.02}
 else if(ev==='win'){tgt[me]=Math.max.apply(null,prog)+0.1;flag='🏁'}
 for(var i=0;i<prog.length;i++)tgt[i]+=0.15;
 function f(n){var k=Math.min(1,(n-t0)/dur);for(var i=0;i<prog.length;i++)prog[i]=start[i]+(tgt[i]-start[i])*k;drawTrack();if(k<1)raf=requestAnimationFrame(f)}
 raf=requestAnimationFrame(f)}
function answer(i,btn){var s=D.stages[si],guide=step===0,item=guide?s.guide:s.sc[step-1],fb=document.getElementById('fb');
 if(item._done)return;
 if(i===item.a){item._done=1;snd(guide?'radioBeep':'okChime');
  fb.innerHTML='<div class="fb"><span class="ok">✅ '+(L==='ko'?'정답! ':'Correct! ')+'</span>'+T(item.e)+'<br><button id="cont" style="margin-top:8px">'+(L==='ko'?'계속 ▶':'Continue ▶')+'</button></div>';
  if(!guide&&item.ev){if(item.ev==='pit')snd('pitGun');if(item.ev==='drs')snd('drsOpen');if(item.ev==='swap')snd('passWhoosh');if(item.ev==='win')snd('fanfare');animate(item.ev)}
  document.getElementById('cont').onclick=function(){step++;flag='';render()};
 }else{snd('badBuzz');hearts=Math.max(0,hearts-1);btn.disabled=true;
  var hm=hearts===0?(L==='ko'?' 하트가 없어도 괜찮아요 — 다시 채워 드릴게요!':' Out of hearts — refilled, keep going!'):'';if(hearts===0)hearts=3;
  fb.innerHTML='<div class="fb bad">❌ '+(L==='ko'?'다시 생각해 봐요.':'Think again.')+hm+'</div>';
  var hs=app.querySelectorAll('.pn')[0].lastChild;if(hs)hs.textContent='❤️'.repeat(hearts)+'🤍'.repeat(3-hearts);}}
function quizHTML(){if(qi>=D.quiz.length)return '<div class="pn"><h2 class="ok">🏆 '+(L==='ko'?'퀴즈 완료!':'Quiz complete!')+'</h2><button id="qre">'+(L==='ko'?'다시 하기':'Restart')+'</button></div>';
 var q=D.quiz[qi],ord=q._ord||(q._ord=shuffle(q.o));
 return '<div class="pn"><b>⚡ '+(qi+1)+'/'+D.quiz.length+'</b><p>'+T(q.q)+'</p><div class="opts">'+ord.map(function(i){return '<button data-qo="'+i+'">'+T(q.o[i])+'</button>'}).join('')+'</div><div id="fb"></div></div>'}
function bind(){
 app.querySelectorAll('[data-tab]').forEach(function(b){b.onclick=function(){tab=b.dataset.tab;snd('radioBeep');render()}});
 app.querySelectorAll('[data-st]').forEach(function(b){b.onclick=function(){si=+b.dataset.st;step=0;hearts=3;reset();render()}});
 app.querySelectorAll('[data-op]').forEach(function(b){b.onclick=function(){answer(+b.dataset.op,b)}});
 var h=document.getElementById('hint');if(h)h.onclick=function(){document.getElementById('fb').innerHTML='<div class="fb">💡 '+T(D.stages[si].guide.h)+'</div>'};
 var n=document.getElementById('nextSt');if(n)n.onclick=function(){si++;step=0;hearts=3;reset();render()};
 var r=document.getElementById('qre');if(r)r.onclick=function(){qi=0;D.quiz.forEach(function(q){q._ord=null});render()};
 app.querySelectorAll('[data-qo]').forEach(function(b){b.onclick=function(){var q=D.quiz[qi],fb=document.getElementById('fb');if(q._d)return;
  if(+b.dataset.qo===q.a){q._d=1;snd('okChime');fb.innerHTML='<div class="fb"><span class="ok">✅ '+(L==='ko'?'정답!':'Correct!')+'</span> '+T(q.e)+'<br><button id="qn" style="margin-top:8px">'+(L==='ko'?'다음 문제 ▶':'Next ▶')+'</button></div>';
   document.getElementById('qn').onclick=function(){q._d=0;q._ord=null;qi++;render()}}
  else{snd('badBuzz');b.disabled=true;fb.innerHTML='<div class="fb bad">❌ '+(L==='ko'?'다시 골라 보세요.':'Try again.')+'</div>'}}});}
function reset(){prog=[0.10,0.06,0.02,0.97,0.93];cars[1].t='S';flag='';D.stages.forEach(function(s){s.guide._done=0;s.sc.forEach(function(x){x._done=0})})}
document.getElementById('lang').onclick=function(){L=L==='ko'?'en':'ko';localStorage.setItem('f1lang',L);render()};
document.getElementById('openAll').onclick=function(){allOpen=!allOpen;if(tab==='stage')tab='cards';render()};
var mb=document.getElementById('mute');function mu(){mb.textContent=A&&A.isMuted&&A.isMuted()?'🔇':'🔊'}
mb.onclick=function(){if(A){A.init();A.toggleMute()}mu()};mu();
document.addEventListener('pointerdown',function f(){if(A){A.init();if(!A.isMuted())A.startBgm()}document.removeEventListener('pointerdown',f)});
render();
})();
