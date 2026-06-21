import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seoDir = path.resolve(__dirname, '..', 'src', 'content', 'seoPages');
const files = fs.readdirSync(seoDir).filter(f => f.endsWith('.json'));

console.log('Found ', files.length, 'SEO JSON files');
console.log('Directory:', seoDir);