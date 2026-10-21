# Ritu & Suraj · Wedding invitation

A real website (React + Vite + GSAP + Lenis) for the wedding of Ritu and Suraj, 23 November 2026, Uttar Bhavan Hall, BKC, Mumbai.

Guests open a sealed envelope: the wax seal cracks with saffron light that runs through the embossed paper, the flap swings open on its hinge, the card slides out and grows into the page. Then: the couple, the invitation, a rub-to-reveal date with countdown, three ceremonies on a timeline of diyas, the venue with directions, the family homes, and a maroon finale.

The idea: both families carry the name Kesarwani, from *kesar*, saffron. The page steeps like saffron in milk: it warms from milk white to saffron as you scroll, and saffron strands drift behind the text and swirl when touched.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the build on http://localhost:4400
```

`?open` at the end of the address skips the envelope (useful for testing).

## Publish

Push to `main`. The workflow in `.github/workflows/deploy.yml` builds the site and publishes it to the `gh-pages` branch, which GitHub Pages serves at https://sonu9633.github.io/suraj-ritu-wedding-invitation/. Progress shows under the repo's **Actions** tab.

The earlier single-file version is kept in `legacy/index.html`.

## Where things live

| What | File |
|---|---|
| All names, dates, times, addresses, links | `src/site.ts` |
| Envelope opening | `src/components/Envelope.tsx`, `src/lib/paper.ts` |
| All other sections | `src/components/Sections.tsx` |
| Saffron strands + page warming | `src/components/Kesar.tsx` |
| Scroll motion | `src/App.tsx` |
| Seal sounds and music | `src/lib/sound.ts` |
| Colours, type, layout | `src/styles.css` |
| Photos and optional art | `public/images/` |

## Optional generated art

The site works without these: it draws its own paper, seal, liner and ceremony scenes. Drop any of these files into `public/images/` with exactly this name and rebuild; the site picks them up automatically.

| File | Used for |
|---|---|
| `envelope-paper.jpg` | envelope paper |
| `wax-seal.png` | the seal |
| `envelope-liner.jpg` | inside of the envelope and flap |
| `arch-frame.png` | gold arch around the hero photo |
| `event-haldi.jpg`, `event-vivah.jpg`, `event-vidaai.jpg` | ceremony illustrations |
