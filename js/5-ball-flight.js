/* ============================================================
   BALL FLIGHT — works out where the ball is at any moment and draws it, plus the bowler and the puff of dust.
   ============================================================ */

/* ============ shared flight (swing curve) — used by live ball AND replay ============ */
function flightPt(k, b, releaseY){ // k 0..1 release->pitch
  const sws=Math.sin(k*Math.PI); const x = lerp(CX+(b.relX||0), b.pitchPt[0], k) + b.sw*sws*sws;   // sin² swing: full banana mid-air, arrives at the pitch travelling straight — no late reversal
  const y = lerp(releaseY, b.pitchPt[1], ease(k));
  return [x,y];
}
function ballPath(p, b){
  const cy=0.56, imp=b.impactPt;
  if(p<=0.5){ const k=p/0.5; const [x,y]=flightPt(k,b,992); return {x,y,r:lerp(18,9,k),flying:true,k}; }
  if(p<=cy){ const k=(p-0.5)/(cy-0.5);
    const y = lerp(b.pitchPt[1],imp[1],k)-Math.sin(k*Math.PI)*6;
    const shadowY = lerp(b.pitchPt[1], 562, k);        // where the ground is under the ball — the gap IS the height
    return {x:lerp(b.pitchPt[0],imp[0],k), y, r:lerp(9,7,k), flying:true, shadowY, shadowK:k}; }
  const k=clamp((p-cy)/(1-cy),0,1);
  if(b.contact==='miss'){ return {x:imp[0]+6*k, y:lerp(imp[1],40,Math.min(1,k*1.5)), r:lerp(7,4,k), gone:k>=0.99}; }
  // after contact: pad = dead drop at the feet; bat = pops off the blade, out in front, rolls toward the bowler; edge = squirts aside
  const gy = b.contact==='bat'?648 : b.contact==='edge'?606 : 598;
  const dx = b.contact==='bat'?-10*k : b.contact==='edge'?7*k : 2*k;
  const fall=Math.min(1, k*(b.contact==='bat'?1.15:1.5));
  const amp = b.contact==='bat'?22:14;
  const y = lerp(imp[1],gy,fall*fall) - Math.abs(Math.sin(fall*Math.PI*1.5))*(1-fall)*amp;
  return {x:imp[0]+dx, y, r:6.5, hit:p<cy+0.05, padHit:b.contact==='pad', batHit:b.contact==='bat', edgeHit:b.contact==='edge', shadowY:gy+3, shadowK:1};
}
function drawBall(o,b){
  if(o.shadowY!==undefined && o.shadowY>o.y+3){
    g.globalAlpha=0.28*(0.5+0.5*(o.shadowK||1));
    g.fillStyle='#1d2a14'; g.beginPath();
    g.ellipse(o.x, o.shadowY, 7.5, 2.6, 0, 0, 7); g.fill(); g.globalAlpha=1; }
  if(o.flying){ g.globalAlpha=.3; g.strokeStyle='#e9edf0'; g.lineWidth=3; g.lineCap='round';
    g.beginPath(); g.moveTo(o.x,o.y); g.lineTo(o.x-(o.x-CX)*0.10, o.y+34); g.stroke(); g.globalAlpha=1; }
  g.fillStyle='#ff5a4d'; g.beginPath(); g.arc(o.x,o.y,o.r,0,7); g.fill();
  const seamA = o.flying ? o.y*0.045 : .5;   // seam tumbles while the ball is in flight
  g.fillStyle='#9c2c20'; g.beginPath(); g.ellipse(o.x+o.r*.3,o.y,o.r*.5,o.r*.85,seamA,0,7); g.fill();
  if(o.hit){
    if(o.padHit){ g.globalAlpha=.6; g.fillStyle='rgba(220,210,180,.7)'; g.beginPath(); g.arc(o.x,o.y,o.r+5,0,7); g.fill(); g.globalAlpha=1; }
    else if(o.batHit){ g.globalAlpha=.5; g.strokeStyle='#fff'; g.lineWidth=2; for(let i=0;i<3;i++){const a=i*2.1+0.5;
      g.beginPath(); g.moveTo(o.x+Math.cos(a)*8,o.y+Math.sin(a)*8); g.lineTo(o.x+Math.cos(a)*12,o.y+Math.sin(a)*12); g.stroke(); } g.globalAlpha=1; }
    else if(o.edgeHit){ g.globalAlpha=.45; g.strokeStyle='#ffd23f'; g.lineWidth=1.6;
      g.beginPath(); g.moveTo(o.x+4,o.y-6); g.lineTo(o.x+8,o.y-10); g.stroke(); g.globalAlpha=1; }
  }
}
/* The bowler: runs in from the bottom (off side, over the wicket), arm whirls over at release,
   then peels away and fades before the ball pitches. Pace = long sprint; spin = short amble. */
