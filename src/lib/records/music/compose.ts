/**
 * The songwriter. A record is a `TrackSpec` — tempo, key, chords, groove,
 * lead sound — and `composeBar` turns it into the notes of one bar. The same
 * spec and bar always give the same notes, so the engine can write the song
 * a bar at a time while it plays, and a test can read it back.
 *
 * Every song has the same shape: four bars of intro, the body, a four-bar
 * break in the middle with the drums out, and four bars of outro that thin
 * out to the pad alone.
 */

import { chordTones, degreeToMidi, mod, rng, type ScaleName } from "./theory"
import { composeSongBar, planSong, type Score } from "./song"

export type Groove = "drift" | "lofi" | "pulse" | "drive" | "bounce" | "city" | "shuffle"
export type LeadTone = "pluck" | "bell" | "glass" | "reed" | "vibes" | RecordedLead
/** Melody instruments played from recordings (public/samples); a synth stands in until they load. */
export type RecordedLead = "piano" | "vibraphone" | "kalimba" | "zither" | "sax"
export type Texture = "vinyl" | "waves" | "rain" | "none"

export type TrackSpec = {
  bpm: number
  /** MIDI note of the tonic around the third octave, where the pad sits (50 = D3). */
  tonic: number
  scale: ScaleName
  /** Scale degree of each bar's chord, 0 = the tonic chord, repeated through the song. */
  progression?: number[]
  /**
   * City-pop harmony instead: the chords of each bar (one, or two splitting the
   * bar), repeated through the song. Extended and borrowed chords, written as
   * semitones above the tonic, so the song can step outside the scale.
   */
  chords?: Chord[][]
  /** What plays the chords: a soft synth pad, an electric piano, or an upright piano. */
  keys?: "pad" | "rhodes" | "piano"
  /** The band's way of playing: city pop (the default), or lo-fi (laid back, muffled, no key change). */
  style?: "city" | "lofi"
  /** Octaves the written melody is moved, to sit where its instrument sounds best. */
  leadOctave?: number
  /** For chord songs: the whole song with a key change ("full", about three minutes) or one pass ("short"). */
  form?: "full" | "short"
  /** For chord songs: the pre-chorus and chorus chords. Left out, they're chosen from a small library. */
  sections?: { b?: Chord[][]; c?: Chord[][] }
  /** For chord songs: anything written by hand, chords and melody, section by section. */
  score?: Score
  groove: Groove
  lead: LeadTone
  texture: Texture
  /** Length in bars, a multiple of four and at least 16. */
  bars: number
  seed: number
  /** Delay of every other 16th, as a fraction of a 16th. */
  swing?: number
}

/** Chord colours, as semitones above the root. */
export const QUALITIES = {
  maj7: [0, 4, 7, 11],
  maj9: [0, 4, 7, 11, 14],
  "maj7#11": [0, 4, 7, 11, 18],
  "6/9": [0, 4, 7, 9, 14],
  m7: [0, 3, 7, 10],
  m9: [0, 3, 7, 10, 14],
  m11: [0, 3, 7, 10, 14, 17],
  m6: [0, 3, 7, 9],
  "7": [0, 4, 7, 10],
  "9": [0, 4, 7, 10, 14],
  "13": [0, 4, 10, 14, 21],
  "7b9": [0, 4, 7, 10, 13],
  "7#9": [0, 4, 7, 10, 15],
  "7#11": [0, 4, 10, 14, 18],
  "9sus": [0, 5, 7, 10, 14],
  m7b5: [0, 3, 6, 10],
} as const satisfies Record<string, readonly number[]>

export type Quality = keyof typeof QUALITIES

/** A chord: its root as semitones above the key's tonic, its colour, and optionally another bass note. */
export type Chord = { root: number; q: Quality; bass?: number }

export type Voice = "pad" | "keys" | "bass" | "lead" | "kick" | "snare" | "rim" | "hat" | "shaker" | "strings" | "gtr" | "brass" | "tom" | "crash" | "ohat"
export type NoteEvent = { voice: Voice; step: number; len: number; midi: number; vel: number }
export type Section = "intro" | "body" | "break" | "outro"

