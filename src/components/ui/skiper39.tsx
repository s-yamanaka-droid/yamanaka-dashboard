"use client";

import { useEffect, useRef, useState } from "react";

type Peep = {
  tile: number;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  direction: 1 | -1;
  phase: number;
  lane: number;
};

type CrowdCanvasProps = {
  src: string;
  label?: string;
  className?: string;
};

const COLS = 15;
const ROWS = 7;

/** Adapted from Skiper UI's CrowdCanvas, using the supplied Open Peeps sprite. */
export default function CrowdCanvas({ src, label = "さまざまな人たちが行き交うイラスト", className = "" }: CrowdCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const image = new Image();
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let visible = false;
    let loaded = false;
    let width = 0;
    let height = 0;
    let last = 0;
    let peeps: Peep[] = [];

    const makePeep = (index: number, count: number): Peep => {
      const lane = index % 4;
      const scale = 0.72 + lane * 0.12;
      const personWidth = Math.max(100, Math.min(190, width / 8)) * scale;
      const personHeight = personWidth * (324 / 240);
      return {
        tile: (index * 23 + Math.floor(Math.random() * 17)) % (COLS * ROWS),
        x: ((index + Math.random() * 0.6) / count) * (width + personWidth * 2) - personWidth,
        y: height * (0.13 + lane * 0.17),
        width: personWidth,
        height: personHeight,
        speed: (18 + lane * 7 + Math.random() * 11) * (Math.random() > 0.5 ? 1 : -1),
        direction: Math.random() > 0.5 ? 1 : -1,
        phase: Math.random() * Math.PI * 2,
        lane,
      };
    };

    const draw = (now: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      if (!loaded) return;
      const tileWidth = image.naturalWidth / COLS;
      const tileHeight = image.naturalHeight / ROWS;
      for (const peep of peeps) {
        const bob = motion.matches ? 0 : Math.sin(now * 0.008 + peep.phase) * 3;
        context.save();
        context.translate(peep.x + peep.width / 2, peep.y + bob);
        context.scale(peep.direction, 1);
        context.globalAlpha = 0.7 + peep.lane * 0.1;
        context.drawImage(
          image,
          (peep.tile % COLS) * tileWidth,
          Math.floor(peep.tile / COLS) * tileHeight,
          tileWidth,
          tileHeight,
          -peep.width / 2,
          0,
          peep.width,
          peep.height,
        );
        context.restore();
      }
    };

    const frame = (now: number) => {
      if (!visible || motion.matches) return;
      const delta = Math.min((now - (last || now)) / 1000, 0.05);
      last = now;
      for (const peep of peeps) {
        peep.x += peep.speed * delta;
        if (peep.speed > 0 && peep.x > width + peep.width) peep.x = -peep.width;
        if (peep.speed < 0 && peep.x < -peep.width) peep.x = width + peep.width;
      }
      draw(now);
      raf = requestAnimationFrame(frame);
    };

    const sync = () => {
      cancelAnimationFrame(raf);
      last = 0;
      draw(performance.now());
      if (visible && loaded && !motion.matches) raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const count = Math.min(48, Math.max(20, Math.ceil(width / 30)));
      peeps = Array.from({ length: count }, (_, index) => makePeep(index, count));
      sync();
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    motion.addEventListener("change", sync);
    image.onload = () => {
      loaded = true;
      setFailed(false);
      sync();
    };
    image.onerror = () => setFailed(true);
    image.src = src;
    resize();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      motion.removeEventListener("change", sync);
      image.onload = null;
      image.onerror = null;
    };
  }, [src]);

  return (
    <div className={`crowd-canvas-wrap ${className}`}>
      <canvas ref={canvasRef} className="crowd-canvas" role="img" aria-label={label} />
      {failed && <p className="crowd-fallback">人と仕事のあいだに、いい動きを。</p>}
    </div>
  );
}
