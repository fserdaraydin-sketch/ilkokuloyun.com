/* ============================================================
   1. SINIF ETKİNLİK MOTORU — Türkiye Yüzyılı Maarif Modeli
   ------------------------------------------------------------
   4. sınıf motorundan farkları:
   • Çoktan seçmeli test yok — görsel seçim ve dokunma etkinliği
   • Her yönerge SESLİ okunur (çocuk henüz okuma yazma öğreniyor)
   • Yargısal geri bildirim yok: "yanlış" yerine "bir daha bakalım"
   • Yanlış seçim etkinliği bitirmez, çocuk tekrar dener
   • Puan yerine yıldızla ilerleme
   ============================================================ */
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const shuffle=a=>a.sort(()=>Math.random()-.5);
const pick=a=>a[Math.floor(Math.random()*a.length)];

// Doğru cevaptan farklı, kendi aralarında da farklı çeldiriciler üretir
function distractors(dogru,uretici,adet){
  const set=new Set(); let guvenlik=0;
  while(set.size<(adet||3) && guvenlik++<200){
    const v=uretici();
    if(v!==null && v!==undefined && String(v)!==String(dogru)) set.add(String(v));
  }
  // Havuz tükenirse tamamla
  let ek=1;
  while(set.size<(adet||3)){
    const v=String(dogru)+'\u200b'.repeat(ek++);
    if(v!==String(dogru)) set.add(v);
  }
  return [...set];
}

// ---- SESLİ YÖNERGE ----
let sesAcik=true;
function seslendir(metin){
  if(!sesAcik||!('speechSynthesis' in window))return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(seslendirmeMetni(metin));
  u.lang='tr-TR'; u.rate=.82; u.pitch=1.05;
  speechSynthesis.speak(u);
}

// Matematik sembollerini Türkçe okunuşlarına çevirir.
// Aksi hâlde ekran okuyucu "4 × 3" ifadesini "dört iks üç" diye okuyor.
function seslendirmeMetni(metin){
  return String(metin)
    .replace(/[👆🔊⭐✨🎉👀💪🌟👏🏆]/g,'')
    .replace(/\s*×\s*/g,' çarpı ')
    .replace(/\s*÷\s*/g,' bölü ')
    .replace(/\s*[−–—]\s*/g,' eksi ')
    .replace(/(\d)\s*-\s*(\d)/g,'$1 eksi $2')
    .replace(/\s*\+\s*/g,' artı ')
    .replace(/\s*=\s*/g,' eşittir ')
    .replace(/\s*≈\s*/g,' yaklaşık ')
    .replace(/\s*>\s*/g,' büyüktür ')
    .replace(/\s*<\s*/g,' küçüktür ')
    .replace(/\s+/g,' ')
    .trim();
}

function sesiDurdur(){ if('speechSynthesis' in window) speechSynthesis.cancel(); }

// ---- CANVAS ----
function sahne(W,H){
  const c=document.createElement('canvas');
  const dpr=Math.min(devicePixelRatio||1,2);
  c.width=W*dpr; c.height=H*dpr;
  c.style.width=W+'px'; c.style.height=H+'px';
  const ctx=c.getContext('2d');
  ctx.scale(dpr,dpr);
  ctx.fillStyle='#FFFDF8'; ctx.fillRect(0,0,W,H);
  return {c,ctx,W,H};
}
function emoji(ctx,ch,x,y,boyut){
  // save/restore: önceki fillStyle (ör. gölge saydamlığı) emojiye sızmasın
  ctx.save();
  ctx.globalAlpha=1;
  ctx.fillStyle='#2E2E2E';
  ctx.font=boyut+'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",serif';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(ch,x,y);
  ctx.restore();
}

// Soru görselini kutu genişliğine yaklaştırır.
// Soru görseli cevap kartlarından küçük kalmamalı — çocuk detayı görebilmeli.
function gorseliBuyut(el,kap){
  const uygula=()=>{
    const kutuGen=kap.clientWidth || 0;
    if(!kutuGen) return;
    // Soru görseli bir canvas olabilir ya da birkaç canvas içeren bir kap olabilir.
    // Kap ise içindeki canvas'ları ölçeklemek gerekir; kabı büyütmek yetmez.
    const hedefler = el.tagName==='CANVAS' ? [el] : [...el.querySelectorAll('canvas')];
    if(!hedefler.length) return;
    // En geniş canvas'ı referans al, hepsini aynı oranda büyüt
    let enGenis=0;
    hedefler.forEach(c=>{
      const g=c.getBoundingClientRect().width || parseFloat(c.style.width) || 0;
      if(g>enGenis) enGenis=g;
    });
    if(!enGenis) return;
    const olcek=Math.min(2.2, kutuGen/enGenis);
    if(olcek<=1.02) return;
    hedefler.forEach(c=>{
      const g=c.getBoundingClientRect().width || parseFloat(c.style.width) || 0;
      if(g){ c.style.width=Math.round(g*olcek)+'px'; c.style.height='auto'; }
    });
  };
  if(typeof requestAnimationFrame==='function') requestAnimationFrame(uygula);
  else uygula();
}

// ---- DURUM ----
let ETKINLIKLER=[], sira=0, dogruSayisi=0, denemeSayisi=0, TEMA={};
const HEDEF=10;

