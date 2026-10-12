/**
 * Songs and discs live as JSON under src/data/records, so music can be changed
 * without touching code:
 *
 *   src/data/records/songs/<id>.json  one song each, written or recorded
 *   src/data/records/discs.json       the discs, each naming a song by its id
 *
 * Everything is checked when it's read; a mistake stops the build with a
 * message that names the file and the field. See docs/records.md.
 */

import { QUALITIES, type Chord, type Groove, type LeadTone, type Quality, type Texture, type TrackSpec } from "./music/compose"
import { formBars, type Score, type ScoreNote } from "./music/song"
import { mod, SCALES, type ScaleName } from "./music/theory"
import { vinylFace, type LabelArt, type VinylLabel } from "./vinyl"


const GROOVES: Groove[] = ["drift", "lofi", "pulse", "drive", "bounce", "city", "shuffle", "swing", "bossa", "ballad", "brush", "hop", "funk", "latin"]
const LEADS: LeadTone[] = ["pluck", "bell", "glass", "reed", "vibes", "piano", "vibraphone", "kalimba", "zither", "sax", "guitar"]
const TEXTURES: Texture[] = ["vinyl", "waves", "rain", "none"]
const ARTS: LabelArt[] = ["blob", "rings", "halftone", "stripes", "split", "dots"]
const NOTES: Record<string, number> = { C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, F: 5, "F#": 6, Gb: 6, G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11 }
const ROMAN: Record<string, number> = { I: 0, II: 2, III: 4, IV: 5, V: 7, VI: 9, VII: 11 }

export class ContentError extends Error {}

const fail = (file: string, msg: string): never => {
  throw new ContentError(`${file}: ${msg}`)
}

function oneOf<T extends string>(file: string, field: string, v: unknown, list: readonly T[]): T {
  if (typeof v === "string" && (list as readonly string[]).includes(v)) return v as T
  return fail(file, `"${field}" は ${list.map((x) => `"${x}"`).join(" / ")} のどれかにしてください（今は ${JSON.stringify(v)}）`)
}

function num(file: string, field: string, v: unknown, lo: number, hi: number): number {
  if (typeof v === "number" && v >= lo && v <= hi) return v
  return fail(file, `"${field}" は ${lo}〜${hi} の数字にしてください（今は ${JSON.stringify(v)}）`)
}

function text(file: string, field: string, v: unknown): string {
  if (typeof v === "string" && v.trim()) return v
  return fail(file, `"${field}" に文字を入れてください`)
}

/**
 * A chord in key-relative Roman numerals: degree, colour, optional bass.
 * "IVmaj9", "bVImaj7#11", "IIm9", "V13", "Imaj7/V". "69" means a 6/9 chord.
 */
