"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * 3D 'L A K K A N' letters that fly in from space and align,
 * then disperse on scroll. Mobile uses a static fallback (no canvas).
 */
export default function HeroLetters() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.innerWidth < 1024;
    if (isMobile) return; // skip on mobile, see static fallback below

    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth, H = el.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 200);
    camera.position.z = 14;

    // Lakkan のアイデンティティを 3D で表現（コーポレート看板）
    const letters = "LAKKAN".split("");
    const group = new THREE.Group();
    scene.add(group);

    type LetterMesh = {
      mesh: THREE.Mesh;
      target: THREE.Vector3;
      origin: THREE.Vector3;
      spin: THREE.Vector3;
      arrived: boolean;
    };
    const items: LetterMesh[] = [];

    // Use sprite-based glyphs (canvas texture)
    letters.forEach((ch, i) => {
      const cv = document.createElement("canvas");
      cv.width = 320; cv.height = 320;
      const ctx = cv.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, 320, 320);
      // 微かなグロウ（vermillion）
      ctx.shadowColor = "rgba(255, 79, 0, 0.35)";
      ctx.shadowBlur = 22;
      ctx.fillStyle = "#0D0D0D";
      ctx.font = "900 240px 'Playfair Display', 'Instrument Serif', 'Frank Ruhl Libre', Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(ch, 160, 175);

      const tex = new THREE.CanvasTexture(cv);
      tex.anisotropy = 4;
      const mat = new THREE.MeshBasicMaterial({
        map: tex, transparent: true, opacity: 0.96,
        depthWrite: false,
      });
      const geo = new THREE.PlaneGeometry(2.0, 2.0);
      const mesh = new THREE.Mesh(geo, mat);

      // LAKKAN 6文字に最適化
      const spacing = 1.95;
      const targetX = (i - (letters.length - 1) / 2) * spacing;
      const target = new THREE.Vector3(targetX, 0, 0);
      // 初期位置：ノイズフィールドから集結
      const origin = new THREE.Vector3(
        (Math.random() - 0.5) * 36,
        (Math.random() - 0.5) * 22,
        -25 - Math.random() * 35
      );
      mesh.position.copy(origin);
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      group.add(mesh);
      items.push({
        mesh,
        target,
        origin,
        spin: new THREE.Vector3(
          (Math.random() - 0.5) * 0.025,
          (Math.random() - 0.5) * 0.025,
          (Math.random() - 0.5) * 0.025
        ),
        arrived: false,
      });
    });

    let scrollY = 0;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    let mx = 0, my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    const start = performance.now();
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = (performance.now() - start) / 1000;

      // Phase 0..1: fly in over ~1.6s
      const phaseIn = Math.min(1, t / 1.6);
      const easedIn = 1 - Math.pow(1 - phaseIn, 3);

      // Disperse based on scroll within hero (first viewport ~1vh)
      const vh = window.innerHeight || 800;
      const disperse = Math.min(1, scrollY / (vh * 1.5));

      for (const it of items) {
        const dispersedTarget = it.target.clone().lerp(
          new THREE.Vector3(it.origin.x * 0.6, it.origin.y * 0.6, it.origin.z * 0.4),
          disperse
        );
        const pos = it.origin.clone().lerp(dispersedTarget, easedIn);
        it.mesh.position.lerp(pos, 0.2);

        if (phaseIn < 1) {
          it.mesh.rotation.x += it.spin.x;
          it.mesh.rotation.y += it.spin.y;
          it.mesh.rotation.z += it.spin.z;
        } else {
          // Settle
          it.mesh.rotation.x += (0 - it.mesh.rotation.x) * 0.08 + my * 0.0008;
          it.mesh.rotation.y += (0 - it.mesh.rotation.y) * 0.08 + mx * 0.0012;
          it.mesh.rotation.z += (0 - it.mesh.rotation.z) * 0.08;
        }

        // Fade as they disperse on scroll
        const mat = it.mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.92 * easedIn * (1 - disperse * 0.85);
      }

      group.position.x = mx * 0.3;
      group.position.y = -my * 0.2;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      renderer.dispose();
      items.forEach((it) => {
        it.mesh.geometry.dispose();
        const m = it.mesh.material as THREE.MeshBasicMaterial;
        m.map?.dispose();
        m.dispose();
      });
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}