export const STEPS = 16

export const stepSeconds = (spec: TrackSpec) => 60 / spec.bpm / 4
export const barSeconds = (spec: TrackSpec) => stepSeconds(spec) * STEPS
export const durationOf = (spec: TrackSpec) => barSeconds(spec) * spec.bars

export function sectionOf(bar: number, bars: number): Section {
  if (bar < 4) return "intro"
  if (bar >= bars - 4) return "outro"
  const mid = Math.floor(bars / 8) * 4
  if (bar >= mid && bar < mid + 4) return "break"
  return "body"
}

export const chordDegreeAt = (spec: TrackSpec, bar: number) => {
  const p = spec.progression?.length ? spec.progression : [0]
  return p[mod(bar, p.length)]
}

type Hit = [step: number, vel: number]
type DrumVoice = "kick" | "snare" | "rim" | "hat" | "shaker"

const sixteenths = (accents: number[]): Hit[] => Array.from({ length: STEPS }, (_, s) => [s, accents[s % accents.length]])

const KIT: Record<Groove, Partial<Record<DrumVoice, Hit[]>>> = {
  drift: { shaker: [[4, 0.35], [12, 0.3]] },
  lofi: {
    kick: [[0, 1], [7, 0.5], [10, 0.8]],
    snare: [[4, 0.75], [12, 0.8]],
    hat: [[0, 0.5], [2, 0.3], [4, 0.45], [6, 0.3], [8, 0.5], [10, 0.3], [12, 0.45], [14, 0.35]],
  },
  pulse: {
    kick: [[0, 0.9], [4, 0.75], [8, 0.9], [12, 0.75]],
    snare: [[4, 0.45], [12, 0.5]],
    hat: [[2, 0.45], [6, 0.4], [10, 0.45], [14, 0.4]],
    shaker: sixteenths([0.18, 0.1]),
  },
  drive: {
    kick: [[0, 1], [8, 0.9], [10, 0.55]],
    snare: [[4, 0.8], [12, 0.8]],
    hat: sixteenths([0.4, 0.18]),
  },
  bounce: {
    kick: [[0, 1], [3, 0.65], [10, 0.85]],
    snare: [[4, 0.85], [7, 0.16], [12, 0.9], [15, 0.2]],
    hat: sixteenths([0.34, 0.16, 0.26, 0.16]),
  },
  // laid back: cross-stick on the backbeat, ghost notes between, a soft kick that skips
  city: {
    kick: [[0, 0.95], [7, 0.3], [10, 0.75]],
    rim: [[4, 0.72], [12, 0.78]],
    snare: [[3, 0.1], [11, 0.12], [15, 0.14]],
    hat: sixteenths([0.34, 0.11, 0.22, 0.11]),
  },
  shuffle: {
    kick: [[0, 1], [6, 0.4], [10, 0.8]],
    snare: [[4, 0.78], [7, 0.12], [12, 0.82], [15, 0.16]],
    hat: sixteenths([0.36, 0.1, 0.25, 0.1]),
  },
}

/** Bass lines: step, length in steps, scale degrees above the chord root (7 = octave), velocity. */
const BASS: Record<Groove, [step: number, len: number, above: number, vel: number][]> = {
  drift: [[0, 16, 0, 0.55]],
  lofi: [[0, 6, 0, 0.8], [7, 2, 4, 0.55], [10, 5, 0, 0.7]],
  pulse: [[0, 3, 0, 0.8], [4, 3, 0, 0.6], [8, 3, 0, 0.8], [12, 2, 0, 0.6], [14, 2, 7, 0.5]],
  drive: [[0, 2, 0, 0.8], [2, 2, 0, 0.5], [4, 2, 0, 0.7], [6, 2, 0, 0.5], [8, 2, 0, 0.8], [10, 2, 4, 0.55], [12, 2, 0, 0.7], [14, 2, 7, 0.5]],
  bounce: [[0, 2, 0, 0.9], [3, 1, 7, 0.6], [6, 2, 0, 0.75], [10, 2, 4, 0.7], [12, 1, 0, 0.55], [14, 2, 7, 0.6]],
  city: [[0, 3, 0, 0.85], [6, 2, 4, 0.55], [10, 3, 0, 0.7], [14, 2, 7, 0.5]],
  shuffle: [[0, 2, 0, 0.9], [3, 1, 0, 0.45], [6, 2, 4, 0.65], [10, 2, 0, 0.75], [14, 2, 7, 0.55]],
}

