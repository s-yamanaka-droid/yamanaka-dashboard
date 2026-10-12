/**
 * Recorded instruments: a Wurlitzer electric piano and an acoustic drum kit,
 * cut down by scripts/prepare-samples.py into public/samples/ (see CREDITS.txt);
 * the lo-fi melody instruments (scripts/prepare-lofi-samples.py); and the band
 * (scripts/prepare-band-samples.py): an archtop guitar, a double bass, brushes,
 * a punchier kit and hand drums.
 *
 * The bytes are fetched once per page and shared, so they can be on their way
 * before the first tap; each audio context decodes its own copy. Until a bank
 * is ready (or if it never loads) the synthesised instruments play instead.
 */

import BAND from "./band-samples.json"
import LOFI from "./lofi-samples.json"

/** One Wurlitzer recording and the keys it covers, from the instrument's SFZ map. */
export type WurliZone = { file: string; lo: number; hi: number; center: number; tune: number; volume: number }

const z = (file: string, lo: number, hi: number, center: number, volume: number, tune = 0): WurliZone => ({ file, lo, hi, center, tune, volume })

/** The mp and f dynamics. Pitches are MIDI numbers; tune is in cents, volume in dB. */
export const WURLI: { mp: WurliZone[]; f: WurliZone[] } = {
  mp: [
    z("a1mp", 33, 35, 33, -3.8, -5), z("e2mp", 36, 41, 40, -4.2, -4), z("a2mp", 42, 47, 45, -4.7, -2),
    z("eb3mp", 48, 53, 51, -5.1, -9), z("ab3mp", 54, 59, 56, -5.3, -8), z("db4mp", 60, 62, 61, -5.3, 4),
    z("gb4mp", 63, 68, 66, -5.4, 7), z("b4mp", 69, 71, 71, -5.2, -5), z("db5mp", 72, 74, 73, -5.4, 3),
    z("g5mp", 75, 80, 79, -5.4, -8), z("db6mp", 81, 89, 85, -5.6, 6), z("ab6mp", 90, 96, 92, -5.7, 2),
  ],
  f: [
    z("a1f", 33, 35, 33, -4.7, -5), z("c2f", 36, 38, 36, -5.0, -7), z("f2f", 39, 44, 41, -4.7, -6),
    z("b2f", 45, 50, 47, -5.0, -8), z("e3f", 51, 53, 52, -4.7, -4), z("ab3f", 54, 59, 56, -4.8, -11),
    z("db4f", 60, 65, 61, -4.8, -2), z("ab4f", 66, 71, 68, -5.0), z("db5f", 72, 77, 73, -6.0, 3),
    z("g5f", 78, 80, 79, -5.9, -7), z("db6f", 81, 89, 85, -5.9), z("ab6f", 90, 96, 92, -5.9),
  ],
}

export const DRUMS = ["kick", "snare", "ghost", "rim", "hat", "hat-hard", "ohat", "crash", "htom", "ltom", "ride", "ride-2", "ride-bell", "hat-foot"] as const
export type DrumHit = (typeof DRUMS)[number]

/** Where the recordings are served and in which format: FLAC on the site, WAV where FLAC isn't served. */
export type SampleSource = { base: string; ext: "flac" | "wav" }

/** One recorded note: the pitch it sounds, and for an instrument evened out, the level that brings it in line. */
export type Note = { midi: number; buf: AudioBuffer; gain?: number }

/**
 * Instruments whose recordings are evened out note by note: the double bass
 * was recorded quieter the higher it goes (about 20 dB from C#2 to G3), which
 * would sink a walking line, and one of the guitar's notes rings louder than
 * its neighbours. The others keep the differences their players made.
 */
const EVEN = new Set(["upright-bass", "guitar"])

/** Loudness of the first tenth of a second of a recording, where a pluck is heard. */
function attack(buf: AudioBuffer): number {
  const d = buf.getChannelData(0)
  const n = Math.min(d.length, Math.round(buf.sampleRate * 0.1))
  let sum = 0
  for (let i = 0; i < n; i++) sum += d[i] * d[i]
  return Math.sqrt(sum / Math.max(1, n))
}

/** Levels that bring every note to the instrument's middle loudness, within 12 dB either way. */
export function evenOut(notes: Note[]): Note[] {
  const levels = notes.map((n) => attack(n.buf))
  const middle = [...levels].sort((a, b) => a - b)[Math.floor(levels.length / 2)]
  return notes.map((n, i) => ({ ...n, gain: Math.min(4, Math.max(0.25, middle / (levels[i] || middle))) }))
}

export type SampleBank = {
  wurli: Record<string, AudioBuffer>
  drums: Record<DrumHit, AudioBuffer>
  /** Recorded instruments played across the keyboard, each a few notes apart; filled in as they arrive. */
  inst: Record<string, Note[]>
  /** The band's extra kit pieces (brushes, the punchier kit, hand drums), by name; filled in as they arrive. */
  kit: Record<string, AudioBuffer>
}

