# Browser API

The registered element remains `<cursor-theatre>` for compatibility with the existing editors and exported scenes. Cursor Kit is the package name. The engine has no runtime dependencies and uses Shadow DOM.

```js
import { createCursor } from '@nabilkaz/cursor-kit';
const actor = createCursor(document.querySelector('#stage'), {
  scene: 'celebration', speed: 1, dialogue: true
});
actor.play();
// On unmount:
actor.remove();
```

Import inside a client-only lifecycle when using server rendering. For example, in a React effect dynamically import the module, check the effect has not been disposed before mounting, and remove the actor in the cleanup function. Use a ref to a sized container. Do not import the DOM engine during SSR.

| Method | Behavior |
| --- | --- |
| `configure(options)` | Merge options; returns the actor. Changing scene stops playback and resets progress. |
| `play()` | Play/resume; restarts if already at the end. |
| `pause()` | Pause the scene clock. |
| `replay()` | Restart the scene. |
| `seek(0…1)` | Seek; call pause first for a stationary scrub. Ends direct movement. |
| `playMoment()` | Play the expressive section of a built-in preset. |
| `moveTo(x, y)` | Move toward normalized stage coordinates with velocity continuity. |
| `stopDirect()` | Stop direct movement. |
| `inspect(options)` | Preview one cursor's pose and dialogue, as in the designer. |
| `remove()` | Standard DOM removal; stops clocks and disconnects observers. |

`configure` accepts `scene`, `speed` (0.25–2), `arc` (0–2), `energy` (0–2), `trails`, `dialogue`, `customLine`, `design`, and `sceneEdits`. Supported design fields and placement coordinates are in `src/index.d.ts`. `actor.cursorTypes` gives the actual bundled catalog; unsupported saved types fall back to the default pointer.

Events are dispatched on the element: `frame` has `{progress, duration, beat}` (duration accounts for speed); `playstate` has a boolean detail. Listen directly on the actor. Pause offscreen using IntersectionObserver and on `document.hidden` if the surrounding application can leave a demonstration mounted in the background.

## Text and orientation

`design.reveal` is `typing`, `words`, or `fade`; `revealMs` controls its duration. `inspect({text, progress, progressMode:'reveal'})` maps normalized progress to exactly that reveal duration. Without `progressMode:'reveal'`, inspection uses the legacy 2400ms clock. Orientation is separate from stage position: `direction` chooses the pose; `x` and `y` choose the stage location.

```js
actor.configure({design:{reveal:'words',revealMs:700}});
actor.inspect({direction:'right',x:.5,y:.5,text:'Review this step.',progress:.5,progressMode:'reveal'});
```

## Custom scene data

Use the Scene Editor for paths, nodes, timing, and dialogue. Export produces a standalone HTML performance; Cursor Designer exports JSON design settings. `configure({scene:'entrance', sceneEdits:{entrance:scene}})` can replace an existing preset with authored data:

- `duration` is seconds. `a` and optional `b` are arrays of `[time, x, y]`, all normalized 0–1.
- `lines` are `[in, out, actorIndex, text]`, with normalized scene times and actor index 0 or 1.
- `facing` optionally contains two arrays of `[time, angle]`; it changes orientation independently of travel.
- Include `title`, `caption`, `mood`, and four `beats`. Keep keyframe times ordered and duration positive.

Use `play()` for custom data; `playMoment()` uses built-in preset ranges. The font of exported performances defaults to the host system unless the host supplies `--cursor-font` and its own licensed font loading.

Dialogue measures the full message before revealing text. By default, `design.autoFlip` mirrors the cursor and bubble together when the authored placement overflows the stage, and holds that orientation for the message. Measurements use stage coordinates, including inside CSS-scaled slides. A resized stage or changed message geometry triggers a new fit. Set `autoFlip:false` to keep the authored orientation.
