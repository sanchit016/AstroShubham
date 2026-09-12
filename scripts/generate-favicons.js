const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 implementation for PNG chunks
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  chunk.writeUInt32BE(crc32(typeAndData), 8 + len);
  return chunk;
}

function encodePNG(width, height, rgbaBuffer) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  
  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: 6 (RGBA)
  ihdr[10] = 0; // Compression: deflate
  ihdr[11] = 0; // Filter: standard
  ihdr[12] = 0; // Interlace: none
  const ihdrChunk = createChunk('IHDR', ihdr);

  // Scanlines with filter byte 0
  const scanlines = Buffer.alloc(height * (1 + width * 4));
  let srcOffset = 0;
  let dstOffset = 0;
  for (let y = 0; y < height; y++) {
    scanlines[dstOffset++] = 0; // Filter None
    rgbaBuffer.copy(scanlines, dstOffset, srcOffset, srcOffset + width * 4);
    srcOffset += width * 4;
    dstOffset += width * 4;
  }

  // IDAT
  const compressed = zlib.deflateSync(scanlines, { level: 9 });
  const idatChunk = createChunk('IDAT', compressed);

  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createIco(pngBuffers) {
  // ICONDIR header (6 bytes)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(pngBuffers.length, 4); // count

  let offset = 6 + pngBuffers.length * 16;
  const entries = [];

  for (const item of pngBuffers) {
    const { width, height, buffer } = item;
    const entry = Buffer.alloc(16);
    entry[0] = width >= 256 ? 0 : width;
    entry[1] = height >= 256 ? 0 : height;
    entry[2] = 0; // color palette count
    entry[3] = 0; // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // image size
    entry.writeUInt32LE(offset, 12); // image offset
    entries.push(entry);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers.map(p => p.buffer)]);
}

