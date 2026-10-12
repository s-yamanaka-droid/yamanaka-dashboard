/**
 * The band, built from oscillators and noise. Works on any BaseAudioContext,
 * so the same instruments play live in the browser and render offline in a
 * test.
 *
 *   voices ─▶ deck.dry / deck.ch.* (panned) ─▶ deck.bus ─┐
 *   keys, pad ─▶ deck.duck (dips on the kick) ─▶ deck.bus  │
 *          └▶ deck.send.pad/lead ─▶ deck.fx ─▶ plate ─┤
 *          └▶ deck.send.drum ─▶ deck.fxRoom ─▶ room ─┤
 *          └▶ deck.echo ─▶ delay loop ─▶ deck.bus ├─▶ rig.master ─▶ tape (tone, warmth, wow) ─▶ compressor ─▶ out
 *
 * A deck is one record on the platter. Its bus and fx send fade together, so
 * lifting the needle silences the record and its reverb at once.
 */

import { midiToHz, rng } from "./theory"
import { isJazz, type LeadTone, type NoteEvent, type RecordedLead, type Texture, type TrackSpec } from "./compose"
import { INSTRUMENTS, KIT_PIECES, wurliZone, type DrumHit, type Note, type SampleBank } from "./samples"

/** Where the recorded instruments arrive once decoded; shared by the rig and every deck on it. */
export type SampleSlot = { current: SampleBank | null }

export type Rig = {
  ctx: BaseAudioContext
  master: GainNode
  /** The long plate for keys and melody. Shared by every deck; swapped for a clean one by `freshReverb`. */
  reverb: ConvolverNode
  room: AudioBuffer
  reverbReturn: GainNode
  /** Waits a moment before the plate answers, so notes stay clear of their own reverb. */
  predelay: DelayNode
  /** A short, bright room for the drums. */
  roomVerb: ConvolverNode
  roomIr: AudioBuffer
  roomReturn: GainNode
  analyser: AnalyserNode | null
  samples: SampleSlot
}

export type Deck = {
  bus: GainNode
  dry: GainNode
  fx: GainNode
  send: { pad: GainNode; lead: GainNode; drum: GainNode }
  echo: GainNode
  /** The electric piano's bus, with a slow tremolo on it, spread wide by a chorus. */
  keys: GainNode
  /** Keys and pad go through here; it dips a little on every kick. */
  duck: GainNode
  /** Panned channels, so the kit and the melody sit across the stereo field. */
  ch: {
    pad: GainNode
    lead: GainNode
    snare: GainNode
    rim: GainNode
    hat: GainNode
    shaker: GainNode
    gtr: GainNode
    brass: GainNode
    tom: GainNode
    crash: GainNode
    ohat: GainNode
    ride: GainNode
    foot: GainNode
    /** The archtop guitar when it comps the chords, left of centre, across from the ride. */
    guitar: GainNode
    conga: GainNode
    bongo: GainNode
    bell: GainNode
  }
  fxRoom: GainNode
  /** Long-running sources (texture loops, LFOs) to stop when the deck goes. */
  sources: AudioScheduledSourceNode[]
  nodes: AudioNode[]
  /** The rig's recorded instruments; empty until they load, and the synths play meanwhile. */
  samples: SampleSlot
  /** A lo-fi record: muffled, wobbling, the keys pumping harder on the kick, a rounder bass. */
  lofi: boolean
  /** Lo-fi jazz: the same tape, a little more top for the ride, and no pumping. */
  jazz: boolean
  /** Which recorded kit plays the drums. */
  kit: Kit
}

/**
 * Which kit a record plays: the core kit, brushes (for the ballad and the
 * brush swing), or a punchier kit for the beats that lead with the drums.
 */
export type Kit = "core" | "brush" | "punch"
export function kitOf(spec: TrackSpec): Kit {
  if (spec.style !== "lofi") return "core"
  if (spec.groove === "brush" || spec.groove === "ballad") return "brush"
  if (spec.groove === "hop" || spec.groove === "funk") return "punch"
  return "core"
}

export const MASTER_LEVEL = 0.66

const noiseCache = new WeakMap<BaseAudioContext, AudioBuffer>()

function noise(ctx: BaseAudioContext): AudioBuffer {
  let b = noiseCache.get(ctx)
  if (!b) {
    b = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const d = b.getChannelData(0)
    const r = rng(7)
    for (let i = 0; i < d.length; i++) d[i] = r() * 2 - 1
    noiseCache.set(ctx, b)
  }
  return b
}

/** A reverb tail: stereo noise, decorrelated per side, falling away. A higher `curve` dies sooner. */
function impulse(ctx: BaseAudioContext, seconds: number, curve = 3.2, seed = 101): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * seconds)
  const b = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let c = 0; c < 2; c++) {
    const d = b.getChannelData(c)
    const r = rng(seed + c)
    for (let i = 0; i < len; i++) d[i] = (r() * 2 - 1) * Math.pow(1 - i / len, curve)
  }
  return b
}

/**
 * Gentle tape saturation: unity gain when quiet (slope 1 at zero), rounding
 * off as it gets loud. Dividing by `drive` rather than tanh(drive) keeps it
 * from turning everything up.
 */
export function tapeCurve(size = 2048, drive = 1.35): Float32Array<ArrayBuffer> {
  const curve = new Float32Array(size)
  for (let i = 0; i < size; i++) {
    const x = (i / (size - 1)) * 2 - 1
    curve[i] = Math.tanh(drive * x) / drive
  }
  return curve
}

export function softClip(size: number, knee: number, ceiling: number): Float32Array<ArrayBuffer> {
  const curve = new Float32Array(size)
  const room = ceiling - knee
  for (let i = 0; i < size; i++) {
    const x = (i / (size - 1)) * 2 - 1
    const a = Math.abs(x)
    curve[i] = Math.sign(x) * (a <= knee ? a : knee + room * Math.tanh((a - knee) / room))
  }
  return curve
}

