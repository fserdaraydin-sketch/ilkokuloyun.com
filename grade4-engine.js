// ===== 4. SINIF MATEMATİK ORTAK MOTOR =====
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const shuffle=a=>a.sort(()=>Math.random()-.5);
const fmt=n=>n.toLocaleString('tr-TR').replace(/\./g,' ');
const pick=a=>a[Math.floor(Math.random()*a.length)];

const ONES=['','bir','iki','üç','dört','beş','altı','yedi','sekiz','dokuz'];
const TENS=['','on','yirmi','otuz','kırk','elli','altmış','yetmiş','seksen','doksan'];
function read3(n){if(n===0)return'';let s='';const y=Math.floor(n/100),o=Math.floor((n%100)/10),b=n%10;
if(y===1)s+='yüz ';else if(y>1)s+=ONES[y]+' yüz ';if(o)s+=TENS[o]+' ';if(b)s+=ONES[b]+' ';return s;}
function readNum(n){if(n===0)return'sıfır';const bin=Math.floor(n/1000),k=n%1000;let s='';
if(bin===1)s='bin ';else if(bin>1)s=read3(bin)+'bin ';s+=read3(k);return s.trim();}

// Benzersiz çeldirici üretici
function distractors(answer,gen,count=3){
  const set=new Set();let guard=0;
  while(set.size<count&&guard++<200){const v=gen();if(v!==answer&&v!==null&&v!==undefined)set.add(v);}
  return [...set].slice(0,count);
}
// Rakam değiştirerek çeldirici
function digitVariants(n,count=3){
  return distractors(n,()=>{const s=String(n).split('');const i=rnd(0,s.length-1);
    s[i]=String((+s[i]+rnd(1,8))%10);if(s[0]==='0')s[0]=String(rnd(1,9));return +s.join('');},count);
}

// ===== OYUN DURUMU =====
let level=0,score=0,correctCount=0,totalCount=0,answered=false,currentAnswer=null;
let LEVELS=[],THEME={};

function initGame(levels,theme){
  LEVELS=levels;THEME=theme;
  document.documentElement.style.setProperty('--c1',theme.c1);
  document.documentElement.style.setProperty('--c2',theme.c2);
  const st=document.createElement('style');
  st.textContent=`
    body{background:linear-gradient(135deg,${theme.c1} 0%,${theme.c2} 100%)}
    .header h1{background:linear-gradient(135deg,${theme.c1},${theme.c2})}
    .level-btn.active{background:linear-gradient(135deg,${theme.c1},${theme.c2});box-shadow:0 4px 14px ${theme.shadow}}
    .question-box{background:${theme.boxBg};border-color:${theme.boxBorder}}
    .number-display,.read-display{color:${theme.c2};border-color:${theme.boxBorder}}
    .stat-v{color:${theme.c1}}
    .opt:hover:not(:disabled){border-color:${theme.c1}}
    .btn-next{background:linear-gradient(135deg,${theme.c1},${theme.c2});box-shadow:0 4px 14px ${theme.shadow}}
    .btn-back:hover{border-color:${theme.c1};color:${theme.c1}}`;
  document.head.appendChild(st);
  buildLevels();newQuestion();
  if(window.IO && levels[0]) IO.asama(levels[0].name,1);
}

function buildLevels(){
  const box=document.getElementById('levels');box.innerHTML='';
  LEVELS.forEach((l,i)=>{
    const b=document.createElement('button');
    b.className='level-btn'+(i===level?' active':'');
    b.innerHTML=`<span class="num">AŞAMA ${i+1}</span>${l.name}`;
    b.onclick=()=>{level=i;buildLevels();newQuestion();
      if(window.IO) IO.asama(l.name,i+1);};
    box.appendChild(b);
  });
}

