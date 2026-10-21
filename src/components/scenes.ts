import { R } from '../lib/engine';

/** Painted fallbacks for the three ceremonies, used until generated illustrations are added. */
type Ctx = CanvasRenderingContext2D;

export const scenes: Record<string, (x: Ctx, W: number, H: number) => void> = {
  haldi(x, W, H) {
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#F9D86A'); g.addColorStop(0.55, '#F0A63A'); g.addColorStop(1, '#C9631E'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    const rg = x.createRadialGradient(W / 2, H * 0.42, 10, W / 2, H * 0.42, W * 0.7); rg.addColorStop(0, 'rgba(255,250,220,.75)'); rg.addColorStop(1, 'rgba(255,250,220,0)'); x.fillStyle = rg; x.fillRect(0, 0, W, H);
    for (let s = 0; s < 9; s++) {
      const sx = 28 + (s * (W - 56)) / 8, len = R(180, 330);
      x.strokeStyle = 'rgba(90,60,10,.35)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(sx, 0); x.lineTo(sx, len); x.stroke();
      for (let y = 16; y < len; y += 22) {
        x.fillStyle = ((y / 22) | 0) % 3 === 0 ? '#FFF2C2' : ((y / 22) | 0) % 2 ? '#F28C1B' : '#FFC21A';
        x.beginPath(); x.arc(sx, y, 11, 0, 7); x.fill(); x.fillStyle = 'rgba(160,70,0,.35)'; x.beginPath(); x.arc(sx + 2, y + 2, 4, 0, 7); x.fill();
      }
      x.fillStyle = '#4E7A2A'; x.beginPath(); x.ellipse(sx, len + 12, 5, 12, 0, 0, 7); x.fill();
    }
    x.fillStyle = 'rgba(140,60,10,.45)'; x.beginPath(); x.ellipse(W / 2, H * 0.84, W * 0.36, 26, 0, 0, 7); x.fill();
    const bg = x.createLinearGradient(0, H * 0.72, 0, H * 0.86); bg.addColorStop(0, '#E9B949'); bg.addColorStop(1, '#9C6A12');
    x.fillStyle = bg; x.beginPath(); x.ellipse(W / 2, H * 0.75, W * 0.3, 22, 0, 0, Math.PI); x.lineTo(W / 2 - W * 0.2, H * 0.83); x.quadraticCurveTo(W / 2, H * 0.9, W / 2 + W * 0.2, H * 0.83); x.closePath(); x.fill();
    x.fillStyle = '#FFCF2E'; x.beginPath(); x.ellipse(W / 2, H * 0.75, W * 0.28, 16, 0, 0, 7); x.fill();
    for (let i = 0; i < 26; i++) { x.fillStyle = ['#FFF2C2', '#F28C1B', '#C0392B'][i % 3]; x.beginPath(); x.arc(W / 2 + R(-W * 0.24, W * 0.24), H * 0.75 + R(-8, 8), R(3, 6), 0, 7); x.fill(); }
  },
  vivah(x, W, H) {
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1E0610'); g.addColorStop(0.6, '#4A0F1C'); g.addColorStop(1, '#2A0810'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 46; i++) {
      const r = R(4, 26), b = x.createRadialGradient(0, 0, 0, 0, 0, r); b.addColorStop(0, `rgba(255,214,140,${R(0.25, 0.6)})`); b.addColorStop(1, 'rgba(255,214,140,0)');
      x.save(); x.translate(R(0, W), R(0, H * 0.6)); x.fillStyle = b; x.beginPath(); x.arc(0, 0, r, 0, 7); x.fill(); x.restore();
    }
    for (let s = 0; s < 14; s++) {
      const sx = 20 + (s * (W - 40)) / 13, len = R(80, 220); x.strokeStyle = 'rgba(255,220,160,.25)'; x.lineWidth = 1; x.beginPath(); x.moveTo(sx, 0); x.lineTo(sx, len); x.stroke();
      for (let y = 10; y < len; y += 16) { x.fillStyle = 'rgba(255,230,170,.9)'; x.beginPath(); x.arc(sx, y, 1.8, 0, 7); x.fill(); }
    }
    const cx = W / 2, base = H * 0.88, top = H * 0.36, half = W * 0.32;
    const fire = x.createRadialGradient(cx, base - 40, 4, cx, base - 40, 150); fire.addColorStop(0, 'rgba(255,170,60,.9)'); fire.addColorStop(0.3, 'rgba(255,120,40,.35)'); fire.addColorStop(1, 'rgba(255,120,40,0)');
    x.fillStyle = fire; x.fillRect(0, 0, W, H);
    x.strokeStyle = '#D9B76E'; x.lineWidth = 6; x.lineCap = 'round';
    [-1, 1].forEach((d) => { x.beginPath(); x.moveTo(cx + d * half, base); x.lineTo(cx + d * half, top + 30); x.stroke(); x.beginPath(); x.moveTo(cx + d * half * 0.62, base); x.lineTo(cx + d * half * 0.62, top + 50); x.stroke(); });
    x.lineWidth = 5; x.beginPath(); x.moveTo(cx - half - 16, top + 30); x.lineTo(cx + half + 16, top + 30); x.stroke();
    x.beginPath(); x.moveTo(cx - half, top + 30); x.quadraticCurveTo(cx - half * 0.5, top - 40, cx, top - 70); x.quadraticCurveTo(cx + half * 0.5, top - 40, cx + half, top + 30); x.stroke();
    x.beginPath(); x.moveTo(cx, top - 70); x.lineTo(cx, top - 96); x.stroke(); x.fillStyle = '#D9B76E'; x.beginPath(); x.arc(cx, top - 100, 7, 0, 7); x.fill();
    for (let k = 0; k < 7; k++) { const gx = cx - half + 10 + (k * (half * 2 - 20)) / 6; x.strokeStyle = k % 2 ? '#F28C1B' : '#FFC21A'; x.lineWidth = 3; x.beginPath(); x.moveTo(gx, top + 34); x.quadraticCurveTo(gx + (half * 2 - 20) / 12, top + 64, gx + (half * 2 - 20) / 6, top + 34); x.stroke(); }
    x.fillStyle = '#B08433'; x.beginPath(); x.moveTo(cx - 34, base); x.lineTo(cx + 34, base); x.lineTo(cx + 24, base - 18); x.lineTo(cx - 24, base - 18); x.closePath(); x.fill();
    x.fillStyle = '#FFB547'; x.beginPath(); x.moveTo(cx - 16, base - 18); x.quadraticCurveTo(cx - 10, base - 60, cx, base - 74); x.quadraticCurveTo(cx + 10, base - 60, cx + 16, base - 18); x.closePath(); x.fill();
  },
  vidaai(x, W, H) {
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#F7E3C6'); g.addColorStop(0.45, '#EDB58A'); g.addColorStop(0.8, '#B4614C'); g.addColorStop(1, '#6E1F2A'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    const sun = x.createRadialGradient(W * 0.5, H * 0.46, 10, W * 0.5, H * 0.46, 180); sun.addColorStop(0, 'rgba(255,248,220,1)'); sun.addColorStop(0.25, 'rgba(255,226,170,.8)'); sun.addColorStop(1, 'rgba(255,226,170,0)'); x.fillStyle = sun; x.fillRect(0, 0, W, H);
    x.strokeStyle = 'rgba(90,30,30,.55)'; x.lineWidth = 2.2;
    for (let i = 0; i < 7; i++) { const bx = R(W * 0.15, W * 0.85), by = R(H * 0.12, H * 0.32), s = R(7, 13); x.beginPath(); x.moveTo(bx - s, by); x.quadraticCurveTo(bx - s / 2, by - s * 0.6, bx, by); x.quadraticCurveTo(bx + s / 2, by - s * 0.6, bx + s, by); x.stroke(); }
    x.fillStyle = 'rgba(110,31,42,.35)'; x.beginPath(); x.moveTo(0, H * 0.66); for (let t = 0; t <= W; t += 40) x.lineTo(t, H * 0.66 - Math.sin(t / 70) * 14 - 10); x.lineTo(W, H); x.lineTo(0, H); x.fill();
    const cx = W / 2, by2 = H * 0.78, bw = 120, bh = 92;
    x.fillStyle = '#5A1824'; x.fillRect(40, by2 - bh * 0.55, W - 80, 9);
    x.fillStyle = '#6E1F2A'; x.fillRect(cx - bw / 2, by2 - bh, bw, bh);
    x.fillStyle = '#D9B76E'; x.fillRect(cx - bw / 2 - 8, by2 - bh - 8, bw + 16, 10); x.fillRect(cx - bw / 2 - 6, by2 - 4, bw + 12, 8);
    x.beginPath(); x.moveTo(cx - bw / 2 - 8, by2 - bh - 8); x.quadraticCurveTo(cx, by2 - bh - 90, cx + bw / 2 + 8, by2 - bh - 8); x.closePath(); x.fill();
    x.fillStyle = '#F2C66B'; x.beginPath(); x.moveTo(cx - 30, by2 - 6); x.lineTo(cx - 30, by2 - bh + 34); x.quadraticCurveTo(cx, by2 - bh + 4, cx + 30, by2 - bh + 34); x.lineTo(cx + 30, by2 - 6); x.closePath(); x.fill();
    for (let i = 0; i < 36; i++) { x.fillStyle = ['#9C4A3E', '#F28C1B', '#FFF2C2', '#6E1F2A'][i % 4]; x.save(); x.translate(R(0, W), R(0, H)); x.rotate(R(0, 6)); x.beginPath(); x.ellipse(0, 0, R(3, 6), R(6, 10), 0, 0, 7); x.fill(); x.restore(); }
  },
};