const DENSITY: Record<Groove, number> = { drift: 0.16, lofi: 0.26, pulse: 0.3, drive: 0.34, bounce: 0.32, city: 0.28, shuffle: 0.3 }

export type MotifNote = { step: number; tone: number; len: number }

/**
 * The hook: two bars of melody as scale steps above whatever chord is under
 * it. A random walk that lands on chord tones on the beat, so it always fits.
 */
export function motifOf(spec: TrackSpec): MotifNote[] {
  const r = rng(spec.seed * 4099 + 11)
  const d = DENSITY[spec.groove]
  let notes: MotifNote[] = []
  let tone = 4
  for (let s = 0; s < STEPS * 2; s++) {
    const p = s % 4 === 0 ? d * 1.6 : s % 2 === 0 ? d : d * 0.45
    if (r() >= p) continue
    tone += Math.round((r() - 0.5) * 4)
    if (s % 4 === 0 && tone % 2) tone += r() < 0.5 ? -1 : 1
    tone = Math.max(0, Math.min(9, tone))
    notes.push({ step: s, tone, len: 1 })
  }
  if (notes.length < 4) notes = [0, 8, 16, 24].map((step, k) => ({ step, tone: [4, 2, 6, 4][k], len: 1 }))
  notes.forEach((n, k) => {
    const next = k + 1 < notes.length ? notes[k + 1].step : STEPS * 2
    n.len = Math.max(1, Math.min(next - n.step, 6))
  })
  return notes
}

/** Lowest note of the melody: plucks and reeds an octave over the pad, bells and glass two, unless that's too high. */
export function leadFloor(spec: TrackSpec): number {
  const want = spec.tonic + (spec.lead === "bell" || spec.lead === "glass" ? 24 : 12)
  return want > 76 ? want - 12 : want
}

/** The melody keeps within a twelfth above its floor, folding by octaves so it stays in key. */
const LEAD_SPAN = 19

function fold(midi: number, lo: number, hi: number): number {
  while (midi > hi) midi -= 12
  while (midi < lo) midi += 12
  return midi
}

export function composeBar(spec: TrackSpec, bar: number, motif: MotifNote[] = motifOf(spec)): NoteEvent[] {
  if (spec.chords?.length || spec.score) return composeSongBar(spec, bar)
  const out: NoteEvent[] = []
  if (bar < 0 || bar >= spec.bars) return out
  const sec = sectionOf(bar, spec.bars)
  const deg = chordDegreeAt(spec, bar)
  const r = rng(spec.seed * 7919 + bar * 104729)
  const last = spec.bars - 1

  for (const m of chordTones(spec.tonic, spec.scale, deg))
    out.push({ voice: "pad", step: 0, len: STEPS, midi: m, vel: sec === "break" ? 0.75 : bar === last ? 0.45 : 0.6 })

  const bassTonic = spec.tonic - 12
  if (sec === "body" || (sec === "intro" && bar >= 2)) {
    for (const [step, len, above, vel] of BASS[spec.groove])
      out.push({ voice: "bass", step, len, midi: degreeToMidi(bassTonic, spec.scale, deg + above), vel })
  } else if (sec === "break" || (sec === "outro" && bar < last - 1)) {
    out.push({ voice: "bass", step: 0, len: STEPS, midi: degreeToMidi(bassTonic, spec.scale, deg), vel: 0.5 })
  }

  drums(out, spec, bar, sec, r)

  if (sec === "body" || sec === "break") {
    const half = (bar % 2) * STEPS
    const answer = Math.floor(bar / 8) % 2 === 1
    const lo = leadFloor(spec)
    for (const n of motif) {
      if (n.step < half || n.step >= half + STEPS) continue
      if (sec === "break" && n.step % 4 !== 0) continue
      // every other phrase answers the hook a chord tone higher or lower
      const tone = answer && r() < 0.35 ? Math.max(0, n.tone + (r() < 0.5 ? -2 : 2)) : n.tone
      out.push({ voice: "lead", step: n.step - half, len: n.len, midi: fold(degreeToMidi(lo, spec.scale, deg + tone), lo, lo + LEAD_SPAN), vel: sec === "break" ? 0.6 : 0.8 })
    }
  }
  return out
}