export function parseChord(raw: string, file = "chord"): Chord {
  const m = /^([b#]?)(VII|VI|V|IV|III|II|I)(.*?)(?:\/([b#]?)(VII|VI|V|IV|III|II|I))?$/.exec(raw.trim())
  if (!m) return fail(file, `和音 "${raw}" が読めません。"IVmaj9" や "IIm9" のように、ローマ数字＋響きで書いてください`)
  const shift = (acc: string) => (acc === "b" ? -1 : acc === "#" ? 1 : 0)
  const root = mod(ROMAN[m[2]] + shift(m[1]), 12)
  const q = (m[3] === "69" ? "6/9" : m[3]) as Quality
  if (!(q in QUALITIES))
    return fail(file, `和音 "${raw}" の響き "${m[3]}" は使えません。使えるのは ${Object.keys(QUALITIES).map((k) => (k === "6/9" ? "69" : k)).join(" / ")} です`)
  const chord: Chord = { root, q }
  if (m[5]) chord.bass = mod(ROMAN[m[5]] + shift(m[4]), 12)
  return chord
}

/** The key's tonic placed where the songwriter expects it: D3 up to C#4. */
export const tonicOf = (pc: number) => 50 + mod(pc - 2, 12)

export type Song = {
  id: string
  title: string
  /** The song to write and play, for generated songs. */
  track?: TrackSpec
  /** A recorded file to play instead. */
  audio?: string
  /** For the sleeve: key and tempo when known. */
  key?: string
  bpm?: number
}

export function parseSong(id: string, data: unknown, file = `src/data/records/songs/${id}.json`): Song {
  if (!data || typeof data !== "object") return fail(file, "中身が JSON のオブジェクトになっていません")
  const d = data as Record<string, unknown>
  const title = text(file, "title", d.title)
  const kind = oneOf(file, "kind", d.kind, ["generated", "score", "file"] as const)
  if (kind === "file") {
    const src = text(file, "src", d.src)
    if (!src.startsWith("/") && !/^https:\/\//.test(src)) fail(file, `"src" は "/audio/曲名.mp3" のように public からの場所で書いてください`)
    return {
      id,
      title,
      audio: src,
      key: typeof d.key === "string" ? d.key : undefined,
      bpm: typeof d.bpm === "number" ? d.bpm : undefined,
    }
  }
  const key = text(file, "key", d.key)
  if (!(key in NOTES)) fail(file, `"key" は "C"・"Eb"・"F#" のような音名にしてください（今は "${key}"）`)
  const scale = oneOf(file, "mode", d.mode, Object.keys(SCALES) as ScaleName[])
  const bars = num(file, "bars", d.bars ?? 64, 16, 256)
  if (bars % 4) fail(file, `"bars" は 4 の倍数にしてください（今は ${bars}）`)
  const chordList = (field: string, v: unknown): Chord[][] => {
    if (!Array.isArray(v) || !v.length) return fail(file, `"${field}" に1小節ずつ和音を並べてください`)
    return v.map((bar, i) => {
      const parts = String(bar).trim().split(/\s+/)
      if (parts.length < 1 || parts.length > 2) fail(file, `"${field}" の${i + 1}小節目は和音を1つか2つにしてください（今は "${bar}"）`)
      return parts.map((c) => parseChord(c, file))
    })
  }
  let chords: Chord[][]
  let score: Score | undefined
  const sections: { b?: Chord[][]; c?: Chord[][] } = {}
  if (kind === "score") {
    // a song written by hand: chords and melody, section by section
    score = {}
    for (const name of ["a", "b", "c"] as const) {
      const sec = d[name] as Record<string, unknown> | undefined
      if (!sec) {
        if (name === "a") fail(file, `楽譜の曲には少なくとも "a"（Aメロ）を書いてください`)
        continue
      }
      const ch = chordList(`${name}.chords`, sec.chords)
      const melody = Array.isArray(sec.melody) ? sec.melody.map((bar, i) => parseMelodyBar(String(bar), file, `${name}.melody の${i + 1}小節目`)) : undefined
      score[name] = { chords: ch, melody }
    }
    chords = score.a!.chords
  } else {
    chords = chordList("chords", d.chords)
    if (d.b) sections.b = chordList("b", d.b)
    if (d.c) sections.c = chordList("c", d.c)
  }
  const track: TrackSpec = {
    bpm: num(file, "bpm", d.bpm, 50, 180),
    tonic: tonicOf(NOTES[key]),
    scale,
    bars,
    groove: oneOf(file, "groove", d.groove, GROOVES),
    keys: oneOf(file, "keys", d.keys ?? "rhodes", ["pad", "rhodes", "piano", "guitar"] as const),
    style: oneOf(file, "style", d.style ?? "city", ["city", "lofi"] as const),
    leadOctave: num(file, "octave", d.octave ?? 0, -2, 2),
    lead: oneOf(file, "lead", d.lead, LEADS),
    texture: oneOf(file, "texture", d.texture ?? "none", TEXTURES),
    swing: num(file, "swing", d.swing ?? 0, 0, 0.4),
    seed: num(file, "seed", d.seed ?? 1, 0, 1e9),
    chords,
    form: oneOf(file, "form", d.form ?? (d.groove === "drift" ? "short" : "full"), ["full", "short"] as const),
    sections: Object.keys(sections).length ? sections : undefined,
    score,
  }
  // a chord song's length is its form: intro, verses, choruses, key change, outro
  track.bars = formBars(track)
  return { id, title, track, key, bpm: track.bpm }
}

/**
 * One bar of a written melody: 4, 8 or 16 slots, each a note ("Eb5", "C#4"),
 * "-" to hold the note before, or "." for a rest.
 */
export function parseMelodyBar(raw: string, file = "melody", where = "melody"): ScoreNote[] {
  const slots = raw.trim().split(/\s+/)
  if (![4, 8, 16].includes(slots.length)) return fail(file, `${where} は 4・8・16 個の区切りにしてください（今は ${slots.length} 個："${raw}"）`)
  const unit = 16 / slots.length
  const notes: ScoreNote[] = []
  slots.forEach((tok, i) => {
    if (tok === ".") return
    if (tok === "-") {
      if (notes.length && notes[notes.length - 1].step + notes[notes.length - 1].len === i * unit) notes[notes.length - 1].len += unit
      return
    }
    const m = /^([A-G][b#]?)(-?\d)$/.exec(tok)
    if (!m || !(m[1] in NOTES)) return fail(file, `${where} の "${tok}" が読めません。"Eb5" のような音名＋オクターブ、"-"（のばす）、"."（休み）で書いてください`)
    notes.push({ step: i * unit, len: unit, midi: NOTES[m[1]] + (Number(m[2]) + 1) * 12 })
  })
  return notes
}

/** Every song, from the parsed JSON of src/data/records/songs (file name without .json → contents). */
export function loadSongs(files: Record<string, unknown>): Map<string, Song> {
  const songs = new Map<string, Song>()
  for (const id of Object.keys(files).sort()) songs.set(id, parseSong(id, files[id], `src/data/records/songs/${id}.json`))
  return songs
}

export type LabelSpec = { art: LabelArt; colors: [string, string, string]; ink: string }

export type LakkanDisc = {
  id: string
  title: string
  kicker: string
  /** Written in phrases; a line only breaks between them. */
  lead: string[]
  credits: { label: string; value: string }[]
  song: Song
  label: LabelSpec
  stage: { bg: string; ink: string; accent: string }
  glow: string
}

const HEX = /^#[0-9a-f]{6}$/i

function color(file: string, field: string, v: unknown): string {
  if (typeof v === "string" && HEX.test(v)) return v
  return fail(file, `"${field}" は "#f4541a" のような6桁の色にしてください（今は ${JSON.stringify(v)}）`)
}

export function loadLakkanDiscs(raw: unknown, songs: Map<string, Song>): LakkanDisc[] {
  const file = "src/data/records/discs.json"
  if (!Array.isArray(raw) || !raw.length) return fail(file, "ディスクの一覧（配列）を書いてください")
  const seen = new Set<string>()
  return raw.map((d: Record<string, unknown>, i) => {
    const at = `${file} の${i + 1}枚目`
    const id = text(at, "id", d.id)
    if (seen.has(id)) fail(at, `"id" の "${id}" が重複しています`)
    seen.add(id)
    const songId = text(at, "song", d.song)
    const song = songs.get(songId) ?? fail(at, `曲 "${songId}" が src/data/records/songs にありません（あるのは ${[...songs.keys()].join(" / ")}）`)
    const lead = Array.isArray(d.lead) ? d.lead.map((p) => text(at, "lead", p)) : fail(at, `"lead" は文の区切りごとの配列にしてください`)
    const rows = Array.isArray(d.rows) ? d.rows : []
    const label = (d.label ?? {}) as Record<string, unknown>
    const stage = (d.stage ?? {}) as Record<string, unknown>
    const colors = Array.isArray(label.colors) && label.colors.length === 3 ? label.colors : fail(at, `"label.colors" は色を3つ（紙・模様・差し色）にしてください`)
    const sound = song.track ? `${song.key} ${song.track.scale[0].toUpperCase() + song.track.scale.slice(1)} · ${song.track.bpm} BPM` : [song.key, song.bpm ? song.bpm + " BPM" : ""].filter(Boolean).join(" · ") || "Recorded"
    return {
      id,
      title: text(at, "title", d.title),
      kicker: text(at, "kicker", d.kicker),
      lead,
      credits: [...rows.map((r: unknown) => ({ label: text(at, "rows", (r as string[])[0]), value: text(at, "rows", (r as string[])[1]) })), { label: "Sound", value: sound }],
      song,
      label: {
        art: oneOf(at, "label.art", label.art, ARTS),
        colors: colors.map((c: unknown, k: number) => color(at, `label.colors[${k}]`, c)) as [string, string, string],
        ink: color(at, "label.ink", label.ink),
      },
      stage: { bg: color(at, "stage.bg", stage.bg), ink: color(at, "stage.ink", stage.ink), accent: color(at, "stage.accent", stage.accent) },
      glow: color(at, "glow", d.glow),
    }
  })
}

/**
 * A disc ready for the carousel: the record face drawn, the song attached.
 * `print` reprints every label in one set of inks, keeping each disc's pattern.
 */
export function pressRecord(d: LakkanDisc, i: number, print?: Pick<VinylLabel, "colors" | "ink" | "face" | "mark" | "hideTitle">) {
  return {
    title: d.title,
    src: vinylFace({ title: d.title, sub: "SIDE A · 33⅓ RPM", mark: "LAKKAN", ...d.label, ...print }, i + 3),
    alt: d.title + " のレコード",
    label: "",
    fine: "",
    credits: d.credits,
    glow: d.glow,
    stage: d.stage,
    track: d.song.track,
    audio: d.song.audio,
    kicker: d.kicker,
    lead: d.lead,
  }
}
