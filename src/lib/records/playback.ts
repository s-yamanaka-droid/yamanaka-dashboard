"use client";

import { useSyncExternalStore } from "react";
import { MusicEngine } from "./music/engine";
import { recordDiscs } from "./catalog";

type Playback = { loaded: number | null; playing: boolean };
const initial: Playback = { loaded: null, playing: false };
let snapshot = initial;
let engine: MusicEngine | null = null;
let autoplayPending = true;
const listeners = new Set<() => void>();
function update(next: Partial<Playback>) {
  snapshot = { ...snapshot, ...next };
  listeners.forEach(listener => listener());
}
export function peekRecordEngine() { return engine; }
export function getRecordEngine() {
  if (!engine) {
    engine = new MusicEngine();
    engine.preload({base:"/records/samples/",ext:"flac"}, recordDiscs[0].track ? [recordDiscs[0].track] : []);
    engine.onPlaybackChange = playing => {
      if (playing) autoplayPending = false;
      update({ playing });
    };
    engine.onEnded = advanceRecord;
  }
  return engine;
}
function rememberPause(paused: boolean) {
  try { sessionStorage.setItem("lakkan-sound-paused", String(paused)); } catch { /* storage is optional */ }
}
export function playRecord(index: number, automatic = false) {
  if (!automatic) { autoplayPending = false; rememberPause(false); }
  const record = recordDiscs[index];
  update({ loaded: index });
  const e = getRecordEngine();
  if (record.audio) e.play({ kind: "file", src: record.audio });
  else if (record.track) e.play({ kind: "generated", spec: record.track });
}
export function pauseRecord() {
  autoplayPending = false;
  rememberPause(true);
  void getRecordEngine().pause();
}
export function resumeRecord() {
  autoplayPending = false;
  rememberPause(false);
  void getRecordEngine().resume();
}
export function toggleRecord(index = snapshot.loaded ?? 0) {
  if (snapshot.playing) pauseRecord();
  else if (snapshot.loaded === index && getRecordEngine().hasTrack) resumeRecord();
  else playRecord(index);
}
export function advanceRecord() { playRecord(((snapshot.loaded ?? 0) + 1) % recordDiscs.length); }
export function startSiteAudio() {
  try { if (sessionStorage.getItem("lakkan-sound-paused") === "true") autoplayPending = false; } catch { /* storage is optional */ }
  if (autoplayPending && !snapshot.playing) playRecord(snapshot.loaded ?? 0, true);
}
export function unlockSiteAudio(event: Event) {
  if (!autoplayPending || snapshot.playing || !event.isTrusted) return;
  if (event instanceof KeyboardEvent && (event.key !== "Enter" && event.key !== " ")) return;
  if ((event.target as Element)?.closest?.("button,input,textarea,select,[contenteditable],.dr-stage")) return;
  // One eligible gesture; explicit pause/play always wins and is never retried.
  autoplayPending = false;
  playRecord(snapshot.loaded ?? 0, true);
}
export function useRecordPlayback() {
  return useSyncExternalStore(listener => { listeners.add(listener); return () => listeners.delete(listener); }, () => snapshot, () => initial);
}
