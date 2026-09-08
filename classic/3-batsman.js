/* ============================================================
   THE BATSMAN AND THE GROUND — the stick-man's body positions for each shot, and the pitch he stands on.
   ============================================================ */

/* ============ batsman ============ */
const P={
 stance:{ hip:[-4,-46],shF:[-10,-80],shB:[-6,-82],head:[-5,-99], backFoot:[-7,0],backKnee:[-8,-23],frontFoot:[-10,4],frontKnee:[-9,-23], grip:[-13,-60],batTip:[-16,-4] },
 trigger:{hip:[-3,-45],shF:[-9,-79],shB:[-5,-81],head:[-4,-98], backFoot:[-7,0],backKnee:[-8,-22],frontFoot:[-9,4],frontKnee:[-8,-22], grip:[-10,-60],batTip:[-13,-6] },
 backlift:{hip:[-2,-46],shF:[-8,-80],shB:[-4,-82],head:[-4,-99], backFoot:[-7,0],backKnee:[-8,-23],frontFoot:[-9,4],frontKnee:[-8,-23], grip:[4,-66],batTip:[19,-96] },
 stride:{ hip:[-5,-45],shF:[-12,-77],shB:[-7,-80],head:[-9,-95], backFoot:[-7,0],backKnee:[-9,-22],frontFoot:[-14,9],frontKnee:[-12,-21], grip:[-7,-64],batTip:[4,-90] },
 contact:{hip:[-7,-44],shF:[-14,-74],shB:[-8,-79],head:[-12,-91], backFoot:[-7,-1],backKnee:[-9,-21],frontFoot:[-16,11],frontKnee:[-14,-19], grip:[-17,-56],batTip:[-19,-30] },
 hold:{   hip:[-7,-44],shF:[-14,-75],shB:[-8,-79],head:[-11,-90], backFoot:[-7,-1],backKnee:[-9,-21],frontFoot:[-16,11],frontKnee:[-14,-19], grip:[-18,-54],batTip:[-20,-28] },
 raise:{  hip:[-3,-46],shF:[-9,-81],shB:[-5,-83],head:[-4,-100], backFoot:[-7,0],backKnee:[-8,-23],frontFoot:[-11,6],frontKnee:[-10,-23], grip:[-2,-84],batTip:[10,-124] },
 raised:{ hip:[-3,-46],shF:[-9,-82],shB:[-5,-84],head:[-4,-100], backFoot:[-7,0],backKnee:[-8,-23],frontFoot:[-11,6],frontKnee:[-10,-23], grip:[0,-88],batTip:[14,-128] },
 /* back-foot defence: back and across, tall, bat vertical in front of the chest */
 bpress:{ hip:[-1,-47],shF:[-7,-82],shB:[-3,-84],head:[-2,-101], backFoot:[-4,0],backKnee:[-5,-23],frontFoot:[-7,3],frontKnee:[-6,-23], grip:[2,-66],batTip:[13,-94] },
 bplay:{  hip:[-2,-47],shF:[-9,-82],shB:[-4,-84],head:[-4,-101], backFoot:[-4,0],backKnee:[-5,-23],frontFoot:[-8,3],frontKnee:[-7,-23], grip:[-10,-70],batTip:[-13,-34] },
 bhold:{  hip:[-2,-47],shF:[-9,-82],shB:[-4,-84],head:[-4,-100], backFoot:[-4,0],backKnee:[-5,-23],frontFoot:[-8,3],frontKnee:[-7,-23], grip:[-11,-68],batTip:[-14,-32] },
 /* front-foot drive: big stride, blade comes through ON the ball line */
 dswing:{ hip:[-8,-43],shF:[-15,-73],shB:[-9,-78],head:[-13,-90], backFoot:[-7,-1],backKnee:[-10,-21],frontFoot:[-18,12],frontKnee:[-15,-19], grip:[-9,-52],batTip:[-13,-8] },
 dthru:{  hip:[-8,-44],shF:[-15,-74],shB:[-9,-79],head:[-12,-91], backFoot:[-7,-1],backKnee:[-10,-21],frontFoot:[-18,12],frontKnee:[-15,-19], grip:[-10,-64],batTip:[-24,-52] }
};
const SK=Object.keys(P.stance);
function mix(a,b,t){const o={};for(const k of SK)o[k]=[lerp(a[k][0],b[k][0],t),lerp(a[k][1],b[k][1],t)];return o;}
const SEG_DEF=[['stance','stance',0,.10],['stance','trigger',.10,.18],['trigger','backlift',.18,.34],
  ['backlift','stride',.34,.46],['stride','contact',.46,.54],['contact','hold',.54,.68],['hold','stance',.68,.92],['stance','stance',.92,1]];
const SEG_LVE=[['stance','stance',0,.10],['stance','trigger',.10,.18],['trigger','backlift',.18,.34],
  ['backlift','raise',.34,.44],['raise','raised',.44,.66],['raised','stance',.66,.92],['stance','stance',.92,1]];
const SEG_BDEF=[['stance','stance',0,.10],['stance','trigger',.10,.18],['trigger','backlift',.18,.30],
  ['backlift','bpress',.30,.42],['bpress','bplay',.42,.54],['bplay','bhold',.54,.70],['bhold','stance',.70,.92],['stance','stance',.92,1]];
