import fs from 'fs';
import path from 'path';

const dir = 'src/content/seoPages';
const dict = JSON.parse(fs.readFileSync('scripts/seo-translations.json', 'utf8'));
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

const countryNames = {
  fr: {USA:'USA',UK:'Royaume-Uni',France:'France',Germany:'Allemagne',Canada:'Canada',Brazil:'Brésil',India:'Inde',Spain:'Espagne',Italy:'Italie',Portugal:'Portugal',Mexico:'Mexique',Argentina:'Argentine',Australia:'Australie',Japan:'Japon','South Africa':'Afrique du Sud',Nigeria:'Nigéria',Egypt:'Égypte',Morocco:'Maroc',Algeria:'Algérie',Tunisia:'Tunisie','Saudi Arabia':'Arabie Saoudite',UAE:'Émirats Arabes Unis',Qatar:'Qatar',Kuwait:'Koweït',Lebanon:'Liban',Iraq:'Irak',Jordan:'Jordanie',Netherlands:'Pays-Bas',Belgium:'Belgique',Switzerland:'Suisse',Sweden:'Suède',Norway:'Norvège',Greece:'Grèce',Turkey:'Turquie',Poland:'Pologne',Romania:'Roumanie',Philippines:'Philippines',Indonesia:'Indonésie',Malaysia:'Malaisie',Pakistan:'Pakistan','Ivory Coast':"Côte d'Ivoire",Senegal:'Sénégal',Chile:'Chili',Colombia:'Colombie',Peru:'Pérou',Ireland:'Irlande',Kenya:'Kenya',Ghana:'Ghana'},
  ar: {USA:'USA',UK:'المملكة المتحدة',France:'فرنسا',Germany:'ألمانيا',Canada:'كندا',Brazil:'البرازيل',India:'الهند',Spain:'إسبانيا',Italy:'إيطاليا',Portugal:'البرتغال',Mexico:'المكسيك',Argentina:'الأرجنتين',Australia:'أستراليا',Japan:'اليابان','South Africa':'جنوب أفريقيا',Nigeria:'نيجيريا',Egypt:'مصر',Morocco:'المغرب',Algeria:'الجزائر',Tunisia:'تونس','Saudi Arabia':'السعودية',UAE:'الإمارات',Qatar:'قطر',Kuwait:'الكويت',Lebanon:'لبنان',Iraq:'العراق',Jordan:'الأردن',Netherlands:'هولندا',Belgium:'بلجيكا',Switzerland:'سويسرا',Sweden:'السويد',Norway:'النرويج',Greece:'اليونان',Turkey:'تركيا',Poland:'بولندا',Romania:'رومانيا',Philippines:'الفلبين',Indonesia:'إندونيسيا',Malaysia:'ماليزيا',Pakistan:'باكستان','Ivory Coast':'ساحل العاج',Senegal:'السنغال',Chile:'تشيلي',Colombia:'كولومبيا',Peru:'بيرو',Ireland:'أيرلندا',Kenya:'كينيا',Ghana:'غانا'},
  es: {USA:'EE.UU.',UK:'Reino Unido',France:'Francia',Germany:'Alemania',Canada:'Canadá',Brazil:'Brasil',India:'India',Spain:'España',Italy:'Italia',Portugal:'Portugal',Mexico:'México',Argentina:'Argentina',Australia:'Australia',Japan:'Japón','South Africa':'Sudáfrica',Nigeria:'Nigeria',Egypt:'Egipto',Morocco:'Marruecos',Algeria:'Argelia',Tunisia:'Túnez','Saudi Arabia':'Arabia Saudita',UAE:'EAU',Qatar:'Catar',Kuwait:'Kuwait',Lebanon:'Líbano',Iraq:'Irak',Jordan:'Jordania',Netherlands:'Países Bajos',Belgium:'Bélgica',Switzerland:'Suiza',Sweden:'Suecia',Norway:'Noruega',Greece:'Grecia',Turkey:'Turquía',Poland:'Polonia',Romania:'Rumania',Philippines:'Filipinas',Indonesia:'Indonesia',Malaysia:'Malasia',Pakistan:'Pakistán','Ivory Coast':'Costa de Marfil',Senegal:'Senegal',Chile:'Chile',Colombia:'Colombia',Peru:'Perú',Ireland:'Irlanda',Kenya:'Kenia',Ghana:'Ghana'},
  de: {USA:'den USA',UK:'Großbritannien',France:'Frankreich',Germany:'Deutschland',Canada:'Kanada',Brazil:'Brasilien',India:'Indien',Spain:'Spanien',Italy:'Italien',Portugal:'Portugal',Mexico:'Mexiko',Argentina:'Argentinien',Australia:'Australien',Japan:'Japan','South Africa':'Südafrika',Nigeria:'Nigeria',Egypt:'Ägypten',Morocco:'Marokko',Algeria:'Algerien',Tunisia:'Tunesien','Saudi Arabia':'Saudi-Arabien',UAE:'VAE',Qatar:'Katar',Kuwait:'Kuwait',Lebanon:'Libanon',Iraq:'Irak',Jordan:'Jordanien',Netherlands:'Niederlande',Belgium:'Belgien',Switzerland:'Schweiz',Sweden:'Schweden',Norway:'Norwegen',Greece:'Griechenland',Turkey:'Türkei',Poland:'Polen',Romania:'Rumänien',Philippines:'Philippinen',Indonesia:'Indonesien',Malaysia:'Malaysia',Pakistan:'Pakistan','Ivory Coast':'Elfenbeinküste',Senegal:'Senegal',Chile:'Chile',Colombia:'Kolumbien',Peru:'Peru',Ireland:'Irland',Kenya:'Kenia',Ghana:'Ghana'},
  it: {USA:'USA',UK:'Regno Unito',France:'Francia',Germany:'Germania',Canada:'Canada',Brazil:'Brasile',India:'India',Spain:'Spagna',Italy:'Italia',Portugal:'Portogallo',Mexico:'Messico',Argentina:'Argentina',Australia:'Australia',Japan:'Giappone','South Africa':'Sudafrica',Nigeria:'Nigeria',Egypt:'Egitto',Morocco:'Marocco',Algeria:'Algeria',Tunisia:'Tunisia','Saudi Arabia':'Arabia Saudita',UAE:'EAU',Qatar:'Qatar',Kuwait:'Kuwait',Lebanon:'Libano',Iraq:'Iraq',Jordan:'Giordania',Netherlands:'Paesi Bassi',Belgium:'Belgio',Switzerland:'Svizzera',Sweden:'Svezia',Norway:'Norvegia',Greece:'Grecia',Turkey:'Turchia',Poland:'Polonia',Romania:'Romania',Philippines:'Filippine',Indonesia:'Indonesia',Malaysia:'Malesia',Pakistan:'Pakistan','Ivory Coast':"Costa d'Avorio",Senegal:'Senegal',Chile:'Cile',Colombia:'Colombia',Peru:'Perù',Ireland:'Irlanda',Kenya:'Kenya',Ghana:'Ghana'},
  pt: {USA:'EUA',UK:'Reino Unido',France:'França',Germany:'Alemanha',Canada:'Canadá',Brazil:'Brasil',India:'Índia',Spain:'Espanha',Italy:'Itália',Portugal:'Portugal',Mexico:'México',Argentina:'Argentina',Australia:'Austrália',Japan:'Japão','South Africa':'África do Sul',Nigeria:'Nigéria',Egypt:'Egito',Morocco:'Marrocos',Algeria:'Argélia',Tunisia:'Tunísia','Saudi Arabia':'Arábia Saudita',UAE:'EAU',Qatar:'Catar',Kuwait:'Kuwait',Lebanon:'Líbano',Iraq:'Iraque',Jordan:'Jordânia',Netherlands:'Países Baixos',Belgium:'Bélgica',Switzerland:'Suíça',Sweden:'Suécia',Norway:'Noruega',Greece:'Grécia',Turkey:'Turquia',Poland:'Polónia',Romania:'Roménia',Philippines:'Filipinas',Indonesia:'Indonésia',Malaysia:'Malásia',Pakistan:'Paquistão','Ivory Coast':'Costa do Marfim',Senegal:'Senegal',Chile:'Chile',Colombia:'Colômbia',Peru:'Peru',Ireland:'Irlanda',Kenya:'Quénia',Ghana:'Gana'}
};

