/**
 * Builds a 1200x630 link-preview card for each wedding.
 *
 * The banners are transparent PNGs, and messaging apps composite transparency
 * onto black - so a shared link would show the monogram floating on a black
 * square. These cards flatten each banner onto that wedding's own background
 * colour at the 1.91:1 ratio Open Graph expects.
 *
 * Run after adding a wedding or changing a banner:
 *   node scripts/generate-og-images.js
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const WIDTH = 1200;
const HEIGHT = 630;
/** Fraction of the card height the banner may occupy. */
const BANNER_SCALE = 0.78;

/* ----------------------------- PNG decoding ----------------------------- */

/**
 * @param {Buffer} buffer
 */
function decodePng(buffer) {
  let offset = 8;
  const idat = [];
  let header = null;

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      header = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        depth: data[8],
        colorType: data[9],
        interlace: data[12],
      };
    }
    if (type === "IDAT") idat.push(data);
    offset += 12 + length;
  }

  if (header.depth !== 8 || header.interlace !== 0 || ![2, 6].includes(header.colorType)) {
    throw new Error(`Unsupported PNG: ${JSON.stringify(header)}`);
  }

  const channels = header.colorType === 6 ? 4 : 3;
  const stride = header.width * channels;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const pixels = Buffer.alloc(header.height * stride);

  let cursor = 0;
  for (let y = 0; y < header.height; y++) {
    const filter = raw[cursor++];
    const line = raw.subarray(cursor, cursor + stride);
    cursor += stride;
    const current = pixels.subarray(y * stride, (y + 1) * stride);
    const previous =
      y > 0 ? pixels.subarray((y - 1) * stride, y * stride) : Buffer.alloc(stride);

    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? current[x - channels] : 0;
      const b = previous[x];
      const c = x >= channels ? previous[x - channels] : 0;
      const value = line[x];
      let restored;
      if (filter === 0) restored = value;
      else if (filter === 1) restored = value + a;
      else if (filter === 2) restored = value + b;
      else if (filter === 3) restored = value + ((a + b) >> 1);
      else {
        const pa = Math.abs(b - c);
        const pb = Math.abs(a - c);
        const pc = Math.abs(a + b - 2 * c);
        restored = value + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c);
      }
      current[x] = restored & 255;
    }
  }

  return { ...header, channels, stride, pixels };
}

/* ----------------------------- PNG encoding ----------------------------- */

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

/**
 * @param {Buffer} buffer
 */
function crc32(buffer) {
  let c = ~0;
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return ~c >>> 0;
}

/**
 * @param {string} type
 * @param {Buffer} data
 */
function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

/**
 * @param {number} width
 * @param {number} height
 * @param {Buffer} rgb
 */
