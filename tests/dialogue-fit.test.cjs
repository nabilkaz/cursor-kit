const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
let Actor;
vm.runInNewContext(fs.readFileSync('src/cursor-theatre.js','utf8'),{HTMLElement:class{},window:{},customElements:{get:()=>undefined,define:(_,C)=>Actor=C}});
function setup(){
 const body={style:{}};
 const bubble={style:{},offsetWidth:280,offsetHeight:80,getBoundingClientRect:()=>({width:140,height:40})};
 const node={querySelector:s=>s==='.bubble'?bubble:body};
 const a=Object.assign(Object.create(Actor.prototype),{clientWidth:800,clientHeight:500,reduced:{matches:false},settings:{design:{paddingX:16,paddingY:11,maxWidth:320,minWidth:0,fontSize:16,radius:20,turnStyle:'rotate',placements:{left:{x:25,y:28,ax:0,ay:0,angle:0,corner:'tl'}}}},applyTurn(b,from,to){b.style.transform=`rotate(${to}deg)`}});
 return {a,node,bubble,body};
}
test('right edge flips the cursor and full-width dialogue together before reveal',()=>{
 const {a,node,bubble,body}=setup();a.layoutDialogue(node,'left',700,200,null,1,{key:'message',x:700,y:200,dir:'left'});
 assert.equal(body.style.transform,'rotate(90deg)');assert.equal(parseFloat(bubble.style.left),-277);
});
test('bottom edge flips vertically, and a corner reflects both axes',()=>{
 for(const [x,angle,left,top] of [[300,270,25,-80],[700,180,-277,-80]]){
  const {a,node,bubble,body}=setup();a.layoutDialogue(node,'left',x,450,null,1,{key:'message',x,y:450,dir:'left'});
  assert.equal(body.style.transform,`rotate(${angle}deg)`);assert.equal(parseFloat(bubble.style.left),left);assert.equal(parseFloat(bubble.style.top),top);
 }
});
test('message placement stays locked even as the cursor moves; next message can choose anew',()=>{
 const {a,node,body}=setup();a.layoutDialogue(node,'left',700,200,null,1,{key:'first',x:700,y:200,dir:'left'});
 a.layoutDialogue(node,'left',350,200,null,1,{key:'first',x:350,y:200,dir:'left'});assert.equal(body.style.transform,'rotate(90deg)');
 a.layoutDialogue(node,'left',350,200,null,1,{key:'second',x:350,y:200,dir:'left'});assert.equal(body.style.transform,'rotate(0deg)');
});