// Full H1 translations for device/topic pages with English content in non-English sections
const fullH1Translations = {
  'How to Get IPTV on Firestick — Complete Setup Guide 2026': {
    fr: 'Comment Installer IPTV sur Firestick — Guide Complet 2026',
    ar: 'كيفية تثبيت IPTV على Firestick — دليل الإعداد الكامل 2026',
    es: 'Cómo Instalar IPTV en Firestick — Guía Completa 2026',
    de: 'IPTV auf Firestick einrichten — Komplette Anleitung 2026',
    it: 'Come Installare IPTV su Firestick — Guida Completa 2026',
    pt: 'Como Instalar IPTV no Firestick — Guia Completo 2026'
  },
  'How to Watch IPTV on Samsung Smart TV — Setup Guide 2026': {
    fr: 'Comment Regarder IPTV sur Samsung Smart TV — Guide 2026',
    ar: 'كيفية مشاهدة IPTV على Samsung Smart TV — دليل الإعداد 2026',
    es: 'Cómo Ver IPTV en Samsung Smart TV — Guía de Configuración 2026',
    de: 'IPTV auf Samsung Smart TV — Einrichtungsanleitung 2026',
    it: 'Come Guardare IPTV su Samsung Smart TV — Guida 2026',
    pt: 'Como Assistir IPTV na Samsung Smart TV — Guia de Configuração 2026'
  },
  'How to Watch IPTV on Smart TV — Complete Guide 2026': {
    fr: 'Comment Regarder IPTV sur Smart TV — Guide Complet 2026',
    ar: 'كيفية مشاهدة IPTV على التلفزيون الذكي — الدليل الكامل 2026',
    es: 'Cómo Ver IPTV en Smart TV — Guía Completa 2026',
    de: 'IPTV auf Smart TV — Komplette Anleitung 2026',
    it: 'Come Guardare IPTV su Smart TV — Guida Completa 2026',
    pt: 'Como Assistir IPTV na Smart TV — Guia Completo 2026'
  },
  'IPTV M3U Playlist — Best M3U IPTV Subscription 2026': {
    fr: 'Playlist M3U IPTV — Meilleur Abonnement IPTV M3U 2026',
    ar: 'قائمة تشغيل IPTV M3U — أفضل اشتراك IPTV M3U 2026',
    es: 'Lista M3U IPTV — Mejor Suscripción IPTV M3U 2026',
    de: 'IPTV M3U-Playlist — Bestes M3U IPTV-Abonnement 2026',
    it: 'Playlist M3U IPTV — Miglior Abbonamento IPTV M3U 2026',
    pt: 'Playlist M3U IPTV — Melhor Assinatura IPTV M3U 2026'
  },
  'IPTV on Android — Watch 20,000+ Channels on Any Android Device': {
    fr: 'IPTV sur Android — Regardez 20 000+ Chaînes sur Tout Appareil Android',
    ar: 'IPTV على Android — شاهد أكثر من 20,000 قناة على أي جهاز Android',
    es: 'IPTV en Android — Mira 20,000+ Canales en Cualquier Dispositivo Android',
    de: 'IPTV auf Android — 20.000+ Sender auf jedem Android-Gerät',
    it: 'IPTV su Android — Guarda 20.000+ Canali su Qualsiasi Dispositivo Android',
    pt: 'IPTV no Android — Assista 20.000+ Canais em Qualquer Dispositivo Android'
  },
  'IPTV on iPhone & iPad — Watch 20,000+ Channels on iOS': {
    fr: 'IPTV sur iPhone et iPad — Regardez 20 000+ Chaînes sur iOS',
    ar: 'IPTV على iPhone و iPad — شاهد أكثر من 20,000 قناة على iOS',
    es: 'IPTV en iPhone y iPad — Mira 20,000+ Canales en iOS',
    de: 'IPTV auf iPhone & iPad — 20.000+ Sender auf iOS',
    it: 'IPTV su iPhone e iPad — Guarda 20.000+ Canali su iOS',
    pt: 'IPTV no iPhone e iPad — Assista 20.000+ Canais no iOS'
  },
  'IPTV Smarters Pro — Best IPTV Subscription for Smarters App': {
    fr: 'IPTV Smarters Pro — Meilleur Abonnement IPTV pour Smarters',
    ar: 'IPTV Smarters Pro — أفضل اشتراك IPTV لتطبيق Smarters',
    es: 'IPTV Smarters Pro — Mejor Suscripción IPTV para la App Smarters',
    de: 'IPTV Smarters Pro — Bestes IPTV-Abonnement für Smarters',
    it: 'IPTV Smarters Pro — Miglior Abbonamento IPTV per Smarters',
    pt: 'IPTV Smarters Pro — Melhor Assinatura IPTV para Smarters'
  },
  'Best IPTV for Sports — Watch Live Sports in 4K 2026': {
    fr: 'Meilleur IPTV pour le Sport — Regardez les Sports en Direct en 4K 2026',
    ar: 'أفضل IPTV للرياضة — شاهد الرياضة المباشرة بدقة 4K 2026',
    es: 'Mejor IPTV para Deportes — Mira Deportes en Vivo en 4K 2026',
    de: 'Bestes IPTV für Sport — Live-Sport in 4K 2026',
    it: 'Miglior IPTV per lo Sport — Guarda lo Sport in Diretta in 4K 2026',
    pt: 'Melhor IPTV para Esportes — Assista Esportes ao Vivo em 4K 2026'
  }
};

