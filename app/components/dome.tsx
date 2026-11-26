"use client";
// A light wireframe dome drawn on a 2D canvas: no 3D library, a few KB of JS.
// It spins slowly, can be dragged to turn, pauses when off screen or when the
// tab is hidden, and shows a still frame for reduced-motion visitors.
import { useEffect, useRef } from "react";

const LATS = 8;      // rings from the base to the top
const MERIDIANS = 24; // lines from the base to the top
const SEG = 48;       // points per ring
const TILT = 0.38;    // radians the dome leans towards the viewer

export default function Dome({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, angle = 0.6, speed = 0.0035, drag: number | null = null, visible = true, raf = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const project = (x: number, y: number, z: number, R: number, cx: number, cy: number) => {
      const ca = Math.cos(angle), sa = Math.sin(angle);
      const x1 = x * ca + z * sa, z1 = -x * sa + z * ca;          // spin around vertical axis
      const ct = Math.cos(TILT), st = Math.sin(TILT);
      const y2 = y * ct - z1 * st, z2 = y * st + z1 * ct;          // lean towards the viewer
      const p = 3.2 / (3.2 - z2);                                   // soft perspective
      return [cx + x1 * R * p, cy - y2 * R * p, z2] as const;
    };

    const line = (pts: (readonly [number, number, number])[], base: number) => {
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i], depth = (a[2] + b[2]) / 2;   // -1 back … 1 front
        ctx.strokeStyle = `rgba(200,144,28,${(base * (0.28 + 0.72 * (depth + 1) / 2)).toFixed(3)})`;
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      }
    };

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      const R = Math.min(w * 0.44, h * 0.6), cx = w / 2, cy = h - R * 0.62 - 4;
      ctx!.lineWidth = 1;
      // Rings of latitude
      for (let i = 0; i < LATS; i++) {
        const phi = (i / LATS) * (Math.PI / 2), r = Math.cos(phi), y = Math.sin(phi), pts = [];
        for (let k = 0; k <= SEG; k++) { const t = (k / SEG) * Math.PI * 2; pts.push(project(Math.cos(t) * r, y, Math.sin(t) * r, R, cx, cy)); }
        line(pts, i === 0 ? 0.9 : 0.75);
      }
      // Meridians
      for (let m = 0; m < MERIDIANS; m++) {
        const t = (m / MERIDIANS) * Math.PI * 2, pts = [];
        for (let k = 0; k <= 16; k++) { const phi = (k / 16) * (Math.PI / 2); pts.push(project(Math.cos(t) * Math.cos(phi), Math.sin(phi), Math.sin(t) * Math.cos(phi), R, cx, cy)); }
        line(pts, 0.75);
      }
      // Nodes where lines cross, brighter at the front
      for (let i = 1; i < LATS; i += 2) for (let m = 0; m < MERIDIANS; m += 2) {
        const phi = (i / LATS) * (Math.PI / 2), t = (m / MERIDIANS) * Math.PI * 2;
        const [x, y, z] = project(Math.cos(t) * Math.cos(phi), Math.sin(phi), Math.sin(t) * Math.cos(phi), R, cx, cy);
        if (z < -0.1) continue;
        ctx!.fillStyle = `rgba(200,144,28,${(0.35 + 0.65 * z).toFixed(3)})`;
        ctx!.beginPath(); ctx!.arc(x, y, 1.6 + z, 0, Math.PI * 2); ctx!.fill();
      }
    }

    const loop = () => {
      raf = 0;
      if (!visible || document.hidden) return;
      if (drag === null) angle += speed;
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => { if (!still && !raf) raf = requestAnimationFrame(loop); };

    const ro = new ResizeObserver(resize); ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); });
    io.observe(canvas);
    const onVis = () => start();
    document.addEventListener("visibilitychange", onVis);

    // Drag to turn
    const down = (e: PointerEvent) => { drag = e.clientX; canvas.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (drag === null) return; const dx = e.clientX - drag; drag = e.clientX; angle += dx * 0.01; speed = Math.max(-0.03, Math.min(0.03, dx * 0.0015)) || speed; if (still) draw(); };
    const up = () => { drag = null; const target = 0.0035 * Math.sign(speed || 1); const ease = () => { speed += (target - speed) * 0.04; if (Math.abs(target - speed) > 0.0002 && drag === null) setTimeout(ease, 16); }; ease(); };
    canvas.addEventListener("pointerdown", down); canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up); canvas.addEventListener("pointercancel", up);

    resize(); start();
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up); canvas.removeEventListener("pointercancel", up);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
