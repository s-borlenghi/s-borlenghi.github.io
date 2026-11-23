# Salvatore Borlenghi · Personal website

Personal website and portfolio of **Salvatore Borlenghi**, IT Project Analyst with a Software Developer background: requirements and process analysis, Python, Data Science and AI.

**Live:** https://s-borlenghi.github.io/ (redirects to your language) · [Italiano](https://s-borlenghi.github.io/it/) · [English](https://s-borlenghi.github.io/en/)

## About me

IT Project Analyst with a Software Developer background, built within an international group. I analyze IT requirements and processes and act as the link between business needs and technical teams. My strength lies in working with data, which I have extended to Artificial Intelligence through Computer Vision automation and AI assistants for data analysis.

**Stack:** Python · SQL · Pandas · PyTorch · FastAPI · Node.js · React · Docker · Git

## Highlights of the site

- **Live neural network demo.** A small MLP (2 → 16 → 16 → 1) trains in real time in the browser and draws its decision boundary on three datasets: circles, XOR and spiral. Forward pass, backpropagation and the Adam optimizer are implemented in plain JavaScript, with no ML libraries.
- **Skills showcase.** Three tabs in the hero: the live neural network (AI), a FastAPI example with a simulated `POST /predict` answered by the in-browser model (API), and a Pandas example with a button that analyzes the model's real predictions: confusion matrix, accuracy and errors (Data).
- **Principles.** Three quotes from computing and statistics pioneers (Brooks 1986, Tukey 1977, Turing 1950), one per area of work: analysis, data and AI.
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
│   ├── js/showcase.js    # AI / API / Data tabs
│   ├── fonts/            # IBM Plex Sans, Source Serif 4 (SIL Open Font License)
│   └── img/              # Profile photo and favicon
└── .nojekyll             # Serve files as-is, skipping Jekyll
```

## Contact

- Email: salvo.borlenghi@gmail.com
- LinkedIn: [Salvatore Borlenghi](https://www.linkedin.com/in/salvatore-borlenghi)

## Credits

- Icons: Material Symbols by Google (Apache License 2.0); LinkedIn and GitHub icons from @mui/icons-material (MIT)
- Fonts: IBM Plex Sans and Source Serif 4 (SIL Open Font License 1.1)
- Layout inspired by mui.com; geometry and serif headings inspired by the Claude app

## License

© 2026 Salvatore Borlenghi. All rights reserved.

The code, text and images in this repository may not be copied, modified or reused without my written permission.
