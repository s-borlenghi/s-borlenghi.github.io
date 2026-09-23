/*
 * Tema chiaro (predefinito) o scuro.
 * La scelta del visitatore viene salvata e riapplicata prima del disegno della pagina
 * dallo script in <head>; qui si gestisce solo il pulsante nella barra superiore.
 */
(function () {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  const root = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  const current = () => root.getAttribute("data-theme") === "dark" ? "dark" : "light";

  function sync() {
    const t = current();
    const label = t === "dark" ? btn.dataset.labelLight : btn.dataset.labelDark;
    btn.setAttribute("aria-label", label);
    btn.title = label;
    if (meta) meta.setAttribute("content", t === "dark" ? "#141311" : "#ffffff");
  }

  btn.addEventListener("click", () => {
    const next = current() === "dark" ? "light" : "dark";
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.add("theme-anim");
      setTimeout(() => root.classList.remove("theme-anim"), 350);
    }
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    sync();
    if (window.nnRedraw) window.nnRedraw();
  });
  sync();
})();

/* Effetto ripple al clic, come i componenti MUI. Disattivato con "riduci movimento". */
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.addEventListener("pointerdown", e => {
    const el = e.target.closest(".btn, .text-btn, .icon-btn, .theme-btn, .fab, .segmented > *");
    if (!el) return;
    const r = el.getBoundingClientRect(), size = Math.hypot(r.width, r.height) * 2;
    const span = document.createElement("span");
    span.className = "ripple";
    span.style.width = span.style.height = size + "px";
    span.style.left = (e.clientX - r.left - size / 2) + "px";
    span.style.top = (e.clientY - r.top - size / 2) + "px";
    el.appendChild(span);
    span.addEventListener("animationend", () => span.remove());
  });
})();

/* Pulsante "torna in cima": compare dopo aver scorso di circa un'altezza di schermo.
   Senza JavaScript resta visibile e funziona comunque, perché è un normale link a #top. */
(function () {
  const fab = document.getElementById("to-top");
  if (!fab) return;
  const update = () => fab.classList.toggle("is-hidden", window.scrollY < window.innerHeight * 0.8);
  update();
  window.addEventListener("scroll", update, { passive: true });
  fab.addEventListener("click", e => {
    e.preventDefault();
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
    // porta il focus in cima, così chi usa la tastiera riparte dall'inizio della pagina
    const brand = document.querySelector(".brand");
    if (brand) brand.focus({ preventScroll: true });
    history.replaceState(null, "", location.pathname + location.search);
  });
})();

/* Menu scorrevole su telefono: sfuma i lati quando ci sono altre voci */
(function () {
  const menu = document.querySelector(".menu");
  if (!menu) return;
  const update = () => {
    const max = menu.scrollWidth - menu.clientWidth;
    menu.classList.toggle("more-left", menu.scrollLeft > 4);
    menu.classList.toggle("more-right", max > 4 && menu.scrollLeft < max - 4);
  };
  update();
  menu.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  // la voce che riceve il focus da tastiera viene portata in vista
  menu.addEventListener("focusin", e => e.target.scrollIntoView({ block: "nearest", inline: "nearest" }));
})();
