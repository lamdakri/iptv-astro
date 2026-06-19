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

let totalFixed = 0, h1c = 0, h2c = 0, cc = 0;

files.forEach(f => {
  const fp = path.join(dir, f);
  const data = JSON.parse(fs.readFileSync(fp, 'utf8'));
  let mod = false;

  ['fr','ar','es','de','it','pt'].forEach(l => {
    const s = data.languages[l];
    if (!s) return;

    if (s.h1 && isEnglish(s.h1) && dict.h1 && dict.h1[s.h1] && dict.h1[s.h1][l]) {
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

console.log('\nTotal: ' + totalFixed + ' files - H1s:' + h1c + ' H2s:' + h2c + ' Content:' + cc);
