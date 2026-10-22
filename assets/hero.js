// A small cursor lives above the headline. Click it enough and it calls the demo cursors for backup,
// and once they close in, a whole school of others pours in from off screen.
(() => {
 const region=document.getElementById('hero-playground'),actor=document.getElementById('hero-cursor'),hit=document.getElementById('hero-greet');
 if(!region||!actor||!hit||typeof actor.inspect!=='function'||typeof actor.cursorPositions!=='function')return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const demos=[...document.querySelectorAll('.examples cursor-theatre')];
 const CORAL='#ef777b',INK='#381416',LINES=['Hey.','Hi again.','Okay, I felt that.','Please stop.','I have friends.','BACKUP!'];
 // What the crowd says once it arrives: [speaker, from ms, to ms, line]. Speakers are the demo cursors, in order.
 const CHORUS=[[0,900,2600,"You messin' with our guy?"],[1,1500,3100,'Not cool.'],[2,2200,3800,'We saw that.'],[3,2900,4300,'Easy, pal.'],[4,3500,4300,"He's with us."]];
 // After the shout: a beat of stillness, then each demo cursor snaps round to look at the shouter, holds the
 // stare, and only then takes off. The head start covers that whole listening beat.
 const HEAD_START=1000,HEAR_AT=220,HEAR_GAP=70,RETURN_AT=4400,DONE_AT=5900;
 // The crowd: the demo cursors take the inner ring; the flood fills rings further out.
 const FLOOD=40,NEAR=130,FLOOD_BY=1400,POUR_MS=25;
 const design={fontSize:12,paddingX:10,paddingY:7,radius:12,maxWidth:145,reveal:'typing',revealMs:480,placements:{left:{x:21,y:21,ax:0,ay:0,angle:0,corner:'tl'},right:{x:7,y:21,ax:1,ay:0,angle:90,corner:'tr'}}};
 actor.configure({design});
 const overlay=document.createElement('div');overlay.className='hero-crowd';overlay.setAttribute('aria-hidden','true');
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),ease=t=>1-Math.pow(1-clamp(t,0,1),3),rand=(a,b)=>a+Math.random()*(b-a);
 const shortest=(to,from)=>((to-from+540)%360)-180;

 let x=0,y=8,rest={x,y},restUntil=0,wander=null,waypoint=null,remarkAt=0,lastRemark=-1e9,visible=true,act=null,queue=[],opened=false;
 let message='',said=-1e9,facing='left',greetUntil=0,clicks=0,lastClick=-1e9,shakeAt=-1e9;
 let party=-1,followers=[],flooded=false,center={x:0,y:0},prevCenter=null,vel={x:0,y:0},pointer=null,trackPointer=false;
 let clock=0,last=0,raf=0,designKey='';

 const annoyed=()=>clicks>=3;
 function say(text,width){
  message=text;said=clock;
  // Choose the side with room for the whole bubble now, and keep it for the message.
  const W=region.clientWidth;facing=x+21+width+8>W?'right':'left';
 }
 // Places worth visiting, measured from the live layout so they track wrapping: beside the headline lines and
 // the description, up close on each action (an inspection), and just above the examples to point the way.
 function waypoints(){
  const R=region.getBoundingClientRect(),W=region.clientWidth,H=region.clientHeight,list=[];
  const lines=el=>{const r=document.createRange();r.selectNodeContents(el);return [...r.getClientRects()].filter(b=>b.width>0)};
  const at=(x,y,line,extra)=>{if(x>8&&x<W-40&&y>0&&y<H-40)list.push({x,y,line,...extra})};
  const q=s=>document.querySelector(s),h1=q('.intro h1'),p=q('.intro>p:not(.eyebrow):not(.fine)'),examples=q('.examples');
  if(h1)lines(h1).forEach((b,i)=>at(b.right-R.left+22,b.top-R.top+(i?14:10),i?null:'Big words.'));
  if(p){const b=lines(p).at(-1);if(b)at(b.right-R.left+22,b.top-R.top-4,'I can do all that.')}
  document.querySelectorAll('.intro-actions button,.intro-actions a').forEach((el,i)=>{
   const b=el.getBoundingClientRect();at(b.right-R.left-11,b.bottom-R.top-9,'For your agent. Nice.',{inspect:true,always:true});
  });
  if(examples){const b=examples.getBoundingClientRect();at(b.left-R.left+b.width/2-14,Math.min(H-66,b.top-R.top-66),'Oh cool. Check these out.',{always:true})}
  return list.length?list:[{x:W*.58,y:8,line:null}];
 }
 function depart(){
  const list=waypoints(),choices=list.filter(w=>!waypoint||Math.hypot(w.x-waypoint.x,w.y-waypoint.y)>40);
  waypoint=choices[Math.floor(Math.random()*choices.length)]||list[0];
  wander={from:{x,y},to:{x:waypoint.x,y:waypoint.y},start:clock,duration:1100+Math.random()*700,bob:(Math.random()<.5?-1:1)*(10+Math.random()*8)};
  // While it hovers a real control, step out of the way so that control stays clickable.
  if(waypoint.inspect)hit.style.pointerEvents='none';
 }
 function settle(){rest={x,y};wander=null;act=null;queue=[];restUntil=clock+2200;hit.style.pointerEvents=''}
 const inOut=u=>u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2,out=u=>1-Math.pow(1-u,3);
 // The entrance: zoom up beside the first headline line, nod to it, lap the second line, then go exploring.
 function opening(){
  const R=region.getBoundingClientRect(),h1=document.querySelector('.intro h1');if(!h1)return false;
  const r=document.createRange();r.selectNodeContents(h1);const ls=[...r.getClientRects()].filter(b=>b.width>0);if(ls.length<2)return false;
  const l1=ls[0],l2=ls[1],W=region.clientWidth,H=region.clientHeight;
  const beside={x:Math.min(W-40,l1.right-R.left+22),y:l1.top-R.top+10};
  const cx=l2.left-R.left+l2.width/2,cy=l2.top-R.top+l2.height/2,rx=Math.min(l2.width/2+34,W/2-20),ry=l2.height/2+18,a0=-.55;
  x=W*.5;y=H+30;
  queue=[
   {kind:'move',to:beside,duration:620,ease:out,arc:-24},
   {kind:'nod',times:2,duration:520},
   {kind:'hold',duration:260},
   {kind:'move',to:{x:cx+Math.cos(a0)*rx-14,y:cy+Math.sin(a0)*ry-14},duration:260,ease:inOut,arc:0},
   {kind:'orbit',cx,cy,rx,ry,a0,turns:1,duration:1250},
   {kind:'hold',duration:380}
  ];
  next();return true;
 }
 function next(){
  act=queue.shift()||null;
  if(act){act.start=clock;if(act.kind==='move')act.from={x,y};if(act.kind==='nod'||act.kind==='hold'){act.x=x;act.y=y}}
  else{rest={x,y};restUntil=clock+700}
 }
 function calm(){clicks=0;shakeAt=-1e9}
 function greet(){if(party>=0||clock<greetUntil)return;greetUntil=clock+2500;say(annoyed()?'Easy there.':'Oh, hi.',80)}

 // Every follower is a small spring chasing a slot around the pointer. Its own period, damping,
 // wobble and trail are what make the school feel like many creatures instead of one shape.
 function body(f,ring,i){
  const period=f.period;
  f.k=Math.pow(2*Math.PI/period,2);f.c=2*f.zeta*Math.sqrt(f.k);
  f.vx=0;f.vy=0;f.ring=ring;f.wf=rand(.0015,.003);f.wp=rand(0,Math.PI*2);f.wa=rand(.12,.3);
  f.trail=ring*14+rand(-6,6);f.lead=ring?0:.03;
  return f;
 }
 function proxy(){
  // Visible from the first frame, so a demo cursor is replaced in place and never blinks out.
  const el=document.createElement('cursor-theatre');el.setAttribute('aria-hidden','true');el.style.opacity='1';
  el.configure({design:{...design,maxWidth:170}});overlay.append(el);return el;
 }
 function floodCursor(fill){
  const el=document.createElement('div');el.className='flood-cursor';el.style.opacity='1';
  el.innerHTML=window.CursorTheatre.pointerMarkup(fill);overlay.append(el);return el;
 }
 function releaseFlood(age){
  const W=overlay.clientWidth||innerWidth,H=overlay.clientHeight||innerHeight,far=Math.hypot(W,H)+80;
  let n=0,ring=1;
  while(n<FLOOD){
   const radius=92+42*(ring-1),cap=8+3*(ring-1),spin=(ring%2?-1:1)*(.00042-.00004*ring),breath=10+2*ring;
   for(let k=0;k<cap&&n<FLOOD;k++,n++){
    // Each newcomer starts just outside the viewport, in its own direction, and keeps that exit for later.
    const a=Math.random()*Math.PI*2;
    const entry={x:clamp(center.x+Math.cos(a)*far,-60,W+60),y:clamp(center.y+Math.sin(a)*far,-60,H+60)};
    followers.push(body({kind:'flood',el:floodCursor('#111'),x:entry.x,y:entry.y,entry,angle:rand(0,360),scale:rand(.78,1.18),
     phase:k/cap*Math.PI*2+rand(0,.5),radius:radius+rand(-9,9),spin,breath,period:rand(.2,.26)+.045*ring,zeta:rand(.7,.95),
     startAge:age+n*POUR_MS,leaveAt:RETURN_AT+300+n*12,launched:false},ring,n));
   }
   ring++;
  }
 }
 function summon(event){
  const keyboard=event.detail===0,touch=event.pointerType==='touch';
  const rect=hit.getBoundingClientRect(),trigger={x:rect.left+rect.width/2,y:rect.top+rect.height/2};
  if(touch){center={x:event.clientX,y:event.clientY};trackPointer=false}
  else if(keyboard){center=pointer?{...pointer}:trigger;trackPointer=!!pointer}
  else{center={x:event.clientX,y:event.clientY};trackPointer=true}
  prevCenter=null;vel={x:0,y:0};
  document.dispatchEvent(new CustomEvent('cursor-crowd',{detail:true}));
  followers=[];flooded=false;
  demos.forEach(demo=>{
   const states=demo.cursorPositions();
   if(!states.length)return;
   demo._wasPlaying=demo.playing;demo.pause();demo.stopDirect();
   states.forEach(state=>{
    const i=followers.length;
    followers.push(body({kind:'native',el:proxy(),demo,index:state.index,accent:state.accent,x:state.x,y:state.y,angle:state.angle,scale:1,
     phase:i*Math.PI/3,radius:52+(i%3)*6,spin:.00048,breath:9,period:rand(.17,.23),zeta:rand(.78,.92),startAge:i*45,leaveAt:RETURN_AT+i*40,hearAt:HEAR_AT+i*HEAR_GAP,launched:false,
     home:()=>demo.cursorPositions().find(s=>s.index===state.index)||state},0,i));
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
  calm();greetUntil=clock+1800;settle();remarkAt=0;
  if(thank)say('Thanks, guys.',90);else{message='';said=-1e9}
 }

 hit.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')greet()});
 hit.addEventListener('focus',greet);
 hit.addEventListener('click',event=>{
  if(party>=0)return;
  if(clock-lastClick>5000)clicks=0;
  lastClick=clock;clicks++;greetUntil=clock+2400;
  settle();remarkAt=0;
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
  // Pointer velocity, smoothed, so the school can lean into the motion and trail behind it.
  if(prevCenter&&dt>0){const s=dt/1000,k=1-Math.exp(-dt/60);vel.x+=((center.x-prevCenter.x)/s-vel.x)*k;vel.y+=((center.y-prevCenter.y)/s-vel.y)*k}
  prevCenter={...center};
  const speed=Math.hypot(vel.x,vel.y),dir=speed>1?{x:vel.x/speed,y:vel.y/speed}:{x:0,y:0},stretch=Math.min(speed,1500)/1500;
  if(!flooded&&age>=0){
   const near=followers.some(f=>f.kind==='native'&&Math.hypot(f.x+14-center.x,f.y+14-center.y)<NEAR);
   if(near||age>FLOOD_BY){flooded=true;releaseFlood(age)}
  }
  const still=reduced.matches,sinceShout=clock-party;
  // The shouter's position on screen, for the crowd to look at.
  const rr=region.getBoundingClientRect(),shouter={x:rr.left+x+14,y:rr.top+y+14};
  followers.forEach((f,i)=>{
   if(f.kind==='native'&&age<f.startAge){
    // Heard it: snap round toward the shout, then hold the stare until it is time to go.
    if(sinceShout>=f.hearAt){const look=Math.atan2(shouter.y-(f.y+14),shouter.x-(f.x+14))*180/Math.PI+135;f.angle+=shortest(look,f.angle)*(still?1:1-Math.exp(-dt/55))}
    f.el.inspect({x:f.x/W,y:f.y/H,angle:f.angle,accent:f.accent,direction:'left',text:'',progress:1,progressMode:'reveal'});
    return;
   }
   const a=f.phase+(still?0:age*f.spin+Math.sin(age*f.wf+f.wp)*f.wa);
   const radius=f.radius+(still?0:Math.sin(age*.002+i*1.7)*f.breath);
   // Slot: a point on the ring around an anchor that leads the pointer a little and trails behind it at speed.
   const ax=center.x+vel.x*f.lead-dir.x*stretch*f.trail,ay=center.y+vel.y*f.lead-dir.y*stretch*f.trail;
   const tx=clamp(ax+Math.cos(a)*radius-14,2,W-30),ty=clamp(ay+Math.sin(a)*radius*.78-14,2,H-30);
   const leave=ease((age-f.leaveAt)/500);
   if(leave>0){
    // Ease away from wherever the follower was when called back: natives land exactly on their
    // originals, the flood slips back out the way it came.
    if(!f.leaveFrom)f.leaveFrom={x:f.x,y:f.y,angle:f.angle};
    const home=f.kind==='native'?f.home():f.entry;
    f.x=f.leaveFrom.x+(home.x-f.leaveFrom.x)*leave;f.y=f.leaveFrom.y+(home.y-f.leaveFrom.y)*leave;
    if(f.kind==='native')f.angle=f.leaveFrom.angle+shortest(home.angle,f.leaveFrom.angle)*leave;
    else f.el.style.opacity=String(1-leave);
   }else if(age>=f.startAge){
    if(still){f.x=tx;f.y=ty}
    else{
     // Take off with a burst toward the pointer, so the departure reads as a decision, not a drift.
     if(!f.launched){f.launched=true;const d=Math.hypot(tx-f.x,ty-f.y)||1;f.vx=(tx-f.x)/d*(f.kind==='native'?1100:700);f.vy=(ty-f.y)/d*(f.kind==='native'?1100:700)}
     // The nearer a follower is to the pointer, the stiffer its spring: the inner school snaps, the edges drift.
     const near=1-clamp(Math.hypot(f.x+14-center.x,f.y+14-center.y)/260,0,1);
     const k=f.k*(.75+.6*near),c=f.c*(.9+.3*near);
     let rest=dt/1000;
     while(rest>0){
      const h=Math.min(rest,.008);rest-=h;
      f.vx+=(k*(tx-f.x)-c*f.vx)*h;f.vy+=(k*(ty-f.y)-c*f.vy)*h;
      f.x+=f.vx*h;f.y+=f.vy*h;
     }
    }
    // Face the way it swims; settle to facing the pointer when it rests.
    const own=Math.hypot(f.vx,f.vy),swim=clamp((own-40)/160,0,1);
    const toPointer=Math.atan2(center.y-(f.y+14),center.x-(f.x+14))*180/Math.PI+135;
    const heading=own>1?Math.atan2(f.vy,f.vx)*180/Math.PI+135:toPointer;
    const desired=toPointer+shortest(heading,toPointer)*swim;
    f.angle+=shortest(desired,f.angle)*(still?1:1-Math.exp(-dt/90));
   }
   if(f.kind==='native'){
    const line=CHORUS[i],speaking=line&&age>line[1]&&age<line[2];
    f.el.inspect({x:f.x/W,y:f.y/H,angle:f.angle,accent:f.accent,direction:Math.cos(a)<0?'right':'left',text:speaking?line[3]:'',progress:still||!line?1:clamp((age-line[1])/480,0,1),progressMode:'reveal'});
   }else f.el.style.transform=`translate(${f.x}px,${f.y}px) rotate(${f.angle}deg) scale(${f.scale})`;
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
   // Idle: drift slowly between places in the intro, rest a while, now and then say something about what is nearby.
   let sx=0,sy=0;
   if(idle&&!reduced.matches){
    if(!opened){opened=true;opening()}
    if(act){
     const u=clamp((clock-act.start)/act.duration,0,1);
     if(act.kind==='move'){const e=act.ease(u);x=act.from.x+(act.to.x-act.from.x)*e;y=act.from.y+(act.to.y-act.from.y)*e+Math.sin(u*Math.PI)*act.arc}
     else if(act.kind==='nod'){x=act.x;y=act.y+Math.sin(u*Math.PI*2*act.times)*7*(1-u*.35)}
     else if(act.kind==='orbit'){const a=act.a0+inOut(u)*Math.PI*2*act.turns;x=act.cx+Math.cos(a)*act.rx-14;y=act.cy+Math.sin(a)*act.ry-14}
     else{x=act.x;y=act.y}
     if(u>=1)next();
    }else if(wander){
     const u=clamp((clock-wander.start)/wander.duration,0,1),e=inOut(u);
     x=wander.from.x+(wander.to.x-wander.from.x)*e;y=wander.from.y+(wander.to.y-wander.from.y)*e+Math.sin(u*Math.PI)*wander.bob;
     if(!waypoint.inspect&&u>.4)hit.style.pointerEvents='';
     if(u>=1){
      rest={x,y};wander=null;restUntil=clock+800+Math.random()*1200;
      if(waypoint.inspect){queue=[{kind:'nod',times:1,duration:420}];next()}
      const gap=clock-lastRemark,want=waypoint.always?gap>4500:gap>8000&&Math.random()<.65;
      if(waypoint.line&&!clicks&&want&&clock-said>2600)remarkAt=clock+(waypoint.inspect?450:300);
     }
    }else{
     x=rest.x;y=rest.y;sx=Math.sin(clock*.0016)*3;sy=Math.sin(clock*.0023)*2.2;
     if(clock>=restUntil)depart();
    }
    if(remarkAt&&clock>=remarkAt){remarkAt=0;lastRemark=clock;say(waypoint.line,130)}
   }
   const shakeAge=clock-shakeAt;
   const shake=idle&&!reduced.matches&&shakeAge<500?Math.sin(shakeAge*.075)*4*(1-shakeAge/500):0;
   renderHero(x+shake+sx,y+sy);
   if(!idle)renderCrowd(dt);
  }catch(error){finish(false);cancelAnimationFrame(raf);throw error}
 }
 x=region.clientWidth*.58;rest={x,y};restUntil=1200;
 raf=requestAnimationFrame(frame);
})();