export function createRig(ctx: BaseAudioContext, out: AudioNode, withAnalyser: boolean): Rig {
  const master = ctx.createGain()
  master.gain.value = MASTER_LEVEL
  const comp = ctx.createDynamicsCompressor()
  comp.threshold.value = -16
  comp.knee.value = 12
  comp.ratio.value = 3
  comp.attack.value = 0.01
  comp.release.value = 0.25
  const room = impulse(ctx, 2.6)
  const predelay = ctx.createDelay(0.2)
  predelay.delayTime.value = 0.028
  const reverb = ctx.createConvolver()
  reverb.buffer = room
  const ret = ctx.createGain()
  ret.gain.value = 0.62
  predelay.connect(reverb).connect(ret).connect(master)
  const roomIr = impulse(ctx, 0.75, 2.4, 211)
  const roomVerb = ctx.createConvolver()
  roomVerb.buffer = roomIr
  const roomReturn = ctx.createGain()
  roomReturn.gain.value = 0.5
  roomVerb.connect(roomReturn).connect(master)
  // The compressor adds its own make-up gain, so the last stage is a soft clipper:
  // untouched below 0.75, rounded off above, never past 0.94.
  const limit = ctx.createWaveShaper()
  limit.curve = softClip(4096, 0.75, 0.94)
  limit.oversample = "2x"
  // the tape: a little more bottom, a little less fizz, gentle saturation, and a slow wow
  const low = ctx.createBiquadFilter()
  low.type = "lowshelf"
  low.frequency.value = 110
  low.gain.value = 1.5
  const high = ctx.createBiquadFilter()
  high.type = "highshelf"
  high.frequency.value = 8500
  high.gain.value = -2.5
  const tape = ctx.createWaveShaper()
  tape.curve = tapeCurve()
  tape.oversample = "2x"
  const wow = ctx.createDelay(0.05)
  wow.delayTime.value = 0.006
  for (const [hz, depth] of [[0.5, 0.00025], [6.2, 0.00003]] as const) {
    const lfo = ctx.createOscillator()
    lfo.frequency.value = hz
    const amt = ctx.createGain()
    amt.gain.value = depth
    lfo.connect(amt).connect(wow.delayTime)
    lfo.start()
  }
  master.connect(low).connect(high).connect(tape).connect(wow).connect(comp).connect(limit)
  let analyser: AnalyserNode | null = null
  if (withAnalyser) {
    analyser = ctx.createAnalyser()
    analyser.fftSize = 512
    analyser.smoothingTimeConstant = 0.78
    limit.connect(analyser).connect(out)
  } else limit.connect(out)
  return { ctx, master, reverb, room, reverbReturn: ret, predelay, roomVerb, roomIr, roomReturn, analyser, samples: { current: null } }
}

export function createDeck(rig: Rig, bpm: number, lofi = false, jazz = false, kit: Kit = "core", level = 1): Deck {
  const { ctx } = rig
  const bus = ctx.createGain()
  // a record's own level after its fader, so a quiet one (a ballad on brushes) plays as loud as the rest
  const trim = ctx.createGain()
  trim.gain.value = level
  bus.connect(trim)
  const dry = ctx.createGain()
  const fx = ctx.createGain()
  const fxRoom = ctx.createGain()
  dry.connect(bus)
  const tapeNodes: AudioNode[] = []
  const tapeSources: AudioScheduledSourceNode[] = []
  if (lofi) {
    // a worn tape: the top rolled off, the lowest rumble cut, and a slow pitch drift with a little flutter
    const top = ctx.createBiquadFilter()
    top.type = "lowpass"
    // the beats that lead with the drums keep more of their top, so the snare cracks
    top.frequency.value = kit === "punch" ? 9000 : jazz ? 6800 : 5200
    top.Q.value = 0.45
    const floor = ctx.createBiquadFilter()
    floor.type = "highpass"
    floor.frequency.value = 48
    const drift = ctx.createDelay(0.05)
    drift.delayTime.value = 0.008
    for (const [hz, depth] of [[0.31, 0.0016], [4.8, 0.00007]] as const) {
      const lfo = ctx.createOscillator()
      lfo.frequency.value = hz
      const amt = ctx.createGain()
      amt.gain.value = depth
      lfo.connect(amt).connect(drift.delayTime)
      lfo.start()
      tapeSources.push(lfo)
      tapeNodes.push(amt)
    }
    trim.connect(floor).connect(top).connect(drift).connect(rig.master)
    tapeNodes.push(top, floor, drift)
  } else trim.connect(rig.master)
  fx.connect(rig.predelay)
  fxRoom.connect(rig.roomVerb)
  const nodes: AudioNode[] = [fxRoom]
  const panned = (v: number) => {
    const g = ctx.createGain()
    const p = ctx.createStereoPanner()
    p.pan.value = v
    g.connect(p).connect(bus)
    nodes.push(g, p)
    return g
  }
  const duck = ctx.createGain()
  duck.connect(bus)
  // pad: the same signal hard-ish left and, a few milliseconds later, right
  // two copies of the pad now, so each is a little quieter
  const pad = ctx.createGain()
  pad.gain.value = 0.62
  const padL = ctx.createStereoPanner()
  padL.pan.value = -0.5
  const padR = ctx.createStereoPanner()
  padR.pan.value = 0.5
  const padLag = ctx.createDelay(0.05)
  padLag.delayTime.value = 0.011
  pad.connect(padL).connect(duck)
  pad.connect(padLag).connect(padR).connect(duck)
  nodes.push(duck, pad, padL, padR, padLag)
  const ch = {
    pad,
    lead: panned(0.14),
    snare: panned(-0.06),
    rim: panned(-0.14),
    hat: panned(0.3),
    shaker: panned(-0.34),
    gtr: panned(0.42),
    brass: panned(-0.12),
    tom: panned(0.05),
    crash: panned(-0.28),
    ohat: panned(0.32),
    ride: panned(0.36),
    foot: panned(0.2),
    guitar: panned(-0.24),
    conga: panned(-0.38),
    bongo: panned(0.3),
    bell: panned(0.22),
  }
  const send = { pad: ctx.createGain(), lead: ctx.createGain(), drum: ctx.createGain() }
  send.pad.gain.value = 0.55
  send.lead.gain.value = 0.4
  send.drum.gain.value = 0.12
  send.pad.connect(fx)
  send.lead.connect(fx)
  send.drum.connect(fxRoom)
  send.drum.gain.value = 0.3
  // a dotted-eighth echo, darkened on every repeat
  const echo = ctx.createGain()
  echo.gain.value = 0.22
  const delay = ctx.createDelay(2)
  delay.delayTime.value = (60 / bpm) * 0.75
  const fb = ctx.createGain()
  fb.gain.value = 0.32
  const tone = ctx.createBiquadFilter()
  tone.type = "lowpass"
  tone.frequency.value = 2600
  echo.connect(delay)
  delay.connect(tone).connect(fb).connect(delay)
  delay.connect(bus)
  // the electric piano's amp tremolo: one slow wobble shared by every note
  const keys = ctx.createGain()
  keys.gain.value = 0.86
  const wobble = ctx.createOscillator()
  wobble.frequency.value = 4.6
  const depth = ctx.createGain()
  depth.gain.value = 0.14
  wobble.connect(depth).connect(keys.gain)
  wobble.start()
  // a stereo chorus: two slightly delayed, slowly drifting copies, one each side
  const middle = ctx.createGain()
  middle.gain.value = 0.5
  keys.connect(middle).connect(duck)
  const sources: AudioScheduledSourceNode[] = [wobble]
  for (const [side, base, hz] of [[-0.75, 0.012, 0.42], [0.75, 0.017, 0.57]] as const) {
    const d = ctx.createDelay(0.05)
    d.delayTime.value = base
    const lfo = ctx.createOscillator()
    lfo.frequency.value = hz
    const amt = ctx.createGain()
    amt.gain.value = 0.0016
    lfo.connect(amt).connect(d.delayTime)
    lfo.start()
    const p = ctx.createStereoPanner()
    p.pan.value = side
    const g = ctx.createGain()
    g.gain.value = 0.3
    keys.connect(d).connect(p).connect(g).connect(duck)
    sources.push(lfo)
    nodes.push(d, lfo, amt, p, g)
  }
  keys.connect(send.pad)
  return {
    bus, dry, fx, fxRoom, send, echo, keys, duck, ch,
    sources: [...sources, ...tapeSources],
    samples: rig.samples,
    lofi,
    jazz,
    kit,
    nodes: [bus, trim, dry, fx, ...Object.values(send), echo, delay, fb, tone, keys, wobble, depth, middle, ...nodes, ...tapeNodes],
  }
}

