/**
 * A 12-inch record face, drawn as an SVG data URI so the carousel can use it
 * as a disc image: black vinyl with fine grooves and the gaps between songs,
 * and a paper label in the middle (about a third of the diameter, like an LP)
 * carrying the record's art and title.
 *
 * Text on the label uses system fonts: an SVG shown as an image can't load
 * web fonts.
 */

// No radial "sunburst": orange rays on white read as the Rising Sun flag.
export type LabelArt = "blob" | "rings" | "halftone" | "stripes" | "split" | "dots"

export type VinylLabel = {
  /** Printed large across the top of the label. */
  title: string
  /** Small line under the title, e.g. "SIDE A · 33⅓ RPM". */
  sub?: string
  /** Small mark at the bottom of the label. */
  mark?: string
  art: LabelArt
  /** Paper, figure, accent. */
  colors: [string, string, string]
  /** Print colour on the label. */
  ink: string
  /** "glyph" draws the title and mark in the poster's stroke letters instead of a system font. */
  face?: "type" | "glyph"
}

const R = 100
/** Arts that cover the label edge to edge, so lettering needs paper under it. */
const BUSY = new Set<LabelArt>(["stripes", "rings", "halftone", "split"])
const LABEL = 33

import { glyphPath, glyphWidth } from "./glyphs"

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
const n = (x: number) => x.toFixed(2)

function grooves(seed: number): string {
  const out: string[] = []
  // song breaks: smooth bands where the stylus jumps between tracks
  const gaps = [48 + (seed % 5), 62 + (seed % 3), 77 + (seed % 4), 89]
  let k = seed * 7.31
  const rand = () => ((k = (k * 9301 + 49297) % 233280) / 233280)
  // grooves are uneven in a real pressing: louder passages cut wider and catch more light
  for (let r = LABEL + 7.5; r < R - 1.6; r += 0.42 + rand() * 0.28) {
    if (gaps.some((g) => Math.abs(r - g) < 0.9)) continue
    const loud = 0.5 + 0.5 * Math.sin(r * 0.9 + seed)
    const a = 0.02 + loud * 0.05 + rand() * 0.025
    out.push(`<circle r="${n(r)}" stroke="rgba(255,255,255,${a.toFixed(3)})" stroke-width="${(0.16 + loud * 0.14).toFixed(2)}"/>`)
  }
  for (const g of gaps) out.push(`<circle r="${g}" stroke="rgba(0,0,0,.6)" stroke-width="1.5"/>`)
  // the run-out groove by the label, and its scratched-in matrix number
  out.push(`<circle r="${LABEL + 5.5}" stroke="rgba(255,255,255,.05)" stroke-width="3.6"/>`)
  return `<g fill="none" transform="translate(100 100)">${out.join("")}</g>`
}

function art(kind: LabelArt, [paper, fig, acc]: [string, string, string]): string {
  const c = (r: number, fill: string, extra = "") => `<circle cx="100" cy="100" r="${n(r)}" fill="${fill}" ${extra}/>`
  if (kind === "blob") {
    // a large colour field pushed off-centre, and one small dot to balance it
    return c(LABEL, paper) + `<circle cx="86" cy="114" r="27" fill="${fig}"/>` + `<circle cx="123" cy="88" r="4.2" fill="${acc}"/>`
  }
  if (kind === "rings") {
    const rs: string[] = [c(LABEL, paper)]
    for (let r = LABEL - 2, i = 0; r > 6; r -= 3.2, i++) rs.push(c(r, "none", `stroke="${i % 3 === 2 ? acc : fig}" stroke-width="1.1"`))
    return rs.join("")
  }
  if (kind === "halftone") {
    const d: string[] = [c(LABEL, paper)]
    for (let y = 68; y <= 132; y += 4)
      for (let x = 68 + ((y / 4) % 2) * 2; x <= 132; x += 4) {
        const rad = Math.max(0, 1.6 - Math.hypot(x - 124, y - 106) / 26)
        if (rad > 0.15) d.push(`<circle cx="${x}" cy="${y}" r="${n(rad)}" fill="${fig}"/>`)
      }
    return d.join("") + `<circle cx="127" cy="104" r="5.5" fill="${acc}"/>`
  }
  if (kind === "stripes") {
    const s: string[] = []
    for (let i = -8; i < 9; i++) s.push(`<rect x="${100 + i * 5}" y="60" width="2.4" height="80" fill="${i % 4 === 0 ? acc : fig}"/>`)
    return c(LABEL, paper) + `<g transform="rotate(-28 100 100)">${s.join("")}</g>`
  }
  if (kind === "split") {
    return c(LABEL, paper) + `<path d="M${100 - LABEL} 100A${LABEL} ${LABEL} 0 0 0 ${100 + LABEL} 100Z" fill="${fig}"/>` + c(10, acc)
  }
  // dots: a ring of beads, like the strobe marks on a turntable platter
  const b: string[] = [c(LABEL, paper)]
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2
    b.push(`<circle cx="${n(100 + 30.4 * Math.cos(a))}" cy="${n(100 + 30.4 * Math.sin(a))}" r="1.1" fill="${i % 9 === 0 ? acc : fig}"/>`)
  }
  return b.join("")
}

