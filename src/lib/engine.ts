import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };

export const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
export const DPR = typeof devicePixelRatio !== 'undefined' ? Math.min(2, devicePixelRatio || 1) : 1;
export const R = (a: number, b: number) => a + Math.random() * (b - a);

let lenis: Lenis | null = null;

/** Smooth scroll on the one GSAP clock. Off under reduced motion. */
export function startScroll() {
  if (lenis || reduced()) return lenis;
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis?.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function scrollToEl(el: HTMLElement) {
  if (lenis) lenis.scrollTo(el, { offset: -8, duration: 1.4 });
  else el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
}

/** Resolves with the image if the file exists, else null (used for optional generated art). */
export function probe(src: string): Promise<HTMLImageElement | null> {
  return new Promise((res) => {
    if (!src) { res(null); return; }
    const i = new Image();
    i.onload = () => res(i.naturalWidth > 2 ? i : null);
    i.onerror = () => res(null);
    i.src = src;
  });
}
