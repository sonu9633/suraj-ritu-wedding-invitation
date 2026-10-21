import { useEffect, useRef, useState } from 'react';
import { IMG, bride, groom, events, venue, homes, hosts, gcal, WEDDING_START_UTC } from '../site';
import { probe, DPR, R, reduced, scrollToEl } from '../lib/engine';
import { scenes } from './scenes';
import { kesar } from './Kesar';
import { toggleMusic } from '../lib/sound';

const Thread = () => (
  <svg className="thread" viewBox="0 0 120 14" aria-hidden="true"><path d="M2 7c18-9 30 9 58 0s40 9 58 0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
);

/* ---------------- Hero ---------------- */
export function Hero() {
  const [arch, setArch] = useState(false);
  useEffect(() => { probe(IMG.arch).then((i) => setArch(!!i)); }, []);
  return (
    <header className="sec hero" id="hero">
      <div className="gan deva" data-in>॥ श्री गणेशाय नमः ॥</div>
      {IMG.heroArt ? (
        <div className="arch painted" data-in>
          <div className="arch-glow" />
          <div className="arch-frame">
            <img id="heroImg" src={IMG.heroArt} alt="Ritu and Suraj in silhouette, foreheads touching, inside a flower-draped jharokha arch" width={1200} height={1600} fetchPriority="high" />
          </div>
        </div>
      ) : (
        <div className={`arch${arch ? ' has-art' : ''}`} data-in>
          <div className="arch-glow" />
          <div className="arch-frame">
            <div className="arch-in">
              <img id="heroImg" src={IMG.couple1} alt="Ritu and Suraj in silhouette, foreheads touching, lit from behind" width={800} height={1200} fetchPriority="high" />
              <div className="tint" />
            </div>
          </div>
          {arch && <img className="arch-art" src={IMG.arch} alt="" />}
        </div>
      )}
      <h1 className="names">
        <span className="ln"><span data-in>Ritu<span className="sur">Kesarwani</span></span></span>
        <span className="amp" data-in>weds</span>
        <span className="ln"><span data-in>Suraj<span className="sur">Kesarwani</span></span></span>
      </h1>
      <p className="when" data-in><b>Monday, 23 November 2026</b> · Mumbai</p>
      <div className="cue" data-in>Scroll to read<i /></div>
    </header>
  );
}

/* ---------------- Invitation ---------------- */
export function Invitation() {
  const Person = ({ who, p }: { who: string; p: typeof bride }) => (
    <div className="person" data-rv>
      <span className="who">{who}</span>
      <span className="nm">{p.name}</span>
      <span className="sur">Kesarwani</span>
      <span className="hi">{p.hindi}</span>
      <p>{p.lines.map((l, i) => <span key={i}>{i === 0 ? <b>{l}</b> : l}<br /></span>)}</p>
    </div>
  );
  return (
    <section className="sec" id="invite" aria-labelledby="inv-h">
      <div className="col center">
        <div className="om" aria-hidden="true" data-rv>ॐ</div>
        <div className="invoc deva" data-rv><span>॥ श्री गणेशाय नमः ॥</span><span>॥ कुलदेवताय नमः ॥</span><span>॥ जय श्री राम ॥</span><span>॥ हर हर महादेव ॥</span></div>
        <p className="doha deva" data-rv>सदा भवानी दाहिनी, सन्मुख रहें गणेश।<br />पाँच देव रक्षा करें, ब्रह्मा विष्णु महेश॥</p>
        <p className="trans" data-rv>May Mother Bhavani stand at our right and Lord Ganesha before us. May Brahma, Vishnu and Mahesh keep us all.</p>
        <Thread />
        <h2 id="inv-h" className="sr">The invitation</h2>
        <p className="lead" data-rv>With the grace of the Almighty and the blessings of Maa Jagdamba, the Kesarwani family warmly invites you to the wedding of their daughter</p>
        <Person who="The bride" p={bride} />
        <span className="with" data-rv>with</span>
        <Person who="The groom" p={groom} />
        <Thread />
        <p className="note" data-rv>We humbly request you and your family to come on time and bless the couple as they begin their new life together.</p>
      </div>
    </section>
  );
}

/* ---------------- Date reveal + countdown ---------------- */
function useCountdown() {
  const [t, setT] = useState(() => WEDDING_START_UTC - Date.now());
  useEffect(() => { const i = setInterval(() => setT(WEDDING_START_UTC - Date.now()), 1000); return () => clearInterval(i); }, []);
  const s = Math.max(0, Math.floor(t / 1000));
  const p = (n: number) => String(n).padStart(2, '0');
  return { done: t <= 0, d: String(Math.floor(s / 86400)), h: p(Math.floor((s % 86400) / 3600)), m: p(Math.floor((s % 3600) / 60)), s: p(s % 60) };
}

