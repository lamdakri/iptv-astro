// round7-patch.mjs (v2 — Windows-safe path resolution via fileURLToPath)
//
// Fixes "Cannot POST /pronostics" leak from captured HTML snapshots. Three
// surgical changes:
//
//   1. /api/debug/raw serves .html/.htm as Content-Type: text/plain
//      (was auto text/html → browser rendered captured <form action="/pronostics">
//       as a live page, which submitted relative to OUR Express origin, producing
//       a 404 "Cannot POST /pronostics").
//   2. NEW /api/debug/wrap?file=X — returns a tiny HTML page with a sandboxed
//      iframe (srcdoc = escaped snapshot, sandbox = "allow-scripts"). Origin is
//      opaque (no allow-same-origin), forms are inert (no allow-forms), and
//      top-navigation is blocked (no allow-top-navigation). Visual layout
//      preserved; relative-URL forms cannot reach our Express.
//   3. public/app.js bannerDebugLink() extracts the file basename and points its
//      href at /api/debug/wrap (safe visual view) instead of /debug/<file>
//      (still served as active text/html by the /debug static mount).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// --- Windows-safe: use fileURLToPath instead of new URL(...).pathname, which
// leaves a leading "/C:" that confuses path.resolve on Windows (the round-7
// v1 runner threw ENOENT with the path "C:\C:\Users\...\<file>"). ---
const HERE = path.dirname(fileURLToPath(import.meta.url));
const TARGET = path.resolve(HERE, '..', 'cihgames-pronostics');

console.log(`runner HERE   = ${HERE}`);
console.log(`runner TARGET = ${TARGET}`);

function patch(file, find, replace) {
  const p = path.join(TARGET, file);
  const orig = fs.readFileSync(p, 'utf8');
  if (!orig.includes(find)) {
    throw new Error(`find pattern NOT FOUND in ${p}`);
  }
  const next = orig.replace(find, replace);
  if (next === orig) throw new Error(`replace did NOT change ${p}`);
  fs.writeFileSync(p, next, 'utf8');
  console.log(`patched ${p}  bytes: ${orig.length} -> ${next.length}  (+${next.length - orig.length})`);
}