// H1 prefix templates per language
const h1Templates = {
  fr: { prefix: 'Meilleur IPTV pour ', bestForPrefix: 'Meilleur IPTV pour ' },
  ar: { prefix: 'أفضل IPTV في ', bestForPrefix: 'أفضل IPTV في ' },
  es: { prefix: 'Mejor IPTV para ', bestForPrefix: 'Mejor IPTV para ' },
  de: { prefix: 'Bestes IPTV für ', bestForPrefix: 'Bestes IPTV für ' },
  it: { prefix: 'Miglior IPTV per ', bestForPrefix: 'Miglior IPTV per ' },
  pt: { prefix: 'Melhor IPTV para ', bestForPrefix: 'Melhor IPTV para ' }
};

// Description translations for English-prefixed descriptions in de/it/pt
const descTranslations = {
  de: 'Sehen Sie 20.000+ Sender in 4K mit IPTV 4K World. 20.000+ 4K-Sender, 50.000+ VOD, Anti-Freeze-Technologie. Kostenlose 12h-Testversion, 24/7 WhatsApp-Support.',
  it: 'Guarda 20.000+ canali live in 4K con IPTV 4K World. 20.000+ canali 4K, 50.000+ VOD, tecnologia anti-freeze. Prova gratis 12h, supporto WhatsApp 24/7.',
  pt: 'Assista 20.000+ canais ao vivo em 4K com IPTV 4K World. 20.000+ canais 4K, 50.000+ VOD, tecnologia anti-congelamento. Teste grátis 12h, suporte WhatsApp 24/7.'
};