function newQuestion(){
  answered=false;
  const fb=document.getElementById('feedback');fb.textContent='';fb.className='feedback';
  document.getElementById('explain').className='explain';

  const q=LEVELS[level].gen();
  currentAnswer=q.answer;
  document.getElementById('qText').textContent=q.text;

  const vis=document.getElementById('qVisual');vis.innerHTML='';
  if(q.visual){const d=document.createElement('div');d.className='visual';d.appendChild(q.visual());vis.appendChild(d);}
  if(q.numberDisplay){const d=document.createElement('div');d.className='number-display';d.textContent=q.numberDisplay;vis.appendChild(d);}
  if(q.readDisplay){const d=document.createElement('div');d.className='read-display';d.textContent=q.readDisplay;vis.appendChild(d);}

  const ob=document.getElementById('options');ob.innerHTML='';
  if(q.interactive){
    // İnteraktif soru: şık yerine kendi arayüzünü kurar
    ob.style.display='block';
    q.mount(ob,{
      done:(ok,explain)=>finishInteractive(ok,explain)
    });
  }else if(q.optionVisuals){
    // Görsel şıklar: her şık bir canvas (metin yerine resim)
    ob.style.display='';
    q.options.forEach((o,i)=>{
      const b=document.createElement('button');
      b.className='opt';b.style.padding='8px';
      b.appendChild(q.optionVisuals(o,i));
      b.dataset.val=o;
      b.onclick=()=>checkAnswer(b,o,q.explain);
      ob.appendChild(b);
    });
  }else{
    ob.style.display='';
    q.options.forEach(o=>{
      const b=document.createElement('button');b.className='opt';b.textContent=o;
      b.onclick=()=>checkAnswer(b,o,q.explain);
      ob.appendChild(b);
    });
  }
}

// İnteraktif sorular için sonuç bildirimi
function finishInteractive(ok,explain){
  if(answered)return;answered=true;totalCount++;
  const fb=document.getElementById('feedback');
  if(ok){
    correctCount++;score+=100;
    fb.textContent='🌟 Doğru! Harikasın!';fb.className='feedback ok';confetti(14);
  }else{
    fb.textContent='💪 Olmadı, doğrusu gösteriliyor.';fb.className='feedback no';
  }
  if(window.IO) IO.cevap(ok, LEVELS[level] && LEVELS[level].name);
  const ex=document.getElementById('explain');
  ex.textContent='📖 Çözüm:\n'+explain;ex.className='explain show';
  document.getElementById('score').textContent=score;
  document.getElementById('correct').textContent=correctCount;
  document.getElementById('total').textContent=totalCount;
}

function checkAnswer(btn,choice,explain){
  if(answered)return;answered=true;totalCount++;
  document.querySelectorAll('.opt').forEach(b=>{
    b.disabled=true;
    const val=b.dataset.val!==undefined?b.dataset.val:b.textContent;
    if(val===currentAnswer)b.classList.add('correct');});
  const fb=document.getElementById('feedback');
  const dogruMu=(choice===currentAnswer);
  if(dogruMu){
    correctCount++;score+=100;
    fb.textContent='🌟 Doğru! Harikasın!';fb.className='feedback ok';confetti(14);
  }else{
    btn.classList.add('wrong');
    fb.textContent='💪 Olmadı, doğrusu işaretli.';fb.className='feedback no';
  }
  if(window.IO) IO.cevap(dogruMu, LEVELS[level] && LEVELS[level].name);
  const ex=document.getElementById('explain');
  ex.textContent='📖 Çözüm:\n'+explain;ex.className='explain show';
  document.getElementById('score').textContent=score;
  document.getElementById('correct').textContent=correctCount;
  document.getElementById('total').textContent=totalCount;
}

function confetti(n){
  const cols=[THEME.c1,THEME.c2,'#43e97b','#FFD54F','#4FC3F7'];
  for(let i=0;i<n;i++){
    const c=document.createElement('div');c.className='confetti';
    c.style.left=Math.random()*100+'vw';
    c.style.background=cols[Math.floor(Math.random()*cols.length)];
    c.style.animationDuration=(1.2+Math.random()*1.3)+'s';
    document.body.appendChild(c);setTimeout(()=>c.remove(),3000);
  }
}

// ===== ORTAK CANVAS YARDIMCILARI =====
function newCanvas(wRatio=1,hRatio=.6,maxW=460){
  const c=document.createElement('canvas');
  const W=Math.min(maxW,window.innerWidth-90);
  c.width=W*wRatio;c.height=W*hRatio;
  const ctx=c.getContext('2d');
  ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);
  return{c,ctx,W:c.width,H:c.height};
}
