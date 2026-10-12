"use client"

import * as React from "react"
import type { MusicEngine } from "@/lib/records/music/engine"
import { formatTime } from "@/lib/records/music/theory"

export type DeckState = "idle" | "playing" | "paused"

type Props = {
  engine: () => MusicEngine | null
  title: string
  /** 1-based position in the crate. */
  number: number
  state: DeckState
  onToggle: () => void
  /** The light behind the disc; gets `--e`, the bass level, and `--beat`, how far it just jumped, both 0 to 1. */
  glow: React.RefObject<HTMLDivElement | null>
  serif: string
  /** Extra class, for a layout that places the transport itself. */
  className?: string
  /** Tempo of the record playing. With it the stage gets `--pulse`, 1 on each beat falling to 0 before the next. */
  bpm?: number
}

const R = 20.5
const C = 2 * Math.PI * R
const BARS = 16

/**
 * The bottom-left transport: play/pause wrapped in a progress ring, what's on
 * the platter, and a small spectrum. Animation runs off the engine's analyser
 * in its own frame loop and writes to the DOM, so the carousel never re-renders
 * for it.
 */
export default function NowPlaying({ engine, title, number, state, onToggle, glow, serif, className = "", bpm }: Props) {
  const ring = React.useRef<SVGCircleElement>(null)
  const bar = React.useRef<HTMLSpanElement>(null)
  const time = React.useRef<HTMLSpanElement>(null)
  const canvas = React.useRef<HTMLCanvasElement>(null)
  const meter = React.useRef({ energy: 0, slow: 0, beat: 0, levels: new Float32Array(BARS), bins: null as Uint8Array<ArrayBuffer> | null })

  React.useEffect(() => {
    const m = meter.current
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let raf = 0
    const frame = () => {
      const e = engine()
      const { elapsed, duration } = state === "idle" || !e ? { elapsed: 0, duration: 0 } : e.position()
      ring.current?.style.setProperty("stroke-dashoffset", String(C * (1 - (duration ? elapsed / duration : 0))))
      bar.current?.style.setProperty("transform", `scaleX(${duration ? (elapsed / duration).toFixed(4) : 0})`)
      if (time.current) time.current.textContent = duration ? formatTime(elapsed) + " / " + formatTime(duration) : ""

      const an = state === "playing" ? e?.analyser : null
      let level = 0
      if (an) {
        if (!m.bins || m.bins.length !== an.frequencyBinCount) m.bins = new Uint8Array(an.frequencyBinCount)
        an.getByteFrequencyData(m.bins)
        level = (m.bins[1] + m.bins[2] + m.bins[3]) / 765
      }
      m.energy = Math.max(level, m.energy * 0.92)
      // a kick shows as the level jumping over its own running average
      m.slow = m.slow * 0.95 + level * 0.05
      m.beat = Math.max(Math.min(1, Math.max(0, (level - m.slow) * 6)), m.beat * 0.86)
      // the beat comes from the song's own clock, not from listening, so it never drifts
      const pulse = state === "playing" && bpm && duration ? Math.exp(-((elapsed * bpm) / 60 % 1) * 6) : 0
      if (!reduced) {
        glow.current?.style.setProperty("--e", m.energy.toFixed(3))
        glow.current?.style.setProperty("--beat", m.beat.toFixed(3))
        glow.current?.parentElement?.style.setProperty("--pulse", pulse.toFixed(3))
      }
      const moving = drawSpectrum(canvas.current, an ? m.bins : null, m.levels)
      if (state === "playing" || m.energy > 0.004 || m.beat > 0.004 || moving) raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [engine, state, glow, bpm])

  const label = state === "playing" ? "Now playing" : state === "paused" ? "Paused" : "Press play"
  return (
    <div className={"dr-player " + className} data-state={state}>
      <button type="button" className="dr-play" onClick={onToggle} aria-label={(state === "playing" ? "Pause " : "Play ") + title}>
        <svg className="dr-ring" viewBox="0 0 44 44" aria-hidden="true">
          <circle cx="22" cy="22" r={R} className="dr-ring-track" />
          <circle ref={ring} cx="22" cy="22" r={R} className="dr-ring-bar" strokeDasharray={C} strokeDashoffset={C} />
        </svg>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          {state === "playing" ? <path d="M6.5 4h3.5v16H6.5zM14 4h3.5v16H14z" /> : <path d="M7 4.2v15.6a.6.6 0 0 0 .9.5l12.3-7.8a.6.6 0 0 0 0-1L7.9 3.7a.6.6 0 0 0-.9.5z" />}
        </svg>
      </button>
      <div className="dr-meta">
        <div className="dr-kicker">
          <span>{label}</span>
          <span ref={time} className="dr-time" />
        </div>
        <div className="dr-title" style={{ fontFamily: serif }}>
          <span className="dr-num">{String(number).padStart(2, "0")}</span>
          {title}
        </div>
      </div>
      <canvas ref={canvas} className="dr-spec" aria-hidden="true" />
      <span className="dr-bar" aria-hidden="true">
        <span ref={bar} />
      </span>
    </div>
  )
}

/** Sixteen log-spaced bands that rise with the music and fall slowly. Returns whether any bar is still moving. */
function drawSpectrum(cv: HTMLCanvasElement | null, bins: Uint8Array | null, levels: Float32Array): boolean {
  let moving = false
  for (let i = 0; i < BARS; i++) {
    const target = bins ? bins[Math.round(2 * Math.pow(46, i / (BARS - 1)))] / 255 : 0
    levels[i] = Math.max(target, levels[i] * 0.86)
    if (levels[i] > 0.01) moving = true
  }
  if (!cv || !cv.clientWidth) return moving
  const dpr = window.devicePixelRatio || 1
  const w = cv.clientWidth
  const h = cv.clientHeight
  if (cv.width !== Math.round(w * dpr)) {
    cv.width = Math.round(w * dpr)
    cv.height = Math.round(h * dpr)
  }
  const g = cv.getContext("2d")
  if (!g) return moving
  g.setTransform(dpr, 0, 0, dpr, 0, 0)
  g.clearRect(0, 0, w, h)
  g.fillStyle = getComputedStyle(cv).color
  const bw = w / BARS
  for (let i = 0; i < BARS; i++) {
    const bh = Math.max(1, levels[i] * h)
    g.globalAlpha = 0.35 + levels[i] * 0.6
    g.fillRect(i * bw + bw * 0.25, h - bh, bw * 0.5, bh)
  }
  return moving
}
