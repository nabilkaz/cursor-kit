import { copyFile, mkdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
const source = process.argv[2];
if (!source) {
  console.error('Usage: npm run fonts -- /path/to/Timeless-Type-Family-1.094');
  process.exit(1);
}
const dest = new URL('../assets/fonts/', import.meta.url);
await mkdir(dest, {recursive:true});
for (const weight of ['Regular','Medium','Semibold']) {
  const name = `TimelessSans-Grotesk${weight}.woff2`;
  await copyFile(join(resolve(source), 'Sans-Grotesk/static/woff2', name), new URL(name, dest));
}
await copyFile(join(resolve(source), 'LICENSE.pdf'), new URL('LICENSE.pdf', dest));
console.log('Timeless is ready locally. Font files are excluded from Git and the package.');
