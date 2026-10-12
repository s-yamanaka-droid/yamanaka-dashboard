/**
 * The arranger. Turns a chord-based TrackSpec into a whole song, the way a
 * city-pop record is laid out:
 *
 *   intro · A · B · chorus · interlude · A · B · chorus · chorus a half step up · outro
 *
 * Each section has its own chords (A from the spec, B and the chorus from the
 * spec or from a small library of pre-chorus and chorus progressions), the
 * chords are voiced so each moves the shortest way to the next, and each
 * section gets one melody, written once and played again when the section
 * comes back, so the song has something to remember. A score (written by
 * hand) can replace any of it; what isn't written is composed.
 *
 * Everything is a pure function of the spec, planned once and cached.
 */

import { chordClasses, isJazz, leadFloor, QUALITIES, STEPS, type Chord, type NoteEvent, type TrackSpec, type Voice } from "./compose"
import { mod, rng, SCALES } from "./theory"

export type SectionName = "intro" | "a" | "b" | "c" | "inter" | "outro"
export type Slot = { name: SectionName; bars: number; shift: number }

/** A note written in a score: where it starts and how long it lasts, in 16ths of its bar. */
export type ScoreNote = { step: number; len: number; midi: number }
export type ScoreSection = { chords: Chord[][]; melody?: ScoreNote[][] }
export type Score = Partial<Record<"a" | "b" | "c", ScoreSection>>

export type BarPlan = {
  section: SectionName
  /** Bar within its section, from 0. */
  at: number
  /** How many bars the section has. */
  of: number
  /** Which occurrence of this section, from 0: the second A plays the A melody again. */
  pass: number
  /** Semitones the whole bar is raised: the last chorus goes up a half step. */
  shift: number
  chords: { chord: Chord; from: number; to: number }[]
  voicings: number[][]
  melody: ScoreNote[]
}

const c = (root: number, q: Chord["q"], bass?: number): Chord => (bass == null ? { root, q } : { root, q, bass })

// Pre-chorus progressions: lift away from the verse and land on the dominant.
const B_LIB: Chord[][][] = [
  [[c(5, "maj7")], [c(4, "m7")], [c(2, "m9")], [c(0, "maj7", 4)], [c(5, "maj7")], [c(4, "m7"), c(9, "7b9")], [c(2, "m9")], [c(7, "9sus"), c(7, "13")]],
  [[c(9, "m9")], [c(8, "maj7#11")], [c(7, "9sus")], [c(0, "maj9")], [c(9, "m9")], [c(2, "9")], [c(5, "maj7"), c(5, "m6")], [c(7, "9sus"), c(7, "13")]],
  [[c(3, "maj7")], [c(2, "m7")], [c(5, "maj7")], [c(4, "m7"), c(9, "7b9")], [c(2, "m9")], [c(1, "7#11")], [c(5, "m6")], [c(7, "13")]],
]

// Choruses: open, warm, and back home by the end.
const C_LIB: Chord[][][] = [
  [[c(5, "maj9")], [c(7, "13")], [c(4, "m7"), c(9, "7b9")], [c(2, "m9")], [c(5, "maj9")], [c(7, "13")], [c(0, "maj9"), c(9, "7b9")], [c(2, "m9"), c(7, "13")]],
  [[c(0, "maj9")], [c(4, "m7"), c(9, "7b9")], [c(2, "m9")], [c(5, "m6")], [c(0, "maj9")], [c(10, "9")], [c(5, "maj7"), c(7, "13")], [c(0, "6/9")]],
  [[c(5, "maj7")], [c(0, "maj7", 7)], [c(9, "m9")], [c(4, "m7")], [c(2, "m9")], [c(7, "9sus")], [c(0, "maj9")], [c(0, "maj9")]],
]

// Two-bar rhythms for the melody, [step, length] in 16ths across 32 steps.
const RHYTHM: Record<"a" | "b" | "c", [number, number][][]> = {
  a: [
    [[2, 2], [4, 2], [6, 4], [12, 2], [14, 4], [20, 2], [22, 2], [24, 6]],
    [[0, 3], [3, 1], [4, 4], [10, 2], [12, 4], [18, 2], [20, 2], [22, 6]],
    [[1, 1], [2, 2], [4, 2], [7, 3], [10, 6], [18, 2], [20, 4], [26, 4]],
  ],
  b: [
    [[0, 2], [2, 2], [4, 2], [6, 2], [8, 4], [14, 2], [16, 2], [18, 2], [20, 2], [22, 6]],
    [[0, 4], [4, 2], [6, 2], [8, 8], [18, 2], [20, 2], [22, 2], [24, 6]],
  ],
  c: [
    [[0, 4], [4, 2], [6, 2], [8, 6], [16, 4], [20, 2], [22, 2], [24, 8]],
    [[0, 6], [6, 2], [8, 4], [12, 4], [16, 6], [22, 2], [24, 8]],
    [[2, 2], [4, 6], [10, 2], [12, 4], [18, 2], [20, 4], [24, 8]],
  ],
}
// the fourth phrase breathes out: a few notes, one long one, then rest
const CADENCE: [number, number][] = [[0, 2], [2, 2], [4, 4], [8, 8]]

