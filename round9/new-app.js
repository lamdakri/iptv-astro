// round9/public/app.js
//
// Renders the predictions list (from /api/predictions) as a vertical stack of
// per-match rows. Each row has: meta (league, date) | home team | pred_home
// input | pred_away input | away team | Validate (or Update) button.
//
// On Validate: POSTs {choice: {home: N, away: N}} to /api/predictions/:id.
// On Update: same flow, but the row was already saved (button label flipped).
// Locked rows: inputs/button are disabled, no save possible.
//
// The Refresh button id is `refresh` (see public/index.html).
//
// Conserves the safety properties added in earlier rounds: formatError() still
// links to /api/debug/peek; bannerDebugLink() still routes through
// /api/debug/wrap so the captured page HTML is sandboxed.

function $(sel, root) { return root ? root.querySelector(sel) : document.querySelector(sel); }

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function formatError(err) {
  const m = String(err && err.message ? err.message : err || '');
  if (/locator\.(click|fill).*(timeout|exceeded)|Click failed on|No such element|net::ERR|Match .* not found|Match .* is locked|Fill pred_/i.test(m)) {
    return 'Page automation failed (' + m.split('\n')[0] + '). ' +
      'Open <a href="/api/debug/peek" target="_blank">/api/debug/peek</a> ' +
      'to see the most recent captured page state. ' +
      'Also visit <a href="/api/debug" target="_blank">/api/debug</a> for the full list of captures.';
  }
  return m;
}

const state = { items: [], debug: null, saving: null, busy: false };

function setStatus(text, kind) {
  const el = $('#status');
  if (!el) return;
  el.textContent = text;
  el.className = 'status' + (kind ? ' ' + kind : '');
}

function bannerDebugLink() {
  if (!state.debug || !state.debug.htmlPath) return '';
  const fileName = String(state.debug.htmlPath).split(/[\\/]/).pop() || '';
  const href = fileName ? ('/api/debug/wrap?file=' + encodeURIComponent(fileName)) : '';
  return '<p class="hint">' +
    '<a href="' + escapeHtml(href) + '" target="_blank">View captured page HTML</a> ' +
    '(sandboxed — read-only, forms inert).' +
    '</p>';
}

function render() {
  const app = $('#app');
  if (!app) return;
  if (!state.items.length) {
    app.innerHTML =
      '<p class="empty">No predictions loaded yet.</p>' +
      '<p class="hint">Click <b>Refresh predictions</b> above. If this stays empty, the captured HTML below will tell us what DOM the site uses.</p>' +
      bannerDebugLink();
    return;
  }
  app.innerHTML = '<div class="predictions">' +
    state.items.map(itemToRow).join('') +
    '</div>';
}

function itemToRow(it) {
  const p = it.prediction || { home: '', away: '' };
  const homeVal = (p.home === '' || p.home == null) ? '' : String(p.home);
  const awayVal = (p.away === '' || p.away == null) ? '' : String(p.away);
  const lockedAttr = it.locked ? 'disabled title="Match is locked"' : '';
  const lockedCls  = it.locked ? ' locked' : '';
  const btnLabel   = it.prediction ? 'Update' : 'Validate';
  return '<div class="pred-row' + lockedCls + '" data-id="' + escapeHtml(it.id) + '">' +
    '<div class="pred-cell pred-meta">' +
      '<div class="pred-league">' + escapeHtml(it.league || '') + '</div>' +
      '<div class="pred-date">' + escapeHtml(it.date || '') + '</div>' +
    '</div>' +
    '<div class="pred-cell pred-team pred-home">' + escapeHtml(it.homeTeam || '?') + '</div>' +
    '<input class="pred-cell pred-input" type="number" min="0" max="30" step="1" ' +
      'value="' + escapeHtml(homeVal) + '" placeholder="0" data-role="home" ' + lockedAttr + '>' +
    '<input class="pred-cell pred-input" type="number" min="0" max="30" step="1" ' +
      'value="' + escapeHtml(awayVal) + '" placeholder="0" data-role="away" ' + lockedAttr + '>' +
    '<div class="pred-cell pred-team pred-away">' + escapeHtml(it.awayTeam || '?') + '</div>' +
    '<button class="pred-cell pred-submit" data-role="submit" ' + lockedAttr + '>' + btnLabel + '</button>' +
  '</div>';
}

