/* ============================================================
   THE DELIVERIES — invents each ball: where it pitches, where it hits him, whether it was really out. Also builds the six-ball over.
   ============================================================ */

/* ============ deliveries: one shared trajectory; pace, swing & turn ============ */
function makeBall(rng){
  const R=rng||Math.random;
  const rnd=(a,b)=>a+R()*(b-a), pick=a=>a[Math.floor(R()*a.length)];
  const roll=R();
  const verdict= roll<0.34?'out' : roll<0.88?'notout' : 'umpire';
  let shot='defend', contact='pad', pol=false, ioo=false, w='hitting', reason='';
  let p=0, i=0, s=0, iY=516, sY=478, pY=0, forceType=null; // lateral offsets from CX; s must CONTINUE the p->i direction
  const cont=(pp,ii)=>ii+(ii-pp)*0.18;  // straight-line continuation of the flight trend
  const GOOD=()=>rnd(695,748), FULL=()=>rnd(640,676), YORK=()=>rnd(588,614), SHORT=()=>rnd(782,822);
  if(verdict==='out'){
    const kind=pick(['defOut','defOut','leaveStraight','leaveOffOut','yorker','backTrap','ripper','ripper']);
    if(kind==='defOut'){ p=rnd(-24,24); i=rnd(-6,6); s=clamp(cont(p,i)+Math.sign(i-p)*rnd(0,2),-9,9); iY=rnd(508,522); pY=R()<.4?FULL():GOOD();
      reason=p<-19?'Angling in from outside off — struck in line, hitting.':'Beaten on the pad — pitched in line, hitting the stumps.'; }
    else if(kind==='ripper'){ forceType='spin'; p=-rnd(26,38); i=rnd(-4,2); s=clamp(cont(p,i)+rnd(0,1),-9,9); iY=rnd(508,520); pY=GOOD();
      reason='Rips back a mile — pitched outside off, spinning in, hitting!'; }
    else if(kind==='leaveStraight'){ shot='leave'; p=rnd(-16,12); i=rnd(-5,5); s=clamp(cont(p,i)+Math.sign(i-p)*rnd(0,2),-9,9); iY=rnd(508,520); pY=GOOD();
      reason='Left a straight one! Pitched in line, crashing into the stumps.'; }
    else if(kind==='leaveOffOut'){ shot='leave'; ioo=true; forceType='spin'; i=-rnd(19,22); p=i-rnd(48,58);
      s=clamp(cont(p,i)+rnd(1,4),-9,-3); iY=rnd(508,520); pY=GOOD();
      reason='No shot offered — impact outside off does NOT save him. Ripping back, hitting.'; }
    else if(kind==='yorker'){ forceType='fast'; p=rnd(-9,9); i=clamp(p*0.7+rnd(-2,2),-8,8); s=clamp(cont(p,i)+Math.sign(i-p)*rnd(0,1),-9,9);   // yorkers skid straight — no time to deviate
      pY=YORK(); iY=rnd(534,548); sY=rnd(528,545);
      reason='Yorker! Speared in under the bat — crushing the base of the stumps.'; }
    else { shot='backdef'; p=rnd(-14,14); i=rnd(-6,6); s=clamp(cont(p,i)+Math.sign(i-p)*rnd(0,2),-9,9);
      pY=SHORT(); iY=rnd(480,498); sY=rnd(452,472);
      reason='Stuck on the crease, rapped in front off the back foot — hitting.'; }
  } else if(verdict==='umpire'){
    shot=pick(['defend','defend','backdef','leave']);
    const big = R()<0.55 && shot!=='backdef';
    const sgn = big ? 1 : (R()<.5?-1:1);                                  // big rippers pitch OFF side and turn to clip leg — never from outside leg
    if(big){ forceType='spin'; i=sgn*rnd(5,9); p=i-sgn*rnd(40,55); }      // huge turner, just clipping — has it done too much?
    else   { i=sgn*rnd(11,14); p=i-sgn*rnd(6,18); }                       // angling at the edge of the stumps
    s=sgn*clamp(Math.abs(cont(p,i))+rnd(0,1.5),13,17); w='clipping';      // clip point CONTINUES the flight — no post-pad swerve
    pY=shot==='backdef'?SHORT():GOOD();
    if(shot==='backdef'){ iY=rnd(482,500); sY=rnd(455,472); } else iY=rnd(508,520);
    reason='Just clipping the stumps — umpire’s call. Your decision stands.';
  } else {
    const kinds=['beaten','outLegDef','offShot','offShot','missLeg','missLeg','leaveMiss','leaveMiss','leaveOutLeg'];  // overTop removed — height doesn't read in this view (Pat, v10)
    if(BAT_BALLS) kinds.push('bat','bat','edge','yorkerDug');
    const kind=pick(kinds);
    if(kind==='bat'){ shot='drive'; contact='bat'; p=rnd(-22,22); i=rnd(-5,5); s=i; w='missing'; pY=R()<.5?FULL():GOOD();
      reason='Middle of the bat — he played it.'; }
    else if(kind==='edge'){ contact='edge'; p=rnd(-18,14); i=-rnd(5,7); s=i; w='missing'; pY=GOOD();
      reason='Thin inside edge onto the pad — not out.'; }
    else if(kind==='beaten'){ contact='miss'; p=-rnd(0,20); i=p-rnd(4,12); s=i; w='missing'; pY=GOOD();
      reason='Beat the outside edge — through to the keeper.'; }
    else if(kind==='outLegDef'){ pol=true; p=rnd(34,48); i=rnd(-4,8); s=clamp(cont(p,i)+Math.sign(i-p)*rnd(0,2),-9,9); iY=rnd(508,522); pY=GOOD();
      reason='Thuds the pad, but pitched outside leg — can’t be out.'; }
    else if(kind==='offShot'){ ioo=true; i=-rnd(22,25); p=i-rnd(4,12); s=cont(p,i)+rnd(0,1.5); w='missing'; iY=rnd(508,522); pY=GOOD();
      reason='Struck outside off with a shot offered — not out.'; }
    else if(kind==='overTop'){ shot='backdef'; w='over'; pY=SHORT(); iY=rnd(456,472); sY=rnd(406,428);
      p=rnd(-16,16); i=rnd(-6,6); s=clamp(cont(p,i),-9,9);
      reason='Hit high on the back foot — clearing the top of the stumps.'; }
    else if(kind==='missLeg'){ forceType='spin'; i=rnd(11,14); p=i-rnd(50,64); s=Math.abs(cont(p,i))+rnd(0.5,3); w='missing'; iY=rnd(508,522); pY=GOOD();
      reason='Ripping out of the rough — turned too much, sliding past leg.'; }
    else if(kind==='leaveMiss'){ shot='leave'; contact='miss'; p=-rnd(8,26); i=p-rnd(6,14); s=i; w='missing'; pY=GOOD();
      reason='Shouldered arms — well left outside off.'; }
    else if(kind==='yorkerDug'){ forceType='fast'; shot='drive'; contact='bat'; p=rnd(-14,14); i=rnd(-6,6); s=i; w='missing'; pY=YORK();
      reason='Yorker dug out at the last instant — bat first.'; }
    else { shot='leave'; pol=true; p=rnd(34,48); i=rnd(-2,8); s=clamp(cont(p,i)+Math.sign(i-p)*rnd(0,2),-9,9); iY=rnd(508,522); pY=GOOD();
      reason='Thuds the pad but pitched outside leg — not out.'; }
  }
  if(!pY) pY=GOOD();
  if(Math.abs(i-p)>=24 && !forceType) forceType='spin';   // big lateral movement off the pitch = spin, never a fast ball jagging silly
  const pX=CX+p, iX=CX+i, sX=CX+s;
  /* pace / swing / turn character */
  const type=forceType||pick(['fast','fast','medium','medium','medium','spin','spin']);
  let mph, dur, sw;
  if(type==='fast'){ mph=Math.round(rnd(85,93)); dur=rnd(1050,1200); sw=(R()<.5?-1:1)*rnd(10,38); }
  else if(type==='medium'){ mph=Math.round(rnd(74,82)); dur=rnd(1380,1600); sw=(R()<.5?-1:1)*rnd(8,30); }
  else { mph=Math.round(rnd(47,55)); dur=rnd(2050,2350); sw=(R()<.5?-1:1)*rnd(5,13); }
  const runup = type==='fast'?950 : type==='medium'?820 : 680;   // pace sprints in, spin ambles
  const relX  = (type==='spin' ? R()<.45 : R()<.28) ? 26 : -22;   // round the wicket vs over — different angle across the pitch
  const armLabel = relX>0 ? 'ROUND THE WICKET' : 'OVER THE WICKET';
  const turn=iX-pX;
  const typeLabel = type==='spin' ? (turn>2?'OFF SPIN':turn<-2?'LEG SPIN':'SPIN') : type==='fast'?'FAST':'MEDIUM';
  const lenLabel = pY<=618?'YORKER':pY<=680?'FULL':pY<=760?'GOOD LENGTH':'SHORT';
  return { shot, contact, truth:verdict, reason, pitchOutsideLeg:pol, impactOutsideOff:ioo, wicketsState:w,
    type, typeLabel, mph, dur, sw, lenLabel, runup, relX, armLabel,
    pitchPt:[pX,pY], impactPt:[iX, contact==='miss'?300:(contact==='pad'?iY:(contact==='edge'?480:(pY<=618?538:494)))], stumpPt:[sX,sY] };
}
function mulberry32(a){ return function(){ let t=a+=0x6D2B79F5; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; }; }
function hashStr(s){ let h=2166136261; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; }
function diffScore(b){
  let d=0;
  if(b.truth==='umpire') d+=5;                                   // marginal by definition
  if(b.contact==='edge') d+=4;                                   // did he hit it?
  else if(b.contact==='bat') d+=2;
  if(Math.abs(b.impactPt[0]-b.pitchPt[0])>=24) d+=3;             // rippers — how far has it come back?
  if(b.lenLabel==='YORKER') d+=2;
  if(b.wicketsState==='over') d+=2;                              // height judgment
  if(b.type==='fast') d+=1;
  if(b.contact==='pad' && Math.abs(Math.abs(b.stumpPt[0]-CX)-11)<5) d+=2;  // near the hit/miss boundary
  return d;
}
const RAMP=[1.06,1.03,1.00,0.97,0.95,0.93];                      // the over quickens as it goes
function hardenOver(balls){
  balls.sort((a,b)=>diffScore(a)-diffScore(b));                  // easy first, nightmare last
  balls.forEach((b,ix)=>{ b.dur=Math.round(b.dur*RAMP[ix]); b.mph=Math.round(b.mph/RAMP[ix]); });
  return balls;
}
function buildOver(seedStr){
  const rng=mulberry32(hashStr(seedStr));
  for(let tries=0;tries<500;tries++){
    const balls=[]; for(let i=0;i<6;i++) balls.push(makeBall(rng));
    const outs=balls.filter(b=>b.truth==='out').length, umps=balls.filter(b=>b.truth==='umpire').length,
          lvs=balls.filter(b=>b.shot==='leave').length, types=new Set(balls.map(b=>b.type)), lens2=new Set(balls.map(b=>b.lenLabel)),
          bigTurn=balls.filter(b=>Math.abs(b.impactPt[0]-b.pitchPt[0])>=28).length,   // huge spinner
          bigSwing=balls.filter(b=>Math.abs(b.sw)>=26).length,                          // huge swinger
          roundW=balls.filter(b=>b.relX>0).length,                                      // round the wicket
          hards=balls.filter(b=>diffScore(b)>=5).length;
    if(outs>=1&&outs<=3&&umps<=2&&lvs>=1&&types.size>=2&&lens2.size>=3&&bigTurn>=1&&bigSwing>=1&&roundW>=1&&hards>=2) return hardenOver(balls);
  }
  return hardenOver([makeBall(rng),makeBall(rng),makeBall(rng),makeBall(rng),makeBall(rng),makeBall(rng)]);
}