/**
 * Throw away the room's ringing: decks already sending to the old reverb fall
 * silent with it, new decks use the new one. For cutting a record outright.
 */
export function freshReverb(rig: Rig) {
  rig.reverb.disconnect()
  rig.predelay.disconnect()
  rig.reverb = rig.ctx.createConvolver()
  rig.reverb.buffer = rig.room
  rig.predelay.connect(rig.reverb).connect(rig.reverbReturn)
  rig.roomVerb.disconnect()
  rig.roomVerb = rig.ctx.createConvolver()
  rig.roomVerb.buffer = rig.roomIr
  rig.roomVerb.connect(rig.roomReturn)
}

/** Fade the whole deck, its reverb send included. Zero seconds cuts it at once. */
export function fadeDeck(deck: Deck, t: number, to: number, seconds: number) {
  for (const g of [deck.bus.gain, deck.fx.gain, deck.fxRoom.gain]) {
    g.cancelScheduledValues(t)
    if (seconds <= 0) {
      g.setValueAtTime(to, t)
      continue
    }
    g.setValueAtTime(g.value, t)
    g.setTargetAtTime(to, t, seconds / 3)
  }
}

export function teardownDeck(deck: Deck) {
  for (const s of deck.sources) {
    try {
      s.stop()
    } catch {
      /* never started or already stopped */
    }
  }
  for (const n of deck.nodes) n.disconnect()
}

// ---- voices ---------------------------------------------------------------------------

function pad(ctx: BaseAudioContext, deck: Deck, t: number, midi: number, vel: number, dur: number) {
  const f = midiToHz(midi)
  const lp = ctx.createBiquadFilter()
  lp.type = "lowpass"
  lp.Q.value = 0.4
  lp.frequency.setValueAtTime(650, t)
  lp.frequency.linearRampToValueAtTime(1500, t + dur * 0.55)
  lp.frequency.linearRampToValueAtTime(850, t + dur + 0.9)
  const g = ctx.createGain()
  const peak = 0.05 * vel
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(peak, t + 0.45)
  g.gain.setValueAtTime(peak, t + dur)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.9)
  for (const cents of [-9, 9]) {
    const o = ctx.createOscillator()
    o.type = "sawtooth"
    o.frequency.value = f
    o.detune.value = cents
    o.connect(lp)
    o.start(t)
    o.stop(t + dur + 1)
  }
  lp.connect(g)
  g.connect(deck.ch.pad)
  g.connect(deck.send.pad)
}

/**
 * An electric piano, Rhodes-style: a sine with a 1:1 modulator whose bite
 * fades as the note rings, plus a short high tine at the strike.
 */
function rhodes(ctx: BaseAudioContext, deck: Deck, t: number, midi: number, vel: number, dur: number) {
  const f = midiToHz(midi)
  const end = t + Math.max(dur, 0.25)
  const g = ctx.createGain()
  const peak = 0.095 * vel
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(peak, t + 0.006)
  g.gain.setTargetAtTime(peak * 0.32, t + 0.012, 0.7)
  g.gain.setTargetAtTime(0, end, 0.14)
  const car = ctx.createOscillator()
  car.frequency.value = f
  const mod = ctx.createOscillator()
  mod.frequency.value = f
  const idx = ctx.createGain()
  idx.gain.setValueAtTime(f * (0.9 + vel * 0.9), t)
  idx.gain.exponentialRampToValueAtTime(f * 0.18, t + 0.9)
  mod.connect(idx).connect(car.frequency)
  car.connect(g)
  const tine = ctx.createOscillator()
  tine.frequency.value = Math.min(f * 7, 7000)
  const tg = ctx.createGain()
  tg.gain.setValueAtTime(peak * 0.22, t)
  tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.09)
  tine.connect(tg).connect(g)
  g.connect(deck.keys)
  for (const o of [car, mod, tine]) {
    o.start(t)
    o.stop(end + 0.9)
  }
}

function bass(ctx: BaseAudioContext, deck: Deck, t: number, midi: number, vel: number, dur: number) {
  const f = midiToHz(midi)
  const lp = ctx.createBiquadFilter()
  lp.type = "lowpass"
  lp.frequency.value = 520
  lp.Q.value = 2
  const g = ctx.createGain()
  const peak = 0.28 * vel
  const end = t + Math.max(dur * 0.92, 0.08)
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(peak, t + 0.008)
  g.gain.setTargetAtTime(peak * 0.7, t + 0.02, 0.12)
  g.gain.setValueAtTime(peak * 0.7, end)
  g.gain.exponentialRampToValueAtTime(0.0001, end + 0.08)
  const saw = ctx.createOscillator()
  saw.type = "sawtooth"
  saw.frequency.value = f
  const sg = ctx.createGain()
  // a lo-fi bass is mostly the round sine underneath
  sg.gain.value = deck.lofi ? 0.16 : 0.45
  if (deck.lofi) lp.frequency.value = 340
  saw.connect(sg).connect(lp)
  const sub = ctx.createOscillator()
  sub.type = "sine"
  sub.frequency.value = f
  sub.connect(lp)
  lp.connect(g).connect(deck.dry)
  for (const o of [saw, sub]) {
    o.start(t)
    o.stop(end + 0.1)
  }
}

