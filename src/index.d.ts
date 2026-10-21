export type Scene = 'entrance' | 'elated' | 'frustrated' | 'shy' | 'switch' | 'celebration' | 'agreement' | 'mischief';
export type Direction = 'left' | 'right' | 'up' | 'down';
export interface Placement { x:number; y:number; ax:0|1; ay:0|1; angle:number; corner:'tl'|'tr'|'bl'|'br' }
export interface Design {
  cursorType?:string; cursorMotion?:boolean; autoFlip?:boolean; reveal?:'typing'|'words'|'fade'; revealMs?:number;
  turnStyle?:'snap'|'rotate'|'fold'|'dissolve'; turnMs?:number;
  paddingX?:number; paddingY?:number; maxWidth?:number; minWidth?:number; radius?:number; fontSize?:number;
  placements?:Partial<Record<Direction, Placement>>;
}
export interface SceneDefinition {
  title:string; mood:string; duration:number; caption:string;
  a:number[][]; b:number[][]|null; lines:[number,number,number,string][]; beats:string[];
  facing?:number[][][];
}
export interface Options {
  scene?:Scene; speed?:number; arc?:number; energy?:number; trails?:boolean;
  dialogue?:boolean; customLine?:string; design?:Design;
  sceneEdits?:Partial<Record<Scene,SceneDefinition>>;
}
export interface Inspection {
  direction?:Direction; text?:string; progress?:number; progressMode?:'reveal';
  x?:number; y?:number; from?:Direction; turnProgress?:number; compare?:boolean;
}
export interface CursorActor extends HTMLElement {
  configure(options?:Options):this; play():void; pause():void; replay():void; playMoment():void;
  seek(progress:number):void; moveTo(x:number,y:number):void; stopDirect():void; inspect(options:Inspection):void;
  progress:number; playing:boolean; readonly scene:SceneDefinition;
  readonly cursorTypes:ReadonlyArray<{id:string;label:string;source:string}>;
}
export function createCursor(container:HTMLElement,options?:Options):CursorActor;
export const scenes:Record<Scene,SceneDefinition>;
declare global {interface HTMLElementTagNameMap {'cursor-theatre':CursorActor}}
