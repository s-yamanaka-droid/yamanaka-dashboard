/**
 * The turntable. Plays one record at a time: either a song written on the fly
 * from a `TrackSpec`, or an audio file. Changing records lifts the needle
 * (a quick fade) and drops it on the next one.
 *
 * Generated songs are scheduled with the usual Web Audio lookahead: a timer
 * wakes every 25 ms and books every 16th note due in the next moment against
 * the audio clock, writing each bar with `composeBar` as it is reached. When
 * the tab is hidden and timers slow to once a second, the lookahead stretches
 * so the song keeps going.
 */

import { barSeconds, composeBar, durationOf, motifOf, STEPS, stepSeconds, type MotifNote, type NoteEvent, type TrackSpec } from "./compose"
import {
  createDeck,
  createRig,
  fadeDeck,
  freshReverb,
  MASTER_LEVEL,
  needleDrop,
  playNote,
  startTexture,
  teardownDeck,
  type Deck,
  type Rig,
} from "./instruments"
import { decodeInstruments, decodeSamples, fetchSamples, INSTRUMENT_FILES, type Bytes, type SampleSource } from "./samples"

export type TrackSource = { kind: "generated"; spec: TrackSpec } | { kind: "file"; src: string }

type Spin = {
  source: TrackSource
  deck: Deck
  /** Audio-clock time of the first beat. */
  start: number
  step: number
  bar: number
  notes: NoteEvent[]
  motif: MotifNote[]
  done: boolean
  el?: HTMLAudioElement
}

const LOOKAHEAD = 0.15
const LOOKAHEAD_HIDDEN = 1.4

export class MusicEngine {
  private ctx: AudioContext | null = null
  private rig: Rig | null = null
  private spin: Spin | null = null
  private fading: { spin: Spin; until: number }[] = []
  private timer = 0
  private lookahead = LOOKAHEAD
  /**
   * What the listener asked for last, and a counter that moves on every ask.
   * Pausing and waking the audio clock both take time; when they finish they
   * check the counter, so a quick second tap always wins.
   */
  private want: "play" | "pause" = "pause"
  private turn = 0
  private stateCheck = 0
  /** The recorded instruments' bytes, on their way since `preload`: the core first, the lo-fi instruments after. */
  private sampleBytes: Promise<Bytes> | null = null
  private instrumentBytes: Promise<Bytes> | null = null
  /** Called when the record playing now reaches its end. */
  onEnded: (() => void) | null = null
  /** Called when the system takes the audio away (a call, the lock screen), so the UI can show it paused. */
  onInterrupt: (() => void) | null = null

  get analyser(): AnalyserNode | null {
    return this.rig?.analyser ?? null
  }

  /** Whether a record is on the platter, playing or paused. */
  get hasTrack(): boolean {
    return !!this.spin
  }

  /**
   * Start fetching the recorded instruments (a Wurlitzer and a drum kit)
   * before the first tap, so they're usually ready when it comes. Until they
   * are, and if they never load, the synthesised instruments play.
   */
  preload(src: SampleSource) {
    if (this.sampleBytes) return
    this.sampleBytes = fetchSamples(src)
    this.instrumentBytes = this.sampleBytes.then(() => fetchSamples(src, INSTRUMENT_FILES))
    this.attachSamples()
  }

  private attachSamples() {
    const ctx = this.ctx
    const rig = this.rig
    if (!ctx || !rig || !this.sampleBytes || rig.samples.current) return
    const instruments = this.instrumentBytes
    void this.sampleBytes
      .then((bytes) => decodeSamples(ctx, bytes))
      .then(async (bank) => {
        if (this.rig !== rig) return
        rig.samples.current = bank
        // the lo-fi instruments join the bank as they arrive; their synth stand-ins play until then
        if (instruments) Object.assign(bank.inst, await decodeInstruments(ctx, await instruments))
      })
      .catch(() => undefined)
  }