function encodeRgb(width, height, rgb) {
  const stride = width * 3;
  const raw = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y++) {
    const out = y * (stride + 1);
    raw[out] = 1; // Sub filter compresses flat colour fields well.
    for (let x = 0; x < stride; x++) {
      const left = x >= 3 ? rgb[y * stride + x - 3] : 0;
      raw[out + 1 + x] = (rgb[y * stride + x] - left) & 255;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2; // truecolour, no alpha
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* ------------------------------ compositing ----------------------------- */

/** Box-downscale RGBA, averaging in premultiplied space so alpha stays clean. */
/**
 * @param {Buffer} src
 * @param {number} srcW
 * @param {number} srcH
 * @param {number} dstW
 * @param {number} dstH
 */
function resizeRgba(src, srcW, srcH, dstW, dstH) {
  const dst = Buffer.alloc(dstW * dstH * 4);
  const xRatio = srcW / dstW;
  const yRatio = srcH / dstH;

  for (let y = 0; y < dstH; y++) {
    const y0 = Math.floor(y * yRatio);
    const y1 = Math.min(srcH, Math.ceil((y + 1) * yRatio));
    for (let x = 0; x < dstW; x++) {
      const x0 = Math.floor(x * xRatio);
      const x1 = Math.min(srcW, Math.ceil((x + 1) * xRatio));
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let sy = y0; sy < y1; sy++) {
        for (let sx = x0; sx < x1; sx++) {
          const i = (sy * srcW + sx) * 4;
          const alpha = src[i + 3];
          r += src[i] * alpha;
          g += src[i + 1] * alpha;
          b += src[i + 2] * alpha;
          a += alpha;
          n++;
        }
      }
      const o = (y * dstW + x) * 4;
      if (a === 0) continue;
      dst[o] = Math.round(r / a);
      dst[o + 1] = Math.round(g / a);
      dst[o + 2] = Math.round(b / a);
      dst[o + 3] = Math.round(a / n);
    }
  }
  return dst;
}

/** @param {string} hex */
const hexToRgb = (hex) => {
  const value = hex.replace("#", "");
  const full = value.length === 3 ? value.split("").map((c) => c + c).join("") : value;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
};

/**
 * @param {string} bannerPath
 * @param {string} backgroundHex
 */
function buildCard(bannerPath, backgroundHex) {
  const banner = decodePng(readFileSync(bannerPath));

  // Normalise to RGBA regardless of the source having an alpha channel.
  const rgba = Buffer.alloc(banner.width * banner.height * 4);
  for (let i = 0, o = 0; o < rgba.length; i += banner.channels, o += 4) {
    rgba[o] = banner.pixels[i];
    rgba[o + 1] = banner.pixels[i + 1];
    rgba[o + 2] = banner.pixels[i + 2];
    rgba[o + 3] = banner.channels === 4 ? banner.pixels[i + 3] : 255;
  }

  const maxH = Math.round(HEIGHT * BANNER_SCALE);
  const maxW = Math.round(WIDTH * 0.55);
  const scale = Math.min(maxW / banner.width, maxH / banner.height, 1);
  const drawW = Math.max(1, Math.round(banner.width * scale));
  const drawH = Math.max(1, Math.round(banner.height * scale));
  const scaled = resizeRgba(rgba, banner.width, banner.height, drawW, drawH);

  const background = hexToRgb(backgroundHex);
  const card = Buffer.alloc(WIDTH * HEIGHT * 3);
  for (let i = 0; i < WIDTH * HEIGHT; i++) {
    card[i * 3] = background[0];
    card[i * 3 + 1] = background[1];
    card[i * 3 + 2] = background[2];
  }

  const offsetX = Math.round((WIDTH - drawW) / 2);
  const offsetY = Math.round((HEIGHT - drawH) / 2);
  for (let y = 0; y < drawH; y++) {
    for (let x = 0; x < drawW; x++) {
      const s = (y * drawW + x) * 4;
      const alpha = scaled[s + 3] / 255;
      if (alpha === 0) continue;
      const d = ((y + offsetY) * WIDTH + (x + offsetX)) * 3;
      for (let k = 0; k < 3; k++) {
        card[d + k] = Math.round(scaled[s + k] * alpha + card[d + k] * (1 - alpha));
      }
    }
  }

  return encodeRgb(WIDTH, HEIGHT, card);
}

/* -------------------------------- driver -------------------------------- */

const accountsSource = readFileSync(join(ROOT, "src/app/wedding/accounts.ts"), "utf8");
const entries = [
  ...accountsSource.matchAll(
    /"([a-z0-9-]+)":\s*\{[^}]*?slug:\s*"([a-z0-9-]+)"[^}]*?backgroundColor:\s*"(#[0-9a-fA-F]{3,6})"/gs,
  ),
].map(([, key, , backgroundColor]) => ({ key, backgroundColor }));

const outputDir = join(ROOT, "public/wedding/og");
if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

let built = 0;
for (const { key, backgroundColor } of entries) {
  const bannerPath = join(ROOT, "public/wedding", `${key}.png`);
  if (!existsSync(bannerPath)) {
    console.log(`  skip ${key} (no banner)`);
    continue;
  }
  const card = buildCard(bannerPath, backgroundColor);
  const target = join(outputDir, `${key}.png`);
  writeFileSync(target, card);
  console.log(
    `  ${key.padEnd(18)} ${backgroundColor.padEnd(8)} -> ${(card.length / 1024).toFixed(0)} KB`,
  );
  built++;
}

console.log(`\nGenerated ${built} preview card(s) at ${WIDTH}x${HEIGHT}.`);
