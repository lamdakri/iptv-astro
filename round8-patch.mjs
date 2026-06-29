// round8-patch.mjs — closes two real attack-surface holes left by round-7.
//
//   1. /api/debug/wrap: path.basename(name) interpolates raw into <title> and
//      <b>. A debug file with < or > in the filename would XSS our wrapper.
//      Add a strict whitelist /^[\w.-]+$/ and 400 the rest.
//
//   2. app.use('/debug', express.static(...)) in index.js still serves captured
//      .html as live text/html if anyone navigates there directly. Replace with
//      a router that forces text/plain for .html / .htm.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const TARGET = path.resolve(HERE, '..', 'cihgames-pronostics');
console.log('round8 HERE   =', HERE);
console.log('round8 TARGET =', TARGET);

function patch(file, find, replace) {
  const p = path.join(TARGET, file);
  const orig = fs.readFileSync(p, 'utf8');
  if (!orig.includes(find)) throw new Error('find pattern NOT FOUND in ' + p);
  const next = orig.replace(find, replace);
  if (next === orig) throw new Error('replace did NOT change ' + p);
  fs.writeFileSync(p, next, 'utf8');
  console.log('patched ' + p + '  bytes: ' + orig.length + ' -> ' + next.length);
}

// Patch A: /api/debug/wrap filename whitelist
patch(
  'src/routes/debug.js',
  `  if (!safe) { res.status(400).type('text/plain').send('Pass ?file=NAME'); return; }
  if (!/\.html?$/i.test(safe)) {
    res.status(400).type('text/plain').send('Only .html files can be wrapped: ' + safe);
    return;
  }`,
  `  if (!safe) { res.status(400).type('text/plain').send('Pass ?file=NAME'); return; }
  if (!/\.html?$/i.test(safe)) {
    res.status(400).type('text/plain').send('Only .html files can be wrapped: ' + safe);
    return;
  }
  // Defence-in-depth: a debug file with '<' or '>' in the basename would
  // otherwise XSS the wrapper HTML when we interpolate 'safe' into <title>
  // and the banner. Whitelist to [A-Za-z0-9_.-]+.
  if (!/^[\w.\-]+$/.test(safe)) {
    res.status(400).type('text/plain').send('Invalid filename (whitelist [A-Za-z0-9_.-]+): ' + safe);
    return;
  }`
);

// Patch B: index.js — replace /debug static mount with a router that
// forces text/plain for .html.
patch(
  'index.js',
  `app.use('/debug',  express.static(path.resolve('./debug'), { fallthrough: true }));`,
  `// Custom /debug router: same files as the static mount, but HTML snapshots
// are served as text/plain so the browser never renders them as live pages
// (a stale bookmark or direct URL would otherwise reproduce "Cannot POST
// /pronostics").
app.use('/debug', (req, res, next) => {
  const safe = path.basename(req.path || '');
  if (!safe) { res.status(400).type('text/plain').send('Invalid path'); return; }
  const rootResolved = path.resolve('./debug');
  const full = path.resolve(rootResolved, safe);
  if (!full.startsWith(rootResolved) || !fs.existsSync(full)) {
    res.status(404).type('text/plain').send('File not found in debug/: ' + safe);
    return;
  }
  if (/\.html?$/i.test(safe)) {
    res.type('text/plain; charset=utf-8');
    return res.send(fs.readFileSync(full, 'utf8'));
  }
  res.sendFile(full);
});`
);

console.log('round-8 patch complete');