// Internal link pricing translations
const linkPricingTranslations = {
  fr: 'Voir les Offres',
  ar: 'خطط الأسعار',
  es: 'Ver Planes',
  de: 'Preise ansehen',
  it: 'Piani Prezzi',
  pt: 'Ver Preços'
};

function isEnglishDesc(desc) {
  if (!desc) return false;
  return /^(Watch |Get |Access |Stream |Enjoy )/.test(desc.trim());
}

function isEnglish(s) {
  if (!s || s.length < 30) return false;
  // Non-English content has accented chars (À-ɏ for European) or Arabic script
  const hasNonAscii = /[À-ɏ\u0600-\u06FF]/.test(s);
  // Content without any non-ASCII chars is likely English
  return !hasNonAscii;
}

function getCountry(englishName, lang) {
  if (!countryNames[lang]) return englishName;
  // Try exact match first, then case-insensitive
  if (countryNames[lang][englishName]) return countryNames[lang][englishName];
  const lower = englishName.toLowerCase();
  for (const [key, val] of Object.entries(countryNames[lang])) {
    if (key.toLowerCase() === lower) return val;
  }
  return englishName;
}

function translateH1(h1, lang) {
  // Exact full translations first
  if (fullH1Translations[h1] && fullH1Translations[h1][lang]) return fullH1Translations[h1][lang];
  // Try dict.h1
  if (dict.h1 && dict.h1[h1] && dict.h1[h1][lang]) return dict.h1[h1][lang];
  
  // "Best IPTV for {country}" → translate country name
  const bestFor = /^Best IPTV for (.+)$/;
  const bm = h1.match(bestFor);
  if (bm) return h1Templates[lang].bestForPrefix + getCountry(bm[1].trim(), lang);
  
  // Already has translated prefix but English country name
  // "Meilleur IPTV pour Saudi Arabia" → fix country
  const prefixPatterns = {
    fr: /^Meilleur IPTV pour (.+?)(?: — .*)?$/,
    es: /^Mejor IPTV para (.+?)(?: — .*)?$/,
    de: /^Bestes IPTV für (.+?)(?: — .*)?$/,
    it: /^Miglior IPTV per (.+?)(?: — .*)?$/,
    pt: /^Melhor IPTV para (.+?)(?: — .*)?$/,
    ar: /^افضل IPTV — (.+?)(?: — .*)?$/
  };
  const pattern = prefixPatterns[lang];
  if (pattern) {
    const pm = h1.match(pattern);
    if (pm) {
      const countryOrText = pm[1].trim();
      const translated = getCountry(countryOrText, lang);
      if (translated !== countryOrText) {
        const remainder = h1.substring(pm[0].length);
        if (lang === 'ar') return 'أفضل IPTV في ' + translated + remainder;
        return h1Templates[lang].prefix + translated + remainder;
      }
    }
  }
  return null;
}

