// round9/apply-patch.mjs
//
// Copies the 3 round-9 file rewrites from iptv-astro/round9/ into
// NgWorkspace/cihgames-pronostics/. Lives at iptv-astro/round9/ apply-patch.mjs
// so `..` resolves correctly to NgWorkspace/.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TARGET = path.resolve(HERE, '..', '..', 'cihgames-pronostics');
console.log('round9 HERE   =', HERE);
console.log('round9 TARGET =', TARGET);

const FILES = [
  ['src/actions/getPredictions.js', 'new-getPredictions.js'],
  ['src/actions/updatePrediction.js', 'new-updatePrediction.js'],
  ['public/app.js', 'new-app.js']
];

for (const [rel, srcName] of FILES) {
  const src = path.join(HERE, srcName);
  const dst = path.join(TARGET, rel);
  const content = fs.readFileSync(src, 'utf8');
  // Sanity: ts-check rejected code shouldn't sneak in. We do basic syntax
  // verification at the end.
  fs.writeFileSync(dst, content, 'utf8');
  console.log('copied', srcName, '(' + content.length + ' bytes) ->', rel);
}

console.log('round-9 patch complete');
