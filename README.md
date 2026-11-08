# Enning Yang — personal website

Static personal website published at https://zihuaihuai.github.io/.

## Preview

Run `python3 -m http.server 8765` from this directory, then open http://localhost:8765.

No build, package installation, or external resource is required. GitHub Pages serves the root of the `main` branch. The site works without JavaScript; JavaScript adds motion, the mobile navigation toggle, and a decorative network illustration.

## Edit

- `index.html`: biography, experience, projects, research, and contact links.
- `styles.css`: responsive layout, typography, and colors.
- `script.js`: navigation, reveals, lazy autoplay for the case-study videos, and the image lightbox.
- `media/`: WebM recordings (IronFist handover report, brainscores.ai demo journey, BrainSpace WebGL report) and JPEG screenshots/figures. Sources and crops are listed in `media/SOURCES.md`.
- `assets/enning-yang.jpg`: user-supplied portrait (`IMG_0268 2.heic`), converted to JPEG with metadata removed.

Content is based on `CV_Enning_Yang_2026_v2.pdf` (November 2026); `assets/Enning_Yang_Resume.pdf` is the public copy of that résumé with the phone number removed, built by `../tools/build_resume_2026_11.py` with `PUBLIC=1`. Publication and project links were checked against their official pages. The phone number is not included in this public repository. The numbers on the page (pull requests, tests, citations, downloads, releases) were counted on 2026-11-06 and should be refreshed when the résumé is. Project descriptions describe Enning's contributions; the decorative network is not scientific data or a product screenshot.

## Design

- Visual thesis: a warm editorial portfolio with generous typography, a real portrait, and a restrained forest-green palette.
- Content: portrait and introduction with availability → key numbers → selected work (platform flow, open source, deep learning, ports, LLM products) → background → research → contact.
- Interaction: staggered hero entrance, sections revealed on scroll, subtle link/arrow motion; respect reduced-motion preferences.

## Maintenance

Update dates, roles, publication links, and project descriptions in `index.html` as needed. Keep `sitemap.xml` and social metadata current. Before publishing, check the site at desktop and mobile widths and verify links. Do not add personal documents, credentials, or private project material.