function translateH2(h2, lang) {
  const d = dict.h2;
  if (d[h2] && d[h2][lang]) return d[h2][lang];
  for (const [pat, trans] of Object.entries(d)) {
    if (pat.includes('{c}')) {
      const re = new RegExp('^' + pat.replace(/\{c\}/g, '(.+)') + '$');
      const m = h2.match(re);
      if (m && trans[lang]) return trans[lang].replace(/\{c\}/g, getCountry(m[1], lang));
    }
    if (pat.includes('{l}')) {
      const re = new RegExp('^' + pat.replace(/\{l\}/g, '(.+)') + '$');
      const m = h2.match(re);
      if (m && trans[lang]) return trans[lang].replace(/\{l\}/g, m[1]);
    }
  }
  return null;
}

function translateLinkText(text, lang) {
  if (text === 'View Pricing Plans') return linkPricingTranslations[lang] || text;
  
  // "Best IPTV for {EnglishCountry}" → translate country
  const bestMatch = text.match(/^Best IPTV for (.+?)(?: — .*)?$/);
  if (bestMatch) {
    const c = bestMatch[1].trim();
    const t = getCountry(c, lang);
    if (t !== c) return h1Templates[lang].prefix + t + text.substring(bestMatch[0].length);
  }
  
  // Already translated prefix but English country name
  const prefixPatterns = {
    fr: /^Meilleur IPTV pour (.+?)(?: — .*)?$/,
    es: /^Mejor IPTV para (.+?)(?: — .*)?$/,
    de: /^Bestes IPTV für (.+?)(?: — .*)?$/,
    it: /^Miglior IPTV per (.+?)(?: — .*)?$/,
    pt: /^Melhor IPTV para (.+?)(?: — .*)?$/,
    ar: /^افضل IPTV — (.+?)(?: — .*)?$/
  };
  const pattern = prefixPatterns[lang];
  if (pattern) {
    const pm = text.match(pattern);
    if (pm) {
      const c = pm[1].trim();
      const t = getCountry(c, lang);
      if (t !== c) {
        const remainder = text.substring(pm[0].length);
        if (lang === 'ar') return 'أفضل IPTV في ' + t + remainder;
        return h1Templates[lang].prefix + t + remainder;
      }
    }
  }
  return null;
}

