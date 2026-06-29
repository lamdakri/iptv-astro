// round9/src/actions/updatePrediction.js
//
// Submits an exact-score prediction to cihgames.ma.
//
// Flow:
//   1. Validate `choice` server-side (defends against crafted payloads).
//   2. Navigate to /pronostics.php (post-login destination).
//   3. Locate the .match-row row whose input[name="match_id"] == id, OR whose
//      container id is `pronostics-match-${id}`.
//   4. Reject if the row is locked (pred_home input is disabled).
//   5. Fill pred_home + pred_away with validated strings, click the row's
//      button.prediction-submit, and wait for a POST response matching
//      /pronostics/.
import fs from 'node:fs';
import path from 'node:path';
import { logger } from '../logger.js';
import { onLoginPath } from '../browser.js';

const BASE = 'https://cihgames.ma';
const DEBUG_DIR = path.resolve('./debug');
if (!fs.existsSync(DEBUG_DIR)) fs.mkdirSync(DEBUG_DIR, { recursive: true });

// Generous upper bound; FIFA-level scores rarely exceed this. Tighten if site
// rejects higher values.
const SCORE_MIN = 0;
const SCORE_MAX = 30;

function validateChoice(choice) {
  if (!choice || typeof choice !== 'object') {
    throw new Error('Invalid choice: expected an object like {home: 1, away: 1}');
  }
  const home = Number(choice.home);
  const away = Number(choice.away);
  if (!Number.isInteger(home) || home < SCORE_MIN || home > SCORE_MAX) {
    throw new Error('Invalid choice.home: must be an integer in [' + SCORE_MIN + '..' + SCORE_MAX + ']');
  }
  if (!Number.isInteger(away) || away < SCORE_MIN || away > SCORE_MAX) {
    throw new Error('Invalid choice.away: must be an integer in [' + SCORE_MIN + '..' + SCORE_MAX + ']');
  }
  return { home: home, away: away };
}

async function snapshotState(page, name) {
  try {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const htmlName = 'update-' + name + '-' + stamp + '.html';
    const pngName  = 'update-' + name + '-' + stamp + '.png';
    fs.writeFileSync(path.join(DEBUG_DIR, htmlName), await page.content());
    await page.screenshot({ path: path.join(DEBUG_DIR, pngName), fullPage: true }).catch(function () {});
    logger.info({ step: name, html: htmlName }, 'update snapshot');
  } catch (e) {
    logger.warn({ err: e.message, step: name }, 'update snapshot failed');
  }
}

// Find the .match-row containing an input[name="match_id"] with value id.
// Walk through all rows and compare match_id values (more reliable than
// `:has()` filters when the id could contain unusual characters).
async function findRow(page, id) {
  const targetId = String(id).trim();
  const all = page.locator('.match-row.pronostics-match-row');
  const count = await all.count();
  for (let i = 0; i < count; i++) {
    const row = all.nth(i);
    const mid = await row.locator('input[name="match_id"]').first().getAttribute('value').catch(function () { return ''; });
    if (mid && String(mid).trim() === targetId) return row;
    // Fallback: the row's own id is `pronostics-match-N` where N is the match id.
    const rowId = await row.getAttribute('id').catch(function () { return ''; });
    if (rowId && rowId === 'pronostics-match-' + targetId) return row;
  }
  return null;
}

export async function updatePrediction(page, id, choice) {
  if (!id) throw new Error('Prediction id required');
  const validated = validateChoice(choice);
  const safeId = String(id).replace(/[^a-z0-9]/gi, '_').slice(0, 60);

  await page.goto(BASE + '/pronostics.php', { waitUntil: 'domcontentloaded', timeout: 30_000 });
  if (onLoginPath(page.url())) throw new Error('Not authenticated');
  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(function () {});

  const row = await findRow(page, id);
  if (!row) {
    await snapshotState(page, 'err-not-found-' + safeId);
    throw new Error('Match ' + id + ' not found on /pronostics.php.');
  }

  const homeInput = row.locator('input[name="pred_home"]').first();
  if (await homeInput.count() === 0) {
    await snapshotState(page, 'err-no-input-' + safeId);
    throw new Error('Match row ' + id + ' has no pred_home input — site structure differs.');
  }
  if (await homeInput.isDisabled().catch(function () { return false; })) {
    throw new Error('Match ' + id + ' is locked — cannot update');
  }

  // Set up a Promise that resolves on the matching POST response (or null on
  // timeout). We start it BEFORE the click so the response promise can race-
  // match the actual submission.
  const predict = /\/pronostics\/?(\?.*)?#?|prediction|prono|match/i;
  const responsePromise = page
    .waitForResponse(function (r) { return predict.test(r.url()) && r.request().method() === 'POST'; }, { timeout: 12_000 })
    .catch(function () { return null; });

  // Fill inputs. page.fill() triggers the row's input event handler so the
  // site's enable-submit logic runs.
  await homeInput.fill(String(validated.home), { timeout: 4_000 }).catch(async function (err) {
    await snapshotState(page, 'err-fill-home-' + safeId);
    throw new Error('Fill pred_home failed (' + err.message.split('\n')[0] + ') — see debug/update-err-fill-home-*');
  });
  await row.locator('input[name="pred_away"]').first().fill(String(validated.away), { timeout: 4_000 })
    .catch(async function (err) {
      await snapshotState(page, 'err-fill-away-' + safeId);
      throw new Error('Fill pred_away failed (' + err.message.split('\n')[0] + ') — see debug/update-err-fill-away-*');
    });

  const submit = row.locator('button.prediction-submit').first();
  if (await submit.count() === 0) {
    await snapshotState(page, 'err-no-submit-' + safeId);
    throw new Error('Match ' + id + ' has no .prediction-submit button — site structure differs.');
  }
  await submit.click({ timeout: 5_000 }).catch(async function (err) {
    await snapshotState(page, 'err-submit-click-' + safeId);
    throw new Error('Submit click failed (' + err.message.split('\n')[0] + ') — see debug/update-err-submit-click-*');
  });

  const resp = await responsePromise;
  if (resp) {
    const status = resp.status();
    if (status >= 400) {
      await snapshotState(page, 'err-rejected-' + safeId);
      throw new Error('Form submission rejected (HTTP ' + status + ' on ' + resp.url() + '). Inspect debug/update-err-rejected-*.');
    }
    logger.info({ id, home: validated.home, away: validated.away, status, url: resp.url() }, 'Prediction submitted and confirmed');
    return { ok: true, id: String(id), choice: validated, status: status, url: resp.url() };
  }

  logger.warn({ id }, 'No matching POST response observed after submit (still unverified).');
  return { ok: true, id: String(id), choice: validated, unverified: true };
}
