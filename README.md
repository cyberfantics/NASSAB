# NASSAB — Digital Family Tree & Heritage Preservation

Family tree & heritage, done right.

A Flutter and Firebase genealogy and family heritage platform, with a
premium light editorial website built for Vercel (static HTML, Tailwind-free
custom CSS, vanilla JavaScript — no build step).

Site: https://nassab-nine.vercel.app/

**Founder & Lead Developer: Syed Mansoor ul Hassan Bukhari, Aug 2026 – Present, Rawalpindi, Pakistan. Developed by CyberFantics.**

## Pages (distinct URLs, Vercel cleanUrls)

- index.html — Home: hero with clickable phones, app theatre (Welcome, Explore, Tree, Person, Fan, Verify, no auto-play, with a decorative motif per step), what makes NASSAB different with links to Features groups, visual SVG relationship diagram, gallery preview, privacy & certificates, how it works, closed testing
- features.html — Features, grouped editorially, with live search, group filters, and anchors #group-family, #group-kinship, #group-history, #group-records, #group-privacy
- gallery.html — App Gallery, rounded-octagonal frames with a thin outline, staggered reveal, mobile swipe row + accessible lightbox with filter chips, count, touch/mouse swipe, and zoom toggle
- records.html — Record updates, local-only tickets with live preview and email/WhatsApp sending
- about.html — About, mission, founder, confirmed-milestones timeline, heritage seal around the existing logo, traditional perspective (English only)
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
- Lineage certificates with SHA-256 document-integrity verification. Not blockchain-verified, not legally certified ancestry.
- Record update and verification tickets, stored in the browser only unless sent by email/WhatsApp.

## Status — stated honestly

- Nassab app in closed Play testing (package `com.cyberfantics.nassab`, tester-list only, Alpha track, 30 testers on the tester list).
- NOT publicly listed yet. No public Google Play or App Store link is claimed.
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

Gallery code falls back from `images/app-*.jpg` to the original
`images/Screenshot_20261027-*.jpg.jpeg` names, then to a tasteful unavailable
note, never a broken image or fabricated mockup.

## Technology (website)

- Frontend: HTML5, custom CSS design tokens, vanilla JavaScript (ES6+)
- Typography: Cormorant Garamond (display), Inter (body)
- Hosting: Vercel static hosting, see vercel.json

## Run locally

```bash
python -m http.server 8080
# open http://localhost:8080
```

## Connect

- Project site: https://nassab-nine.vercel.app/
- Instagram: https://www.instagram.com/nassabapp/
- Facebook: https://facebook.com/NassabApp
- Email: digital.creator380@gmail.com

## Living Heritage motion (vanilla CSS/JS only)

- Living hero genealogy network (abstract nodes only, no names or dates), pointer shift of a few pixels on desktop, static on touch.
- Scroll-progress indicator under the header, compact sticky header on scroll, animated section numbers and gold dividers.
- Relationship diagram paths redraw on selection; Rada'at shown in gold, kept distinct from biological and marriage lines.
- Home privacy demo with Open / Masked / Guest states using abstract sample labels only.
- All motion respects prefers-reduced-motion and content remains fully visible without animation.
