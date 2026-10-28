# Enning Yang — personal website

Static personal website published at https://zihuaihuai.github.io/.

## Preview

Run `python3 -m http.server 8765` from this directory, then open http://localhost:8765.

No build, package installation, or external font service is required. GitHub Pages serves the root of the `main` branch. The site works without JavaScript; JavaScript adds motion, the mobile navigation toggle, and a decorative network illustration.

## Edit

- `index.html`: biography, experience, projects, research, and contact links.
- `styles.css`: responsive layout, typography, and colors.
- `script.js`: navigation, reveals, and decorative illustration.
- `assets/enning-yang.jpg`: user-supplied portrait (`IMG_0268 2.heic`), converted to JPEG with metadata removed.

Content is based on `CV_Enning_Yang_2026.pdf` (October 2026). Publication and project links were checked against their official pages. The full CV and private phone number are not included in this public repository. Project descriptions describe Enning's contributions; the decorative network is not scientific data or a product screenshot.

## Design

- Visual thesis: a warm editorial portfolio with generous typography, a real portrait, and a restrained forest-green palette.
- Content: portrait and introduction → selected work → background → research → contact.
- Interaction: staggered hero entrance, sections revealed on scroll, subtle link/arrow motion; respect reduced-motion preferences.

## Maintenance

Update dates, roles, publication links, and project descriptions in `index.html` as needed. Keep `sitemap.xml` and social metadata current. Before publishing, check the site at desktop and mobile widths and verify links. Do not add personal documents, credentials, or private project material.
