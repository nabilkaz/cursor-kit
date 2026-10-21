# Add Cursor Kit to this project

Use Cursor Kit to add an expressive cursor demonstration to the current project. Keep the user's real mouse pointer and existing app interactions intact.

## Bring in the library

Use an existing checkout of `nabilkaz/cursor-kit`, or clone it with the user's authenticated GitHub account. This repository is private; anonymous raw/CDN links do not work. It is not published to the npm registry.

With GitHub CLI authenticated, get the source with `gh repo clone nabilkaz/cursor-kit`.

Choose the integration that fits the app:
- Plain HTML: copy `src/cursor-theatre.js` into the project's public assets and load it once with a script tag.
- A bundled client app: install the local checkout (`npm install /path/to/cursor-kit`) and import `createCursor` from `@nabilkaz/cursor-kit` in client-side code.

For plain HTML:

```html
<script src="./cursor-theatre.js"></script>
<div style="height:320px">
  <cursor-theatre id="cursor-demo"></cursor-theatre>
</div>
<button id="preview">Preview</button>
<script>
  const actor = document.querySelector('#cursor-demo');
  actor.configure({scene:'entrance', customLine:'Start here.'});
  document.querySelector('#preview').onclick = () => actor.replay();
</script>
```

## Fit it to the task

Use `entrance` for an introduction, `celebration` for a completed action, `agreement` for a shared nod, `frustrated` for a retry demonstration, or `switch` for two cursors changing places. Use the user's requested moment; if unspecified, choose a short entrance. Trigger playback from the relevant action, not on a permanent loop.

Use `configure({customLine:'...'})` to replace the first cursor's dialogue. The second cursor retains its authored dialogue. Use `design` settings for shape, text reveal, and orientation. For exact paths, create and export a scene in `studio/index.html`, or consult `docs/API.md`.

The container must have an explicit height of at least 240px. Coordinates and seek progress are normalized from 0 to 1. `seek()` does not pause playback: call `pause()` first for scrubbing. `moveTo()` starts direct movement; call `stopDirect()` when ending that interaction. Remove the element during framework cleanup to stop animation and observers. Import only in the browser; the engine uses DOM APIs.

Use the host app's font through `--cursor-font`. Timeless belongs to the demo UI and is not a library dependency. Keep important instructions available as normal page text, not solely in the animated bubble.

## Verify before finishing

Confirm the actual component appears, the chosen action triggers playback, pause and replay work, and the layout stays contained at narrow widths. Check reduced motion: playback resolves to its final pose, while manual seeking still works. Confirm unmounting removes the element and stops its animation. Report the integration location and how to trigger it.