function lead(ctx: BaseAudioContext, deck: Deck, t: number, midi: number, vel: number, dur: number, tone: LeadTone) {
  const f = midiToHz(midi)
  const g = ctx.createGain()
  g.connect(deck.ch.lead)
  g.connect(deck.send.lead)
  g.connect(deck.echo)
  const stopAll = (os: OscillatorNode[], at: number) => os.forEach((o) => (o.start(t), o.stop(at)))

  if (tone === "vibes") {
    // a vibraphone: a pure bar tone, a faint fourth partial at the strike, and the fan's tremolo
    const len = 1.7
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.09 * vel, t + 0.004)
    g.gain.exponentialRampToValueAtTime(0.0001, t + len)
    const trem = ctx.createGain()
    trem.gain.value = 0.8
    const fan = ctx.createOscillator()
    fan.frequency.value = 5.4
    const fd = ctx.createGain()
    fd.gain.value = 0.2
    fan.connect(fd).connect(trem.gain)
    const bar = ctx.createOscillator()
    bar.frequency.value = f
    const over = ctx.createOscillator()
    over.frequency.value = f * 4
    const og = ctx.createGain()
    og.gain.setValueAtTime(0.14, t)
    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.35)
    bar.connect(trem)
    over.connect(og).connect(trem)
    trem.connect(g)
    stopAll([bar, over, fan], t + len + 0.05)
  } else if (tone === "bell") {
    // two-operator FM: a bright strike that mellows into a sine
    const car = ctx.createOscillator()
    car.frequency.value = f
    const mod = ctx.createOscillator()
    mod.frequency.value = f * 3.5
    const idx = ctx.createGain()
    idx.gain.setValueAtTime(f * 2.2, t)
    idx.gain.exponentialRampToValueAtTime(f * 0.05, t + 1.2)
    mod.connect(idx).connect(car.frequency)
    const len = 1.8
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.1 * vel, t + 0.004)
    g.gain.exponentialRampToValueAtTime(0.0001, t + len)
    car.connect(g)
    stopAll([car, mod], t + len + 0.05)
  } else if (tone === "glass") {
    const len = 1.3
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.085 * vel, t + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t + len)
    const vib = ctx.createOscillator()
    vib.frequency.value = 5
    const vd = ctx.createGain()
    vd.gain.value = 4
    vib.connect(vd)
    const os = [1, 2, 3].map((h, k) => {
      const o = ctx.createOscillator()
      o.frequency.value = f * h
      vd.connect(o.detune)
      const hg = ctx.createGain()
      hg.gain.value = [1, 0.32, 0.1][k]
      o.connect(hg).connect(g)
      return o
    })
    stopAll([...os, vib], t + len + 0.05)
  } else if (tone === "reed") {
    const lp = ctx.createBiquadFilter()
    lp.type = "lowpass"
    lp.frequency.value = 1700
    lp.Q.value = 1
    const end = t + Math.max(dur, 0.12)
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.055 * vel, t + 0.035)
    g.gain.setValueAtTime(0.045 * vel, end)
    g.gain.exponentialRampToValueAtTime(0.0001, end + 0.14)
    const o = ctx.createOscillator()
    o.type = "square"
    o.frequency.value = f
    const vib = ctx.createOscillator()
    vib.frequency.value = 5.5
    const vd = ctx.createGain()
    vd.gain.value = 6
    vib.connect(vd).connect(o.detune)
    o.connect(lp).connect(g)
    stopAll([o, vib], end + 0.2)
  } else {
    // pluck: a filter that snaps shut, like a muted string
    const lp = ctx.createBiquadFilter()
    lp.type = "lowpass"
    lp.Q.value = 3
    lp.frequency.setValueAtTime(3800, t)
    lp.frequency.exponentialRampToValueAtTime(700, t + 0.28)
    const len = Math.min(Math.max(dur + 0.25, 0.35), 0.9)
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.13 * vel, t + 0.003)
    g.gain.exponentialRampToValueAtTime(0.0001, t + len)
    const tri = ctx.createOscillator()
    tri.type = "triangle"
    tri.frequency.value = f
    const sq = ctx.createOscillator()
    sq.type = "square"
    sq.frequency.value = f
    const sqg = ctx.createGain()
    sqg.gain.value = 0.22
    tri.connect(lp)
    sq.connect(sqg).connect(lp)
    lp.connect(g)
    stopAll([tri, sq], t + len + 0.05)
  }
}

function noiseHit(ctx: BaseAudioContext, t: number, filter: BiquadFilterType, freq: number, q: number) {
  const src = ctx.createBufferSource()
  src.buffer = noise(ctx)
  const f = ctx.createBiquadFilter()
  f.type = filter
  f.frequency.value = freq
  f.Q.value = q
  src.connect(f)
  return {
    src,
    out: f,
    start: (len: number) => {
      // the noise buffer is a second long: let long hits (a crash) loop it
      if (len > 0.45) src.loop = true
      src.start(t, (t * 7.31) % 0.5)
      src.stop(t + len)
    },
  }
}

function kick(ctx: BaseAudioContext, deck: Deck, t: number, vel: number) {
  const o = ctx.createOscillator()
  o.frequency.setValueAtTime(150, t)
  o.frequency.exponentialRampToValueAtTime(46, t + 0.12)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.62 * vel, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42)
  o.connect(g).connect(deck.dry)
  o.start(t)
  o.stop(t + 0.45)
  duckOn(deck, t)
}

/** The keys and pad lean back for an instant, so the kick lands clean (on a lo-fi record, a clear pump). */
function duckOn(deck: Deck, t: number) {
  const d = deck.duck.gain
  d.setValueAtTime(1, t)
  // jazz-hop pumps a little, like a sampled loop under a compressor; the other jazz feels hardly at all
  d.linearRampToValueAtTime(deck.kit === "punch" ? 0.78 : deck.jazz ? 0.92 : deck.lofi ? 0.62 : 0.8, t + 0.012)
  d.setTargetAtTime(1, t + 0.03, deck.lofi && (!deck.jazz || deck.kit === "punch") ? 0.16 : 0.08)
}

function snare(ctx: BaseAudioContext, deck: Deck, t: number, vel: number) {
  const n = noiseHit(ctx, t, "bandpass", 1900, 0.9)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.34 * vel, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2)
  n.out.connect(g)
  g.connect(deck.ch.snare)
  g.connect(deck.send.drum)
  n.start(0.22)
  const o = ctx.createOscillator()
  o.type = "triangle"
  o.frequency.value = 190
  const og = ctx.createGain()
  og.gain.setValueAtTime(0.18 * vel, t)
  og.gain.exponentialRampToValueAtTime(0.0001, t + 0.1)
  o.connect(og).connect(deck.ch.snare)
  o.start(t)
  o.stop(t + 0.12)
}

/** A cross-stick: the wood click of the stick across the rim. */
function rim(ctx: BaseAudioContext, deck: Deck, t: number, vel: number) {
  const n = noiseHit(ctx, t, "bandpass", 2600, 4)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.26 * vel, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)
  n.out.connect(g)
  g.connect(deck.ch.rim)
  g.connect(deck.send.drum)
  n.start(0.06)
  const o = ctx.createOscillator()
  o.type = "triangle"
  o.frequency.value = 480
  const og = ctx.createGain()
  og.gain.setValueAtTime(0.18 * vel, t)
  og.gain.exponentialRampToValueAtTime(0.0001, t + 0.035)
  o.connect(og).connect(deck.ch.rim)
  o.start(t)
  o.stop(t + 0.05)
}

