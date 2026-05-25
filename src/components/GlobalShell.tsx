"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useScroll, useSpring } from "framer-motion";

/* ─── Cursor Follower ───────────────────────────────── */
function CursorFollower() {
  const dot  = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const m    = useRef({ x: -200, y: -200 });
  const r    = useRef({ x: -200, y: -200 });
  const col  = useRef("");

  useEffect(() => {
    const move = (e: MouseEvent) => {
      m.current = { x: e.clientX, y: e.clientY };
      if (dot.current) dot.current.style.transform = `translate(${e.clientX - 4}px,${e.clientY - 4}px)`;
    };
    const color = (e: Event) => { col.current = (e as CustomEvent<string>).detail; };
    window.addEventListener("mousemove", move);
    window.addEventListener("cursor-color", color);
    let raf: number;
    const tick = () => {
      r.current.x += (m.current.x - r.current.x) * 0.09;
      r.current.y += (m.current.y - r.current.y) * 0.09;
      if (ring.current) {
        ring.current.style.transform = `translate(${r.current.x - 22}px,${r.current.y - 22}px)`;
        ring.current.style.borderColor = col.current || "rgba(13,13,13,0.32)";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("cursor-color", color);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dot} style={{ position:"fixed",top:0,left:0,width:8,height:8,background:"#0D0D0D",borderRadius:"50%",pointerEvents:"none",zIndex:9999,willChange:"transform" }}/>
      <div ref={ring} style={{ position:"fixed",top:0,left:0,width:44,height:44,border:"1.5px solid rgba(13,13,13,0.32)",borderRadius:"50%",pointerEvents:"none",zIndex:9998,willChange:"transform",transition:"border-color 0.3s" }}/>
    </>
  );
}

/* ─── Scroll Progress Bar ───────────────────────────── */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 40 });
  return <motion.div style={{ position:"fixed",top:0,left:0,right:0,height:2,background:"#0D0D0D",transformOrigin:"0%",scaleX,zIndex:9997 }}/>;
}

export default function GlobalShell() {
  return (
    <>
      <CursorFollower />
      <ScrollProgressBar />
    </>
  );
}