export function formOf(spec: TrackSpec): Slot[] {
  const short = (spec.form ?? (spec.groove === "drift" ? "short" : "full")) === "short"
  const s = (name: SectionName, bars: number, shift = 0): Slot => ({ name, bars, shift })
  // lo-fi loops round instead of climbing: the hook twice, a bridge between, no key change
  if (spec.style === "lofi")
    return short
      ? [s("intro", 4), s("a", 8), s("c", 8), s("outro", 4)]
      : [s("intro", 4), s("a", 8), s("c", 8), s("a", 8), s("b", 8), s("c", 8), s("outro", 4)]
  return short
    ? [s("intro", 4), s("a", 8), s("b", 8), s("c", 8), s("outro", 4)]
    : [s("intro", 4), s("a", 8), s("b", 8), s("c", 8), s("inter", 4), s("a", 8), s("b", 8), s("c", 8), s("c", 8, 1), s("outro", 4)]
}

export const formBars = (spec: TrackSpec) => formOf(spec).reduce((n, s) => n + s.bars, 0)

function sectionChords(spec: TrackSpec, name: SectionName): Chord[][] {
  const a = spec.score?.a?.chords ?? spec.chords ?? [[c(0, "maj7")]]
  const b = spec.score?.b?.chords ?? spec.sections?.b ?? B_LIB[spec.seed % B_LIB.length]
  const ch = spec.score?.c?.chords ?? spec.sections?.c ?? C_LIB[Math.floor(spec.seed / 3) % C_LIB.length]
  if (name === "a" || name === "intro") return a
  if (name === "b") return b
  if (name === "c") return ch
  if (name === "inter") return ch.slice(Math.max(0, ch.length - 4))
  return [a[0], a[1 % a.length], [c(0, "maj9")], [c(0, "6/9")]]
}

function segments(bar: Chord[]): { chord: Chord; from: number; to: number }[] {
  if (bar.length <= 1) return bar.map((chord) => ({ chord, from: 0, to: STEPS }))
  return bar.slice(0, 2).map((chord, k) => ({ chord, from: k * 8, to: (k + 1) * 8 }))
}

/** Chord tones above the root, without the root itself, at most four. */
const upper = (ch: Chord) => QUALITIES[ch.q].filter((i) => i !== 0).slice(0, 4)

/**
 * Voice a chord as close as possible to the last one: every arrangement of
 * its tones inside the keyboard window is tried, and the one that moves the
 * fewest semitones (and stays within an octave and a bit) wins.
 */
export function voiceLead(tonic: number, ch: Chord, prev: number[] | null): number[] {
  const lo = tonic + 4
  const hi = tonic + 21
  const options = upper(ch).map((i) => {
    const pc = mod(tonic + ch.root + i, 12)
    const out: number[] = []
    for (let m = lo; m <= hi; m++) if (mod(m, 12) === pc) out.push(m)
    return out
  })
  let best: number[] = []
  let bestCost = Infinity
  const pick = (k: number, acc: number[]) => {
    if (k === options.length) {
      const v = [...acc].sort((x, y) => x - y)
      const span = v[v.length - 1] - v[0]
      if (new Set(v).size < v.length) return
      let cost = span > 14 ? (span - 14) * 4 : 0
      if (prev) {
        const n = Math.min(v.length, prev.length)
        for (let i = 0; i < n; i++) cost += Math.abs(v[i] - prev[i])
        cost += Math.abs(v.length - prev.length) * 3
      } else cost += Math.abs(v.reduce((s, x) => s + x, 0) / v.length - (tonic + 12)) * 2
      if (cost < bestCost) {
        bestCost = cost
        best = v
      }
      return
    }
    for (const m of options[k]) pick(k + 1, [...acc, m])
  }
  pick(0, [])
  return best
}

/** The pitches a melody note may take: chord tones (with their colour notes), and on weak beats the key's scale too. */
function allowed(tonic: number, spec: TrackSpec, ch: Chord, strong: boolean): Set<number> {
  const set = chordClasses(tonic, ch)
  if (!strong) for (const i of SCALES[spec.scale]) set.add(mod(tonic + i, 12))
  return set
}

function nearest(target: number, ok: Set<number>, lo: number, hi: number): number {
  for (let d = 0; d <= 12; d++) {
    for (const m of [target + d, target - d]) if (m >= lo && m <= hi && ok.has(mod(m, 12))) return m
  }
  return Math.max(lo, Math.min(hi, target))
}

/**
 * One section's melody, eight bars as four two-bar phrases: a motif, its
 * answer a step away, the motif again (higher in the chorus), and a cadence
 * that settles on a long chord tone and leaves the last bar to breathe.
 */
