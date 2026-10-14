"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Pause, Play, ArrowUpRight } from "lucide-react";
import { recordDiscs } from "@/lib/records/catalog";
import { getRecordEngine, startSiteAudio, unlockSiteAudio, toggleRecord, advanceRecord, useRecordPlayback } from "@/lib/records/playback";
import "./site-sound.css";

export function SiteSound() {
  const pathname = usePathname();
  const { loaded, playing } = useRecordPlayback();
  const record = recordDiscs[loaded ?? 0];
  useEffect(() => {
    startSiteAudio();
    document.addEventListener("click", unlockSiteAudio);
    document.addEventListener("keydown", unlockSiteAudio);
    return () => { document.removeEventListener("click", unlockSiteAudio); document.removeEventListener("keydown", unlockSiteAudio); };
  }, []);
  useEffect(() => {
    if (pathname === "/records") return;
    const e = getRecordEngine();
    e.onEnded = advanceRecord;
    const ms = navigator.mediaSession;
    if (!ms) return;
    ms.metadata = new MediaMetadata({title:record.title,artist:"Lakkan Records"});
    ms.playbackState = playing ? "playing" : "paused";
    ms.setActionHandler("play", () => { if (!e.isPlaying) toggleRecord(); });
    ms.setActionHandler("pause", () => { if (e.isPlaying) toggleRecord(); });
    ms.setActionHandler("nexttrack", advanceRecord);
    return () => { ms.setActionHandler("play", null); ms.setActionHandler("pause", null); ms.setActionHandler("nexttrack", null); };
  }, [pathname, record.title, playing]);
  if (pathname === "/records") return null;
  return <aside className="site-sound" aria-label="Lakkan Records 音楽プレイヤー" data-playing={playing}>
    <button type="button" onClick={()=>toggleRecord()} aria-label={playing ? "音楽を停止" : "音楽を再生"} aria-pressed={playing}>
      <span className="site-sound-disc"><Image src={record.src!} alt="" width={42} height={42}/></span>
      {playing ? <Pause size={15} aria-hidden="true"/> : <Play size={15} aria-hidden="true"/>}
    </button>
    <Link href="/records"><span>{playing ? "NOW PLAYING" : "SOUND OFF"}</span><strong>{playing ? record.title : "Lakkanを聴く"}</strong><ArrowUpRight size={14} aria-hidden="true"/></Link>
  </aside>;
}
