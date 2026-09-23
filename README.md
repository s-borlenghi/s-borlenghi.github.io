# Salvatore Borlenghi · Personal website

Personal website and portfolio of **Salvatore Borlenghi**, Software Engineer working on AI / Deep Learning (PyTorch), full stack development and software quality.

**Live:** https://s-borlenghi.github.io/sborlenghi/ (redirects to your language) · [Italiano](https://s-borlenghi.github.io/sborlenghi/it/) · [English](https://s-borlenghi.github.io/sborlenghi/en/)

## About me

I build deep learning models and bring them into real applications. Five years of experience at Giunti Psychometrics, working across the whole lifecycle of AI-based products: training neural networks in PyTorch, building the full stack software around them (FastAPI, Node.js, React, Next.js) and making sure everything is tested and reliable (Playwright, Postman).

## Highlights of the site

- **Live neural network demo.** A small MLP (2 → 16 → 16 → 1) trains in real time in the browser and draws its decision boundary on three datasets: circles, XOR and spiral. Forward pass, backpropagation and the Adam optimizer are written from scratch in plain JavaScript, with no ML libraries.
- **Italian / English.** The root page sends each visitor to `/it/` or `/en/` based on their saved choice or browser language. Both versions are static pages linked with `hreflang`, so search engines index both.
- **No framework, no build step.** Plain HTML, CSS and JavaScript, served as-is by GitHub Pages.
- **Responsive, light and dark theme, accessible.** Respects `prefers-color-scheme` and `prefers-reduced-motion`.
- **SEO ready.** Meta tags, canonical and `hreflang` links, sitemap, Open Graph cards and schema.org `Person` structured data.

## Structure

```
.
├── index.html            # Language redirect (x-default)
├── it/index.html         # Italian page
├── en/index.html         # English page
├── sitemap.xml           # All pages with language alternates
├── assets/
│   ├── css/style.css     # Styles and light / dark theme
│   ├── js/i18n.js        # Language switch and saved preference
│   ├── js/nn-demo.js     # Neural network demo
│   └── img/foto.jpg      # Profile photo
└── .nojekyll             # Serve files as-is, skipping Jekyll
```

## Contact

- Email: salvo.borlenghi@gmail.com
- LinkedIn: [salvatoreborlenghi](https://www.linkedin.com/in/salvatoreborlenghi)
- Kaggle: [salvatoreborlenghi](https://www.kaggle.com/salvatoreborlenghi)

## License

© 2026 Salvatore Borlenghi. All rights reserved.

The code, text and images in this repository may not be copied, modified or reused without my written permission.
