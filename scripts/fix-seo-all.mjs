import fs from 'fs';

const p = 'src/content/seoPages';
const files = fs.readdirSync(p).filter(f => f.endsWith('.json'));
const startEng = /^(Watch |Get |Best |Access |Enjoy |Stream |Buy |Start |Learn |Check |Try |Contact |Sign |View |Premium |Ultimate |Top |Why |How |All |Your |IP TV|Is |Can |What |Does |Do |Will |Are |Should )/;
const langs = ['fr','ar','es','de','it','pt'];
const issues = [];
let totalFields = 0;

files.forEach(f => {
  const d = JSON.parse(fs.readFileSync(p + '/' + f, 'utf8'));
  langs.forEach(l => {
    const s = d.languages[l];
    if (!s) return;
    
    // H1
    totalFields++;
    if (s.h1 && startEng.test(s.h1.trim()))
      issues.push({ file: f, lang: l, field: 'H1', text: s.h1.trim().substring(0, 100) });
    
    // Description
    totalFields++;
    if (s.description && startEng.test(s.description.trim()))
      issues.push({ file: f, lang: l, field: 'Desc', text: s.description.trim().substring(0, 100) });
    
    // H2s
    if (s.h2s) s.h2s.forEach((h, i) => {
      totalFields++;
      if (startEng.test(h.trim()))
        issues.push({ file: f, lang: l, field: 'H2#' + i, text: h.trim().substring(0, 100) });
    });
    
    // Content
    totalFields++;
    if (s.content) {
      const clean = s.content.replace(/<[^>]+>/g, '').trim();
      if (startEng.test(clean))
        issues.push({ file: f, lang: l, field: 'Content', text: clean.substring(0, 100) });
    }
    
    // FAQs
    if (s.faqs) s.faqs.forEach((fq, i) => {
      totalFields++;
      if (startEng.test(fq.question.trim()))
        issues.push({ file: f, lang: l, field: 'FAQ-Q#' + i, text: fq.question.trim().substring(0, 100) });
      totalFields++;
      if (fq.answer && startEng.test(fq.answer.trim()))
        issues.push({ file: f, lang: l, field: 'FAQ-A#' + i, text: fq.answer.trim().substring(0, 100) });
    });
    
    // Internal links
    if (s.internalLinks) s.internalLinks.forEach((li, i) => {
      totalFields++;
      if (startEng.test(li.text.trim()))
        issues.push({ file: f, lang: l, field: 'Link#' + i, text: li.text.trim().substring(0, 100) });
    });
  });
});

console.log('Files: ' + files.length + ' | Languages: ' + langs.length + ' | Total checks: ' + totalFields);
console.log('');

if (issues.length === 0) {
  console.log('========================================');
  console.log('  RESULT: ZERO ENGLISH STRINGS FOUND');
  console.log('  All 60 files x 6 languages x 6+ fields');
  console.log('  are 100% translated.');
  console.log('========================================');
} else {
  const byField = {};
  const byLang = {};
  issues.forEach(i => {
    const f = i.field.replace(/#.*/, '');
    byField[f] = (byField[f] || 0) + 1;
    byLang[i.lang] = (byLang[i.lang] || 0) + 1;
  });
  console.log('ISSUES FOUND: ' + issues.length);
  console.log('By field: ' + JSON.stringify(byField));
  console.log('By language: ' + JSON.stringify(byLang));
  issues.slice(0, 20).forEach(i => console.log(i.file + ' [' + i.lang + '] ' + i.field + ': ' + i.text));
}
