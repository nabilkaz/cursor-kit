const fs=require('node:fs');
const assert=require('node:assert/strict');
const source=fs.readFileSync('src/cursor-theatre.js','utf8');
const body=source.split('    dialogueState(line,t,index){')[1].split('\n    writeDialogue(')[0].replace(/}\s*$/,'');
const state=new Function('line','t','index','clamp','smooth',body);
const clamp=v=>Math.max(0,Math.min(1,v));const smooth=v=>v*v*(3-2*v);
function reveal(ms,progress,mode){return state.call({_inspection:{progressMode:mode},settings:{design:{revealMs:ms,reveal:'typing'}},reduced:{matches:false}},[0,1,0,'Just checking on you.'],progress,0,clamp,smooth)}
const hero=reveal(480,600/2400);
assert.ok(hero.visibility.every(v=>v===1),'Hero text must finish within 480 ms, not 2.4 seconds');
const designer=reveal(850,.34,'reveal');
assert.ok(designer.count>0&&designer.count<designer.letters.length,'Designer 34% must show partial text');
console.log('PASS: landing timing and designer scrubbing');
