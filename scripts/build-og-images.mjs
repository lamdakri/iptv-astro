// Convert Open Graph SVG images to PNG for social media compatibility
// Social platforms (Facebook, Twitter, LinkedIn, WhatsApp) don't support SVG for og:image

import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.resolve(__dirname, '../public/images');

// 1200x630 is the standard OG image size
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

async function convertOgImages() {
  const files = fs.readdirSync(imagesDir).filter((f) => f.endsWith('.svg') && f.startsWith('og-'));

  if (files.length === 0) {
    console.log('⚠ No OG SVG files found in public/images/');
    return;
  }

  console.log(`🖼 Converting ${files.length} OG images from SVG to PNG...`);

  for (const file of files) {
    const svgPath = path.join(imagesDir, file);
    const pngName = file.replace(/\.svg$/i, '.png');
    const pngPath = path.join(imagesDir, pngName);

    try {
      const svgContent = fs.readFileSync(svgPath, 'utf8');

      // Replace filter="blur(...)" which sharp doesn't support
      const cleanSvg = svgContent
        .replace(/filter="[^"]*"/g, '')
        .replace(/<filter[^>]*>[\s\S]*?<\/filter>/g, '')
        // Also remove SVG elements that reference filters
        .replace(/<circle[^>]*filter[^>]*\/>/g, '');

      await sharp(Buffer.from(cleanSvg))
        .resize(OG_WIDTH, OG_HEIGHT)
        .png()
        .toFile(pngPath);

      console.log(`  ✅ ${file} → ${pngName}`);
    } catch (err) {
      console.error(`  ❌ ${file}: ${err.message}`);
    }
  }

  console.log('✅ OG PNG images generated successfully!');
}

convertOgImages().catch((err) => {
  console.error('❌ OG image conversion failed:', err);
  process.exit(1);
});
