/*
 * Tema scuro (predefinito) o chiaro.
 * La scelta del visitatore viene salvata e riapplicata prima del disegno della pagina
 * dallo script in <head>; qui si gestisce solo il pulsante nella barra superiore.
 */
(function () {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  const root = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  const current = () => root.getAttribute("data-theme") === "light" ? "light" : "dark";

  function sync() {
    const t = current();
    const label = t === "dark" ? btn.dataset.labelLight : btn.dataset.labelDark;
    btn.setAttribute("aria-label", label);
    btn.title = label;
    if (meta) meta.setAttribute("content", t === "dark" ? "#0a1929" : "#1976d2");
  }

  btn.addEventListener("click", () => {
    const next = current() === "dark" ? "light" : "dark";
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
    const el = e.target.closest(".btn, .text-btn, .icon-btn, .segmented > *");
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
