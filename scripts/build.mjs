import { readFile, writeFile } from 'node:fs/promises';
const engine = await readFile(new URL('../src/cursor-theatre.js', import.meta.url), 'utf8');
const template = await readFile(new URL('../studio/editor.template.html', import.meta.url), 'utf8');
await writeFile(new URL('../studio/index.html', import.meta.url), template.replace('__CURSOR_ENGINE__', () => engine));
await writeFile(new URL('../studio/cursor-theatre.js', import.meta.url), engine);
console.log('Studio built from src/cursor-theatre.js');
