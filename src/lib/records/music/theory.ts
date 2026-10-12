/**
 * Just enough music theory to write a record: scales, scale degrees, chords
 * and a seeded random source so every disc plays the same song every time.
 * No audio here; everything is a pure function.
 */

export type ScaleName = "major" | "minor" | "dorian" | "lydian" | "mixolydian"

export const SCALES: Record<ScaleName, readonly number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
}

const NAMES = ["C", "D♭", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"]

export const mod = (a: number, n: number) => ((a % n) + n) % n

/** MIDI note of a scale degree counted from the tonic; degrees past 6 climb into the next octave. */
export function degreeToMidi(tonic: number, scale: ScaleName, degree: number): number {
  const s = SCALES[scale]
  return tonic + 12 * Math.floor(degree / s.length) + s[mod(degree, s.length)]
}

/** A chord stacked in thirds on a scale degree: root, third, fifth, seventh. */
export function chordTones(tonic: number, scale: ScaleName, degree: number, size = 4): number[] {
  return Array.from({ length: size }, (_, k) => degreeToMidi(tonic, scale, degree + 2 * k))
}

export function inScale(midi: number, tonic: number, scale: ScaleName): boolean {
  return SCALES[scale].includes(mod(midi - tonic, 12))
}

export const midiToHz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12)
export const noteName = (midi: number) => NAMES[mod(midi, 12)]

export function keyName(tonic: number, scale: ScaleName): string {
  return noteName(tonic) + " " + scale[0].toUpperCase() + scale.slice(1)
}

export function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0))
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0")
}

/** mulberry32: small, fast and the same on every machine. */
export function rng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