/** Letters in the poster's strokes, laid out on a line; returns the paths and the run's length. */
function strokeRun(text: string, h: number) {
  const s = h * 0.092
  const w = h * 0.48
  const gap = h * 0.14
  let x = 0
  const letters = [...text.toUpperCase().replace(/[^A-Z ]/g, "")].map((ch) => {
    const lw = glyphWidth(ch, w, s)
    const at = x
    x += lw + gap
    return { ch, at, lw }
  })
  return { s, letters, length: Math.max(x - gap, 0) }
}

/** The title bent over the top of the label, each letter standing on a circle of radius r,
 *  on a band of paper so it reads over any art. */
function arcTitle(text: string, h: number, r: number, ink: string, paper: string): string {
  const { s, letters, length } = strokeRun(text, h)
  const mid = r + h / 2
  const half = (length / 2 + h * 0.55) / mid
  const band = `<path d="M${n(100 - mid * Math.sin(half))} ${n(100 - mid * Math.cos(half))}A${n(mid)} ${n(mid)} 0 0 1 ${n(100 + mid * Math.sin(half))} ${n(100 - mid * Math.cos(half))}" fill="none" stroke="${paper}" stroke-width="${n(h + s * 2 + 2.2)}" stroke-linecap="round"/>`
  const paths = letters
    .filter((l) => l.ch !== " ")
    .map((l) => {
      const a = (l.at + l.lw / 2 - length / 2) / r
      const x = 100 + r * Math.sin(a)
      const y = 100 - r * Math.cos(a)
      return `<path transform="translate(${n(x)} ${n(y)}) rotate(${n((a * 180) / Math.PI)}) translate(${n(-l.lw / 2)} ${n(-h)})" d="${glyphPath(l.ch, l.lw, h, s)}"/>`
    })
  return band + `<g fill="none" stroke="${ink}" stroke-width="${n(s)}" stroke-linecap="square">${paths.join("")}</g>`
}

/** A short word set straight and centred, its baseline at y. */
function lineMark(text: string, h: number, y: number, ink: string): string {
  const { s, letters, length } = strokeRun(text, h)
  const paths = letters
    .filter((l) => l.ch !== " ")
    .map((l) => `<path transform="translate(${n(100 - length / 2 + l.at)} ${n(y - h)})" d="${glyphPath(l.ch, l.lw, h, s)}"/>`)
  return `<g fill="none" stroke="${ink}" stroke-width="${n(s)}" stroke-linecap="square">${paths.join("")}</g>`
}

export function vinylFace(label: VinylLabel, seed = 1): string {
  const fs = Math.max(5.5, Math.min(10, 46 / Math.max(label.title.length, 1) / 0.6))
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="600" height="600">` +
    `<defs>` +
    `<radialGradient id="v" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#1b1b1d"/><stop offset=".35" stop-color="#0d0d0e"/><stop offset=".97" stop-color="#121214"/><stop offset="1" stop-color="#2a2a2c"/></radialGradient>` +
    `<clipPath id="l"><circle cx="100" cy="100" r="${LABEL}"/></clipPath>` +
    `<path id="t" d="M${100 - 24} 100A24 24 0 0 1 ${100 + 24} 100"/>` +
    `</defs>` +
    `<circle cx="100" cy="100" r="${R}" fill="url(#v)"/>` +
    grooves(seed) +
    `<circle cx="100" cy="100" r="${LABEL + 1.6}" fill="#0a0a0b"/>` +
    `<path id="m" d="M${100 - 37.5} 100A37.5 37.5 0 0 0 ${100 + 37.5} 100"/>` +
    `<text font-family="Courier, monospace" font-size="2.1" fill="rgba(255,255,255,.22)" letter-spacing=".5"><textPath href="#m" startOffset="58%">LKN-${String(seed).padStart(3, "0")}-A  ✶</textPath></text>` +
    `<g clip-path="url(#l)">${art(label.art, label.colors)}</g>` +
    (label.face === "glyph"
      ? // the poster's letters: cap height to fit the arc, a quiet grotesk for the small print
        arcTitle(label.title, Math.min(7, 46 / Math.max(label.title.length, 1) / 0.62), 21.5, label.ink, label.colors[0]) +
        // busy art gets a paper plate under the small print
        ((label.sub || label.mark) && BUSY.has(label.art) ? `<rect x="82.5" y="115.2" width="35" height="13.4" rx="6.7" fill="${label.colors[0]}"/>` : "") +
        `<g font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" fill="${label.ink}" text-anchor="middle">` +
        (label.sub ? `<text x="100" y="119.6" font-size="2.35" letter-spacing=".75">${esc(label.sub)}</text>` : "") +
        `</g>` +
        (label.mark ? lineMark(label.mark, 3.2, 126, label.ink) : "")
      : `<g font-family="Futura, 'Avenir Next Condensed', 'Helvetica Neue', Arial, sans-serif" fill="${label.ink}" text-anchor="middle">` +
        `<text font-size="${n(fs)}" font-weight="700" letter-spacing=".6"><textPath href="#t" startOffset="50%">${esc(label.title.toUpperCase())}</textPath></text>` +
        (label.sub ? `<text x="100" y="119" font-size="3.1" letter-spacing=".9">${esc(label.sub)}</text>` : "") +
        (label.mark ? `<text x="100" y="126" font-size="4.2" font-weight="700" letter-spacing=".3">${esc(label.mark)}</text>` : "") +
        `</g>`) +
    `<circle cx="100" cy="100" r="3.6" fill="none" stroke="rgba(0,0,0,.35)" stroke-width=".6"/>` +
    `</svg>`
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg)
}
