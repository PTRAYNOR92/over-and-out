/* ============================================================
   SETUP — the canvas we draw on, the size of the world, and a few small maths helpers. Also Pat's two on/off switches.
   ============================================================ */

const cv=document.getElementById('cv'), g=cv.getContext('2d');
const W=760,H=1000,CX=380;
function fit(){ const r=cv.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);
  cv.width=Math.round(r.width*dpr); cv.height=Math.round(r.height*dpr);
  const s=Math.min(cv.width/W,cv.height/H); g.setTransform(s,0,0,s,(cv.width-W*s)/2,(cv.height-H*s)/2); }
window.addEventListener('resize',fit);
const lerp=(a,b,t)=>a+(b-a)*t, clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const BAT_BALLS=false;  // ← PAT'S SWITCH: change false to true to bring back bat-first / inside-edge balls. Nothing else needed.
const SHOW_BOWLER=false; // ← PAT'S SWITCH: bowler removed (Pat's call). Change to true to bring him back.
function rr(x,y,w,h,r){ g.beginPath(); g.moveTo(x+r,y); g.arcTo(x+w,y,x+w,y+h,r); g.arcTo(x+w,y+h,x,y+h,r); g.arcTo(x,y+h,x,y,r); g.arcTo(x,y,x+w,y,r); g.closePath(); }
function txt(s,x,y,f,c,a){ g.font=f; g.fillStyle=c; g.textAlign=a||'left'; g.textBaseline='alphabetic'; g.fillText(s,x,y); }
