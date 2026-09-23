/*
 * Vetrina delle competenze nella card di apertura: tre schede.
 *  AI  – la rete neurale che si addestra (nn-demo.js)
 *  API – esempio FastAPI e una richiesta POST /predict simulata, la cui risposta
 *        è calcolata dalla rete che si sta addestrando nel browser
 *  QA  – esempio Playwright e un pulsante che esegue controlli reali su questa pagina
 * Usa la variabile globale `lang` definita in i18n.js.
 */
(function () {
  const T = {
    it: { waiting: "in attesa", passed: "superati", failed: "falliti", running: "Esecuzione dei test…",
          range: "Il valore deve essere compreso tra -1 e 1", number: "Il valore deve essere un numero" },
    en: { waiting: "waiting", passed: "passed", failed: "failed", running: "Running tests…",
          range: "Input should be between -1 and 1", number: "Input should be a valid number" }
  }[lang === "en" ? "en" : "it"];

  /* ---------- Schede accessibili (frecce, Home, Fine) ---------- */
  const tabs = [...document.querySelectorAll('.showcase [role="tab"]')];
  const panels = tabs.map(t => document.getElementById(t.getAttribute("aria-controls")));
  function select(i, focus) {
    tabs.forEach((t, k) => {
      const on = k === i;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      panels[k].hidden = !on;
    });
    if (focus) tabs[i].focus();
    if (i === 0 && window.nnApi) window.nnApi.resize();
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(i, false));
    t.addEventListener("keydown", e => {
      const n = tabs.length;
      const k = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
      if (k !== undefined) { e.preventDefault(); select(k, true); }
    });
  });

  /* ---------- API: POST /predict ---------- */
  const out = document.getElementById("api-resp");
  const ix = document.getElementById("api-x"), iy = document.getElementById("api-y");
  const esc = s => String(s).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  // JSON con colori, come in un client API
  function pretty(obj) {
    return esc(JSON.stringify(obj, null, 2))
      .replace(/("[^"]+")(:)/g, '<span class="k">$1</span>$2')
      .replace(/: ("[^"]*")/g, ': <span class="s">$1</span>')
      .replace(/: (-?\d+(\.\d+)?)/g, ': <span class="n">$1</span>');
  }
  function validate(name, raw) {
    const v = raw.trim() === "" ? NaN : Number(raw.replace(",", "."));
    if (Number.isNaN(v)) return { type: "float_parsing", loc: ["body", name], msg: T.number, input: raw };
    if (v < -1) return { type: "greater_than_equal", loc: ["body", name], msg: T.range, input: v };
    if (v > 1) return { type: "less_than_equal", loc: ["body", name], msg: T.range, input: v };
    return null;
  }
  function send() {
    if (!out || !window.nnApi) return;
    const errors = [validate("x", ix.value), validate("y", iy.value)].filter(Boolean);
    const t0 = performance.now();
    if (errors.length) {
      out.innerHTML = '<span class="st err">HTTP/1.1 422 Unprocessable Entity</span>\n' + pretty({ detail: errors });
      return;
    }
    const x = Number(ix.value.replace(",", ".")), y = Number(iy.value.replace(",", "."));
    window.nnApi.ensureTraining();
    const p = window.nnApi.predict(x, y), st = window.nnApi.stats();
    const ms = Math.max(performance.now() - t0, 0.01).toFixed(2);
    out.innerHTML = `<span class="st ok">HTTP/1.1 200 OK</span> <span class="c">· ${ms} ms</span>\n` +
      pretty({ class: p > 0.5 ? 1 : 0, probability: Math.round(p * 1000) / 1000, model: { dataset: st.dataset, epoch: st.epoch } });
  }
  const sendBtn = document.getElementById("api-send");
  if (sendBtn) sendBtn.addEventListener("click", send);
  [ix, iy].forEach(el => el && el.addEventListener("keydown", e => { if (e.key === "Enter") send(); }));
  const rnd = document.getElementById("api-random");
  if (rnd) rnd.addEventListener("click", () => {
    ix.value = (Math.round((Math.random() * 2 - 1) * 10) / 10).toFixed(1);
    iy.value = (Math.round((Math.random() * 2 - 1) * 10) / 10).toFixed(1);
    send();
  });

  /* ---------- QA: controlli reali su questa pagina ---------- */
  const otherLang = lang === "en" ? "it" : "en";
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const CHECKS = {
    h1: () => document.querySelectorAll("h1").length === 1,
    alt: () => [...document.images].every(img => (img.getAttribute("alt") || "").trim().length > 0),
    mail: () => !!document.querySelector('.hero a.btn.contained[href^="mailto:"]'),
    profiles: () => !!document.querySelector('a[href*="linkedin.com/in/"]') && !!document.querySelector('a[href*="github.com/"]'),
    hreflang: () => !!document.querySelector(`link[rel="alternate"][hreflang="${otherLang}"]`),
    ld: () => [...document.querySelectorAll('script[type="application/ld+json"]')].every(s => { JSON.parse(s.textContent); return true; }),
    names: () => [...document.querySelectorAll("button")].every(b => (b.textContent.trim() || b.getAttribute("aria-label") || "").length > 0),
    // come l'auto-attesa di Playwright: riprova fino a 20 secondi
    model: async () => {
      if (!window.nnApi) return false;
      window.nnApi.ensureTraining();
      const end = performance.now() + 20000;
      while (performance.now() < end) {
        const a = window.nnApi.stats().acc;
        if (a !== null && a >= 0.9) return true;
        if (window.nnApi.stats().done) return (window.nnApi.stats().acc || 0) >= 0.9;
        await sleep(200);
      }
      return false;
    }
  };
  const runBtn = document.getElementById("qa-run");
  const summary = document.getElementById("qa-summary");
  const items = [...document.querySelectorAll("#qa-list li")];
  async function runAll() {
    runBtn.disabled = true;
    summary.textContent = T.running;
    items.forEach(li => { li.className = ""; li.querySelector(".qa-ico").textContent = "·"; li.querySelector(".qa-time").textContent = ""; });
    let ok = 0, ko = 0, total = 0;
    for (const li of items) {
      li.className = "running"; li.querySelector(".qa-ico").textContent = "◌";
      const t = performance.now();
      let pass = false;
      try { pass = await CHECKS[li.dataset.test](); } catch (e) { pass = false; }
      const ms = performance.now() - t; // tempo reale del controllo
      total += ms;
      await sleep(120); // pausa solo per rendere leggibile la sequenza, esclusa dal tempo
      li.className = pass ? "pass" : "fail";
      li.querySelector(".qa-ico").textContent = pass ? "✓" : "✕";
      li.querySelector(".qa-time").textContent = `(${ms < 1 ? "<1" : Math.round(ms)} ms)`;
      pass ? ok++ : ko++;
    }
    const secs = total < 1000 ? `${Math.max(1, Math.round(total))} ms` : `${(total / 1000).toFixed(1)} s`;
    summary.innerHTML = `<span class="p">${ok} ${T.passed}</span>` + (ko ? ` · <span class="f">${ko} ${T.failed}</span>` : "") + ` (${secs})`;
    runBtn.disabled = false;
  }
  if (runBtn) runBtn.addEventListener("click", runAll);
})();
