import fs from 'fs';
import path from 'path';
const dir='src/content/seoPages';
const files=fs.readdirSync(dir).filter(f=>f.endsWith('.json'));

function isGen(h1){
  const h=(h1||'').toLowerCase();
  return /^(best|meilleur|mejor|bestes|miglior|melhor)\s+iptv\s*[-–—]/.test(h)
    || /^أفضل iptv\s*[-–—]/.test(h1||'');
}

let updated=0,h1f=0,h2f=0,cf=0,df=0;
files.forEach(f=>{
  const fp=path.join(dir,f);
  const d=JSON.parse(fs.readFileSync(fp,'utf8'));
  const en=d.languages?.en;
  if(!en)return;
  let mod=false;
  ['fr','es','de','it','pt','ar'].forEach(l=>{
    const s=d.languages[l];
    if(!s)return;
    if(isGen(s.h1||'')&&en.h1){s.h1=en.h1;h1f++;mod=true}
    if((s.h2s||[]).length<3&&en.h2s&&en.h2s.length>=3){s.h2s=[...en.h2s];h2f++;mod=true}
    if((s.content||'').length<150&&en.content&&en.content.length>150){s.content=en.content;cf++;mod=true}
    if((s.description||'').length<60&&en.description&&en.description.length>60){s.description=en.description;df++;mod=true}
  });
  if(mod){fs.writeFileSync(fp,JSON.stringify(d,null,2)+'\n');updated++}
});
console.log(`Files:${updated} H1:${h1f} H2s:${h2f} Content:${cf} Desc:${df}`);
