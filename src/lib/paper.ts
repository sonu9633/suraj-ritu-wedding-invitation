import { R } from './engine';

/**
 * Procedural blind-embossed paper: floral bouquets drawn three times
 * (shadow, highlight, face) so they read as raised relief under top-left light.
 * The same shapes are drawn again as a saffron "glow twin" for the seal-break moment.
 */
type Shape = (c: CanvasRenderingContext2D) => void;

function relief(w: number, h: number) {
  const sc = Math.min(w, h) / 420;
  const shapes: Shape[] = [];
  const petal = (c: CanvasRenderingContext2D, r: number) => {
    c.beginPath(); c.moveTo(0, 0);
    c.bezierCurveTo(r * 0.45, -r * 0.5, r * 1.05, -r * 0.28, r, 0);
    c.bezierCurveTo(r * 1.05, r * 0.28, r * 0.45, r * 0.5, 0, 0); c.fill();
  };
  const flower = (cx: number, cy: number, r: number, n: number, rot = 0) => shapes.push((c) => {
    c.save(); c.translate(cx, cy); c.rotate(rot);
    for (let k = 0; k < n; k++) { c.save(); c.rotate((k * Math.PI * 2) / n); petal(c, r); c.restore(); }
    c.rotate(Math.PI / n);
    for (let k = 0; k < n; k++) { c.save(); c.rotate((k * Math.PI * 2) / n); petal(c, r * 0.55); c.restore(); }
    c.beginPath(); c.arc(0, 0, r * 0.16, 0, 7); c.fill(); c.restore();
  });
  const leaf = (x: number, y: number, a: number, L: number) => shapes.push((c) => {
    c.save(); c.translate(x, y); c.rotate(a); c.beginPath(); c.moveTo(0, 0);
    c.quadraticCurveTo(L * 0.45, -L * 0.36, L, 0); c.quadraticCurveTo(L * 0.45, L * 0.36, 0, 0); c.fill(); c.restore();
  });
  const sprig = (x0: number, y0: number, x1: number, y1: number, bend: number, n: number, fl: number) => {
    const mx = (x0 + x1) / 2 + bend, my = (y0 + y1) / 2;
    shapes.push((c) => { c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(mx, my, x1, y1); c.stroke(); });
    for (let k = 1; k <= n; k++) {
      const t = k / (n + 1);
      const px = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * mx + t * t * x1;
      const py = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * my + t * t * y1;
      leaf(px, py, Math.atan2(y1 - y0, x1 - x0) + (k % 2 ? 0.85 : -0.85), (14 - k * 0.6) * sc);
    }
    if (fl) flower(x1, y1, fl * sc, 6, R(0, 1));
  };
  const bouquet = (cx: number, cy: number, k: number, flip: boolean) => {
    const d = flip ? -1 : 1;
    sprig(cx, cy + 70 * k * d, cx - 48 * k, cy - 48 * k * d, -26 * k, 4, 11 * k);
    sprig(cx, cy + 70 * k * d, cx + 52 * k, cy - 40 * k * d, 26 * k, 4, 12 * k);
    sprig(cx, cy + 80 * k * d, cx, cy - 74 * k * d, 10 * k, 5, 15 * k);
    sprig(cx, cy + 60 * k * d, cx - 74 * k, cy + 6 * k * d, -10 * k, 3, 8 * k);
    sprig(cx, cy + 60 * k * d, cx + 76 * k, cy + 12 * k * d, 12 * k, 3, 8 * k);
    flower(cx - 20 * k, cy + 4 * k * d, 7 * k, 5); flower(cx + 24 * k, cy - 2 * k * d, 8 * k, 5);
  };
  bouquet(w * 0.5, h * 0.15, sc * 1.15, false); bouquet(w * 0.5, h * 0.85, sc * 1.15, true);
  bouquet(w * 0.11, h * 0.5, sc * 0.9, false); bouquet(w * 0.89, h * 0.5, sc * 0.9, false);
  bouquet(w * 0.22, h * 0.27, sc * 0.62, false); bouquet(w * 0.78, h * 0.27, sc * 0.62, false);
  bouquet(w * 0.22, h * 0.74, sc * 0.62, true); bouquet(w * 0.78, h * 0.74, sc * 0.62, true);
  for (let i = 0; i < 34; i++) {
    const fx = R(0, w), fy = R(0, h);
    if (Math.hypot(fx - w / 2, fy - h / 2) > 90 * sc) flower(fx, fy, R(3, 5.5) * sc, 5, R(0, 1));
  }
  return { sc, shapes };
}