function hat(ctx: BaseAudioContext, deck: Deck, t: number, vel: number, shaker: boolean) {
  const n = shaker ? noiseHit(ctx, t, "bandpass", 6000, 1.2) : noiseHit(ctx, t, "highpass", 7500, 0.7)
  const g = ctx.createGain()
  if (shaker) {
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.07 * vel, t + 0.012)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.085)
  } else {
    g.gain.setValueAtTime(0.1 * vel, t)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)
  }
  n.out.connect(g).connect(shaker ? deck.ch.shaker : deck.ch.hat)
  n.start(0.1)
}

/** A string section: detuned saws through a soft filter, swelling in slowly, spread wide. */
function strings(ctx: BaseAudioContext, deck: Deck, t: number, midi: number, vel: number, dur: number) {
  const f = midiToHz(midi)
  const lp = ctx.createBiquadFilter()
  lp.type = "lowpass"
  lp.frequency.value = 2300
  lp.Q.value = 0.3
  const g = ctx.createGain()
  const peak = 0.03 * vel
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(peak, t + 0.4)
  g.gain.setValueAtTime(peak, t + Math.max(dur, 0.45))
  g.gain.setTargetAtTime(0, t + Math.max(dur, 0.45), 0.25)
  const end = t + Math.max(dur, 0.45) + 1.4
  for (const cents of [-11, 0, 11]) {
    const o = ctx.createOscillator()
    o.type = "sawtooth"
    o.frequency.value = f
    o.detune.value = cents
    o.connect(lp)
    o.start(t)
    o.stop(end)
  }
  lp.connect(g)
  g.connect(deck.ch.pad)
  g.connect(deck.send.pad)
}

/** A muted guitar chop: a bright pluck that's gone almost as soon as it sounds. */
function guitar(ctx: BaseAudioContext, deck: Deck, t: number, midi: number, vel: number) {
  const f = midiToHz(midi)
  const hp = ctx.createBiquadFilter()
  hp.type = "highpass"
  hp.frequency.value = 380
  const bp = ctx.createBiquadFilter()
  bp.type = "bandpass"
  bp.frequency.setValueAtTime(2400, t)
  bp.frequency.exponentialRampToValueAtTime(900, t + 0.08)
  bp.Q.value = 0.9
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.055 * vel, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.11)
  const o = ctx.createOscillator()
  o.type = "sawtooth"
  o.frequency.value = f
  o.connect(hp).connect(bp).connect(g)
  g.connect(deck.ch.gtr)
  o.start(t)
  o.stop(t + 0.13)
}

/** A brass-section stab: saws with a filter that opens on the attack, like breath into a horn. */
function brass(ctx: BaseAudioContext, deck: Deck, t: number, midi: number, vel: number, dur: number) {
  const f = midiToHz(midi)
  const lp = ctx.createBiquadFilter()
  lp.type = "lowpass"
  lp.Q.value = 1.2
  lp.frequency.setValueAtTime(700, t)
  lp.frequency.linearRampToValueAtTime(2900, t + 0.05)
  lp.frequency.setTargetAtTime(1500, t + 0.06, 0.12)
  const g = ctx.createGain()
  const peak = 0.04 * vel
  const end = t + Math.max(dur, 0.12)
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(peak, t + 0.02)
  g.gain.setTargetAtTime(peak * 0.6, t + 0.03, 0.1)
  g.gain.setTargetAtTime(0, end, 0.06)
  for (const cents of [-7, 7]) {
    const o = ctx.createOscillator()
    o.type = "sawtooth"
    o.frequency.value = f
    o.detune.value = cents
    o.connect(lp)
    o.start(t)
    o.stop(end + 0.4)
  }
  lp.connect(g)
  g.connect(deck.ch.brass)
  g.connect(deck.send.lead)
}

/** Toms: 1 high, 2 mid, 3 floor. */
function tom(ctx: BaseAudioContext, deck: Deck, t: number, which: number, vel: number) {
  const [from, to] = which === 1 ? [210, 130] : which === 2 ? [160, 98] : [118, 70]
  const o = ctx.createOscillator()
  o.frequency.setValueAtTime(from, t)
  o.frequency.exponentialRampToValueAtTime(to, t + 0.18)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.42 * vel, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.38)
  o.connect(g)
  g.connect(deck.ch.tom)
  g.connect(deck.send.drum)
  o.start(t)
  o.stop(t + 0.4)
}

function crash(ctx: BaseAudioContext, deck: Deck, t: number, vel: number) {
  const n = noiseHit(ctx, t, "highpass", 4800, 0.5)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.11 * vel, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8)
  n.out.connect(g)
  g.connect(deck.ch.crash)
  g.connect(deck.send.drum)
  n.start(1.85)
}

/** A ride cymbal: bright noise ringing through a few metallic bands, a longer, quieter wash than a crash. */
function rideSynth(ctx: BaseAudioContext, deck: Deck, t: number, vel: number, bell: boolean) {
  const n = noiseHit(ctx, t, "bandpass", bell ? 3200 : 5600, bell ? 6 : 1.4)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.07 * vel, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + (bell ? 0.9 : 1.2))
  n.out.connect(g)
  g.connect(deck.ch.ride)
  g.connect(deck.send.drum)
  n.start(bell ? 0.95 : 1.25)
}

function openHat(ctx: BaseAudioContext, deck: Deck, t: number, vel: number) {
  const n = noiseHit(ctx, t, "highpass", 7000, 0.7)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.09 * vel, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3)
  n.out.connect(g).connect(deck.ch.ohat)
  n.start(0.32)
}

// ---- recorded instruments -------------------------------------------------------------

/**
 * Levels that sit each recording where its synth stood, measured by
 * scripts/calibrate-samples.test.ts (loudness over the first part of a hit).
 */
export const SAMPLE_GAIN: Record<DrumHit | "wurli" | "keys-piano" | "keys-guitar" | "gtr-chop" | "guitar-mute" | Instrument, number> = {
  wurli: 0.287,
  kick: 1.803,
  snare: 0.190,
  ghost: 1.115,
  rim: 0.243,
  hat: 1.002,
  "hat-hard": 0.106,
  ohat: 0.826,
  crash: 0.243,
  htom: 0.609,
  ltom: 0.516,
  ride: 0.285,
  "ride-2": 0.240,
  "ride-bell": 0.579,
  "hat-foot": 0.085,
  "keys-piano": 0.222,
  "upright-piano": 0.247,
  vibraphone: 0.093,
  kalimba: 0.140,
  zither: 0.151,
  "tenor-sax": 0.093,
  guitar: 0.265,
  "keys-guitar": 0.298,
  "gtr-chop": 0.354,
  "guitar-mute": 0.279,
  "upright-bass": 1.205,
}

