"use client"

import * as React from "react"
import DiscCascadeCarousel, { type DiscCascadeCarouselProps, type DiscNavLink } from "@/components/ui/disc-cascade-carousel"
import NowPlaying, { type DeckState } from "@/components/records/now-playing"
import type { DiscRecord } from "@/lib/records/types"
import { MusicEngine, type TrackSource } from "@/lib/records/music/engine"
import type { SampleSource } from "@/lib/records/music/samples"

function sourceOf(r: DiscRecord): TrackSource {
  if (r.audio) return { kind: "file", src: r.audio }
  if (!r.track) throw new Error(`"${r.title}" has neither a song nor an audio file`)
  return { kind: "generated", spec: r.track }
}

/** "record" takes its colours from each disc's `stage`, so the whole page changes with the record. */
export type StageTheme = "night" | "ivory" | "copper" | "record" | "poster"

const INK: Record<StageTheme, string> = { night: "#ecebe7", ivory: "#16110D", copper: "#F4ECE0", record: "inherit", poster: "#141414" }

/** Records are a third bigger than CDs and sit a little closer along the line. */
const VINYL: Partial<DiscCascadeCarouselProps> = {
  discSize: "clamp(240px, min(68vmin, 50vw), 640px)",
  spacing: 0.86,
  rise: 0.2,
  roll: 70,
  sheen: 0.45,
}

const SAMPLES: SampleSource = { base: "/samples/", ext: "flac" }

/** What a custom layout over the stage can read and do. */
export type PlayerApi = {
  index: number
  /** The disc shown in the transport: the one playing, else the one browsed. */
  shown: number
  record: DiscRecord
  state: DeckState
  playing: boolean
  toggle: () => void
  go: (i: number) => void
  step: (by: number) => void
  /** Props for a `NowPlaying` placed by the layout. */
  transport: React.ComponentProps<typeof NowPlaying>
}

type Props = {
  /** Stage colours: the original night stage, or Lakkan's ivory or copper. */
  theme?: StageTheme
  /** Anything to lay over the stage, such as a credit line. */
  children?: React.ReactNode
  /** A panel that follows the disc being browsed, in place of the press quotes. */
  aside?: (record: DiscRecord, index: number) => React.ReactNode
  nav?: DiscNavLink[]
  indexLabel?: string
  /** A whole layout over the stage, drawn from the player's state. */
  overlay?: (api: PlayerApi) => React.ReactNode
  /** Keep the built-in transport in the bottom-left corner. */
  transport?: boolean
  /** Anything else to hand the carousel, such as `details={false}` or a `discSize`. */
  carousel?: Partial<DiscCascadeCarouselProps>
  /** A name for the layout, as `data-layout` on the stage for its styles. */
  layout?: string
  /** Silver CDs, or 12-inch records: larger, black, grooved, with a paper label. */
  medium?: "cd" | "vinyl"
  records: DiscRecord[]
  defaultIndex?: number
  /** Where the recorded instruments are served (see public/samples), or false for the synths alone. */
  samples?: SampleSource | false
  brand?: string
  serif: string
  sans: string
  display: string
}

/**
 * A record player around the Disc Cascade Carousel. The disc in the middle is
 * the one on the platter: click it (or press space) to play, browse while it
 * plays to change records, and when a record ends the next one drops. Discs
 * only turn while the music does.
 */
