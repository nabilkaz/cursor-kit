// A small cursor lives above the headline. Click it enough and it calls the demo cursors for backup,
// and once they close in, a flood of others pours in from off screen.
(() => {
 const region=document.getElementById('hero-playground'),actor=document.getElementById('hero-cursor'),hit=document.getElementById('hero-greet');
 if(!region||!actor||!hit||typeof actor.inspect!=='function'||typeof actor.cursorPositions!=='function')return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const demos=[...document.querySelectorAll('.examples cursor-theatre')];
 const CORAL='#ef777b',INK='#381416',LINES=['Hey.','Hi again.','Okay, I felt that.','Please.','I have friends.','BACKUP!'];
 const STOPS=[.63,.42,.78,.54],HEAD_START=650,RETURN_AT=4400,DONE_AT=5700;
 // The crowd: the demo cursors take the inner ring, then the flood fills three outer rings.
 const CROWD_SIZE=20,NEAR=130,FLOOD_BY=1400,ACCENTS=['#c5c4df','#bbd5d7'];
 const RINGS=[{radius:95,cap:7,spin:-.00036,breath:11},{radius:140,cap:9,spin:.00028,breath:13},{radius:185,cap:12,spin:-.00022,breath:14}];
 const design={fontSize:12,paddingX:10,paddingY:7,radius:12,maxWidth:145,reveal:'typing',revealMs:480,placements:{left:{x:21,y:21,ax:0,ay:0,angle:0,corner:'tl'},right:{x:7,y:21,ax:1,ay:0,angle:90,corner:'tr'}}};
 actor.configure({design});
 const overlay=document.createElement('div');overlay.className='hero-crowd';overlay.setAttribute('aria-hidden','true');
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),ease=t=>1-Math.pow(1-clamp(t,0,1),3);

 let x=0,y=8,from={x,y},to={x,y},moveStart=0,nextMove=0,stop=0,visible=true;
 let message='',said=-1e9,facing='left',greetUntil=0,clicks=0,lastClick=-1e9,shakeAt=-1e9;
 let party=-1,followers=[],flooded=false,center={x:0,y:0},pointer=null,trackPointer=false;
 let clock=0,last=0,raf=0,designKey='';

 const annoyed=()=>clicks>=3;
 function say(text,width){
  message=text;said=clock;
  // Choose the side with room for the whole bubble now, and keep it for the message.
  const W=region.clientWidth;facing=x+21+width+8>W?'right':'left';
 }
 function move(px){from={x,y};to={x:clamp(px,16,region.clientWidth-36),y:6+(stop%3)*10};moveStart=clock;nextMove=clock+3500}
 function calm(){clicks=0;shakeAt=-1e9}
 function greet(){if(party>=0||clock<greetUntil)return;greetUntil=clock+2500;say(annoyed()?'Easy there.':'Oh, hi.',80)}

 function proxy(){
  const el=document.createElement('cursor-theatre');el.setAttribute('aria-hidden','true');
  el.configure({design:{...design,maxWidth:170}});overlay.append(el);return el;
 }
 function releaseFlood(age){
  const W=overlay.clientWidth||innerWidth,H=overlay.clientHeight||innerHeight,far=Math.hypot(W,H)+80;
  let n=0;const count=Math.max(0,CROWD_SIZE-followers.length);
  RINGS.forEach(ring=>{
   for(let k=0;k<ring.cap&&n<count;k++,n++){
    // Each newcomer starts just outside the viewport, in its own direction, and keeps that exit for later.
    const a=Math.random()*Math.PI*2,i=followers.length;
    const entry={x:clamp(center.x+Math.cos(a)*far,-60,W+60),y:clamp(center.y+Math.sin(a)*far,-60,H+60)};
    followers.push({kind:'flood',el:proxy(),accent:ACCENTS[i%ACCENTS.length],x:entry.x,y:entry.y,entry,angle:0,
     phase:k/ring.cap*Math.PI*2+Math.random()*.4,radius:ring.radius+(Math.random()-.5)*12,spin:ring.spin,breath:ring.breath,
     response:120+Math.random()*100,startAge:age+n*35});
   }
  });
 }
 function summon(event){
  const keyboard=event.detail===0,touch=event.pointerType==='touch';
  const rect=hit.getBoundingClientRect(),trigger={x:rect.left+rect.width/2,y:rect.top+rect.height/2};
  if(touch){center={x:event.clientX,y:event.clientY};trackPointer=false}
  else if(keyboard){center=pointer?{...pointer}:trigger;trackPointer=!!pointer}
  else{center={x:event.clientX,y:event.clientY};trackPointer=true}
  document.dispatchEvent(new CustomEvent('cursor-crowd',{detail:true}));
  followers=[];flooded=false;
  demos.forEach(demo=>{
   const states=demo.cursorPositions();
   if(!states.length)return;
   demo._wasPlaying=demo.playing;demo.pause();demo.stopDirect();
   states.forEach(state=>{
    const i=followers.length;
    followers.push({kind:'native',el:proxy(),demo,index:state.index,accent:state.accent,x:state.x,y:state.y,angle:state.angle,
     phase:i*Math.PI/3,radius:52+(i%3)*6,spin:.00048,breath:9,response:110+i*17,startAge:i*45,home:()=>demo.cursorPositions().find(s=>s.index===state.index)||state});
   });
   demo.style.visibility='hidden';
  });
  document.body.append(overlay);
  party=clock;
  renderCrowd(0);
 }
 function finish(thank){
  if(party<0)return;
  followers.forEach(f=>f.el.remove());followers=[];flooded=false;overlay.remove();party=-1;
  demos.forEach(demo=>{demo.style.visibility='';if(demo._wasPlaying)demo.play();demo._wasPlaying=false});
  document.dispatchEvent(new CustomEvent('cursor-crowd',{detail:false}));
  calm();greetUntil=clock+1800;nextMove=clock+2200;
  if(thank)say('Thank you.',70);else{message='';said=-1e9}
 }

 hit.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')greet()});
 hit.addEventListener('focus',greet);
 hit.addEventListener('click',event=>{
  if(party>=0)return;
  if(clock-lastClick>5000)clicks=0;
  lastClick=clock;clicks++;greetUntil=clock+2400;
  from={x,y};to={x,y};moveStart=clock;nextMove=clock+2200;
  shakeAt=clicks>=3?clock:-1e9;
  say(LINES[clicks-1],clicks>=6?210:130);
  if(clicks>=6)summon(event);
 });
 window.addEventListener('pointermove',event=>{if(event.pointerType==='touch')return;pointer={x:event.clientX,y:event.clientY};if(trackPointer)center=pointer},{passive:true});
 window.addEventListener('keydown',event=>{if(event.key==='Escape'&&party>=0)finish(false)});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){if(party>=0)finish(false);last=0}});
 window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);finish(false)});
 new IntersectionObserver(([entry])=>{visible=entry.isIntersecting}).observe(region);

 function renderHero(px,py){
  const W=region.clientWidth,H=region.clientHeight;if(!W||!H)return;
  const shoutAge=party>=0?clock-party:-1,shouting=shoutAge>=0&&shoutAge<1050;
  const strength=shouting?1-ease(Math.max(0,shoutAge-600)/450):0;
  const next={fontSize:12+14*strength,maxWidth:145+65*strength,revealMs:shouting?200:480,fontWeight:shouting?750:500,bubbleBackground:annoyed()?CORAL:'',bubbleColor:annoyed()?INK:''};
  const key=JSON.stringify(next);if(key!==designKey){designKey=key;actor.configure({design:next})}
  const age=clock-said;
  actor.inspect({x:px/W,y:py/H,direction:facing,text:age<2300?message:'',progress:reduced.matches?1:clamp(age/next.revealMs,0,1),progressMode:'reveal',
   wobble:shouting&&!reduced.matches?{y:2.5*strength,deg:9*strength,phase:shoutAge*.042}:null});
  hit.style.transform=`translate(${x-8}px,${y-8}px)`;
 }
 function renderCrowd(dt){
  const age=clock-party-HEAD_START,W=overlay.clientWidth||innerWidth,H=overlay.clientHeight||innerHeight;
  if(!flooded&&age>=0){
   const near=followers.some(f=>f.kind==='native'&&Math.hypot(f.x+14-center.x,f.y+14-center.y)<NEAR);
   if(near||age>FLOOD_BY){flooded=true;releaseFlood(age)}
  }
  followers.forEach((f,i)=>{
   const a=f.phase+(reduced.matches?0:age*f.spin);
   const radius=f.radius+(reduced.matches?0:Math.sin(age*.002+i*1.7)*f.breath);
   const tx=clamp(center.x+Math.cos(a)*radius-14,2,W-30),ty=clamp(center.y+Math.sin(a)*radius*.78-14,2,H-30);
   const leave=ease((age-RETURN_AT-i*40)/500);
   if(leave>0){
    // Ease away from wherever the follower was when called back: natives land exactly on their
    // originals, the flood slips back out the way it came.
    if(!f.leaveFrom)f.leaveFrom={x:f.x,y:f.y,angle:f.angle};
    const home=f.kind==='native'?f.home():f.entry;
    f.x=f.leaveFrom.x+(home.x-f.leaveFrom.x)*leave;f.y=f.leaveFrom.y+(home.y-f.leaveFrom.y)*leave;
    if(f.kind==='native')f.angle=f.leaveFrom.angle+(((home.angle-f.leaveFrom.angle+540)%360)-180)*leave;
    else f.el.style.opacity=String(1-leave);
   }else if(age>=f.startAge){
    const follow=reduced.matches?1:1-Math.exp(-dt/f.response);
    f.x+=(tx-f.x)*follow;f.y+=(ty-f.y)*follow;
    const desired=Math.atan2(center.y-(f.y+14),center.x-(f.x+14))*180/Math.PI+135;
    const delta=((desired-f.angle+540)%360)-180;
    f.angle+=delta*follow;
    f.el.style.opacity='1';
   }
   const speaking=f.kind==='native'&&i===0&&age>900&&age<4100;
   f.el.inspect({x:f.x/W,y:f.y/H,angle:f.angle,accent:f.accent,direction:Math.cos(a)<0?'right':'left',text:speaking?'Just checking on you.':'',progress:reduced.matches?1:clamp((age-900)/480,0,1),progressMode:'reveal'});
  });
  if(age>DONE_AT)finish(true);
 }
 function frame(now){
  raf=requestAnimationFrame(frame);
  try{
   const dt=last?Math.min(now-last,60):0;last=now;
   if(document.hidden||(party<0&&!visible))return;
   clock+=dt;
   const idle=party<0;
   if(idle&&clicks&&clock-lastClick>6000)calm();
   if(idle&&!reduced.matches&&clock>=nextMove)move(STOPS[stop++%STOPS.length]*region.clientWidth);
   const u=ease((clock-moveStart)/750);
   x=from.x+(to.x-from.x)*u;y=from.y+(to.y-from.y)*u-(reduced.matches||from.x===to.x?0:Math.sin(u*Math.PI)*8);
   const shakeAge=clock-shakeAt;
   const shake=idle&&!reduced.matches&&shakeAge<500?Math.sin(shakeAge*.075)*4*(1-shakeAge/500):0;
   renderHero(x+shake,y);
   if(!idle)renderCrowd(dt);
  }catch(error){finish(false);cancelAnimationFrame(raf);throw error}
 }
 x=region.clientWidth*.58;from={x,y};to={x,y};nextMove=2200;
 raf=requestAnimationFrame(frame);
})();