/** The recorded melody instruments, by the folder their notes live in under public/samples. */
export const RECORDED: Record<RecordedLead, Instrument> = {
  piano: "upright-piano",
  vibraphone: "vibraphone",
  kalimba: "kalimba",
  zither: "zither",
  sax: "tenor-sax",
  guitar: "guitar",
}
export type Instrument = "upright-piano" | "vibraphone" | "kalimba" | "zither" | "tenor-sax" | "guitar" | "upright-bass"
/** The synth that plays a recorded instrument's part until its notes arrive. */
const STANDIN: Record<RecordedLead, LeadTone> = { piano: "bell", vibraphone: "vibes", kalimba: "pluck", zither: "pluck", sax: "reed", guitar: "pluck" }

/**
 * Levels for the band's extra kit pieces, measured the same way (each against
 * the core kit's stroke it stands in for). A piece missing here plays at 0.3.
 */
export const KIT_GAIN: Record<string, number> = {
  "br-kick": 0.688,
  "br-kick-2": 0.688,
  "br-kick-soft": 0.688,
  "br-snare": 0.205,
  "br-snare-2": 0.205,
  "br-rimshot": 0.205,
  "br-ghost": 0.827,
  "br-ghost-2": 0.827,
  "br-hat": 0.314,
  "br-hat-2": 0.314,
  "br-hat-hard": 0.168,
  "br-ohat": 0.237,
  "br-foot": 0.068,
  "brush-tap": 0.099,
  "brush-tap-soft": 0.099,
  "brush-hat": 0.040,
  "brush-ride": 0.078,
  "conga-open": 1.083,
  "conga-mute": 1.083,
  "conga-slap": 0.347,
  "conga-low": 1.806,
  "bongo-hi": 0.623,
  "bongo-lo": 0.623,
  "cowbell": 0.291,
  "shaker": 0.922,
  "shaker-2": 0.922,
  "brush-sweep": 0.249,
}

/** The recordings a record needs beyond the core, as files: its melody and chord instruments, the double bass, its kit. */
export function recordingsFor(spec: TrackSpec): string[] {
  const inst = new Set<string>()
  if (spec.lead in RECORDED) inst.add(RECORDED[spec.lead as RecordedLead])
  if (spec.keys === "piano") inst.add("upright-piano")
  if (spec.keys === "guitar") inst.add("guitar")
  const jazz = spec.style === "lofi" && isJazz(spec.groove)
  if (jazz) inst.add("upright-bass")
  if (jazz && spec.groove === "funk") inst.add("guitar").add("guitar-mute")
  const kit = kitOf(spec)
  const prefixes = kit === "brush" ? ["brush-"] : kit === "punch" ? ["br-"] : []
  if (jazz && spec.groove === "latin") prefixes.push("conga-", "bongo-", "cowbell", "shaker")
  if (jazz && spec.groove === "bossa") prefixes.push("shaker")
  return [
    ...[...inst].flatMap((name) => (INSTRUMENTS[name] ?? []).map((n) => n.file)),
    ...KIT_PIECES.filter((k) => prefixes.some((p) => k.startsWith(p))).map((k) => `drums/${k}`),
  ]
}
const isRecorded = (tone: LeadTone): tone is RecordedLead => tone in RECORDED

/** One recording, from time t, at a playback rate; cut away softly after `hold` seconds if given. */
function sample(ctx: BaseAudioContext, buf: AudioBuffer, t: number, gain: number, outs: AudioNode[], rate = 1, hold?: number, release = 0.15) {
  const src = ctx.createBufferSource()
  src.buffer = buf
  src.playbackRate.value = rate
  const g = ctx.createGain()
  g.gain.setValueAtTime(gain, t)
  let end = t + buf.duration / rate
  if (hold != null && t + hold < end) {
    // pin the level where the fade begins: some renderers drift between a set value and a later target
    g.gain.setValueAtTime(gain, t + hold)
    g.gain.setTargetAtTime(0, t + hold, release / 4)
    end = t + hold + release * 1.5
  }
  src.connect(g)
  for (const o of outs) g.connect(o)
  src.start(t)
  src.stop(end + 0.02)
}

/** The Wurlitzer: the nearest recording at the right loudness, retuned to the key, let go at the end of the note. */
function wurlitzer(ctx: BaseAudioContext, deck: Deck, bank: SampleBank, t: number, midi: number, vel: number, dur: number) {
  const w = wurliZone(midi, vel)
  const rate = 2 ** ((midi - w.center) / 12 + w.tune / 1200)
  sample(ctx, bank.wurli[w.file], t, SAMPLE_GAIN.wurli * vel * 10 ** (w.volume / 20), [deck.keys], rate, Math.max(dur, 0.2), 0.22)
}

/** A note on a recorded instrument: the nearest of its recordings, retuned to the key. */
function multi(ctx: BaseAudioContext, notes: Note[], t: number, midi: number, gain: number, outs: AudioNode[], hold: number, release: number) {
  let near = notes[0]
  for (const n of notes) if (Math.abs(n.midi - midi) < Math.abs(near.midi - midi)) near = n
  sample(ctx, near.buf, t, gain * (near.gain ?? 1), outs, 2 ** ((midi - near.midi) / 12), hold, release)
}

/** The kit, played from its recordings; the shaker stays synthesised. Returns false for anything it doesn't play. */
function drum(ctx: BaseAudioContext, deck: Deck, bank: SampleBank, ev: NoteEvent, t: number, dur: number): boolean {
  if (deck.jazz && band(ctx, deck, bank, ev, t, dur)) return true
  const hit = (name: DrumHit, vel: number, outs: AudioNode[], rate = 1, hold?: number) => sample(ctx, bank.drums[name], t, SAMPLE_GAIN[name] * vel, outs, rate, hold)
  switch (ev.voice) {
    case "kick":
      hit("kick", ev.vel, [deck.dry])
      duckOn(deck, t)
      return true
    case "snare":
      // a ghost note is a different stroke, not just a quieter one
      hit(ev.vel < 0.3 ? "ghost" : "snare", ev.vel, [deck.ch.snare, deck.send.drum])
      return true
    case "rim":
      hit("rim", ev.vel, [deck.ch.rim, deck.send.drum])
      return true
    case "hat":
      hit(ev.vel >= 0.28 ? "hat-hard" : "hat", ev.vel, [deck.ch.hat])
      return true
    case "ohat":
      // the foot closes it again where the note ends
      hit("ohat", ev.vel, [deck.ch.ohat], 1, Math.max(dur, 0.12))
      return true
    case "crash":
      hit("crash", ev.vel, [deck.ch.crash, deck.send.drum])
      return true
    case "ride":
      // midi 1 is the bell; the bow alternates two strokes so a pattern never repeats one sample
      hit(ev.midi === 1 ? "ride-bell" : ev.step % 4 === 2 ? "ride-2" : "ride", ev.vel, [deck.ch.ride, deck.send.drum])
      return true
    case "foot":
      hit("hat-foot", ev.vel, [deck.ch.foot])
      return true
    case "tom":
      // 1 high, 2 the high tom tuned down a little, 3 floor
      hit(ev.midi === 3 ? "ltom" : "htom", ev.vel, [deck.ch.tom, deck.send.drum], ev.midi === 2 ? 2 ** (-3 / 12) : 1)
      return true
    default:
      return false
  }
}

