import { useEffect, useRef } from 'react';
import { gsap, reduced, R, DPR } from '../lib/engine';

/**
 * The driver. One value, `steep` (page scroll 0..1), warms the ground from milk to kesar milk
 * and strengthens the colour bleeding from each saffron strand. Strands drift at rest and swirl
 * when the visitor stirs them with a finger or the pointer.
 */
type S = { x: number; y: number; a: number; va: number; vx: number; vy: number; l: number; c: string; ph: number };
const COLS = ['#C2410C', '#E3831B', '#A8320E', '#D9661A'];

export const kesar = { burst: (_x: number, _y: number, _w: number) => {} };

export default function Kesar() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!, x = cv.getContext('2d')!;
    const size = () => { cv.width = innerWidth * DPR; cv.height = innerHeight * DPR; x.setTransform(DPR, 0, 0, DPR, 0, 0); };
    size(); addEventListener('resize', size);
    const mk = (): S => ({ x: R(0, innerWidth), y: R(0, innerHeight), a: R(0, 6.28), va: R(-0.004, 0.004), vx: R(-0.08, 0.08), vy: R(0.05, 0.22), l: R(12, 22), c: COLS[(Math.random() * 4) | 0], ph: R(0, 100) });
    const NS = innerWidth < 600 ? 12 : 20;
    const st: S[] = Array.from({ length: NS }, mk);
    const stir = { x: -999, y: -999, vx: 0, vy: 0 };
    let steep = 0;
    const RM = reduced();
    const move = (e: PointerEvent | TouchEvent) => {
      const p = 'touches' in e ? e.touches[0] : e; if (!p) return;
      stir.vx = stir.x < -900 ? 0 : p.clientX - stir.x; stir.vy = stir.y < -900 ? 0 : p.clientY - stir.y; stir.x = p.clientX; stir.y = p.clientY;
    };
    addEventListener('pointermove', move as any, { passive: true }); addEventListener('touchmove', move as any, { passive: true });
    kesar.burst = (bx, by, bw) => {
      if (RM) return;
      for (let i = 0; i < 26; i++) { const s = mk(); s.x = bx + R(-bw / 2, bw / 2); s.y = by; const a = R(-Math.PI, 0); s.vx = Math.cos(a) * R(2, 6); s.vy = Math.sin(a) * R(2, 6); s.va = R(-0.08, 0.08); st.push(s); }
      setTimeout(() => st.splice(NS, 999), 9000);
    };
    const milk = [247, 244, 236], warm = [246, 233, 210];
    const tick = (t: number) => {
      const sh = document.documentElement.scrollHeight - innerHeight;
      const p = sh > 0 ? Math.min(1, Math.max(0, scrollY / sh)) : 0;
      steep += (p - steep) * 0.08;
      document.documentElement.style.setProperty('--ground', `rgb(${milk.map((v, k) => Math.round(v + (warm[k] - v) * steep)).join(',')})`);
      if (document.hidden) return;
      const W = innerWidth, H = innerHeight; x.clearRect(0, 0, W, H);
      stir.vx *= 0.9; stir.vy *= 0.9;
      const halo = 0.04 + steep * 0.1;
      for (const s of st) {
        if (!RM) {
          const dx = s.x - stir.x, dy = s.y - stir.y, d2 = dx * dx + dy * dy;
          if (d2 < 22000) { const f = 1 - d2 / 22000; s.vx += (-dy * 0.0009 + stir.vx * 0.02) * f; s.vy += (dx * 0.0009 + stir.vy * 0.02) * f; s.va += 0.002 * f; }
          s.vx *= 0.985; s.vy = s.vy * 0.985 + 0.0025; s.va *= 0.99;
          s.x += s.vx + Math.sin(t * 0.4 + s.ph) * 0.12; s.y += s.vy * 0.6; s.a += s.va + 0.0015;
          if (s.y > H + 30) { s.y = -30; s.x = R(0, W); }
          if (s.x < -30) s.x = W + 30; if (s.x > W + 30) s.x = -30;
        }
        const r = 18 + steep * 16, g = x.createRadialGradient(s.x, s.y, 0, s.x, s.y, r);
        g.addColorStop(0, `rgba(227,131,27,${halo})`); g.addColorStop(1, 'rgba(227,131,27,0)');
        x.fillStyle = g; x.beginPath(); x.arc(s.x, s.y, r, 0, 7); x.fill();
        x.save(); x.globalAlpha = 0.75; x.translate(s.x, s.y); x.rotate(s.a); x.strokeStyle = s.c; x.lineCap = 'round';
        x.lineWidth = 1.3; x.beginPath(); x.moveTo(-s.l / 2, 0); x.bezierCurveTo(-s.l / 6, -4, s.l / 6, 3, s.l / 2, -1); x.stroke();
        x.lineWidth = 3; x.beginPath(); x.moveTo(s.l / 2 - 3, -1.2); x.lineTo(s.l / 2, -1); x.stroke(); x.restore();
      }
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); removeEventListener('resize', size); removeEventListener('pointermove', move as any); removeEventListener('touchmove', move as any); };
  }, []);
  return <canvas className="kesar" ref={ref} aria-hidden="true" />;
}
