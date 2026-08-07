"use client";

import { ACCENT } from "@/lib/design-tokens";

/** Deterministic pseudo-random series scaled to a target ending value. */
function buildSeries(target: number, points = 30, seed = 1): number[] {
  // Simple LCG for deterministic noise
  let s = seed * 9301 + 49297;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const arr: number[] = [];
  // Start lower, drift upward to roughly `target`
  let v = Math.max(1, target * 0.4);
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    const trend = target * (0.4 + 0.6 * t);
    const noise = (rand() - 0.5) * Math.max(1, target * 0.18);
    v = trend + noise;
    arr.push(Math.max(0, Math.round(v)));
  }
  // Pin last to target so the dot lands on the actual value
  arr[arr.length - 1] = target;
  return arr;
}

export function Sparkline({
  target,
  seed = 1,
  width = 80,
  height = 24,
  color = "#132126",
  pointColor = ACCENT.vermillion,
}: {
  target: number;
  seed?: number;
  width?: number;
  height?: number;
  color?: string;
  pointColor?: string;
}) {
  const data = buildSeries(target, 30, seed);
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = Math.max(1, max - min);
  const stepX = width / (data.length - 1);
  const yOf = (v: number) => height - ((v - min) / range) * (height - 4) - 2;

  const path = data.map((v, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${yOf(v)}`).join(" ");
  const lastX = (data.length - 1) * stepX;
  const lastY = yOf(data[data.length - 1]);

  return (
    <svg width={width} height={height} style={{ display: "block", overflow: "visible" }} aria-hidden>
      <path d={path} fill="none" stroke={color} strokeWidth={1.2} strokeOpacity={0.5} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r={3} fill={pointColor} />
      <circle cx={lastX} cy={lastY} r={6} fill={pointColor} fillOpacity={0.18} />
    </svg>
  );
}