/**
 * The band's own recordings, where it has them: brushes or the punchier kit in
 * place of the core kit, hand drums, a muted guitar strum. Two strokes of the
 * same drum are taken in turn, so a beat never repeats one recording. Returns
 * false where it has nothing, and the core kit (or a synth) plays instead.
 */
function band(ctx: BaseAudioContext, deck: Deck, bank: SampleBank, ev: NoteEvent, t: number, dur: number): boolean {
  const piece = (name: string, vel: number, outs: AudioNode[], hold?: number) => {
    const buf = bank.kit[name]
    if (!buf) return false
    sample(ctx, buf, t, (KIT_GAIN[name] ?? 0.3) * vel, outs, 1, hold)
    return true
  }
  // on the beat the first stroke, off it the second
  const turn = (a: string, b: string) => (ev.step % 4 !== 0 && bank.kit[b] ? b : a)
  const brush = deck.kit === "brush"
  const punch = deck.kit === "punch"
  switch (ev.voice) {
    case "kick":
      if (!punch) return false
      if (!piece(ev.vel < 0.4 ? "br-kick-soft" : ev.step === 0 ? "br-kick" : turn("br-kick", "br-kick-2"), ev.vel, [deck.dry])) return false
      duckOn(deck, t)
      return true
    case "snare":
      if (brush) return piece(ev.vel >= 0.3 ? "brush-tap" : "brush-tap-soft", ev.vel, [deck.ch.snare, deck.send.drum])
      if (punch) return piece(ev.vel < 0.3 ? turn("br-ghost", "br-ghost-2") : ev.step === 12 ? "br-snare-2" : "br-snare", ev.vel, [deck.ch.snare, deck.send.drum])
      return false
    case "sweep":
      return piece("brush-sweep", ev.vel, [deck.ch.snare], Math.max(dur, 0.3))
    case "hat":
      if (brush) return piece("brush-hat", ev.vel, [deck.ch.hat])
      if (punch) return piece(ev.vel >= 0.45 ? "br-hat-hard" : turn("br-hat", "br-hat-2"), ev.vel, [deck.ch.hat])
      return false
    case "ohat":
      return punch && piece("br-ohat", ev.vel, [deck.ch.ohat], Math.max(dur, 0.12))
    case "foot":
      return punch && piece("br-foot", ev.vel, [deck.ch.foot])
    case "ride":
      return brush && ev.midi !== 1 && piece("brush-ride", ev.vel, [deck.ch.ride, deck.send.drum])
    case "shaker":
      return piece(ev.step % 2 ? "shaker-2" : "shaker", ev.vel, [deck.ch.shaker])
    case "conga":
      return piece(["conga-mute", "conga-slap", "conga-open", "conga-low"][ev.midi] ?? "conga-open", ev.vel, [deck.ch.conga, deck.send.drum]) ||
        (ev.midi === 0 && piece("conga-open", ev.vel * 0.45, [deck.ch.conga], 0.06))
    case "bongo":
      return piece(ev.midi === 1 ? "bongo-lo" : "bongo-hi", ev.vel, [deck.ch.bongo, deck.send.drum])
    case "bell":
      return piece("cowbell", ev.vel, [deck.ch.bell, deck.send.drum])
    case "chk": {
      // a strum on deadened strings has no pitch: the two recordings in turn, as they are
      const mute = bank.inst["guitar-mute"]
      if (!mute?.length) return false
      sample(ctx, mute[ev.step % 4 === 3 ? mute.length - 1 : 0].buf, t, SAMPLE_GAIN["guitar-mute"] * ev.vel, [deck.ch.gtr], 1, Math.max(dur, 0.05), 0.03)
      return true
    }
    default:
      return false
  }
}

export function playNote(ctx: BaseAudioContext, deck: Deck, ev: NoteEvent, t: number, stepSec: number, tone: LeadTone, keysOn: TrackSpec["keys"] = "rhodes") {
  const dur = ev.len * stepSec
  const bank = deck.samples.current
  if (bank) {
    if (ev.voice === "keys" && keysOn === "guitar") {
      // the archtop comps: each chord a quick strum (the engine rolls the strings), let go where the chord ends
      const gtr = bank.inst.guitar
      if (gtr?.length) return multi(ctx, gtr, t, ev.midi, SAMPLE_GAIN["keys-guitar"] * ev.vel, [deck.ch.guitar, deck.send.pad], Math.max(dur, 0.14), 0.12)
    }
    if (ev.voice === "gtr" && deck.jazz) {
      // jazz-funk chops on the archtop: gone almost as soon as they sound
      const gtr = bank.inst.guitar
      if (gtr?.length) return multi(ctx, gtr, t, ev.midi, SAMPLE_GAIN["gtr-chop"] * ev.vel, [deck.ch.gtr, deck.send.drum], Math.max(dur * 0.7, 0.07), 0.04)
    }
    if (ev.voice === "bass" && deck.jazz) {
      // the double bass, plucked; each note stopped just before the next
      const ub = bank.inst["upright-bass"]
      if (ub?.length) return multi(ctx, ub, t, ev.midi, SAMPLE_GAIN["upright-bass"] * ev.vel, [deck.dry], Math.max(dur * 0.94, 0.12), 0.09)
    }
    if (ev.voice === "keys") {
      // an upright piano skips the electric piano's tremolo and chorus
      const piano = keysOn === "piano" ? bank.inst["upright-piano"] : undefined
      if (piano?.length) return multi(ctx, piano, t, ev.midi, SAMPLE_GAIN["keys-piano"] * ev.vel, [deck.duck, deck.send.pad], Math.max(dur, 0.25), 0.35)
      return wurlitzer(ctx, deck, bank, t, ev.midi, ev.vel, dur)
    }
    if (ev.voice === "lead" && isRecorded(tone)) {
      const notes = bank.inst[RECORDED[tone]]
      if (notes?.length) return multi(ctx, notes, t, ev.midi, SAMPLE_GAIN[RECORDED[tone]] * ev.vel, [deck.ch.lead, deck.send.lead, deck.echo], Math.max(dur, 0.12), tone === "sax" ? 0.12 : 0.3)
    }
    if (drum(ctx, deck, bank, ev, t, dur)) return
  }
  switch (ev.voice) {
    case "pad":
      return pad(ctx, deck, t, ev.midi, ev.vel, dur)
    case "keys":
      return rhodes(ctx, deck, t, ev.midi, ev.vel, dur)
    case "rim":
      return rim(ctx, deck, t, ev.vel)
    case "bass":
      return bass(ctx, deck, t, ev.midi, ev.vel, dur)
    case "lead":
      return lead(ctx, deck, t, ev.midi, ev.vel, dur, isRecorded(tone) ? STANDIN[tone] : tone)
    case "kick":
      return kick(ctx, deck, t, ev.vel)
    case "snare":
      return snare(ctx, deck, t, ev.vel)
    case "hat":
      return hat(ctx, deck, t, ev.vel, false)
    case "shaker":
      return hat(ctx, deck, t, ev.vel, true)
    case "strings":
      return strings(ctx, deck, t, ev.midi, ev.vel, dur)
    case "gtr":
      return guitar(ctx, deck, t, ev.midi, ev.vel)
    case "brass":
      return brass(ctx, deck, t, ev.midi, ev.vel, dur)
    case "tom":
      return tom(ctx, deck, t, ev.midi, ev.vel)
    case "crash":
      return crash(ctx, deck, t, ev.vel)
    case "ohat":
      return openHat(ctx, deck, t, ev.vel)
    case "ride":
      return rideSynth(ctx, deck, t, ev.vel, ev.midi === 1)
    case "foot":
      return hat(ctx, deck, t, ev.vel * 0.7, false)
    case "sweep":
      return sweep(ctx, deck, t, ev.vel, dur)
    case "conga":
      return handDrum(ctx, deck.ch.conga, t, [300, 330, 330, 196][ev.midi] ?? 330, ev.vel, ev.midi === 0 ? 0.05 : 0.22, ev.midi === 1)
    case "bongo":
      return handDrum(ctx, deck.ch.bongo, t, ev.midi === 1 ? 392 : 560, ev.vel, 0.11, false)
    case "bell":
      return cowbell(ctx, deck, t, ev.vel)
    case "chk":
      return guitar(ctx, deck, t, ev.midi, ev.vel * 0.6)
  }
}