  /** Browsers only start audio from a user gesture: call this inside one. */
  unlock(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext({ latencyHint: "playback" })
      this.rig = createRig(this.ctx, this.ctx.destination, true)
      this.attachSamples()
      this.ctx.addEventListener("statechange", this.onState)
      document.addEventListener("visibilitychange", this.onVisibility)
      this.onVisibility()
      // iOS: play through the silent switch, like a music app does
      const nav = navigator as Navigator & { audioSession?: { type: string } }
      if (nav.audioSession) nav.audioSession.type = "playback"
    }
    // Ask even when it reads "running": a suspend we asked for earlier may not have landed yet.
    if (this.ctx.state !== "closed") void this.ctx.resume().catch(() => undefined)
    return this.ctx
  }

  play(source: TrackSource) {
    const wasPaused = this.want === "pause"
    this.want = "play"
    this.turn++
    const ctx = this.unlock()
    const rig = this.rig!
    // a paused record goes silent at once, its reverb tail too, rather than coming back under the new one
    const cut = wasPaused && !!this.spin
    if (cut) {
      // records still fading out were frozen mid-fade by the pause: cut them too
      for (const f of this.fading) fadeDeck(f.spin.deck, ctx.currentTime, 0, 0)
      freshReverb(rig)
    }
    this.lift(cut ? 0 : 0.35)
    const now = ctx.currentTime
    rig.master.gain.cancelScheduledValues(now)
    rig.master.gain.setTargetAtTime(MASTER_LEVEL, now, 0.02)

    const deck = createDeck(rig, source.kind === "generated" ? source.spec.bpm : 120, source.kind === "generated" && source.spec.style === "lofi")
    needleDrop(ctx, deck, now + 0.05)
    const spin: Spin = { source, deck, start: now + 0.4, step: 0, bar: -1, notes: [], motif: [], done: false }
    if (source.kind === "generated") {
      spin.motif = motifOf(source.spec)
      startTexture(ctx, deck, source.spec.texture, now + 0.25, source.spec.seed)
    } else {
      const el = new Audio()
      el.crossOrigin = "anonymous"
      el.preload = "auto"
      el.src = source.src
      const node = ctx.createMediaElementSource(el)
      node.connect(deck.dry)
      deck.nodes.push(node)
      el.addEventListener("ended", () => this.finish(spin))
      spin.el = el
      window.setTimeout(() => {
        if (this.spin === spin && this.want === "play") void el.play().catch(() => undefined)
      }, 350)
    }
    this.spin = spin
    this.tick()
    this.startTimer()
    // if the clock was asleep and won't wake (a call holds the audio), find out and say so
    if (ctx.state !== "running") this.onState()
  }

  /** Fade out and freeze the audio clock, so resume picks up on the same 16th. */
  async pause() {
    this.want = "pause"
    const turn = ++this.turn
    const ctx = this.ctx
    if (!ctx || ctx.state === "closed") return
    const g = this.rig!.master.gain
    g.cancelScheduledValues(ctx.currentTime)
    g.setTargetAtTime(0, ctx.currentTime, 0.04)
    this.spin?.el?.pause()
    await new Promise((r) => window.setTimeout(r, 160))
    if (turn !== this.turn || ctx !== this.ctx) return
    this.stopTimer()
    await ctx.suspend().catch(() => undefined)
  }

  async resume() {
    this.want = "play"
    const turn = ++this.turn
    const ctx = this.unlock()
    // a resume that isn't allowed may never settle, so don't wait on it for ever
    await Promise.race([ctx.resume().catch(() => undefined), new Promise((r) => window.setTimeout(r, 1000))])
    if (turn !== this.turn || ctx !== this.ctx) return
    // refused (no user gesture, another app holding the audio): say so rather than show playing over silence
    if (ctx.state !== "running") return this.interrupt()
    const g = this.rig!.master.gain
    g.cancelScheduledValues(ctx.currentTime)
    g.setTargetAtTime(MASTER_LEVEL, ctx.currentTime, 0.05)
    if (this.spin?.el) void this.spin.el.play().catch(() => undefined)
    this.startTimer()
  }

  /** Seconds into the record and its length. */
  position(): { elapsed: number; duration: number } {
    const s = this.spin
    if (!s || !this.ctx) return { elapsed: 0, duration: 0 }
    if (s.el) return { elapsed: s.el.currentTime || 0, duration: Number.isFinite(s.el.duration) ? s.el.duration : 0 }
    const spec = (s.source as { spec: TrackSpec }).spec
    const duration = durationOf(spec)
    return { elapsed: Math.min(Math.max(this.ctx.currentTime - s.start, 0), duration), duration }
  }

  dispose() {
    this.want = "pause"
    this.turn++
    this.stopTimer()
    window.clearTimeout(this.stateCheck)
    document.removeEventListener("visibilitychange", this.onVisibility)
    this.ctx?.removeEventListener("statechange", this.onState)
    for (const s of [this.spin, ...this.fading.map((f) => f.spin)]) if (s) this.teardown(s)
    this.spin = null
    this.fading = []
    void this.ctx?.close().catch(() => undefined)
    this.ctx = null
    this.rig = null
  }

  private startTimer() {
    if (!this.timer && this.spin && this.want === "play") this.timer = window.setInterval(this.tick, 25)
  }

  private stopTimer() {
    window.clearInterval(this.timer)
    this.timer = 0
  }

  private onVisibility = () => {
    this.lookahead = document.hidden ? LOOKAHEAD_HIDDEN : LOOKAHEAD
    // book the longer stretch now, before the browser slows the timer down
    if (this.want === "play") this.tick()
  }

  /**
   * The audio clock can also stop or start on its own: iOS suspends it for a
   * call or the lock screen and may start it again afterwards, and some
   * browsers report our own suspend a little late. Once things are quiet for
   * a moment, make the clock match what was asked for last.
   */
  private onState = () => {
    window.clearTimeout(this.stateCheck)
    this.stateCheck = window.setTimeout(this.reconcile, 300)
  }

  private reconcile = async () => {
    const ctx = this.ctx
    if (!ctx || ctx.state === "closed") return
    if (this.want === "play" && ctx.state !== "running") {
      // try once to wake it; only a clock that won't wake is an interruption
      const turn = this.turn
      await Promise.race([ctx.resume().catch(() => undefined), new Promise((r) => window.setTimeout(r, 1000))])
      // the state may have changed while we waited
      const now = ctx.state as AudioContextState
      if (ctx === this.ctx && turn === this.turn && this.want === "play" && now !== "running") this.interrupt()
    } else if (this.want === "pause" && ctx.state === "running") {
      this.rig?.master.gain.setValueAtTime(0, ctx.currentTime)
      void ctx.suspend().catch(() => undefined)
    }
  }

  /** Stop as if paused, and tell the UI. */
  private interrupt() {
    this.want = "pause"
    this.turn++
    this.stopTimer()
    if (this.ctx) this.rig?.master.gain.setValueAtTime(0, this.ctx.currentTime)
    this.spin?.el?.pause()
    this.onInterrupt?.()
  }

  /** Lift the needle off the current record. */
  private lift(seconds: number) {
    const s = this.spin
    const ctx = this.ctx
    if (!s || !ctx) return
    this.spin = null
    fadeDeck(s.deck, ctx.currentTime, 0, seconds)
    if (s.el) window.setTimeout(() => s.el?.pause(), seconds * 1000)
    this.fading.push({ spin: s, until: ctx.currentTime + seconds + 0.4 })
  }

  private finish(s: Spin) {
    if (this.spin !== s) return
    this.lift(2.5)
    this.onEnded?.()
  }

  private teardown(s: Spin) {
    if (s.el) {
      s.el.pause()
      s.el.removeAttribute("src")
      s.el.load()
    }
    teardownDeck(s.deck)
  }

  private tick = () => {
    const ctx = this.ctx
    if (!ctx) return
    const s = this.spin
    if (s && s.source.kind === "generated") {
      const spec = s.source.spec
      if (!s.done) scheduleSteps(ctx, s, spec, ctx.currentTime + this.lookahead, ctx.currentTime - 0.03)
      // a record that runs out mid-pause ends on resume, not behind the listener's back
      if (s.done && this.want === "play" && ctx.currentTime >= s.start + durationOf(spec)) this.finish(s)
    }
    this.fading = this.fading.filter((f) => {
      if (ctx.currentTime < f.until) return true
      this.teardown(f.spin)
      return false
    })
    if (!this.spin && !this.fading.length) this.stopTimer()
  }
}