/** The kit, and a fill to close every eight-bar phrase. */
function drums(out: NoteEvent[], spec: TrackSpec, bar: number, sec: Section, r: () => number) {
  const last = spec.bars - 1
  const kit = KIT[spec.groove]
  const quiet = (sec === "intro" && bar >= 2) || (sec === "outro" && bar < last - 1)
  for (const voice of ["kick", "snare", "rim", "hat", "shaker"] as DrumVoice[]) {
    if (sec !== "body" && !(quiet && (voice === "hat" || voice === "shaker"))) continue
    for (const [step, vel] of kit[voice] ?? [])
      out.push({ voice, step, len: 1, midi: 0, vel: vel * (quiet ? 0.6 : 1) * (0.9 + r() * 0.2) })
  }
  if (sec === "body" && bar % 8 === 7 && spec.groove !== "drift") {
    out.push({ voice: "snare", step: 14, len: 1, midi: 0, vel: 0.45 }, { voice: "snare", step: 15, len: 1, midi: 0, vel: 0.65 })
  }
}

// ---- city-pop harmony --------------------------------------------------------------------

/** The chords of a bar and where each starts: one for the whole bar, or two halves. */
export function chordsOfBar(spec: TrackSpec, bar: number): { chord: Chord; from: number; to: number }[] {
  if (spec.chords?.length || spec.score) return planSong(spec)[bar]?.chords ?? []
  const all = spec.chords ?? []
  const cs = all.length ? all[mod(bar, all.length)] : []
  if (cs.length <= 1) return cs.map((chord) => ({ chord, from: 0, to: STEPS }))
  const half = STEPS / 2
  return cs.slice(0, 2).map((chord, k) => ({ chord, from: k * half, to: (k + 1) * half }))
}

/** The chord sounding at a 16th of a bar. */
export function chordAt(spec: TrackSpec, bar: number, step: number): Chord {
  const segs = chordsOfBar(spec, bar)
  return (segs.find((s) => step >= s.from && step < s.to) ?? segs[0]).chord
}

/** The key a bar is in: the last chorus of a song may sit a half step up. */
export const tonicAt = (spec: TrackSpec, bar: number) => spec.tonic + (spec.chords?.length || spec.score ? (planSong(spec)[bar]?.shift ?? 0) : 0)

/** Pitch classes of a chord, 0-11, bass note included. */
export function chordClasses(tonic: number, c: Chord): Set<number> {
  const set = new Set(QUALITIES[c.q].map((i) => mod(tonic + c.root + i, 12)))
  if (c.bass != null) set.add(mod(tonic + c.bass, 12))
  return set
}

/**
 * An electric-piano voicing: no root (the bass has it), every other tone inside
 * one octave around the middle of the keyboard. Chords voiced in the same
 * window move by the smallest steps from one to the next.
 */
export function voicing(tonic: number, c: Chord): number[] {
  const tones = QUALITIES[c.q].filter((i) => i !== 0).slice(0, 4)
  const lo = tonic + 7
  return [...new Set(tones.map((i) => fold(tonic + c.root + i, lo, lo + 11)))].sort((a, b) => a - b)
}

