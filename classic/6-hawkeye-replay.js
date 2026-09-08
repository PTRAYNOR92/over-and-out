/* ============================================================
   THE HAWK-EYE REPLAY — the Sky-style review screen with the tracking line and the PITCHING / IMPACT / WICKETS boxes.
   ============================================================ */

/* ============ Sky-style review boxes ============ */
const NAVY='#16324f', SKYRED='#d92a1c', SKYAMBER='#e89b00';
function skyBox(x,y,w,label,value,valCol,pop){
  const lh=26, vh=34, s=pop!==undefined?pop:1;
  g.save(); g.translate(x+w/2,y+(lh+vh)/2); g.scale(s,s); g.translate(-(x+w/2),-(y+(lh+vh)/2));
  rr(x,y,w,lh,4); g.fillStyle=NAVY; g.fill(); g.strokeStyle='rgba(255,255,255,.25)'; g.lineWidth=1; g.stroke();
  txt(label,x+w/2,y+18,'700 15px "Barlow Condensed"','#dfe9f2','center');
  rr(x,y+lh+3,w,vh,4); g.fillStyle=valCol; g.fill(); g.strokeStyle='rgba(255,255,255,.3)'; g.lineWidth=1; g.stroke();
  txt(value,x+w/2,y+lh+3+23,'700 17px "Barlow Condensed"','#fff','center');
  g.restore();
}
function popScale(rt,at){ const k=clamp((rt-at)/0.06,0,1); return k>=1?1:0.6+0.55*ease(k); }

/* ============ Hawk-Eye replay ============ */
function replayStumps(b, lit){
  const base=556, top=440, sp=16, hit=(b.wicketsState==='hitting'||b.wicketsState==='clipping');
  if(lit&&hit){ g.globalAlpha=.22; g.fillStyle=b.wicketsState==='clipping'?SKYAMBER:'#ff5a4d'; g.beginPath(); g.ellipse(CX,(top+base)/2,44,74,0,0,7); g.fill(); g.globalAlpha=1; }
  const col=(lit&&hit)?(b.wicketsState==='clipping'?'#ffd23f':'#ff6a5d'):'#efe6cf';
  for(let i=-1;i<=1;i++){ g.fillStyle=col; g.fillRect(CX+i*sp-2.6,top,5.2,base-top); }
  g.fillStyle=(lit&&hit&&b.wicketsState!=='clipping')?'#ff8f84':'#d8cdb0'; g.fillRect(CX-sp-1,top-3.5,sp,4); g.fillRect(CX+1,top-3.5,sp,4);
}
function drawCorridor(){
  const hw=y=>95+155*(y-498)/502, f=0.16, yTop=458, yBot=980;
  const lx=y=>CX-f*hw(y), rx=y=>CX+f*hw(y);
  g.fillStyle='rgba(255,255,255,.04)';
  g.beginPath(); g.moveTo(lx(yTop),yTop); g.lineTo(rx(yTop),yTop); g.lineTo(rx(yBot),yBot); g.lineTo(lx(yBot),yBot); g.closePath(); g.fill();
  g.setLineDash([11,9]); g.strokeStyle='rgba(255,255,255,.30)'; g.lineWidth=2;
  g.beginPath(); g.moveTo(lx(yTop),yTop); g.lineTo(lx(yBot),yBot); g.stroke();
  g.beginPath(); g.moveTo(rx(yTop),yTop); g.lineTo(rx(yBot),yBot); g.stroke(); g.setLineDash([]);
}
function quadPts(a,c,b,n){ const out=[]; for(let i=0;i<=n;i++){ const t=i/n;
  out.push([ (1-t)*(1-t)*a[0]+2*(1-t)*t*c[0]+t*t*b[0], (1-t)*(1-t)*a[1]+2*(1-t)*t*c[1]+t*t*b[1] ]); } return out; }
