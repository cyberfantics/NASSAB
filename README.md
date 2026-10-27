# NASSAB — Digital Family Tree & Heritage Preservation

Family tree & heritage, done right.

A Flutter and Firebase genealogy and family heritage platform, with a
premium light editorial website built for Vercel (static HTML, custom CSS,
vanilla JavaScript — no build step, no framework, no backend).

Site: https://nassab-nine.vercel.app/

**Founder & Lead Developer: Syed Mansoor ul Hassan Bukhari, Aug 2026 – Present, Rawalpindi, Pakistan. Developed by CyberFantics.**

## Pages (distinct URLs, Vercel cleanUrls)

- index.html — Home: living hero with clickable phones, Interactive App Theatre (Welcome, Explore, Tree, Person, Fan, Verify, no auto-play, with a decorative motif per step and a safe sticky phone on desktop), what makes NASSAB different with links to Features groups, animated visual SVG relationship explorer, gallery preview, privacy & certificates, how it works, closed testing
- features.html — Features, grouped editorially (Family, Kinship, History, Records, Privacy), with live search, group filters, and anchors #group-family, #group-kinship, #group-history, #group-records, #group-privacy
- gallery.html — App Gallery, true rounded-octagonal frames with a thin outline, staggered reveal, mobile swipe row, accessible lightbox with filter chips, count, touch/mouse swipe, zoom toggle, and shared-element (FLIP) open/close
- records.html — Record updates, local-only tickets with live preview, expandable ticket details, and email/WhatsApp sending as explicit separate actions
- about.html — About, mission, founder, confirmed-milestones timeline (August 2026 founded, founder, CyberFantics, Rawalpindi, Google Play closed testing), heritage seal around the existing logo, traditional perspective (English only)
- privacy.html — Privacy Policy, October 2026
- terms.html — Terms of Service, October 2026
- contact.html — Contact, official details only

## What Nassab is

Digital genealogy platform preserving, organising and exploring family
records and complex lineages, including male and female descendants,
marriages, divorces, remarriages, half-siblings and step-relations, without
duplicate records.

- Rada'at (milk-kinship) as a separate relationship type.
- Mahram and marriage-eligibility interpretation, undetermined where evidence is missing, never guessed, not a final religious or legal authority.
- Privacy by design: protected female names masked, guest mode available.
- Lineage certificates with SHA-256 document-integrity verification. Not blockchain-verified, not legally certified ancestry, and document integrity does not prove genealogical truth.
- Record update and verification tickets, stored in the browser only unless sent by email/WhatsApp. Creating a local ticket does not send it to a server.

## Status — stated honestly

- Nassab app in closed Play testing (package `com.cyberfantics.nassab`, tester-list only, Alpha track, 30 testers on the tester list).
- NOT publicly listed yet. No public Google Play or App Store link is claimed.
- Closed-testing link (tester-list only): https://play.google.com/apps/testing/com.cyberfantics.nassab
- Project site: https://nassab-nine.vercel.app/

## Images / Screenshots

Real app screenshots in `images/`, user-supplied, with generic captions only:

- app-welcome.jpg — Welcome
- app-explore.jpg — Explore historical people
- app-tree.jpg — Family tree
- app-person.jpg — Person detail
- app-fan.jpg — Fan chart
- app-verify.jpg — Verify certificate
- app-signout.jpg — present in the directory, intentionally NOT in the gallery

Gallery code uses `images/app-*.jpg` as primary, with a defensive fallback
to the original `Screenshot_20261027-*.jpg.jpeg` names (no longer present in
the repo after the rename by re-upload), then to a tasteful unavailable
note, never a broken image or fabricated mockup.

## Technology (website)

- Frontend: HTML5, custom CSS design tokens, vanilla JavaScript (ES6+)
- Typography: Cormorant Garamond (display), Inter (body) — English only, no Urdu wording anywhere on the site
- Colours: warm ivory #F8F6F0, white #FFFFFF, deep forest green #173E32, ink #212A25, antique gold #AE9250 (decorative only), warm stone #E8E4D9, borders #DDD9CF
- Hosting: Vercel static hosting, see vercel.json

## Living Heritage motion (vanilla CSS/JS only, no GSAP, no React)

- Living hero genealogy network (abstract nodes only, no names or dates): each of the 5 nodes moves individually toward the pointer on desktop (max 10px, distance falloff, lines recomputed so they stay connected), static/dimmed on touch and with reduced-motion.
- Interactive App Theatre: sticky phone inside the theatre section only (desktop, 1024px+, ends at section end, no scroll hijacking, no trapping), scroll-sync to the centred step, clicks always win over scroll sync.
- Relationship explorer: SVG paths redraw on selection via stroke-dashoffset; Ancestor, Descendant, Rada'at (gold, distinct from biological and marriage lines), and Marriage (double-line) each highlight their own route. Diagram is illustrative only, no real family, no personal names, dates, or records.
- Octagonal gallery: staggered reveal, border draw, hover scale about 2–3%, lightbox with shared-element FLIP open/close for hero, theatre, gallery, and preview images (Prev/Next and swipe inside the lightbox keep instant swap; reduced-motion is instant open/close; focus is restored to the original opener).
- Home privacy demo with Open / Masked / Guest states using abstract sample labels only.
- Scroll-progress indicator under the header, compact sticky header on scroll, animated section numbers and gold dividers, back-to-top button.
- All motion respects prefers-reduced-motion and content remains fully visible without animation. All functionality works without animation.

## Run locally

```bash
python -m http.server 8080
# open http://localhost:8080
```

## Connect

- Project site: https://nassab-nine.vercel.app/
- Instagram: https://www.instagram.com/nassabapp/
- Facebook: https://facebook.com/NassabApp — publicly visible as “Nassab” (341 followers at last public check, 27 Oct 2026, dark-green golden-tree logo, family-history intro), but official status is not verified from public view alone: no verification badge was seen, no website link was seen in the publicly readable portion, and full About details require Facebook sign-in
- Email: digital.creator380@gmail.com

## Known limits

- Record submissions have no backend: tickets are local-browser only, as disclosed on the Records page.
- Lightbox Prev/Next and swipe steps inside the lightbox do not use the shared-element transition (no thumbnail to fly from); they use instant swap.
- Theatre sticky range is only the theatre's own height by design, not a long scroll-driven showcase.
- No Lighthouse score or frame rate is claimed; performance work so far is transforms/opacity only, one throttled scroll listener, and IntersectionObservers that unobserve after firing.