function Tile({ value, label, onDone }: { value: string; label: string; onDone: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const cv = ref.current!; let finished = false;
    const foil = () => {
      const r = cv.getBoundingClientRect(), w = Math.max(60, r.width), h = Math.max(60, r.height);
      cv.width = w * DPR; cv.height = h * DPR; const x = cv.getContext('2d')!; x.setTransform(DPR, 0, 0, DPR, 0, 0);
      const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#F6C46A'); g.addColorStop(0.35, '#E3831B'); g.addColorStop(0.5, '#FFD98C'); g.addColorStop(0.7, '#D46E14'); g.addColorStop(1, '#F3B353');
      x.fillStyle = g; x.fillRect(0, 0, w, h);
      for (let i = 0; i < 160; i++) { x.fillStyle = `rgba(255,255,255,${R(0.08, 0.3)})`; x.fillRect(R(0, w), R(0, h), 1.2, 1.2); }
      x.strokeStyle = 'rgba(255,240,210,.7)'; x.strokeRect(5, 5, w - 10, h - 10);
      x.fillStyle = 'rgba(90,30,5,.65)'; x.font = '600 11px "Cormorant Garamond", Georgia, serif'; x.textAlign = 'center'; x.fillText('S C R A T C H', w / 2, h / 2 + 4);
    };
    foil();
    const x = cv.getContext('2d')!; let down = false, moved = 0, n = 0;
    const finish = () => { if (finished) return; finished = true; setDone(true); onDone(); };
    const scr = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect(); x.globalCompositeOperation = 'destination-out';
      x.beginPath(); x.arc(e.clientX - r.left, e.clientY - r.top, 16, 0, 7); x.fill();
      if (++n % 6 === 0) { const d = x.getImageData(0, 0, cv.width, cv.height).data; let c = 0, t = 0; for (let i = 3; i < d.length; i += 64) { t++; if (d[i] < 40) c++; } if (c / t > 0.55) finish(); }
    };
    const pd = (e: PointerEvent) => { down = true; moved = 0; cv.setPointerCapture(e.pointerId); scr(e); };
    const pm = (e: PointerEvent) => { if (down) { moved++; scr(e); } };
    const pu = () => { down = false; if (moved < 3) finish(); };
    const kd = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); finish(); } };
    cv.addEventListener('pointerdown', pd); cv.addEventListener('pointermove', pm); cv.addEventListener('pointerup', pu); cv.addEventListener('keydown', kd);
    addEventListener('resize', foil);
    return () => { cv.removeEventListener('pointerdown', pd); cv.removeEventListener('pointermove', pm); cv.removeEventListener('pointerup', pu); cv.removeEventListener('keydown', kd); removeEventListener('resize', foil); };
  }, []);
  return (
    <div className="tile">
      <div className="box"><b>{value}</b><canvas ref={ref} className={done ? 'done' : ''} role="button" tabIndex={done ? -1 : 0} aria-label={`Scratch to reveal the ${label.toLowerCase()}`} /></div>
      <span>{label}</span>
    </div>
  );
}

