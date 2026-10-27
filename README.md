<div align="center">

# NASSAB (نَسَب) — Digital Family Tree & Heritage Preservation

### Family tree & heritage, done right

A Flutter and Firebase genealogy and family heritage platform, with a
web presence built for Vercel.

[![Nassab site](https://img.shields.io/badge/Nassab-Website-14532D?style=for-the-badge)](https://nassab-nine.vercel.app/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mansoor-bukhari/)
[![Email](https://img.shields.io/badge/Email-Contact-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:digital.creator380@gmail.com)

**Founder & Lead Developer: Syed Mansoor ul Hassan Bukhari (Mansoor Bukhari), Aug 2026 – Present, based in Rawalpindi, Pakistan.**

</div>

---

## What Nassab is

NASSAB is a digital genealogy platform dedicated to preserving,
organizing, and exploring family records, Shajra, and complex
historical lineages. It represents complete family relationships,
including male and female descendants, marriages, divorces,
remarriages, half-siblings, and step-relations, without data
duplication.

> "Preserving Heritage. Organizing Lineage. Connecting Generations."

## Key features

- **Rada'at (milk-kinship) as a separate relationship type.**
  Rada'at kinship is handled distinctly from blood and marriage
  relationships, rather than folded into a generic family tree.
- **Mahram and marriage-eligibility interpretation.**
  The platform interprets Mahram relationships and
  marriage eligibility from the recorded kinship structure.
- **Privacy by design.** Protected female names are masked,
  and a guest mode is available.
- **Lineage certificates with SHA-256 document-integrity
  verification.** Certificates carry a SHA-256 hash for
  document-integrity checking. Nassab is not described here as
  blockchain-verified or legally certified ancestry.
- **Inclusive, graph-based family representation.** Mothers,
  daughters, and female ancestors are mapped with equal status,
  and complex relationships are modelled as a relational graph
  rather than a simple parent-child tree.
- **Record update and verification tickets.** The web experience
  includes an interactive record-update and verification ticket
  portal, with a live preview card, ticket references, and
  proof attachment handling, as described in the original
  repository documentation.

## Status — stated honestly

- The Nassab app is in **closed Play testing** (package
  `com.cyberfantics.nassab`, tester-list only).
- **It is NOT publicly listed yet on 27 Oct 2026.** No public
  Google Play or App Store link is claimed here, and the
  closed-testing link is not presented as a public store link.
- Project site: https://nassab-nine.vercel.app/

## Images / Screenshots

The only image verified in this repository's documentation is the
project logo, referenced in the original README as `logo.png`.
No app screenshots (family tree, record, certificate, or other
in-app screens) were verified in this repository, so none are
linked here and no placeholder image URLs are used.

![NASSAB Logo](logo.png)

Screenshots will be added here when the app images are supplied.
The exact files needed are (also listed on the site Showcase section):

- `app-home.png` — home / tree screen
- `app-radaat.png` — Rada'at view
- `app-certificate.png` — certificate screen

Until those files are supplied and verified in the repository,
this section contains only the logo above, plus this placeholder
note. If `logo.png` is not present in the repository root, that
image line should be removed rather than left as a broken link.

## Repository & project structure (web app, as documented)

```text
├── index.html        # Main web application structure & responsive sections
├── styles.css        # Professional light editorial theme (v3, Oct 2026): off-white, deep forest accent, thin gold rule only, Fraunces + Inter + Noto Nastaliq
├── script.js         # Page navigation, ticket generator, modal logic, local storage (v3 classes: nav-active, toggle-active, modal open, toast show)
├── logo.png          # Nassab branding logo image
├── vercel.json       # Vercel deployment configuration & security headers
└── README.md         # Documentation & project guide
```

## Technology stack (web app, as documented)

- Frontend: HTML5, custom CSS in styles.css (no Tailwind CDN in v3), Vanilla JavaScript (ES6+)
- Typography: Fraunces for display headings, Inter for body (English) & Noto Nastaliq Urdu (Urdu/Arabic)
- Design (v3): light, clean, editorial and professional — the public face of Nassab. No dark emerald-gold gradient theme, no glow effects, no fake family example with invented names; the site diagram uses labelled relationship types only.
- Hosting & Deployment: Vercel Static Hosting
- Mobile app (as described on the founder's profile): Flutter & Firebase

## How to run & deploy (web app)

No complex build steps or node modules are required for the web app:

1. Open `index.html` in a web browser, or serve locally:
   ```bash
   python -m http.server 8080
   ```
   Then open `http://localhost:8080` in a browser.
2. Deploy via GitHub & Vercel Dashboard, following the original
   repository's deployment instructions and `vercel.json`.

## Connect

- Project site: https://nassab-nine.vercel.app/
- Founder on LinkedIn: https://www.linkedin.com/in/mansoor-bukhari/
- Contact email: digital.creator380@gmail.com


## App showcase — approved screenshots (user uploads images)

The website Showcase gallery references six images in `images/`, uploaded by the owner (binary images are not pushed via the text-only GitHub connector):

- `images/app-welcome.jpg` — Welcome screen, hero showcase image
- `images/app-explore.jpg` — Historical People, Explore screen
- `images/app-tree.jpg` — Family tree view
- `images/app-person.jpg` — Person detail screen
- `images/app-fan.jpg` — Fan chart screen
- `images/app-verify.jpg` — Verify Chronicle certificate screen

The sign-out screen is intentionally NOT included in the showcase. If an image is missing, the gallery hides that item automatically instead of showing a broken image. Captions use generic names only, no personal names.
