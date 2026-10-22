const get = id => document.getElementById(id);
const actors = ['guide','celebrate','move','turn'].map(get);
get('guide').configure({scene:'entrance',customLine:'Start here.'});get('guide').seek(1);
// The second card rotates through moods, one per loop.
const moods=[
 {scene:'celebration',title:'Mark a small win',text:'A shared celebration when something works.',recipe:"Trigger scene:'celebration' after a successful user action. Keep the app's ordinary success feedback accessible and use the cursor as a complementary animation."},
 {scene:'frustrated',title:'Let it vent',text:'A real mouse-shake when something will not work.',recipe:"Trigger scene:'frustrated' when an action fails or stalls. Keep the real error message in place and let the cursor carry the mood."},
 {scene:'elated',title:'Yes, that worked',text:'A delighted shake, then back to work.',recipe:"Trigger scene:'elated' after a small success that does not need a full celebration."},
 {scene:'shy',title:'Say a quiet hello',text:'A quick peek, a pause, then a small commitment.',recipe:"Trigger scene:'shy' the first time a feature appears. Keep it brief and never block the interface."},
 {scene:'agreement',title:'Find the same page',text:'An echo becomes a shared gesture.',recipe:"Trigger scene:'agreement' when two sides confirm the same thing, such as a shared decision or a synced state."}
];
let moodIndex=0,steppedMood=false;
function setMood(index){
 moodIndex=(index+moods.length)%moods.length;
 const mood=moods[moodIndex];
 get('celebrate').configure({scene:mood.scene});
 get('celebrate-title').textContent=mood.title;get('celebrate-text').textContent=mood.text;
 get('celebrate-copy').animate([{opacity:.2},{opacity:1}],{duration:320,easing:'ease-out'});
}
get('celebrate').configure({scene:moods[0].scene});get('celebrate').seek(.9);
get('move').configure({scene:'entrance',dialogue:false});get('move').seek(1);
const facings=['left','right','up','down'];let facingIndex=0,turnRaf=0;
function showPose(from){
 cancelAnimationFrame(turnRaf);
 const direction=facings[facingIndex],start=performance.now();
 const draw=now=>{
  const u=from?Math.min(1,(now-start)/220):1;
  get('turn').inspect({direction,from:u<1?from:undefined,turnProgress:u,text:'A different angle.',progress:1,progressMode:'reveal'});
  if(u<1)turnRaf=requestAnimationFrame(draw);
 };
 draw(start);
}
showPose();
// The scene demos loop while on screen: hold the final frame, then replay.
const loops=['guide','celebrate'].map(get);
const onscreen=new Set();
const HOLD_MS=1800;
// assets/hero.js borrows the demo cursors for a moment; loops wait until they are back.
let crowdActive=false;
document.addEventListener('cursor-crowd',({detail})=>{
 crowdActive=!!detail;
 if(crowdActive)actors.forEach(a=>clearTimeout(a.loopTimer));
 else loops.forEach(a=>{if(onscreen.has(a)&&!a.playing&&a.progress>=1)queueReplay(a);});
});
function queueReplay(actor){
 clearTimeout(actor.loopTimer);
 if(crowdActive||!onscreen.has(actor)||document.hidden)return;
 actor.loopTimer=setTimeout(()=>{
  if(!onscreen.has(actor)||document.hidden)return;
  if(actor===get('celebrate')&&!steppedMood)setMood(moodIndex+1);
  actor.replay();
 },HOLD_MS);
}
loops.forEach(actor=>actor.addEventListener('playstate',({detail:playing})=>{
 if(playing)clearTimeout(actor.loopTimer);
 else if(actor.progress>=1)queueReplay(actor);
}));
document.querySelectorAll('[data-play]').forEach(b=>b.onclick=()=>get(b.dataset.play).replay());
document.querySelectorAll('[data-target]').forEach(b=>b.onclick=()=>get('move').moveTo(Number(b.dataset.target),.5));
document.querySelectorAll('[data-turn]').forEach(b=>b.onclick=()=>{const from=facings[facingIndex];facingIndex=(facingIndex+Number(b.dataset.turn)+facings.length)%facings.length;showPose(from);});
document.querySelectorAll('[data-mood]').forEach(b=>b.onclick=()=>{steppedMood=true;clearTimeout(get('celebrate').loopTimer);setMood(moodIndex+Number(b.dataset.mood));get('celebrate').replay();});
const recipes={
 guide:"Add an introduction on the appropriate user action. Configure scene:'entrance' and customLine:'Start here.'. Use the app's own message if a better one is provided.",
 move:"Use actor.moveTo(x,y) to demonstrate movement between two targets. Convert target centers into normalized coordinates inside the actor's container. End direct movement with stopDirect().",
 turn:"Use actor.inspect({direction:'right',text:'A different angle.',progress:1,progressMode:'reveal'}) to preview cursor orientation and dialogue together. Keep x and y for stage position separate from direction."
};
let statusTimer,copiedTimer;
// The primary button confirms in place: the copy icon becomes a check and the label reads Copied for a moment.
function copied(button){
 const label=button.querySelector('.label');button.style.minWidth=button.offsetWidth+'px';button.dataset.state='copied';label.textContent='Copied';
 clearTimeout(copiedTimer);copiedTimer=setTimeout(()=>{delete button.dataset.state;label.textContent='Copy Markdown';button.style.minWidth='';},1600);
}
function notify(text){get('status').textContent=text;clearTimeout(statusTimer);statusTimer=setTimeout(()=>get('status').textContent='',3000);}
document.querySelectorAll('[data-copy]').forEach(button=>button.onclick=async()=>{
 button.disabled=true;
 try{
  const response=await fetch('docs/QUICKSTART.md');
  if(!response.ok)throw new Error('Brief unavailable');
  const base=await response.text();
  const recipe=button.dataset.copy==='celebrate'?moods[moodIndex].recipe:recipes[button.dataset.copy];
  const text=base+(recipe?'\n\n## Requested moment\n\n'+recipe+'\n':'');
  try{
   await navigator.clipboard.writeText(text);
   if(button.classList.contains('primary'))copied(button);else notify('Recipe copied. Ready for your coding agent.');
  }
  catch{get('copy-content').value=text;get('copy-dialog').showModal();get('copy-content').select();}
 }catch{notify('Could not load the brief. Try again in a moment.');}
 finally{button.disabled=false;}
});
const visibility=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
 if(isIntersecting){onscreen.add(target);if(!crowdActive&&loops.includes(target)&&!target.playing)target.replay();}
 else{onscreen.delete(target);clearTimeout(target.loopTimer);target.pause();target.stopDirect();}
}));actors.forEach(a=>visibility.observe(a));
document.addEventListener('visibilitychange',()=>{
 if(document.hidden)actors.forEach(a=>{clearTimeout(a.loopTimer);a.pause();a.stopDirect();});
 else if(!crowdActive)loops.forEach(a=>{if(onscreen.has(a)&&!a.playing)a.replay();});
});
