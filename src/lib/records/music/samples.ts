/**
 * Recorded instruments: a Wurlitzer electric piano and an acoustic drum kit,
 * cut down by scripts/prepare-samples.py into public/samples/ (see CREDITS.txt).
 *
 * The bytes are fetched once per page and shared, so they can be on their way
 * before the first tap; each audio context decodes its own copy. Until a bank
 * is ready (or if it never loads) the synthesised instruments play instead.
 */

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

export const DRUMS = ["kick", "snare", "ghost", "rim", "hat", "hat-hard", "ohat", "crash", "htom", "ltom"] as const
export type DrumHit = (typeof DRUMS)[number]

/** Where the recordings are served and in which format: FLAC on the site, WAV where FLAC isn't served. */
export type SampleSource = { base: string; ext: "flac" | "wav" }

export type SampleBank = {
  wurli: Record<string, AudioBuffer>
  drums: Record<DrumHit, AudioBuffer>
}

/** Every recording the bank needs, as paths under the samples folder, without the extension. */
export const SAMPLE_FILES: string[] = [...[...WURLI.mp, ...WURLI.f].map((w) => `wurlitzer/${w.file}`), ...DRUMS.map((d) => `drums/${d}`)]

/** The zone that plays a key at a loudness: f from 0.5 up, mp below. */
export function wurliZone(midi: number, vel: number): WurliZone {
  const zones = vel >= 0.5 ? WURLI.f : WURLI.mp
  const m = Math.max(zones[0].lo, Math.min(zones[zones.length - 1].hi, Math.round(midi)))
  return zones.find((w) => m >= w.lo && m <= w.hi) ?? zones[zones.length - 1]
}

export type Bytes = Map<string, ArrayBuffer>

const fetched = new Map<string, Promise<Bytes>>()

/** Fetch every file once per source; the same promise is handed to every player on the page. */
export function fetchSamples(src: SampleSource, get: (url: string) => Promise<ArrayBuffer> = defaultGet): Promise<Bytes> {
  const key = `${src.base}*.${src.ext}`
  let p = fetched.get(key)
  if (!p) {
    p = Promise.all(SAMPLE_FILES.map(async (f) => [f, await get(`${src.base}${f}.${src.ext}`)] as const)).then((pairs) => new Map(pairs))
    // a failed load may be retried later (the network came back)
    p.catch(() => fetched.delete(key))
    fetched.set(key, p)
  }
  return p
}

async function defaultGet(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url}: ${res.status}`)
  return res.arrayBuffer()
}

/** Decode the bytes for one audio context. Decoding detaches a buffer, so each context gets copies. */
export async function decodeSamples(ctx: BaseAudioContext, bytes: Bytes): Promise<SampleBank> {
  const decoded = new Map<string, AudioBuffer>()
  await Promise.all([...bytes].map(async ([f, b]) => decoded.set(f, await ctx.decodeAudioData(b.slice(0)))))
  const take = (f: string) => {
    const buf = decoded.get(f)
    if (!buf) throw new Error(`missing sample ${f}`)
    return buf
  }
  const wurli: Record<string, AudioBuffer> = {}
  for (const w of [...WURLI.mp, ...WURLI.f]) wurli[w.file] = take(`wurlitzer/${w.file}`)
  const drums = Object.fromEntries(DRUMS.map((d) => [d, take(`drums/${d}`)])) as Record<DrumHit, AudioBuffer>
  return { wurli, drums }
}
