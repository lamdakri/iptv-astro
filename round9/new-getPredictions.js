// round9/src/actions/getPredictions.js
//
// Parses cihgames.ma's /pronostics.php into exact-score rows.
//
// Live DOM (verified 2026-06-26 from debug/predictions-..html):
//   <div id="pronostics-match-N" class="match-row pronostics-match-row">
//     <div class="match-date-cell">
//       <b>Groupe A</b>           <!-- league -->
//       <time datetime="...">...</time>
//     </div>
//     <div class="teams pronostics-teams">
//       <span class="team team-home"><span class="team-name">X</span></span>
//       <span class="team team-away"><span class="team-name">Y</span></span>
//     </div>
//     <div class="prediction-actions">
//       <form method="post" action="/pronostics#pronostics-match-N" class="predict pronostics-predict">
//         <input type="hidden" name="match_id" value="N">
//         <input type="number" name="pred_home" ... min="0">
//         <input type="number" name="pred_away" ... min="0">
//         <button class="btn small prediction-submit" ...>Valider</button>
//       </form>
//     </div>
//   </div>
//
// When saved, the button gains the `is-saved` class and the inputs show the score.
// When locked, the inputs are `disabled` and the button is disabled.

import fs from 'node:fs';
import path from 'node:path';
import { logger } from '../logger.js';
import { onLoginPath } from '../browser.js';

const BASE = 'https://cihgames.ma';
const DEBUG_DIR = path.resolve('./debug');
if (!fs.existsSync(DEBUG_DIR)) fs.mkdirSync(DEBUG_DIR, { recursive: true });

// Try /pronostics.php first (it's the post-login destination). /my_predictions.php is
// a fallback for users whose account lands there instead.
const PREDICTIONS_URLS = [BASE + '/pronostics.php', BASE + '/my_predictions.php'];

// Single working row selector for cihgames.ma 2026. The 16-selector guess list in
// earlier versions didn't include this class, which is why the page rendered empty.
const ROW_SELECTOR = '.match-row.pronostics-match-row';

function toScore(value) {
  if (value == null) return null;
  const trimmed = String(value).trim();
  if (trimmed === '') return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

export async function getPredictions(page) {
  let lastErr;
  for (const url of PREDICTIONS_URLS) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
      if (!onLoginPath(page.url())) break;
    } catch (err) {
      lastErr = err;
      logger.warn({ url, err: err.message }, 'predictions URL failed');
    }
  }
  if (onLoginPath(page.url())) {
    throw new Error('Still on /login after navigation — session invalid');
  }

  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(function () {});

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const htmlName = 'predictions-' + stamp + '.html';
  const pngName  = 'predictions-' + stamp + '.png';
  fs.writeFileSync(path.join(DEBUG_DIR, htmlName), await page.content());
  await page.screenshot({ path: path.join(DEBUG_DIR, pngName), fullPage: true }).catch(function () {});

  let raw = [];
  try {
    raw = await page.$$eval(ROW_SELECTOR, function (els) {
      const txt = function (el, sel) {
        const n = el.querySelector(sel);
        return n && n.textContent ? (n.textContent || '').trim() || null : null;
      };
      const attr = function (el, sel, name) {
        const n = el.querySelector(sel);
        if (!n) return null;
        return name ? n.getAttribute(name) : n.value;
      };
      return els.map(function (el) {
        const id = (attr(el, 'input[name="match_id"]', 'value') || '').trim()
          || ((el.id || '').replace(/^pronostics-match-?/, '').trim() || null);
        const homeNode = el.querySelector('input[name="pred_home"]');
        const awayNode = el.querySelector('input[name="pred_away"]');
        const homeVal  = homeNode ? homeNode.value : null;
        const awayVal  = awayNode ? awayNode.value : null;
        const submitBtn = el.querySelector('button.prediction-submit');
        const saved = !!(submitBtn && submitBtn.classList.contains('is-saved'));
        const locked = !!(homeNode && homeNode.disabled);
        const home = (homeVal && homeVal.trim() !== '') ? Number(homeVal) : null;
        const away = (awayVal && awayVal.trim() !== '') ? Number(awayVal) : null;
        const prediction = (Number.isFinite(home) && Number.isFinite(away)) ? { home: home, away: away } : null;
        return {
          id: id,
          homeTeam: txt(el, '.team.team-home > .team-name'),
          awayTeam: txt(el, '.team.team-away > .team-name'),
          league:   txt(el, '.match-date-cell > b'),
          date:     attr(el, '.match-date-cell time', 'datetime'),
          prediction: prediction,
          saved: saved,
          locked: locked
        };
      }).filter(function (x) { return x.id; });
    });
  } catch (err) {
    logger.warn({ err: err.message }, 'parse predictions failed');
  }

  // Dedupe (some sites render the same match twice in different sections).
  const seen = new Set();
  const items = [];
  for (const p of raw) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    items.push({
      id:         String(p.id),
      homeTeam:   p.homeTeam,
      awayTeam:   p.awayTeam,
      league:     p.league,
      date:       p.date,
      prediction: p.prediction,  // {home, away} or null
      saved:      !!p.saved,
      locked:     !!p.locked
    });
  }

  // Sort: unlocked upcoming first (chronologically), then locked past matches.
  items.sort(function (a, b) {
    if (a.locked !== b.locked) return a.locked ? 1 : -1;
    const da = Date.parse(a.date || '') || Infinity;
    const db = Date.parse(b.date || '') || Infinity;
    return da - db;
  });

  if (items.length === 0) {
    logger.warn('No rows matched ' + ROW_SELECTOR + '. Inspect ' + htmlName + ' and update the parser.');
  }

  return {
    items: items,
    debug: { htmlPath: '/debug/' + htmlName, pngPath: '/debug/' + pngName, selector: ROW_SELECTOR },
    fetchedAt: new Date().toISOString()
  };
}