// ===== Patch 1: src/routes/debug.js =====
// Replaces the existing /raw handler. After this patch, debug.js contains:
//   - new /api/debug/raw (text/plain for .html/.htm, sendFile for everything else)
//   - new /api/debug/wrap (sandboxed visual view via srcdoc iframe)
patch(
  'src/routes/debug.js',
  // ---- find ----
  `router.get('/raw', function (req, res) {
  const name = req.query.file ? String(req.query.file) : '';
  const safe = path.basename(name);
  if (!safe) { res.status(400).type('text/plain').send('Pass ?file=NAME'); return; }
  const full = path.join(DEBUG_DIR, safe);
  if (!full.startsWith(DEBUG_DIR) || !fs.existsSync(full)) {
    res.status(404).type('text/plain').send('File not found in debug/: ' + safe);
    return;
  }
  res.sendFile(full);
});`,
  // ---- replace ----
  `router.get('/raw', function (req, res) {
  const name = req.query.file ? String(req.query.file) : '';
  const safe = path.basename(name);
  if (!safe) { res.status(400).type('text/plain').send('Pass ?file=NAME'); return; }
  const full = path.join(DEBUG_DIR, safe);
  if (!full.startsWith(DEBUG_DIR) || !fs.existsSync(full)) {
    res.status(404).type('text/plain').send('File not found in debug/: ' + safe);
    return;
  }
  // HTML snapshots are served as text/plain so the browser never renders them
  // as active documents. Without this, a captured <form action="/pronostics">
  // resolves relative to our Express origin and POSTs there -> 404 "Cannot POST".
  // Use /api/debug/wrap for a sandboxed visual view of the same HTML.
  if (/\\.html?$/i.test(safe)) {
    res.type('text/plain; charset=utf-8');
    res.set('Content-Disposition', 'inline; filename="' + safe.replace(/"/g, '') + '.txt"');
    res.send(fs.readFileSync(full, 'utf8'));
    return;
  }
  res.sendFile(full);
});

// Sandboxed visual view of a captured HTML snapshot. The snapshot is embedded
// inline (srcdoc) inside an iframe that runs in an opaque origin (no
// allow-same-origin). Forms are blocked (no allow-forms), so a captured
// <form action="/pronostics"> cannot submit or navigate the parent origin.
router.get('/wrap', function (req, res) {
  const name = req.query.file ? String(req.query.file) : '';
  const safe = path.basename(name);
  if (!safe) { res.status(400).type('text/plain').send('Pass ?file=NAME'); return; }
  if (!/\\.html?$/i.test(safe)) {
    res.status(400).type('text/plain').send('Only .html files can be wrapped: ' + safe);
    return;
  }
  const full = path.join(DEBUG_DIR, safe);
  if (!full.startsWith(DEBUG_DIR) || !fs.existsSync(full)) {
    res.status(404).type('text/plain').send('File not found in debug/: ' + safe);
    return;
  }
  const rawHtml = fs.readFileSync(full, 'utf8');
  // Escape for embedding inside srcdoc="..." (& < > " minimum).
  const escapedHtml = rawHtml
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const fileQs = encodeURIComponent(safe);
  res.type('text/html; charset=utf-8');
  // Note: snapshot uses CSS/images via relative URLs (/assets/...) — those
  // fetches will fail in the opaque sandbox. The banner advertises this.
  res.send('<!doctype html><meta charset="utf-8"><title>Snapshot: ' + safe + '</title>\\n' +
    '<style>body{margin:0;font:13px system-ui;background:#0b1320;color:#e2e8f0}\\n' +
    '.banner{padding:8px 14px;background:#7c2d12;color:#fff}\\n' +
    '.banner a{color:#fde68a;margin-left:8px}\\n' +
    'iframe{display:block;width:100%;height:calc(100vh - 38px);border:0;background:#fff}\\n' +
    '</style>\\n' +
    '<div class="banner">Snapshot view: <b>' + safe + '</b> \\u2014 read-only, forms disabled.\\n' +
    '  Layout only; CSS/images may not load (sandbox blocks relative fetches).\\n' +
    '  <a href="/api/debug/raw?file=' + fileQs + '" target="_blank">view source</a></div>\\n' +
    '<iframe sandbox="allow-scripts" srcdoc="' + escapedHtml + '"></iframe>\\n');
});`
);

// ===== Patch 2: public/app.js bannerDebugLink =====
patch(
  'public/app.js',
  // ---- find ----
  `function bannerDebugLink() {
  if (!state.debug || !state.debug.htmlPath) return '';
  const href = state.debug.htmlPath.startsWith('/') ? state.debug.htmlPath : '/' + state.debug.htmlPath;
  return '<p class="hint"><a href="' + escapeHtml(href) + '" target="_blank">View captured page HTML</a> \u2014 ' +
    'open it (right-click \u2192 view source) and search for "data-prono" or "match" to learn what selectors the site uses.</p>';
}`,
  // ---- replace ----
  `function bannerDebugLink() {
  if (!state.debug || !state.debug.htmlPath) return '';
  // Extract just the file basename so we route through /api/debug/wrap
  // (a sandboxed iframe that blocks form submissions back to our Express).
  const fileName = String(state.debug.htmlPath).split(/[\\\\/]/).pop() || '';
  const href = fileName ? ('/api/debug/wrap?file=' + encodeURIComponent(fileName)) : '';
  return '<p class="hint"><a href="' + escapeHtml(href) + '" target="_blank">View captured page HTML</a> \u2014 ' +
    'open it (right-click \u2192 view source) and search for "data-prono" or "match" to learn what selectors the site uses.</p>';
}`
);

console.log('round-7 patch complete');