function initEtkinlik(etkinlikler,tema){
  ETKINLIKLER=etkinlikler; TEMA=tema;
  const st=document.createElement('style');
  st.textContent=`
    body{background:linear-gradient(135deg,${tema.c1} 0%,${tema.c2} 100%)}
    .baslik h1{color:${tema.koyu}}
    .yonerge{background:${tema.acik};border-color:${tema.orta}}
    .yildiz.dolu{color:${tema.koyu}}
    .btn-ses{background:${tema.koyu}}
    .btn-devam{background:${tema.koyu}}
    .ilerleme-dolu{background:${tema.koyu}}`;
  document.head.appendChild(st);
  yeniEtkinlik();
}

function yeniEtkinlik(){
  denemeSayisi=0;
  const e=pick(ETKINLIKLER)();
  window.__aktif=e;

  document.getElementById('yonergeMetin').textContent=e.yonerge;

  // Soru görseli (varsa) yönerge ile seçenekler arasında gösterilir
  const ust=document.getElementById('soruGorsel');
  ust.innerHTML='';
  if(e.ustGorsel){
    ust.style.display='flex';
    ust.appendChild(e.ustGorsel);
    gorseliBuyut(e.ustGorsel,ust);
  }
  else ust.style.display='none';

  const kutu=document.getElementById('secenekler');
  kutu.innerHTML='';
  kutu.className='secenekler'+(e.secenek.length===2?' ikili':'');

  shuffle([...e.secenek]).forEach(s=>{
    const b=document.createElement('button');
    b.className='kart';
    b.appendChild(e.ciz(s));
    b.onclick=()=>secildi(b,s,e);
    kutu.appendChild(b);
  });

  const g=document.getElementById('geri');
  g.textContent=''; g.className='geri';
  seslendir(e.yonerge);
}

function secildi(btn,secim,e){
  if(btn.disabled)return;
  const g=document.getElementById('geri');

  if(secim===e.dogru){
    document.querySelectorAll('.kart').forEach(k=>k.disabled=true);
    btn.classList.add('dogru');
    dogruSayisi++;
    const mesaj=pick(['Aferin! 🎉','Harikasın! ⭐','Çok güzel! ✨','Bravo! 👏','Doğru buldun! 🌟']);
    g.textContent=mesaj; g.className='geri iyi';
    seslendir(mesaj);
    yildizGuncelle();
    konfeti(16);
    if(window.IO) IO.cevap(true,TEMA.ad);
    setTimeout(()=>{ if(dogruSayisi>=HEDEF) tamamlandi(); else yeniEtkinlik(); },1600);
  }else{
    // Yargısal değil: yönlendirici geri bildirim, etkinlik devam eder
    denemeSayisi++;
    btn.classList.add('salla');
    setTimeout(()=>btn.classList.remove('salla'),450);
    const ipucu = denemeSayisi>=2 && e.ipucu ? e.ipucu
                : pick(['Bir daha bakalım 👀','Başka bir tanesini deneyelim','Acele etme, tekrar bak']);
    g.textContent=ipucu; g.className='geri ipucu';
    seslendir(ipucu);
    if(window.IO) IO.cevap(false,TEMA.ad);
  }
}

function yildizGuncelle(){
  const k=document.getElementById('yildizlar');
  k.innerHTML='';
  for(let i=0;i<HEDEF;i++){
    const s=document.createElement('span');
    s.className='yildiz'+(i<dogruSayisi?' dolu':'');
    s.textContent='★';
    k.appendChild(s);
  }
  document.getElementById('ilerlemeDolu').style.width=(dogruSayisi/HEDEF*100)+'%';
}

function tamamlandi(){
  sesiDurdur();
  document.getElementById('yonergeMetin').textContent='Tebrikler! Bütün yıldızları topladın! 🎉';
  document.getElementById('secenekler').innerHTML=
    '<div class="bitti">🏆<br><span>Harika iş çıkardın!</span></div>';
  document.getElementById('geri').textContent='';
  document.getElementById('devamBtn').textContent='🔄 Yeniden Oyna';
  document.getElementById('devamBtn').onclick=()=>{dogruSayisi=0;yildizGuncelle();
    document.getElementById('devamBtn').textContent='🔊 Tekrar Dinle';
    document.getElementById('devamBtn').onclick=tekrarDinle;yeniEtkinlik();};
  seslendir('Tebrikler! Bütün yıldızları topladın!');
  konfeti(60);
  if(window.IO) IO.oyunBitti(dogruSayisi);
}

function tekrarDinle(){ if(window.__aktif) seslendir(window.__aktif.yonerge); }

function sesDegistir(){
  sesAcik=!sesAcik;
  const b=document.getElementById('sesBtn');
  b.textContent=sesAcik?'🔊':'🔇';
  if(!sesAcik) sesiDurdur(); else tekrarDinle();
}

function konfeti(n){
  const renkler=[TEMA.koyu,TEMA.orta,'#FFD54F','#66BB6A','#4FC3F7'];
  for(let i=0;i<n;i++){
    const c=document.createElement('div');
    c.className='konfeti';
    c.style.left=Math.random()*100+'vw';
    c.style.background=renkler[Math.floor(Math.random()*renkler.length)];
    c.style.animationDuration=(1.3+Math.random()*1.2)+'s';
    document.body.appendChild(c);
    setTimeout(()=>c.remove(),2800);
  }
}
