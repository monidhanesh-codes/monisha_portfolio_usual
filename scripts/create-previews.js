const sharp = require('sharp');
const fs = require('fs');

async function createPreviews() {
  const width = 1200;
  const height = 800;

  // 1. Aadu Puli Aattam preview
  console.log('Optimizing aadu-puli-preview.png...');
  await sharp('public/aadu-puli-preview.png')
    .resize(width, height, { fit: 'cover', position: 'center' })
    .png({ quality: 90 })
    .toFile('public/aadu-puli-card.png');
  console.log('Created public/aadu-puli-card.png');

  // 2. Fortune Cookie preview
  console.log('Generating fortune cookie preview card...');
  const cookieTrimmed = await sharp('public/fortune-cookie-preview.png')
    .trim()
    .resize(600, null, { fit: 'inside' })
    .toBuffer();

  const cookieMeta = await sharp(cookieTrimmed).metadata();

  const bgSvg = Buffer.from(`
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stop-color="#FFFDF7" />
          <stop offset="50%" stop-color="#FFF8ED" />
          <stop offset="100%" stop-color="#F5E7D3" />
        </radialGradient>
        <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FADBB5" stop-opacity="0.8" />
          <stop offset="100%" stop-color="#FADBB5" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#E8B978" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#E8B978" stop-opacity="0" />
        </radialGradient>
        <filter id="slipShadow" x="-10%" y="-20%" width="120%" height="160%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#5C3414" flood-opacity="0.18" />
        </filter>
        <filter id="cookieGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="24" stdDeviation="28" flood-color="#4A2609" flood-opacity="0.25" />
        </filter>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

      <!-- Ambient Glow Orbs -->
      <circle cx="600" cy="380" r="380" fill="url(#glow1)" />
      <circle cx="600" cy="420" r="280" fill="url(#glow2)" />

      <!-- Fortune Paper Slip -->
      <g transform="translate(370, 520) rotate(-2.5)" filter="url(#slipShadow)">
        <rect width="460" height="64" rx="8" fill="#FFFDF8" stroke="#EAD9C4" stroke-width="1.5" />
        <rect x="14" y="10" width="3.5" height="44" fill="#D96B43" opacity="0.6" />
        <text x="235" y="38" font-family="'Cinzel', 'Georgia', serif" font-size="17" font-style="italic" fill="#3D2413" text-anchor="middle" letter-spacing="0.5">
          “Your future is crunching with possibilities” ✨
        </text>
      </g>
    </svg>
  `);

  const cookieX = Math.round((width - cookieMeta.width) / 2);
  const cookieY = Math.round((height - cookieMeta.height) / 2) - 45;

  await sharp(bgSvg)
    .composite([
      {
        input: cookieTrimmed,
        left: cookieX,
        top: cookieY,
      }
    ])
    .png({ quality: 90 })
    .toFile('public/fortune-cookie-card.png');

  console.log('Created public/fortune-cookie-card.png');
}

createPreviews().catch(err => {
  console.error('Error generating previews:', err);
  process.exit(1);
});