/** A brush stirred round the snare head: hiss that swells and fades over the note. */
function sweep(ctx: BaseAudioContext, deck: Deck, t: number, vel: number, dur: number) {
  const src = ctx.createBufferSource()
  src.buffer = noise(ctx)
  src.loop = true
  const bp = ctx.createBiquadFilter()
  bp.type = "bandpass"
  bp.frequency.value = 3200
  bp.Q.value = 0.6
  const g = ctx.createGain()
  const len = Math.max(0.25, dur)
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(0.05 * vel, t + len * 0.4)
  g.gain.linearRampToValueAtTime(0, t + len)
  src.connect(bp).connect(g).connect(deck.ch.snare)
  src.start(t)
  src.stop(t + len + 0.02)
}

/** A hand drum: a pitched thump that falls a little as it rings, with a crack on top for a slap. */
function handDrum(ctx: BaseAudioContext, out: AudioNode, t: number, hz: number, vel: number, decay: number, slap: boolean) {
  const o = ctx.createOscillator()
  o.frequency.setValueAtTime(hz * 1.08, t)
  o.frequency.exponentialRampToValueAtTime(hz, t + 0.04)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.32 * vel, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + decay * 2.5)
  o.connect(g).connect(out)
  o.start(t)
  o.stop(t + decay * 2.5 + 0.02)
  if (slap) {
    const n = noiseHit(ctx, t, "highpass", 1800, 0.7)
    const ng = ctx.createGain()
    ng.gain.setValueAtTime(0.25 * vel, t)
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.06)
    n.out.connect(ng).connect(out)
    n.start(0.07)
  }
}

/** The hand bell: two square tones a sixth apart, through a narrow band. */
function cowbell(ctx: BaseAudioContext, deck: Deck, t: number, vel: number) {
  const bp = ctx.createBiquadFilter()
  bp.type = "bandpass"
  bp.frequency.value = 2400
  bp.Q.value = 1.2
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.12 * vel, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3)
  bp.connect(g).connect(deck.ch.bell)
  for (const hz of [562, 845]) {
    const o = ctx.createOscillator()
    o.type = "square"
    o.frequency.value = hz
    o.connect(bp)
    o.start(t)
    o.stop(t + 0.32)
  }
}

/** The sound of the needle finding the groove. */
export function needleDrop(ctx: BaseAudioContext, deck: Deck, t: number) {
  const n = noiseHit(ctx, t, "bandpass", 1300, 0.7)
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.22, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2)
  n.out.connect(g).connect(deck.dry)
  n.start(0.22)
  const o = ctx.createOscillator()
  o.frequency.setValueAtTime(70, t)
  o.frequency.exponentialRampToValueAtTime(40, t + 0.12)
  const og = ctx.createGain()
  og.gain.setValueAtTime(0.25, t)
  og.gain.exponentialRampToValueAtTime(0.0001, t + 0.16)
  o.connect(og).connect(deck.dry)
  o.start(t)
  o.stop(t + 0.18)
}

/** Surface noise, surf or rain under the whole record. */
export function startTexture(ctx: BaseAudioContext, deck: Deck, kind: Texture, t: number, seed: number) {
  if (kind === "none") return
  const src = ctx.createBufferSource()
  src.loop = true
  const g = ctx.createGain()
  if (kind === "vinyl") {
    const len = ctx.sampleRate * 5
    const b = ctx.createBuffer(1, len, ctx.sampleRate)
    const d = b.getChannelData(0)
    const r = rng(seed * 13 + 5)
    let lp = 0
    for (let i = 0; i < len; i++) {
      lp += ((r() * 2 - 1) - lp) * 0.08
      d[i] = lp * 0.05
    }
    for (let k = 0; k < 55; k++) {
      const at = Math.floor(r() * (len - 400))
      const amp = (0.15 + r() * 0.5) * (r() < 0.5 ? -1 : 1)
      for (let j = 0; j < 60; j++) d[at + j] += amp * Math.exp(-j / 6) * (j % 2 ? -1 : 1)
    }
    src.buffer = b
    g.gain.value = 0.3
    src.connect(g)
  } else {
    src.buffer = noise(ctx)
    const f = ctx.createBiquadFilter()
    if (kind === "waves") {
      f.type = "lowpass"
      f.frequency.value = 420
      g.gain.value = 0.05
      // the swell of a slow sea, about one wave every twelve seconds
      const lfo = ctx.createOscillator()
      lfo.frequency.value = 0.085
      const depth = ctx.createGain()
      depth.gain.value = 0.04
      lfo.connect(depth).connect(g.gain)
      lfo.start(t)
      deck.sources.push(lfo)
      deck.nodes.push(lfo, depth)
    } else {
      f.type = "highpass"
      f.frequency.value = 2600
      g.gain.value = 0.02
    }
    src.connect(f).connect(g)
    deck.nodes.push(f)
  }
  g.connect(deck.dry)
  src.start(t)
  deck.sources.push(src)
  deck.nodes.push(src, g)
}
