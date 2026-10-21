import { useEffect, useRef, useState } from 'react';
import { gsap, reduced, probe } from '../lib/engine';
import { makePaper, crackPaths } from '../lib/paper';
import { crack, rustle } from '../lib/sound';
import { IMG } from '../site';

/**
 * The gate. A real envelope: paper with raised florals, a wax seal on the flap tip.
 * Tap: the seal cracks with saffron light that runs through the relief, the flap swings
 * open on its hinge, the card slides out, the envelope falls away and the card becomes the page.
 */
export default function Envelope({ onOpen }: { onOpen: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [art, setArt] = useState<{ paper: string; glow: string; photo: boolean; seal: string | null; liner: string | null } | null>(null);
  const opened = useRef(false);

  // Paper: the generated photo if provided, else the procedural relief.
  useEffect(() => {
    let alive = true;
    Promise.all([probe(IMG.paper), probe(IMG.seal), probe(IMG.liner)]).then(([p, s, l]) => {
      if (!alive) return;
      const proc = p ? null : makePaper(innerWidth, innerHeight);
      setArt({
        paper: p ? IMG.paper : proc!.paper,
        glow: p ? IMG.paper : proc!.glow,
        photo: !!p,
        seal: s ? IMG.seal : null,
        liner: l ? IMG.liner : null,
      });
    });
    return () => { alive = false; };
  }, []);

  // Tilt toward the pointer / the phone's motion, with a moving sheen. One clock: gsap.ticker.
  useEffect(() => {
    if (reduced()) return;
    const el = root.current!; const env = el.querySelector<HTMLElement>('.env')!; const sheen = el.querySelector<HTMLElement>('.sheen')!;
    const aim = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
    const pm = (e: PointerEvent) => { aim.x = e.clientX / innerWidth - 0.5; aim.y = e.clientY / innerHeight - 0.5; };
    const dm = (e: DeviceOrientationEvent) => { if (e.gamma == null || e.beta == null) return; aim.x = gsap.utils.clamp(-0.5, 0.5, e.gamma / 40); aim.y = gsap.utils.clamp(-0.5, 0.5, (e.beta - 45) / 40); };
    addEventListener('pointermove', pm); addEventListener('deviceorientation', dm);
    const tick = (t: number) => {
      if (opened.current) return;
      const k = 1 - Math.pow(0.92, gsap.ticker.deltaRatio());
      cur.x += (aim.x + Math.sin(t * 0.5) * 0.05 - cur.x) * k; cur.y += (aim.y + Math.cos(t * 0.4) * 0.04 - cur.y) * k;
      gsap.set(env, { rotationY: cur.x * 7, rotationX: -cur.y * 6 });
      gsap.set(sheen, { backgroundPosition: `${50 - cur.x * 80}% ${50 - cur.y * 80}%` });
    };
    gsap.ticker.add(tick);
    return () => { removeEventListener('pointermove', pm); removeEventListener('deviceorientation', dm); gsap.ticker.remove(tick); };
  }, []);

  const open = () => {
    if (opened.current || !art) return;
    opened.current = true;
    const el = root.current!;
    const q = gsap.utils.selector(el);
    if (reduced()) { gsap.to(el, { opacity: 0, duration: 0.4, onComplete: onOpen }); return; }
    try { navigator.vibrate?.([14, 50, 24]); } catch { /* no haptics */ }
    crack();

    // cracks
    const svg = el.querySelector('.cracks') as SVGSVGElement; const W = innerWidth, H = innerHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.innerHTML = crackPaths(W, H).map((d) => `<path d="${d}"/>`).join('');
    const paths = Array.from(svg.querySelectorAll('path'));
    paths.forEach((p) => { const L = p.getTotalLength(); p.style.strokeDasharray = `${L}`; p.style.strokeDashoffset = `${L}`; });

    const card = q('.card')[0] as HTMLElement, env = q('.env')[0] as HTMLElement;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: onOpen });
    tl.set(env, { rotationX: 0, rotationY: 0 }, 0)
      .to(q('.seal .ring'), { opacity: 0, duration: 0.2 }, 0)
      .to(q('.copy'), { opacity: 0, y: 6, duration: 0.5, ease: 'power2.out' }, 0)
      .fromTo(q('.seal'), { scale: 0.94 }, { scale: 1.05, duration: 0.25, ease: 'back.out(3)' }, 0)
      .to(paths, { strokeDashoffset: 0, duration: 1.0, ease: 'power2.inOut', stagger: 0.02 }, 0.08)
      .to(q('.halo'), { opacity: 1, duration: 1.1, ease: 'power2.inOut' }, 0.15)
      .to(el, { '--gr': '160%', duration: 1.5, ease: 'power2.in' } as gsap.TweenVars, 0.2)
      // seal falls apart
      .to(q('.seal .h1'), { xPercent: -40, yPercent: 25, rotation: -22, opacity: 0, duration: 0.9, ease: 'power3.in' }, 1.0)
      .to(q('.seal .h2'), { xPercent: 40, yPercent: 30, rotation: 24, opacity: 0, duration: 0.9, ease: 'power3.in' }, 1.0)
      .to([svg, q('.halo')[0]], { opacity: 0, duration: 0.7, ease: 'power2.out' }, 1.45)
      // flap swings open on its hinge, the shadow it casts lifts
      .add(() => rustle(0, 0.8), 1.25)
      .to(q('.flap'), { rotationX: 180, duration: 1.05, ease: 'power2.inOut' }, 1.25)
      .set(q('.flap'), { zIndex: 1 }, 1.78)
      .to(q('.flapshade'), { opacity: 0, duration: 0.8 }, 1.3)
      // camera pulls back onto the table
      .to(env, { scale: 0.8, yPercent: 8, duration: 1.1, ease: 'expo.inOut' }, 1.6)
      // the card slides out
      .add(() => rustle(0, 1.0), 2.0)
      .to(card, { yPercent: -62, duration: 1.15, ease: 'expo.out' }, 2.05)
      .add(() => {
        // the card grows into the page while the envelope falls away
        const r = card.getBoundingClientRect();
        const envScale = 0.8;
        const s = Math.max(innerWidth / r.width, innerHeight / r.height) * 1.04;
        const dx = (innerWidth / 2 - (r.left + r.width / 2)) / envScale;
        const dy = (innerHeight / 2 - (r.top + r.height / 2)) / envScale;
        gsap.to(card, { x: `+=${dx}`, y: `+=${dy}`, scale: s, borderRadius: 0, duration: 1.15, ease: 'expo.inOut' });
        gsap.to(q('.card-in'), { opacity: 0, duration: 0.5, ease: 'power2.out' });
        gsap.to(q('.body, .flap, .seal'), { yPercent: 130, duration: 1.0, ease: 'power3.in' });
      }, 3.0)
      .to(el, { opacity: 0, duration: 0.5, ease: 'power2.out' }, 4.0);
  };

  const sealSVG = (
    <svg viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <radialGradient id="wx" cx="38%" cy="32%" r="75%"><stop offset="0" stopColor="#B3361F" /><stop offset=".55" stopColor="#7E1C17" /><stop offset="1" stopColor="#4E0F10" /></radialGradient>
      </defs>
      <path fill="url(#wx)" d="M100 8c14 0 18 9 30 12s22-2 30 8 2 21 9 31 18 15 16 30-14 16-17 29 5 23-5 33-22 4-33 11-15 19-30 19-19-11-31-17-24 0-33-10-1-21-8-32-17-15-16-30 13-17 15-29-6-24 4-33 23-3 33-10 16-22 36-22z" />
      <circle cx="100" cy="100" r="62" fill="none" stroke="rgba(0,0,0,.28)" strokeWidth="3" />
      <circle cx="100" cy="100" r="62" fill="none" stroke="rgba(255,190,150,.25)" strokeWidth="1.2" transform="translate(-1.2 -1.2)" />
      <text x="101.5" y="120" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontStyle="italic" fontWeight="600" fontSize="54" fill="rgba(0,0,0,.35)">R&amp;S</text>
      <text x="100" y="118" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontStyle="italic" fontWeight="600" fontSize="54" fill="#E7A35A">R&amp;S</text>
    </svg>
  );
  const sealFace = art?.seal ? <img src={art.seal} alt="" draggable={false} /> : sealSVG;
  const paperStyle = art ? ({ ['--paper' as any]: `url(${art.paper})`, ['--glowp' as any]: `url(${art.glow})` } as React.CSSProperties) : undefined;

  return (
    <div className={`gate${art?.photo ? ' photo' : ''}${art?.liner ? ' has-liner' : ''}`} ref={root} style={paperStyle} role="region" aria-label="Sealed invitation">
      <div className="table" aria-hidden="true" />
      <div className="env">
        <div className="body">
          <div className="liner" style={art?.liner ? { backgroundImage: `url(${art.liner})` } : undefined} />
        </div>
        <div className="card">
          <div className="card-in">
            <span className="k">The wedding of</span>
            <img src={IMG.couple1} alt="" />
            <span className="n">Ritu &amp; Suraj<small>Kesarwani</small></span>
            <span className="k">23 · 11 · 2026</span>
          </div>
        </div>
        <div className="body body-front">
          <div className="pocket"><i className="lit" /><i className="flapshade" /></div>
        </div>
        <div className="flap">
          <div className="face front"><i className="lit" /></div>
          <div className="face back" style={art?.liner ? { backgroundImage: `url(${art.liner})` } : undefined} />
        </div>
        <div className="copy top" aria-hidden="true"><span className="k">You are invited</span><span className="s">Ritu Kesarwani<br />&amp; Suraj Kesarwani</span></div>
        <div className="copy bot"><p>The Kesarwani family invites you<br />to the wedding of their daughter</p><small>Tap the seal · <span className="deva">मुहर खोलें</span></small></div>
        <button className="seal" type="button" onClick={open} aria-label="Break the seal to open the invitation" disabled={!art}>
          <span className="ring" aria-hidden="true" />
          <span className="half h1">{sealFace}</span>
          <span className="half h2">{sealFace}</span>
        </button>
        <div className="sheen" aria-hidden="true" />
      </div>
      <svg className="cracks" aria-hidden="true" />
      <div className="halo" aria-hidden="true" />
    </div>
  );
}
