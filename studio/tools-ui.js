(() => {
  const designer=!!document.getElementById('actor');
  document.body.classList.add('tool-app',designer?'designer':'playground');
  const header=document.querySelector('header');
  const action=document.getElementById(designer?'save':'download');
  header.replaceChildren();
  const brand=document.createElement('a');brand.href='../index.html';brand.className='tool-brand';brand.textContent='Cursor Theatre';header.append(brand);
  const nav=document.createElement('nav');nav.className='tool-nav';nav.setAttribute('aria-label','Main navigation');
  [['Overview','../index.html',false],['Scene Editor','index.html?v=tools-2',!designer],['Cursor Designer','lab.html?v=tools-2',designer]].forEach(([label,url,active])=>{const a=document.createElement('a');a.href=url;a.textContent=label;if(active)a.setAttribute('aria-current','page');nav.append(a)});header.append(nav,action);
  action.textContent=designer?'Apply to editor':'Export scene';
  function folder(section,title,open=true){const d=document.createElement('details');d.className='inspector-group';d.open=open;const s=document.createElement('summary');s.textContent=title;d.append(s);section.before(d);d.append(section);return d}
  if(designer){
    document.querySelector('main>h1').textContent='Cursor Designer';document.querySelector('main>p').textContent='Shape the cursor, place its dialogue, and fine-tune each turn.';
    const inspector=document.querySelector('.controls'),preview=document.querySelector('.preview');
    const library=document.querySelector('.cursor-library');inspector.prepend(library);const cursorGroup=folder(library,'Cursor',true);document.getElementById('cursor-type').closest('label').hidden=true;
    library.append(document.getElementById('angle-controls'));
    const posePanel=inspector.querySelector('.pose-panel');posePanel.querySelector('h2').hidden=true;posePanel.querySelector('.hint').remove();
    const positionHeading=document.createElement('h3');positionHeading.textContent='Position';document.getElementById('offsets').before(positionHeading);
    const dialogueGroup=folder(posePanel,'Dialogue',true);
    const panels=[...inspector.querySelectorAll(':scope > .panel')];
    const content=panels.find(p=>p.querySelector('h2').textContent==='Dialogue content');
    const stagePosition=document.getElementById('position').closest('label');
    const canvasTools=document.getElementById('compare').closest('.tools');canvasTools.classList.add('canvas-tools');canvasTools.append(document.getElementById('guides').closest('label'),stagePosition);content.hidden=true;
    panels.filter(p=>p!==content).forEach(p=>{dialogueGroup.append(p);const title=p.querySelector('h2');folder(p,title.textContent,false);title.hidden=true});
    const playback=document.getElementById('text-play').closest('.tools');const progress=document.getElementById('scrub').closest('.range');
    const motion=document.createElement('section');motion.className='dialogue-motion';motion.append(playback,progress);dialogueGroup.append(motion);folder(motion,'Text animation',true);
    [...preview.querySelectorAll('.below')].forEach(p=>{motion.append(p)});
    const timing=dialogueGroup.querySelector('#timing-controls').closest('.inspector-group');motion.append(timing);
    const actions=preview.querySelector('.actions');inspector.append(actions);actions.classList.add('inspector-actions');
    document.getElementById('download').textContent='Export settings';
    document.getElementById('reset').textContent='Reset';
    document.querySelector('main>h1').remove();document.querySelector('main>p').remove();
    const layout=document.querySelector('.layout');layout.classList.add('designer-studio');
    const cursorSidebar=document.createElement('aside');cursorSidebar.className='designer-cursors';cursorSidebar.setAttribute('aria-label','Cursor properties');layout.prepend(cursorSidebar);
    const cursorTitle=document.createElement('h2');cursorTitle.textContent='Cursor';cursorSidebar.append(cursorTitle,library);cursorGroup.remove();library.prepend(document.getElementById('angle-controls'));
    const orientation=document.createElement('div');orientation.className='designer-stage-head';
    const orientationLabel=document.createElement('span');orientationLabel.textContent='Orientation';orientation.append(orientationLabel,document.querySelector('.directions'));preview.prepend(orientation);
    canvasTools.classList.add('designer-view-tools');document.getElementById('stage').before(canvasTools);
    canvasTools.prepend(stagePosition);stagePosition.firstChild.textContent='Cursor on stage';
    const dialogueTitle=document.createElement('h2');dialogueTitle.textContent='Dialogue';inspector.prepend(dialogueTitle);
    const placementNote=document.createElement('p');placementNote.className='placement-context';
    const updateContext=()=>{const active=document.querySelector('[data-dir][aria-pressed="true"]');placementNote.textContent='Placement for '+active.dataset.dir+' orientation'};
    posePanel.prepend(placementNote);updateContext();document.querySelectorAll('[data-dir]').forEach(button=>new MutationObserver(updateContext).observe(button,{attributes:true,attributeFilter:['aria-pressed']}));
    const dialogueContents=document.createElement('div');dialogueContents.className='dialogue-properties';dialogueContents.append(...[...dialogueGroup.children].filter(child=>child.tagName!=='SUMMARY'));dialogueGroup.replaceWith(dialogueContents);
    positionHeading.textContent='Position from cursor';
    const previewTransport=document.createElement('div');previewTransport.className='designer-transport';
    const previewLabel=document.createElement('span');previewLabel.className='eyebrow';previewLabel.textContent='Dialogue preview';
    previewTransport.append(previewLabel,playback,progress);layout.append(previewTransport);
    const editHint=document.createElement('span');editHint.className='preview-edit-hint';editHint.textContent='Click dialogue to edit · Enter to save · Esc to cancel';previewTransport.append(editHint);
    const status=document.getElementById('status');inspector.append(status);
    orientation.classList.add('cursor-orientation');cursorTitle.after(orientation);orientation.after(stagePosition);stagePosition.classList.add('cursor-stage-position');
    const globalTools=document.createElement('div');globalTools.className='designer-global-tools';preview.prepend(globalTools);globalTools.append(canvasTools,actions);
    document.getElementById('guides').closest('label').before(document.getElementById('compare').closest('label'));
    document.getElementById('text-play').textContent='Play';
    progress.classList.add('text-timeline');progress.querySelector('label').firstChild.textContent='Text entrance ';
    const ruler=document.createElement('div');ruler.className='text-ruler';for(let i=0;i<=4;i++){const tick=document.createElement('span');tick.dataset.tick=i/4;tick.textContent=(i/4*.85).toFixed(2)+'s';ruler.append(tick)}
    const clip=document.createElement('div');clip.id='text-timeline-clip';clip.className='text-timeline-clip';clip.textContent=document.getElementById('text').value;
    const track=document.createElement('div');track.className='text-timeline-track';track.append(clip,document.getElementById('scrub'));progress.append(ruler,track);
    document.getElementById('scrub').setAttribute('aria-label','Dialogue timeline');

    const positionSelect=document.getElementById('position');stagePosition.hidden=true;
    const positionPicker=document.createElement('fieldset');positionPicker.className='stage-position-picker';
    const legend=document.createElement('legend');legend.textContent='Cursor on stage';positionPicker.append(legend);
    const positionGrid=document.createElement('div');positionGrid.className='stage-position-grid';positionPicker.append(positionGrid);stagePosition.after(positionPicker);
    const positions=[['top-left','Top left'],['top','Top center'],['top-right','Top right'],['left','Middle left'],['center','Center'],['right','Middle right'],['bottom-left','Bottom left'],['bottom','Bottom center'],['bottom-right','Bottom right']];
    positions.forEach(([value,label],index)=>{
      if(![...positionSelect.options].some(o=>o.value===value)){const option=document.createElement('option');option.value=value;option.textContent=label;positionSelect.append(option)}
      const cell=document.createElement('button');cell.type='button';cell.dataset.stagePosition=value;cell.title=label;cell.setAttribute('aria-label','Stage position: '+label);cell.setAttribute('aria-pressed',value===positionSelect.value);cell.innerHTML='<span aria-hidden="true"></span>';
      cell.onclick=()=>{positionSelect.value=value;positionSelect.dispatchEvent(new Event('change'))};
      cell.onkeydown=e=>{const delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-3,ArrowDown:3}[e.key];if(delta===undefined)return;e.preventDefault();const target=Math.max(0,Math.min(8,index+delta));positionGrid.children[target].focus();positionGrid.children[target].click()};positionGrid.append(cell);
    });
    const transportControls=document.createElement('div');transportControls.className='preview-playback-controls';transportControls.append(previewLabel,playback);previewTransport.prepend(transportControls);
    document.getElementById('scrub').dispatchEvent(new Event('input'));

    document.getElementById('compare').checked=false;document.getElementById('compare').dispatchEvent(new Event('change'));
  }else{
    document.querySelector('.intro').remove();
    const studio=document.querySelector('.studio'),panel=document.createElement('aside');panel.className='motion-inspector';panel.setAttribute('aria-label','Motion settings');studio.append(panel);
    const director=document.querySelector('.director');panel.append(director);director.querySelector('.eyebrow').textContent='Motion';
    panel.append(document.querySelector('details.details'));
    document.querySelector('.sidebar .eyebrow').textContent='Moments';document.querySelector('.sidebar-foot').remove();
    document.querySelector('.footer').remove();
    document.querySelectorAll('.control').forEach(control=>{const range=control.querySelector('input'),label=control.querySelector('label'),output=control.querySelector('output');const number=document.createElement('input');number.type='number';number.min=range.min;number.max=range.max;number.value=range.value;number.step='1';number.setAttribute('aria-label',label.textContent.replace(output.textContent,'').trim()+' percent');number.className='exact-value';number.disabled=range.disabled;new MutationObserver(()=>number.disabled=range.disabled).observe(range,{attributes:true,attributeFilter:['disabled']});output.before(number);output.hidden=true;range.addEventListener('input',()=>number.value=range.value);number.addEventListener('input',()=>{if(number.value==='')return;range.value=Math.max(+range.min,Math.min(+range.max,+number.value));range.dispatchEvent(new Event('input'))});number.addEventListener('change',()=>number.value=range.value)});
    const hint=document.createElement('p');hint.className='tool-hint';hint.textContent='Space to play or pause · Drag the playhead to inspect a moment';document.querySelector('.transport').append(hint);
    document.addEventListener('keydown',e=>{if(e.code==='Space'&&!/INPUT|TEXTAREA|SELECT|BUTTON/.test(e.target.tagName)){e.preventDefault();document.getElementById('play').click()}});
  }
})();
