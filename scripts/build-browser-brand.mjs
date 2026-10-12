// Build browser graphics from approved originals; do not redraw the logo or Racco.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const directory = new URL('public/brand/browser/', root);
await mkdir(directory, { recursive: true });
const source = async path => `data:image/png;base64,${(await readFile(new URL(path, root))).toString('base64')}`;
const logo = await source('public/brand/lakkan-logo/lakkan-a3-wordmark.png');
const racco = await source('public/brand-book/racco-self-avatar.png');
const svg = (size, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">${body}</svg>`;
// Follow the space between the original l and a; a rectangular crop includes
// part of the adjacent letter because their bounding boxes overlap.
const companyIcon = svg(256, `<rect width="64" height="64" rx="12" fill="white"/><svg x="22" y="7" width="20" height="50" viewBox="75 170 175 438"><defs><clipPath id="initial"><path d="M75 170H215V560H245V610H75Z"/></clipPath></defs><image href="${logo}" width="1983" height="793" clip-path="url(#initial)"/></svg>`);
const raccoIcon = svg(256, `<rect width="64" height="64" rx="12" fill="white"/><image href="${racco}" width="64" height="64"/>`);
const shared = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="white"/>
  <image href="${racco}" x="568" y="6" width="624" height="624"/>
  <rect x="58" y="60" width="10" height="10" rx="5" fill="#b4382b"/>
  <text x="82" y="72" font-family="Arial, sans-serif" font-size="19" letter-spacing="2" fill="#17221f">PEOPLE &amp; WORK</text>
  <svg x="54" y="210" width="508" height="122" viewBox="75 170 1830 438"><image href="${logo}" width="1983" height="793"/></svg>
  <text x="58" y="386" font-family="Arial, sans-serif" font-size="30" fill="#17221f">with Racco.</text>
  <path d="M58 534h62" stroke="#b4382b" stroke-width="4"/>
  <text x="136" y="542" font-family="Arial, sans-serif" font-size="18" letter-spacing="2" fill="#17221f">IDEAS TO ACTION</text>
</svg>`;
const png = (markup, size) => sharp(Buffer.from(markup)).resize(size, size).png().toBuffer();
await writeFile(new URL('lakkan-racco-share-v1.png', directory), await sharp(Buffer.from(shared)).png().toBuffer());
for (const [name, markup] of [['lakkan', companyIcon], ['racco', raccoIcon]]) {
  await writeFile(new URL(`${name}-icon-v1.png`, directory), await png(markup, 256));
  await writeFile(new URL(`${name}-apple-v1.png`, directory), await png(markup, 180));
}

// Replace the default /favicon.ico too, including clients that ignore metadata.
const sizes = [16, 32, 48, 256];
const images = await Promise.all(sizes.map(size => png(companyIcon, size)));
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
for (let i = 0; i < sizes.length; i++) {
  const start = 6 + i * 16;
  header[start] = header[start + 1] = sizes[i] === 256 ? 0 : sizes[i];
  header.writeUInt16LE(1, start + 4); header.writeUInt16LE(32, start + 6);
  header.writeUInt32LE(images[i].length, start + 8); header.writeUInt32LE(offset, start + 12);
  offset += images[i].length;
}
await writeFile(new URL('src/app/favicon.ico', root), Buffer.concat([header, ...images]));
console.log('Built one 1200×630 share image, two browser icons, two home-screen icons and favicon.ico from approved source assets.');