const SEG_DRV=[['stance','stance',0,.10],['stance','trigger',.10,.18],['trigger','backlift',.18,.34],
  ['backlift','stride',.34,.44],['stride','dswing',.44,.55],['dswing','dthru',.55,.70],['dthru','stance',.70,.92],['stance','stance',.92,1]];
function poseAt(t,shot){ const S=shot==='leave'?SEG_LVE:shot==='backdef'?SEG_BDEF:shot==='drive'?SEG_DRV:SEG_DEF;
  for(const s of S){ if(t>=s[2]&&t<=s[3]) return mix(P[s[0]],P[s[1]],ease(clamp((t-s[2])/(s[3]-s[2]),0,1))); } return P.stance; }

function cap(a,b,w,col){g.strokeStyle=col;g.lineWidth=w;g.lineCap='round';g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();}
function padShin(a,b,w){cap(a,b,w,'#f4f1e8');g.strokeStyle='#cdd3d6';g.lineWidth=Math.max(1,w*0.13);
  for(let i=1;i<=3;i++){const t=i/4,x=lerp(a[0],b[0],t),y=lerp(a[1],b[1],t),dx=b[1]-a[1],dy=-(b[0]-a[0]),L=Math.hypot(dx,dy)||1,nx=dx/L*(w/2),ny=dy/L*(w/2);
    g.beginPath();g.moveTo(x-nx,y-ny);g.lineTo(x+nx,y+ny);g.stroke();}}
function striker(Q){
  g.save(); g.translate(CX,560); g.scale(3,3);
  const {hip,shF,shB,head,backFoot,backKnee,frontFoot,frontKnee,grip,batTip}=Q;
  g.save(); g.translate(0,-2);
  for(let i=-1;i<=1;i++){const x=i*5; g.fillStyle='#f5edd8'; g.fillRect(x-1.5,-40,3,40); g.fillStyle='#d6c8a0'; g.fillRect(x+0.8,-40,0.8,40);}
  g.fillStyle='#efe4c4'; g.fillRect(-6.6,-43,5,2.6); g.fillRect(1.6,-43,5,2.6);
  g.restore();
  g.translate(12,0);
  g.fillStyle='rgba(0,0,0,.22)'; g.beginPath(); g.ellipse(0,3,24,5,0,0,7); g.fill();
  cap(hip,backKnee,7,'#e9e7de'); padShin(backKnee,backFoot,9);
  g.fillStyle='#23272e'; g.beginPath(); g.ellipse(backFoot[0]+1,backFoot[1]-1,6,3,0,0,7); g.fill();
  g.fillStyle='#f3f1ea'; g.beginPath(); g.moveTo(hip[0]-6,hip[1]); g.lineTo(hip[0]+6,hip[1]); g.lineTo(shB[0],shB[1]); g.lineTo(shF[0],shF[1]); g.closePath(); g.fill();
  cap(hip,frontKnee,8,'#f1efe6'); padShin(frontKnee,frontFoot,10);
  g.fillStyle='#23272e'; g.beginPath(); g.ellipse(frontFoot[0]-1,frontFoot[1]-1,7,3,0,0,7); g.fill();
  cap([(shF[0]+shB[0])/2,(shF[1]+shB[1])/2],[head[0],head[1]+6],7,'#f3f1ea');
  g.fillStyle='#e9d9c2'; g.beginPath(); g.arc(head[0],head[1],8,0,7); g.fill();
  g.fillStyle='#21364f'; g.beginPath(); g.arc(head[0],head[1]-1,8.5,Math.PI,2*Math.PI); g.fill(); g.fillRect(head[0]-8,head[1]-1,16,2.5);
  g.fillStyle='#39434f'; g.fillRect(head[0]-5,head[1]+3,10,4);
  cap(shF,grip,5,'#f1efe6'); cap(shB,grip,5,'#eceae0');
  const hb=[lerp(grip[0],batTip[0],.28),lerp(grip[1],batTip[1],.28)];
  cap(grip,hb,4.5,'#5b4426'); cap(hb,batTip,7,'#d9b676'); cap(hb,batTip,3.5,'#c79f57');
  g.fillStyle='#eef2f4'; g.beginPath(); g.arc(grip[0],grip[1],4,0,7); g.fill();
  g.restore();
}
function field(){
  let sky=g.createLinearGradient(0,0,0,120); sky.addColorStop(0,'#0e1a26'); sky.addColorStop(1,'#1b2b37');
  g.fillStyle=sky; g.fillRect(0,0,W,120);
  for(let i=0;i<140;i++){g.globalAlpha=.10;g.fillStyle=['#cdd','#8aa','#9ab','#caa'][i%4];g.fillRect((i*61)%W,14+((i*37)%92),3,3);}g.globalAlpha=1;
  let gr=g.createLinearGradient(0,120,0,H); gr.addColorStop(0,'#2f6b2c'); gr.addColorStop(1,'#357231');
  g.fillStyle=gr; g.fillRect(0,120,W,H-120);
  g.fillStyle='#c2a878'; g.beginPath(); g.moveTo(CX-95,498); g.lineTo(CX+95,498); g.lineTo(CX+250,H); g.lineTo(CX-250,H); g.closePath(); g.fill();
  g.fillStyle='rgba(150,128,86,.30)'; g.fillRect(0,H-70,W,70);
  g.strokeStyle='rgba(240,235,222,.6)'; g.lineWidth=3; g.beginPath(); g.moveTo(CX-140,590); g.lineTo(CX+140,590); g.stroke();
}
