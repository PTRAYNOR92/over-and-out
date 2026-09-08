/* ============================================================
   THE GAME LOOP — runs 60 times a second, draws whatever should be on screen, and listens for your button presses.
   ============================================================ */

/* ============ loop ============ */
function loop(now){
  if(phase==='ready'||phase==='bowl'||phase==='appeal'){
    const shaking = now<shakeUntil;
    g.save(); if(shaking) g.translate((Math.random()-0.5)*6,(Math.random()-0.5)*6);
    field();
    let p=0, rup=1;
    if(phase==='bowl'){ const tt=now-t0, ru=SHOW_BOWLER?(ball.runup||0):0;
      rup = clamp(tt/ru, 0, 1);
      p   = clamp((tt-ru)/ball.dur, 0, 1); }
    else if(phase==='appeal') p=1;
    if(phase==='bowl' && lastP<0.56 && p>=0.56){
      try{ if(ball.contact==='pad'){sPad(); crowd(0.09,0.9); shakeUntil=now+150;} else if(ball.contact==='bat')sBat(); else if(ball.contact==='edge')sEdge(); }catch(e){} }
    lastP=p;
    striker(poseAt(p, ball?ball.shot:'defend'));
    if(phase==='bowl'){ bowlerFig(rup, ball.type, p); pitchPuff(p,ball); if(p>0){ const o=ballPath(p,ball); if(!o.gone) drawBall(o,ball); } }
    if(phase==='appeal' && ball.contact!=='miss'){ const o=ballPath(1,ball); drawBall(o,ball); }
    for(let i=0;i<6;i++){ const x=CX-75+i*30, r=results[i];
      g.fillStyle = r==='correct'?'#3ad17f':r==='wrong'?'#ff5a4d':r==='umpire'?'#ffd23f':(i===idx?'rgba(234,241,246,.8)':'rgba(234,241,246,.22)');
      g.beginPath(); g.arc(x,146,i===idx?7:5,0,7); g.fill(); }
    if(phase==='appeal'){
      rr(40,170,178,38,9); g.fillStyle='rgba(8,14,20,.85)'; g.fill(); g.strokeStyle='#26384a'; g.lineWidth=1.2; g.stroke();
      txt(ball.typeLabel+' · '+ball.mph+' MPH',129,194,'700 14px "Barlow Condensed"','#8fe8d8','center');
      if(ball.contact==='pad'){ const w=1+Math.sin(now/90)*0.04;
        g.save(); g.translate(CX,250); g.scale(w,w);
        if(CLIP){ txt('OUT or NOT OUT?',0,0,'400 46px Anton','rgba(255,210,63,.95)','center'); txt('you’re the umpire 👇',0,36,'700 17px "Barlow Condensed"','#dfe9f2','center'); }
        else txt('HOWZAT?!',0,0,'400 52px Anton','rgba(255,210,63,.92)','center'); g.restore(); } }
    if(phase==='bowl' && p>=1) appeal();
    if(phase==='ready'){ txt(idx===0?'▶  BOWL TO BEGIN THE OVER':'▶  NEXT BALL',CX,470,'700 22px "Barlow Condensed"','#36e3c8','center'); }
    g.restore();
  } else if(phase==='reveal'||phase==='result'){
    const rt = phase==='result'?1:clamp((now-t0)/1700,0,1);
    drawReveal(rt, ball, call);
    if(phase==='reveal' && rt>=1) result();
  } else if(phase==='summary'){
    drawSummary(results, pts, dateStr, daily, streak);
  }
  requestAnimationFrame(loop);
}
/* CLIP MODE: tap the pitch — ready→bowl, appeal→reveal, result→next ball (fresh over each cycle) */
if(CLIP){ E('cv').addEventListener('click',()=>{
  if(phase==='ready') bowl();
  else if(phase==='appeal') decide('out');
  else if(phase==='result'){ idx=(idx+1)%6; if(idx===0){ over=buildOver('clip-'+Math.random()); } ball=over[idx]; bowl(); }
}); }
E('bOut').onclick=()=>decide('out');
E('bNot').onclick=()=>decide('notout');
E('bAct').onclick=()=>{ if(phase==='ready') bowl();
  else if(phase==='result'){ if(idx>=5){ summary(); } else { idx++; setScore(); bowl(); } }
  else if(phase==='summary') practice(); };
E('bShare').onclick=()=>{ const marks=results.map(r=>r==='correct'?'✅':r==='wrong'?'❌':'🟡').join('');
  const base = location.protocol.startsWith('http') ? (location.origin+location.pathname) : 'https://overandoutgame.com/';
  const url  = CUSTOM ? (base+'?over='+encodeURIComponent(CUSTOM)) : base;
  const head = CUSTOM ? ('Over & Out 🏏 '+CUSTOM+'’s over') : ('Over & Out 🏏 '+(daily?dateStr:'practice'));
  const fire = (daily&&streak>1) ? ('\n🔥 '+streak+'-day streak') : '';
  const dare = CUSTOM ? '\nSame six balls for everyone — beat my score:' : '\nCan you out-umpire me? New over every day:';
  const text = head+'\n'+marks+'\n'+pts+'/6 — '+rankFor(pts)+fire+dare+'\n'+url;
  if(navigator.share){ navigator.share({text:text}).then(()=>setHint('Sent — let’s see them beat it 🏏')).catch(()=>{}); return; }
  try{ navigator.clipboard.writeText(text).then(()=>setHint('Copied! Paste it in the group chat.')).catch(()=>alert(text)); }catch(e){ alert(text); } };
E('bRules').onclick=()=>{ E('rules').style.display='none'; store.set('oo-rules-seen','1'); };
E('bHelp').onclick=()=>{ E('rules').style.display='flex'; };
window.addEventListener('keydown',e=>{ if(e.key==='o')decide('out'); else if(e.key==='n')decide('notout'); });
setScore(); fit(); requestAnimationFrame(loop);
globalThis.__game={makeBall,buildOver,drawReveal,ballPath,field,striker,poseAt,drawSummary,rankFor,flightPt,pitchPuff,drawBall};