export default function DiscPlayer({
  records,
  defaultIndex = 0,
  samples = SAMPLES,
  brand = "side/b",
  serif,
  sans,
  display,
  theme = "night",
  children,
  aside,
  nav = [{ label: "Records" }, { label: "Sessions" }],
  indexLabel = "Catalogue",
  overlay,
  transport = true,
  carousel,
  layout,
  medium = "cd",
}: Props) {
  const n = records.length
  const [index, setIndex] = React.useState(defaultIndex)
  /** The record on the platter, once one has been played. */
  const [loaded, setLoaded] = React.useState<number | null>(null)
  const [playing, setPlaying] = React.useState(false)
  /** A pointer is down on the stage: a drag may still be choosing a record. */
  const [held, setHeld] = React.useState(false)
  const heldRef = React.useRef(false)
  /** A record ran out mid-drag; what plays next is settled on release. */
  const endedWhileHeld = React.useRef(false)
  const engineRef = React.useRef<MusicEngine | null>(null)
  const glowRef = React.useRef<HTMLDivElement>(null)
  const now = React.useRef({ index, loaded, playing })
  React.useEffect(() => {
    now.current = { index, loaded, playing }
  })

  const engine = React.useCallback(() => (engineRef.current ??= new MusicEngine()), [])
  const peek = React.useCallback(() => engineRef.current, [])

  // fetch the recorded instruments now, so they're ready by the first tap
  React.useEffect(() => {
    if (samples !== false) engine().preload(samples, records.flatMap((r) => (r.track ? [r.track] : [])))
  }, [engine, samples, records])

  const hold = React.useCallback((on: boolean) => {
    heldRef.current = on
    setHeld(on)
  }, [])

  const drop = React.useCallback(
    (i: number) => {
      engine().play(sourceOf(records[i]))
      endedWhileHeld.current = false
      now.current = { ...now.current, loaded: i, playing: true }
      setLoaded(i)
      setPlaying(true)
    },
    [engine, records],
  )

  const toggle = React.useCallback(() => {
    const { index, loaded, playing } = now.current
    if (playing) {
      void engine().pause()
      now.current.playing = false
      setPlaying(false)
    } else if (loaded === index && engine().hasTrack) {
      void engine().resume()
      now.current.playing = true
      setPlaying(true)
    } else drop(index)
  }, [drop, engine])

  /** Clicking the disc in the middle: play or pause it if it's on the platter, otherwise put it on. */
  const select = React.useCallback(
    (_item: unknown, i: number) => {
      if (i === now.current.loaded) toggle()
      else drop(i)
    },
    [drop, toggle],
  )

  const step = React.useCallback((by: number) => setIndex((i) => (i + by + n) % n), [n])

  /** After a record ends: one the listener had just browsed to, else the next in the crate. */
  const advance = React.useCallback(() => {
    const { index, loaded } = now.current
    const next = loaded != null && index !== loaded ? index : ((loaded ?? index) + 1) % n
    setIndex(next)
    drop(next)
  }, [drop, n])

  // an album: when a record ends, the next one drops (or, mid-drag, once the drag lets go)
  React.useEffect(() => {
    const e = engine()
    e.onEnded = () => {
      if (heldRef.current) endedWhileHeld.current = true
      else advance()
    }
    e.onInterrupt = () => {
      now.current.playing = false
      setPlaying(false)
    }
    return () => {
      e.onEnded = null
      e.onInterrupt = null
    }
  }, [advance, engine])

  // browsing while the music plays changes the record, once the carousel is let go and settles
  React.useEffect(() => {
    if (!playing || held) return
    const ended = endedWhileHeld.current
    if (!ended && loaded === index) return
    const t = window.setTimeout(
      () => {
        // paused from outside React (media keys, an interruption) since this was set
        if (!now.current.playing) return
        if (endedWhileHeld.current) advance()
        // read fresh: another drop may have landed since this was set
        else if (now.current.loaded !== now.current.index) drop(now.current.index)
      },
      ended ? 0 : 280,
    )
    return () => window.clearTimeout(t)
  }, [index, loaded, playing, held, drop, advance])

  // let go wherever the pointer comes up, or if the window loses it mid-press
  React.useEffect(() => {
    if (!held) return
    const up = () => hold(false)
    window.addEventListener("pointerup", up, true)
    window.addEventListener("pointercancel", up, true)
    window.addEventListener("blur", up)
    // ctrl-click on a Mac opens a menu that swallows the pointerup
    window.addEventListener("contextmenu", up)
    return () => {
      window.removeEventListener("pointerup", up, true)
      window.removeEventListener("pointercancel", up, true)
      window.removeEventListener("blur", up)
      window.removeEventListener("contextmenu", up)
    }
  }, [held, hold])

  // space plays and pauses, except where space already means something
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return
      if ((e.target as HTMLElement).closest?.("button, a, input, textarea, select, [contenteditable]")) return
      e.preventDefault()
      toggle()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [toggle])

  // media keys and the lock screen
  React.useEffect(() => {
    const ms = navigator.mediaSession
    if (!ms) return
    const handlers: [MediaSessionAction, () => void][] = [
      ["play", () => !now.current.playing && toggle()],
      ["pause", () => now.current.playing && toggle()],
      ["nexttrack", () => step(1)],
      ["previoustrack", () => step(-1)],
    ]
    for (const [a, h] of handlers) {
      try {
        ms.setActionHandler(a, h)
      } catch {
        /* unsupported action */
      }
    }
    return () => {
      for (const [a] of handlers) {
        try {
          ms.setActionHandler(a, null)
        } catch {
          /* unsupported action */
        }
      }
    }
  }, [toggle, step])

  React.useEffect(() => {
    const ms = navigator.mediaSession
    if (!ms || loaded == null) return
    const r = records[loaded]
    ms.metadata = new MediaMetadata({
      title: r.title,
      artist: brand,
      artwork: r.src ? [{ src: r.src, sizes: "600x600", type: "image/jpeg" }] : [],
    })
    ms.playbackState = playing ? "playing" : "paused"
  }, [loaded, playing, records, brand])

  React.useEffect(
    () => () => {
      engineRef.current?.dispose()
      engineRef.current = null
      // after a hot reload the component lives on with a fresh, empty engine
      now.current = { ...now.current, loaded: null, playing: false }
      setLoaded(null)
      setPlaying(false)
    },
    [],
  )

  const shown = playing && loaded != null ? loaded : index
  const state: DeckState = playing ? "playing" : loaded === index ? "paused" : "idle"
  const tp: React.ComponentProps<typeof NowPlaying> = {
    engine: peek,
    title: records[shown].title,
    number: shown + 1,
    state,
    onToggle: toggle,
    glow: glowRef,
    serif,
    bpm: records[shown].track?.bpm,
  }
  const stage = records[index].stage
  const vars: Record<string, string> = { "--dr-glow": records[shown].glow }
  if (stage) vars["--rec-bg"] = stage.bg
  if (theme === "record" && stage) Object.assign(vars, { "--dr-bg": stage.bg, "--dr-ink": stage.ink, "--dr-accent": stage.accent })

  return (
    <div
      className="dr-stage"
      data-theme={theme}
      data-layout={layout}
      data-medium={medium}
      data-aside={aside ? "" : undefined}
      onPointerDown={(e) => e.button === 0 && !e.ctrlKey && hold(true)}
      style={vars as React.CSSProperties}
    >
      <div ref={glowRef} className="dr-glow" aria-hidden="true" />
      <DiscCascadeCarousel
        items={records}
        index={index}
        onIndexChange={setIndex}
        onSelect={select}
        brand={brand}
        nav={nav}
        indexLabel={indexLabel}
        reviews={!aside}
        loop
        spin={7.2}
        hint=""
        background="transparent"
        color={INK[theme]}
        serif={serif}
        sans={sans}
        display={display}
        className={playing ? "" : "dr-still"}
        ariaLabel="Record player"
        {...(medium === "vinyl" ? VINYL : null)}
        {...carousel}
      />
      {transport ? <NowPlaying {...tp} /> : null}
      {overlay ? <Layer render={overlay} api={{ index, shown, record: records[index], state, playing, toggle, go: setIndex, step, transport: tp }} /> : null}
      {aside ? (
        <div className="lk-aside-wrap" key={index}>
          {aside(records[index], index)}
        </div>
      ) : null}
      {children}
      <div className="sr-only" aria-live="polite">
        {playing && loaded != null ? "Now playing " + records[loaded].title : ""}
      </div>
    </div>
  )
}

/** Draws a layout from the player's state. */
function Layer({ render, api }: { render: (api: PlayerApi) => React.ReactNode; api: PlayerApi }) {
  return <>{render(api)}</>
}
