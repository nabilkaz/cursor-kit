import './cursor-theatre.js';

/** Mount a cursor performance in a sized element. Import this module in the browser. */
export function createCursor(container, options = {}) {
  if (!(container instanceof HTMLElement)) throw new TypeError('createCursor needs an HTMLElement container');
  const actor = document.createElement('cursor-theatre');
  container.append(actor);
  actor.configure(options);
  return actor;
}
export const scenes = window.CursorTheatre.scenes;