// Read & validate the two score inputs in a row. Returns null for invalid.
function readChoiceFromRow(row) {
  const homeStr = (row.querySelector('[data-role="home"]') || {}).value || '';
  const awayStr = (row.querySelector('[data-role="away"]') || {}).value || '';
  const homeTrim = String(homeStr).trim();
  const awayTrim = String(awayStr).trim();
  if (homeTrim === '' || awayTrim === '') return null;
  const home = Number(homeTrim);
  const away = Number(awayTrim);
  if (!Number.isInteger(home) || home < 0 || home > 30) return null;
  if (!Number.isInteger(away) || away < 0 || away > 30) return null;
  return { home: home, away: away };
}

function setRowBusy(row, busy) {
  const btn = row.querySelector('[data-role="submit"]');
  const inputs = row.querySelectorAll('input[data-role]');
  const locked = row.classList.contains('locked');
  inputs.forEach(function (el) { el.disabled = !!busy || locked; });
  if (btn) {
    btn.disabled = !!busy || locked;
    if (busy) btn.textContent = 'Saving…';
    else btn.textContent = (row.classList.contains('saved') ? 'Update' : 'Validate');
  }
  row.classList.toggle('saving', !!busy);
}

async function refresh() {
  if (state.busy) return;
  state.busy = true;
  setStatus('Loading…', 'busy');
  try {
    const res = await fetch('/api/predictions', { method: 'GET' });
    const data = await res.json().catch(function () { return {}; });
    if (!res.ok) throw new Error((data && data.error) || ('HTTP ' + res.status));
    state.items = Array.isArray(data.items) ? data.items : [];
    state.debug = data.debug || null;
    setStatus(state.items.length + ' match(es)', state.items.length ? 'ok' : 'warn');
    render();
  } catch (err) {
    setStatus('Error', 'err');
    const a = $('#app');
    if (a) {
      a.innerHTML =
        '<p class="error">' + escapeHtml(formatError(err)) + '</p>' +
        '<p class="hint">Visit <a href="/api/debug" target="_blank">/api/debug</a> for captures ' +
        'and <a href="/api/debug/peek" target="_blank">/api/debug/peek</a> for the latest HTML.</p>';
    }
  } finally {
    state.busy = false;
  }
}

async function save(rowEl) {
  if (state.busy) return;
  const id = rowEl.dataset.id;
  if (state.saving === id) return;
  if (rowEl.classList.contains('locked')) {
    setStatus('Match is locked', 'err');
    return;
  }
  const choice = readChoiceFromRow(rowEl);
  if (!choice) {
    setStatus('Enter both scores (0-30)', 'err');
    return;
  }
  state.saving = id;
  setStatus('Saving ' + choice.home + '-' + choice.away + ' on ' + id + '…', 'busy');
  setRowBusy(rowEl, true);
  try {
    const res = await fetch('/api/predictions/' + encodeURIComponent(id), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ choice: choice })
    });
    const data = await res.json().catch(function () { return {}; });
    if (!res.ok) throw new Error((data && data.error) || ('HTTP ' + res.status));
    if (data.unverified) setStatus('Saved (unverified — verify on site)', 'warn');
    else setStatus('Saved ' + choice.home + '-' + choice.away, 'ok');
    const it = state.items.find(function (x) { return x.id === id; });
    if (it) it.prediction = { home: choice.home, away: choice.away };
    rowEl.classList.add('saved');
    setRowBusy(rowEl, false);
  } catch (err) {
    setStatus('Save failed', 'err');
    setRowBusy(rowEl, false);
    const a = $('#app');
    if (a) {
      a.innerHTML =
        '<p class="error">' + escapeHtml(formatError(err)) + '</p>' +
        '<p class="hint">Visit <a href="/api/debug" target="_blank">/api/debug</a> for the latest captures.</p>';
    }
  } finally {
    state.saving = null;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Fix from round-9: index.html uses `id="refresh"`, not `id="refresh-btn"`.
  const btn = document.getElementById('refresh') || document.getElementById('refresh-btn');
  if (btn) btn.addEventListener('click', refresh);
  const app = document.getElementById('app');
  if (!app) return;

  // Validate button click.
  app.addEventListener('click', function (ev) {
    const t = ev.target;
    if (!t || !t.closest) return;
    const submit = t.closest('.pred-submit');
    if (!submit) return;
    const row = submit.closest('.pred-row');
    if (row) save(row);
  });

  // Enter inside a score input saves the row.
  app.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Enter') return;
    const t = ev.target;
    if (!t || !t.closest) return;
    const inp = t.closest('.pred-input');
    if (!inp) return;
    ev.preventDefault();
    const row = inp.closest('.pred-row');
    if (row) save(row);
  });

  refresh();
});
