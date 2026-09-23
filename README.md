# Salvatore Borlenghi · Personal website

Personal website and portfolio of **Salvatore Borlenghi**, Senior Software Developer: AI / Deep Learning (PyTorch), Full Stack and Technical QA.

**Live:** https://s-borlenghi.github.io/ (redirects to your language) · [Italiano](https://s-borlenghi.github.io/it/) · [English](https://s-borlenghi.github.io/en/)

## About me

I build deep learning models and bring them into real applications. Five years of experience at Giunti Psychometrics, working across the whole lifecycle of AI-based products: training neural networks in PyTorch, building the full stack software around them (FastAPI, Node.js, React, Next.js) and making sure everything is tested and reliable (Playwright, Postman).

## Highlights of the site

- **Live neural network demo.** A small MLP (2 → 16 → 16 → 1) trains in real time in the browser and draws its decision boundary on three datasets: circles, XOR and spiral. Forward pass, backpropagation and the Adam optimizer are implemented in plain JavaScript, with no ML libraries.
- **Skills showcase.** Three tabs in the hero: the live neural network (AI), a FastAPI example with a simulated `POST /predict` answered by the in-browser model (API), and a Playwright example with a button that runs real checks on the page (QA).
- **Principles.** Three verified quotes from computing pioneers (Turing 1950, Dijkstra 1970, Fowler 1999), one per area of work.
- **Italian / English.** The root page sends each visitor to `/it/` or `/en/` based on their saved choice or browser language. Both versions are static pages linked with `hreflang`, so search engines index both.
- **No framework, no build step.** Plain HTML, CSS and JavaScript, served as-is by GitHub Pages.
- **Design.** Layout inspired by mui.com (white background, alternating tinted sections), rounded geometry and serif headings inspired by the Claude app, and an own palette: deep navy with a soft green accent. Light theme by default, dark theme on request. Self-hosted IBM Plex Sans and Source Serif 4, Material icons as inline SVG.
- **Accessible.** Skip link, keyboard focus, screen reader labels and status messages, large touch targets, high contrast mode, `prefers-reduced-motion`. Checked with axe-core.
- **Light and dark theme.** The theme switch remembers the visitor's choice.
- **Responsive.** From 320 px phones to wide desktops.
- **Social preview.** 1200×630 Open Graph image, app icons and web manifest.
- **Privacy page.** Bilingual note: no cookies, no tracking, preferences kept only in the browser, GitHub Pages hosting.
- **Privacy friendly.** No cookies, no trackers, no third-party requests: fonts and icons are served from the site itself.
- **SEO ready.** Meta tags, canonical and `hreflang` links, sitemap, Open Graph cards and schema.org `Person` structured data.

## Structure

```
.
├── index.html            # Language redirect (x-default)
├── it/index.html         # Italian page
├── en/index.html         # English page
├── it/privacy/, en/privacy/  # Privacy note
├── sitemap.xml           # All pages with language alternates
├── robots.txt            # Points search engines to the sitemap
├── 404.html              # Bilingual "page not found"
├── site.webmanifest      # App name and icons
├── assets/
│   ├── css/style.css     # Styles and light / dark theme
│   ├── js/theme.js       # Dark / light theme switch
│   ├── js/i18n.js        # Language switch and saved preference
│   ├── js/nn-demo.js     # Neural network demo
│   ├── js/showcase.js    # AI / API / QA tabs
│   ├── fonts/            # IBM Plex Sans, Source Serif 4 (SIL Open Font License)
│   └── img/              # Profile photo and favicon
└── .nojekyll             # Serve files as-is, skipping Jekyll
```

## Contact

- Email: salvo.borlenghi@gmail.com
- LinkedIn: [salvatore-borlenghi](https://www.linkedin.com/in/salvatore-borlenghi)

## Credits

- Icons: Material Symbols by Google (Apache License 2.0); LinkedIn and GitHub icons from @mui/icons-material (MIT)
- Fonts: IBM Plex Sans and Source Serif 4 (SIL Open Font License 1.1)
- Layout inspired by mui.com; geometry and serif headings inspired by the Claude app

## License

© 2026 Salvatore Borlenghi. All rights reserved.

The code, text and images in this repository may not be copied, modified or reused without my written permission.
