# Cursor Kit

Expressive cursor motion and dialogue for product demos, onboarding, and small interactive moments. A dependency-free web component, a scene editor, and a cursor designer.

**For your coding agent:** copy [QUICKSTART.md](docs/QUICKSTART.md) into your project conversation. It contains the integration steps, actual API names, and checks to run. The local library UI has a **Copy Markdown** button and focused recipes.

## Run the library

```sh
npm start
```

Open http://127.0.0.1:8769. Requires Node.js and Python 3. No dependency install or build service is required. The library links to the Scene Editor and Cursor Designer.

## Use in another project

Copy `src/cursor-theatre.js` into your static assets and load it once, or install this checkout locally:

```sh
npm install /path/to/cursor-kit
```

```js
import { createCursor } from '@nabilkaz/cursor-kit';
const cursor = createCursor(document.querySelector('#demo'), {
  scene: 'entrance', customLine: 'Start here.'
});
cursor.play();
```

Give the container an explicit height (at least 240px). Import in client-side code. See [API.md](docs/API.md) for cleanup, direct movement, scrubbing, and custom scene data. The existing `<cursor-theatre>` name remains compatible with editor exports.

## Fonts

The library and editors use system fonts. No font download or setup is required. Customize the reusable component with `--cursor-font` to match your app.

## Status

Private preview. Not published to npm, and no public website deployment is configured. The package is marked private to prevent accidental registry publication. Native macOS cursor artwork is excluded; bundled SVG shapes and the attributed Liveblocks pointer are available. No API key or hosted AI service is needed: “AI first” means the integration contract is Markdown your coding agent can use directly.

`npm test` checks engine behavior and reveal timing. `npm run build` regenerates the studio from the canonical source.

## License

Project code is licensed under [MIT](LICENSE), allowing personal and commercial use, modification, and redistribution with the license notice retained. The Liveblocks pointer retains its Apache-2.0 license; see [third-party notices](THIRD_PARTY_NOTICES.md). Repository visibility remains private.
