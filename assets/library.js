const get = id => document.getElementById(id);
const actors = ['guide','celebrate','move','turn'].map(get);
get('guide').configure({scene:'entrance',customLine:'Start here.'});get('guide').seek(1);
get('celebrate').configure({scene:'celebration'});get('celebrate').seek(.9);
get('move').configure({scene:'entrance',dialogue:false});get('move').seek(1);
let facing='left';
function showPose(){get('turn').inspect({direction:facing,text:'A different angle.',progress:1,progressMode:'reveal'});}
showPose();
// The scene demos loop while on screen: hold the final frame, then replay.
const loops=['guide','celebrate'].map(get);
const onscreen=new Set();
const HOLD_MS=1800;
function queueReplay(actor){
 clearTimeout(actor.loopTimer);
 if(!onscreen.has(actor)||document.hidden)return;
 actor.loopTimer=setTimeout(()=>{if(onscreen.has(actor)&&!document.hidden)actor.replay();},HOLD_MS);
}
loops.forEach(actor=>actor.addEventListener('playstate',({detail:playing})=>{
 if(playing)clearTimeout(actor.loopTimer);
 else if(actor.progress>=1)queueReplay(actor);
}));
document.querySelectorAll('[data-play]').forEach(b=>b.onclick=()=>get(b.dataset.play).replay());
document.querySelectorAll('[data-target]').forEach(b=>b.onclick=()=>get('move').moveTo(Number(b.dataset.target),.5));
get('turn-button').onclick=()=>{facing=facing==='left'?'right':'left';showPose();};
const recipes={
 guide:"Add an introduction on the appropriate user action. Configure scene:'entrance' and customLine:'Start here.'. Use the app's own message if a better one is provided.",
 celebrate:"Trigger scene:'celebration' after a successful user action. Keep the app's ordinary success feedback accessible and use the cursor as a complementary animation.",
 move:"Use actor.moveTo(x,y) to demonstrate movement between two targets. Convert target centers into normalized coordinates inside the actor's container. End direct movement with stopDirect().",
 turn:"Use actor.inspect({direction:'right',text:'A different angle.',progress:1,progressMode:'reveal'}) to preview cursor orientation and dialogue together. Keep x and y for stage position separate from direction."
};
let statusTimer;
function notify(text){get('status').textContent=text;clearTimeout(statusTimer);statusTimer=setTimeout(()=>get('status').textContent='',3000);}
document.querySelectorAll('[data-copy]').forEach(button=>button.onclick=async()=>{
 button.disabled=true;
 try{
  const response=await fetch('docs/QUICKSTART.md');
  if(!response.ok)throw new Error('Brief unavailable');
  const base=await response.text();
  const text=base+(recipes[button.dataset.copy]?'\n\n## Requested moment\n\n'+recipes[button.dataset.copy]+'\n':'');
  try{await navigator.clipboard.writeText(text);notify('Markdown copied. Ready for your coding agent.');}
  catch{get('copy-content').value=text;get('copy-dialog').showModal();get('copy-content').select();}
 }catch{notify('Could not load the brief. Open “Read the integration brief” to copy it.');}
 finally{button.disabled=false;}
});
const visibility=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
 if(isIntersecting){onscreen.add(target);if(loops.includes(target)&&!target.playing)target.replay();}
 else{onscreen.delete(target);clearTimeout(target.loopTimer);target.pause();target.stopDirect();}
}));actors.forEach(a=>visibility.observe(a));
document.addEventListener('visibilitychange',()=>{
 if(document.hidden)actors.forEach(a=>{clearTimeout(a.loopTimer);a.pause();a.stopDirect();});
 else loops.forEach(a=>{if(onscreen.has(a)&&!a.playing)a.replay();});
});
