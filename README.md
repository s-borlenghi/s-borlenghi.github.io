# Salvatore Borlenghi · Personal website

Personal website of **Salvatore Borlenghi**, IT Project Analyst with a Software Developer background: requirements and process analysis, Python, Data Science and AI.

**Live:** https://s-borlenghi.github.io/ (redirects to your language) · [Italiano](https://s-borlenghi.github.io/it/) · [English](https://s-borlenghi.github.io/en/)

## About me

IT Project Analyst with a Software Developer background, built within an international group. I analyze IT requirements and processes and act as the link between business needs and technical teams, also working directly with clients.

My strength lies in working with data: database extractions and checks, analyses to support decision-making, and prototypes to validate solutions with stakeholders. Through Python and Data Science I have extended this approach to Artificial Intelligence, in automation projects based on Computer Vision and in operational data analysis through AI assistants, always with locally hosted models to protect data confidentiality.

**Core skills:** Requirements & Process Analysis · Client & Stakeholder Relations · Data Analysis & SQL · API Integrations · Python & Data Science · Artificial Intelligence

**Stack:** Python · SQL · Pandas · PyTorch · FastAPI · Node.js · React · JavaScript · Docker · Git

## Page sections

About · Experience · Skills · Technologies · Education · Principles · Contact

## Interactive showcase

Four tabs at the top of the page, all running in the browser with no server and no data sent anywhere:

- **AI.** A small neural network (2 → 16 → 16 → 1) trains live and draws its decision boundary on three datasets: circles, XOR and spiral. Forward pass, backpropagation and the Adam optimizer are written in plain JavaScript, with no ML libraries.
- **API.** A FastAPI example with a simulated `POST /predict`, answered by the network training in the browser, including validation errors for out-of-range input.
- **Data.** A Pandas example with a button that analyzes the model's real predictions: confusion matrix, accuracy and errors.
- **Requirements.** An editable user story ("As a… I want to… so that…") with a MoSCoW priority, checked live against a Definition of Ready: role, specific goal, explicit business benefit, no vague terms such as "fast" or "simple", priority assigned.

## Technical highlights

- **No framework, no build step.** Plain HTML, CSS and JavaScript, served as-is by GitHub Pages.
- **Italian / English.** The root page sends each visitor to `/it/` or `/en/` based on their saved choice or browser language. Both versions are static pages linked with `hreflang`, so search engines index both.
- **Design.** Layout inspired by mui.com (white background, alternating tinted sections), rounded geometry and serif headings inspired by the Claude app, and an own palette: deep navy with a soft green accent. Self-hosted IBM Plex Sans and Source Serif 4, Material icons as inline SVG.
- **Light and dark theme.** Light by default; the theme switch remembers the visitor's choice.
- **Accessible.** Skip link, keyboard navigation, screen reader labels and live status messages, large touch targets, high contrast mode, `prefers-reduced-motion`. Checked with axe-core in both languages and both themes.
- **Valid markup.** HTML checked with the W3C Nu validator.
- **Responsive.** From 320 px phones to wide desktops.
- **Privacy friendly.** No cookies, no trackers, no third-party requests: fonts and icons are served from the site itself. A bilingual privacy page explains it.
- **SEO and social.** Meta tags, canonical and `hreflang` links, sitemap, schema.org `Person` structured data, 1200×630 Open Graph image, app icons and web manifest.
- **Cache-busting.** CSS and JavaScript are linked with a version parameter, so visitors always get the latest files after an update.

## Structure

```
.
├── index.html            # Language redirect (x-default)
├── it/index.html         # Italian page
├── en/index.html         # English page
├── it/privacy/, en/privacy/  # Privacy note
├── 404.html              # Bilingual "page not found"
├── sitemap.xml           # All pages with language alternates
├── robots.txt            # Points search engines to the sitemap
├── site.webmanifest      # App name and icons
├── .nojekyll             # Serve files as-is, skipping Jekyll
└── assets/
    ├── css/style.css     # Styles and light / dark theme
    ├── js/theme.js       # Dark / light theme switch
    ├── js/i18n.js        # Language switch and saved preference
    ├── js/nn-demo.js     # Neural network demo
    ├── js/showcase.js    # AI / API / Data / Requirements tabs
    ├── fonts/            # IBM Plex Sans, Source Serif 4 (SIL Open Font License)
    └── img/              # Profile photo, icons and social preview image
```

## Contact

- Email: salvo.borlenghi@gmail.com
- LinkedIn: [Salvatore Borlenghi](https://www.linkedin.com/in/salvatore-borlenghi)
- GitHub: [s-borlenghi](https://github.com/s-borlenghi)

## Credits

- Icons: Material Symbols by Google (Apache License 2.0); LinkedIn and GitHub icons from @mui/icons-material (MIT)
- Fonts: IBM Plex Sans and Source Serif 4 (SIL Open Font License 1.1)
- Layout inspired by mui.com; geometry and serif headings inspired by the Claude app

## License

© 2026 Salvatore Borlenghi. All rights reserved.

The code, text and images in this repository may not be copied, modified or reused without my written permission.
