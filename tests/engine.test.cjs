const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('src/cursor-theatre.js','utf8');
let Actor;
const context={HTMLElement:class {},window:{},customElements:{get:()=>undefined,define:(name,C)=>Actor=C},requestAnimationFrame:()=>1,cancelAnimationFrame:()=>{},CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail}}};
vm.runInNewContext(source,context);
function actor(){return Object.assign(Object.create(Actor.prototype),{settings:{scene:'entrance',speed:1,energy:1,arc:1,design:{placements:{left:{x:25}}}},progress:0,playing:false,reduced:{matches:false},render(){},stopDirect(){this.stopped=true},dispatchEvent(){}});}
test('configuration clamps motion and preserves placement on partial design edits',()=>{
 const a=actor();a.configure({speed:9,arc:-1,energy:3,design:{revealMs:400}});
 assert.equal(a.settings.speed,2);assert.equal(a.settings.arc,0);assert.equal(a.settings.energy,2);
 assert.equal(a.settings.design.placements.left.x,25);assert.equal(a.settings.design.revealMs,400);
});
test('changing scene resets playback and the legacy handshake name remains compatible',()=>{
 const a=actor();a.playing=true;a.progress=.6;a.configure({scene:'handshake'});
 assert.equal(a.settings.scene,'agreement');assert.equal(a.progress,0);assert.equal(a.playing,false);
});
test('reduced motion resolves playback to the final pose without starting a clock',()=>{
 const a=actor();a.reduced.matches=true;a.play();assert.equal(a.progress,1);assert.equal(a.playing,false);
});
test('manual seeking clamps and stops direct movement',()=>{
 const a=actor();a.seek(10);assert.equal(a.progress,1);assert.equal(a.stopped,true);a.seek(-1);assert.equal(a.progress,0);
});
test('preset timelines are ordered and have valid dialogue bounds',()=>{
 for(const s of Object.values(context.window.CursorTheatre.scenes)){
  assert.ok(s.duration>0);
  for(const path of [s.a,s.b].filter(Boolean))for(let i=1;i<path.length;i++)assert.ok(path[i][0]>=path[i-1][0]);
  for(const [start,end,index,text] of s.lines){assert.ok(start>=0&&end<=1&&end>start);assert.ok(index===0||index===1);assert.equal(typeof text,'string');}
 }
});
test('portable catalog excludes native artwork and includes multiple SVG choices',()=>{
 const a=actor();assert.ok(a.cursorTypes.length>10);assert.ok(a.cursorTypes.every(c=>!c.src&&c.source!=='Original macOS artwork'));
});
