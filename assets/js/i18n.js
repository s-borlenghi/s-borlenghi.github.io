/*
 * Lingua IT / EN nelle pagine di contenuto.
 * Il sito ha due pagine statiche, entrambe indicizzate da Google:
 *   /it/  italiano
 *   /en/  inglese
 * La pagina principale (/index.html) sceglie la lingua all'arrivo del visitatore.
 * Qui si memorizza la scelta fatta con il selettore in alto e la si rispetta
 * se il visitatore entra direttamente da una pagina nell'altra lingua.
 */

const lang = document.documentElement.lang === "en" ? "en" : "it";

// Testi dei pulsanti della demo, usati da nn-demo.js
const UI = {
  it: { start: "Avvia", pause: "Pausa", again: "Riaddestra", done: "Addestramento completato, accuratezza" },
  en: { start: "Start", pause: "Pause", again: "Train again", done: "Training complete, accuracy" }
};

(function () {
  const links = document.querySelectorAll(".lang a[hreflang]");
  links.forEach(a => a.addEventListener("click", () => {
    try { localStorage.setItem("lang", a.getAttribute("hreflang")); } catch (e) {}
  }));

  const fromUrl = new URLSearchParams(location.search).get("lang");
  let saved = null;
  try { saved = localStorage.getItem("lang"); } catch (e) {}
  const wanted = fromUrl || saved;
  if (wanted && wanted !== lang) {
    const target = document.querySelector('.lang a[hreflang="' + wanted + '"]');
    if (target) location.replace(target.href + location.hash);
  }
})();
