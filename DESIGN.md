# Ritu & Suraj — DESIGN.md

## Brief
Subject: wedding of Ritu Kesarwani and Suraj Kesarwani, Mumbai, 22–24 Nov 2026.
Audience: family and guests opening a WhatsApp link on a phone. Job: feel the occasion in 3 s, then find date, events, venue.
Assets: two backlit B&W silhouette photos. Language: English with Devanagari invocations.
Stack: React 18 + Vite + TypeScript, GSAP (ScrollTrigger) + Lenis on one clock. Single page; ?open skips the gate. Deployed as static files (GitHub Pages workflow included).
References: three Instagram reels (embossed envelope + cracking wax seal + light, arched hero, scratch date, diya/jharokha timeline, countdown, venue).

## Concepts
| | Idea | Anchor | Signature | O/F/Fe/P |
|---|---|---|---|---|
| A. Kesar (name) | Both families carry the name Kesarwani, from kesar, saffron. The invitation steeps like kesar in warm milk. | the surname | tap the seal: saffron light cracks through the embossed paper; strands of kesar drift and bleed colour as you scroll; touch stirs them | 5/5/4/1 |
| B. Ghat (place) | Prahlad Ghat, Varanasi: the schedule descends ghat steps, a diya lit per event | groom's native place | diyas light as you descend | 4/3/3/2 |
| C. Backlight (material) | Their photos are silhouettes against a softbox; the site is lit from behind | the photos | everything glows from behind | 3/4/4/3 |

Pick A: it can only belong to this couple. Steal B for the event timeline (a diya lights per event) and C for the photo treatment (saffron backlight behind the silhouettes).

## Concept card
Idea:        Two Kesarwani families, named for saffron, steep together like kesar in milk.
Metaphor:    saffron strands blooming in warm milk.
Signature:   the seal cracks and saffron light runs through the embossed paper; flaps part; strands of kesar drift over the page for the rest of the visit and swirl when touched.
Emotion:     hushed, warm, ceremonial.
Motion verb: steep and bloom — colour diffuses in, slow ease-out, soft blur to sharp.
Screenshot:  the ivory envelope with glowing saffron fissures spreading from the wax seal.

## System
Palette (concept demands milk + saffron; this is the AI "cream + terracotta" tell, used deliberately: ground is cooler milk, accent is true saffron, not clay):
- milk   #F7F4EC ground (warms to #F6E9D2 with scroll: the steep)
- ink    #2E1410 text
- muted  #6B4A3F secondary text (AA on both grounds)
- line   rgba(46,20,16,.14)
- kesar  #E3831B accent (graphics, large type only); kesar-ink #A3440C for small accent text (AA)
- curtain #4E111B maroon finale
Type: Pinyon Script (names only), Cormorant Garamond (display, italic, body 18–19 px), Tiro Devanagari Hindi (invocations).
Shape: arches (jharokha) for frames, 2 px radius elsewhere; pills for controls.
Motion: ease out = expo.out, hovers power3.out 0.4 s; buttons fill with saffron from the pointer's side (diffusion); dock links draw a saffron thread underline.
Driver: one value `steep` (page scroll 0..1) → ground colour, strand halo strength. Idle: strands drift on gsap.ticker; pointer/touch stirs them. Off under reduced motion.
Sections: gate (full-bleed X-fold) / hero (arch, centred) / invitation (narrow text column) / date (3 tiles) / moments (offset two-image collage) / events (centre spine, alternating) / venue (big type left) / families (two columns) / finale (full-bleed maroon photo).
Genericness test: a generic build would be pink/gold with sparkles. Changed: the colour story and all particles come from saffron in milk; the seal crack is saffron light, not white; the timeline lights diyas.
