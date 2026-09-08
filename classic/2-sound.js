/* ============================================================
   SOUND — every noise the game makes, built from scratch in the browser. No audio files.
   ============================================================ */

/* ============ sound (guarded) ============ */
let AC=null;
function ensureAudio(){ try{ const A=window.AudioContext||window.webkitAudioContext; if(!AC&&A) AC=new A(); if(AC&&AC.state==='suspended') AC.resume(); }catch(e){} }
function tone(f,dur,type,vol,slide){ if(!AC)return; try{ const o=AC.createOscillator(),ga=AC.createGain();
  o.type=type; o.frequency.setValueAtTime(f,AC.currentTime); if(slide)o.frequency.exponentialRampToValueAtTime(slide,AC.currentTime+dur);
  ga.gain.setValueAtTime(vol,AC.currentTime); ga.gain.exponentialRampToValueAtTime(0.0001,AC.currentTime+dur);
  o.connect(ga); ga.connect(AC.destination); o.start(); o.stop(AC.currentTime+dur); }catch(e){} }
const sPad=()=>tone(118,.15,'sine',.55,55),
      sBat=()=>{tone(330,.045,'triangle',.26); setTimeout(()=>tone(122,.13,'sine',.42,50),55);},   // bat-first: woody knock, then pad thud — listen close
      sEdge=()=>{tone(870,.028,'square',.09); setTimeout(()=>tone(120,.13,'sine',.45,50),45);},    // faint tick, then pad
      sGood=()=>{tone(660,.09,'sine',.3);setTimeout(()=>tone(880,.14,'sine',.3),90);}, sBad=()=>tone(150,.22,'square',.25,110);
function crowd(vol,dur){ if(!AC)return; try{ const n=Math.floor(AC.sampleRate*dur), buf=AC.createBuffer(1,n,AC.sampleRate), d=buf.getChannelData(0);
  for(let i=0;i<n;i++) d[i]=(Math.random()*2-1)*Math.sin(Math.PI*i/n);
  const src=AC.createBufferSource(); src.buffer=buf; const f=AC.createBiquadFilter(); f.type='lowpass'; f.frequency.value=750;
  const ga=AC.createGain(); ga.gain.setValueAtTime(vol,AC.currentTime); ga.gain.exponentialRampToValueAtTime(0.0001,AC.currentTime+dur);
  src.connect(f); f.connect(ga); ga.connect(AC.destination); src.start(); }catch(e){} }