function drawHawkeye(b, rt){
  const pitch=b.pitchPt, impact=b.impactPt, end=b.stumpPt;
  const a=clamp(rt/0.5,0,1);
  g.lineCap='round'; g.lineJoin='round'; g.strokeStyle='#f4f8fa'; g.lineWidth=5;
  let head;
  g.beginPath();
  const kMax = a<0.55 ? a/0.55 : 1;
  const [x0,y0]=flightPt(0,b,992); g.moveTo(x0,y0);
  const N=22, upto=Math.max(1,Math.round(kMax*N));
  for(let i=1;i<=upto;i++){ const [x,y]=flightPt(i/N,b,992); g.lineTo(x,y); head=[x,y]; }
  if(a>=0.55){ const k=(a-0.55)/0.45; head=[lerp(pitch[0],impact[0],k),lerp(pitch[1],impact[1],k)]; g.lineTo(pitch[0],pitch[1]); g.lineTo(head[0],head[1]); }
  g.stroke();
  if(rt>0.28){ g.fillStyle='#ffb12e'; g.beginPath(); g.arc(pitch[0],pitch[1],7,0,7); g.fill(); }
  if(rt>0.5 && b.contact==='pad'){ g.fillStyle='#fff'; g.beginPath(); g.arc(impact[0],impact[1],7,0,7); g.fill(); }
  if(rt>0.5 && b.contact==='pad'){
    const p=clamp((rt-0.5)/0.38,0,1);
    const ctrl=[impact[0]+(impact[0]-pitch[0])*0.25, impact[1]+(impact[1]-pitch[1])*0.25];
    const pts=quadPts(impact,ctrl,end,24), upto2=Math.max(1,Math.round(p*24));
    g.setLineDash([8,8]); g.lineWidth=4; g.strokeStyle='rgba(244,248,250,.85)'; g.beginPath(); g.moveTo(pts[0][0],pts[0][1]);
    for(let i=1;i<=upto2;i++) g.lineTo(pts[i][0],pts[i][1]); g.stroke(); g.setLineDash([]);
    if(p>=1){ g.fillStyle=b.wicketsState==='hitting'?'#ff5a4d':b.wicketsState==='clipping'?'#ffd23f':'#3ad17f'; g.beginPath(); g.arc(end[0],end[1],8,0,7); g.fill(); }
  }
  if(b.contact!=='pad' && a>=1 && b.contact!=='miss'){
    g.strokeStyle='#caa46a'; g.lineWidth=9; g.beginPath(); g.moveTo(impact[0]-2,impact[1]-28); g.lineTo(impact[0]+2,impact[1]+16); g.stroke();
  }
  if(a<1&&head){ g.fillStyle='#ff5a4d'; g.beginPath(); g.arc(head[0],head[1],8,0,7); g.fill(); }
}
function drawReveal(rt, b, call){
  field();
  g.fillStyle='rgba(6,10,16,.34)'; g.fillRect(0,0,W,H);
  txt('BALL TRACKING',40,64,'400 26px Anton','#eaf1f6'); txt('HAWK-EYE',40,86,'700 13px "Barlow Condensed"','#8fe8d8'); g.fillStyle='#8fe8d8'; g.fillRect(40,94,120,3);
  rr(486,44,234,36,9); g.fillStyle='rgba(8,14,20,.85)'; g.fill(); g.strokeStyle='rgba(255,255,255,.3)'; g.lineWidth=1.2; g.stroke();
  txt(b.typeLabel+' · '+b.mph+' MPH · '+b.lenLabel,603,67,'700 14px "Barlow Condensed"','#dfe9f2','center');
  rr(486,86,234,28,9); g.fillStyle='rgba(8,14,20,.7)'; g.fill(); g.strokeStyle='rgba(255,255,255,.18)'; g.lineWidth=1; g.stroke();
  txt(b.armLabel||'OVER THE WICKET',603,105,'700 12px "Barlow Condensed"','#8aa0b0','center');
  const lit=rt>0.86;
  if(b.contact==='pad') drawCorridor();
  replayStumps(b,lit);
  drawHawkeye(b,rt);

  const bx=W-40-190, bw=190, GREEN='#1d8a4e';
  if(b.contact==='pad'){
    const pitLabel = b.pitchOutsideLeg?'OUTSIDE LEG':(b.pitchPt[0]<CX-19?'OUTSIDE OFF':'IN LINE');
    const impLabel = b.impactOutsideOff?'OUTSIDE OFF':'IN LINE';
    const wLabel   = b.wicketsState==='clipping'?'UMPIRE’S CALL':(b.wicketsState==='hitting'?'HITTING':b.wicketsState==='over'?'GOING OVER':'MISSING');
    const pitCol   = b.pitchOutsideLeg?GREEN:SKYRED;                              // outside leg saves him → green
    const impCol   = (b.impactOutsideOff && b.shot!=='leave')?GREEN:SKYRED;        // outside off + shot offered saves him → green
    const wCol     = b.wicketsState==='clipping'?SKYAMBER:(b.wicketsState==='hitting'?SKYRED:GREEN);  // not hitting → green
    if(rt>0.32){ skyBox(bx,646,bw,'PITCHING',pitLabel,pitCol,popScale(rt,0.32));
      g.strokeStyle='rgba(255,255,255,.35)'; g.lineWidth=1.5; g.beginPath(); g.moveTo(bx-6,678); g.lineTo(b.pitchPt[0]+12,b.pitchPt[1]); g.stroke(); }
    if(rt>0.56){ skyBox(bx,506,bw,'IMPACT',impLabel,impCol,popScale(rt,0.56));
      g.strokeStyle='rgba(255,255,255,.35)'; g.lineWidth=1.5; g.beginPath(); g.moveTo(bx-6,538); g.lineTo(b.impactPt[0]+12,b.impactPt[1]); g.stroke();
      if(b.impactOutsideOff){ const sn=b.shot==='leave'; rr(bx,506+66,bw,26,4); g.fillStyle=sn?SKYRED:NAVY; g.fill();
        g.strokeStyle='rgba(255,255,255,.3)'; g.lineWidth=1; g.stroke();
        txt(sn?'NO SHOT OFFERED':'SHOT OFFERED',bx+bw/2,506+66+18,'700 13px "Barlow Condensed"','#fff','center'); } }
    if(rt>0.9){ skyBox(bx,380,bw,'WICKETS',wLabel,wCol,popScale(rt,0.9)); }
  } else {
    const label=b.contact==='miss'?(b.shot==='leave'?'WELL LEFT':'NO BAT'):b.contact==='edge'?'INSIDE EDGE':'BAT FIRST';
    if(rt>0.6) skyBox(bx,470,bw,'ULTRAEDGE',label,b.contact==='edge'?SKYAMBER:NAVY,popScale(rt,0.6));
  }

  const out=b.truth==='out', um=b.truth==='umpire';
  const vCol=out?SKYRED:um?SKYAMBER:'#1d8a4e', word=out?'OUT':um?'UMPIRE’S CALL':'NOT OUT';
  rr(40,858,300,26,4); g.fillStyle=NAVY; g.fill(); g.strokeStyle='rgba(255,255,255,.25)'; g.lineWidth=1; g.stroke();
  txt('DECISION',190,876,'700 15px "Barlow Condensed"','#dfe9f2','center');
  rr(40,887,300,58,4); g.fillStyle=vCol; g.fill(); g.strokeStyle='rgba(255,255,255,.3)'; g.lineWidth=1; g.stroke();
  txt(word,190,927,um?'400 26px Anton':'400 36px Anton','#fff','center');
  rr(356,858,364,87,6); g.fillStyle='rgba(8,12,18,.9)'; g.fill(); g.strokeStyle='#26384a'; g.lineWidth=1.2; g.stroke();
  let res,rc; if(CLIP){res=um?'UMPIRE’S CALL':'THE ANSWER';rc=um?'#ffd23f':(out?'#ff5a4d':'#3ad17f');}
  else if(um){res='No harm done — your call stands';rc='#ffd23f';}
  else if(call===b.truth){res='✓ Correct';rc='#3ad17f';} else {res=out?'✗ You turned it down':'✗ You gave him';rc='#ff5a4d';}
  txt(res,374,888,'700 20px "Barlow Condensed"',rc);
  (function(){ const words=b.reason.split(' '); let line='',y=912;
    for(const w2 of words){ if((line+w2).length>44){ txt(line,374,y,'600 13px Inter','#8aa0b0'); line=w2+' '; y+=18; if(y>940)break; } else line+=w2+' '; }
    if(line&&y<=940) txt(line,374,y,'600 13px Inter','#8aa0b0'); })();
  if(rt<0.14){ g.globalAlpha=(0.14-rt)/0.14*0.85; g.fillStyle='#06090e'; g.fillRect(0,0,W,H); g.globalAlpha=1; }
}
