/* ============================================================
   THE SUMMARY SCREEN — your six ticks and crosses at the end of the over, your rank, and your lifetime stats.
   ============================================================ */

/* ============ over summary ============ */
function rankFor(pts){ return pts>=6?'ELITE PANEL':pts>=5?'TEST MATCH OFFICIAL':pts>=4?'COUNTY PRO':pts>=3?'CLUB UMPIRE':pts>=2?'VILLAGE GREEN':'SQUARE LEG SNOOZER'; }
function drawSummary(results, pts, dateStr, daily, streak){
  g.fillStyle='#0a0e15'; g.fillRect(0,0,W,H);
  for(let i=0;i<90;i++){g.globalAlpha=.05;g.fillStyle='#36e3c8';g.fillRect((i*97)%W,(i*61)%H,3,3);}g.globalAlpha=1;
  txt('OVER COMPLETE',W/2,120,'400 46px Anton','#eaf1f6','center');
  txt(daily?('Daily over · '+dateStr):(CUSTOM?(CUSTOM+'’s over — same six balls for everyone'):'Practice over'),W/2,152,'700 15px "Barlow Condensed"','#8aa0b0','center');
  const cw=92, gap=14, x0=W/2-(6*cw+5*gap)/2;
  results.forEach((r,i)=>{ const x=x0+i*(cw+gap), y=220;
    const col=r==='correct'?'#3ad17f':r==='wrong'?'#ff5a4d':'#ffd23f';
    rr(x,y,cw,cw,16); g.fillStyle='rgba(255,255,255,.045)'; g.fill(); g.strokeStyle=col; g.lineWidth=2; g.stroke();
    g.strokeStyle=col; g.lineWidth=6; g.lineCap='round';
    if(r==='correct'){ g.beginPath(); g.moveTo(x+24,y+48); g.lineTo(x+41,y+64); g.lineTo(x+70,y+30); g.stroke(); }
    else if(r==='wrong'){ g.beginPath(); g.moveTo(x+28,y+28); g.lineTo(x+64,y+64); g.moveTo(x+64,y+28); g.lineTo(x+28,y+64); g.stroke(); }
    else { g.fillStyle=col; g.beginPath(); g.arc(x+cw/2,y+cw/2,13,0,7); g.fill(); }
    txt('BALL '+(i+1),x+cw/2,y+cw+20,'700 11px "Barlow Condensed"','#5d7180','center');
  });
  txt(pts+' / 6',W/2,470,'400 72px Anton','#36e3c8','center');
  txt('POINTS  ·  correct = 1   umpire’s call = 1 either way',W/2,500,'700 13px "Barlow Condensed"','#8aa0b0','center');
  rr(W/2-260,540,520,86,16); g.fillStyle='rgba(54,227,200,.08)'; g.fill(); g.strokeStyle='#36e3c8'; g.lineWidth=1.5; g.stroke();
  txt(rankFor(pts),W/2,598,'400 40px Anton','#eaf1f6','center');
  if(daily&&streak>0) txt('Daily streak: '+streak,W/2,668,'700 16px "Barlow Condensed"','#ffd23f','center');
  if(daily&&alreadyDone) txt('✓ Today’s over is done — come back tomorrow for six new balls.',W/2,daily?706:690,'600 13px Inter','#36e3c8','center');
  else txt('Share your grid — same six balls for everyone today.',W/2,daily?706:690,'600 13px Inter','#5d7180','center');
  /* lifetime stats — the Wordle bit */
  if(daily && stats.played>0){
    const acc=Math.round(stats.ptsSum/(stats.played*6)*100);
    const row=[['PLAYED',stats.played],['ACCURACY',acc+'%'],['BEST',stats.best],['STREAK',streak]];
    row.forEach((it,i)=>{ const x=W/2-270+ i*180+90;
      txt(String(it[1]),x,782,'400 34px Anton','#eaf1f6','center');
      txt(it[0],x,806,'700 12px "Barlow Condensed"','#5d7180','center'); });
    txt('SCORE DISTRIBUTION',W/2,846,'700 12px "Barlow Condensed"','#5d7180','center');
    const maxN=Math.max(1,...stats.dist);
    stats.dist.forEach((n,i)=>{ const bw2=56, x=W/2-7*bw2/2+ i*bw2+6, h=6+ (n/maxN)*54, y=926-h;
      const mine = Math.min(6,Math.floor(pts))===i;
      g.fillStyle = mine? '#36e3c8' : 'rgba(234,241,246,.18)';
      rr(x,y,bw2-12,h,4); g.fill();
      txt(String(i),x+(bw2-12)/2,944,'700 12px "Barlow Condensed"','#5d7180','center');
      if(n>0) txt(String(n),x+(bw2-12)/2,y-6,'700 11px "Barlow Condensed"',mine?'#36e3c8':'#8aa0b0','center'); });
  }
}
