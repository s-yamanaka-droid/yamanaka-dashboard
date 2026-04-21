"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const isMobile = window.innerWidth < 1024;
    const W = el.clientWidth;
    const H = el.clientHeight;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setClearColor(0xF4541A, 1);
    el.appendChild(renderer.domElement);

    /* ── Scene / Camera ── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 200);
    camera.position.z = 8;

    /* ── Particles ── */
    const count = isMobile ? 400 : 1200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 30;
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x0D0D0D, size: isMobile ? 0.055 : 0.04,
      transparent: true, opacity: 0.45,
    });
    scene.add(new THREE.Points(pGeo, pMat));

    /* ── Wireframe shapes ── */
    const wireMat = (opacity: number) =>
      new THREE.MeshBasicMaterial({ color: 0x0D0D0D, wireframe: true, transparent: true, opacity });

    const shapes: THREE.Mesh[] = [];

    const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(2.2, 0), wireMat(0.12));
    ico.position.set(-5, 0.5, -3);
    scene.add(ico); shapes.push(ico);

    const oct = new THREE.Mesh(new THREE.OctahedronGeometry(1.4, 0), wireMat(0.1));
    oct.position.set(5, -1, -4);
    scene.add(oct); shapes.push(oct);

    const tor = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.04, 8, 48), wireMat(0.08));
    tor.position.set(0, 0, -5);
    tor.rotation.x = Math.PI / 4;
    scene.add(tor); shapes.push(tor);

    const ico2 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9, 1), wireMat(0.18));
    ico2.position.set(2.5, 2, -1);
    scene.add(ico2); shapes.push(ico2);

    /* ── Ring lines (latitude/longitude) ── */
    const ringGeo = new THREE.TorusGeometry(4, 0.015, 4, 64);
    const ringMesh = new THREE.Mesh(ringGeo, wireMat(0.06));
    ringMesh.rotation.y = Math.PI / 3;
    scene.add(ringMesh); shapes.push(ringMesh);

    /* ── Mouse tracking ── */
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMouse = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    /* ── Scroll ── */
    let scrollY = 0;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ── Resize ── */
    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    /* ── Animation loop ── */
    const clock = new THREE.Clock();
    let raf: number;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      // Lerp mouse
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      // Shapes rotate + mouse parallax
      shapes[0].rotation.x = t * 0.07 + mouse.y * 0.3;
      shapes[0].rotation.y = t * 0.12 + mouse.x * 0.3;
      shapes[1].rotation.x = t * 0.09;
      shapes[1].rotation.y = t * 0.06 + mouse.x * 0.2;
      shapes[2].rotation.z = t * 0.04 + mouse.x * 0.1;
      shapes[3].rotation.x = t * 0.15;
      shapes[3].rotation.y = t * 0.2  + mouse.y * 0.4;
      shapes[4].rotation.x = t * 0.03;
      shapes[4].rotation.y = t * 0.05 + mouse.x * 0.15;

      // Particle field slow drift
      scene.children[0].rotation.y = t * 0.015;
      scene.children[0].rotation.x = mouse.y * 0.04;

      // Camera subtle motion
      camera.position.x = mouse.x * 0.4;
      camera.position.y = -mouse.y * 0.2 - scrollY * 0.001;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ position: "absolute", inset: 0, zIndex: 0 }}
    />
  );
}