// Point-in-polygon helper
function pointInPolygon(px, py, vertices) {
  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i][0], yi = vertices[i][1];
    const xj = vertices[j][0], yj = vertices[j][1];
    const intersect = ((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Primary 8-pointed Vedic star polygon definitions in 64x64 coordinate space
const primaryStar = [
  [32, 11], [35.5, 27.5], [53, 32], [35.5, 36.5],
  [32, 53], [28.5, 36.5], [11, 32], [28.5, 27.5]
];

// Rotate point around center (32, 32)
function rotatePoint(x, y, angleRad) {
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  const dx = x - 32;
  const dy = y - 32;
  return [32 + dx * cos - dy * sin, 32 + dx * sin + dy * cos];
}

const diagStarRaw = [
  [32, 17.5], [35.2, 28.5], [46.5, 32], [35.2, 35.5],
  [32, 46.5], [28.8, 35.5], [17.5, 32], [28.8, 28.5]
];
const diagStar = diagStarRaw.map(([x, y]) => rotatePoint(x, y, Math.PI / 4));

// Gold gradient interpolator
function getGoldColor(nx, ny) {
  // Gradient from top-left (0,0) to bottom-right (1,1)
  const t = Math.max(0, Math.min(1, (nx + ny) / 2));
  if (t < 0.35) {
    // #fef08a (254, 240, 138) to #eab308 (234, 179, 8)
    const k = t / 0.35;
    return [
      Math.round(254 + (234 - 254) * k),
      Math.round(240 + (179 - 240) * k),
      Math.round(138 + (8 - 138) * k)
    ];
  } else if (t < 0.75) {
    // #eab308 (234, 179, 8) to #ca8a04 (202, 138, 4)
    const k = (t - 0.35) / 0.40;
    return [
      Math.round(234 + (202 - 234) * k),
      Math.round(179 + (138 - 179) * k),
      Math.round(8 + (4 - 8) * k)
    ];
  } else {
    // #ca8a04 (202, 138, 4) to #854d0e (133, 77, 14)
    const k = (t - 0.75) / 0.25;
    return [
      Math.round(202 + (133 - 202) * k),
      Math.round(138 + (77 - 138) * k),
      Math.round(4 + (14 - 4) * k)
    ];
  }
}

// Sample color at (x64, y64)
function samplePixel(x64, y64) {
  const dx = x64 - 32;
  const dy = y64 - 32;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Outside outer cosmic circle
  if (dist > 30.5) {
    return [0, 0, 0, 0];
  }

  // Outer border ring (stroke #ca8a04)
  if (dist >= 28.8 && dist <= 30.2) {
    return [202, 138, 4, 255];
  }

  // Base background radial gradient: #1e1808 (center) to #080602 (edge)
  const normDist = dist / 30.0;
  let r = Math.round(30 + (8 - 30) * normDist);
  let g = Math.round(24 + (6 - 24) * normDist);
  let b = Math.round(8 + (2 - 8) * normDist);
  let a = 255;

  // Celestial Orbit Ring 1 (radius 24, dash effect)
  if (Math.abs(dist - 24) < 0.6) {
    const angle = Math.atan2(dy, dx);
    if (Math.sin(angle * 12) > -0.2) {
      r = Math.min(255, r + 100);
      g = Math.min(255, g + 80);
      b = Math.min(255, b + 10);
    }
  }

  // Celestial Orbit Ring 2 (radius 17)
  if (Math.abs(dist - 17) < 0.5) {
    r = Math.min(255, r + 70);
    g = Math.min(255, g + 55);
    b = Math.min(255, b + 5);
  }

  // 4 Cardinal coordinate nodes
  const cardinalNodes = [[32, 8], [56, 32], [32, 56], [8, 32]];
  for (const [nx, ny] of cardinalNodes) {
    const ndist = Math.sqrt((x64 - nx) ** 2 + (y64 - ny) ** 2);
    if (ndist <= 1.5) {
      return [254, 240, 138, 255];
    }
  }

  // Star glow
  if (dist < 22) {
    const glowIntensity = Math.max(0, 1 - dist / 22) * 0.45;
    r = Math.min(255, Math.round(r + 234 * glowIntensity));
    g = Math.min(255, Math.round(g + 179 * glowIntensity));
    b = Math.min(255, Math.round(b + 8 * glowIntensity));
  }

  // Secondary Diagonal Star
  if (pointInPolygon(x64, y64, diagStar)) {
    const [gr, gg, gb] = getGoldColor(x64 / 64, y64 / 64);
    r = Math.round(r * 0.15 + gr * 0.85);
    g = Math.round(g * 0.15 + gg * 0.85);
    b = Math.round(b * 0.15 + gb * 0.85);
  }

  // Primary 4-pointed Star
  if (pointInPolygon(x64, y64, primaryStar)) {
    const [gr, gg, gb] = getGoldColor(x64 / 64, y64 / 64);
    r = gr;
    g = gg;
    b = gb;
  }

  // Center sparkling core
  if (dist <= 3.2) {
    if (dist <= 1.5) {
      return [255, 255, 255, 255]; // Pure white diamond center
    }
    // #fffbeb
    return [255, 251, 235, 255];
  }

  return [r, g, b, a];
}

function renderImage(size) {
  const buf = Buffer.alloc(size * size * 4);
  const supersample = 4; // 4x4 sub-pixels for perfect anti-aliasing

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let rSum = 0, gSum = 0, bSum = 0, aSum = 0;

      for (let sy = 0; sy < supersample; sy++) {
        for (let sx = 0; sx < supersample; sx++) {
          const px = ((x + (sx + 0.5) / supersample) / size) * 64;
          const py = ((y + (sy + 0.5) / supersample) / size) * 64;
          const [r, g, b, a] = samplePixel(px, py);
          rSum += (r * a) / 255;
          gSum += (g * a) / 255;
          bSum += (b * a) / 255;
          aSum += a;
        }
      }

      const count = supersample * supersample;
      const finalA = Math.round(aSum / count);
      let finalR = 0, finalG = 0, finalB = 0;
      if (finalA > 0) {
        finalR = Math.round((rSum / count) * (255 / finalA));
        finalG = Math.round((gSum / count) * (255 / finalA));
        finalB = Math.round((bSum / count) * (255 / finalA));
      }

      const offset = (y * size + x) * 4;
      buf[offset] = finalR;
      buf[offset + 1] = finalG;
      buf[offset + 2] = finalB;
      buf[offset + 3] = finalA;
    }
  }

  return encodePNG(size, size, buf);
}

// Generate all sizes
console.log('Generating multi-size icons for Google Search, Apple, and Browsers...');
const sizes = [16, 32, 48, 96, 180, 192, 512];
const generated = {};

for (const s of sizes) {
  console.log(`Rendering ${s}x${s}...`);
  generated[s] = renderImage(s);
}

const publicDir = path.join(__dirname, '..', 'public');
const appDir = path.join(__dirname, '..', 'src', 'app');

// Write PNG files
fs.writeFileSync(path.join(publicDir, 'favicon-16x16.png'), generated[16]);
fs.writeFileSync(path.join(publicDir, 'favicon-32x32.png'), generated[32]);
fs.writeFileSync(path.join(publicDir, 'favicon-48x48.png'), generated[48]); // Google Favicon Standard
fs.writeFileSync(path.join(publicDir, 'favicon-96x96.png'), generated[96]);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), generated[180]);
fs.writeFileSync(path.join(publicDir, 'favicon-192x192.png'), generated[192]);
fs.writeFileSync(path.join(publicDir, 'icon.png'), generated[512]);

// App router icons
fs.writeFileSync(path.join(appDir, 'icon.png'), generated[512]);
fs.writeFileSync(path.join(appDir, 'apple-icon.png'), generated[180]);

// Multi-size ICO (16, 32, 48)
const icoBuffer = createIco([
  { width: 16, height: 16, buffer: generated[16] },
  { width: 32, height: 32, buffer: generated[32] },
  { width: 48, height: 48, buffer: generated[48] }
]);

fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);

console.log('✅ All icons and favicon.ico successfully created!');
