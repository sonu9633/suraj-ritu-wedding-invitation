import { useEffect, useState } from 'react';
import Envelope from './components/Envelope';
import Kesar from './components/Kesar';
import { Hero, Invitation, DateReveal, Moments, Events, Venue, Families, Finale, Dock } from './components/Sections';
import { gsap, ScrollTrigger, startScroll, reduced } from './lib/engine';

export default function App() {
  // ?open skips the envelope (handy for testing, or a direct link to the details)
  const [open, setOpen] = useState(() => new URLSearchParams(location.search).has('open'));

  useEffect(() => {
    document.documentElement.classList.toggle('locked', !open);
    if (!open) {
      // hold the hero in its pre-intro state under the envelope
      if (!reduced()) gsap.set('#hero [data-in]', { opacity: 0, y: 34, filter: 'blur(6px)' });
      return;
    }
    window.scrollTo(0, 0);
    const RM = reduced();
    startScroll();
    const ctx = gsap.context(() => {
      if (RM) { document.querySelectorAll('.ev').forEach((e) => e.classList.add('lit')); return; }
      // hero intro: the card has just become this page
      gsap.to('#hero [data-in]', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.3, stagger: 0.08, ease: 'expo.out', clearProps: 'filter' });
      gsap.fromTo('.arch-frame', { clipPath: 'inset(50% 50% 50% 50% round 999px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: 1.6, ease: 'expo.out', clearProps: 'clipPath' });
      // steep in: colour diffuses into each block as it arrives
      gsap.utils.toArray<HTMLElement>('[data-rv]').forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 36, filter: 'blur(5px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.3, ease: 'expo.out', clearProps: 'filter', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
      });
      gsap.utils.toArray<HTMLElement>('[data-scene]').forEach((el) => {
        gsap.fromTo(el, { clipPath: 'inset(12% 12% 12% 12% round 200px 200px 6px 6px)', scale: 1.06 }, { clipPath: 'inset(0% 0% 0% 0% round 200px 200px 6px 6px)', scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 45%', scrub: true } });
      });
      gsap.utils.toArray<HTMLElement>('[data-par]').forEach((img) => {
        const a = +(img.dataset.par || 0);
        gsap.fromTo(img, { yPercent: -a }, { yPercent: a, ease: 'none', scrollTrigger: { trigger: img.parentElement!, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      gsap.fromTo('#heroImg', { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.spine .prog', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.spine', start: 'top 60%', end: 'bottom 60%', scrub: true } });
      document.querySelectorAll('.ev').forEach((ev) => ScrollTrigger.create({ trigger: ev, start: 'top 62%', onEnter: () => ev.classList.add('lit') }));
    });
    // dock: current section, steps aside while reading down, returns on the way up
    const dock = document.getElementById('dock')!;
    const marks = ['date', 'events', 'venue', 'family'].map((id) => ScrollTrigger.create({ trigger: '#' + id, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => dock.querySelector(`[data-sec="${id}"]`)?.classList.toggle('on', s.isActive) }));
    let last = 0;
    const hide = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => { const y = s.scroll(); if (y > last + 4 && y > 300) dock.classList.add('away'); else if (y < last - 4) dock.classList.remove('away'); last = y; } });
    // buttons fill with saffron from the side the pointer enters
    const enter = (e: PointerEvent) => { const b = (e.target as HTMLElement).closest('.btn') as HTMLElement | null; if (!b) return; const r = b.getBoundingClientRect(); b.style.setProperty('--x', `${e.clientX - r.left}px`); b.style.setProperty('--y', `${e.clientY - r.top}px`); };
    document.addEventListener('pointerover', enter);
    return () => { ctx.revert(); marks.forEach((m) => m.kill()); hide.kill(); document.removeEventListener('pointerover', enter); };
  }, [open]);

  return (
    <>
      <a className="skip" href="#invite">Skip to the invitation</a>
      {!open && <Envelope onOpen={() => setOpen(true)} />}
      <Kesar />
      <main>
        <Hero />
        <Invitation />
        <DateReveal />
        <Moments />
        <Events />
        <Venue />
        <Families />
        <Finale />
      </main>
      {open && <Dock />}
    </>
  );
}
