"use client";

import { useSyncExternalStore } from "react";
import { MusicEngine } from "./music/engine";
import { recordDiscs } from "./catalog";

type Playback = { loaded: number | null; playing: boolean };
const initial: Playback = { loaded: null, playing: false };
let snapshot = initial;
let engine: MusicEngine | null = null;
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
      update({ playing });
    };
    engine.onEnded = advanceRecord;
  }
  return engine;
}
export function playRecord(index: number) {
  const record = recordDiscs[index];
  update({ loaded: index });
  const e = getRecordEngine();
  if (record.audio) e.play({ kind: "file", src: record.audio });
  else if (record.track) e.play({ kind: "generated", spec: record.track });
}
export function pauseRecord() {
  void getRecordEngine().pause();
}
export function resumeRecord() {
  void getRecordEngine().resume();
}
export function toggleRecord(index = snapshot.loaded ?? 0) {
  if (snapshot.playing) pauseRecord();
  else if (snapshot.loaded === index && getRecordEngine().hasTrack) resumeRecord();
  else playRecord(index);
}
export function advanceRecord() { playRecord(((snapshot.loaded ?? 0) + 1) % recordDiscs.length); }
export function useRecordPlayback() {
  return useSyncExternalStore(listener => { listeners.add(listener); return () => listeners.delete(listener); }, () => snapshot, () => initial);
}
