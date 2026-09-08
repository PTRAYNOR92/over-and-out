/* ============================================================
   GAME STATE — the score, the streak, what's saved in the browser, and the buttons' text.
   ============================================================ */

/* ============ state ============ */
const E=id=>document.getElementById(id);
function todayStr(){ const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
/* URL modes: ?clip=1 = clean recording mode (no chrome, tap to advance, no verdict chatter);
   ?over=NAME = a custom over seeded from that name — same 6 balls for everyone with the link. Plays like practice: no lock, no stats. */
let CLIP=false, CUSTOM=null;
try{ const qp=new URLSearchParams(location.search); CLIP=qp.has('clip'); CUSTOM=qp.get('over'); }catch(e){}
if(CLIP){ try{ document.body.classList.add('clip'); }catch(e){} }
let dateStr=todayStr(), daily=!CUSTOM, over=buildOver(CUSTOM ? ('custom-'+CUSTOM.toLowerCase()) : ('over-and-out-'+dateStr));
let idx=0, ball=over[0], phase='ready', t0=0, call=null, lastP=0, shakeUntil=0;
let results=[], pts=0, streak=0, alreadyDone=false, practicedToday=false;
let stats={played:0, ptsSum:0, best:0, dist:[0,0,0,0,0,0,0]};   // dist buckets = floor(points) 0..6
/* storage that works anywhere: window.storage if present, else browser localStorage (which is what a real website has) */
const store={
  async get(k){ try{ if(window.storage){ const r=await window.storage.get(k); return r&&r.value?r.value:null; } return localStorage.getItem(k); }catch(e){ return null; } },
  async set(k,v){ try{ if(window.storage){ await window.storage.set(k,v); } else localStorage.setItem(k,v); }catch(e){} }
};
(async()=>{ try{
  const sraw=await store.get('oo-stats'); if(sraw){ const s=JSON.parse(sraw); if(s&&s.dist) stats=s; }
  const raw=await store.get('oo-meta'); const m=raw?JSON.parse(raw):null;
  if(m){ if(m.lastDate===dateStr) streak=m.streak; else { const y=new Date(); y.setDate(y.getDate()-1);
    const yStr=y.getFullYear()+'-'+String(y.getMonth()+1).padStart(2,'0')+'-'+String(y.getDate()).padStart(2,'0');
    if(m.lastDate===yStr) streak=m.streak; } }
  /* first visit? show the rules card (skippable, reopenable via ?) */
  const seen=await store.get('oo-rules-seen');
  const praw=await store.get('oo-practice'); if(praw===dateStr) practicedToday=true;
  if(!seen && !CLIP && !CUSTOM){ E('rules').style.display='flex'; }
  /* already played today's over? restore the result and lock it (daily mode only) */
  const draw=await store.get('oo-daily'); const d=draw?JSON.parse(draw):null;
  if(!CUSTOM && !CLIP && d && d.date===dateStr){ alreadyDone=true; results=d.results; pts=d.pts; phase='summary';
    show(false,true,practiceLabel(),true); setHint('You’ve played today’s over. Come back tomorrow for six new balls.'); }
}catch(e){} })();
async function saveMeta(){ try{
  const raw=await store.get('oo-meta'); let m=raw?JSON.parse(raw):{lastDate:'',streak:0};
  if(m.lastDate!==dateStr){ const y=new Date(); y.setDate(y.getDate()-1); const yStr=y.getFullYear()+'-'+String(y.getMonth()+1).padStart(2,'0')+'-'+String(y.getDate()).padStart(2,'0');
    m.streak = m.lastDate===yStr ? (m.streak+1) : 1; m.lastDate=dateStr; streak=m.streak;
    await store.set('oo-meta', JSON.stringify(m)); }
  const draw2=await store.get('oo-daily'); const d2=draw2?JSON.parse(draw2):null;
  if(!d2 || d2.date!==dateStr){   // first completion today → count it in lifetime stats
    stats.played++; stats.ptsSum+=pts; stats.best=Math.max(stats.best,pts);
    stats.dist[Math.min(6,Math.floor(pts))]++;
    await store.set('oo-stats', JSON.stringify(stats)); }
  await store.set('oo-daily', JSON.stringify({date:dateStr, results, pts}));   // lock today's over
}catch(e){} }
function setHint(h){E('hint').textContent=h;}
function setScore(){E('score').innerHTML='BALL <b>'+Math.min(idx+1,6)+'/6</b><br>POINTS <b>'+pts+'</b>';}
function show(decide,act,actLabel,share){ E('decide').style.display=decide?'grid':'none';
  E('bAct').style.display=act?'block':'none'; if(actLabel)E('bAct').textContent=actLabel;
  const sh=E('bShare'); sh.style.display=share?'block':'none';
  sh.className = share ? 'wide' : 'wide ghost';      /* share = bright primary when shown */
  sh.style.order = share ? '-1' : '';                /* …and sits ABOVE the practice button */
  E('bAct').className = share ? 'wide ghost' : 'wide'; }

function bowl(){ ensureAudio(); ball=over[idx]; phase='bowl'; t0=performance.now(); call=null; lastP=0;
  show(false,false); setHint(ball.typeLabel.toLowerCase()+' — watch it…'); }
function appeal(){ phase='appeal'; show(true,false); E('bOut').disabled=false; E('bNot').disabled=false;
  setHint(ball.contact==='pad'?'HOWZAT! — your call, umpire':'There’s an appeal — out or not?'); }
function decide(c){ if(phase!=='appeal')return; call=c; phase='reveal'; t0=performance.now();
  E('bOut').disabled=true; E('bNot').disabled=true; show(false,false); setHint('Checking with the third umpire…'); }
function result(){ phase='result';
  try{ if(ball.truth==='out') crowd(0.22,1.6); }catch(e){}
  let r; if(ball.truth==='umpire'){ r='umpire'; pts+=1; }
  else if(call===ball.truth){ r='correct'; pts+=1; try{sGood();}catch(e){} }
  else { r='wrong'; try{sBad();}catch(e){} }
  results.push(r); setScore();
  const last=idx>=5;
  show(false,true, last?'🏁 Over summary':'▶ Next ball');
  setHint(r==='umpire'?'Umpire’s call — too close to call, full point either way.':(r==='correct'?'Well judged.':'The third umpire disagrees.')); }
function summary(){ phase='summary'; if(daily) saveMeta();
  show(false,true,practiceLabel(),true); setHint(CUSTOM?'Now try today’s daily over — six new balls, same for everyone.':'Come back tomorrow for a new daily over.'); }
function practiceLabel(){ return CUSTOM ? '▶ Play today’s daily over' : (practicedToday ? '🏏 Six new balls tomorrow' : '▶ Play one practice over'); }
function practice(){
  if(CUSTOM){ location.href = location.origin+location.pathname; return; }   /* named over → funnel into the daily */
  if(practicedToday){ setHint('Practice used — six new balls tomorrow 🏏'); return; }   /* one per day keeps you hungry */
  practicedToday=true; store.set('oo-practice',dateStr);
  daily=false; over=buildOver('practice-'+Math.random()); idx=0; results=[]; pts=0; ball=over[0]; phase='ready';
  setScore(); show(false,true,'▶ Bowl'); setHint('Practice over — anything goes. One per day.'); }