/** Book every 16th that starts before `horizon`. Notes already late (a stalled tab) are skipped, not crammed in. */
function scheduleSteps(ctx: BaseAudioContext, s: Spin, spec: TrackSpec, horizon: number, late = -Infinity, endBar = spec.bars) {
  const sd = stepSeconds(spec)
  for (;;) {
    const t = s.start + s.step * sd
    if (t >= horizon) return
    const bar = Math.floor(s.step / STEPS)
    if (bar >= endBar) {
      s.done = true
      return
    }
    if (bar !== s.bar) {
      s.bar = bar
      s.notes = composeBar(spec, bar, s.motif)
    }
    const at = s.step % STEPS
    const when = t + (at % 2 ? (spec.swing ?? 0) * sd : 0)
    if (when >= late) {
      let order = 0
      for (const ev of s.notes) if (ev.step === at) playNote(ctx, s.deck, ev, Math.max(0, late, when + feel(ev, s.step, ev.voice === "keys" ? order++ : 0) + (spec.style === "lofi" ? lazy(ev) : 0)), sd, spec.lead, spec.keys)
    }
    s.step++
  }
}

/**
 * Render bars of a song without speakers, for tests and audio previews. Pass
 * the OfflineAudioContext constructor when not in a browser.
 */
export async function renderOffline(
  spec: TrackSpec,
  opts: {
    fromBar?: number
    bars?: number
    sampleRate?: number
    Offline?: new (channels: number, length: number, sampleRate: number) => OfflineAudioContext
    /** The recorded instruments' bytes; left out, the synthesised instruments play. */
    samples?: Bytes
  } = {},
): Promise<AudioBuffer> {
  const fromBar = opts.fromBar ?? 0
  const bars = Math.min(opts.bars ?? spec.bars, spec.bars - fromBar)
  const rate = opts.sampleRate ?? 44100
  const Offline = opts.Offline ?? OfflineAudioContext
  const ctx = new Offline(2, Math.ceil((bars * barSeconds(spec) + 2.5) * rate), rate)
  const rig = createRig(ctx, ctx.destination, false)
  if (opts.samples) rig.samples.current = await decodeSamples(ctx, opts.samples)
  const deck = createDeck(rig, spec.bpm, spec.style === "lofi")
  startTexture(ctx, deck, spec.texture, 0, spec.seed)
  const s: Spin = { source: { kind: "generated", spec }, deck, start: -fromBar * barSeconds(spec), step: fromBar * STEPS, bar: -1, notes: [], motif: motifOf(spec), done: false }
  scheduleSteps(ctx, s, spec, Infinity, -Infinity, fromBar + bars)
  return ctx.startRendering()
}

/** Lo-fi sits further back: the snare and keys late, the hats dragging a little. */
function lazy(ev: NoteEvent): number {
  if (ev.voice === "snare" || ev.voice === "rim") return 0.018
  if (ev.voice === "keys" || ev.voice === "lead") return 0.012
  if (ev.voice === "hat") return 0.008
  return 0
}

/**
 * Where a player puts the note against the grid, in seconds: drums sit a hair
 * behind, the bass a hair ahead, hats wander a little, and the keys roll each
 * chord from the bottom up. Deterministic, so a record plays the same each time.
 */
export function feel(ev: NoteEvent, step: number, order: number): number {
  const x = Math.sin(step * 12.9898 + order * 78.233 + ev.midi * 3.7) * 43758.5453
  const j = x - Math.floor(x) - 0.5
  switch (ev.voice) {
    case "kick":
      return 0.004
    case "snare":
    case "rim":
      return 0.009 + j * 0.004
    case "hat":
    case "shaker":
      return 0.003 + j * 0.008
    case "bass":
      return -0.004 + j * 0.003
    case "keys":
      return 0.004 + order * 0.007
    default:
      return j * 0.004
  }
}