export function DateReveal() {
  const c = useCountdown();
  const [n, setN] = useState(0);
  const [cal, setCal] = useState(false);
  const tiles = useRef<HTMLDivElement>(null);
  const hit = () => setN((v) => {
    const nv = v + 1;
    if (nv === 3) { const r = tiles.current!.getBoundingClientRect(); kesar.burst(r.left + r.width / 2, r.top + r.height / 2, r.width); }
    return nv;
  });
  const hall = `${venue.name}, ${venue.address}`;
  return (
    <section className="sec" id="date" aria-labelledby="date-h">
      <div className="col center">
        <span className="label">Save the date</span>
        <h2 className="h2" id="date-h" data-rv>Scratch <em>to reveal</em></h2>
        <p className="lead">Scratch all three tiles to start the countdown</p>
        <div className="tiles" ref={tiles}>
          <Tile value="23" label="Day" onDone={hit} />
          <Tile value="11" label="Month" onDone={hit} />
          <Tile value="2026" label="Year" onDone={hit} />
        </div>
        {n < 3 ? null : <p className="begins bloom">The celebration begins</p>}
        {n < 3 ? null : c.done ? <p className="begins">The celebrations are on</p> : (
          <div className="count bloom" aria-label="Time left until the wedding">
            <div><b>{c.d}</b><span>Days</span></div><span className="colon" aria-hidden="true">:</span>
            <div><b>{c.h}</b><span>Hours</span></div><span className="colon" aria-hidden="true">:</span>
            <div><b>{c.m}</b><span>Mins</span></div><span className="colon" aria-hidden="true">:</span>
            <div><b>{c.s}</b><span>Secs</span></div>
          </div>
        )}
        <button className="btn" type="button" aria-expanded={cal} aria-controls="cal" onClick={() => setCal(!cal)}><span className="fill" aria-hidden="true" />Add to calendar</button>
        {cal && (
          <div className="cal" id="cal">
            {events.map((e) => (
              <a key={e.key} target="_blank" rel="noopener" href={gcal(`${e.title} · Ritu & Suraj`, e.cal[0], e.cal[1], e.key === 'haldi' ? e.place + ', Mumbai' : hall, `${e.time}. ${e.note}.`)}>
                {e.title} <small>{e.dow.slice(0, 3)} {e.day} Nov</small>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------- Moments ---------------- */
export function Moments() {
  return (
    <section className="sec" id="us" aria-labelledby="us-h">
      <div className="col center">
        <span className="label">Two of us</span>
        <h2 className="h2" id="us-h" data-rv>Lit from <em>within</em></h2>
      </div>
      <div className="collage">
        <figure className="ph ph-a"><img data-par="-8" src={IMG.couple1} alt="Ritu and Suraj, foreheads touching" width={800} height={1200} loading="lazy" /></figure>
        <p className="cap cap-a" data-rv>one quiet moment</p>
        <figure className="ph ph-b"><img data-par="8" src={IMG.couple2} alt="Suraj kissing Ritu's forehead" width={1100} height={1650} loading="lazy" /></figure>
        <p className="cap cap-b" data-rv>and a lifetime after</p>
      </div>
    </section>
  );
}

/* ---------------- Events ---------------- */
function Scene({ k }: { k: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<string | null>(null);
  useEffect(() => {
    const src = (IMG as any)[k] as string;
    probe(src).then((i) => {
      if (i) { setImg(src); return; }
      const cv = ref.current; if (!cv) return; scenes[k](cv.getContext('2d')!, cv.width, cv.height);
    });
  }, [k]);
  return (
    <div className="scene" data-scene>
      {img ? <img src={img} alt="" loading="lazy" /> : <canvas ref={ref} width={640} height={800} />}
    </div>
  );
}

const Diya = () => (
  <svg viewBox="0 0 60 60" aria-hidden="true">
    <defs>
      <radialGradient id="dl"><stop offset="0" stopColor="rgba(255,190,90,.55)" /><stop offset="1" stopColor="rgba(255,190,90,0)" /></radialGradient>
      <linearGradient id="df" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFE7A3" /><stop offset=".6" stopColor="#F29A2E" /><stop offset="1" stopColor="#C2410C" /></linearGradient>
    </defs>
    <ellipse className="light" cx="30" cy="22" rx="22" ry="22" fill="url(#dl)" />
    <path className="flame" d="M30 10c5 7 7 11 7 15a7 7 0 0 1-14 0c0-4 2-8 7-15z" fill="url(#df)" />
    <path d="M8 34c6 10 38 10 44 0-4 0-8-1-11-3H19c-3 2-7 3-11 3z" fill="#B5762A" />
    <path d="M8 34c6 10 38 10 44 0" fill="none" stroke="#7A4A14" strokeWidth="1.2" />
    <path d="M22 44h16l-3 5H25z" fill="#9C6420" /><circle cx="30" cy="33" r="2" fill="#5A2E0A" />
  </svg>
);

export function Events() {
  return (
    <section className="sec" id="events" aria-labelledby="ev-h">
      <div className="col center">
        <span className="label">Mangalik karyakram</span>
        <h2 className="h2" id="ev-h" data-rv>Three days, <em>three lamps</em></h2>
        <p className="deva hi-sub">मांगलिक कार्यक्रम</p>
      </div>
      <div className="spine">
        <span className="prog" aria-hidden="true" />
        {events.map((e) => (
          <article className="ev" key={e.key}>
            <div className="diya"><Diya /></div>
            <div className="ev-body">
              <div className="when"><b>{e.day}</b><span>{e.dow} · November</span></div>
              <h3>{e.title}</h3>
              <div className="hi">{e.hindi}</div>
              <Scene k={e.key} />
              <p className="t">{e.time}</p>
              <p className="p">{e.note}. {e.place}</p>
              <a className="map" target="_blank" rel="noopener" href={e.map}>Open map</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Venue ---------------- */
export function Venue() {
  const [msg, setMsg] = useState('');
  const addr = useRef<HTMLParagraphElement>(null);
  const copy = () => {
    const txt = `${venue.name}, ${venue.address} (near Bandra Colony Underground Metro, BKC)`;
    const fb = () => { const r = document.createRange(); r.selectNodeContents(addr.current!); const s = getSelection()!; s.removeAllRanges(); s.addRange(r); setMsg('Address selected, tap Copy'); };
    try { navigator.clipboard.writeText(txt).then(() => setMsg('Address copied'), fb); } catch { fb(); }
    setTimeout(() => setMsg(''), 2400);
  };
  return (
    <section className="sec" id="venue" aria-labelledby="ve-h">
      <div className="venue">
        <span className="label">The venue</span>
        <h2 id="ve-h" data-rv>Uttar Bhavan <em>Hall</em></h2>
        <p className="addr" ref={addr} data-rv>{venue.address}</p>
        <p className="near" data-rv>{venue.near}</p>
        <div className="mapcard" data-rv>
          <iframe title="Map showing Uttar Bhavan Hall, BKC, Mumbai" src={venue.embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
          <a className="mapchip" href={venue.pin} target="_blank" rel="noopener">Open in Maps
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3H3v10h10v-3M9 3h4v4M13 3 7 9" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
          </a>
        </div>
        <div className="row" data-rv>
          <a className="btn solid" target="_blank" rel="noopener" href={venue.directions}><span className="fill" aria-hidden="true" />Get directions<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg></a>
          <button className="btn" type="button" onClick={copy}><span className="fill" aria-hidden="true" />Copy address</button>
        </div>
      </div>
      <div className={`toast${msg ? ' show' : ''}`} role="status" aria-live="polite">{msg}</div>
    </section>
  );
}

/* ---------------- Families ---------------- */
export function Families() {
  return (
    <section className="sec" id="family" aria-labelledby="fa-h">
      <div className="col center">
        <span className="label">Where the families live</span>
        <h2 className="h2" id="fa-h" data-rv>Two homes, <em>one name</em></h2>
      </div>
      <div className="homes">
        {homes.map((h) => (
          <div key={h.title} data-rv><h3>{h.title}</h3><div className="hi">{h.hindi}</div>{h.lines.map((l) => <p key={l}>{l}</p>)}</div>
        ))}
      </div>
      <div className="hosts" data-rv>
        <div><div className="k">Invited by</div><div className="v">{hosts.by}</div></div>
        <div><div className="k">Eagerly awaiting you</div><div className="v">{hosts.awaiting} <span>and the whole Kesarwani family</span></div></div>
      </div>
    </section>
  );
}

/* ---------------- Finale ---------------- */
export function Finale() {
  return (
    <>
      <section className={`finale${IMG.finaleArt ? ' painted' : ''}`} id="end" aria-labelledby="end-h">
        <div className="bg"><img data-par="6" src={IMG.finaleArt || IMG.couple2} alt="" width={1080} height={1920} loading="lazy" /></div>
        <div className="in">
          <p className="bless" data-rv>Come with your blessings. We will keep a seat warm for you.</p>
          <h2 className="nm" id="end-h" data-rv>Ritu<span className="sur">Kesarwani</span><span className="and">and</span>Suraj<span className="sur">Kesarwani</span></h2>
          <p className="dt" data-rv>23 · 11 · 2026</p>
          <p className="wait" data-rv>Please join us on time. We will be waiting for you.</p>
        </div>
      </section>
      <footer className="foot">With love, the Kesarwani family · Mumbai</footer>
    </>
  );
}

/* ---------------- Dock ---------------- */
export function Dock() {
  const [on, setOn] = useState(false);
  const go = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const t = document.querySelector<HTMLElement>(e.currentTarget.getAttribute('href')!); if (!t) return;
    e.preventDefault(); scrollToEl(t); t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true });
  };
  return (
    <nav className="dock" id="dock" aria-label="Invitation sections">
      {[['date', 'Date'], ['events', 'Events'], ['venue', 'Venue'], ['family', 'Family']].map(([id, l]) => <a key={id} href={`#${id}`} data-sec={id} onClick={go}>{l}</a>)}
      <button type="button" className={on ? 'on' : ''} aria-pressed={on} aria-label={on ? 'Pause music' : 'Play music'} onClick={() => { try { setOn(toggleMusic()); } catch { /* no audio */ } }}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9 18.5A2.5 2.5 0 1 1 6.5 16c.53 0 1.02.16 1.5.42V5l11-2v12.5A2.5 2.5 0 1 1 16.5 13c.53 0 1.02.16 1.5.42V7.2l-8 1.45z" /></svg>
      </button>
    </nav>
  );
}

export { reduced };