/** The core recordings (Wurlitzer and kit), as paths under the samples folder, without the extension. */
export const SAMPLE_FILES: string[] = [...[...WURLI.mp, ...WURLI.f].map((w) => `wurlitzer/${w.file}`), ...DRUMS.map((d) => `drums/${d}`)]

const { drums: BAND_KIT, ...BAND_NOTES } = BAND as unknown as { drums: string[] } & Record<string, { file: string; midi: number }[]>
/** The pitched instruments beyond the core: each note's file and the pitch it sounds. */
export const INSTRUMENTS: Record<string, { file: string; midi: number }[]> = { ...LOFI, ...BAND_NOTES }
/** The band's extra kit pieces, by name (drums/<name> under the samples folder). */
export const KIT_PIECES: string[] = BAND_KIT
/** All of their files, fetched after the core ones so the first record isn't kept waiting. */
export const INSTRUMENT_FILES: string[] = [...Object.values(INSTRUMENTS).flatMap((notes) => notes.map((n) => n.file)), ...KIT_PIECES.map((k) => `drums/${k}`)]

/** The zone that plays a key at a loudness: f from 0.5 up, mp below. */
export function wurliZone(midi: number, vel: number): WurliZone {
  const zones = vel >= 0.5 ? WURLI.f : WURLI.mp
  const m = Math.max(zones[0].lo, Math.min(zones[zones.length - 1].hi, Math.round(midi)))
  return zones.find((w) => m >= w.lo && m <= w.hi) ?? zones[zones.length - 1]
}

export type Bytes = Map<string, ArrayBuffer>

const fetched = new Map<string, Promise<ArrayBuffer>>()

/** Fetch a set of files, each once per page however many lists it's in; the same promises go to every player. */
export function fetchSamples(src: SampleSource, files: string[] = SAMPLE_FILES, get: (url: string) => Promise<ArrayBuffer> = defaultGet): Promise<Bytes> {
  return Promise.all(
    files.map(async (f) => {
      const url = `${src.base}${f}.${src.ext}`
      let p = fetched.get(url)
      if (!p) {
        p = get(url)
        // a failed load may be retried later (the network came back)
        p.catch(() => fetched.delete(url))
        fetched.set(url, p)
      }
      return [f, await p] as const
    }),
  ).then((pairs) => new Map(pairs))
}

async function defaultGet(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url}: ${res.status}`)
  return res.arrayBuffer()
}

/** Decode the bytes for one audio context. Decoding detaches a buffer, so each context gets copies. */
export async function decodeSamples(ctx: BaseAudioContext, bytes: Bytes): Promise<SampleBank> {
  const decoded = new Map<string, AudioBuffer>()
  await Promise.all(SAMPLE_FILES.map(async (f) => { const b = bytes.get(f); if (b) decoded.set(f, await ctx.decodeAudioData(b.slice(0))) }))
  const take = (f: string) => {
    const buf = decoded.get(f)
    if (!buf) throw new Error(`missing sample ${f}`)
    return buf
  }
  const wurli: Record<string, AudioBuffer> = {}
  for (const w of [...WURLI.mp, ...WURLI.f]) wurli[w.file] = take(`wurlitzer/${w.file}`)
  const drums = Object.fromEntries(DRUMS.map((d) => [d, take(`drums/${d}`)])) as Record<DrumHit, AudioBuffer>
  const bank: SampleBank = { wurli, drums, inst: {}, kit: {} }
  await addRecordings(ctx, bank, bytes)
  return bank
}

const claimed = new WeakMap<SampleBank, Set<string>>()

/**
 * Put whatever recordings are among some bytes into a bank, skipping what it
 * already has: an instrument once all its notes are there, a kit piece on its own.
 */
export async function addRecordings(ctx: BaseAudioContext, bank: SampleBank, bytes: Bytes) {
  // what's already being decoded for this bank, so two arrivals of the same files decode them once
  let taken = claimed.get(bank)
  if (!taken) claimed.set(bank, (taken = new Set()))
  const claim = (key: string) => !taken.has(key) && !!taken.add(key)
  const jobs: Promise<void>[] = []
  for (const [name, notes] of Object.entries(INSTRUMENTS)) {
    if (bank.inst[name] || !notes.every((n) => bytes.has(n.file)) || !claim(name)) continue
    jobs.push(
      Promise.all(notes.map(async (n) => ({ midi: n.midi, buf: await ctx.decodeAudioData(bytes.get(n.file)!.slice(0)) }))).then((decoded) => {
        bank.inst[name] = EVEN.has(name) ? evenOut(decoded) : decoded
      }),
    )
  }
  for (const k of KIT_PIECES) {
    const b = bytes.get(`drums/${k}`)
    if (b && !bank.kit[k] && claim(`drums/${k}`)) jobs.push(ctx.decodeAudioData(b.slice(0)).then((buf) => void (bank.kit[k] = buf)))
  }
  await Promise.all(jobs)
}
