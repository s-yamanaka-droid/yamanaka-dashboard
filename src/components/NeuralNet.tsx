"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * NeuralNet — AI駆使感を出す軽量ニューラルネット可視化
 * - ノード（点）100〜200個
 * - 近接ノード同士を線で接続
 * - パルスが線上を走る（信号伝播）
 * - マウスフォロー
 * - 既存 HeroCanvas のオレンジ系と差別化：シックな白基調 + vermillion アクセント
 */
export default function NeuralNet({
  density = 80,        // ノード数
  linkDist = 4.0,      // 接続距離
  bg = 0xF5F5F0,       // 背景色
  nodeColor = 0x0D0D0D,
  linkColor = 0x0D0D0D,
  pulseColor = 0xFF4F00,
  height = "100vh",
}: {
  density?: number;
  linkDist?: number;
  bg?: number;
  nodeColor?: number;
  linkColor?: number;
  pulseColor?: number;
  height?: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const isMobile = window.innerWidth < 1024;
    const W = el.clientWidth;
    const H = el.clientHeight;

    /* Renderer */
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setClearColor(bg, 1);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 200);
    camera.position.z = 14;

    /* Nodes — ランダム配置 + 軽い速度 */
    const N = isMobile ? Math.floor(density * 0.6) : density;
    const positions = new Float32Array(N * 3);
    const velocities = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      positions[i*3+0] = (Math.random() - 0.5) * 24;
      positions[i*3+1] = (Math.random() - 0.5) * 14;
      positions[i*3+2] = (Math.random() - 0.5) * 10;
      velocities[i*3+0] = (Math.random() - 0.5) * 0.008;
      velocities[i*3+1] = (Math.random() - 0.5) * 0.008;
      velocities[i*3+2] = (Math.random() - 0.5) * 0.005;
    }
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const nodeMat = new THREE.PointsMaterial({
      color: nodeColor, size: isMobile ? 0.09 : 0.07,
      transparent: true, opacity: 0.6,
      sizeAttenuation: true,
    });
    const nodes = new THREE.Points(nodeGeo, nodeMat);
    scene.add(nodes);

    /* Lines — 近接ノード接続 */
    const maxLinks = N * 6; // 各ノード最大6本見込み
    const linePositions = new Float32Array(maxLinks * 6); // 2点 * 3軸
    const lineOpacities = new Float32Array(maxLinks * 2);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: linkColor, transparent: true, opacity: 0.18,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    /* Pulses — 信号伝播 */
    const pulseCount = isMobile ? 8 : 18;
    const pulses = Array.from({ length: pulseCount }, () => ({
      from: Math.floor(Math.random() * N),
      to: Math.floor(Math.random() * N),
      t: Math.random(),
      speed: 0.005 + Math.random() * 0.015,
    }));
    const pulsePositions = new Float32Array(pulseCount * 3);
    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulsePositions, 3));
    const pulseMat = new THREE.PointsMaterial({
      color: pulseColor, size: 0.22,
      transparent: true, opacity: 0.95,
      sizeAttenuation: true,
    });
    const pulseObj = new THREE.Points(pulseGeo, pulseMat);
    scene.add(pulseObj);

    /* Mouse */
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMouse = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouse.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    /* Resize */
    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    /* Animate */
    let raf = 0;
    const tmp = new THREE.Vector3();
    const tmp2 = new THREE.Vector3();

    const tick = () => {
      raf = requestAnimationFrame(tick);

      // Mouse lerp
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      // Update nodes
      for (let i = 0; i < N; i++) {
        positions[i*3+0] += velocities[i*3+0];
        positions[i*3+1] += velocities[i*3+1];
        positions[i*3+2] += velocities[i*3+2];
        // Bounce
        if (Math.abs(positions[i*3+0]) > 12) velocities[i*3+0] *= -1;
        if (Math.abs(positions[i*3+1]) > 7)  velocities[i*3+1] *= -1;
        if (Math.abs(positions[i*3+2]) > 5)  velocities[i*3+2] *= -1;
      }
      nodeGeo.attributes.position.needsUpdate = true;

      // Update lines — 近接ペア
      let li = 0;
      const linkDist2 = linkDist * linkDist;
      for (let i = 0; i < N && li < maxLinks; i++) {
        for (let j = i + 1; j < N && li < maxLinks; j++) {
          const dx = positions[i*3+0] - positions[j*3+0];
          const dy = positions[i*3+1] - positions[j*3+1];
          const dz = positions[i*3+2] - positions[j*3+2];
          const d2 = dx*dx + dy*dy + dz*dz;
          if (d2 < linkDist2) {
            linePositions[li*6+0] = positions[i*3+0];
            linePositions[li*6+1] = positions[i*3+1];
            linePositions[li*6+2] = positions[i*3+2];
            linePositions[li*6+3] = positions[j*3+0];
            linePositions[li*6+4] = positions[j*3+1];
            linePositions[li*6+5] = positions[j*3+2];
            li++;
          }
        }
      }
      // 余り分は同じ点（不可視）
      for (let k = li; k < maxLinks; k++) {
        linePositions[k*6+0] = linePositions[k*6+3] = 0;
        linePositions[k*6+1] = linePositions[k*6+4] = 0;
        linePositions[k*6+2] = linePositions[k*6+5] = 0;
      }
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.setDrawRange(0, li * 2);

      // Pulses
      for (let p = 0; p < pulseCount; p++) {
        const pp = pulses[p];
        pp.t += pp.speed;
        if (pp.t >= 1) {
          pp.from = pp.to;
          pp.to = Math.floor(Math.random() * N);
          pp.t = 0;
        }
        const fi = pp.from * 3, ti = pp.to * 3;
        tmp.set(positions[fi], positions[fi+1], positions[fi+2]);
        tmp2.set(positions[ti], positions[ti+1], positions[ti+2]);
        tmp.lerp(tmp2, pp.t);
        pulsePositions[p*3+0] = tmp.x;
        pulsePositions[p*3+1] = tmp.y;
        pulsePositions[p*3+2] = tmp.z;
      }
      pulseGeo.attributes.position.needsUpdate = true;

      // Camera parallax
      camera.position.x = mouse.x * 1.2;
      camera.position.y = -mouse.y * 0.8;
      camera.lookAt(0, 0, 0);

      // Slow rotation
      scene.rotation.y += 0.0008;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      nodeGeo.dispose(); nodeMat.dispose();
      lineGeo.dispose(); lineMat.dispose();
      pulseGeo.dispose(); pulseMat.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, [density, linkDist, bg, nodeColor, linkColor, pulseColor]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