function writeMelody(spec: TrackSpec, name: "a" | "b" | "c", chords: Chord[][], bars: number): ScoreNote[][] {
  const r = rng(spec.seed * 613 + name.charCodeAt(0) * 31)
  const lo = leadFloor(spec)
  const hi = lo + 19
  const scale = SCALES[spec.scale]
  const rhythms = RHYTHM[name]
  const rhythm = rhythms[Math.floor(r() * rhythms.length)]
  // the motif's shape, in scale steps, shared by every phrase of the section
  let step = 0
  const shape = rhythm.map(() => {
    step = Math.max(-3, Math.min(4, step + Math.round((r() - 0.45) * 3)))
    return step
  })
  const anchor = name === "c" ? 9 : name === "b" ? 6 : 4
  const out: ScoreNote[][] = Array.from({ length: bars }, () => [])
  for (let p = 0; p < Math.ceil(bars / 2); p++) {
    const last = p === Math.ceil(bars / 2) - 1
    const rh = last ? CADENCE : rhythm
    const lift = p === 1 ? (r() < 0.5 ? -1 : 1) : p === 2 && name === "c" ? 2 : 0
    rh.forEach(([st, len], k) => {
      const bar = p * 2 + Math.floor(st / STEPS)
      if (bar >= bars) return
      const s = st % STEPS
      const segs = segments(chords[bar % chords.length])
      const ch = (segs.find((g) => s >= g.from && s < g.to) ?? segs[0]).chord
      const deg = anchor + lift + (last ? Math.max(-2, 2 - k) : shape[k % shape.length])
      const target = spec.tonic + 12 + 12 * Math.floor(deg / 7) + scale[mod(deg, 7)]
      const strong = s % 4 === 0 || len >= 4
      const midi = nearest(target, allowed(spec.tonic, spec, ch, strong), lo, hi)
      out[bar].push({ step: s, len: Math.min(len, STEPS - s), midi })
    })
  }
  return out
}

/**
 * Anticipate some on-the-beat notes by an eighth, the way a player phrases a
 * tune the second time: only into silence, and never across a chord change.
 */
function displace(notes: ScoreNote[], segs: { from: number; to: number }[], r: () => number): ScoreNote[] {
  const out = notes.map((n) => ({ ...n }))
  for (const n of out) {
    if (n.step === 0 || n.step % 4 !== 0 || r() >= 0.45) continue
    const at = n.step - 2
    const same = segs.find((g) => n.step >= g.from && n.step < g.to)
    if (!same || at < same.from) continue
    if (out.some((m) => m !== n && m.step < n.step && m.step + m.len > at)) continue
    n.step = at
    n.len += 2
  }
  return out
}

const plans = new WeakMap<TrackSpec, BarPlan[]>()

export function planSong(spec: TrackSpec): BarPlan[] {
  const cached = plans.get(spec)
  if (cached) return cached
  const melodies = new Map<string, ScoreNote[][]>()
  const melodyFor = (name: "a" | "b" | "c", bars: number) => {
    let m = melodies.get(name)
    if (!m) {
      const written = spec.score?.[name]?.melody
      m = written && written.length ? written : writeMelody(spec, name, sectionChords(spec, name), bars)
      melodies.set(name, m)
    }
    return m
  }
  const passes: Record<string, number> = {}
  const out: BarPlan[] = []
  let prev: number[] | null = null
  for (const slot of formOf(spec)) {
    const pass = (passes[slot.name] = (passes[slot.name] ?? -1) + 1)
    const chords = sectionChords(spec, slot.name)
    const tune = slot.name === "a" || slot.name === "b" || slot.name === "c" ? melodyFor(slot.name, slot.bars) : null
    for (let at = 0; at < slot.bars; at++) {
      const segs = segments(chords[at % chords.length])
      const tonic = spec.tonic + slot.shift
      const voicings = segs.map((g) => (prev = voiceLead(tonic, g.chord, prev)))
      let melody = (tune?.[at % tune.length] ?? []).map((n) => ({ ...n, midi: n.midi + slot.shift + 12 * (spec.leadOctave ?? 0) }))
      // jazz: when a tune comes round again, some of its notes arrive an eighth early
      if (spec.style === "lofi" && isJazz(spec.groove) && pass > 0) melody = displace(melody, segs, rng(spec.seed * 389 + out.length * 7))
      out.push({ section: slot.name, at, of: slot.bars, pass, shift: slot.shift, chords: segs, voicings, melody })
    }
  }
  plans.set(spec, out)
  return out
}

// ---- the band, section by section ------------------------------------------------------

type Hit = [step: number, vel: number]
const hats = (accents: number[]): Hit[] => Array.from({ length: STEPS }, (_, s) => [s, accents[s % accents.length]])

const fold = (m: number, lo: number, hi: number) => {
  while (m > hi) m -= 12
  while (m < lo) m += 12
  return m
}

