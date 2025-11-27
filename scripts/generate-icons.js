import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../publik/icons');

// Buat direktori jika belum ada
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Color untuk icon
const colors = {
  primary: '#4CAF50',      // Green
  secondary: '#2196F3',    // Blue
  accent: '#FF9800',       // Orange
};

// SVG template untuk JourneyGo
const svgTemplate = (color) => `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="${color}"/>
  <circle cx="256" cy="256" r="150" fill="white" opacity="0.1"/>
  <circle cx="256" cy="256" r="120" fill="white" opacity="0.2"/>
  
  <!-- Map Pin -->
  <path d="M256 150 C220 150 190 180 190 216 C190 260 256 340 256 340 C256 340 322 260 322 216 C322 180 292 150 256 150 Z" fill="white"/>
  <circle cx="256" cy="216" r="20" fill="${color}"/>
  
  <!-- Travel elements -->
  <rect x="180" y="380" width="30" height="30" rx="5" fill="white" opacity="0.7"/>
  <rect x="220" y="390" width="30" height="20" rx="4" fill="white" opacity="0.7"/>
  <rect x="300" y="385" width="35" height="25" rx="5" fill="white" opacity="0.7"/>
  
  <!-- Text -->
  <text x="256" y="450" font-size="24" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial">JourneyGo</text>
</svg>
`;

async function generateIcon(size, color) {
  const svg = svgTemplate(color);
  const filename = `icon-${size}.png`;
  const filepath = path.join(publicDir, filename);

  try {
    await sharp(Buffer.from(svg))
      .resize(size, size, { fit: 'cover', background: color })
      .png()
      .toFile(filepath);
    console.log(`✅ Generated ${filename}`);
  } catch (error) {
    console.error(`❌ Error generating ${filename}:`, error.message);
  }
}

async function generateIcons() {
  console.log('🎨 Generating icons...\n');
  
  // Generate different sizes
  const sizes = [192, 512, 144, 96, 72, 48, 36, 32];
  
  for (const size of sizes) {
    await generateIcon(size, colors.primary);
  }
  
  // Generate apple touch icon
  await generateIcon(180, colors.primary);
  
  console.log('\n✨ All icons generated successfully!');
}

generateIcons().catch(console.error);