export function makePaper(w: number, h: number) {
  const { sc, shapes } = relief(w, h);
  const PR = Math.min(typeof devicePixelRatio !== 'undefined' ? devicePixelRatio : 1, 1.5);
  const draw = (glow: boolean) => {
    const cv = document.createElement('canvas');
    cv.width = Math.round(w * PR); cv.height = Math.round(h * PR);
    const x = cv.getContext('2d')!; x.scale(PR, PR); x.lineCap = 'round'; x.lineJoin = 'round';
    const pass = (fill: string, dx: number, dy: number, lw: number, blur = 0, bc = '') => {
      x.save(); x.translate(dx, dy); x.fillStyle = fill; x.strokeStyle = fill; x.lineWidth = lw * sc;
      if (blur) { x.shadowBlur = blur; x.shadowColor = bc; }
      shapes.forEach((f) => f(x)); x.restore();
    };
    if (glow) {
      pass('rgba(255,200,110,1)', 0, 0, 1.6, 10, 'rgba(227,131,27,1)');
      pass('rgba(255,236,190,.9)', 0, 0, 1);
    } else {
      const g = x.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, Math.max(w, h) * 0.75);
      g.addColorStop(0, '#FBF8F1'); g.addColorStop(1, '#ECE4D3'); x.fillStyle = g; x.fillRect(0, 0, w, h);
      for (let i = 0; i < 3200; i++) { x.fillStyle = `rgba(120,90,50,${R(0.015, 0.045)})`; x.fillRect(R(0, w), R(0, h), 1, 1); }
      pass('rgba(120,86,40,.30)', 1.6, 1.9, 1.7, 3, 'rgba(120,86,40,.25)');
      pass('rgba(255,255,255,1)', -1.1, -1.2, 1.5);
      pass('#F2EDE2', 0, 0, 1.2);
    }
    return cv.toDataURL(glow ? 'image/png' : 'image/jpeg', 0.82);
  };
  return { paper: draw(false), glow: draw(true) };
}

/** Jagged crack paths radiating from the seal, as SVG path strings. */
export function crackPaths(W: number, H: number) {
  const cx = W / 2, cy = H / 2, out: string[] = [];
  for (let k = 0; k < 12; k++) {
    let a = (k * Math.PI * 2) / 12 + R(-0.25, 0.25);
    let x = cx + Math.cos(a) * 44, y = cy + Math.sin(a) * 44;
    let d = `M${x.toFixed(1)} ${y.toFixed(1)}`;
    const len = R(0.16, 0.3) * Math.max(W, H);
    for (let s = 0; s < 9; s++) {
      a += R(-0.45, 0.45); x += (Math.cos(a) * len) / 9; y += (Math.sin(a) * len) / 9;
      d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
      if (s === 3 || s === 6) {
        let b = a + (Math.random() < 0.5 ? -1 : 1) * R(0.5, 1), bx = x, by = y;
        let bd = `M${bx.toFixed(1)} ${by.toFixed(1)}`;
        for (let q = 0; q < 4; q++) { b += R(-0.4, 0.4); bx += (Math.cos(b) * len) / 14; by += (Math.sin(b) * len) / 14; bd += ` L${bx.toFixed(1)} ${by.toFixed(1)}`; }
        out.push(bd);
      }
    }
    out.push(d);
  }
  return out;
}
