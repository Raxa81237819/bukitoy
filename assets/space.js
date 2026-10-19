/* Star Kids — shared look and voice.
   1. A realistic deep-space background: a soft nebula (made from layered noise, drawn once),
      thousands of stars of different colours, a few twinkling bright stars and shooting stars.
   2. SKI: white line icons for the glass buttons.
   3. SK.say(): a livelier speaking voice (best natural voice on the device, with moods). */
(function(){
'use strict';
/* ---------------- icons ---------------- */
const I=(d,extra)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra||''}>${d}</svg>`;
window.SKI={
  home:I('<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/>'),
  back:I('<path d="M15 5l-7 7 7 7"/>'),
  sound:I('<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4 4 0 0 1 0 6"/><path d="M18 6.5a7.5 7.5 0 0 1 0 11"/>'),
  mute:I('<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>'),
  mic:I('<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"/>'),
  star:I('<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9 6.8 19.6l1-5.8-4.3-4.1 5.9-.8z"/>'),
  planet:I('<circle cx="12" cy="12" r="5.5"/><path d="M3.5 15.5c-1.2 2 1.5 3 5.5 2s9.5-4.4 11-7-1-3.2-3.6-2.6"/>'),
  cat:I('<path d="M5 4l3 4.5h8L19 4v8.5a7 7 0 0 1-14 0z"/><path d="M9.5 12.5h.01M14.5 12.5h.01M11 15.5h2l-1 1z"/>'),
  brush:I('<path d="M14.5 4.5l5 5-8 8-5-5z"/><path d="M6.5 12.5C4 13 3.5 15 3.5 20.5 9 20.5 11 20 11.5 17.5"/>'),
  target:I('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>'),
  shapes:I('<circle cx="7.5" cy="7.5" r="4"/><path d="M16.5 3.5l4.5 8h-9z"/><rect x="12.5" y="13.5" width="8" height="7" rx="1"/><path d="M3.5 20.5l4-6.5 4 6.5z"/>'),
  music:I('<path d="M9 18V5.5l11-2V16"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/><path d="M9 9.5l11-2"/>'),
  paw:I('<ellipse cx="12" cy="16" rx="4.5" ry="3.8"/><circle cx="6" cy="10.5" r="2"/><circle cx="9.5" cy="6.5" r="2"/><circle cx="14.5" cy="6.5" r="2"/><circle cx="18" cy="10.5" r="2"/>'),
  pencil:I('<path d="M4 20l1-4.5L16 4.5l3.5 3.5L8.5 19z"/><path d="M14 7l3.5 3.5"/>'),
  download:I('<path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14"/>'),
  undo:I('<path d="M9 7H15a5 5 0 0 1 0 10H8"/><path d="M11.5 4.5L8.5 7.5 11.5 10.5"/>'),
  next:I('<path d="M9 5l7 7-7 7"/>'),
  check:I('<path d="M5 12.5l4.5 4.5L19 7.5"/>')
};
// <span data-ico="home"></span> gets its icon automatically
function fillIcons(root){(root||document).querySelectorAll('[data-ico]').forEach(el=>{if(!el.firstElementChild&&SKI[el.dataset.ico])el.innerHTML=SKI[el.dataset.ico];});}
window.SKIfill=fillIcons;

/* ---------------- livelier voice ---------------- */
const BEST=['Ana Online (Natural)','Jenny Online (Natural)','Aria Online (Natural)','Emma Online (Natural)','Michelle Online (Natural)','Libby Online (Natural)',
  'Google UK English Female','Google US English','Samantha','Karen','Tessa','Moira','Microsoft Ava','Microsoft Jenny','Microsoft Aria','Microsoft Zira'];
let vc=null;
function pickVoice(){if(vc)return vc;const all=(window.speechSynthesis&&speechSynthesis.getVoices())||[],en=all.filter(v=>/^en/i.test(v.lang));
  for(const n of BEST){const v=en.find(v=>v.name.includes(n));if(v)return vc=v;}return vc=en.find(v=>/female|natural/i.test(v.name))||en[0]||null;}
if(window.speechSynthesis)speechSynthesis.onvoiceschanged=()=>{vc=null;};
const MOODS={happy:[1.3,1.02],excited:[1.5,1.12],calm:[1.12,.92],sad:[.95,.85],silly:[1.7,1.15],proud:[1.25,.98]};
window.SK={
  muted:false,
  // say('Yum!', 'excited') — each sentence gets a slightly different pitch so it sounds less flat
  say(text,mood,delay){if(this.muted||!window.speechSynthesis||!text)return;speechSynthesis.cancel();const v=pickVoice(),[p,r]=MOODS[mood]||MOODS.happy;
    const parts=String(text).match(/[^.!?]+[.!?]*/g)||[text];
    setTimeout(()=>parts.forEach((s,i)=>{const u=new SpeechSynthesisUtterance(s.trim());if(v){u.voice=v;u.lang=v.lang;}
      u.pitch=Math.min(2,p+(i%2?-.08:.06)+(/!/.test(s)?.12:0));u.rate=r+(/\?/.test(s)?-.04:0);u.volume=1;speechSynthesis.speak(u);}),delay==null?120:delay);},
  stop(){if(window.speechSynthesis)speechSynthesis.cancel();}
};

/* ---------------- deep-space background ---------------- */
function rng(seed){let s=seed>>>0||1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return(s>>>0)/4294967296;};}
function noise2(seed){const R=rng(seed),N=256,g=new Float32Array(N*N);for(let i=0;i<g.length;i++)g[i]=R();
  const sm=t=>t*t*(3-2*t);
  return(x,y)=>{const xi=Math.floor(x),yi=Math.floor(y),xf=sm(x-xi),yf=sm(y-yi),a=xi&255,b=yi&255,a1=(a+1)&255,b1=(b+1)&255;
    const v00=g[b*N+a],v10=g[b*N+a1],v01=g[b1*N+a],v11=g[b1*N+a1];return v00+(v10-v00)*xf+(v01-v00)*yf+(v00-v10-v01+v11)*xf*yf;};}
function fbm(n,x,y,oct){let s=0,a=.5,f=1,t=0;for(let i=0;i<oct;i++){s+=a*n(x*f,y*f);t+=a;a*=.5;f*=2.03;}return s/t;}
const PALETTES={ // [cloud A, cloud B, glow]
  deep:[[40,120,210],[160,60,170],[255,170,120]],
  teal:[[30,150,170],[60,90,200],[200,240,255]],
  violet:[[110,70,210],[200,70,150],[255,190,230]],
  warm:[[210,110,60],[150,50,120],[255,210,150]]
};
function paintNebula(cv,seed,pal){
  const W=innerWidth,H=innerHeight,w=220,h=Math.max(120,Math.round(w*H/W));cv.width=w;cv.height=h;
  const x=cv.getContext('2d'),img=x.createImageData(w,h),d=img.data,nA=noise2(seed),nB=noise2(seed*7+3),nC=noise2(seed*13+9),[A,B,G]=PALETTES[pal]||PALETTES.deep;
  const cx=.62+((seed%7)/7-.5)*.3,cy=.35+((seed%5)/5-.5)*.2;
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){
    const u=i/w*3.2,v=j/w*3.2,warp=fbm(nC,u*.8,v*.8,3)*1.6;
    let a=fbm(nA,u+warp,v,5),b=fbm(nB,u*1.3,v*1.3+warp,5),dust=fbm(nC,u*2.2+5,v*2.2,4);
    const r=Math.hypot(i/w-cx,(j/h-cy)*h/w*1.2),core=Math.max(0,1-r*2.1);           // brighter towards the heart of the cloud
    a=Math.pow(Math.max(0,a-.38)*2.1,2.2)*(.35+core*1.2);b=Math.pow(Math.max(0,b-.42)*2.2,2.4)*(.3+core);
    const lane=1-Math.pow(Math.max(0,dust-.5)*2,1.6)*.85,glow=Math.pow(core,3)*.55;
    const k=(j*w+i)*4;
    d[k]=Math.min(255,(4+A[0]*a+B[0]*b+G[0]*glow)*lane);d[k+1]=Math.min(255,(6+A[1]*a+B[1]*b+G[1]*glow)*lane);d[k+2]=Math.min(255,(16+A[2]*a+B[2]*b+G[2]*glow)*lane);d[k+3]=255;}
  x.putImageData(img,0,0);}
const STAR_TINTS=['#ffffff','#fff4e8','#ffe9c4','#dfe9ff','#cfdcff','#ffd9b0'];
function paintStars(cv,seed){const d=Math.min(devicePixelRatio||1,2),W=innerWidth,H=innerHeight;cv.width=W*d;cv.height=H*d;const x=cv.getContext('2d');x.setTransform(d,0,0,d,0,0);
  const R=rng(seed+101),n=Math.round(W*H/900);
  for(let i=0;i<n;i++){const r=Math.pow(R(),3)*1.3+.25;x.globalAlpha=.25+R()*.7;x.fillStyle=STAR_TINTS[Math.floor(R()*STAR_TINTS.length)];x.beginPath();x.arc(R()*W,R()*H,r,0,6.283);x.fill();}
  // a few bright stars with a halo and soft spikes
  for(let i=0,m=Math.round(W*H/60000)+3;i<m;i++){const sx=R()*W,sy=R()*H,s=1.4+R()*1.8,c=STAR_TINTS[Math.floor(R()*4)];
    x.globalAlpha=1;const g=x.createRadialGradient(sx,sy,0,sx,sy,s*7);g.addColorStop(0,'rgba(255,255,255,.9)');g.addColorStop(.15,'rgba(200,220,255,.35)');g.addColorStop(1,'rgba(200,220,255,0)');
    x.fillStyle=g;x.beginPath();x.arc(sx,sy,s*7,0,6.283);x.fill();x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=.6;
    x.beginPath();x.moveTo(sx-s*9,sy);x.lineTo(sx+s*9,sy);x.moveTo(sx,sy-s*9);x.lineTo(sx,sy+s*9);x.stroke();x.fillStyle=c;x.beginPath();x.arc(sx,sy,s*.9,0,6.283);x.fill();}
  x.globalAlpha=1;}
function startSpace(){
  if(document.getElementById('space'))return;const b=document.body,seed=+(b.dataset.seed||7),pal=b.dataset.space||'deep';
  const neb=document.createElement('canvas'),st=document.createElement('canvas'),fx=document.createElement('canvas');neb.id='space';st.id='space-stars';fx.id='space-fx';
  [neb,st,fx].forEach(c=>{c.setAttribute('aria-hidden','true');b.insertBefore(c,b.firstChild);});
  let lastW=0,lastH=0;const draw=()=>{if(Math.abs(innerWidth-lastW)<40&&Math.abs(innerHeight-lastH)<80&&lastW)return;lastW=innerWidth;lastH=innerHeight;paintNebula(neb,seed,pal);paintStars(st,seed);sizeFx();};
  const x=fx.getContext('2d');let W,H,tw=[],shoot=null,next=performance.now()+3000,last=0;
  function sizeFx(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;fx.width=W*d;fx.height=H*d;x.setTransform(d,0,0,d,0,0);
    const R=rng(seed+55);tw=Array.from({length:Math.round(W*H/16000)+8},()=>({x:R()*W,y:R()*H,r:R()*1.1+.6,s:R()*1.5+.5,p:R()*6}));}
  draw();addEventListener('resize',()=>{clearTimeout(draw.t);draw.t=setTimeout(draw,200);});
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  (function f(t){requestAnimationFrame(f);if(document.hidden||t-last<50)return;last=t;x.clearRect(0,0,W,H);
    for(const s of tw){x.globalAlpha=Math.max(0,.15+.85*Math.pow(Math.sin(t/1000*s.s+s.p)*.5+.5,3));x.fillStyle='#fff';x.beginPath();x.arc(s.x,s.y,s.r,0,6.283);x.fill();}
    x.globalAlpha=1;if(!shoot&&t>next)shoot={x:Math.random()*W*.7+W*.25,y:Math.random()*H*.35,vx:-(7+Math.random()*4),vy:2.6+Math.random()*2,life:1};
    if(shoot){shoot.x+=shoot.vx*2;shoot.y+=shoot.vy*2;shoot.life-=.022;const tx=shoot.x-shoot.vx*16,ty=shoot.y-shoot.vy*16,g=x.createLinearGradient(shoot.x,shoot.y,tx,ty);
      g.addColorStop(0,'rgba(255,255,255,'+Math.max(0,shoot.life)+')');g.addColorStop(1,'rgba(160,200,255,0)');x.strokeStyle=g;x.lineWidth=2;x.beginPath();x.moveTo(shoot.x,shoot.y);x.lineTo(tx,ty);x.stroke();
      if(shoot.life<=0){shoot=null;next=t+7000+Math.random()*9000;}}})(0);
}
if(document.body)startSpace();else document.addEventListener('DOMContentLoaded',startSpace);
document.addEventListener('DOMContentLoaded',()=>fillIcons());
})();
