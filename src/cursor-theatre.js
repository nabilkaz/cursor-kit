/* Cursor Theatre — dependency-free, embeddable cursor performances. */
(() => {
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const smooth = t => t * t * (3 - 2 * t);
  const mix = (a, b, t) => a + (b - a) * t;
  const cursorCatalog = [{"id":"theatre","label":"Canvas pointer","source":"Liveblocks multiplayer cursor (Apache-2.0)","note":"Official Liveblocks SVG path, optically sized to 20 px with a 1.4 px outline.","width":28,"height":28,"frames":1},{"id":"white-arrow","label":"White pointer","source":"Recreated tool cursor","svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 28 28\" fill=\"white\" stroke=\"#171b1c\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 3v21l6-6 4 8 4-2-4-8 8-1Z\"/></svg>","width":28,"height":28,"frames":1,"note":"Classic light pointer; uses your selected orientation.","animation":""},{"id":"precision","label":"Precision cross","source":"Recreated tool cursor","svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 28 28\" fill=\"white\" stroke=\"#171b1c\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M14 3v22M3 14h22\" fill=\"none\" stroke=\"white\" stroke-width=\"4\"/><path d=\"M14 3v22M3 14h22\" fill=\"none\"/></svg>","width":28,"height":28,"frames":1,"note":"A fine cross for accurate placement.","animation":""},{"id":"prohibited","label":"Unavailable","source":"Recreated tool cursor","svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 28 28\" fill=\"white\" stroke=\"#171b1c\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"14\" cy=\"14\" r=\"9\"/><path d=\"M8 8l12 12\"/></svg>","width":28,"height":28,"frames":1,"note":"Unavailable target, without a pointer badge.","animation":""},{"id":"wait","label":"Spinning wait","source":"Recreated tool cursor","svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 28 28\" fill=\"white\" stroke=\"#171b1c\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><foreignObject x=\"3\" y=\"3\" width=\"22\" height=\"22\"><div xmlns=\"http://www.w3.org/1999/xhtml\" style=\"width:22px;height:22px;border-radius:50%;background:conic-gradient(#e54946,#eea52d,#e9db50,#66bc60,#27b1d4,#7774d5,#d66db6,#e54946);box-shadow:inset 0 0 0 1px #0002\"/></foreignObject></svg>","width":28,"height":28,"frames":1,"note":"Recreated macOS-style wait disk. Spins while busy; stops with reduced motion.","animation":"spin"},{"id":"hourglass","label":"Classic hourglass","source":"Recreated tool cursor","svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 28 28\" fill=\"white\" stroke=\"#171b1c\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g class=\"glass\"><path d=\"M7 3h14M7 25h14M8 4c0 6 2 7 6 10-4 3-6 4-6 10h12c0-6-2-7-6-10 4-3 6-4 6-10Z\"/><path class=\"sand-top\" d=\"M10 6h8l-4 6Z\" fill=\"#bd9553\" stroke=\"none\"/><path class=\"sand-bottom\" d=\"M10 22l4-6 4 6Z\" fill=\"#bd9553\" stroke=\"none\"/><path d=\"M14 12v5\" stroke=\"#bd9553\" stroke-width=\"1\"/></g></svg>","width":28,"height":28,"frames":1,"note":"Sand drains, then the glass turns over. A classic waiting gesture, not a macOS system cursor.","animation":"hourglass"},{"id":"progress-ring","label":"Progress ring","source":"Recreated tool cursor","svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 28 28\" fill=\"white\" stroke=\"#171b1c\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"14\" cy=\"14\" r=\"9\" fill=\"none\" stroke=\"#ccd4d7\" stroke-width=\"3\"/><path d=\"M14 5a9 9 0 0 1 9 9\" fill=\"none\" stroke=\"#338abe\" stroke-width=\"3\"/></svg>","width":28,"height":28,"frames":1,"note":"A continuous progress spinner.","animation":"spin"},{"id":"drag-link","label":"Link badge","source":"Recreated tool cursor","svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 28 28\" fill=\"white\" stroke=\"#171b1c\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 3v18l5-5 4 8 3-2-4-8 8-1Z\"/><path d=\"M16 20h8m-3-3 3 3-3 3\" fill=\"none\"/></svg>","width":28,"height":28,"frames":1,"note":"A pointer with a link / shortcut badge.","animation":""},{"id":"help-pointer","label":"Pointer with help","source":"Recreated tool cursor","svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 28 28\" fill=\"white\" stroke=\"#171b1c\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 3v17l5-5 4 8 3-2-4-8 7-1Z\"/><text x=\"20\" y=\"24\" stroke=\"none\" fill=\"#111\" font-size=\"14\" font-family=\"sans-serif\">?</text></svg>","width":28,"height":28,"frames":1,"note":"Contextual help beside the pointer.","animation":""},{"id":"arrow-north","label":"Arrow north","source":"Recreated tool cursor","svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 28 28\" fill=\"white\" stroke=\"#171b1c\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g transform=\"rotate(0 14 14)\"><path d=\"M14 3l-6 7h4v15h4V10h4Z\"/></g></svg>","width":28,"height":28,"frames":1,"note":"Single-direction navigation or movement indicator.","animation":""},{"id":"arrow-northeast","label":"Arrow northeast","source":"Recreated tool cursor","svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 28 28\" fill=\"white\" stroke=\"#171b1c\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g transform=\"rotate(45 14 14)\"><path d=\"M14 3l-6 7h4v15h4V10h4Z\"/></g></svg>","width":28,"height":28,"frames":1,"note":"Single-direction navigation or movement indicator.","animation":""},{"id":"arrow-east","label":"Arrow east","source":"Recreated tool cursor","svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 28 28\" fill=\"white\" stroke=\"#171b1c\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g transform=\"rotate(90 14 14)\"><path d=\"M14 3l-6 7h4v15h4V10h4Z\"/></g></svg>","width":28,"height":28,"frames":1,"note":"Single-direction navigation or movement indicator.","animation":""},{"id":"arrow-southeast","label":"Arrow southeast","source":"Recreated tool cursor","svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 28 28\" fill=\"white\" stroke=\"#171b1c\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g transform=\"rotate(135 14 14)\"><path d=\"M14 3l-6 7h4v15h4V10h4Z\"/></g></svg>","width":28,"height":28,"frames":1,"note":"Single-direction navigation or movement indicator.","animation":""},{"id":"arrow-south","label":"Arrow south","source":"Recreated tool cursor","svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 28 28\" fill=\"white\" stroke=\"#171b1c\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g transform=\"rotate(180 14 14)\"><path d=\"M14 3l-6 7h4v15h4V10h4Z\"/></g></svg>","width":28,"height":28,"frames":1,"note":"Single-direction navigation or movement indicator.","animation":""},{"id":"arrow-southwest","label":"Arrow southwest","source":"Recreated tool cursor","svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 28 28\" fill=\"white\" stroke=\"#171b1c\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g transform=\"rotate(225 14 14)\"><path d=\"M14 3l-6 7h4v15h4V10h4Z\"/></g></svg>","width":28,"height":28,"frames":1,"note":"Single-direction navigation or movement indicator.","animation":""},{"id":"arrow-west","label":"Arrow west","source":"Recreated tool cursor","svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 28 28\" fill=\"white\" stroke=\"#171b1c\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g transform=\"rotate(270 14 14)\"><path d=\"M14 3l-6 7h4v15h4V10h4Z\"/></g></svg>","width":28,"height":28,"frames":1,"note":"Single-direction navigation or movement indicator.","animation":""},{"id":"arrow-northwest","label":"Arrow northwest","source":"Recreated tool cursor","svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 28 28\" fill=\"white\" stroke=\"#171b1c\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g transform=\"rotate(315 14 14)\"><path d=\"M14 3l-6 7h4v15h4V10h4Z\"/></g></svg>","width":28,"height":28,"frames":1,"note":"Single-direction navigation or movement indicator.","animation":""},{"id":"turn-top-right","label":"Corner turn top right","source":"Recreated tool cursor","svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 28 28\" fill=\"white\" stroke=\"#171b1c\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g transform=\"rotate(0 14 14)\"><path d=\"M6 23V10h13m-5-5 5 5-5 5\" fill=\"none\" stroke=\"white\" stroke-width=\"4\"/><path d=\"M6 23V10h13m-5-5 5 5-5 5\" fill=\"none\"/></g></svg>","width":28,"height":28,"frames":1,"note":"An editor-specific corner / turn indicator.","animation":""},{"id":"turn-bottom-right","label":"Corner turn bottom right","source":"Recreated tool cursor","svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 28 28\" fill=\"white\" stroke=\"#171b1c\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g transform=\"rotate(90 14 14)\"><path d=\"M6 23V10h13m-5-5 5 5-5 5\" fill=\"none\" stroke=\"white\" stroke-width=\"4\"/><path d=\"M6 23V10h13m-5-5 5 5-5 5\" fill=\"none\"/></g></svg>","width":28,"height":28,"frames":1,"note":"An editor-specific corner / turn indicator.","animation":""},{"id":"turn-bottom-left","label":"Corner turn bottom left","source":"Recreated tool cursor","svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 28 28\" fill=\"white\" stroke=\"#171b1c\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g transform=\"rotate(180 14 14)\"><path d=\"M6 23V10h13m-5-5 5 5-5 5\" fill=\"none\" stroke=\"white\" stroke-width=\"4\"/><path d=\"M6 23V10h13m-5-5 5 5-5 5\" fill=\"none\"/></g></svg>","width":28,"height":28,"frames":1,"note":"An editor-specific corner / turn indicator.","animation":""},{"id":"turn-top-left","label":"Corner turn top left","source":"Recreated tool cursor","svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 28 28\" fill=\"white\" stroke=\"#171b1c\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g transform=\"rotate(270 14 14)\"><path d=\"M6 23V10h13m-5-5 5 5-5 5\" fill=\"none\" stroke=\"white\" stroke-width=\"4\"/><path d=\"M6 23V10h13m-5-5 5 5-5 5\" fill=\"none\"/></g></svg>","width":28,"height":28,"frames":1,"note":"An editor-specific corner / turn indicator.","animation":""}];
  const scenes = {
    entrance: { title:'Right on cue', mood:'curious', duration:2.8, caption:'A quick entrance. A precise stop. Ready to help.',
      a:[[0,-.08,.67],[.06,-.08,.67],[.13,.27,.40],[.24,.53,.52],[1,.53,.52]],b:null,
      lines:[[.28,1,0,'Hey. What are we making?']],beats:['Arrive','Ready','Hello','Hold'] },
    elated: { title:'Yes! That worked.',mood:'elated',duration:3.3,caption:'A delighted mouse-shake: little circles, lifting upward, then back to work.',
      a:[[0,.32,.56],[.21,.32,.56],[.49,.32,.56],[.57,.53,.52],[1,.53,.52]],b:null,
      lines:[[.04,.22,0,'Wait…'],[.51,1,0,'YES. That worked!']],beats:['Realize','Celebrate','Enjoy it','Hold'] },
    frustrated: {title:'Why. Won’t. You. Work.',mood:'frustrated',duration:3.5,caption:'A real mouse-shake: quick, uneven, and very definitely annoyed.',
      a:[[0,.24,.55],[.13,.55,.52],[.30,.55,.52],[.52,.55,.52],[.66,.47,.56],[1,.47,.56]],b:null,
      lines:[[.19,.57,0,'No. Nope. NOPE.'],[.70,1,0,'Okay. One more try.']],beats:['Try','Shake','Breathe','Try again'] },
    shy:{title:'Just saying hello',mood:'shy',duration:3.8,caption:'A quick peek, a quiet pause, then a small commitment.',
      a:[[0,-.07,.60],[.11,.16,.55],[.35,.16,.55],[.41,.10,.58],[.53,.10,.58],[.60,.31,.45],[.67,.45,.53],[1,.45,.53]],b:null,
      lines:[[.15,.36,0,'um…'],[.7,1,0,'Mind if I join?']],beats:['Peek','Consider','Commit','Hello']},
    switch:{title:'A different point of view',mood:'curious',duration:4.4,caption:'Keep the pose while crossing. Turn once to look back at the idea.',
      a:[[0,.24,.52],[.13,.32,.53],[.45,.32,.53],[.49,.44,.25],[.54,.64,.30],[.60,.73,.52],[1,.73,.52]],
      b:[[0,.76,.52],[.16,.68,.53],[.49,.68,.53],[.53,.56,.79],[.59,.35,.75],[.65,.27,.52],[1,.27,.52]],
      facing:[[[0,90],[.67,0]],[[0,0],[.72,90]]],
      lines:[[.13,.34,0,'Other side?'],[.32,.48,1,'Let’s look.'],[.78,1,0,'Ah. Now I see it.']],beats:['Look','Consider','Switch sides','Look again']},
    mischief:{title:'Catch me if you can',mood:'mischievous',duration:3.8,caption:'A teasing pause, a quick chase, and an innocent-looking stop.',
      a:[[0,.3,.53],[.22,.3,.53],[.30,.72,.33],[.39,.71,.62],[.50,.26,.48],[.57,.38,.51],[1,.38,.51]],
      b:[[0,.7,.54],[.30,.7,.54],[.37,.75,.38],[.48,.45,.69],[.59,.26,.46],[.68,.60,.52],[1,.60,.52]],
      lines:[[.02,.22,0,'Catch me.'],[.31,.53,1,'Hey!'],[.75,1,0,'Who, me?']],beats:['Tease','Chase','Stop','Innocent']},
    celebration: ((title,caption,a,b,lines,beats)=>({title,caption,mood:'curious',duration:4.8,a,b,lines,beats,facing:[[[0,90]],[[0,0]]]}))('Celebration','A shared celebration.',[[0,.22,.58],[.15,.22,.58],[.29,.44,.50],[.40,.44,.50],[.45,.475,.49],[.455,.475,.49],[.56,.39,.35],[.68,.32,.38],[.82,.27,.49],[1,.27,.49]],[[0,.78,.58],[.18,.78,.58],[.32,.53,.50],[.40,.53,.50],[.45,.495,.49],[.455,.495,.49],[.56,.59,.35],[.68,.66,.38],[.82,.71,.49],[1,.71,.49]],[[.02,.19,0,'We got it?'],[.22,.39,1,'We got it.'],[.81,1,0,'YES!']],['Check','Meet','Celebrate','Enjoy it']),
    agreement: ((title,caption,a,b,lines,beats)=>({title,caption,mood:'curious',duration:4.8,a,b,lines,beats,facing:[[[0,90]],[[0,0]]]}))('Agreement','An echo becomes a shared gesture.',[[0,.27,.55],[.16,.27,.55],[.25,.35,.47],[.30,.35,.47],[.37,.35,.55],[.49,.35,.55],[.58,.39,.45],[.63,.39,.45],[.70,.39,.53],[.715,.39,.53],[.80,.39,.45],[1,.39,.45]],[[0,.71,.55],[.29,.71,.55],[.38,.63,.47],[.42,.63,.47],[.49,.63,.55],[.58,.59,.45],[.63,.59,.45],[.70,.59,.53],[.715,.59,.53],[.80,.59,.45],[1,.59,.45]],[[.02,.19,0,'Like this?'],[.29,.48,1,'Exactly.'],[.77,1,0,'Same page.']],['Propose','Echo','Together','Agree'])
  };
  class CursorTheatre extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode:'open'});
      this.settings = {scene:'switch', speed:1, energy:1, arc:1, trails:false, dialogue:true, customLine:'', design:{cursorType:'theatre',cursorMotion:true,paddingX:16,paddingY:11,maxWidth:220,minWidth:0,radius:23,fontSize:13,reveal:'typing',revealMs:850,turnStyle:'rotate',turnMs:180,placements:{left:{x:25,y:28,ax:0,ay:0,angle:0,corner:'tl'},right:{x:-8,y:-5,ax:1,ay:1,angle:90,corner:'br'},up:{x:25,y:28,ax:0,ay:0,angle:45,corner:'tl'},down:{x:25,y:-8,ax:0,ay:1,angle:225,corner:'bl'}}}};
      this.progress = 0; this.playing = false; this._last = 0;
      this.reduced = matchMedia('(prefers-reduced-motion: reduce)');
      this.shadowRoot.innerHTML = `<style>
        :host{display:block;position:relative;width:100%;height:100%;min-height:240px;contain:layout paint;font-family:var(--cursor-font,ui-sans-serif,system-ui,sans-serif);color:#252823}
        *{box-sizing:border-box}.world{position:absolute;inset:0;overflow:hidden}.paths{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.path{fill:none;stroke:#749263;stroke-width:1.3;stroke-dasharray:4 7;opacity:.45}.path.second{stroke:#8271b3}
        .actor{position:absolute;left:0;top:0;width:0;height:0;will-change:transform}.body{position:absolute;width:28px;height:28px;transform-origin:14px 14px;filter:drop-shadow(0 3px 1px #19221420)}
        .body[data-cursor=theatre]{filter:none}.body svg{overflow:visible;width:100%;height:100%}
        .bubble{position:absolute;top:28px;left:25px;background:var(--actor);color:#25313a;padding:11px 16px;border-radius:0 23px 23px 23px;box-shadow:0 2px 5px #26351f12;white-space:normal;overflow-wrap:anywhere;width:max-content;font-size:13px;line-height:1.4;font-weight:500;opacity:0;max-width:185px;text-align:left;pointer-events:none}.bubble[data-show=true]{opacity:1}.bubble .letter{display:inline-block;white-space:pre;will-change:opacity,transform}.bubble .word{display:inline-block;white-space:normal;max-width:100%}
        .comparison{pointer-events:none;opacity:.75}.comparison .body{filter:none}.comparison .arrow{fill:none;stroke:#8b4c9c;stroke-width:1}.comparison .bubble{background:transparent;box-shadow:none;outline:1px dashed #8b4c9c}.comparison .bubble .word{visibility:hidden}
        .cursor-art{position:absolute;left:14px;top:14px;transform:translate(-50%,-50%);pointer-events:none}.body[data-cursor=theatre] .cursor-art{display:none}.body[data-cursor]:not([data-cursor=theatre])>svg .arrow{visibility:hidden}.cursor-art{visibility:visible}.body[data-greeting=true] .cursor-art{visibility:hidden}.cursor-art svg{width:100%;height:100%}.sprite-window{overflow:hidden}.sprite-window img{display:block;max-width:none}.sprite-strip{animation:cursor-frames var(--cycle) steps(var(--frames)) infinite}.cursor-art[data-animation=spin]>svg{animation:cursor-spin 1s linear infinite}.cursor-art[data-animation=hourglass] .glass{transform-origin:14px 14px;animation:glass-turn 2.4s ease-in-out infinite}.sand-top{transform-origin:14px 12px;animation:sand-drain 2.4s linear infinite}.sand-bottom{transform-origin:14px 22px;animation:sand-fill 2.4s linear infinite}.cursor-art[data-motion=false] *{animation-play-state:paused!important}.comparison .cursor-art{opacity:.5}
        @keyframes cursor-frames{to{transform:translateY(-100%)}}@keyframes cursor-spin{to{transform:rotate(360deg)}}@keyframes glass-turn{0%,76%{transform:rotate(0)}100%{transform:rotate(180deg)}}@keyframes sand-drain{0%{transform:scaleY(1)}75%,100%{transform:scaleY(0)}}@keyframes sand-fill{0%{transform:scaleY(0)}75%,100%{transform:scaleY(1)}}@media(prefers-reduced-motion:reduce){.cursor-art *{animation:none!important}}
        .accent{position:absolute;left:-23px;top:-35px;font-size:25px;color:var(--actor);font-weight:700;opacity:0}.ground{position:absolute;width:35px;height:6px;border-radius:50%;background:#29311c13;left:7px;top:65px}
        @media(prefers-reduced-motion:reduce){.body,.actor{will-change:auto}}
      </style><div class="world" role="img" aria-label="Two expressive cursors performing a scene"><svg class="paths" aria-hidden="true"><path class="path"></path><path class="path second"></path></svg>${[0,1].map(i=>`<div class="actor" style="--actor:${i?'#bbd5d7':'#c5c4df'}"><div class="body"><svg viewBox="0 0 28 28" aria-hidden="true"><path class="arrow" d="m.088 1.75 11.25 29.422c.409 1.07 1.908 1.113 2.377.067l5.223-11.653c.13-.288.36-.518.648-.648l11.653-5.223c1.046-.47 1.004-1.968-.067-2.377L1.75.088C.71-.31-.31.71.088 1.75Z" transform="translate(3 3) scale(.625)" fill="#111" stroke="white" stroke-width="1.4" vector-effect="non-scaling-stroke" stroke-linejoin="round"/><circle class="dot" cx="14" cy="14" r="8" fill="var(--actor)" stroke="white" stroke-width="2" style="display:none"/></svg></div><div class="bubble"></div><div class="accent"></div></div>`).join('')}</div>`;
      this.actors = [...this.shadowRoot.querySelectorAll('.actor')];
      this.effects=document.createElementNS('http://www.w3.org/2000/svg','svg');
      this.effects.setAttribute('viewBox','0 0 1000 500');this.effects.setAttribute('preserveAspectRatio','none');this.effects.setAttribute('aria-hidden','true');
      this.effects.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none';
      this.shadowRoot.querySelector('.world').append(this.effects);
      this.paths = [...this.shadowRoot.querySelectorAll('.path')];
      this._tick = now => {
        if (!this.playing) return;
        const delta = this._last ? Math.min((now-this._last)/1000,.05) : 0;
        this._last=now; this.progress=Math.min(this._rangeEnd??1,clamp(this.progress+delta*this.settings.speed/this.scene.duration));
        this.render();
        if(this.progress>=(this._rangeEnd??1)) this.pause(); else this._raf=requestAnimationFrame(this._tick);
      };
      this._motionChange = () => { if(this.reduced.matches) { this.stopDirect();this.pause(); this.seek(1); } };
    }
    get cursorTypes(){return cursorCatalog}
    cursorMarkup(type){
      if(type.svg)return type.svg;
      if(type.src)return `<div class="sprite-window" style="width:${type.width}px;height:${type.height}px"><img alt="" src="${type.src}" style="width:${type.width}px;height:${type.height*type.frames}px;--frames:${type.frames};--cycle:${Math.max(.1,type.delay*type.frames)}s" class="${type.frames>1?'sprite-strip':''}"></div>`;
      return '<svg viewBox="0 0 28 28"><path d="M4 3 11 24 17 16 24 12Z" fill="#111" stroke="white" stroke-width="2"/></svg>';
    }
    updateCursor(body,override){
      const id=override||this.settings.design.cursorType||'theatre',type=cursorCatalog.find(c=>c.id===id)||cursorCatalog[0];
      let art=body.querySelector('.cursor-art');
      if(!art){art=document.createElement('div');art.className='cursor-art';body.append(art)}
      if(art.dataset.type!==type.id){art.dataset.type=type.id;art.innerHTML=this.cursorMarkup(type);art.style.width=type.width+'px';art.style.height=type.height+'px'}
      body.dataset.cursor=type.id;art.dataset.motion=String(this.settings.design.cursorMotion!==false);art.dataset.animation=type.animation||'';
      return type;
    }
    get scene(){return this.settings.sceneEdits?.[this.settings.scene] || scenes[this.settings.scene] || scenes.switch}
    connectedCallback(){
      if(this.hasAttribute('scene') && scenes[this.getAttribute('scene')]) this.settings.scene=this.getAttribute('scene');
      this._resize=new ResizeObserver(()=>this.render());this._resize.observe(this);
      this.reduced.addEventListener('change',this._motionChange); this.render();
      if(this.hasAttribute('autoplay'))this.play();
    }
    disconnectedCallback(){this.stopDirect();this.pause();this._resize?.disconnect();this.reduced.removeEventListener('change',this._motionChange)}
    configure(options={}){
      if(options.scene==='handshake')options={...options,scene:'agreement'};
      const old=this.settings.scene;
      const design={...this.settings.design,...options.design,placements:{...this.settings.design.placements,...options.design?.placements}};
      if(design.reveal==='rise')design.reveal='fade';
      this.settings={...this.settings,...options,design};
      this.settings.speed=clamp(Number(this.settings.speed)||1,.25,2);
      this.settings.energy=clamp(Number(this.settings.energy)||0,0,2);
      this.settings.arc=clamp(Number(this.settings.arc)||0,0,2);
      if(old!==this.settings.scene){this.stopDirect();this.pause();this.progress=0}
      this.render();return this;
    }
    play(keepRange=false){this._inspection=null;if(!keepRange)this._rangeEnd=1;this.stopDirect();if(this.reduced.matches){this.seek(1);return}if(this.playing)return;if(this.progress>=1)this.progress=0;this.playing=true;this._last=0;this._raf=requestAnimationFrame(this._tick);this.dispatchEvent(new CustomEvent('playstate',{detail:true}))}
    pause(){this.playing=false;cancelAnimationFrame(this._raf);this._last=0;this.dispatchEvent(new CustomEvent('playstate',{detail:false}))}
    replay(){this._rangeEnd=1;this.pause();this.progress=0;this.play()}
    playMoment(){this.pause();const ranges={entrance:[0,.3],elated:[.20,.53],frustrated:[.29,.55],shy:[.35,.69],switch:[.44,.78],mischief:[.22,.71],celebration:[.35,.85],agreement:[.49,.96]};const [a,b]=ranges[this.settings.scene];this._rangeEnd=b;this.progress=a;this.play(true)}
    seek(t){this.stopDirect();this.progress=clamp(Number(t)||0);this.render()}
    startDirect(){
      if(this._direct)return;
      const wasPlaying=this.playing;this.pause();
      this._direct=[this.scene.a,this.scene.b].filter(Boolean).map((keys,i)=>{
        const p=this.position(keys,this.progress,i),q=this.position(keys,clamp(this.progress+.002),i);
        const factor=wasPlaying?this.settings.speed/(.002*this.scene.duration):0;
        return {x:p.x,y:p.y,vx:(q.x-p.x)*factor,vy:(q.y-p.y)*factor,tx:p.x,ty:p.y,age:5,bx:0,by:0,angle:this.heading(keys,this.progress,i,this.clientWidth,this.clientHeight)};
      });
      this.paths.forEach(p=>p.style.display='none');
      this._drawDirect();
    }
    stopDirect(){cancelAnimationFrame(this._directRaf);this._direct=null;this._directLast=0}
    moveTo(x,y){
      this.startDirect();
      const w=this.clientWidth,h=this.clientHeight;
      this._direct.forEach((p,i)=>{
        const tx=clamp(x+(this._direct.length>1?(i?32:-32)/w:0),.06,Math.max(.06,1-85/w));
        const ty=clamp(y,.10,Math.max(.10,1-75/h));
        const dx=(tx-p.x)*w,dy=(ty-p.y)*h,d=Math.hypot(dx,dy)||1;
        const bend=Math.min(d*.24,75)*this.settings.arc*(.65+.35*this.settings.energy)*(i?-1:1);
        p.tx=tx;p.ty=ty;p.bx=-dy/d*bend/w;p.by=dx/d*bend/h;p.age=0;
        if(this.reduced.matches){p.x=tx;p.y=ty;p.vx=p.vy=0;p.age=5}
      });
      this._drawDirect();
      if(this.reduced.matches)return;
      cancelAnimationFrame(this._directRaf);this._directLast=0;
      const tick=now=>{
        if(!this._direct)return;
        let dt=this._directLast?Math.min((now-this._directLast)/1000,.04)*this.settings.speed:0;
        this._directLast=now;
        while(dt>0){const step=Math.min(dt,1/120);dt-=step;
          for(const p of this._direct){
            p.age+=step;
            const bow=Math.exp(-p.age*10),k=500,damping=44;
            p.vx+=(k*(p.tx+p.bx*bow-p.x)-damping*p.vx)*step;
            p.vy+=(k*(p.ty+p.by*bow-p.y)-damping*p.vy)*step;
            p.x+=p.vx*step;p.y+=p.vy*step;

          }
        }
        this._drawDirect();
        const moving=this._direct.some(p=>Math.hypot((p.tx-p.x)*w,(p.ty-p.y)*h)>.15||Math.hypot(p.vx*w,p.vy*h)>.3);
        if(moving)this._directRaf=requestAnimationFrame(tick);
        else{this._direct.forEach(p=>{p.x=p.tx;p.y=p.ty;p.vx=p.vy=0});this._drawDirect()}
      };
      this._directRaf=requestAnimationFrame(tick);
    }
    _drawDirect(){
      if(!this._direct)return;
      this._direct.forEach((p,i)=>{
        const actor=this.actors[i];actor.style.transform=`translate(${p.x*this.clientWidth}px,${p.y*this.clientHeight}px)`;
        this.applyTurn(actor.querySelector('.body'),p.angle,p.angle,1);
        actor.querySelector('.arrow').style.display='';actor.querySelector('.dot').style.display='none';actor.querySelector('.body').dataset.greeting='false';
        actor.querySelector('.bubble').dataset.show='false';
      });
    }
    rawPosition(keys,t,index){
      let j=keys.findIndex((k,i)=>i<keys.length-1 && t<=keys[i+1][0]);
      if(j<0)j=keys.length-2;
      const a=keys[j],b=keys[j+1],dt=b[0]-a[0],u=clamp((t-a[0])/dt);
      const same=(a,b)=>a[1]===b[1]&&a[2]===b[2];
      const tangent=(n,axis)=>{
        if(n===0||n===keys.length-1)return 0;
        const prev=keys[n-1],cur=keys[n],next=keys[n+1];
        // Repeated positions are intentional acting holds. Other waypoints flow through.
        if(same(prev,cur)||same(cur,next))return 0;
        return .85*(next[axis]-prev[axis])/(next[0]-prev[0]);
      };
      const h00=2*u*u*u-3*u*u+1,h10=u*u*u-2*u*u+u;
      const h01=-2*u*u*u+3*u*u,h11=u*u*u-u*u;
      const value=axis=>h00*a[axis]+h10*dt*tangent(j,axis)+h01*b[axis]+h11*dt*tangent(j+1,axis);
      const gesture=['elated','mischief'].includes(this.settings.scene)?(.65+.35*this.settings.energy):1;
      return {x:value(1),y:.54+(value(2)-.54)*this.settings.arc*gesture};
    }
    position(keys,t,index){
      if(this.scene.editorTiming)return this.rawPosition(keys,t,index);
      const cacheKey=`${this.settings.arc}:${this.settings.energy}:${this.clientWidth}:${this.clientHeight}`;
      if(this._pathKey!==cacheKey){this._pathKey=cacheKey;this._runs=new WeakMap()}
      if(!this._runs.has(keys)){
        const runs=[];
        let start=0;
        for(let n=0;n<keys.length-1;n++){
          const held=keys[n][1]===keys[n+1][1]&&keys[n][2]===keys[n+1][2];
          if(held){if(n>start)runs.push([start,n]);start=n+1}
        }
        if(start<keys.length-1)runs.push([start,keys.length-1]);
        this._runs.set(keys,runs.map(([a,b])=>{
          const from=keys[a][0],to=keys[b][0],samples=[];let length=0,previous;
          for(let n=0;n<=200;n++){
            const q=this.rawPosition(keys,mix(from,to,n/200),index);
            if(previous)length+=Math.hypot((q.x-previous.x)*this.clientWidth,(q.y-previous.y)*this.clientHeight);
            samples.push({...q,length});previous=q;
          }
          return {from,to,samples,length};
        }));
      }
      const run=this._runs.get(keys).find(r=>t>=r.from&&t<=r.to);
      if(!run)return this.rawPosition(keys,t,index);
      // Remap distance, then apply one timing curve to the entire uninterrupted gesture.
      const phase=clamp((t-run.from)/(run.to-run.from));
      const pace=1-Math.pow(1-phase,3);
      const distance=pace*run.length;
      let low=0,high=run.samples.length-1;
      while(low+1<high){const mid=(low+high)>>1;if(run.samples[mid].length<distance)low=mid;else high=mid}
      const a=run.samples[low],b=run.samples[high],u=(distance-a.length)/(b.length-a.length||1);
      return {x:mix(a.x,b.x,u),y:mix(a.y,b.y,u)};
    }
    mirroredPlacement(dir){
      const p=this.settings.design.placements[dir],horizontal=dir==='left'||dir==='right';
      const corners=horizontal?{tl:'tr',tr:'tl',bl:'br',br:'bl'}:{tl:'bl',bl:'tl',tr:'br',br:'tr'};
      const angle=((horizontal?90:270)-this.directionAngle(dir)+720)%360;
      // The 28px pointer rotates about (14,14), not the actor's top-left.
      return {...p,angle,x:horizontal?28-p.x:p.x,y:horizontal?p.y:28-p.y,ax:horizontal?1-p.ax:p.ax,ay:horizontal?p.ay:1-p.ay,corner:corners[p.corner??(p.ax?'br':'tl')]};
    }
    directionAngle(dir){return this.settings.design.placements[dir].angle??{left:0,right:90,up:45,down:225}[dir]}
    turnState(t,index){
      const cues=this.scene.facing?.[index]||[[0,0]];
      let from=cues[0][1],to=from,u=1;
      for(let n=1;n<cues.length;n++){
        if(t<cues[n][0])break;
        from=cues[n-1][1];to=cues[n][1];u=clamp((t-cues[n][0])/(this.settings.design.turnMs/1000/this.scene.duration));
      }
      const fromDir=from>45&&from<225?'right':'left',toDir=to>45&&to<225?'right':'left';
      return {from:this.directionAngle(fromDir),to:this.directionAngle(toDir),fromDir,toDir,u};
    }
    heading(keys,t,index,w,h){const q=this.turnState(t,index);return mix(q.from,q.to,smooth(q.u))}
    applyTurn(body,from,to,u){
      this.updateCursor(body);
      if(this.reduced.matches)u=1;
      const mode=this.settings.design.turnStyle,e=smooth(u);
      let angle=to,scale=1,opacity=1;
      if(mode==='rotate'){
        const delta=((to-from+540)%360)-180;angle=from+delta*e;
      }else if(mode==='fold'){angle=u<.5?from:to;scale=Math.max(.03,Math.abs(1-2*e))}
      else if(mode==='dissolve'){angle=u<.5?from:to;opacity=Math.abs(1-2*e)}
      if(!['theatre','white-arrow','help-pointer','drag-link'].includes(this.settings.design.cursorType||'theatre'))angle=0;
      body.style.transform=`rotate(${angle}deg) scaleX(${scale})`;body.style.opacity=opacity;
    }
    layoutDialogue(actor,dir,x,y,fromDir=null,amount=1){
      const d=this.settings.design,bubble=actor.querySelector('.bubble');
      const eased=this.reduced.matches||d.turnStyle==='snap'?1:smooth(clamp(amount));
      bubble.style.padding=[d.padding?.top??d.paddingY,d.padding?.right??d.paddingX,d.padding?.bottom??d.paddingY,d.padding?.left??d.paddingX].map(v=>`${v}px`).join(' ');bubble.style.maxWidth=`${Math.min(d.maxWidth,this.clientWidth-16)}px`;
      bubble.style.minWidth=`${Math.min(d.minWidth,d.maxWidth,this.clientWidth-16)}px`;bubble.style.fontSize=`${d.fontSize}px`;
      const {width:w,height:h}=bubble.getBoundingClientRect();
      const place=direction=>{const p=d.placements[direction];return {x:p.x-p.ax*w,y:p.y-p.ay*h}};
      let p=place(dir);if(fromDir){const a=place(fromDir);p={x:mix(a.x,p.x,eased),y:mix(a.y,p.y,eased)}}
      p.x=clamp(p.x,8-x,this.clientWidth-8-x-w);p.y=clamp(p.y,8-y,this.clientHeight-8-y-h);
      bubble.style.left=`${p.x}px`;bubble.style.top=`${p.y}px`;
      const r=d.radius,cornerFor=direction=>{const p=d.placements[direction];return p.corner??(p.ax?'br':'tl')};
      const corner=cornerFor(dir),oldCorner=cornerFor(fromDir||dir);
      bubble.style.borderRadius=['tl','tr','br','bl'].map(c=>`${mix(c===oldCorner?0:r,c===corner?0:r,eased)}px`).join(' ');
    }
    inspect(options){this.pause();this.stopDirect();this._inspection={direction:'left',text:'Hey. What are we making?',progress:1,x:.5,y:.5,...options};this.render()}
    renderInspection(){
      this.shadowRoot.querySelector('.world').setAttribute('aria-label',`Cursor anatomy preview. ${this._inspection.direction} facing. ${this._inspection.text}`);
      const q=this._inspection;
      const actor=this.actors[0],x=q.x*this.clientWidth,y=q.y*this.clientHeight;
      this.actors[1].hidden=true;actor.classList.remove('comparison');actor.hidden=false;this.paths.forEach(p=>p.style.display='none');
      actor.style.transform=`translate(${x}px,${y}px)`;
      actor.querySelector('.arrow').style.display='';actor.querySelector('.dot').style.display='none';actor.querySelector('.body').dataset.greeting='false';
      this.applyTurn(actor.querySelector('.body'),this.directionAngle(q.from||q.direction),this.directionAngle(q.direction),q.turnProgress??1);
      if(q.pressed&&['openhand','closedhand'].includes(this.settings.design.cursorType))this.updateCursor(actor.querySelector('.body'),'closedhand');
      const b=actor.querySelector('.bubble');this.writeDialogue(b,[0,1,0,q.text],q.progress,0);b.dataset.show=!!q.text;
      this.layoutDialogue(actor,q.direction,x,y,q.from,q.turnProgress??1);
      if(q.compare && (q.turnProgress??1)===1){
        const other={left:'right',right:'left',up:'down',down:'up'}[q.direction],ghost=this.actors[1],horizontal=q.direction==='left'||q.direction==='right';
        ghost.hidden=false;ghost.classList.add('comparison');
        ghost.style.transform=horizontal?`translate(${x+28}px,${y}px) scaleX(-1)`:`translate(${x}px,${y+28}px) scaleY(-1)`;
        ghost.querySelector('.arrow').style.display='';ghost.querySelector('.dot').style.display='none';
        this.applyTurn(ghost.querySelector('.body'),this.directionAngle(other),this.directionAngle(other),1);
        const b=ghost.querySelector('.bubble');this.writeDialogue(b,[0,1,0,q.text],q.progress,0);b.dataset.show=!!q.text;
        this.layoutDialogue(ghost,other,x,y);
      }
    }
    shake(t){
      if(this.scene.mood==='elated'&&t>=.22&&t<=.49){const u=(t-.22)/.27,e=Math.sin(Math.PI*u)*this.settings.energy;return {x:Math.sin(u*Math.PI*6)*13*e,y:-(Math.abs(Math.sin(u*Math.PI*3))*22+12)*e}}
      if(this.scene.mood!=='frustrated'||t<.31||t>.52)return {x:0,y:0};
      const u=(t-.31)/.21,envelope=Math.sin(Math.PI*u),strength=this.settings.energy;
      return {x:(Math.sin(u*41)+.32*Math.sin(u*79))*17*envelope*strength,
        y:(Math.sin(u*29+.6)+.2*Math.sin(u*67))*5*envelope*strength};
    }
    dialogueState(line,t,index){
      if(!line)return {text:'',letters:[],count:0,typing:false,visibility:[]};
      const text=index===0&&this.settings.customLine?this.settings.customLine:line[3];
      const letters=typeof Intl.Segmenter==='function'
        ? [...new Intl.Segmenter(undefined,{granularity:'grapheme'}).segment(text)].map(s=>s.segment)
        : Array.from(text);
      const weights=letters.map(c=>/[.,!?…]/.test(c)?2.5:/\s/.test(c)?.55:1);
      const total=weights.reduce((a,b)=>a+b,0);
      const clock=this._inspection?2.4:this.scene.duration;
      const window=(line[1]-line[0])*clock;
      const duration=Math.min(this.settings.design.revealMs/1000,window*.65);
      const elapsed=(t-line[0])*clock;
      const directReveal=this._inspection?.progressMode==='reveal';
      const progress=directReveal?clamp(t):this.reduced.matches?1:clamp(elapsed/(duration||1));
      let sum=0;
      const revealTail=Math.min(.10,1.5/total);
      const lastStart=(total-(weights.at(-1)||0))/total;
      let visibility=weights.map(weight=>{const start=sum/total;sum+=weight;const clock=directReveal?progress*(lastStart+revealTail):progress;return smooth(clamp((clock-start)/revealTail))});
      const mode=this.settings.design.reveal;
      if(mode==='words'){
        let word=-1,inside=false;const indices=letters.map(c=>{if(/\s/.test(c)){inside=false;return Math.max(0,word)}if(!inside){word++;inside=true}return word});
        visibility=indices.map(n=>smooth(clamp(((directReveal?progress*(word+1/1.8)/(word+1):progress)-n/(word+1))*(word+1)*1.8)));
      }else if(mode==='fade')visibility=letters.map(()=>smooth(clamp(progress*(directReveal?1:2))));
      const count=visibility.filter(v=>v>0).length;
      return {text,letters,count,typing:progress<1,visibility:progress>=1?letters.map(()=>1):visibility};
    }
    writeDialogue(bubble,line,t,index){
      const state=this.dialogueState(line,t,index);
      // Keep existing glyphs in place as text arrives, rather than replacing the whole label.
      if(bubble._text!==state.text){
        bubble._text=state.text;bubble.replaceChildren();bubble._letters=[];
        let word=document.createElement('span');word.className='word';bubble.append(word);
        for(const character of state.letters){
          if(/\s/.test(character)){word=document.createElement('span');word.className='word';bubble.append(word)}
          const span=document.createElement('span');span.className='letter';span.textContent=character;
          word.append(span);bubble._letters.push(span);
        }
      }
      bubble.setAttribute('aria-label',state.text);bubble.dataset.typing=state.typing;
      bubble._letters.forEach((span,n)=>{
        const amount=state.visibility[n]||0;
        span.style.display=n<state.count?'inline-block':'none';
        span.style.opacity=amount;
        span.style.transform=`translateY(${(1-amount)*(this.settings.design.reveal==='fade'?0:2)}px)`;
      });

    }
    render(){
      this.effects.replaceChildren();
      this.actors.forEach(actor=>actor.querySelector('.body').style.rotate='0deg');
      if(this._inspection){this.renderInspection();return}
      if(this._direct){this._drawDirect();return}
      const w=this.clientWidth,h=this.clientHeight;if(!w||!h)return;
      const t=this.progress,energy=this.settings.energy,scene=this.scene;
      this.shadowRoot.querySelector('.world').setAttribute('aria-label',`${scene.title}. ${scene.caption}`);
      [scene.a,scene.b].forEach((keys,i)=>{
        const actor=this.actors[i];actor.classList.remove('comparison');actor.hidden=!keys;this.paths[i].style.display=keys&&this.settings.trails?'':'none';if(!keys)return;
        const p=this.position(keys,t,i);
        const angle=this.heading(keys,t,i,w,h),shake=this.shake(t);
        let x=p.x*w+shake.x,y=p.y*h+shake.y;
        actor.style.transform=`translate(${x}px,${y}px)`;
        const turn=this.turnState(t,i);
        this.applyTurn(actor.querySelector('.body'),turn.from,turn.to,turn.u);
        actor.querySelector('.arrow').style.display='';
        actor.querySelector('.dot').style.display='none';actor.querySelector('.body').dataset.greeting='false';
        const bubble=actor.querySelector('.bubble'),line=scene.lines.find(l=>l[2]===i&&t>=l[0]&&t<=l[1]);
        this.writeDialogue(bubble,line,t,i);
        bubble.dataset.show=!!line&&this.settings.dialogue;
        this.layoutDialogue(actor,turn.toDir,x,y,turn.fromDir,turn.u);
        actor.querySelector('.accent').style.opacity=0;
        if(this.settings.scene==='agreement'){
          const attention=smooth(clamp((t-.53)/.10))*(1-smooth(clamp((t-.86)/.10)));
          const dip=Math.sin(clamp((t-.63)/.17)*Math.PI);
          actor.querySelector('.body').style.rotate=`${(i?-1:1)*(28*attention+14*dip)*energy}deg`;
        }
        if(this.settings.trails){let d='';for(let n=0;n<=100;n++){const q=this.position(keys,n/100,i);d+=`${n?'L':'M'}${(q.x*w).toFixed(1)} ${(q.y*h).toFixed(1)} `}this.paths[i].setAttribute('d',d)}
      });
      if(this.settings.scene==='celebration'&&t>.45&&t<.83){
        const u=clamp((t-.45)/.38);let particles='';
        for(let i=0;i<34;i++){
          const a=i*2.399,s=75+(i%7)*18,x=500+Math.cos(a)*s*u*2.2,y=240-Math.abs(Math.sin(a))*s*u*2.1+220*u*u;
          particles+=`<rect x="-3" y="-2" width="6" height="4" rx="1" fill="${['#9aaa76','#b8abd0','#dbaf55','#da877d'][i%4]}" opacity="${1-clamp((u-.45)/.55)}" transform="translate(${x} ${y}) rotate(${i*33+u*450})"/>`;
        }
        this.effects.innerHTML=particles;
      }
      this.dispatchEvent(new CustomEvent('frame',{detail:{progress:t,duration:scene.duration/this.settings.speed,beat:scene.beats[Math.min(3,Math.floor(t*4))]}}));
    }
  }
  window.CursorTheatre={scenes};
  if(!customElements.get('cursor-theatre'))customElements.define('cursor-theatre',CursorTheatre);
})();
