import fs from 'fs';
import path from 'path';

const dir = 'src/content/seoPages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'iptv-legal.json');

const L = JSON.parse(fs.readFileSync('scripts/seo-dict.json', 'utf8'));

// Page type detection
const countryFiles = Object.keys(L.slugToCountry);
const deviceFiles = L.deviceSlugs;
const topicFiles = L.topicSlugs;

function S(key, lang) { return L[lang][key] || key; }

function getCountry(slug, lang) {
  const ck = L.slugToCountry[slug];
  return ck && L.countries[ck] ? L.countries[ck][lang] : slug.replace('iptv-', '');
}

function buildAll() {
  let updated = 0, changed = 0;
  
  files.forEach(file => {
    const fp = path.join(dir, file);
    const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
    const en = data.languages.en;
    const slug = data.slug;
    let fileMod = false;
    
    ['fr', 'es', 'de', 'it', 'pt', 'ar'].forEach(lang => {
      const sec = data.languages[lang];
      if (!sec) return;
      
      const d = L[lang];
      let n;
      
      if (countryFiles.includes(slug)) {
        const cn = getCountry(slug, lang);
        n = {
          title: `IPTV ${cn} — ${d.best} ${d.subscription} IPTV 2026`,
          description: `${d.get} ${d.best.toLowerCase()} ${d.subscription} IPTV ${d.for} ${cn}. ${d.watch} 20.000+ ${d.channels} ${d.live} ${d['4']}. ${d.freeTrial12h}. ${d.support247}.`,
          h1: `${d.best} IPTV ${d.for} ${cn} — ${d.tv} ${d.live} ${d['4']}`,
          h2s: [`${d.why} ${d.choose} IPTV ${d.in} ${cn}`, `${d.tvChannels} ${d.available}`, `${d.watch} ${d.tv} ${d.from} ${d.abroad}`],
          content: `<p>${d.get} ${d.best.toLowerCase()} ${d.subscription} IPTV ${d.for} ${cn} ${d.with} IPTV 4K World. ${d.watch} ${d.all} ${d.favorite} ${d.channels} ${d.in} ${d.stunning} ${d['4']} ${d.quality}.</p><p>${d.with} ${d.support247} ${d.by} ${d.whatsapp} ${d.and} ${d.freeTrial12h}. ${d.our} ${d.service} ${d.available} ${d.worldwide}.</p>`,
          faqs: [
            { question: `${d.can} ${d.watch} ${d.tvChannels} ${d.in} ${cn} ${d.with} IPTV 4K World?`, answer: `${d.yes}! IPTV 4K World ${d.includes} ${d.all} ${d.major} ${d.channels} ${d.in} ${cn}. ${d.freeTrial12h} ${d.available}.` },
            { question: `IPTV ${d.available} ${d.in} ${cn}?`, answer: `${d.yes}, IPTV 4K World ${d.available} ${d.worldwide}. ${d.freeTrial12h} ${d.available}.` }
          ]
        };
      } else if (slug === 'iptv-android') {
        n = {
          title: `IPTV ${d.on} Android — ${d.best} ${d.app} IPTV ${d.for} Android 2026`,
          description: `${d.watch} IPTV ${d.on} ${d.phones}, ${d.tablets} ${d.and} ${d.tvBoxes}. 20.000+ ${d.channels} ${d.live} ${d['4']}. ${d.freeTrial12h}. ${d.support247}.`,
          h1: `${d.best} IPTV ${d.for} Android — ${d.watch} 20.000+ ${d.channels} ${d['4']}`,
          h2s: [`${d.best} ${d.player} IPTV ${d.for} Android`, `${d.how} ${d.setupVerb} IPTV ${d.on} Android`, `${d.why} ${d.choose} Android ${d.for} IPTV`],
          content: `<p>IPTV 4K World ${d.compatible} ${d.with} ${d.all} Android. ${d.watch} 20.000+ ${d.channelsLive} ${d.and} 50.000+ ${d.vod} ${d['4']}.</p><p>${d.setupVerb} ${d.smooth}. ${d.freeTrial12h} ${d.available}.</p>`,
          faqs: [
            { question: `${d.watch} IPTV ${d.on} Android?`, answer: `${d.yes}! IPTV 4K World ${d.compatible} ${d.with} ${d.all} Android.` },
            { question: `${d.bestApp} IPTV ${d.for} Android?`, answer: `IPTV Smarters ${d.and} TiviMate ${d.compatible} ${d.with} IPTV 4K World.` }
          ]
        };
      } else if (slug === 'iptv-firestick') {
        n = {
          title: `IPTV ${d.on} Firestick — ${d.install} IPTV ${d.on} Amazon Fire TV Stick 2026`,
          description: `${d.learn} ${d.how} ${d.install} IPTV ${d.on} Firestick. 20.000+ ${d.channels} ${d['4']}. ${d.freeTrial12h}. ${d.stepByStep}.`,
          h1: `${d.how} ${d.install} IPTV ${d.on} Firestick — ${d.complete} ${d.guide} 2026`,
          h2s: [`${d.why} Firestick ${d.is} ${d.best} ${d.for} IPTV`, `${d.how} ${d.install} IPTV ${d.on} Firestick`, `${d.bestApp} IPTV ${d.for} Firestick`],
          content: `<p>${d.transform} Fire TV Stick ${d.with} IPTV 4K World. 20.000+ ${d.channelsLive} ${d['4']}. ${d.freeTrial12h} ${d.available}.</p>`,
          faqs: [
            { question: `${d.install} IPTV ${d.on} Firestick?`, answer: `${d.yes}! ${d.compatible} ${d.with} ${d.all} Firestick. ${d.freeTrial12h}.` },
            { question: `IPTV ${d.safe} ${d.on} Firestick?`, answer: `${d.yes}, IPTV 4K World ${d.safe}. ${d.vpn} ${d.for} ${d.privacy}.` }
          ]
        };
      } else if (slug === 'iptv-ios') {
        n = {
          title: `IPTV ${d.on} iPhone & iPad — ${d.best} ${d.app} IPTV ${d.for} iOS 2026`,
          description: `${d.complete} ${d.guide} ${d.for} ${d.watch} IPTV ${d.on} iPhone ${d.and} iPad. ${d.bestApp} iOS. ${d.stepByStep}.`,
          h1: `${d.best} IPTV ${d.for} iPhone & iPad — ${d.watch} ${d['4']} ${d.on} iOS 2026`,
          h2s: [`${d.bestApp} iOS`, `${d.how} ${d.setupVerb} IPTV ${d.on} iPhone/iPad`, `${d.why} ${d.choose} IPTV ${d.for} iOS`],
          content: `<p>IPTV 4K World ${d.compatible} ${d.with} iPhone ${d.and} iPad. ${d.watch} 20.000+ ${d.channelsLive} ${d['4']}.</p><p>${d.setupVerb} ${d.smooth}. ${d.freeTrial12h} ${d.available}.</p>`,
          faqs: [
            { question: `${d.watch} IPTV ${d.on} iPhone/iPad?`, answer: `${d.yes}! ${d.compatible} ${d.with} iOS. ${d.freeTrial12h}.` },
            { question: `${d.bestApp} iOS?`, answer: `IPTV Smarters ${d.and} IPTVX ${d.compatible} ${d.with} IPTV 4K World.` }
          ]
        };
      } else if (slug === 'iptv-smart-tv') {
        n = {
          title: `IPTV ${d.on} Smart TV — ${d.complete} ${d.guide} Samsung, LG, Sony 2026`,
          description: `${d.complete} ${d.guide} ${d.for} ${d.install} IPTV ${d.on} Smart TV. Samsung, LG, Sony ${d.and} Android TV. ${d.freeTrial12h}.`,
          h1: `${d.setupVerb} IPTV ${d.on} Smart TV — ${d.complete} ${d.guide} 2026`,
          h2s: [`${d.why} ${d.choose} IPTV ${d.on} Smart TV`, `${d.how} ${d.install} IPTV ${d.on} Smart TV`, `${d.bestApp} ${d.for} Smart TV`],
          content: `<p>${d.transform} Smart TV ${d.with} IPTV 4K World. Samsung, LG, Sony ${d.and} ${d.more}. 20.000+ ${d.channelsLive} ${d['4']}.</p><p>${d.freeTrial12h} ${d.available}.</p>`,
          faqs: [
            { question: `IPTV ${d.on} Smart TV?`, answer: `${d.yes}! Samsung, LG, Sony ${d.and} Android TV. ${d.freeTrial12h}.` },
            { question: `${d.bestApp} ${d.for} Smart TV?`, answer: `Smart IPTV, TiviMate ${d.and} IPTV Smarters ${d.compatible}.` }
          ]
        };
      } else if (slug === 'iptv-samsung') {
        n = {
          title: `IPTV ${d.on} Samsung — ${d.complete} ${d.guide} 2026`,
          description: `${d.best} IPTV ${d.for} Samsung Smart TV. 20.000+ ${d.channels} ${d['4']}. ${d.freeTrial12h}.`,
          h1: `${d.best} IPTV ${d.for} Samsung — ${d.complete} ${d.guide} 2026`,
          h2s: [`${d.why} ${d.choose} Samsung`, `${d.how} ${d.setupVerb} IPTV ${d.on} Samsung`, `${d.why} ${d.choose} IPTV 4K World`],
          content: `<p>${d.best} IPTV ${d.for} Samsung TV. 20.000+ ${d.channelsLive} ${d['4']}. ${d.freeTrial12h} ${d.available}.</p>`,
          faqs: [
            { question: `IPTV ${d.on} Samsung?`, answer: `${d.yes}! ${d.all} Samsung Tizen OS. ${d.freeTrial12h}.` },
            { question: `${d.bestApp} ${d.for} Samsung?`, answer: `Smart IPTV ${d.compatible} ${d.with} IPTV 4K World.` }
          ]
        };
      } else if (slug === 'iptv-sports') {
        n = {
          title: `IPTV ${d.sports} — ${d.best} ${d.subscription} IPTV ${d.for} ${d.sport} 2026`,
          description: `${d.watch} ${d.sport} ${d.live} ${d.with} IPTV 4K World. Premier League, LaLiga, Serie A, NBA, UFC, F1 ${d.and} ${d.more} ${d['4']}.`,
          h1: `${d.best} IPTV ${d.for} ${d.sports} — ${d.watch} ${d.sport} ${d.live} ${d['4']} 2026`,
          h2s: [`${d.why} IPTV ${d.is} ${d.perfect} ${d.for} ${d.sports}`, `${d.sports} ${d.available}`, `$