function bowlerFig(rt, type, p){
  if(!SHOW_BOWLER) return;
  const alpha = p>0 ? clamp(1 - p/0.16, 0, 1) : 1;      // gone well before the ball pitches
  if(alpha<=0) return;
  const pace = type!=='spin';
  const t = ease(rt);
  const gatherAt = pace?0.78:0.70;                       // final gather & arm-over
  const bx = lerp(pace?CX-118:CX-92, CX-52, t) + (p>0? -46*Math.min(1,p/0.16) : 0);   // follow-through drifts off side
  const by = lerp(pace?1024:988, 918, t);
  const s  = lerp(1.55, 2.0, t);
  const strides = pace?4.5:2.5;
  const ph = Math.sin(rt*strides*Math.PI*2);
  const bob = Math.abs(ph)*(pace?3:1.6);
  g.save(); g.globalAlpha=alpha*0.96; g.translate(bx, by-bob*s); g.scale(s,s);
  const kit='#f4efe4', skin='#e8c39e', cap='#20304a';
  g.lineCap='round';
  // legs — alternating stride
  g.strokeStyle=kit; g.lineWidth=6.5;
  g.beginPath(); g.moveTo(-3,-44); g.lineTo(-3+ph*6, -2-Math.max(0,ph)*9); g.stroke();
  g.beginPath(); g.moveTo( 3,-44); g.lineTo( 3-ph*6, -2-Math.max(0,-ph)*9); g.stroke();
  // torso (slight forward lean while sprinting)
  const lean = rt<gatherAt ? (pace?3:1.5) : lerp(pace?3:1.5, -2, (rt-gatherAt)/(1-gatherAt));
  g.lineWidth=11; g.beginPath(); g.moveTo(0,-44); g.lineTo(lean,-80); g.stroke();
  // head + cap
  g.fillStyle=skin; g.beginPath(); g.arc(lean,-89,6.6,0,7); g.fill();
  g.fillStyle=cap;  g.beginPath(); g.arc(lean,-90.5,6.7,Math.PI,0); g.fill();
  // arms: shoulder at (lean,-76). Angle a: 0 = straight up, PI = straight down.
  const sh=[lean,-76], L=24;
  const hand=a=>[sh[0]+Math.sin(a)*10, sh[1]+Math.cos(a)*L];
  let bowlA, offA;
  if(rt<gatherAt){ bowlA = Math.PI + ph*0.55; offA = Math.PI - ph*0.55; }             // pumping
  else { const k=(rt-gatherAt)/(1-gatherAt);
    bowlA = lerp(Math.PI, pace?Math.PI*2:Math.PI*1.85, k);                            // windmill over the top (spin: gentler roll)
    offA  = lerp(Math.PI, 0.35, k); }                                                 // front arm reaches up then pulls
  g.lineWidth=5.5; g.strokeStyle=kit;
  let h=hand(offA);  g.beginPath(); g.moveTo(sh[0],sh[1]); g.lineTo(h[0],h[1]); g.stroke();
  h=hand(bowlA);     g.beginPath(); g.moveTo(sh[0],sh[1]); g.lineTo(h[0],h[1]); g.stroke();
  // ball in the bowling hand until release
  if(p<=0){ g.fillStyle='#ff5a4d'; g.beginPath(); g.arc(h[0],h[1],2.6,0,7); g.fill(); }
  g.restore();
}
function pitchPuff(p,b){ // brief dust at the bounce, fades fast — a cue, not a line
  if(p<=0.5||p>0.64) return; const a=clamp((0.64-p)/0.14,0,1);
  g.globalAlpha=a*0.5; g.fillStyle='#d8c49a'; g.beginPath(); g.arc(b.pitchPt[0],b.pitchPt[1],6+(p-0.5)*90,0,7); g.fill(); g.globalAlpha=1;
}