const same = (x: Chord, y: Chord) => x.root === y.root && x.q === y.q && x.bass === y.bass

/** The chord's fifth if it has one, otherwise its nearest colour, as semitones above the root. */
function fifthOf(ch: Chord): number {
  const q: readonly number[] = QUALITIES[ch.q]
  return q.includes(7) ? 7 : (q.find((i) => i === 6 || i === 8) ?? q[1])
}

/**
 * Whether the band jumps the chord change into the next bar an eighth early,
 * the push that makes city pop lean forward. Only inside a verse or chorus,
 * never onto a section's first bar (that belongs to the crash), and only
 * when the chord actually changes.
 */
export function anticipates(spec: TrackSpec, plan: BarPlan[], bar: number): boolean {
  const b = plan[bar]
  const n = plan[bar + 1]
  if (!b || !n || spec.groove === "drift" || spec.style === "lofi" || n.at === 0 || n.section !== b.section) return false
  if (b.section !== "a" && b.section !== "c") return false
  if (same(b.chords[b.chords.length - 1].chord, n.chords[0].chord)) return false
  return rng(spec.seed * 31 + bar * 977)() < (b.section === "c" ? 0.6 : 0.45)
}

/** Every note of one bar of a planned song. */
export function composeSongBar(spec: TrackSpec, bar: number): NoteEvent[] {
  const plan = planSong(spec)
  const b = plan[bar]
  if (!b) return []
  const out: NoteEvent[] = []
  const r = rng(spec.seed * 7919 + bar * 104729)
  const push = (voice: Voice, step: number, len: number, midi: number, vel: number) => out.push({ voice, step, len, midi, vel })
  const tonic = spec.tonic + b.shift
  const sec = b.section
  const lastBar = bar === plan.length - 1
  const endOfSection = b.at === b.of - 1
  const nextFirst = plan[bar + 1]
  const drift = spec.groove === "drift"
  const keysVoice: Voice = spec.keys === "pad" ? "pad" : "keys"
  const odd = b.at % 2 === 1
  // the next bar's first chord, played early from the "and" of four
  const ahead = anticipates(spec, plan, bar)
  // this bar's first chord already sounded at the end of the last one
  const landed = bar > 0 && anticipates(spec, plan, bar - 1)
  const finalChorus = sec === "c" && b.shift > 0
  // lo-fi: laid back, nothing pushed early, no horns or guitar, a boom-bap kit
  const lofi = spec.style === "lofi"
  // lo-fi jazz: a swung ride or a bossa or a ballad, walking bass, comping that answers back
  const jazz = lofi && isJazz(spec.groove)

  // keys: every chord voiced close to the last; in the verse and chorus they comp, and push into the next bar
  const comp = keysVoice === "keys" && (sec === "a" || sec === "c")
  b.chords.forEach((g, k) => {
    const vel = lastBar ? 0.42 : sec === "intro" || sec === "outro" ? 0.55 : sec === "c" ? 0.62 : 0.58
    const end = ahead && k === b.chords.length - 1 ? 14 : g.to
    const hits: [number, number][] = []
    if (!(landed && k === 0)) hits.push([g.from, 1])
    if (jazz && sec !== "intro" && sec !== "outro" && !lastBar) {
      // comping: short chords off the beat, a different figure each bar
      hits.length = 0
      const span = g.to - g.from
      const figs: [number, number][][] =
        spec.groove === "bossa"
          ? [[[0, 0.75], [6, 0.6], [10, 0.6], [14, 0.5]], [[0, 0.75], [3, 0.45], [6, 0.6], [12, 0.55]]]
          : spec.groove === "ballad"
            ? [[[0, 0.7]], [[0, 0.7], [10, 0.4]]]
            : span < STEPS
              ? [[[0, 0.75], [6, 0.55]], [[2, 0.6]], [[0, 0.7], [4, 0.45]]]
              : [[[0, 0.8], [6, 0.6]], [[2, 0.6], [10, 0.7]], [[0, 0.75], [10, 0.5]], [[4, 0.6], [12, 0.65]], [[6, 0.7], [14, 0.55]]]
      const fig = figs[Math.floor(r() * figs.length)]
      for (const [st, v] of fig) if (g.from + st < g.to && !(landed && k === 0 && st === 0)) hits.push([g.from + st, v])
    } else if (lofi) {
      // a chord held from the downbeat, struck again softly on the "and" of three every other bar
      if (keysVoice === "keys" && odd && g.to - g.from === STEPS && sec !== "intro" && sec !== "outro") hits.push([10, 0.5])
    } else if (comp && g.to - g.from === STEPS) {
      if (sec === "c") hits.push([6, 0.5], [10, 0.7])
      else if (odd) hits.push([6, 0.45], [10, 0.6])
      else hits.push([10, 0.55])
    }
    hits.forEach(([st, v], i) => {
      const until = i + 1 < hits.length ? hits[i + 1][0] : end
      // jazz chords are short, so the space between them is heard
      const len = jazz && spec.groove !== "ballad" && sec !== "intro" && sec !== "outro" ? Math.min(until - st, 3) : until - st
      if (len > 0) for (const m of b.voicings[k]) push(keysVoice, st, len, m, vel * v)
    })
  })
  // jazz: now and then the comping jumps the next bar's chord on the "and" of four
  if (jazz && spec.groove !== "ballad" && !ahead && nextFirst && nextFirst.section === sec && sec !== "intro" && sec !== "outro"
      && !same(b.chords[b.chords.length - 1].chord, nextFirst.chords[0].chord) && r() < 0.3 && !out.some((n) => n.voice === "keys" && n.step + n.len > 14)) {
    for (const m of nextFirst.voicings[0]) push(keysVoice, 14, 2, m, 0.5)
  }
  if (ahead && nextFirst) {
    // held until the next bar strikes again
    const first = nextFirst.chords[0]
    const until = first.to - first.from < STEPS ? first.to : sec === "c" || nextFirst.at % 2 === 1 ? 6 : 10
    for (const m of nextFirst.voicings[0]) push(keysVoice, 14, 2 + until, m, 0.6)
  }

  // a little answer on the electric piano, high up, where the tune stops to breathe
  if (keysVoice === "keys" && (sec === "a" || sec === "c") && b.melody.length && !b.melody.some((n) => n.step + n.len > 8)) {
    const g = b.chords[b.chords.length - 1]
    const top = Math.max(...b.voicings[b.chords.length - 1]) + 12
    const tones = [...chordClasses(tonic, g.chord)]
    const notes: number[] = []
    for (let m = top; m > top - 12 && notes.length < 3; m--) if (tones.includes(mod(m, 12))) notes.push(m)
    const at = ahead ? [8, 10, 12] : [9, 11, 13]
    notes.forEach((m, i) => at[i] >= g.from && push("keys", at[i], 2, m, 0.36 - i * 0.04))
  }

  // bass: two-bar phrases, busier in the chorus, and it jumps the change with the keys
  b.chords.forEach((g, k) => {
    const root = fold(tonic - 12 + (g.chord.bass ?? g.chord.root), 36, 47)
    // the chord's fifth (not the bass note's, which differs under a slash chord), above the bass
    const fifth = fold(tonic - 12 + g.chord.root + fifthOf(g.chord), root + 1, root + 12)
    const nextChord = k + 1 < b.chords.length ? b.chords[k + 1].chord : nextFirst?.chords[0].chord
    const target = nextChord ? fold(tonic - 12 + (nextChord.bass ?? nextChord.root), 36, 47) : root
    const lastSeg = k === b.chords.length - 1
    const lead = (at: number) => {
      if (lastSeg && ahead) push("bass", 14, 4, target, 0.8)
      else push("bass", at, 2, target !== root ? target + (r() < 0.5 ? -1 : 1) : fifth, 0.55)
    }
    const down = (len: number, vel: number) => !(landed && k === 0) && push("bass", g.from, len, root, vel)
    const span = g.to - g.from
    if (sec === "intro" || sec === "outro" || drift) {
      if (!(sec === "intro" && b.at < 2) && !lastBar) push("bass", g.from, span, root, 0.5)
    } else if (jazz && spec.groove === "swing") {
      // walking: a note on every beat, chord tones in between, and a half step into the next chord
      const tones = QUALITIES[g.chord.q].filter((i) => i !== 0 && i < 12).map((i) => fold(tonic - 12 + g.chord.root + i, root - 2, root + 11))
      const beats = Array.from({ length: span / 4 }, (_, j) => g.from + j * 4)
      let prevNote = root
      beats.forEach((st, j) => {
        let m: number
        if (j === 0) m = root
        else if (j === beats.length - 1) m = fold(target + (r() < 0.5 ? -1 : 1), 36, 50)
        else {
          const pick = tones.filter((x) => x !== prevNote)
          m = pick.length ? pick.reduce((a, x) => (Math.abs(x - prevNote) < Math.abs(a - prevNote) ? x : a)) : root + 12
          if (r() < 0.3 && tones.length) m = tones[Math.floor(r() * tones.length)]
        }
        push("bass", st, 4, fold(m, 36, 50), j === 0 ? 0.82 : 0.66 + r() * 0.08)
        prevNote = m
      })
    } else if (jazz && spec.groove === "bossa") {
      // bossa: the root on one, the fifth on three, each anticipated by its pickup
      down(5, 0.8)
      if (span === STEPS) {
        push("bass", 6, 2, fifth, 0.5)
        push("bass", 8, 5, fifth, 0.7)
      }
      if (lastSeg) lead(14)
    } else if (jazz) {
      // ballad: long notes, a little movement at the end of the bar
      down(span === STEPS ? 8 : span - 1, 0.7)
      if (span === STEPS) push("bass", 8, 6, fifth, 0.55)
      if (lastSeg) lead(14)
    } else if (lofi) {
      // round and patient, following the kick: a long root, a pickup, the root again
      if (span < STEPS) {
        down(6, 0.8)
        if (lastSeg) lead(14)
      } else {
        down(6, 0.82)
        if (odd) push("bass", 7, 1, root + 12, 0.32)
        push("bass", 10, 3, odd ? fifth : root, 0.62)
        if (r() < 0.6) lead(14)
      }
    } else if (sec === "inter") {
      push("bass", g.from, span, root, 0.6)
    } else if (span < STEPS) {
      down(5, 0.85)
      lead(g.from + 6)
    } else if (sec === "c") {
      if (!odd) {
        down(3, 0.9)
        push("bass", 3, 1, root + 12, 0.5)
        push("bass", 6, 2, fifth, 0.65)
        push("bass", 10, 3, root, 0.75)
      } else {
        down(2, 0.9)
        push("bass", 2, 1, root, 0.4)
        push("bass", 4, 2, root + 12, 0.6)
        push("bass", 7, 1, fifth, 0.5)
        push("bass", 8, 2, root, 0.75)
        push("bass", 11, 1, fifth, 0.55)
        push("bass", 12, 2, root + 12, 0.55)
      }
      lead(14)
    } else if (sec === "b") {
      down(6, 0.8)
      push("bass", 8, odd ? 3 : 4, root + 12, 0.55)
      if (odd) push("bass", 11, 2, fifth, 0.5)
      lead(14)
    } else {
      down(3, 0.85)
      if (odd) {
        push("bass", 3, 1, root, 0.35)
        push("bass", 7, 1, root + 12, 0.5)
        push("bass", 8, 2, fifth, 0.55)
        push("bass", 10, 2, root, 0.7)
      } else {
        push("bass", 6, 2, fifth, 0.55)
        push("bass", 10, 3, root, 0.7)
      }
      lead(14)
    }
  })

  // melody: the section's tune
  const lv = sec === "c" ? 0.85 : 0.76
  for (const n of b.melody) push("lead", n.step, n.len, n.midi, lv)

  // strings: a soft bed in the pre-chorus; a counter-line on the 3rds and 7ths in the chorus
  if (!lofi && (sec === "b" || sec === "c" || (sec === "inter" && !drift))) {
    b.chords.forEach((g, k) => {
      const v = b.voicings[k]
      if (sec === "b") for (const m of v.slice(-3)) push("strings", g.from, g.to - g.from, m + 12, 0.42)
      else {
        const guide = QUALITIES[g.chord.q].filter((i) => i === 3 || i === 4 || i === 10 || i === 11)
        const pc = mod(tonic + g.chord.root + (guide[guide.length - 1] ?? 4), 12)
        let m = tonic + 19
        while (mod(m, 12) !== pc) m--
        push("strings", g.from, g.to - g.from, m, 0.5)
      }
    })
  }

  // guitar: muted chops on the off-beats in the chorus, leaving the push to the keys and bass
  if (sec === "c" && !drift && !lofi) {
    const top = b.voicings[0].slice(-3).map((m) => m + 12)
    for (const st of ahead ? [2, 6, 10] : [2, 6, 10, 14]) {
      const g = b.chords.find((x) => st >= x.from && st < x.to) ?? b.chords[0]
      const v = b.voicings[b.chords.indexOf(g)].slice(-3).map((m) => m + 12)
      for (const m of v.length ? v : top) push("gtr", st, 1, m, 0.5 + r() * 0.15)
    }
  }

  // brass: a stab where the chorus lands, and a push into it from the end of the pre-chorus
  if (!drift && !lofi) {
    if (sec === "c" && b.at === 0) for (const m of b.voicings[0]) push("brass", 0, 3, m + 12, 0.7)
    if (sec === "b" && endOfSection) {
      const into = nextFirst ? nextFirst.voicings[0] : b.voicings[0]
      for (const m of into) {
        push("brass", 12, 1, m + 12 + (nextFirst?.shift ?? 0) - b.shift, 0.6)
        push("brass", 14, 2, m + 12 + (nextFirst?.shift ?? 0) - b.shift, 0.75)
      }
    }
  }

  // lo-fi jazz drums: the ride swings, the foot keeps two and four, the snare and kick talk back off the beat
  if (jazz) {
    const quiet = sec === "intro" || sec === "outro"
    const playKit = !(sec === "intro" && b.at < 2) && !(sec === "outro" && b.at >= 2)
    const hv = quiet ? 0.6 : sec === "c" ? 1 : 0.9
    if (playKit && spec.groove === "swing") {
      for (const [st, v] of [[0, 0.7], [4, 0.8], [6, 0.48], [8, 0.7], [12, 0.8], [14, 0.48]] as const) {
        if (st % 4 === 2 && r() < 0.12) continue
        push("ride", st, 1, 0, v * hv * (0.9 + r() * 0.2))
      }
      if (r() < 0.15) push("ride", 10, 1, 0, 0.4 * hv)
      push("foot", 4, 1, 0, 0.55)
      push("foot", 12, 1, 0, 0.55)
      if (!quiet) {
        for (const st of [0, 4, 8, 12]) push("kick", st, 1, 0, 0.13)
        // comping on the snare: a few ghosted off-beats, sometimes a real one
        const spots = [2, 6, 7, 10, 11, 14]
        for (let i = 0; i < 1 + Math.floor(r() * 3); i++) push("snare", spots[Math.floor(r() * spots.length)], 1, 0, 0.12 + r() * 0.22)
        // a "bomb": the kick drops on an off-beat
        if (r() < 0.28) push("kick", [6, 10, 14][Math.floor(r() * 3)], 1, 0, 0.5)
        // the end of every fourth bar sets up the next phrase, snare and kick together on the "and" of four
        if (b.at % 4 === 3 && !endOfSection) {
          push("snare", 14, 1, 0, 0.5)
          push("kick", 14, 1, 0, 0.45)
        }
        if (sec === "c" && b.at === 0 && b.pass === 0) push("crash", 0, 1, 0, 0.32)
      }
    } else if (playKit && spec.groove === "bossa") {
      // the cross-stick's two-bar figure over a soft shaker, the kick on one and three with pickups
      for (const st of b.at % 2 === 0 ? [0, 6, 12] : [4, 10]) push("rim", st, 1, 0, 0.6 * hv)
      for (let st = 0; st < STEPS; st++) push("shaker", st, 1, 0, (st % 2 ? 0.1 : 0.16) * hv * (0.85 + r() * 0.3))
      if (!quiet) for (const [st, v] of [[0, 0.7], [6, 0.35], [8, 0.7], [14, 0.35]] as const) push("kick", st, 1, 0, v)
    } else if (playKit) {
      // ballad: the ride barely touched, the foot on two and four, a soft snare where a brush would sweep
      for (const st of [0, 4, 8, 12]) push("ride", st, 1, 0, 0.32 * hv * (0.9 + r() * 0.2))
      push("foot", 4, 1, 0, 0.4)
      push("foot", 12, 1, 0, 0.4)
      if (!quiet) {
        push("kick", 0, 1, 0, 0.18)
        push("snare", 12, 1, 0, 0.16)
        if (odd) push("snare", 14, 1, 0, 0.12)
      }
    }
    // a short setup into each new section
    if (endOfSection && nextFirst && nextFirst.section !== "outro" && sec !== "intro" && !quiet && spec.groove !== "ballad") {
      for (let i = out.length - 1; i >= 0; i--) if (out[i].step >= 10 && ["snare", "kick"].includes(out[i].voice)) out.splice(i, 1)
      push("snare", 10, 1, 0, 0.3)
      push("snare", 14, 1, 0, 0.55)
      push("kick", 14, 1, 0, 0.5)
    }
  } else if (lofi && !drift) {
    const quiet = sec === "intro" || sec === "outro"
    const playKit = !(sec === "intro" && b.at < 2) && !(sec === "outro" && b.at >= 2)
    if (playKit) {
      const bounce = spec.groove === "bounce"
      const hv = quiet ? 0.55 : sec === "c" ? 0.95 : 0.85
      for (let st = 0; st < STEPS; st += bounce ? 1 : 2) {
        const accent = st % 4 === 0 ? 0.3 : st % 2 === 0 ? 0.2 : 0.11
        if (!(bounce && st % 2 === 1 && r() < 0.35)) push("hat", st, 1, 0, accent * hv * (0.85 + r() * 0.3))
      }
      if (!bounce && r() < 0.4) push("hat", 15, 1, 0, 0.1 * hv)
      push("kick", 0, 1, 0, quiet ? 0.7 : 0.9)
      if (!quiet) {
        if (bounce) push("kick", 6, 1, 0, 0.55)
        else if (odd) push("kick", 7, 1, 0, 0.45)
        push("kick", 10, 1, 0, 0.72)
        if (odd && r() < 0.5) push("kick", 13, 1, 0, 0.35)
        // the snare (a rim in the first verse) on two and four, with a ghost before the four
        const back: Voice = sec === "a" && b.pass === 0 ? "rim" : "snare"
        push(back, 4, 1, 0, 0.7)
        push(back, 12, 1, 0, 0.74)
        if (r() < 0.5) push("snare", 11, 1, 0, 0.12)
        if (odd) push("snare", 7, 1, 0, 0.1)
        if (sec === "c" && b.at === 0 && b.pass === 0) push("crash", 0, 1, 0, 0.35)
      }
    }
    // a soft drag into the next section
    if (endOfSection && nextFirst && nextFirst.section !== "outro" && sec !== "intro" && !quiet) {
      for (let i = out.length - 1; i >= 0; i--) if (out[i].step >= 13 && ["hat", "snare", "rim"].includes(out[i].voice)) out.splice(i, 1)
      push("snare", 13, 1, 0, 0.18)
      push("snare", 14, 1, 0, 0.26)
      push("snare", 15, 1, 0, 0.36)
    }
  } else if (lofi && drift && sec !== "intro" && sec !== "outro") {
    // ambient: no kit, a rim every other bar and a soft shaker
    if (odd) push("rim", 12, 1, 0, 0.32)
    for (const st of [2, 6, 10, 14]) push("shaker", st, 1, 0, 0.18 + r() * 0.06)
  } else if (!drift) {
    const quiet = sec === "intro" || sec === "outro" || sec === "inter"
    const playKit = !(sec === "intro" && b.at < 2) && !(sec === "outro" && b.at >= 2)
    if (playKit) {
      const build = sec === "b" && b.at >= 6 ? 1 + (b.at - 5) * 0.14 : 1
      const hatVel = (quiet ? 0.6 : sec === "c" ? (finalChorus ? 1.12 : 1.05) : 0.9) * build
      const pattern = spec.groove === "shuffle" ? hats([0.36, 0.1, 0.25, 0.1]) : hats([0.34, 0.11, 0.22, 0.11])
      const opens = !quiet && (ahead || (sec === "c" && odd))
      for (const [st, v] of pattern) if (!(opens && st === 14)) push("hat", st, 1, 0, v * hatVel * (0.9 + r() * 0.2))
      if (opens) push("ohat", 14, 2, 0, sec === "c" ? 0.55 : 0.42)
      if (!quiet) {
        push("kick", 0, 1, 0, 0.95)
        if (sec === "c") {
          if (odd) push("kick", 3, 1, 0, 0.35)
          else push("kick", 7, 1, 0, 0.4)
          push("kick", 10, 1, 0, 0.78)
          push("snare", 4, 1, 0, 0.8)
          push("snare", 12, 1, 0, 0.85)
          if (odd) push("snare", 7, 1, 0, 0.14)
          push("snare", 15, 1, 0, 0.12)
        } else {
          if (odd) push("kick", 6, 1, 0, 0.4)
          else if (r() < 0.5) push("kick", 7, 1, 0, 0.3)
          push("kick", 10, 1, 0, 0.75)
          push("rim", 4, 1, 0, 0.72)
          push("rim", 12, 1, 0, 0.78)
          for (const [st, v] of odd ? [[3, 0.1], [9, 0.14], [11, 0.12]] : [[7, 0.12], [15, 0.1]]) push("snare", st, 1, 0, v)
        }
        if (ahead) push("kick", 14, 1, 0, 0.7)
        if (finalChorus) for (let st = 1; st < STEPS; st += 2) push("shaker", st, 1, 0, 0.18)
      }
      if (sec === "intro" && endOfSection) {
        push("snare", 14, 1, 0, 0.3)
        push("snare", 15, 1, 0, 0.45)
      }
    }
    // a crash where a section starts loud (and every four bars of the last chorus)
    if ((sec === "c" || (sec === "a" && b.pass === 1)) && (b.at === 0 || (finalChorus && b.at === 4)))
      push("crash", 0, 1, 0, sec === "c" ? (b.at === 0 ? 0.85 : 0.6) : 0.55)
    // a fill where one section hands over to the next, a different one each time
    if (endOfSection && nextFirst && (nextFirst.section === "c" || nextFirst.section === "b" || nextFirst.section === "a") && sec !== "intro") {
      for (let i = out.length - 1; i >= 0; i--) if (out[i].step >= 12 && ["hat", "ohat", "rim", "snare", "kick"].includes(out[i].voice)) out.splice(i, 1)
      if (nextFirst.section === "c" && nextFirst.shift > b.shift) {
        // into the key change: toms down, then the snare doubled
        push("tom", 12, 1, 3, 0.7)
        push("tom", 13, 1, 2, 0.72)
        push("tom", 14, 1, 1, 0.78)
        push("snare", 15, 1, 0, 0.9)
        push("kick", 15, 1, 0, 0.6)
      } else if (nextFirst.section === "c" && b.pass > 0) {
        // the second time: a snare roll that swells
        for (let st = 8; st < STEPS; st++) push("snare", st, 1, 0, 0.22 + (st - 8) * 0.08)
      } else if (nextFirst.section === "c") {
        push("tom", 12, 1, 3, 0.7)
        push("tom", 13, 1, 2, 0.7)
        push("tom", 14, 1, 1, 0.75)
        push("snare", 15, 1, 0, 0.8)
      } else {
        push("snare", 13, 1, 0, 0.4)
        push("snare", 14, 1, 0, 0.55)
        push("snare", 15, 1, 0, 0.7)
      }
    }
  } else if (sec !== "intro" && sec !== "outro") {
    push("shaker", 4, 1, 0, 0.35)
    push("shaker", 12, 1, 0, 0.3)
  }
  return out
}