let totalFixed = 0, h1c = 0, h2c = 0, cc = 0, descC = 0, linkC = 0;

files.forEach(f => {
  const fp = path.join(dir, f);
  const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
  let mod = false;

  ['fr','ar','es','de','it','pt'].forEach(l => {
    const s = data.languages[l];
    if (!s) return;

    // H1: try pattern-based translation for all H1s (handles country names + full English)
    const newH1 = translateH1(s.h1, l);
    if (newH1 && newH1 !== s.h1) {
      s.h1 = newH1;
      h1c++; mod = true;
    } else if (s.h1 && isEnglish(s.h1) && dict.h1 && dict.h1[s.h1] && dict.h1[s.h1][l]) {
      s.h1 = dict.h1[s.h1][l];
      h1c++; mod = true;
    }

    if (s.h2s) {
      for (let i = 0; i < s.h2s.length; i++) {
        if (isEnglish(s.h2s[i])) {
          const t = translateH2(s.h2s[i], l);
          if (t) { s.h2s[i] = t; h2c++; mod = true; }
        }
      }
    }

    // Description: replace English-prefixed descriptions
    if (s.description && isEnglishDesc(s.description)) {
      if (descTranslations[l]) {
        s.description = descTranslations[l];
        descC++; mod = true;
      }
    }

    // Internal links: translate country names
    if (s.internalLinks) {
      for (const link of s.internalLinks) {
        const newText = translateLinkText(link.text, l);
        if (newText && newText !== link.text) {
          link.text = newText;
          linkC++; mod = true;
        }
      }
    }

    if (s.content && dict.content) {
      const clean = s.content.replace(/<[^>]+>/g, '').trim();
      if (isEnglish(clean.substring(0, 100))) {
        let found = false;
        // Try exact content match first
        for (const [eng, trans] of Object.entries(dict.content)) {
          if (clean === eng || clean.startsWith(eng.substring(0, 80))) {
            if (trans[l]) {
              s.content = '<p>' + trans[l] + '</p>';
              cc++; mod = true; found = true;
            }
            break;
          }
        }
        // If no exact match, try device/topic templates for non-country pages
        if (!found && dict.deviceContent) {
          const pageSlug = data.slug.replace('iptv-', '');
          if (dict.deviceContent[pageSlug] && dict.deviceContent[pageSlug][l]) {
            s.content = '<p>' + dict.deviceContent[pageSlug][l] + '</p>';
            cc++; mod = true; found = true;
          }
        }
        // If still no match, use country-specific template only for actual country pages
        if (!found && dict.countryContent && dict.countryContent[l]) {
          // Only use countryContent for pages about actual countries (not devices/topics)
          const countrySlugs = ['usa','uk','france','germany','canada','brazil','india','spain','italy','portugal','mexico','argentina','australia','japan','egypt','morocco','algeria','tunisia','saudi-arabia','uae','qatar','kuwait','lebanon','iraq','jordan','netherlands','belgium','switzerland','sweden','norway','greece','turkey','poland','romania','philippines','indonesia','malaysia','pakistan','ireland','kenya','ghana','south-africa','nigeria','senegal','chile','colombia','peru','cote-divoire','espana','italia','norge','sverige','suisse','belgique','maroc','algerie','tunisie','nederland'];
          const pageSlug = data.slug.replace('iptv-', '');
          if (countrySlugs.includes(pageSlug)) {
            const slug = pageSlug.replace(/-/g, ' ');
            const countryCap = slug.charAt(0).toUpperCase() + slug.slice(1);
            const cName = getCountry(countryCap, l);
            s.content = '<p>' + dict.countryContent[l].replace('COUNTRY', cName) + '</p>';
            cc++; mod = true;
          }
        }
      }
    }
  });

  if (mod) {
    fs.writeFileSync(fp, JSON.stringify(data, null, 2) + '\n');
    totalFixed++;
    console.log('Fixed: ' + data.slug);
  }
});

console.log('\nTotal: ' + totalFixed + ' files - H1s:' + h1c + ' H2s:' + h2c + ' Descs:' + descC + ' Links:' + linkC + ' Content:' + cc);
